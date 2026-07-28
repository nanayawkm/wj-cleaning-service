"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CircleNotch, Lock } from "@phosphor-icons/react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

/**
 * `next` arrives in the URL, so it is attacker-controlled. Left unchecked,
 * /residents/login?next=https://evil.example would land Jackie on someone else's
 * page immediately after a successful sign-in — the ideal moment to ask her to
 * "confirm" her password. Only in-app admin paths are honoured.
 *
 * Protocol-relative URLs (`//evil.example`) start with "/" too, hence the
 * second test rather than a bare startsWith.
 */
function safeNext(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/residents"
  return raw === "/residents" || raw.startsWith("/residents/") ? raw : "/residents"
}

function AdminLoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function signIn(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)

    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      // Deliberately vague: distinguishing "no such user" from "wrong password"
      // turns this form into a way to discover who has an account.
      setError("Those details were not recognised.")
      setBusy(false)
      return
    }

    router.push(safeNext(params.get("next")))
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/70 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="inline-flex h-11 w-11 items-center justify-center bg-wj-dark">
            <Lock weight="fill" className="h-5 w-5 text-white" />
          </span>
          <h1 className="mt-4 text-lg font-semibold tracking-tight text-gray-900">
            WJ Cleaning Services
          </h1>
          <p className="mt-1 text-sm text-gray-500">Dashboard sign in</p>
        </div>

        <form onSubmit={signIn} className="space-y-4 border border-gray-200 bg-white p-6">
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
            <Input
              id="email" type="email" autoComplete="username" inputMode="email" required
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 h-11 rounded-none border-gray-300 bg-white"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
            <Input
              id="password" type="password" autoComplete="current-password" required
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 h-11 rounded-none border-gray-300 bg-white"
            />
          </div>

          {error && (
            <p role="alert" className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="inline-flex h-11 w-full items-center justify-center bg-wj-dark text-sm font-semibold text-white transition-colors hover:bg-wj-hover disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
          >
            {busy ? <CircleNotch className="h-5 w-5 animate-spin" /> : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  )
}

// useSearchParams needs a boundary above it or the build refuses to prerender.
export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50/70" />}>
      <AdminLoginForm />
    </Suspense>
  )
}
