"use client"

import { useState, useEffect } from "react"
import { TextModalWrapper } from "../modals/text-modal-wrapper"
import { registerIsolatedTextModal } from "@/utils/text-modal-registry"

export const TextModalProvider = () => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Register our isolated text modal
    const cleanup = registerIsolatedTextModal()

    // Listen for the open text modal event
    const handleOpenTextModal = () => {
      setIsOpen(true)
    }

    document.addEventListener("open-text-modal", handleOpenTextModal)

    return () => {
      cleanup()
      document.removeEventListener("open-text-modal", handleOpenTextModal)
    }
  }, [])

  return <TextModalWrapper isOpen={isOpen} onClose={() => setIsOpen(false)} />
}
