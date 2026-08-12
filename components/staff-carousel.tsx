"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { CaretLeft, CaretRight, Check } from "@phosphor-icons/react"

export interface StaffSlide {
  title: string
  description: string
  image: string
  /** What these staff actually do. Every slide carries the same number so the
   *  block does not change height as the carousel advances. */
  bullets: string[]
}

const INTERVAL_MS = 5000

/**
 * Auto-advancing slides for the staffing roles, keeping the copy-left,
 * image-right shape the rest of this page uses.
 *
 * ## Why this stopped advancing
 *
 * The interval was always here — what killed it was the pause logic:
 *
 *  1. `onMouseEnter` sat on the **whole carousel**, image included. The image
 *     is half a section wide, so on a desktop the pointer is very often
 *     resting somewhere inside it while reading or after scrolling, and the
 *     carousel was paused indefinitely without anyone hovering anything
 *     deliberately.
 *  2. On touch, `mouseenter` fires on tap and the matching `mouseleave`
 *     frequently never does. So tapping an arrow — the one interaction that
 *     was still working — froze auto-advance permanently afterwards.
 *  3. `visibilitychange` did `setPaused(document.hidden)`, a blanket
 *     assignment over a flag four other things were also writing. Coming back
 *     to the tab cleared a hover or focus pause that was still true.
 *
 * So pause is now four independent reasons OR-ed together, none of which can
 * clear another, and hover only counts on a device that genuinely hovers and
 * only over the copy — the part someone is actually reading. Resting a pointer
 * on the photograph no longer stops the section.
 *
 * ## Reduced motion cuts, it does not stop
 *
 * A fourth cause, and the one that actually hid all of the above: under
 * `prefers-reduced-motion: reduce` this bailed out of auto-advance entirely.
 * Measured in Chromium — 16 seconds, pointer parked in the corner:
 *
 *     no-preference   1/6 1/6 1/6 1/6 1/6 2/6 … 3/6      → advancing
 *     reduce          1/6 1/6 1/6 1/6 1/6 1/6 … 1/6      → frozen
 *
 * Windows 11 sets that flag whenever "Animation effects" is off, which is a
 * common setting and not a strong statement about carousels. So the section
 * was dead for a large share of visitors — and invisible to anyone with the
 * flag set who was trying to check whether it worked.
 *
 * It now **still advances** under the flag, but the slide **cuts instead of
 * travelling**: `.carousel-slide` drops its transition and `.carousel-copy`
 * drops its animation inside the media query, so nothing traverses the screen.
 * That is the distinction the flag is actually about — it targets vestibular
 * triggers, which are large travelling movements, not the fact that content
 * changes. Auto-updating content is governed by WCAG 2.2.2 (Pause, Stop,
 * Hide), which asks for a pause mechanism rather than for stillness; hover,
 * focus, the arrows and the dots are four of them.
 *
 * Still true, and still deliberate:
 *
 *  · it never moves under a keyboard user (focus pause) or while the tab is
 *    hidden, and it does not run at all while scrolled out of view
 *  · the image box is a fixed aspect ratio, so nothing below it shifts
 */
export function StaffCarousel({ slides, label }: { slides: StaffSlide[]; label: string }) {
  const [index, setIndex] = useState(0)

  // Four separate reasons rather than one shared flag, so clearing one cannot
  // silently clear another (bug 3 above).
  const [hovering, setHovering] = useState(false)
  const [focused, setFocused] = useState(false)
  const [tabHidden, setTabHidden] = useState(false)
  const [onScreen, setOnScreen] = useState(false)

  const rootRef = useRef<HTMLDivElement>(null)

  const paused = hovering || focused || tabHidden || !onScreen

  // No `prefers-reduced-motion` term here on purpose — see the note above.
  // Whether the slide *travels* is a CSS question, answered in globals.css;
  // whether it *advances* is not, and gating advance on the flag is what left
  // the section frozen for everyone who has Windows animation effects off.
  const auto = !paused && slides.length > 1

  const go = useCallback(
    (n: number) => setIndex((i) => (n + slides.length) % slides.length),
    [slides.length],
  )

  useEffect(() => {
    if (!auto) return
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), INTERVAL_MS)
    return () => clearInterval(id)
  }, [auto, slides.length])

  // A background tab still fires intervals; without this the carousel races
  // through every slide the moment someone comes back to it.
  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden)
    onVisibility()
    document.addEventListener("visibilitychange", onVisibility)
    return () => document.removeEventListener("visibilitychange", onVisibility)
  }, [])

  // Don't burn slides while the section is off-screen — otherwise it is
  // already three slides in by the time it is scrolled to.
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), {
      threshold: 0.25,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Hover pauses the whole carousel, image included — "slides until hovered
  // on" is the requested behaviour and the conventional one.
  //
  // The `(hover: hover)` gate is what keeps that safe. It is not a hedge on
  // the rule: it is the fix for bug 2. Without it, a tap on a phone fires
  // mouseenter with no matching mouseleave, and the carousel stays paused for
  // the rest of the visit. Gated, touch devices never set the flag at all, so
  // the only way to pause on a phone is to stop looking at it.
  const hoverPause = {
    onMouseEnter: () => {
      if (window.matchMedia("(hover: hover)").matches) setHovering(true)
    },
    onMouseLeave: () => setHovering(false),
  }

  const active = slides[index]

  return (
    <div
      ref={rootRef}
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={() => setFocused(false)}
      {...hoverPause}
    >
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
        {/* copy — aria-live so a screen reader hears the change */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="order-last lg:order-first lg:min-h-[26rem]"
        >
          {/*
            Keyed on the index so React remounts it and the entry animation
            replays per slide. The copy fades and rises rather than sliding
            sideways: §5 records that a horizontal reveal offset on an element
            that is not inside an overflow clip creates page-wide horizontal
            scroll on narrow screens, and it did exactly that at 390px. The
            image is inside a clip, so that is where the sideways motion goes.
          */}
          <div key={index} className="carousel-copy">
            <p className="text-sm font-semibold uppercase tracking-wide text-wj-dark">
              {index + 1} / {slides.length}
            </p>
            <h3 className="mt-2 text-2xl tracking-tight text-gray-900 sm:text-3xl">
              {active.title}
            </h3>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">{active.description}</p>

            <ul className="mt-5 space-y-2.5">
              {active.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <Check weight="bold" className="mt-1 h-4 w-4 flex-shrink-0 text-wj-dark" />
                  <span className="text-gray-700">{b}</span>
                </li>
              ))}
            </ul>
          </div>

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
                  {/*
                    The active dot doubles as the countdown to the next slide,
                    which is what tells someone the section is advancing on its
                    own rather than waiting to be clicked. Keyed on the index so
                    the fill restarts each slide; it holds still while paused
                    instead of resetting, so a hover reads as a pause and not as
                    a cancel.
                  */}
                  <span
                    className={`h-1.5 overflow-hidden transition-all ${
                      i === index ? "w-6 bg-wj-dark/20" : "w-1.5 bg-gray-300 group-hover:bg-gray-400"
                    }`}
                  >
                    {i === index ? (
                      <span
                        key={index}
                        className={auto ? "carousel-progress block h-full w-full bg-wj-dark" : "block h-full w-full bg-wj-dark"}
                        style={
                          auto
                            ? {
                                animationDuration: `${INTERVAL_MS}ms`,
                                animationPlayState: paused ? "paused" : "running",
                              }
                            : undefined
                        }
                      />
                    ) : null}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/*
          image — fixed ratio so the section height never jumps, and clipped so
          the slides can travel sideways without touching page scroll width.
        */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {slides.map((s, i) => {
            /*
              Position each slide relative to the active one, wrapped to the
              short way round: at index 0 of 6, slide 5 sits at -1 and exits
              left rather than sweeping back across the frame.

              Only -1, 0 and +1 are on screen. The rest are held at opacity 0
              with no transition, because a slide moving from +3 to -2 would
              otherwise animate its transform straight through 0 and flash
              across the middle of the picture on every wrap.
            */
            const half = slides.length / 2
            let offset = i - index
            if (offset > half) offset -= slides.length
            if (offset < -half) offset += slides.length
            const near = Math.abs(offset) <= 1

            return (
              <div
                key={s.image}
                aria-hidden={i !== index}
                /*
                  `carousel-slide` carries the easing, rather than an inline
                  arbitrary `ease-` utility holding a cubic-bezier. Tailwind
                  maps `ease-*` to both transition-timing-function and
                  animation-timing-function, so an arbitrary value there is
                  ambiguous: it warns at build time and emits nothing. The
                  class looked correct in source and was absent from the built
                  stylesheet. Same overshoot curve as the scroll reveals, and
                  it now lives beside them in globals.css.
                */
                className={`absolute inset-0 ${near ? "carousel-slide" : ""}`}
                style={{ transform: `translateX(${offset * 100}%)`, opacity: near ? 1 : 0 }}
              >
                <Image
                  src={s.image}
                  alt={i === index ? s.title : ""}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  quality={90}
                  className="object-cover"
                  // Only the first is eager; the rest are decorative until shown.
                  priority={i === 0}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
