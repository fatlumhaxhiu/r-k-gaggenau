import { readConsent } from "./consent"
import { metaStarted, syncMetaTracking, trackMetaLead } from "./metaTracking"

export const GA4_ID = "G-0SQT7RFP3D"
// Set only after replacing the old /thank-you URL conversion in Google Ads.
const ADS_SEND_TO = process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_SEND_TO || ""
const ADS_READY = /^AW-18267690559\/[A-Za-z0-9_-]+$/.test(ADS_SEND_TO)
type TrackingWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void }
let enabled = false
let started = false
let analyticsConfigured = false
let adsConfigured = false
let lastPage = ""
const measured = new Set<string>()

export function privatePage() { return /^\/(admin|api)(\/|$)/.test(location.pathname) }

function command(...args: unknown[]) {
  const w = window as TrackingWindow
  w.gtag?.(...args)
}

function measuredReferrer() {
  try { return document.referrer ? new URL(document.referrer).origin : "" } catch { return "" }
}

function measuredUrl() {
  const url = new URL(location.origin + location.pathname)
  const params = new URLSearchParams(location.search)
  // Retain controlled campaign attribution, never arbitrary form/query values.
  for (const name of ["utm_source", "utm_medium", "utm_campaign", "utm_id", "utm_content", "utm_term"]) {
    const value = params.get(name)
    if (value && /^[a-zA-Z0-9_-]{1,100}$/.test(value)) url.searchParams.set(name, value)
  }
  if (readConsent()?.marketing) {
    for (const name of ["gclid", "wbraid", "gbraid"]) {
      const value = params.get(name)
      if (value && /^[a-zA-Z0-9_-]{1,256}$/.test(value)) url.searchParams.set(name, value)
    }
  }
  return url.href
}

export function configureTracking(allow: boolean) { enabled = allow }

export function syncTracking() {
  if (!enabled || privatePage()) return
  syncMetaTracking()
  const consent = readConsent()
  if (!consent?.analytics && !(consent?.marketing && ADS_READY)) return
  const w = window as TrackingWindow
  if (!started) {
    w.dataLayer = w.dataLayer || []
    // gtag expects arguments objects, matching Google's reference snippet.
    // eslint-disable-next-line prefer-rest-params -- Google's queue API consumes IArguments.
    w.gtag = function () { w.dataLayer!.push(arguments) }
    command("consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" })
    command("set", "ads_data_redaction", true)
    command("js", new Date())
    started = true
  }
  command("consent", "update", {
    analytics_storage: consent.analytics ? "granted" : "denied",
    ad_storage: consent.marketing ? "granted" : "denied",
    ad_user_data: consent.marketing ? "granted" : "denied",
    ad_personalization: consent.marketing ? "granted" : "denied",
  })
  const page = measuredUrl()
  const referrer = measuredReferrer()
  if (consent.analytics && !analyticsConfigured) {
    // Explicitly enabled local previews appear in DebugView; production never gets this flag.
    const debug = process.env.NODE_ENV === "development" && ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname)
    command("config", GA4_ID, { send_page_view: false, page_location: page, page_referrer: referrer, allow_google_signals: false, allow_ad_personalization_signals: false, ...(debug ? { debug_mode: true } : {}) })
    analyticsConfigured = true
  }
  if (consent.marketing && ADS_READY && !adsConfigured) {
    command("config", "AW-18267690559", { send_page_view: false, page_location: page, page_referrer: referrer })
    adsConfigured = true
  }
  if (consent.analytics && lastPage !== page) {
    command("event", "page_view", { send_to: GA4_ID, page_location: page, page_referrer: referrer })
    lastPage = page
  }
  if (!document.getElementById("rk-google-tag")) {
    const script = document.createElement("script")
    script.id = "rk-google-tag"
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${consent.analytics ? GA4_ID : "AW-18267690559"}`
    document.head.appendChild(script)
  }
}

export function trackingStarted() { return started || metaStarted() }

export async function trackSavedLead(eventId: unknown): Promise<void> {
  try {
    if (!enabled || privatePage() || typeof eventId !== "string" || !/^[a-f0-9]{64}$/.test(eventId)) return
    trackMetaLead(eventId)
    const consent = readConsent()
    if (!consent?.analytics && !(consent?.marketing && ADS_READY)) return
    const storageKey = `rk_measured_${eventId}`
    if (measured.has(eventId)) return
    try { if (sessionStorage.getItem(storageKey)) return } catch { /* In-memory deduplication still works. */ }
    syncTracking()
    const pageContext = { page_location: measuredUrl(), page_referrer: measuredReferrer() }
    measured.add(eventId)
    try { sessionStorage.setItem(storageKey, "1") } catch { /* Storage is optional. */ }
    await new Promise<void>(resolve => {
      const timer = window.setTimeout(resolve, 1000)
      const done = () => { clearTimeout(timer); resolve() }
      if (consent.analytics) command("event", "generate_lead", { send_to: GA4_ID, event_id: eventId, ...pageContext, event_callback: done, event_timeout: 1000 })
      if (consent.marketing && ADS_READY) command("event", "conversion", { send_to: ADS_SEND_TO, transaction_id: eventId, ...pageContext, event_callback: done, event_timeout: 1000 })
    })
  } catch { /* A measurement failure must never turn a saved lead into a failed form submission. */ }
}
