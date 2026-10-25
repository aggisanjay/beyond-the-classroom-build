import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { BrandMark } from "@/components/site/brand"

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <div>
          <BrandMark />
          <p>Learning has no borders.</p>
        </div>
        <div className="site-footer__links">
          <div>
            <span className="footer-label">Explore</span>
            <Link href="/#destinations">Destinations</Link>
            <Link href="/register">Register interest</Link>
          </div>
          <div>
            <span className="footer-label">Information</span>
            <Link href="/privacy">Privacy notice</Link>
            <Link href="/admin/login">Admin sign in</Link>
          </div>
        </div>
        <Link className="footer-cta" href="/register">
          Start a conversation <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
      <div className="site-footer__bottom">
        <span>© {new Date().getFullYear()} Beyond the Classroom</span>
        <span>Proposed journeys, thoughtfully imagined.</span>
      </div>
    </footer>
  )
}
