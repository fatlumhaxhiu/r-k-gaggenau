"use client"

import { useState } from "react"
import type { BlogPost } from "@prisma/client"

export default function BlogTableClient({ 
  initialPosts, 
  onEdit 
}: { 
  initialPosts: BlogPost[],
  onEdit: (post: BlogPost) => void
}) {
  const [posts, setPosts] = useState(initialPosts)

  const handleDelete = async (id: string) => {
    if (!confirm("A jeni të sigurt që dëshironi të fshini këtë artikull?")) return

    try {
      const res = await fetch(`/api/blog/${id}`, { method: "DELETE" })
      if (res.ok) {
        setPosts(posts.filter(p => p.id !== id))
      } else {
        alert("Gabim gjatë fshirjes.")
      }
    } catch {
      alert("Gabim në server.")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-emerald-100 text-emerald-800"
      case "draft": return "bg-zinc-200 text-zinc-600"
      default: return "bg-zinc-100 text-zinc-500"
    }
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-headline font-bold text-xl">Artikujt e Fundit</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs font-label uppercase tracking-widest text-zinc-400 border-b border-zinc-100">
              <th className="pb-4 font-semibold">Postimi</th>
              <th className="pb-4 font-semibold">Statusi</th>
              <th className="pb-4 font-semibold">Data</th>
              <th className="pb-4 font-semibold text-right">Veprimet</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-10 text-center text-zinc-400">Nuk ka artikuj ende.</td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="group hover:bg-zinc-50/50 transition-colors">
                  <td className="py-5">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-lg bg-zinc-100 mr-4 overflow-hidden border border-zinc-200">
                        {post.cover_image_url ? (
                          <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-zinc-300">image</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-on-surface group-hover:text-emerald-700 transition-colors line-clamp-1">{post.title}</p>
                        <p className="text-[10px] text-zinc-500 uppercase font-black tracking-tighter">{post.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(post.status)}`}>
                      {post.status === "published" ? "I Publikuar" : "Draft"}
                    </span>
                  </td>
                  <td className="py-5 text-zinc-500 text-xs">
                    {post.created_at ? new Date(post.created_at).toLocaleDateString() : "Pa datë"}
                  </td>
                  <td className="py-5 text-right">
                    <div className="flex justify-end space-x-3 opacity-40 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onEdit(post)} className="material-symbols-outlined text-emerald-600 cursor-pointer hover:scale-110">edit</button>
                      <button onClick={() => handleDelete(post.id)} className="material-symbols-outlined text-error cursor-pointer hover:scale-110">delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
