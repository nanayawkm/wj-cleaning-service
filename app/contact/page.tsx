"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { IconPhone, IconMail, IconMapPin, IconClock, IconShieldCheck, IconUsers, IconStar, IconAward, IconHeart, IconDroplet, IconSparkles, IconCheck, IconBuilding, IconHome, IconBriefcase, IconBuildingWarehouse, IconSend } from '@tabler/icons-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { CleaningBackground } from '@/components/cleaning-background'
import { CONTACT_DETAILS } from '@/components/constant'

export default function ContactPage() {
  const { t } = useLanguage()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-wj-light/10 via-white to-wj-accent-light/10">
      <CleaningBackground />
      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-wj-dark to-wj-accent text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-white/20 text-white mb-3 sm:mb-4 lg:mb-6 text-xs sm:text-sm">{t('contactUs')}</Badge>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold mb-4 sm:mb-6 lg:mb-8 leading-tight">
              {t('contactHeroTitle')}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-wj-light leading-relaxed px-2 sm:px-4">
              {t('contactHeroSubtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
        <CleaningBackground />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-start">
            {/* Contact Form */}
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              <div>
                <Badge className="bg-wj-light/20 text-wj-dark mb-2 sm:mb-3 lg:mb-4 text-xs sm:text-sm">{t('getInTouch')}</Badge>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6">
                  {t('sendMessage')}
                </h2>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
                  {t('sendMessageDesc')}
                </p>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 p-3 sm:p-4 lg:p-6 bg-wj-light/10 rounded-lg sm:rounded-xl lg:rounded-2xl">
                <IconShieldCheck className="h-8 w-8 sm:h-12 sm:w-12 lg:h-16 lg:w-16 text-wj-accent mx-auto mb-2 sm:mb-3 lg:mb-4" />
                <div>
                  <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">Quick Response Guaranteed</h3>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-600">We typically respond within 2-4 hours during business hours.</p>
                </div>
              </div>

              <form className="space-y-3 sm:space-y-4 lg:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="firstName" className="text-gray-700 font-medium text-xs sm:text-sm lg:text-base">
                      {t('name')} *
                    </Label>
                    <Input
                      id="firstName"
                      placeholder={t('name')}
                      className="border-gray-300 focus:border-wj-dark focus:ring-wj-dark/20 text-xs sm:text-sm lg:text-base"
                    />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="lastName" className="text-gray-700 font-medium text-xs sm:text-sm lg:text-base">
                      {t('name')} *
                    </Label>
                    <Input
                      id="lastName"
                      placeholder={t('name')}
                      className="border-gray-300 focus:border-wj-dark focus:ring-wj-dark/20 text-xs sm:text-sm lg:text-base"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium text-xs sm:text-sm lg:text-base">
                      {t('email')} *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('email')}
                      className="border-gray-300 focus:border-wj-dark focus:ring-wj-dark/20 text-xs sm:text-sm lg:text-base"
                    />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="phone" className="text-gray-700 font-medium text-xs sm:text-sm lg:text-base">
                      {t('phone')}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder={t('phone')}
                      className="border-gray-300 focus:border-wj-dark focus:ring-wj-dark/20 text-xs sm:text-sm lg:text-base"
                    />
                  </div>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="service" className="text-gray-700 font-medium text-xs sm:text-sm lg:text-base">
                    {t('serviceType')} *
                  </Label>
                  <select
                    id="service"
                    className="w-full px-3 sm:px-4 pr-8 sm:pr-10 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:border-wj-dark focus:ring-wj-dark/20 bg-white text-xs sm:text-sm lg:text-base"
                  >
                    <option value="">{t('selectService')}</option>
                    <option value="residential">{t('residentialCleaning')}</option>
                    <option value="office">{t('officeCleaning')}</option>
                    <option value="warehouse">{t('warehouseStaffing')}</option>
                    <option value="event">{t('eventStaffing')}</option>
                  </select>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="message" className="text-gray-700 font-medium text-xs sm:text-sm lg:text-base">
                    {t('message')} *
                  </Label>
                  <Textarea
                    id="message"
                    placeholder={t('messagePlaceholder')}
                    rows={4}
                    className="border-gray-300 focus:border-wj-dark focus:ring-wj-dark/20 text-xs sm:text-sm lg:text-base"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-wj-dark to-wj-accent hover:from-wj-darker hover:to-wj-accent-dark text-white font-semibold py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base lg:text-lg"
                >
                  <IconSend className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  {t('sendMessage')}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6 sm:space-y-8">
              <div className="mb-6 sm:mb-8">
                <div className="w-full h-24 sm:h-32 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden bg-white border-2 border-gray-100">
                  <img
                    src="/images/contact us.jpg"
                    alt="Contact us - professional cleaning service"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <Badge className="bg-wj-accent-light/20 text-wj-accent-dark mb-3 sm:mb-4">{t('contactInfo')}</Badge>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                  {t('getInTouch')}
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
                  {t('getInTouchDesc')}
                </p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-3 sm:space-x-4 p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-wj-dark">
                    <IconPhone className="h-5 w-5 sm:h-6 sm:w-6 text-wj-dark" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Phone</h3>
                    <p className="text-sm sm:text-base text-gray-600">{CONTACT_DETAILS.phone}</p>
                    <p className="text-xs sm:text-sm text-gray-500">Available 24/7 for emergencies</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 sm:space-x-4 p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-wj-accent">
                    <IconMail className="h-5 w-5 sm:h-6 sm:w-6 text-wj-accent" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Email</h3>
                    <p className="text-sm sm:text-base text-gray-600">{CONTACT_DETAILS.email}</p>
                    <p className="text-xs sm:text-sm text-gray-500">We respond within 2-4 hours</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 sm:space-x-4 p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-wj-accent">
                    <IconMapPin className="h-5 w-5 sm:h-6 sm:w-6 text-wj-accent" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Service Area</h3>
                    <p className="text-sm sm:text-base text-gray-600">{t('region')}</p>
                    <p className="text-xs sm:text-sm text-gray-500">Serving the greater metropolitan area</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 sm:space-x-4 p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-wj-dark">
                    <IconClock className="h-5 w-5 sm:h-6 sm:w-6 text-wj-dark" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Business Hours</h3>
                    <p className="text-sm sm:text-base text-gray-600">Monday - Friday: 8:00 AM - 6:00 PM</p>
                    <p className="text-xs sm:text-sm text-gray-500">Weekend appointments available</p>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 bg-gradient-to-r from-wj-dark to-wj-accent rounded-xl sm:rounded-2xl text-white">
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Need Immediate Assistance?</h3>
                <p className="text-sm sm:text-base text-wj-light mb-4 sm:mb-6">
                  For urgent cleaning or staffing needs, call us directly. We offer emergency services and can often
                  accommodate same-day requests.
                </p>
                <Button className="w-full bg-white text-wj-dark hover:bg-wj-light/10 justify-start text-sm sm:text-base">
                  <IconPhone className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Call Now: {CONTACT_DETAILS.phone}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-r from-wj-light/10 to-wj-accent-light/10 relative overflow-hidden">
        <CleaningBackground />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <Badge className="bg-wj-light/20 text-wj-dark mb-4">{t('frequentlyAskedQuestions')}</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t('commonQuestionsAnswered')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('faqDescription')}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">{t('whatAreasServe')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {t('whatAreasServeAnswer')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">{t('howQuicklyStart')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {t('howQuicklyStartAnswer')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">{t('staffInsuredBonded')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {t('staffInsuredBondedAnswer')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">{t('cleaningProducts')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {t('cleaningProductsAnswer')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">{t('provideSupplies')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {t('provideSuppliesAnswer')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">{t('satisfactionGuarantee')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {t('satisfactionGuaranteeAnswer')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-wj-dark to-wj-accent text-white relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-6xl font-bold mb-8">
              {t('readyToGetStarted')}
            </h2>
            <p className="text-xl text-wj-light mb-8 max-w-2xl mx-auto">
              {t('ctaDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                className="bg-white text-wj-dark hover:bg-wj-light/10 font-semibold"
              >
                <a href={`tel:${CONTACT_DETAILS.phone}`}>Call Now</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-wj-dark bg-transparent"
              >
                <a href={`mailto:${CONTACT_DETAILS.email}`}>{t('email')} Us</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
