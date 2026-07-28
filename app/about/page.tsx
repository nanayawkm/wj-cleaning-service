"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Buildings, Certificate, Check, Clock, Drop, Heart, HouseLine, MapPin, ShieldCheck, Sparkle, Star, Users, Warehouse } from "@phosphor-icons/react"
import { useLanguage } from '@/contexts/LanguageContext'
import { FeatureCard, tintFor } from '@/components/feature-card'
import Image from 'next/image'
import Link from 'next/link'

export default function AboutPage() {
  const { t } = useLanguage()
  
  return (
    <div className="min-h-screen bg-wj-cream">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 xl:py-24 bg-wj-dark text-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="max-w-3xl">
            <Badge className="bg-white/20 text-white mb-3 sm:mb-4 lg:mb-6 text-xs sm:text-sm">{t('aboutUs')}</Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl tracking-tight mb-4 leading-tight">
              {t('aboutHeroTitle')}
            </h1>
            <p className="text-lg text-white/85 leading-relaxed max-w-2xl">
              {t('aboutHeroSubtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center">
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              <div>
                <Badge className="bg-wj-light/20 text-wj-dark mb-2 sm:mb-3 lg:mb-4 text-xs sm:text-sm">{t('ourMission')}</Badge>
                <h2 className="text-3xl sm:text-4xl tracking-tight text-gray-900 mb-4">
                  {t('deliveringExcellence')}
                </h2>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
                  {t('aboutDescription')}
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                <div className="flex items-start space-x-2 sm:space-x-3 lg:space-x-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-wj-dark">
                    <Heart className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-wj-dark" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-1 sm:mb-2">{t('customerCentricApproach')}</h3>
                    <p className="text-xs sm:text-sm lg:text-base text-gray-600">{t('customerCentricDesc')}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2 sm:space-x-3 lg:space-x-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-wj-dark">
                    <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-wj-dark" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-1 sm:mb-2">{t('trustedReliable')}</h3>
                    <p className="text-xs sm:text-sm lg:text-base text-gray-600">{t('trustedReliableDesc')}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2 sm:space-x-3 lg:space-x-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-wj-dark">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-wj-dark" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-1 sm:mb-2">{t('excellenceInService')}</h3>
                    <p className="text-xs sm:text-sm lg:text-base text-gray-600">{t('excellenceInServiceDesc')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative order-first lg:order-last">
              <div className="relative rounded-xl overflow-hidden">
                <Image
                  src="/images/services/staffing-support.webp"
                  alt={t('professionalCleaningTeam')}
                  width={800}
                  height={600}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 lg:bottom-6 lg:left-6 bg-white/90 backdrop-blur-sm p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl">
                  <p className="text-xs sm:text-sm font-semibold text-gray-900">{t('professionalExcellence')}</p>
                  <p className="text-xs text-gray-600">{t('qualityServiceGuaranteed')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="max-w-2xl mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-wj-accent-light/20 text-wj-accent-dark rounded-full mb-6">
              <span className="text-sm font-semibold">{t('ourValues')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl tracking-tight text-gray-900 mb-4">
              {t('principlesGuideUs')}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t('valuesDescription')}
            </p>
          </div>

          <div className="scroll-stagger grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { Icon: Heart, title: t('passionForExcellence'), description: t('passionForExcellenceDesc') },
              { Icon: ShieldCheck, title: t('trustReliabilityTitle'), description: t('trustReliabilityDesc') },
              { Icon: Clock, title: t('timelyServiceTitle'), description: t('timelyServiceDesc') },
              { Icon: Star, title: t('qualityAssuranceTitle'), description: t('qualityAssuranceDesc') },
              { Icon: Users, title: t('customerFocusTitle'), description: t('customerFocusDesc') },
              { Icon: Certificate, title: t('continuousGrowthTitle'), description: t('continuousGrowthDesc') },
            ].map((card, i) => (
              <FeatureCard
                key={card.title}
                Icon={card.Icon}
                tint={tintFor(i)}
                title={card.title}
                description={card.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-wj-light/20 text-wj-dark rounded-full mb-6">
              <span className="text-sm font-semibold">{t('ourWork')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl tracking-tight text-gray-900 mb-4">
              {t('professionalExcellenceInEveryDetail')}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t('discoverQuality')}
            </p>
          </div>

          {/* the four services the business actually offers, one card each */}
          <div className="scroll-stagger grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                image: '/images/gallery-residential.webp',
                alt: t('professionalCleaningService'),
                title: t('residentialCleaning'),
                description: t('completeHomeCleaning'),
              },
              {
                image: '/images/gallery-commercial.webp',
                alt: t('commercialCleaningService'),
                title: t('officeCleaning'),
                description: t('commercialCleaningDesc'),
              },
              {
                image: '/images/gallery-staffing.webp',
                alt: t('warehouseStaffingService'),
                title: t('warehouseStaffing'),
                description: t('reliableWorkforce'),
              },
              {
                image: '/images/services/event-staffing.webp',
                alt: t('eventStaffing'),
                title: t('eventStaffing'),
                description: t('eventDesc'),
              },
            ].map((card) => (
              <FeatureCard
                key={card.title}
                image={card.image}
                imageAlt={card.alt}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                title={card.title}
                description={card.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-wj-dark text-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <span className="text-sm font-medium">{t('readyToWorkTogether')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl tracking-tight mb-4">
              {t('letsBuildAmazing')}
            </h2>
            <p className="text-lg text-white/85 mb-8 max-w-2xl leading-relaxed">
              {t('aboutCtaDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 [&>*]:w-full sm:[&>*]:w-auto">
              <Button asChild size="lg" variant="onDark">
                <Link href="/contact">{t('getStartedToday')}</Link>
              </Button>
              <Button
                size="lg"
                variant="onDarkOutline"
              >
                <Link href="/services">{t('viewOurServices')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
