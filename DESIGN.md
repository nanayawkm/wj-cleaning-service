# WJ Cleaning Services — Design System

Working reference for the site rebuild. Records what is decided and implemented, what
is proposed, and what is still blocked on a decision.

Status key: **✅ built** · **🟡 proposed** · **❓ needs a decision**

---

## 1. Brand colour

Unchanged from the original brand. Derived from the logo.

| Token | Hex | Role |
|---|---|---|
| `wj-dark` | `#2C5F70` | Primary. Buttons, dark sections, headings on light. |
| `wj-darker` | `#1E4A5A` | Legacy darker shade. |
| `wj-hover` | `#173741` | Button hover. Added because `wj-darker` sits only 1.36:1 from `wj-dark` — not a perceptible state change. |
| `wj-light` | `#84B4C7` | Accents, icons on dark. **Not for body text.** |
| `wj-lighter` | `#A3C5D6` | Accents only. **Not for body text.** |
| `wj-accent` | `#5A7D8C` | Secondary sections. |
| `wj-accent-light` | `#7A9DAC` | Tints. |
| `wj-accent-dark` | `#4A6D7C` | — |

### Measured contrast — these are rules, not preferences ✅

| Pair | Ratio | Verdict |
|---|---|---|
| `wj-lighter` on `wj-accent` | **2.43:1** | ❌ Was in use on two CTA sections. Removed. |
| `wj-light` on `wj-accent` | **1.97:1** | ❌ Never use. |
| `wj-light` on `wj-dark` | 3.13:1 | Large text only. |
| `white/85` on `wj-dark` | **5.16:1** | ✅ The standard for body copy on dark. |
| `white` on `wj-dark` | 7.05:1 | ✅ Headings on dark. |
| `wj-dark` on white | 7.05:1 | ✅ Headings and links on light. |

**Rule:** body copy on any coloured section uses `text-white/85`, never a brand tint.
`wj-accent` is too light to carry body text as either foreground or background.

### shadcn tokens ✅

`--primary` and `--ring` were still shadcn's default blue (`#3B82F6`) — which is why every
button carried a hand-written `bg-wj-dark` override and every focus ring drew blue on a
teal site. Both now map to `wj-dark` (`hsl(195 43.6% 30.6%)`).

### Warm neutral ground ✅

| Token | Hex | Role |
|---|---|---|
| `wj-cream` | `#F5F0E8` | Page ground. Set on `--background` so there is no white flash. |
| `wj-cream-deep` | `#EDE6DA` | Card borders and hairline dividers on cream. |

Sections alternate **cream → white → cream**, and cards are white so they lift off the
ground. White on cream is only **1.13:1**, so every card needs a `wj-cream-deep` border to
hold its edge — shadows are not used.

Contrast on cream: `wj-dark` **6.22:1** ✅ · `gray-600` **6.66:1** ✅ · `gray-900` 15.64:1 ✅.
`wj-accent` is 3.90:1 — large text only, same rule as everywhere else.

---

## 2. Typography

### One typeface: Geist Sans ✅

**Geist Sans everywhere** — headings, body and UI. Headings separate from body by **weight
and tracking**, not by a second family.

```css
h1, h2  { font-weight: 600; letter-spacing: -0.022em; line-height: 1.12 }
h3, h4  { font-weight: 600; letter-spacing: -0.012em }
body    { font-weight: 400 }
```

Two earlier attempts were dropped:

- **Poppins** — loaded six weights, and is the same geometric sans every Dutch competitor
  uses. No brand signal.
- **Instrument Serif + Geist pairing** — the serif read well on the hero, but two families
  on one page read as assembled from parts. A single family is calmer and more
  "organised", which is the brief.

Instrument Serif could not have been the survivor: it ships a single 400 weight and is
display-optimised, so it cannot carry body copy, form labels or UI at small sizes.

### Scale ✅

Heading chains were capped at two steps. Previously About, Services and Contact each used
**seven** heading sizes with chains up to five breakpoints.

- `h1` — `text-3xl sm:text-4xl md:text-5xl`
- `h2` — `text-3xl sm:text-4xl`
- `h3` — `text-lg` / `text-xl`, sans, semibold
- Body — `text-base`, `text-lg` for intros

### Where liveliness comes from ✅

Not from the type. The single family stays quiet; energy comes from the cream ground, the
full-bleed photography, the scrimmed edge-to-edge cards and the floating product card.

---

## 3. Icons ✅

**Phosphor Icons** (`@phosphor-icons/react`, MIT, 1,248 icons × 6 weights). Replaced Tabler
across 7 files, 69 icons.

Chosen because it carries genuinely cleaning-specific glyphs that Tabler and Lucide lack:
**Broom · SprayBottle · HandSoap · Towel · WashingMachine · Shower · Bathtub · Sparkle ·
Drop · Recycle**.

- Weight: `regular` for UI, `duotone` or `fill` available for feature moments
- Sizes are set by the button variant, not per-icon (see §4)
- 🟡 Service cards and the values grid still use generic glyphs (Buildings, ShieldCheck).
  Swapping these to the cleaning-specific set is pending.

---

## 4. Components

### Buttons ✅

Three brand variants in the cva config. Six hand-written spellings of the same two buttons
were collapsed into these.

| Variant | Use |
|---|---|
| `default` | Primary. `bg-primary` → brand teal, hover `wj-hover`. |
| `onDark` | White fill on a brand-coloured section. |
| `onDarkOutline` | White outline on a brand-coloured section. |

Sizes: `default` **h-11 (44px)**, `lg` **h-12**, `icon` **h-11**. The old `h-10` default sat
below the 44px touch floor.

`[&_svg]:size-4` was removed from the base — it compiled to a descendant selector that
outranked every icon class on the site, pinning all icons to 16px regardless of button
size. Icon size is now set per size variant.

### Form controls ✅

- Height **h-11 (44px)**
- **`text-base` (16px) at every breakpoint** — load-bearing: iOS and iPadOS Safari
  force-zoom any focused control under 16px and do not zoom back out. `md:text-sm` was
  removed for this reason.
- Radius `rounded-lg`

### `<FeatureCard>` — the one card ✅

[`components/feature-card.tsx`](components/feature-card.tsx). Three bands:

1. **Header** — a flat brand-tinted block with a large icon, *or* a photograph
2. **Body** — title and description on white
3. **Footer** — optional ruled action row

The header band is what stops a grid reading as a row of plain outlined boxes: every card
opens with colour or image before any text, so the grid has rhythm. `tintFor(i)` cycles
`dark → light → accent → cream → lighter` so neighbours never repeat, and each tint carries
a paired icon colour that clears 4.5:1.

**Copy sits on white, never over the image.** That removed the scrim from cards entirely —
which is what was tinting the photographs teal. A scrim strong enough for text will always
over-tint an image; putting the text beneath the image sidesteps the trade-off completely.

Applied to: homepage service cards, services industries (photo headers), services
"why choose", about values (tinted icon headers).

### Previous service-card treatment (superseded)

**The image is the card, edge to edge.** Full-bleed photo, a `from-wj-dark` bottom scrim,
icon chip top-left in `bg-white/15` with blur, title + description + arrow set over the
scrim at the base. Whole card is one link; the image scales 1.03 on hover.

Replaced a split card — photo band on top, white body below — where the photo was cropped
to an arbitrary strip and the two halves never read as one object. This version matches
the hero treatment, so hero and cards are recognisably the same system.

Aspect is fixed (`4/3` → `3/4` at `sm` → `4/3` at `lg`), never a fixed height, so the crop
holds at every width.

### Other cards 🟡

Currently four hand-written recipes duplicated inline, plus **nine icon-chip variants**
across four size families, with border colour alternating `wj-dark` / `wj-accent` for no
semantic reason.

Proposed: collapse to `<ServiceCard>` (image + title + body + link), `<InfoCard>`
(icon + title + body) and one `<IconChip>`.

**"Lively" — read from the Squarespace reference:**

1. **Layered depth.** Panels overlap and rise into the section above rather than sitting
   in a flat grid.
2. **Slight rotation.** A degree or two off-axis on some cards; the rest stay square.
3. **Sticker labels.** A small rotated pill in a contrast colour sitting half-on the card
   edge — Squarespace uses a coral "PLANTS" tag. Ours would carry a price or a service tag
   (*"from €45"*, *"most booked"*).
4. **Floating pill buttons** overlapping the card boundary, not tucked inside it.
5. **Real content inside**, not icons — Squarespace shows actual product screenshots.
   Ours would be a booking-flow snippet.

These are additive to the current card, not a rewrite: same white panel, same
`wj-cream-deep` border, same radius — with overlap, a tag and a floating action on top.

### Radius and elevation ✅

- One radius: **`rounded-xl`** for cards and images, **`rounded-lg`** for buttons and inputs
- Borders over shadows: `border border-gray-200`, hover `hover:border-wj-dark`
- No `shadow-2xl`, no `hover:scale-105`, no `hover:-translate-y-4` — these do nothing on
  touch except cause stuck hover states

---

## 5. Layout

- Container padding is set **only** in `tailwind.config.ts`. Five competing `@media` blocks
  in `globals.css` were removed; `globals.css` went 441 → ~130 lines. ✅
- Section headers are **left-aligned, `max-w-2xl`**, matching across all pages. They were
  centre-everything (services had nine `text-center`). ✅
- Thumbnails use **fixed aspect ratios**, not fixed heights. `h-48` yields 1.7:1 at 320px
  and 3.1:1 at 600px — the crop changed with the viewport. ✅

### Mobile rules ✅

- Text leads in the hero. A portrait image with `order-first` filled the entire first
  screen at 390px and pushed the headline and both CTAs below the fold.
- Grid and flex children that contain full-width buttons need **`min-w-0`**. Children
  default to `min-width: auto`, so the base `whitespace-nowrap` on a long button label set
  the whole column's minimum width and pushed it ~30px past a 320px viewport.
- Bottom action bar: primary action ~60% width plus WhatsApp and Call icon buttons.
  `body` carries matching bottom padding.
- Verified: **no horizontal scroll at 320 / 390 / 768 / 1024 / 1280 / 1440 / 1920**.

---

## 6. Imagery

### Rules ✅

- WebP, max 1600px wide, quality 80. Total went **46 MB → 2.5 MB**; homepage delivery
  **~13 MB → 157 KB**.
- All images through `next/image` with a `sizes` prop. `images.unoptimized` is off.
- No clipart. The three "How it works" illustrations were flat vector stock that clashed
  with the photography; that section is now typographic.
- One consistent grade across the set — inconsistency is what makes stock read as generated.

### 🟡 Proposed direction, from the Airtasker reference

The device in that reference is **flat vector illustration drawn on top of a real
photograph**, in a single saturated accent. It gives personality without needing a photo
shoot, and it sidesteps the AI-image trust problem entirely because nothing pretends to be
documentary.

Applied here:

1. **Hero** — a real photograph of a clean interior, with simple **brand-teal line
   illustration overlaid**: sparkle marks, a drawn cloth or squeegee stroke, a wiped arc
   revealing clarity.
2. **Floating UI card over the hero image**, exactly like Airtasker's "Help me move ·
   Sydney NSW · $140". Ours previews the booking product:
   *"General cleaning · 85 m² · Tue 09:00 · €95"*. This does three jobs at once — shows
   price transparency, previews the booking flow, and adds the liveliness asked for.
3. **Offset colour block** behind the image container, as in the reference.
4. **Quantified stats row** under the CTAs — see §7.

### Hero ✅ built, ❓ blocked on the asset

**Layout (built):** full-bleed edge-to-edge image, copy left-aligned over it, left-weighted
scrim (`from-wj-dark/95 via-wj-dark/80 to-wj-dark/40`) for legibility, floating product
card bottom-right. Squarespace's full-bleed treatment with Airtasker's floating card;
copy stays left to match every other page.

The floating card **carries no price**. Jackie's m² rates are not set, and a fabricated
figure would be exactly the class of unverifiable claim removed from the copy. It currently
shows the quote promise; it becomes the live price card when the booking system ships.

**Interim asset ✅:** `services/cleaning-surfaces.webp` — landscape 1600×1066, bright
bathroom, plain wall on the left for the copy, mirror and duster centre-right. The previous
asset was portrait 1600×2400; stretched full-bleed it had no legible subject.

**Scrim: a soft radial pool, not a vertical band.** Colour reaches as far as the copy and
no further, and because it is radial it fades out in every direction — there is no straight
edge anywhere in the frame.

```css
/* base tint, ties the whole frame to the brand */
background: rgba(44,95,112,0.18);

/* mobile — copy spans full width, so the pool is centred and wide */
radial-gradient(ellipse 135% 80% at 50% 42%,
  rgba(44,95,112,0.93) 0%, rgba(44,95,112,0.82) 40%,
  rgba(44,95,112,0.42) 66%, rgba(44,95,112,0)   90%)

/* sm+ — copy is left-aligned, so the pool is pulled left */
radial-gradient(ellipse 85% 125% at 20% 50%,
  rgba(44,95,112,0.94) 0%, rgba(44,95,112,0.82) 38%,
  rgba(44,95,112,0.40) 62%, rgba(44,95,112,0)   86%)
```

Plus `.hero-copy` — two stacked text-shadows giving each glyph its own edge definition.
Not counted toward the ratios below; it is headroom, not the mechanism.

Four attempts, and the failures are the useful part:

| Attempt | Result |
|---|---|
| Flat 45% overlay + even gradient | Buried the photograph |
| Evenly lighter linear gradient | Headline **2.87:1**, subtitle **4.04:1** — both fail |
| Colour pushed hard left, gone by 42% | Headline **1.17:1** — text sat on bare image |
| **Radial pool sized to the copy** | **Passes, photograph stays open** |

Verified by hiding the copy, screenshotting, and sampling the **brightest single pixel**
behind each text block — worst case, not average:

| | Worst-case ratio | Needs | |
|---|---|---|---|
| Headline (large) | **4.62:1** | 3.0 | ✅ |
| Subtitle (body) | **5.42:1** | 4.5 | ✅ |

⚠️ **The scrim is tuned to this photograph.** A brighter or darker replacement needs the
stops re-measured, not assumed. The measurement script is worth keeping for that.

**Still wanted:** a purpose-shot or generated wide image, prompt below.

> **Prompt — full-bleed hero, 16:9 (2400×1350)**
>
> A bright Dutch living room in clear morning light, photographed wide. Tall windows on
> the right filling the room with soft daylight; pale oak floor with a clean sheen; a light
> linen sofa and one low table, everything squared and in order. The left third falls into
> natural shadow, unlit and uncluttered, leaving a calm dark area. Deep, calm, ordered
> atmosphere. Natural window daylight, soft and diffused, no harsh shadows. Muted
> cool-neutral palette with a faint desaturated teal undertone. Photographic realism, 35mm,
> f/4. Matte finish, no colour grading effects. **No people, no text, no logos, no brand
> labels.**

Second choice if a room feels too static: **the wiped streak that reveals clarity** — a
crisp band cutting across a softly fogged surface with bright daylight behind it. A genuine
metaphor rather than a picture of a tool, and it gives the illustrated overlay somewhere to
sit. It needs to be shot wide and light, which is precisely what the current asset is not.

---

## 7. Content rules ✅

### Primary CTA: "Book Now" / "Nu Boeken" ✅

Was "Get Free Quote" / "Get Quote" — paperwork language for what is actually *schedule a
cleaning appointment*. One label now, used in the nav, hero, service cards, page CTAs and
the mobile bar, so the primary action is the same word everywhere.

⚠️ It currently routes to `/contact`, where the form does not submit. **"Book Now" promises
a booking flow that does not exist yet** — this needs the booking system, or an interim
honest destination.

The hero eyebrow badge ("Professional Cleaning & Staffing Solutions") was removed: it
restated the headline and was the last surviving instance of the badge-pill pattern.

- **No unverifiable claims.** Removed: "hundreds of satisfied customers" (three places),
  "24/7 Support" (three places — false for a 09:00–18:00 Mon–Sat operator), "exceed
  expectations", "go above and beyond".
- **Specific beats superlative.** "We turn up when we said we would… Not happy? Tell us
  within 48 hours and we re-clean free" over "exceptional results".
- **Name the place.** Lelystad and Flevoland appear in headline, body and metadata.
- Both EN and NL move together. The dictionary has 247 keys per language, verified equal,
  no duplicates, and `t()` is typed to `keyof translations.en` so a typo is a compile error.

### 🟡 Trust: the biggest remaining gap

Every large Dutch competitor quantifies. Asito: *5,000+ locations · 10,053 employees · 74
years*. CSU: *#1 MT500 · Top Employer 13 years running*. Vebego: *8,000 workforce*. Not one
adjective among them.

The current trust strip — "Fully insured / Lelystad based / Fast reply" — is true but
unmeasured. Needs real numbers from Jackie. Even small ones work: *"Since 2020" · "140
homes cleaned this year" · "4.8 from 32 reviews"*.

### Claims currently on the site that must be confirmed true ❓

- "Fully insured — liability cover on every job"
- "Answer within 4 working hours"
- "Evening and Saturday slots available"
- 48-hour free re-clean guarantee (Terms)

---

## 8. Motion ✅

**Scroll-reveal must never be able to hide content.**

The original implementation was an inline script in the document head. `.scroll-animate`
defaulted to `opacity: 0` and depended on that script adding `.scroll-animate-in`. It ran
once, before React had rendered, observed nothing, set an `isInitialized` flag and never
retried — and anything mounted later (the services tab switch) was never observed at all.
Measured result: **17 animated elements on the homepage, all at opacity 0 on load; 13 still
invisible after scrolling the full page; both Staffing cards invisible after a tab switch.**

Now handled by [`components/scroll-reveal.tsx`](components/scroll-reveal.tsx):

- **CSS defaults to visible.** Hiding only applies under `[data-reveal="on"]`, which the
  component sets on `<html>` after it mounts — so the hiding rule cannot exist unless an
  observer is running to undo it.
- **MutationObserver** picks up nodes React mounts later.
- **3-second failsafe** reveals anything still unobserved.
- Bails entirely under `prefers-reduced-motion`.

Verified: all 17 elements reveal on scroll, tab-switch cards reveal, and **with JavaScript
disabled 0 elements are hidden**.

## 9. Booking system and dashboard ✅

Built and live: Supabase + Resend. Three surfaces — the public flow at `/book`, customer
self-service at `/booking/manage?token=…`, and Jackie's dashboard at `/residents`
(Today · Bookings · Customers · Applications · Availability · Pricing · Discounts).

### Square corners: a second dialect, on purpose ✅

The marketing site is cream ground, `rounded-xl`, photography. The booking flow and the
dashboard are **`rounded-none` throughout** — 36 instances across the two booking-flow
components, 4 in the dashboard. The only `rounded-full` survivors are the six places a
circle carries meaning rather than style: the step badges, the radio and checkbox
indicators, and the dot marking a day with availability.

This is not drift. The marketing site is arguing; the product is being used. Rounded cards
on cream read as brochure, and a brochure is the wrong signal once someone has decided to
book. The shared vocabulary is set once in
[`app/residents/(dashboard)/ui.tsx`](app/residents/(dashboard)/ui.tsx):

- Square corners, **one hairline border** (`border-gray-200`), no shadows
- White panels on a light ground (`bg-gray-50/70` — cream stays on the marketing site)
- `wj-dark` reserved for **the thing currently selected**, nothing else

`<PageHeader>`, `<Panel>`, `<Stat>` and `<StatusPill>` are the only recipes. Every admin
screen is assembled from them rather than inventing its own spacing.

### Touch targets ✅

**h-11 (44px)** on every action control, matching §4. The bookings filter row was `h-9` —
36px, sitting directly beneath an `h-11` Export button — and was corrected. The dashboard
is used one-handed on a phone between jobs, so this matters more here than on the
marketing site, not less.

🟡 One holdout remains: the mobile **Sign out** button in
[`nav.tsx`](app/residents/(dashboard)/nav.tsx) is still `h-9`. Low-frequency and
deliberately de-emphasised, but it is below the floor.

### Status is the only axis ✅

Five statuses, enforced by a CHECK constraint: `confirmed · rescheduled · completed ·
cancelled · no_show`.

**Only `confirmed` and `rescheduled` hold a slot.** This is the load-bearing fact of the
whole system — `BLOCKING_STATUSES` drives both the Postgres exclusion constraint
(`bookings_no_overlap`) and the public availability query, so *any* move to `completed`
releases that time to the next customer who asks for it.

The bookings list therefore filters on status alone, never on the clock:

| Tab | Rule |
|---|---|
| **Open** | `confirmed` / `rescheduled`, **any date**. Sorted forwards, so an overdue job Jackie never marked surfaces at the top |
| **Completed** | `completed` |
| **Unpaid** | `completed && !paid` — money actually owed |
| **Cancelled** | `cancelled` or `no_show` — both mean the job did not happen |
| **All** | everything, newest first |

Every status lands in exactly one bucket and no tab is a subset of another. The four stat
tiles use the same predicates, so a tile can never disagree with the tab beneath it, and
the money figures stay disjoint instead of counting one job twice.

**What this replaced, and why it is written down:** the tabs used to split on time —
`upcoming` meant *active and not yet started*, `past` meant *already started*. A job marked
done on Monday for a slot on Wednesday was too late for one and too early for the other. It
fell out of every tab and read as though the record had been deleted. Nothing had been
deleted; there was simply nowhere for it to appear. **A booking must never be reachable
only through "All".**

Two rules fall out of the same fact:

- **Marking paid completes the job — but only once the slot has started.** Money is
  collected at the door, never online, so confirming the cash is normally confirming the
  work. Auto-completing a job that has not happened yet would put Jackie's own working time
  back on sale and sell the slot out from under the customer who just paid.
- **Finishing a job does not close the panel.** The status pill flips in place. A row
  vanishing under the reader is what made deletion the natural reading in the first place.

### Money ✅

`paid_at` is a manual admin flag — there is no payment provider. Every future booking is
therefore unpaid by definition, which is why "unpaid" as a signal is scoped to completed
work in both the tab and the amber row badge. "Earned this month" counts what Jackie has
**marked done**, not what the calendar says has passed: a slot whose time went by with
nothing recorded against it is not revenue, it is a job to chase.

---

## 10. Accessibility ✅

- Pinch-zoom restored (`maximumScale: 1` removed — WCAG 1.4.4 failure)
- Focus rings brand teal, not shadcn blue
- Touch targets: buttons and inputs 44px, footer links 40px
- `prefers-reduced-motion` respected
- Hover-only content eliminated — the About gallery captions were `opacity-0
  group-hover:opacity-100` and were therefore invisible on every touch device
- No horizontal scroll at any tested width

---

## 11. Legal ✅

- `/privacy`, `/terms`, `/cookies` exist and are linked (previously `href="#"`)
- KVK and BTW render in the footer when filled in `constant.ts` — **legally required on
  Dutch commercial sites** (BW 3:15d). Currently blank, so omitted rather than faked.
- Privacy policy states lawful basis (contract for booking data, consent for marketing),
  retention, the Resend US transfer under the EU–US Data Privacy Framework, and GDPR rights

---

## 12. Not yet built

- Open Graph card — metadata declares 1200×630 but the file is a 1024×1024 square, so
  social shares render distorted
- `<ServiceCard>` / `<InfoCard>` / `<IconChip>` extraction
- Cleaning-specific Phosphor icons in service and value cards
- Real trust numbers
