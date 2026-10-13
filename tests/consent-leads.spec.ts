import { test, expect, type Page } from '@playwright/test'
import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'node:crypto'

const prisma = new PrismaClient({ datasourceUrl: 'postgresql://rk_test:local_synthetic_only@127.0.0.1:55449/rk_forms_test' })
test.afterAll(() => prisma.$disconnect())
test.beforeEach(async ({ context }) => {
  // Exercise the real loader/queue without sending test traffic to Google.
  await context.route('**/*', async route => {
    const url = new URL(route.request().url())
    if (url.hostname === '127.0.0.1') return route.continue()
    if (url.hostname === 'www.googletagmanager.com') return route.fulfill({ contentType: 'application/javascript', body: '// Local mock; no external transmission.' })
    return route.abort()
  })
})
const payload = () => ({ full_name: 'TEST Consent', email: `test-consent-${randomUUID()}@example.invalid`, phone: '+49 000000', city: 'Gaggenau', service_requested: 'Grundreinigung', object_type: 'Büro', source_page: '/kontakt' })
async function fill(page: Page, email: string) {
  const form = page.locator('form')
  await form.locator('[name=full_name]').fill('TEST Consent')
  await form.locator('[name=email]').fill(email)
  await form.locator('[name=phone]').fill('+49 000000')
  await form.locator('[name=city]').fill('Gaggenau')
  await form.locator('[name=service_requested]').selectOption('Grundreinigung')
  await form.locator('[name=object_type]').selectOption({ label: 'Wohnung / Haus' })
  if (await form.locator('textarea').count()) await form.locator('textarea').fill('TEST synthetic request')
}
async function events(page: Page) {
  return page.evaluate(() => ((window as Window & {dataLayer?: Array<ArrayLike<unknown>>}).dataLayer || []).map(row => Array.from(row)).filter(row => row[0] === 'event'))
}
async function metaEvents(page: Page) {
  return page.evaluate(() => (window as Window & {fbq?: {queue: unknown[][]}}).fbq?.queue || [])
}

test('Meta requires a fresh marketing choice; saved lead sends one opaque Lead; reload sends none', async ({page,context}) => {
  await context.addInitScript(() => localStorage.setItem('rk_consent_v1',JSON.stringify({version:1,analytics:true,marketing:true,savedAt:Date.now()})))
  await page.goto('/kontakt')
  await expect(page.getByRole('dialog',{name:'Ihre Cookie-Einstellungen'})).toBeVisible()
  await expect(page.locator('#rk-meta-pixel')).toHaveCount(0)
  await page.getByRole('checkbox',{name:'Marketing (Google Ads und Meta)',exact:true}).check()
  await page.getByRole('button',{name:'Auswahl speichern',exact:true}).click()
  await expect(page.locator('#rk-meta-pixel')).toHaveCount(1)
  await expect(page.locator('#rk-google-tag')).toHaveCount(0)
  const email = payload().email
  await fill(page,email)
  await page.getByRole('button',{name:'Kostenlose Beratung anfragen',exact:true}).click()
  await expect(page).toHaveURL(/\/thank-you$/)
  const rows = await metaEvents(page)
  expect(rows).toContainEqual(['set','autoConfig',false,'1408138801461432'])
  const leads = rows.filter(row => row[2] === 'Lead')
  expect(leads).toHaveLength(1)
  expect(leads[0][3]).toEqual({})
  expect(leads[0][4]).toEqual({eventID:expect.stringMatching(/^[a-f0-9]{64}$/)})
  expect(JSON.stringify(rows)).not.toContain(email)
  expect(await prisma.lead.count({where:{email}})).toBe(1)
  await page.reload()
  expect((await metaEvents(page)).filter(row => row[2] === 'Lead')).toHaveLength(0)
})

test('Meta stays absent with analytics alone, unsafe URL and admin; withdrawal removes Meta cookies', async ({page,context}) => {
  await page.goto('/kontakt')
  await page.getByRole('checkbox',{name:'Statistik (Google Analytics)',exact:true}).check()
  await page.getByRole('button',{name:'Auswahl speichern',exact:true}).click()
  await expect(page.locator('#rk-google-tag')).toHaveCount(1)
  await expect(page.locator('#rk-meta-pixel')).toHaveCount(0)
  await page.getByRole('button',{name:'Cookie-Einstellungen',exact:true}).click()
  await page.getByRole('button',{name:'Alle akzeptieren',exact:true}).click()
  await expect(page.locator('#rk-meta-pixel')).toHaveCount(1)
  await context.addCookies([{name:'_fbp',value:'synthetic',url:'http://127.0.0.1:3117'}, {name:'_fbc',value:'synthetic',url:'http://127.0.0.1:3117'}])
  await page.getByRole('button',{name:'Cookie-Einstellungen',exact:true}).click()
  await page.getByRole('button',{name:'Nur notwendige',exact:true}).click()
  await expect(page.locator('#rk-meta-pixel')).toHaveCount(0)
  expect((await context.cookies()).filter(c => /^_fb[pc]$/.test(c.name))).toEqual([])
  await page.goto('/kontakt?email=private@example.invalid')
  await page.getByRole('button',{name:'Cookie-Einstellungen',exact:true}).click()
  await page.getByRole('button',{name:'Alle akzeptieren',exact:true}).click()
  await expect(page.locator('#rk-google-tag')).toHaveCount(1)
  await expect(page.locator('#rk-meta-pixel')).toHaveCount(0)
  await page.goto('/admin/admin-login')
  await expect(page.locator('#rk-meta-pixel')).toHaveCount(0)
})

test('no choice and rejection load no tag; rejected consent still saves a lead', async ({ page }) => {
  const requests: string[] = []
  page.on('request', request => { if (/googletagmanager|google-analytics|doubleclick|facebook/.test(request.url())) requests.push(request.url()) })
  await page.goto('/kontakt?utm_source=google&utm_medium=cpc&utm_campaign=TEST')
  await expect(page.getByRole('dialog', { name: 'Ihre Cookie-Einstellungen' })).toBeVisible()
  await expect(page.locator('script#rk-google-tag')).toHaveCount(0)
  await page.getByRole('button', { name: 'Nur notwendige', exact: true }).click()
  const email = payload().email
  await fill(page, email)
  await page.getByRole('button', { name: 'Kostenlose Beratung anfragen', exact: true }).click()
  await expect(page).toHaveURL(/\/thank-you$/)
  expect(await prisma.lead.count({ where: { email } })).toBe(1)
  expect(await events(page)).toEqual([])
  expect(requests).toEqual([])
  expect(await page.evaluate(() => sessionStorage.getItem('rk_marketing_attribution'))).toBeNull()
  await page.reload()
  await expect(page.getByRole('dialog', { name: 'Ihre Cookie-Einstellungen' })).toHaveCount(0)
  expect(requests).toEqual([])
})

for (const route of ['/kontakt', '/landing/gewerbereinigung']) {
  test(`consented success emits one PII-free lead event; thank-you reload emits none ${route}`, async ({ page }) => {
    await page.goto(`${route}?email=private@example.invalid&utm_source=google&utm_medium=cpc&utm_campaign=TEST`)
    await page.getByRole('button', { name: 'Alle akzeptieren', exact: true }).click()
    await expect(page.locator('script#rk-google-tag')).toHaveCount(1)
    const email = payload().email
    await fill(page, email)
    await page.getByRole('button', { name: 'Kostenlose Beratung anfragen', exact: true }).click()
    await expect(page).toHaveURL(/\/thank-you$/)
    const rows = await events(page)
    expect(rows.filter(row => row[1] === 'generate_lead')).toHaveLength(1)
    expect(JSON.stringify(rows)).not.toContain(email)
    expect(JSON.stringify(rows)).not.toContain('private@example.invalid')
    expect(JSON.stringify(rows)).not.toContain('TEST Consent')
    expect(rows.filter(row => row[1] === 'conversion')).toHaveLength(0)
    expect(await prisma.lead.count({ where: { email } })).toBe(1)
    await page.reload()
    await expect(page.locator('script#rk-google-tag')).toHaveCount(1)
    expect((await events(page)).filter(row => row[1] === 'generate_lead')).toHaveLength(0)
    await page.goto('/thank-you')
    await expect(page.locator('script#rk-google-tag')).toHaveCount(1)
    expect((await events(page)).filter(row => row[1] === 'generate_lead')).toHaveLength(0)
  })
}

test('failed request has no lead event; retry keeps its request key', async ({ page }) => {
  await page.goto('/kontakt')
  await page.getByRole('button', { name: 'Alle akzeptieren', exact: true }).click()
  await fill(page, payload().email)
  const keys: string[] = []
  await page.route('**/api/leads', async route => {
    keys.push(route.request().headers()['idempotency-key'])
    await route.fulfill({ status: 500, json: { error: 'TEST' } })
  })
  const button = page.getByRole('button', { name: 'Kostenlose Beratung anfragen', exact: true })
  await button.click()
  await expect(page.getByText('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.', { exact: true })).toBeVisible()
  await button.click()
  await expect.poll(() => keys.length).toBe(2)
  expect(keys[0]).toBe(keys[1])
  expect((await events(page)).filter(row => row[1] === 'generate_lead')).toHaveLength(0)
  expect((await metaEvents(page)).filter(row => row[2] === 'Lead')).toHaveLength(0)
})

test('withdrawal removes trackers after reload; admin pages never load tracking', async ({ page }) => {
  await page.goto('/kontakt')
  await page.getByRole('button', { name: 'Alle akzeptieren', exact: true }).click()
  await expect(page.locator('script#rk-google-tag')).toHaveCount(1)
  await page.getByRole('button', { name: 'Cookie-Einstellungen', exact: true }).click()
  await page.getByRole('button', { name: 'Nur notwendige', exact: true }).click()
  await expect(page.locator('script#rk-google-tag')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Cookie-Einstellungen', exact: true })).toBeVisible()
  expect(await events(page)).toEqual([])
  await page.goto('/admin/admin-login')
  await expect(page.locator('script#rk-google-tag')).toHaveCount(0)
})

test('API retries and concurrent requests persist one row; conflicting reuse fails', async ({ request }) => {
  const data = payload(), key = randomUUID()
  const options = { data, headers: { 'Idempotency-Key': key } }
  const responses = await Promise.all([request.post('/api/leads', options), request.post('/api/leads', options)])
  expect(responses.map(response => response.status())).toEqual([201, 201])
  const bodies = await Promise.all(responses.map(response => response.json()))
  expect(bodies[0]).toEqual(bodies[1])
  expect(bodies[0].event_id).toMatch(/^[a-f0-9]{64}$/)
  expect(await prisma.lead.count({ where: { email: data.email } })).toBe(1)
  expect((await request.post('/api/leads', { ...options, data: { ...data, city: 'Rastatt' } })).status()).toBe(409)
  expect((await request.post('/api/leads', { ...options, headers: { 'Idempotency-Key': 'invalid' } })).status()).toBe(400)
})

test('mobile banner fits and marketing consent without paid UTM does not label fbclid as ads', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/kontakt?fbclid=organic-test')
  await expect(page.getByRole('dialog', { name: 'Ihre Cookie-Einstellungen' })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: '.local-tests/screenshots/consent-mobile.png', fullPage: false })
  await page.getByRole('button', { name: 'Alle akzeptieren', exact: true }).click()
  expect(await page.evaluate(() => JSON.parse(sessionStorage.getItem('rk_marketing_attribution') || '{}').marketing_channel)).toBe('Direkt / Unbekannt')
})

test('analytics-only consent keeps ads denied and preserves safe campaign fields', async ({ page }) => {
  await page.goto('/kontakt?utm_source=google&utm_medium=cpc&utm_campaign=TEST_cleaning&email=private@example.invalid')
  await page.getByRole('checkbox', { name: 'Statistik (Google Analytics)', exact: true }).check()
  await page.getByRole('button', { name: 'Auswahl speichern', exact: true }).click()
  await expect(page.locator('script#rk-google-tag')).toHaveCount(1)
  const rows = await page.evaluate(() => ((window as Window & {dataLayer?: Array<ArrayLike<unknown>>}).dataLayer || []).map(row => Array.from(row)))
  const update = rows.find(row => row[0] === 'consent' && row[1] === 'update')
  expect(update?.[2]).toMatchObject({analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'})
  expect(JSON.stringify(rows)).toContain('utm_campaign=TEST_cleaning')
  expect(JSON.stringify(rows)).not.toContain('private@example.invalid')
  expect(await page.evaluate(() => sessionStorage.getItem('rk_marketing_attribution'))).toBeNull()
  await page.setViewportSize({width:1440,height:1000})
  await page.getByRole('button',{name:'Cookie-Einstellungen',exact:true}).click()
  await page.screenshot({path:'.local-tests/screenshots/consent-desktop.png'})
})

test('marketing-only choice does not start analytics or unconfigured Ads', async ({page}) => {
  await page.goto('/kontakt?utm_source=meta&utm_medium=paid_social&utm_campaign=TEST')
  await page.getByRole('checkbox',{name:'Marketing (Google Ads und Meta)',exact:true}).check()
  await page.getByRole('button',{name:'Auswahl speichern',exact:true}).click()
  await expect(page.locator('script#rk-google-tag')).toHaveCount(0)
  expect(await events(page)).toEqual([])
  expect(await page.evaluate(() => JSON.parse(sessionStorage.getItem('rk_marketing_attribution') || '{}').marketing_channel)).toBe('Facebook Ads')
})

test('expired consent requests a new choice; blocked storage still allows rejection and form use', async ({page,context}) => {
  await context.addInitScript(() => localStorage.setItem('rk_consent_v1',JSON.stringify({version:1,analytics:true,marketing:true,savedAt:1})))
  await page.goto('/kontakt')
  await expect(page.getByRole('dialog',{name:'Ihre Cookie-Einstellungen'})).toBeVisible()
  await expect(page.locator('script#rk-google-tag')).toHaveCount(0)
  await page.evaluate(() => {
    Storage.prototype.getItem = () => { throw new Error('TEST blocked storage') }
    Storage.prototype.setItem = () => { throw new Error('TEST blocked storage') }
  })
  await page.getByRole('button',{name:'Nur notwendige',exact:true}).click()
  await expect(page.getByRole('dialog',{name:'Ihre Cookie-Einstellungen'})).toHaveCount(0)
  const email = payload().email
  await fill(page,email)
  await page.getByRole('button',{name:'Kostenlose Beratung anfragen',exact:true}).click()
  await expect(page).toHaveURL(/\/thank-you$/)
  expect(await prisma.lead.count({where:{email}})).toBe(1)
})

// Mock only persistence here: these cases exercise the real landing CTA, form and Pixel queue.
const metaLandingPages = [
  { route: '/landing/baureinigung', service: 'Baureinigung', anchor: '#contact' },
  { route: '/landing/gewerbereinigung', service: 'Gewerbereinigung', anchor: '#contact' },
  { route: '/landing/grundreinigung', service: 'Grundreinigung', anchor: '#appointment' },
  { route: '/landing/privatreinigung', service: 'Privatreinigung', anchor: '#contact' },
  { route: '/landing/saisonale-pflege', service: 'Saisonale Pflege', anchor: '#contact' },
  { route: '/landing/spezialreinigung', service: 'Spezialreinigung', anchor: '#contact' },
]

for (const [index, landing] of metaLandingPages.entries()) {
  for (const mobile of (landing.service === 'Grundreinigung' ? [false, true] : [false])) {
  test(`Meta landing CTA sends one opaque Lead ${landing.route}${mobile ? ' mobile menu' : ''}`, async ({ page }) => {
    const eventId = 'a'.repeat(63) + index.toString(16)
    const email = `test-meta-anchor-${index}@example.invalid`
    let submitted: Record<string, unknown> | undefined
    await page.route('**/api/leads', async route => {
      submitted = route.request().postDataJSON() as Record<string, unknown>
      await route.fulfill({ status: 201, json: { ok: true, event_id: eventId } })
    })
    if (mobile) await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(landing.route)
    await page.getByRole('checkbox', { name: 'Marketing (Google Ads und Meta)', exact: true }).check()
    await page.getByRole('button', { name: 'Auswahl speichern', exact: true }).click()
    await expect(page.locator('#rk-meta-pixel')).toHaveCount(1)
    if (mobile) {
      await page.getByRole('button', { name: 'Menü öffnen', exact: true }).click()
      await page.getByRole('dialog', { name: 'Navigationsmenü', exact: true }).getByRole('link', { name: 'Jetzt buchen', exact: true }).click()
    } else {
      await page.locator(`a[href="${landing.anchor}"]`).first().click()
    }
    await expect(page.locator(landing.anchor)).toBeInViewport()
    await expect(page).toHaveURL(new RegExp(`${landing.anchor}$`))
    const form = page.locator('form')
    await expect(form.locator('[name=service_requested]')).toHaveValue(landing.service)
    await form.locator('[name=full_name]').fill('TEST Meta Anchor')
    await form.locator('[name=object_type]').selectOption({ label: 'Wohnung / Haus' })
    await form.locator('[name=email]').fill(email)
    await form.locator('[name=phone]').fill('+49 000000')
    await form.locator('[name=city]').fill('Gaggenau')
    await form.getByRole('button', { name: 'Kostenlose Beratung anfragen', exact: true }).click()
    await expect(page).toHaveURL(/\/thank-you$/)
    expect(submitted).toMatchObject({ source_page: landing.route, service_requested: landing.service })
    const rows = await metaEvents(page)
    expect(rows.filter(row => row[2] === 'Lead')).toEqual([
      ['trackSingle', '1408138801461432', 'Lead', {}, { eventID: eventId }],
    ])
    expect(JSON.stringify(rows)).not.toContain(email)
    expect(JSON.stringify(rows)).not.toContain('TEST Meta Anchor')
    await page.reload()
    expect((await metaEvents(page)).filter(row => row[2] === 'Lead')).toEqual([])
  })
  }
}

for (const route of [
  '/landing/gewerbereinigung#private@example.invalid',
  '/landing/gewerbereinigung#appointment',
  '/landing/gewerbereinigung?email=private@example.invalid#contact',
  '/kontakt#contact',
]) {
  test(`Meta landing guard rejects unreviewed URL ${route}`, async ({ page }) => {
    await page.goto(route)
    await page.getByRole('checkbox', { name: 'Marketing (Google Ads und Meta)', exact: true }).check()
    await page.getByRole('button', { name: 'Auswahl speichern', exact: true }).click()
    await expect(page.locator('#rk-meta-pixel')).toHaveCount(0)
    expect(await metaEvents(page)).toEqual([])
  })
}