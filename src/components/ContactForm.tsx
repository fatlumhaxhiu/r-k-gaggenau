"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ContactForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "error">("idle")

  const handleSubmit = (e: { preventDefault(): void; currentTarget: HTMLFormElement }): void => {
    e.preventDefault()
    setLoading(true)
    setStatus("idle")

    const form = e.currentTarget
    const formData = new FormData(form)

    const fullName = (formData.get("name") as string | null) ?? ""
    const names = fullName.trim().split(/\s+/)
    const firstName = names[0] || "Kontakt"
    const lastName = names.slice(1).join(" ") || "Inquiry"

    const data = {
      first_name: firstName,
      last_name: lastName,
      email: (formData.get("email") as string | null) ?? "",
      phone: (formData.get("phone") as string | null) ?? "",
      message: (formData.get("message") as string | null) ?? "",
      service_requested: "Kontaktformular Anfrage",
      source_page: "/kontakt",
    }

    void fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.ok) {
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
        setLoading(false)
      })
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="contact-name"
            className="text-xs font-bold tracking-wider text-muted-foreground uppercase"
          >
            Vollständiger Name
          </label>
          <Input
            id="contact-name"
            name="name"
            required
            placeholder="Max Mustermann"
            className="h-14 bg-background border border-input focus-visible:ring-primary/20 hover:border-primary/50 transition-colors rounded-md shadow-sm"
          />
        </div>
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
          placeholder="+49 (0) 000 0000000"
          className="h-14 bg-background border border-input focus-visible:ring-primary/20 hover:border-primary/50 transition-colors rounded-md shadow-sm"
        />
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

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-base rounded-sm mt-4 disabled:opacity-70"
      >
        {loading ? "Wird gesendet..." : "Nachricht senden"}
      </Button>
    </form>
  )
}
