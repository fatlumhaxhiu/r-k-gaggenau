import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

// GET: Fetch all blog posts
export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { created_at: "desc" },
    })
    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

// POST: Create a new blog post (Admin only)
export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { title, slug, content, cover_image_url, category, status } = body

    if (!title || !slug || !content) {
      return NextResponse.json({ error: "Title, slug, and content are required" }, { status: 400 })
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        cover_image_url: cover_image_url || null,
        category: category || "Tipps & Tricks",
        status: status || "draft",
        // Only set author_id if we have a valid UUID from session
        ...(session.user?.id ? { author: { connect: { id: session.user.id } } } : {}),
      },
    })

    // Revalidate paths
    revalidatePath("/admin/blog-manager")
    revalidatePath("/admin/dashboard")
    revalidatePath("/magazin")
    revalidatePath("/")

    return NextResponse.json({ ok: true, post }, { status: 201 })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
