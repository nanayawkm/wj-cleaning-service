# Invoicing — finalised spec

Source of truth: the two real invoices Jackie sent — `202608-0002` (Villa Rental Europe B.V.)
and `202608-0003` (residential) — her Digiboox setup, and the decisions confirmed
10 August 2026. ❓ marks what is still open.

**Scope: Phase 1 only.** Create an invoice, produce the PDF, share it. € 200, one week.
Sending by email, payment tracking beyond paid/unpaid, credit notes, reminders, iDEAL links
and recurring invoices are explicitly out — see §10.

---

## 1. The moment this exists for

She has finished a job. The customer wants an invoice. She is standing in their hallway with
her phone. Today that means opening Digiboox and typing everything from scratch while someone
waits.

Target: **under a minute**, from her phone, ending in a PDF shared over WhatsApp.

Everything below serves that. Anything that does not is Phase 2.

### The path that has to stay short

This is the acceptance test for every UI decision. If a change makes either path longer, it is
the wrong change.

**From scratch — the doorstep case**

```
Invoices → New → pick customer → tap service → [Add discount] → Finalise → Share
   1        1          2              1             2              1         2      ≈ 8 taps
```

**From a booking**

```
Bookings → tap booking → Create invoice → Finalise → Share
    1            1              1             1         2                    ≈ 6 taps
```

Nothing on either path may require typing an address, a rate, a date or a number. Those come
from the customer, the segment, the clock and the counter.

> **Digiboox stays her bookkeeping.** Her btw-aangifte and bank reconciliation do not move.
> From go-live she creates invoices here instead of there, then books each one into Digiboox
> afterwards. That is a minute at her desk rather than ten on a doorstep — but it is not zero,
> and she has been told so.

---

## 2. The two invoice shapes

Both real invoices use the **same template**. One adaptive layout covers both; do not build two.

| | `202608-0002` business | `202608-0003` residential |
|---|---|---|
| Customer | Villa Rental Europe B.V. | private person |
| `T.a.v.` line | absent | **present** |
| btw rate | 21% | 9% |
| **btw mode** | **added on top** | **carved out** |
| Line sub-lines | `08/08/2026 - PO: Lelystad - Steiger 2` | none |
| Vervaldatum | 30 days | 30 days |
| Footer | identical | identical |

### 2.1 btw mode — inclusive vs exclusive ✅

This is the one requirement that was not obvious until the second invoice arrived. The line
prices mean **opposite things** on the two invoices.

**Exclusive** — lines are net, btw added on top. Total is larger than the lines:

```
Wissel schoonmaak   € 28,50 × 2 = € 57,00
Linnen wassen       € 23,00 × 1 = € 23,00
Subtotaal                         € 80,00
21% btw                           € 16,80
Totaal te voldoen                 € 96,80
```

**Inclusive** — lines are gross, btw carved out. Total equals the lines:

```
Algemene schoonmaak € 90,00 × 1 = € 90,00
Subtotaal excl. btw               € 82,57     ← 90 ÷ 1.09
9% btw                            €  7,43
Totaal te voldoen                 € 90,00
```

Her template already distinguishes them: the label reads **`Subtotaal`** in exclusive mode and
**`Subtotaal excl. btw`** in inclusive mode. Reproduce that.

Rules:

- Mode is stored **per invoice**, defaulted from the customer.
- The builder shows an unmistakable toggle with totals updating live. If she cannot tell which
  mode she is in, she will eventually send a € 90 invoice that asks for € 98,10.
- In inclusive mode the **total is pinned to the gross**. Derive net from gross, then set
  `vat = gross − net`. Never compute the btw independently, or the three figures drift a cent
  apart and the round number she promised is no longer round.

### 2.2 Rates ✅

**Jackie's rule: 9% for residential customers, 21% for business customers.** Confirmed
10 August 2026. It matches both real invoices and it is what drives the default.

Underneath, the Belastingdienst rule is about the work rather than the customer — 9% for regular
cleaning inside a home, 21% for the outside (façade, windows), for specialised or intensive
cleaning inside a home, and for all commercial work and staffing. For her current mix the two
line up, which is why the simple rule is safe to build on.

So: **the segment sets the default, the line stays editable.** If her accountant later rules
that deep cleaning is "intensive" and therefore 21% on a residential invoice, she overrides that
line herself — no code change, no redeploy.

- The rate lives on **each line**, never on the invoice.
- The rate used is **stored on the line** at finalise. Never look it up later — rates change,
  and an old invoice must never move.
- When an invoice mixes rates, the single `21% btw` row becomes a per-rate breakdown:

  ```
  Subtotaal                        € 180,00
  Btw  9%  over € 100,00           €   9,00
  Btw 21%  over €  80,00           €  16,80
  Totaal te voldoen                € 205,80
  ```

  When every line shares a rate, collapse back to her existing single row.

> ❓ **Is deep cleaning 9% or 21%?** It plausibly counts as "specialised or intensive cleaning"
> and therefore 21%, not the 9% the rest of a residential clean attracts. Confirm with her
> accountant before go-live — this is the one thing here that could make her invoices wrong.

---

## 3. Numbering ✅

Format **`YYYYMM-NNNN`**, counter resetting each month. `202608-0003` is the third invoice of
August 2026. Legal in NL: the series is systematic and gapless.

- **First app invoice is `202608-0003`.** ✅ Confirmed 10 August 2026. `0001` and `0002` were real
  and stay in Digiboox; the `202608-0003` she sent was a test. So the counter seeds at
  `last_seq = 2` for period `202608`.

  > ⚠️ **The test invoice must be deleted or voided in Digiboox first**, or two documents carry
  > the number `202608-0003`. It was never sent to a customer, so removing it is clean — but it
  > has to actually happen before the first real invoice goes out.

  If she issues anything further from Digiboox between now and go-live, bump the seed on the day.
  Set it at cutover, not in advance.
- **Assign on finalise, never on draft.** A numbered draft that gets abandoned leaves a
  permanent hole in the series. Drafts carry no number; the number is stamped when she commits.
  This is the single most important rule in the feature.
- **Use a locked counter row, not a Postgres sequence.** Sequences do not roll back — a failed
  insert burns a number forever. Lock the counter row for the current `YYYYMM` inside the same
  transaction as the insert, so a rollback returns the number.
- **Hard cutover.** She must never issue from Digiboox and here in the same month, or the
  numbers collide.
- **Booking references stay separate.** `generateReference()` in
  [app/api/bookings/route.ts](app/api/bookings/route.ts) keeps doing its job. An invoice number
  is a different series for a different purpose — one invoice can cover several jobs, and the
  villa-rental work never comes through the booking form at all. Do not couple them.

> ❓ **Credit notes** — same series, or their own `CN-YYYYMM-NNNN`? Needs deciding before build,
> even though credit notes themselves are Phase 2.

---

## 4. Data model

Follows the conventions already in [supabase/schema.sql](supabase/schema.sql): money in integer
cents, snapshots so history never rewrites, admin-only RLS via the existing policy generator.

### 4.1 Extend `customers` — do not create a second list

Her booking customers and her invoice customers overlap on the residential side. Two competing
customer lists would be a mess for her. Add nullable columns instead; booking-created rows keep
nulls until she invoices them.

**Most business customers never touch the booking form.** ✅ Confirmed 10 August 2026 — the villa
rental work came from people who never used the app. So creating a customer **by hand** on the
Customers tab is a first-class flow, not an edge case. Today `customers` rows can only be created
by the booking API; that changes.

Invoices reference customers with `on delete restrict` — a customer who has been invoiced cannot
be deleted, or the invoice loses its counterparty.

```sql
alter table public.customers
  add column if not exists company_name text,          -- "Villa Rental Europe B.V."
  add column if not exists attn         text,          -- renders as "T.a.v. Jacklyn"; usually null
  add column if not exists country      text not null default 'Nederland',
  add column if not exists vat_number   text,          -- her customer's btw-nummer, if any
  add column if not exists segment      text not null default 'residential'
                                        check (segment in ('residential','business'));
```

**`segment` is the one field that drives everything.** ✅ Confirmed 10 August 2026:

| | `residential` | `business` |
|---|---|---|
| Default btw rate | **9%** | **21%** |
| btw mode | **inclusive** — carved out | **exclusive** — added on top |

Both are defaults on a new invoice, and both stay editable there. No separate
`prices_include_vat` or `default_vat_rate` column on the customer — one segment sets both, and
the invoice snapshots what was actually used.

**Payment terms are always 30 days.** ✅ No per-customer field. `due_date = invoice_date + 30`,
with the 30 held in `invoice_settings` so it can change without a deploy.

Address block follows the **standard Dutch layout** ✅, omitting any line whose value is null:

```
{company_name ?? name}          Villa Rental Europe B.V.
T.a.v. {attn}                   only when set — naming a person at an organisation
{street}                        Punter 14 - 9
{postcode}  {city}              8284 DD  Lelystad
{country}                       Nederland
```

**Normalise the postcode on render** — `1234 AB`, four digits, single space, two capitals. Her
own data is inconsistent (`8223DH` on one invoice, `7415 NL` on the other) because the field is
free text. Store what she types, print it correctly.

Note her own data is inconsistent — `8223DH Lelystad` on one invoice, `7415 NL Deventer` on the
other. `postcode` is free text; render it verbatim followed by the city.

### 4.2 New tables

```sql
-- Her own company details and the number series. One row.
create table if not exists public.invoice_settings (
  id                 int primary key default 1 check (id = 1),
  company_name       text not null,
  street             text not null,
  postcode           text not null,
  city               text not null,
  phone              text not null,
  email              text not null,
  kvk                text not null,
  vat_number         text not null,
  iban               text not null,
  footer_nl          text not null,
  footer_en          text not null,
  terms_days         int  not null default 30   -- always 30; here so it can change without a deploy
);

-- The saved list she taps instead of typing. Grows out of her real work.
create table if not exists public.service_items (
  id           uuid primary key default gen_random_uuid(),
  name_nl      text not null,          -- "Wissel schoonmaak", "Algemene schoonmaak"
  name_en      text not null,
  segment      text not null check (segment in ('residential','business')),
  unit_cents   int  not null,          -- stored in that segment's mode: incl. for residential, excl. for business
  vat_rate     int  not null,          -- 9 or 21, following the segment
  active       boolean not null default true,
  sort_order   int not null default 0
);

-- Gapless numbering. A row per YYYYMM, locked inside the insert transaction.
create table if not exists public.invoice_counters (
  period    text primary key,          -- '202608'
  last_seq  int  not null default 0
);

create table if not exists public.invoices (
  id            uuid primary key default gen_random_uuid(),
  number        text unique,           -- null while draft, stamped on finalise
  status        text not null default 'draft'
                check (status in ('draft','issued','paid','void')),

  customer_id   uuid not null references public.customers(id),

  -- everything below is snapshotted at finalise so the invoice never moves
  bill_to       jsonb not null,        -- the rendered address block
  issued_from   jsonb not null,        -- invoice_settings at the time
  prices_include_vat boolean not null,
  invoice_date  date not null,
  due_date      date not null,

  net_cents     int not null,
  vat_cents     int not null,
  gross_cents   int not null,
  vat_breakdown jsonb not null,        -- [{rate:9, net_cents, vat_cents}, ...]

  language      text not null default 'nl' check (language in ('nl','en')),
  pdf_path      text,                  -- Supabase Storage, written once
  paid_at       timestamptz,
  created_at    timestamptz not null default now()
);

create table if not exists public.invoice_lines (
  id           uuid primary key default gen_random_uuid(),
  invoice_id   uuid not null references public.invoices(id) on delete cascade,
  sort_order   int  not null default 0,

  -- set when the line came from a booking, so a booking can show "invoiced" and
  -- one invoice can still cover several bookings. Null for the villa work.
  booking_id   uuid references public.bookings(id) on delete set null,

  description  text not null,          -- "Wissel schoonmaak"
  subline      text,                   -- "08/08/2026 - PO: Lelystad - Steiger 2"
  unit_cents   int  not null,          -- as entered, in the invoice's mode
  qty          numeric(10,2) not null default 1,
  vat_rate     int  not null,          -- snapshot, never looked up again

  -- computed at finalise, never recomputed
  net_cents    int not null,
  vat_cents    int not null,
  gross_cents  int not null
);
```

RLS: admin-only on all of the above, using the same generator at the bottom of `schema.sql`.
Nothing here is ever public.

---

## 5. The PDF

### 5.1 Layout — reproduce her template exactly

Top to bottom, matching both samples:

1. **Logo** top-left · **company block** top-right (name, street, postcode city, phone, email,
   then KvK / btw-nummer / IBAN as a separate group)
2. **Customer address block** left, below the logo
3. **`Factuur`** heading, then three label/value rows: `Factuurnummer:`, `Factuurdatum:`,
   `Vervaldatum:`
4. **Line table** — columns `Omschrijving` · `Bedrag` · `Aantal` · `Totaal`, with the optional
   grey sub-line under a description
5. **Totals block**, right-aligned, per §2.1 and §2.2
6. **Footer**, centred: *"U wordt vriendelijk verzocht de factuur voor de vervaldatum te voldoen
   onder vermelding van het factuurnummer."*

### 5.2 Assets ✅

- **Logo:** [public/images/logo1.png](public/images/logo1.png) — 1024×1024, already the exact
  lockup on her invoices, far above print quality at the ~30 mm it occupies. Crop the generous
  white padding or it floats small in the corner. **Not** `email-logo.png` (360×232, too small).

  > ⚠️ **Pin the aspect ratio explicitly.** The source is square, but `@react-pdf/renderer` lays
  > out with flexbox and the default `alignItems: 'stretch'` will squash the logo to the height of
  > whatever sits beside it — `height: auto` does not protect against it, because stretch sets a
  > definite cross-size. Set `alignItems: 'flex-start'` on the header row, and give the image both
  > dimensions plus `flexShrink: 0`. This was caught on the HTML sample; it will recur in the PDF.
- **Font:** **Geist**, already in the project. Her current font is whatever Digiboox defaulted
  to, not a brand decision — Geist puts the invoice on the same typeface as her site and emails.

### 5.3 Renderer ✅

**`@react-pdf/renderer`.** Describe the document as components; it runs its own layout engine
and emits the PDF. No browser, runs anywhere Node runs, handles page breaks and embedded fonts.

Rejected: headless Chrome (binary barely fits serverless, slow cold starts, expensive) and
`pdf-lib`/`pdfkit` (coordinate positioning — fine for a stamp, miserable for a table that grows).

### 5.4 Dutch and English ✅

Confirmed 10 August 2026. The invoice renders in the customer's language, following the `nl`/`en`
pattern already used by [lib/email/templates.ts](lib/email/templates.ts) and the booking flow.
Only the fixed labels translate — her service descriptions are entered as typed.

| NL | EN |
|---|---|
| Factuur | Invoice |
| Factuurnummer · Factuurdatum · Vervaldatum | Invoice number · Invoice date · Due date |
| Omschrijving · Bedrag · Aantal · Totaal | Description · Unit price · Qty · Total |
| Subtotaal *(excl. btw)* · 9% btw · Totaal te voldoen | Subtotal *(excl. VAT)* · 9% VAT · Total due |
| *U wordt vriendelijk verzocht…* | *Please settle this invoice by the due date, quoting the invoice number.* |

Roughly 1–2 hours on top of §8, since the bilingual pattern already exists.

### 5.5 Storage ✅

Render once at finalise, upload to Supabase Storage at a stable path
(`invoices/2026/202608-0003.pdf`), save the path on the row. **Never regenerate.** Rebuild it
later from live data and a since-changed price produces a different document than the one the
customer holds. The stored file is the record.

---

## 6. Screens

Mobile-first throughout. [nav.tsx](app/residents/) is already rail-on-desktop / tab-strip-on-phone
and notes *"on a phone the first tab is the one under her thumb"* — she works from her phone.

**Flow: panel builder.** ✅ Chosen 10 August 2026 from three candidates. The invoice is a single
slide-over `<Panel>` — the same shape as the booking and customer panels she already uses, so no
new navigation dialect — with the running total and primary action in a **sticky footer**, and
**Add line** opening a bottom sheet of large service tiles. One tap per service, no typing, no
dropdown. Roughly six taps for a residential invoice.

Rejected: a three-step wizard (ceremony for a one-line invoice, and it slows the common case
most) and a full tile-grid POS (fastest, but the villa invoices need per-line dates and PO
references the grid cannot express, and it compresses review of a document that becomes
immutable).

When the panel scrolls past the customer row on a long invoice, pin a one-line customer summary
to the panel header.

- **`Invoices` tab** in the existing nav strip.
- **List** — number, customer, date, total, status. Search. Filters: all / unpaid / paid.
  Paid/unpaid is a simple toggle; overdue logic is Phase 2.
- **Two totals on the Invoices tab** — *Invoiced this month* and *Outstanding*. ✅

  The three money tiles on the Bookings tab stay booking-derived and untouched. They are right
  for the work that comes through the app, and wrong only for the villa-type invoices that never
  had a booking. Rather than blur the two, each tab counts its own thing: **Bookings tiles are
  about jobs, Invoices tiles are about documents issued.** They overlap where a booking is
  invoiced, so they are not meant to be added together — worth saying to her once.
- **Builder** — customer picker (or add inline) → btw mode toggle → lines. Tapping a saved
  service item prefills description, price and rate; every field stays editable; a free-text
  line covers anything not in the list; "save as new item" when a one-off recurs. Live totals.
- **Preview → Finalise → Share** — number stamped at finalise, PDF rendered, then the phone's
  native share sheet (WhatsApp, email) plus a plain download.
- **Settings** — her company details, footer text, the seed number, and the service-item list.

### 6.1 Create invoice from a booking ✅

Confirmed 10 August 2026. A **Create invoice** action on a booking — from the bookings table and
the booking panel — opens the builder prefilled:

| Prefilled from | Into |
|---|---|
| `bookings.customer_id` | customer, and therefore segment, rate and mode |
| `m2_label` + `subtotal_cents` | first line, e.g. *Algemene schoonmaak · 100 – 139 m²* |
| `booking_addons` (name + `price_cents` snapshots) | one line each |
| `starts_at` | the grey sub-line, as the service date |
| `bookings.language` | invoice language |

Everything stays editable — she charged **€ 90** where the band says **€ 89**, so prefill is a
starting point, never a lock.

Booking prices are consumer prices and therefore **btw-inclusive at 9%**, which lines up with the
residential segment exactly.

Each generated line keeps its `booking_id`, so a booking can show **invoiced** in the table and
she cannot bill the same job twice by accident. One invoice can still gather several bookings —
a month of cleans for one customer is just several lines.

Discounts prefill as a negative line — see §6.2.

### 6.2 Discounts ✅

**A discount is just a line with a negative amount.** No discount field on the invoice, no
percentage stored, no template change — her table already has everything it needs:

```
Algemene schoonmaak            € 90,00   1    €  90,00
Korting WELKOM20               − € 17,80  1   − € 17,80
Subtotaal excl. btw                            €  66,24
9% btw                                         €   5,96
Totaal te voldoen                              €  72,20
```

Why this and not a discount field:

- **It works in both btw modes with no special maths.** Inclusive: the gross drops and the carve-out
  follows. Exclusive: the net drops and btw is charged on the reduced net. Both correct by
  construction.
- **It covers the ad-hoc case**, which is the common one — she decides on the doorstep to charge
  € 80 instead of € 90. Same mechanism as a booking code.
- **The customer sees what they saved**, which she does not get if she quietly edits the price.

Rules:

- `Add discount` accepts either an **amount** or a **percentage** — a percentage computes off the
  current subtotal and is stored as the resulting amount.
- The discount line **carries a btw rate** like any other line, defaulting to the rate of the
  lines above it. Almost every invoice is single-rate, since the segment sets it. On a mixed-rate
  invoice she picks the rate, or adds one discount line per rate.
- Booking-derived invoices prefill it automatically from `discount_cents`, described with the
  code — *Korting WELKOM20*.
- She can still just edit a line price instead. Both paths stay open.

### 6.3 Seeding the service list ✅

An empty list on day one is slower than Digiboox and she will not come back to it. Half of it
already exists in the booking system, half does not.

**Residential — take from the booking seed** in [supabase/schema.sql](supabase/schema.sql):

| From | Item | Price |
|---|---|---|
| `pricing_bands` | Algemene schoonmaak, 4 bands | € 89 / € 119 / € 139 / € 169 |
| `pricing_bands.deep_cents` | Dieptereiniging supplement | + € 60 / 70 / 80 / 90 |
| `addons` | Afwas doen | € 12 |

**Business — does not exist anywhere yet.** `Wissel schoonmaak € 28,50` and `Linnen wassen
€ 23,00` come only from invoice `202608-0002`. She has to name the rest herself.

**An item belongs to one segment.** ✅ If she ever needs the same service for both — say
`Algemene schoonmaak` for an office as well as a home — she creates a second item with its own
price. No conversion between modes, no two-price rows. It costs one extra line in her list and it
makes billing € 108,90 for a € 90 job impossible.

> **Copy the prices, do not live-link them.** `202608-0003` charges **€ 90,00** for Algemene
> schoonmaak where the booking band says **€ 89**. She invoices what she agreed, not what the
> website advertises. `service_items` owns its own editable prices; changing a booking band must
> never move an invoice price, and vice versa.

---

## 7. Correctness traps

Everything here has bitten someone before.

1. **Integer cents everywhere.** No floats, ever.
2. **Round btw per rate group**, not per line and not on the grand total.
3. **Inclusive mode pins the total to the gross** (§2.1).
4. **Numbers stamped on finalise, from a locked counter row** (§3).
5. **Immutable once issued.** An issued invoice is never edited. Phase 1 has no credit note, so
   the interim is a **`void`** status that keeps the number and marks it cancelled — the series
   stays intact and she reissues as a new number. Say this to her explicitly; she will get one
   wrong in the first week.
6. **Snapshot everything** onto the invoice at finalise — address, her own company details, the
   rates. The same discipline `bookings.subtotal_cents` and `m2_label` already follow.

### 7.1 Failsafes ✅

She is creating a numbered legal document on a phone, in someone else's house. These are not
polish.

1. **Autosave every change.** A phone call mid-invoice must not lose the work. Drafts carry no
   number, so they cost nothing to abandon and nothing to keep.
2. **Finalise and share are separate actions.** If she dismisses the share sheet or WhatsApp
   fails, the invoice still exists and re-shares from the list.
3. **Idempotent finalise.** A client token travels with the request. A double tap, a retry, or a
   flaky connection returns the same invoice rather than burning a second number.
4. **Preview before the number is stamped.** Everything up to finalise is free to fix. Nothing
   after it is.
5. **Finalising does not close the panel** — the status pill flips in place, matching how marking
   a booking done already behaves (`DESIGN.md` §9).
6. **Void, never delete.** Confirmation step, number retired, reissue fresh.

> ⚠️ **No signal, no number.** The counter lives on the server, because that is the only way two
> invoices can never share a number. In a stairwell or a thick-walled hallway she can build the
> invoice but **cannot finalise it**.
>
> Design the state rather than discovering it: the draft saves locally and the button reads
> *"Saved — no connection. Finalise when you're back online."* She finishes it from the car.
> What must never happen is an optimistic success followed by a number that turns out to belong
> to a different invoice.

### Golden test cases

Both taken from her real invoices. If these two pass to the cent, the maths is right.

| | Lines | Expected |
|---|---|---|
| **Exclusive, 21%** | 28,50 × 2 · 23,00 × 1 | net 80,00 · btw 16,80 · **96,80** |
| **Inclusive, 9%** | 90,00 × 1 | net 82,57 · btw 7,43 · **90,00** |

---

## 8. Build order

| # | | Hours |
|---|---|---|
| 1 | Schema, RLS, locked-counter numbering | 3–4 |
| 2 | Settings screen + service items | 3–4 |
| 3 | Customer fields, manual "new customer" on the Customers tab, picker | 3–4 |
| 4 | Builder: lines, qty, per-line rate, **btw mode**, live totals | 9–11 |
| 5 | PDF template matching her layout + Storage | 6–8 |
| 6 | Invoices tab: list, search, paid/unpaid, the two totals | 4–5 |
| 7 | Create invoice from a booking, with `booking_id` and the invoiced flag | 2–3 |
| 8 | Share sheet + download | 1–2 |
| 9 | Rounding, NL/EN, the two golden cases, walkthrough with her | 4–5 |
| | **Total** | **~36–47 h** |

Scope has grown since the € 200 was quoted at 23 hours: btw modes (+3), English invoices (+2),
manual customer creation (+1), booking prefill (+3), invoice totals (+1). All of it is worth
having and none of it is padding — but the honest read is that **one week no longer fits**, and
the delivery promise is the first thing she reads on the invoice.

---

## 9. Open questions

- ❓ **Does she want the discount visible to the customer?** The negative line shows *Korting
  € 17,80* on the PDF. If she would rather it not be seen, she edits the price instead and the
  line never appears — but that is her choice per invoice, not a setting. (§6.2)
- ❓ **Her business service list.** Only `Wissel schoonmaak` and `Linnen wassen` are known. (§6.1)
- ❓ **Last Digiboox number at cutover** — needed on the day, not before.
- ❓ **Digiboox: can sales invoices be imported via UBL?** Five-minute email to their support.
  Decides whether her re-entry is a minute per invoice or near zero.
- ❓ **Credit note series** — shared or a separate `CN-` prefix. Deferred: credit notes are Phase 2
  and Phase 1 uses `void` instead, so this does not block anything now. (§3, §7)

**Settled 10 August 2026:** btw rate follows the customer segment (§2.2) · payment terms are
always 30 days (§4.1) · standard Dutch address block, `T.a.v.` only when set (§4.1) · deep
cleaning takes the segment default, overridable per line (§2.2) · **invoices in NL and EN**
(§5.4) · residential items seeded from the booking system, business items entered by hand,
prices independent of booking prices (§6.1) · **first app invoice is `202608-0003`** (§3) ·
business customers are created by hand and that is a first-class flow (§4.1) · a service item
belongs to one segment; duplicate it rather than convert it (§6.2) · **create invoice from a
booking**, with `booking_id` on the line and an invoiced flag on the booking (§6.1) · booking
tiles stay booking-derived, invoice totals live on the Invoices tab (§6).

---

## 10. Not in Phase 1

Deliberately excluded, and stated on the invoice she was sent:

- Sending by email from her domain (the bilingual system in
  [lib/email/templates.ts](lib/email/templates.ts) is ready for it — cheap when it comes)
- Credit notes proper, overdue tracking, automatic reminders
- iDEAL / Mollie payment links
- **Recurring invoices** — likely the biggest time-saver she will eventually want, given the
  repeat changeover work at the marina
- Offertes
- Any UBL / Peppol export into Digiboox

> Worth a five-minute email to Digiboox support: **can sales invoices be imported via UBL?**
> If yes, her re-entry work drops to near zero and the caveat in §1 disappears.
