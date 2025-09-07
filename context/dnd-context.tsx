"use client"

import type React from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { TouchBackend } from "react-dnd-touch-backend"
import { useMobile } from "@/hooks/use-mobile"

// Configuration options for the backends
const HTML5_CONFIG = {
  enableMouseEvents: true,
  enableKeyboardEvents: true,
}

const TOUCH_CONFIG = {
  enableMouseEvents: true, // Allow mouse events on touch devices for better hybrid device support
  enableTouchEvents: true,
  delayTouchStart: 0, // Reduce delay for more responsive feel
  touchSlop: 5, // Distance in px before a touch is considered a drag (smaller = more responsive)
}

export const DndContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isMobile = useMobile()

  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend} options={isMobile ? TOUCH_CONFIG : HTML5_CONFIG}>
      {children}
    </DndProvider>
  )
}
