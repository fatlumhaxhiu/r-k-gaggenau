import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getTrackingStatus } from "@/lib/trackingOutbox"

export const runtime = "nodejs"
export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const result = await getTrackingStatus()
  return NextResponse.json(result, { status: result.available ? 200 : 503, headers: { "Cache-Control": "no-store" } })
}