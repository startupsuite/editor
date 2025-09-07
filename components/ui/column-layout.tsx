import type React from "react"
import { getResponsiveGridClass, type ColumnBreakpoints } from "@/utils/responsive-grid"

interface ColumnLayoutProps {
  children: React.ReactNode
  columns?: number
  breakpoints?: ColumnBreakpoints
  className?: string
  forceColumns?: number
}

export const ColumnLayout: React.FC<ColumnLayoutProps> = ({
  children,
  columns = 1,
  breakpoints,
  className = "",
  forceColumns,
}) => {
  // If forceColumns is provided, use it instead of the responsive grid
  const gridClass = forceColumns
    ? `grid gap-3 grid-cols-${forceColumns} ${className}`
    : `${getResponsiveGridClass(columns, breakpoints)} ${className}`

  return <div className={gridClass}>{children}</div>
}
