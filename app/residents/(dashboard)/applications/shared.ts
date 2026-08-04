import { careersCopy } from "@/app/careers/copy"

/**
 * Types and constants shared by the page, its server actions and the list.
 *
 * Separate from actions.ts because a "use server" module may only export async
 * functions — a plain const there is a build error.
 */

export const STATUSES = ["new", "shortlisted", "contacted", "hired", "rejected"] as const
export type ApplicationStatus = (typeof STATUSES)[number]

/** Must match the promise in the consent text on /careers. */
export const RETENTION_MONTHS = 12

export interface ApplicationRow {
  id: string
  reference: string
  name: string
  email: string
  phone: string
  city: string
  availability: string
  experience: string
  transport: string
  languages: string[]
  motivation: string
  status: ApplicationStatus
  notes: string | null
  createdAt: string
  consentAt: string
  /** Past the retention period, so it should be deleted. */
  overdue: boolean
}

/*
  The dashboard reads the applicant's stored option keys back as English
  labels, reusing the careers page's own dictionary. Duplicating the strings
  here would mean adding an option to the form and silently seeing a raw
  "nightShift" appear in the dashboard.
*/
const en = careersCopy.en

export const labelFor = {
  availability: (k: string) => en.availabilityOptions[k as keyof typeof en.availabilityOptions] ?? k,
  experience: (k: string) => en.experienceOptions[k as keyof typeof en.experienceOptions] ?? k,
  transport: (k: string) => en.transportOptions[k as keyof typeof en.transportOptions] ?? k,
  language: (k: string) => en.languageOptions[k as keyof typeof en.languageOptions] ?? k,
}

export const STATUS_STYLES: Record<ApplicationStatus, string> = {
  new: "bg-wj-dark text-white ring-wj-dark",
  shortlisted: "bg-amber-50 text-amber-700 ring-amber-600/20",
  contacted: "bg-blue-50 text-blue-700 ring-blue-600/20",
  hired: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  rejected: "bg-gray-100 text-gray-500 ring-gray-500/20",
}
