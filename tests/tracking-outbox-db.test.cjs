/* eslint @typescript-eslint/no-require-imports: "off" -- Isolated Node tests transpile server-only TypeScript. */
const test = require('node:test')
const assert = require('node:assert/strict')
const { existsSync, readFileSync, writeFileSync, appendFileSync, mkdirSync } = require('node:fs')
const { resolve, dirname } = require('node:path')
const { randomUUID, createHash } = require('node:crypto')
const net = require('node:net')
const { spawnSync } = require('node:child_process')
const vm = require('node:vm')
const ts = require('typescript')
const { PrismaClient, Prisma } = require('@prisma/client')

const root = resolve(__dirname, '..')
const directory = resolve(root, '.local-tests/postgres-capi', 'run-' + randomUUID())
const markerPath = resolve(directory, '.rk-capi-synthetic-harness.json')
const database = 'rk_capi_test'
const user = 'rk_capi_synthetic'
const password = 'LOCAL_SYNTHETIC_CAPI_ONLY_2026'
const config = { enabled: true, accessToken: 'SYNTHETIC_UNIT_TOKEN_NEVER_LIVE', apiVersion: 'v26.0' }
const hash = value => createHash('sha256').update(value, 'utf8').digest('hex')
const clone = value => JSON.parse(JSON.stringify(value))

async function checkedPort() {
  for (const port of [55459, 55469]) {
    const available = await new Promise(resolveAvailable => {
      const socket = net.createServer()
      socket.once('error', () => resolveAvailable(false))
      socket.listen(port, '127.0.0.1', () => socket.close(() => resolveAvailable(true)))
    })
    if (available) return port
  }
  throw new Error('Both isolated CAPI test ports are occupied; no external database will be used')
}

async function startDatabase() {
  // Installed binaries only. This test does not install packages or fetch artifacts.
  if (process.platform !== 'win32') throw new Error('This workspace harness requires its installed Windows embedded PostgreSQL binaries')
  const binaries = await import('@embedded-postgres/windows-x64')
  for (const executable of [binaries.postgres, binaries.initdb]) assert.ok(existsSync(executable), 'Installed embedded PostgreSQL executable required')
  if (existsSync(resolve(directory, 'PG_VERSION'))) {
    assert.ok(existsSync(markerPath), 'An existing cluster must have this synthetic harness ownership marker')
    assert.deepEqual(JSON.parse(readFileSync(markerPath, 'utf8')), { database, user, loopbackOnly: true })
  } else {
    mkdirSync(dirname(directory), { recursive: true })
    assert.equal(existsSync(directory), false, 'The first run must initialize an unambiguous new cluster directory')
  }
  const port = await checkedPort()
  const { default: EmbeddedPostgres } = await import('embedded-postgres')
  const cluster = new EmbeddedPostgres({
    databaseDir: directory, user, password, port, authMethod: 'scram-sha-256', persistent: true,
    postgresFlags: ['-h', '127.0.0.1', '-c', 'max_connections=30', '-c', 'shared_buffers=16MB', '-c', 'log_statement=none'],
    onLog: message => appendFileSync(resolve(root, '.local-tests/capi-db-harness.log'), String(message)), onError: () => {},
  })
  // Graceful shutdown avoids Windows shared-memory remnants from forced process-tree termination.
  const forceStop = cluster.stop.bind(cluster)
  cluster.stop = async () => {
    if (!cluster.process) return
    if (cluster.process.exitCode !== null || cluster.process.signalCode !== null) { cluster.process = undefined; return }
    const result = spawnSync(binaries.pg_ctl, ['stop', '-D', directory, '-m', 'fast', '-w', '-t', '10'], { stdio: 'ignore', timeout: 15000 })
    if (result.status !== 0) await forceStop()
    cluster.process = undefined
  }
  let admin
  let sql
  let db
  try {
    if (!existsSync(resolve(directory, 'PG_VERSION'))) {
      await cluster.initialise()
      writeFileSync(markerPath, JSON.stringify({ database, user, loopbackOnly: true }))
    }
    await cluster.start()
    admin = cluster.getPgClient('postgres', '127.0.0.1')
    await admin.connect()
    const already = await admin.query('SELECT 1 FROM pg_database WHERE datname = $1', [database])
    if (!already.rowCount) await admin.query('CREATE DATABASE rk_capi_test')
    await admin.end()
    admin = undefined
    sql = cluster.getPgClient(database, '127.0.0.1')
    await sql.connect()
    const identity = await sql.query('SELECT current_database() AS name, current_user AS username, host(inet_server_addr()) AS address, inet_server_port() AS port')
    assert.deepEqual(identity.rows[0], { name: database, username: user, address: '127.0.0.1', port })
    // No Prisma db push and no environment datasource lookup: apply the requested additive SQL to this fresh synthetic DB only.
    await sql.query(readFileSync(resolve(root, 'prisma/add-tracking-delivery.sql'), 'utf8'))
    const url = `postgresql://${user}:${password}@127.0.0.1:${port}/${database}?connection_limit=12&pool_timeout=10`
    db = new PrismaClient({ datasourceUrl: url })
    await db.$connect()
    const identityViaPrisma = await db.$queryRaw`SELECT current_database() AS name, host(inet_server_addr()) AS address`
    assert.deepEqual(identityViaPrisma, [{ name: database, address: '127.0.0.1' }])
    return { cluster, db, sql, port, stop: async () => { await db.$disconnect(); await sql.end(); await cluster.stop(); cluster.process = undefined } }
  } catch (error) {
    await db?.$disconnect().catch(() => undefined)
    await sql?.end().catch(() => undefined)
    await admin?.end().catch(() => undefined)
    if (cluster.process?.exitCode === null && cluster.process?.signalCode === null) await cluster.stop().catch(() => undefined); cluster.process = undefined
    throw error ?? new Error('Embedded PostgreSQL startup failed; inspect the synthetic harness log')
  }
}

function loadModules(db, fixedNow) {
  const Clock = fixedNow === undefined ? Date : class extends Date {
    constructor(value) { super(value === undefined ? fixedNow : value) }
    static now() { return fixedNow }
  }
  const context = vm.createContext({
    URL, Date: Clock, Set, Map, TextDecoder, AbortController, setTimeout, clearTimeout,
    process: { env: {} }, console: { log() {}, warn() {}, error() {} },
    fetch: () => { throw new Error('Real network forbidden in CAPI database tests') },
  })
  const modules = new Map()
  function moduleFor(name) {
    if (modules.has(name)) return modules.get(name)
    const loaded = { exports: {} }
    modules.set(name, loaded.exports)
    const compiled = ts.transpileModule(readFileSync(resolve(root, `src/lib/${name}.ts`), 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
    }).outputText
    const execute = vm.runInContext(`(function(exports, require, module) {\n${compiled}\n})`, context)
    execute(loaded.exports, dependency => {
      if (dependency === 'server-only') return {}
      if (dependency === 'node:crypto' || dependency === 'node:net') return require(dependency)
      if (dependency === '@prisma/client') return { Prisma, PrismaClient }
      if (dependency === './prisma' || dependency === '@/lib/prisma') return { prisma: db }
      if (/^(?:\.\/|@\/lib\/)(metaConversions|trackingRequest|trackingOutbox)$/.test(dependency)) return moduleFor(dependency.split('/').at(-1))
      throw new Error(`Unexpected server module import: ${dependency}`)
    }, loaded)
    return loaded.exports
  }
  return { outbox: moduleFor('trackingOutbox'), capi: moduleFor('metaConversions') }
}

function fixture(capi, overrides = {}) {
  const sessionId = overrides.session_id ?? randomUUID()
  const eventId = overrides.event_id ?? hash(randomUUID())
  const consent = { version: 3, marketing: true, savedAt: overrides.savedAt ?? Date.now() }
  const tracking = { consent, session_id: sessionId }
  const event = capi.buildMetaPageViewEvent({
    eventId, sourceUrl: 'https://rk-gaggenau.de/landing/gewerbereinigung', consent,
    clientUserAgent: 'Synthetic isolated CAPI database test', clientIpAddress: '192.0.2.59',
  })
  assert.ok(event)
  return { event, tracking, sessionId, eventId }
}
const success = async () => ({ ok: true, eventsReceived: 1 })

// All writes and concurrency checks target the explicit, verified loopback synthetic database above.
test('durable CAPI outbox against isolated PostgreSQL', { timeout: 120000 }, async t => {
  const harness = await startDatabase()
  const { db, sql } = harness
  try {
    const { outbox, capi } = loadModules(db)
    const options = extra => ({ db, config, ...extra })
    const reset = async () => {
      const tables = await sql.query("SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename LIKE 'tracking_%'")
      const safeTables = tables.rows.map(row => row.tablename)
      assert.ok(safeTables.length >= 2)
      for (const name of safeTables) assert.match(name, /^tracking_[a-z_]+$/)
      await sql.query(`TRUNCATE TABLE ${safeTables.map(name => `"${name}"`).join(', ')}`)
    }

    await t.test('concurrent duplicate enqueues persist one immutable event', async () => {
      await reset()
      const item = fixture(capi)
      const results = await Promise.all(Array.from({ length: 12 }, () => outbox.enqueueTrackingEvent(item.event, item.tracking, options())))
      assert.equal(results.filter(result => result.queued).length, 1)
      assert.equal(await db.trackingDelivery.count({ where: { event_id: item.eventId } }), 1)
      const stored = await db.trackingDelivery.findUniqueOrThrow({ where: { event_id: item.eventId } })
      assert.equal(stored.session_id, item.sessionId)
      assert.deepEqual(stored.payload, clone(item.event))
      assert.equal(stored.attempts, 0)
    })

    await t.test('cross-session duplicate races insert one event without replacing its payload', async () => {
      await reset()
      const item = fixture(capi)
      const contexts = Array.from({ length: 12 }, () => ({ ...item.tracking, session_id: randomUUID() }))
      const results = await Promise.all(contexts.map(tracking => outbox.enqueueTrackingEvent(item.event, tracking, options())))
      assert.equal(results.filter(result => result.queued).length, 1)
      assert.equal(results.filter(result => result.duplicate).length, 11)
      assert.equal(await db.trackingDelivery.count(), 1)
      const changed = { ...item.event, event_source_url: 'https://rk-gaggenau.de/landing/baureinigung' }
      assert.deepEqual(clone(await outbox.enqueueTrackingEvent(changed, item.tracking, options())), { queued: false, duplicate: true })
      assert.deepEqual((await db.trackingDelivery.findUniqueOrThrow({ where: { event_id: item.eventId } })).payload, clone(item.event))
    })

    await t.test('an active lease prevents another independent worker from transmitting', async () => {
      await reset()
      const item = fixture(capi)
      await outbox.enqueueTrackingEvent(item.event, item.tracking, options())
      await db.trackingDelivery.update({ where: { event_id: item.eventId }, data: { status: 'delivering', locked_until: new Date(Date.now() + 60000), attempts: 1 } })
      let attempts = 0
      assert.equal(await loadModules(db).outbox.drainTrackingOutbox(options({ send: async () => { attempts++; return { ok: true, eventsReceived: 1 } }, eventId: item.eventId })), 0)
      assert.equal(attempts, 0)
      assert.deepEqual((await db.trackingDelivery.findUniqueOrThrow({ where: { event_id: item.eventId } })).payload, clone(item.event))
    })

    await t.test('the eighth retryable failure becomes terminal and erases its payload', async () => {
      await reset()
      const item = fixture(capi)
      await outbox.enqueueTrackingEvent(item.event, item.tracking, options())
      await db.trackingDelivery.update({ where: { event_id: item.eventId }, data: { attempts: 7 } })
      let attempts = 0
      await outbox.drainTrackingOutbox(options({ send: async () => { attempts++; return { ok: false, reason: 'http', retryable: true, httpStatus: 503 } }, eventId: item.eventId }))
      assert.equal(attempts, 1)
      const stored = await db.trackingDelivery.findUniqueOrThrow({ where: { event_id: item.eventId } })
      assert.equal(stored.attempts, 8)
      assert.equal(stored.status, 'failed')
      assert.equal(stored.payload, null)
      assert.equal(stored.locked_until, null)
    })
    await t.test('simultaneous workers claim one event and make one provider attempt', async () => {
      await reset()
      const item = fixture(capi)
      assert.equal((await outbox.enqueueTrackingEvent(item.event, item.tracking, options())).queued, true)
      let attempts = 0
      const send = async () => { attempts++; await new Promise(resolve => setTimeout(resolve, 20)); return { ok: true, eventsReceived: 1 } }
      await Promise.all(Array.from({ length: 8 }, () => loadModules(db).outbox.drainTrackingOutbox(options({ send, limit: 1, eventId: item.eventId }))))
      assert.equal(attempts, 1)
      const stored = await db.trackingDelivery.findUniqueOrThrow({ where: { event_id: item.eventId } })
      assert.equal(stored.payload, null)
      assert.ok(stored.sent_at)
      assert.equal(stored.attempts, 1)
      assert.equal(stored.locked_until, null)
      assert.equal(await outbox.drainTrackingOutbox(options({ send, eventId: item.eventId })), 0)
      assert.equal(attempts, 1)
    })

    await t.test('retryable failures retain payload and honor backoff before retry', async () => {
      await reset()
      const item = fixture(capi)
      await outbox.enqueueTrackingEvent(item.event, item.tracking, options())
      let attempts = 0
      const send = async () => { attempts++; return { ok: false, reason: 'http', retryable: true, httpStatus: 503 } }
      await outbox.drainTrackingOutbox(options({ send, eventId: item.eventId }))
      const pending = await db.trackingDelivery.findUniqueOrThrow({ where: { event_id: item.eventId } })
      assert.deepEqual(pending.payload, clone(item.event))
      assert.equal(pending.attempts, 1)
      assert.ok(pending.next_attempt_at.getTime() > Date.now())
      assert.equal(pending.locked_until, null)
      assert.equal(await outbox.drainTrackingOutbox(options({ send, eventId: item.eventId })), 0)
      assert.equal(attempts, 1)
      await db.trackingDelivery.update({ where: { event_id: item.eventId }, data: { next_attempt_at: new Date(Date.now() - 60000) } })
      await outbox.drainTrackingOutbox(options({ send: success, eventId: item.eventId }))
      const ack = await db.trackingDelivery.findUniqueOrThrow({ where: { event_id: item.eventId } })
      assert.equal(ack.payload, null)
      assert.equal(ack.attempts, 2)
      assert.ok(ack.sent_at)
    })

    await t.test('worker lease recovery retries an abandoned eligible event', async () => {
      await reset()
      const item = fixture(capi)
      await outbox.enqueueTrackingEvent(item.event, item.tracking, options())
      await db.trackingDelivery.update({ where: { event_id: item.eventId }, data: { status: 'delivering', locked_until: new Date(Date.now() - 60000), next_attempt_at: new Date(Date.now() - 60000), attempts: 1 } })
      let attempts = 0
      await outbox.drainTrackingOutbox(options({ send: async () => { attempts++; return { ok: true, eventsReceived: 1 } }, eventId: item.eventId }))
      assert.equal(attempts, 1)
      const stored = await db.trackingDelivery.findUniqueOrThrow({ where: { event_id: item.eventId } })
      assert.equal(stored.payload, null)
      assert.ok(stored.sent_at)
      assert.equal(stored.locked_until, null)
    })

    await t.test('permanent failures clear delivery payload and cannot be retried', async () => {
      await reset()
      const item = fixture(capi)
      await outbox.enqueueTrackingEvent(item.event, item.tracking, options())
      let attempts = 0
      const send = async () => { attempts++; return { ok: false, reason: 'http', retryable: false, httpStatus: 400, errorCode: 100 } }
      await outbox.drainTrackingOutbox(options({ send, eventId: item.eventId }))
      const stored = await db.trackingDelivery.findUniqueOrThrow({ where: { event_id: item.eventId } })
      assert.equal(stored.payload, null)
      assert.equal(stored.locked_until, null)
      assert.ok(!JSON.stringify(stored.last_error).includes('SYNTHETIC_UNIT_TOKEN'))
      assert.equal(await outbox.drainTrackingOutbox(options({ send, eventId: item.eventId })), 0)
      assert.equal(attempts, 1)
    })

    await t.test('withdrawal cancels unsent events and blocks a late enqueue for that session', async () => {
      await reset()
      const first = fixture(capi)
      const second = fixture(capi, { session_id: first.sessionId })
      await outbox.enqueueTrackingEvent(first.event, first.tracking, options())
      await outbox.enqueueTrackingEvent(second.event, second.tracking, options())
      assert.equal(await outbox.withdrawTrackingSession(first.sessionId, options()), 2)
      const stored = await db.trackingDelivery.findMany({ where: { session_id: first.sessionId, event_name: { in: ['PageView', 'Lead'] } } })
      assert.equal(stored.length, 2)
      for (const row of stored) { assert.equal(row.payload, null); assert.equal(row.locked_until, null) }
      const late = fixture(capi, { session_id: first.sessionId })
      assert.equal((await outbox.enqueueTrackingEvent(late.event, late.tracking, options())).queued, false)
      assert.equal(await db.trackingDelivery.count({ where: { event_id: late.eventId } }), 0)
      let attempts = 0
      await outbox.drainTrackingOutbox(options({ send: async () => { attempts++; return { ok: true, eventsReceived: 1 } } }))
      assert.equal(attempts, 0)
    })

    await t.test('expired stored consent erases payload without provider transmission', async () => {
      await reset()
      const item = fixture(capi)
      await outbox.enqueueTrackingEvent(item.event, item.tracking, options())
      await db.trackingDelivery.update({ where: { event_id: item.eventId }, data: { consent_saved_at: new Date(Date.now() - 180 * 86400000) } })
      let attempts = 0
      await outbox.drainTrackingOutbox(options({ send: async () => { attempts++; return { ok: true, eventsReceived: 1 } }, eventId: item.eventId }))
      assert.equal(attempts, 0)
      assert.equal((await db.trackingDelivery.findUniqueOrThrow({ where: { event_id: item.eventId } })).payload, null)
    })

    await t.test('session rate limit stops the 31st PageView even when the IP key changes', async () => {
      await reset()
      const sessionId = randomUUID()
      const results = []
      for (let index = 0; index < 31; index++) {
        const item = fixture(capi, { session_id: sessionId })
        results.push(await outbox.enqueueTrackingEvent(item.event, item.tracking, options({ rateKey: hash('different-ip-' + index) })))
      }
      assert.equal(results.filter(result => result.queued).length, 30)
      assert.equal(results[30].reason, 'rate_limit')
      assert.equal(await db.trackingDelivery.count(), 30)
      const buckets = await db.trackingRateLimit.findMany()
      assert.ok(buckets.every(bucket => /^[a-f0-9]{64}$/.test(bucket.key)))
    })

    await t.test('independent trusted IP rate limit stops the 61st PageView across new sessions', async () => {
      await reset()
      const rateKey = hash('synthetic-trusted-ip-bucket')
      const results = []
      for (let index = 0; index < 61; index++) {
        const item = fixture(capi)
        results.push(await outbox.enqueueTrackingEvent(item.event, item.tracking, options({ rateKey })))
      }
      assert.equal(results.filter(result => result.queued).length, 60)
      assert.equal(results[60].reason, 'rate_limit')
      assert.equal(await db.trackingDelivery.count(), 60)
    })

    await t.test('global PageView limit bounds rotating sessions and IP keys without creating extra buckets', async () => {
      await reset()
      const now = Date.now()
      const frozen = loadModules(db, now)
      for (let index = 0; index < 600; index++) {
        const item = fixture(frozen.capi, { savedAt: now })
        assert.equal((await frozen.outbox.enqueueTrackingEvent(item.event, item.tracking, options({ rateKey: hash('synthetic-rotating-ip-' + index) }))).queued, true)
      }
      const before = await db.trackingRateLimit.count()
      const item = fixture(frozen.capi, { savedAt: now })
      assert.deepEqual(clone(await frozen.outbox.enqueueTrackingEvent(item.event, item.tracking, options({ rateKey: hash('synthetic-rotating-ip-over-limit') }))), { queued: false, reason: 'rate_limit' })
      assert.equal(await db.trackingDelivery.count(), 600)
      assert.equal(await db.trackingRateLimit.count(), before)
    })

    await t.test('repeated withdrawal is idempotent and does not consume additional rate buckets', async () => {
      await reset()
      const frozen = loadModules(db, Date.now())
      const sessionId = randomUUID()
      assert.equal(await frozen.outbox.withdrawTrackingSession(sessionId, options({ rateKey: hash('synthetic-original-withdraw-ip') })), 0)
      const rateRows = await db.trackingRateLimit.findMany({ orderBy: { key: 'asc' } })
      for (let index = 0; index < 20; index++) {
        assert.equal(await frozen.outbox.withdrawTrackingSession(sessionId, options({ rateKey: hash('synthetic-repeated-withdraw-ip-' + index) })), 0)
      }
      assert.deepEqual(await db.trackingRateLimit.findMany({ orderBy: { key: 'asc' } }), rateRows)
      assert.equal(await db.trackingDelivery.count(), 1)
      const tombstone = await db.trackingDelivery.findFirstOrThrow()
      assert.equal(tombstone.event_name, 'ConsentWithdrawn')
      assert.equal(tombstone.payload, null)
    })

    await t.test('withdrawal IP limit rejects rotating sessions before new bucket or tombstone creation', async () => {
      await reset()
      const frozen = loadModules(db, Date.now())
      const rateKey = hash('synthetic-withdraw-ip')
      for (let index = 0; index < 20; index++) assert.equal(await frozen.outbox.withdrawTrackingSession(randomUUID(), options({ rateKey })), 0)
      const before = await db.trackingRateLimit.count()
      assert.equal(await frozen.outbox.withdrawTrackingSession(randomUUID(), options({ rateKey })), -1)
      assert.equal(await db.trackingDelivery.count(), 20)
      assert.equal(await db.trackingRateLimit.count(), before)
    })

    await t.test('withdrawal global limit bounds rotating sessions and IP keys', async () => {
      await reset()
      const frozen = loadModules(db, Date.now())
      for (let index = 0; index < 120; index++) assert.equal(await frozen.outbox.withdrawTrackingSession(randomUUID(), options({ rateKey: hash('synthetic-withdraw-ip-' + index) })), 0)
      const before = await db.trackingRateLimit.count()
      assert.equal(await frozen.outbox.withdrawTrackingSession(randomUUID(), options({ rateKey: hash('synthetic-withdraw-ip-over-limit') })), -1)
      assert.equal(await db.trackingDelivery.count(), 120)
      assert.equal(await db.trackingRateLimit.count(), before)
    })
    await t.test('recorded session withdrawal survives saturated unknown-session limits and blocks later delivery', async () => {
      await reset()
      const now = Date.now()
      const frozen = loadModules(db, now)
      const item = fixture(frozen.capi, { savedAt: now })
      assert.equal((await frozen.outbox.enqueueTrackingEvent(item.event, item.tracking, options())).queued, true)
      for (let index = 0; index < 120; index++) {
        assert.equal(await frozen.outbox.withdrawTrackingSession(randomUUID(), options({ rateKey: hash('synthetic-saturating-withdraw-ip-' + index) })), 0)
      }
      assert.equal(await frozen.outbox.withdrawTrackingSession(randomUUID(), options({ rateKey: hash('synthetic-over-limit-withdraw-ip') })), -1)
      const rateRows = await db.trackingRateLimit.findMany({ orderBy: { key: 'asc' } })
      assert.equal(await frozen.outbox.withdrawTrackingSession(item.sessionId, options({ rateKey: hash('synthetic-known-withdraw-ip') })), 1)
      assert.deepEqual(await db.trackingRateLimit.findMany({ orderBy: { key: 'asc' } }), rateRows)
      const cancelled = await db.trackingDelivery.findUniqueOrThrow({ where: { event_id: item.eventId } })
      assert.equal(cancelled.status, 'cancelled')
      assert.equal(cancelled.payload, null)
      assert.equal(cancelled.locked_until, null)
      let providerCalls = 0
      assert.equal(await frozen.outbox.drainTrackingOutbox(options({ send: async () => { providerCalls++; return { ok: true, eventsReceived: 1 } } })), 0)
      assert.equal(providerCalls, 0)
      const late = fixture(frozen.capi, { savedAt: now, session_id: item.sessionId })
      assert.deepEqual(clone(await frozen.outbox.enqueueTrackingEvent(late.event, late.tracking, options())), { queued: false, reason: 'withdrawn' })
      assert.equal(await db.trackingDelivery.count({ where: { event_id: late.eventId } }), 0)
      assert.equal(await db.trackingDelivery.count({ where: { session_id: item.sessionId, event_name: 'ConsentWithdrawn' } }), 1)
      assert.deepEqual(await db.trackingRateLimit.findMany({ orderBy: { key: 'asc' } }), rateRows)
    })
    await t.test('retry cap and 48-hour delivery deadline clear remaining payload', async () => {
      await reset()
      const exhausted = fixture(capi)
      const expired = fixture(capi)
      await outbox.enqueueTrackingEvent(exhausted.event, exhausted.tracking, options())
      await outbox.enqueueTrackingEvent(expired.event, expired.tracking, options())
      await db.trackingDelivery.update({ where: { event_id: exhausted.eventId }, data: { status: 'delivering', attempts: 8, locked_until: new Date(Date.now() - 60000) } })
      await db.trackingDelivery.update({ where: { event_id: expired.eventId }, data: { created_at: new Date(Date.now() - 48 * 3600000) } })
      let attempts = 0
      await outbox.drainTrackingOutbox(options({ send: async () => { attempts++; return { ok: true, eventsReceived: 1 } } }))
      assert.equal(attempts, 0)
      for (const item of [exhausted, expired]) {
        const stored = await db.trackingDelivery.findUniqueOrThrow({ where: { event_id: item.eventId } })
        assert.equal(stored.payload, null)
        assert.equal(stored.status, 'failed')
      }
    })

    await t.test('status counts exclude withdrawal tombstones and expose no payload or identifiers', async () => {
      await reset()
      const item = fixture(capi)
      await outbox.enqueueTrackingEvent(item.event, item.tracking, options())
      await outbox.withdrawTrackingSession(item.sessionId, options())
      assert.deepEqual(clone(await outbox.getTrackingStatus(options())), { enabled: true, configured: true, available: true, counts: [{ event: 'PageView', status: 'cancelled', count: 1 }] })
      const disabledDb = new Proxy({}, { get() { throw new Error('Disabled tracking must not touch a database') } })
      assert.deepEqual(clone(await outbox.getTrackingStatus({ db: disabledDb, config: { ...config, enabled: false } })), { enabled: false, configured: false, available: true, counts: [] })
    })
  } finally { await harness.stop() }
})








