"use client"

import { useState } from "react"

export default function LeadForm({ serviceName }: { serviceName: string }) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setStatus("idle")

    const form = e.currentTarget
    const formData = new FormData(form)
    const data = {
      first_name: formData.get("first_name")?.toString() || "",
      last_name: formData.get("last_name")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      phone: formData.get("phone")?.toString() || "",
      service_requested: serviceName,
      source_page: typeof window !== "undefined" ? window.location.pathname : "unknown",
    }

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        setStatus("success")
        form.reset()
      } else {
        const errorText = await res.text().catch(() => "Unknown error")
        console.error("Form submission failed status:", res.status, errorText)
        setStatus("error")
      }
    } catch (err) {
      console.error("Network or Client Error:", err)
      setStatus("error")
    } finally {
      setLoading(false)
    }
  }

  if (status === "success") {
    return (
      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-8 rounded-xl text-center space-y-4">
        <span className="material-symbols-outlined text-4xl">check_circle</span>
        <h3 className="text-xl font-bold font-headline">Vielen Dank!</h3>
        <p>Ihre Anfrage wurde erfolgreich gesendet. Unser Team wird sich in Kürze mit Ihnen in Verbindung setzen.</p>
        <button onClick={() => setStatus("idle")} className="text-emerald-700 font-bold underline text-sm pt-4">Weitere Anfrage senden</button>
      </div>
    )
  }

  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Vorname *</label>
        <input name="first_name" required className="w-full px-6 py-4 rounded-lg bg-surface-container-high border-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-on-surface" placeholder="Max" type="text" />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Nachname</label>
        <input name="last_name" className="w-full px-6 py-4 rounded-lg bg-surface-container-high border-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-on-surface" placeholder="Mustermann" type="text" />
      </div>
      <div className="space-y-2 md:col-span-2">
        <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">E-Mail-Adresse *</label>
        <input name="email" required className="w-full px-6 py-4 rounded-lg bg-surface-container-high border-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-on-surface" placeholder="max@institution.de" type="email" />
      </div>
      <div className="space-y-2 md:col-span-2">
        <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Telefonnummer</label>
        <input name="phone" className="w-full px-6 py-4 rounded-lg bg-surface-container-high border-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-on-surface" placeholder="+49 000 000000" type="tel" />
      </div>

      {status === "error" && (
        <div className="md:col-span-2 text-error text-sm font-medium">
          Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.
        </div>
      )}

      <div className="md:col-span-2 pt-4">
        <button disabled={loading} className="w-full bg-primary text-white py-5 rounded-lg font-bold text-lg shadow-lg hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
          <span>{loading ? "Wird gesendet..." : "Termin vereinbaren"}</span>
          {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
        </button>
      </div>
    </form>
  )
}
