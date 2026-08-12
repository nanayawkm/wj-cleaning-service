# Per-page responsiveness plan

Companion to [DESIGN.md](DESIGN.md). That file records the system; this one records
what each page does when someone is actually on it, and what it should do instead.

Status key: **✅ built** · **🟡 proposed** · **❓ needs a decision or an asset**

---

## 1. Where the site actually is

Measured in Chromium at 1280px against the production build, counting elements the
scroll-reveal observer can act on — not classes in the source, because `FeatureCard`
injects `scroll-animate` itself and the source undercounts every page that uses it.

| Page | Reveals — was | now | Sections |
|---|---|---|---|
| `/` | 17 | 17 | 6 |
| `/about` | 10 | 10 | 5 |
| `/services` | 7 | **9** | 4 |
| `/services/cleaning` | 3 | **7** | 5 |
| `/services/staffing` | 3 | **5** | 4 |
| `/careers` | **1** | **10** | 7 |
| `/contact` | **0** | **10** | 4 |
| `/privacy` · `/terms` · `/cookies` | 0 | 0 | 2 |

The "now" column is step 3 of §6, done: two class names per section, no new code, and
the legal pages deliberately left at zero.

Reproduce with `npm run test:carousel`'s sibling sweep, `node scripts/layout-sweep.mjs`.

Two things fall out of the table:

- The homepage is not doing anything the other pages *can't* do. It has no bespoke
  machinery — it simply calls the same reveal primitive seventeen times. Every other
  page had the mechanism available and never used it. Careers has **seven sections and
  one reveal**, and that one is the benefits panel added this week.
- Everything in the "Interactive" column is one carousel. Outside it, no page on the
  site responds to anything the visitor does except following a link. The homepage's
  cleaning/staffing switch does not count — see §5.

---

## 2. What I actually think

**Motion is the smaller half of this problem, and doing it first would be a mistake.**

"It's only displaying the information" is an accurate description, but the cause is not
mainly that the information sits still. It is that there is very little information.
DESIGN.md §7 already names this as *the biggest remaining gap*: every large Dutch
competitor quantifies — Asito publishes *5,000+ locations · 10,053 employees · 74
years*, CSU *#1 MT500 · Top Employer 13 years running*, Vebego *8,000 workforce* — and
this site's equivalent strip is "Fully insured / Lelystad based / Fast reply". All true,
none measured, and no adjective animates into a number.

A page whose claims are unfalsifiable does not become convincing when it fades in. It
becomes a brochure that fades in. So the plan below is ordered with substance first and
motion second, and the two highest-priority items are not motion at all:

| # | | Why it outranks everything else |
|---|---|---|
| ~~**1**~~ ✅ | ~~**The contact form does not submit**~~ | **Fixed.** It was a bare `<form>` with no handler and no route — every commercial enquiry since launch was silently discarded, while the page showed no sign of failure. Now `/api/contact`, validated, rate-limited and honeypotted. See DESIGN.md §13. |
| **1** | **Real numbers from Jackie** | §7's list: *"Since 2020" · "140 homes cleaned this year" · "4.8 from 32 reviews"*. Three true figures would do more for how interesting these pages feel than every proposal in §4 of this document combined, because they give each page something specific to say. ❓ Blocked on Jackie, not on code — now the top open item. |
| **2** | **Persist enquiries** | `/api/contact` emails and does not store, so a Resend outage loses the message. The sender is told and given the phone number rather than a false "sent", but a `contact_enquiries` table is the real answer. Deliberately not built here: it needs a migration against the live project, a retention policy and a dashboard screen. |

⚠️ **Not verified: an actual email leaving the building.** `RESEND_API_KEY` is absent from
the local `.env.local` (which holds only the three public Supabase vars), so the send path
returns 502 locally by design. Validation, rate limiting, the honeypot and the failure
response are all verified against the running build; **the first live send should be
watched**, and `RESEND_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` confirmed present in the
deployment environment.

Everything from §3 down assumes those two are moving in parallel, not afterwards.

---

## 3. House rules for motion

So that "make it feel alive" does not decay into a site that fidgets.

1. **Reuse the primitive.** [`scroll-reveal.tsx`](components/scroll-reveal.tsx) already
   handles the observer, late-mounted nodes, a 3-second failsafe and reduced motion.
   Adding reveals to a page is adding two class names, not new code. Do not write a
   second reveal mechanism.
2. **Motion never gates content.** §8's rule, learned the hard way when 13 homepage
   elements stayed invisible at opacity 0. CSS defaults to visible; hiding only exists
   while an observer is running to undo it.
3. **Reduced motion cuts, it does not stop.** Established by the staffing carousel: the
   flag removes *travelling motion*, not the fact that content changes. Gating an
   advance interval on the flag froze that section for every visitor with Windows
   "Animation effects" off — a common setting, and not a statement about carousels.
   Anything that advances on its own follows the same rule.
4. **Nothing hover-only.** §10 already deleted the About gallery captions for being
   `opacity-0 group-hover:opacity-100`, i.e. invisible on every touch device. Hover may
   add emphasis; it may never be the only way to reach content.
5. **No `hover:scale`, no `hover:-translate-y`, no `shadow-2xl`** (§4). On touch these
   do nothing except cause stuck hover states.
6. **One idea per section.** A page where four things move is not livelier than one
   where one thing does; it is harder to read.

---

## 4. Per page

### `/about` — 10 reveals, 5 sections 🟡

Best-served page after the homepage; the values grid and gallery already reveal because
`FeatureCard` brings its own.

- **Stagger the mission rows.** The three tinted rows are a natural 1–2–3 and currently
  arrive as one block. `scroll-stagger` on their wrapper. *(S)*
- **Sticker label on one gallery card.** §4 lists this as an unbuilt "lively" device —
  a small rotated pill half-off the card edge carrying a service tag. One card only;
  the device dies the moment every card has one. *(S)* ❓ Needs a true label — *"most
  booked"* is a claim, and §7 forbids unverifiable ones.
- **Reveal the closing CTA.** Currently the one section that arrives flat. *(S)*

### `/services` — 7 reveals, 4 sections 🟡

- **Stagger the industries grid** so the row cascades rather than snapping in. *(S)*
- **Give each card a destination.** They currently state a category and stop, which is
  the "dead end" §9 bans in the dashboard and permits here only by inconsistency. *(M)*

### `/services/cleaning` — 3 reveals, 5 sections 🟡

The thinnest of the service pages, and the one with the most obvious opportunity.

- **A before/after wipe.** §6 already proposes *"the wiped streak that reveals clarity —
  a crisp band cutting across a softly fogged surface"* as the second-choice hero
  direction. As a draggable divider on this page it is the single most on-brief
  interaction available to a cleaning company: it is the product, it is genuinely
  interactive, and it needs no claim to be true. Drag on pointer, drag on touch, and a
  keyboard-reachable slider input underneath. *(M)* ❓ **Blocked on two photographs of
  the same room from a locked-off camera.** Without a real pair this becomes a stock
  before/after, which is exactly the trust problem §6 warns about.
- **Two-column "What's included" with stagger.** It is a plain `ul` today. *(S)*
- **The commercial section is a heading, a paragraph and a button** on bare cream.
  Give it the offset colour block from §6's reference direction, or a photograph. *(S)*

### `/services/staffing` — 3 reveals, 4 sections ✅ / 🟡

- **Carousel** ✅ — advances every 5s, pauses on hover, cuts rather than stops under
  reduced motion. Verified in-browser; see DESIGN.md §8.
- **Number the "How it works" steps** and connect them with a rule, so three cards read
  as a sequence rather than three peers. *(S)*

### `/careers` — 1 reveal, 7 sections 🟡 **biggest gap**

Seven sections, one reveal, and the longest scroll on the site.

- **Reveal coverage across all seven sections.** Pure class-adding. *(S)*
- **A sticky "Apply" affordance** once the hero scrolls out. The form is the only point
  of the page and currently sits at the bottom of a long scroll; the hero's button is
  the sole route to it and disappears immediately. *(M)*
- **Progress on the form itself.** It is a long single column; a step or completion
  indicator turns a wall into a sequence. *(M)*

### `/contact` — 0 reveals, 4 sections 🟡 **worst-served page**

Also the least DESIGN.md-compliant page on the site (see §5 below). Order matters here:
**fix the form, then bring the page to the system, then add motion.** Animating a form
that throws submissions away is the wrong thing to build.

- **Make it submit** — see §2 item 1. *(M)* 🔴
- **Bring typography to §2** — four-step chains and 12px body copy throughout. *(S)*
- **Replace the outlined icon chips** with the `TINTS` cycle, as the About mission block
  now uses. Contact still alternates `border-wj-dark` / `border-wj-accent` with no
  semantic reason, which §4 names explicitly. *(S)*
- **Then** reveal the four sections. *(S)*

### `/privacy` · `/terms` · `/cookies` — 0 reveals ✅ *deliberately*

**Leave these still.** A privacy policy that animates is not reassuring, it is
suspicious, and someone reading one is looking for a fact, not an experience. The zero
in the table is correct for these three and should stay zero.

One genuine defect to fix regardless: the "Last updated" line is
`text-sm text-wj-lighter` on `wj-dark` — measured **3.87:1** where small text needs 4.5.
§1's rule already covers it: *body copy on any coloured section uses `text-white/85`,
never a brand tint*. *(S)*

### Shared — nav, footer, mobile bar 🟡

- **Nav CTA sizing.** `size="sm"` (36px) on the desktop "Book Now" / "Talk to us",
  "Call Now" and the language toggle, against §4's 44px floor — the site's primary
  action is the shortest control on the page. *(S)* ❓ Raising to `h-11` changes nav
  density; worth a look before committing.
- **Active-page indication.** The nav does not show where you are. *(S)*

---

## 5. Compliance sweep — what is not following DESIGN.md

Automated across 11 pages × 7 widths (`scripts/layout-sweep.mjs`).
`/book` and `/booking/*` **could not be checked** — they need
`SUPABASE_SERVICE_ROLE_KEY`, which is absent locally, so they render a server error.

**Clean:**

- **§5 horizontal scroll — no page scrolls sideways at 320 / 390 / 768 / 1024 / 1280 /
  1440 / 1920.** The claim still holds after this week's layout changes.
- §4 elevation and motion bans: no `shadow-2xl`, `hover:scale-*` or `hover:-translate-y`
  anywhere in the marketing pages.
- Buttons: every `<Button>` wrapping a link now passes `asChild` (27 usages).

**Outstanding:**

**Outstanding — one item, and it is a judgement call:**

| Where | Rule | Detail |
|---|---|---|
| `navigation.tsx` 206/219/234 | §4 | `size="sm"` = 36px on the desktop primary CTA, call button and language toggle, against the 44px floor. ❓ Left deliberately: raising to `h-11` changes nav density on every page, which is a design decision rather than a defect. Worth looking at before committing. |

Everything else the sweep reported at under 44px is either explicitly allowed (footer
links at 40px, §10) or a false positive of the measurement: the off-screen `aria-hidden`
honeypot on `/careers`, and `sr-only` checkbox and radio inputs sitting behind visible
custom controls that are themselves well over the floor.

**Fixed:**

- `about/page.tsx` — `<Button>` wrapping a `<Link>` without `asChild`, rendering an
  anchor inside a button. Invalid HTML (§9: *a button may not wrap an anchor*), and it
  left that CTA 24px tall next to its 48px sibling. Now 48px, not nested. It was the only
  instance in 27 usages.
- `contact/page.tsx` — the form now submits (§2 above). Heading and body chains cut to
  the §2 two-step cap; four hand-written copies of one card with chip borders alternating
  `wj-dark`/`wj-accent` collapsed onto the `TINTS` cycle; the phone and email rows made
  into `tel:`/`mailto:` links, having been plain text a visitor had to copy out by hand;
  the WhatsApp button turned from `onClick={window.open}` on a `<button>` into a real
  anchor, so it survives a popup blocker and can be middle-clicked; twelve of eighteen
  icon imports removed as never rendered.
- `legal-page.tsx` — "Last updated" was `wj-lighter` on `wj-dark` at **3.87:1** where
  small text needs 4.5. Now `text-white/85` (5.16:1), which is §1's standing rule anyway.
- `careers/page.tsx` — image moved from `h-56 sm:h-64` to `aspect-[16/10]` (§5). The
  fixed height gave 2.2:1 on a phone and nearly 4:1 in a wide column.
- `contact/page.tsx` — same fix on the `h-24 sm:h-32` banner, a 24px-tall strip on a phone.
- `about/page.tsx` — the last four-step body chain.
- `home-content.tsx` — the cleaning/staffing switch carried `aria-pressed`, which
  describes a button that is on or off and never says the two are alternatives or connects
  either to the grid it swaps. Now a real tab set — and because claiming `role="tab"` owes
  the keyboard behaviour, arrow keys, Home/End and roving tabindex are implemented rather
  than asserted.

---

## 6. Order

1. ~~**Contact form submits.**~~ ✅ Done — see §2.
2. **Real numbers from Jackie** (§7) — the actual fix for "only displaying information",
   and now the top open item. ❓ Blocked on the business, not on code.
3. ~~**Reveal coverage on Careers, Contact, Cleaning, Services.**~~ ✅ Done — see the §1
   table.
4. ~~**Contact page brought to §2/§4**, and the legal contrast fix.~~ ✅ Done — see §5.
5. **The before/after wipe on `/cleaning`**, once the photographs exist. ❓ Blocked on two
   shots of the same room from a locked-off camera.
6. Persist enquiries; sticky Apply on `/careers`; numbered staffing steps; the sticker
   label; nav sizing.

### Confirm before the next deploy

`RESEND_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are both absent from the local
`.env.local`. The booking system is live, so they are presumably set in the deployment
environment — but the contact route is new and depends on the first, and it has never
sent a real message. Watch the first live enquiry through.
