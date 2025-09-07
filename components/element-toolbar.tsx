"use client"

import type React from "react"

import { useDocument } from "@/context/document-context"
import { useRipple } from "@/hooks/use-ripple"
import type { SlideElement } from "@/types/document-builder"

interface ElementToolbarProps {
  selectedElement: SlideElement | null
}

export const ElementToolbar: React.FC<ElementToolbarProps> = ({ selectedElement }) => {
  const { duplicateElement, removeElement } = useDocument()
  const { createRipple } = useRipple()

  if (!selectedElement) return null

  // Calculate position for the toolbar
  // Position it above the element
  const toolbarStyle = {
    left: `${selectedElement.position.x + selectedElement.size.width / 2}px`,
    top: `${selectedElement.position.y - 40}px`,
  }

  return (
    <div
      className="absolute z-30 flex items-center bg-md-surface rounded-md-md shadow-md-elevation-2 border border-md-outline-variant transform -translate-x-1/2"
      style={toolbarStyle}
    >
      <button
        className="flex items-center justify-center w-8 h-8 rounded-md-md text-md-on-surface hover:bg-md-surface-variant hover:bg-opacity-40 transition-colors"
        title="Edit"
        onClick={(e) => createRipple(e)}
      >
        <i className="material-icons text-sm">edit</i>
      </button>
      <button
        className="flex items-center justify-center w-8 h-8 rounded-md-md text-md-on-surface hover:bg-md-surface-variant hover:bg-opacity-40 transition-colors"
        title="Duplicate"
        onClick={(e) => {
          createRipple(e)
          duplicateElement(selectedElement.id)
        }}
      >
        <i className="material-icons text-sm">content_copy</i>
      </button>
      <button
        className="flex items-center justify-center w-8 h-8 rounded-md-md text-md-on-surface hover:bg-md-surface-variant hover:bg-opacity-40 transition-colors"
        title="Delete"
        onClick={(e) => {
          createRipple(e)
          removeElement(selectedElement.id)
        }}
      >
        <i className="material-icons text-sm">delete</i>
      </button>
      <button
        className="flex items-center justify-center w-8 h-8 rounded-md-md text-md-on-surface hover:bg-md-surface-variant hover:bg-opacity-40 transition-colors"
        title="More"
        onClick={(e) => createRipple(e)}
      >
        <i className="material-icons text-sm">more_horiz</i>
      </button>
    </div>
  )
}
