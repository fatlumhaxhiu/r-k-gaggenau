import "server-only"
import { createHash } from "node:crypto"
import { isIP } from "node:net"

export const META_CAPI_PIXEL_ID = "1408138801461432"
const SITE_ORIGIN = "https://rk-gaggenau.de"
const CONSENT_MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000
const EVENT_MAX_AGE_SECONDS = 48 * 60 * 60
const HASH = /^[a-f0-9]{64}$/
const FORM_ROUTES = new Set([
  "/kontakt", "/landing/baureinigung", "/landing/gewerbereinigung", "/landing/grundreinigung",
  "/landing/privatreinigung", "/landing/saisonale-pflege", "/landing/spezialreinigung",
])
const PUBLIC_ROUTES = new Set(["/", "/leistungen", "/uber-uns", "/datenschutz", "/impressum", "/thank-you", ...FORM_ROUTES])

type MetaUserData = {
  client_user_agent: string
  client_ip_address?: string
  fbp?: string
  fbc?: string
  em?: [string]
  ph?: [string]
}
export type MetaServerEvent = {
  event_name: "Lead" | "PageView"
  event_id: string
  event_time: number
  event_source_url: string
  action_source: "website"
  user_data: MetaUserData
}
export type MetaEventInput = {
  eventId: string
  sourceUrl: string
  consent: unknown
  eventTime?: number
  clientUserAgent?: unknown
  clientIpAddress?: unknown
  fbp?: unknown
  fbc?: unknown
}
export type MetaLeadEventInput = MetaEventInput & { email?: unknown; phone?: unknown }
export type MetaCapiConfig = {
  enabled: boolean
  accessToken: string
  apiVersion: string
  testEventCode?: string
  timeoutMs?: number
  fetchImpl?: typeof fetch
}
export type MetaSendResult =
  | { ok: true; eventsReceived: number }
  | { ok: false; reason: "disabled" | "configuration" | "invalid_event" | "transport" | "timeout" | "http" | "response"; retryable: boolean; httpStatus?: number; errorCode?: number }

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}
export function hasMetaMarketingConsent(value: unknown, now = Date.now()): boolean {
  return record(value) && value.version === 3 && value.marketing === true &&
    typeof value.savedAt === "number" && Number.isFinite(value.savedAt) && value.savedAt > 0 &&
    value.savedAt <= now && now - value.savedAt < CONSENT_MAX_AGE_MS
}

// Reject unsafe inputs rather than silently attributing a private URL to a public page.
// The transmitted URL contains only the reviewed route, with no queries or fragments.
export function sanitizeMetaSourceUrl(value: unknown, eventName: "Lead" | "PageView"): string | null {
  if (typeof value !== "string" || value.length > 2048) return null
  try {
    const url = new URL(value)
    if (url.protocol !== "https:" || !["rk-gaggenau.de", "www.rk-gaggenau.de"].includes(url.hostname) || url.port || url.username || url.password) return null
    const path = url.pathname === "/" ? "/" : url.pathname.replace(/\/$/, "")
    if (!(eventName === "Lead" ? FORM_ROUTES : PUBLIC_ROUTES).has(path)) return null
    const anchor = path === "/landing/grundreinigung" ? "#appointment" : path.startsWith("/landing/") ? "#contact" : ""
    if (url.hash && url.hash !== anchor) return null
    for (const [key, val] of url.searchParams) {
      if (!/^(utm_(source|medium|campaign|id|content|term)|fbclid|gclid|wbraid|gbraid)$/.test(key) || !/^[A-Za-z0-9_-]{1,256}$/.test(val)) return null
    }
    return SITE_ORIGIN + path
  } catch { return null }
}

function hasControlCharacters(value: string): boolean {
  for (let index = 0; index < value.length; index++) {
    const code = value.charCodeAt(index)
    if (code < 32 || code === 127) return true
  }
  return false
}
function userAgent(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 && value.length <= 512 && !hasControlCharacters(value) ? value.trim() : null
}
function ipAddress(value: unknown): string | null {
  return typeof value === "string" && value.length <= 45 && isIP(value) ? value : null
}
function metaCookie(value: unknown, kind: "fbp" | "fbc", now = Date.now()): string | null {
  if (typeof value !== "string" || value.length > 300) return null
  const pattern = kind === "fbp" ? /^fb\.[0-2]\.([0-9]{13})\.[0-9]{1,40}$/ : /^fb\.[0-2]\.([0-9]{13})\.[A-Za-z0-9_-]{1,256}$/
  const match = pattern.exec(value)
  if (!match) return null
  const savedAt = Number(match[1])
  return savedAt <= now && now - savedAt < CONSENT_MAX_AGE_MS ? value : null
}
function hash(value: string): string { return createHash("sha256").update(value, "utf8").digest("hex") }
function emailHash(value: unknown): string | null {
  if (typeof value !== "string") return null
  const normalized = value.trim().toLowerCase()
  return normalized.length <= 254 && !hasControlCharacters(normalized) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) ? hash(normalized) : null
}
function phoneHash(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 64 || !/^\+?[0-9() .\/-]+$/.test(value)) return null
  const trimmed = value.trim()
  // Do not guess a country code for local numbers. International 00 is equivalent to +.
  if (!trimmed.startsWith("+") && !trimmed.startsWith("00") && trimmed.startsWith("0")) return null
  const normalized = trimmed.replace(/^00/, "").replace(/[^0-9]/g, "")
  return /^[1-9][0-9]{6,14}$/.test(normalized) ? hash(normalized) : null
}

function baseEvent(input: MetaEventInput, eventName: "Lead" | "PageView"): MetaServerEvent | null {
  const now = Date.now()
  const nowSeconds = Math.floor(now / 1000)
  if (!hasMetaMarketingConsent(input.consent, now) || typeof input.eventId !== "string" || !HASH.test(input.eventId)) return null
  const source = sanitizeMetaSourceUrl(input.sourceUrl, eventName)
  const agent = userAgent(input.clientUserAgent)
  const eventTime = input.eventTime ?? nowSeconds
  if (!source || !agent || !Number.isInteger(eventTime) || eventTime <= 0 || eventTime > nowSeconds || nowSeconds - eventTime >= EVENT_MAX_AGE_SECONDS) return null
  const userData: MetaUserData = { client_user_agent: agent }
  const ip = ipAddress(input.clientIpAddress)
  const fbp = metaCookie(input.fbp, "fbp", now)
  const fbc = metaCookie(input.fbc, "fbc", now)
  if (ip) userData.client_ip_address = ip
  if (fbp) userData.fbp = fbp
  if (fbc) userData.fbc = fbc
  return { event_name: eventName, event_id: input.eventId, event_time: eventTime, event_source_url: source, action_source: "website", user_data: userData }
}
export function buildMetaLeadEvent(input: MetaLeadEventInput): MetaServerEvent | null {
  const event = baseEvent(input, "Lead")
  if (!event) return null
  const em = emailHash(input.email)
  const ph = phoneHash(input.phone)
  if (em) event.user_data.em = [em]
  if (ph) event.user_data.ph = [ph]
  return Object.keys(event.user_data).length > 1 ? event : null
}
export function buildMetaPageViewEvent(input: MetaEventInput): MetaServerEvent | null {
  const event = baseEvent(input, "PageView")
  return event && Object.keys(event.user_data).length > 1 ? event : null
}

// No public-prefix variables or default API version: deployment must explicitly pin a supported version.
export function readMetaCapiConfig(env: Readonly<Record<string, string | undefined>> = process.env): MetaCapiConfig {
  return {
    enabled: env.META_CAPI_ENABLED === "1",
    accessToken: env.META_CAPI_ACCESS_TOKEN ?? "",
    apiVersion: env.META_CAPI_API_VERSION ?? "",
    ...(env.META_CAPI_TEST_EVENT_CODE ? { testEventCode: env.META_CAPI_TEST_EVENT_CODE } : {}),
  }
}

export function isMetaServerEvent(event: unknown): event is MetaServerEvent {
  if (!record(event) || !["Lead", "PageView"].includes(String(event.event_name)) || event.action_source !== "website" ||
    typeof event.event_id !== "string" || !HASH.test(event.event_id) || typeof event.event_time !== "number" || !Number.isInteger(event.event_time)) return false
  const nowSeconds = Math.floor(Date.now() / 1000)
  if (event.event_time > nowSeconds || event.event_time <= 0 || nowSeconds - event.event_time >= EVENT_MAX_AGE_SECONDS) return false
  if (Object.keys(event).some(key => !["event_name", "event_id", "event_time", "event_source_url", "action_source", "user_data"].includes(key))) return false
  if (sanitizeMetaSourceUrl(event.event_source_url, event.event_name as "Lead" | "PageView") !== event.event_source_url || !record(event.user_data)) return false
  const user = event.user_data
  if (userAgent(user.client_user_agent) !== user.client_user_agent || Object.keys(user).length < 2) return false
  const allowedKeys = event.event_name === "Lead" ? ["client_user_agent", "client_ip_address", "fbp", "fbc", "em", "ph"] : ["client_user_agent", "client_ip_address", "fbp", "fbc"]
  if (Object.keys(user).some(key => !allowedKeys.includes(key))) return false
  if (user.client_ip_address !== undefined && ipAddress(user.client_ip_address) !== user.client_ip_address) return false
  if (user.fbp !== undefined && metaCookie(user.fbp, "fbp") !== user.fbp) return false
  if (user.fbc !== undefined && metaCookie(user.fbc, "fbc") !== user.fbc) return false
  for (const key of ["em", "ph"]) if (user[key] !== undefined && (!Array.isArray(user[key]) || user[key].length !== 1 || typeof user[key][0] !== "string" || !HASH.test(user[key][0]))) return false
  return ["client_ip_address", "fbp", "fbc", "em", "ph"].some(key => user[key] !== undefined)
}

// One bounded attempt only; the durable outbox owns claims, backoff, and retries.
// Never expose vendor messages, response bodies, request URLs, headers or token values to callers/logs.
export async function sendMetaEvents(events: readonly MetaServerEvent[], config: MetaCapiConfig): Promise<MetaSendResult> {
  if (!config.enabled) return { ok: false, reason: "disabled", retryable: false }
  if (!config.accessToken || config.accessToken.length > 4096 || (/\s/.test(config.accessToken) || hasControlCharacters(config.accessToken)) || !/^v[1-9][0-9]?\.0$/.test(config.apiVersion) ||
    (config.testEventCode !== undefined && !/^TEST[A-Za-z0-9_-]{1,100}$/.test(config.testEventCode))) return { ok: false, reason: "configuration", retryable: false }
  if (!Array.isArray(events) || events.length < 1 || events.length > 100 || !events.every(isMetaServerEvent)) return { ok: false, reason: "invalid_event", retryable: false }
  const timeoutMs = Math.min(10000, Math.max(10, config.timeoutMs ?? 5000))
  if (!Number.isFinite(timeoutMs)) return { ok: false, reason: "configuration", retryable: false }
  const controller = new AbortController()
  let timedOut = false
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<MetaSendResult>(resolve => {
    timer = setTimeout(() => { timedOut = true; controller.abort(); resolve({ ok: false, reason: "timeout", retryable: true }) }, timeoutMs)
  })
  const request = (async (): Promise<MetaSendResult> => {
    try {
      const response = await (config.fetchImpl ?? fetch)(`https://graph.facebook.com/${config.apiVersion}/${META_CAPI_PIXEL_ID}/events`, {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.accessToken}` },
        body: JSON.stringify({ data: events, ...(config.testEventCode ? { test_event_code: config.testEventCode } : {}) }),
        signal: controller.signal, cache: "no-store", redirect: "error",
      })
      const body: unknown = await response.json().catch(() => null)
      const error = record(body) && record(body.error) ? body.error : null
      const errorCode = error && typeof error.code === "number" && Number.isInteger(error.code) ? error.code : undefined
      if (!response.ok || error) return { ok: false, reason: "http", retryable: response.status === 429 || response.status >= 500 || error?.is_transient === true || [1, 2, 4, 17, 32, 613].includes(errorCode ?? -1), httpStatus: response.status, ...(errorCode !== undefined ? { errorCode } : {}) }
      if (!record(body) || body.events_received !== events.length) return { ok: false, reason: "response", retryable: true, httpStatus: response.status }
      return { ok: true, eventsReceived: events.length }
    } catch { return { ok: false, reason: timedOut ? "timeout" : "transport", retryable: true } }
  })()
  try { return await Promise.race([request, timeout]) } finally { if (timer) clearTimeout(timer) }
}