"use client"

import { useEffect } from "react"
import { setupClickDebugger, setupDOMChangeDebugger } from "@/utils/debug-utils"

export function DebugInitializer() {
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== "development") return

    console.log("Debug tools initialized")

    // Set up click debugger
    const removeClickDebugger = setupClickDebugger()

    // Set up DOM change debugger
    const removeDOMChangeDebugger = setupDOMChangeDebugger()

    return () => {
      removeClickDebugger()
      removeDOMChangeDebugger()
    }
  }, [])

  return null
}
