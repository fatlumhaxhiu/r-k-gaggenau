type RetentionLead = {
  status: string | null; converted_at: Date | string | null;
  closed_at: Date | string | null; closure_reason: string | null;
  retention_hold_reason: string | null; retention_review_at: Date | string | null;
}

// Six calendar months, clamped to the last day of the target month, in UTC.
export function retentionDeadline(value: Date | string): Date {
  const start = new Date(value)
  const result = new Date(start)
  result.setUTCDate(1)
  result.setUTCMonth(result.getUTCMonth() + 6)
  const lastDay = new Date(Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0)).getUTCDate()
  result.setUTCDate(Math.min(start.getUTCDate(), lastDay))
  return result
}

export function retentionState(lead: RetentionLead, now = new Date()) {
  if (lead.retention_hold_reason) return {
    kind: 'hold' as const,
    label: lead.retention_review_at && new Date(lead.retention_review_at) <= now ? 'Përjashtimi kërkon rishikim' : 'Ruajtje e posaçme',
    deadline: null,
  }
  if (lead.status === 'converted' || lead.converted_at) return { kind: 'customer' as const, label: 'Klient — trajtim i veçantë', deadline: null }
  if (lead.status !== 'archived') return { kind: 'active' as const, label: 'Kërkesë aktive', deadline: null }
  if (!lead.closed_at || !lead.closure_reason) return { kind: 'undocumented' as const, label: 'Mungon mbyllja e dokumentuar', deadline: null }
  const deadline = retentionDeadline(lead.closed_at)
  return { kind: deadline <= now ? 'due' as const : 'waiting' as const,
    label: deadline <= now ? 'Për shqyrtim të fshirjes' : 'Afati 6-mujor', deadline }
}
