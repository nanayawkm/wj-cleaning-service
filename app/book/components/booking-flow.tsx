"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleNotch,
  Clock,
  Drop,
  House,
  Sparkle,
  Tag,
} from "@phosphor-icons/react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/contexts/LanguageContext"
import { BASE_DURATION_MIN } from "@/lib/booking/config"
import { calculateQuote, formatCents } from "@/lib/booking/pricing"
import { SlotPicker } from "./slot-picker"
import { STEP_ORDER, emptyDraft, type BookingCatalogue, type BookingDraft, type StepId } from "../types"

/**
 * The booking surface is a contained application panel rather than a page of
 * form fields: a fixed header carrying progress and the running total, a
 * working area beneath it, and a fixed action bar. The chrome never moves
 * between steps, so only the answer being asked for changes — which is what
 * makes four steps feel like one short task.
 *
 * The total lives in the header rather than a side rail. A rail that reads
 * "choose a size to see the price" for the whole of step one is dead weight on
 * the widest part of the screen.
 */
export function BookingFlow({ catalogue }: { catalogue: BookingCatalogue }) {
  const { language } = useLanguage()
  const router = useRouter()
  const nl = language === "nl"

  const [step, setStep] = useState<StepId>("size")
  const [draft, setDraft] = useState<BookingDraft>(emptyDraft)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const band = catalogue.bands.find((b) => b.id === draft.bandId) ?? null

  const quote = useMemo(() => {
    if (!band) return null
    return calculateQuote({
      band,
      deepCleaning: draft.deepCleaning,
      addonSlugs: draft.washingUp ? ["washing-up"] : [],
      addons: catalogue.addons,
    })
  }, [band, draft.deepCleaning, draft.washingUp, catalogue.addons])

  const copy = nl
    ? {
        size: "Grootte", extras: "Extra's", when: "Wanneer", details: "Gegevens",
        sizeQ: "Hoe groot is uw woning?",
        sizeHint: "De prijs staat vast per grootte — geen verrassingen achteraf.",
        outside: "Kleiner of groter dan dit?",
        outsideLink: "Vraag een prijs op maat aan",
        extrasQ: "Extra's toevoegen",
        extrasHint: "Optioneel. Elke extra verlengt de afspraak.",
        deepName: "Dieptereiniging", deepDesc: "Ontkalken, binnenkant kasten, ramen binnen & buiten",
        washName: "Afwas doen", washDesc: "Wij doen de afwas voor u",
        code: "Kortingscode", codePlaceholder: "bijv. WELKOM20",
        codeHint: "Van uw flyer. Wordt verrekend bij bevestiging.",
        whenQ: "Kies uw moment",
        whenHint: "Alle tijden zijn Nederlandse tijd.",
        detailsQ: "Uw gegevens",
        detailsHint: "We gebruiken dit alleen om de afspraak te bevestigen en langs te komen.",
        contactGroup: "Contactgegevens", addressGroup: "Waar komen we schoonmaken?",
        name: "Volledige naam", email: "E-mailadres", phone: "Telefoonnummer",
        street: "Straat en huisnummer", postcode: "Postcode", city: "Plaats",
        notes: "Opmerkingen", notesPlaceholder: "Toegang, parkeren, huisdieren…",
        notesHint: "Geen medische of gevoelige informatie, alstublieft.",
        consent: "Stuur mij aanbiedingen en kortingen",
        consentHint: "Optioneel. U kunt zich altijd afmelden.",
        back: "Terug", next: "Volgende", confirm: "Boeking bevestigen",
        total: "Totaal", subtotal: "Subtotaal", duration: "Duur",
        summary: "Uw boeking", none: "Geen",
        hour: "uur", hours: "uur", minutes: "min", approx: "ca.",
        required: "Vul alle verplichte velden in.",
        taken: "Dat moment is net bezet. Kies een ander tijdstip.",
        failed: "Er ging iets mis. Probeer het opnieuw.",
        step: "Stap", of: "van",
        noPrice: "Kies een grootte",
      }
    : {
        size: "Size", extras: "Extras", when: "When", details: "Details",
        sizeQ: "How big is your home?",
        sizeHint: "The price is fixed per size — nothing added afterwards.",
        outside: "Smaller or larger than this?",
        outsideLink: "Ask for a custom price",
        extrasQ: "Add extras",
        extrasHint: "Optional. Each extra makes the visit longer.",
        deepName: "Deep cleaning", deepDesc: "Descaling, inside cupboards, windows inside & out",
        washName: "Washing up", washDesc: "We'll do the washing up for you",
        code: "Discount code", codePlaceholder: "e.g. WELKOM20",
        codeHint: "From your flyer. Applied when you confirm.",
        whenQ: "Choose your time",
        whenHint: "All times are Netherlands time.",
        detailsQ: "Your details",
        detailsHint: "Used only to confirm the booking and turn up at the right door.",
        contactGroup: "Contact details", addressGroup: "Where are we cleaning?",
        name: "Full name", email: "Email address", phone: "Phone number",
        street: "Street and number", postcode: "Postcode", city: "City",
        notes: "Notes", notesPlaceholder: "Access, parking, pets…",
        notesHint: "Please don't include medical or sensitive information.",
        consent: "Send me offers and discounts",
        consentHint: "Optional. You can unsubscribe at any time.",
        back: "Back", next: "Next", confirm: "Confirm booking",
        total: "Total", subtotal: "Subtotal", duration: "Duration",
        summary: "Your booking", none: "None",
        hour: "hr", hours: "hrs", minutes: "min", approx: "approx.",
        required: "Please fill in all required fields.",
        taken: "That time has just been taken. Please choose another.",
        failed: "Something went wrong. Please try again.",
        step: "Step", of: "of",
        noPrice: "Pick a size",
      }

  const stepLabel: Record<StepId, string> = {
    size: copy.size, extras: copy.extras, when: copy.when, details: copy.details,
  }

  const stepIndex = STEP_ORDER.indexOf(step)

  const canAdvance =
    step === "size" ? Boolean(draft.bandId)
    : step === "extras" ? true
    : step === "when" ? Boolean(draft.startsAt)
    : false

  const detailsComplete =
    draft.customer.name.trim().length >= 2 &&
    /\S+@\S+\.\S+/.test(draft.customer.email) &&
    draft.customer.phone.trim().length >= 6 &&
    draft.customer.street.trim().length >= 3 &&
    draft.customer.postcode.trim().length >= 4 &&
    draft.customer.city.trim().length >= 2

  const go = (dir: 1 | -1) => {
    const next = STEP_ORDER[stepIndex + dir]
    if (next) setStep(next)
  }

  const setCustomer = (patch: Partial<BookingDraft["customer"]>) =>
    setDraft((d) => ({ ...d, customer: { ...d.customer, ...patch } }))

  const unit = (h: number) => (h === 1 ? copy.hour : copy.hours)

  const formatDuration = (min: number) => {
    const h = Math.floor(min / 60)
    const m = min % 60
    if (!h) return `${m} ${copy.minutes}`
    return m ? `${h} ${unit(h)} ${m} ${copy.minutes}` : `${h} ${unit(h)}`
  }

  /** "+1 hr" / "+30 min" for the add-on badges. */
  const formatDelta = (min: number) =>
    min >= 60 && min % 60 === 0
      ? `+${min / 60} ${unit(min / 60)}`
      : `+${min} ${copy.minutes}`

  // Read from the catalogue, not hardcoded: if Jackie changes how long a deep
  // clean takes, the badge and the slot arithmetic must not disagree.
  const deepMin = catalogue.addons.find((a) => a.slug === "deep-cleaning")?.duration_min ?? 60
  const washAddon = catalogue.addons.find((a) => a.slug === "washing-up")

  const slotLabel = (iso: string) =>
    new Intl.DateTimeFormat(nl ? "nl-NL" : "en-GB", {
      timeZone: "Europe/Amsterdam",
      weekday: "long", day: "numeric", month: "long",
      hour: "2-digit", minute: "2-digit", hour12: false,
    }).format(new Date(iso))

  async function submit() {
    if (!band || !draft.startsAt || !detailsComplete) {
      setFormError(copy.required)
      return
    }
    setSubmitting(true)
    setFormError(null)

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bandId: band.id,
          deepCleaning: draft.deepCleaning,
          addonSlugs: draft.washingUp ? ["washing-up"] : [],
          startsAt: draft.startsAt,
          discountCode: draft.discountCode.trim() || null,
          language,
          customer: draft.customer,
          notes: draft.notes.trim() || null,
          marketingConsent: draft.marketingConsent,
          website: "", // honeypot
        }),
      })
      const body = await res.json()

      if (res.ok) {
        router.push(`/booking/confirmed?ref=${encodeURIComponent(body.reference)}`)
        return
      }
      if (body?.code === "SLOT_TAKEN") {
        // Send them back to pick again; the picker refetches on mount.
        setFormError(copy.taken)
        setDraft((d) => ({ ...d, startsAt: null, endsAt: null }))
        setStep("when")
      } else {
        setFormError(body?.error ?? copy.failed)
      }
    } catch {
      setFormError(copy.failed)
    } finally {
      setSubmitting(false)
    }
  }

  /** The value a completed step collapses to, shown under its label. */
  const summaryFor = (id: StepId): string | null => {
    if (id === "size") return band ? (nl ? band.label_nl : band.label_en) : null
    if (id === "extras") {
      const bits = [
        draft.deepCleaning && copy.deepName,
        draft.washingUp && copy.washName,
      ].filter(Boolean) as string[]
      return bits.length ? bits.join(" · ") : copy.none
    }
    if (id === "when" && draft.startsAt) {
      return new Intl.DateTimeFormat(nl ? "nl-NL" : "en-GB", {
        timeZone: "Europe/Amsterdam",
        weekday: "short", day: "numeric", month: "short",
        hour: "2-digit", minute: "2-digit", hour12: false,
      }).format(new Date(draft.startsAt))
    }
    return null
  }

  return (
    <div className="pb-24 lg:pb-0">
      <div className="overflow-hidden rounded-none border border-gray-200 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_20px_48px_-24px_rgba(16,24,40,0.18)]">
        {/* ============================================ header: progress + total */}
        <div className="border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
            {/* desktop: full stepper. mobile: counter + bar, below. */}
            <ol className="hidden flex-1 items-center md:flex">
              {STEP_ORDER.map((id, i) => {
                const done = i < stepIndex
                const current = id === step
                const value = summaryFor(id)

                return (
                  <li key={id} className="flex flex-1 items-center last:flex-none">
                    <button
                      type="button"
                      disabled={!done}
                      onClick={() => done && setStep(id)}
                      className={`group flex items-center gap-2.5 rounded-none px-1 py-1 text-left ${
                        done ? "cursor-pointer" : "cursor-default"
                      }`}
                      aria-current={current ? "step" : undefined}
                    >
                      <span
                        className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                          done
                            ? "bg-wj-dark text-white group-hover:bg-wj-hover"
                            : current
                              ? "bg-wj-dark text-white ring-4 ring-wj-dark/[0.12]"
                              : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {done ? <Check weight="bold" className="h-3.5 w-3.5" /> : i + 1}
                      </span>
                      <span className="min-w-0">
                        <span
                          className={`block text-sm font-semibold leading-tight ${
                            current ? "text-gray-900" : done ? "text-gray-700" : "text-gray-400"
                          }`}
                        >
                          {stepLabel[id]}
                        </span>
                        {done && value && (
                          <span className="block max-w-[13ch] truncate text-xs leading-tight text-gray-500 lg:max-w-[20ch]">
                            {value}
                          </span>
                        )}
                      </span>
                    </button>

                    {i < STEP_ORDER.length - 1 && (
                      <span
                        aria-hidden
                        className={`mx-2 h-px flex-1 transition-colors lg:mx-3 ${
                          done ? "bg-wj-dark/35" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </li>
                )
              })}
            </ol>

            <div className="md:hidden">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                {copy.step} {stepIndex + 1} {copy.of} {STEP_ORDER.length}
              </p>
              <p className="text-sm font-semibold text-gray-900">{stepLabel[step]}</p>
            </div>

            {/* running total — pinned, so price is never more than a glance away */}
            <div className="flex-shrink-0 border-l border-gray-200 pl-4 text-right md:pl-5">
              {quote ? (
                <>
                  <p className="text-lg font-semibold leading-tight tracking-tight text-wj-dark tabular-nums sm:text-xl">
                    {formatCents(quote.totalCents, language)}
                  </p>
                  <p className="flex items-center justify-end gap-1 text-xs leading-tight text-gray-500">
                    <Clock className="h-3 w-3" />
                    {copy.approx} {formatDuration(quote.durationMin)}
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-400">{copy.noPrice}</p>
              )}
            </div>
          </div>

          {/* mobile progress bar */}
          <div className="h-1 w-full bg-gray-100 md:hidden">
            <div
              className="h-full bg-wj-dark transition-[width] duration-300"
              style={{ width: `${((stepIndex + 1) / STEP_ORDER.length) * 100}%` }}
            />
          </div>
        </div>

        {/* ==================================================== working area */}
        <div className="bg-gray-50/70 px-4 py-6 sm:px-6 sm:py-8">
          {/* ------------------------------------------------------- size */}
          {step === "size" && (
            <section>
              <StepHeading title={copy.sizeQ} hint={copy.sizeHint} />

              <div className="grid gap-3 sm:grid-cols-2">
                {catalogue.bands.map((b, i) => {
                  const selected = draft.bandId === b.id
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setDraft((d) => ({ ...d, bandId: b.id }))}
                      aria-pressed={selected}
                      className={`group relative flex flex-col rounded-none border bg-white p-4 text-left transition-all duration-150 ${
                        selected
                          ? "border-wj-dark shadow-[0_0_0_1px_#2C5F70,0_6px_16px_-8px_rgba(44,95,112,0.4)]"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      <span className="flex items-start justify-between">
                        {/* the glyph grows with the band — relative size at a glance */}
                        <House
                          weight={selected ? "fill" : "regular"}
                          aria-hidden
                          className={`transition-colors ${selected ? "text-wj-dark" : "text-gray-400"}`}
                          style={{ width: `${18 + i * 5}px`, height: `${18 + i * 5}px` }}
                        />

                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all ${
                            selected
                              ? "border-wj-dark bg-wj-dark"
                              : "border-gray-300 bg-white group-hover:border-gray-400"
                          }`}
                        >
                          {selected && <Check weight="bold" className="h-3 w-3 text-white" />}
                        </span>
                      </span>

                      <span className="mt-3 block text-sm font-medium text-gray-600">
                        {nl ? b.label_nl : b.label_en}
                      </span>
                      <span className="mt-0.5 block text-2xl font-semibold tracking-tight text-gray-900 tabular-nums">
                        {formatCents(b.base_cents, language)}
                      </span>
                      <span className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {copy.approx} {formatDuration(BASE_DURATION_MIN)}
                      </span>
                    </button>
                  )
                })}
              </div>

              <p className="mt-4 text-sm text-gray-600">
                {copy.outside}{" "}
                <a href="/contact" className="font-semibold text-wj-dark underline underline-offset-2 hover:text-wj-hover">
                  {copy.outsideLink}
                </a>
              </p>
            </section>
          )}

          {/* ----------------------------------------------------- extras */}
          {step === "extras" && band && (
            <section>
              <StepHeading title={copy.extrasQ} hint={copy.extrasHint} />

              <div className="grid gap-3 sm:grid-cols-2">
                <ExtraCard
                  Icon={Sparkle}
                  checked={draft.deepCleaning}
                  onChange={(v) => setDraft((d) => ({ ...d, deepCleaning: v }))}
                  name={copy.deepName}
                  desc={copy.deepDesc}
                  price={`+ ${formatCents(band.deep_cents, language)}`}
                  meta={formatDelta(deepMin)}
                />
                <ExtraCard
                  Icon={Drop}
                  checked={draft.washingUp}
                  onChange={(v) => setDraft((d) => ({ ...d, washingUp: v }))}
                  name={copy.washName}
                  desc={copy.washDesc}
                  price={`+ ${formatCents(washAddon?.price_cents ?? 1200, language)}`}
                  meta={formatDelta(washAddon?.duration_min ?? 30)}
                />
              </div>

              <div className="mt-4 rounded-none border border-gray-200 bg-white p-4">
                <Label htmlFor="code" className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                  <Tag className="h-4 w-4 text-gray-400" />
                  {copy.code}
                </Label>
                <Input
                  id="code"
                  value={draft.discountCode}
                  onChange={(e) => setDraft((d) => ({ ...d, discountCode: e.target.value }))}
                  placeholder={copy.codePlaceholder}
                  autoCapitalize="characters"
                  className="mt-2 h-11 max-w-xs rounded-none border-gray-300 bg-white uppercase tracking-wide placeholder:normal-case placeholder:tracking-normal"
                />
                <p className="mt-2 text-xs text-gray-500">{copy.codeHint}</p>
              </div>
            </section>
          )}

          {/* ------------------------------------------------------- when */}
          {step === "when" && (
            <section>
              <StepHeading title={copy.whenQ} hint={copy.whenHint} />
              <SlotPicker
                deepCleaning={draft.deepCleaning}
                washingUp={draft.washingUp}
                value={draft.startsAt}
                onSelect={(startsAt, endsAt) => setDraft((d) => ({ ...d, startsAt, endsAt }))}
              />
            </section>
          )}

          {/* ---------------------------------------------------- details */}
          {step === "details" && (
            <section>
              <StepHeading title={copy.detailsQ} hint={copy.detailsHint} />

              <div className="space-y-4">
                <div className="space-y-4">
                  <FieldGroup title={copy.contactGroup}>
                    <Field id="name" label={copy.name} value={draft.customer.name} autoComplete="name"
                      onChange={(v) => setCustomer({ name: v })} className="sm:col-span-2" required />
                    <Field id="email" label={copy.email} type="email" autoComplete="email" inputMode="email"
                      value={draft.customer.email} onChange={(v) => setCustomer({ email: v })} required />
                    <Field id="phone" label={copy.phone} type="tel" autoComplete="tel" inputMode="tel"
                      value={draft.customer.phone} onChange={(v) => setCustomer({ phone: v })} required />
                  </FieldGroup>

                  <FieldGroup title={copy.addressGroup} Icon={House}>
                    <Field id="street" label={copy.street} autoComplete="street-address"
                      value={draft.customer.street} onChange={(v) => setCustomer({ street: v })}
                      className="sm:col-span-2" required />
                    <Field id="postcode" label={copy.postcode} autoComplete="postal-code"
                      value={draft.customer.postcode} onChange={(v) => setCustomer({ postcode: v })} required />
                    <Field id="city" label={copy.city} autoComplete="address-level2"
                      value={draft.customer.city} onChange={(v) => setCustomer({ city: v })} required />

                    <div className="sm:col-span-2">
                      <Label htmlFor="notes" className="text-sm font-medium text-gray-700">{copy.notes}</Label>
                      <Textarea
                        id="notes" rows={3} value={draft.notes}
                        onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
                        placeholder={copy.notesPlaceholder}
                        className="mt-1.5 rounded-none border-gray-300 bg-white"
                      />
                      {/* Narrow label + this line keep special-category data out
                          of a free-text box we are not equipped to hold. */}
                      <p className="mt-1.5 text-xs text-gray-500">{copy.notesHint}</p>
                    </div>

                    {/* Marketing consent: separate, unticked, and never bundled
                        with the booking itself — that is what GDPR requires. */}
                    <label className="flex cursor-pointer items-start gap-3 rounded-none border border-gray-200 bg-gray-50/70 p-3 sm:col-span-2">
                      <input
                        type="checkbox"
                        checked={draft.marketingConsent}
                        onChange={(e) => setDraft((d) => ({ ...d, marketingConsent: e.target.checked }))}
                        className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-none border-gray-300 text-wj-dark focus:ring-wj-dark"
                      />
                      <span>
                        <span className="block text-sm text-gray-800">{copy.consent}</span>
                        <span className="mt-0.5 block text-xs text-gray-500">{copy.consentHint}</span>
                      </span>
                    </label>
                  </FieldGroup>
                </div>

                {/* the review the flow was missing: what is being agreed to */}
                {quote && (
                  <aside className="rounded-none border border-gray-200 bg-white p-5">
                    <h3 className="text-sm font-semibold text-gray-900">{copy.summary}</h3>

                    {draft.startsAt && (
                      <p className="mt-3 rounded-none bg-wj-dark/[0.06] px-3 py-2.5 text-sm font-medium text-wj-dark first-letter:uppercase">
                        {slotLabel(draft.startsAt)}
                      </p>
                    )}

                    <ul className="mt-4 space-y-2.5 border-t border-gray-100 pt-4">
                      {quote.lines.map((l) => (
                        <li key={l.label_en} className="flex justify-between gap-3 text-sm">
                          <span className="text-gray-600">{nl ? l.label_nl : l.label_en}</span>
                          <span className="whitespace-nowrap text-gray-900 tabular-nums">
                            {formatCents(l.cents, language)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 flex items-baseline justify-between border-t border-gray-100 pt-4">
                      <span className="text-sm font-medium text-gray-700">{copy.total}</span>
                      <span className="text-2xl font-semibold tracking-tight text-wj-dark tabular-nums">
                        {formatCents(quote.totalCents, language)}
                      </span>
                    </div>
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {copy.duration}: {copy.approx} {formatDuration(quote.durationMin)}
                    </p>
                  </aside>
                )}
              </div>
            </section>
          )}

          {formError && (
            <p
              role="alert"
              className="mt-5 rounded-none border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              {formError}
            </p>
          )}
        </div>

        {/* ================================================== action bar */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3.5 sm:px-6">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={step === "size"}
            className="inline-flex h-11 items-center gap-1.5 rounded-none px-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:pointer-events-none disabled:opacity-0"
          >
            <ArrowLeft className="h-4 w-4" /> {copy.back}
          </button>

          {step === "details" ? (
            <PrimaryAction onClick={submit} disabled={submitting || !detailsComplete} busy={submitting}>
              {copy.confirm}
            </PrimaryAction>
          ) : (
            <PrimaryAction onClick={() => go(1)} disabled={!canAdvance}>
              {copy.next} <ArrowRight className="ml-1.5 h-4 w-4" />
            </PrimaryAction>
          )}
        </div>
      </div>

      {/* mobile: total pinned above the thumb, so it survives a long form */}
      {quote && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur-sm lg:hidden">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {copy.total}
              <span className="ml-2 text-xs text-gray-400">
                {copy.approx} {formatDuration(quote.durationMin)}
              </span>
            </span>
            <span className="text-lg font-semibold text-wj-dark tabular-nums">
              {formatCents(quote.totalCents, language)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ pieces */

function StepHeading({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl">{title}</h2>
      <p className="mt-1 text-sm text-gray-500">{hint}</p>
    </div>
  )
}

function PrimaryAction({
  onClick, disabled, busy, children,
}: {
  onClick: () => void
  disabled?: boolean
  busy?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-11 min-w-[8.5rem] items-center justify-center rounded-none bg-wj-dark px-5 text-sm font-semibold text-white transition-colors hover:bg-wj-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wj-dark disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
    >
      {busy ? <CircleNotch className="h-5 w-5 animate-spin" /> : children}
    </button>
  )
}

function ExtraCard({
  Icon, checked, onChange, name, desc, price, meta,
}: {
  Icon: typeof Sparkle
  checked: boolean
  onChange: (v: boolean) => void
  name: string
  desc: string
  price: string
  meta: string
}) {
  return (
    <label
      className={`group relative flex cursor-pointer gap-3.5 rounded-none border bg-white p-4 transition-all duration-150 ${
        checked
          ? "border-wj-dark shadow-[0_0_0_1px_#2C5F70,0_6px_16px_-8px_rgba(44,95,112,0.4)]"
          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />

      <span
        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-none transition-colors ${
          checked ? "bg-wj-dark text-white" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
        }`}
      >
        <Icon weight={checked ? "fill" : "regular"} className="h-5 w-5" />
      </span>

      <span className="min-w-0 flex-1">
        {/*
          Price and toggle share one inline row. They were previously the flex
          row's end and an absolutely-positioned circle, which stacked the
          circle on top of the price — "+ €70.0◌".
        */}
        <span className="flex items-start justify-between gap-3">
          <span className="font-semibold text-gray-900">{name}</span>
          <span className="flex flex-shrink-0 items-center gap-2.5">
            <span className="whitespace-nowrap text-sm font-semibold text-wj-dark tabular-nums">
              {price}
            </span>
            <span
              aria-hidden
              className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-wj-dark peer-focus-visible:ring-offset-2 ${
                checked ? "border-wj-dark bg-wj-dark" : "border-gray-300 bg-white"
              }`}
            >
              {checked && <Check weight="bold" className="h-3 w-3 text-white" />}
            </span>
          </span>
        </span>
        <span className="mt-1 block text-sm leading-snug text-gray-600">{desc}</span>
        <span className="mt-2 inline-flex items-center gap-1 rounded-none bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-600">
          <Clock className="h-3 w-3" />
          {meta}
        </span>
      </span>
    </label>
  )
}

function FieldGroup({
  title, Icon, children,
}: {
  title: string
  Icon?: typeof House
  children: React.ReactNode
}) {
  return (
    <div className="rounded-none border border-gray-200 bg-white p-5">
      <h3 className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-gray-900">
        {Icon && <Icon className="h-4 w-4 text-gray-400" />}
        {title}
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  )
}

function Field({
  id, label, value, onChange, type = "text", autoComplete, inputMode, className = "", required,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  autoComplete?: string
  inputMode?: "email" | "tel" | "text"
  className?: string
  required?: boolean
}) {
  return (
    <div className={className}>
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-gray-400" aria-hidden>*</span>}
      </Label>
      <Input
        id={id}
        name={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 h-11 rounded-none border-gray-300 bg-white"
      />
    </div>
  )
}
