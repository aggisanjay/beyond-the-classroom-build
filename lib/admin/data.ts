import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"
import { destinations, isTripSlug, type TripSlug } from "@/lib/trips/data"

export const ADMIN_PAGE_SIZE = 8
export const ADMIN_EXPORT_LIMIT = 50_000

export type AdminSortColumn = "teacher_name" | "school_name" | "email" | "trip_slug" | "student_count" | "created_at"
export type AdminSortDirection = "asc" | "desc"

export type TripInterestRecord = {
  id: string
  teacher_name: string
  school_name: string
  email: string
  phone: string
  trip_slug: TripSlug
  student_count: number
  created_at: string
}

export type TripAnalytics = {
  tripSlug: TripSlug
  city: string
  title: string
  enquiryCount: number
  studentTotal: number
}

export type AdminDashboardData = {
  items: TripInterestRecord[]
  count: number
  page: number
  pageSize: number
  totalEnquiries: number
  totalStudents: number
  analytics: TripAnalytics[]
}

export type AdminDataFilters = {
  page: number
  pageSize: number
  tripSlug?: TripSlug
  search: string
  sortBy: AdminSortColumn
  sortDirection: AdminSortDirection
}

const RECORD_FIELDS = "id,teacher_name,school_name,email,phone,trip_slug,student_count,created_at"

function safeSearchTerm(value: string) {
  return value
    .trim()
    .slice(0, 100)
    .replace(/[^\p{L}\p{N}@.+ '\-\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function applySearch(query: any, value: string) {
  const term = safeSearchTerm(value)
  if (!term) return query
  const pattern = `"%${term}%"`
  return query.or(
    `teacher_name.ilike.${pattern},school_name.ilike.${pattern},email.ilike.${pattern}`
  )
}

export async function getAdminDashboardData(
  client: SupabaseClient,
  filters: AdminDataFilters
): Promise<AdminDashboardData> {
  const from = (filters.page - 1) * filters.pageSize
  let rowsQuery = client
    .from("trip_interests")
    .select(RECORD_FIELDS, { count: "exact" })

  if (filters.tripSlug && isTripSlug(filters.tripSlug)) {
    rowsQuery = rowsQuery.eq("trip_slug", filters.tripSlug)
  }
  rowsQuery = applySearch(rowsQuery, filters.search)

  const [rowsResult, analyticsResult] = await Promise.all([
    rowsQuery
      .order(filters.sortBy, { ascending: filters.sortDirection === "asc" })
      .range(from, from + filters.pageSize - 1),
    client.rpc("get_trip_interest_analytics"),
  ])

  if (rowsResult.error || analyticsResult.error) {
    throw new Error("Could not load authorized trip enquiry data.")
  }

  const rawAnalytics = (analyticsResult.data ?? []) as Array<{
    trip_slug: string
    enquiry_count: number | string
    student_total: number | string
  }>
  const bySlug = new Map(rawAnalytics.map((row) => [row.trip_slug, row]))
  const analytics = destinations.map((trip) => {
    const row = bySlug.get(trip.slug)
    return {
      tripSlug: trip.slug,
      city: trip.city,
      title: trip.title,
      enquiryCount: Number(row?.enquiry_count ?? 0),
      studentTotal: Number(row?.student_total ?? 0),
    }
  })

  return {
    items: (rowsResult.data ?? []) as TripInterestRecord[],
    count: rowsResult.count ?? 0,
    page: filters.page,
    pageSize: filters.pageSize,
    totalEnquiries: analytics.reduce((total, trip) => total + trip.enquiryCount, 0),
    totalStudents: analytics.reduce((total, trip) => total + trip.studentTotal, 0),
    analytics,
  }
}

export async function getAdminExportData(
  client: SupabaseClient,
  filters: Pick<AdminDataFilters, "tripSlug" | "search" | "sortBy" | "sortDirection">
) {
  let query = client.from("trip_interests").select(RECORD_FIELDS, { count: "exact" })
  if (filters.tripSlug && isTripSlug(filters.tripSlug)) {
    query = query.eq("trip_slug", filters.tripSlug)
  }
  query = applySearch(query, filters.search)

  const { data, count, error } = await query
    .order(filters.sortBy, { ascending: filters.sortDirection === "asc" })
    .range(0, ADMIN_EXPORT_LIMIT - 1)

  if (error) throw new Error("Could not export authorized trip enquiry data.")
  return {
    items: (data ?? []) as TripInterestRecord[],
    count: count ?? 0,
  }
}
