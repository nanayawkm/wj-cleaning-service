import { CONTACT_DETAILS } from "@/components/constant"
import { formatCents } from "@/lib/booking/pricing"
import { TIMEZONE } from "@/lib/booking/config"

export type Lang = "nl" | "en"

export interface BookingEmailData {
  reference: string
  startsAt: Date
  endsAt: Date
  bandLabel: string
  lines: { label: string; cents: number }[]
  subtotalCents: number
  discountCents: number
  totalCents: number
  customer: { name: string; email: string; phone: string; street: string; postcode: string; city: string }
  notes?: string | null
  manageUrl: string
}

const dateLine = (d: Date, lang: Lang) =>
  new Intl.DateTimeFormat(lang === "nl" ? "nl-NL" : "en-GB", {
    timeZone: TIMEZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d)

const timeOnly = (d: Date) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: TIMEZONE, hour: "2-digit", minute: "2-digit", hour12: false }).format(d)

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

/**
 * Absolute, because a mail client has no page to resolve a relative path
 * against. Falls back to the production host rather than localhost: a
 * misconfigured env should still send a working logo to a real customer.
 */
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://wjcleaningservices.nl").replace(
  /\/$/,
  "",
)

/**
 * Email HTML is deliberately plain: tables, inline styles, no external CSS or
 * webfonts. Gmail strips <style> blocks and Outlook ignores most of modern CSS,
 * so anything cleverer degrades badly in exactly the clients people use.
 *
 * The masthead is white because the logo is navy-on-transparent — on the brand
 * teal its charcoal wordmark all but disappears. PNG, not WebP: Outlook on
 * Windows still cannot render WebP and would show a broken image.
 *
 * Served at 2x and constrained by width/style so it stays sharp on retina, and
 * carries alt text because most clients block images until the reader asks —
 * a blocked logo must still say who sent this.
 */
const shell = (title: string, body: string, footerNote: string) => `
<!doctype html>
<html><body style="margin:0;padding:0;background:#F5F0E8;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1f2937">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0E8;padding:24px 12px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #EDE6DA;border-radius:12px;overflow:hidden">
        <tr><td align="center" style="background:#ffffff;padding:24px 24px 16px">
          <img src="${SITE_URL}/images/email-logo.png"
               alt="WJ Cleaning Services"
               width="180" height="116"
               style="display:block;width:180px;height:auto;max-width:100%;border:0;outline:none;text-decoration:none">
        </td></tr>
        <tr><td style="padding:0 24px"><div style="height:3px;background:#2C5F70;font-size:0;line-height:0">&nbsp;</div></td></tr>
        <tr><td style="padding:24px">
          <h1 style="margin:0 0 16px;font-size:20px;font-weight:600;color:#111827">${esc(title)}</h1>
          ${body}
        </td></tr>
        <tr><td style="padding:16px 24px;border-top:1px solid #EDE6DA;background:#F5F0E8">
          <p style="margin:0;font-size:12px;line-height:1.6;color:#6b7280">
            ${footerNote}<br>
            WJ Cleaning Services · ${esc(CONTACT_DETAILS.city)} · ${esc(CONTACT_DETAILS.phone)}
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`

const detailRows = (d: BookingEmailData, lang: Lang) => {
  const t = lang === "nl"
    ? { when: "Wanneer", what: "Wat", where: "Waar", ref: "Referentie" }
    : { when: "When", what: "What", where: "Where", ref: "Reference" }

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:6px 0;font-size:14px;color:#6b7280;width:110px;vertical-align:top">${esc(label)}</td>
      <td style="padding:6px 0;font-size:14px;color:#111827;font-weight:500">${value}</td>
    </tr>`

  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 20px">
    ${row(t.when, `${esc(dateLine(d.startsAt, lang))}<br>${timeOnly(d.startsAt)} – ${timeOnly(d.endsAt)}`)}
    ${row(t.what, esc(d.bandLabel))}
    ${row(t.where, `${esc(d.customer.street)}<br>${esc(d.customer.postcode)} ${esc(d.customer.city)}`)}
    ${row(t.ref, `<code style="font-size:13px">${esc(d.reference)}</code>`)}
  </table>`
}

const priceTable = (d: BookingEmailData, lang: Lang) => {
  const totalLabel = lang === "nl" ? "Totaal" : "Total"
  const discountLabel = lang === "nl" ? "Korting" : "Discount"
  const rows = d.lines
    .map(
      (l) => `<tr>
        <td style="padding:4px 0;font-size:14px;color:#374151">${esc(l.label)}</td>
        <td style="padding:4px 0;font-size:14px;color:#374151;text-align:right">${formatCents(l.cents, lang)}</td>
      </tr>`,
    )
    .join("")

  const discountRow = d.discountCents
    ? `<tr>
        <td style="padding:4px 0;font-size:14px;color:#374151">${discountLabel}</td>
        <td style="padding:4px 0;font-size:14px;color:#374151;text-align:right">−${formatCents(d.discountCents, lang)}</td>
      </tr>`
    : ""

  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-top:1px solid #EDE6DA;padding-top:8px;margin:0 0 20px">
    ${rows}${discountRow}
    <tr>
      <td style="padding:10px 0 0;font-size:15px;font-weight:600;color:#111827;border-top:1px solid #EDE6DA">${totalLabel}</td>
      <td style="padding:10px 0 0;font-size:15px;font-weight:600;color:#111827;text-align:right;border-top:1px solid #EDE6DA">${formatCents(d.totalCents, lang)}</td>
    </tr>
  </table>`
}

const button = (href: string, label: string) => `
  <a href="${href}" style="display:inline-block;background:#2C5F70;color:#ffffff;text-decoration:none;padding:11px 20px;border-radius:8px;font-size:14px;font-weight:600">${esc(label)}</a>`

export function customerConfirmation(d: BookingEmailData, lang: Lang) {
  const copy = lang === "nl"
    ? {
        subject: `Boeking bevestigd · ${d.reference}`,
        title: "Uw boeking is bevestigd",
        intro: `Bedankt ${esc(d.customer.name.split(" ")[0])}, wij zien u dan.`,
        manage: "Boeking wijzigen of annuleren",
        note: "Kunt u er niet bij zijn? Laat het minimaal 24 uur van tevoren weten.",
        footer: "U ontvangt deze e-mail omdat u een afspraak heeft geboekt.",
      }
    : {
        subject: `Booking confirmed · ${d.reference}`,
        title: "Your booking is confirmed",
        intro: `Thanks ${esc(d.customer.name.split(" ")[0])}, we'll see you then.`,
        manage: "Change or cancel booking",
        note: "Can't make it? Please let us know at least 24 hours in advance.",
        footer: "You're receiving this because you booked an appointment.",
      }

  return {
    subject: copy.subject,
    html: shell(
      copy.title,
      `<p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#374151">${copy.intro}</p>
       ${detailRows(d, lang)}
       ${priceTable(d, lang)}
       <p style="margin:0 0 20px">${button(d.manageUrl, copy.manage)}</p>
       <p style="margin:0;font-size:13px;line-height:1.6;color:#6b7280">${copy.note}</p>`,
      copy.footer,
    ),
  }
}

/** Jackie's alert. Carries the detail she needs to actually do the job. */
export function ownerAlert(d: BookingEmailData, adminUrl: string) {
  return {
    subject: `New booking · ${d.reference} · ${dateLine(d.startsAt, "en")} ${timeOnly(d.startsAt)}`,
    html: shell(
      "New booking",
      `${detailRows(d, "en")}
       ${priceTable(d, "en")}
       <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 20px">
         <tr><td style="padding:6px 0;font-size:14px;color:#6b7280;width:110px">Customer</td>
             <td style="padding:6px 0;font-size:14px;color:#111827">${esc(d.customer.name)}<br>
             <a href="tel:${esc(d.customer.phone)}" style="color:#2C5F70">${esc(d.customer.phone)}</a><br>
             <a href="mailto:${esc(d.customer.email)}" style="color:#2C5F70">${esc(d.customer.email)}</a></td></tr>
         ${d.notes ? `<tr><td style="padding:6px 0;font-size:14px;color:#6b7280">Notes</td><td style="padding:6px 0;font-size:14px;color:#111827">${esc(d.notes)}</td></tr>` : ""}
       </table>
       <p style="margin:0">${button(adminUrl, "Open in dashboard")}</p>`,
      "Sent to you because a customer booked online.",
    ),
  }
}

export function rescheduleNotice(d: BookingEmailData, lang: Lang, previousStart: Date) {
  const copy = lang === "nl"
    ? {
        subject: `Afspraak verzet · ${d.reference}`,
        title: "Uw afspraak is verzet",
        intro: "Wij moesten uw afspraak verplaatsen. De nieuwe tijd staat hieronder.",
        was: "Was",
        manage: "Boeking bekijken",
        footer: "U ontvangt deze e-mail omdat uw afspraak is gewijzigd.",
      }
    : {
        subject: `Appointment rescheduled · ${d.reference}`,
        title: "Your appointment has moved",
        intro: "We've had to move your appointment. The new time is below.",
        was: "Was",
        manage: "View booking",
        footer: "You're receiving this because your appointment changed.",
      }

  return {
    subject: copy.subject,
    html: shell(
      copy.title,
      `<p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#374151">${copy.intro}</p>
       <p style="margin:0 0 16px;font-size:14px;color:#6b7280">${copy.was}: <s>${esc(dateLine(previousStart, lang))} ${timeOnly(previousStart)}</s></p>
       ${detailRows(d, lang)}
       <p style="margin:0">${button(d.manageUrl, copy.manage)}</p>`,
      copy.footer,
    ),
  }
}

export function cancellationNotice(d: BookingEmailData, lang: Lang) {
  const copy = lang === "nl"
    ? {
        subject: `Boeking geannuleerd · ${d.reference}`,
        title: "Uw boeking is geannuleerd",
        intro: "Uw afspraak is geannuleerd. Er wordt niets in rekening gebracht.",
        footer: "U ontvangt deze e-mail omdat uw boeking is geannuleerd.",
      }
    : {
        subject: `Booking cancelled · ${d.reference}`,
        title: "Your booking is cancelled",
        intro: "Your appointment has been cancelled. Nothing will be charged.",
        footer: "You're receiving this because your booking was cancelled.",
      }

  return {
    subject: copy.subject,
    html: shell(
      copy.title,
      `<p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#374151">${copy.intro}</p>
       ${detailRows(d, lang)}`,
      copy.footer,
    ),
  }
}
