"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { ArrowRight, Menu, Search, X } from "lucide-react"
import { BrandMark } from "@/components/site/brand"
import { destinations } from "@/lib/trips/data"

const navItems = [
  { label: "Destinations", href: "/#destinations" },
  { label: "School trips", href: "/#school-trips" },
  { label: "Why us", href: "/#why-us" },
  { label: "For schools", href: "/#how-it-works" },
  { label: "Our approach", href: "/#about" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState("")
  const isHome = pathname === "/"

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

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
    <header className={`site-header${scrolled ? " site-header--scrolled" : ""}${isHome ? " site-header--home" : ""}`}>
      <div className="site-header__inner">
        <BrandMark />

        <nav className="site-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href}>
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
            onClick={() => {
              setSearchOpen((open) => !open)
              setMenuOpen(false)
            }}
          >
            {searchOpen ? <X size={18} /> : <Search size={18} />}
          </button>
          <Link className="button button--small button--outline header-contact" href="/register">
            Get in touch
          </Link>
          <Link className="button button--small button--red header-plan" href="/register">
            Plan a trip <ArrowRight size={15} aria-hidden="true" />
          </Link>
          <button
            type="button"
            className="icon-button mobile-menu-toggle"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => {
              setMenuOpen((open) => !open)
              setSearchOpen(false)
            }}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="search-panel" id="destination-search-panel">
          <form role="search" onSubmit={handleSearch}>
            <label htmlFor="destination-search">Find a school trip</label>
            <div className="search-panel__field">
              <Search size={17} aria-hidden="true" />
              <input
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
                <ArrowRight size={17} />
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

      <nav
        id="mobile-navigation"
        className={`mobile-nav${menuOpen ? " mobile-nav--open" : ""}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        {navItems.map((item) => (
          <Link key={item.label} href={item.href} onClick={closeMenus} tabIndex={menuOpen ? 0 : -1}>
            {item.label}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        ))}
        <Link className="button button--red" href="/register" onClick={closeMenus} tabIndex={menuOpen ? 0 : -1}>
          Plan a trip <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </nav>
    </header>
  )
}
