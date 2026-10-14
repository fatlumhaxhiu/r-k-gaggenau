import { readConsent } from "./consent"
import { buildTrackingContext, createTrackingEventId } from "./trackingContext"

export const META_PIXEL_ID = "1408138801461432"
const available = process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_META_PIXEL_ENABLED === "1"
const capiAvailable = process.env.NEXT_PUBLIC_META_CAPI_ENABLED === "1"
type Pixel = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void; queue: unknown[][]; loaded: boolean; version: string; push?: Pixel; disablePushState: boolean
}
type PixelWindow = Window & { fbq?: Pixel; _fbq?: Pixel }
let started = false
let lastPage = ""
let pageViewGeneration = 0
const measured = new Set<string>()

function safeUrl(value: string, ownPage: boolean): boolean {
  try {
    const url = new URL(value)
    const formAnchor = url.pathname.replace(/\/$/, "") === "/landing/grundreinigung" ? "#appointment"
      : /^\/landing\/(baureinigung|gewerbereinigung|privatreinigung|saisonale-pflege|spezialreinigung)\/?$/.test(url.pathname) ? "#contact" : ""
    if (url.hash && (url.origin !== location.origin || url.hash !== formAnchor)) return false
    if (ownPage && !/^\/(|kontakt|leistungen|uber-uns|datenschutz|impressum|thank-you|landing\/(baureinigung|gewerbereinigung|grundreinigung|privatreinigung|saisonale-pflege|spezialreinigung))\/?$/.test(url.pathname)) return false
    if (!ownPage && url.pathname !== "/" && url.origin !== location.origin) return false
    if (!ownPage && url.origin === location.origin && !safeUrl(value, true)) return false
    for (const [key, val] of url.searchParams) {
      if (!/^(utm_(source|medium|campaign|id|content|term)|fbclid|gclid|wbraid|gbraid)$/.test(key) || !/^[A-Za-z0-9_-]{1,256}$/.test(val)) return false
    }
    return true
  } catch { return false }
}

function allowed() {
  const consent = readConsent()
  return available && consent?.version === 3 && consent.marketing && safeUrl(location.href, true) && (!document.referrer || safeUrl(document.referrer, false))
}

async function sendPageView(eventId: string, page: string, generation: number) {
  if (!capiAvailable) return
  const initial = buildTrackingContext()
  if (!initial) return
  const deadline = Date.now() + 5000
  const current = () => allowed() && generation === pageViewGeneration
    && page === location.origin + location.pathname + location.search
  let tracking = initial
  // The async Pixel SDK may need a moment to set a genuine browser identifier.
  // The immediate Pixel event keeps its ID; only its nonblocking server copy waits.
  for (let check = 0; check <= 20; check++) {
    if (!current()) return
    const next = buildTrackingContext()
    if (!next || next.session_id !== initial.session_id) return
    tracking = next
    if (tracking.fbp || tracking.fbc) break
    const remaining = deadline - Date.now()
    if (check === 20 || remaining <= 0) return
    await new Promise<void>(resolve => window.setTimeout(resolve, Math.min(250, remaining)))
    if (Date.now() > deadline) return
  }
  const body = JSON.stringify({ event_id: eventId, page_location: page, tracking })
  // One transient retry shares the Pixel ID and cannot create another logical event.
  for (let attempt = 0; attempt < 2; attempt++) {
    if (!current() || buildTrackingContext()?.session_id !== initial.session_id) return
    try {
      const response = await fetch("/api/tracking/page-view", {
        method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true,
      })
      if (response.ok || response.status < 500 && response.status !== 429) return
    } catch { /* A server/network failure never blocks navigation or the form. */ }
  }
}

export function metaStarted() { return started }

export function syncMetaTracking() {
  if (!allowed()) return
  const w = window as PixelWindow
  if (!started) {
    if (w.fbq) return
    const pixel = ((...args: unknown[]) => {
      if (pixel.callMethod) pixel.callMethod(...args)
      else pixel.queue.push(args)
    }) as Pixel
    pixel.queue = []; pixel.loaded = true; pixel.version = "2.0"; pixel.push = pixel
    pixel.disablePushState = true
    w.fbq = pixel; w._fbq = pixel
    pixel("set", "autoConfig", false, META_PIXEL_ID)
    pixel("init", META_PIXEL_ID)
    started = true
    const script = document.createElement("script")
    script.id = "rk-meta-pixel"; script.async = true
    script.src = "https://connect.facebook.net/en_US/fbevents.js"
    document.head.appendChild(script)
  }
  const page = location.origin + location.pathname + location.search
  if (lastPage !== page) {
    const eventId = createTrackingEventId()
    w.fbq?.("trackSingle", META_PIXEL_ID, "PageView", {}, eventId ? { eventID: eventId } : {})
    lastPage = page
    const generation = ++pageViewGeneration
    if (eventId) void sendPageView(eventId, page, generation)
  }
}

export function trackMetaLead(eventId: string) {
  if (!allowed() || !/^[a-f0-9]{64}$/.test(eventId) || measured.has(eventId)) return
  const key = `rk_meta_measured_${eventId}`
  try { if (sessionStorage.getItem(key)) return } catch { /* Optional storage. */ }
  syncMetaTracking()
  if (!started) return
  ;(window as PixelWindow).fbq?.("trackSingle", META_PIXEL_ID, "Lead", {}, { eventID: eventId })
  measured.add(eventId)
  try { sessionStorage.setItem(key, "1") } catch { /* In-memory dedup remains. */ }
}
