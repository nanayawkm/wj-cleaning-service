# Booking — finalised spec

Source of truth: the WJ flyer ("Brilliance in every corner") and the intake-form
screenshot, plus the decisions confirmed 28 July 2026. ❓ marks the one number still open.

---

## 1. Pricing

The flyer labels bands by a single figure (`130 M²`); the intake dropdown gives ranges
(`100m² t/m 139m²`). The dropdown defines the band, the flyer label is shorthand for it.

### Algemene schoonmaak · General cleaning — per session

| Band | Price |
|---|---|
| 65 – 99 m² | **€ 89** |
| 100 – 139 m² | **€ 119** |
| 140 – 179 m² | **€ 139** |
| 180 – 200 m² | **€ 169** |

Included: bathroom (toilet, shower/bath, basin) · all floors vacuumed and mopped · dusting
of furniture and window sills · kitchen worktop and hob · mirrors and glass · bins emptied.

**Outside 65 – 200 m²** → routed to the contact form for a custom quote. The published
prices stay exactly as printed. ✅

### Deep cleaning — **add-on only, never standalone** ✅

The flyer's €149 / €189 / €219 / €259 column is not a separate service. It is the *all-in
total* for a general clean plus deep cleaning, which the arithmetic confirms:

| Band | General | All-in with deep | Supplement |
|---|---|---|---|
| 65 – 99 m² | € 89 | € 149 | **+ € 60** |
| 100 – 139 m² | € 119 | € 189 | **+ € 70** |
| 140 – 179 m² | € 139 | € 219 | **+ € 80** |
| 180 – 200 m² | € 169 | € 259 | **+ € 90** |

Adds: descaling bathroom and kitchen · inside cupboards and kitchen appliances · windows
inside and out · behind and under furniture and appliances.

> ❓ **The one open number.** The flyer's extras line says *"Dieptereiniging toevoegen
> vanaf + € 30"*, but its own price table implies **+ €60 to +€90**. €30 is half the
> smallest supplement. Which is correct? The site cannot show both.

### Washing up · Afwas doen

**+ € 12**, + 30 min. ✅

### Promotion — discount code ✅

20% off the first booking, entered as a **code from the flyer / QR** rather than applied
automatically. Lets Jackie see which flyers convert. Codes live in a table so she can
issue and expire them without a developer.

---

## 2. Scheduling

- **Base duration** 3 hours
- Deep cleaning **+1 h**, washing up **+30 min** — both together is 4.5 h and consumes the
  next start time
- Availability is an interval-overlap test, not a fixed grid: `ends_at` is derived from
  `starts_at + base + add-ons + travel buffer`
- A Postgres `tstzrange` exclusion constraint makes double-booking impossible even under
  simultaneous submission

### Availability is set by Jackie, not hardcoded ✅

Nothing about the working week is baked into the code. She controls it from `/admin`,
which is what keeps the calendar honest and cuts the reschedule calls.

**Weekly template** — the normal week, set once:

| Day | Start times |
|---|---|
| Mon – Sat | 09:00 · 12:00 · 15:00 |
| Sun | closed |

**Date overrides** — exceptions that beat the template:

- *Block a day* — holiday, sick, fully booked elsewhere
- *Block one slot* — "Tuesday 12:00 is gone, the rest of the day is fine"
- *Open an extra slot* — an evening or a Sunday she is willing to work

A slot is only offered when: the template allows it **and** no override blocks it **and**
the full duration fits before the day's last finish time **and** it does not overlap an
existing booking.

Two tables:

```
availability_rules   weekday, start_time, active          -- the normal week
availability_overrides  date, start_time | null,          -- null = the whole day
                        kind ('block' | 'open'), reason
```

Seeding the template with Mon–Sat 09:00/12:00/15:00 means she can change her mind without
a developer, and the "18:00 start" question stops mattering — if she wants it, she adds it.

---

## 3. Flow — booked on submit, Jackie can reschedule ✅

The slot is **confirmed the moment the customer submits**. Only genuinely free slots are
offered and the database constraint prevents doubles, so the confirmation email is true
and the calendar is blocked immediately — which is what "plan direct" promises.

Jackie's step is a **notification, not a gate**. If she cannot make it she phones the
customer, reschedules in `/admin`, and the customer gets a *Booking rescheduled* email
with the new time. Status goes `confirmed → rescheduled → completed`.

The version deliberately avoided: showing "confirmed" while a booking is really pending
approval. If she then declined, the customer would have held a morning for a booking that
never existed.



Five steps, one screen each on mobile, **live total pinned to the bottom** from step 2.
Price is shown before any personal detail is requested — the whole advantage over every
competitor's "request a quote" form.

```
1  SERVICE    General cleaning — from € 89

2  SIZE       Hoe groot is uw woning?
              65–99 · 100–139 · 140–179 · 180–200 m²
              Smaller or larger → quote path
              └ price resolves:  € 119

3  EXTRAS     ☐ Deep cleaning    + € 70   (+1 h)
              ☐ Washing up       + € 12   (+30 min)
              Discount code      [__________]
              └ total updates live

4  WHEN       Calendar, blocked days greyed out
              Start times shown only where the full duration fits
              └ "Tue 12 Aug · 09:00 – 12:30"

5  DETAILS    Name · email · phone · street · postcode · city
              Notes (access, parking, pets)
              ☐ Send me offers and discounts   (unticked — GDPR consent)
              └ Review everything, then [ Request booking ]
```

**After submit:** "Request received — we confirm within 4 working hours", plus a receipt
email to the customer and an alert to Jackie. She approves in `/admin`, which fires the
**Booking confirmed** email with an `.ics` attachment and a manage link (cancel /
reschedule / rebook via signed token).

> ⚠️ The flyer says **"Scan & boek direct"** and *"plan direct uw afspraak"*. With
> Jackie confirming each booking, it is not direct. Either the flow becomes instant, or
> the flyer wording needs softening on the next print run.

### Step 4 — the date and time picker

Taken from the three scheduling references supplied. What they have in common, and what
we copy:

**Layout.** Calendar and time slots **side by side** on desktop, stacked on mobile, with a
context panel on the left holding what is being booked. Reference 1 puts a duration badge
there ("10-20min"); ours carries service, size and running total:

```
┌──────────────────┬────────────────────────┬─────────────┐
│ General cleaning │  Select a date & time  │  09:00      │  ← outlined pills
│                  │                        │  ───────────│
│ 100 – 139 m²     │   ‹  August 2026  ›    │  12:00      │  ← filled when
│ + Washing up     │                        │  ───────────│    selected
│                  │  Mo Tu We Th Fr Sa Su  │  15:00      │
│ ⏱  3 h 30 min    │                        │  ───────────│
│                  │        1  2  3  4  5   │  18:00      │  ← greyed, not
│ € 131            │   6  7  8  9 10 11 12  │  (unavailable) hidden
│ ──────────────── │  13 14 15 16 17 [18]19 │             │
│                  │  20 21 22 23 24 25 26  │             │
│ ‹ Back           │                        │  [ Next ]   │
└──────────────────┴────────────────────────┴─────────────┘
```

**Rules taken from the references:**

- **Unavailable slots are shown greyed, never hidden.** Reference 1 greys 11:30 rather
  than removing it — an empty column reads as broken, a greyed one reads as busy.
- **Slots show the full range**, not just a start: `09:00 – 12:00`. Reference 3 does this,
  and it matters more here because our duration varies with the add-ons.
- **The selected day is a filled circle**; past and closed days are greyed and not
  clickable.
- **Completed steps collapse to a summary line** with their chosen value — reference 2's
  `✓ Visit reason — Broken Tooth`. Ours: `✓ Size — 100–139 m²`. Tapping reopens it.
- **One primary action bottom-right**, back link bottom-left. Never two competing buttons.
- Generous white space, thin borders, one accent colour. All three references are calm and
  uncrowded; that restraint is what reads as premium.

**Mobile:** month calendar full width, then "Choose available time" as a two-column grid of
range pills, then the primary button — reference 3 exactly. The running total stays pinned
above the button.

### Design rules carried from DESIGN.md

- Cream ground, white panels, `wj-cream-deep` borders; `FeatureCard` anatomy for the
  service and extras choices
- Form controls **h-11 / 16px** so iOS never zooms on focus
- One typeface (Manrope); headings separate by weight, not family
- Progress indicator; every step reachable backwards without losing state
- The running total is the one piece of persistent UI — it is why people finish

---

## 4. What changes on the existing site

| Where | Change |
|---|---|
| `Book Now` | Points to `/book` instead of the dead contact form |
| Hero floating card | Real quote — "100 m² · Tue 09:00 · € 119" |
| How it works | "Pick size & extras → Choose your slot → Confirmed by email" |
| Services page | General cleaning bookable with prices; the rest stay quote-only, visibly split |
| New | Public pricing section, straight from the flyer |
| Terms | Real cancellation and rescheduling terms matching the flow |
| Privacy | Booking-data section (already drafted) goes live |

---

## 5. Still open

1. ❓ **Deep-cleaning supplement: € 30 or € 60–90?** Blocks the price shown on screen.
2. ❓ **Start times** — three (09:00 / 12:00 / 15:00) or four including 18:00?
3. ❓ **VAT** — are the flyer prices inclusive of BTW? Dutch consumer pricing normally is,
   and it has to be stated on the page.
4. ❓ **Travel buffer** between consecutive jobs — 0, 30 or 60 minutes?
5. ⚠️ **Phone number mismatch.** Flyer: **06-44576593**. Site and every `tel:` link:
   **+31 (0) 685063641**. One is wrong, and it is in print with a QR code.
6. ❓ **Tagline** — "Brilliance in every corner" is on the flyer but nowhere on the site.
