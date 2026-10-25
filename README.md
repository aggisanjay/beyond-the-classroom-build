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
- Full mobile responsiveness across viewports from 320px smartphones to 4K ultra-wide monitors.

---

## 2. Technology Stack

- **Framework**: Next.js 16 (App Router, Turbopack, Server Components by default)
- **Frontend & Styling**: React 19, Vanilla CSS Design System, Tailwind CSS v4, Lucide React icons
- **Animations**: Motion for React (Framer Motion) with viewport reveals and reduced-motion support
- **Database & Auth**: Supabase PostgreSQL, `@supabase/ssr`, Row Level Security (RLS)
- **Data Visualization**: Recharts (smooth AreaChart timeline with glow gradients, multi-color BarChart, circular SVG percentage rings)
- **Validation**: React Hook Form, Zod schema validation
- **Package Management**: `pnpm` (with `onlyBuiltDependencies` pre-configured for pnpm v10+) & `npm`
- **Deployment**: Vercel ready with zero configuration

---

## 3. Key Features & Visual Design

1. **Brand Identity & Favicon**:
   - Custom geometric red origami bird brand icon representing exploration, flight, and guidance.
   - Standalone SVG favicon (`/icon.svg`) set in both dark and light browser tab bars.

2. **Cinematic Hero with Auto-Carousel**:
   - Automatically advances destinations every 2 seconds, with pause on hover/focus and touch swipe support.
   - Dynamic right-rail destination pills with active indicator bars and `<` `>` arrows.

3. **Trust & Value Strip**:
   - 5 core propositions with bespoke red icons (*Curated Itineraries, Real-World Learning, Safe & Supported, Global Destinations, Trusted by Schools*).
   - Clean vertical dividers and 2-column/1-column responsive wrapping on tablet and mobile.

4. **Featured Destinations with Day Preview Strips**:
   - High-contrast destination cards with colored category badges (`.dest-badge--cyan`, `.dest-badge--amber`, `.dest-badge--blue`), zoom hover animations, and structured Day 1/2/3 stops preview.

5. **Editorial Storytelling ("Why Educational Travel Matters")**:
   - Split layout with Lake Kawaguchi & Mount Fuji scenic backdrop, concise copy, and 3 stacked feature cards (*STEM & Innovation, Cultural Understanding, Future-Ready Skills*).
   - Balanced 88px vertical breathing room connecting seamlessly from the destinations grid.

6. **How School Trips Work**:
   - 3-step process (*01 Explore Destinations*, *02 Register Interest*, *03 Discuss & Plan*) connected by a continuous horizontal bar against an atmospheric Kyoto evening pagoda streetscape.
   - Automatically switches to clean vertical step cards on mobile.

7. **Dedicated Destination Detail Pages** (`/trips/[slug]`):
   - Singapore STEM, Jaipur Heritage, and London Universities.
   - 4-feature highlights bar, 7 iconic places grid (4 top, 3 bottom), 5 curated photo gallery tiles with frosted camera badges, and embedded registration form.

8. **Production-Grade Registration Form** (`/register`):
   - Full client & server validation with Zod, honeypot spam protection, and direct write to Supabase PostgreSQL.

9. **Admin Command Center** (`/admin`):
   - Left sidebar with active red pill navigation, elevated scenic promo card, and mobile drawer support.
   - Top search bar, notification bell, user profile chip with direct logout button.
   - Mount Fuji hero banner with floating *Total Interested Students* KPI card.
   - 5 metric cards featuring SVG sparklines and circular percentage rings in a single balanced row.
   - *Enquiries Over Time* area chart and *Students per Trip* colored bar chart.
   - Filterable, sortable, paginated enquiries table with color-coded trip pills and CSV export.
   - Real-time recent activity feed with matched panel heights.

---

## 4. Local Installation

```powershell
# 1. Clone repository
git clone https://github.com/your-org/beyond-the-classroom-build.git
cd beyond-the-classroom-build

# 2. Install dependencies (pnpm v10+ or npm)
pnpm install
# or
npm install
```

> **Note**: For `pnpm` users, build script approvals (`allowBuilds`) for native dependencies like `sharp` and `unrs-resolver` are already pre-configured in `pnpm-workspace.yaml` and `package.json`.

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

*(Refer to `.env.example` for a complete reference).*

---

## 6. Supabase Database Setup & SQL Migration

The migration file is located at [`supabase/migrations/20261025000000_create_trip_interests.sql`](supabase/migrations/20261025000000_create_trip_interests.sql).

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

## 7. Row Level Security (RLS) & Administrator Authorization

- **Public Visitors (`anon`)**:
  - May `INSERT` valid records into `public.trip_interests` subject to field length, regex, and trip slug constraints.
  - Denied `SELECT`, `UPDATE`, and `DELETE`.
- **Server / Admin (`service_role`)**:
  - Full CRUD operations permitted on server endpoints only.
- **Admin Access Check**:
  - Enforced via server-side session lookup combined with `ADMIN_EMAILS` allowlist validation in [`lib/admin/access.ts`](lib/admin/access.ts).

---

## 8. Supabase Email Authentication & Admin Access

Default administrative login credentials:
- **Email**: `admin@school.org`
- **Password**: `AdminPassword123!`

To add more admins:
1. Add their email to `ADMIN_EMAILS` in `.env`.
2. In Supabase Dashboard → **Authentication** → **Users** → click **Add user** → **Create user** (turn on *Auto Confirm User*).
3. Log in at `http://localhost:3000/admin/login`.

---

## 9. Development Commands

```powershell
# Start Next.js development server
pnpm dev
# or: npm run dev

# Run ESLint validation
pnpm lint
# or: npm run lint

# Compile production bundle
pnpm build
# or: npm run build

# Start production server
pnpm start
# or: npm run start
```

---

## 10. Vercel Deployment Instructions

1. Push code to GitHub.
2. In [Vercel](https://vercel.com), import the Git repository.
3. In **Settings** → **Environment Variables**, configure:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_EMAILS`
4. Click **Deploy**.
5. In Supabase Dashboard → **Authentication** → **URL Configuration**, add your Vercel deployment URL to **Redirect URLs**:
   - `https://your-app.vercel.app/**`

---

## 11. Known Limitations

- All itineraries are proposed educational journeys rather than confirmed flight bookings.
- Rate limiting relies on database-backed fingerprint windows.

---

## 12. Future Enhancements

- Automated email confirmation to teachers upon registration using Resend or Postmark.
- PDF export of customized school trip itineraries.
- Multi-tier admin roles (super-admin, reviewer, read-only coordinator).
- Direct WhatsApp enquiry follow-up integration.

---

## 13. AI Tools Used

- **Google DeepMind Antigravity**: Used for architectural scaffolding, TypeScript strict typing, responsive CSS styling matching reference images, Recharts data visualization, and build verification. All code, database schemas, and builds were personally verified and tested locally.
