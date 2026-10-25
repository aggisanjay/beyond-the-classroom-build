# Beyond the Classroom — Premium School Trip Discovery & Interest Platform

> **"Learning Has No Borders."**  
> An international educational travel platform designed to inspire educators, showcase curated academic journeys, and capture qualified school enquiries with a secure, real-time administrator command center.

---

## 1. Project Overview

**Beyond the Classroom** is a cinematic, editorial web application built for international school trip exploration. It offers:
- An immersive photographic experience for three flagship itineraries: **Singapore STEM Expedition**, **Jaipur Heritage Journey**, and **London University Discovery**.
- Complete itinerary day breakdowns, educational objectives, learning outcomes, and suggested student age brackets.
- A validated teacher interest submission pipeline backed by Supabase PostgreSQL and Row Level Security (RLS).
- A secure, analytics-driven **Administrator Dashboard** (`/admin`) displaying enquiry metrics, student volume charts, destination breakdown donuts, recent activity feeds, and CSV export.

---

## 2. Technology Stack

- **Framework**: Next.js 16 (App Router, Turbopack, Server Components by default)
- **Frontend & Styling**: React 19, Vanilla CSS Design System, Tailwind CSS v4, Lucide React icons
- **Animations**: Motion for React (Framer Motion) with viewport reveals and reduced-motion support
- **Database & Auth**: Supabase PostgreSQL, `@supabase/ssr`, Row Level Security (RLS)
- **Data Visualization**: Recharts (smooth AreaChart timeline with glow gradients, multi-color BarChart, circular SVG percentage rings)
- **Validation**: React Hook Form, Zod schema validation
- **Deployment**: Vercel ready with zero configuration

---

## 3. Key Features

1. **Cinematic Hero with Auto-Carousel**:
   - Automatically advances destinations every 2 seconds, with pause on hover/focus and swipe gestures.
   - Dynamic right-rail destination pills with active indicator bars and `<` `>` arrows.
2. **Trust & Value Strip**:
   - 5 core propositions with bespoke red icons (*Curated Itineraries, Real-World Learning, Safe & Supported, Global Destinations, Trusted by Schools*).
3. **Featured Destinations with Day Preview Strips**:
   - Destination cards with category badges, photography, zoom hover states, and 3 day-by-day preview items per card.
4. **Editorial Storytelling ("Create Memories That Last a Lifetime")**:
   - Split layout with Mount Fuji/Torii backdrop and 3 stacked feature cards with icons and imagery.
5. **How School Trips Work**:
   - 3-step process (*01 Explore Destinations*, *02 Register Interest*, *03 Discuss & Plan*) with connected numbered badges.
6. **3 Dedicated Destination Detail Pages** (`/trips/[slug]`):
   - Singapore STEM, Jaipur Heritage, and London Universities.
   - 4-feature highlights bar, 7 iconic places grid (4 top, 3 bottom), 5 curated photo gallery tiles, and embedded registration form.
7. **Production-Grade Registration Form** (`/register`):
   - Full client & server validation with Zod, honeypot spam protection, and direct write to Supabase PostgreSQL.
8. **Admin Command Center** (`/admin`):
   - Pixel-accurate implementation of the reference design:
     - Left sidebar with active red pill navigation, scenic promo card, user avatar, and logout.
     - Top search bar and notification bell.
     - Mount Fuji hero banner with floating *Total Interested Students* KPI card.
     - 5 metric cards featuring live SVG sparklines and circular percentage rings.
     - *Enquiries Over Time* area chart and *Students per Trip* colored bar chart.
     - Filterable, sortable, paginated enquiries table with color-coded trip pills and CSV export.
     - Real-time recent activity feed.

---

## 4. Local Installation

```powershell
# 1. Clone repository
git clone https://github.com/your-org/beyond-the-classroom-build.git
cd beyond-the-classroom-build

# 2. Install dependencies (peer dependencies handled via .npmrc)
npm install
```

---

## 5. Required Environment Variables

Create a `.env` (or `.env.local`) file in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-or-publishable-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Admin Allowlist (comma-separated authorized emails)
ADMIN_EMAILS=admin@school.org
```

*(Refer to `.env.example` for reference).*

---

## 6. Supabase Project Setup & 7. SQL Migration

The migration file is located at [`supabase/migrations/20261025000000_create_trip_interests.sql`](file:///c:/Users/aggis/Desktop/beyond-the-classroom-build/supabase/migrations/20261025000000_create_trip_interests.sql).

To apply it:
1. Open the **SQL Editor** in your [Supabase Dashboard](https://supabase.com/dashboard).
2. Paste the contents of `supabase/migrations/20261025000000_create_trip_interests.sql`.
3. Click **Run**.

This migration creates:
- `public.trip_interests` table with constraints and indexes.
- `private.trip_interest_rate_limits` table in private schema.
- `consume_trip_interest_rate_limit` RPC function.
- `get_trip_interest_analytics` RPC aggregation function.

---

## 8. Row Level Security (RLS) & Administrator Authorization

- **Public Visitors (`anon`)**:
  - May `INSERT` valid records into `public.trip_interests` subject to field length, regex, and trip slug constraints.
  - Denied `SELECT`, `UPDATE`, and `DELETE`.
- **Server / Admin (`service_role`)**:
  - Full CRUD operations permitted on server endpoints only.
- **Admin Access Check**:
  - Enforced via server-side session lookup combined with `ADMIN_EMAILS` allowlist validation in [`lib/admin/access.ts`](file:///c:/Users/aggis/Desktop/beyond-the-classroom-build/lib/admin/access.ts).

---

## 9. Supabase Email Authentication & 10. How to Create the First Admin

Your admin user is configured for:
- **Email**: `admin@school.org`
- **Password**: `AdminPassword123!`

To add more admins:
1. Add their email to `ADMIN_EMAILS` in `.env`.
2. In Supabase Dashboard → **Authentication** → **Users** → click **Add user** → **Create user** (turn on *Auto Confirm User*).
3. Log in at `http://localhost:3000/admin/login`.

---

## 11. Local Development Commands

```powershell
# Start Next.js development server
npm run dev

# Run ESLint validation
npm run lint

# Compile production bundle
npm run build

# Start production server
npm run start
```

---

## 12. Testing and Build Commands

```powershell
# Run production build and verify type checking
npx next build
```

---

## 13. Vercel Deployment Instructions

1. Push your code to GitHub.
2. In [Vercel](https://vercel.com), import the Git repository.
3. In **Settings** → **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_EMAILS`
4. Click **Deploy**.
5. In Supabase Dashboard → **Authentication** → **URL Configuration**, add your Vercel deployment URL to **Redirect URLs**:
   - `https://your-app.vercel.app/**`

---

## 14. Known Limitations

- All itineraries are proposed educational journeys rather than confirmed flight bookings.
- Rate limiting relies on database-backed fingerprint windows.

---

## 15. What You Would Add Next

- Automated email confirmation to teachers upon registration using Resend or Postmark.
- PDF export of customized school trip itineraries.
- Multi-tier admin roles (super-admin, reviewer, read-only coordinator).
- Direct WhatsApp enquiry follow-up integration.

---

## 16. AI Tools Used

- **Google DeepMind Antigravity**: Used for architectural scaffolding, TypeScript strict typing, responsive CSS styling matching reference images, Recharts data visualization, and build verification. All code, database schemas, and builds were personally verified and tested locally.
