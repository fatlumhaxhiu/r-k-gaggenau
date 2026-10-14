import { after, NextResponse } from "next/server"
import { buildMetaPageViewEvent } from "@/lib/metaConversions"
import { consumeTrackingJson, getTrackingRateKey, isSameOriginTrackingRequest, parseTrackingContext, requestMetaClient } from "@/lib/trackingRequest"
import { drainTrackingOutbox, enqueueTrackingEvent, metaCapiConfigured } from "@/lib/trackingOutbox"

export const runtime = "nodejs"
export async function POST(req: Request) {
  if (!isSameOriginTrackingRequest(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  if (!metaCapiConfigured()) return NextResponse.json({ ok: true, queued: false })
  const body = await consumeTrackingJson(req)
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  const data = body as Record<string, unknown>
  const tracking = parseTrackingContext(data.tracking)
  if (!tracking || typeof data.event_id !== "string" || typeof data.page_location !== "string") return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  const event = buildMetaPageViewEvent({ eventId: data.event_id, sourceUrl: data.page_location, consent: tracking.consent, fbp: tracking.fbp, fbc: tracking.fbc, ...requestMetaClient(req) })
  if (!event) return NextResponse.json({ error: "Invalid event" }, { status: 400 })
  try {
    const result = await enqueueTrackingEvent(event, tracking, { rateKey: getTrackingRateKey(req, tracking.session_id) })
    if (result.reason === "rate_limit") return NextResponse.json({ error: "Rate limit" }, { status: 429 })
    if (result.queued) after(async () => { try { await drainTrackingOutbox({ limit: 1, eventId: event.event_id }) } catch { /* Delivery errors are kept outside the public response. */ } })
    return NextResponse.json({ ok: true, queued: result.queued })
  } catch { return NextResponse.json({ error: "Tracking unavailable" }, { status: 503 }) }
}