"use client"

import { usePhotoMenu } from "@/components/providers/photo-menu-provider"

interface PhotoMenuButtonProps {
  className?: string
}

export function PhotoMenuButton({ className = "" }: PhotoMenuButtonProps) {
  const { openPhotoMenu } = usePhotoMenu()

  return (
    <button
      className={`px-4 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 ${className}`}
      onClick={openPhotoMenu}
    >
      Open Photo Menu
    </button>
  )
}
