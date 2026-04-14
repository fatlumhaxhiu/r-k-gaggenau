"use client"

import { useState } from "react"
import type { Lead } from "@prisma/client"
import StatusDropdown from "./StatusDropdown"

export default function LeadsTableClient({ initialLeads }: { initialLeads: Lead[] }) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  
  return (
    <>
      <div className="bg-surface-container-lowest rounded-2xl editorial-shadow overflow-hidden border border-outline-variant/10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container border-b border-outline-variant/10">
              <th className="px-6 py-4 font-label text-[10px] uppercase tracking-wider text-on-surface-variant">Klineti</th>
              <th className="px-6 py-4 font-label text-[10px] uppercase tracking-wider text-on-surface-variant">Shërbimi i Kërkuar</th>
              <th className="px-6 py-4 font-label text-[10px] uppercase tracking-wider text-on-surface-variant">Burimi</th>
              <th className="px-6 py-4 font-label text-[10px] uppercase tracking-wider text-on-surface-variant">Data</th>
              <th className="px-6 py-4 font-label text-[10px] uppercase tracking-wider text-on-surface-variant">Statusi</th>
              <th className="px-6 py-4 font-label text-[10px] uppercase tracking-wider text-on-surface-variant text-right">Veprime</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/5">
            {initialLeads.map((lead) => (
              <tr key={lead.id} onClick={() => setSelectedLead(lead)} className="hover:bg-surface transition-colors cursor-pointer group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {lead.first_name[0]}{lead.last_name?.[0] || ""}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-on-surface">{lead.first_name} {lead.last_name}</p>
                      <p className="text-xs text-on-surface-variant">{lead.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm font-medium px-3 py-1 bg-secondary-fixed/30 text-secondary rounded-full">{lead.service_requested}</span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-on-surface-variant">web</span>
                    <span className="text-xs text-on-surface-variant truncate max-w-[150px]">{lead.source_page}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-on-surface">{new Date(lead.created_at as any).toLocaleDateString("de-DE")}</p>
                  <p className="text-[10px] text-on-surface-variant">{new Date(lead.created_at as any).toLocaleTimeString("de-DE", { hour: '2-digit', minute: '2-digit'})}</p>
                </td>
                <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
                  <StatusDropdown leadId={lead.id} currentStatus={lead.status as any} />
                </td>
                <td className="px-6 py-5 text-right">
                  <button className="p-2 hover:bg-surface-container rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-on-surface-variant text-sm">visibility</span>
                  </button>
                </td>
              </tr>
            ))}
            {initialLeads.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant">Nuk u gjetën Leads.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Side Detail Panel */}
      <div className={`fixed top-0 right-0 h-screen w-full md:w-[450px] bg-white shadow-2xl z-60 border-l border-outline-variant/10 flex flex-col transition-transform duration-300 ${selectedLead ? "translate-x-0" : "translate-x-full"}`}>
        {selectedLead && (
          <>
            <div className="p-8 flex justify-between items-center border-b border-outline-variant/10">
              <h3 className="font-headline font-bold text-xl">Detajet e Lead-it</h3>
              <button onClick={() => setSelectedLead(null)} className="w-10 h-10 rounded-full hover:bg-surface flex items-center justify-center">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8">
              <div className="flex items-center gap-6 mb-10">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl">
                  {selectedLead.first_name[0]}{selectedLead.last_name?.[0] || ""}
                </div>
                <div>
                  <h2 className="font-headline text-2xl font-extrabold text-on-surface">{selectedLead.first_name} {selectedLead.last_name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-on-surface-variant font-medium">Data e krijimit: {new Date(selectedLead.created_at as any).toLocaleDateString("de-DE")}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-8">
                <section>
                  <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3">Informacione Kontakti</p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-secondary text-xl">mail</span>
                      <div>
                        <p className="text-xs text-on-surface-variant">E-Mail Adresse</p>
                        <p className="text-sm font-semibold">{selectedLead.email}</p>
                      </div>
                    </div>
                    {selectedLead.phone && (
                      <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-secondary text-xl">call</span>
                        <div>
                          <p className="text-xs text-on-surface-variant">Telefonnummer</p>
                          <p className="text-sm font-semibold">{selectedLead.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
                <section>
                  <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3">Shërbimi</p>
                  <div className="bg-surface-container-low p-6 rounded-xl relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 opacity-10">
                      <span className="material-symbols-outlined text-7xl">cleaning_services</span>
                    </div>
                    <h4 className="font-headline font-bold text-on-surface mb-1">{selectedLead.service_requested}</h4>
                    <p className="text-xs text-on-surface-variant truncate">Burimi: {selectedLead.source_page}</p>
                  </div>
                </section>
                
                {selectedLead.message && (
                  <section>
                    <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3">Mesazhi / Shënime</p>
                    <div className="bg-white border-l-4 border-primary p-4 editorial-shadow italic text-sm text-on-surface-variant">
                      "{selectedLead.message}"
                    </div>
                  </section>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {selectedLead && (
         <div className="fixed inset-0 bg-black/20 z-50 md:hidden" onClick={() => setSelectedLead(null)} />
      )}
    </>
  )
}
