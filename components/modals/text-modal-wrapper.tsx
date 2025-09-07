"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { TextModalExact } from "./text-modal-exact"
import { useDocument } from "@/context/document-context"

interface TextModalWrapperProps {
  isOpen: boolean
  onClose: () => void
}

export const TextModalWrapper: React.FC<TextModalWrapperProps> = ({ isOpen, onClose }) => {
  const [showModal, setShowModal] = useState(false)
  const { isTextModalOpen } = useDocument()

  useEffect(() => {
    if (isOpen || isTextModalOpen) {
      setShowModal(true)
    } else {
      setShowModal(false)
    }
  }, [isOpen, isTextModalOpen])

  const handleClose = () => {
    setShowModal(false)
    onClose()
  }

  return <TextModalExact isOpen={showModal} onClose={handleClose} />
}
