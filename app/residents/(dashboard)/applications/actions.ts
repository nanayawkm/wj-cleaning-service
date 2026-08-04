"use server"

import { revalidatePath } from "next/cache"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { RETENTION_MONTHS, STATUSES, type ApplicationStatus } from "./shared"

/**
 * Applications are managed under Jackie's own session, so Row Level Security
 * decides every write rather than a service key that would bypass it. The
 * public form is the only thing that uses the service role, and it only ever
 * inserts.
 *
 * Unlike discount codes, these rows genuinely are deleted. An applicant has a
 * right to have their data removed, and the consent text on /careers promises
 * it after twelve months — a soft "archived" flag would make that promise
 * false while looking like it kept it.
 */

export type Result = { ok: true } | { ok: false; error: string }

const refresh = () => revalidatePath("/residents/applications")

export async function setApplicationStatus(id: string, status: ApplicationStatus): Promise<Result> {
  // Checked here, not just in the UI: a server action is a public endpoint, and
  // an unknown value would otherwise hit the table's check constraint as a 500.
  if (!STATUSES.includes(status)) return { ok: false, error: "Unknown status." }

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("applications")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id")

  if (error) return { ok: false, error: "Could not update the application." }
  if (!data?.length) return { ok: false, error: "Application not found." }
  refresh()
  return { ok: true }
}

export async function saveApplicationNotes(id: string, notes: string): Promise<Result> {
  const trimmed = notes.trim().slice(0, 2000)

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("applications")
    .update({ notes: trimmed || null, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id")

  if (error) return { ok: false, error: "Could not save the note." }
  if (!data?.length) return { ok: false, error: "Application not found." }
  refresh()
  return { ok: true }
}

export async function deleteApplication(id: string): Promise<Result> {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from("applications").delete().eq("id", id)

  if (error) return { ok: false, error: "Could not delete the application." }
  refresh()
  return { ok: true }
}

/**
 * Deletes everything past the retention period in one go.
 *
 * The cutoff is recomputed here rather than taking a list of ids from the
 * browser — otherwise the button would be an "delete these arbitrary rows"
 * endpoint wearing a retention label.
 */
export async function purgeOverdueApplications(): Promise<Result & { deleted?: number }> {
  const cutoff = new Date()
  cutoff.setMonth(cutoff.getMonth() - RETENTION_MONTHS)

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("applications")
    .delete()
    .lt("consent_at", cutoff.toISOString())
    .select("id")

  if (error) return { ok: false, error: "Could not delete those applications." }
  refresh()
  return { ok: true, deleted: data?.length ?? 0 }
}
