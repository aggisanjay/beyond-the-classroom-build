"use client"

import Image from "next/image"
import Link from "next/link"
import { useDeferredValue, useState } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import {
  ArrowDown,
  ArrowDownUp,
  ArrowUp,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  RefreshCw,
  Search,
  Settings2,
  UsersRound,
  X,
} from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { BrandMark } from "@/components/site/brand"
import { destinations } from "@/lib/trips/data"
import type { AdminDashboardData, AdminSortColumn, TripInterestRecord } from "@/lib/admin/data"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser"

const chartConfig = {
  studentTotal: { label: "Interested students", color: "var(--chart-1)" },
} satisfies ChartConfig

async function fetchDashboard(url: string): Promise<AdminDashboardData> {
  const response = await fetch(url, { cache: "no-store" })
  if (!response.ok) {
    const result = (await response.json().catch(() => null)) as { message?: string } | null
    throw new Error(result?.message ?? "Could not load enquiry data.")
  }
  return response.json() as Promise<AdminDashboardData>
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))
}

function tripName(slug: string) {
  return destinations.find((trip) => trip.slug === slug)?.city ?? "Unknown trip"
}

function sortIcon(active: boolean, direction: "asc" | "desc") {
  if (!active) return <ArrowDownUp size={13} aria-hidden="true" />
  return direction === "asc" ? <ArrowUp size={13} aria-hidden="true" /> : <ArrowDown size={13} aria-hidden="true" />
}

export function AdminDashboard({
  adminEmail,
  initialData,
  initialError,
}: {
  adminEmail: string
  initialData: AdminDashboardData | null
  initialError?: string
}) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [tripFilter, setTripFilter] = useState("")
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<AdminSortColumn>("created_at")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState("")
  const [logoutError, setLogoutError] = useState("")
  const deferredSearch = useDeferredValue(search.trim())

  const params = new URLSearchParams({ page: String(page), sort: sortBy, direction: sortDirection })
  if (tripFilter) params.set("trip", tripFilter)
  if (deferredSearch) params.set("search", deferredSearch)
  const requestUrl = `/api/admin/trip-interests?${params.toString()}`
  const initialUrl = "/api/admin/trip-interests?page=1&sort=created_at&direction=desc"
  const { data, error, isLoading, mutate } = useSWR<AdminDashboardData>(requestUrl, fetchDashboard, {
    fallbackData: requestUrl === initialUrl ? initialData ?? undefined : undefined,
    refreshInterval: 30_000,
    revalidateOnFocus: true,
    keepPreviousData: true,
  })

  const currentData = data ?? initialData
  const totalPages = Math.max(1, Math.ceil((currentData?.count ?? 0) / (currentData?.pageSize ?? 8)))
  const rows = currentData?.items ?? []
  const chartData = currentData?.analytics.map((trip) => ({ city: trip.city, studentTotal: trip.studentTotal })) ?? []
  const showDataError = error?.message ?? (!currentData ? initialError : "")

  function changeSort(column: AdminSortColumn) {
    setPage(1)
    if (column === sortBy) setSortDirection((direction) => direction === "asc" ? "desc" : "asc")
    else {
      setSortBy(column)
      setSortDirection(column === "created_at" ? "desc" : "asc")
    }
  }

  async function exportCsv() {
    setExporting(true)
    setExportError("")
    const exportParams = new URLSearchParams({ format: "csv", sort: sortBy, direction: sortDirection })
    if (tripFilter) exportParams.set("trip", tripFilter)
    if (deferredSearch) exportParams.set("search", deferredSearch)

    try {
      const response = await fetch(`/api/admin/trip-interests?${exportParams.toString()}`, { cache: "no-store" })
      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as { message?: string } | null
        throw new Error(result?.message ?? "CSV export is not available.")
      }
      const objectUrl = URL.createObjectURL(await response.blob())
      const anchor = document.createElement("a")
      anchor.href = objectUrl
      anchor.download = "beyond-the-classroom-enquiries.csv"
      document.body.append(anchor)
      anchor.click()
      anchor.remove()
      URL.revokeObjectURL(objectUrl)
    } catch (exportFailure) {
      setExportError(exportFailure instanceof Error ? exportFailure.message : "CSV export is not available.")
    } finally {
      setExporting(false)
    }
  }

  async function signOut() {
    setLogoutError("")
    const { error: signOutError } = await createSupabaseBrowserClient().auth.signOut()
    if (signOutError) {
      setLogoutError("We could not end the session. Please try again.")
      return
    }
    router.replace("/admin/login")
    router.refresh()
  }

  function resetPage() {
    setPage(1)
  }

  const sortButton = (label: string, column: AdminSortColumn) => (
    <button type="button" className="table-sort-button" onClick={() => changeSort(column)}>
      {label} {sortIcon(sortBy === column, sortDirection)}
    </button>
  )

  return (
    <div className="admin-shell">
      <button
        type="button"
        className="admin-mobile-menu icon-button"
        aria-label={sidebarOpen ? "Close dashboard navigation" : "Open dashboard navigation"}
        aria-expanded={sidebarOpen}
        aria-controls="admin-sidebar"
        onClick={() => setSidebarOpen((open) => !open)}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <aside id="admin-sidebar" className={`admin-sidebar${sidebarOpen ? " admin-sidebar--open" : ""}`}>
        <BrandMark />
        <div className="admin-sidebar__label">WORKSPACE</div>
        <nav aria-label="Dashboard navigation">
          <a className="admin-side-link is-current" href="#overview" onClick={() => setSidebarOpen(false)}><LayoutDashboard size={17} /> Overview</a>
          <a className="admin-side-link" href="#enquiries" onClick={() => setSidebarOpen(false)}><FileText size={17} /> Enquiries</a>
          <a className="admin-side-link" href="#analytics" onClick={() => setSidebarOpen(false)}><BarChart3 size={17} /> Trip analytics</a>
          <Link className="admin-side-link" href="/#destinations" onClick={() => setSidebarOpen(false)}><CalendarDays size={17} /> View school trips <ArrowUpRight size={14} /></Link>
        </nav>
        <div className="admin-sidebar__spacer" />
        <a className="admin-side-link" href="#settings" onClick={() => setSidebarOpen(false)}><Settings2 size={17} /> Access settings</a>
        <div className="admin-sidebar__profile">
          <span className="admin-avatar" aria-hidden="true">{adminEmail.slice(0, 1).toUpperCase()}</span>
          <span><strong>{adminEmail}</strong><small>Authorized admin</small></span>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-breadcrumb"><span>Workspace</span><i>/</i><strong>Overview</strong></div>
          <div className="admin-topbar__actions">
            <span className="admin-live-status"><span /> Secure session</span>
            <button type="button" className="admin-user-button" onClick={signOut} aria-label="Sign out of administrator dashboard">
              <span className="admin-avatar admin-avatar--small" aria-hidden="true">{adminEmail.slice(0, 1).toUpperCase()}</span>
              <span className="admin-user-email">{adminEmail}</span>
              <ChevronDown size={15} aria-hidden="true" />
            </button>
          </div>
        </header>

        <main className="admin-content" id="overview">
          <section className="admin-welcome">
            <div className="admin-welcome__image"><Image src="/images/japan-learning-story.webp" alt="" fill sizes="100vw" priority /></div>
            <div className="admin-welcome__shade" />
            <div className="admin-welcome__content">
              <p className="eyebrow"><span className="eyebrow__line" /> BEYOND THE CLASSROOM / ADMIN</p>
              <h1>School trip<br />enquiries.</h1>
              <p>Review interest from teachers and explore the journeys schools are considering.</p>
            </div>
            <div className="admin-welcome__total">
              <span>TOTAL INTERESTED STUDENTS</span>
              <strong>{(currentData?.totalStudents ?? 0).toLocaleString()}</strong>
              <small>Across all saved enquiries</small>
            </div>
          </section>

          <section className="admin-metric-grid" aria-label="Enquiry summary">
            <article className="admin-metric-card">
              <span className="admin-metric-card__icon"><FileText size={18} /></span>
              <span>Total enquiries</span>
              <strong>{(currentData?.totalEnquiries ?? 0).toLocaleString()}</strong>
              <small>Saved school enquiries</small>
            </article>
            <article className="admin-metric-card">
              <span className="admin-metric-card__icon admin-metric-card__icon--red"><UsersRound size={18} /></span>
              <span>Interested students</span>
              <strong>{(currentData?.totalStudents ?? 0).toLocaleString()}</strong>
              <small>Across all destinations</small>
            </article>
            {currentData?.analytics.map((trip, index) => (
              <article className="admin-metric-card admin-metric-card--trip" key={trip.tripSlug}>
                <span className={`admin-metric-card__trip-dot admin-metric-card__trip-dot--${index + 1}`} />
                <span>{trip.city}</span>
                <strong>{trip.enquiryCount.toLocaleString()}</strong>
                <small>{trip.studentTotal.toLocaleString()} interested students</small>
              </article>
            ))}
          </section>

          <div className="admin-panel-grid">
            <section className="admin-panel analytics-panel" id="analytics" aria-labelledby="analytics-heading">
              <div className="admin-panel__heading">
                <div><span className="admin-overline">TRIP ANALYTICS</span><h2 id="analytics-heading">Student interest by destination</h2></div>
                <span className="admin-period-label">All saved enquiries</span>
              </div>
              {(currentData?.totalEnquiries ?? 0) === 0 ? (
                <div className="admin-empty-chart"><BarChart3 size={24} aria-hidden="true" /><p>Trip analytics will appear when the first enquiry is saved.</p></div>
              ) : (
                <ChartContainer config={chartConfig} className="admin-chart h-[250px] w-full aspect-auto">
                  <BarChart accessibilityLayer data={chartData} margin={{ top: 12, right: 8, left: -18, bottom: 4 }}>
                    <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
                    <XAxis dataKey="city" tickLine={false} axisLine={false} tickMargin={9} />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={38} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <Bar dataKey="studentTotal" fill="var(--color-studentTotal)" radius={[5, 5, 0, 0]} maxBarSize={70} />
                  </BarChart>
                </ChartContainer>
              )}
              <div className="admin-chart-legend"><span /><span>Interested students</span><small>Counts are calculated from saved enquiries.</small></div>
            </section>

            <section className="admin-panel recent-panel" aria-labelledby="recent-heading">
              <div className="admin-panel__heading">
                <div><span className="admin-overline">LATEST ACTIVITY</span><h2 id="recent-heading">Recent enquiries</h2></div>
                <a href="#enquiries" className="admin-inline-link">View all <ArrowUpRight size={14} /></a>
              </div>
              {rows.length ? (
                <ul className="recent-list">
                  {rows.slice(0, 4).map((row) => (
                    <li key={row.id}>
                      <span className="recent-list__icon"><UsersRound size={16} aria-hidden="true" /></span>
                      <span className="recent-list__details"><strong>{row.school_name}</strong><small>{row.teacher_name} · {tripName(row.trip_slug)}</small></span>
                      <time dateTime={row.created_at}>{new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(row.created_at))}</time>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="recent-empty"><p>No enquiries have been saved yet.</p><small>New school interest will appear here.</small></div>
              )}
            </section>
          </div>

          <section className="admin-panel enquiries-panel" id="enquiries" aria-labelledby="enquiries-heading">
            <div className="admin-panel__heading enquiries-heading">
              <div><span className="admin-overline">INBOX</span><h2 id="enquiries-heading">School enquiries</h2><p>Review the details teachers shared with your team.</p></div>
              <div className="enquiry-actions">
                <button type="button" className="admin-button admin-button--secondary" onClick={() => mutate()} disabled={isLoading}>
                  <RefreshCw size={15} className={isLoading ? "spin" : ""} /> Refresh
                </button>
                <button type="button" className="admin-button admin-button--secondary" onClick={exportCsv} disabled={exporting}>
                  <Download size={15} /> {exporting ? "Preparing…" : "Export CSV"}
                </button>
              </div>
            </div>

            <div className="enquiry-toolbar">
              <label className="admin-search" htmlFor="enquiry-search">
                <Search size={16} aria-hidden="true" />
                <input id="enquiry-search" type="search" placeholder="Search teacher, school or email" value={search} onChange={(event) => { setSearch(event.target.value); resetPage() }} />
              </label>
              <label className="admin-filter" htmlFor="trip-filter">
                <span className="sr-only">Filter enquiries by destination</span>
                <select id="trip-filter" value={tripFilter} onChange={(event) => { setTripFilter(event.target.value); resetPage() }}>
                  <option value="">All destinations</option>
                  {destinations.map((trip) => <option key={trip.slug} value={trip.slug}>{trip.city}</option>)}
                </select>
                <ChevronDown size={15} aria-hidden="true" />
              </label>
              <span className="enquiry-count">{(currentData?.count ?? 0).toLocaleString()} {currentData?.count === 1 ? "result" : "results"}</span>
            </div>

            {showDataError && (
              <div className="admin-data-error" role="alert">
                <p>{showDataError}</p>
                <button type="button" className="text-button" onClick={() => mutate()}>Try again</button>
              </div>
            )}
            {exportError && <p className="admin-data-error" role="alert">{exportError}</p>}
            {logoutError && <p className="admin-data-error" role="alert">{logoutError}</p>}

            {isLoading && !currentData ? (
              <div className="admin-table-loading" role="status">Loading authorized enquiries…</div>
            ) : rows.length ? (
              <div className="admin-table-scroll" tabIndex={0} aria-label="Enquiries table. Scroll horizontally to view all columns.">
                <table className="admin-table">
                  <caption className="sr-only">School trip enquiry records</caption>
                  <thead>
                    <tr>
                      <th scope="col" aria-sort={sortBy === "teacher_name" ? sortDirection === "asc" ? "ascending" : "descending" : "none"}>{sortButton("Teacher", "teacher_name")}</th>
                      <th scope="col" aria-sort={sortBy === "school_name" ? sortDirection === "asc" ? "ascending" : "descending" : "none"}>{sortButton("School", "school_name")}</th>
                      <th scope="col">Contact</th>
                      <th scope="col" aria-sort={sortBy === "trip_slug" ? sortDirection === "asc" ? "ascending" : "descending" : "none"}>{sortButton("Destination", "trip_slug")}</th>
                      <th scope="col" aria-sort={sortBy === "student_count" ? sortDirection === "asc" ? "ascending" : "descending" : "none"}>{sortButton("Students", "student_count")}</th>
                      <th scope="col" aria-sort={sortBy === "created_at" ? sortDirection === "asc" ? "ascending" : "descending" : "none"}>{sortButton("Submitted", "created_at")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row: TripInterestRecord) => (
                      <tr key={row.id}>
                        <td><strong>{row.teacher_name}</strong></td>
                        <td>{row.school_name}</td>
                        <td><a href={`mailto:${encodeURIComponent(row.email)}`}>{row.email}</a><a className="table-phone" href={`tel:${row.phone.replace(/[^+\d]/g, "")}`}>{row.phone}</a></td>
                        <td><span className="trip-pill">{tripName(row.trip_slug)}</span></td>
                        <td className="student-number">{row.student_count.toLocaleString()}</td>
                        <td><time dateTime={row.created_at}>{formatDate(row.created_at)}</time></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="admin-empty-table">
                <FileText size={24} aria-hidden="true" />
                <strong>{(currentData?.totalEnquiries ?? 0) === 0 ? "No enquiries yet" : "No matching enquiries"}</strong>
                <p>{(currentData?.totalEnquiries ?? 0) === 0 ? "Submitted school interest will appear here after it is saved." : "Try clearing the search or changing the destination filter."}</p>
              </div>
            )}

            <div className="admin-table-footer">
              <span>Updates automatically every 30 seconds</span>
              <div className="pagination-controls">
                <span>Page {page} of {totalPages}</span>
                <button type="button" className="icon-button" aria-label="Previous page" disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}><ChevronLeft size={17} /></button>
                <button type="button" className="icon-button" aria-label="Next page" disabled={page >= totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}><ChevronRight size={17} /></button>
              </div>
            </div>
          </section>

          <section className="admin-settings-panel" id="settings" aria-labelledby="settings-heading">
            <div><span className="admin-overline">ACCESS SETTINGS</span><h2 id="settings-heading">Administrator access</h2><p>Dashboard access is checked on the server against the configured administrator email allowlist.</p></div>
            <div className="admin-settings-panel__right"><span className="admin-live-status"><span /> Signed in as {adminEmail}</span><button type="button" className="admin-button admin-button--secondary" onClick={signOut}><LogOut size={15} /> Sign out</button></div>
          </section>

          <footer className="admin-footer"><span>Beyond the Classroom · Enquiry management</span><Link href="/privacy">Privacy notice <ArrowUpRight size={13} /></Link></footer>
        </main>
      </div>
    </div>
  )
}
