import { TIMEZONE } from "@/lib/booking/config"

/**
 * Minimal iCalendar file for the confirmation email.
 *
 * Times are written in UTC with a trailing Z, which every calendar client
 * converts to the reader's own zone. Writing local times without a VTIMEZONE
 * block is the usual way these end up an hour out.
 */

const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")

/** Folds long lines at 75 octets and escapes the characters RFC 5545 reserves. */
const field = (name: string, value: string) => {
  const escaped = value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n")
  const line = `${name}:${escaped}`
  const chunks: string[] = []
  for (let i = 0; i < line.length; i += 74) {
    chunks.push((i === 0 ? "" : " ") + line.slice(i, i + 74))
  }
  return chunks.join("\r\n")
}

export function buildIcs({
  uid,
  startsAt,
  endsAt,
  summary,
  description,
  location,
  organiserEmail,
}: {
  uid: string
  startsAt: Date
  endsAt: Date
  summary: string
  description: string
  location: string
  organiserEmail: string
}): string {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//WJ Cleaning Services//Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    field("UID", uid),
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(startsAt)}`,
    `DTEND:${stamp(endsAt)}`,
    field("SUMMARY", summary),
    field("DESCRIPTION", description),
    field("LOCATION", location),
    field("ORGANIZER;CN=WJ Cleaning Services", `mailto:${organiserEmail}`),
    `X-WR-TIMEZONE:${TIMEZONE}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")
}
