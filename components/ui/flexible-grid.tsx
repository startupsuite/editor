import type React from "react"

interface FlexibleGridProps {
  children: React.ReactNode
  columns: number
  className?: string
}

export const FlexibleGrid: React.FC<FlexibleGridProps> = ({ children, columns, className = "" }) => {
  // For the screenshot, we force 1 column
  const gridClass = `grid gap-3 grid-cols-1 ${className}`

  return <div className={gridClass}>{children}</div>
}
