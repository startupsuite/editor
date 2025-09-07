"use client"

import { useState, useEffect } from "react"

type ColumnConfig = {
  sm: number
  md: number
  lg: number
  xl: number
}

export function useResponsiveColumns(defaultConfig: ColumnConfig = { sm: 1, md: 2, lg: 3, xl: 4 }) {
  const [columns, setColumns] = useState(1)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) {
        setColumns(1)
      } else if (width < 768) {
        setColumns(defaultConfig.sm)
      } else if (width < 1024) {
        setColumns(defaultConfig.md)
      } else if (width < 1280) {
        setColumns(defaultConfig.lg)
      } else {
        setColumns(defaultConfig.xl)
      }
    }

    // Initial calculation
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => window.removeEventListener("resize", handleResize)
  }, [defaultConfig])

  return columns
}
