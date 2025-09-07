"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDocument } from "@/context/document-context"
import type { SlideElement, TextElement, ShapeElement } from "@/types/document-builder"

interface FloatingToolbarProps {
  selectedElement: SlideElement | null
  onToggleGrid: () => void
  showGrid: boolean
  snapToGrid: boolean
  setSnapToGrid: (snap: boolean) => void
  gridSize: number
  setGridSize: (size: number) => void
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  selectedElement,
  onToggleGrid,
  showGrid,
  snapToGrid,
  setSnapToGrid,
  gridSize,
  setGridSize,
}) => {
  const { updateElement } = useDocument()
  const [fontFamily, setFontFamily] = useState("Arimo")
  const [fontSize, setFontSize] = useState(19)
  const [textColor, setTextColor] = useState("#000000")
  const [fillColor, setFillColor] = useState("#4285F4")
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right" | "justify">("left")
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const [showGridOptions, setShowGridOptions] = useState(false)

  // Font options
  const fontOptions = [
    { value: "Arimo", label: "Arimo" },
    { value: "Roboto", label: "Roboto" },
    { value: "Poppins", label: "Poppins" },
    { value: "Playfair", label: "Playfair" },
    { value: "Merriweather", label: "Merriweather" },
  ]

  // Update state when selected element changes
  useEffect(() => {
    if (!selectedElement) return

    if (selectedElement.type === "text") {
      const textElement = selectedElement as TextElement
      setFontFamily(textElement.fontFamily.replace("font-", ""))
      setFontSize(textElement.fontSize)
      setTextColor(textElement.color)
      setIsBold(textElement.bold)
      setIsItalic(textElement.italic)
      setIsUnderline(textElement.underline)
      setTextAlign(textElement.alignment)
    } else if (selectedElement.type === "shape") {
      const shapeElement = selectedElement as ShapeElement
      setFillColor(shapeElement.fillColor)

      if (shapeElement.hasText && shapeElement.textProps) {
        setFontFamily(shapeElement.textProps.fontFamily.replace("font-", ""))
        setFontSize(shapeElement.textProps.fontSize)
        setTextColor(shapeElement.textProps.color)
        setIsBold(shapeElement.textProps.bold)
        setIsItalic(shapeElement.textProps.italic)
        setIsUnderline(shapeElement.textProps.underline)
        setTextAlign(shapeElement.textProps.alignment)
      }
    }
  }, [selectedElement])

  // Apply text formatting changes
  const applyTextFormatting = (property: string, value: any) => {
    if (!selectedElement) return

    if (selectedElement.type === "text") {
      const updatedElement = {
        ...selectedElement,
        [property]: value,
      } as TextElement

      updateElement(updatedElement)
    } else if (selectedElement.type === "shape" && (selectedElement as ShapeElement).hasText) {
      const shapeElement = selectedElement as ShapeElement
      const updatedElement = {
        ...shapeElement,
        textProps: {
          ...shapeElement.textProps,
          [property]: value,
        },
      } as ShapeElement

      updateElement(updatedElement)
    }
  }

  // Apply shape formatting changes
  const applyShapeFormatting = (property: string, value: any) => {
    if (!selectedElement || selectedElement.type !== "shape") return

    const updatedElement = {
      ...selectedElement,
      [property]: value,
    } as ShapeElement

    updateElement(updatedElement)
  }

  // Handle font family change
  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFamily = `font-${e.target.value.toLowerCase()}`
    setFontFamily(e.target.value)
    applyTextFormatting("fontFamily", newFamily)
  }

  // Handle font size change
  const handleFontSizeChange = (newSize: number) => {
    setFontSize(newSize)
    applyTextFormatting("fontSize", newSize)
  }

  // Handle text color change
  const handleTextColorChange = (color: string) => {
    setTextColor(color)
    applyTextFormatting("color", color)
  }

  // Handle fill color change
  const handleFillColorChange = (color: string) => {
    setFillColor(color)
    applyShapeFormatting("fillColor", color)
  }

  // Toggle text formatting
  const toggleBold = () => {
    const newValue = !isBold
    setIsBold(newValue)
    applyTextFormatting("bold", newValue)
  }

  const toggleItalic = () => {
    const newValue = !isItalic
    setIsItalic(newValue)
    applyTextFormatting("italic", newValue)
  }

  const toggleUnderline = () => {
    const newValue = !isUnderline
    setIsUnderline(newValue)
    applyTextFormatting("underline", newValue)
  }

  // Set text alignment
  const handleTextAlignChange = (align: "left" | "center" | "right" | "justify") => {
    setTextAlign(align)
    applyTextFormatting("alignment", align)
  }

  // Handle grid size change
  const handleGridSizeChange = (newSize: number) => {
    setGridSize(newSize)
  }

  if (!selectedElement) return null

  return (
    <div className="fixed top-[76px] left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-md shadow-md-elevation-2 flex items-center h-12 px-2">
      <div className="flex items-center space-x-2">
        <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100">
          <span className="material-icons text-gray-700">edit</span>
        </button>

        {/* Color picker */}
        <div className="relative">
          <button
            className="w-8 h-8 rounded-full border-2 border-white ring-2 ring-gray-200"
            style={{ backgroundColor: selectedElement.type === "shape" ? fillColor : textColor }}
            onClick={() => setShowMoreOptions(!showMoreOptions)}
          ></button>
          {showMoreOptions && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white rounded-md shadow-md-elevation-2 grid grid-cols-5 gap-1 w-40 z-10">
              {[
                "#4285F4",
                "#EA4335",
                "#FBBC05",
                "#34A853",
                "#FF6D01",
                "#46BDC6",
                "#9C27B0",
                "#6750A4",
                "#000000",
                "#FFFFFF",
              ].map((color) => (
                <button
                  key={color}
                  className="w-6 h-6 rounded-full border border-gray-200"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    if (selectedElement.type === "shape") {
                      handleFillColorChange(color)
                    } else {
                      handleTextColorChange(color)
                    }
                    setShowMoreOptions(false)
                  }}
                ></button>
              ))}
            </div>
          )}
        </div>

        {/* Black/white color shortcuts */}
        <button
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100"
          onClick={() =>
            selectedElement.type === "shape" ? handleFillColorChange("#000000") : handleTextColorChange("#000000")
          }
        >
          <div className="w-5 h-5 rounded-full bg-black"></div>
        </button>
        <button
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100"
          onClick={() =>
            selectedElement.type === "shape" ? handleFillColorChange("#FFFFFF") : handleTextColorChange("#FFFFFF")
          }
        >
          <div className="w-5 h-5 rounded-full bg-white border border-gray-300"></div>
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-200"></div>

        {/* Font controls - only show for text elements or shapes with text */}
        {(selectedElement.type === "text" ||
          (selectedElement.type === "shape" && (selectedElement as ShapeElement).hasText)) && (
          <>
            <select
              className="h-8 px-2 rounded border border-gray-300 text-sm"
              value={fontFamily}
              onChange={handleFontFamilyChange}
            >
              {fontOptions.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>

            <div className="flex items-center">
              <button
                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100"
                onClick={() => handleFontSizeChange(Math.max(8, fontSize - 1))}
              >
                <span className="material-icons text-gray-700">remove</span>
              </button>
              <span className="w-8 text-center text-sm">{fontSize}</span>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100"
                onClick={() => handleFontSizeChange(Math.min(72, fontSize + 1))}
              >
                <span className="material-icons text-gray-700">add</span>
              </button>
            </div>

            <div className="h-8 w-px bg-gray-200"></div>

            {/* Text formatting */}
            <button
              className={`w-8 h-8 flex items-center justify-center rounded-md ${isBold ? "bg-gray-200" : "hover:bg-gray-100"}`}
              onClick={toggleBold}
            >
              <span className="material-icons text-gray-700">format_bold</span>
            </button>
            <button
              className={`w-8 h-8 flex items-center justify-center rounded-md ${isItalic ? "bg-gray-200" : "hover:bg-gray-100"}`}
              onClick={toggleItalic}
            >
              <span className="material-icons text-gray-700">format_italic</span>
            </button>
            <button
              className={`w-8 h-8 flex items-center justify-center rounded-md ${isUnderline ? "bg-gray-200" : "hover:bg-gray-100"}`}
              onClick={toggleUnderline}
            >
              <span className="material-icons text-gray-700">format_underline</span>
            </button>

            <div className="h-8 w-px bg-gray-200"></div>

            {/* Text alignment */}
            <button
              className={`w-8 h-8 flex items-center justify-center rounded-md ${textAlign === "left" ? "bg-gray-200" : "hover:bg-gray-100"}`}
              onClick={() => handleTextAlignChange("left")}
            >
              <span className="material-icons text-gray-700">format_align_left</span>
            </button>
            <button
              className={`w-8 h-8 flex items-center justify-center rounded-md ${textAlign === "center" ? "bg-gray-200" : "hover:bg-gray-100"}`}
              onClick={() => handleTextAlignChange("center")}
            >
              <span className="material-icons text-gray-700">format_align_center</span>
            </button>
            <button
              className={`w-8 h-8 flex items-center justify-center rounded-md ${textAlign === "right" ? "bg-gray-200" : "hover:bg-gray-100"}`}
              onClick={() => handleTextAlignChange("right")}
            >
              <span className="material-icons text-gray-700">format_align_right</span>
            </button>
            <button
              className={`w-8 h-8 flex items-center justify-center rounded-md ${textAlign === "justify" ? "bg-gray-200" : "hover:bg-gray-100"}`}
              onClick={() => handleTextAlignChange("justify")}
            >
              <span className="material-icons text-gray-700">format_align_justify</span>
            </button>
          </>
        )}

        <div className="h-8 w-px bg-gray-200"></div>

        {/* Position button */}
        <button className="px-3 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-sm font-medium">
          Position
        </button>

        {/* Grid controls */}
        <div className="relative">
          <button
            className={`px-3 h-8 flex items-center justify-center rounded-md ${showGrid ? "bg-gray-200" : "hover:bg-gray-100"} text-sm font-medium`}
            onClick={() => setShowGridOptions(!showGridOptions)}
          >
            <span className="material-icons text-gray-700 mr-1 text-sm">grid_on</span>
            Grid
          </button>

          {showGridOptions && (
            <div className="absolute top-full right-0 mt-1 p-3 bg-white rounded-md shadow-md-elevation-2 w-48 z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-700">Show Grid</span>
                <button
                  className={`w-10 h-5 rounded-full relative ${showGrid ? "bg-purple-500" : "bg-gray-300"}`}
                  onClick={onToggleGrid}
                >
                  <div
                    className={`absolute w-4 h-4 rounded-full bg-white top-0.5 transition-all ${showGrid ? "right-0.5" : "left-0.5"}`}
                  ></div>
                </button>
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-700">Snap to Grid</span>
                <button
                  className={`w-10 h-5 rounded-full relative ${snapToGrid ? "bg-purple-500" : "bg-gray-300"}`}
                  onClick={() => setSnapToGrid(!snapToGrid)}
                >
                  <div
                    className={`absolute w-4 h-4 rounded-full bg-white top-0.5 transition-all ${snapToGrid ? "right-0.5" : "left-0.5"}`}
                  ></div>
                </button>
              </div>

              <div className="mb-1">
                <span className="text-sm text-gray-700">Grid Size: {gridSize}px</span>
              </div>
              <div className="flex items-center">
                <button
                  className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-700"
                  onClick={() => handleGridSizeChange(Math.max(4, gridSize - 4))}
                  disabled={gridSize <= 4}
                >
                  <span className="material-icons text-sm">remove</span>
                </button>
                <input
                  type="range"
                  min="4"
                  max="32"
                  step="4"
                  value={gridSize}
                  onChange={(e) => handleGridSizeChange(Number(e.target.value))}
                  className="flex-1 mx-2"
                />
                <button
                  className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-700"
                  onClick={() => handleGridSizeChange(Math.min(32, gridSize + 4))}
                  disabled={gridSize >= 32}
                >
                  <span className="material-icons text-sm">add</span>
                </button>
              </div>
              <div className="mt-2 text-xs text-gray-500">Hold Alt key to temporarily enable snapping</div>
            </div>
          )}
        </div>

        {/* Animate button */}
        <button className="px-3 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-sm font-medium">
          <span className="material-icons text-gray-700 mr-1 text-sm">animation</span>
          Animate
        </button>

        {/* More options */}
        <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100">
          <span className="material-icons text-gray-700">more_horiz</span>
        </button>
      </div>
    </div>
  )
}
