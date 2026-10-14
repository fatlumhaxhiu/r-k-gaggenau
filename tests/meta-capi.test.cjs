/* eslint @typescript-eslint/no-require-imports: "off" -- Node runner transpiles the isolated server module. */
const test = require('node:test')
const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const { resolve } = require('node:path')
const { createHash } = require('node:crypto')
const vm = require('node:vm')
const ts = require('typescript')

const compiled = ts.transpileModule(readFileSync(resolve(__dirname, '../src/lib/metaConversions.ts'), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText
const context = vm.createContext({
  URL, Date, Set, AbortController, setTimeout, clearTimeout,
  process: { env: {} },
  fetch: () => { throw new Error('Real network forbidden in Meta CAPI unit tests') },
})
const loaded = { exports: {} }
const execute = vm.runInContext(`(function(exports, require, module) {\n${compiled}\n})`, context)
execute(loaded.exports, name => {
  if (name === 'server-only') return {}
  if (name === 'node:crypto' || name === 'node:net') return require(name)
  throw new Error(`Unexpected import ${name}`)
}, loaded)
const capi = loaded.exports
const clone = value => JSON.parse(JSON.stringify(value))
const sha256 = value => createHash('sha256').update(value, 'utf8').digest('hex')
const id = 'a'.repeat(64)
const now = Date.now()
const consent = { version: 3, marketing: true, savedAt: now }
const base = overrides => ({
  eventId: id, sourceUrl: 'https://rk-gaggenau.de/landing/gewerbereinigung', consent,
  clientUserAgent: 'Mozilla/5.0 Synthetic Unit Browser', clientIpAddress: '192.0.2.1',
  ...overrides,
})
const lead = overrides => capi.buildMetaLeadEvent(base({ email: ' Ada.Test@Example.Invalid ', phone: '+49 (1577) 000-1111', ...overrides }))
const config = overrides => ({ enabled: true, accessToken: 'SYNTHETIC_UNIT_TOKEN_DO_NOT_USE', apiVersion: 'v26.0', ...overrides })
const success = count => ({ ok: true, status: 200, json: async () => ({ events_received: count }) })

for (const route of ['/kontakt', '/landing/baureinigung', '/landing/gewerbereinigung', '/landing/grundreinigung', '/landing/privatreinigung', '/landing/saisonale-pflege', '/landing/spezialreinigung']) {
  test(`Lead allows reviewed form ${route}`, () => {
    const event = lead({ sourceUrl: 'https://rk-gaggenau.de' + route })
    assert.equal(event.event_name, 'Lead')
    assert.equal(event.event_id, id)
    assert.equal(event.event_source_url, 'https://rk-gaggenau.de' + route)
    assert.equal(event.action_source, 'website')
  })
}
for (const invalid of [undefined, null, { ...consent, version: 2 }, { ...consent, marketing: false }, { ...consent, savedAt: now + 86400000 }, { ...consent, savedAt: now - 180 * 86400000 }, { ...consent, savedAt: 'invalid' }]) {
  test(`both builders reject invalid or stale consent ${JSON.stringify(invalid)}`, () => {
    assert.equal(lead({ consent: invalid }), null)
    assert.equal(capi.buildMetaPageViewEvent(base({ consent: invalid })), null)
  })
}

test('Lead hashes normalized contacts only and preserves opaque event ID', () => {
  const event = lead({ full_name: 'DO NOT SEND NAME', message: 'DO NOT SEND MESSAGE', service: 'DO NOT SEND SERVICE', city: 'DO NOT SEND CITY' })
  assert.deepEqual(clone(event.user_data.em), [sha256('ada.test@example.invalid')])
  assert.deepEqual(clone(event.user_data.ph), [sha256('4915770001111')])
  assert.deepEqual(clone(lead({ phone: '0049 1577 0001111' }).user_data.ph), clone(event.user_data.ph))
  const serialized = JSON.stringify(event)
  for (const privateValue of ['Ada.Test', 'ada.test@example.invalid', '+49', 'DO NOT SEND']) assert.ok(!serialized.includes(privateValue))
  assert.equal(event.event_id, id)
  assert.deepEqual(Object.keys(event).sort(), ['action_source', 'event_id', 'event_name', 'event_source_url', 'event_time', 'user_data'])
})

test('invalid contacts are omitted; no guessed country code for local phone numbers', () => {
  const event = lead({ email: 'not an email', phone: '01577 0001111' })
  assert.ok(!('em' in event.user_data))
  assert.ok(!('ph' in event.user_data))
  assert.equal(lead({ email: 'invalid', phone: 'invalid', clientIpAddress: undefined }), null)
})

test('PageView cannot collect contacts even when the raw input contains them', () => {
  const event = capi.buildMetaPageViewEvent(base({ email: 'never-send@example.invalid', phone: '+49123456789', full_name: 'NEVER SEND' }))
  assert.equal(event.event_name, 'PageView')
  assert.deepEqual(Object.keys(event.user_data).sort(), ['client_ip_address', 'client_user_agent'])
  assert.ok(!JSON.stringify(event).includes('never-send'))
  assert.equal(capi.buildMetaPageViewEvent(base({ clientIpAddress: undefined })), null)
})

test('user agent is required and invalid IP/control characters are never transmitted', () => {
  assert.equal(lead({ clientUserAgent: undefined }), null)
  assert.equal(lead({ clientUserAgent: 'bad\nagent' }), null)
  const event = lead({ clientIpAddress: '192.0.2.1, 198.51.100.1' })
  assert.ok(!('client_ip_address' in event.user_data))
  assert.equal(lead({ clientIpAddress: '2001:db8::1' }).user_data.client_ip_address, '2001:db8::1')
})

for (const invalidId of [undefined, null, 42, { toString: () => 'a'.repeat(64) }, '', 'not-an-id', 'a'.repeat(63), 'A'.repeat(64), 'g'.repeat(64)]) {
  test(`opaque event IDs are strictly validated ${String(invalidId).slice(0, 15)}`, () => assert.equal(lead({ eventId: invalidId }), null))
}

test('event timestamp rejects future and events older than the bounded dedup retry window', () => {
  assert.equal(lead({ eventTime: Math.floor(Date.now() / 1000) + 3600 }), null)
  assert.equal(lead({ eventTime: Math.floor(Date.now() / 1000) - 172800 }), null)
  assert.equal(lead({ eventTime: 1.5 }), null)
})

test('validated campaign/anchor inputs become a canonical URL without query values', () => {
  assert.equal(lead({ sourceUrl: 'https://www.rk-gaggenau.de/landing/gewerbereinigung/?utm_source=meta&utm_campaign=unit&fbclid=opaque_click#contact' }).event_source_url, 'https://rk-gaggenau.de/landing/gewerbereinigung')
  assert.equal(lead({ sourceUrl: 'https://rk-gaggenau.de/landing/grundreinigung#appointment' }).event_source_url, 'https://rk-gaggenau.de/landing/grundreinigung')
  assert.equal(capi.buildMetaPageViewEvent(base({ sourceUrl: 'https://rk-gaggenau.de/' })).event_source_url, 'https://rk-gaggenau.de/')
  assert.equal(lead({ sourceUrl: 'https://rk-gaggenau.de/' }), null)
})
for (const url of ['https://rk-gaggenau.de/admin/crm-system', 'https://rk-gaggenau.de/api/leads', 'https://rk-gaggenau.de/magazin/private', 'http://rk-gaggenau.de/kontakt', 'https://evil.invalid/kontakt', 'https://user:password@rk-gaggenau.de/kontakt', 'https://rk-gaggenau.de:8443/kontakt', 'https://rk-gaggenau.de/kontakt?email=private@example.invalid', 'https://rk-gaggenau.de/landing/gewerbereinigung#appointment', 'https://rk-gaggenau.de/kontakt#private@example.invalid']) {
  test(`both builders reject unsafe source URL ${url}`, () => {
    assert.equal(lead({ sourceUrl: url }), null)
    assert.equal(capi.buildMetaPageViewEvent(base({ sourceUrl: url })), null)
  })
}

test('cookie identifiers are optional, validated and never invented from URL parameters', () => {
  const fbp = `fb.1.${now}.1234567890`
  const fbc = `fb.1.${now}.opaque_click`
  const event = lead({ fbp, fbc })
  assert.equal(event.user_data.fbp, fbp)
  assert.equal(event.user_data.fbc, fbc)
  const omitted = lead({ fbp: 'fb.1.INVALID.private@example.invalid', fbc: `fb.1.${now + 86400000}.click` })
  assert.ok(!('fbp' in omitted.user_data))
  assert.ok(!('fbc' in omitted.user_data))
  assert.ok(!('fbc' in lead({ sourceUrl: 'https://rk-gaggenau.de/kontakt?fbclid=opaque_click' }).user_data))
})

test('private environment config is opt-in and requires explicit API version', () => {
  assert.deepEqual(clone(capi.readMetaCapiConfig({ NEXT_PUBLIC_META_CAPI_ENABLED: '1', NEXT_PUBLIC_META_CAPI_ACCESS_TOKEN: 'public-must-not-be-read' })), { enabled: false, accessToken: '', apiVersion: '' })
  assert.deepEqual(clone(capi.readMetaCapiConfig({ META_CAPI_ENABLED: '1', META_CAPI_ACCESS_TOKEN: 'SYNTHETIC', META_CAPI_API_VERSION: 'v26.0', META_CAPI_TEST_EVENT_CODE: 'TEST_UNIT' })), { enabled: true, accessToken: 'SYNTHETIC', apiVersion: 'v26.0', testEventCode: 'TEST_UNIT' })
})

test('disabled or invalid configuration cannot start network transport', async () => {
  let called = 0
  const fetchImpl = async () => { called++; return success(1) }
  assert.equal((await capi.sendMetaEvents([lead()], config({ enabled: false, fetchImpl }))).reason, 'disabled')
  for (const change of [{ accessToken: '' }, { apiVersion: '' }, { apiVersion: '../private' }, { testEventCode: 'TOKEN=secret' }]) {
    assert.equal((await capi.sendMetaEvents([lead()], config({ ...change, fetchImpl }))).reason, 'configuration')
  }
  assert.equal(called, 0)
})

test('transport sends one attempt with private header token and explicit diagnostic code only', async () => {
  const requests = []
  const fetchImpl = async (url, init) => { requests.push({ url, init }); return success(1) }
  assert.deepEqual(clone(await capi.sendMetaEvents([lead()], config({ fetchImpl }))), { ok: true, eventsReceived: 1 })
  assert.equal(requests.length, 1)
  assert.equal(requests[0].url, 'https://graph.facebook.com/v26.0/1408138801461432/events')
  assert.ok(!requests[0].url.includes('SYNTHETIC_UNIT_TOKEN'))
  assert.equal(requests[0].init.headers.Authorization, 'Bearer SYNTHETIC_UNIT_TOKEN_DO_NOT_USE')
  assert.equal(requests[0].init.cache, 'no-store')
  assert.equal(requests[0].init.redirect, 'error')
  assert.deepEqual(Object.keys(JSON.parse(requests[0].init.body)), ['data'])
  await capi.sendMetaEvents([lead()], config({ fetchImpl, testEventCode: 'TEST_UNIT' }))
  assert.equal(JSON.parse(requests[1].init.body).test_event_code, 'TEST_UNIT')
})

test('transport revalidates persisted payloads and refuses contact data on PageView', async () => {
  let called = 0
  const fetchImpl = async () => { called++; return success(1) }
  const malformed = [
    { ...lead(), custom_data: { message: 'private' } },
    { ...lead(), user_data: { ...lead().user_data, full_name: 'private' } },
    { ...lead(), user_data: { ...lead().user_data, em: ['raw@example.invalid'] } },
    { ...lead(), event_name: 'PageView' },
    { ...lead(), event_source_url: 'https://rk-gaggenau.de/kontakt?private=value' },
  ]
  for (const event of malformed) assert.equal((await capi.sendMetaEvents([event], config({ fetchImpl }))).reason, 'invalid_event')
  assert.equal(called, 0)
})

test('vendor errors contain only safe status/code and never reflected payload/token messages', async () => {
  const secret = 'SYNTHETIC_UNIT_TOKEN_DO_NOT_USE'
  const fetchImpl = async () => ({ ok: false, status: 400, json: async () => ({ error: { code: 100, message: `${secret} raw@example.invalid`, error_data: { payload: 'private' } } }) })
  const result = await capi.sendMetaEvents([lead()], config({ fetchImpl }))
  assert.deepEqual(clone(result), { ok: false, reason: 'http', retryable: false, httpStatus: 400, errorCode: 100 })
  assert.ok(!JSON.stringify(result).includes(secret))
  assert.ok(!JSON.stringify(result).includes('raw@example.invalid'))
})

test('transient statuses and vendor codes are retryable, incomplete acknowledgement is not success', async () => {
  for (const status of [429, 500, 503]) {
    const result = await capi.sendMetaEvents([lead()], config({ fetchImpl: async () => ({ ok: false, status, json: async () => ({}) }) }))
    assert.equal(result.retryable, true)
  }
  const transient = await capi.sendMetaEvents([lead()], config({ fetchImpl: async () => ({ ok: false, status: 400, json: async () => ({ error: { code: 2 } }) }) }))
  assert.equal(transient.retryable, true)
  assert.equal((await capi.sendMetaEvents([lead()], config({ fetchImpl: async () => success(0) }))).reason, 'response')
  assert.equal((await capi.sendMetaEvents([lead()], config({ fetchImpl: async () => ({ ok: true, status: 200, json: async () => { throw new Error('Private response text') } }) }))).reason, 'response')
})

test('network exceptions are redacted and no automatic retries occur', async () => {
  let called = 0
  const result = await capi.sendMetaEvents([lead()], config({ fetchImpl: async () => { called++; throw new Error('token=SYNTHETIC private@example.invalid') } }))
  assert.deepEqual(clone(result), { ok: false, reason: 'transport', retryable: true })
  assert.equal(called, 1)
})

test('timeout aborts a stalled transport and returns promptly even if mock ignores abort', async () => {
  let signal
  const result = await capi.sendMetaEvents([lead()], config({ timeoutMs: 10, fetchImpl: async (_url, init) => { signal = init.signal; return new Promise(() => {}) } }))
  assert.deepEqual(clone(result), { ok: false, reason: 'timeout', retryable: true })
  assert.equal(signal.aborted, true)
})