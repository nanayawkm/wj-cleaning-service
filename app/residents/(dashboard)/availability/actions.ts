"use server"

import { revalidatePath } from "next/cache"
import { createSupabaseServerClient } from "@/lib/supabase/server"

/**
 * All writes run under the signed-in session, so Row Level Security applies.
 * A caller who is not on the admin allowlist is refused by Postgres — not by a
 * check in this file that could be forgotten or bypassed.
 */

async function requireSession() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not signed in")
  return supabase
}

export async function toggleSlot(weekday: number, time: string, enable: boolean) {
  const supabase = await requireSession()

  if (enable) {
    await supabase
      .from("availability_rules")
      .upsert({ weekday, start_time: `${time}:00`, active: true }, { onConflict: "weekday,start_time" })
  } else {
    await supabase
      .from("availability_rules")
      .update({ active: false })
      .eq("weekday", weekday)
      .eq("start_time", `${time}:00`)
  }

  revalidatePath("/residents/availability")
}

export async function addOverride(onDate: string, reason: string) {
  const supabase = await requireSession()
  // start_time null blocks the whole day
  await supabase.from("availability_overrides").insert({
    on_date: onDate,
    start_time: null,
    kind: "block",
    reason: reason.trim() || null,
  })
  revalidatePath("/residents/availability")
}

export async function removeOverride(id: string) {
  const supabase = await requireSession()
  await supabase.from("availability_overrides").delete().eq("id", id)
  revalidatePath("/residents/availability")
}
