"use client"

import { useState, useTransition } from "react"
import {
  ArrowLeft,
  CalendarBlank,
  CheckCircle,
  CircleNotch,
  MapPin,
  Prohibit,
  Warning,
} from "@phosphor-icons/react"

import { formatCents } from "@/lib/booking/pricing"
import { MIN_NOTICE_HOURS, TIMEZONE } from "@/lib/booking/config"
import { CONTACT_DETAILS } from "@/components/constant"
import { SlotPicker } from "@/app/book/components/slot-picker"
import { cancelBooking, rescheduleBooking } from "./actions"

interface BookingView {
  reference: string
  startsAtISO: string
  endsAtISO: string
  durationMin: number
  status: "confirmed" | "rescheduled" | "completed" | "cancelled" | "no_show"
  m2Label: string
  deepCleaning: boolean
  washingUp: boolean
  lines: { label: string; cents: number }[]
  totalCents: number
  discountCents: number
  language: "nl" | "en"
  customerName: string
  address: string
}

type Mode = "view" | "reschedule" | "confirm-cancel" | "cancelled" | "moved"

/**
 * One screen, two actions. Everything else the customer might want — changing
 * the size, adding a deep clean — changes the price and the duration, so it
 * goes through a person rather than a form.
 */
export function ManagePanel({ token, booking }: { token: string; booking: BookingView }) {
  const nl = booking.language === "nl"
  const [mode, setMode] = useState<Mode>("view")
  const [picked, setPicked] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const [current, setCurrent] = useState(booking.startsAtISO)

  const t = nl
    ? {
        title: "Uw boeking", ref: "Referentie",
        when: "Wanneer", what: "Wat", where: "Waar", total: "Totaal",
        deep: "Dieptereiniging", wash: "Afwas doen",
        reschedule: "Tijd wijzigen", cancel: "Boeking annuleren",
        back: "Terug", keep: "Nee, behouden",
        confirmMove: "Nieuwe tijd bevestigen", confirmCancel: "Ja, annuleren",
        pickNew: "Kies een nieuwe tijd",
        sureTitle: "Deze boeking annuleren?",
        sureBody: "Uw tijdslot komt direct vrij. U kunt daarna altijd opnieuw boeken.",
        shortNotice: `Dit is binnen ${MIN_NOTICE_HOURS} uur. Bel ons ook even, dan weten we het zeker.`,
        cancelledTitle: "Uw boeking is geannuleerd",
        cancelledBody: "We hebben u een bevestiging gestuurd. Er wordt niets in rekening gebracht.",
        movedTitle: "Uw afspraak is verzet",
        movedBody: "We hebben u een nieuwe bevestiging met agenda-uitnodiging gestuurd.",
        doneTitle: "Deze boeking is afgerond",
        cancelledAlready: "Deze boeking is geannuleerd",
        needChange: "Iets anders wijzigen?",
        needChangeBody: "Bel ons voor een andere grootte of extra's — dan passen we de prijs meteen aan.",
        bookAgain: "Opnieuw boeken",
      }
    : {
        title: "Your booking", ref: "Reference",
        when: "When", what: "What", where: "Where", total: "Total",
        deep: "Deep cleaning", wash: "Washing up",
        reschedule: "Change time", cancel: "Cancel booking",
        back: "Back", keep: "No, keep it",
        confirmMove: "Confirm new time", confirmCancel: "Yes, cancel",
        pickNew: "Pick a new time",
        sureTitle: "Cancel this booking?",
        sureBody: "Your slot is released straight away. You can always book again afterwards.",
        shortNotice: `This is within ${MIN_NOTICE_HOURS} hours. Please call us as well so we know for certain.`,
        cancelledTitle: "Your booking is cancelled",
        cancelledBody: "We've sent you a confirmation. Nothing will be charged.",
        movedTitle: "Your appointment has moved",
        movedBody: "We've sent a new confirmation with a calendar invite.",
        doneTitle: "This booking is complete",
        cancelledAlready: "This booking was cancelled",
        needChange: "Need to change something else?",
        needChangeBody: "Call us for a different size or extras — we'll adjust the price there and then.",
        bookAgain: "Book again",
      }

  const fmtLong = (iso: string) =>
    new Intl.DateTimeFormat(nl ? "nl-NL" : "en-GB", {
      timeZone: TIMEZONE,
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    }).format(new Date(iso))

  const fmtTime = (iso: string) =>
    new Intl.DateTimeFormat("en-GB", {
      timeZone: TIMEZONE, hour: "2-digit", minute: "2-digit", hour12: false,
    }).format(new Date(iso))

  const endOf = (startISO: string) =>
    new Date(new Date(startISO).getTime() + booking.durationMin * 60_000).toISOString()

  const isShortNotice =
    new Date(current).getTime() - Date.now() < MIN_NOTICE_HOURS * 3_600_000

  const active = booking.status === "confirmed" || booking.status === "rescheduled"

  /* ------------------------------------------------------ terminal states */

  if (mode === "cancelled" || (mode === "view" && booking.status === "cancelled")) {
    return (
      <Result
        Icon={Prohibit}
        tone="text-gray-400"
        title={mode === "cancelled" ? t.cancelledTitle : t.cancelledAlready}
        body={mode === "cancelled" ? t.cancelledBody : ""}
        cta={{ href: "/book", label: t.bookAgain }}
      />
    )
  }

  if (mode === "moved") {
    return (
      <Result
        Icon={CheckCircle}
        tone="text-wj-dark"
        title={t.movedTitle}
        body={`${fmtLong(current)}, ${fmtTime(current)} – ${fmtTime(endOf(current))}. ${t.movedBody}`}
      />
    )
  }

  if (!active) {
    return <Result Icon={CheckCircle} tone="text-wj-dark" title={t.doneTitle} body="" cta={{ href: "/book", label: t.bookAgain }} />
  }

  /* -------------------------------------------------------------- actions */

  const doCancel = () =>
    startTransition(async () => {
      setError(null)
      const r = await cancelBooking(token)
      if (r.ok) setMode("cancelled")
      else setError(r.error)
    })

  const doReschedule = () => {
    if (!picked) return
    startTransition(async () => {
      setError(null)
      const r = await rescheduleBooking(token, picked)
      if (r.ok) {
        setCurrent(picked)
        setMode("moved")
      } else {
        setError(r.error)
      }
    })
  }

  /* ----------------------------------------------------------------- view */

  return (
    <div className="border border-gray-200 bg-white">
      <div className="flex items-baseline justify-between gap-3 border-b border-gray-200 px-5 py-4">
        <h1 className="text-lg font-semibold tracking-tight text-gray-900">{t.title}</h1>
        <p className="text-sm text-gray-500">
          {t.ref} <span className="font-medium text-gray-900">{booking.reference}</span>
        </p>
      </div>

      {mode === "view" && (
        <>
          <dl className="divide-y divide-gray-100 px-5">
            <Row icon={<CalendarBlank className="h-4 w-4" />} label={t.when}>
              <span className="font-medium text-gray-900 first-letter:uppercase">
                {fmtLong(current)}
              </span>
              <br />
              <span className="text-gray-700 tabular-nums">
                {fmtTime(current)} – {fmtTime(endOf(current))}
              </span>
            </Row>
            <Row label={t.what}>
              <span className="text-gray-900">{booking.m2Label}</span>
              {(booking.deepCleaning || booking.washingUp) && (
                <span className="mt-1 flex flex-wrap gap-1.5">
                  {booking.deepCleaning && <Chip>{t.deep}</Chip>}
                  {booking.washingUp && <Chip>{t.wash}</Chip>}
                </span>
              )}
            </Row>
            <Row icon={<MapPin className="h-4 w-4" />} label={t.where}>
              <span className="text-gray-900">{booking.address}</span>
            </Row>
            <Row label={t.total}>
              <span className="text-lg font-semibold text-wj-dark tabular-nums">
                {formatCents(booking.totalCents, booking.language)}
              </span>
            </Row>
          </dl>

          {isShortNotice && (
            <p className="mx-5 mb-4 flex items-start gap-2 border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900">
              <Warning weight="fill" className="mt-0.5 h-4 w-4 flex-shrink-0" />
              {t.shortNotice}
            </p>
          )}

          {error && <ErrorNote>{error}</ErrorNote>}

          <div className="flex flex-col gap-2 border-t border-gray-200 px-5 py-4 sm:flex-row-reverse">
            <button
              type="button"
              onClick={() => setMode("reschedule")}
              className="inline-flex h-11 items-center justify-center bg-wj-dark px-5 text-sm font-semibold text-white transition-colors hover:bg-wj-hover"
            >
              {t.reschedule}
            </button>
            <button
              type="button"
              onClick={() => setMode("confirm-cancel")}
              className="inline-flex h-11 items-center justify-center border border-gray-300 px-5 text-sm font-semibold text-gray-700 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700"
            >
              {t.cancel}
            </button>
          </div>

          <div className="border-t border-gray-100 bg-gray-50/70 px-5 py-4">
            <p className="text-sm font-medium text-gray-900">{t.needChange}</p>
            <p className="mt-1 text-sm text-gray-600">
              {t.needChangeBody}{" "}
              <a href={`tel:${CONTACT_DETAILS.phoneTel}`} className="font-semibold text-wj-dark underline underline-offset-2">
                {CONTACT_DETAILS.phone}
              </a>
            </p>
          </div>
        </>
      )}

      {mode === "confirm-cancel" && (
        <div className="px-5 py-6">
          <h2 className="text-base font-semibold text-gray-900">{t.sureTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">{t.sureBody}</p>
          <p className="mt-4 border-l-2 border-gray-200 pl-3 text-sm text-gray-700">
            <span className="first-letter:uppercase">{fmtLong(current)}</span>, {fmtTime(current)}
          </p>

          {error && <ErrorNote>{error}</ErrorNote>}

          <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
            <button
              type="button"
              onClick={doCancel}
              disabled={pending}
              className="inline-flex h-11 min-w-[8rem] items-center justify-center bg-red-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
            >
              {pending ? <CircleNotch className="h-5 w-5 animate-spin" /> : t.confirmCancel}
            </button>
            <button
              type="button"
              onClick={() => { setMode("view"); setError(null) }}
              disabled={pending}
              className="inline-flex h-11 items-center justify-center border border-gray-300 px-5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              {t.keep}
            </button>
          </div>
        </div>
      )}

      {mode === "reschedule" && (
        <div className="px-5 py-5">
          <button
            type="button"
            onClick={() => { setMode("view"); setPicked(null); setError(null) }}
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" /> {t.back}
          </button>

          <h2 className="mb-4 text-base font-semibold text-gray-900">{t.pickNew}</h2>

          {/*
            Seeded with the original add-ons so the offered slots are sized for
            this job. A 4-hour booking must not be offered a 3-hour gap.
          */}
          <SlotPicker
            deepCleaning={booking.deepCleaning}
            washingUp={booking.washingUp}
            value={picked}
            onSelect={(startsAt) => setPicked(startsAt)}
          />

          {error && <ErrorNote>{error}</ErrorNote>}

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={doReschedule}
              disabled={!picked || pending}
              className="inline-flex h-11 min-w-[10rem] items-center justify-center bg-wj-dark px-5 text-sm font-semibold text-white transition-colors hover:bg-wj-hover disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
            >
              {pending ? <CircleNotch className="h-5 w-5 animate-spin" /> : t.confirmMove}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ pieces */

function Row({
  label, icon, children,
}: {
  label: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-4 py-3.5">
      <dt className="flex w-24 flex-shrink-0 items-start gap-1.5 pt-0.5 text-sm text-gray-500">
        {icon}
        {label}
      </dt>
      <dd className="min-w-0 flex-1 text-sm">{children}</dd>
    </div>
  )
}

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
    {children}
  </span>
)

const ErrorNote = ({ children }: { children: React.ReactNode }) => (
  <p role="alert" className="mt-4 border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800">
    {children}
  </p>
)

function Result({
  Icon, tone, title, body, cta,
}: {
  Icon: typeof CheckCircle
  tone: string
  title: string
  body: string
  cta?: { href: string; label: string }
}) {
  return (
    <div className="border border-gray-200 bg-white p-8 text-center">
      <Icon weight="fill" className={`mx-auto h-10 w-10 ${tone}`} />
      <h1 className="mt-5 text-xl font-semibold tracking-tight text-gray-900">{title}</h1>
      {body && <p className="mt-3 leading-relaxed text-gray-600">{body}</p>}
      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        {cta && (
          <a
            href={cta.href}
            className="inline-flex h-11 items-center justify-center bg-wj-dark px-5 text-sm font-semibold text-white transition-colors hover:bg-wj-hover"
          >
            {cta.label}
          </a>
        )}
        <a
          href={`tel:${CONTACT_DETAILS.phoneTel}`}
          className="inline-flex h-11 items-center justify-center border border-gray-300 px-5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          {CONTACT_DETAILS.phone}
        </a>
      </div>
    </div>
  )
}
