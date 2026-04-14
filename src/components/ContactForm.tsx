"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle2 } from "lucide-react"

export default function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setStatus("idle")

    const form = e.currentTarget
    const formData = new FormData(form)
    
    const fullName = formData.get("name")?.toString() || ""
    const names = fullName.trim().split(/\s+/)
    const firstName = names[0] || "Kontakt"
    const lastName = names.slice(1).join(" ") || "Inquiry"

    const data = {
      first_name: firstName,
      last_name: lastName,
      email: formData.get("email")?.toString() || "",
      phone: formData.get("phone")?.toString() || "",
      message: formData.get("message")?.toString() || "",
      service_requested: "Kontaktformular Anfrage",
      source_page: "/kontakt",
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
        setStatus("error")
      }
    } catch (err) {
      console.error("Submission error:", err)
      setStatus("error")
    } finally {
      setLoading(false)
    }
  }

  if (status === "success") {
    return (
      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-10 rounded-2xl text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
        </div>
        <h3 className="text-2xl font-bold font-heading">Vielen Dank!</h3>
        <p className="text-emerald-700/80 max-w-sm mx-auto">
          Ihre Nachricht wurde erfolgreich an unser CRM-System übermittelt. Ein Projektleiter wird sich in Kürze bei Ihnen melden.
        </p>
        <Button variant="outline" onClick={() => setStatus("idle")} className="mt-4 border-emerald-200 hover:bg-emerald-100">
          Weitere Nachricht senden
        </Button>
      </div>
    )
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Vollständiger Name</label>
          <Input 
            name="name"
            required
            placeholder="Max Mustermann" 
            className="h-14 bg-background border border-input focus-visible:ring-primary/20 hover:border-primary/50 transition-colors rounded-md shadow-sm" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold tracking-wider text-muted-foreground uppercase">E-Mail-Adresse</label>
          <Input 
            name="email"
            type="email" 
            required
            placeholder="max@beispiel.de" 
            className="h-14 bg-background border border-input focus-visible:ring-primary/20 hover:border-primary/50 transition-colors rounded-md shadow-sm" 
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Telefonnummer</label>
        <Input 
            name="phone"
            placeholder="+49 (0) 000 0000000" 
            className="h-14 bg-background border border-input focus-visible:ring-primary/20 hover:border-primary/50 transition-colors rounded-md shadow-sm" 
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Nachricht</label>
        <textarea 
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
