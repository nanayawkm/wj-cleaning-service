import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const env = {}
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const t = line.trim()
  if (!t || t.startsWith('#')) continue
  const i = t.indexOf('=')
  if (i > 0) env[t.slice(0, i).trim()] = t.slice(i + 1).trim().replace(/^["']|["']$/g, '')
}

const BASE = 'http://localhost:3000'
const TO = process.argv[2]
if (!TO) {
  console.log('usage: node scripts/e2e-booking.mjs you@example.com')
  process.exit(1)
}

const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

const { data: bands } = await admin.from('pricing_bands').select('*').order('sort_order')
const band = bands[1] // 100–139 m², €119

const avail = await (await fetch(`${BASE}/api/availability?days=14&deep=true`)).json()
const slot = avail.days.flatMap((d) => d.slots).find((s) => s.available)
console.log(`\nbooking ${band.label_en} + deep cleaning`)
console.log(`slot     ${slot.startsAtISO}  (${slot.time}–${slot.endTime})`)
console.log(`duration ${avail.durationMin} min`)

const res = await fetch(`${BASE}/api/bookings`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '203.0.113.200' },
  body: JSON.stringify({
    bandId: band.id,
    deepCleaning: true,
    addonSlugs: ['washing-up'],
    startsAt: slot.startsAtISO,
    discountCode: 'WELKOM20',
    language: 'en',
    customer: {
      name: 'End To End Test',
      email: TO,
      phone: '06-12345678',
      street: 'Teststraat 42',
      postcode: '8232 AA',
      city: 'Lelystad',
    },
    notes: 'Key is under the mat. Please mind the cat.',
    marketingConsent: true,
  }),
})

const body = await res.json()
console.log(`\nHTTP ${res.status}`)
if (!res.ok) {
  console.log(body)
  process.exit(1)
}

console.log(`reference ${body.reference}`)
console.log(`total     €${(body.totalCents / 100).toFixed(2)}`)

const { data: b } = await admin
  .from('bookings')
  .select('*, customers(name,email,street,city,marketing_consent_at), booking_addons(name_en,price_cents)')
  .eq('reference', body.reference)
  .single()

console.log('\n— stored —')
console.log(`  status         ${b.status}`)
console.log(`  m² label       ${b.m2_label}`)
console.log(`  deep cleaning  ${b.deep_cleaning}`)
console.log(`  add-ons        ${b.booking_addons.map((a) => `${a.name_en} €${(a.price_cents / 100).toFixed(2)}`).join(', ') || 'none'}`)
console.log(`  subtotal       €${(b.subtotal_cents / 100).toFixed(2)}`)
console.log(`  discount       −€${(b.discount_cents / 100).toFixed(2)}  (${b.discount_code})`)
console.log(`  total          €${(b.total_cents / 100).toFixed(2)}`)
console.log(`  duration       ${b.duration_min} min`)
console.log(`  blocked until  ${b.ends_at}   (includes 30 min travel buffer)`)
console.log(`  consent        ${b.customers.marketing_consent_at ? 'given' : 'not given'}`)

// expected: 11900 + 7000 + 1200 = 20100, less 20% = 16080
const expected = band.base_cents + band.deep_cents + 1200
const expectedTotal = expected - Math.round(expected * 0.2)
console.log(`\n  arithmetic     ${b.total_cents === expectedTotal ? 'PASS' : 'FAIL'}  expected €${(expectedTotal / 100).toFixed(2)}`)

// the slot must now be gone for everyone else
const after = await (await fetch(`${BASE}/api/availability?days=14&deep=true`)).json()
const same = after.days.flatMap((d) => d.slots).find((s) => s.startsAtISO === slot.startsAtISO)
console.log(`  slot now       ${same?.available ? 'STILL FREE (FAIL)' : `taken (${same?.reason}) — correct`}`)

console.log(`\nemail sent to ${TO} — check the inbox, including the .ics attachment.`)
console.log(`manage link:  ${BASE}/booking/manage?token=${encodeURIComponent(body.token)}`)
console.log(`\nto remove this test booking:`)
console.log(`  node -e "import('@supabase/supabase-js').then(async m=>{const c=m.createClient('${env.NEXT_PUBLIC_SUPABASE_URL}',process.env.K);await c.from('customers').delete().eq('id','${b.customer_id}')})"`)
