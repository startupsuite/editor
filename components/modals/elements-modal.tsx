"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useDocument } from "@/context/document-context"
import { useRipple } from "@/hooks/use-ripple"
import type { ShapeType, BorderStyle } from "@/types/document-builder"
import { useDrag } from "react-dnd"
import { X } from "lucide-react"

interface ElementsModalProps {
  isOpen: boolean
  onClose: () => void
}

// Separate ShapeCard component with inline styles to ensure neutral colors
const ShapeCard: React.FC<{
  shapeType: ShapeType
  name: string
  children: React.ReactNode
  onClick: () => void
}> = ({ shapeType, name, children, onClick }) => {
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
      }}
      className="hover:bg-[#e8e8e8] transition-all"
      onClick={handleClick}
    >
      <div
        style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60px", marginBottom: "8px" }}
      >
        {children}
      </div>
      <div style={{ fontSize: "12px", color: "#333333", fontWeight: "normal" }}>{name}</div>
    </div>
  )
}

export const ElementsModal: React.FC<ElementsModalProps> = ({ isOpen, onClose }) => {
  const { addElement } = useDocument()
  const [activeTab, setActiveTab] = useState<"basic" | "arrows" | "lines">("basic")
  const [fillColor, setFillColor] = useState("#000000") // Black for fill
  const [borderColor, setBorderColor] = useState("#000000") // Black for border
  const [borderStyle, setBorderStyle] = useState<BorderStyle>("solid")
  const [fillOpacity, setFillOpacity] = useState(50)
  const [borderWidth, setBorderWidth] = useState(20)

  const fillSliderRef = useRef<HTMLDivElement>(null)
  const borderSliderRef = useRef<HTMLDivElement>(null)

  const handleAddShape = (shapeType: ShapeType) => {
    addElement({
      type: "shape",
      shapeType,
      position: { x: 300, y: 200 },
      size: { width: 100, height: 100 },
      rotation: 0,
      zIndex: 1,
      fillColor: fillColor,
      borderColor: borderColor,
      borderWidth: borderWidth / 10,
      borderStyle: borderStyle,
      opacity: fillOpacity / 100,
      // Add text properties by default
      hasText: true,
      text: "Add text",
      textProps: {
        fontFamily: "font-roboto",
        fontSize: 16,
        color: "#FFFFFF",
        bold: false,
        italic: false,
        underline: false,
        strikethrough: false,
        alignment: "center",
        effect: "none",
        effectIntensity: 0,
      },
    })
  }

  const updateSliderPosition = (
    e: React.MouseEvent<HTMLDivElement> | MouseEvent,
    sliderRef: React.RefObject<HTMLDivElement>,
    setValue: React.Dispatch<React.SetStateAction<number>>,
  ) => {
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
      setValue(Math.round(percentage))
    }
  }

  const initSliderDrag = (
    e: React.MouseEvent<HTMLDivElement>,
    sliderRef: React.RefObject<HTMLDivElement>,
    setValue: React.Dispatch<React.SetStateAction<number>>,
  ) => {
    updateSliderPosition(e, sliderRef, setValue)

    const handleMouseMove = (e: MouseEvent) => {
      updateSliderPosition(e, sliderRef, setValue)
    }

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  if (!isOpen) return null

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        style={{
          width: "400px",
          backgroundColor: "#FFFFFF",
          borderRadius: 0,
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: 500, color: "#333333" }}>Shapes</h2>
          <button
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#666666",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        <p style={{ padding: "0 20px", paddingTop: "12px", paddingBottom: "12px", fontSize: "14px", color: "#666666" }}>
          Click to add or drag shapes to the canvas
        </p>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #f0f0f0" }}>
          {["basic", "arrows", "lines"].map((tab) => (
            <button
              key={tab}
              style={{
                flex: 1,
                padding: "12px 0",
                fontSize: "14px",
                fontWeight: 500,
                position: "relative",
                color: activeTab === tab ? "#000000" : "#666666",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => setActiveTab(tab as "basic" | "arrows" | "lines")}
            >
              <div style={{ position: "relative", padding: "0 16px" }}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-13px",
                      left: 0,
                      width: "100%",
                      height: "2px",
                      backgroundColor: "#000000",
                    }}
                  ></div>
                )}
              </div>
            </button>
          ))}
        </div>

        <div style={{ padding: "16px" }}>
          {/* Basic Shapes */}
          <div style={{ display: activeTab === "basic" ? "block" : "none" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
              <ShapeCard shapeType="rect" name="Rectangle" onClick={() => handleAddShape("rect")}>
                <div style={{ width: "48px", height: "48px", backgroundColor: "#000000", borderRadius: "4px" }}></div>
              </ShapeCard>
              <ShapeCard shapeType="circle" name="Circle" onClick={() => handleAddShape("circle")}>
                <div style={{ width: "48px", height: "48px", backgroundColor: "#000000", borderRadius: "50%" }}></div>
              </ShapeCard>
              <ShapeCard shapeType="triangle" name="Triangle" onClick={() => handleAddShape("triangle")}>
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: "30px solid transparent",
                    borderRight: "30px solid transparent",
                    borderBottom: "52px solid #000000",
                  }}
                ></div>
              </ShapeCard>
              <ShapeCard shapeType="line" name="Line" onClick={() => handleAddShape("line")}>
                <div style={{ width: "48px", height: "3px", backgroundColor: "#000000" }}></div>
              </ShapeCard>
            </div>
          </div>

          {/* Arrows */}
          <div style={{ display: activeTab === "arrows" ? "block" : "none" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
              <ShapeCard shapeType="arrow-right" name="Arrow Right" onClick={() => handleAddShape("arrow-right")}>
                <div style={{ color: "#000000", fontSize: "32px" }}>→</div>
              </ShapeCard>
              <ShapeCard shapeType="arrow-left" name="Arrow Left" onClick={() => handleAddShape("arrow-left")}>
                <div style={{ color: "#000000", fontSize: "32px" }}>←</div>
              </ShapeCard>
              <ShapeCard shapeType="arrow-up" name="Arrow Up" onClick={() => handleAddShape("arrow-up")}>
                <div style={{ color: "#000000", fontSize: "32px" }}>↑</div>
              </ShapeCard>
              <ShapeCard shapeType="arrow-down" name="Arrow Down" onClick={() => handleAddShape("arrow-down")}>
                <div style={{ color: "#000000", fontSize: "32px" }}>↓</div>
              </ShapeCard>
            </div>
          </div>

          {/* Lines */}
          <div style={{ display: activeTab === "lines" ? "block" : "none" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
              <ShapeCard shapeType="solid-line" name="Solid Line" onClick={() => handleAddShape("solid-line")}>
                <div style={{ width: "48px", height: "2px", backgroundColor: "#000000" }}></div>
              </ShapeCard>
              <ShapeCard shapeType="dashed-line" name="Dashed Line" onClick={() => handleAddShape("dashed-line")}>
                <div
                  style={{
                    width: "48px",
                    height: "2px",
                    borderTop: "2px dashed #000000",
                  }}
                ></div>
              </ShapeCard>
              <ShapeCard shapeType="dotted-line" name="Dotted Line" onClick={() => handleAddShape("dotted-line")}>
                <div
                  style={{
                    width: "48px",
                    height: "2px",
                    borderTop: "2px dotted #000000",
                  }}
                ></div>
              </ShapeCard>
              <ShapeCard shapeType="thick-line" name="Thick Line" onClick={() => handleAddShape("thick-line")}>
                <div style={{ width: "48px", height: "4px", backgroundColor: "#000000" }}></div>
              </ShapeCard>
            </div>
          </div>

          {/* Controls */}
          <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Fill Color Control */}
            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <span style={{ fontSize: "14px", fontWeight: 500, color: "#333333" }}>Fill Color</span>
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    border: "1px solid #e0e0e0",
                    backgroundColor: fillColor,
                  }}
                ></div>
              </div>
              <div style={{ height: "36px", display: "flex", alignItems: "center" }}>
                <div
                  ref={fillSliderRef}
                  style={{
                    width: "100%",
                    height: "4px",
                    backgroundColor: "#e0e0e0",
                    borderRadius: "2px",
                    position: "relative",
                    cursor: "pointer",
                  }}
                  onClick={(e) => updateSliderPosition(e, fillSliderRef, setFillOpacity)}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      height: "100%",
                      width: `${fillOpacity}%`,
                      backgroundColor: "#000000",
                      borderRadius: "2px",
                    }}
                  ></div>
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: `${fillOpacity}%`,
                      width: "16px",
                      height: "16px",
                      backgroundColor: "#000000",
                      border: "2px solid white",
                      borderRadius: "50%",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      cursor: "pointer",
                      transform: "translate(-50%, -50%)",
                    }}
                    onMouseDown={(e) => initSliderDrag(e, fillSliderRef, setFillOpacity)}
                  ></div>
                </div>
              </div>
            </div>

            {/* Border Width Control */}
            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <span style={{ fontSize: "14px", fontWeight: 500, color: "#333333" }}>Border Width</span>
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    border: "1px solid #e0e0e0",
                    backgroundColor: borderColor,
                  }}
                ></div>
              </div>
              <div style={{ height: "36px", display: "flex", alignItems: "center" }}>
                <div
                  ref={borderSliderRef}
                  style={{
                    width: "100%",
                    height: "4px",
                    backgroundColor: "#e0e0e0",
                    borderRadius: "2px",
                    position: "relative",
                    cursor: "pointer",
                  }}
                  onClick={(e) => updateSliderPosition(e, borderSliderRef, setBorderWidth)}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      height: "100%",
                      width: `${borderWidth}%`,
                      backgroundColor: "#000000",
                      borderRadius: "2px",
                    }}
                  ></div>
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: `${borderWidth}%`,
                      width: "16px",
                      height: "16px",
                      backgroundColor: "#000000",
                      border: "2px solid white",
                      borderRadius: "50%",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      cursor: "pointer",
                      transform: "translate(-50%, -50%)",
                    }}
                    onMouseDown={(e) => initSliderDrag(e, borderSliderRef, setBorderWidth)}
                  ></div>
                </div>
              </div>
            </div>

            {/* Border Style Control */}
            <div>
              <div style={{ marginBottom: "8px" }}>
                <span style={{ fontSize: "14px", fontWeight: 500, color: "#333333" }}>Border Style</span>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  style={{
                    flex: 1,
                    padding: "8px 0",
                    borderRadius: "9999px",
                    fontSize: "14px",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: borderStyle === "solid" ? "#e0e0e0" : "#f5f5f5",
                    color: borderStyle === "solid" ? "#000000" : "#333333",
                  }}
                  onClick={() => setBorderStyle("solid")}
                >
                  Solid
                </button>
                <button
                  style={{
                    flex: 1,
                    padding: "8px 0",
                    borderRadius: "9999px",
                    fontSize: "14px",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: borderStyle === "dashed" ? "#e0e0e0" : "#f5f5f5",
                    color: borderStyle === "dashed" ? "#000000" : "#333333",
                  }}
                  onClick={() => setBorderStyle("dashed")}
                >
                  Dashed
                </button>
                <button
                  style={{
                    flex: 1,
                    padding: "8px 0",
                    borderRadius: "9999px",
                    fontSize: "14px",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: borderStyle === "dotted" ? "#e0e0e0" : "#f5f5f5",
                    color: borderStyle === "dotted" ? "#000000" : "#333333",
                  }}
                  onClick={() => setBorderStyle("dotted")}
                >
                  Dotted
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
