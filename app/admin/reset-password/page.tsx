import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { BrandMark } from "@/components/site/brand"
import { ResetPasswordForm } from "@/components/admin/reset-password-form"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export const metadata: Metadata = { title: "Reset administrator password", robots: { index: false, follow: false } }

export default async function AdminResetPasswordPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/admin/login?error=auth")

  return (
    <main className="admin-auth-page" id="main-content">
      <div className="admin-auth-backdrop" aria-hidden="true" />
      <div className="admin-auth-nav"><BrandMark /><Link href="/admin/login">Back to sign in</Link></div>
      <div className="admin-auth-layout">
        <div className="admin-auth-editorial">
          <span className="admin-auth-editorial__index">BEYOND THE CLASSROOM / ACCOUNT</span>
          <p>A SECURE WAY<br />BACK IN.</p>
          <span>Password changes are handled by Supabase Auth and are never stored by this application.</span>
        </div>
        <ResetPasswordForm />
      </div>
      <div className="admin-auth-bottom"><span>Account recovery</span><span>Session verified</span></div>
    </main>
  )
}
