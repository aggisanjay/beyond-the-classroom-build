"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowRight, Menu, Search, X } from "lucide-react"
import { BrandMark } from "@/components/site/brand"
import { destinations } from "@/lib/trips/data"

const navItems = [
  { label: "Destinations", href: "/#destinations" },
  { label: "Why Educational Travel", href: "/#why-travel" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Trust & Safety", href: "/#trust" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState("")
  const isHome = pathname === "/"

  const toggleBtnRef = useRef<HTMLButtonElement>(null)
  const mobileNavRef = useRef<HTMLElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Focus management & body scroll lock for mobile menu
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (menuOpen) {
      document.body.style.overflow = "hidden"
      // Move focus inside mobile menu dialog
      const firstFocusable = mobileNavRef.current?.querySelector<HTMLElement>("a, button")
      setTimeout(() => firstFocusable?.focus(), 50)
    } else {
      document.body.style.overflow = ""
      // Restore focus to toggle button upon close
      toggleBtnRef.current?.focus()
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  // Auto-focus search input when search opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 60)
    }
  }, [searchOpen])

  // Escape key and resize listeners
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeMenus()
    }
    function handleResize() {
      if (window.innerWidth >= 768) closeMenus()
    }
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Focus trap inside open mobile menu
  function handleNavKeyDown(e: React.KeyboardEvent<HTMLElement>) {
    if (e.key === "Tab") {
      const focusables = mobileNavRef.current?.querySelectorAll<HTMLElement>('a, button, [tabindex="0"]')
      if (!focusables || focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return destinations
    return destinations.filter((trip) =>
      `${trip.city} ${trip.title} ${trip.theme}`.toLowerCase().includes(normalized)
    )
  }, [query])

  function closeMenus() {
    setMenuOpen(false)
    setSearchOpen(false)
  }

  function handleNavClick(href: string) {
    closeMenus()
    if (isHome && href.startsWith("/#")) {
      const targetId = href.replace("/#", "")
      const el = document.getElementById(targetId)
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" })
        }, 120)
      }
    }
  }

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const firstMatch = results[0]
    if (firstMatch) {
      closeMenus()
      router.push(`/trips/${firstMatch.slug}`)
    } else if (!query.trim()) {
      closeMenus()
      router.push("/#destinations")
    }
  }

  return (
    <header className={`site-header${scrolled ? " site-header--scrolled" : ""}${isHome ? " site-header--home" : ""}${menuOpen ? " site-header--menu-open" : ""}`}>
      <div className="site-header__inner">
        <BrandMark />

        <nav className="site-nav hidden md:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} onClick={() => handleNavClick(item.href)}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="site-header__actions">
          <button
            type="button"
            className={`icon-button site-search-toggle${searchOpen ? " is-active" : ""}`}
            aria-label={searchOpen ? "Close destination search" : "Search destinations"}
            aria-expanded={searchOpen}
            aria-controls="destination-search-panel"
            aria-haspopup="dialog"
            onClick={() => {
              setSearchOpen((open) => !open)
              setMenuOpen(false)
            }}
          >
            {searchOpen ? <X size={20} aria-hidden="true" /> : <Search size={20} aria-hidden="true" />}
          </button>
          <Link className="button button--small button--outline header-plan hidden md:inline-flex" href="/register">
            Plan a Trip
          </Link>
          <Link className="button button--small button--red header-contact hidden md:inline-flex" href="/register">
            Get in Touch
          </Link>
          <button
            ref={toggleBtnRef}
            type="button"
            className={`icon-button mobile-menu-toggle inline-flex md:hidden${menuOpen ? " is-active" : ""}`}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-haspopup="dialog"
            onClick={() => {
              setMenuOpen((open) => !open)
              setSearchOpen(false)
            }}
          >
            {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="search-panel" id="destination-search-panel" role="region" aria-label="Destination search">
          <form role="search" onSubmit={handleSearch}>
            <label htmlFor="destination-search">Find a school trip</label>
            <div className="search-panel__field">
              <Search size={18} aria-hidden="true" />
              <input
                ref={searchInputRef}
                id="destination-search"
                type="search"
                autoComplete="off"
                placeholder="Try Singapore, heritage, STEM…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && (event.nativeEvent.isComposing || event.keyCode === 229)) {
                    event.preventDefault()
                  }
                }}
              />
              <button type="submit" className="search-panel__submit" aria-label="Open matching trip">
                <ArrowRight size={17} aria-hidden="true" />
              </button>
            </div>
          </form>
          <div className="search-panel__results" aria-live="polite">
            {results.length ? (
              results.map((trip) => (
                <Link key={trip.slug} href={`/trips/${trip.slug}`} onClick={closeMenus}>
                  <span>{trip.city}</span>
                  <small>{trip.theme}</small>
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              ))
            ) : (
              <p>No destination matches that search. Try another keyword.</p>
            )}
          </div>
        </div>
      )}

      {/* Accessible Mobile Navigation Dialog */}
      {menuOpen && (
        <>
          <nav
            ref={mobileNavRef}
            id="mobile-navigation"
            className="mobile-nav mobile-nav--open"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            onKeyDown={handleNavKeyDown}
          >
            <div className="mobile-nav__links">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="mobile-nav__item"
                >
                  <span>{item.label}</span>
                  <ArrowRight size={16} aria-hidden="true" className="mobile-nav__arrow" />
                </Link>
              ))}
            </div>
            <div className="mobile-nav__cta-group">
              <Link
                className="button button--red mobile-cta-primary"
                href="/register"
                onClick={closeMenus}
              >
                Plan a Trip <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link
                className="button button--outline mobile-cta-secondary"
                href="/register"
                onClick={closeMenus}
              >
                Get in Touch
              </Link>
            </div>
          </nav>

          {/* Backdrop overlay for tap-outside to close */}
          <div
            className="mobile-nav-backdrop"
            onClick={closeMenus}
            aria-hidden="true"
          />
        </>
      )}
    </header>
  )
}
