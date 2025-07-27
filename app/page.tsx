"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  IconArrowRight, 
  IconCheck,
  IconUsers, 
  IconSparkles,
  IconBuilding,
  IconHome, 
  IconBriefcase, 
  IconBuildingWarehouse, 
  IconPhone,
  IconMessage,
  IconStar,
  IconShield, 
  IconClock, 
  IconDroplet,
  IconAward
} from "@tabler/icons-react"
import { CleaningBackground } from "@/components/cleaning-background"
import { useLanguage } from "@/contexts/LanguageContext"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  const { t } = useLanguage()
  
  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-wj-dark text-white">
        {/* Abstract Decorative Blob */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-wj-light rounded-full blur-3xl opacity-20 transform translate-x-32 -translate-y-32"></div>

        <div className="relative container mx-auto px-4 py-16 sm:py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="space-y-6 lg:space-y-8">
              <div className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 scroll-animate">
                <span className="text-xs sm:text-sm font-medium">{t('professionalCleaningStaffing')}</span>
              </div>

              <div className="space-y-4 lg:space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-tight tracking-tight scroll-animate">
                  {t('heroTitle')}
                </h1>
                <p className="text-lg sm:text-xl lg:text-2xl text-blue-100 leading-relaxed font-light scroll-animate">
                  {t('heroSubtitle')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 scroll-animate">
                <Button
                  size="lg"
                  className="bg-white text-wj-dark hover:bg-wj-lighter/20 font-semibold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <Link href="/contact">
                    {t('getFreeQuote')}
                    <IconArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-wj-dark bg-transparent font-semibold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl"
                  asChild
                >
                  <Link href="/contact">
                    {t('hireStaff')}
                    <IconUsers className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative order-first lg:order-last scroll-animate-right">
              {/* Decorative background elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 sm:w-24 sm:h-24 bg-wj-light/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 sm:w-32 sm:h-32 bg-wj-accent/20 rounded-full blur-xl"></div>
              
              {/* Main logo container */}
              <div className="relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 transform hover:scale-105 transition-all duration-500 hover:shadow-3xl">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/50 to-white rounded-2xl sm:rounded-3xl"></div>
                
                {/* Logo with enhanced styling */}
                <div className="relative z-10">
                  <img
                    src="/images/logo.png"
                    alt="WJ Cleaning Services"
                    className="w-full h-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto drop-shadow-lg"
                  />
                </div>
                
                {/* Floating elements */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-2 h-2 sm:w-3 sm:h-3 bg-wj-dark rounded-full opacity-60 animate-pulse"></div>
                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-wj-accent rounded-full opacity-40 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 -right-1 sm:-right-2 w-1 h-1 bg-wj-light rounded-full opacity-50 animate-pulse delay-500"></div>
              </div>
              
              {/* Bottom accent line */}
              <div className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-0.5 sm:w-16 sm:h-1 bg-gradient-to-r from-wj-dark to-wj-accent rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - White Background */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden">
        {/* Subtle Cleaning Icons Background */}
        <CleaningBackground />
        
        {/* Purple decorative blob */}
        <div className="absolute top-20 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-purple-200 rounded-full blur-3xl opacity-30"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-wj-lighter/20 text-wj-dark rounded-full mb-4 sm:mb-6 scroll-animate">
              <span className="text-xs sm:text-sm font-semibold">{t('ourServices')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight scroll-animate">
              {t('servicesTitle')}
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4 scroll-animate">
              {t('servicesSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
            {/* Enhanced Residential Cleaning Card */}
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-xl hover:-translate-y-2 sm:hover:-translate-y-4 bg-gradient-to-br from-white to-gray-50 rounded-2xl sm:rounded-3xl overflow-hidden min-h-[400px] sm:min-h-[450px] lg:min-h-[500px] flex flex-col scroll-animate">
              {/* Image Header */}
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-wj-dark/80 to-wj-accent/80"></div>
                <div className="absolute inset-0 bg-[url('/images/services/cleanclean.jpg')] bg-cover bg-center group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <IconHome className="h-5 w-5 sm:h-6 sm:w-6 text-wj-dark" />
                </div>
              </div>
              
              <CardContent className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">{t('residentialCleaning')}</h3>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                    {t('residentialDesc')}
                  </p>
                </div>
                
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center w-full bg-gradient-to-r from-wj-dark to-wj-accent hover:from-wj-darker hover:to-wj-accent-dark text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 group-hover:scale-105 shadow-lg text-sm sm:text-base"
                >
                  {t('learnMore')}
                  <IconArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                </Link>
              </CardContent>
            </Card>

            {/* Enhanced Office Cleaning Card */}
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-xl hover:-translate-y-2 sm:hover:-translate-y-4 bg-gradient-to-br from-white to-gray-50 rounded-2xl sm:rounded-3xl overflow-hidden min-h-[400px] sm:min-h-[450px] lg:min-h-[500px] flex flex-col scroll-animate">
              {/* Image Header */}
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-wj-dark/80 to-wj-accent/80"></div>
                <div className="absolute inset-0 bg-[url('/images/services/office-cleaning.jpg')] bg-cover bg-center group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <IconBriefcase className="h-5 w-5 sm:h-6 sm:w-6 text-wj-dark" />
                </div>
              </div>
              
              <CardContent className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">{t('officeCleaning')}</h3>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                    {t('officeDesc')}
                  </p>
                </div>
                
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center w-full bg-gradient-to-r from-wj-dark to-wj-accent hover:from-wj-darker hover:to-wj-accent-dark text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 group-hover:scale-105 shadow-lg text-sm sm:text-base"
                >
                  {t('learnMore')}
                  <IconArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                </Link>
              </CardContent>
            </Card>

            {/* Enhanced Warehouse Staffing Card */}
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-xl hover:-translate-y-2 sm:hover:-translate-y-4 bg-gradient-to-br from-white to-gray-50 rounded-2xl sm:rounded-3xl overflow-hidden min-h-[400px] sm:min-h-[450px] lg:min-h-[500px] flex flex-col scroll-animate">
              {/* Image Header */}
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-wj-dark/80 to-wj-accent/80"></div>
                <div className="absolute inset-0 bg-[url('/images/services/warehouse-staffing.jpg')] bg-cover bg-center group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <IconBuildingWarehouse className="h-5 w-5 sm:h-6 sm:w-6 text-wj-dark" />
                </div>
              </div>
              
              <CardContent className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">{t('warehouseStaffing')}</h3>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                    {t('warehouseDesc')}
                  </p>
                </div>
                
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center w-full bg-gradient-to-r from-wj-dark to-wj-accent hover:from-wj-darker hover:to-wj-accent-dark text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 group-hover:scale-105 shadow-lg text-sm sm:text-base"
                >
                  {t('learnMore')}
                  <IconArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                </Link>
              </CardContent>
            </Card>

            {/* Enhanced Event Staffing Card */}
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-xl hover:-translate-y-2 sm:hover:-translate-y-4 bg-gradient-to-br from-white to-gray-50 rounded-2xl sm:rounded-3xl overflow-hidden min-h-[400px] sm:min-h-[450px] lg:min-h-[500px] flex flex-col scroll-animate">
              {/* Image Header */}
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-wj-dark/80 to-wj-accent/80"></div>
                <div className="absolute inset-0 bg-[url('/images/services/event-staffing.jpg')] bg-cover bg-center group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <IconUsers className="h-5 w-5 sm:h-6 sm:w-6 text-wj-dark" />
                </div>
              </div>
              
              <CardContent className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">{t('eventStaffing')}</h3>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                    {t('eventDesc')}
                  </p>
                </div>
                
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center w-full bg-gradient-to-r from-wj-dark to-wj-accent hover:from-wj-darker hover:to-wj-accent-dark text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 group-hover:scale-105 shadow-lg text-sm sm:text-base"
                >
                  {t('learnMore')}
                  <IconArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Split-Color About Section */}
      <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
        {/* Subtle Cleaning Icons Background */}
        <CleaningBackground />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-0 items-center min-h-[500px] sm:min-h-[600px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
            {/* Left side - White background with content */}
            <div className="bg-white p-8 sm:p-12 lg:p-16 h-full flex flex-col justify-center">
              <div className="space-y-6 sm:space-y-8">
                <div className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-wj-accent-light/20 text-wj-accent-dark rounded-full scroll-animate">
                  <span className="text-xs sm:text-sm font-semibold">{t('aboutWJCleanforce')}</span>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight scroll-animate">
                    {t('trustedPartnersExcellence')}
                  </h2>
                  <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed scroll-animate">
                    {t('aboutDescription')}
                  </p>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-start space-x-3 sm:space-x-4 scroll-animate">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-wj-dark">
                      <IconShield className="h-5 w-5 sm:h-6 sm:w-6 text-wj-dark" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1 sm:mb-2 text-base sm:text-lg">{t('experienceYears')}</h3>
                      <p className="text-sm sm:text-base text-gray-600">{t('experienceYearsDesc')}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 sm:space-x-4 scroll-animate">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-wj-dark">
                      <IconClock className="h-5 w-5 sm:h-6 sm:w-6 text-wj-dark" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1 sm:mb-2 text-base sm:text-lg">{t('personalizedSchedules')}</h3>
                      <p className="text-sm sm:text-base text-gray-600">{t('personalizedSchedulesDesc')}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 sm:space-x-4 scroll-animate">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-wj-dark">
                      <IconSparkles className="h-5 w-5 sm:h-6 sm:w-6 text-wj-dark" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1 sm:mb-2 text-base sm:text-lg">{t('extraHygiene')}</h3>
                      <p className="text-sm sm:text-base text-gray-600">{t('extraHygieneDesc')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - WJ Accent background with image and decorative elements */}
            <div className="bg-wj-accent-light/20 p-8 sm:p-12 lg:p-16 h-full flex flex-col justify-center relative scroll-animate-right">
              {/* Decorative sparkles */}
              <div className="absolute top-6 right-6 sm:top-8 sm:right-8">
                <div className="flex space-x-1 sm:space-x-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-wj-accent rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 bg-wj-accent-light rounded-full animate-pulse delay-100"></div>
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-wj-accent-dark rounded-full animate-pulse delay-200"></div>
                </div>
              </div>

              {/* Abstract accent blob */}
              <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-wj-accent/30 rounded-full blur-2xl opacity-50"></div>

              <div className="relative z-10">
                <img
                  src="/images/pexels-tima-miroshnichenko-6197122.jpg"
                  alt="Professional cleaning team Winfred and Jackie"
                  className="w-full h-auto rounded-xl sm:rounded-2xl shadow-2xl"
                />

                {/* Quote badge */}
                <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl border-2 border-wj-accent/20 before:absolute before:inset-0 before:rounded-xl before:sm:rounded-2xl before:border-2 before:border-wj-accent/40 before:content-[''] before:pointer-events-none">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 mb-1 sm:mb-2">"{t('excellenceInDetail')}"</p>
                  <p className="text-xs text-gray-600">- {t('foundersQuote')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Accent Background */}
      <section className="py-16 sm:py-20 lg:py-24 bg-wj-accent-light/10 relative overflow-hidden">

        
        {/* Blue decorative blob */}
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-wj-light/30 rounded-full blur-3xl opacity-20"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-wj-accent-light/20 text-wj-accent-dark rounded-full mb-6 scroll-animate">
              <span className="text-sm font-semibold">{t('howItWorks')}</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 scroll-animate">
              {t('simpleProcessOutstanding')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed scroll-animate">
              {t('howItWorksDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center scroll-animate">
              <div className="relative mb-4 sm:mb-6">
                <div className="w-full max-w-xs sm:max-w-sm aspect-[4/3] rounded-xl sm:rounded-2xl shadow-lg overflow-hidden bg-gray-50 mx-auto">
                  <img
                    src="/images/call.jpg"
                    alt="Get your quote - phone consultation"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 sm:w-12 sm:h-12 bg-white border-2 border-wj-dark rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-lg sm:text-xl font-bold text-wj-dark">1</span>
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-4">{t('getYourQuote')}</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed px-2 sm:px-0">
                {t('getYourQuoteDesc')}
              </p>
            </div>

            <div className="text-center scroll-animate">
              <div className="relative mb-4 sm:mb-6">
                <div className="w-full max-w-xs sm:max-w-sm aspect-[4/3] rounded-xl sm:rounded-2xl shadow-lg overflow-hidden bg-gray-50 mx-auto">
                  <img
                    src="/images/calendar.jpg"
                    alt="Schedule service - calendar planning"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 sm:w-12 sm:h-12 bg-white border-2 border-wj-dark rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-lg sm:text-xl font-bold text-wj-dark">2</span>
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-4">{t('scheduleService')}</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed px-2 sm:px-0">
                {t('scheduleServiceDesc')}
              </p>
            </div>

            <div className="text-center scroll-animate">
              <div className="relative mb-4 sm:mb-6">
                <div className="w-full max-w-xs sm:max-w-sm aspect-[4/3] rounded-xl sm:rounded-2xl shadow-lg overflow-hidden bg-gray-50 mx-auto">
                  <img
                    src="/images/clean.jpg"
                    alt="Enjoy clean spaces - professional cleaning results"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 sm:w-12 sm:h-12 bg-white border-2 border-wj-dark rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-lg sm:text-xl font-bold text-wj-dark">3</span>
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-4">{t('enjoyCleanSpaces')}</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed px-2 sm:px-0">
                {t('enjoyCleanSpacesDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - WJ Accent Background */}
      <section className="py-24 bg-wj-accent text-white relative overflow-hidden">
        {/* Blue decorative blob */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-wj-light rounded-full blur-3xl opacity-10"></div>

        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 scroll-animate">
              <span className="text-sm font-medium">{t('readyToGetStarted')}</span>
            </div>

            <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight scroll-animate">
              {t('experienceDifference')}
            </h2>

            <p className="text-xl text-wj-light mb-12 max-w-2xl mx-auto leading-relaxed scroll-animate">
              {t('ctaDescription')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16 scroll-animate">
              <Button
                size="lg"
                className="bg-white text-wj-dark hover:bg-wj-light/10 font-semibold text-base sm:text-lg px-6 sm:px-10 py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <IconPhone className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                {t('getFreeQuoteNow')}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-wj-dark bg-transparent font-semibold text-base sm:text-lg px-6 sm:px-10 py-3 sm:py-4 rounded-xl"
              >
                <IconMessage className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                {t('whatsappUs')}
              </Button>
            </div>

            <div className="flex justify-center scroll-animate">
              <div className="p-4 sm:p-6 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20">
                <div className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">100%</div>
                <div className="text-sm sm:text-base text-wj-light font-medium">{t('satisfactionGuaranteed')}</div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
