import "server-only"

import { createServerClient } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

/**
 * Server-side Supabase clients.
 *
 * `server-only` at the top is deliberate: importing this file from a client
 * component becomes a build error rather than a silent leak of the service-role
 * key into the browser bundle.
 */

const url = () => {
  const v = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!v) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set")
  return v
}

/**
 * Request-scoped client carrying the signed-in user's session.
 *
 * Use this for anything on Jackie's behalf. Every query still passes through
 * Row Level Security, so a missing `where` clause cannot expose other rows.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(url(), process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Called from a Server Component, where cookies are read-only.
          // Middleware refreshes the session, so this is safe to swallow.
        }
      },
    },
  })
}

/**
 * Service-role client. Bypasses Row Level Security entirely.
 *
 * Only for work that has no signed-in user and genuinely cannot be done under
 * RLS: writing a booking from the public form, reading free/busy for the
 * calendar, sending reminders from cron. Every one of those must filter
 * explicitly and must never return raw customer rows to the caller.
 */
export function createSupabaseAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set")

  return createClient(url(), key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
