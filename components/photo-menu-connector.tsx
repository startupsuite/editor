"use client"

import { useEffect } from "react"
import { usePhotoMenuConnector } from "@/utils/photo-menu-connector"

export function PhotoMenuConnector() {
  usePhotoMenuConnector()

  useEffect(() => {
    // Add data attribute to the Photos button in the navigation rail
    const addDataAttributes = () => {
      const navItems = document.querySelectorAll(".navigation-rail-item")
      navItems.forEach((item) => {
        const text = item.textContent?.toLowerCase() || ""
        if (text.includes("photo")) {
          item.setAttribute("data-nav-item", "photos")
        }
      })
    }

    // Run immediately and also when DOM changes
    addDataAttributes()

    // Set up a MutationObserver to watch for DOM changes
    const observer = new MutationObserver(addDataAttributes)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  return null
}
