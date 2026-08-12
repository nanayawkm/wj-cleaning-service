import "server-only"

import { createSupabaseServerClient } from "@/lib/supabase/server"

/**
 * Every read runs under Jackie's session, so Row Level Security does the
 * filtering rather than a `where` clause that could be forgotten.
 */

export type Segment = "residential" | "business"
export type InvoiceStatus = "draft" | "issued" | "paid" | "void"

export interface InvoiceRow {
  id: string
  number: string | null
  status: InvoiceStatus
  invoiceDate: string | null
  dueDate: string | null
  grossCents: number
  pdfPath: string | null
  paidAt: string | null
  customerName: string
  createdAt: string
  isTest: boolean
}

export interface PickerCustomer {
  id: string
  name: string
  companyName: string | null
  attn: string | null
  street: string
  postcode: string
  city: string
  country: string
  vatNumber: string | null
  segment: Segment
  /** Newest invoice first, so the picker can lead with who she billed recently. */
  lastInvoicedAt: string | null
}

export interface ServiceItem {
  id: string
  nameNl: string
  nameEn: string
  segment: Segment
  unitCents: number
  vatRate: 0 | 9 | 21
}

export interface DraftLineRow {
  id: string
  description: string
  subline: string | null
  unitCents: number
  qty: number
  vatRate: 0 | 9 | 21
  bookingId: string | null
}

export interface InvoiceDetail {
  id: string
  number: string | null
  status: InvoiceStatus
  customerId: string
  pricesIncludeVat: boolean
  language: "nl" | "en"
  invoiceDate: string | null
  dueDate: string | null
  netCents: number
  vatCents: number
  grossCents: number
  pdfPath: string | null
  paidAt: string | null
  notes: string | null
  lines: DraftLineRow[]
}

/* ─────────────────────────────────────────────────────────────────── list */

export async function getInvoices(): Promise<InvoiceRow[]> {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from("invoices")
    .select(
      `id, number, status, invoice_date, due_date, gross_cents, pdf_path, paid_at, created_at, is_test,
       customers ( name, company_name )`,
    )
    .order("created_at", { ascending: false })
    .limit(300)

  return (data ?? []).map((r) => {
    const c = (Array.isArray(r.customers) ? r.customers[0] : r.customers) as
      | { name: string; company_name: string | null }
      | null
    return {
      id: r.id as string,
      number: r.number as string | null,
      status: r.status as InvoiceStatus,
      invoiceDate: r.invoice_date as string | null,
      dueDate: r.due_date as string | null,
      grossCents: (r.gross_cents as number) ?? 0,
      pdfPath: r.pdf_path as string | null,
      paidAt: r.paid_at as string | null,
      createdAt: r.created_at as string,
      isTest: Boolean(r.is_test),
      customerName: c?.company_name || c?.name || "—",
    }
  })
}

/* ───────────────────────────────────────────────────────── builder inputs */

export async function getPickerCustomers(): Promise<PickerCustomer[]> {
  const supabase = await createSupabaseServerClient()

  const [{ data: customers }, { data: recent }] = await Promise.all([
    supabase
      .from("customers")
      .select("id, name, company_name, attn, street, postcode, city, country, vat_number, segment")
      .order("created_at", { ascending: false })
      .limit(500),
    // Who she billed most recently, so the picker can put them at the top —
    // the doorstep case is almost always someone she has invoiced before.
    supabase
      .from("invoices")
      .select("customer_id, created_at")
      .order("created_at", { ascending: false })
      .limit(300),
  ])

  const lastByCustomer = new Map<string, string>()
  for (const r of recent ?? []) {
    const id = r.customer_id as string
    if (!lastByCustomer.has(id)) lastByCustomer.set(id, r.created_at as string)
  }

  return (customers ?? []).map((c) => ({
    id: c.id as string,
    name: c.name as string,
    companyName: c.company_name as string | null,
    attn: c.attn as string | null,
    street: (c.street as string) ?? "",
    postcode: (c.postcode as string) ?? "",
    city: (c.city as string) ?? "",
    country: (c.country as string) ?? "Nederland",
    vatNumber: (c.vat_number as string) ?? null,
    segment: (c.segment as Segment) ?? "residential",
    lastInvoicedAt: lastByCustomer.get(c.id as string) ?? null,
  }))
}

export async function getServiceItems(): Promise<ServiceItem[]> {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from("service_items")
    .select("id, name_nl, name_en, segment, unit_cents, vat_rate")
    .eq("active", true)
    .order("segment")
    .order("sort_order")

  return (data ?? []).map((r) => ({
    id: r.id as string,
    nameNl: r.name_nl as string,
    nameEn: r.name_en as string,
    segment: r.segment as Segment,
    unitCents: r.unit_cents as number,
    vatRate: r.vat_rate as 0 | 9 | 21,
  }))
}

/* ───────────────────────────────────────────────────────────────── detail */

export async function getInvoice(id: string): Promise<InvoiceDetail | null> {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from("invoices")
    .select(
      `id, number, status, customer_id, prices_include_vat, language, invoice_date, due_date,
       net_cents, vat_cents, gross_cents, pdf_path, paid_at, notes,
       invoice_lines ( id, description, subline, unit_cents, qty, vat_rate, booking_id, sort_order )`,
    )
    .eq("id", id)
    .maybeSingle()

  if (!data) return null

  const lines = ((data.invoice_lines ?? []) as Record<string, unknown>[])
    .slice()
    .sort((a, b) => (a.sort_order as number) - (b.sort_order as number))
    .map((l) => ({
      id: l.id as string,
      description: l.description as string,
      subline: (l.subline as string) ?? null,
      unitCents: l.unit_cents as number,
      qty: Number(l.qty),
      vatRate: l.vat_rate as 0 | 9 | 21,
      bookingId: (l.booking_id as string) ?? null,
    }))

  return {
    id: data.id as string,
    number: data.number as string | null,
    status: data.status as InvoiceStatus,
    customerId: data.customer_id as string,
    pricesIncludeVat: Boolean(data.prices_include_vat),
    language: data.language as "nl" | "en",
    invoiceDate: data.invoice_date as string | null,
    dueDate: data.due_date as string | null,
    netCents: (data.net_cents as number) ?? 0,
    vatCents: (data.vat_cents as number) ?? 0,
    grossCents: (data.gross_cents as number) ?? 0,
    pdfPath: data.pdf_path as string | null,
    paidAt: data.paid_at as string | null,
    notes: (data.notes as string) ?? null,
    lines,
  }
}

/** Bookings already billed, so the table can show "invoiced" and she cannot double-bill. */
export async function getInvoicedBookingIds(): Promise<Set<string>> {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from("invoice_lines")
    .select("booking_id, invoices!inner(status)")
    .not("booking_id", "is", null)
    .neq("invoices.status", "void")

  return new Set((data ?? []).map((r) => r.booking_id as string))
}
