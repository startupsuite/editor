"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { PhotoMenuModal } from "@/components/modals/photo-menu-modal"

interface PhotoMenuContextType {
  openPhotoMenu: () => void
  closePhotoMenu: () => void
  isPhotoMenuOpen: boolean
}

const PhotoMenuContext = createContext<PhotoMenuContextType>({
  openPhotoMenu: () => {},
  closePhotoMenu: () => {},
  isPhotoMenuOpen: false,
})

export const usePhotoMenu = () => useContext(PhotoMenuContext)

interface PhotoMenuProviderProps {
  children: ReactNode
}

export function PhotoMenuProvider({ children }: PhotoMenuProviderProps) {
  const [isPhotoMenuOpen, setIsPhotoMenuOpen] = useState(false)

  const openPhotoMenu = () => setIsPhotoMenuOpen(true)
  const closePhotoMenu = () => setIsPhotoMenuOpen(false)

  // Listen for custom events to open/close the photo menu
  useEffect(() => {
    const handleOpenPhotoMenu = () => openPhotoMenu()
    const handleClosePhotoMenu = () => closePhotoMenu()

    // Add event listeners for custom events
    window.addEventListener("open-photo-menu", handleOpenPhotoMenu)
    window.addEventListener("close-photo-menu", handleClosePhotoMenu)

    return () => {
      // Clean up event listeners
      window.removeEventListener("open-photo-menu", handleOpenPhotoMenu)
      window.removeEventListener("close-photo-menu", handleClosePhotoMenu)
    }
  }, [])

  return (
    <PhotoMenuContext.Provider value={{ openPhotoMenu, closePhotoMenu, isPhotoMenuOpen }}>
      {children}
      <PhotoMenuModal isOpen={isPhotoMenuOpen} onClose={closePhotoMenu} />
    </PhotoMenuContext.Provider>
  )
}
