import "server-only"

import { createSupabaseServerClient } from "@/lib/supabase/server"

export function isAuthorizedAdminEmail(email: string | null | undefined) {
  if (!email) return false

  const allowedEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)

  return allowedEmails.includes(email.trim().toLowerCase())
}

export async function getAdminAccess() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return { supabase, user: null, isAdmin: false }
  }

  return {
    supabase,
    user,
    isAdmin: isAuthorizedAdminEmail(user.email),
  }
}
