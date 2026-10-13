"use client"
import { useState } from 'react'
import type { Lead } from '@prisma/client'
import { retentionState } from '@/lib/leadRetention'

export default function RetentionControls({ lead, onUpdate }: { lead: Lead; onUpdate: (lead: Lead) => void }) {
  const [reason, setReason] = useState('')
  const [reviewAt, setReviewAt] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const state = retentionState(lead)
  async function act(action: string) {
    if (action === 'clear_hold' && !window.confirm('A përfundoi arsyeja e ruajtjes së posaçme?')) return
    setBusy(true); setError('')
    try {
      const response = await fetch(`/api/leads/${lead.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ retention_action: action, reason, review_at: reviewAt ? new Date(`${reviewAt}T23:59:59Z`).toISOString() : null }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Ndryshimi dështoi.')
      onUpdate(result.lead); setReason(''); setReviewAt('')
    } catch (e) { setError(e instanceof Error ? e.message : 'Ndryshimi dështoi.') }
    finally { setBusy(false) }
  }
  return <section className="space-y-3 rounded-xl border border-slate-200 p-4">
    <h4 className="font-bold">Ruajtja e të dhënave</h4>
    <p className="text-sm">{state.label}{state.deadline ? `: ${state.deadline.toLocaleDateString('de-DE', { timeZone: 'UTC' })}` : ''}</p>
    {lead.closed_at && <p className="text-sm">Mbyllur më {new Date(lead.closed_at).toLocaleDateString('de-DE', { timeZone: 'UTC' })}: {lead.closure_reason}</p>}
    {lead.retention_hold_reason && <p className="text-sm">Arsyeja: {lead.retention_hold_reason}. Rishikim: {lead.retention_review_at ? new Date(lead.retention_review_at).toLocaleDateString('de-DE', { timeZone: 'UTC' }) : 'Mungon'}</p>}
    <p className="text-xs text-slate-600">Kufiri 6-mujor vlen për kërkesat e mbyllura pa porosi, kur ende nevojitet ruajtje. Fshini më herët kur qëllimi mbaron. Nuk ka fshirje automatike; kontrolloni edhe emailin dhe kopjet.</p>
    <label className="block text-sm">Arsyeja<textarea aria-label="Arsyeja e ruajtjes ose mbylljes" value={reason} onChange={e => setReason(e.target.value)} maxLength={500} className="mt-1 w-full rounded border p-2" /></label>
    {!lead.closed_at && !lead.converted_at && lead.status !== 'converted' && <button disabled={busy || !reason.trim()} onClick={() => void act('close_without_order')} className="rounded border px-3 py-2 text-sm disabled:opacity-50">Mbyll pa porosi</button>}
    <label className="block text-sm">Rishikimi i përjashtimit<input aria-label="Data e rishikimit të ruajtjes" type="date" value={reviewAt} onChange={e => setReviewAt(e.target.value)} className="mt-1 w-full rounded border p-2" /></label>
    <button disabled={busy || !reason.trim() || !reviewAt} onClick={() => void act('set_hold')} className="rounded border px-3 py-2 text-sm disabled:opacity-50">Ruaj përjashtimin</button>
    {lead.retention_hold_reason && <button disabled={busy} onClick={() => void act('clear_hold')} className="ml-2 rounded border px-3 py-2 text-sm">Hiq përjashtimin</button>}
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
  </section>
}
