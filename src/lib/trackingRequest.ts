import "server-only"
import { createHash } from "node:crypto"
import { isIP } from "node:net"
import { hasMetaMarketingConsent } from "./metaConversions"

const SESSION_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const COOKIE_MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000
const SITE_HOSTS = new Set(["rk-gaggenau.de", "www.rk-gaggenau.de"])

export type TrackingContext = {
  consent: { version: 3; marketing: true; savedAt: number }
  session_id: string
  fbp?: string
  fbc?: string
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}
function containsControlCharacters(value: string): boolean {
  for (let index = 0; index < value.length; index++) {
    const code = value.charCodeAt(index)
    if (code < 32 || (code >= 127 && code <= 159)) return true
  }
  return false
}
function cookie(value: unknown, kind: "fbp" | "fbc", now: number): string | undefined {
  if (typeof value !== "string" || value.length > 300) return undefined
  const pattern = kind === "fbp"
    ? /^fb\.[0-2]\.([0-9]{13})\.[0-9]{1,40}$/
    : /^fb\.[0-2]\.([0-9]{13})\.[A-Za-z0-9_-]{1,256}$/
  const match = pattern.exec(value)
  if (!match) return undefined
  const savedAt = Number(match[1])
  return savedAt <= now && now - savedAt < COOKIE_MAX_AGE_MS ? value : undefined
}

// Copy only the consent and identifiers used by the tracking endpoint.
export function parseTrackingContext(value: unknown): TrackingContext | null {
  const now = Date.now()
  if (!record(value) || !hasMetaMarketingConsent(value.consent, now) || !record(value.consent) ||
      typeof value.session_id !== "string" || !SESSION_ID.test(value.session_id)) return null
  const consent = value.consent
  const result: TrackingContext = {
    consent: { version: 3, marketing: true, savedAt: consent.savedAt as number },
    session_id: value.session_id.toLowerCase(),
  }
  const fbp = cookie(value.fbp, "fbp", now)
  const fbc = cookie(value.fbc, "fbc", now)
  if (fbp) result.fbp = fbp
  if (fbc) result.fbc = fbc
  return result
}

export function isSameOriginTrackingRequest(req: Request): boolean {
  try {
    const fetchSite = req.headers.get("sec-fetch-site")
    if (fetchSite && !["same-origin", "same-site", "none"].includes(fetchSite)) return false
    const originValue = req.headers.get("origin")
    if (!originValue || originValue === "null") return false
    const origin = new URL(originValue)
    const requestUrl = new URL(req.url)
    if (originValue !== origin.origin || requestUrl.username || requestUrl.password) return false
    if (SITE_HOSTS.has(origin.hostname)) {
      if (origin.protocol !== "https:" || origin.port) return false
      if (requestUrl.protocol === "https:" && requestUrl.origin === origin.origin) return true
      if (!["http:", "https:"].includes(requestUrl.protocol) || process.env.META_CAPI_ALLOW_INTERNAL_ORIGIN !== "1" ||
          req.headers.get("host") !== origin.hostname || req.headers.get("x-forwarded-proto") !== "https") return false
      // Next may construct Request.url from its internal listen address and forwarded HTTPS protocol.
      // Source network restrictions and proxy header stripping must be verified externally before
      // enabling this flag; the flag does not authenticate Cloudflare. Forwarded Host is never trusted.
      const internalHost = ["localhost", "127.0.0.1", "0.0.0.0", "[::1]", "[::]"].includes(requestUrl.hostname)
      const publicHost = requestUrl.hostname === origin.hostname && !requestUrl.port
      return internalHost || publicHost
    }
    const localTests = process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"
    return localTests && ["localhost", "127.0.0.1"].includes(origin.hostname) &&
      ["http:", "https:"].includes(origin.protocol) && requestUrl.origin === origin.origin
  } catch { return false }
}

function validIp(value: string | null): string | undefined {
  return value && value.length <= 45 && isIP(value) ? value : undefined
}
export function requestMetaClient(req: Request): { clientUserAgent?: string; clientIpAddress?: string } {
  const result: { clientUserAgent?: string; clientIpAddress?: string } = {}
  const agent = req.headers.get("user-agent")
  if (agent && agent.length <= 512 && agent.trim() && !containsControlCharacters(agent)) result.clientUserAgent = agent.trim()
  if (process.env.META_CAPI_TRUST_PROXY_HEADERS !== "1") return result
  const cloudflareIp = validIp(req.headers.get("cf-connecting-ip"))
  const forwarded = req.headers.get("x-forwarded-for")
  // The edge must strip incoming proxy headers before this opt-in is enabled.
  const lastForwardedIp = forwarded && forwarded.length <= 2048 ? validIp(forwarded.split(",").at(-1)?.trim() ?? null) : undefined
  const address = cloudflareIp ?? lastForwardedIp
  if (address) result.clientIpAddress = address
  return result
}

export async function consumeTrackingJson(req: Request, maxBytes = 8192): Promise<unknown | null> {
  if (!Number.isSafeInteger(maxBytes) || maxBytes < 1 ||
      req.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() !== "application/json") return null
  const declared = req.headers.get("content-length")
  if (declared !== null && (!/^[0-9]+$/.test(declared) || !Number.isSafeInteger(Number(declared)) || Number(declared) > maxBytes)) return null
  if (!req.body || req.bodyUsed) return null
  let reader: ReadableStreamDefaultReader<Uint8Array> | undefined
  try {
    reader = req.body.getReader()
    const decoder = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true })
    let total = 0
    let text = ""
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      total += value.byteLength
      if (total > maxBytes) {
        await reader.cancel().catch(() => undefined)
        return null
      }
      text += decoder.decode(value, { stream: true })
    }
    if (declared !== null && Number(declared) !== total) return null
    text += decoder.decode()
    return JSON.parse(text) as unknown
  } catch { return null } finally { reader?.releaseLock() }
}

// An independent IP key prevents rotating session identifiers from resetting its limit.
// Callers can apply their separate session limit using the validated session_id.
export function getTrackingRateKey(req: Request, sessionId: string): string {
  const address = requestMetaClient(req).clientIpAddress
  const value = address ? `ip:${address}` : `session:${SESSION_ID.test(sessionId) ? sessionId.toLowerCase() : "invalid"}`
  return createHash("sha256").update(value, "utf8").digest("hex")
}




