import type { TranslationKey } from "@/contexts/LanguageContext"

/**
 * The service list behind the contact form's dropdown.
 *
 * Shared deliberately. The options used to be twelve `<option>` literals inside
 * the page, which meant the server had no way to know what a valid answer looked
 * like — it could only take whatever string arrived. Here the same array builds
 * the dropdown *and* the zod enum in `/api/contact`, so an enquiry naming a
 * service that does not exist is rejected rather than emailed.
 *
 * `label` is English and lives on the server side of that boundary on purpose:
 * the alert to Jackie must be readable regardless of which language the sender
 * was browsing in, and a label chosen server-side from a fixed list cannot be
 * used to inject anything into the email. The visitor still sees `tKey`
 * rendered in their own language.
 */
export interface ContactService {
  value: string
  group: "cleaning" | "staffing"
  tKey: TranslationKey
  label: string
}

export const CONTACT_SERVICES = [
  { value: "residential", group: "cleaning", tKey: "residentialCleaning", label: "Residential cleaning" },
  { value: "office", group: "cleaning", tKey: "officeCleaning", label: "Office cleaning" },
  { value: "warehouse-cleaning", group: "cleaning", tKey: "warehouseCleaning", label: "Warehouse cleaning" },
  { value: "restaurant-cleaning", group: "cleaning", tKey: "restaurantCleaning", label: "Restaurant cleaning" },
  { value: "hotel-cleaning", group: "cleaning", tKey: "hotelCleaning", label: "Hotel cleaning" },
  { value: "school-cleaning", group: "cleaning", tKey: "schoolCleaning", label: "School cleaning" },
  { value: "warehouse", group: "staffing", tKey: "warehouseStaffing", label: "Warehouse staffing" },
  { value: "event", group: "staffing", tKey: "eventStaffing", label: "Event staffing" },
  { value: "office-support", group: "staffing", tKey: "officeSupportStaff", label: "Office support staff" },
  { value: "restaurant-cafe", group: "staffing", tKey: "restaurantCafePersonnel", label: "Restaurant & cafe personnel" },
  { value: "hotel", group: "staffing", tKey: "hotelStaff", label: "Hotel staff" },
  { value: "school", group: "staffing", tKey: "schoolSupportStaff", label: "School support staff" },
] as const satisfies readonly ContactService[]

export const SERVICE_VALUES = CONTACT_SERVICES.map((s) => s.value) as [string, ...string[]]

export const serviceLabel = (value: string): string =>
  CONTACT_SERVICES.find((s) => s.value === value)?.label ?? value
