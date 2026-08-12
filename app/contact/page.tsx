"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
// Only what this page draws. Twelve of the eighteen names here were imported
// and never rendered.
import { Clock, Envelope, MapPin, Phone, ShieldCheck, WhatsappLogo } from "@phosphor-icons/react"
import { useLanguage } from '@/contexts/LanguageContext'
import { TINTS, tintFor } from '@/components/feature-card'
import { ContactForm } from './contact-form'
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
                <h2 className="scroll-animate text-3xl sm:text-4xl tracking-tight text-gray-900 mb-4">
                  {t('sendMessage')}
                </h2>
                {/* §2 caps heading and body chains at two steps. This was
                    text-sm → base → lg → xl, four sizes for one paragraph. */}
                <p className="scroll-animate text-lg text-gray-600 leading-relaxed">
                  {t('sendMessageDesc')}
                </p>
              </div>

              {/* Icon takes the TINTS pairing rather than a bare wj-accent
                  glyph on a tint — see §3. Body text was text-xs (12px). */}
              <div className="flex items-center gap-4 rounded-xl bg-wj-light/10 p-4 sm:p-6">
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-wj-dark">
                  <ShieldCheck weight="light" className="h-6 w-6 text-white" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{t('quickResponseGuaranteed')}</h3>
                  <p className="text-base leading-relaxed text-gray-600">{t('quickResponseDesc')}</p>
                </div>
              </div>

              <ContactForm />


              {/* WhatsApp Option */}
              <div className="mt-4 sm:mt-6">
                <div className="text-center">
                  <p className="mb-4 text-base text-gray-600">{t('or')}</p>
                  {/*
                    A real anchor, not `onClick={window.open}` on a button. That
                    version was popup-blockable, could not be middle-clicked or
                    opened in a new tab, and gave the keyboard a button that
                    behaved like a link. Sizing comes from the `lg` variant
                    rather than a hand-written py/text chain; the green stays,
                    because it is WhatsApp's mark rather than an invented colour.
                  */}
                  <Button asChild size="lg" className="w-full bg-green-600 font-semibold hover:bg-green-700">
                    <a href={`https://wa.me/${CONTACT_DETAILS.phoneWa}`} target="_blank" rel="noopener noreferrer">
                      <WhatsappLogo className="mr-2 h-5 w-5" />
                      {t('whatsapp')} {t('us')}
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6 sm:space-y-8">
              <div className="mb-6 sm:mb-8">
                {/* §5: aspect ratio, not h-24/h-32 — a 24px-tall strip on a phone. */}
                <div className="w-full aspect-[16/5] rounded-xl overflow-hidden bg-white border border-gray-200">
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
                <h2 className="scroll-animate text-3xl sm:text-4xl tracking-tight text-gray-900 mb-4">
                  {t('getInTouch')}
                </h2>
                <p className="scroll-animate text-lg text-gray-600 leading-relaxed">
                  {t('getInTouchDesc')}
                </p>
              </div>

              {/*
                Four hand-written copies of one card, with the chip border
                alternating wj-dark / wj-accent for no semantic reason — the
                exact pattern §4 names. Now one recipe on the TINTS cycle, so
                the colour means "next in the sequence" rather than nothing.

                The phone and email rows are also links now. They were plain
                text, so the two details a visitor most wants to act on were
                the two they had to copy out by hand — a dead end of the kind
                §9 bans in the dashboard and this page kept by oversight.
              */}
              <ul className="scroll-stagger space-y-4">
                {[
                  { Icon: Phone, title: t('phone'), value: CONTACT_DETAILS.phone, href: `tel:${CONTACT_DETAILS.phoneTel}` },
                  { Icon: Envelope, title: t('email'), value: CONTACT_DETAILS.email, note: t('weRespondWithin'), href: `mailto:${CONTACT_DETAILS.email}` },
                  { Icon: MapPin, title: t('serviceArea'), value: t('region'), note: t('servingGreaterMetro') },
                  { Icon: Clock, title: t('businessHours'), value: t('mondayFriday'), note: t('weekendAppointments') },
                ].map((row, i) => {
                  const tint = TINTS[tintFor(i)]
                  const body = (
                    <>
                      <span className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${tint.block}`}>
                        <row.Icon weight="light" className={`h-6 w-6 ${tint.icon}`} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-lg font-semibold text-gray-900">{row.title}</span>
                        <span className="block break-words text-base text-gray-600">{row.value}</span>
                        {row.note ? <span className="mt-0.5 block text-sm text-gray-500">{row.note}</span> : null}
                      </span>
                    </>
                  )
                  const shell = "flex items-center gap-4 rounded-xl border border-wj-cream-deep bg-white p-4 sm:p-6"
                  return (
                    <li key={row.title} className="scroll-animate">
                      {row.href ? (
                        <a href={row.href} className={`${shell} transition-colors hover:border-wj-dark`}>
                          {body}
                        </a>
                      ) : (
                        <div className={shell}>{body}</div>
                      )}
                    </li>
                  )
                })}
              </ul>

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
            <h2 className="scroll-animate text-3xl sm:text-4xl tracking-tight text-gray-900 mb-4">
              {t('commonQuestionsAnswered')}
            </h2>
            <p className="scroll-animate text-lg text-gray-600 leading-relaxed">
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
