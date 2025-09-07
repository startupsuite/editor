"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import { Keyboard } from "lucide-react"

interface ShortcutItem {
  keys: string
  action: string
}

const KEYBOARD_SHORTCUTS: ShortcutItem[] = [
  { keys: "Delete/Backspace", action: "Delete element" },
  { keys: "Ctrl+D", action: "Duplicate element" },
  { keys: "Ctrl+G", action: "Toggle grid" },
  { keys: "Ctrl+Shift+G", action: "Toggle snap to grid" },
  { keys: "Arrow keys", action: "Move element 1px" },
  { keys: "Shift+Arrow keys", action: "Move element 10px" },
  { keys: "Ctrl+Shift+]", action: "Bring to front" },
  { keys: "Ctrl+Shift+[", action: "Send to back" },
  { keys: "Shift (while resizing)", action: "Maintain aspect ratio" },
  { keys: "Alt", action: "Temporarily enable snap" },
  { keys: "Mouse wheel", action: "Zoom in/out" },
]

export const KeyboardShortcutsPanel = () => {
  const [isVisible, setIsVisible] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Close panel when pressing Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsVisible(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  return (
    <div className="fixed bottom-4 right-4 z-30">
      <button
        ref={buttonRef}
        className="w-10 h-10 bg-white rounded-full shadow-md-elevation-2 flex items-center justify-center hover:bg-gray-50 transition-colors"
        onClick={() => setIsVisible(!isVisible)}
        aria-label="Keyboard shortcuts"
        title="Keyboard shortcuts"
      >
        <Keyboard size={20} className="text-gray-700" />
      </button>

      {isVisible && (
        <div
          ref={panelRef}
          className="absolute bottom-12 right-0 bg-white rounded-md shadow-md-elevation-3 p-4 w-80 transform transition-opacity duration-200 ease-in-out"
          style={{ opacity: isVisible ? 1 : 0 }}
        >
          <div className="flex justify-between items-center mb-2 border-b pb-2">
            <h3 className="font-medium text-md-on-surface">Keyboard Shortcuts:</h3>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setIsVisible(false)}
              aria-label="Close keyboard shortcuts"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-y-2 text-sm">
            {KEYBOARD_SHORTCUTS.map((shortcut, index) => (
              <React.Fragment key={index}>
                <div className="font-medium text-gray-700">{shortcut.keys}</div>
                <div className="text-gray-600">{shortcut.action}</div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
