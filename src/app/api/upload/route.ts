import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { auth } from "@/auth"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // 1. Validate File Type (.jpg, .png)
    const validTypes = ["image/jpeg", "image/png"]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Only .jpg and .png formats are allowed" }, { status: 400 })
    }

    // 2. Validate File Size (2MB)
    const maxSize = 2 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size must be less than 2MB" }, { status: 400 })
    }

    // 3. Prepare Storage
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadDir = join(process.cwd(), "public", "uploads")
    
    // Ensure directory exists
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (err) {
      // Ignore if directory exists
    }

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`
    const path = join(uploadDir, filename)

    // 4. Write File
    await writeFile(path, buffer)
    
    const imageUrl = `/uploads/${filename}`
    return NextResponse.json({ url: imageUrl })

  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
