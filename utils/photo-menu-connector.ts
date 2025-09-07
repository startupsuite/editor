"use client"

import { useEffect } from "react"
import { usePhotoMenu } from "@/components/providers/photo-menu-provider"

export function usePhotoMenuConnector() {
  const { openPhotoMenu } = usePhotoMenu()

  useEffect(() => {
    // Function to handle clicks on the Photos button in the navigation rail
    const handlePhotoButtonClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const photoButton = target.closest('[data-nav-item="photos"]')

      if (photoButton) {
        event.preventDefault()
        event.stopPropagation()
        openPhotoMenu()
      }
    }

    // Add a global click listener to catch clicks on the Photos button
    document.addEventListener("click", handlePhotoButtonClick, true)

    // Dispatch a custom event to notify other components that we're ready
    window.dispatchEvent(new CustomEvent("photo-menu-connector-ready"))

    return () => {
      document.removeEventListener("click", handlePhotoButtonClick, true)
    }
  }, [openPhotoMenu])

  return null
}
