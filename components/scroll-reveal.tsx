"use client"

import { useEffect } from "react"

/**
 * Scroll-reveal, done so it cannot hide content.
 *
 * The previous version was an inline script in the document head that ran once,
 * queried `.scroll-animate` and observed whatever existed at that moment. Two
 * ways that failed:
 *
 *   1. It ran before React had rendered the page, so it observed nothing, set
 *      an `isInitialized` flag and never tried again — leaving every animated
 *      element stuck at `opacity: 0`.
 *   2. Anything mounted later (the services tab switch) was never observed, so
 *      those cards stayed invisible for good.
 *
 * Because the CSS defaulted to hidden, either failure meant the content was
 * simply gone. Now the CSS defaults to *visible* and this component opts in by
 * setting `data-reveal` on <html>; if the JS never runs, everything still
 * shows. A MutationObserver picks up nodes React mounts later.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) return

    // Only now does the CSS start hiding un-revealed elements.
    root.setAttribute("data-reveal", "on")

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add("scroll-animate-in")
          io.unobserve(entry.target)
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -40px 0px" },
    )

    const observe = (scope: ParentNode) => {
      for (const el of scope.querySelectorAll(".scroll-animate, .scroll-animate-right")) {
        if (!el.classList.contains("scroll-animate-in")) io.observe(el)
      }
    }

    observe(document)

    // Anything React mounts after this point (tab switches, route changes).
    const mo = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue
          const el = node as Element
          if (el.matches?.(".scroll-animate, .scroll-animate-right")) io.observe(el)
          observe(el)
        }
      }
    })
    mo.observe(document.body, { childList: true, subtree: true })

    // Belt and braces: anything still unrevealed after 3s is shown regardless,
    // so a missed observation can never cost the user content.
    const failsafe = window.setTimeout(() => {
      document
        .querySelectorAll(".scroll-animate, .scroll-animate-right")
        .forEach((el) => el.classList.add("scroll-animate-in"))
    }, 3000)

    return () => {
      io.disconnect()
      mo.disconnect()
      window.clearTimeout(failsafe)
      root.removeAttribute("data-reveal")
    }
  }, [])

  return null
}
