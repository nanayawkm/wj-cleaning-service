"use client"

import { Clock, Envelope, MapPin, Phone } from "@phosphor-icons/react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { BUSINESS_DETAILS, CONTACT_DETAILS, OPENING_HOURS } from "./constant"
import { useLanguage } from "@/contexts/LanguageContext"

export default function Footer() {
  const { t } = useLanguage()
  const pathname = usePathname()

  // Not on the dashboard: a marketing footer under an admin table is noise,
  // and it pushed the real content up into a narrow strip. See Navigation.
  if (pathname?.startsWith("/admin")) return null

  const serviceLinks = [
    // these are enquiry entry points, so they go straight to contact
    { href: "/contact", label: t('residentialCleaning') },
    { href: "/contact", label: t('officeCleaning') },
    { href: "/contact", label: t('warehouseStaffing') },
    { href: "/contact", label: t('eventStaffing') },
  ]

  const pageLinks = [
    { href: "/", label: t('home') },
    { href: "/about", label: t('about') },
    { href: "/services", label: t('services') },
    { href: "/contact", label: t('contact') },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Company */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/logo1.png"
                alt={t('wjCleaningServices')}
                width={80}
                height={80}
                quality={90}
                className="h-10 w-10 object-contain"
              />
              <span className="text-lg font-semibold">WJ Cleaning Services</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              {t('footerDescription')}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
              {t('quickLinks')}
            </h3>
            <ul className="space-y-2.5">
              {pageLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="-my-1.5 inline-block py-2.5 text-sm text-gray-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
              {t('services')}
            </h3>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="-my-1.5 inline-block py-2.5 text-sm text-gray-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
              {t('contact')}
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-wj-light" />
                <a
                  href={`tel:${CONTACT_DETAILS.phoneTel}`}
                  className="text-gray-300 transition-colors hover:text-white"
                >
                  {CONTACT_DETAILS.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Envelope className="mt-0.5 h-4 w-4 flex-shrink-0 text-wj-light" />
                <a
                  href={`mailto:${CONTACT_DETAILS.email}`}
                  className="break-all text-gray-300 transition-colors hover:text-white"
                >
                  {CONTACT_DETAILS.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-wj-light" />
                <a
                  href={CONTACT_DETAILS.googlemap}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 transition-colors hover:text-white"
                >
                  {CONTACT_DETAILS.address ? `${CONTACT_DETAILS.address}, ` : ''}
                  {CONTACT_DETAILS.city}, {CONTACT_DETAILS.country}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-wj-light" />
                <span className="text-gray-300">{OPENING_HOURS.weekdays}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Statutory business details — required on Dutch commercial sites */}
        {(BUSINESS_DETAILS.kvk || BUSINESS_DETAILS.btw) && (
          <p className="mt-10 border-t border-gray-800 pt-6 text-xs text-gray-500">
            {BUSINESS_DETAILS.kvk && <>KVK {BUSINESS_DETAILS.kvk}</>}
            {BUSINESS_DETAILS.kvk && BUSINESS_DETAILS.btw && <span className="mx-2">·</span>}
            {BUSINESS_DETAILS.btw && <>BTW {BUSINESS_DETAILS.btw}</>}
          </p>
        )}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto flex flex-col gap-5 px-4 py-6 sm:px-6 md:px-8 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} WJ Cleaning Services. {t('allRightsReserved')}
          </p>

          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
            <Link href="/privacy" className="-my-1.5 inline-block py-2.5 text-gray-400 transition-colors hover:text-white">
              {t('privacyPolicy')}
            </Link>
            <Link href="/terms" className="-my-1.5 inline-block py-2.5 text-gray-400 transition-colors hover:text-white">
              {t('termsOfService')}
            </Link>
            <Link href="/cookies" className="-my-1.5 inline-block py-2.5 text-gray-400 transition-colors hover:text-white">
              {t('cookiePolicy')}
            </Link>
          </nav>

          <a
            href="https://quube.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-gray-500 transition-colors hover:text-gray-300"
            aria-label="Quube Technology"
          >
            <span>{t('designedByQuube')}</span>
            <Image
              src="/images/quube-logo.webp"
              alt="Quube"
              width={64}
              height={20}
              className="h-5 w-auto object-contain"
            />
          </a>
        </div>
      </div>
    </footer>
  )
}
