"use client"

import { useRef, useState } from "react"
import PrivacyNotice from "./PrivacyNotice"
import { prepareLeadRequest, type PendingLeadRequest } from "@/lib/leadRequest"
import { trackSavedLead } from "@/lib/tracking"
import CleaningRequestFields from "./CleaningRequestFields"
import { useRouter } from "next/navigation"
import { captureMarketingAttribution } from "@/lib/marketingAttribution"

interface LeadFormProps {
  readonly serviceName: string
}

export default function LeadForm({ serviceName }: LeadFormProps) {
  const router = useRouter()
  const pending = useRef<PendingLeadRequest | null>(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "error">("idle")

  const handleSubmit = (e: { preventDefault(): void; currentTarget: HTMLFormElement }): void => {
    e.preventDefault()
    if (pending.current?.busy) return
    setLoading(true)
    setStatus("idle")

    const form = e.currentTarget
    const formData = new FormData(form)
    const attribution = captureMarketingAttribution()
    const data = {
      full_name: (formData.get("full_name") as string | null) ?? "",
      object_type: (formData.get("object_type") as string | null) ?? "",
      email: (formData.get("email") as string | null) ?? "",
      phone: (formData.get("phone") as string | null) ?? "",
      city: (formData.get("city") as string | null) ?? "",
      service_requested: (formData.get("service_requested") as string | null) ?? "",
      source_page: globalThis.location?.pathname ?? "unknown",
      ...attribution,
    }

    pending.current = prepareLeadRequest(pending.current, data)
    void fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Idempotency-Key": pending.current.key },
      body: pending.current.body,
    })
      .then(async (res) => {
        if (res.ok) {
          const result = await res.json().catch(() => null)
          await trackSavedLead(result?.event_id)
          pending.current = null
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
        if (pending.current) pending.current.busy = false
        setLoading(false)
      })
  }

  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={handleSubmit}>
      <CleaningRequestFields prefix="lead" serviceName={serviceName} />
      <div className="space-y-2">
        <label htmlFor="lead-email" className="text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">E-Mail-Adresse *</label>
        <input id="lead-email" name="email" required className="w-full px-6 py-4 rounded-lg bg-surface-container-high border-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-on-surface" placeholder="max@institution.de" type="email" />
      </div>
      <div className="space-y-2">
        <label htmlFor="lead-phone" className="text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Telefonnummer *</label>
        <input id="lead-phone" name="phone" required className="w-full px-6 py-4 rounded-lg bg-surface-container-high border-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-on-surface" placeholder="+49 000 000000" type="tel" />
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
        <div className="mb-5"><PrivacyNotice /></div>
        <button type="submit" disabled={loading} className="w-full bg-primary text-white py-5 rounded-lg font-bold text-lg shadow-lg hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
          <span>{loading ? "Wird gesendet..." : "Kostenlose Beratung anfragen"}</span>
          {!loading && (
            <svg aria-hidden="true" focusable="false" className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>
    </form>
  )
}
