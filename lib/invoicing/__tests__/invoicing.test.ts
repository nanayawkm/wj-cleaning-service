import { apportion, calculateInvoice, formatCents, parseCents, roundCents } from "../money"
import { checkInvoice, summarise } from "../compliance"
import type { DraftLine } from "../money"

let failures = 0
const check = (name: string, actual: unknown, expected: unknown) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected)
  if (!ok) failures++
  console.log(
    `  ${ok ? "pass" : "FAIL"}  ${name}${
      ok ? "" : `\n         got ${JSON.stringify(actual)}\n         want ${JSON.stringify(expected)}`
    }`,
  )
}

const line = (unitCents: number, qty: number, vatRate: 0 | 9 | 21): DraftLine => ({
  unitCents,
  qty,
  vatRate,
})

/* ═════════════════════════════════════════════ the two invoices she sent */
//
// If these two drift, the feature is wrong regardless of what else passes.

console.log("\n— golden: her real invoices —")

// 202608-0002 · Villa Rental Europe B.V. · business · 21% added on top
{
  const t = calculateInvoice([line(2850, 2, 21), line(2300, 1, 21)], false)
  check("business · subtotaal", t.netCents, 8000)
  check("business · 21% btw", t.vatCents, 1680)
  check("business · totaal te voldoen", t.grossCents, 9680)
  check("business · single rate, no breakdown table", t.mixed, false)
  check("business · line 1 net", t.lines[0].netCents, 5700)
  check("business · line 2 net", t.lines[1].netCents, 2300)
}

// 202608-0003 · residential · 9% carved out of a round € 90,00
{
  const t = calculateInvoice([line(9000, 1, 9)], true)
  check("residential · subtotaal excl. btw", t.netCents, 8257)
  check("residential · 9% btw", t.vatCents, 743)
  check("residential · totaal te voldoen", t.grossCents, 9000)
  check("residential · total is pinned to the round price", t.grossCents, 9000)
}

/* ═══════════════════════════════════════════════════════════ discounts */

console.log("\n— discounts —")

// A discount is just a negative line. € 90,00 less € 17,80, inclusive of 9%.
{
  const t = calculateInvoice([line(9000, 1, 9), line(-1780, 1, 9)], true)
  check("inclusive discount · net", t.netCents, 6624)
  check("inclusive discount · btw", t.vatCents, 596)
  check("inclusive discount · total", t.grossCents, 7220)
  check("inclusive discount · reconciles", t.netCents + t.vatCents, t.grossCents)
}

// The same discount on a business invoice: btw is charged on the reduced net.
{
  const t = calculateInvoice([line(8000, 1, 21), line(-1000, 1, 21)], false)
  check("exclusive discount · net", t.netCents, 7000)
  check("exclusive discount · btw", t.vatCents, 1470)
  check("exclusive discount · total", t.grossCents, 8470)
}

/* ═══════════════════════════════════════════════════════════ mixed rates */

console.log("\n— mixed rates —")

{
  // € 100 of 9% work and € 80 of 21% work on one exclusive invoice.
  const t = calculateInvoice([line(10000, 1, 9), line(8000, 1, 21)], false)
  check("mixed · flagged", t.mixed, true)
  check("mixed · two bands, lowest first", t.breakdown.map((b) => b.rate), [9, 21])
  check("mixed · 9% band", t.breakdown[0], { rate: 9, netCents: 10000, vatCents: 900 })
  check("mixed · 21% band", t.breakdown[1], { rate: 21, netCents: 8000, vatCents: 1680 })
  check("mixed · total", t.grossCents, 20580)
}

/* ═════════════════════════════════════════ rounding must never lose a cent */

console.log("\n— rounding —")

{
  // Three lines that each individually round badly. Rounding per line would
  // give 3 × 3,33 = 9,99 against a 10,00 group; rounding per group cannot.
  const t = calculateInvoice([line(3333, 1, 21), line(3333, 1, 21), line(3334, 1, 21)], false)
  const lineSum = t.lines.reduce((a, l) => a + l.vatCents, 0)
  check("per-line btw sums to the group figure", lineSum, t.vatCents)
  check("group btw computed once", t.vatCents, 2100)
}

{
  // An inclusive price that does not divide cleanly by 1.09.
  const t = calculateInvoice([line(3333, 1, 9), line(6667, 1, 9)], true)
  check("inclusive · lines sum to the gross", t.grossCents, 10000)
  check("inclusive · net + btw reconcile", t.netCents + t.vatCents, t.grossCents)
  const lineGross = t.lines.reduce((a, l) => a + l.grossCents, 0)
  check("inclusive · line grosses sum to the total", lineGross, t.grossCents)
}

{
  // Fractional quantities — 1.5 hours of something.
  const t = calculateInvoice([line(2850, 1.5, 21)], false)
  check("fractional qty · net", t.netCents, 4275)
  check("fractional qty · btw", t.vatCents, 898)
}

/* ══════════════════════════════════════════════════════════════ apportion */

console.log("\n— apportion —")

check("splits exactly", apportion(100, [1, 1, 1]).reduce((a, b) => a + b, 0), 100)
check("proportional", apportion(1000, [3, 7]), [300, 700])
check("residual placed, still exact", apportion(10, [1, 1, 1]).reduce((a, b) => a + b, 0), 10)
check("handles a negative weight", apportion(-90, [100, -10]).reduce((a, b) => a + b, 0), -90)
check("all-zero weights do not divide by zero", apportion(50, [0, 0]), [50, 0])
check("empty", apportion(10, []), [])

/* ═══════════════════════════════════════════════════════ parse and format */

console.log("\n— parse and format —")

check("round half away from zero, positive", roundCents(0.5), 1)
check("round half away from zero, negative", roundCents(-0.5), -1)
check("dutch decimal comma", formatCents(8257), "82,57")
check("thousands separator", formatCents(123456), "1.234,56")
check("parse comma", parseCents("82,57"), 8257)
check("parse dot", parseCents("82.57"), 8257)
check("parse with symbol", parseCents(" € 90 "), 9000)
check("parse negative discount", parseCents("-17,80"), -1780)
check("reject letters", parseCents("abc"), null)
check("reject empty", parseCents(""), null)

/* ══════════════════════════════════════════════════════════════════ edges */

console.log("\n— edges —")

check("no lines", calculateInvoice([], true).grossCents, 0)
check("zero-rated line", calculateInvoice([line(5000, 1, 0)], false).vatCents, 0)

/* ═══════════════════════════════════════════════════ compliance guards */

console.log("\n— compliance —")

const goodIssuer = {
  companyName: "WJ Cleaning Services",
  street: "Punter 14 - 9",
  postcode: "8284 DD",
  city: "Lelystad",
  kvk: "90840437",
  vatNumber: "NL004846595B66",
}
const goodBillTo = {
  name: "Villa Rental Europe B.V.",
  street: "Lina Roetert Steenbruggenstraat 27",
  postcode: "7415 NL",
  city: "Deventer",
}
const goodLines = [{ description: "Wissel schoonmaak", qty: 2 }]
const ok = { issuer: goodIssuer, billTo: goodBillTo, lines: goodLines, serviceDate: "2026-08-12" }

const messages = (i: Parameters<typeof checkInvoice>[0]) => checkInvoice(i).map((b) => b.message)

check("a complete invoice has nothing blocking it", checkInvoice(ok), [])

check(
  "missing KvK is caught",
  messages({ ...ok, issuer: { ...goodIssuer, kvk: "" } }),
  ["Your KvK number is missing."],
)
check(
  "missing btw-nummer is caught",
  messages({ ...ok, issuer: { ...goodIssuer, vatNumber: null } }),
  ["Your btw-nummer is missing."],
)
check(
  "missing customer address is caught",
  messages({ ...ok, billTo: { ...goodBillTo, street: "" } }),
  ["This customer has no address."],
)
check("no lines is caught", messages({ ...ok, lines: [] }), ["Add at least one line."])
check(
  "a blank description is caught",
  messages({ ...ok, lines: [{ description: "  ", qty: 1 }] }),
  ["Every line needs a description."],
)
check(
  "a missing service date is caught",
  messages({ ...ok, serviceDate: null }),
  ["Add the date the work was done."],
)
check(
  "btw verlegd without the customer's number is caught",
  messages({ ...ok, reverseCharge: true }),
  ["Btw verlegd needs the customer's btw-nummer."],
)
check(
  "btw verlegd passes once the number is there",
  checkInvoice({ ...ok, reverseCharge: true, billTo: { ...goodBillTo, vatNumber: "NL1234" } }),
  [],
)
check(
  "blockers say where to go",
  checkInvoice({ ...ok, issuer: { ...goodIssuer, kvk: "" } })[0].where,
  "settings",
)
check(
  "several problems are all reported, not just the first",
  messages({ issuer: {}, billTo: {}, lines: [], serviceDate: null }).length,
  7,
)
check("summary of one", summarise(checkInvoice({ ...ok, lines: [] })), "Add at least one line.")
check("summary of none", summarise([]), "")

console.log(failures === 0 ? "\nAll invoicing checks passed.\n" : `\n${failures} FAILED\n`)
process.exit(failures === 0 ? 0 : 1)
