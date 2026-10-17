"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { CONSENT_KEY, clearMarketingStorage, readConsent, saveConsent, type Consent } from "@/lib/consent"
import { configureTracking, privatePage, syncTracking, trackingStarted } from "@/lib/tracking"
import { captureMarketingAttribution } from "@/lib/marketingAttribution"
import { withdrawTrackingContext } from "@/lib/trackingContext"

export default function ConsentManager({ trackingEnabled }: { trackingEnabled: boolean }) {
  const pathname = usePathname()
  const appliedConsent = useRef<Consent | null>(null)
  const [open, setOpen] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    configureTracking(trackingEnabled)
    const consent = readConsent()
    appliedConsent.current = consent
    // Cancel this tab's queued server events when its shared consent is no longer valid.
    if (!consent?.marketing) withdrawTrackingContext()
    if (privatePage()) {
      // A loaded third-party library cannot be unloaded on an SPA transition.
      if (trackingStarted()) location.reload()
      return
    }

    const timer = window.setTimeout(() => {
      setOpen(!consent)
      setAnalytics(consent?.analytics ?? false)
      setMarketing(consent?.marketing ?? false)
    }, 0)
    captureMarketingAttribution()
    syncTracking()
    function changedInAnotherTab(event: StorageEvent) {
      if (event.key !== CONSENT_KEY && event.key !== null) return
      const next = readConsent()
      if (!next?.marketing) withdrawTrackingContext()
      const previous = appliedConsent.current
      appliedConsent.current = next
      // Renewing the same choice must not reload every open tab and emit page views.
      if (previous?.analytics === next?.analytics && previous?.marketing === next?.marketing) return
      // A fresh document applies changed consent before loading any tags.
      location.reload()
    }
    window.addEventListener("storage", changedInAnotherTab)
    function openSettings() { setOpen(true) }
    window.addEventListener("rk:open-consent", openSettings)
    return () => {
      clearTimeout(timer)
      window.removeEventListener("storage", changedInAnotherTab)
      window.removeEventListener("rk:open-consent", openSettings)
    }
  }, [pathname, trackingEnabled])

  function choose(allowAnalytics: boolean, allowMarketing: boolean) {
    const previous = readConsent()
    const withdrawing = (previous?.analytics && !allowAnalytics) || (previous?.marketing && !allowMarketing)
    if (previous?.marketing && !allowMarketing) withdrawTrackingContext()
    appliedConsent.current = saveConsent(allowAnalytics, allowMarketing)
    setAnalytics(allowAnalytics)
    setMarketing(allowMarketing)
    setOpen(false)
    clearMarketingStorage(!allowAnalytics, !allowMarketing)
    // Reload with the stored choice to remove all previously loaded trackers/listeners.
    if (withdrawing && trackingStarted()) { location.reload(); return }
    captureMarketingAttribution()
    syncTracking()
  }

  if (/^\/(admin|api)(\/|$)/.test(pathname)) return null
  return <>
    <button type="button" onClick={() => setOpen(true)} className="fixed bottom-3 left-3 z-[70] rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 shadow-sm">Cookie-Einstellungen</button>
    {open && <section role="dialog" aria-modal="false" aria-labelledby="cookie-heading" className="fixed inset-x-3 bottom-14 z-[80] mx-auto max-h-[80vh] max-w-2xl overflow-y-auto rounded-xl border border-slate-300 bg-white p-5 text-slate-900 shadow-2xl sm:p-6">
      <h2 id="cookie-heading" className="text-lg font-semibold">Ihre Cookie-Einstellungen</h2>
      <p className="mt-2 text-sm leading-relaxed">Notwendige Funktionen ermöglichen Ihre Anfrage. Mit „Statistik“ messen wir über Google Analytics Besuche und erfolgreich gespeicherte Anfragen. Analytics ist mit Google Ads verknüpft; das Anfrageereignis ist dort als sekundäre Conversion eingerichtet. Ohne „Marketing“ bleiben die Werbe-Einwilligungssignale verweigert und die Zuordnung zu Anzeigenklicks ist eingeschränkt. „Marketing“ erlaubt zusätzlich die Kampagnenzuordnung und, sofern aktiviert, die direkte Werbemessung durch Google Ads sowie Meta Pixel und serverseitige Ereignisse (Facebook/Instagram). Mit Ihrer Marketing-Auswahl können E-Mail-Adresse und Telefonnummer einer erfolgreich gespeicherten Anfrage vor der Übermittlung an Google gehasht werden, um Anzeigen und Anfragen besser zuzuordnen. Diese Kennungen werden nicht an Google Analytics übermittelt. Dabei erhalten die Anbieter Nutzungs- und Geräteinformationen sowie pseudonyme Kennungen; eine Verarbeitung in den USA ist möglich. Einzelheiten finden Sie in der Datenschutzerklärung. Ihre Anfrage funktioniert auch ohne optionale Cookies.</p>
      <div className="my-4 flex flex-wrap gap-5 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" checked={analytics} onChange={e => setAnalytics(e.target.checked)} />Statistik (Google Analytics)</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={marketing} onChange={e => setMarketing(e.target.checked)} />Marketing (Google Ads und Meta)</label>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <button type="button" onClick={() => choose(false, false)} className="rounded border border-slate-600 px-3 py-3 text-sm font-medium">Nur notwendige</button>
        <button type="button" onClick={() => choose(analytics, marketing)} className="rounded border border-slate-600 px-3 py-3 text-sm font-medium">Auswahl speichern</button>
        <button type="button" onClick={() => choose(true, true)} className="rounded border border-slate-600 px-3 py-3 text-sm font-medium">Alle akzeptieren</button>
      </div>
      <a href="/datenschutz" className="mt-3 inline-block text-sm underline">Datenschutz</a>
    </section>}
  </>
}
