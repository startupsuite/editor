"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface TooltipProps {
  text: string
  children: React.ReactNode
  position?: "top" | "bottom" | "left" | "right"
  delay?: number
}

export const Tooltip: React.FC<TooltipProps> = ({ text, children, position = "bottom", delay = 300 }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const targetRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const showTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
      updatePosition()
    }, delay)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsVisible(false)
  }

  const updatePosition = () => {
    if (!targetRef.current) return

    const rect = targetRef.current.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = position === "top" ? rect.top : rect.bottom

    setCoords({ x, y })
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // Update position on window resize
  useEffect(() => {
    if (isVisible) {
      window.addEventListener("resize", updatePosition)
      return () => window.removeEventListener("resize", updatePosition)
    }
  }, [isVisible])

  const getTooltipStyle = () => {
    let style: React.CSSProperties = {
      position: "fixed",
      zIndex: 1000,
      transform: "translateX(-50%)",
      pointerEvents: "none",
    }

    switch (position) {
      case "top":
        style = {
          ...style,
          bottom: `calc(100vh - ${coords.y}px + 8px)`,
          left: coords.x,
          transform: "translateX(-50%)",
        }
        break
      case "bottom":
        style = {
          ...style,
          top: `${coords.y + 8}px`,
          left: coords.x,
          transform: "translateX(-50%)",
        }
        break
      case "left":
        style = {
          ...style,
          top: coords.y,
          right: `calc(100vw - ${coords.x}px + 8px)`,
          transform: "translateY(-50%)",
        }
        break
      case "right":
        style = {
          ...style,
          top: coords.y,
          left: `${coords.x + 8}px`,
          transform: "translateY(-50%)",
        }
        break
    }

    return style
  }

  return (
    <div
      ref={targetRef}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      className="inline-block"
    >
      {children}
      {isVisible && (
        <div
          className="bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-md-elevation-2 max-w-xs"
          style={getTooltipStyle()}
          role="tooltip"
        >
          {text}
        </div>
      )}
    </div>
  )
}

export const TooltipRoot = Tooltip
export const TooltipTrigger = ({ children }: { children: React.ReactNode }) => <>{children}</>
export const TooltipContent = ({ text }: { text: string }) => <>{text}</>
export const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>
