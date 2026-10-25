export function getAuthRedirectUrl(origin: string, nextPath: string) {
  const configuredRedirect = process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL?.trim()
  const callbackUrl = configuredRedirect || new URL("/auth/callback", origin).toString()
  const redirectUrl = new URL(callbackUrl)
  redirectUrl.searchParams.set("next", nextPath)
  return redirectUrl.toString()
}
