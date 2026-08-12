/**
 * What has to be true before an invoice can be issued.
 *
 * The Belastingdienst lists what a factuur must carry. Rather than expect
 * Jackie to remember any of it, the rules live here and finalising is refused
 * until they pass — so the only invoices that exist are correct ones.
 *
 * Two deliberate choices:
 *
 *   1. **Nothing here fires while she is building.** These run at finalise, so
 *      a half-finished invoice never shows a wall of red. Friction belongs at
 *      the moment of commitment, not before it.
 *   2. **Every message names the fix, not the rule.** "Add your KvK number in
 *      Settings", never "field kvk failed validation".
 *
 * Pure and dependency-free, so the same rules run in the browser to grey out
 * the button and on the server to actually refuse.
 */

export interface ComplianceIssuer {
  companyName?: string | null
  street?: string | null
  postcode?: string | null
  city?: string | null
  kvk?: string | null
  vatNumber?: string | null
}

export interface ComplianceBillTo {
  name?: string | null
  street?: string | null
  postcode?: string | null
  city?: string | null
  vatNumber?: string | null
}

export interface ComplianceLine {
  description?: string | null
  qty: number
}

export interface ComplianceInput {
  issuer: ComplianceIssuer
  billTo: ComplianceBillTo
  lines: ComplianceLine[]
  /** Date the work was actually done. */
  serviceDate?: string | null
  reverseCharge?: boolean
}

export interface Blocker {
  /** Where she has to go to fix it — the panel groups by this. */
  where: "settings" | "customer" | "invoice"
  message: string
}

const blank = (v?: string | null) => !v || String(v).trim() === ""

/**
 * @returns everything standing between this invoice and being issuable.
 *          Empty means it is good to go.
 */
export function checkInvoice(input: ComplianceInput): Blocker[] {
  const out: Blocker[] = []
  const { issuer, billTo, lines } = input

  /* ── her own details · every invoice must identify who issued it ────── */

  if (blank(issuer.companyName) || blank(issuer.street) || blank(issuer.city)) {
    out.push({ where: "settings", message: "Your business name and address are missing." })
  }
  if (blank(issuer.kvk)) {
    out.push({ where: "settings", message: "Your KvK number is missing." })
  }
  if (blank(issuer.vatNumber)) {
    out.push({ where: "settings", message: "Your btw-nummer is missing." })
  }

  /* ── the customer · an invoice has to say who it is for ─────────────── */

  if (blank(billTo.name)) {
    out.push({ where: "customer", message: "This customer has no name." })
  }
  if (blank(billTo.street) || blank(billTo.city)) {
    out.push({ where: "customer", message: "This customer has no address." })
  }

  /* ── the work · what was supplied, and when ─────────────────────────── */

  if (lines.length === 0) {
    out.push({ where: "invoice", message: "Add at least one line." })
  }
  if (lines.some((l) => blank(l.description))) {
    out.push({ where: "invoice", message: "Every line needs a description." })
  }
  if (lines.some((l) => !Number.isFinite(l.qty) || l.qty === 0)) {
    out.push({ where: "invoice", message: "Every line needs a quantity." })
  }
  if (blank(input.serviceDate)) {
    out.push({ where: "invoice", message: "Add the date the work was done." })
  }

  /* ── reverse charge · only valid with the customer's own btw-nummer ─── */

  if (input.reverseCharge && blank(billTo.vatNumber)) {
    out.push({
      where: "customer",
      message: "Btw verlegd needs the customer's btw-nummer.",
    })
  }

  return out
}

/** One line for a button or a toast, when there is no room for the list. */
export function summarise(blockers: Blocker[]): string {
  if (blockers.length === 0) return ""
  if (blockers.length === 1) return blockers[0].message
  return `${blockers[0].message} And ${blockers.length - 1} more to fix.`
}

/**
 * The rate hint under the picker.
 *
 * Guidance, never enforcement — the classification is hers and her
 * accountant's to make, and the invoice is legally her responsibility.
 */
export const RATE_HINT =
  "9% for cleaning inside a home. 21% for outside work, specialised cleaning, and anything for a business."
