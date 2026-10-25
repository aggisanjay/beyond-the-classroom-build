"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Lock } from "lucide-react"
import { BrandMark } from "@/components/site/brand"

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  )
}

function YoutubeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
      <polygon points="10 15 15 12 10 9 10 15"/>
    </svg>
  )
}

function LinkedinIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect width="4" height="12" x="2" y="9"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  )
}

function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  )
}

export function SiteFooter() {
  const [subscribed, setSubscribed] = useState(false)
  const [email, setEmail] = useState("")

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail("")
    }
  }

  return (
    <footer className="site-footer">
      <div className="section-shell">
        <div className="site-footer__grid">
          {/* Brand Column */}
          <div className="site-footer__brand-col">
            <BrandMark />
            <p className="site-footer__desc">
              Curated international school trips that bring learning to life through culture, innovation and real-world experiences.
            </p>
            <div className="site-footer__socials" aria-label="Social media links">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-icon-btn">
                <InstagramIcon size={17} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="social-icon-btn">
                <YoutubeIcon size={17} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-icon-btn">
                <LinkedinIcon size={17} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-icon-btn">
                <FacebookIcon size={17} />
              </a>
            </div>
          </div>

          {/* Destinations */}
          <div className="site-footer__links-col">
            <span className="footer-col-title">DESTINATIONS</span>
            <Link href="/trips/singapore-stem">Singapore STEM</Link>
            <Link href="/trips/jaipur-heritage">Jaipur Heritage</Link>
            <Link href="/trips/london-universities">London Universities</Link>
          </div>

          {/* Quick Links */}
          <div className="site-footer__links-col">
            <span className="footer-col-title">QUICK LINKS</span>
            <Link href="/#destinations">Destinations</Link>
            <Link href="/#why-travel">Why Educational Travel</Link>
            <Link href="/#how-it-works">How It Works</Link>
            <Link href="/#trust">Trust & Safety</Link>
            <Link href="/#contact">Get in Touch</Link>
            <Link href="/register">Plan a Trip</Link>
          </div>

          {/* Support */}
          <div className="site-footer__links-col">
            <span className="footer-col-title">SUPPORT</span>
            <Link href="/#how-it-works">FAQ</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/privacy">Terms of Service</Link>
            <Link href="/admin/login">Admin Portal</Link>
          </div>

          {/* Stay Inspired / Newsletter */}
          <div className="site-footer__newsletter-col">
            <span className="footer-col-title">STAY INSPIRED</span>
            <p className="footer-newsletter-text">
              Get the latest trip ideas, resources and updates for school travel.
            </p>
            <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="footer-newsletter-input"
              />
              <button type="submit" className="button button--red footer-newsletter-btn">
                {subscribed ? "Subscribed!" : <>Subscribe <ArrowRight size={14} /></>}
              </button>
            </form>
            <div className="footer-privacy-badge">
              <Lock size={12} />
              <span>We respect your privacy. No spam, ever.</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="site-footer__bottom-bar">
          <span>© 2024 Beyond The Classroom. All rights reserved.</span>
          <span className="footer-bottom-motto">LEARN &nbsp; EXPLORE &nbsp; EXPERIENCE</span>
        </div>
      </div>
    </footer>
  )
}
