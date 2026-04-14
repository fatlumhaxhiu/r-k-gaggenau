import { NextResponse } from "next/server"
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

    const body = await req.json()
    
    // Filtro vetëm fushat që lejohen të përditësohen
    const allowedUpdates: any = {}
    if (body.status) allowedUpdates.status = body.status
    if (body.notes !== undefined) allowedUpdates.notes = body.notes

    if (body.status === "contacted") {
      allowedUpdates.responded_at = new Date()
    } else if (body.status === "converted") {
      allowedUpdates.converted_at = new Date()
    }

    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: allowedUpdates,
    })

    // Revalidate paths to clear cache
    revalidatePath("/admin/crm-system")
    revalidatePath("/admin/dashboard")

    return NextResponse.json({ success: true, lead: updatedLead })
  } catch (error) {
    console.error("Gabim gjatë përditësimit të lead:", error)
    return NextResponse.json({ error: "Ndodhi një gabim i brendshëm." }, { status: 500 })
  }
}

// Fshi/Arkivo plotësisht lead
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "E paautorizuar" }, { status: 401 })
    }

    const { id: leadId } = await params
    await prisma.lead.delete({
      where: { id: leadId }
    })

    // Revalidate paths to clear cache
    revalidatePath("/admin/crm-system")
    revalidatePath("/admin/dashboard")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Gabim gjatë fshirjes së lead:", error)
    return NextResponse.json({ error: "Ndodhi një gabim i brendshëm." }, { status: 500 })
  }
}
