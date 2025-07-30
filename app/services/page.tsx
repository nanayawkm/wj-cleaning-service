"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { IconCheck, IconHome, IconBuilding, IconBuildingWarehouse, IconUsers, IconStar, IconShield, IconClock, IconAward, IconTrash, IconSparkles, IconMapPin, IconDroplet, IconBriefcase, IconShieldCheck } from '@tabler/icons-react'
import { CleaningBackground } from '@/components/cleaning-background'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ServicesPage() {
  const { t } = useLanguage()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-wj-light/10 via-white to-wj-accent-light/10">
      <CleaningBackground />
      
      {/* Hero Section with Background Image */}
      <section className="relative py-16 sm:py-20 lg:py-24 xl:py-32 bg-gradient-to-r from-wj-dark/90 to-wj-accent/90 text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/services/newnew.jpg"
            alt={t('professionalCleaningServices')}
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-wj-dark/85 to-wj-accent/85"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-white/30 text-white mb-3 sm:mb-4 lg:mb-6 backdrop-blur-md font-semibold text-xs sm:text-sm">{t('ourServices')}</Badge>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold mb-4 sm:mb-6 lg:mb-8 leading-tight drop-shadow-lg">
              {t('servicesTitle')}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-white leading-relaxed drop-shadow-lg font-medium px-2 sm:px-4">
              {t('servicesSubtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Cleaning Services Section */}
      <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
        <CleaningBackground />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <Badge className="bg-wj-light/20 text-wj-dark mb-2 sm:mb-3 lg:mb-4 text-xs sm:text-sm">{t('commercialIndustrial')}</Badge>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6">
              {t('comprehensiveCleaning')}
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2 sm:px-4">
              {t('comprehensiveCleaningDesc')}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* Left Column - Services List */}
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              <div className="flex items-start space-x-2 sm:space-x-3 lg:space-x-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-wj-dark">
                  <IconDroplet className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-wj-dark" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2">{t('comprehensiveCleaning')}</h3>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed">
                    {t('comprehensiveCleaningDesc')}
                  </p>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <IconCheck className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-wj-accent flex-shrink-0" />
                  <span className="text-xs sm:text-sm lg:text-base text-gray-700">{t('dustingCleaningSurfaces')}</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <IconCheck className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-wj-accent flex-shrink-0" />
                  <span className="text-xs sm:text-sm lg:text-base text-gray-700">{t('moppingSweepingFloors')}</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <IconCheck className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-wj-accent flex-shrink-0" />
                  <span className="text-xs sm:text-sm lg:text-base text-gray-700">{t('emptyingDustbinsWaste')}</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <IconCheck className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-wj-accent flex-shrink-0" />
                  <span className="text-xs sm:text-sm lg:text-base text-gray-700">{t('cleaningWipingGlass')}</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <IconCheck className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-wj-accent flex-shrink-0" />
                  <span className="text-xs sm:text-sm lg:text-base text-gray-700">{t('bathroomToiletCleaning')}</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <IconCheck className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-wj-accent flex-shrink-0" />
                  <span className="text-xs sm:text-sm lg:text-base text-gray-700">{t('removingEmptyCrates')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <IconCheck className="h-4 w-4 sm:h-5 sm:w-5 text-wj-accent flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-700">{t('ensuringClearPassageways')}</span>
                </div>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="relative order-first lg:order-last">
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/services/cleaning-surfaces.jpg.jpg"
                  alt={t('professionalCleaningServices')}
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personnel Outsourcing Section */}
      <section className="py-20 bg-wj-accent-light/10 relative overflow-hidden">
        <CleaningBackground />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <Badge className="bg-wj-accent-light/20 text-wj-accent-dark mb-4">{t('personnelOutsourcing')}</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t('qualifiedVetted')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('personnelOutsourcingDesc')}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Image */}
            <div className="relative group order-2 lg:order-1">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src="/images/services/staffing-support1.jpg.jpg"
                  alt={t('professionalSupportStaff')}
                  width={600}
                  height={400}
                  className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
                  quality={90}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-lg border-2 border-wj-accent">
                <IconUsers className="h-10 w-10 text-wj-accent" />
              </div>
            </div>

            {/* Right Column - Services List */}
            <div className="space-y-8 order-1 lg:order-2">
                            <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-wj-dark">
                  <IconBuildingWarehouse className="h-6 w-6 text-wj-dark" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t('warehouseStaffingTitle')}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t('warehouseStaffingDesc')}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <IconCheck className="h-5 w-5 text-wj-accent flex-shrink-0" />
                  <span className="text-gray-700">{t('orderPickingPacking')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <IconCheck className="h-5 w-5 text-wj-accent flex-shrink-0" />
                  <span className="text-gray-700">{t('inventoryManagement')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <IconCheck className="h-5 w-5 text-wj-accent flex-shrink-0" />
                  <span className="text-gray-700">{t('loadingUnloading')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <IconCheck className="h-5 w-5 text-wj-accent flex-shrink-0" />
                  <span className="text-gray-700">{t('qualityControlSupport')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <IconCheck className="h-5 w-5 text-wj-accent flex-shrink-0" />
                  <span className="text-gray-700">{t('forkliftOperation')}</span>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-wj-accent">
                  <IconUsers className="h-6 w-6 text-wj-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t('supportStaffTitle')}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t('supportStaffDesc')}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <IconCheck className="h-5 w-5 text-wj-accent flex-shrink-0" />
                  <span className="text-gray-700">{t('officeSupportStaff')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <IconCheck className="h-5 w-5 text-wj-accent flex-shrink-0" />
                  <span className="text-gray-700">{t('restaurantCafePersonnel')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <IconCheck className="h-5 w-5 text-wj-accent flex-shrink-0" />
                  <span className="text-gray-700">{t('hotelStaff')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <IconCheck className="h-5 w-5 text-wj-accent flex-shrink-0" />
                  <span className="text-gray-700">{t('schoolSupportStaff')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <IconCheck className="h-5 w-5 text-wj-accent flex-shrink-0" />
                  <span className="text-gray-700">{t('eventStaffingText')}</span>
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-wj-accent to-wj-dark hover:from-wj-accent-dark hover:to-wj-darker">
                {t('hireSupportStaff')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Industries We Serve Section */}
      <section className="py-20 relative overflow-hidden">
        <CleaningBackground />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <Badge className="bg-wj-light/20 text-wj-dark mb-4">{t('industriesWeServe')}</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t('servingDiverse')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('industriesDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Warehouse */}
            <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/images/services/industry-warehouse.jpg"
                  alt={t('warehouseIndustry')}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  quality={90}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border-2 border-wj-dark">
                    <IconBuildingWarehouse className="h-6 w-6 text-wj-dark" />
                  </div>
                </div>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">{t('warehouses')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {t('warehousesDesc')}
                </p>
              </CardContent>
            </Card>

            {/* Office */}
            <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/images/services/industry-office.jpg"
                  alt={t('officeIndustry')}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  quality={90}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border-2 border-wj-accent">
                    <IconBuilding className="h-6 w-6 text-wj-accent" />
                  </div>
                </div>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">{t('offices')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {t('officesDesc')}
                </p>
              </CardContent>
            </Card>

            {/* Restaurant */}
            <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/images/services/industry-restaurant..jpg"
                  alt={t('restaurantIndustry')}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  quality={90}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border-2 border-wj-dark">
                    <IconUsers className="h-6 w-6 text-wj-dark" />
                  </div>
                </div>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">{t('restaurantsCafes')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {t('restaurantsDesc')}
                </p>
              </CardContent>
            </Card>

            {/* Hotel */}
            <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/images/services/industry-hotel.jpg"
                  alt={t('hotelIndustry')}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  quality={90}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border-2 border-wj-accent">
                    <IconStar className="h-6 w-6 text-wj-accent" />
                  </div>
                </div>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">{t('hotels')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {t('hotelsDesc')}
                </p>
              </CardContent>
            </Card>

            {/* School */}
            <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/images/services/industry-school.jpg"
                  alt={t('schoolIndustry')}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  quality={90}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border-2 border-wj-dark">
                    <IconMapPin className="h-6 w-6 text-wj-dark" />
                  </div>
                </div>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">{t('schools')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {t('schoolsDesc')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Service Excellence Section */}
      <section className="py-20 bg-wj-accent-light/10 relative overflow-hidden">
        <CleaningBackground />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <Badge className="bg-wj-light/20 text-wj-dark mb-4">{t('serviceExcellence')}</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t('whyChooseWJ')}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border-2 border-wj-dark">
                <IconCheck className="h-8 w-8 text-wj-dark" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('qualityAssured')}</h3>
              <p className="text-gray-600">
                {t('qualityAssuredDesc')}
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border-2 border-wj-accent">
                <IconShieldCheck className="h-8 w-8 text-wj-accent" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('fullyInsured')}</h3>
              <p className="text-gray-600">
                {t('fullyInsuredDesc')}
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border-2 border-wj-dark">
                <IconClock className="h-8 w-8 text-wj-dark" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('support247')}</h3>
              <p className="text-gray-600">
                {t('support247Desc')}
              </p>
            </div>


          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-wj-dark to-wj-accent text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-wj-dark/90 to-wj-accent/90"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-6xl font-bold mb-8">
              {t('readyToExperience')}
            </h2>
            <p className="text-xl text-wj-light mb-8 max-w-2xl mx-auto">
              {t('readyToExperienceDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="lg" className="bg-white text-wj-dark hover:bg-wj-light/10 font-semibold">
                <a href="/contact">{t('getFreeQuote')}</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-wj-dark bg-transparent"
              >
                <a href={`tel:${t('phoneNumber')}`}>{t('callNow')}</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
