"use client"

import { useRef, useState } from "react"
import PrivacyNotice from "./PrivacyNotice"
import { prepareLeadRequest, type PendingLeadRequest } from "@/lib/leadRequest"
import { trackSavedLead } from "@/lib/tracking"
import { buildTrackingContext } from "@/lib/trackingContext"
import CleaningRequestFields from "./CleaningRequestFields"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { captureMarketingAttribution } from "@/lib/marketingAttribution"

export default function ContactForm() {
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

    const fullName = ((formData.get("full_name") as string | null) ?? "").trim()

    const data = {
      full_name: fullName,
      object_type: (formData.get("object_type") as string | null) ?? "",
      email: (formData.get("email") as string | null) ?? "",
      phone: (formData.get("phone") as string | null) ?? "",
      city: (formData.get("city") as string | null) ?? "",
      message: (formData.get("message") as string | null) ?? "",
      service_requested: (formData.get("service_requested") as string | null) ?? "",
      source_page: "/kontakt",
      ...attribution,
    }

    pending.current = prepareLeadRequest(pending.current, data)
    void fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Idempotency-Key": pending.current.key },
      body: JSON.stringify({ ...JSON.parse(pending.current.body), tracking: buildTrackingContext() }),
    })
      .then(async (res) => {
        if (res.ok) {
          const result = await res.json().catch(() => null)
          await trackSavedLead(result?.event_id, { email: data.email, phone: data.phone })
          pending.current = null
          router.push("/thank-you")
          form.reset()
        } else {
          setStatus("error")
        }
      })
      .catch((err: unknown) => {
        console.error("Submission error:", err)
        setStatus("error")
      })
      .finally(() => {
        if (pending.current) pending.current.busy = false
        setLoading(false)
      })
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <CleaningRequestFields prefix="contact" variant="contact" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="contact-email"
            className="text-xs font-bold tracking-wider text-muted-foreground uppercase"
          >
            E-Mail-Adresse
          </label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            required
            placeholder="max@beispiel.de"
            className="h-14 bg-background border border-input focus-visible:ring-primary/20 hover:border-primary/50 transition-colors rounded-md shadow-sm"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="contact-phone"
            className="text-xs font-bold tracking-wider text-muted-foreground uppercase"
          >
            Telefonnummer
          </label>
          <Input
            id="contact-phone"
            name="phone"
            type="tel"
            required
            placeholder="+49 (0) 000 0000000"
            className="h-14 bg-background border border-input focus-visible:ring-primary/20 hover:border-primary/50 transition-colors rounded-md shadow-sm"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label
            htmlFor="contact-city"
            className="text-xs font-bold tracking-wider text-muted-foreground uppercase"
          >
            Stadt *
          </label>
          <Input
            id="contact-city"
            name="city"
            required
            autoComplete="address-level2"
            placeholder="Gaggenau"
            className="h-14 bg-background border border-input focus-visible:ring-primary/20 hover:border-primary/50 transition-colors rounded-md shadow-sm"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label
          htmlFor="contact-message"
          className="text-xs font-bold tracking-wider text-muted-foreground uppercase"
        >
          Nachricht
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          placeholder="Erzählen Sie uns von Ihren Räumlichkeiten..."
          className="flex min-h-[140px] w-full bg-background border border-input px-4 py-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/50 hover:border-primary/50 transition-colors rounded-md shadow-sm resize-none"
        />
      </div>

      {status === "error" && (
        <p className="text-sm font-bold text-red-600">Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.</p>
      )}

      <PrivacyNotice />
      <Button
        type="submit"
        disabled={loading}
        className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-base rounded-sm mt-4 disabled:opacity-70"
      >
        {loading ? "Wird gesendet..." : "Kostenlose Beratung anfragen"}
      </Button>
    </form>
  )
}
