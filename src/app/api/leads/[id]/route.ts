import { NextResponse } from "next/server"
import type { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

// Përditëso statusin ose shënimet e një lead
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "E paautorizuar" }, { status: 401 })
    }

    const { id: leadId } = await params
    if (!leadId) {
      return NextResponse.json({ error: "Mungon ID e Lead." }, { status: 400 })
    }

    const body = await req.json().catch(() => null)
    if (!body || typeof body !== 'object' || Array.isArray(body)) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    const existing = await prisma.lead.findUnique({ where: { id: leadId } })
    if (!existing) return NextResponse.json({ error: 'Lead-i nuk u gjet.' }, { status: 404 })
    const now = new Date()
    
    // Filtro vetëm fushat që lejohen të përditësohen
    const allowedUpdates: Prisma.LeadUpdateManyMutationInput = { updated_at: now }
    if (body.status !== undefined) {
      if (!['new', 'contacted', 'converted', 'archived'].includes(body.status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
      allowedUpdates.status = body.status
      // Reopening ends the old closure period. Archiving alone does not start one.
      if (body.status !== 'archived') { allowedUpdates.closed_at = null; allowedUpdates.closure_reason = null }
    }
    if (body.notes !== undefined) {
      if (typeof body.notes !== 'string' || body.notes.length > 10000) return NextResponse.json({ error: 'Invalid notes' }, { status: 400 })
      allowedUpdates.notes = body.notes
    }
    if (body.retention_action !== undefined) {
      if (body.status !== undefined) return NextResponse.json({ error: 'Separate status and retention actions' }, { status: 400 })
      const reason = typeof body.reason === 'string' ? body.reason.trim() : ''
      if (body.retention_action === 'close_without_order') {
        if (existing.status === 'converted' || existing.converted_at) return NextResponse.json({ error: 'Klienti kërkon trajtim të veçantë.' }, { status: 409 })
        if (!reason || reason.length > 500) return NextResponse.json({ error: 'Shënoni arsyen e mbylljes (deri 500 shenja).' }, { status: 400 })
        if (existing.closed_at) return NextResponse.json({ error: 'Mbyllja është regjistruar tashmë.' }, { status: 409 })
        allowedUpdates.status = 'archived'; allowedUpdates.closed_at = now; allowedUpdates.closure_reason = reason
      } else if (body.retention_action === 'set_hold') {
        const review = typeof body.review_at === 'string' ? new Date(body.review_at) : new Date(NaN)
        if (!reason || reason.length > 500 || !Number.isFinite(review.getTime()) || review <= now) return NextResponse.json({ error: 'Duhet arsye dhe datë rishikimi në të ardhmen.' }, { status: 400 })
        allowedUpdates.retention_hold_reason = reason; allowedUpdates.retention_review_at = review
      } else if (body.retention_action === 'clear_hold') {
        allowedUpdates.retention_hold_reason = null; allowedUpdates.retention_review_at = null
      } else return NextResponse.json({ error: 'Invalid retention action' }, { status: 400 })
    }

    if (body.status === "contacted") {
      allowedUpdates.responded_at = new Date()
    } else if (body.status === "converted") {
      allowedUpdates.converted_at = new Date()
    }

    const result = await prisma.lead.updateMany({
      where: { id: leadId, updated_at: existing.updated_at },
      data: allowedUpdates,
    })
    if (!result.count) return NextResponse.json({ error: 'Rekordi ndryshoi. Rifreskoni faqen.' }, { status: 409 })
    const updatedLead = await prisma.lead.findUniqueOrThrow({ where: { id: leadId } })

    // Revalidate paths to clear cache
    revalidatePath("/admin/crm-system")
    revalidatePath("/admin/dashboard")

    return NextResponse.json({ success: true, lead: updatedLead })
  } catch (error) {
    console.error("Gabim gjatë përditësimit të lead:", error)
    return NextResponse.json({ error: "Ndodhi një gabim i brendshëm." }, { status: 500 })
  }
}

// Fshi plotësisht lead-in nga databaza
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "E paautorizuar" }, { status: 401 })
    }

    const { id: leadId } = await params
    if (!leadId) {
      return NextResponse.json({ error: "Mungon ID e Lead." }, { status: 400 })
    }

    const existingLead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: { id: true, retention_hold_reason: true, updated_at: true },
    })
    if (!existingLead) {
      return NextResponse.json({ error: "Lead-i nuk u gjet." }, { status: 404 })
    }

    if (existingLead.retention_hold_reason) return NextResponse.json({ error: 'Lead-i ka përjashtim ruajtjeje. Shqyrtojeni përpara fshirjes.' }, { status: 409 })
    const deleted = await prisma.lead.deleteMany({
      where: { id: leadId, updated_at: existingLead.updated_at, retention_hold_reason: null }
    })
    if (!deleted.count) return NextResponse.json({ error: 'Rekordi ndryshoi. Rifreskoni faqen.' }, { status: 409 })

    // Revalidate paths to clear cache
    revalidatePath("/admin/crm-system")
    revalidatePath("/admin/dashboard")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Gabim gjatë fshirjes së lead:", error)
    return NextResponse.json({ error: "Ndodhi një gabim i brendshëm." }, { status: 500 })
  }
}
