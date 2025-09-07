"use client"

import { useEffect } from "react"
import { useDocument } from "@/context/document-context"

interface KeyboardShortcutsProps {
  selectedElementId: string | null
  setShowGrid: (show: boolean) => void
  setSnapToGrid: (snap: boolean) => void
  showGrid: boolean
  snapToGrid: boolean
}

export const useKeyboardShortcuts = ({
  selectedElementId,
  setShowGrid,
  setSnapToGrid,
  showGrid,
  snapToGrid,
}: KeyboardShortcutsProps) => {
  const { removeElement, duplicateElement, moveElement, currentSlide, updateElement } = useDocument()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields or contenteditable elements
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return
      }

      // Delete selected element
      if ((e.key === "Delete" || e.key === "Backspace") && selectedElementId) {
        removeElement(selectedElementId)
      }

      // Duplicate selected element (Ctrl/Cmd + D)
      if (e.key === "d" && (e.ctrlKey || e.metaKey) && selectedElementId) {
        e.preventDefault() // Prevent browser's bookmark dialog
        duplicateElement(selectedElementId)
      }

      // Toggle grid (Ctrl/Cmd + G)
      if (e.key === "g" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault() // Prevent browser's find dialog
        setShowGrid(!showGrid)
      }

      // Toggle snap to grid (Ctrl/Cmd + Shift + G)
      if (e.key === "G" && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        e.preventDefault()
        setSnapToGrid(!snapToGrid)
      }

      // Arrow keys to move selected element
      if (selectedElementId && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault()

        const element = currentSlide.elements.find((el) => el.id === selectedElementId)
        if (!element) return

        const moveDistance = e.shiftKey ? 10 : 1
        const newPosition = { ...element.position }

        switch (e.key) {
          case "ArrowUp":
            newPosition.y -= moveDistance
            break
          case "ArrowDown":
            newPosition.y += moveDistance
            break
          case "ArrowLeft":
            newPosition.x -= moveDistance
            break
          case "ArrowRight":
            newPosition.x += moveDistance
            break
        }

        moveElement(selectedElementId, newPosition)
      }

      // Bring to front (Ctrl/Cmd + Shift + ])
      if (e.key === "]" && (e.ctrlKey || e.metaKey) && e.shiftKey && selectedElementId) {
        e.preventDefault()
        const element = currentSlide.elements.find((el) => el.id === selectedElementId)
        if (!element) return

        const maxZIndex = Math.max(0, ...currentSlide.elements.map((el) => el.zIndex))
        updateElement({
          ...element,
          zIndex: maxZIndex + 1,
        })
      }

      // Send to back (Ctrl/Cmd + Shift + [)
      if (e.key === "[" && (e.ctrlKey || e.metaKey) && e.shiftKey && selectedElementId) {
        e.preventDefault()
        const element = currentSlide.elements.find((el) => el.id === selectedElementId)
        if (!element) return

        const minZIndex = Math.min(...currentSlide.elements.map((el) => el.zIndex))
        updateElement({
          ...element,
          zIndex: minZIndex - 1,
        })
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [
    selectedElementId,
    removeElement,
    duplicateElement,
    showGrid,
    setShowGrid,
    snapToGrid,
    setSnapToGrid,
    moveElement,
    currentSlide,
    updateElement,
  ])
}
