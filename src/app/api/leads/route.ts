import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

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

    const firstName = cleanText(body.first_name, 100)
    const lastName = cleanText(body.last_name, 100)
    const email = cleanText(body.email, 255)
    const city = cleanText(body.city, 100)
    const serviceRequested = cleanText(body.service_requested, 100)
    const submittedChannel = cleanText(body.marketing_channel, 50)

    if (!firstName || !email || !city || !serviceRequested) {
      return NextResponse.json({ error: "Fusha të detyrueshme mungojnë." }, { status: 400 })
    }

    await prisma.lead.create({
      data: {
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
    })

    // Revalidate for immediate update
    revalidatePath("/admin/crm-system")
    revalidatePath("/admin/dashboard")

    // Kthejmë një përgjigje minimale për të shmangur çdo gabim serializimi
    return NextResponse.json({ ok: true }, { status: 201 })
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
