"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconSparkles, IconPhone, IconMail, IconMapPin, IconBrandFacebook, IconBrandTwitter, IconBrandLinkedin, IconHeart, IconDroplet, IconShieldCheck } from "@tabler/icons-react"
import Link from "next/link"
import Image from "next/image"
import { CONTACT_DETAILS } from "./constant"
import { useLanguage } from "@/contexts/LanguageContext"

export default function Footer() {
  const { t } = useLanguage()
  
  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:50px_50px]"></div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-20 relative">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">
          {/* Enhanced Company Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-3 group">
                              <div className="w-10 h-10 group-hover:scale-105 transition-transform duration-300 shadow-lg">
                  <img
                    src="/images/logo1.png"
                    alt={t('wjCleaningServices')}
                    className="w-full h-full object-contain"
                  />
                </div>
                              <span className="text-2xl font-bold">WJ Cleaning Services</span>
            </Link>
                          <p className="text-gray-300 leading-relaxed text-lg">
                {t('footerDescription')}
              </p>
            <div className="flex space-x-4">
              {/* Social media buttons removed */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-8 text-white">{t('quickLinks')}</h3>
            <div className="space-y-4">
              <Link
                href="/"
                className="block text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 text-lg"
              >
                {t('home')}
              </Link>
              <Link
                href="/about"
                className="block text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 text-lg"
              >
                {t('about')}
              </Link>
              <Link
                href="/services"
                className="block text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 text-lg"
              >
                {t('services')}
              </Link>
              <Link
                href="/contact"
                className="block text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 text-lg"
              >
                {t('contact')}
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-8 text-white">{t('services')}</h3>
            <div className="space-y-4">
              <Link
                href="/services"
                className="block text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 text-lg"
              >
                {t('residentialCleaning')}
              </Link>
              <Link
                href="/services"
                className="block text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 text-lg"
              >
                {t('officeCleaning')}
              </Link>
              <Link
                href="/services"
                className="block text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 text-lg"
              >
                {t('warehouseStaffing')}
              </Link>
              <Link
                href="/services"
                className="block text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 text-lg"
              >
                {t('eventStaffing')}
              </Link>
            </div>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-8 text-white">{t('stayConnected')}</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl backdrop-blur-sm">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border-2 border-wj-dark flex-shrink-0">
                  <IconPhone className="h-5 w-5 text-wj-dark" />
                </div>
                <a href={`tel:${CONTACT_DETAILS.phone}`} className="text-gray-300 text-sm sm:text-base hover:text-white transition-colors duration-300">
                  {CONTACT_DETAILS.phone}
                </a>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl backdrop-blur-sm">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border-2 border-wj-accent flex-shrink-0">
                  <IconMail className="h-5 w-5 text-wj-accent" />
                </div>
                <a href={`mailto:${CONTACT_DETAILS.email}`} className="text-gray-300 text-sm sm:text-base hover:text-white transition-colors duration-300 break-all">
                  {CONTACT_DETAILS.email}
                </a>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-white/5 rounded-xl backdrop-blur-sm">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border-2 border-wj-accent flex-shrink-0 mt-1">
                  <IconMapPin className="h-5 w-5 text-wj-accent" />
                </div>
                <a href={CONTACT_DETAILS.googlemap} target="_blank" className="text-gray-300 text-sm sm:text-base hover:text-white transition-colors duration-300">
                  {CONTACT_DETAILS.address ? `${CONTACT_DETAILS.address}, ` : ''}{CONTACT_DETAILS.city}, {CONTACT_DETAILS.country}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800 relative">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <p className="text-gray-400 text-lg">© {new Date().getFullYear()} WJ Cleaning Services. {t('allRightsReserved')}</p>
            </div>
            <div className="flex space-x-8 text-lg">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                {t('privacyPolicy')}
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                {t('termsOfService')}
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                {t('cookiePolicy')}
              </Link>
            </div>
          </div>
          {/* Designed and developed by Quube - Bottom Left */}
          <div className="flex justify-start mt-6">
            <a
              href="https://www.quubetech.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 text-base flex items-center gap-3 hover:text-gray-300 transition-colors duration-300 group"
              aria-label="Quube Technology"
            >
              <span>{t('designedByQuube')}</span>
              <img
                src="/images/Quube_logo_new.PNG"
                alt="Quube"
                className="h-12 w-auto group-hover:opacity-80 transition-opacity"
                style={{ objectFit: "contain" }}
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
