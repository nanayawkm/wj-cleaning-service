import "server-only"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { AdminBooking } from "./booking-panel"

const SELECT = `id, reference, starts_at, ends_at, status, m2_label, deep_cleaning,
  duration_min, total_cents, paid_at, source, notes, admin_notes,
  customers ( name, email, phone, street, postcode, city ),
  booking_addons ( name_en )`

type Row = {
  id: string; reference: string; starts_at: string; ends_at: string; status: string
  m2_label: string | null; deep_cleaning: boolean; duration_min: number
  total_cents: number; paid_at: string | null; source: string
  notes: string | null; admin_notes: string | null
  customers: unknown
  booking_addons: { name_en: string }[] | null
}

const shape = (b: Row): AdminBooking => ({
  id: b.id,
  reference: b.reference,
  startsAt: b.starts_at,
  // ends_at includes the 30-minute travel buffer, which is Jackie's journey
  // home rather than part of the job. Show when the work actually finishes.
  endsAt: new Date(new Date(b.starts_at).getTime() + b.duration_min * 60_000).toISOString(),
  status: b.status,
  m2Label: b.m2_label ?? "",
  deepCleaning: Boolean(b.deep_cleaning),
  // The picker needs this to size slots correctly when rescheduling.
  washingUp: (b.booking_addons ?? []).some((a) => /washing/i.test(a.name_en)),
  durationMin: b.duration_min,
  totalCents: b.total_cents,
  paidAt: b.paid_at,
  source: b.source,
  notes: b.notes,
  adminNotes: b.admin_notes,
  customer: (Array.isArray(b.customers) ? b.customers[0] : b.customers) as AdminBooking["customer"],
})

/**
 * Every read runs under Jackie's session, so Row Level Security does the
 * filtering rather than a `where` clause that could be forgotten.
 */
export async function getAdminBookings(): Promise<AdminBooking[]> {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from("bookings")
    .select(SELECT)
    .order("starts_at", { ascending: true })
    .limit(500)
  return ((data ?? []) as unknown as Row[]).map(shape)
}

/** Jobs for one calendar day in Amsterdam, in the order they happen. */
export async function getBookingsForDay(dateISO: string): Promise<AdminBooking[]> {
  const supabase = await createSupabaseServerClient()
  // Widened by a day either side, then filtered by the local date string, so a
  // job at 23:00 local is not lost to the UTC offset.
  const from = new Date(`${dateISO}T00:00:00Z`)
  from.setUTCDate(from.getUTCDate() - 1)
  const to = new Date(`${dateISO}T00:00:00Z`)
  to.setUTCDate(to.getUTCDate() + 2)

  const { data } = await supabase
    .from("bookings")
    .select(SELECT)
    .gte("starts_at", from.toISOString())
    .lt("starts_at", to.toISOString())
    .order("starts_at", { ascending: true })

  const local = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Amsterdam" })
  return ((data ?? []) as unknown as Row[])
    .filter((b) => local.format(new Date(b.starts_at)) === dateISO)
    .map(shape)
}
