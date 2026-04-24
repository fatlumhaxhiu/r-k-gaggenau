import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import type { BlogPost } from "@prisma/client"

export default function BlogForm({ 
  initialData, 
  onSuccess 
}: { 
  initialData?: BlogPost,
  onSuccess?: (post: BlogPost) => void
}) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.cover_image_url || null)
  const isEdit = !!initialData

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    content: initialData?.content || "",
    cover_image_url: initialData?.cover_image_url || "",
    category: initialData?.category || "Tipps & Tricks",
    status: initialData?.status || "draft",
  })

  // Handle file selection and preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 1. Validate Format
    const validFormats = ["image/jpeg", "image/png"]
    if (!validFormats.includes(file.type)) {
      alert("Ju lutem ngarkoni vetëm formate .jpg ose .png")
      e.target.value = ""
      return
    }

    // 2. Validate Size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Fotografia duhet të jetë nën 2MB")
      e.target.value = ""
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let finalImageUrl = formData.cover_image_url

      // 1. Upload file if a new one is selected
      const file = fileInputRef.current?.files?.[0]
      if (file) {
        const uploadData = new FormData()
        uploadData.append("file", file)

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        })

        if (!uploadRes.ok) {
          throw new Error("Dështoi upload-i i fotografisë")
        }

        const { url } = await uploadRes.json()
        finalImageUrl = url
      }

      // 2. Save/Update Blog Post
      const url = isEdit ? `/api/blog/${initialData?.id}` : "/api/blog"
      const method = isEdit ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          cover_image_url: finalImageUrl
        }),
      })

      if (res.ok) {
        const { post } = await res.json()
        
        if (onSuccess) {
          onSuccess(post)
        }

        if (!isEdit) {
            setFormData({
                title: "",
                slug: "",
                content: "",
                cover_image_url: "",
                category: "Tipps & Tricks",
                status: "draft",
            })
            setPreviewUrl(null)
            if (fileInputRef.current) fileInputRef.current.value = ""
        }
      } else {
        alert("Gabim gjatë ruajtjes së postimit.")
      }
    } catch (err: any) {
      alert(err.message || "Gabim në server.")
    } finally {
      setLoading(false)
    }
  }

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    setFormData({ 
      ...formData, 
      title, 
      slug: title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') 
    })
  }

  return (
    <div className="bg-surface-container-high rounded-2xl overflow-hidden shadow-lg border border-outline-variant/10">
      <div className="bg-emerald-700 px-6 py-4 flex justify-between items-center">
        <h3 className="font-headline font-bold text-white tracking-tight">
          {isEdit ? "Edito Artikullin" : "Krijo Artikull të Ri"}
        </h3>
        {isEdit && (
            <button onClick={() => window.location.reload()} className="text-white/70 hover:text-white text-xs font-bold">Anulo</button>
        )}
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        
        {/* Image Upload Area */}
        <div className="space-y-1">
          <label className="font-label text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Fotografia e Artikullit (Max 2MB, JPG/PNG)</label>
          <div 
             onClick={() => fileInputRef.current?.click()}
             className="relative aspect-video rounded-xl bg-zinc-100 border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 transition-all overflow-hidden group"
          >
            {previewUrl ? (
              <>
                <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                   <p className="text-xs text-white font-bold">Ndërro Fotografinë</p>
                </div>
              </>
            ) : (
              <div className="text-center">
                <span className="material-symbols-outlined text-zinc-400 text-4xl">add_a_photo</span>
                <p className="text-[10px] font-bold text-zinc-500 mt-2 uppercase">Zgjidhni një foto</p>
              </div>
            )}
            <input 
               ref={fileInputRef}
               type="file" 
               accept="image/jpeg,image/png"
               className="hidden" 
               onChange={handleFileChange}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-label text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Titulli i Artikullit</label>
          <input 
            required
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full bg-white border-none rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm" 
            placeholder="Psh: Si të mbajmë kuzhinën të pastër..." 
            type="text"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-label text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Slug (URL)</label>
            <input 
              required
              value={formData.slug}
              onChange={(e) => setFormData({...formData, slug: e.target.value})}
              className="w-full bg-zinc-50 border-none rounded-lg py-3 px-4 text-xs font-mono text-zinc-600 focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm" 
              placeholder="si-te-mbajme-pastre" 
              type="text"
            />
          </div>
          <div className="space-y-1">
            <label className="font-label text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Kategoria</label>
            <select 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full bg-white border-none rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
            >
              <option>Tipps & Tricks</option>
              <option>Lifestyle</option>
              <option>Service</option>
              <option>News</option>
              <option>Family</option>
              <option>Education</option>
              <option>School</option>
              <option>Kids</option>
              <option>Nature</option>
              <option>Products</option>
              <option>Tech</option>
              <option>Home</option>
              <option>Kindergarden</option>
              <option>Bathroom</option>
              <option>Bedroom</option>
              <option>Apartament</option>
              <option>Hotel</option>
              <option>Office</option>
              <option>Season</option>
              <option>Medical</option>
              <option>Team</option>
              <option>Job</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <label className="font-label text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Statusi</label>
                <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full bg-white border-none rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
                >
                    <option value="draft">Draft</option>
                    <option value="published">I Publikuar</option>
                </select>
            </div>
        </div>

        <div className="space-y-1">
          <label className="font-label text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Përmbajtja (Content)</label>
          <textarea 
            required
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            className="w-full bg-white border-none rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm min-h-[250px]" 
            placeholder="Shkruani artikullin këtu..." 
          />
        </div>

        <div className="pt-4">
          <button 
            disabled={loading}
            type="submit"
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Duke u ruajtur..." : (isEdit ? "Përditëso Artikullin" : "Publiko Artikullin")}
          </button>
        </div>
      </form>
    </div>
  )
}
