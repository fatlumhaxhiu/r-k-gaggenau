// Run against the isolated local-test-server --tracking only.
import { chromium } from '@playwright/test'
import assert from 'node:assert/strict'
import { readFile, mkdir } from 'node:fs/promises'
const origin = 'http://127.0.0.1:3117'
const paths = ['/', '/kontakt', '/uber-uns', '/leistungen', '/magazin', '/datenschutz', '/thank-you',
  ...['baureinigung', 'gewerbereinigung', 'grundreinigung', 'privatreinigung', 'saisonale-pflege', 'spezialreinigung'].map(p => `/landing/${p}`),
  '/admin/admin-login']
const browser = await chromium.launch({ headless: true })
const failures = []
const report = []
await mkdir('.local-tests/screenshots', { recursive: true })
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  let external = []
  let errors = []
  await context.route('**/*', route => {
    const url = new URL(route.request().url())
    if (url.origin !== origin) { external.push(url.href); return route.abort() }
    return route.continue()
  })
  const page = await context.newPage()
  page.on('pageerror', e => errors.push(e.message))
  for (const pathname of paths) {
    external = []; errors = []
    try {
      const response = await page.goto(origin + pathname, { waitUntil: 'networkidle', timeout: 90000 })
      assert.equal(response.status(), 200)
      // Scroll images into view without mutating attributes during React hydration.
      for (const img of await page.locator('img:visible').all()) {
        await img.scrollIntoViewIfNeeded()
        await img.evaluate(image => image.decode().catch(() => {}))
      }
      await page.evaluate(async () => {
        await document.fonts.ready
      })
      const broken = await page.locator('img:visible').evaluateAll(imgs => imgs.filter(i => !i.complete || i.naturalWidth === 0).map(i => i.getAttribute('src')))
      assert.deepEqual(external, [], 'Unexpected external request')
      assert.deepEqual(errors, [], 'Browser error')
      assert.deepEqual(broken, [], 'Broken image')
      if (pathname.startsWith('/landing/')) {
        const icon = page.locator('.material-symbols-outlined').first()
        if (await icon.count()) assert.ok(await page.evaluate(() => document.fonts.check('24px "Material Symbols Outlined"')), 'Missing symbol font')
      }
      if (pathname === '/landing/gewerbereinigung') {
        await page.getByRole('button', { name: 'Nur notwendige', exact: true }).click()
        for (const [label, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
          await page.setViewportSize({ width, height }); await page.evaluate(() => scrollTo(0, 0))
          await page.screenshot({ path: `.local-tests/screenshots/local-assets-${label}.png` })
        }
        await page.setViewportSize({ width: 1440, height: 1000 })
      }
      report.push({ path: pathname, result: 'pass' }); console.log(`PASS ${pathname}`)
    } catch (e) { failures.push({ path: pathname, error: e.message, external }); console.log(`FAIL ${pathname}: ${e.message}`) }
  }
  const manifest = JSON.parse(await readFile('docs/local-assets.json', 'utf8'))
  for (const item of [...manifest.images, ...manifest.fonts]) {
    const response = await context.request.get(origin + item.local)
    assert.equal(response.status(), 200, item.local)
    assert.equal((await response.body()).length, item.bytes, item.local)
  }
  assert.deepEqual(failures, [])
  console.log(`PASS: ${report.length} routes without external requests; all ${manifest.images.length + manifest.fonts.length} manifest assets served.`)
} finally { await browser.close() }
