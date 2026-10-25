import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { consumeRequestLimit } from "@/lib/admin/rate-limit"
import { tripInterestSchema } from "@/lib/validation/trip-interest"

export const dynamic = "force-dynamic"

const NO_STORE = { "Cache-Control": "no-store" }
const MAX_BODY_LENGTH = 8_000

export async function POST(request: Request) {
  const rawBody = await request.text()
  if (rawBody.length > MAX_BODY_LENGTH) {
    return NextResponse.json({ message: "The request is too large." }, { status: 413, headers: NO_STORE })
  }

  let body: unknown
  try {
    body = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ message: "Please submit the form again." }, { status: 400, headers: NO_STORE })
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ message: "Please submit the form again." }, { status: 400, headers: NO_STORE })
  }

  const payload = body as Record<string, unknown>
  if (typeof payload.website === "string" && payload.website.trim()) {
    return NextResponse.json({ message: "We could not verify this request." }, { status: 400, headers: NO_STORE })
  }

  const parsed = tripInterestSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Please check the form details and try again." },
      { status: 400, headers: NO_STORE }
    )
  }

  try {
    const adminClient = createSupabaseAdminClient()
    const allowed = await consumeRequestLimit(adminClient, request, "trip-interest", 8, 3_600)
    if (!allowed) {
      return NextResponse.json(
        { message: "Too many enquiries from this connection. Please try again later." },
        { status: 429, headers: NO_STORE }
      )
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
    const publicKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !publicKey) {
      return NextResponse.json(
        { message: "Enquiry submission is temporarily unavailable. Please try again later." },
        { status: 503, headers: NO_STORE }
      )
    }

    const publicClient = createClient(url, publicKey, {
      auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    })
    const { error } = await publicClient.from("trip_interests").insert({
      teacher_name: parsed.data.teacherName,
      school_name: parsed.data.schoolName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      trip_slug: parsed.data.tripSlug,
      student_count: parsed.data.studentCount,
    })

    if (error) {
      return NextResponse.json(
        { message: "We could not save your enquiry. Please try again shortly." },
        { status: 503, headers: NO_STORE }
      )
    }

    return NextResponse.json(
      { ok: true, message: "Your school interest has been received." },
      { status: 201, headers: NO_STORE }
    )
  } catch {
    return NextResponse.json(
      { message: "Enquiry submission is temporarily unavailable. Please try again later." },
      { status: 503, headers: NO_STORE }
    )
  }
}
