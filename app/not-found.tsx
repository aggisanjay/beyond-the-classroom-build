import Link from "next/link"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"

export default function NotFoundPage() {
  return (
    <>
      <SiteHeader />
      <main className="not-found-page" id="main-content">
        <p className="eyebrow"><span className="eyebrow__line" /> PAGE NOT FOUND</p>
        <h1>This journey<br />isn&apos;t on the map.</h1>
        <p>The page may have moved, or the destination link may be out of date.</p>
        <Link className="button button--red" href="/">Return to the homepage</Link>
      </main>
      <SiteFooter />
    </>
  )
}
