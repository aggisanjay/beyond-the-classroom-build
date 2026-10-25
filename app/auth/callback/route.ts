import { NextResponse, type NextRequest } from "next/server"
import type { EmailOtpType } from "@supabase/supabase-js"
import { createSupabaseServerClient } from "@/lib/supabase/server"

const EMAIL_OTP_TYPES: EmailOtpType[] = ["email", "recovery", "invite", "signup", "email_change", "magiclink"]

function safeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/admin"
  return value
}

export async function GET(request: NextRequest) {
  const callbackUrl = request.nextUrl
  const nextPath = safeNextPath(callbackUrl.searchParams.get("next"))
  const supabase = await createSupabaseServerClient()
  const tokenHash = callbackUrl.searchParams.get("token_hash")
  const requestedType = callbackUrl.searchParams.get("type")
  const code = callbackUrl.searchParams.get("code")
  let error: { message: string } | null = null

  if (tokenHash && requestedType && EMAIL_OTP_TYPES.includes(requestedType as EmailOtpType)) {
    const result = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: requestedType as EmailOtpType,
    })
    error = result.error
  } else if (code) {
    const result = await supabase.auth.exchangeCodeForSession(code)
    error = result.error
  } else {
    error = { message: "Invalid authentication callback." }
  }

  if (!error) {
    return NextResponse.redirect(new URL(nextPath, request.url))
  }

  return NextResponse.redirect(new URL("/admin/login?error=auth", request.url))
}
