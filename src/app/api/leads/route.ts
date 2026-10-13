import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { createHash } from "node:crypto"
import { Prisma } from "@prisma/client"

const MARKETING_CHANNELS = new Set(["Google Ads", "Facebook Ads", "Organik", "Direkt / Unbekannt"])

function cleanText(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : ""
}

// Krijimi i një Lead-i të ri (publik, pa kërkuar auth)
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    }

    // Only legacy clients without full_name may use the split-name fields.
    const fullName = Object.prototype.hasOwnProperty.call(body, "full_name")
      ? cleanText(body.full_name, 255)
      : [cleanText(body.first_name, 100), cleanText(body.last_name, 100)].filter(Boolean).join(" ")
    const [first, ...rest] = fullName.split(/\s+/)
    const firstName = first.slice(0, 100)
    const lastName = rest.join(" ").slice(0, 100)
    const objectType = cleanText(body.object_type, 100)
    const email = cleanText(body.email, 255)
    const city = cleanText(body.city, 100)
    const serviceRequested = cleanText(body.service_requested, 100)
    const submittedChannel = cleanText(body.marketing_channel, 50)

    if (!firstName || !email || !city || !serviceRequested || !objectType || !cleanText(body.phone, 50)) {
      return NextResponse.json({ error: "Fusha të detyrueshme mungojnë." }, { status: 400 })
    }

    const requestId = req.headers.get("Idempotency-Key")
    if (requestId && !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId)) {
      return NextResponse.json({ error: "Invalid request ID" }, { status: 400 })
    }
    const data = {
        full_name: fullName,
        object_type: objectType,
        first_name: firstName,
        last_name: lastName,
        email,
        phone: cleanText(body.phone, 50) || null,
        city,
        service_requested: serviceRequested,
        source_page: cleanText(body.source_page, 255) || "unknown",
        marketing_channel: MARKETING_CHANNELS.has(submittedChannel)
          ? submittedChannel
          : "Direkt / Unbekannt",
        campaign_name: cleanText(body.campaign_name, 255) || null,
        message: cleanText(body.message, 5000) || null,
        status: "new",
    }
    const fingerprint = createHash("sha256").update(JSON.stringify(data)).digest("hex")
    let lead
    if (requestId) {
      try {
        lead = await prisma.lead.upsert({
          where: { request_id: requestId },
          create: { ...data, request_id: requestId, request_hash: fingerprint },
          update: {},
        })
      } catch (error) {
        if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") throw error
        lead = await prisma.lead.findUniqueOrThrow({ where: { request_id: requestId } })
      }
      if (lead.request_hash !== fingerprint) return NextResponse.json({ error: "Request ID already used for different data" }, { status: 409 })
    } else {
      // Compatibility for older clients; the new forms always provide a request ID.
      lead = await prisma.lead.create({ data })
    }

    // Revalidate for immediate update
    revalidatePath("/admin/crm-system")
    revalidatePath("/admin/dashboard")

    // Kthejmë një përgjigje minimale për të shmangur çdo gabim serializimi
    const eventId = createHash("sha256").update(`lead:${lead.id}`).digest("hex")
    return NextResponse.json({ ok: true, event_id: eventId }, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/leads:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// Marrja e të gjitha Leads (vetëm për Administratorët)
export async function GET(req: Request) {
  try {
    // Kontrollo nëse administratori është kyçur
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "E paautorizuar" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const statusFiltro = searchParams.get("status")

    // Ndërto query
    const whereClause = statusFiltro && statusFiltro !== "all" 
      ? { status: statusFiltro } 
      : {}

    const leads = await prisma.lead.findMany({
      where: whereClause,
      orderBy: { created_at: "desc" },
    })

    return NextResponse.json({ leads })
  } catch (error) {
    console.error("Gabim gjatë marrjes së leads:", error)
    return NextResponse.json({ error: "Ndodhi një gabim i brendshëm." }, { status: 500 })
  }
}
