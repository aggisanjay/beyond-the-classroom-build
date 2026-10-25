import { NextResponse } from "next/server"
import { z } from "zod"
import { isAuthorizedAdminEmail } from "@/lib/admin/access"
import { consumeRequestLimit } from "@/lib/admin/rate-limit"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { getAuthRedirectUrl } from "@/lib/supabase/redirect"

export const dynamic = "force-dynamic"

const inviteSchema = z.object({
  email: z.string().trim().max(254).refine((value) => z.email().safeParse(value).success),
})
const genericResponse = {
  message: "If this address is on the administrator allowlist, an invitation will be sent.",
}

export async function POST(request: Request) {
  const rawBody = await request.text()
  if (rawBody.length > 2_000) {
    return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400, headers: { "Cache-Control": "no-store" } })
  }

  let body: unknown
  try {
    body = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400, headers: { "Cache-Control": "no-store" } })
  }

  const parsed = inviteSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400, headers: { "Cache-Control": "no-store" } })
  }

  const email = parsed.data.email.toLowerCase()
  if (!isAuthorizedAdminEmail(email)) {
    return NextResponse.json(genericResponse, { status: 202, headers: { "Cache-Control": "no-store" } })
  }

  try {
    const adminClient = createSupabaseAdminClient()
    const allowed = await consumeRequestLimit(adminClient, request, "admin-invite", 3, 86_400)
    if (!allowed) {
      return NextResponse.json(
        { message: "Too many setup requests. Please try again later." },
        { status: 429, headers: { "Cache-Control": "no-store" } }
      )
    }

    await adminClient.auth.admin.inviteUserByEmail(email, {
      redirectTo: getAuthRedirectUrl(new URL(request.url).origin, "/admin/reset-password"),
    })
    return NextResponse.json(genericResponse, { status: 202, headers: { "Cache-Control": "no-store" } })
  } catch {
    return NextResponse.json(
      { message: "Administrator setup is temporarily unavailable. Please try again later." },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    )
  }
}
