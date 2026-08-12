/**
 * DESIGN.md §5 / §10 regression sweep.
 *
 * §5 claims "no horizontal scroll at 320 / 390 / 768 / 1024 / 1280 / 1440 / 1920"
 * and §10 claims a 44px touch-target floor. Both were verified once, by hand, on
 * the pages that existed then. This re-checks every page at every width and
 * names the element at fault, so the claim stays true as pages change.
 *
 * Inline links inside running text are skipped: WCAG 2.5.8 exempts them, and
 * counting them buries the real control failures under every "contact us at
 * <email>" on the site.
 */
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL ?? 'http://localhost:3113'
const PAGES = ['/', '/about', '/services', '/services/cleaning', '/services/staffing',
               '/careers', '/contact', '/book', '/privacy', '/terms', '/cookies']
const WIDTHS = [320, 390, 768, 1024, 1280, 1440, 1920]

const browser = await chromium.launch()
const overflow = [], small = new Map(), errors = new Map()

for (const width of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } })
  const page = await ctx.newPage()
  let current = ''
  page.on('pageerror', e => errors.set(current, (e.message || '').slice(0, 80)))

  for (const path of PAGES) {
    current = path
    await page.goto(BASE + path, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(250)

    const res = await page.evaluate(w => {
      const doc = document.documentElement
      const scrolls = doc.scrollWidth > doc.clientWidth + 1
      let worst = null
      if (scrolls) {
        for (const el of document.querySelectorAll('body *')) {
          const r = el.getBoundingClientRect()
          if (r.right > w + 1 && r.width > 0) {
            const over = r.right - w
            if (!worst || over > worst.over) worst = {
              over: Math.round(over), tag: el.tagName.toLowerCase(),
              cls: (el.className?.baseVal ?? el.className ?? '').toString().slice(0, 80),
            }
          }
        }
      }
      const tiny = []
      for (const el of document.querySelectorAll('a[href], button, input, select, textarea')) {
        const r = el.getBoundingClientRect()
        if (r.width === 0 || r.height === 0) continue
        const cs = getComputedStyle(el)
        if (cs.display === 'inline') continue            // WCAG 2.5.8 exemption
        if (cs.opacity === '0' || cs.visibility === 'hidden') continue
        if (r.height < 44) {
          const label = (el.getAttribute('aria-label') || el.textContent || el.type || '').trim().slice(0, 30)
          tiny.push(`${el.tagName.toLowerCase()}[${Math.round(r.height)}px] "${label}"`)
        }
      }
      return { scrolls, worst, doc: doc.scrollWidth, tiny: [...new Set(tiny)] }
    }, width)

    if (res.scrolls) overflow.push({ width, path, doc: res.doc, worst: res.worst })
    for (const t of res.tiny) {
      const k = `${path}  ${t}`
      if (!small.has(k)) small.set(k, [])
      small.get(k).push(width)
    }
  }
  await ctx.close()
}
await browser.close()

console.log(`\n=== §5  horizontal scroll — ${PAGES.length} pages x ${WIDTHS.length} widths ===`)
if (!overflow.length) console.log('  CLEAN: no page scrolls sideways at any tested width')
for (const o of overflow) console.log(`  FAIL ${o.path} @${o.width}px  scrollWidth=${o.doc}  worst <${o.worst?.tag}> +${o.worst?.over}px  ${o.worst?.cls}`)

console.log('\n=== §10  controls under the 44px floor (inline text links excluded) ===')
if (!small.size) console.log('  CLEAN')
for (const [k, ws] of [...small.entries()].sort()) console.log(`  ${k}  @ ${ws.join(',')}`)

console.log('\n=== pages that threw ===')
console.log(errors.size ? [...errors].map(([p, m]) => `  ${p}: ${m}`).join('\n') : '  none')
