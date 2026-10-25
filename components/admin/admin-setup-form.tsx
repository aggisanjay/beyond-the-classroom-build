"use client"

import { useState } from "react"

export function AdminSetupForm() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage("")
    setError("")
    setBusy(true)

    try {
      const response = await fetch("/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const result = (await response.json().catch(() => null)) as { message?: string } | null
      if (!response.ok) throw new Error(result?.message ?? "Administrator setup is temporarily unavailable.")
      setMessage(result?.message ?? "If this address is on the administrator allowlist, an invitation will be sent.")
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Administrator setup is temporarily unavailable.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="admin-auth-form" onSubmit={submit}>
      <div className="admin-auth-form__heading">
        <p className="eyebrow"><span className="eyebrow__line" /> CONTROLLED INVITATION</p>
        <h1>Set up access.</h1>
        <p>Only email addresses configured in the server-side administrator allowlist can receive an invitation.</p>
      </div>
      <div className="form-field">
        <label htmlFor="setup-email">Allowlisted email address</label>
        <input id="setup-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@school.org" />
      </div>
      {error && <p className="admin-auth-error" role="alert">{error}</p>}
      {message && <p className="admin-auth-notice" role="status">{message}</p>}
      <button className="button button--red admin-auth-submit" type="submit" disabled={busy}>
        {busy ? "Sending request…" : "Request administrator invitation"}
      </button>
      <p className="admin-auth-footnote">An invitation is sent only when this address is already on the server allowlist.</p>
    </form>
  )
}
