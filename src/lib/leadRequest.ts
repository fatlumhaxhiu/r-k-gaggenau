export type PendingLeadRequest = { key: string; body: string; busy: boolean }

// Keep the same key on retries; use a new key if the user changes the request.
export function prepareLeadRequest(previous: PendingLeadRequest | null, data: object): PendingLeadRequest {
  const body = JSON.stringify(data)
  return { key: previous?.body === body ? previous.key : crypto.randomUUID(), body, busy: true }
}
