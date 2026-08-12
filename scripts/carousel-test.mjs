import { chromium } from 'playwright'
const BASE = process.env.BASE_URL ?? "http://localhost:3113"
const URL = `${BASE}/services/staffing`

async function withPage(reducedMotion, fn) {
  const browser = await chromium.launch()
  const ctx = await browser.newContext({ reducedMotion, viewport: { width: 1280, height: 900 } })
  const page = await ctx.newPage()
  const errs = []
  page.on('pageerror', e => errs.push('PAGEERROR: ' + e.message))
  page.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text()) })
  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.getByRole('group', { name: /staff/i }).scrollIntoViewIfNeeded()
  await page.waitForTimeout(400)
  const r = await fn(page, errs)
  await browser.close()
  return r
}

const counterOf = p => p.locator('[aria-roledescription="carousel"] p').first()

async function sample(page, seconds) {
  const out = []
  for (let i = 0; i < seconds; i++) {
    out.push((await counterOf(page).textContent()).trim().replace(/\s+/g, ''))
    await page.waitForTimeout(1000)
  }
  return out
}

// 1 — advances at ~5s, pointer parked away
const a = await withPage('no-preference', async (page, errs) => {
  await page.mouse.move(5, 5)
  const s = await sample(page, 16)
  return { s, errs }
})
console.log('1. default, pointer away  :', a.s.join(' '))
console.log('   distinct:', new Set(a.s).size, a.errs.length ? 'ERRORS:' + a.errs : '')

// 2 — reduced motion must still advance
const b = await withPage('reduce', async (page) => {
  await page.mouse.move(5, 5)
  return sample(page, 16)
})
console.log('2. reduced motion         :', b.join(' '))
console.log('   distinct:', new Set(b).size)

// 3 — hover must freeze it
const c = await withPage('no-preference', async (page) => {
  await page.getByRole('group', { name: /staff/i }).hover()
  return sample(page, 14)
})
console.log('3. hovered                :', c.join(' '))
console.log('   distinct:', new Set(c).size, '(want 1)')

// 4 — leaving the hover must resume it
const d = await withPage('no-preference', async (page) => {
  const g = page.getByRole('group', { name: /staff/i })
  await g.hover()
  await page.waitForTimeout(6000)
  const frozen = (await counterOf(page).textContent()).trim().replace(/\s+/g, '')
  await page.mouse.move(5, 5)
  const after = await sample(page, 12)
  return { frozen, after }
})
console.log('4. hover 6s then leave    : frozen at', d.frozen, '→', d.after.join(' '))
console.log('   distinct after leaving:', new Set(d.after).size, '(want >1)')

// 5 — the picture actually translates
const e = await withPage('no-preference', async (page) => {
  await page.mouse.move(5, 5)
  const sel = '[aria-roledescription="carousel"] .carousel-slide'
  const before = await page.locator(sel).first().evaluate(n => getComputedStyle(n).transform)
  const trans = await page.locator(sel).first().evaluate(n => getComputedStyle(n).transitionProperty)
  return { before, trans }
})
console.log('5. slide transform        :', e.before, '| transition-property:', e.trans)
