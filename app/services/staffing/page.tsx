"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Buildings, Users, Warehouse, WhatsappLogo } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { FeatureCard, tintFor } from "@/components/feature-card"
import { StaffCarousel } from "@/components/staff-carousel"
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

  const staffSlides = [
    {
      title: t("warehouseStaffingTitle"),
      description: t("warehouseStaffingDesc"),
      image: "/images/services/industry-warehouse.webp",
      bullets: [t("orderPickingPacking"), t("inventoryManagement"), t("loadingUnloading")],
    },
    {
      title: t("officeSupportStaff"),
      description: t("staffOfficeDesc"),
      image: "/images/services/industry-office.webp",
      bullets: [t("staffOfficeB1"), t("staffOfficeB2"), t("staffOfficeB3")],
    },
    {
      title: t("restaurantCafePersonnel"),
      description: t("staffRestaurantDesc"),
      image: "/images/services/industry-restaurant.webp",
      bullets: [t("staffRestaurantB1"), t("staffRestaurantB2"), t("staffRestaurantB3")],
    },
    {
      title: t("hotelStaff"),
      description: t("staffHotelDesc"),
      image: "/images/services/industry-hotel.webp",
      bullets: [t("staffHotelB1"), t("staffHotelB2"), t("staffHotelB3")],
    },
    {
      title: t("schoolSupportStaff"),
      description: t("staffSchoolDesc"),
      image: "/images/services/industry-school.webp",
      bullets: [t("staffSchoolB1"), t("staffSchoolB2"), t("staffSchoolB3")],
    },
    {
      title: t("eventStaffingText"),
      description: t("staffEventDesc"),
      image: "/images/services/event-staffing.webp",
      bullets: [t("staffEventB1"), t("staffEventB2"), t("staffEventB3")],
    },
  ]

  const steps = [
    { Icon: Users, title: "1", description: t("staffingStep1") },
    { Icon: Warehouse, title: "2", description: t("staffingStep2") },
    { Icon: Buildings, title: "3", description: t("staffingStep3") },
  ]

  return (
    <div className="min-h-screen bg-wj-cream">
      <section className="relative overflow-hidden bg-wj-dark pb-16 pt-32 text-white sm:pb-20 sm:pt-40">
        <Image
          src="/images/services/warehouse-staffing.webp"
          alt={t("professionalSupportStaff")}
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

      {/*
        Every staffing role in one carousel, warehouse first because it is the
        specialism. It replaced both a flat list of role names and a separate
        warehouse block — six slides in the same copy-left, image-right shape
        say more than two static sections did, and the page stops repeating
        itself.
      */}
      <section className="border-b border-wj-cream-deep bg-white py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-3xl tracking-tight text-gray-900 sm:text-4xl">
              {t("staffRolesTitle")}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">{t("staffRolesLead")}</p>
          </div>
          <StaffCarousel slides={staffSlides} label={t("staffRolesTitle")} />
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
