"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Buildings, CaretDown, Certificate, Check, Clock, Drop, Envelope, Heart, HouseLine, MapPin, PaperPlaneTilt, Phone, ShieldCheck, Sparkle, Star, Users, Warehouse, WhatsappLogo } from "@phosphor-icons/react"
import { useLanguage } from '@/contexts/LanguageContext'
import Image from 'next/image'
import { CONTACT_DETAILS } from '@/components/constant'

export default function ContactPage() {
  const { t } = useLanguage()
  
  return (
    <div className="min-h-screen bg-wj-cream">
      {/* Hero Section */}
      <section className="pb-12 pt-28 sm:pb-16 sm:pt-36 lg:pb-20 lg:pt-40 bg-wj-dark text-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="max-w-3xl">
            <Badge className="bg-white/20 text-white mb-3 sm:mb-4 lg:mb-6 text-xs sm:text-sm">{t('contactUs')}</Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl tracking-tight mb-4 leading-tight">
              {t('contactHeroTitle')}
            </h1>
            <p className="text-lg text-white/85 leading-relaxed max-w-2xl">
              {t('contactHeroSubtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-start [&>*]:min-w-0">
            {/* Contact Form */}
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              <div>
                <Badge className="bg-wj-light/20 text-wj-dark mb-2 sm:mb-3 lg:mb-4 text-xs sm:text-sm">{t('getInTouch')}</Badge>
                <h2 className="text-3xl sm:text-4xl tracking-tight text-gray-900 mb-4">
                  {t('sendMessage')}
                </h2>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
                  {t('sendMessageDesc')}
                </p>
              </div>

                             <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 p-3 sm:p-4 lg:p-6 bg-wj-light/10 rounded-xl">
                 <ShieldCheck className="h-8 w-8 flex-shrink-0 text-wj-accent" />
                 <div>
                   <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">{t('quickResponseGuaranteed')}</h3>
                   <p className="text-xs sm:text-sm lg:text-base text-gray-600">{t('quickResponseDesc')}</p>
                 </div>
               </div>

              <form className="space-y-3 sm:space-y-4 lg:space-y-6">
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="fullName" className="text-gray-700 font-medium text-sm">
                    {t('fullName')} *
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    autoComplete="name"
                    placeholder={t('fullNamePlaceholder')}
                    className="border-gray-300 bg-white focus:border-wj-dark focus:ring-wj-dark/20"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium text-sm">
                      {t('email')} *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder={t('email')}
                      className="border-gray-300 bg-white focus:border-wj-dark focus:ring-wj-dark/20"
                    />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="phone" className="text-gray-700 font-medium text-sm">
                      {t('phone')}
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder={t('phone')}
                      className="border-gray-300 bg-white focus:border-wj-dark focus:ring-wj-dark/20"
                    />
                  </div>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="service" className="text-gray-700 font-medium text-sm">
                    {t('serviceType')} *
                  </Label>
                  {/*
                    pr-10 reserved room for an arrow that was never drawn, so
                    the browser's own arrow sat past the gap and looked
                    detached. appearance-none removes the native one; ours is
                    positioned against that same padding.
                  */}
                  <div className="relative">
                  <select
                    id="service"
                    name="service"
                    className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 pr-10 text-base focus:border-wj-dark focus:ring-wj-dark/20"
                  >
                    <option value="">{t('selectService')}</option>
                                         {/* Cleaning Services */}
                     <optgroup label={t('cleaningServices')}>
                       <option value="residential">{t('residentialCleaning')}</option>
                       <option value="office">{t('officeCleaning')}</option>
                       <option value="warehouse-cleaning">{t('warehouseCleaning')}</option>
                       <option value="restaurant-cleaning">{t('restaurantCleaning')}</option>
                       <option value="hotel-cleaning">{t('hotelCleaning')}</option>
                       <option value="school-cleaning">{t('schoolCleaning')}</option>
                     </optgroup>
                    {/* Staffing Services */}
                    <optgroup label={t('staffingServices')}>
                      <option value="warehouse">{t('warehouseStaffing')}</option>
                      <option value="event">{t('eventStaffing')}</option>
                      <option value="office-support">{t('officeSupportStaff')}</option>
                      <option value="restaurant-cafe">{t('restaurantCafePersonnel')}</option>
                      <option value="hotel">{t('hotelStaff')}</option>
                      <option value="school">{t('schoolSupportStaff')}</option>
                    </optgroup>
                  </select>
                  <CaretDown
                    aria-hidden
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
                  />
                  </div>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="message" className="text-gray-700 font-medium text-sm">
                    {t('message')} *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder={t('messagePlaceholder')}
                    rows={4}
                    className="border-gray-300 bg-white focus:border-wj-dark focus:ring-wj-dark/20"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg" className="w-full"
                >
                  <PaperPlaneTilt className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  {t('sendMessage')}
                </Button>
              </form>

              {/* WhatsApp Option */}
              <div className="mt-4 sm:mt-6">
                <div className="text-center">
                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">{t('or')}</p>
                  <Button
                    onClick={() => window.open(`https://wa.me/${CONTACT_DETAILS.phoneWa}`)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 sm:py-4 rounded-lg text-sm sm:text-base lg:text-lg"
                  >
                    <WhatsappLogo className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    {t('whatsapp')} {t('us')}
                  </Button>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6 sm:space-y-8">
              <div className="mb-6 sm:mb-8">
                <div className="w-full h-24 sm:h-32 rounded-xl overflow-hidden bg-white border border-gray-200">
                  <Image
                    src="/images/contact-us.webp"
                    alt={t('contactUsProfessionalCleaning')}
                    width={800}
                    height={200}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <Badge className="bg-wj-accent-light/20 text-wj-accent-dark mb-3 sm:mb-4">{t('contactInfo')}</Badge>
                <h2 className="text-3xl sm:text-4xl tracking-tight text-gray-900 mb-4">
                  {t('getInTouch')}
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
                  {t('getInTouchDesc')}
                </p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-3 sm:space-x-4 p-4 sm:p-6 bg-white rounded-xl border border-wj-cream-deep">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-wj-dark">
                    <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-wj-dark" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">{t('phone')}</h3>
                    <p className="text-sm sm:text-base text-gray-600">{CONTACT_DETAILS.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 sm:space-x-4 p-4 sm:p-6 bg-white rounded-xl border border-wj-cream-deep">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-wj-accent">
                    <Envelope className="h-5 w-5 sm:h-6 sm:w-6 text-wj-accent" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">{t('email')}</h3>
                    <p className="text-sm sm:text-base text-gray-600">{CONTACT_DETAILS.email}</p>
                    <p className="text-xs sm:text-sm text-gray-500">{t('weRespondWithin')}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 sm:space-x-4 p-4 sm:p-6 bg-white rounded-xl border border-wj-cream-deep">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-wj-accent">
                    <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-wj-accent" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">{t('serviceArea')}</h3>
                    <p className="text-sm sm:text-base text-gray-600">{t('region')}</p>
                    <p className="text-xs sm:text-sm text-gray-500">{t('servingGreaterMetro')}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 sm:space-x-4 p-4 sm:p-6 bg-white rounded-xl border border-wj-cream-deep">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-wj-dark">
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-wj-dark" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">{t('businessHours')}</h3>
                    <p className="text-sm sm:text-base text-gray-600">{t('mondayFriday')}</p>
                    <p className="text-xs sm:text-sm text-gray-500">{t('weekendAppointments')}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 bg-wj-dark rounded-xl text-white">
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{t('needImmediateAssistance')}</h3>
                <p className="text-sm sm:text-base text-white/85 mb-4 sm:mb-6">
                  {t('immediateAssistanceDesc')}
                </p>
                <Button asChild variant="onDark" className="w-full justify-start">
                  <a href={`tel:${CONTACT_DETAILS.phoneTel}`}>
                    <Phone className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    {t('callNow')}: {CONTACT_DETAILS.phone}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="max-w-2xl mb-12">
            <Badge className="bg-wj-light/20 text-wj-dark mb-4">{t('frequentlyAskedQuestions')}</Badge>
            <h2 className="text-3xl sm:text-4xl tracking-tight text-gray-900 mb-4">
              {t('commonQuestionsAnswered')}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t('faqDescription')}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="border border-wj-cream-deep rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">{t('whatAreasServe')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {t('whatAreasServeAnswer')}
                </p>
              </CardContent>
            </Card>



            <Card className="border border-wj-cream-deep rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">{t('staffInsuredBonded')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {t('staffInsuredBondedAnswer')}
                </p>
              </CardContent>
            </Card>

            <Card className="border border-wj-cream-deep rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">{t('cleaningProducts')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {t('cleaningProductsAnswer')}
                </p>
              </CardContent>
            </Card>

            <Card className="border border-wj-cream-deep rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">{t('schedulingFlexibility')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {t('schedulingFlexibilityAnswer')}
                </p>
              </CardContent>
            </Card>

            <Card className="border border-wj-cream-deep rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">{t('emergencyServices')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {t('emergencyServicesAnswer')}
                </p>
              </CardContent>
            </Card>

            <Card className="border border-wj-cream-deep rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">{t('qualityGuarantee')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {t('qualityGuaranteeAnswer')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-wj-dark text-white relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl tracking-tight mb-4">
              {t('readyToGetStarted')}
            </h2>
            <p className="text-lg text-white/85 mb-8 max-w-2xl">
              {t('ctaDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="lg" variant="onDark">
                <a href={`tel:${CONTACT_DETAILS.phoneTel}`}>{t('callNow')}</a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="onDarkOutline"
              >
                <a href={`mailto:${CONTACT_DETAILS.email}`}>{t('emailUs')}</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
