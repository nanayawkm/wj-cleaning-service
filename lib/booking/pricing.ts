import { BASE_DURATION_MIN, TRAVEL_BUFFER_MIN } from "./config"

export interface PricingBand {
  id: string
  min_m2: number
  max_m2: number
  label_nl: string
  label_en: string
  base_cents: number
  deep_cents: number
  /** How long this size of home takes before add-ons. Varies by band. */
  base_duration_min: number
  sort_order: number
}

export interface Addon {
  id: string
  slug: string
  name_nl: string
  name_en: string
  price_cents: number
  duration_min: number
  sort_order: number
}

export interface QuoteInput {
  band: PricingBand
  deepCleaning: boolean
  addonSlugs: string[]
  addons: Addon[]
  discount?: { code: string; percent_off: number } | null
}

export interface Quote {
  lines: { label_nl: string; label_en: string; cents: number }[]
  subtotalCents: number
  discountCents: number
  totalCents: number
  /** What the customer's time is booked for, add-ons included. */
  durationMin: number
  /** Duration plus travel buffer — what actually blocks the calendar. */
  blockedMin: number
}

/**
 * The single place a price is decided.
 *
 * Deep cleaning is not an entry in `addons` for pricing purposes — its
 * supplement is per band (€60/70/80/90), so it is read from the band itself.
 * The addons table still carries it for the duration and the display name.
 */
export function calculateQuote({
  band,
  deepCleaning,
  addonSlugs,
  addons,
  discount,
}: QuoteInput): Quote {
  const lines: Quote["lines"] = [
    {
      label_nl: `Algemene schoonmaak · ${band.label_nl}`,
      label_en: `General cleaning · ${band.label_en}`,
      cents: band.base_cents,
    },
  ]

  // Per band, not a constant: a 65-99 m2 flat is a two-hour job.
  let durationMin = band.base_duration_min ?? BASE_DURATION_MIN

  if (deepCleaning) {
    const meta = addons.find((a) => a.slug === "deep-cleaning")
    lines.push({
      label_nl: meta?.name_nl ?? "Dieptereiniging",
      label_en: meta?.name_en ?? "Deep cleaning",
      cents: band.deep_cents,
    })
    durationMin += meta?.duration_min ?? 60
  }

  for (const slug of addonSlugs) {
    if (slug === "deep-cleaning") continue // priced from the band, above
    const addon = addons.find((a) => a.slug === slug)
    if (!addon) continue
    lines.push({ label_nl: addon.name_nl, label_en: addon.name_en, cents: addon.price_cents })
    durationMin += addon.duration_min
  }

  const subtotalCents = lines.reduce((sum, l) => sum + l.cents, 0)

  // Rounded to whole cents, and never below zero.
  const discountCents = discount
    ? Math.min(subtotalCents, Math.round((subtotalCents * discount.percent_off) / 100))
    : 0

  return {
    lines,
    subtotalCents,
    discountCents,
    totalCents: subtotalCents - discountCents,
    durationMin,
    blockedMin: durationMin + TRAVEL_BUFFER_MIN,
  }
}

/** Finds the band a given m² falls into, or null if outside every band. */
export function bandForSize(bands: PricingBand[], m2: number): PricingBand | null {
  return bands.find((b) => m2 >= b.min_m2 && m2 <= b.max_m2) ?? null
}

/** 11900 → "€ 119,00" (nl) / "€ 119.00" (en) */
export function formatCents(cents: number, locale: "nl" | "en" = "nl"): string {
  return new Intl.NumberFormat(locale === "nl" ? "nl-NL" : "en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100)
}
