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
  /** Echoed back so the customer can see their answer was recorded. */
  hasPets?: boolean | null
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
    ? { when: "Wanneer", what: "Wat", where: "Waar", ref: "Referentie", notes: "Uw opmerkingen", pets: "Huisdieren", yes: "Ja", no: "Nee" }
    : { when: "When", what: "What", where: "Where", ref: "Reference", notes: "Your notes", pets: "Pets", yes: "Yes", no: "No" }

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:6px 0;font-size:14px;color:#6b7280;width:110px;vertical-align:top">${esc(label)}</td>
      <td style="padding:6px 0;font-size:14px;color:#111827;font-weight:500">${value}</td>
    </tr>`

  /*
    Notes and the pets answer are echoed back to the customer, not just sent to
    Jackie. If someone wrote "key is with the neighbour at no. 14" they need to
    see it was received — otherwise the only way to check is to ring up and ask.
  */
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 20px">
    ${row(t.when, `${esc(dateLine(d.startsAt, lang))}<br>${timeOnly(d.startsAt)} – ${timeOnly(d.endsAt)}`)}
    ${row(t.what, esc(d.bandLabel))}
    ${row(t.where, `${esc(d.customer.street)}<br>${esc(d.customer.postcode)} ${esc(d.customer.city)}`)}
    ${typeof d.hasPets === "boolean" ? row(t.pets, d.hasPets ? esc(t.yes) : esc(t.no)) : ""}
    ${d.notes ? row(t.notes, esc(d.notes).replace(/\n/g, "<br>")) : ""}
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

/* ========================================================================
   Job applications
   ======================================================================== */

export interface ApplicationEmailData {
  reference: string
  name: string
  email: string
  phone: string
  city: string
  availability: string
  experience: string
  transport: string
  /** Option keys, resolved to readable labels below. */
  languages: string[]
  motivation: string
  submittedAt: Date
}

/**
 * The form posts option keys, not prose, so the labels live here — one place
 * that serves both the applicant's confirmation (in their language) and
 * Jackie's alert (always English, because she triages in one language).
 */
const APPLICATION_LABELS = {
  en: {
    availability: {
      fulltime: "Full-time",
      parttime: "Part-time",
      flexible: "Flexible / on call",
      weekends: "Weekends only",
    },
    experience: {
      none: "No experience yet",
      lessThanOne: "Less than a year",
      oneToThree: "One to three years",
      threePlus: "More than three years",
    },
    transport: {
      ownCarLicence: "Own car and driving licence",
      licenceNoCar: "Driving licence, no car",
      bicycle: "Bicycle or scooter",
      publicTransport: "Public transport",
    },
    languages: { nl: "Dutch", en: "English", other: "Another language" },
  },
  nl: {
    availability: {
      fulltime: "Fulltime",
      parttime: "Parttime",
      flexible: "Flexibel / oproepbasis",
      weekends: "Alleen weekenden",
    },
    experience: {
      none: "Nog geen ervaring",
      lessThanOne: "Minder dan een jaar",
      oneToThree: "Eén tot drie jaar",
      threePlus: "Meer dan drie jaar",
    },
    transport: {
      ownCarLicence: "Eigen auto en rijbewijs",
      licenceNoCar: "Rijbewijs, geen auto",
      bicycle: "Fiets of scooter",
      publicTransport: "Openbaar vervoer",
    },
    languages: { nl: "Nederlands", en: "Engels", other: "Een andere taal" },
  },
} as const

/** Falls back to the raw key rather than an empty cell — a blank row in
 *  Jackie's email would look like the applicant skipped the question. */
const label = (group: Record<string, string>, key: string) => group[key] ?? key

const applicationRows = (d: ApplicationEmailData, lang: Lang) => {
  const L = APPLICATION_LABELS[lang]
  const t =
    lang === "nl"
      ? { name: "Naam", contact: "Contact", city: "Woonplaats", availability: "Beschikbaarheid", experience: "Ervaring", transport: "Vervoer", languages: "Talen", ref: "Referentie" }
      : { name: "Name", contact: "Contact", city: "Lives in", availability: "Availability", experience: "Experience", transport: "Transport", languages: "Languages", ref: "Reference" }

  const row = (l: string, value: string) => `
    <tr>
      <td style="padding:6px 0;font-size:14px;color:#6b7280;width:130px;vertical-align:top">${esc(l)}</td>
      <td style="padding:6px 0;font-size:14px;color:#111827;font-weight:500">${value}</td>
    </tr>`

  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 20px">
    ${row(t.name, esc(d.name))}
    ${row(
      t.contact,
      `<a href="tel:${esc(d.phone)}" style="color:#2C5F70;text-decoration:none">${esc(d.phone)}</a><br>
       <a href="mailto:${esc(d.email)}" style="color:#2C5F70;text-decoration:none">${esc(d.email)}</a>`,
    )}
    ${row(t.city, esc(d.city))}
    ${row(t.availability, esc(label(L.availability, d.availability)))}
    ${row(t.experience, esc(label(L.experience, d.experience)))}
    ${row(t.transport, esc(label(L.transport, d.transport)))}
    ${row(t.languages, esc(d.languages.map((l) => label(L.languages, l)).join(", ")))}
    ${row(t.ref, `<code style="font-size:13px">${esc(d.reference)}</code>`)}
  </table>`
}

const motivationBlock = (d: ApplicationEmailData, heading: string) => `
  <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.04em">${esc(heading)}</p>
  <div style="margin:0 0 20px;padding:14px 16px;background:#F5F0E8;border-left:3px solid #2C5F70;font-size:14px;line-height:1.65;color:#374151">
    ${esc(d.motivation).replace(/\n/g, "<br>")}
  </div>`

/**
 * The applicant's receipt.
 *
 * Deliberately echoes back everything they submitted. An open application has
 * no vacancy attached and no date to look forward to, so this email is the only
 * evidence the applicant has that it arrived at all — "we got it, here is what
 * you told us, here is what happens next" is the whole job.
 */
export function applicationConfirmation(d: ApplicationEmailData, lang: Lang) {
  const first = esc(d.name.split(" ")[0])
  const copy =
    lang === "nl"
      ? {
          subject: `Sollicitatie ontvangen · ${d.reference}`,
          title: "Wij hebben uw sollicitatie ontvangen",
          intro: `Bedankt ${first}, uw open sollicitatie is bij ons binnengekomen.`,
          next: "Jackie leest elke sollicitatie persoonlijk en neemt contact met u op zodra er werk beschikbaar komt dat bij u past. Omdat dit een open sollicitatie is, kan dat even duren — wij bewaren uw gegevens tot er iets voorbijkomt.",
          summary: "Wat u ons heeft verteld",
          motivation: "Uw motivatie",
          cv: `Wilt u nog een cv meesturen? Beantwoord deze e-mail en voeg het toe — uw antwoord komt rechtstreeks bij ons binnen.`,
          footer: "U ontvangt deze e-mail omdat u heeft gesolliciteerd via onze website.",
        }
      : {
          subject: `Application received · ${d.reference}`,
          title: "We've received your application",
          intro: `Thanks ${first}, your open application has reached us.`,
          next: "Jackie reads every application personally and will contact you as soon as there's work available that suits you. Because this is an open application it may take a little while — we'll keep your details on file until something comes up.",
          summary: "What you told us",
          motivation: "Your motivation",
          cv: `Want to send a CV as well? Just reply to this email and attach it — your reply comes straight to us.`,
          footer: "You're receiving this because you applied through our website.",
        }

  return {
    subject: copy.subject,
    html: shell(
      copy.title,
      `<p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#374151">${copy.intro}</p>
       <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#374151">${copy.next}</p>
       <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.04em">${esc(copy.summary)}</p>
       ${applicationRows(d, lang)}
       ${motivationBlock(d, copy.motivation)}
       <p style="margin:0;font-size:13px;line-height:1.6;color:#6b7280">${copy.cv}</p>`,
      copy.footer,
    ),
  }
}

/**
 * Jackie's copy. replyTo on the send is set to the applicant, not the office —
 * hitting reply on this email should start the conversation, not send a note
 * to herself.
 */
export function applicationAlert(d: ApplicationEmailData) {
  const when = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE,
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d.submittedAt)

  return {
    subject: `New cleaner application · ${d.name} · ${d.city}`,
    html: shell(
      "New cleaner application",
      `<p style="margin:0 0 20px;font-size:14px;color:#6b7280">Received ${esc(when)}</p>
       ${applicationRows(d, "en")}
       ${motivationBlock(d, "Motivation")}
       <p style="margin:0 0 20px">${button(`mailto:${d.email}?subject=${encodeURIComponent(`Your application to WJ Cleaning Services (${d.reference})`)}`, "Reply to applicant")}</p>
       <p style="margin:0;font-size:13px;line-height:1.6;color:#6b7280">Replying to this email also reaches ${esc(d.name)} directly.</p>`,
      "Sent to you because someone applied through the website.",
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

/* ------------------------------------------------------------------ contact */

export interface ContactEmailData {
  reference: string
  name: string
  email: string
  /** Optional on the form, so it is omitted from the tables rather than blank. */
  phone?: string
  /** English label resolved server-side from the fixed service list. */
  service: string
  message: string
  submittedAt: Date
}

const contactRows = (d: ContactEmailData, lang: Lang) => {
  const t =
    lang === "nl"
      ? { name: "Naam", email: "E-mail", phone: "Telefoon", service: "Dienst", ref: "Referentie" }
      : { name: "Name", email: "Email", phone: "Phone", service: "Service", ref: "Reference" }

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:6px 0;font-size:14px;color:#6b7280;width:110px;vertical-align:top">${esc(label)}</td>
      <td style="padding:6px 0;font-size:14px;color:#111827;font-weight:500">${value}</td>
    </tr>`

  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 20px">
    ${row(t.name, esc(d.name))}
    ${row(t.email, esc(d.email))}
    ${d.phone ? row(t.phone, esc(d.phone)) : ""}
    ${row(t.service, esc(d.service))}
    ${row(t.ref, `<code style="font-size:13px">${esc(d.reference)}</code>`)}
  </table>`
}

/*
  The message is echoed back to the sender, not only forwarded to Jackie. An
  enquiry form that answers "thanks, we got it" without showing what it got
  leaves the sender no way to tell a delivered message from a swallowed one —
  which is the exact failure this whole route exists to end.
*/
const messageBlock = (d: ContactEmailData, heading: string) => `
  <p style="margin:0 0 6px;font-size:14px;color:#6b7280">${esc(heading)}</p>
  <div style="margin:0 0 20px;padding:12px 14px;background:#F5F0E8;border:1px solid #EDE6DA;border-radius:8px;font-size:14px;line-height:1.6;color:#111827">${esc(
    d.message,
  ).replace(/\n/g, "<br>")}</div>`

export function contactAlert(d: ContactEmailData) {
  const when = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE,
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d.submittedAt)

  return {
    subject: `New enquiry · ${d.service} · ${d.name}`,
    html: shell(
      "New enquiry from the website",
      `<p style="margin:0 0 20px;font-size:14px;color:#6b7280">Received ${esc(when)}</p>
       ${contactRows(d, "en")}
       ${messageBlock(d, "Message")}
       <p style="margin:0 0 20px">${button(
         `mailto:${d.email}?subject=${encodeURIComponent(`Re: your enquiry to WJ Cleaning Services (${d.reference})`)}`,
         "Reply to sender",
       )}</p>
       <p style="margin:0;font-size:13px;line-height:1.6;color:#6b7280">Replying to this email also reaches ${esc(
         d.name,
       )} directly.</p>`,
      "Sent to you because someone used the contact form.",
    ),
  }
}

export function contactConfirmation(d: ContactEmailData, lang: Lang) {
  const first = esc(d.name.split(" ")[0])
  const copy =
    lang === "nl"
      ? {
          subject: `Bericht ontvangen · ${d.reference}`,
          title: "Wij hebben uw bericht ontvangen",
          intro: `Bedankt ${first}, uw bericht is bij ons binnengekomen.`,
          next: "Wij reageren binnen vier werkuren. Heeft u haast? Bel of WhatsApp ons gerust — dat is altijd sneller dan e-mail.",
          summary: "Wat u ons heeft gestuurd",
          message: "Uw bericht",
          footer: "U ontvangt deze e-mail omdat u het contactformulier op onze website heeft gebruikt.",
        }
      : {
          subject: `Message received · ${d.reference}`,
          title: "We've got your message",
          intro: `Thanks ${first} — your message has reached us.`,
          next: "We reply within four working hours. In a hurry? Call or WhatsApp us instead; that is always faster than email.",
          summary: "What you sent us",
          message: "Your message",
          footer: "You're receiving this because you used the contact form on our website.",
        }

  return {
    subject: copy.subject,
    html: shell(
      copy.title,
      `<p style="margin:0 0 16px;font-size:15px;line-height:1.6">${copy.intro}</p>
       <p style="margin:0 0 20px;font-size:15px;line-height:1.6">${copy.next}</p>
       <p style="margin:0 0 6px;font-size:14px;color:#6b7280">${esc(copy.summary)}</p>
       ${contactRows(d, lang)}
       ${messageBlock(d, copy.message)}`,
      copy.footer,
    ),
  }
}
