"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { CaretLeft, CaretRight } from "@phosphor-icons/react"

export interface StaffSlide {
  title: string
  description: string
  image: string
}

const INTERVAL_MS = 6000

/**
 * Auto-advancing slides for the staffing roles, keeping the copy-left,
 * image-right shape the rest of this page uses.
 *
 * Three rules it has to obey to not be annoying:
 *
 *  · it stops on hover, on focus and while the tab is hidden, so it never
 *    moves under someone who is reading or tabbing through it
 *  · it does not auto-advance at all when the visitor has asked for reduced
 *    motion
 *  · the image box is a fixed aspect ratio, so nothing below it shifts as
 *    slides change
 */
export function StaffCarousel({ slides, label }: { slides: StaffSlide[]; label: string }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduced = useRef(false)

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  }, [])

  const go = useCallback(
    (n: number) => setIndex((i) => (n + slides.length) % slides.length),
    [slides.length],
  )

  useEffect(() => {
    if (paused || reduced.current || slides.length < 2) return
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), INTERVAL_MS)
    return () => clearInterval(id)
  }, [paused, slides.length])

  // A background tab still fires intervals; without this the carousel races
  // through every slide the moment someone comes back to it.
  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden)
    document.addEventListener("visibilitychange", onVisibility)
    return () => document.removeEventListener("visibilitychange", onVisibility)
  }, [])

  const active = slides[index]

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
        {/* copy — aria-live so a screen reader hears the change */}
        <div aria-live="polite" aria-atomic="true" className="order-last lg:order-first">
          <p className="text-sm font-semibold uppercase tracking-wide text-wj-dark">
            {index + 1} / {slides.length}
          </p>
          <h3 className="mt-2 text-2xl tracking-tight text-gray-900 sm:text-3xl">{active.title}</h3>
          <p className="mt-4 text-lg leading-relaxed text-gray-600">{active.description}</p>

          <div className="mt-7 flex items-center gap-3">
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous"
              className="flex h-11 w-11 items-center justify-center border border-gray-300 bg-white text-gray-700 transition-colors hover:border-wj-dark hover:text-wj-dark"
            >
              <CaretLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next"
              className="flex h-11 w-11 items-center justify-center border border-gray-300 bg-white text-gray-700 transition-colors hover:border-wj-dark hover:text-wj-dark"
            >
              <CaretRight className="h-4 w-4" />
            </button>

            <div className="ml-2 flex gap-1.5">
              {slides.map((s, i) => (
                <button
                  key={s.title}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={s.title}
                  aria-current={i === index ? "true" : undefined}
                  className="group flex h-11 w-4 items-center justify-center"
                >
                  <span
                    className={`h-1.5 transition-all ${
                      i === index ? "w-6 bg-wj-dark" : "w-1.5 bg-gray-300 group-hover:bg-gray-400"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* image — fixed ratio so the section height never jumps */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {slides.map((s, i) => (
            <Image
              key={s.image}
              src={s.image}
              alt={s.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={90}
              className={`object-cover transition-opacity duration-700 ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
              // Only the first is eager; the rest are decorative until shown.
              priority={i === 0}
              aria-hidden={i !== index}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
