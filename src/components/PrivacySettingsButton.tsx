"use client"

export default function PrivacySettingsButton() {
  return <button type="button" onClick={() => window.dispatchEvent(new Event("rk:open-consent"))}
    className="rounded-lg border border-primary bg-primary px-5 py-3 font-semibold text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
    Cookie-Auswahl ändern
  </button>
}
