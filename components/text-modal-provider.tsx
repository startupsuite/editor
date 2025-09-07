"use client"

import { useState, useEffect } from "react"
import { TextModalWrapper } from "./modals/text-modal-wrapper"

export const TextModalProvider = () => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Add CSS to the document
    const style = document.createElement("style")
    style.textContent = `
      /* Ensure the text modal has the correct styling */
      .text-modal-exact * {
        box-sizing: border-box;
      }
      
      .text-modal-exact .bg-purple-50 {
        background-color: #f5f3ff;
      }
      
      .text-modal-exact .hover\\:bg-purple-100:hover {
        background-color: #ede9fe;
      }
    `
    document.head.appendChild(style)

    // Listen for the custom event to open the modal
    const handleOpenModal = () => {
      setIsOpen(true)
    }

    // Replace the original text modal open function
    const originalOpenTextModal = window.openTextModal
    window.openTextModal = handleOpenModal

    // Add event listener for custom event
    document.addEventListener("open-text-modal", handleOpenModal)

    return () => {
      // Clean up
      document.removeEventListener("open-text-modal", handleOpenModal)
      window.openTextModal = originalOpenTextModal
      document.head.removeChild(style)
    }
  }, [])

  return <TextModalWrapper isOpen={isOpen} onClose={() => setIsOpen(false)} />
}
