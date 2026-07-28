"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Buildings, Clock, HouseLine, MapPin, ShieldCheck, Sparkle, Users, Warehouse, WhatsappLogo } from "@phosphor-icons/react"
import { useLanguage } from "@/contexts/LanguageContext"
import Link from "next/link"
import Image from "next/image"
import { CONTACT_DETAILS } from "@/components/constant"
import { FeatureCard } from "@/components/feature-card"

const whatsappHref = `https://wa.me/${CONTACT_DETAILS.phoneWa}`

export default function HomePage({ fromPrice }: { fromPrice: string }) {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<'cleaning' | 'staffing'>('cleaning')

  const cleaningServices = [
    {
      title: t('residentialCleaning'),
      description: t('residentialDesc'),
      image: '/images/services/residential-cleaning.webp',
      Icon: HouseLine,
    },
    {
      title: t('officeCleaning'),
      description: t('officeDesc'),
      image: '/images/services/office-cleaning.webp',
      Icon: Buildings,
    },
  ]

  const staffingServices = [
    {
      title: t('warehouseStaffing'),
      description: t('warehouseDesc'),
      image: '/images/services/warehouse-staffing.webp',
      Icon: Warehouse,
    },
    {
      title: t('eventStaffing'),
      description: t('eventDesc'),
      image: '/images/services/event-staffing.webp',
      Icon: Users,
    },
  ]

  const services = activeTab === 'cleaning' ? cleaningServices : staffingServices

  const steps = [
    { title: t('getYourQuote'), description: t('getYourQuoteDesc') },
    { title: t('scheduleService'), description: t('scheduleServiceDesc') },
    { title: t('enjoyCleanSpaces'), description: t('enjoyCleanSpacesDesc') },
  ]

  return (
    <div className="min-h-screen bg-wj-cream">
      {/*
        Full-bleed hero. The image is the section rather than sitting in a
        container, and the copy stays left-aligned to match every other page.
        A left-weighted scrim keeps white type legible over the photograph
        while the right side of the image stays visible.
      */}
      <section className="relative flex min-h-[560px] items-center overflow-hidden text-white sm:min-h-[620px] lg:min-h-[700px]">
        {/* Purpose-made 16:9 hero: bright bathroom, calm left third for the copy. */}
        <Image
          src="/images/services/hero-bathroom.webp"
          alt={t('professionalCleaningTeam')}
          fill
          priority
          sizes="100vw"
          quality={90}
          className="object-cover"
        />
        {/*
          A soft elliptical pool of brand colour sitting under the copy, rather
          than a vertical band. Radial means there is no straight edge anywhere
          — it fades out in every direction — and it only has to be dense enough
          where the text actually is, so the rest of the photograph stays open.
          Centred and wider on mobile, where the copy spans the full width;
          pulled left on larger screens, where it does not.
        */}
        <div className="absolute inset-0 bg-wj-dark/18" />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_135%_80%_at_50%_42%,rgba(44,95,112,0.93)_0%,rgba(44,95,112,0.82)_40%,rgba(44,95,112,0.42)_66%,rgba(44,95,112,0)_90%)]
                     sm:bg-[radial-gradient(ellipse_85%_125%_at_20%_50%,rgba(44,95,112,0.94)_0%,rgba(44,95,112,0.82)_38%,rgba(44,95,112,0.40)_62%,rgba(44,95,112,0)_86%)]"
        />

        <div className="container relative z-10 mx-auto px-4 py-16 sm:px-6 sm:py-20 md:px-8">
          <div className="max-w-2xl space-y-6">
            <h1 className="hero-copy text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {t('heroTitle')}
            </h1>
            <p className="hero-copy max-w-xl text-lg leading-relaxed text-white sm:text-xl">
              {t('heroSubtitle')}
            </p>

            <div className="flex flex-col gap-3 pt-1 sm:flex-row [&>*]:w-full sm:[&>*]:w-auto">
              <Button size="lg" variant="onDark" asChild>
                <Link href="/book">
                  {t('getFreeQuote')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              {/* Straight to staffing, not the hub — the label already says
                  which half of the business they want. */}
              <Button size="lg" variant="onDarkOutline" asChild>
                <Link href="/services/staffing">
                  {t('hireStaff')}
                  <Users className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/*
          Floating product card, per the Airtasker reference. Now that prices
          are live it carries a real one — the "from" figure is the lowest
          band's base price, read at build time from the same table the booking
          flow uses, so it cannot drift out of step with what people are
          actually charged.
        */}
        <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 hidden sm:bottom-10 sm:block">
          <div className="container mx-auto flex justify-end px-4 sm:px-6 md:px-8">
            <Link
              href="/book"
              className="pointer-events-auto block w-64 rounded-xl border border-wj-cream-deep bg-white p-4 shadow-lg transition-shadow hover:shadow-xl"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-wj-cream">
                  <Sparkle weight="fill" className="h-4 w-4 text-wj-dark" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{t('heroCardTitle')}</p>
                  <p className="mt-0.5 text-xs leading-snug text-gray-600">{t('heroCardBody')}</p>
                </div>
              </div>
              <p className="mt-3 flex items-baseline gap-1.5">
                <span className="text-xs text-gray-500">{t('from')}</span>
                <span className="text-2xl font-semibold text-wj-dark">{fromPrice}</span>
              </p>
              <span className="mt-2 inline-flex items-center text-sm font-semibold text-wj-dark">
                {t('getFreeQuote')}
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-wj-cream-deep bg-white">
        {/* Insurance claim removed — not confirmed by the business. */}
        <div className="container mx-auto grid gap-6 px-4 py-8 sm:grid-cols-2 sm:px-6 md:px-8">
          {[
            { Icon: MapPin, title: t('trustLocal'), body: t('trustLocalDesc') },
            { Icon: Clock, title: t('trustResponse'), body: t('trustResponseDesc') },
          ].map(({ Icon, title, body }) => (
            <div key={title} className="flex items-start gap-3">
              <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-wj-dark" />
              <div>
                <p className="text-sm font-semibold text-gray-900">{title}</p>
                <p className="text-sm text-gray-600">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-2xl">
            <h2 className="scroll-animate text-3xl tracking-tight text-gray-900 sm:text-4xl">
              {t('servicesTitle')}
            </h2>
            <p className="scroll-animate mt-4 text-lg leading-relaxed text-gray-600">
              {t('servicesSubtitle')}
            </p>
          </div>

          <div className="mt-8 inline-flex rounded-lg bg-gray-100 p-1">
            {(['cleaning', 'staffing'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                aria-pressed={activeTab === tab}
                className={`h-11 rounded-md px-5 text-sm font-semibold transition-colors ${
                  activeTab === tab
                    ? 'bg-wj-dark text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t(tab)}
              </button>
            ))}
          </div>

          {/*
            One shared card component across the whole site: image or tinted
            header band, body, then a ruled footer action. Replaces the
            full-bleed overlay card — with the copy on white beneath the photo
            there is no scrim, so the image is never tinted.
            Only the active tab is mounted, so hidden images are never fetched.
          */}
          <div className="scroll-stagger mt-8 grid gap-6 sm:grid-cols-2">
            {services.map((card) => (
              <FeatureCard
                key={card.title}
                image={card.image}
                imageAlt={card.title}
                title={card.title}
                description={card.description}
                sizes="(max-width: 640px) 100vw, 50vw"
                // follows the active tab, so a staffing card never lands the
                // visitor on the cleaning half, or vice versa
                href={`/services/${activeTab}`}
                actionLabel={t('learnMore')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="border-y border-wj-cream-deep bg-white py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-6">
              <h2 className="scroll-animate text-3xl tracking-tight text-gray-900 sm:text-4xl">
                {t('trustedPartnersExcellence')}
              </h2>
              <p className="scroll-animate text-lg leading-relaxed text-gray-600">
                {t('aboutDescription')}
              </p>

              <dl className="space-y-5">
                {[
                  { term: t('experienceYears'), detail: t('experienceYearsDesc') },
                  { term: t('personalizedSchedules'), detail: t('personalizedSchedulesDesc') },
                  { term: t('extraHygiene'), detail: t('extraHygieneDesc') },
                ].map(({ term, detail }) => (
                  <div key={term} className="scroll-animate border-l-2 border-wj-dark pl-4">
                    <dt className="font-semibold text-gray-900">{term}</dt>
                    <dd className="mt-1 text-gray-600">{detail}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="scroll-animate-right overflow-hidden rounded-xl">
              <Image
                src="/images/cleaning-team.webp"
                alt={t('professionalCleaningTeam')}
                width={800}
                height={600}
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={90}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-2xl">
            <h2 className="scroll-animate text-3xl tracking-tight text-gray-900 sm:text-4xl">
              {t('simpleProcessOutstanding')}
            </h2>
            <p className="scroll-animate mt-4 text-lg leading-relaxed text-gray-600">
              {t('howItWorksDesc')}
            </p>
          </div>

          {/*
            No imagery here on purpose. "Get a quote" / "schedule" / "enjoy a
            clean space" are abstract steps; the illustrations that used to sit
            here were flat clipart and clashed with the photography everywhere
            else on the site.
          */}
          <ol className="mt-12 grid gap-px overflow-hidden rounded-xl border border-wj-cream-deep bg-gray-200 md:grid-cols-3">
            {steps.map(({ title, description }, index) => (
              <li key={title} className="scroll-animate bg-white p-6 sm:p-8">
                <span className="text-2xl font-bold tabular-nums text-wj-dark">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 text-lg font-bold text-gray-900">{title}</h3>
                <p className="mt-2 leading-relaxed text-gray-600">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-wj-dark py-16 text-white sm:py-20">
        <div className="container mx-auto px-4 text-center sm:px-6 md:px-8">
          <div className="mx-auto max-w-2xl space-y-6">
            <h2 className="scroll-animate text-3xl tracking-tight sm:text-4xl">
              {t('experienceDifference')}
            </h2>
            {/* white/85 on wj-dark is 6.0:1; wj-lighter on wj-accent was 2.43:1 and failed AA */}
            <p className="scroll-animate text-lg leading-relaxed text-white/85">
              {t('ctaDescription')}
            </p>

            <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row [&>*]:w-full sm:[&>*]:w-auto">
              <Button size="lg" variant="onDark" asChild>
                <Link href="/book">{t('getFreeQuoteNow')}</Link>
              </Button>
              <Button
                size="lg"
                variant="onDarkOutline"
                asChild
              >
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  <WhatsappLogo className="mr-2 h-5 w-5" />
                  {t('whatsappUs')}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
