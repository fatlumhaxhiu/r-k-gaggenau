import "server-only"
import { createHash } from "node:crypto"
import { Prisma, PrismaClient, type TrackingDelivery } from "@prisma/client"
import { hasMetaMarketingConsent, isMetaServerEvent, readMetaCapiConfig, sendMetaEvents, type MetaCapiConfig, type MetaSendResult, type MetaServerEvent } from "./metaConversions"
import { parseTrackingContext, type TrackingContext } from "./trackingRequest"

const MAX_ATTEMPTS = 8
const RETRY_WINDOW_MS = 48 * 60 * 60 * 1000
const SESSION_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const HEX_ID = /^[a-f0-9]{64}$/
let client: PrismaClient | undefined
let draining = false
const globalWorker = globalThis as typeof globalThis & { rkTrackingWorker?: ReturnType<typeof setInterval> }

type Options = { db?: PrismaClient; config?: MetaCapiConfig }
export type EnqueueOptions = Options & { rateKey?: string }
export type DrainOptions = Options & { send?: typeof sendMetaEvents; limit?: number; eventId?: string }
export type EnqueueResult = { queued: boolean; duplicate?: boolean; reason?: "disabled" | "consent" | "invalid_event" | "withdrawn" | "rate_limit" }
function dbFor(options: Options): PrismaClient {
  // Tracking uses a quiet client: Prisma error formatting must not reflect transient payloads.
  return options.db ?? (client ??= new PrismaClient({ log: [] }))
}
function configFor(options: Options): MetaCapiConfig { return options.config ?? readMetaCapiConfig() }
export function metaCapiConfigured(config = readMetaCapiConfig()): boolean {
  return config.enabled && Boolean(config.accessToken) && /^v[1-9][0-9]?\.0$/.test(config.apiVersion)
}
function opaque(value: string): string { return createHash("sha256").update(value).digest("hex") }
function withdrawalId(sessionId: string): string { return opaque(`withdraw:${sessionId.toLowerCase()}`) }
async function lockSession(tx: Prisma.TransactionClient, sessionId: string) {
  await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtextextended(${sessionId.toLowerCase()}, 0))::text`
}
async function sessionWithdrawn(tx: Prisma.TransactionClient, sessionId: string): Promise<boolean> {
  return Boolean(await tx.trackingDelivery.findUnique({ where: { event_id: withdrawalId(sessionId) }, select: { event_id: true } }))
}
async function consumeRate(tx: Prisma.TransactionClient, sessionId: string, rateKey: string | undefined, purpose: "page" | "withdraw"): Promise<boolean> {
  const minute = Math.floor(Date.now() / 60000)
  // Check stable buckets before a client-chosen session, so rotating UUIDs cannot grow the table without bound.
  const buckets = [{ key: opaque(`${purpose}:global:${minute}`), limit: purpose === "page" ? 600 : 120 }]
  if (rateKey && HEX_ID.test(rateKey)) buckets.push({ key: opaque(`${purpose}:ip:${rateKey}:${minute}`), limit: purpose === "page" ? 60 : 20 })
  buckets.push({ key: opaque(`${purpose}:session:${sessionId}:${minute}`), limit: purpose === "page" ? 30 : 5 })
  for (const bucket of buckets) {
    const row = await tx.trackingRateLimit.upsert({ where: { key: bucket.key }, create: { key: bucket.key, count: 1, expires_at: new Date((minute + 2) * 60000) }, update: { count: { increment: 1 } }, select: { count: true } })
    if (row.count > bucket.limit) return false
  }
  return true
}
export async function enqueueTrackingEvent(event: MetaServerEvent, context: TrackingContext, options: EnqueueOptions = {}): Promise<EnqueueResult> {
  if (!metaCapiConfigured(configFor(options))) return { queued: false, reason: "disabled" }
  const validContext = parseTrackingContext(context)
  if (!validContext) return { queued: false, reason: "consent" }
  if (!isMetaServerEvent(event)) return { queued: false, reason: "invalid_event" }
  const sessionId = validContext.session_id.toLowerCase()
  return dbFor(options).$transaction(async tx => {
    await lockSession(tx, sessionId)
    if (await sessionWithdrawn(tx, sessionId)) return { queued: false, reason: "withdrawn" }
    const existing = await tx.trackingDelivery.findUnique({ where: { event_id: event.event_id }, select: { event_id: true } })
    if (existing) return { queued: false, duplicate: true }
    if (event.event_name === "PageView" && !(await consumeRate(tx, sessionId, options.rateKey, "page"))) return { queued: false, reason: "rate_limit" }
    const inserted = await tx.trackingDelivery.createMany({
      data: [{ event_id: event.event_id, session_id: sessionId, event_name: event.event_name, payload: event as unknown as Prisma.InputJsonValue, consent_version: 3, consent_saved_at: new Date(validContext.consent.savedAt) }],
      skipDuplicates: true,
    })
    return inserted.count === 1 ? { queued: true } : { queued: false, duplicate: true }
  }, { maxWait: 3000, timeout: 8000 })
}

export async function withdrawTrackingSession(sessionId: string, options: EnqueueOptions = {}): Promise<number> {
  if (!configFor(options).enabled || !SESSION_ID.test(sessionId)) return 0
  sessionId = sessionId.toLowerCase()
  return dbFor(options).$transaction(async tx => {
    await lockSession(tx, sessionId)
    if (await sessionWithdrawn(tx, sessionId)) return 0
    const recorded = await tx.trackingDelivery.findFirst({ where: { session_id: sessionId, event_name: { in: ["Lead", "PageView"] } }, select: { event_id: true } })
    // Bound new unknown-session tombstones without preventing withdrawal of recorded deliveries.
    if (!recorded && !(await consumeRate(tx, sessionId, options.rateKey, "withdraw"))) return -1
    // A tombstone prevents requests already in flight from re-enqueuing the withdrawn visit.
    await tx.trackingDelivery.upsert({
      where: { event_id: withdrawalId(sessionId) },
      create: { event_id: withdrawalId(sessionId), session_id: sessionId, event_name: "ConsentWithdrawn", payload: Prisma.DbNull, consent_version: 3, consent_saved_at: new Date(), status: "cancelled", last_error: "withdrawn" },
      update: {},
    })
    const result = await tx.trackingDelivery.updateMany({ where: { session_id: sessionId, event_name: { in: ["Lead", "PageView"] }, status: { in: ["pending", "delivering"] } }, data: { status: "cancelled", payload: Prisma.DbNull, locked_until: null, last_error: "withdrawn" } })
    return result.count
  }, { maxWait: 12000, timeout: 8000 })
}

async function expireTechnicalData(db: PrismaClient): Promise<void> {
  const now = new Date()
  await db.trackingRateLimit.deleteMany({ where: { expires_at: { lte: now } } })
  await db.trackingDelivery.updateMany({ where: { event_name: { in: ["Lead", "PageView"] }, status: { in: ["pending", "delivering"] }, OR: [{ created_at: { lte: new Date(now.getTime() - RETRY_WINDOW_MS) } }, { attempts: { gte: MAX_ATTEMPTS }, locked_until: { lte: now } }, { consent_version: { not: 3 } }, { consent_saved_at: { lte: new Date(now.getTime() - 180 * 86400000) } }] }, data: { status: "failed", payload: Prisma.DbNull, locked_until: null, last_error: "expired" } })
}

async function claimOne(db: PrismaClient, leaseMs: number, eventId?: string): Promise<TrackingDelivery | null> {
  const match = eventId ? Prisma.sql`AND event_id = ${eventId}` : Prisma.empty
  const rows = await db.$queryRaw<TrackingDelivery[]>(Prisma.sql`
    WITH due AS (
      SELECT event_id FROM tracking_deliveries
      WHERE status IN ('pending', 'delivering') AND payload IS NOT NULL
        AND attempts < ${MAX_ATTEMPTS} AND consent_version = 3
        AND next_attempt_at <= CURRENT_TIMESTAMP
        AND (locked_until IS NULL OR locked_until <= CURRENT_TIMESTAMP)
        AND created_at > CURRENT_TIMESTAMP - INTERVAL '48 hours'
        ${match}
      ORDER BY next_attempt_at, created_at
      FOR UPDATE SKIP LOCKED LIMIT 1
    )
    UPDATE tracking_deliveries AS delivery
    SET status = 'delivering', attempts = attempts + 1,
        locked_until = CURRENT_TIMESTAMP + (${leaseMs} * INTERVAL '1 millisecond')
    FROM due WHERE delivery.event_id = due.event_id
    RETURNING delivery.*
  `)
  return rows[0] ?? null
}
function deliveryError(result: Exclude<MetaSendResult, { ok: true }>): string {
  return [result.reason, result.httpStatus, result.errorCode].filter(value => value !== undefined).join(":").slice(0, 100)
}

async function finishOne(db: PrismaClient, claimed: TrackingDelivery, config: MetaCapiConfig, send: typeof sendMetaEvents): Promise<void> {
  const timeoutMs = Math.min(10000, Math.max(10, config.timeoutMs ?? 5000))
  await db.$transaction(async tx => {
    // Serialize with withdrawal until this already-started bounded delivery completes.
    await lockSession(tx, claimed.session_id)
    const row = await tx.trackingDelivery.findUnique({ where: { event_id: claimed.event_id } })
    if (!row || row.status !== "delivering" || row.attempts !== claimed.attempts) return
    const validConsent = hasMetaMarketingConsent({ version: row.consent_version, marketing: true, savedAt: row.consent_saved_at.getTime() })
    const validPayload = isMetaServerEvent(row.payload)
    if (!validConsent || !validPayload || await sessionWithdrawn(tx, row.session_id)) {
      await tx.trackingDelivery.update({ where: { event_id: row.event_id }, data: { status: "cancelled", payload: Prisma.DbNull, locked_until: null, last_error: validConsent && validPayload ? "withdrawn" : "expired" } })
      return
    }
    const result = await send([row.payload as unknown as MetaServerEvent], config)
    if (result.ok) {
      await tx.trackingDelivery.update({ where: { event_id: row.event_id }, data: { status: "sent", payload: Prisma.DbNull, locked_until: null, last_error: null, sent_at: new Date() } })
      return
    }
    const eventDeadline = (row.payload as unknown as MetaServerEvent).event_time * 1000 + RETRY_WINDOW_MS
    const delayMs = Math.min(3600000, 30000 * 2 ** Math.max(0, row.attempts - 1))
    const next = new Date(Date.now() + delayMs)
    const terminal = !result.retryable || row.attempts >= MAX_ATTEMPTS || next.getTime() >= eventDeadline
    await tx.trackingDelivery.update({ where: { event_id: row.event_id }, data: { status: terminal ? "failed" : "pending", payload: terminal ? Prisma.DbNull : row.payload as Prisma.InputJsonValue, locked_until: null, last_error: deliveryError(result), next_attempt_at: next } })
  }, { maxWait: 3000, timeout: timeoutMs + 5000 })
}

export async function drainTrackingOutbox(options: DrainOptions = {}): Promise<number> {
  const config = configFor(options)
  if (!metaCapiConfigured(config) || draining || options.eventId && !HEX_ID.test(options.eventId)) return 0
  draining = true
  let completed = 0
  try {
    const db = dbFor(options)
    await expireTechnicalData(db)
    const limit = Math.min(5, Math.max(1, options.limit ?? 5))
    const timeoutMs = Math.min(10000, Math.max(10, config.timeoutMs ?? 5000))
    for (let index = 0; index < limit; index++) {
      const row = await claimOne(db, Math.min(20000, timeoutMs * 2), options.eventId)
      if (!row) break
      await finishOne(db, row, config, options.send ?? sendMetaEvents)
      completed++
    }
  } catch { /* Never reflect provider/DB errors containing transient data or disrupt a saved enquiry. */ }
  finally { draining = false }
  return completed
}

export function startTrackingWorker(): void {
  if (!metaCapiConfigured() || globalWorker.rkTrackingWorker || process.env.NEXT_PHASE === "phase-production-build") return
  globalWorker.rkTrackingWorker = setInterval(() => { void drainTrackingOutbox() }, 30000)
  globalWorker.rkTrackingWorker.unref()
}

export async function getTrackingStatus(options: Options = {}) {
  const config = configFor(options)
  if (!config.enabled) return { enabled: false, configured: false, available: true, counts: [] }
  if (!metaCapiConfigured(config)) return { enabled: true, configured: false, available: true, counts: [] }
  try {
    const rows = await dbFor(options).trackingDelivery.groupBy({ by: ["event_name", "status"], where: { event_name: { in: ["Lead", "PageView"] } }, _count: { _all: true } })
    return { enabled: true, configured: true, available: true, counts: rows.map(row => ({ event: row.event_name, status: row.status, count: row._count._all })) }
  } catch { return { enabled: true, configured: true, available: false, counts: [] } }
}