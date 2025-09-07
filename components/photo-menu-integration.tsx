"use client"

import { useEffect } from "react"
import { usePhotoMenu } from "@/components/providers/photo-menu-provider"

export function PhotoMenuIntegration() {
  const { openPhotoMenu } = usePhotoMenu()

  useEffect(() => {
    // Function to inject click handlers into the navigation rail
    const injectPhotoButtonHandler = () => {
      // Find all navigation items
      const navItems = document.querySelectorAll(".navigation-item, .nav-item, .sidebar-item")

      navItems.forEach((item) => {
        // Check if this is the Photos button
        const isPhotoButton =
          item.textContent?.toLowerCase().includes("photo") ||
          item.querySelector("i")?.textContent?.toLowerCase().includes("photo") ||
          item.getAttribute("data-icon")?.toLowerCase().includes("photo")

        if (isPhotoButton && !item.hasAttribute("data-photo-handler-added")) {
          // Mark this button as handled
          item.setAttribute("data-photo-handler-added", "true")

          // Add click handler
          item.addEventListener("click", (e) => {
            e.preventDefault()
            e.stopPropagation()
            openPhotoMenu()
          })

          console.log("Photo button handler added")
        }
      })
    }

    // Run immediately
    injectPhotoButtonHandler()

    // Also run when DOM changes
    const observer = new MutationObserver(() => {
      setTimeout(injectPhotoButtonHandler, 100)
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [openPhotoMenu])

  return null
}
