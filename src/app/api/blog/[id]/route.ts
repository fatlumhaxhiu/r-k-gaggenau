import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { unlink } from "fs/promises"
import { join } from "path"
import { revalidatePath } from "next/cache"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    
    const post = await prisma.blogPost.update({
      where: { id },
      data: body,
    })

    // Update caches for all relevant pages
    revalidatePath("/admin/blog-manager")
    revalidatePath("/admin/dashboard")
    revalidatePath("/magazin")
    revalidatePath(`/magazin/${post.slug}`)
    revalidatePath("/")

    return NextResponse.json({ ok: true, post })
  } catch (error) {
    console.error("Error updating post:", error)
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    
    // 1. Fetch post to get image URL
    const post = await prisma.blogPost.findUnique({
      where: { id },
      select: { cover_image_url: true }
    })

    if (post?.cover_image_url && post.cover_image_url.startsWith("/uploads/")) {
      try {
        // Check if other posts are using this same image URL
        const otherPostUsingImage = await prisma.blogPost.findFirst({
          where: {
            cover_image_url: post.cover_image_url,
            id: { not: id } // Exclude current post
          }
        })

        if (!otherPostUsingImage) {
          const filePath = join(process.cwd(), "public", post.cover_image_url)
          await unlink(filePath)
          console.log("Deleted local file (no other references):", filePath)
        } else {
          console.log("Skipping file deletion, other posts are using this image.")
        }
      } catch (err) {
        console.error("Failed to delete local file:", err)
      }
    }

    // 2. Delete from DB
    await prisma.blogPost.delete({
      where: { id },
    })

    // Update caches
    revalidatePath("/admin/blog-manager")
    revalidatePath("/admin/dashboard")
    revalidatePath("/magazin")
    revalidatePath("/")

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
