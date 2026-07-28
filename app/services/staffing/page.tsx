"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Buildings, Check, Users, Warehouse, WhatsappLogo } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { FeatureCard, tintFor } from "@/components/feature-card"
import { CONTACT_DETAILS } from "@/components/constant"
import { useLanguage } from "@/contexts/LanguageContext"

const whatsappHref = `https://wa.me/${CONTACT_DETAILS.phoneWa}`

/**
 * Staffing is a conversation, not a transaction — roles, hours and sites vary
 * too much to price from a form. So nothing here links to /book; every action
 * goes to /contact or WhatsApp.
 */
export default function StaffingServicesPage() {
  const { t } = useLanguage()

  const warehouseTasks = [
    t("orderPickingPacking"),
    t("inventoryManagement"),
    t("loadingUnloading"),
    t("qualityControlSupport"),
    t("forkliftOperation"),
  ]

  const supportRoles = [
    t("officeSupportStaff"),
    t("restaurantCafePersonnel"),
    t("hotelStaff"),
    t("schoolSupportStaff"),
    t("eventStaffingText"),
  ]

  const steps = [
    { Icon: Users, title: "1", description: t("staffingStep1") },
    { Icon: Warehouse, title: "2", description: t("staffingStep2") },
    { Icon: Buildings, title: "3", description: t("staffingStep3") },
  ]

  return (
    <div className="min-h-screen bg-wj-cream">
      <section className="relative overflow-hidden bg-wj-dark py-16 text-white sm:py-20">
        <Image
          src="/images/services/warehouse-staffing.webp"
          alt={t("professionalSupportStaff")}
          fill
          sizes="100vw"
          quality={90}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(44,95,112,0.94)_0%,rgba(44,95,112,0.88)_50%,rgba(44,95,112,0.55)_100%)]" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-2xl">
            <h1 className="hero-copy text-3xl leading-tight tracking-tight sm:text-4xl md:text-5xl">
              {t("staffingPageTitle")}
            </h1>
            <p className="hero-copy mt-4 text-lg leading-relaxed text-white/85">
              {t("staffingPageLead")}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row [&>*]:w-full sm:[&>*]:w-auto">
              <Button size="lg" variant="onDark" asChild>
                <Link href="/contact">
                  {t("talkToUs")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="onDarkOutline" asChild>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  <WhatsappLogo className="mr-2 h-5 w-5" />
                  {t("whatsapp")}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* warehouse — the specialism */}
      <section className="border-b border-wj-cream-deep bg-white py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="relative order-first aspect-[4/3] overflow-hidden rounded-xl lg:order-last lg:aspect-auto">
              <Image
                src="/images/services/industry-warehouse.webp"
                alt={t("warehouseIndustry")}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={90}
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl tracking-tight text-gray-900 sm:text-4xl">
                {t("warehouseStaffingTitle")}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-gray-600">
                {t("warehouseStaffingDesc")}
              </p>
              <ul className="mt-6 space-y-2.5">
                {warehouseTasks.map((task) => (
                  <li key={task} className="flex items-start gap-3">
                    <Check weight="bold" className="mt-1 h-4 w-4 flex-shrink-0 text-wj-dark" />
                    <span className="text-gray-700">{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* support staff */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl tracking-tight text-gray-900 sm:text-4xl">
              {t("supportStaffTitle")}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">{t("supportStaffDesc")}</p>
          </div>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {supportRoles.map((role) => (
              <li
                key={role}
                className="flex items-center gap-3 rounded-xl border border-wj-cream-deep bg-white p-4"
              >
                <Check weight="bold" className="h-4 w-4 flex-shrink-0 text-wj-dark" />
                <span className="text-gray-800">{role}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* how it works */}
      <section className="border-y border-wj-cream-deep bg-white py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <h2 className="max-w-2xl text-3xl tracking-tight text-gray-900 sm:text-4xl">
            {t("staffingHowTitle")}
          </h2>
          <div className="scroll-stagger mt-8 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <FeatureCard
                key={s.description}
                Icon={s.Icon}
                tint={tintFor(i)}
                title={s.title}
                description={s.description}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-wj-dark py-16 text-white sm:py-20">
        <div className="container mx-auto px-4 text-center sm:px-6 md:px-8">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl tracking-tight sm:text-4xl">{t("hireSupportStaff")}</h2>
            <p className="mt-4 text-lg leading-relaxed text-white/85">{t("staffingPageLead")}</p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row [&>*]:w-full sm:[&>*]:w-auto">
              <Button size="lg" variant="onDark" asChild>
                <Link href="/contact">{t("talkToUs")}</Link>
              </Button>
              <Button size="lg" variant="onDarkOutline" asChild>
                <a href={`tel:${CONTACT_DETAILS.phoneTel}`}>{t("callNow")}</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
