"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Check,
  Clock,
  CurrencyEur,
  Sparkle,
} from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { FeatureCard, tintFor } from "@/components/feature-card"
import { useLanguage } from "@/contexts/LanguageContext"

/**
 * Cleaning is the transactional half of the business, so every action here
 * leads to /book. Staffing is a conversation and lives on its own page, where
 * every action leads to /contact instead.
 */
export default function CleaningServicesPage() {
  const { t } = useLanguage()

  const included = [
    t("floorCareMaintenance"),
    t("wasteCollectionDisposal"),
    t("restroomCleaning"),
    t("glassWindowCleaning"),
    t("generalUpkeep"),
  ]

  const reasons = [
    { Icon: CurrencyEur, title: t("priceUpFront"), description: t("priceUpFrontDesc") },
    { Icon: Clock, title: t("pickYourSlot"), description: t("pickYourSlotDesc") },
    { Icon: Sparkle, title: t("changeAnytime"), description: t("changeAnytimeDesc") },
  ]

  return (
    <div className="min-h-screen bg-wj-cream">
      <section className="relative overflow-hidden bg-wj-dark pb-16 pt-32 text-white sm:pb-20 sm:pt-40">
        <Image
          src="/images/services/cleaning-surfaces.webp"
          alt={t("professionalCleaningServices")}
          fill
          sizes="100vw"
          quality={90}
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(44,95,112,0.94)_0%,rgba(44,95,112,0.88)_50%,rgba(44,95,112,0.55)_100%)]" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-2xl">
            <h1 className="hero-copy text-3xl leading-tight tracking-tight sm:text-4xl md:text-5xl">
              {t("cleaningPageTitle")}
            </h1>
            <p className="hero-copy mt-4 text-lg leading-relaxed text-white/85">
              {t("cleaningPageLead")}
            </p>
            <Button size="lg" variant="onDark" className="mt-7" asChild>
              <Link href="/book">
                {t("bookOnline")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/*
        Offices and commercial first. It leads the page because commercial work
        is the larger contract and the one that needs a conversation; home
        cleaning follows and can be booked outright.
      */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl tracking-tight text-gray-900 sm:text-4xl">
              {t("commercialTitle")}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">{t("commercialLead")}</p>
            {/* deliberately /contact, not /book — commercial is not priced by m² */}
            <Button size="lg" variant="outline" className="mt-7" asChild>
              <Link href="/contact">
                {t("requestQuote")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* home cleaning — the bookable product */}
      <section className="border-y border-wj-cream-deep bg-white py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-3xl tracking-tight text-gray-900 sm:text-4xl">
                {t("homeCleaningTitle")}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-gray-600">{t("homeCleaningLead")}</p>

              <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-gray-500">
                {t("whatsIncluded")}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check weight="bold" className="mt-1 h-4 w-4 flex-shrink-0 text-wj-dark" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-xl border border-wj-cream-deep bg-wj-cream p-5">
                <p className="font-semibold text-gray-900">{t("addDeepClean")}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
                  {t("addDeepCleanDesc")}
                </p>
              </div>

              <Button size="lg" className="mt-8" asChild>
                <Link href="/book">
                  {t("bookOnline")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-xl lg:aspect-auto">
              <Image
                src="/images/services/residential-cleaning.webp"
                alt={t("residentialCleaning")}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={90}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* why book online */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <h2 className="max-w-2xl text-3xl tracking-tight text-gray-900 sm:text-4xl">
            {t("whyBookOnline")}
          </h2>
          <div className="scroll-stagger mt-8 grid gap-6 md:grid-cols-3">
            {reasons.map((r, i) => (
              <FeatureCard
                key={r.title}
                Icon={r.Icon}
                tint={tintFor(i)}
                title={r.title}
                description={r.description}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-wj-dark py-16 text-white sm:py-20">
        <div className="container mx-auto px-4 text-center sm:px-6 md:px-8">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl tracking-tight sm:text-4xl">{t("readyToExperience")}</h2>
            <p className="mt-4 text-lg leading-relaxed text-white/85">
              {t("heroCardBody")}
            </p>
            <Button size="lg" variant="onDark" className="mt-7" asChild>
              <Link href="/book">{t("bookOnline")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
