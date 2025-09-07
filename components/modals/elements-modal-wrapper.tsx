"use client"

import type React from "react"
import { useEffect, useRef } from "react"

interface ElementsModalWrapperProps {
  children: React.ReactNode
}

export const ElementsModalWrapper: React.FC<ElementsModalWrapperProps> = ({ children }) => {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!wrapperRef.current) return

    // Apply neutral styles to the modal
    const applyNeutralStyles = () => {
      const modal = wrapperRef.current
      if (!modal) return

      // Add our neutral class
      modal.classList.add("elements-modal-neutral")
      modal.classList.add("elements-modal")

      // Find all tabs and apply neutral styles
      const tabs = modal.querySelectorAll('[role="tab"], button[class*="TabsTrigger"]')
      tabs.forEach((tab) => {
        const isActive =
          tab.getAttribute("aria-selected") === "true" ||
          tab.classList.contains("active") ||
          tab.getAttribute("data-state") === "active"

        // Override styles directly
        if (isActive) {
          ;(tab as HTMLElement).style.color = "#000000"

          // Find and style the indicator
          const indicator = tab.querySelector("div[class*='indicator'], div:last-child")
          if (indicator) {
            ;(indicator as HTMLElement).style.backgroundColor = "#000000"
          }

          // Add an ::after element with black background if needed
          const style = document.createElement("style")
          style.textContent = `
            .elements-modal [aria-selected="true"]::after,
            .elements-modal .active::after,
            .elements-modal [data-state="active"]::after {
              background-color: #000000 !important;
            }
          `
          document.head.appendChild(style)
        } else {
          ;(tab as HTMLElement).style.color = "#666666"
        }
      })

      // Find all tab indicators and make them black
      const indicators = modal.querySelectorAll(".tab-indicator, [class*='indicator'], [class*='active']::after")
      indicators.forEach((indicator) => {
        ;(indicator as HTMLElement).style.backgroundColor = "#000000"
      })
    }

    // Apply styles immediately
    applyNeutralStyles()

    // Set up a MutationObserver to apply styles when DOM changes
    const observer = new MutationObserver(applyNeutralStyles)
    observer.observe(wrapperRef.current, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"],
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={wrapperRef} className="elements-modal-neutral elements-modal">
      {children}
    </div>
  )
}
