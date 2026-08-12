"use server"

import { revalidatePath } from "next/cache"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { checkInvoice, summarise } from "@/lib/invoicing/compliance"
import { calculateInvoice, roundCents } from "@/lib/invoicing/money"
import type { DraftLine, VatRate } from "@/lib/invoicing/money"
import { renderInvoicePdf } from "@/lib/invoicing/pdf"
import type { PdfInvoice } from "@/lib/invoicing/pdf"

/**
 * Everything Jackie can do to an invoice.
 *
 * These run under her own session, never the service-role key, so Row Level
 * Security decides whether each write is allowed. A signed-in account that is
 * not on the admin allowlist gets a failed write rather than a silent success.
 *
 * The ordering inside `finaliseInvoice` is the important part of this file —
 * see the comment there.
 */

export type Result<T = undefined> =
  | ({ ok: true } & (T extends undefined ? object : { data: T }))
  | { ok: false; error: string }

const fail = (error: string) => ({ ok: false as const, error })

const refresh = () => {
  revalidatePath("/residents/invoices")
  revalidatePath("/residents")
}

/** `2026-08-10` → `10-08-2026`, the format on her invoices. */
const dutchDate = (iso: string): string => {
  const [y, m, d] = iso.slice(0, 10).split("-")
  return `${d}-${m}-${y}`
}

export interface LineInput {
  description: string
  subline?: string | null
  unitCents: number
  qty: number
  vatRate: VatRate
  bookingId?: string | null
}

/* ══════════════════════════════════════════════════════════════ create */

export async function createDraft(
  customerId: string,
  isTest = false,
): Promise<Result<{ id: string }>> {
  const supabase = await createSupabaseServerClient()

  const { data: customer } = await supabase
    .from("customers")
    .select("id, segment")
    .eq("id", customerId)
    .maybeSingle()

  if (!customer) return fail("That customer no longer exists.")

  // Residential prices are quoted inclusive of btw; business prices exclusive.
  // Only a default — she can flip it on the invoice.
  const pricesIncludeVat = (customer.segment ?? "residential") === "residential"

  const { data, error } = await supabase
    .from("invoices")
    .insert({ customer_id: customerId, prices_include_vat: pricesIncludeVat, is_test: isTest })
    .select("id")
    .single()

  if (error || !data) return fail("Could not start the invoice. Please try again.")
  refresh()
  return { ok: true, data: { id: data.id as string } }
}

/* ═══════════════════════════════════════════════════════════ save draft */

/**
 * Replaces the draft wholesale. Called on every change, so a phone call
 * mid-invoice never loses the work.
 *
 * An issued invoice is never editable — that is enforced here as well as by
 * the check constraint, because this is where the attempt would arrive.
 */
export async function saveDraft(
  id: string,
  input: {
    lines: LineInput[]
    pricesIncludeVat: boolean
    language: "nl" | "en"
    serviceDate?: string | null
    reverseCharge?: boolean
    notes?: string | null
  },
): Promise<Result> {
  const supabase = await createSupabaseServerClient()

  const { data: inv } = await supabase.from("invoices").select("id, status").eq("id", id).maybeSingle()
  if (!inv) return fail("Invoice not found.")
  if (inv.status !== "draft") return fail("This invoice has been issued and can no longer be edited.")

  const totals = calculateInvoice(
    input.lines.map<DraftLine>((l) => ({ unitCents: l.unitCents, qty: l.qty, vatRate: l.vatRate })),
    input.pricesIncludeVat,
  )

  const { error: headError } = await supabase
    .from("invoices")
    .update({
      prices_include_vat: input.pricesIncludeVat,
      language: input.language,
      service_date: input.serviceDate ?? null,
      reverse_charge: input.reverseCharge ?? false,
      notes: input.notes ?? null,
      net_cents: totals.netCents,
      vat_cents: totals.vatCents,
      gross_cents: totals.grossCents,
      vat_breakdown: totals.breakdown,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (headError) return fail("Could not save. Please try again.")

  // Wholesale replace: reordering and deleting lines otherwise needs a diff,
  // and a draft is cheap to rewrite.
  await supabase.from("invoice_lines").delete().eq("invoice_id", id)

  if (input.lines.length > 0) {
    const { error } = await supabase.from("invoice_lines").insert(
      input.lines.map((l, i) => ({
        invoice_id: id,
        sort_order: i,
        booking_id: l.bookingId ?? null,
        description: l.description,
        subline: l.subline || null,
        unit_cents: l.unitCents,
        qty: l.qty,
        vat_rate: l.vatRate,
        net_cents: totals.lines[i].netCents,
        vat_cents: totals.lines[i].vatCents,
        gross_cents: totals.lines[i].grossCents,
      })),
    )
    if (error) return fail("Could not save the lines. Please try again.")
  }

  refresh()
  return { ok: true }
}

/* ════════════════════════════════════════════════════════════ finalise */

/**
 * Stamps the number, renders the PDF, stores it.
 *
 * Order matters and is deliberate:
 *
 *   1. Snapshot the customer address and her own company details onto the row
 *      while it is still a draft. Editing either afterwards must never change
 *      a document someone is already holding.
 *   2. Take the number inside a database transaction (`finalise_invoice`),
 *      which is the only thing that can guarantee no two invoices share one.
 *   3. Render and upload the PDF last.
 *
 * If step 3 fails the invoice is still validly issued, just without a stored
 * file — `ensurePdf` fills that in later from the snapshot, deterministically.
 * The reverse order would risk a PDF that claims a number nobody holds.
 *
 * `clientToken` makes the whole thing idempotent: a double tap or a retry over
 * a flaky connection returns the same invoice instead of burning a number.
 */
export async function finaliseInvoice(
  id: string,
  clientToken: string,
): Promise<Result<{ number: string }>> {
  const supabase = await createSupabaseServerClient()

  const { data: inv } = await supabase
    .from("invoices")
    .select(
      `id, status, number, customer_id, prices_include_vat, language, service_date, reverse_charge,
       invoice_lines ( description, subline, unit_cents, qty, vat_rate, sort_order )`,
    )
    .eq("id", id)
    .maybeSingle()

  if (!inv) return fail("Invoice not found.")

  // Already done — most likely this is a retry of a request that did land.
  if (inv.number) {
    await ensurePdf(id)
    return { ok: true, data: { number: inv.number as string } }
  }

  const rawLines = ((inv.invoice_lines ?? []) as Record<string, unknown>[])
    .slice()
    .sort((a, b) => (a.sort_order as number) - (b.sort_order as number))

  if (rawLines.length === 0) return fail("Add at least one line before finalising.")

  const [{ data: customer }, { data: settings }] = await Promise.all([
    supabase
      .from("customers")
      .select("name, company_name, attn, street, postcode, city, country, vat_number")
      .eq("id", inv.customer_id as string)
      .maybeSingle(),
    supabase.from("invoice_settings").select("*").eq("id", 1).maybeSingle(),
  ])

  if (!customer) return fail("That customer no longer exists.")
  if (!settings) return fail("Your company details are not set up yet. Open Settings first.")

  const pricesIncludeVat = Boolean(inv.prices_include_vat)
  const language = (inv.language as "nl" | "en") ?? "nl"

  const totals = calculateInvoice(
    rawLines.map<DraftLine>((l) => ({
      unitCents: l.unit_cents as number,
      qty: Number(l.qty),
      vatRate: l.vat_rate as VatRate,
    })),
    pricesIncludeVat,
  )

  const billTo = {
    name: (customer.company_name as string) || (customer.name as string),
    attn: (customer.attn as string) || null,
    street: customer.street as string,
    postcode: formatPostcode(customer.postcode as string),
    city: customer.city as string,
    country: (customer.country as string) || "Nederland",
    vatNumber: (customer.vat_number as string) || null,
  }

  const issuedFrom = {
    companyName: settings.company_name as string,
    street: settings.street as string,
    postcode: formatPostcode(settings.postcode as string),
    city: settings.city as string,
    phone: settings.phone as string,
    email: settings.email as string,
    kvk: settings.kvk as string,
    vatNumber: settings.vat_number as string,
    iban: settings.iban as string,
    footer: (language === "nl" ? settings.footer_nl : settings.footer_en) as string,
  }

  // 0 — refuse anything that would not be a valid factuur.
  //
  // The browser greys the button out using the same rules, but that is a
  // courtesy: this is the check that actually decides, because it is the one
  // a request cannot go around.
  const serviceDate = (inv.service_date as string) || todayInAmsterdam()
  const blockers = checkInvoice({
    issuer: {
      companyName: issuedFrom.companyName,
      street: issuedFrom.street,
      postcode: issuedFrom.postcode,
      city: issuedFrom.city,
      kvk: issuedFrom.kvk,
      vatNumber: issuedFrom.vatNumber,
    },
    billTo,
    lines: rawLines.map((l) => ({ description: l.description as string, qty: Number(l.qty) })),
    serviceDate,
    reverseCharge: Boolean(inv.reverse_charge),
  })

  if (blockers.length > 0) return fail(summarise(blockers))

  // 1 — snapshot, while still a draft
  const { error: snapError } = await supabase
    .from("invoices")
    .update({
      bill_to: billTo,
      issued_from: issuedFrom,
      service_date: serviceDate,
      net_cents: totals.netCents,
      vat_cents: totals.vatCents,
      gross_cents: totals.grossCents,
      vat_breakdown: totals.breakdown,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (snapError) return fail("Could not prepare the invoice. Please try again.")

  // 2 — the number, inside a transaction
  const { data: stamped, error: rpcError } = await supabase.rpc("finalise_invoice", {
    p_invoice_id: id,
    p_client_token: clientToken,
  })

  if (rpcError) {
    if (/no_lines/.test(rpcError.message)) return fail("Add at least one line before finalising.")
    if (/already_issued/.test(rpcError.message)) return fail("This invoice has already been issued.")
    return fail("Could not issue the invoice. Nothing was saved — please try again.")
  }

  const row = Array.isArray(stamped) ? stamped[0] : stamped
  const number = row?.out_number as string
  if (!number) return fail("Could not issue the invoice. Please try again.")

  // 3 — the document itself
  await ensurePdf(id)

  refresh()
  return { ok: true, data: { number } }
}

/* ════════════════════════════════════════════════════════════════ pdf */

/**
 * Renders and stores the PDF if it is missing.
 *
 * Safe to call more than once because it renders from the snapshot rather than
 * from live data, so the output cannot drift. It deliberately does nothing
 * when a file already exists — the stored PDF is the legal record, and the
 * customer's copy must stay byte-identical to it.
 */
export async function ensurePdf(id: string): Promise<Result<{ path: string }>> {
  const supabase = await createSupabaseServerClient()

  const { data: inv } = await supabase
    .from("invoices")
    .select(
      `id, number, invoice_date, due_date, service_date, reverse_charge, language, prices_include_vat, pdf_path, is_test,
       bill_to, issued_from, net_cents, vat_cents, gross_cents, vat_breakdown,
       invoice_lines ( description, subline, unit_cents, qty, sort_order )`,
    )
    .eq("id", id)
    .maybeSingle()

  if (!inv) return fail("Invoice not found.")
  if (inv.pdf_path) return { ok: true, data: { path: inv.pdf_path as string } }
  if (!inv.number || !inv.bill_to || !inv.issued_from) return fail("This invoice has not been issued yet.")

  const lines = ((inv.invoice_lines ?? []) as Record<string, unknown>[])
    .slice()
    .sort((a, b) => (a.sort_order as number) - (b.sort_order as number))
    .map((l) => ({
      description: l.description as string,
      subline: (l.subline as string) ?? null,
      unitCents: l.unit_cents as number,
      qty: Number(l.qty),
      totalCents: roundCents((l.unit_cents as number) * Number(l.qty)),
    }))

  const doc: PdfInvoice = {
    number: inv.number as string,
    invoiceDate: dutchDate(inv.invoice_date as string),
    dueDate: dutchDate(inv.due_date as string),
    serviceDate: inv.service_date ? dutchDate(inv.service_date as string) : null,
    reverseCharge: Boolean(inv.reverse_charge),
    language: (inv.language as "nl" | "en") ?? "nl",
    pricesIncludeVat: Boolean(inv.prices_include_vat),
    issuer: inv.issued_from as PdfInvoice["issuer"],
    billTo: inv.bill_to as PdfInvoice["billTo"],
    lines,
    breakdown: (inv.vat_breakdown ?? []) as PdfInvoice["breakdown"],
    netCents: inv.net_cents as number,
    vatCents: inv.vat_cents as number,
    grossCents: inv.gross_cents as number,
    isTest: Boolean(inv.is_test),
  }

  let buffer: Buffer
  try {
    buffer = await renderInvoicePdf(doc)
  } catch {
    return fail("The invoice was issued, but the PDF could not be made. Open it again to retry.")
  }

  const year = (inv.invoice_date as string).slice(0, 4)
  const path = `${year}/${inv.number}.pdf`

  const { error: uploadError } = await supabase.storage
    .from("invoices")
    .upload(path, buffer, { contentType: "application/pdf", upsert: true })

  if (uploadError) {
    return fail("The invoice was issued, but the PDF could not be saved. Open it again to retry.")
  }

  await supabase.from("invoices").update({ pdf_path: path }).eq("id", id)
  refresh()
  return { ok: true, data: { path } }
}

/** Short-lived link. The bucket is private — an invoice carries a home address. */
export async function getPdfUrl(id: string): Promise<Result<{ url: string; filename: string }>> {
  const ensured = await ensurePdf(id)
  if (!ensured.ok) return ensured

  const supabase = await createSupabaseServerClient()
  const { data: inv } = await supabase.from("invoices").select("number").eq("id", id).maybeSingle()

  const { data, error } = await supabase.storage
    .from("invoices")
    .createSignedUrl(ensured.data.path, 60 * 10)

  if (error || !data) return fail("Could not open the PDF. Please try again.")
  return { ok: true, data: { url: data.signedUrl, filename: `factuur-${inv?.number ?? id}.pdf` } }
}

/* ══════════════════════════════════════════════════════════ status ops */

export async function setInvoicePaid(id: string, paid: boolean): Promise<Result> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("invoices")
    .update({
      status: paid ? "paid" : "issued",
      paid_at: paid ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .in("status", ["issued", "paid"])
    .select("id")

  if (error) return fail("Could not update. Please try again.")
  if (!data?.length) return fail("Only an issued invoice can be marked paid.")
  refresh()
  return { ok: true }
}

/**
 * Void, never delete.
 *
 * An issued invoice cannot be edited or removed — the number stays retired so
 * the series keeps no holes, and she reissues as a fresh one. This is the
 * Phase 1 stand-in for a credit note.
 */
export async function voidInvoice(id: string, reason: string): Promise<Result> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("invoices")
    .update({ status: "void", void_reason: reason.trim() || null, updated_at: new Date().toISOString() })
    .eq("id", id)
    .in("status", ["issued", "paid"])
    .select("id")

  if (error) return fail("Could not void. Please try again.")
  if (!data?.length) return fail("Only an issued invoice can be voided.")
  refresh()
  return { ok: true }
}

/** A draft holds no number, so throwing one away costs nothing. */
export async function deleteDraft(id: string): Promise<Result> {
  const supabase = await createSupabaseServerClient()
  // `select` so a blocked or no-match delete is reported as such, rather than
  // a zero-row delete passing for success — the same check setInvoicePaid and
  // voidInvoice already make.
  const { data, error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", id)
    .eq("status", "draft")
    .select("id")
  if (error) return fail("Could not discard. Please try again.")
  if (!data?.length) return fail("Only a draft can be discarded.")
  refresh()
  return { ok: true }
}

/* ════════════════════════════════════════════════════════════ customers */

export async function createCustomer(input: {
  name: string
  companyName?: string | null
  attn?: string | null
  email?: string | null
  phone?: string | null
  street: string
  postcode: string
  city: string
  country?: string
  segment: "residential" | "business"
}): Promise<Result<{ id: string }>> {
  if (!input.name.trim()) return fail("A name is required.")
  if (!input.street.trim() || !input.city.trim()) return fail("Street and city are required.")

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("customers")
    .insert({
      name: input.name.trim(),
      company_name: input.companyName?.trim() || null,
      attn: input.attn?.trim() || null,
      // Both are NOT NULL on the booking side, where the form always collects
      // them. A customer typed in for invoicing may have neither.
      email: input.email?.trim() || "",
      phone: input.phone?.trim() || "",
      street: input.street.trim(),
      postcode: input.postcode.trim(),
      city: input.city.trim(),
      country: input.country?.trim() || "Nederland",
      segment: input.segment,
    })
    .select("id")
    .single()

  if (error || !data) return fail("Could not save the customer. Please try again.")
  revalidatePath("/residents/customers")
  refresh()
  return { ok: true, data: { id: data.id as string } }
}

/* ───────────────────────────────────────────────────────────── helpers */

/** Her clock, not the server. An invoice made at 00:30 belongs to that day. */
function todayInAmsterdam(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Amsterdam",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date())
}

/**
 * `8223DH` → `8223 DH`. Her own data is inconsistent because the field is free
 * text, so it is normalised on the way onto the document rather than on entry.
 */
function formatPostcode(raw: string): string {
  const m = String(raw ?? "").toUpperCase().replace(/\s+/g, "").match(/^(\d{4})([A-Z]{2})$/)
  return m ? `${m[1]} ${m[2]}` : String(raw ?? "").trim()
}
