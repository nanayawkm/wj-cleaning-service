/**
 * The single place invoice money is decided.
 *
 * Three rules, all of them load-bearing:
 *
 *   1. Integer cents throughout. No floats reach a stored figure.
 *   2. btw is rounded **once per rate group**, never per line and never on the
 *      grand total. Rounding each line separately drifts by a cent or two on a
 *      long invoice and the totals stop agreeing with the lines.
 *   3. In inclusive mode the total is **pinned to the gross**. Her residential
 *      prices are round numbers agreed at the door — € 90,00 must print as
 *      € 90,00, so net is derived from gross and btw is the remainder. Compute
 *      btw independently and the three figures end up a cent apart.
 *
 * Verified against her two real invoices — see __tests__/invoicing.test.ts.
 */

export type VatRate = 0 | 9 | 21

/** What the builder holds while she is still editing. */
export interface DraftLine {
  /** As entered, in the invoice's mode. A discount is simply negative. */
  unitCents: number
  qty: number
  vatRate: VatRate
}

/** What gets stored on each line once the figures are settled. */
export interface LineTotals {
  netCents: number
  vatCents: number
  grossCents: number
}

export interface VatBand {
  rate: VatRate
  netCents: number
  vatCents: number
}

export interface InvoiceTotals {
  lines: LineTotals[]
  /** One entry per rate actually used, lowest rate first. */
  breakdown: VatBand[]
  netCents: number
  vatCents: number
  grossCents: number
  /** True when more than one rate is in play, so the PDF expands the totals. */
  mixed: boolean
}

/**
 * Half away from zero, so a discount rounds the same distance as a charge.
 * `Math.round` breaks ties toward +∞, which would treat −0.5 and +0.5
 * differently.
 */
export const roundCents = (n: number): number =>
  n < 0 ? -Math.round(-n) : Math.round(n)

/**
 * Split `total` across `weights` as whole cents that sum to exactly `total`.
 *
 * Needed because the authoritative figure is the rate group's, but each line
 * still has to carry its own share. Proportional rounding alone leaves a
 * residual of a cent or two; largest-remainder places it deterministically on
 * the lines with the biggest fractional parts.
 *
 * Handles negative weights, because a discount line is a negative weight.
 */
export function apportion(total: number, weights: number[]): number[] {
  const n = weights.length
  if (n === 0) return []

  const sum = weights.reduce((a, b) => a + b, 0)

  // Every weight is zero (a line priced at nothing). Nothing to apportion
  // proportionally, so the whole amount lands on the first line.
  if (sum === 0) {
    const out = new Array<number>(n).fill(0)
    out[0] = total
    return out
  }

  const exact = weights.map((w) => (total * w) / sum)
  const base = exact.map((x) => Math.trunc(x))
  let residual = total - base.reduce((a, b) => a + b, 0)

  // Biggest fractional part gets the first spare cent.
  const order = exact
    .map((x, i) => ({ i, frac: Math.abs(x - Math.trunc(x)) }))
    .sort((a, b) => b.frac - a.frac)

  const step = residual < 0 ? -1 : 1
  for (let k = 0; residual !== 0 && k < order.length * 2; k++) {
    base[order[k % order.length].i] += step
    residual -= step
  }

  return base
}

/**
 * @param pricesIncludeVat  true for residential (btw carved out of the price
 *                          she quoted), false for business (btw added on top).
 */
export function calculateInvoice(lines: DraftLine[], pricesIncludeVat: boolean): InvoiceTotals {
  if (lines.length === 0) {
    return { lines: [], breakdown: [], netCents: 0, vatCents: 0, grossCents: 0, mixed: false }
  }

  // What each line is worth before btw is decided. In inclusive mode this is
  // the line's gross; in exclusive mode it is its net.
  const raw = lines.map((l) => roundCents(l.unitCents * l.qty))

  const rates = [...new Set(lines.map((l) => l.vatRate))].sort((a, b) => a - b)

  const out: LineTotals[] = new Array(lines.length)
  const breakdown: VatBand[] = []

  for (const rate of rates) {
    const idx = lines.map((l, i) => (l.vatRate === rate ? i : -1)).filter((i) => i >= 0)
    const amounts = idx.map((i) => raw[i])
    const subtotal = amounts.reduce((a, b) => a + b, 0)

    let groupNet: number
    let groupVat: number

    if (pricesIncludeVat) {
      // Gross is what she promised. Derive net, and let btw be whatever is
      // left over so the three figures always reconcile exactly.
      groupNet = roundCents((subtotal * 100) / (100 + rate))
      groupVat = subtotal - groupNet
    } else {
      groupNet = subtotal
      groupVat = roundCents((subtotal * rate) / 100)
    }

    // Share the group's figures back out over its lines without losing a cent.
    const lineNets = pricesIncludeVat ? apportion(groupNet, amounts) : amounts
    const lineVats = pricesIncludeVat
      ? idx.map((_, k) => amounts[k] - lineNets[k])
      : apportion(groupVat, amounts)

    idx.forEach((lineIndex, k) => {
      out[lineIndex] = {
        netCents: lineNets[k],
        vatCents: lineVats[k],
        grossCents: lineNets[k] + lineVats[k],
      }
    })

    breakdown.push({ rate, netCents: groupNet, vatCents: groupVat })
  }

  const netCents = breakdown.reduce((a, b) => a + b.netCents, 0)
  const vatCents = breakdown.reduce((a, b) => a + b.vatCents, 0)

  return {
    lines: out,
    breakdown,
    netCents,
    vatCents,
    grossCents: netCents + vatCents,
    mixed: breakdown.length > 1,
  }
}

/* ------------------------------------------------------------- formatting */

/** `8257` → `"82,57"`. Dutch convention, no symbol — the PDF sets € separately. */
export const formatCents = (cents: number): string =>
  new Intl.NumberFormat("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    .format(cents / 100)

/** `8257` → `"€ 82,57"`, for on-screen use. */
export const formatEuro = (cents: number): string => `€ ${formatCents(cents)}`

/** `"82,57"` or `"82.57"` → `8257`. Returns null on anything unusable. */
export function parseCents(input: string): number | null {
  const cleaned = String(input).trim().replace(/[€\s]/g, "").replace(",", ".")
  if (cleaned === "" || !/^-?\d*\.?\d*$/.test(cleaned)) return null
  const n = Number(cleaned)
  if (!Number.isFinite(n) || Math.abs(n) > 1_000_000) return null
  return roundCents(n * 100)
}
