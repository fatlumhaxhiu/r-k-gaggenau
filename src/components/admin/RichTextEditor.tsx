"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import TextAlign from '@tiptap/extension-text-align'
import { ExpertTipBox, WarningBox, SuccessBox } from './tiptap-extensions/PremiumBlocks'
import { ImageGalleryBox } from './tiptap-extensions/ImageGallery'
import { useCallback, useRef } from 'react'

interface RichTextEditorProps {
  readonly content: string
  readonly onChange: (content: string) => void
}

const ToolbarButton = ({ 
  onClick, 
  isActive = false, 
  icon, 
  title 
}: { 
  readonly onClick: () => void, 
  readonly isActive?: boolean, 
  readonly icon: string, 
  readonly title: string 
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`p-2 rounded-md transition-colors flex items-center justify-center ${
      isActive 
        ? 'bg-emerald-100 text-emerald-800' 
        : 'text-zinc-600 hover:bg-zinc-100'
    }`}
  >
    <span className="material-symbols-outlined text-[20px]">{icon}</span>
  </button>
)

export default function RichTextEditor({ content, onChange }: Readonly<RichTextEditorProps>) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Underline,
      Highlight,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-emerald-600 underline hover:text-emerald-800 transition-colors cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl shadow-md my-6 w-full max-w-4xl mx-auto object-cover',
        },
      }),
      Youtube.configure({
        controls: false,
        nocookie: true,
        HTMLAttributes: {
          class: 'aspect-video w-full max-w-4xl mx-auto rounded-xl shadow-md my-6',
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      ExpertTipBox,
      WarningBox,
      SuccessBox,
      ImageGalleryBox,
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none p-6 min-h-[300px]',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  const singleImageInputRef = useRef<HTMLInputElement>(null)
  const galleryImageInputRef = useRef<HTMLInputElement>(null)

  const uploadFile = async (file: File): Promise<string> => {
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
    return url
  }

  const setLink = useCallback(() => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href
    const url = globalThis.prompt('URL e Linkut:', previousUrl)

    if (url === null) return

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url, target: '_blank' }).run()
  }, [editor])

  const handleSingleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      alert("Vetëm formati JPG ose PNG")
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Fotografia duhet të jetë nën 2MB")
      return
    }

    try {
      const url = await uploadFile(file)
      if (editor) {
        editor.chain().focus().setImage({ src: url }).run()
      }
    } catch (err) {
      console.error(err)
      alert("Gabim gjatë ngarkimit të imazhit.")
    } finally {
      if (singleImageInputRef.current) singleImageInputRef.current.value = ""
    }
  }

  const addImage = useCallback(() => {
    singleImageInputRef.current?.click()
  }, [])

  const handleGalleryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    if (files.length > 4) {
      alert("Mund të zgjidhni maksimumi 4 fotografi për galerinë.")
      return
    }

    for (const file of files) {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        alert("Vetëm formati JPG ose PNG pranohen")
        return
      }
      if (file.size > 2 * 1024 * 1024) {
        alert("Çdo fotografi duhet të jetë nën 2MB")
        return
      }
    }

    try {
      const uploadPromises = files.map(file => uploadFile(file))
      const urls = await Promise.all(uploadPromises)

      if (editor) {
        editor.chain().focus().insertContent({ type: 'imageGalleryBox', attrs: { images: urls } }).run()
      }
    } catch (err) {
      console.error(err)
      alert("Gabim gjatë ngarkimit të imazheve.")
    } finally {
      if (galleryImageInputRef.current) galleryImageInputRef.current.value = ""
    }
  }

  const addGallery = useCallback(() => {
    galleryImageInputRef.current?.click()
  }, [])

  const addYoutubeVideo = useCallback(() => {
    if (!editor) return
    const url = prompt('URL e YouTube:')
    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: Math.max(320, Number.parseInt(editor.view.dom.clientWidth.toString(), 10)) - 48,
      })
    }
  }, [editor])

  const insertPremiumBlock = useCallback((blockName: string, placeholder: string) => {
    if (!editor) return
    const { state } = editor
    const { selection } = state

    if (selection.empty) {
      // If no text is selected, insert with placeholder
      editor.chain().focus().insertContent(`<${blockName}><p>${placeholder}</p></${blockName}>`).run()
    } else {
      // If text is selected, wrap the block
      editor.chain().focus().wrapIn(blockName).run()
    }
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col">
      <input 
        type="file" 
        ref={singleImageInputRef} 
        className="hidden" 
        accept="image/jpeg,image/png" 
        onChange={handleSingleImageChange} 
        tabIndex={-1}
      />
      <input 
        type="file" 
        multiple 
        ref={galleryImageInputRef} 
        className="hidden" 
        accept="image/jpeg,image/png" 
        onChange={handleGalleryChange} 
        tabIndex={-1}
      />
      {/* Toolbar */}
      <div className="bg-zinc-50 border-b border-zinc-200 p-2 flex flex-wrap gap-1 items-center sticky top-0 z-10">
        
        {/* Basic Formatting */}
        <div className="flex gap-1 pr-2 border-r border-zinc-200">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            icon="format_bold"
            title="Bold"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            icon="format_italic"
            title="Italic"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            icon="format_underlined"
            title="Underline"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            icon="format_strikethrough"
            title="Strikethrough"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            isActive={editor.isActive('highlight')}
            icon="format_ink_highlighter"
            title="Highlight"
          />
        </div>

        {/* Headings */}
        <div className="flex gap-1 px-2 border-r border-zinc-200">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            icon="format_h1"
            title="Heading 1"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            icon="format_h2"
            title="Heading 2"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            icon="format_h3"
            title="Heading 3"
          />
        </div>

        {/* Lists & Alignment */}
        <div className="flex gap-1 px-2 border-r border-zinc-200">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            icon="format_list_bulleted"
            title="Bullet List"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            icon="format_list_numbered"
            title="Numbered List"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            isActive={editor.isActive('taskList')}
            icon="checklist"
            title="Checklist"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            icon="format_align_left"
            title="Align Left"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            icon="format_align_center"
            title="Align Center"
          />
        </div>

        {/* Media & Links */}
        <div className="flex gap-1 px-2 border-r border-zinc-200">
          <ToolbarButton
            onClick={setLink}
            isActive={editor.isActive('link')}
            icon="link"
            title="Insert Link"
          />
          <ToolbarButton
            onClick={addImage}
            icon="image"
            title="Insert Image"
          />
          <ToolbarButton
            onClick={addGallery}
            icon="photo_library"
            title="Insert Image Gallery"
          />
          <ToolbarButton
            onClick={addYoutubeVideo}
            icon="smart_display"
            title="Insert YouTube Video"
          />
        </div>

        {/* Premium Blocks */}
        <div className="flex gap-2 pl-2">
          <button
            type="button"
            onClick={() => insertPremiumBlock('expertTipBox', 'Shkruani këshillën këtu...')}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-md transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">lightbulb</span> Tip
          </button>
          <button
            type="button"
            onClick={() => insertPremiumBlock('warningBox', 'Shkruani paralajmërimin këtu...')}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-md transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">warning</span> Warning
          </button>
          <button
            type="button"
            onClick={() => insertPremiumBlock('successBox', 'Shkruani përfitimin këtu...')}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">check_circle</span> Success
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="bg-white max-h-[600px] overflow-y-auto custom-scrollbar">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
