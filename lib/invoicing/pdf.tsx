// Imported explicitly so this module also renders outside Next, where the
// classic JSX transform expects React in scope. Harmless under React 19.
import React from "react"
import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer"

import { GEIST_REGULAR, GEIST_SEMIBOLD, LOGO_PNG } from "./assets.generated"
import { formatCents } from "./money"
import type { VatBand } from "./money"

/**
 * Her factuur, rebuilt from the two invoices she sent (202608-0002 business,
 * 202608-0003 residential). Same structure, same order, same wording.
 *
 * One template serves both segments. The only things that vary are the
 * `T.a.v.` line, the grey per-line references, and the totals block — see
 * `Totals` at the bottom.
 */

/* ───────────────────────────────────────────────────── fonts and artwork */

/**
 * The fonts and the logo are compiled into the bundle as base64 (see
 * assets.generated.ts), not read from disk.
 *
 * This used to `fs.readFileSync` from public/, which works locally but throws
 * ENOENT on Vercel — public/ is served by the CDN and is not part of the
 * serverless function's filesystem, so the PDF render failed in production with
 * only a caught error to show for it. Embedding the bytes removes the
 * filesystem dependency entirely: identical behaviour everywhere.
 *
 * The font loader accepts a data URL directly; so does Image. No fetch, no
 * disk.
 */
let registered = false

function ensureFonts() {
  if (registered) return
  registered = true

  Font.register({
    family: "Geist",
    fonts: [
      { src: GEIST_REGULAR, fontWeight: 400 },
      { src: GEIST_SEMIBOLD, fontWeight: 600 },
    ],
  })

  // Without this a long word is broken mid-character rather than wrapped.
  // A Dutch street name is the usual victim.
  Font.registerHyphenationCallback((word) => [word])
}

/* ───────────────────────────────────────────────────────────────── types */

export interface PdfIssuer {
  companyName: string
  street: string
  postcode: string
  city: string
  phone: string
  email: string
  kvk: string
  vatNumber: string
  iban: string
  footer: string
}

export interface PdfBillTo {
  /** Company name, or the person's name when there is no company. */
  name: string
  /** Renders as "T.a.v. …". Omitted entirely when absent. */
  attn?: string | null
  street: string
  postcode: string
  city: string
  country: string
  /** The customer's own btw-nummer. Printed for businesses; mandatory under
   *  btw verlegd, which is why finalising refuses without it. */
  vatNumber?: string | null
}

export interface PdfLine {
  description: string
  /** The grey second line: "08/08/2026 - PO: Lelystad - Steiger 2". */
  subline?: string | null
  /** Unit price as entered, in the invoice's mode. */
  unitCents: number
  qty: number
  /** unitCents × qty, in the invoice's mode. */
  totalCents: number
}

export interface PdfInvoice {
  number: string
  invoiceDate: string // already formatted dd-MM-yyyy
  dueDate: string
  /** Formatted dd-MM-yyyy. Printed only when it differs from the invoice date,
   *  which is what the rules require and keeps her usual same-day invoice
   *  looking exactly as it always has. */
  serviceDate?: string | null
  /** Btw verlegd — lines carry 0% and the page has to say why. */
  reverseCharge?: boolean
  language: "nl" | "en"
  pricesIncludeVat: boolean
  issuer: PdfIssuer
  billTo: PdfBillTo
  lines: PdfLine[]
  breakdown: VatBand[]
  netCents: number
  vatCents: number
  grossCents: number
  /** Practice run. Marked on the page so it can never pass for a real invoice. */
  isTest?: boolean
}

/* ──────────────────────────────────────────────────────────────── labels */

const COPY = {
  nl: {
    title: "Factuur",
    number: "Factuurnummer:",
    date: "Factuurdatum:",
    due: "Vervaldatum:",
    description: "Omschrijving",
    amount: "Bedrag",
    qty: "Aantal",
    total: "Totaal",
    subtotal: "Subtotaal",
    subtotalExcl: "Subtotaal excl. btw",
    vat: "btw",
    vatOver: (rate: number, net: string) => `Btw ${rate}% over € ${net}`,
    grand: "Totaal te voldoen",
    testBanner: "TESTFACTUUR — geen geldige factuur",
    serviceDate: "Leverdatum:",
    customerVat: "Btw-nummer:",
    reverseCharge: "Btw verlegd",
  },
  en: {
    title: "Invoice",
    number: "Invoice number:",
    date: "Invoice date:",
    due: "Due date:",
    description: "Description",
    amount: "Unit price",
    qty: "Qty",
    total: "Total",
    subtotal: "Subtotal",
    subtotalExcl: "Subtotal excl. VAT",
    vat: "VAT",
    vatOver: (rate: number, net: string) => `VAT ${rate}% on € ${net}`,
    grand: "Total due",
    testBanner: "TEST INVOICE — not a valid invoice",
    serviceDate: "Date of supply:",
    customerVat: "VAT number:",
    reverseCharge: "VAT reverse charged",
  },
} as const

/** Either language, not the Dutch literals — the two shapes must stay swappable. */
type Copy = (typeof COPY)[keyof typeof COPY]

/* ───────────────────────────────────────────────────────────────── styles */

const mm = (n: number) => n * 2.8346

const s = StyleSheet.create({
  page: {
    fontFamily: "Geist",
    fontSize: 10,
    lineHeight: 1.5,
    color: "#1a1a1a",
    paddingTop: mm(16),
    paddingBottom: mm(14),
    paddingHorizontal: mm(16),
  },

  // alignItems must be explicit. The flex default of `stretch` overrides the
  // logo's intrinsic ratio and squashes a square mark to the height of the
  // address block beside it.
  head: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  logo: { width: mm(38), height: mm(38), flexShrink: 0, marginTop: mm(-4), marginLeft: mm(-3) },
  issuer: { textAlign: "left" },
  issuerGroup: { marginBottom: mm(3) },

  billTo: { marginTop: mm(8) },

  title: { fontSize: 16, marginTop: mm(18), marginBottom: mm(3) },
  metaRow: { flexDirection: "row" },
  metaLabel: { width: mm(32) },

  table: { marginTop: mm(16) },
  thead: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#9a9a9a",
    paddingBottom: mm(1.5),
  },
  row: { flexDirection: "row", marginTop: mm(2.5) },

  colDesc: { flexGrow: 1, flexShrink: 1, paddingRight: mm(4) },
  colCur: { width: mm(7), textAlign: "right", paddingRight: mm(2) },
  colAmt: { width: mm(20), textAlign: "right" },
  colQty: { width: mm(18), textAlign: "right", paddingRight: mm(6) },
  colTot: { width: mm(22), textAlign: "right" },

  subline: { fontSize: 8.5, color: "#6b6b6b", marginTop: mm(0.3) },

  totals: { marginTop: mm(10) },
  totalRow: { flexDirection: "row", marginTop: mm(0.7) },
  totalLabel: { flexGrow: 1, textAlign: "right", paddingRight: mm(6) },
  grandRow: { flexDirection: "row", marginTop: mm(6) },
  semibold: { fontWeight: 600 },

  testBanner: {
    marginBottom: mm(4),
    paddingVertical: mm(2),
    paddingHorizontal: mm(3),
    borderWidth: 1,
    borderColor: "#b45309",
    backgroundColor: "#fdf3e3",
    color: "#8a4b09",
    fontSize: 9,
    fontWeight: 600,
    textAlign: "center",
  },

  footer: {
    position: "absolute",
    bottom: mm(14),
    left: mm(30),
    right: mm(30),
    textAlign: "center",
    fontSize: 10,
  },
})

/* ─────────────────────────────────────────────────────────────── document */

function Totals({ inv, t }: { inv: PdfInvoice; t: Copy }) {
  const mixed = inv.breakdown.length > 1

  return (
    <View style={s.totals}>
      <View style={s.totalRow}>
        {/* Her own wording: the label names the exclusion only when btw was
            carved out of a price the customer was already quoted. */}
        <Text style={s.totalLabel}>{inv.pricesIncludeVat && !mixed ? t.subtotalExcl : t.subtotal}</Text>
        <Text style={s.colCur}>€</Text>
        <Text style={s.colTot}>{formatCents(inv.netCents)}</Text>
      </View>

      {inv.breakdown.map((b) => (
        <View style={s.totalRow} key={b.rate}>
          <Text style={s.totalLabel}>
            {mixed ? t.vatOver(b.rate, formatCents(b.netCents)) : `${b.rate}% ${t.vat}`}
          </Text>
          <Text style={s.colCur}>€</Text>
          <Text style={s.colTot}>{formatCents(b.vatCents)}</Text>
        </View>
      ))}

      <View style={s.grandRow}>
        <Text style={[s.totalLabel, s.semibold]}>{t.grand}</Text>
        <Text style={[s.colCur, s.semibold]}>€</Text>
        <Text style={[s.colTot, s.semibold]}>{formatCents(inv.grossCents)}</Text>
      </View>

      {/* The wording itself is the legal requirement, not the 0% figure. */}
      {inv.reverseCharge ? (
        <View style={s.totalRow}>
          <Text style={[s.totalLabel, s.semibold]}>{t.reverseCharge}</Text>
          <Text style={s.colCur} />
          <Text style={s.colTot} />
        </View>
      ) : null}
    </View>
  )
}

export function InvoiceDocument({ inv }: { inv: PdfInvoice }) {
  const t = COPY[inv.language]
  const { issuer, billTo } = inv

  return (
    <Document
      title={`${inv.isTest ? "TEST — " : ""}${t.title} ${inv.number}`}
      author={issuer.companyName}
      subject={`${t.title} ${inv.number}`}
    >
      <Page size="A4" style={s.page}>
        {/* First thing on the page, before the letterhead: if a practice run ever
            reaches a customer it has to be obvious at a glance. */}
        {inv.isTest ? <Text style={s.testBanner}>{t.testBanner}</Text> : null}

        <View style={s.head}>
          <Image src={LOGO_PNG} style={s.logo} />
          <View style={s.issuer}>
            <View style={s.issuerGroup}>
              <Text>{issuer.companyName}</Text>
            </View>
            <View style={s.issuerGroup}>
              <Text>{issuer.street}</Text>
              <Text>
                {issuer.postcode}  {issuer.city}
              </Text>
            </View>
            <View style={s.issuerGroup}>
              <Text>{issuer.phone}</Text>
              <Text>{issuer.email}</Text>
            </View>
            <View style={s.issuerGroup}>
              <Text>KvK: {issuer.kvk}</Text>
              <Text>{issuer.vatNumber}</Text>
              <Text>{issuer.iban}</Text>
            </View>
          </View>
        </View>

        <View style={s.billTo}>
          <Text>{billTo.name}</Text>
          {billTo.attn ? <Text>T.a.v. {billTo.attn}</Text> : null}
          <Text>{billTo.street}</Text>
          <Text>
            {billTo.postcode}  {billTo.city}
          </Text>
          <Text>{billTo.country}</Text>
          {billTo.vatNumber ? (
            <Text>
              {t.customerVat} {billTo.vatNumber}
            </Text>
          ) : null}
        </View>

        <Text style={s.title}>{t.title}</Text>
        <View style={s.metaRow}>
          <Text style={s.metaLabel}>{t.number}</Text>
          <Text>{inv.number}</Text>
        </View>
        <View style={s.metaRow}>
          <Text style={s.metaLabel}>{t.date}</Text>
          <Text>{inv.invoiceDate}</Text>
        </View>
        <View style={s.metaRow}>
          <Text style={s.metaLabel}>{t.due}</Text>
          <Text>{inv.dueDate}</Text>
        </View>
        {/* Only when the work was done on a different day. Required then, and
            leaving it off otherwise keeps her usual invoice unchanged. */}
        {inv.serviceDate && inv.serviceDate !== inv.invoiceDate ? (
          <View style={s.metaRow}>
            <Text style={s.metaLabel}>{t.serviceDate}</Text>
            <Text>{inv.serviceDate}</Text>
          </View>
        ) : null}

        <View style={s.table}>
          <View style={s.thead} fixed>
            <Text style={s.colDesc}>{t.description}</Text>
            <Text style={s.colCur} />
            <Text style={s.colAmt}>{t.amount}</Text>
            <Text style={s.colQty}>{t.qty}</Text>
            <Text style={s.colCur} />
            <Text style={s.colTot}>{t.total}</Text>
          </View>

          {inv.lines.map((l, i) => (
            <View style={s.row} key={i} wrap={false}>
              <View style={s.colDesc}>
                <Text>{l.description}</Text>
                {l.subline ? <Text style={s.subline}>{l.subline}</Text> : null}
              </View>
              <Text style={s.colCur}>€</Text>
              <Text style={s.colAmt}>{formatCents(l.unitCents)}</Text>
              <Text style={s.colQty}>{formatQty(l.qty)}</Text>
              <Text style={s.colCur}>€</Text>
              <Text style={s.colTot}>{formatCents(l.totalCents)}</Text>
            </View>
          ))}
        </View>

        <Totals inv={inv} t={t} />

        <Text style={s.footer} fixed>
          {issuer.footer}
        </Text>
      </Page>
    </Document>
  )
}

/** Whole numbers print bare — "2", not "2,00" — as on her invoices. */
const formatQty = (qty: number): string =>
  Number.isInteger(qty) ? String(qty) : formatCents(Math.round(qty * 100))

/**
 * Renders once, at finalise. The result is stored and never regenerated:
 * rebuilding it later from live data would produce a different document than
 * the one the customer is holding.
 */
export async function renderInvoicePdf(inv: PdfInvoice): Promise<Buffer> {
  ensureFonts()
  return renderToBuffer(<InvoiceDocument inv={inv} />)
}
