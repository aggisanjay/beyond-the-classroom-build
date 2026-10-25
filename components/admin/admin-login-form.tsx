"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser"
import { getAuthRedirectUrl } from "@/lib/supabase/redirect"

export function AdminLoginForm({ initialMessage }: { initialMessage?: string }) {
  const router = useRouter()
  const [mode, setMode] = useState<"login" | "recovery">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [notice, setNotice] = useState(initialMessage ?? "")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setNotice("")
    setBusy(true)

    try {
      const supabase = createSupabaseBrowserClient()
      if (mode === "recovery") {
        const { error: recoveryError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: getAuthRedirectUrl(window.location.origin, "/admin/reset-password"),
        })
        if (recoveryError) throw recoveryError
        setNotice("If this address belongs to an administrator account, a recovery link will arrive by email.")
        return
      }

      const { error: loginError } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      if (loginError) throw loginError
      router.replace("/admin")
      router.refresh()
    } catch (err) {
      const msg = err instanceof Error ? err.message : ""
      if (msg && !msg.toLowerCase().includes("object")) {
        setError(msg)
      } else {
        setError(mode === "login"
          ? "We could not sign you in. Check your email and password, and confirm that the account is on the administrator allowlist."
          : "We could not start password recovery. Please try again later.")
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="admin-auth-form" onSubmit={handleSubmit}>
      <div className="admin-auth-form__heading">
        <p className="eyebrow"><span className="eyebrow__line" /> ADMINISTRATOR ACCESS</p>
        <h1>{mode === "login" ? "Welcome back." : "Reset your password."}</h1>
        <p>{mode === "login" ? "Sign in with an authorized administrator account." : "Enter your administrator email to request a secure recovery link."}</p>
      </div>

      <div className="form-field">
        <label htmlFor="admin-email">Email address</label>
        <input id="admin-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@school.org" />
      </div>
      {mode === "login" && (
        <div className="form-field">
          <label htmlFor="admin-password">Password</label>
          <input id="admin-password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" />
        </div>
      )}

      {error && <p className="admin-auth-error" role="alert">{error}</p>}
      {notice && <p className="admin-auth-notice" role="status">{notice}</p>}

      <button className="button button--red admin-auth-submit" type="submit" disabled={busy}>
        {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Send recovery link"}
      </button>

      <div className="admin-auth-form__links">
        {mode === "login" ? (
          <>
            <button type="button" className="text-button" onClick={() => { setMode("recovery"); setError(""); setNotice("") }}>Forgot password?</button>
            <Link href="/admin/setup">Set up an authorized administrator</Link>
          </>
        ) : (
          <button type="button" className="text-button" onClick={() => { setMode("login"); setError(""); setNotice("") }}>Back to sign in</button>
        )}
      </div>
    </form>
  )
}
