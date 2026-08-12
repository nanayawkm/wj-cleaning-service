-- ═══════════════════════════════════════════════════════════════ invoicing
--
-- Runs after schema.sql. Adds everything the Invoices tab needs.
--
-- Two rules shape the whole file and are worth reading before changing it:
--
--   1. An issued invoice never moves. Every figure, address and rate is
--      snapshotted onto the row at finalise, the same discipline `bookings`
--      already follows with `subtotal_cents` and `m2_label`.
--   2. The number series must be gapless and must never repeat. That is why
--      numbering is a locked counter row rather than a sequence — see
--      `finalise_invoice` at the bottom.
--
-- Spec: INVOICING.md

-- ────────────────────────────────────────────────────── customers, extended
--
-- Deliberately not a second customer table. Her booking customers and her
-- invoice customers overlap on the residential side, and two competing lists
-- would be a mess to keep straight. Booking-created rows keep nulls here until
-- the first time she invoices them.

alter table public.customers
  add column if not exists company_name text,
  add column if not exists attn         text,
  add column if not exists country      text not null default 'Nederland',
  add column if not exists vat_number   text;

-- The one field that drives rate *and* btw mode. Residential prices are quoted
-- inclusive (a round € 90 at the door); business prices are quoted exclusive
-- and btw is added on top. Both are only defaults — the invoice snapshots what
-- was actually used.
alter table public.customers
  add column if not exists segment text not null default 'residential';

do $$ begin
  alter table public.customers
    add constraint customers_segment_check check (segment in ('residential','business'));
exception when duplicate_object then null; end $$;

-- Booking customers arrive with a name only; business ones are typed in by
-- hand. Searching the picker has to cover both.
create index if not exists customers_name_idx on public.customers (lower(name));
create index if not exists customers_company_idx on public.customers (lower(company_name));

-- ──────────────────────────────────────────────────────────────── settings
--
-- One row. Her own details as they print on the invoice, so none of it is
-- hardcoded in a component she cannot reach.

create table if not exists public.invoice_settings (
  id            int primary key default 1 check (id = 1),
  company_name  text not null,
  street        text not null,
  postcode      text not null,
  city          text not null,
  phone         text not null,
  email         text not null,
  kvk           text not null,
  vat_number    text not null,
  iban          text not null,
  footer_nl     text not null,
  footer_en     text not null,
  -- Always 30 today. Held here rather than hardcoded so it can change without
  -- a deploy.
  terms_days    int not null default 30 check (terms_days between 0 and 180)
);

-- ─────────────────────────────────────────────────────────── service items
--
-- The list she taps instead of typing. An item belongs to exactly one segment,
-- and `unit_cents` is stored in that segment's mode — inclusive for
-- residential, exclusive for business. If she ever needs the same service for
-- both, that is two items with two prices. Converting one price between modes
-- would eventually bill € 108,90 for a € 90 job.

create table if not exists public.service_items (
  id          uuid primary key default gen_random_uuid(),
  name_nl     text not null,
  name_en     text not null,
  segment     text not null check (segment in ('residential','business')),
  unit_cents  int  not null check (unit_cents >= 0),
  vat_rate    int  not null check (vat_rate in (0, 9, 21)),
  active      boolean not null default true,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists service_items_segment_idx
  on public.service_items (segment, sort_order) where active;

-- Also makes the seed below re-runnable. The same service in both segments is
-- two rows by design, so the segment is part of the key.
create unique index if not exists service_items_name_segment_key
  on public.service_items (name_nl, segment);

-- ─────────────────────────────────────────────────────────────── numbering
--
-- One row per YYYYMM. Locked inside the finalise transaction.

create table if not exists public.invoice_counters (
  period   text primary key,          -- '202608'
  last_seq int  not null default 0 check (last_seq >= 0)
);

-- ──────────────────────────────────────────────────────────────── invoices

create table if not exists public.invoices (
  id           uuid primary key default gen_random_uuid(),

  -- Null while draft. Stamped by finalise_invoice() and never edited after.
  -- A draft that holds a number and is then abandoned puts a permanent hole in
  -- a series that is required to be gapless.
  number       text unique,

  status       text not null default 'draft'
               check (status in ('draft','issued','paid','void')),

  -- restrict, not cascade: deleting a customer must not orphan an invoice that
  -- has already gone to them.
  customer_id  uuid not null references public.customers(id) on delete restrict,

  -- Snapshots taken at finalise. Editing a customer or her own company details
  -- afterwards must never change a document someone is already holding.
  bill_to      jsonb,
  issued_from  jsonb,

  prices_include_vat boolean not null default true,
  language     text not null default 'nl' check (language in ('nl','en')),

  invoice_date date,
  due_date     date,
  issued_at    timestamptz,

  -- The date the work was actually done. Required on a factuur whenever it
  -- differs from the invoice date, so it is a real field rather than something
  -- buried in a free-text line reference. Defaulted to today in the UI.
  service_date date,

  -- Btw verlegd. Matters for the staffing side, where personnel lending can
  -- fall under the verleggingsregeling. Lines carry 0% and the PDF must say so
  -- and must show the customer own btw-nummer.
  reverse_charge boolean not null default false,

  net_cents    int not null default 0,
  vat_cents    int not null default 0,
  gross_cents  int not null default 0,
  -- [{ "rate": 9, "net_cents": 8257, "vat_cents": 743 }, ...]
  vat_breakdown jsonb not null default '[]'::jsonb,

  -- Written once, never regenerated. Rebuilding the PDF later from live data
  -- would produce a different document than the one the customer holds.
  pdf_path     text,

  -- Idempotency for finalise. A double tap or a retry on a flaky connection
  -- returns the same invoice rather than burning a second number.
  client_token text,

  -- Practice run. Takes its own TEST-0001 series, never advances the real
  -- month counter, and is marked on the PDF so it cannot pass for a real one.
  is_test      boolean not null default false,

  paid_at      timestamptz,
  void_reason  text,
  notes        text,

  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  -- An issued invoice must carry everything that makes it a legal document.
  constraint invoices_issued_is_complete check (
    status = 'draft' or (
      number is not null and invoice_date is not null and due_date is not null
      and bill_to is not null and issued_from is not null
    )
  )
);

create index if not exists invoices_status_idx  on public.invoices (status);
create index if not exists invoices_created_idx on public.invoices (created_at desc);
create index if not exists invoices_customer_idx on public.invoices (customer_id);

create table if not exists public.invoice_lines (
  id          uuid primary key default gen_random_uuid(),
  invoice_id  uuid not null references public.invoices(id) on delete cascade,
  sort_order  int  not null default 0,

  -- Set when the line came from a booking, so a booking can show "invoiced"
  -- and she cannot bill the same job twice. Null for work that never came
  -- through the booking form, which is most of the business side.
  booking_id  uuid references public.bookings(id) on delete set null,

  description text not null,
  -- The grey second line: "08/08/2026 - PO: Lelystad - Steiger 2"
  subline     text,

  -- As entered, in the invoice's mode. A discount is simply a negative one.
  unit_cents  int not null,
  qty         numeric(10,2) not null default 1 check (qty <> 0),
  vat_rate    int not null check (vat_rate in (0, 9, 21)),

  -- Computed once at finalise and never recomputed.
  net_cents   int not null default 0,
  vat_cents   int not null default 0,
  gross_cents int not null default 0
);

create index if not exists invoice_lines_invoice_idx on public.invoice_lines (invoice_id, sort_order);
create index if not exists invoice_lines_booking_idx on public.invoice_lines (booking_id)
  where booking_id is not null;

-- ═══════════════════════════════════════════════════════ finalise_invoice
--
-- The only place an invoice number is ever created.
--
-- Runs as SECURITY INVOKER, so Row Level Security still decides whether the
-- caller may touch these rows — an ordinary signed-in account that is not on
-- the admin allowlist gets nothing.
--
-- Why a counter row and not a sequence: Postgres sequences do not roll back.
-- A failed insert would consume a number permanently, and this series is
-- required to have no holes in it.

create or replace function public.finalise_invoice(
  p_invoice_id   uuid,
  p_client_token text
)
returns table (out_number text, out_invoice_date date, out_due_date date)
language plpgsql
as $fn$
declare
  v_inv    public.invoices%rowtype;
  v_period text;
  v_seq    int;
  v_number text;
  v_terms  int;
  v_today  date;
begin
  -- Row lock held for the rest of the transaction, so two taps cannot both
  -- pass the "is it still a draft" test below.
  select * into v_inv from public.invoices where id = p_invoice_id for update;
  if not found then
    raise exception 'invoice_not_found' using errcode = 'P0002';
  end if;

  if v_inv.number is not null then
    -- Replay of the same request. Hand back what was already issued instead
    -- of failing, so a retry after a dropped connection is safe.
    if v_inv.client_token is not distinct from p_client_token then
      return query select v_inv.number, v_inv.invoice_date, v_inv.due_date;
      return;
    end if;
    raise exception 'already_issued' using errcode = 'P0001';
  end if;

  if not exists (select 1 from public.invoice_lines where invoice_id = p_invoice_id) then
    raise exception 'no_lines' using errcode = 'P0001';
  end if;

  select terms_days into v_terms from public.invoice_settings where id = 1;
  v_terms := coalesce(v_terms, 30);

  -- Her clock, not the server's. An invoice created at 00:30 Amsterdam time on
  -- the first of the month belongs to the new month's series.
  v_today := (now() at time zone 'Europe/Amsterdam')::date;

  -- The whole point of is_test: a practice invoice never advances the real
  -- month's counter. Real periods are always six digits, so the two series
  -- can never collide.
  if v_inv.is_test then
    v_period := 'TEST';
  else
    v_period := to_char(v_today, 'YYYYMM');
  end if;

  insert into public.invoice_counters (period, last_seq)
  values (v_period, 0)
  on conflict (period) do nothing;

  update public.invoice_counters
     set last_seq = last_seq + 1
   where period = v_period
  returning last_seq into v_seq;

  if v_inv.is_test then
    v_number := 'TEST-' || lpad(v_seq::text, 4, '0');
  else
    v_number := v_period || '-' || lpad(v_seq::text, 4, '0');
  end if;

  update public.invoices
     set number       = v_number,
         status       = 'issued',
         client_token = p_client_token,
         invoice_date = v_today,
         due_date     = v_today + v_terms,
         issued_at    = now(),
         updated_at   = now()
   where id = p_invoice_id;

  return query select v_number, v_today, (v_today + v_terms);
end
$fn$;

-- Pinned so the function cannot be hijacked by a shadowing schema, matching
-- what private.is_admin() already does.
alter function public.finalise_invoice(uuid, text) set search_path = public, pg_temp;

revoke all on function public.finalise_invoice(uuid, text) from public, anon;
grant execute on function public.finalise_invoice(uuid, text) to authenticated;

-- ═══════════════════════════════════════════════════════════════════ RLS
--
-- Admin-only, no exceptions. Nothing here is ever readable by anon: an invoice
-- carries a home address, a phone number and what someone paid.

alter table public.invoice_settings enable row level security;
alter table public.service_items    enable row level security;
alter table public.invoice_counters enable row level security;
alter table public.invoices         enable row level security;
alter table public.invoice_lines    enable row level security;

do $$
declare t text;
begin
  foreach t in array array[
    'invoice_settings','service_items','invoice_counters','invoices','invoice_lines'
  ] loop
    execute format('drop policy if exists "admin full access" on public.%I', t);
    execute format(
      'create policy "admin full access" on public.%I
         for all to authenticated
         using (private.is_admin()) with check (private.is_admin())', t);
  end loop;
end $$;

-- ═══════════════════════════════════════════════════════════════ storage
--
-- Private bucket. The rendered PDF is the legal record and is kept for seven
-- years, so it is served through short-lived signed URLs rather than being
-- made public.

insert into storage.buckets (id, name, public)
values ('invoices', 'invoices', false)
on conflict (id) do nothing;

drop policy if exists "admins manage invoice pdfs" on storage.objects;
create policy "admins manage invoice pdfs" on storage.objects
  for all to authenticated
  using (bucket_id = 'invoices' and private.is_admin())
  with check (bucket_id = 'invoices' and private.is_admin());

-- ══════════════════════════════════════════════════════════════════ seed

insert into public.invoice_settings (
  id, company_name, street, postcode, city, phone, email, kvk, vat_number, iban,
  footer_nl, footer_en
) values (
  1,
  'WJ Cleaning Services',
  'Punter 14 - 9',
  '8284 DD',
  'Lelystad',
  '0685092379',
  'Info@wjcleaningservices.nl',
  '90840437',
  'NL004846595B66',
  'NL98KNAB0615246249',
  'U wordt vriendelijk verzocht de factuur voor de vervaldatum te voldoen onder vermelding van het factuurnummer.',
  'Please settle this invoice by the due date, quoting the invoice number.'
) on conflict (id) do nothing;

-- Residential prices come from the booking system and are quoted inclusive of
-- 9% btw. Copied rather than joined: 202608-0003 charges € 90,00 where the
-- band says € 89, because she invoices what was agreed, not what the website
-- advertises. Changing a booking band must never move an invoice price.
insert into public.service_items (name_nl, name_en, segment, unit_cents, vat_rate, sort_order)
values
  ('Algemene schoonmaak · 65 – 99 m²',   'General cleaning · 65 – 99 m²',    'residential',  8900, 9, 1),
  ('Algemene schoonmaak · 100 – 139 m²', 'General cleaning · 100 – 139 m²',  'residential', 11900, 9, 2),
  ('Algemene schoonmaak · 140 – 179 m²', 'General cleaning · 140 – 179 m²',  'residential', 13900, 9, 3),
  ('Algemene schoonmaak · 180 – 200 m²', 'General cleaning · 180 – 200 m²',  'residential', 16900, 9, 4),
  ('Dieptereiniging',                    'Deep cleaning',                    'residential',  6000, 9, 5),
  ('Afwas doen',                         'Washing up',                       'residential',  1200, 9, 6),
  -- Business work never came through the booking form. These two are the only
  -- ones known from invoice 202608-0002; she names the rest herself.
  ('Wissel schoonmaak',                  'Changeover cleaning',              'business',     2850, 21, 1),
  ('Linnen wassen',                      'Linen washing',                    'business',     2300, 21, 2)
on conflict (name_nl, segment) do nothing;

-- Digiboox issued 202608-0001 and -0002 for real; the -0003 she sent was a
-- test and is being deleted there. Seeding last_seq = 2 makes the first
-- invoice from this app 202608-0003.
--
-- ⚠️ If she issues anything further from Digiboox before go-live, bump this on
-- the day. Two systems must never number the same month.
insert into public.invoice_counters (period, last_seq)
values ('202608', 2)
on conflict (period) do nothing;
