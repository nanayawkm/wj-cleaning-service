"use client"

import Image from "next/image"
import {
  ArrowRight,
  Briefcase,
  Car,
  Check,
  CurrencyEur,
  Gift,
  Info,
  MapTrifold,
  Phone,
  Sparkle,
  TShirt,
  Clock,
} from "@phosphor-icons/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CONTACT_DETAILS } from "@/components/constant"
import { useLanguage } from "@/contexts/LanguageContext"

import { ApplicationForm } from "./application-form"
import { careersCopy } from "./copy"

/**
 * The open-application page.
 *
 * There is no vacancy to apply *for*, which is the awkward part: the usual job
 * page shape — role, then requirements, then apply — implies a start date that
 * does not exist. So the "this is an open application" notice sits directly
 * under the hero, before anyone reads a single requirement, and the form asks
 * about availability rather than a start date.
 */

/** Paired with copy.offer by index — text stays in the copy module, icons here. */
const OFFER_ICONS = [CurrencyEur, Car, TShirt, Gift, MapTrifold, Clock]

export default function CareersPage() {
  const { language } = useLanguage()
  const c = careersCopy[language]

  return (
    <div className="min-h-screen bg-wj-cream">
      {/* ------------------------------------------------------------ hero */}
      <section className="relative overflow-hidden bg-wj-dark pb-16 pt-32 text-white sm:pb-20 sm:pt-40">
        <Image
          src="/images/cleaning-team.webp"
          alt={c.title}
          fill
          sizes="100vw"
          quality={90}
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(44,95,112,0.94)_0%,rgba(44,95,112,0.88)_50%,rgba(44,95,112,0.55)_100%)]" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-white/20 text-xs text-white sm:text-sm">{c.badge}</Badge>
            <h1 className="hero-copy text-3xl leading-tight tracking-tight sm:text-4xl md:text-5xl">
              {c.title}
            </h1>
            <p className="hero-copy mt-3 text-base font-medium text-white/70">{c.tagline}</p>
            <p className="hero-copy mt-4 text-lg leading-relaxed text-white/85">{c.lead}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row [&>*]:w-full sm:[&>*]:w-auto">
              <Button size="lg" variant="onDark" asChild>
                <a href="#apply">
                  {c.applyCta}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button size="lg" variant="onDarkOutline" asChild>
                <a href={`mailto:${CONTACT_DETAILS.email}`}>{c.emailCta}</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------- the open-application note */}
      <section className="border-b border-wj-cream-deep bg-white py-10 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex max-w-3xl gap-4 rounded-xl border border-wj-light/40 bg-wj-light/10 p-5 sm:p-6">
            <Info weight="fill" className="mt-0.5 h-6 w-6 flex-shrink-0 text-wj-dark" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{c.openNoticeTitle}</h2>
              <p className="mt-2 text-base leading-relaxed text-gray-600">{c.openNotice}</p>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- about + duties */}
      <section className="border-b border-wj-cream-deep bg-white py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-3xl tracking-tight text-gray-900 sm:text-4xl">{c.aboutTitle}</h2>
              <p className="mt-4 text-lg leading-relaxed text-gray-600">{c.aboutBody}</p>

              <div className="mt-8 overflow-hidden rounded-xl border border-wj-cream-deep">
                <Image
                  src="/images/services/residential-cleaning.webp"
                  alt={c.dutiesTitle}
                  width={800}
                  height={500}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="h-56 w-full object-cover sm:h-64"
                />
              </div>
            </div>

            <div>
              <h2 className="text-3xl tracking-tight text-gray-900 sm:text-4xl">{c.dutiesTitle}</h2>
              <p className="mt-4 text-lg leading-relaxed text-gray-600">{c.dutiesLead}</p>
              <ul className="mt-6 space-y-3">
                {c.duties.map((duty) => (
                  <li key={duty} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-wj-dark/10">
                      <Check weight="bold" className="h-3.5 w-3.5 text-wj-dark" />
                    </span>
                    <span className="text-base leading-relaxed text-gray-700">{duty}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- what we offer */}
      <section className="border-b border-wj-cream-deep py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="mb-10 max-w-2xl">
            <Badge className="mb-4 bg-wj-accent-light/20 text-wj-accent-dark">{c.badge}</Badge>
            <h2 className="text-3xl tracking-tight text-gray-900 sm:text-4xl">{c.offerTitle}</h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">{c.offerLead}</p>
          </div>

          <div className="scroll-stagger grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {c.offer.map((item, i) => {
              const Icon = OFFER_ICONS[i] ?? Sparkle
              return (
                <div
                  key={item.title}
                  className="rounded-xl border border-wj-cream-deep bg-white p-6"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg border-2 border-wj-dark bg-white">
                    <Icon className="h-5 w-5 text-wj-dark" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.body}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- what we look for */}
      <section className="border-b border-wj-cream-deep bg-white py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl tracking-tight text-gray-900 sm:text-4xl">{c.lookingTitle}</h2>
            <ul className="mt-6 space-y-4">
              {c.looking.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-wj-dark/10">
                    <Check weight="bold" className="h-3.5 w-3.5 text-wj-dark" />
                  </span>
                  <span className="text-base leading-relaxed text-gray-700">{item}</span>
                </li>
              ))}
            </ul>

            {/* Said plainly, because "experience is a plus" reads to a lot of
                people as "experience is required" and they close the tab. */}
            <p className="mt-8 rounded-xl border-l-4 border-wj-dark bg-wj-cream px-5 py-4 text-base leading-relaxed text-gray-700">
              {c.noExperienceNote}
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- form */}
      <section id="apply" className="scroll-mt-24 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border-2 border-wj-dark bg-white">
                <Briefcase className="h-6 w-6 text-wj-dark" />
              </span>
              <h2 className="text-3xl tracking-tight text-gray-900 sm:text-4xl">{c.formTitle}</h2>
              <p className="mt-4 text-lg leading-relaxed text-gray-600">{c.formLead}</p>
            </div>

            <div className="rounded-xl border border-wj-cream-deep bg-white p-5 sm:p-8">
              <ApplicationForm />
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- write to us */}
      <section className="bg-wj-dark py-16 text-white sm:py-20">
        <div className="container mx-auto px-4 text-center sm:px-6 md:px-8">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl tracking-tight sm:text-4xl">{c.directTitle}</h2>
            <p className="mt-4 text-lg leading-relaxed text-white/85">{c.directBody}</p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row [&>*]:w-full sm:[&>*]:w-auto">
              <Button size="lg" variant="onDark" asChild>
                <a href={`mailto:${CONTACT_DETAILS.email}`}>{CONTACT_DETAILS.email}</a>
              </Button>
              <Button size="lg" variant="onDarkOutline" asChild>
                <a href={`tel:${CONTACT_DETAILS.phoneTel}`}>
                  <Phone className="mr-2 h-5 w-5" />
                  {c.callCta}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
