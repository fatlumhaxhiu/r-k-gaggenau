import { readConsent } from "./consent"
import { hashSavedLeadContact, type SavedLeadContact } from "./enhancedConversions"
import { metaStarted, syncMetaTracking, trackMetaLead } from "./metaTracking"
import { createTrackingEventId } from "./trackingContext"

export const GA4_ID = "G-0SQT7RFP3D"
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || ""
const GTM_READY = /^GTM-[A-Z0-9]+$/.test(GTM_ID)
// Direct tags are a fallback until the reviewed GTM container is published.
const ADS_SEND_TO = process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_SEND_TO || ""
const ADS_READY = /^AW-18267690559\/[A-Za-z0-9_-]+$/.test(ADS_SEND_TO)
type TrackingWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void }
let enabled = false
let started = false
let analyticsConfigured = false
let adsConfigured = false
let lastPage = ""
let activeUserDataEvent = ""
let lastPageAnalytics = false
let lastPageMarketing = false
const measured = new Set<string>()

export function privatePage() { return /^\/(admin|api)(\/|$)/.test(location.pathname) }

function command(...args: unknown[]) {
  ;(window as TrackingWindow).gtag?.(...args)
}

function dataLayer() {
  const w = window as TrackingWindow
  return w.dataLayer = w.dataLayer || []
}

function measuredReferrer() {
  try { return document.referrer ? new URL(document.referrer).origin : "" } catch { return "" }
}

function measuredUrl() {
  const url = new URL(location.origin + location.pathname)
  const params = new URLSearchParams(location.search)
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

function consentFlags() {
  const consent = readConsent()
  return { analytics_consent: !!consent?.analytics, marketing_consent: !!consent?.marketing }
}

function gtmConsent() {
  const flags = consentFlags()
  // A GTM consent template applies these through its Consent APIs before measurement tags.
  dataLayer().push({ event: "rk_consent_update", ...flags })
  return flags
}

function syncGtmTracking() {
  const flags = gtmConsent()
  if (!flags.analytics_consent && !flags.marketing_consent) return
  if (!started) {
    dataLayer().push({ "gtm.start": Date.now(), event: "gtm.js" })
    const script = document.createElement("script")
    script.id = "rk-gtm"; script.async = true
    script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`
    document.head.appendChild(script)
    started = true
  }
  const page = measuredUrl()
  const samePage = lastPage === page
  if (!samePage || (flags.analytics_consent && !lastPageAnalytics) || (flags.marketing_consent && !lastPageMarketing)) {
    dataLayer().push({ rk_user_data: null })
    activeUserDataEvent = ""
    dataLayer().push({
      event: "rk_page_view", event_id: createTrackingEventId(),
      page_location: page, page_referrer: measuredReferrer(), ...flags,
      // Consent is applied separately above. A late Marketing grant on this
      // already-counted page opens only Ads dispatch, without another GA4 view.
      analytics_consent: flags.analytics_consent && (!samePage || !lastPageAnalytics),
    })
    lastPage = page
    lastPageAnalytics = flags.analytics_consent
    lastPageMarketing = flags.marketing_consent
  }
}

export function configureTracking(allow: boolean) { enabled = allow }

export function syncTracking() {
  if (!enabled || privatePage()) return
  syncMetaTracking()
  if (GTM_READY) { syncGtmTracking(); return }
  const consent = readConsent()
  if (!consent?.analytics && !(consent?.marketing && ADS_READY)) return
  const w = window as TrackingWindow
  if (!started) {
    w.dataLayer = w.dataLayer || []
    // eslint-disable-next-line prefer-rest-params -- Google's reference queue consumes IArguments.
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
    script.id = "rk-google-tag"; script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${consent.analytics ? GA4_ID : "AW-18267690559"}`
    document.head.appendChild(script)
  }
}

export function trackingStarted() { return started || metaStarted() }

async function trackGtmLead(eventId: string, contact?: SavedLeadContact) {
  let userData = readConsent()?.marketing ? await hashSavedLeadContact(contact) : {}
  const flags = gtmConsent()
  // Consent can change while WebCrypto is hashing.
  if (!flags.marketing_consent) userData = {}
  if (!flags.analytics_consent && !flags.marketing_consent) return
  await new Promise<void>(resolve => {
    const payload: Record<string, unknown> = {
      event: "rk_saved_lead", event_id: eventId,
      page_location: measuredUrl(), page_referrer: measuredReferrer(), ...flags,
      rk_user_data: flags.marketing_consent && Object.keys(userData).length ? userData : null,
    }
    let settled = false
    const dispatchDeadline = Date.now() + 1000
    const done = () => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      // Clear both the GTM data model and this retained queue object's matching hashes.
      payload.rk_user_data = null
      userData = {}
      if (activeUserDataEvent === eventId) {
        dataLayer().push({ rk_user_data: null })
        activeUserDataEvent = ""
      }
      resolve()
    }
    const timer = window.setTimeout(done, 1000)
    // GTM can report tag completion when the SDK only enqueued the conversion.
    // Keep matching data for this bounded dispatch window, then always remove it.
    payload.eventCallback = () => { if (Date.now() >= dispatchDeadline) done() }
    payload.eventTimeout = 1000
    activeUserDataEvent = eventId
    dataLayer().push(payload)
  })
}

export async function trackSavedLead(eventId: unknown, contact?: SavedLeadContact): Promise<void> {
  try {
    if (!enabled || privatePage() || typeof eventId !== "string" || !/^[a-f0-9]{64}$/.test(eventId)) return
    trackMetaLead(eventId)
    const consent = readConsent()
    if (!consent?.analytics && !(consent?.marketing && (GTM_READY || ADS_READY))) return
    const storageKey = `rk_measured_${eventId}`
    if (measured.has(eventId)) return
    try { if (sessionStorage.getItem(storageKey)) return } catch { /* In-memory dedup still works. */ }
    syncTracking()
    measured.add(eventId)
    try { sessionStorage.setItem(storageKey, "1") } catch { /* Storage is optional. */ }
    if (GTM_READY) { await trackGtmLead(eventId, contact); return }
    const pageContext = { page_location: measuredUrl(), page_referrer: measuredReferrer() }
    await new Promise<void>(resolve => {
      const timer = window.setTimeout(resolve, 1000)
      const done = () => { clearTimeout(timer); resolve() }
      if (consent.analytics) command("event", "generate_lead", { send_to: GA4_ID, event_id: eventId, ...pageContext, event_callback: done, event_timeout: 1000 })
      if (consent.marketing && ADS_READY) command("event", "conversion", { send_to: ADS_SEND_TO, transaction_id: eventId, ...pageContext, event_callback: done, event_timeout: 1000 })
    })
  } catch { /* Measurement must never change the success of a saved request. */ }
}
