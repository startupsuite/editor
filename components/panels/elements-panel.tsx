"use client"

import type React from "react"
import { useState } from "react"
import { useDocument } from "@/context/document-context"
import { useRipple } from "@/hooks/use-ripple"
import type { ShapeType, BorderStyle } from "@/types/document-builder"
import { Tabs } from "@/components/ui/tabs"
import { X } from "lucide-react"

interface ElementsPanelProps {
  isOpen: boolean
  onClose: () => void
}

interface ShapeCardProps {
  shapeType: ShapeType
  name: string
  children: React.ReactNode
}

const ShapeCard: React.FC<ShapeCardProps> = ({ shapeType, name, children }) => {
  const { createRipple } = useRipple()
  const { addElement } = useDocument()

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    createRipple(e)
    addElement({
      type: "shape",
      shapeType,
      position: { x: 300, y: 200 },
      size: { width: 100, height: 100 },
      rotation: 0,
      zIndex: 1,
      fillColor: "#6750A4", // Material 3 primary color
      borderColor: "#1C1B1F", // Material 3 on-surface color
      borderWidth: 1,
      borderStyle: "solid",
      opacity: 1,
    })
  }

  return (
    <div
      className="bg-md-surface-container-low rounded-md-lg p-4 flex flex-col items-center justify-center cursor-pointer h-[100px] hover:bg-md-surface-container transition-all relative overflow-hidden"
      onClick={handleClick}
    >
      <div className="flex items-center justify-center h-[60px] mb-2">{children}</div>
      <div className="text-xs text-md-on-surface font-normal">{name}</div>
    </div>
  )
}

export const ElementsPanel: React.FC<ElementsPanelProps> = ({ isOpen, onClose }) => {
  const { createRipple } = useRipple()
  const [activeTab, setActiveTab] = useState<"basic" | "arrows" | "lines">("basic")
  const [fillColor, setFillColor] = useState("#6750A4") // Material 3 primary color
  const [borderColor, setBorderColor] = useState("#1C1B1F") // Material 3 on-surface color
  const [borderStyle, setBorderStyle] = useState<BorderStyle>("solid")
  const [fillSliderValue, setFillSliderValue] = useState(50)
  const [borderSliderValue, setBorderSliderValue] = useState(20)

  const handleBorderStyleClick = (style: BorderStyle) => {
    setBorderStyle(style)
  }

  if (!isOpen) return null

  return (
    <div className="w-[380px] bg-md-surface h-full overflow-y-auto border-r border-md-outline-variant shadow-md-elevation-2 animate-in slide-in-from-left duration-300">
      <div className="flex justify-between items-center p-6 border-b border-md-outline-variant">
        <h2 className="text-xl font-medium text-md-on-surface">Shapes</h2>
        <button
          className="w-10 h-10 rounded-full flex items-center justify-center text-md-on-surface-variant hover:bg-md-surface-container-high transition-colors"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-6">
        <p className="text-sm text-md-on-surface-variant mb-6">Click to add or drag shapes to the canvas</p>

        {/* Use the new Tabs component */}
        <Tabs
          tabs={["basic", "arrows", "lines"]}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as "basic" | "arrows" | "lines")}
          className="mb-6"
        />

        {/* Basic Shapes */}
        {activeTab === "basic" && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <ShapeCard shapeType="rect" name="Rectangle">
              <div className="w-12 h-12 bg-md-primary rounded-md"></div>
            </ShapeCard>
            <ShapeCard shapeType="circle" name="Circle">
              <div className="w-12 h-12 bg-md-primary rounded-full"></div>
            </ShapeCard>
            <ShapeCard shapeType="triangle" name="Triangle">
              <div className="w-0 h-0 border-l-[30px] border-r-[30px] border-b-[52px] border-l-transparent border-r-transparent border-b-md-primary"></div>
            </ShapeCard>
            <ShapeCard shapeType="line" name="Line">
              <div className="w-12 h-[3px] bg-md-primary"></div>
            </ShapeCard>
          </div>
        )}

        {/* Arrows */}
        {activeTab === "arrows" && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <ShapeCard shapeType="arrow-right" name="Arrow Right">
              <div className="text-md-primary text-4xl">→</div>
            </ShapeCard>
            <ShapeCard shapeType="arrow-left" name="Arrow Left">
              <div className="text-md-primary text-4xl">←</div>
            </ShapeCard>
            <ShapeCard shapeType="arrow-up" name="Arrow Up">
              <div className="text-md-primary text-4xl">↑</div>
            </ShapeCard>
            <ShapeCard shapeType="arrow-down" name="Arrow Down">
              <div className="text-md-primary text-4xl">↓</div>
            </ShapeCard>
          </div>
        )}

        {/* Lines */}
        {activeTab === "lines" && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <ShapeCard shapeType="solid-line" name="Solid Line">
              <div className="w-12 h-[2px] bg-md-primary"></div>
            </ShapeCard>
            <ShapeCard shapeType="dashed-line" name="Dashed Line">
              <div className="w-12 h-[2px] border-t-[2px] border-dashed border-md-primary"></div>
            </ShapeCard>
            <ShapeCard shapeType="dotted-line" name="Dotted Line">
              <div className="w-12 h-[2px] border-t-[2px] border-dotted border-md-primary"></div>
            </ShapeCard>
            <ShapeCard shapeType="thick-line" name="Thick Line">
              <div className="w-12 h-[4px] bg-md-primary"></div>
            </ShapeCard>
          </div>
        )}

        {/* Controls */}
        <div className="mt-6 space-y-6">
          {/* Fill Color Control */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-md-on-surface">Fill Color</span>
              <div
                className="w-6 h-6 rounded-full border border-md-outline"
                style={{ backgroundColor: fillColor }}
              ></div>
            </div>
            <div className="h-9 flex items-center">
              <div className="w-full h-4 bg-md-surface-container-highest rounded-full relative">
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-md-primary rounded-full"
                  style={{ width: `${fillSliderValue}%` }}
                ></div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={fillSliderValue}
                  onChange={(e) => setFillSliderValue(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div
                  className="absolute top-1/2 w-5 h-5 bg-md-primary border-2 border-white rounded-full shadow-md pointer-events-none"
                  style={{ left: `${fillSliderValue}%`, transform: "translate(-50%, -50%)" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Border Color Control */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-md-on-surface">Border Width</span>
              <div
                className="w-6 h-6 rounded-full border border-md-outline"
                style={{ backgroundColor: borderColor }}
              ></div>
            </div>
            <div className="h-9 flex items-center">
              <div className="w-full h-4 bg-md-surface-container-highest rounded-full relative">
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-md-primary rounded-full"
                  style={{ width: `${borderSliderValue}%` }}
                ></div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={borderSliderValue}
                  onChange={(e) => setBorderSliderValue(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div
                  className="absolute top-1/2 w-5 h-5 bg-md-primary border-2 border-white rounded-full shadow-md pointer-events-none"
                  style={{ left: `${borderSliderValue}%`, transform: "translate(-50%, -50%)" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Border Style Control */}
          <div>
            <div className="mb-3">
              <span className="text-sm font-medium text-md-on-surface">Border Style</span>
            </div>
            <div className="flex gap-2">
              <button
                className={`flex-1 py-2 rounded-full text-sm ${
                  borderStyle === "solid"
                    ? "bg-md-primary-container text-md-on-primary-container"
                    : "bg-md-surface-container-low text-md-on-surface-variant hover:bg-md-surface-container"
                }`}
                onClick={() => handleBorderStyleClick("solid")}
              >
                Solid
              </button>
              <button
                className={`flex-1 py-2 rounded-full text-sm ${
                  borderStyle === "dashed"
                    ? "bg-md-primary-container text-md-on-primary-container"
                    : "bg-md-surface-container-low text-md-on-surface-variant hover:bg-md-surface-container"
                }`}
                onClick={() => handleBorderStyleClick("dashed")}
              >
                Dashed
              </button>
              <button
                className={`flex-1 py-2 rounded-full text-sm ${
                  borderStyle === "dotted"
                    ? "bg-md-primary-container text-md-on-primary-container"
                    : "bg-md-surface-container-low text-md-on-surface-variant hover:bg-md-surface-container"
                }`}
                onClick={() => handleBorderStyleClick("dotted")}
              >
                Dotted
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
