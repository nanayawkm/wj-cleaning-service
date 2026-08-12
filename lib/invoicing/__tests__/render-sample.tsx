import fs from "node:fs"
import path from "node:path"

import { calculateInvoice, formatCents, roundCents } from "../money"
import { renderInvoicePdf } from "../pdf"
import type { PdfInvoice, PdfIssuer } from "../pdf"

/**
 * Renders both of her real invoices through the actual template, so the layout
 * can be compared against the PDFs she sent rather than described.
 *
 *   npx tsx lib/invoicing/__tests__/render-sample.tsx [outDir]
 */

const issuer: PdfIssuer = {
  companyName: "WJ Cleaning Services",
  street: "Punter 14 - 9",
  postcode: "8284 DD",
  city: "Lelystad",
  phone: "0685092379",
  email: "Info@wjcleaningservices.nl",
  kvk: "90840437",
  vatNumber: "NL004846595B66",
  iban: "NL98KNAB0615246249",
  footer:
    "U wordt vriendelijk verzocht de factuur voor de vervaldatum te voldoen onder vermelding van het factuurnummer.",
}

/* ─────────────────────────────── 202608-0003 · residential · 9% inclusive */

const resLines = [{ unitCents: 9000, qty: 1, vatRate: 9 as const }]
const resTotals = calculateInvoice(resLines, true)

const residential: PdfInvoice = {
  number: "202608-0003",
  invoiceDate: "10-08-2026",
  dueDate: "09-09-2026",
  language: "nl",
  pricesIncludeVat: true,
  issuer,
  billTo: {
    name: "Jacklyn de Vries",
    street: "keteldiep 7",
    postcode: "8223 DH",
    city: "Lelystad",
    country: "Nederland",
  },
  lines: resLines.map((l) => ({
    description: "Algemene schoonmaak",
    unitCents: l.unitCents,
    qty: l.qty,
    totalCents: roundCents(l.unitCents * l.qty),
  })),
  breakdown: resTotals.breakdown,
  netCents: resTotals.netCents,
  vatCents: resTotals.vatCents,
  grossCents: resTotals.grossCents,
}

/* ────────────────────────────────── 202608-0004 · business · 21% exclusive */

const bizLines = [
  { unitCents: 2850, qty: 2, vatRate: 21 as const },
  { unitCents: 2300, qty: 1, vatRate: 21 as const },
]
const bizTotals = calculateInvoice(bizLines, false)

const business: PdfInvoice = {
  number: "202608-0004",
  invoiceDate: "10-08-2026",
  dueDate: "09-09-2026",
  language: "nl",
  pricesIncludeVat: false,
  issuer,
  billTo: {
    name: "Villa Rental Europe B.V.",
    street: "Lina Roetert Steenbruggenstraat 27",
    postcode: "7415 NL",
    city: "Deventer",
    country: "Nederland",
  },
  lines: [
    {
      description: "Wissel schoonmaak",
      subline: "08/08/2026 - PO: Lelystad - Steiger 2",
      unitCents: 2850,
      qty: 2,
      totalCents: 5700,
    },
    {
      description: "Linnen wassen",
      subline: "08/08/2026 - Lelystad - Steiger 2",
      unitCents: 2300,
      qty: 1,
      totalCents: 2300,
    },
  ],
  breakdown: bizTotals.breakdown,
  netCents: bizTotals.netCents,
  vatCents: bizTotals.vatCents,
  grossCents: bizTotals.grossCents,
}

/* ──────────────────────────────────────── a mixed-rate one, to prove §2.2 */

const mixLines = [
  { unitCents: 10000, qty: 1, vatRate: 9 as const },
  { unitCents: 8000, qty: 1, vatRate: 21 as const },
]
const mixTotals = calculateInvoice(mixLines, false)

const mixed: PdfInvoice = {
  ...business,
  number: "202608-0005",
  billTo: { ...business.billTo, attn: "Lina Roetert" },
  lines: [
    { description: "Algemene schoonmaak woning", unitCents: 10000, qty: 1, totalCents: 10000 },
    { description: "Ramen wassen buitenzijde", unitCents: 8000, qty: 1, totalCents: 8000 },
  ],
  breakdown: mixTotals.breakdown,
  netCents: mixTotals.netCents,
  vatCents: mixTotals.vatCents,
  grossCents: mixTotals.grossCents,
}

/* ────────────────────────────────────────────────────────────────── write */

const outDir = process.argv[2] ?? process.cwd()

// Wrapped rather than top-level: the project builds to CJS, where top-level
// await is a transform error.
async function main() {
  for (const inv of [residential, business, mixed]) {
    const buf = await renderInvoicePdf(inv)
    const file = path.join(outDir, `factuur-${inv.number}.pdf`)
    fs.writeFileSync(file, buf)
    console.log(
      `  ${inv.number}  ${String(buf.length).padStart(7)} bytes  ` +
        `net ${formatCents(inv.netCents)} · btw ${formatCents(inv.vatCents)} · ` +
        `totaal ${formatCents(inv.grossCents)}  →  ${file}`,
    )
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
