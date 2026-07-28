import type { Addon, PricingBand } from "@/lib/booking/pricing"

export interface BookingCatalogue {
  bands: PricingBand[]
  addons: Addon[]
}

export interface CustomerDetails {
  name: string
  email: string
  phone: string
  street: string
  postcode: string
  city: string
}

export interface BookingDraft {
  bandId: string | null
  deepCleaning: boolean
  washingUp: boolean
  startsAt: string | null
  endsAt: string | null
  discountCode: string
  customer: CustomerDetails
  notes: string
  marketingConsent: boolean
}

export const emptyDraft: BookingDraft = {
  bandId: null,
  deepCleaning: false,
  washingUp: false,
  startsAt: null,
  endsAt: null,
  discountCode: "",
  customer: { name: "", email: "", phone: "", street: "", postcode: "", city: "" },
  notes: "",
  marketingConsent: false,
}

export type StepId = "size" | "extras" | "when" | "details"

export const STEP_ORDER: StepId[] = ["size", "extras", "when", "details"]
