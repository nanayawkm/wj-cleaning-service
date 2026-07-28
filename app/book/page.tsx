import type { Metadata } from "next"
import Image from "next/image"
import { getAddons, getPricingBands } from "@/lib/booking/queries"
import { BookingFlow } from "./components/booking-flow"
import { BookAssurances, BookHeroCopy } from "./components/page-copy"

export const metadata: Metadata = {
  title: "Book a cleaning",
  description:
    "Book a general cleaning in Lelystad. Fixed prices by home size, pick your own time slot, confirmed by email.",
}

// Prices and availability change, so this must never be cached.
export const dynamic = "force-dynamic"

export default async function BookPage() {
  const [bands, addons] = await Promise.all([getPricingBands(), getAddons()])


  return (
    <div className="min-h-screen bg-white">
      {/* ------------------------------------------------------------- hero */}
      <section className="relative isolate overflow-hidden bg-wj-dark">
        <Image
          src="/images/booking-hero.webp"
          alt=""
          aria-hidden
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-[68%_center]"
        />

        {/*
          The scrim differs by width because the problem differs by width.

          On a phone the copy spans the whole viewport, so a left-to-right fade
          would run the last words onto bare image — measured 1.28:1 against the
          sofa before this split. Mobile therefore gets a near-even wash, with
          the picture reading as texture beneath it.

          From lg up the copy occupies the left half, so the fade can do its job:
          a linear pass for the bulk plus a radial pool under the type, which
          reaches the text without drawing a hard edge across the picture.

          Measured white-on-ground at the lightest pixel beneath the copy, text
          hidden so only the ground is sampled. Worst case across 360–1920 is
          5.97:1 at 1024px, where the fade and the copy width are closest to
          colliding; everything else sits between 9.6 and 10.2:1. All pass AA.
        */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(175deg,rgba(16,38,48,0.90)_0%,rgba(16,38,48,0.84)_55%,rgba(16,38,48,0.88)_100%)] lg:hidden"
        />
        <div
          aria-hidden
          className="absolute inset-0 hidden bg-[linear-gradient(100deg,rgba(18,42,52,0.90)_0%,rgba(18,42,52,0.84)_35%,rgba(18,42,52,0.66)_58%,rgba(18,42,52,0.28)_80%,rgba(18,42,52,0.02)_100%)] lg:block"
        />
        <div
          aria-hidden
          className="absolute inset-0 hidden bg-[radial-gradient(105%_95%_at_2%_50%,rgba(10,28,36,0.42)_0%,rgba(10,28,36,0.18)_42%,transparent_70%)] lg:block"
        />

        <div className="container relative z-10 mx-auto px-4 pb-14 pt-28 sm:px-6 sm:pb-20 sm:pt-36 md:px-8">
          <div className="max-w-xl">
            <BookHeroCopy />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- the flow */}
      <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-10 md:px-8">
        {/* Narrow on purpose. Four short questions do not need a 1280px canvas —
            a measured column keeps the eye on one decision at a time. */}
        <div className="mx-auto max-w-3xl">
          <BookingFlow catalogue={{ bands, addons }} />

          {/* Reassurance sits after the task, where it answers "what happens
              next" rather than competing with the question being asked. */}
          <BookAssurances />
        </div>
      </div>
    </div>
  )
}
