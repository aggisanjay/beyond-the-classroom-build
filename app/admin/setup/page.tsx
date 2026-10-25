import type { Metadata } from "next"
import Link from "next/link"
import { BrandMark } from "@/components/site/brand"
import { AdminSetupForm } from "@/components/admin/admin-setup-form"

export const metadata: Metadata = { title: "Set up administrator access", robots: { index: false, follow: false } }

export default function AdminSetupPage() {
  return (
    <main className="admin-auth-page" id="main-content">
      <div className="admin-auth-backdrop" aria-hidden="true" />
      <div className="admin-auth-nav"><BrandMark /><Link href="/admin/login">Back to sign in</Link></div>
      <div className="admin-auth-layout">
        <div className="admin-auth-editorial">
          <span className="admin-auth-editorial__index">BEYOND THE CLASSROOM / ACCESS</span>
          <p>ONLY THE RIGHT PEOPLE.<br />ONLY THE RIGHT ACCESS.</p>
          <span>Invitation requests are accepted only for addresses already configured on the server.</span>
        </div>
        <AdminSetupForm />
      </div>
      <div className="admin-auth-bottom"><span>Controlled invitation flow</span><span>Authorized email allowlist required</span></div>
    </main>
  )
}
