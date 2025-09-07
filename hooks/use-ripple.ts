"use client"

import type React from "react"
import { useCallback } from "react"

export const useRipple = () => {
  const createRipple = useCallback((event: React.MouseEvent<HTMLElement>) => {
    const button = event.currentTarget

    // Remove existing ripples
    const ripples = button.getElementsByClassName("ripple")
    for (let i = 0; i < ripples.length; i++) {
      ripples[i].remove()
    }

    const circle = document.createElement("span")
    const diameter = Math.max(button.clientWidth, button.clientHeight)
    const radius = diameter / 2

    const rect = button.getBoundingClientRect()

    circle.style.width = circle.style.height = `${diameter}px`
    circle.style.left = `${event.clientX - rect.left - radius}px`
    circle.style.top = `${event.clientY - rect.top - radius}px`
    circle.classList.add("ripple")

    button.appendChild(circle)

    // Remove ripple after animation completes
    setTimeout(() => {
      if (circle && circle.parentNode) {
        circle.parentNode.removeChild(circle)
      }
    }, 600)
  }, [])

  return { createRipple }
}
