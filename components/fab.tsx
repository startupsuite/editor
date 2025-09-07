"use client"

import type React from "react"
import { useState } from "react"
import { useRipple } from "@/hooks/use-ripple"
import { ElementsModal } from "@/components/modals/elements-modal"

interface FloatingActionButtonProps {
  onClick?: () => void
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
  const { createRipple } = useRipple()
  const [showElementsModal, setShowElementsModal] = useState(false)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(e)
    setShowElementsModal(true)
    if (onClick) onClick()
  }

  return (
    <>
      <button
        className="absolute right-6 bottom-[72px] w-14 h-14 rounded-md-lg bg-md-tertiary-container text-md-on-tertiary-container flex items-center justify-center shadow-md-elevation-3 border-none cursor-pointer transition-all duration-200 z-[5] hover:shadow-md-elevation-4 hover:-translate-y-[2px] active:scale-95 active:shadow-md-elevation-2 group"
        onClick={handleClick}
      >
        <i className="material-icons">add</i>
        <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-90 transition-opacity duration-200 bg-md-on-surface text-md-surface px-2 py-1 rounded-md-xs text-xs whitespace-nowrap pointer-events-none">
          Add new element
        </div>
      </button>

      <ElementsModal isOpen={showElementsModal} onClose={() => setShowElementsModal(false)} />
    </>
  )
}
