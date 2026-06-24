import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react'

// --- Expert Tip Box ---
export const ExpertTipBox = Node.create({
  name: 'expertTipBox',
  group: 'block',
  content: 'block+',
  defining: true,

  parseHTML() {
    return [
      { 
        tag: 'div.expert-tip-box',
        contentElement: 'div.premium-box-content'
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'expert-tip-box premium-box bg-emerald-50 border-l-4 border-emerald-500 p-4 my-6 rounded-r-lg' }), 
      ['div', { class: 'flex items-center gap-2 mb-2 text-emerald-800 font-bold' }, 
        ['span', { class: 'material-symbols-outlined text-emerald-600 text-xl' }, 'lightbulb'],
        ['span', {}, 'Expert Tip']
      ],
      ['div', { class: 'text-emerald-900 premium-box-content' }, 0]
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ExpertTipBoxComponent)
  },
})

const ExpertTipBoxComponent = () => {
  return (
    <NodeViewWrapper className="expert-tip-box premium-box bg-emerald-50 border-l-4 border-emerald-500 p-4 my-6 rounded-r-lg">
      <div className="flex items-center gap-2 mb-2 text-emerald-800 font-bold">
        <span className="material-symbols-outlined text-emerald-600 text-xl">lightbulb</span>
        <span>Expert Tip</span>
      </div>
      <NodeViewContent className="text-emerald-900 premium-box-content" />
    </NodeViewWrapper>
  )
}

// --- Warning Box ---
export const WarningBox = Node.create({
  name: 'warningBox',
  group: 'block',
  content: 'block+',
  defining: true,

  parseHTML() {
    return [
      { 
        tag: 'div.warning-box',
        contentElement: 'div.premium-box-content'
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'warning-box premium-box bg-amber-50 border-l-4 border-amber-500 p-4 my-6 rounded-r-lg' }), 
      ['div', { class: 'flex items-center gap-2 mb-2 text-amber-800 font-bold' }, 
        ['span', { class: 'material-symbols-outlined text-amber-600 text-xl' }, 'warning'],
        ['span', {}, 'Common Mistake']
      ],
      ['div', { class: 'text-amber-900 premium-box-content' }, 0]
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(WarningBoxComponent)
  },
})

const WarningBoxComponent = () => {
  return (
    <NodeViewWrapper className="warning-box premium-box bg-amber-50 border-l-4 border-amber-500 p-4 my-6 rounded-r-lg">
      <div className="flex items-center gap-2 mb-2 text-amber-800 font-bold">
        <span className="material-symbols-outlined text-amber-600 text-xl">warning</span>
        <span>Common Mistake</span>
      </div>
      <NodeViewContent className="text-amber-900 premium-box-content" />
    </NodeViewWrapper>
  )
}

// --- Success Box ---
export const SuccessBox = Node.create({
  name: 'successBox',
  group: 'block',
  content: 'block+',
  defining: true,

  parseHTML() {
    return [
      { 
        tag: 'div.success-box',
        contentElement: 'div.premium-box-content'
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'success-box premium-box bg-blue-50 border-l-4 border-blue-500 p-4 my-6 rounded-r-lg' }), 
      ['div', { class: 'flex items-center gap-2 mb-2 text-blue-800 font-bold' }, 
        ['span', { class: 'material-symbols-outlined text-blue-600 text-xl' }, 'check_circle'],
        ['span', {}, 'Benefit']
      ],
      ['div', { class: 'text-blue-900 premium-box-content' }, 0]
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(SuccessBoxComponent)
  },
})

const SuccessBoxComponent = () => {
  return (
    <NodeViewWrapper className="success-box premium-box bg-blue-50 border-l-4 border-blue-500 p-4 my-6 rounded-r-lg">
      <div className="flex items-center gap-2 mb-2 text-blue-800 font-bold">
        <span className="material-symbols-outlined text-blue-600 text-xl">check_circle</span>
        <span>Benefit</span>
      </div>
      <NodeViewContent className="text-blue-900 premium-box-content" />
    </NodeViewWrapper>
  )
}
