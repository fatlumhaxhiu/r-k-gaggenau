import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import AdminSidebar from "@/components/admin/AdminSidebar"
import BlogManagerClient from "@/components/admin/BlogManagerClient"

export default async function BlogManagerPage() {
  const session = await auth()

  if (!session) {
    redirect("/admin/admin-login")
  }

  const posts = await prisma.blogPost.findMany({
    orderBy: { created_at: "desc" },
  })

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <AdminSidebar />
      <main className="flex-1 pl-64">
        <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-sm border-b border-zinc-200 dark:border-zinc-800 flex justify-end items-center px-8 h-16">
          <div className="flex items-center space-x-4">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Administrator Portal</span>
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-emerald-700 text-sm">shield</span>
            </div>
          </div>
        </header>

        <BlogManagerClient initialPosts={posts} />
      </main>
    </div>
  )
}