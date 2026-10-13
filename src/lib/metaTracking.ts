import { readConsent } from "./consent"

export const META_PIXEL_ID = "1408138801461432"
// Production activation is a separate release step after privacy review.
const available = process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_META_PIXEL_ENABLED === "1"
type Pixel = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void; queue: unknown[][]; loaded: boolean; version: string; push?: Pixel; disablePushState: boolean
}
type PixelWindow = Window & { fbq?: Pixel; _fbq?: Pixel }
let started = false
let lastPage = ""
const measured = new Set<string>()

// The SDK reads the real URL/referrer. Do not load it on arbitrary queries or private paths.
function safeUrl(value: string, ownPage: boolean) {
  try {
    const url = new URL(value)
    // Only the fixed form anchors on reviewed landing pages may reach the SDK.
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
  return available && readConsent()?.marketing && safeUrl(location.href, true) && (!document.referrer || safeUrl(document.referrer, false))
}

export function metaStarted() { return started }

export function syncMetaTracking() {
  if (!allowed()) return
  const w = window as PixelWindow
  if (!started) {
    if (w.fbq) return // Do not take over another integration.
    const pixel = ((...args: unknown[]) => {
      if (pixel.callMethod) pixel.callMethod(...args)
      else pixel.queue.push(args)
    }) as Pixel
    pixel.queue = []; pixel.loaded = true; pixel.version = "2.0"; pixel.push = pixel
    pixel.disablePushState = true
    w.fbq = pixel; w._fbq = pixel
    pixel("set", "autoConfig", false, META_PIXEL_ID)
    pixel("init", META_PIXEL_ID) // No advanced matching or form values.
    started = true
    const script = document.createElement("script")
    script.id = "rk-meta-pixel"; script.async = true
    script.src = "https://connect.facebook.net/en_US/fbevents.js"
    document.head.appendChild(script)
  }
  if (lastPage !== location.href) {
    w.fbq?.("trackSingle", META_PIXEL_ID, "PageView")
    lastPage = location.href
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
