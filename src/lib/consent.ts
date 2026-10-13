export const CONSENT_KEY = "rk_consent_v1"
export type Consent = { analytics: boolean; marketing: boolean; savedAt: number; version: 2 }
const MAX_AGE = 180 * 24 * 60 * 60 * 1000
let current: Consent | null | undefined

export function readConsent(): Consent | null {
  if (typeof window === "undefined") return null
  try {
    const value = JSON.parse(localStorage.getItem(CONSENT_KEY) || "null")
    if (value?.version === 2 && typeof value.analytics === "boolean" && typeof value.marketing === "boolean" &&
        typeof value.savedAt === "number" && value.savedAt <= Date.now() && Date.now() - value.savedAt < MAX_AGE) {
      current = value
      return value
    }
    current = null
  } catch {
    // Browsers blocking storage can still honor an explicit choice for this page.
    if (current && Date.now() - current.savedAt < MAX_AGE) return current
  }
  return null
}

export function saveConsent(analytics: boolean, marketing: boolean): Consent {
  current = { analytics, marketing, savedAt: Date.now(), version: 2 }
  try { localStorage.setItem(CONSENT_KEY, JSON.stringify(current)) } catch { /* In-memory choice for this visit. */ }
  return current
}

export function clearMarketingStorage(clearAnalytics: boolean, clearAds: boolean) {
  try {
    if (clearAds) sessionStorage.removeItem("rk_marketing_attribution")
    if (clearAds) for (const key of Object.keys(sessionStorage)) {
      if (key.startsWith("rk_meta_measured_")) sessionStorage.removeItem(key)
    }
    if (clearAnalytics) for (const key of Object.keys(sessionStorage)) {
      if (key.startsWith("rk_measured_")) sessionStorage.removeItem(key)
    }
  } catch { /* Storage may be blocked. */ }
  // Remove first-party Google/Meta cookies on withdrawal. Third-party cookies are inaccessible here.
  const host = location.hostname.split(".")
  const domains = ["", ...host.map((_, i) => host.slice(i).join("."))]
  for (const item of document.cookie.split(";")) {
    const name = item.trim().split("=")[0]
    if (!((clearAnalytics && /^(_ga|_gid|_gat)/.test(name)) || (clearAds && /^(_gcl_|_fbp$|_fbc$)/.test(name)))) continue
    for (const domain of domains) document.cookie = `${name}=; Max-Age=0; Path=/;${domain ? ` Domain=${domain};` : ""} SameSite=Lax`
  }
}
