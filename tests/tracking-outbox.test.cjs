/* eslint @typescript-eslint/no-require-imports: "off" -- Isolated Node runner; imports are explicitly mocked. */
const test = require('node:test')
const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const { resolve } = require('node:path')
const { randomUUID, createHash } = require('node:crypto')
const vm = require('node:vm')
const ts = require('typescript')

const clone = value => JSON.parse(JSON.stringify(value))
function load(file, imports, env = {}, extra = {}) {
  const code = ts.transpileModule(readFileSync(resolve(__dirname, '..', file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText
  const context = vm.createContext({ URL, Date, Set, Request, Response, Buffer, TextDecoder, AbortController, setTimeout, clearTimeout, setInterval, console: { error() {} }, process: { env }, ...extra })
  const loaded = { exports: {} }
  vm.runInContext(`(function(exports, require, module) {\n${code}\n})`, context)(loaded.exports, name => {
    if (Object.hasOwn(imports, name)) return imports[name]
    if (name === 'server-only') return {}
    if (name === 'node:crypto' || name === 'node:net') return require(name)
    throw new Error(`Forbidden or unexpected import: ${name}`)
  }, loaded)
  return loaded.exports
}
const core = load('src/lib/metaConversions.ts', {})
const requestHelpers = load('src/lib/trackingRequest.ts', { './metaConversions': core }, { NODE_ENV: 'test', META_CAPI_ALLOW_INTERNAL_ORIGIN: '1', META_CAPI_TRUST_PROXY_HEADERS: '1' })
const consent = () => ({ version: 3, marketing: true, savedAt: Date.now() })
const tracking = overrides => ({ consent: consent(), session_id: randomUUID(), ...overrides })
const headers = { Origin: 'https://rk-gaggenau.de', 'Sec-Fetch-Site': 'same-origin', 'Content-Type': 'application/json', 'User-Agent': 'Synthetic Unit Browser', 'CF-Connecting-IP': '192.0.2.7' }
const request = (path, body, overrides = {}) => new Request(`https://rk-gaggenau.de${path}`, { method: 'POST', headers: { ...headers, ...overrides }, body: JSON.stringify(body) })
const form = (source, overrides = {}) => ({ full_name: 'Synthetic QA Person', object_type: 'Büro', email: 'synthetic@example.invalid', phone: '+4915770000000', city: 'Synthetic', service_requested: 'Gewerbereinigung', source_page: source, message: 'DO NOT SEND TO META', tracking: tracking(), ...overrides })
function harness(options = {}) {
  const queued = [], callbacks = [], persisted = [], drainCalls = []
  const byRequest = new Map()
  let authenticated = options.authenticated ?? true
  const save = data => {
    const lead = { ...data, id: randomUUID(), created_at: new Date() }
    persisted.push(lead)
    return lead
  }
  const prisma = { lead: {
    create: async ({ data }) => save(data),
    upsert: async ({ where, create }) => {
      if (!byRequest.has(where.request_id)) byRequest.set(where.request_id, save(create))
      return byRequest.get(where.request_id)
    },
    findUniqueOrThrow: async ({ where }) => byRequest.get(where.request_id),
  } }
  const outbox = {
    metaCapiConfigured: () => options.enabled !== false,
    enqueueTrackingEvent: async (event, context, enqueueOptions) => {
      if (options.failQueue) throw new Error('SECRET TRANSIENT PAYLOAD MUST NOT ESCAPE')
      if (options.expectSaved) assert.ok(persisted.length > 0)
      queued.push({ event: clone(event), context: clone(context), options: clone(enqueueOptions ?? {}) })
      return options.queueResult ?? { queued: true }
    },
    drainTrackingOutbox: async value => {
      drainCalls.push(value)
      if (options.failDrain) throw new Error('SECRET PROVIDER ERROR MUST NOT ESCAPE')
      return 1
    },
    withdrawTrackingSession: async (sessionId, withdrawalOptions) => {
      queued.push({ sessionId, options: clone(withdrawalOptions) })
      if (options.failQueue) throw new Error('SECRET DATABASE ERROR')
      return options.cancelled ?? 1
    },
    getTrackingStatus: async () => options.status ?? { enabled: true, configured: true, available: true, counts: [{ event: 'Lead', status: 'sent', count: 7 }] },
  }
  const common = {
    'next/server': { NextResponse: { json: (body, init) => Response.json(body, init) }, after: callback => { if (options.failAfter) throw new Error('after registration failed'); callbacks.push(callback) } },
    'next/cache': { revalidatePath() {} }, '@/lib/prisma': { prisma }, '@/auth': { auth: async () => authenticated ? { user: { id: 'SYNTHETIC ADMIN' } } : null },
    '@prisma/client': { Prisma: { PrismaClientKnownRequestError: class extends Error {} } },
    '@/lib/metaConversions': core, '@/lib/trackingRequest': requestHelpers, '@/lib/trackingOutbox': outbox,
  }
  return { queued, callbacks, persisted, drainCalls, setAuthenticated: value => { authenticated = value }, leads: load('src/app/api/leads/route.ts', common), page: load('src/app/api/tracking/page-view/route.ts', common), withdraw: load('src/app/api/tracking/withdraw/route.ts', common), status: load('src/app/api/admin/tracking-status/route.ts', common) }
}

for (const route of ['/kontakt', '/landing/baureinigung', '/landing/gewerbereinigung', '/landing/grundreinigung', '/landing/privatreinigung', '/landing/saisonale-pflege', '/landing/spezialreinigung']) {
  test(`saved ${route} form queues the same opaque Lead ID without Meta contact hashes`, async () => {
    const app = harness({ expectSaved: true })
    const response = await app.leads.POST(request('/api/leads', form(route)))
    assert.equal(response.status, 201)
    const body = await response.json()
    assert.equal(app.persisted.length, 1)
    assert.equal(app.queued.length, 1)
    const event = app.queued[0].event
    assert.equal(event.event_id, body.event_id)
    assert.equal(event.event_id, createHash('sha256').update(`lead:${app.persisted[0].id}`).digest('hex'))
    assert.equal(event.event_name, 'Lead')
    assert.equal(event.event_source_url, 'https://rk-gaggenau.de' + route)
    assert.deepEqual(Object.keys(event.user_data).sort(), ['client_ip_address', 'client_user_agent'])
    assert.ok(!JSON.stringify(event).includes('synthetic@example.invalid'))
    assert.ok(!JSON.stringify(event).includes('DO NOT SEND'))
    assert.ok(!Object.hasOwn(app.persisted[0], 'tracking'))
    assert.equal(app.callbacks.length, 1)
    await app.callbacks[0]()
    assert.equal(app.drainCalls[0].eventId, body.event_id)
  })
}

test('business idempotency fingerprint excludes changing consent/session metadata', async () => {
  const app = harness()
  const id = randomUUID()
  const first = await app.leads.POST(request('/api/leads', form('/kontakt'), { 'Idempotency-Key': id }))
  const firstBody = await first.json()
  const second = await app.leads.POST(request('/api/leads', form('/kontakt', { tracking: tracking({ fbp: `fb.1.${Date.now()}.12345` }) }), { 'Idempotency-Key': id }))
  assert.equal(second.status, 201)
  assert.equal((await second.json()).event_id, firstBody.event_id)
  assert.equal(app.persisted.length, 1)
  const conflict = await app.leads.POST(request('/api/leads', form('/kontakt', { message: 'Different actual request' }), { 'Idempotency-Key': id }))
  assert.equal(conflict.status, 409)
})
for (const options of [{ failQueue: true }, { failAfter: true }, { failDrain: true }]) {
  test(`measurement failure preserves saved form success ${JSON.stringify(options)}`, async () => {
    const app = harness(options)
    const response = await app.leads.POST(request('/api/leads', form('/kontakt')))
    assert.equal(response.status, 201)
    assert.equal(app.persisted.length, 1)
    assert.deepEqual(Object.keys(await response.json()).sort(), ['event_id', 'ok'])
    for (const callback of app.callbacks) await assert.doesNotReject(callback)
  })
}
for (const [label, body, headerOverrides] of [
  ['missing consent', form('/kontakt', { tracking: undefined }), {}],
  ['old consent', form('/kontakt', { tracking: tracking({ consent: { version: 2, marketing: true, savedAt: Date.now() } }) }), {}],
  ['marketing rejected', form('/kontakt', { tracking: tracking({ consent: { ...consent(), marketing: false } }) }), {}],
  ['private form source', form('/admin/crm-system'), {}],
  ['cross-origin', form('/kontakt'), { Origin: 'https://other.example.invalid' }],
]) {
  test(`CRM still saves while CAPI skips ${label}`, async () => {
    const app = harness()
    const response = await app.leads.POST(request('/api/leads', body, headerOverrides))
    assert.equal(response.status, 201)
    assert.equal(app.persisted.length, 1)
    assert.equal(app.queued.length, 0)
  })
}
test('disabled CAPI preserves successful form and creates no delivery dependency', async () => {
  const app = harness({ enabled: false })
  assert.equal((await app.leads.POST(request('/api/leads', form('/kontakt')))).status, 201)
  assert.equal(app.queued.length, 0)
  assert.equal(app.callbacks.length, 0)
})
test('missing business fields never queue a Lead', async () => {
  const app = harness()
  assert.equal((await app.leads.POST(request('/api/leads', form('/kontakt', { phone: '' })))).status, 400)
  assert.equal(app.persisted.length, 0)
  assert.equal(app.queued.length, 0)
})
test('form JSON body remains bounded without exposing malformed contents', async () => {
  const app = harness()
  const req = new Request('https://rk-gaggenau.de/api/leads', { method: 'POST', headers, body: ' '.repeat(32769) })
  const response = await app.leads.POST(req)
  assert.equal(response.status, 400)
  assert.equal(app.persisted.length, 0)
})

const pageBody = overrides => ({ event_id: 'a'.repeat(64), page_location: 'https://rk-gaggenau.de/landing/grundreinigung#appointment', tracking: tracking(), ...overrides })
test('PageView request strips permitted anchor and forwards only hashed rate key', async () => {
  const app = harness()
  const response = await app.page.POST(request('/api/tracking/page-view', pageBody({ email: 'NEVER SEND' })))
  assert.equal(response.status, 200)
  assert.equal(app.queued[0].event.event_source_url, 'https://rk-gaggenau.de/landing/grundreinigung')
  assert.equal(app.queued[0].event.event_name, 'PageView')
  assert.match(app.queued[0].options.rateKey, /^[a-f0-9]{64}$/)
  assert.ok(!JSON.stringify(app.queued[0].event).includes('NEVER SEND'))
})
for (const [label, body] of [ ['private source', pageBody({ page_location: 'https://rk-gaggenau.de/admin' })], ['arbitrary query', pageBody({ page_location: 'https://rk-gaggenau.de/kontakt?email=private' })], ['invalid ID', pageBody({ event_id: 'raw@example.invalid' })], ['stale consent', pageBody({ tracking: tracking({ consent: { ...consent(), savedAt: Date.now() - 181 * 86400000 } }) })] ]) {
  test(`PageView rejects ${label} before enqueue`, async () => {
    const app = harness()
    assert.equal((await app.page.POST(request('/api/tracking/page-view', body))).status, 400)
    assert.equal(app.queued.length, 0)
  })
}
test('PageView origin gate rejects a cross-site request', async () => {
  const app = harness()
  assert.equal((await app.page.POST(request('/api/tracking/page-view', pageBody(), { Origin: 'https://other.example.invalid' }))).status, 403)
  assert.equal(app.queued.length, 0)
})
test('disabled PageView skips parsing/queue and rate-limit responses are explicit', async () => {
  const disabled = harness({ enabled: false })
  assert.equal((await disabled.page.POST(request('/api/tracking/page-view', null))).status, 200)
  assert.equal(disabled.queued.length, 0)
  const limited = harness({ queueResult: { queued: false, reason: 'rate_limit' } })
  assert.equal((await limited.page.POST(request('/api/tracking/page-view', pageBody()))).status, 429)
})
test('PageView transport failure is redacted and deferred failure does not reject', async () => {
  const failed = harness({ failQueue: true })
  const response = await failed.page.POST(request('/api/tracking/page-view', pageBody()))
  assert.equal(response.status, 503)
  assert.ok(!JSON.stringify(await response.json()).includes('SECRET'))
  const deferred = harness({ failDrain: true })
  assert.equal((await deferred.page.POST(request('/api/tracking/page-view', pageBody()))).status, 200)
  await assert.doesNotReject(deferred.callbacks[0])
})
test('withdrawal validates origin/session and passes a hashed rate key', async () => {
  const app = harness()
  const session = randomUUID()
  assert.equal((await app.withdraw.POST(request('/api/tracking/withdraw', { session_id: session }))).status, 200)
  assert.equal(app.queued[0].sessionId, session)
  assert.match(app.queued[0].options.rateKey, /^[a-f0-9]{64}$/)
  assert.equal((await app.withdraw.POST(request('/api/tracking/withdraw', { session_id: 'INVALID' }))).status, 400)
  assert.equal((await app.withdraw.POST(request('/api/tracking/withdraw', { session_id: session }, { Origin: 'https://other.example.invalid' }))).status, 403)
})
test('withdrawal bounds produce 429; database errors are redacted', async () => {
  const limited = harness({ cancelled: -1 })
  assert.equal((await limited.withdraw.POST(request('/api/tracking/withdraw', { session_id: randomUUID() }))).status, 429)
  const failed = harness({ failQueue: true })
  const response = await failed.withdraw.POST(request('/api/tracking/withdraw', { session_id: randomUUID() }))
  assert.equal(response.status, 503)
  assert.ok(!JSON.stringify(await response.json()).includes('SECRET'))
})
test('tracking status requires authentication and exposes aggregate counts only', async () => {
  const app = harness({ authenticated: false })
  assert.equal((await app.status.GET()).status, 401)
  app.setAuthenticated(true)
  const response = await app.status.GET()
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('cache-control'), 'no-store')
  assert.deepEqual(await response.json(), { enabled: true, configured: true, available: true, counts: [{ event: 'Lead', status: 'sent', count: 7 }] })
})

test('disabled or incomplete outbox never instantiates Prisma or accesses new tables', async () => {
  let created = 0
  const outbox = load('src/lib/trackingOutbox.ts', {
    '@prisma/client': { Prisma: {}, PrismaClient: class { constructor() { created++; throw new Error('Real DB forbidden') } } },
    './metaConversions': core, './trackingRequest': requestHelpers,
  })
  const context = tracking()
  const event = core.buildMetaPageViewEvent({ eventId: 'a'.repeat(64), sourceUrl: 'https://rk-gaggenau.de/', consent: context.consent, clientUserAgent: 'Synthetic Unit Browser', clientIpAddress: '192.0.2.7' })
  assert.equal((await outbox.enqueueTrackingEvent(event, context)).reason, 'disabled')
  assert.equal(await outbox.drainTrackingOutbox(), 0)
  assert.equal(await outbox.withdrawTrackingSession(context.session_id), 0)
  assert.deepEqual(clone(await outbox.getTrackingStatus()), { enabled: false, configured: false, available: true, counts: [] })
  assert.equal((await outbox.enqueueTrackingEvent(event, context, { config: { enabled: true, accessToken: '', apiVersion: 'v26.0' } })).reason, 'disabled')
  assert.equal(await outbox.drainTrackingOutbox({ config: { enabled: true, accessToken: 'SYNTHETIC', apiVersion: '' } }), 0)
  assert.equal(created, 0)
})

for (const protocol of ['http', 'https']) test('reviewed reverse proxy ' + protocol + ' internal Next URL preserves all three API workflows', async () => {
  const app = harness({ expectSaved: true })
  const proxyRequest = (path, body) => new Request(protocol + '://localhost:3000' + path, {
    method: 'POST', headers: { ...headers, Host: 'rk-gaggenau.de', 'X-Forwarded-Proto': 'https' }, body: JSON.stringify(body),
  })
  const saved = await app.leads.POST(proxyRequest('/api/leads', form('/kontakt')))
  assert.equal(saved.status, 201)
  assert.equal(app.persisted.length, 1)
  assert.equal(app.queued[0].event.event_name, 'Lead')
  const viewed = await app.page.POST(proxyRequest('/api/tracking/page-view', pageBody()))
  assert.equal(viewed.status, 200)
  assert.equal(app.queued[1].event.event_name, 'PageView')
  const session = randomUUID()
  assert.equal((await app.withdraw.POST(proxyRequest('/api/tracking/withdraw', { session_id: session }))).status, 200)
  assert.equal(app.queued[2].sessionId, session)
})
for (const [label, env, expected] of [
  ['Edge runtime', { NEXT_RUNTIME: 'edge', NODE_ENV: 'production', META_CAPI_ENABLED: '1' }, 0],
  ['disabled Node runtime', { NEXT_RUNTIME: 'nodejs', NODE_ENV: 'production', META_CAPI_ENABLED: '0' }, 0],
  ['Node build phase', { NEXT_RUNTIME: 'nodejs', NODE_ENV: 'production', META_CAPI_ENABLED: '1', NEXT_PHASE: 'phase-production-build' }, 0],
  ['development runtime', { NEXT_RUNTIME: 'nodejs', NODE_ENV: 'development', META_CAPI_ENABLED: '1' }, 0],
  ['enabled production Node runtime', { NEXT_RUNTIME: 'nodejs', NODE_ENV: 'production', META_CAPI_ENABLED: '1' }, 1],
]) test(`instrumentation does not start a worker outside its enabled runtime: ${label}`, async () => {
  let starts = 0
  const instrumentation = load('src/instrumentation.ts', { './lib/trackingOutbox': { startTrackingWorker: () => { starts++ } } }, env)
  await instrumentation.register()
  assert.equal(starts, expected)
})