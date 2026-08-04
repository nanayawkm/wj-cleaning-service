"use client"

import { useState } from "react"
import { CheckCircle, CircleNotch, PaperPlaneTilt, Warning } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/contexts/LanguageContext"
import { CONTACT_DETAILS } from "@/components/constant"

import {
  AVAILABILITY,
  EXPERIENCE,
  LANGUAGES,
  TRANSPORT,
  careersCopy,
  type Availability,
  type Experience,
  type SpokenLanguage,
  type Transport,
} from "./copy"

interface Draft {
  name: string
  email: string
  phone: string
  city: string
  availability: Availability | ""
  experience: Experience | ""
  transport: Transport | ""
  languages: SpokenLanguage[]
  motivation: string
  consent: boolean
}

const emptyDraft: Draft = {
  name: "",
  email: "",
  phone: "",
  city: "",
  availability: "",
  experience: "",
  transport: "",
  languages: [],
  motivation: "",
  consent: false,
}

const inputClass =
  "border-gray-300 bg-white focus:border-wj-dark focus:ring-wj-dark/20"

/**
 * The open application form.
 *
 * Every field except the motivation is a tap rather than a typed answer.
 * People apply for cleaning work from a phone, often standing up, and each
 * free-text box is somewhere an application gets abandoned — so availability,
 * experience and transport are chip-style radio groups and only the
 * introduction asks anyone to write.
 */
export function ApplicationForm() {
  const { language } = useLanguage()
  const c = careersCopy[language]

  const [draft, setDraft] = useState<Draft>(emptyDraft)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reference, setReference] = useState<string | null>(null)
  /** Hidden from people, tempting to bots. Never shown, never filled. */
  const [website, setWebsite] = useState("")

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }))

  const toggleLanguage = (lang: SpokenLanguage) =>
    setDraft((d) => ({
      ...d,
      languages: d.languages.includes(lang)
        ? d.languages.filter((l) => l !== lang)
        : [...d.languages, lang],
    }))

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (submitting) return

    // Checked here as well as on the server, so the answer is instant and in
    // the applicant's own language rather than a round trip to a generic 400.
    if (
      !draft.name.trim() ||
      !draft.email.trim() ||
      !draft.phone.trim() ||
      !draft.city.trim() ||
      !draft.availability ||
      !draft.experience ||
      !draft.transport ||
      !draft.languages.length ||
      draft.motivation.trim().length < 20
    ) {
      setError(c.errorRequired)
      return
    }
    if (!draft.consent) {
      setError(c.errorConsent)
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, language, website }),
      })
      const body = await res.json().catch(() => null)

      if (!res.ok) {
        setError(body?.code === "RATE_LIMITED" ? c.errorRateLimited : c.errorGeneric)
        return
      }

      setReference(body?.reference ?? null)
    } catch {
      setError(c.errorGeneric)
    } finally {
      setSubmitting(false)
    }
  }

  if (reference) {
    return (
      <div
        // Focusable and announced, because the form it replaces is gone and a
        // screen reader would otherwise land on nothing.
        role="status"
        tabIndex={-1}
        // No card of its own: this renders inside the form's white card, and a
        // second border around it read as a panel floating in a panel.
        className="py-4 text-center sm:py-6"
      >
        <CheckCircle weight="fill" className="mx-auto h-14 w-14 text-wj-dark" />
        <h3 className="mt-5 text-2xl tracking-tight text-gray-900">{c.successTitle}</h3>
        <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-gray-600">
          {c.successBody}
        </p>
        <p className="mt-6 inline-block rounded-lg bg-wj-light/10 px-4 py-2.5 text-sm text-gray-700">
          {c.successReference}: <code className="font-semibold text-wj-dark">{reference}</code>
        </p>
        <p className="mx-auto mt-6 max-w-md border-t border-gray-100 pt-5 text-sm leading-relaxed text-gray-500">
          {c.successCvNote}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-8">
      {/* ---------------------------------------------------- about you */}
      <fieldset className="space-y-4">
        <SectionLabel>{c.sectionYou}</SectionLabel>

        <Field id="name" label={c.name} required requiredWord={c.required}>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            required
            maxLength={120}
            value={draft.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder={c.namePlaceholder}
            className={inputClass}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="email" label={c.email} required requiredWord={c.required}>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={200}
              value={draft.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder={c.emailPlaceholder}
              className={inputClass}
            />
          </Field>

          <Field id="phone" label={c.phone} required requiredWord={c.required}>
            <Input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              maxLength={40}
              value={draft.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder={c.phonePlaceholder}
              className={inputClass}
            />
          </Field>
        </div>

        <Field id="city" label={c.city} required requiredWord={c.required}>
          <Input
            id="city"
            name="city"
            autoComplete="address-level2"
            required
            maxLength={100}
            value={draft.city}
            onChange={(e) => set("city", e.target.value)}
            placeholder={c.cityPlaceholder}
            className={inputClass}
          />
        </Field>
      </fieldset>

      {/* ------------------------------------------- your work situation */}
      <fieldset className="space-y-6 border-t border-gray-100 pt-8">
        <SectionLabel>{c.sectionWork}</SectionLabel>

        <ChipGroup
          legend={c.availability}
          name="availability"
          options={AVAILABILITY.map((v) => ({ value: v, label: c.availabilityOptions[v] }))}
          selected={draft.availability}
          onSelect={(v) => set("availability", v as Availability)}
        />

        <ChipGroup
          legend={c.experience}
          name="experience"
          options={EXPERIENCE.map((v) => ({ value: v, label: c.experienceOptions[v] }))}
          selected={draft.experience}
          onSelect={(v) => set("experience", v as Experience)}
        />

        <ChipGroup
          legend={c.transport}
          hint={c.transportHint}
          name="transport"
          options={TRANSPORT.map((v) => ({ value: v, label: c.transportOptions[v] }))}
          selected={draft.transport}
          onSelect={(v) => set("transport", v as Transport)}
        />

        <fieldset>
          <legend className="text-sm font-medium text-gray-700">{c.languages}</legend>
          <p className="mt-1 text-xs text-gray-500">{c.languagesHint}</p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {LANGUAGES.map((v) => {
              const active = draft.languages.includes(v)
              return (
                <label
                  key={v}
                  className={`cursor-pointer rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "border-wj-dark bg-wj-dark text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:border-wj-dark/40 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={active}
                    onChange={() => toggleLanguage(v)}
                  />
                  {c.languageOptions[v]}
                </label>
              )
            })}
          </div>
        </fieldset>
      </fieldset>

      {/* ------------------------------------------------ your introduction */}
      <fieldset className="space-y-4 border-t border-gray-100 pt-8">
        <SectionLabel>{c.sectionMotivation}</SectionLabel>

        <Field id="motivation" label={c.motivation} required requiredWord={c.required}>
          <Textarea
            id="motivation"
            name="motivation"
            rows={6}
            required
            maxLength={2000}
            value={draft.motivation}
            onChange={(e) => set("motivation", e.target.value)}
            placeholder={c.motivationPlaceholder}
            className={inputClass}
          />
          {/* The hint keeps special-category data out of a free-text box we
              are not equipped to hold — same rule as the booking notes. */}
          <p className="mt-1.5 text-xs text-gray-500">{c.motivationHint}</p>
        </Field>
      </fieldset>

      {/* Honeypot. Hidden from assistive tech as well as from sight, so a
          screen-reader user is never asked to fill in a trap. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      {/* Separate, unticked, and never bundled with the application itself. */}
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50/70 p-4">
        <input
          type="checkbox"
          checked={draft.consent}
          onChange={(e) => set("consent", e.target.checked)}
          className="mt-0.5 h-5 w-5 flex-shrink-0 rounded border-gray-300 text-wj-dark focus:ring-wj-dark"
        />
        <span>
          <span className="block text-sm text-gray-800">{c.consent}</span>
          <span className="mt-1 block text-xs leading-relaxed text-gray-500">{c.consentHint}</span>
        </span>
      </label>

      {error && (
        <p
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          <Warning className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>
            {error}{" "}
            <a
              href={`mailto:${CONTACT_DETAILS.email}`}
              className="font-semibold underline underline-offset-2"
            >
              {CONTACT_DETAILS.email}
            </a>
          </span>
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting ? (
          <CircleNotch className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <PaperPlaneTilt className="mr-2 h-5 w-5" />
        )}
        {submitting ? c.submitting : c.submit}
      </Button>
    </form>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-wider text-wj-accent">{children}</h3>
  )
}

function Field({
  id,
  label,
  required,
  requiredWord,
  children,
}: {
  id: string
  label: string
  required?: boolean
  requiredWord: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
        {required && (
          // Spelt out rather than a bare asterisk, which a screen reader either
          // skips or reads as "star".
          <span className="ml-1 text-xs font-normal text-gray-400">({requiredWord})</span>
        )}
      </Label>
      {children}
    </div>
  )
}

/**
 * A radio group that looks like a row of chips. Native radios underneath, so
 * arrow keys, focus and form semantics all behave — only the appearance is ours.
 */
function ChipGroup({
  legend,
  hint,
  name,
  options,
  selected,
  onSelect,
}: {
  legend: string
  hint?: string
  name: string
  options: { value: string; label: string }[]
  selected: string
  onSelect: (value: string) => void
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-gray-700">{legend}</legend>
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
      <div className="mt-2.5 flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected === option.value
          return (
            <label
              key={option.value}
              className={`cursor-pointer rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "border-wj-dark bg-wj-dark text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:border-wj-dark/40 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name={name}
                className="sr-only"
                checked={active}
                onChange={() => onSelect(option.value)}
              />
              {option.label}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
