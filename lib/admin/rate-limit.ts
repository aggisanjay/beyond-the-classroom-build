import "server-only"

import { createHmac } from "node:crypto"
import type { SupabaseClient } from "@supabase/supabase-js"

export async function consumeRequestLimit(
  client: SupabaseClient,
  request: Request,
  scope: string,
  maxAttempts: number,
  windowSeconds: number
) {
  const secret = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!secret) throw new Error("Rate limit server configuration is missing.")

  const ip =
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "local"
  const fingerprint = createHmac("sha256", secret).update(`${scope}:${ip}`).digest("hex")
  const { data, error } = await client.rpc("consume_trip_interest_rate_limit", {
    p_fingerprint: fingerprint,
    p_max_attempts: maxAttempts,
    p_window_seconds: windowSeconds,
  })

  if (error) throw new Error("Rate limit check failed.")
  return data === true
}
