import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { getAdminAccess } from "@/lib/admin/access"
import { getAdminDashboardData, ADMIN_PAGE_SIZE } from "@/lib/admin/data"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Enquiry dashboard", robots: { index: false, follow: false } }

export default async function AdminPage() {
  const access = await getAdminAccess()
  if (!access.user) redirect("/admin/login")
  if (!access.isAdmin) redirect("/admin/login?error=unauthorized")

  let initialData = null
  let initialError: string | undefined

  try {
    const adminClient = createSupabaseAdminClient()
    initialData = await getAdminDashboardData(adminClient, {
      page: 1,
      pageSize: ADMIN_PAGE_SIZE,
      search: "",
      sortBy: "created_at",
      sortDirection: "desc",
    })
  } catch {
    initialError = "Could not load enquiry data. The dashboard will retry automatically."
  }

  return <AdminDashboard adminEmail={access.user.email ?? "Authorized administrator"} initialData={initialData} initialError={initialError} />
}
