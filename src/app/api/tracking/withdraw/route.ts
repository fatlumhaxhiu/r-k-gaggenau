import { NextResponse } from "next/server"
import { consumeTrackingJson, getTrackingRateKey, isSameOriginTrackingRequest } from "@/lib/trackingRequest"
import { withdrawTrackingSession } from "@/lib/trackingOutbox"

export const runtime = "nodejs"
export async function POST(req: Request) {
  if (!isSameOriginTrackingRequest(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const body = await consumeTrackingJson(req, 1024)
  const session = body && typeof body === "object" && !Array.isArray(body) ? (body as Record<string, unknown>).session_id : null
  if (typeof session !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(session)) return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  try {
    const cancelled = await withdrawTrackingSession(session, { rateKey: getTrackingRateKey(req, session) })
    if (cancelled < 0) return NextResponse.json({ error: "Rate limit" }, { status: 429 })
    return NextResponse.json({ ok: true, cancelled })
  } catch { return NextResponse.json({ error: "Tracking unavailable" }, { status: 503 }) }
}