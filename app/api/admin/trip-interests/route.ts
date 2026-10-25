import { NextResponse } from "next/server"
import { getAdminAccess } from "@/lib/admin/access"
import {
  ADMIN_EXPORT_LIMIT,
  ADMIN_PAGE_SIZE,
  getAdminDashboardData,
  getAdminExportData,
  type AdminSortColumn,
  type AdminSortDirection,
} from "@/lib/admin/data"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { isTripSlug, type TripSlug } from "@/lib/trips/data"

export const dynamic = "force-dynamic"

const NO_STORE = { "Cache-Control": "no-store" }
const SORT_COLUMNS: AdminSortColumn[] = [
  "teacher_name",
  "school_name",
  "email",
  "trip_slug",
  "student_count",
  "created_at",
]

function parseFilters(searchParams: URLSearchParams) {
  const requestedTrip = searchParams.get("trip") ?? ""
  if (requestedTrip && !isTripSlug(requestedTrip)) return null

  const requestedSort = searchParams.get("sort") as AdminSortColumn | null
  const sortBy = requestedSort && SORT_COLUMNS.includes(requestedSort) ? requestedSort : "created_at"
  const direction = searchParams.get("direction")
  const sortDirection: AdminSortDirection = direction === "asc" ? "asc" : "desc"
  const pageValue = Number(searchParams.get("page") ?? 1)
  if (!Number.isSafeInteger(pageValue) || pageValue < 1 || pageValue > 100_000) return null

  return {
    page: pageValue,
    pageSize: ADMIN_PAGE_SIZE,
    tripSlug: requestedTrip ? (requestedTrip as TripSlug) : undefined,
    search: searchParams.get("search") ?? "",
    sortBy,
    sortDirection,
  }
}

function csvCell(value: string | number) {
  let safe = String(value)
  if (/^\s*[=+\-@]/.test(safe)) safe = `'${safe}`
  return `"${safe.replaceAll('"', '""')}"`
}

export async function GET(request: Request) {
  let access
  try {
    access = await getAdminAccess()
  } catch {
    return NextResponse.json({ message: "Could not verify administrator access." }, { status: 401, headers: NO_STORE })
  }

  if (!access.user) {
    return NextResponse.json({ message: "Administrator sign-in is required." }, { status: 401, headers: NO_STORE })
  }
  if (!access.isAdmin) {
    return NextResponse.json({ message: "Administrator access is not enabled for this account." }, { status: 403, headers: NO_STORE })
  }

  const url = new URL(request.url)
  const filters = parseFilters(url.searchParams)
  if (!filters) {
    return NextResponse.json({ message: "One or more filters are invalid." }, { status: 400, headers: NO_STORE })
  }

  try {
    const adminClient = createSupabaseAdminClient()

    if (url.searchParams.get("format") === "csv") {
      const exported = await getAdminExportData(adminClient, filters)
      if (exported.count > ADMIN_EXPORT_LIMIT) {
        return NextResponse.json(
          { message: `CSV export is limited to ${ADMIN_EXPORT_LIMIT.toLocaleString()} enquiries. Add a destination or search filter and try again.` },
          { status: 413, headers: NO_STORE }
        )
      }

      const columns = ["Teacher", "School", "Email", "Phone", "Trip", "Students", "Submitted"]
      const rows = exported.items.map((item) => [
        item.teacher_name,
        item.school_name,
        item.email,
        item.phone,
        item.trip_slug,
        item.student_count,
        item.created_at,
      ])
      const csv = [columns, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n")
      return new Response(`\uFEFF${csv}`, {
        headers: {
          ...NO_STORE,
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": 'attachment; filename="beyond-the-classroom-enquiries.csv"',
        },
      })
    }

    const data = await getAdminDashboardData(adminClient, filters)
    return NextResponse.json(data, { headers: NO_STORE })
  } catch {
    return NextResponse.json({ message: "Could not load enquiry data. Please refresh and try again." }, { status: 503, headers: NO_STORE })
  }
}
