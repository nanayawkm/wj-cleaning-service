# Image generation prompts — WJ Cleaning Services

> **Status: 10 of 11 delivered and live (27 July 2026).** 22 MB of PNG in, 1.28 MB of WebP
> out. The supplied numbering diverged from this doc at #8 (café, not offices), so each
> file was identified by eye rather than by name. Still outstanding: **Industry — Offices**
> and the **Open Graph card**.

Eleven images: the homepage (6) and the "Serving Diverse Industries" cards (5).

Every prompt below assumes the **shared style block**. Paste it into all eleven. Consistency
across the set is what separates curated imagery from a stock grab-bag — it matters more
than any individual image being perfect.

---

## Shared style block — paste into every prompt

> Natural window daylight, soft and diffused, no harsh shadows and no visible light
> sources. Muted cool-neutral palette with a faint desaturated teal undertone. Calm,
> uncluttered, everything squared and in order. Photographic realism, 35mm, f/4, subtle
> depth of field. Matte finish, low contrast, no colour-grading effects, no lens flare, no
> vignette. **No text, no signage, no logos, no brand labels, no readable screens.**

### Two rules that come from the code, not taste

**1. People — distant or not at all.** Close-up faces and hands are where generation fails
most visibly, and a close-up of "a cleaner" implies real staff, which misrepresents the
business. Where a person is needed for the idea to read, specify **mid-distance or
back-turned, no visible face, no close-up hands**.

**2. Keep the subject in the upper two-thirds.** Both card types lay a dark gradient over
the bottom of the image and set text on top of it. Anything important low in the frame gets
covered.

---

## Homepage

### 1 — Hero · full-bleed · target **2400 × 1350** (16:9)

Rendered edge-to-edge behind the headline. Copy sits on the **left**, and a white card
floats **bottom-right**, so both those areas must stay quiet. Currently using
`services/cleaning-surfaces.webp` as an interim.

> A bright Dutch bathroom or hallway just after cleaning, photographed wide. Clean white
> tiling, a large round mirror catching soft daylight, pale surfaces with a faint clean
> sheen, one folded towel. The left third is a plain uninterrupted wall in soft shadow,
> empty and calm. The subject sits centre-right. The lower right corner is plain and
> unbusy. [+ shared style block]

### 2 — Residential Cleaning card · target **1600 × 1600** (square)

⚠️ This slot crops to **4:3 on mobile, 3:4 on tablet, 4:3 on desktop**. Generate square and
keep the subject centred with headroom on all four sides, or it will be cut off at one
breakpoint. Bottom third goes under a dark scrim.

> A sunlit living room in a Dutch home immediately after a deep clean. Pale oak floor with a
> clean sheen, a light linen sofa with cushions squared, one low table with a single ceramic
> vase. Tall windows with sheer curtains. Subject centred with clear space above and below.
> [+ shared style block]

### 3 — Office Cleaning card · target **1600 × 1600** (square)

⚠️ **This is the one that most needs replacing.** Both current office images show people in
a meeting — not cleaning. Same square/centred rule as above.

> An empty modern office at the start of the day, spotless and ready. Two clean desks with
> chairs pushed in square, dark monitors, a glass partition catching soft daylight, polished
> floor with a faint reflection. Nobody present. Subject centred with clear space above and
> below. [+ shared style block]

### 4 — Warehouse Staffing card · target **1600 × 1600** (square)

Staffing needs human presence to read, so: distant figures only.

> A clean, well-lit warehouse aisle with neatly stacked pallets and racking in orderly rows.
> Two workers in plain hi-vis vests seen from a distance and from behind, small in the
> frame, no faces visible. Polished concrete floor. Subject centred with clear space above
> and below. [+ shared style block]

### 5 — Event Staffing card · target **1600 × 1600** (square)

> An event hall set up and ready before guests arrive. Round tables laid with clean white
> linen, chairs squared, glassware set out in neat rows, soft daylight through tall windows.
> One or two staff in plain dark uniforms at a distance, seen from behind, no faces visible.
> Subject centred with clear space above and below. [+ shared style block]

### 6 — "Why customers book us again" panel · target **1600 × 1200** (4:3)

Sits beside body copy on the right. No scrim over this one, so the whole frame is visible.

> A cleaner seen from a distance working in a bright open-plan interior, small in a large
> calm frame, back turned, no face visible. Tall windows, polished floor, an ordered and
> unhurried scene. Plenty of empty space around the figure. [+ shared style block]

---

## Serving Diverse Industries — services page

All five render at **3:2** with a dark gradient over the bottom and a small icon badge
**bottom-left**. Target **1600 × 1067** each. Keep the subject upper-centre and leave the
lower-left corner plain.

### 7 — Warehouses

> A large clean warehouse interior, tall racking in orderly rows receding into the distance,
> polished concrete floor, daylight from high windows. Empty of people. Wide shot,
> upper-centre subject, plain lower-left corner. [+ shared style block]

### 8 — Offices  ⚠️ NOT YET SUPPLIED

The empty-office square from homepage card #3 is standing in, cropped to 3:2. It works,
but it means the same photograph runs on both the homepage and the services page.

> A quiet open-plan office, empty desks in neat rows, chairs squared, soft daylight through
> a glass façade, clean floor with a faint reflection. Nobody present. Wide shot,
> upper-centre subject, plain lower-left corner. [+ shared style block]

### 9 — Restaurants & Cafés

> A small café interior before opening. Wooden tables wiped clean and set square, chairs
> aligned, a clean counter, morning daylight through the front window. Empty of people. Wide
> shot, upper-centre subject, plain lower-left corner. [+ shared style block]

### 10 — Hotels

> A hotel room prepared for the next guest. Crisp white bed linen with sharp corners,
> cushions squared, a clean side table with a single glass, soft daylight through sheer
> curtains. Empty of people. Wide shot, upper-centre subject, plain lower-left corner.
> [+ shared style block]

### 11 — Schools

> An empty classroom at the end of the day, desks in tidy rows, chairs pushed in, a clean
> floor, daylight through large windows, a blank wall where a board would be. Empty of
> people. **No text or writing anywhere.** Wide shot, upper-centre subject, plain lower-left
> corner. [+ shared style block]

---

## Before you use them

**Check the set together, not one at a time.** Lay all eleven side by side. If one is warmer,
darker or more saturated than the rest, regenerate it — a mismatched set reads worse than
plain stock.

**Reject any image with:** readable text or signage, a visible face, close-up hands, a
brand label on a bottle or box, or lighting that is obviously artificial. These are the
tells that make generated imagery recognisable.

**Deliver as:** JPG or PNG at the target sizes above. I will convert to WebP ≤1600px,
rename them into the existing scheme, wire up `next/image` with the right `sizes`, and
re-run the contrast measurement on the hero — the scrim is tuned to the current photo and
will need retuning if the new one is brighter or darker.

## Also outstanding

**Open Graph card · 1200 × 630.** Not a photograph — a graphic. Metadata currently declares
1200×630 while the file is a 1024×1024 square logo, so every WhatsApp and LinkedIn share
renders distorted.

> A wide minimal composition on a deep teal ground (#2C5F70), with a calm empty area on the
> left third for a logo and one line of text. A soft, out-of-focus suggestion of a clean
> bright interior on the right. No text or logo in the generated image itself.
