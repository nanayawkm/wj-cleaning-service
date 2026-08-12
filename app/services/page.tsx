"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { FeatureCard } from "@/components/feature-card"
import { useLanguage } from "@/contexts/LanguageContext"

/**
 * Hub, not a catalogue. The two halves of the business want different things
 * from a visitor — cleaning wants a booking, staffing wants a conversation —
 * so they get their own pages rather than competing on one.
 */
export default function ServicesPage() {
  const { t } = useLanguage()

  const industries = [
    { image: "/images/services/industry-warehouse.webp", title: t("warehouses"), description: t("warehousesDesc") },
    { image: "/images/services/industry-office.webp", title: t("offices"), description: t("officesDesc") },
    { image: "/images/services/industry-restaurant.webp", title: t("restaurantsCafes"), description: t("restaurantsDesc") },
    { image: "/images/services/industry-hotel.webp", title: t("hotels"), description: t("hotelsDesc") },
    { image: "/images/services/industry-school.webp", title: t("schools"), description: t("schoolsDesc") },
  ]

  return (
    <div className="min-h-screen bg-wj-cream">
      <section className="relative overflow-hidden bg-wj-dark pb-16 pt-32 text-white sm:pb-20 sm:pt-40">
        <Image
          src="/images/services/services-hero.webp"
          alt={t("professionalCleaningServices")}
          fill
          sizes="100vw"
          quality={90}
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(44,95,112,0.94)_0%,rgba(44,95,112,0.88)_50%,rgba(44,95,112,0.55)_100%)]" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-2xl">
            <h1 className="hero-copy text-3xl leading-tight tracking-tight sm:text-4xl md:text-5xl">
              {t("servicesTitle")}
            </h1>
            <p className="hero-copy mt-4 text-lg leading-relaxed text-white/85">
              {t("servicesSubtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* the two halves */}
      <section className="border-b border-wj-cream-deep bg-white py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="scroll-stagger grid gap-6 md:grid-cols-2">
            <FeatureCard
              image="/images/services/cleaning-surfaces.webp"
              imageAlt={t("cleaningServicesNav")}
              sizes="(max-width: 768px) 100vw, 50vw"
              title={t("cleaningPageTitle")}
              description={t("cleaningPageLead")}
              href="/services/cleaning"
              actionLabel={t("learnMore")}
            />
            <FeatureCard
              image="/images/services/warehouse-staffing.webp"
              imageAlt={t("staffingServicesNav")}
              sizes="(max-width: 768px) 100vw, 50vw"
              title={t("staffingPageTitle")}
              description={t("staffingPageLead")}
              href="/services/staffing"
              actionLabel={t("learnMore")}
            />
          </div>
        </div>
      </section>

      {/* industries — shared across both halves */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-2xl">
            <h2 className="scroll-animate text-3xl tracking-tight text-gray-900 sm:text-4xl">
              {t("servingDiverse")}
            </h2>
            <p className="scroll-animate mt-4 text-lg leading-relaxed text-gray-600">{t("industriesDesc")}</p>
          </div>

          {/* six columns so the final row of two centres rather than orphaning */}
          <div className="scroll-stagger mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6 lg:gap-8 [&>*]:lg:col-span-2 [&>*:nth-last-child(2)]:lg:col-start-2">
            {industries.map((card) => (
              <FeatureCard
                key={card.title}
                image={card.image}
                imageAlt={card.title}
                title={card.title}
                description={card.description}
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
              {t("readyToExperienceDesc")}
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row [&>*]:w-full sm:[&>*]:w-auto">
              <Button size="lg" variant="onDark" asChild>
                <Link href="/services/cleaning">
                  {t("cleaningServicesNav")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="onDarkOutline" asChild>
                <Link href="/services/staffing">{t("staffingServicesNav")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
