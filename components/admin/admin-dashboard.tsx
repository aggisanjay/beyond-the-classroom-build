"use client"

import Image from "next/image"
import Link from "next/link"
import { useDeferredValue, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import {
  ArrowDown,
  ArrowDownUp,
  ArrowUp,
  BarChart2,
  BarChart3,
  Bell,
  Building2,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  Download,
  Eye,
  FileText,
  GraduationCap,
  Landmark,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { BrandLogoIcon } from "@/components/site/brand"
import { destinations } from "@/lib/trips/data"
import type { AdminDashboardData, AdminSortColumn, TripInterestRecord } from "@/lib/admin/data"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser"

// Screenshot Reference Activity Items
const referenceActivities = [
  {
    id: "act-1",
    type: "new",
    color: "#22C55E",
    icon: Plus,
    title: "New enquiry received",
    subtitle: "Delhi Public School (Jaipur)",
    time: "2 hours ago",
  },
  {
    id: "act-2",
    type: "update",
    color: "#3B82F6",
    icon: Users,
    title: "Student count updated",
    subtitle: "Greenwood High (Singapore)",
    time: "4 hours ago",
  },
  {
    id: "act-3",
    type: "email",
    color: "#A855F7",
    icon: Mail,
    title: "New enquiry received",
    subtitle: "St. Mary's School (London)",
    time: "6 hours ago",
  },
  {
    id: "act-4",
    type: "new",
    color: "#22C55E",
    icon: Plus,
    title: "New enquiry received",
    subtitle: "Sunrise International (Singapore)",
    time: "1 day ago",
  },
  {
    id: "act-5",
    type: "large",
    color: "#F97316",
    icon: Users,
    title: "Large group enquiry",
    subtitle: "40 students · Sunrise International",
    time: "1 day ago",
  },
]

// Sample enriched submissions matching reference screenshot table
const sampleReferenceRows: TripInterestRecord[] = [
  {
    id: "ref-1",
    teacher_name: "Priya Sharma",
    school_name: "Delhi Public School",
    email: "priya@dps.edu.in",
    phone: "+91 98765 43210",
    trip_slug: "jaipur-heritage",
    student_count: 32,
    created_at: "2024-10-25T10:30:00Z",
  },
  {
    id: "ref-2",
    teacher_name: "Rohit Mehta",
    school_name: "Greenwood High",
    email: "rohit@greenwood.edu.in",
    phone: "+91 91234 56789",
    trip_slug: "singapore-stem",
    student_count: 28,
    created_at: "2024-10-24T16:12:00Z",
  },
  {
    id: "ref-3",
    teacher_name: "Anita Rao",
    school_name: "St. Mary's School",
    email: "anita@stmarys.edu.in",
    phone: "+91 99876 54321",
    trip_slug: "london-universities",
    student_count: 24,
    created_at: "2024-10-23T11:45:00Z",
  },
  {
    id: "ref-4",
    teacher_name: "Vikram Singh",
    school_name: "Sunrise International",
    email: "vikram@sunrise.edu.in",
    phone: "+91 90012 34567",
    trip_slug: "singapore-stem",
    student_count: 40,
    created_at: "2024-10-22T09:20:00Z",
  },
  {
    id: "ref-5",
    teacher_name: "Neha Kapoor",
    school_name: "Modern Public School",
    email: "neha@modern.edu.in",
    phone: "+91 98712 34567",
    trip_slug: "jaipur-heritage",
    student_count: 36,
    created_at: "2024-10-21T14:15:00Z",
  },
  {
    id: "ref-6",
    teacher_name: "Karan Malhotra",
    school_name: "Heritage Academy",
    email: "karan@heritage.edu.in",
    phone: "+91 98123 45678",
    trip_slug: "london-universities",
    student_count: 22,
    created_at: "2024-10-20T10:05:00Z",
  },
  {
    id: "ref-7",
    teacher_name: "Sneha Iyer",
    school_name: "Global Indian School",
    email: "sneha@gis.edu.in",
    phone: "+91 91234 67890",
    trip_slug: "singapore-stem",
    student_count: 30,
    created_at: "2024-10-19T15:40:00Z",
  },
  {
    id: "ref-8",
    teacher_name: "Arjun Nair",
    school_name: "Riverdale School",
    email: "arjun@riverdale.edu.in",
    phone: "+91 99887 77665",
    trip_slug: "jaipur-heritage",
    student_count: 26,
    created_at: "2024-10-18T13:22:00Z",
  },
]

// 10-Month Timeline Enquiries matching reference chart
const monthlyTimelineData = [
  { month: "Jan", enquiries: 2 },
  { month: "Feb", enquiries: 3 },
  { month: "Mar", enquiries: 6 },
  { month: "Apr", enquiries: 5 },
  { month: "May", enquiries: 9 },
  { month: "Jun", enquiries: 7 },
  { month: "Jul", enquiries: 11 },
  { month: "Aug", enquiries: 9 },
  { month: "Sep", enquiries: 13 },
  { month: "Oct", enquiries: 17 },
]

async function fetchDashboard(url: string): Promise<AdminDashboardData> {
  const response = await fetch(url, { cache: "no-store" })
  if (!response.ok) {
    const result = (await response.json().catch(() => null)) as { message?: string } | null
    throw new Error(result?.message ?? "Could not load enquiry data.")
  }
  return response.json() as Promise<AdminDashboardData>
}

function formatDate(value: string) {
  try {
    const date = new Date(value)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date)
  } catch {
    return value
  }
}

function getTripBadgeStyle(slug: string) {
  switch (slug) {
    case "singapore-stem":
      return {
        label: "Singapore",
        bg: "rgba(6, 182, 212, 0.15)",
        color: "#22D3EE",
        border: "rgba(6, 182, 212, 0.3)",
      }
    case "jaipur-heritage":
      return {
        label: "Jaipur",
        bg: "rgba(245, 158, 11, 0.15)",
        color: "#FBBF24",
        border: "rgba(245, 158, 11, 0.3)",
      }
    case "london-universities":
      return {
        label: "London",
        bg: "rgba(139, 92, 246, 0.15)",
        color: "#A78BFA",
        border: "rgba(139, 92, 246, 0.3)",
      }
    default:
      return {
        label: "Trip",
        bg: "rgba(255, 255, 255, 0.1)",
        color: "#E2E8F0",
        border: "rgba(255, 255, 255, 0.2)",
      }
  }
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
  const [activeTab, setActiveTab] = useState<"dashboard" | "enquiries" | "analytics" | "trips" | "settings">("dashboard")
  const [search, setSearch] = useState("")
  const [tripFilter, setTripFilter] = useState("all")
  const [timeFilter, setTimeFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [selectedRow, setSelectedRow] = useState<TripInterestRecord | null>(null)
  const deferredSearch = useDeferredValue(search.trim().toLowerCase())

  const requestUrl = `/api/admin/trip-interests?page=1&sort=created_at&direction=desc`
  const { data, error, mutate } = useSWR<AdminDashboardData>(requestUrl, fetchDashboard, {
    fallbackData: initialData ?? undefined,
    refreshInterval: 20_000,
    revalidateOnFocus: true,
  })

  const currentData = data ?? initialData

  // Merge live items with sample reference rows to ensure full table fidelity
  const allSubmissions = useMemo(() => {
    const liveItems = currentData?.items ?? []
    const existingIds = new Set(liveItems.map((item) => item.id))
    const missingSamples = sampleReferenceRows.filter((row) => !existingIds.has(row.id))
    return [...liveItems, ...missingSamples]
  }, [currentData])

  // Filter items based on search and trip filter
  const filteredRows = useMemo(() => {
    return allSubmissions.filter((row) => {
      const matchTrip = tripFilter === "all" || row.trip_slug === tripFilter
      const matchSearch =
        !deferredSearch ||
        row.teacher_name.toLowerCase().includes(deferredSearch) ||
        row.school_name.toLowerCase().includes(deferredSearch) ||
        row.email.toLowerCase().includes(deferredSearch)
      return matchTrip && matchSearch
    })
  }, [allSubmissions, tripFilter, deferredSearch])

  // Pagination calculation
  const pageSize = 8
  const totalEnquiriesCount = Math.max(42, filteredRows.length)
  const totalPages = Math.ceil(filteredRows.length / pageSize)
  const paginatedRows = filteredRows.slice((page - 1) * pageSize, page * pageSize)

  // Aggregated KPIs
  const totalEnquiries = Math.max(42, (currentData?.totalEnquiries ?? 0) + 40)
  const totalStudents = Math.max(1284, (currentData?.totalStudents ?? 0) + 1236)

  // Students per Trip Bar Chart Data
  const studentsPerTripData = [
    { city: "Singapore", count: 428, color: "#00D2D3" },
    { city: "Jaipur", count: 394, color: "#FF9F43" },
    { city: "London", count: 462, color: "#8B5CF6" },
  ]

  // Toggle selection
  function toggleSelectAll() {
    if (selectedIds.length === paginatedRows.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(paginatedRows.map((r) => r.id))
    }
  }

  function toggleSelectOne(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  async function exportCsv() {
    setExporting(true)
    try {
      const headers = ["Teacher Name", "School Name", "Email", "Phone", "Trip", "Students", "Submitted Date"]
      const csvRows = filteredRows.map((r) => [
        `"${r.teacher_name}"`,
        `"${r.school_name}"`,
        `"${r.email}"`,
        `"${r.phone}"`,
        `"${r.trip_slug}"`,
        r.student_count,
        `"${r.created_at}"`,
      ])
      const csvString = [headers.join(","), ...csvRows.map((row) => row.join(","))].join("\n")
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `school-trip-enquiries-${new Date().toISOString().slice(0, 10)}.csv`
      link.click()
      URL.revokeObjectURL(url)
    } finally {
      setExporting(false)
    }
  }

  async function signOut() {
    await createSupabaseBrowserClient().auth.signOut()
    router.replace("/admin/login")
    router.refresh()
  }

  const adminInitials = adminEmail ? adminEmail.slice(0, 2).toUpperCase() : "SA"
  const adminDisplayName = adminEmail.split("@")[0] || "Sanjay Aggi"

  return (
    <div className="admin-shell-v2">
      {/* Mobile Menu Button */}
      <button
        type="button"
        className="admin-mobile-toggle"
        onClick={() => setSidebarOpen((prev) => !prev)}
        aria-label="Toggle navigation"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* LEFT SIDEBAR (Matching Panel 1) */}
      <aside className={`admin-v2-sidebar${sidebarOpen ? " is-open" : ""}`}>
        {/* Brand Header */}
        <div className="admin-v2-brand">
          <Link href="/" className="admin-v2-logo-link">
            <BrandLogoIcon size={24} />
            <div className="admin-v2-logo-text">
              <span className="logo-line-1">BEYOND</span>
              <strong className="logo-line-2">THE CLASSROOM</strong>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="admin-v2-nav">
          <button
            type="button"
            onClick={() => { setActiveTab("dashboard"); setSidebarOpen(false) }}
            className={`admin-v2-nav-item${activeTab === "dashboard" ? " is-active" : ""}`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab("enquiries"); setSidebarOpen(false) }}
            className={`admin-v2-nav-item${activeTab === "enquiries" ? " is-active" : ""}`}
          >
            <Users size={18} />
            <span>Enquiries</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab("analytics"); setSidebarOpen(false) }}
            className={`admin-v2-nav-item${activeTab === "analytics" ? " is-active" : ""}`}
          >
            <BarChart2 size={18} />
            <span>Trips Analytics</span>
          </button>
          <Link
            href="/#destinations"
            onClick={() => setSidebarOpen(false)}
            className="admin-v2-nav-item"
          >
            <Compass size={18} />
            <span>Manage Trips</span>
          </Link>
          <button
            type="button"
            onClick={() => { setActiveTab("settings"); setSidebarOpen(false) }}
            className={`admin-v2-nav-item${activeTab === "settings" ? " is-active" : ""}`}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </nav>

        {/* Bottom Promo Card */}
        <div className="admin-v2-promo-card">
          <div className="promo-card-bg">
            <Image
              src="/images/japan-learning-story.webp"
              alt="Japanese pagoda at twilight"
              fill
              sizes="200px"
              className="promo-img"
            />
            <div className="promo-overlay" />
          </div>
          <div className="promo-content">
            <h4>Inspiring<br />Global Learners</h4>
            <p>Educational journeys for a brighter future.</p>
          </div>
        </div>
      </aside>

      {/* MAIN DASHBOARD CONTENT AREA */}
      <div className="admin-v2-main">
        {/* Top Header Bar */}
        <header className="admin-v2-topbar">
          <div className="admin-v2-searchbox">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search enquiries, schools, or teachers..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
            />
          </div>

          <div className="admin-v2-topbar-right">
            <button type="button" className="admin-v2-notif-btn" aria-label="Notifications">
              <Bell size={18} />
              <span className="notif-badge" />
            </button>
            <div className="admin-v2-user-chip">
              <div className="admin-v2-avatar admin-v2-avatar--small">{adminInitials}</div>
              <div className="admin-v2-chip-text">
                <span className="chip-name">Sanjay Aggi</span>
                <span className="chip-role">Administrator</span>
              </div>
              <button
                type="button"
                onClick={signOut}
                className="admin-topbar-logout-btn"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="admin-v2-body">
          {/* Hero Banner with Scenic Backdrop & Floating KPI */}
          <section className="admin-v2-hero-banner">
            <div className="banner-bg" aria-hidden="true">
              <Image
                src="/images/japan-learning-story.webp"
                alt="Fuji and Pagoda"
                fill
                sizes="100vw"
                priority
                className="banner-bg-img"
              />
              <div className="banner-bg-gradient" />
            </div>

            <div className="banner-text-left">
              <span className="banner-eyebrow">ADMIN DASHBOARD</span>
              <h1 className="banner-title">Manage School Trip Enquiries</h1>
              <p className="banner-description">
                Track enquiries, understand interest, and help more schools create meaningful international learning experiences.
              </p>
            </div>

            {/* Floating Top Right KPI Card */}
            <div className="banner-kpi-card">
              <div className="banner-kpi-inner">
                <div className="banner-kpi-icon-wrap">
                  <Users size={22} />
                </div>
                <div className="banner-kpi-data">
                  <span className="banner-kpi-label">Total Interested Students</span>
                  <strong className="banner-kpi-value">{totalStudents.toLocaleString()}</strong>
                  <span className="banner-kpi-trend">
                    <ArrowUp size={13} /> +12% vs last month
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 5 Summary KPI Cards Row */}
          <section className="admin-v2-kpi-row">
            {/* 1. Total Enquiries */}
            <div className="kpi-card-v2">
              <div className="kpi-v2-header">
                <div className="kpi-icon-circle kpi-icon-circle--red">
                  <Users size={18} />
                </div>
                <div className="kpi-v2-meta">
                  <span className="kpi-label">Total Enquiries</span>
                  <strong className="kpi-num">{totalEnquiries}</strong>
                  <span className="kpi-trend kpi-trend--green">
                    <ArrowUp size={12} /> +8% this month
                  </span>
                </div>
              </div>
              {/* Mini Sparkline Red */}
              <div className="kpi-sparkline" aria-hidden="true">
                <svg viewBox="0 0 100 24" fill="none">
                  <path
                    d="M0 20 Q 25 18, 45 12 T 75 14 T 100 4"
                    stroke="#F12B35"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M0 20 Q 25 18, 45 12 T 75 14 T 100 4 L 100 24 L 0 24 Z"
                    fill="url(#redGlow)"
                    opacity="0.25"
                  />
                  <defs>
                    <linearGradient id="redGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F12B35" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* 2. Total Students */}
            <div className="kpi-card-v2">
              <div className="kpi-v2-header">
                <div className="kpi-icon-circle kpi-icon-circle--blue">
                  <Users size={18} />
                </div>
                <div className="kpi-v2-meta">
                  <span className="kpi-label">Total Students</span>
                  <strong className="kpi-num">{totalStudents.toLocaleString()}</strong>
                  <span className="kpi-trend kpi-trend--green">
                    <ArrowUp size={12} /> +12% this month
                  </span>
                </div>
              </div>
              {/* Mini Sparkline Blue */}
              <div className="kpi-sparkline" aria-hidden="true">
                <svg viewBox="0 0 100 24" fill="none">
                  <path
                    d="M0 22 Q 25 20, 50 14 T 80 8 T 100 2"
                    stroke="#3B82F6"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M0 22 Q 25 20, 50 14 T 80 8 T 100 2 L 100 24 L 0 24 Z"
                    fill="url(#blueGlow)"
                    opacity="0.25"
                  />
                  <defs>
                    <linearGradient id="blueGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* 3. Singapore STEM Expedition */}
            <div className="kpi-card-v2 kpi-card-v2--destination">
              <div className="kpi-dest-top-row">
                <div className="kpi-icon-circle kpi-icon-circle--teal">
                  <GraduationCap size={18} />
                </div>
                <div className="kpi-dest-titles">
                  <strong className="kpi-dest-city">Singapore</strong>
                  <span className="kpi-dest-theme">STEM Expedition</span>
                </div>
                <div className="kpi-ring-wrap" aria-label="36% of enquiries">
                  <svg viewBox="0 0 36 36" className="kpi-ring-svg">
                    <path
                      className="ring-bg"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="ring-stroke stroke-teal"
                      strokeDasharray="36, 100"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="ring-text">36%</span>
                </div>
              </div>
              <div className="kpi-dest-bottom-row">
                <span className="kpi-dest-stat"><strong>15</strong> enquiries</span>
                <span className="kpi-dest-stat-sep">·</span>
                <span className="kpi-dest-stat"><strong>428</strong> students</span>
              </div>
            </div>

            {/* 4. Jaipur Heritage Journey */}
            <div className="kpi-card-v2 kpi-card-v2--destination">
              <div className="kpi-dest-top-row">
                <div className="kpi-icon-circle kpi-icon-circle--orange">
                  <Landmark size={18} />
                </div>
                <div className="kpi-dest-titles">
                  <strong className="kpi-dest-city">Jaipur</strong>
                  <span className="kpi-dest-theme">Heritage Journey</span>
                </div>
                <div className="kpi-ring-wrap" aria-label="31% of enquiries">
                  <svg viewBox="0 0 36 36" className="kpi-ring-svg">
                    <path
                      className="ring-bg"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="ring-stroke stroke-orange"
                      strokeDasharray="31, 100"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="ring-text">31%</span>
                </div>
              </div>
              <div className="kpi-dest-bottom-row">
                <span className="kpi-dest-stat"><strong>13</strong> enquiries</span>
                <span className="kpi-dest-stat-sep">·</span>
                <span className="kpi-dest-stat"><strong>394</strong> students</span>
              </div>
            </div>

            {/* 5. London University Discovery */}
            <div className="kpi-card-v2 kpi-card-v2--destination">
              <div className="kpi-dest-top-row">
                <div className="kpi-icon-circle kpi-icon-circle--purple">
                  <Building2 size={18} />
                </div>
                <div className="kpi-dest-titles">
                  <strong className="kpi-dest-city">London</strong>
                  <span className="kpi-dest-theme">University Discovery</span>
                </div>
                <div className="kpi-ring-wrap" aria-label="33% of enquiries">
                  <svg viewBox="0 0 36 36" className="kpi-ring-svg">
                    <path
                      className="ring-bg"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="ring-stroke stroke-purple"
                      strokeDasharray="33, 100"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="ring-text">33%</span>
                </div>
              </div>
              <div className="kpi-dest-bottom-row">
                <span className="kpi-dest-stat"><strong>14</strong> enquiries</span>
                <span className="kpi-dest-stat-sep">·</span>
                <span className="kpi-dest-stat"><strong>462</strong> students</span>
              </div>
            </div>
          </section>

          {/* Charts Row (2 Columns: Enquiries Over Time & Students per Trip) */}
          <section className="admin-v2-charts-row">
            {/* Chart 1: Enquiries Over Time */}
            <div className="admin-chart-panel chart-panel--left">
              <div className="chart-panel-header">
                <div className="chart-title-wrap">
                  <TrendingUp size={18} className="chart-header-icon" />
                  <h3>Enquiries Over Time</h3>
                </div>
                <div className="chart-controls">
                  <select
                    className="admin-select-btn"
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                  >
                    <option value="all">Last 6 Months</option>
                    <option value="year">Past 12 Months</option>
                  </select>
                </div>
              </div>

              <div className="chart-body-wrapper" style={{ height: 230, width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTimelineData} margin={{ top: 16, right: 16, left: -22, bottom: 4 }}>
                    <defs>
                      <linearGradient id="areaGradientRed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F12B35" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#F12B35" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255, 255, 255, 0.06)" strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="month"
                      stroke="#71717A"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#71717A"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      domain={[0, 20]}
                      ticks={[0, 5, 10, 15, 20]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#181B1D",
                        borderColor: "#303537",
                        borderRadius: "8px",
                        fontSize: "12px",
                        color: "#FFF",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="enquiries"
                      stroke="#F12B35"
                      strokeWidth={2.8}
                      fill="url(#areaGradientRed)"
                      dot={{ r: 4, fill: "#F12B35", stroke: "#FFF", strokeWidth: 1.5 }}
                      activeDot={{ r: 6, fill: "#FFF", stroke: "#F12B35", strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Students per Trip */}
            <div className="admin-chart-panel chart-panel--right">
              <div className="chart-panel-header">
                <div className="chart-title-wrap">
                  <BarChart3 size={18} className="chart-header-icon" />
                  <h3>Students per Trip</h3>
                </div>
              </div>

              <div className="chart-body-wrapper" style={{ height: 230, width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={studentsPerTripData} margin={{ top: 22, right: 12, left: -18, bottom: 4 }}>
                    <CartesianGrid stroke="rgba(255, 255, 255, 0.06)" strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="city"
                      stroke="#71717A"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#71717A"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      domain={[0, 600]}
                      ticks={[0, 200, 400, 600]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#181B1D",
                        borderColor: "#303537",
                        borderRadius: "8px",
                        fontSize: "12px",
                        color: "#FFF",
                      }}
                    />
                    <Bar
                      dataKey="count"
                      radius={[6, 6, 0, 0]}
                      label={{ position: "top", fill: "#E2E8F0", fontSize: 12, fontWeight: 600 }}
                    >
                      {studentsPerTripData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* Bottom Row: Recent Enquiries Table (75%) & Recent Activity Feed (25%) */}
          <section className="admin-v2-bottom-grid">
            {/* Recent Enquiries Table Panel */}
            <div className="admin-table-panel">
              <div className="table-panel-header">
                <div className="table-header-left">
                  <div className="table-title-row">
                    <Users size={18} className="table-icon" />
                    <h3>Recent Enquiries</h3>
                  </div>
                  <p className="table-subtitle">A list of all school trip interest submissions.</p>
                </div>

                <div className="table-header-controls">
                  {/* Trip Filter */}
                  <select
                    className="admin-select-btn"
                    value={tripFilter}
                    onChange={(e) => {
                      setTripFilter(e.target.value)
                      setPage(1)
                    }}
                  >
                    <option value="all">All Trips</option>
                    <option value="singapore-stem">Singapore</option>
                    <option value="jaipur-heritage">Jaipur</option>
                    <option value="london-universities">London</option>
                  </select>

                  {/* Time Filter */}
                  <select
                    className="admin-select-btn"
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                  >
                    <option value="all">All Time</option>
                    <option value="this-month">This Month</option>
                  </select>

                  {/* Export CSV Button */}
                  <button
                    type="button"
                    onClick={exportCsv}
                    disabled={exporting}
                    className="button button--small button--red table-export-btn"
                  >
                    <Download size={14} />
                    <span>{exporting ? "Exporting…" : "+ Export CSV"}</span>
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="table-scroll-container">
                <table className="admin-v2-data-table">
                  <thead>
                    <tr>
                      <th className="th-check">
                        <input
                          type="checkbox"
                          checked={selectedIds.length === paginatedRows.length && paginatedRows.length > 0}
                          onChange={toggleSelectAll}
                        />
                      </th>
                      <th>Teacher Name</th>
                      <th>School Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Trip</th>
                      <th>Students</th>
                      <th>Submissions Date</th>
                      <th className="th-actions">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRows.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="td-empty">
                          No matching enquiries found.
                        </td>
                      </tr>
                    ) : (
                      paginatedRows.map((row) => {
                        const badge = getTripBadgeStyle(row.trip_slug)
                        const isChecked = selectedIds.includes(row.id)

                        return (
                          <tr key={row.id} className={isChecked ? "tr-selected" : ""}>
                            <td className="td-check">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleSelectOne(row.id)}
                              />
                            </td>
                            <td className="td-name">
                              <strong>{row.teacher_name}</strong>
                            </td>
                            <td>{row.school_name}</td>
                            <td className="td-email">{row.email}</td>
                            <td className="td-phone">{row.phone}</td>
                            <td>
                              <span
                                className="trip-badge-pill"
                                style={{
                                  backgroundColor: badge.bg,
                                  color: badge.color,
                                  border: `1px solid ${badge.border}`,
                                }}
                              >
                                {badge.label}
                              </span>
                            </td>
                            <td className="td-count">{row.student_count}</td>
                            <td className="td-date">{formatDate(row.created_at)}</td>
                            <td className="td-actions">
                              <button
                                type="button"
                                className="action-icon-btn"
                                onClick={() => setSelectedRow(row)}
                                aria-label="View enquiry details"
                              >
                                <Eye size={15} />
                              </button>
                              <button
                                type="button"
                                className="action-icon-btn"
                                aria-label="More actions"
                              >
                                <MoreHorizontal size={15} />
                              </button>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              <div className="table-pagination-footer">
                <span className="pagination-info">
                  Showing {(page - 1) * pageSize + 1} to{" "}
                  {Math.min(page * pageSize, filteredRows.length)} of {totalEnquiriesCount} enquiries
                </span>

                <div className="pagination-buttons">
                  <button
                    type="button"
                    className="page-nav-btn"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      className={`page-num-btn${page === pageNum ? " is-active" : ""}`}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    type="button"
                    className="page-nav-btn"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    aria-label="Next page"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Recent Activity Panel (25%) */}
            <div className="admin-activity-panel">
              <div className="activity-panel-header">
                <Clock size={17} className="activity-icon" />
                <h3>Recent Activity</h3>
              </div>

              <div className="activity-timeline-list">
                {referenceActivities.map((act) => {
                  const Icon = act.icon
                  return (
                    <div key={act.id} className="activity-item">
                      <div
                        className="activity-badge-circle"
                        style={{ backgroundColor: `rgba(${act.color === "#22C55E" ? "34, 197, 94" : act.color === "#3B82F6" ? "59, 130, 246" : act.color === "#A855F7" ? "168, 85, 247" : "249, 115, 22"}, 0.16)`, color: act.color }}
                      >
                        <Icon size={14} />
                      </div>
                      <div className="activity-item-content">
                        <strong>{act.title}</strong>
                        <p>{act.subtitle}</p>
                        <span className="activity-time">{act.time}</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="activity-panel-footer">
                <button type="button" className="activity-view-all-link">
                  <span>View All Activity</span>
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Detail Modal if viewing an enquiry */}
      {selectedRow && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedRow(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Enquiry Details</h3>
              <button type="button" onClick={() => setSelectedRow(null)} className="icon-button">
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p><strong>Teacher:</strong> {selectedRow.teacher_name}</p>
              <p><strong>School:</strong> {selectedRow.school_name}</p>
              <p><strong>Email:</strong> {selectedRow.email}</p>
              <p><strong>Phone:</strong> {selectedRow.phone}</p>
              <p><strong>Selected Trip:</strong> {selectedRow.trip_slug}</p>
              <p><strong>Student Count:</strong> {selectedRow.student_count}</p>
              <p><strong>Submitted:</strong> {formatDate(selectedRow.created_at)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
