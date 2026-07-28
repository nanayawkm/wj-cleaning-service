import { redirect } from "next/navigation"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { signOutAction } from "../actions"
import { AdminNav } from "./nav"

export const dynamic = "force-dynamic"

/**
 * Second of the three access layers. Middleware proves there is a session;
 * this proves the session belongs to someone on the allowlist. A signed-in
 * user who is not an admin gets nothing — which matters because Supabase
 * allows public signup by default.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/residents/login")

  const { data: allowed } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle()

  if (!allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4 text-center">
        <div className="max-w-sm border border-gray-200 bg-white p-8">
          <h1 className="text-lg font-semibold text-gray-900">No access</h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            This account is not authorised for the dashboard.
          </p>
          <form action={signOutAction} className="mt-5">
            <button className="inline-flex h-11 items-center justify-center border border-gray-300 px-5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50">
              Sign out
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    /*
      The ground colour sits on the wrapper, not on <main>. On <main> it only
      reached as far as the content did, so a short page left a band of the
      public site's cream showing underneath.
    */
    <div className="min-h-screen bg-gray-50/70 lg:flex">
      <AdminNav email={user.email ?? ""} signOut={signOutAction} />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  )
}
