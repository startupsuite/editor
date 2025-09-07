"use client"

import { useEffect } from "react"
import { PhotoMenuModalV2 } from "@/components/modals/photo-menu-modal-v2"

export function PhotoMenuInitializer() {
  useEffect(() => {
    // Log that the initializer has mounted
    console.log("PhotoMenuInitializer mounted")

    // Dispatch a custom event to notify that the Photo Menu is ready
    const event = new CustomEvent("photo-menu-ready", { bubbles: true })
    document.dispatchEvent(event)
    window.dispatchEvent(event)

    return () => {
      console.log("PhotoMenuInitializer unmounted")
    }
  }, [])

  return <PhotoMenuModalV2 />
}
