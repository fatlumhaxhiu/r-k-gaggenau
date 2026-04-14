"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Status = "new" | "contacted" | "converted" | "archived"

const statusStyles: Record<Status, string> = {
  new: "bg-emerald-100 text-emerald-800",
  contacted: "bg-blue-100 text-blue-800",
  converted: "bg-primary text-on-primary",
  archived: "bg-zinc-100 text-zinc-600",
}

const statusLabels: Record<Status, string> = {
  new: "Neu",
  contacted: "Kontaktiert",
  converted: "Konvertiert",
  archived: "Archiviert",
}

export default function StatusDropdown({ leadId, currentStatus }: { leadId: string, currentStatus: Status }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleStatusChange = async (newStatus: Status) => {
    if (newStatus === currentStatus) return
    setLoading(true)
    
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })

      if (res.ok) {
        router.refresh() // Rifresko faqen server-sude për të treguar të dhënat e reja
      } else {
        alert("Gabim gjatë përditësimit të statusit!")
      }
    } catch {
      alert("Ndodhi një gabim në lidhje.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <select 
      disabled={loading}
      value={currentStatus}
      onChange={(e) => handleStatusChange(e.target.value as Status)}
      className={`text-[11px] font-bold rounded-full px-3 py-1 outline-none cursor-pointer border-none appearance-none pr-8 bg-no-repeat bg-[url('data:image/svg+xml;utf8,<svg%20xmlns=\"http://www.w3.org/2000/svg\"%20width=\"12\"%20height=\"12\"%20viewBox=\"0%200%2024%2024\"%20fill=\"none\"%20stroke=\"currentColor\"%20stroke-width=\"2\"%20stroke-linecap=\"round\"%20stroke-linejoin=\"round\"><path%20d=\"M6%209l6%206%206-6\"/></svg>')] bg-position-[calc(100%-8px)_center] ${statusStyles[currentStatus]} disabled:opacity-50`}
    >
      {Object.entries(statusLabels).map(([val, label]) => (
        <option key={val} value={val} className="bg-white text-zinc-800 font-medium">
          {label}
        </option>
      ))}
    </select>
  )
}
