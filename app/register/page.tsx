import type { Metadata } from "next"
import Link from "next/link"
import { RegistrationForm } from "@/components/forms/registration-form"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { getTripBySlug } from "@/lib/trips/data"

export const metadata: Metadata = {
  title: "Register school interest",
  description: "Tell us about your school and the educational journey you have in mind.",
}

type RegisterPageProps = {
  searchParams: Promise<{ trip?: string }>
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams
  const initialTrip = params.trip ? getTripBySlug(params.trip)?.slug : undefined

  return (
    <>
      <SiteHeader />
      <main className="register-page">
        <section className="register-intro">
          <div className="section-shell">
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Register interest</span>
            </nav>
            <p className="eyebrow"><span className="eyebrow__line" /> A FIRST CONVERSATION</p>
            <h1>Start with<br />a little curiosity.</h1>
            <p>Share a few details about your school and we&apos;ll have a clearer place to begin the conversation.</p>
          </div>
        </section>
        <section className="register-form-section" aria-labelledby="registration-title">
          <div className="section-shell register-form-layout">
            <div className="register-aside">
              <span className="register-aside__index">01 / SCHOOL ENQUIRY</span>
              <h2 id="registration-title">Tell us about<br />your journey.</h2>
              <p>This form records an enquiry only. It does not confirm a trip, booking, place or price.</p>
              <div className="register-aside__note">
                <span className="register-aside__dot" />
                <span>Your details will be used to respond to this school trip enquiry.</span>
              </div>
            </div>
            <RegistrationForm initialTrip={initialTrip} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
