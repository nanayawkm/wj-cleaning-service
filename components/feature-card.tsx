import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import type { Icon as PhosphorIcon } from "@phosphor-icons/react"

/**
 * The one card used across the site.
 *
 * Anatomy, three bands:
 *   1. Header — a flat brand-tinted block with a large icon, or a photograph
 *   2. Body   — title and description on white
 *   3. Footer — optional action, separated by a rule
 *
 * The header band is what stops a grid of these reading as a row of plain
 * boxes: it gives each card a block of colour or image before any text, so the
 * grid has rhythm rather than being six identical outlines.
 */

export type CardTint = "dark" | "accent" | "light" | "lighter" | "cream"

/**
 * Icon colour is paired to the tint so it always clears 4.5:1.
 *
 * Exported because the tint pairing is the site's icon-chip rule, not this
 * component's private detail — anything drawing an icon on a brand block reads
 * it from here rather than re-deciding which foreground clears which tint.
 */
export const TINTS: Record<CardTint, { block: string; icon: string }> = {
  dark: { block: "bg-wj-dark", icon: "text-white" },
  accent: { block: "bg-wj-accent", icon: "text-white" },
  light: { block: "bg-wj-light", icon: "text-wj-darker" },
  lighter: { block: "bg-wj-lighter", icon: "text-wj-darker" },
  cream: { block: "bg-wj-cream-deep", icon: "text-wj-dark" },
}

/** Cycles tints across a grid so neighbours never repeat. */
export const tintFor = (index: number): CardTint =>
  (["dark", "light", "accent", "cream", "lighter"] as const)[index % 5]

interface FeatureCardProps {
  title: string
  description: string
  /** Flat colour header with an icon. Ignored when `image` is set. */
  Icon?: PhosphorIcon
  tint?: CardTint
  /** Photographic header, used instead of the colour block. */
  image?: string
  imageAlt?: string
  /**
   * How wide the card renders, for `next/image` to pick a candidate from.
   * Getting this wrong is why the homepage cards looked soft: they sit 2-up,
   * so they need 50vw, not the 33vw a 3-up grid would want.
   */
  sizes?: string
  /** Footer action. Omit for a card that is not a link. */
  href?: string
  actionLabel?: string
  className?: string
}

export function FeatureCard({
  title,
  description,
  Icon,
  tint = "dark",
  image,
  imageAlt,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  href,
  actionLabel,
  className = "",
}: FeatureCardProps) {
  const t = TINTS[tint]

  const body = (
    <>
      {image ? (
        <div className="relative aspect-[16/10] overflow-hidden bg-wj-cream-deep">
          <Image
            src={image}
            alt={imageAlt ?? title}
            fill
            sizes={sizes}
            quality={90}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      ) : (
        <div className={`flex aspect-[16/10] items-center justify-center ${t.block}`}>
          {Icon ? <Icon weight="light" className={`h-14 w-14 ${t.icon}`} /> : null}
        </div>
      )}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-lg tracking-tight text-gray-900">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">{description}</p>
      </div>

      {href && actionLabel ? (
        <div className="border-t border-wj-cream-deep px-5 py-3.5 sm:px-6">
          <span className="inline-flex items-center text-sm font-semibold text-wj-dark">
            {actionLabel}
            <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      ) : null}
    </>
  )

  // scroll-animate so cards reveal with the rest of the page; the grid wrapper
  // adds the stagger so a row cascades rather than snapping in together
  const shell = `scroll-animate group flex flex-col overflow-hidden rounded-xl border border-wj-cream-deep bg-white ${className}`

  if (href) {
    // No colour border on hover — the image scale and the arrow nudge are the
    // affordance; a teal outline snapping on read as a state change, not a hint.
    return (
      <Link href={href} className={shell}>
        {body}
      </Link>
    )
  }

  return <div className={shell}>{body}</div>
}
