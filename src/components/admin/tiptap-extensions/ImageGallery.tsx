import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from '@tiptap/react'

export const ImageGalleryBox = Node.create({
  name: 'imageGalleryBox',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      images: {
        default: [],
        parseHTML: element => {
          const imagesStr = element.dataset.images
          try {
            return imagesStr ? JSON.parse(imagesStr) : []
          } catch (e) {
            console.error(e)
            return []
          }
        },
        renderHTML: attributes => {
          return {
            'data-images': JSON.stringify(attributes.images),
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      { tag: 'div.image-gallery-box' },
    ]
  },

  renderHTML({ HTMLAttributes, node }) {
    const images: string[] = node.attrs.images || []
    
    // Create image elements as ProseMirror DOMOutputSpec array
    const imgElements = images.map((url: string) => ['img', { src: url, class: 'w-full h-48 md:h-64 object-cover rounded-xl shadow-md border border-zinc-200 m-0!' }])
    
    return ['div', mergeAttributes(HTMLAttributes, { class: 'image-gallery-box grid grid-cols-1 sm:grid-cols-2 gap-4 my-8' }), 
      ...imgElements
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageGalleryBoxComponent)
  },
})

const ImageGalleryBoxComponent = (props: NodeViewProps) => {
  const images: string[] = props.node.attrs.images || []
  
  return (
    <NodeViewWrapper className="image-gallery-box grid grid-cols-1 sm:grid-cols-2 gap-4 my-8 relative group">
      {/* Visual indicator that this is a gallery in the editor */}
      <div className="absolute top-2 right-2 bg-zinc-900/70 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
        Image Gallery
      </div>
      
      {images.map((url, idx) => (
        <img 
          key={url} 
          src={url} 
          alt={`Gallery item ${idx + 1}`} 
          className="w-full h-48 md:h-64 object-cover rounded-xl shadow-md border border-zinc-200 m-0!"
        />
      ))}
      
      {images.length === 0 && (
        <div className="col-span-2 aspect-video bg-zinc-100 rounded-xl border-2 border-dashed border-zinc-300 flex items-center justify-center">
          <p className="text-zinc-400 font-bold text-sm">Zgjidhni imazhet...</p>
        </div>
      )}
    </NodeViewWrapper>
  )
}
