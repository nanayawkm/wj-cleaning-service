"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { IconUsers, IconShield, IconClock, IconMapPin, IconStar, IconAward, IconHeart, IconDroplet, IconSparkles, IconCheck, IconBuilding, IconHome, IconBriefcase, IconBuildingWarehouse } from '@tabler/icons-react'
import { useLanguage } from '@/contexts/LanguageContext'
import Image from 'next/image'
import Link from 'next/link'
import { CleaningBackground } from '@/components/cleaning-background'

export default function AboutPage() {
  const { t } = useLanguage()
  
  return (
    <div className="min-h-screen">
      <CleaningBackground />
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 xl:py-24 2xl:py-32 bg-gradient-to-r from-wj-dark to-wj-accent text-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-white/20 text-white mb-3 sm:mb-4 lg:mb-6 text-xs sm:text-sm">{t('aboutUs')}</Badge>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold mb-4 sm:mb-6 lg:mb-8 leading-tight">
              {t('aboutHeroTitle')}
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl text-wj-light leading-relaxed font-light max-w-3xl mx-auto px-2 sm:px-4 md:px-6">
              {t('aboutHeroSubtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
        <CleaningBackground />
        <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center">
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              <div>
                <Badge className="bg-wj-light/20 text-wj-dark mb-2 sm:mb-3 lg:mb-4 text-xs sm:text-sm">{t('ourMission')}</Badge>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6">
                  {t('deliveringExcellence')}
                </h2>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
                  {t('aboutDescription')}
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                <div className="flex items-start space-x-2 sm:space-x-3 lg:space-x-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-wj-dark">
                    <IconHeart className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-wj-dark" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-1 sm:mb-2">{t('customerCentricApproach')}</h3>
                    <p className="text-xs sm:text-sm lg:text-base text-gray-600">{t('customerCentricDesc')}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2 sm:space-x-3 lg:space-x-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-wj-dark">
                    <IconShield className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-wj-dark" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-1 sm:mb-2">{t('trustedReliable')}</h3>
                    <p className="text-xs sm:text-sm lg:text-base text-gray-600">{t('trustedReliableDesc')}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2 sm:space-x-3 lg:space-x-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-wj-dark">
                    <IconStar className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-wj-dark" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-1 sm:mb-2">{t('excellenceInService')}</h3>
                    <p className="text-xs sm:text-sm lg:text-base text-gray-600">{t('excellenceInServiceDesc')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative order-first lg:order-last">
              <div className="relative rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/images/pexels-tima-miroshnichenko-6197122.jpg"
                  alt={t('professionalCleaningTeam')}
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
      <section className="py-24 bg-wj-accent-light/10 relative overflow-hidden">
        <CleaningBackground />
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-wj-light/30 rounded-full blur-3xl opacity-20"></div>
        <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-wj-accent-light/20 text-wj-accent-dark rounded-full mb-6">
              <span className="text-sm font-semibold">{t('ourValues')}</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t('principlesGuideUs')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('valuesDescription')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center border-2 border-wj-dark">
                  <IconHeart className="h-5 w-5 text-wj-dark" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{t('passionForExcellence')}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {t('passionForExcellenceDesc')}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center border-2 border-wj-accent">
                  <IconShield className="h-5 w-5 text-wj-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{t('trustReliabilityTitle')}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {t('trustReliabilityDesc')}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center border-2 border-wj-dark">
                  <IconClock className="h-5 w-5 text-wj-dark" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{t('timelyServiceTitle')}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {t('timelyServiceDesc')}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center border-2 border-wj-accent">
                  <IconStar className="h-5 w-5 text-wj-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{t('qualityAssuranceTitle')}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {t('qualityAssuranceDesc')}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center border-2 border-wj-dark">
                  <IconUsers className="h-5 w-5 text-wj-dark" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{t('customerFocusTitle')}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {t('customerFocusDesc')}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center border-2 border-wj-accent">
                  <IconAward className="h-5 w-5 text-wj-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{t('continuousGrowthTitle')}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {t('continuousGrowthDesc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <CleaningBackground />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-wj-light/20 text-wj-dark rounded-full mb-6">
              <span className="text-sm font-semibold">{t('ourWork')}</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t('professionalExcellenceInEveryDetail')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('discoverQuality')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
              <img
                src="/images/giorgio-trovato-5TXz228u4eo-unsplash.jpg"
                                  alt={t('professionalCleaningService')}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                  <h3 className="text-white font-semibold text-lg">{t('residentialCleaning')}</h3>
                <p className="text-white/90 text-sm">{t('completeHomeCleaning')}</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
              <img
                src="/images/pexels-karolina-grabowska-4239145.jpg"
                                  alt={t('commercialCleaningService')}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <h3 className="text-white font-semibold text-lg">Commercial Cleaning</h3>
                <p className="text-white/90 text-sm">Professional office and facility cleaning</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
              <img
                src="/images/pexels-tima-miroshnichenko-6197121.jpg"
                                  alt={t('warehouseStaffingService')}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                  <h3 className="text-white font-semibold text-lg">{t('warehouseStaffing')}</h3>
                <p className="text-white/90 text-sm">Reliable workforce solutions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 bg-wj-dark text-white relative overflow-hidden">
        <CleaningBackground />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <span className="text-sm font-medium">{t('readyToWorkTogether')}</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold mb-8">
              {t('letsBuildAmazing')}
            </h2>
            <p className="text-xl text-wj-light mb-12 max-w-2xl mx-auto leading-relaxed">
              {t('aboutCtaDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="lg" className="bg-white text-wj-dark hover:bg-wj-light/10 font-semibold">
                <Link href="/contact">{t('getStartedToday')}</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-wj-dark bg-transparent"
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
