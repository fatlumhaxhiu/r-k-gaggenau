import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

// Krijimi i një Lead-i të ri (publik, pa kërkuar auth)
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    }

    // Validim i thjeshtë
    if (!body.first_name || !body.email || !body.service_requested) {
      return NextResponse.json({ error: "Fusha të detyrueshme mungojnë." }, { status: 400 })
    }

    await prisma.lead.create({
      data: {
        first_name: body.first_name,
        last_name: body.last_name || "",
        email: body.email,
        phone: body.phone || null,
        service_requested: body.service_requested,
        source_page: body.source_page || "unknown",
        message: body.message || null,
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
