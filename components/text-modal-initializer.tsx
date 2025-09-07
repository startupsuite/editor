"use client"

import { useEffect } from "react"

export const TextModalInitializer = () => {
  useEffect(() => {
    // Find all buttons that open the text modal
    const textButtons = document.querySelectorAll('[data-modal="text"], [data-action="open-text-modal"]')

    // Add event listeners to all text buttons
    textButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Dispatch the open text modal event
        document.dispatchEvent(new CustomEvent("open-text-modal"))
      })
    })

    // Return a cleanup function
    return () => {
      textButtons.forEach((button) => {
        button.removeEventListener("click", () => {
          document.dispatchEvent(new CustomEvent("open-text-modal"))
        })
      })
    }
  }, [])

  return null
}
