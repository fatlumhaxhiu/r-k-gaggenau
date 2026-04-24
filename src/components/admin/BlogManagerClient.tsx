"use client"

import { useState } from "react"
import type { BlogPost } from "@prisma/client"
import BlogForm from "./BlogForm"
import BlogTableClient from "./BlogTableClient"

export default function BlogManagerClient({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts)
  const [editingPost, setEditingPost] = useState<BlogPost | undefined>(undefined)

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handleSuccess = (savedPost: BlogPost) => {
    setPosts(prev => {
      const exists = prev.find(p => p.id === savedPost.id)
      if (exists) {
        return prev.map(p => p.id === savedPost.id ? savedPost : p)
      }
      return [savedPost, ...prev]
    })
    setEditingPost(undefined)
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/blog/${id}`, { method: "DELETE" })
      if (res.ok) {
        setPosts(prev => prev.filter(p => p.id !== id))
      }
    } catch {
      console.error("Gabim në server gjatë fshirjes.")
    }
  }

  const handleDuplicate = async (post: BlogPost) => {
    try {
      const duplicateData = {
        title: `Kopje: ${post.title}`,
        slug: `${post.slug}-copy-${Math.floor(Math.random() * 10000)}`,
        content: post.content,
        cover_image_url: post.cover_image_url,
        category: post.category,
        status: "draft", // Inherit as draft for safety
      }

      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(duplicateData),
      })

      if (res.ok) {
        const { post: newPost } = await res.json()
        setPosts(prev => [newPost, ...prev])
      }
    } catch {
      console.error("Gabim në server gjatë duplifikimit.")
    }
  }

  const publishedCount = posts.filter(p => p.status === "published").length
  const draftCount = posts.filter(p => p.status === "draft").length

  return (
    <section className="p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <span className="font-label text-xs uppercase tracking-widest text-emerald-600 font-bold mb-2 block">Content Studio</span>
          <h2 className="font-headline text-4xl font-extrabold tracking-tighter text-on-surface">Blog Manager</h2>
        </div>
        <button 
          onClick={() => { setEditingPost(undefined); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center px-6 py-3 bg-emerald-700 text-white rounded-lg shadow-md hover:shadow-xl transition-all font-inter font-semibold group"
        >
          <span className="material-symbols-outlined mr-2 group-hover:rotate-90 transition-transform">add</span>
          Krijo Postim të Ri
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
          <p className="font-label text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Të Publikuara</p>
          <p className="font-headline text-3xl font-bold text-emerald-800">{publishedCount}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
          <p className="font-label text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Draftet</p>
          <p className="font-headline text-3xl font-bold text-zinc-700">{draftCount}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 md:col-span-2 lg:col-span-1">
          <p className="font-label text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Total Postime</p>
          <p className="font-headline text-3xl font-bold text-secondary">{posts.length}</p>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7">
          <BlogTableClient posts={posts} onEdit={handleEdit} onDelete={handleDelete} onDuplicate={handleDuplicate} />
        </div>
        <div className="lg:col-span-5 sticky top-24">
          <BlogForm key={editingPost?.id || "new"} initialData={editingPost} onSuccess={handleSuccess} />
        </div>
      </div>
    </section>
  )
}
