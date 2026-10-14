export type SavedLeadContact = { email?: unknown; phone?: unknown }
export type HashedUserData = { sha256_email_address?: string; sha256_phone_number?: string }

export function normalizeConversionEmail(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined
  const email = value.trim().toLowerCase()
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return undefined
  const [local, domain] = email.split("@")
  const normalizedLocal = ["gmail.com", "googlemail.com"].includes(domain) ? local.replace(/\./g, "") : local
  if (!normalizedLocal) return undefined
  return `${normalizedLocal}@${domain}`
}

export function normalizeConversionPhone(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined
  // Keep an explicit country code; never guess a country for a local number.
  const phone = value.trim().replace(/[\s().-]/g, "")
  return /^\+[1-9]\d{6,14}$/.test(phone) ? phone : undefined
}

async function hash(value: string) {
  const result = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value))
  return Array.from(new Uint8Array(result), byte => byte.toString(16).padStart(2, "0")).join("")
}

// Call only after CRM persistence and a current Marketing choice. Never returns raw contacts.
export async function hashSavedLeadContact(contact?: SavedLeadContact): Promise<HashedUserData> {
  const email = normalizeConversionEmail(contact?.email)
  const phone = normalizeConversionPhone(contact?.phone)
  const result: HashedUserData = {}
  if (email) {
    try { result.sha256_email_address = await hash(email) } catch { /* Matching is optional. */ }
  }
  if (phone) {
    try { result.sha256_phone_number = await hash(phone) } catch { /* Keep the saved lead successful. */ }
  }
  return result
}
