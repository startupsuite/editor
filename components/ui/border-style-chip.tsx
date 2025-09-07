"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface BorderStyleChipProps {
  style: string
  isSelected: boolean
  onClick: () => void
  className?: string
}

export const BorderStyleChip: React.FC<BorderStyleChipProps> = ({ style, isSelected, onClick, className }) => {
  return (
    <div
      className={cn(
        "h-8 w-8 rounded-full flex items-center justify-center cursor-pointer transition-all",
        isSelected
          ? "bg-primary text-primary-foreground elevation-2"
          : "surface-container-low hover:surface-container-high",
        className,
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          "w-5 h-0 border-t",
          style === "solid" && "border-current",
          style === "dashed" && "border-dashed border-current",
          style === "dotted" && "border-dotted border-current",
        )}
      />
    </div>
  )
}
