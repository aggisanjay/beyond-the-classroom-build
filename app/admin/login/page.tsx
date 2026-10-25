import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { BrandMark } from "@/components/site/brand"
import { AdminLoginForm } from "@/components/admin/admin-login-form"
import { getAdminAccess } from "@/lib/admin/access"

export const metadata: Metadata = { title: "Administrator sign in", robots: { index: false, follow: false } }

type AdminLoginPageProps = { searchParams: Promise<{ error?: string; message?: string }> }

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const [{ error, message }, access] = await Promise.all([searchParams, getAdminAccess()])
  if (access.user && access.isAdmin) redirect("/admin")

  const initialMessage = message === "password-updated"
    ? "Your password was updated. Sign in with the new password."
    : error === "unauthorized"
      ? "This account is not on the administrator allowlist."
      : error === "auth"
        ? "That sign-in or recovery link could not be verified. Request a fresh link and try again."
        : undefined

  return (
    <main className="admin-auth-page" id="main-content">
      <div className="admin-auth-backdrop" aria-hidden="true" />
      <div className="admin-auth-nav"><BrandMark /><Link href="/">Return to the public site</Link></div>
      <div className="admin-auth-layout">
        <div className="admin-auth-editorial">
          <span className="admin-auth-editorial__index">BEYOND THE CLASSROOM / 01</span>
          <p>LEARNING HAS NO BORDERS</p>
          <span>Secure workspace for authorized school trip administrators.</span>
        </div>
        <AdminLoginForm initialMessage={initialMessage} />
      </div>
      <div className="admin-auth-bottom"><span>Private administrator access</span><span>Supabase Auth · Email and password</span></div>
    </main>
  )
}
