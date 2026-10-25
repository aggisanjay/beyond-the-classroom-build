import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"

export const metadata: Metadata = {
  title: "Privacy notice",
  description: "How Beyond the Classroom handles details submitted through a school trip enquiry.",
}

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="privacy-page" id="main-content">
        <div className="section-shell privacy-page__content">
          <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Privacy notice</span></nav>
          <p className="eyebrow"><span className="eyebrow__line" /> YOUR INFORMATION</p>
          <h1>A clear note<br />on privacy.</h1>
          <p className="privacy-lede">The details submitted through the school interest form are used to respond to that enquiry.</p>
          <div className="privacy-copy">
            <h2>Information collected</h2>
            <p>The form asks for a teacher name, school name, email address, phone number, trip of interest and an approximate student count. Please do not submit sensitive student information.</p>
            <h2>How details are used</h2>
            <p>Submitted details are stored in the connected Supabase database so an authorized administrator can review and respond to the school trip enquiry. This application does not use the form to confirm a reservation.</p>
            <h2>Access and security</h2>
            <p>Enquiry records are not publicly readable. Administrator access is checked on the server against a configured email allowlist, and database row-level security is enabled.</p>
            <h2>Retention and questions</h2>
            <p>Records remain in the connected database until an authorized administrator removes them under the organization&apos;s retention practices. This page does not state a retention period or provide a contact address because none was supplied for this project.</p>
            <p>For a trip enquiry, use the <Link href="/register">school interest form</Link>.</p>
          </div>
          <Link className="text-link" href="/"><ArrowLeft size={16} /> Back to the homepage</Link>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
