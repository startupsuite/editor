"use client"

import type React from "react"

import { createContext, useContext, useState, useCallback, useMemo } from "react"

// Standard presentation dimensions
const REFERENCE_WIDTH = 720 // Standard presentation width for 100% zoom
const REFERENCE_HEIGHT = 405 // Standard presentation height (16:9 aspect ratio)
const SLIDE_ASPECT_RATIO = 16 / 9

// Preset zoom levels
export const ZOOM_PRESETS = [25, 50, 75, 100, 115, 125, 150, 175, 200, 250, 300]

interface ZoomContextType {
  scale: number
  setScale: (scale: number) => void
  zoomIn: () => void
  zoomOut: () => void
  resetZoom: () => void
  fitToView: (containerWidth: number, containerHeight: number) => void
  zoomToPreset: (presetPercentage: number) => void
  getZoomPercentage: () => number
}

const ZoomContext = createContext<ZoomContextType | undefined>(undefined)

export const ZoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scale, setScale] = useState(1) // 1 = 100%

  // Get zoom percentage (for display)
  const getZoomPercentage = useCallback(() => {
    return Math.round(scale * 100)
  }, [scale])

  // Zoom in with smoother increments
  const zoomIn = useCallback(() => {
    setScale((prev) => {
      // Find the next preset level
      const currentPercent = Math.round(prev * 100)
      const nextPreset = ZOOM_PRESETS.find((preset) => preset > currentPercent)

      if (nextPreset) {
        return nextPreset / 100
      }

      // If no preset is higher, increase by 10%
      return Math.min(3, prev * 1.1)
    })
  }, [])

  // Zoom out with smoother increments
  const zoomOut = useCallback(() => {
    setScale((prev) => {
      // Find the previous preset level
      const currentPercent = Math.round(prev * 100)
      const prevPresets = [...ZOOM_PRESETS].reverse()
      const prevPreset = prevPresets.find((preset) => preset < currentPercent)

      if (prevPreset) {
        return prevPreset / 100
      }

      // If no preset is lower, decrease by 10%
      return Math.max(0.1, prev * 0.9)
    })
  }, [])

  // Reset to 100% zoom
  const resetZoom = useCallback(() => {
    setScale(1)
  }, [])

  // Fit slide to view based on container dimensions
  const fitToView = useCallback((containerWidth: number, containerHeight: number) => {
    if (!containerWidth || !containerHeight) return

    // Add padding to ensure the slide doesn't touch the edges
    const padding = 40 // 20px on each side
    const availableWidth = containerWidth - padding
    const availableHeight = containerHeight - padding

    // Calculate scale based on width and height constraints
    const scaleX = availableWidth / REFERENCE_WIDTH
    const scaleY = availableHeight / REFERENCE_HEIGHT

    // Use the smaller scale to ensure the slide fits completely
    const newScale = Math.min(scaleX, scaleY)

    // Set the new scale
    setScale(newScale)
  }, [])

  // Zoom to a specific preset percentage
  const zoomToPreset = useCallback((presetPercentage: number) => {
    setScale(presetPercentage / 100)
  }, [])

  const value = useMemo(
    () => ({
      scale,
      setScale,
      zoomIn,
      zoomOut,
      resetZoom,
      fitToView,
      zoomToPreset,
      getZoomPercentage,
    }),
    [scale, setScale, zoomIn, zoomOut, resetZoom, fitToView, zoomToPreset, getZoomPercentage],
  )

  return <ZoomContext.Provider value={value}>{children}</ZoomContext.Provider>
}

export const useZoom = () => {
  const context = useContext(ZoomContext)
  if (context === undefined) {
    throw new Error("useZoom must be used within a ZoomProvider")
  }
  return context
}
