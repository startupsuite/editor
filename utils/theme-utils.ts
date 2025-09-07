/**
 * Utility functions for theme management
 */

// Force element to use neutral theme by applying inline styles
export const applyNeutralTheme = (element: HTMLElement | null) => {
  if (!element) return

  // Apply neutral theme to the element
  element.style.setProperty("--md-primary", "#000000", "important")
  element.style.setProperty("--md-primary-container", "#f5f5f5", "important")
  element.style.setProperty("--md-on-primary", "#ffffff", "important")
  element.style.setProperty("--md-on-primary-container", "#000000", "important")

  // Apply to all shape cards
  const shapeCards = element.querySelectorAll('[class*="shape-card"]')
  shapeCards.forEach((card) => {
    ;(card as HTMLElement).style.backgroundColor = "#f5f5f5"
    ;(card as HTMLElement).style.setProperty("--hover-bg", "#e8e8e8", "important")
  })

  // Apply to all shape elements
  const shapes = element.querySelectorAll('[class*="shape-"]')
  shapes.forEach((shape) => {
    ;(shape as HTMLElement).style.backgroundColor = "#000000"
    ;(shape as HTMLElement).style.color = "#000000"

    // Handle triangle shapes specifically
    if ((shape as HTMLElement).style.borderBottomColor) {
      ;(shape as HTMLElement).style.borderBottomColor = "#000000"
    }
  })

  // Apply to tabs
  const tabs = element.querySelectorAll('[role="tab"]')
  tabs.forEach((tab) => {
    ;(tab as HTMLElement).style.color = "#666666"

    if (tab.getAttribute("aria-selected") === "true") {
      ;(tab as HTMLElement).style.color = "#000000"

      // Find and style the indicator
      const indicator = tab.querySelector('[class*="indicator"]')
      if (indicator) {
        ;(indicator as HTMLElement).style.backgroundColor = "#000000"
      }
    }
  })

  // Apply to sliders
  const sliders = element.querySelectorAll('[role="slider"]')
  sliders.forEach((slider) => {
    const track = slider.querySelector('[class*="track"]')
    const thumb = slider.querySelector('[class*="thumb"]')

    if (track) {
      ;(track as HTMLElement).style.backgroundColor = "#e0e0e0"
    }

    if (thumb) {
      ;(thumb as HTMLElement).style.backgroundColor = "#000000"
    }
  })
}
