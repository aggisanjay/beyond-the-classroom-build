"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser"

export function ResetPasswordForm() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmation, setConfirmation] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    if (password.length < 12) {
      setError("Choose a password with at least 12 characters.")
      return
    }
    if (password !== confirmation) {
      setError("The passwords do not match.")
      return
    }

    setBusy(true)
    try {
      const supabase = createSupabaseBrowserClient()
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) throw updateError
      await supabase.auth.signOut()
      router.replace("/admin/login?message=password-updated")
      router.refresh()
    } catch {
      setError("We could not update the password. Open a fresh recovery link and try again.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="admin-auth-form" onSubmit={submit}>
      <div className="admin-auth-form__heading">
        <p className="eyebrow"><span className="eyebrow__line" /> SECURE ACCOUNT RECOVERY</p>
        <h1>Choose a new password.</h1>
        <p>Use at least 12 characters. This password will be managed by Supabase Auth.</p>
      </div>
      <div className="form-field">
        <label htmlFor="new-password">New password</label>
        <input id="new-password" type="password" autoComplete="new-password" required minLength={12} value={password} onChange={(event) => setPassword(event.target.value)} />
      </div>
      <div className="form-field">
        <label htmlFor="confirm-password">Confirm new password</label>
        <input id="confirm-password" type="password" autoComplete="new-password" required minLength={12} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} />
      </div>
      {error && <p className="admin-auth-error" role="alert">{error}</p>}
      <button className="button button--red admin-auth-submit" type="submit" disabled={busy}>
        {busy ? "Updating password…" : "Update password"}
      </button>
    </form>
  )
}
