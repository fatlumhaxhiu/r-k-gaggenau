import { readConsent } from "./consent"

export type MarketingChannel =
  | "Google Ads"
  | "Facebook Ads"
  | "Organik"
  | "Direkt / Unbekannt"

export interface MarketingAttribution {
  marketing_channel: MarketingChannel
  campaign_name: string
}

const STORAGE_KEY = "rk_marketing_attribution"
const PAID_MEDIA = new Set(["cpc", "ppc", "paid", "paid_search", "paid_social"])
const FACEBOOK_SOURCES = new Set(["facebook", "fb", "meta", "instagram", "ig"])

function limit(value: string | null, maxLength = 255): string {
  return (value ?? "").trim().slice(0, maxLength)
}

export function channelFromVisit(params: URLSearchParams, referrer: string): MarketingChannel {
  const source = limit(params.get("utm_source"), 100).toLowerCase()
  const medium = limit(params.get("utm_medium"), 100).toLowerCase()

  if (params.has("gclid") || (source === "google" && PAID_MEDIA.has(medium))) {
    return "Google Ads"
  }

  if (FACEBOOK_SOURCES.has(source) && PAID_MEDIA.has(medium)) {
    return "Facebook Ads"
  }

  if (medium === "organic") return "Organik"

  if (referrer) {
    try {
      const hostname = new URL(referrer).hostname.toLowerCase()
      const searchEngines = ["google.", "bing.com", "duckduckgo.com", "yahoo.", "ecosia.org"]
      if (searchEngines.some((domain) => hostname.includes(domain))) return "Organik"
    } catch {
      // Ignore malformed referrers and keep the visit unattributed.
    }
  }

  return "Direkt / Unbekannt"
}

function hasTrackingSignal(params: URLSearchParams): boolean {
  return ["utm_source", "utm_medium", "utm_campaign", "gclid", "fbclid"].some((key) =>
    params.has(key),
  )
}

export function captureMarketingAttribution(): MarketingAttribution {
  const fallback: MarketingAttribution = {
    marketing_channel: "Direkt / Unbekannt",
    campaign_name: "",
  }

  if (typeof window === "undefined") return fallback
  if (!readConsent()?.marketing) {
    try { window.sessionStorage.removeItem(STORAGE_KEY) } catch { /* Storage is optional. */ }
    return fallback
  }

  const params = new URLSearchParams(window.location.search)

  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY)
    if (stored && !hasTrackingSignal(params)) {
      return JSON.parse(stored) as MarketingAttribution
    }
  } catch {
    // Attribution still works for the current page if sessionStorage is unavailable.
  }

  const attribution: MarketingAttribution = {
    marketing_channel: channelFromVisit(params, document.referrer),
    campaign_name: limit(params.get("utm_campaign")),
  }

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution))
  } catch {
    // Do not block lead submission when browser storage is unavailable.
  }

  return attribution
}
