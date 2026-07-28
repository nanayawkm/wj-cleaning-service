"use client"

import { createBrowserClient } from "@supabase/ssr"

/**
 * Browser client. Only ever sees the anon key, which is public by design —
 * Row Level Security is what protects the data. Used for Jackie's login form;
 * the public booking form posts to an API route instead, so no customer data
 * is ever readable from the browser.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
