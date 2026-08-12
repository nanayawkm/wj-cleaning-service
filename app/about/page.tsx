"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// Only what this page actually draws. Buildings, Certificate, Check, Drop,
// HouseLine, MapPin, ShieldCheck, Star, Users and Warehouse were all imported
// and never rendered — dead weight on a barrel import.
import { Broom, ChatCircleText, Clock, HandHeart, Handshake, Key, MagnifyingGlass, Sparkle, TrendUp } from "@phosphor-icons/react"
import { useLanguage } from '@/contexts/LanguageContext'
import { FeatureCard, TINTS, tintFor } from '@/components/feature-card'
import Image from 'next/image'
import Link from 'next/link'

export default function AboutPage() {
  const { t } = useLanguage()
  
  return (
    <div className="min-h-screen bg-wj-cream">
      {/* Hero Section */}
      <section className="relative pb-12 pt-28 sm:pb-16 sm:pt-36 lg:pb-20 lg:pt-40 xl:pb-24 bg-wj-dark text-white overflow-hidden">
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

      {/*
        Our Mission Section.

        Grounds on this page run dark → white → cream → white → dark, per §5.
        Mission moved onto white so Values can sit on cream: the FeatureCard
        grid below is a white card held by a wj-cream-deep hairline, and that
        border only does a job on cream (white on cream is 1.13:1 — the border
        is what holds the card edge). On a white section the card cannot lift
        at all and the border reads as a stray outline round nothing, which is
        the "row of plain outlined boxes" §4 exists to prevent.
      */}
      <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden border-b border-wj-cream-deep bg-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center">
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              <div>
                <Badge className="bg-wj-light/20 text-wj-dark mb-2 sm:mb-3 lg:mb-4 text-xs sm:text-sm">{t('ourMission')}</Badge>
                <h2 className="text-3xl sm:text-4xl tracking-tight text-gray-900 mb-4">
                  {t('deliveringExcellence')}
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {t('aboutDescription')}
                </p>
              </div>

              {/*
                Three identical white squares with a 2px teal outline, carrying
                Heart / ShieldCheck / Star — the three most-used glyphs in any
                stock template, drawn in the one chip treatment that reads as a
                default. §3 flags exactly this ("the values grid still uses
                generic glyphs"), and §4 flags the nine competing icon-chip
                recipes it belongs to.

                Two changes. The glyphs are the specific ones: HandHeart for
                personal care, Handshake for the lasting relationship the copy
                actually claims, and Sparkle from §3's cleaning-specific set for
                doing it properly. And the chip is now a filled brand block on
                the TINTS cycle shared with FeatureCard, so the three rows carry
                three different colours instead of one outline repeated — the
                same mechanism that stops the card grid below reading as boxes.

                Sizes also collapsed from three-step chains to the §2 cap: one
                44px chip (§4's touch floor), text-lg heading, text-base body.
                The body was text-xs at 12px, below anything else on the page.
              */}
              <div className="space-y-4 lg:space-y-6">
                {[
                  { Icon: HandHeart, title: t('customerCentricApproach'), body: t('customerCentricDesc') },
                  { Icon: Handshake, title: t('trustedReliable'), body: t('trustedReliableDesc') },
                  { Icon: Sparkle, title: t('excellenceInService'), body: t('excellenceInServiceDesc') },
                ].map((row, i) => {
                  const tint = TINTS[tintFor(i)]
                  return (
                    <div key={row.title} className="flex items-start gap-3 sm:gap-4">
                      <span
                        className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${tint.block}`}
                      >
                        <row.Icon weight="light" className={`h-6 w-6 ${tint.icon}`} />
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900">{row.title}</h3>
                        <p className="mt-1 text-base leading-relaxed text-gray-600">{row.body}</p>
                      </div>
                    </div>
                  )
                })}
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
                  style={{ height: "auto" }}
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

      {/* Values Section — cream ground, so the FeatureCard borders hold an edge */}
      <section className="py-24 relative overflow-hidden">
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

          {/*
            Glyphs picked from what each value actually claims, not from the
            stock set (§3). Heart / ShieldCheck / Star / Users / Certificate is
            the same five any template ships with, and they were doing no work
            beyond filling the tinted block.

              Broom            — the craft itself, for dedication to the task
              Key              — what trust concretely means to someone letting
                                 a cleaner into their home. More specific than a
                                 shield, and §7's "specific beats superlative"
                                 applies to pictures as much as to copy
              Clock            — kept; "On time" is literal, so the literal
                                 glyph is the right one
              MagnifyingGlass  — quality control is the inspection pass, which
                                 is what the copy describes
              ChatCircleText   — "responsive support" is a conversation
              TrendUp          — growth, drawn as growth rather than as a
                                 certificate nobody has been shown

            None repeat the mission block above (HandHeart, Handshake, Sparkle),
            so the page does not use the same picture twice in two sections.
          */}
          <div className="scroll-stagger grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { Icon: Broom, title: t('passionForExcellence'), description: t('passionForExcellenceDesc') },
              { Icon: Key, title: t('trustReliabilityTitle'), description: t('trustReliabilityDesc') },
              { Icon: Clock, title: t('timelyServiceTitle'), description: t('timelyServiceDesc') },
              { Icon: MagnifyingGlass, title: t('qualityAssuranceTitle'), description: t('qualityAssuranceDesc') },
              { Icon: ChatCircleText, title: t('customerFocusTitle'), description: t('customerFocusDesc') },
              { Icon: TrendUp, title: t('continuousGrowthTitle'), description: t('continuousGrowthDesc') },
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

      {/* Gallery Section — white is fine here: these cards open with a
          photograph, so the image carries the edge rather than the hairline */}
      <section className="py-24 border-y border-wj-cream-deep bg-white relative overflow-hidden">
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
              {/*
                `asChild` is load-bearing, not decoration. Without it Button
                renders a real <button> and the Link becomes an <a> nested
                inside it — interactive content inside a button, which is
                invalid HTML and which §9 already records as a rule ("a button
                may not wrap an anchor"). It also left the anchor outside the
                size variant, so this CTA measured 24px tall against the 44px
                floor while its `asChild` sibling on the same row measured 48.
              */}
              <Button asChild size="lg" variant="onDarkOutline">
                <Link href="/services">{t('viewOurServices')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
