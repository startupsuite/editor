"use client"

import type React from "react"
import { useDrag } from "react-dnd"
import { useRipple } from "@/hooks/use-ripple"
import type { ShapeType } from "@/types/document-builder"

interface ShapeCardProps {
  shapeType: ShapeType
  name: string
  children: React.ReactNode
  onClick: () => void
}

export const ShapeCard: React.FC<ShapeCardProps> = ({ shapeType, name, children, onClick }) => {
  const { createRipple } = useRipple()
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "SHAPE",
    item: { shapeType },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    createRipple(e)
    onClick()
  }

  return (
    <div
      ref={drag}
      style={{
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        height: "100px",
        opacity: isDragging ? 0.5 : 1,
        position: "relative",
        overflow: "hidden",
        transition: "background-color 0.2s ease",
      }}
      onClick={handleClick}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = "#e8e8e8"
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = "#f5f5f5"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "60px",
          marginBottom: "8px",
        }}
      >
        {children}
      </div>
      <div style={{ fontSize: "12px", color: "#333333", fontWeight: "normal" }}>{name}</div>
    </div>
  )
}
