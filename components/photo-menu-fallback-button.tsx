"use client"

import { usePhotoMenu } from "@/components/providers/photo-menu-provider"
import { useEffect, useState } from "react"

export function PhotoMenuFallbackButton() {
  const { openPhotoMenu } = usePhotoMenu()
  const [showFallback, setShowFallback] = useState(false)

  useEffect(() => {
    // Show fallback button after a delay if the integration might have failed
    const timer = setTimeout(() => {
      setShowFallback(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!showFallback) return null

  return (
    <button
      className="fixed bottom-4 right-4 bg-white shadow-md rounded-full p-3 z-50"
      onClick={openPhotoMenu}
      aria-label="Open Photos"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    </button>
  )
}
