"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { captureMarketingAttribution } from "@/lib/marketingAttribution"

interface LeadFormProps {
  readonly serviceName: string
}

export default function LeadForm({ serviceName }: LeadFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "error">("idle")

  const handleSubmit = (e: { preventDefault(): void; currentTarget: HTMLFormElement }): void => {
    e.preventDefault()
    setLoading(true)
    setStatus("idle")

    const form = e.currentTarget
    const formData = new FormData(form)
    const attribution = captureMarketingAttribution()
    const data = {
      first_name: (formData.get("first_name") as string | null) ?? "",
      last_name: (formData.get("last_name") as string | null) ?? "",
      email: (formData.get("email") as string | null) ?? "",
      phone: (formData.get("phone") as string | null) ?? "",
      city: (formData.get("city") as string | null) ?? "",
      service_requested: serviceName,
      source_page: globalThis.location?.pathname ?? "unknown",
      ...attribution,
    }

    void fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(async (res) => {
        if (res.ok) {
          router.push("/thank-you")
          form.reset()
        } else {
          const errorText = await res.text().catch(() => "Unknown error")
          console.error("Form submission failed status:", res.status, errorText)
          setStatus("error")
        }
      })
      .catch((err: unknown) => {
        console.error("Network or Client Error:", err)
        setStatus("error")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label htmlFor="lead-first-name" className="text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Vorname *</label>
        <input id="lead-first-name" name="first_name" required className="w-full px-6 py-4 rounded-lg bg-surface-container-high border-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-on-surface" placeholder="Max" type="text" />
      </div>
      <div className="space-y-2">
        <label htmlFor="lead-last-name" className="text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Nachname</label>
        <input id="lead-last-name" name="last_name" className="w-full px-6 py-4 rounded-lg bg-surface-container-high border-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-on-surface" placeholder="Mustermann" type="text" />
      </div>
      <div className="space-y-2">
        <label htmlFor="lead-email" className="text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">E-Mail-Adresse *</label>
        <input id="lead-email" name="email" required className="w-full px-6 py-4 rounded-lg bg-surface-container-high border-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-on-surface" placeholder="max@institution.de" type="email" />
      </div>
      <div className="space-y-2">
        <label htmlFor="lead-phone" className="text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Telefonnummer</label>
        <input id="lead-phone" name="phone" className="w-full px-6 py-4 rounded-lg bg-surface-container-high border-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-on-surface" placeholder="+49 000 000000" type="tel" />
      </div>
      <div className="space-y-2 md:col-span-2">
        <label htmlFor="lead-city" className="text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Stadt *</label>
        <input id="lead-city" name="city" required autoComplete="address-level2" className="w-full px-6 py-4 rounded-lg bg-surface-container-high border-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-on-surface" placeholder="Gaggenau" type="text" />
      </div>

      {status === "error" && (
        <div className="md:col-span-2 text-error text-sm font-medium">
          Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.
        </div>
      )}

      <div className="md:col-span-2 pt-4">
        <button type="submit" disabled={loading} className="w-full bg-primary text-white py-5 rounded-lg font-bold text-lg shadow-lg hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
          <span>{loading ? "Wird gesendet..." : "Termin vereinbaren"}</span>
          {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
        </button>
      </div>
    </form>
  )
}
