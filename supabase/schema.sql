-- WJ Cleaning Services — booking schema
-- Run once in the Supabase SQL editor. Safe to re-run.

-- Extensions live outside `public` so they cannot collide with app objects.
create schema if not exists extensions;
create extension if not exists btree_gist with schema extensions;

-- ============================================================ pricing

-- Size bands and their prices. Editable from /admin so prices can change
-- without a deploy.
create table if not exists public.pricing_bands (
  id            uuid primary key default gen_random_uuid(),
  min_m2        int  not null,
  max_m2        int  not null,
  label_nl      text not null,
  label_en      text not null,
  base_cents    int  not null,               -- general clean
  deep_cents    int  not null,               -- supplement to add deep cleaning
  sort_order    int  not null,
  active        boolean not null default true,
  constraint band_range_valid check (max_m2 >= min_m2)
);

comment on column public.pricing_bands.deep_cents is
  'Supplement added on top of base_cents. The flyer extras line says +EUR 30 while its
   own table implies +EUR 60/70/80/90; both are seeded below so Jackie can pick.';

-- Everything else that can be added at booking time.
create table if not exists public.addons (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name_nl       text not null,
  name_en       text not null,
  price_cents   int  not null,
  duration_min  int  not null default 0,
  active        boolean not null default true,
  sort_order    int  not null default 0
);

-- Discount codes, so the flyer/QR campaign is trackable.
create table if not exists public.discount_codes (
  id            uuid primary key default gen_random_uuid(),
  code          text unique not null,
  percent_off   int  not null check (percent_off between 1 and 100),
  active        boolean not null default true,
  first_booking_only boolean not null default true,
  expires_at    timestamptz,
  times_used    int  not null default 0
);

-- ============================================================ availability

-- The normal week. weekday: 0 = Sunday .. 6 = Saturday.
create table if not exists public.availability_rules (
  id          uuid primary key default gen_random_uuid(),
  weekday     int  not null check (weekday between 0 and 6),
  start_time  time not null,
  active      boolean not null default true,
  unique (weekday, start_time)
);

-- Exceptions that beat the weekly template.
-- start_time null = the whole day.
create table if not exists public.availability_overrides (
  id          uuid primary key default gen_random_uuid(),
  on_date     date not null,
  start_time  time,
  kind        text not null check (kind in ('block', 'open')),
  reason      text,
  created_at  timestamptz not null default now()
);

create index if not exists availability_overrides_date_idx
  on public.availability_overrides (on_date);

-- ============================================================ bookings

create table if not exists public.customers (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text not null,
  street      text not null,
  postcode    text not null,
  city        text not null,
  marketing_consent_at timestamptz,   -- null = never opted in
  created_at  timestamptz not null default now()
);

create index if not exists customers_email_idx on public.customers (lower(email));

create table if not exists public.bookings (
  id              uuid primary key default gen_random_uuid(),
  reference       text unique not null,
  customer_id     uuid not null references public.customers(id) on delete cascade,

  band_id         uuid not null references public.pricing_bands(id),
  m2_label        text not null,              -- snapshot, survives band edits
  deep_cleaning   boolean not null default false,

  starts_at       timestamptz not null,
  ends_at         timestamptz not null,
  duration_min    int not null,

  status          text not null default 'confirmed'
                  check (status in ('confirmed','rescheduled','completed','cancelled','no_show')),

  -- money is snapshotted so changing prices never rewrites history
  subtotal_cents  int not null,
  discount_cents  int not null default 0,
  total_cents     int not null,
  discount_code   text,

  language        text not null default 'nl' check (language in ('nl','en')),
  notes           text,
  manage_token    text unique not null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  constraint booking_ends_after_start check (ends_at > starts_at)
);

-- The real double-booking guard. Two simultaneous submissions for overlapping
-- times cannot both commit — Postgres rejects the second. Application-level
-- "check then insert" cannot make that promise.
alter table public.bookings drop constraint if exists bookings_no_overlap;
alter table public.bookings add constraint bookings_no_overlap
  exclude using gist (tstzrange(starts_at, ends_at) with &&)
  where (status in ('confirmed','rescheduled'));

create index if not exists bookings_starts_at_idx on public.bookings (starts_at);
create index if not exists bookings_status_idx on public.bookings (status);

create table if not exists public.booking_addons (
  booking_id   uuid not null references public.bookings(id) on delete cascade,
  addon_id     uuid not null references public.addons(id),
  name_en      text not null,        -- snapshot
  price_cents  int  not null,        -- snapshot
  primary key (booking_id, addon_id)
);

-- Idempotency for the reminder cron: without this a retry double-sends.
create table if not exists public.reminders_sent (
  booking_id  uuid not null references public.bookings(id) on delete cascade,
  kind        text not null check (kind in ('24h','6h')),
  sent_at     timestamptz not null default now(),
  primary key (booking_id, kind)
);

-- ============================================================ RLS
-- Nothing below relies on application code being correct. Postgres refuses
-- the rows regardless of what the app asks for.

alter table public.customers            enable row level security;
alter table public.bookings             enable row level security;
alter table public.booking_addons       enable row level security;
alter table public.reminders_sent       enable row level security;
alter table public.pricing_bands        enable row level security;
alter table public.addons               enable row level security;
alter table public.discount_codes       enable row level security;
alter table public.availability_rules   enable row level security;
alter table public.availability_overrides enable row level security;

-- Anonymous visitors may read what the booking form needs to show a price,
-- and nothing else. No policy grants anon any access to customers or bookings,
-- so home addresses are unreadable from the browser even with the anon key.
drop policy if exists "public reads active bands" on public.pricing_bands;
create policy "public reads active bands" on public.pricing_bands
  for select to anon, authenticated using (active);

drop policy if exists "public reads active addons" on public.addons;
create policy "public reads active addons" on public.addons
  for select to anon, authenticated using (active);

drop policy if exists "public reads availability rules" on public.availability_rules;
create policy "public reads availability rules" on public.availability_rules
  for select to anon, authenticated using (active);

drop policy if exists "public reads availability overrides" on public.availability_overrides;
create policy "public reads availability overrides" on public.availability_overrides
  for select to anon, authenticated using (true);

-- Admin access is an explicit allowlist, not "is signed in".
--
-- Supabase allows public signup by default, so a policy of `to authenticated
-- using (true)` would let anyone who registered read every customer address.
-- Access is granted per-user instead.

create table if not exists public.admin_users (
  user_id  uuid primary key references auth.users(id) on delete cascade,
  email    text,
  added_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;

-- Lives in `private` rather than `public`: PostgREST exposes public, so a
-- SECURITY DEFINER function there is reachable at /rest/v1/rpc/. It is
-- SECURITY DEFINER so the check does not re-enter RLS on admin_users, and its
-- search_path is pinned so it cannot be hijacked by a shadowing schema.
create schema if not exists private;
revoke all on schema private from anon, authenticated;
grant usage on schema private to authenticated;

create or replace function private.is_admin()
returns boolean language sql stable security definer set search_path = public as $fn$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$fn$;

revoke all on function private.is_admin() from public, anon;
grant execute on function private.is_admin() to authenticated;

drop policy if exists "admins read admin list" on public.admin_users;
create policy "admins read admin list" on public.admin_users
  for select to authenticated using (private.is_admin());

do $$
declare t text;
begin
  foreach t in array array[
    'customers','bookings','booking_addons','reminders_sent',
    'pricing_bands','addons','discount_codes',
    'availability_rules','availability_overrides'
  ] loop
    execute format('drop policy if exists "authenticated full access" on public.%I', t);
    execute format('drop policy if exists "admin full access" on public.%I', t);
    execute format(
      'create policy "admin full access" on public.%I
         for all to authenticated
         using (private.is_admin()) with check (private.is_admin())', t);
  end loop;
end $$;

-- ============================================================ seed

insert into public.pricing_bands (min_m2, max_m2, label_nl, label_en, base_cents, deep_cents, sort_order)
values
  (65,   99, '65 – 99 m²',   '65 – 99 m²',   8900,  6000, 1),
  (100, 139, '100 – 139 m²', '100 – 139 m²', 11900, 7000, 2),
  (140, 179, '140 – 179 m²', '140 – 179 m²', 13900, 8000, 3),
  (180, 200, '180 – 200 m²', '180 – 200 m²', 16900, 9000, 4)
on conflict do nothing;

insert into public.addons (slug, name_nl, name_en, price_cents, duration_min, sort_order)
values
  ('deep-cleaning', 'Dieptereiniging', 'Deep cleaning', 6000, 60, 1),
  ('washing-up',    'Afwas doen',      'Washing up',    1200, 30, 2)
on conflict (slug) do nothing;

-- Mon–Sat, three starts a day. Jackie changes this from /admin.
insert into public.availability_rules (weekday, start_time)
select d, t
from generate_series(1, 6) as d,
     unnest(array['09:00'::time, '12:00'::time, '15:00'::time]) as t
on conflict (weekday, start_time) do nothing;

insert into public.discount_codes (code, percent_off, first_booking_only)
values ('WELKOM20', 20, true)
on conflict (code) do nothing;
