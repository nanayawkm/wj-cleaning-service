"use client"

import { useState } from "react"
import { CaretDown, CheckCircle, CircleNotch, PaperPlaneTilt, Warning } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CONTACT_DETAILS } from "@/components/constant"
import { useLanguage } from "@/contexts/LanguageContext"

import { CONTACT_SERVICES } from "./services"

const inputClass = "border-gray-300 bg-white focus:border-wj-dark focus:ring-wj-dark/20"

interface Draft {
  name: string
  email: string
  phone: string
  service: string
  message: string
}

const emptyDraft: Draft = { name: "", email: "", phone: "", service: "", message: "" }

/**
 * The contact form, extracted from the page and actually wired up.
 *
 * It previously lived inline as a bare `<form>` with no handler and no route
 * behind it, so submitting navigated to `/contact?fullName=…` and dropped the
 * enquiry. It looked like it worked, which is why it survived this long.
 *
 * Modelled on [`application-form.tsx`](../careers/application-form.tsx), and
 * the three things it copies are the ones that matter:
 *
 *  · **required fields are checked here as well as on the server**, so the
 *    answer is instant and in the sender's own language rather than a round
 *    trip to a generic 400
 *  · **the success state replaces the form and takes focus**, because a
 *    `role="status"` appearing under a form the reader has already left is not
 *    announced, and the reference is the only proof the message landed
 *  · **the failure state names the phone number.** There is no database row
 *    behind an enquiry, so a failed send means the message is genuinely gone —
 *    the one thing the sender must not be told is a quiet nothing.
 */
export function ContactForm() {
  const { t, language } = useLanguage()
  const [draft, setDraft] = useState<Draft>(emptyDraft)
  const [website, setWebsite] = useState("") // honeypot
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reference, setReference] = useState<string | null>(null)

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }))

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (submitting) return

    const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())
    if (
      !draft.name.trim() ||
      !emailLooksValid ||
      !draft.service ||
      draft.message.trim().length < 10
    ) {
      setError(t("contactErrorRequired"))
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, language, website }),
      })
      const body = await res.json().catch(() => null)

      if (!res.ok) {
        setError(
          body?.code === "RATE_LIMITED"
            ? t("contactErrorRateLimited")
            : `${t("contactErrorGeneric")} ${CONTACT_DETAILS.phone}.`,
        )
        return
      }

      setReference(body?.reference ?? null)
    } catch {
      setError(`${t("contactErrorGeneric")} ${CONTACT_DETAILS.phone}.`)
    } finally {
      setSubmitting(false)
    }
  }

  if (reference) {
    return (
      <div
        role="status"
        tabIndex={-1}
        className="rounded-xl border border-wj-cream-deep bg-white p-6 text-center sm:p-8"
      >
        <CheckCircle weight="fill" className="mx-auto h-14 w-14 text-wj-dark" />
        <h3 className="mt-5 text-2xl tracking-tight text-gray-900">{t("contactSuccessTitle")}</h3>
        <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-gray-600">
          {t("contactSuccessBody")}
        </p>
        <p className="mt-6 inline-block rounded-lg bg-wj-light/10 px-4 py-2.5 text-sm text-gray-700">
          {t("contactSuccessReference")}:{" "}
          <code className="font-semibold text-wj-dark">{reference}</code>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4 sm:space-y-6">
      <div className="space-y-2">
        <Label htmlFor="fullName" className="font-medium text-gray-700">
          {t("fullName")} *
        </Label>
        <Input
          id="fullName"
          name="fullName"
          autoComplete="name"
          placeholder={t("fullNamePlaceholder")}
          value={draft.name}
          onChange={(e) => set("name", e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="font-medium text-gray-700">
            {t("email")} *
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={t("email")}
            value={draft.email}
            onChange={(e) => set("email", e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="font-medium text-gray-700">
            {t("phone")}
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder={t("phone")}
            value={draft.phone}
            onChange={(e) => set("phone", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="service" className="font-medium text-gray-700">
          {t("serviceType")} *
        </Label>
        {/*
          pr-10 reserves room for our own arrow; appearance-none removes the
          native one, which otherwise sat past that gap and looked detached.
          Options come from the shared list so the server can validate against
          exactly what was offered.
        */}
        <div className="relative">
          <select
            id="service"
            name="service"
            value={draft.service}
            onChange={(e) => set("service", e.target.value)}
            className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 pr-10 text-base focus:border-wj-dark focus:ring-wj-dark/20"
          >
            <option value="">{t("selectService")}</option>
            <optgroup label={t("cleaningServices")}>
              {CONTACT_SERVICES.filter((s) => s.group === "cleaning").map((s) => (
                <option key={s.value} value={s.value}>
                  {t(s.tKey)}
                </option>
              ))}
            </optgroup>
            <optgroup label={t("staffingServices")}>
              {CONTACT_SERVICES.filter((s) => s.group === "staffing").map((s) => (
                <option key={s.value} value={s.value}>
                  {t(s.tKey)}
                </option>
              ))}
            </optgroup>
          </select>
          <CaretDown
            aria-hidden
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="font-medium text-gray-700">
          {t("message")} *
        </Label>
        <Textarea
          id="message"
          name="message"
          placeholder={t("messagePlaceholder")}
          rows={5}
          value={draft.message}
          onChange={(e) => set("message", e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Honeypot. Hidden from assistive tech as well as from sight, so a
          screen-reader user is never asked to fill in a trap. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      {error ? (
        <p
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm leading-relaxed text-red-800"
        >
          <Warning weight="fill" className="mt-0.5 h-4 w-4 flex-shrink-0" />
          {error}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting ? (
          <CircleNotch className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <PaperPlaneTilt className="mr-2 h-5 w-5" />
        )}
        {submitting ? t("contactSending") : t("sendMessage")}
      </Button>

      <p className="text-sm leading-relaxed text-gray-500">
        {t("contactPrivacyNote")}{" "}
        <a href="/privacy" className="font-medium text-wj-dark underline underline-offset-2">
          {t("privacyPolicy")}
        </a>
        .
      </p>
    </form>
  )
}
