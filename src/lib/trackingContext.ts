import { readConsent } from "./consent"

const SESSION_KEY = "rk_capi_session"
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i
const withdrawn = new Set<string>()
export type BrowserTrackingContext = {
  consent: { version: 3; marketing: true; savedAt: number }
  session_id: string
  fbp?: string
  fbc?: string
}

function readPixelCookie(name: "_fbp" | "_fbc") {
  try {
    const encoded = document.cookie.split(";").map(item => item.trim()).find(item => item.startsWith(`${name}=`))?.slice(name.length + 1)
    if (!encoded) return undefined
    const value = decodeURIComponent(encoded)
    const format = name === "_fbp" ? /^fb\.[0-2]\.\d{13}\.\d{1,40}$/ : /^fb\.[0-2]\.\d{13}\.[A-Za-z0-9_-]{1,256}$/
    if (!format.test(value)) return undefined
    const timestamp = Number(value.split(".")[2])
    if (!Number.isSafeInteger(timestamp) || timestamp <= 0 || timestamp > Date.now() || Date.now() - timestamp >= 180 * 86400_000) return undefined
    return value
  } catch { return undefined }
}

// Only an existing session is cancelled. No consent or identifier is created by withdrawal.
export function withdrawTrackingContext(): void {
  let sessionId: string | null = null
  try {
    sessionId = sessionStorage.getItem(SESSION_KEY)
    sessionStorage.removeItem(SESSION_KEY)
  } catch { return }
  if (!sessionId || !UUID.test(sessionId) || withdrawn.has(sessionId)) return
  withdrawn.add(sessionId)
  try {
    void fetch("/api/tracking/withdraw", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId }), keepalive: true,
    }).catch(() => { /* Cancellation transport is best effort and never blocks consent changes. */ })
  } catch { /* A blocked transport must not prevent withdrawing consent locally. */ }
}

// Transient transport context, never part of CRM contact data or its request fingerprint.
export function buildTrackingContext(): BrowserTrackingContext | undefined {
  const consent = readConsent()
  if (!consent?.marketing || consent.version !== 3) {
    withdrawTrackingContext()
    return undefined
  }
  let sessionId: string
  try {
    const previous = sessionStorage.getItem(SESSION_KEY)
    sessionId = previous && UUID.test(previous) ? previous : crypto.randomUUID()
    if (sessionId !== previous) sessionStorage.setItem(SESSION_KEY, sessionId)
    if (sessionStorage.getItem(SESSION_KEY) !== sessionId) return undefined
  } catch { return undefined } // Do not create a server session that cannot later be cancelled.
  const fbp = readPixelCookie("_fbp")
  const fbc = readPixelCookie("_fbc")
  return {
    consent: { version: 3, marketing: true, savedAt: consent.savedAt }, session_id: sessionId,
    ...(fbp ? { fbp } : {}), ...(fbc ? { fbc } : {}),
  }
}

export function createTrackingEventId(): string | undefined {
  try {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)), value => value.toString(16).padStart(2, "0")).join("")
  } catch { return undefined }
}
