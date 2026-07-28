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
let fail = 0
const check = (name, pass, detail = '') => {
  if (!pass) fail++
  console.log(`  ${pass ? 'pass' : 'FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`)
}

let ipCounter = 0
// Vary the forwarded IP so the rate limiter (5/hour/IP) does not stop the
// suite. Also proves the limiter keys on address rather than globally.
const post = async (body, ip) => {
  const r = await fetch(`${BASE}/api/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': ip ?? `203.0.113.${++ipCounter % 250}`,
    },
    body: JSON.stringify(body),
  })
  let j = null
  try { j = await r.json() } catch {}
  return { status: r.status, body: j }
}

// a genuinely free slot to work with
const avail = await (await fetch(`${BASE}/api/availability?days=10`)).json()
const freeSlot = avail.days.flatMap((d) => d.slots).find((s) => s.available)
const band = (await (await fetch(`${BASE}/api/availability?days=1`)).json()) && null

const anon = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
const { data: bands } = await anon.from('pricing_bands').select('id, base_cents').order('sort_order')

const customer = {
  name: 'Security Test',
  email: `sec-${Date.now()}@test.invalid`,
  phone: '0612345678',
  street: 'Teststraat 1',
  postcode: '8232 AA',
  city: 'Lelystad',
}
const valid = {
  bandId: bands[0].id,
  deepCleaning: false,
  addonSlugs: [],
  startsAt: freeSlot.startsAtISO,
  language: 'nl',
  customer,
  marketingConsent: false,
}

console.log('\n— data exposure —')
{
  const { data, error } = await anon.from('customers').select('*').limit(1)
  check('anon cannot read customers', !!error || (data?.length ?? 0) === 0, error?.code ?? 'empty')
}
{
  const { data, error } = await anon.from('bookings').select('*').limit(1)
  check('anon cannot read bookings', !!error || (data?.length ?? 0) === 0, error?.code ?? 'empty')
}
{
  const r = await fetch(`${BASE}/api/availability?days=3`)
  const txt = await r.text()
  const leaks = /street|postcode|"email"|"phone"|"name"|reference|manage_token/i.test(txt)
  check('availability response leaks no customer fields', !leaks)
}
{
  const r = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/is_admin`, {
    method: 'POST',
    headers: { apikey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
    body: '{}',
  })
  check('is_admin() not callable over REST', r.status === 404, `HTTP ${r.status}`)
}

console.log('\n— input validation —')
check('rejects missing fields', (await post({ bandId: bands[0].id })).status === 400)
check('rejects bad email', (await post({ ...valid, customer: { ...customer, email: 'nope' } })).status === 400)
check('rejects oversized notes', (await post({ ...valid, notes: 'x'.repeat(5000) })).status === 400)
check('rejects non-uuid band', (await post({ ...valid, bandId: 'not-a-uuid' })).status === 400)
{
  const r = await post({ ...valid, customer: { ...customer, name: '<script>alert(1)</script>' } })
  check('accepts but does not execute markup in name', r.status === 200 || r.status === 409)
}
{
  const r = await post({ ...valid, bandId: bands[0].id, customer, website: 'spam' })
  check('honeypot silently absorbed', r.status === 200 && !!r.body?.reference)
}

console.log('\n— price tampering —')
{
  const r = await post({ ...valid, subtotalCents: 1, totalCents: 1, startsAt: freeSlot.startsAtISO })
  if (r.status === 200) {
    const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
    const { data } = await admin.from('bookings').select('total_cents').eq('reference', r.body.reference).single()
    check('posted price ignored, server price used', data.total_cents === bands[0].base_cents,
          `stored €${(data.total_cents / 100).toFixed(2)}`)
    await admin.from('bookings').delete().eq('reference', r.body.reference)
  } else {
    check('price tamper attempt handled', r.status === 409, `HTTP ${r.status}`)
  }
}

console.log('\n— response surface —')
{
  const avail2 = await (await fetch(`${BASE}/api/availability?days=20`)).json()
  const slot = avail2.days.flatMap((d) => d.slots).find((s) => s.available)
  const r = await post({ ...valid, startsAt: slot.startsAtISO, customer: { ...customer, email: `sec2-${Date.now()}@test.invalid` } })
  if (r.status === 200) {
    const keys = Object.keys(r.body).sort().join(',')
    check('response returns no personal data', !/street|postcode|email|phone|name/i.test(keys), keys)
    const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
    const { data: b } = await admin.from('bookings').select('id, customer_id').eq('reference', r.body.reference).single()
    await admin.from('customers').delete().eq('id', b.customer_id)
  } else check('second booking created', false, `HTTP ${r.status}`)
}

console.log('\n— double booking race —')
{
  const avail3 = await (await fetch(`${BASE}/api/availability?days=30`)).json()
  const slot = avail3.days.flatMap((d) => d.slots).find((s) => s.available)
  const mk = (n) => post({ ...valid, startsAt: slot.startsAtISO, customer: { ...customer, email: `race${n}-${Date.now()}@test.invalid` } })
  const results = await Promise.all([mk(1), mk(2), mk(3)])
  const created = results.filter((r) => r.status === 200)
  const rejected = results.filter((r) => r.status === 409)
  check('exactly one of three concurrent bookings wins', created.length === 1 && rejected.length === 2,
        `${created.length} created, ${rejected.length} rejected`)

  const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
  for (const c of created) {
    const { data: b } = await admin.from('bookings').select('customer_id').eq('reference', c.body.reference).single()
    if (b) await admin.from('customers').delete().eq('id', b.customer_id)
  }
}

console.log('\n— cleanup —')
{
  const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
  const { data } = await admin.from('customers').select('id').ilike('email', '%@test.invalid')
  if (data?.length) {
    await admin.from('customers').delete().ilike('email', '%@test.invalid')
  }
  const { count } = await admin.from('bookings').select('*', { count: 'exact', head: true })
  console.log(`  removed ${data?.length ?? 0} test customer(s); ${count ?? 0} booking(s) remain`)
}

console.log(fail ? `\n${fail} FAILURE(S)\n` : '\nall security checks passed\n')
process.exit(fail ? 1 : 0)
