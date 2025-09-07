"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDocument } from "@/context/document-context"
import { useRipple } from "@/hooks/use-ripple"
import type { SlideElement, TextElement, ShapeElement, FontFamily, TextAlignment } from "@/types/document-builder"

interface EditorToolbarProps {
  selectedElement: SlideElement | null
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ selectedElement }) => {
  const { updateElement } = useDocument()
  const { createRipple } = useRipple()

  // Text-specific state
  const [fontSize, setFontSize] = useState(16)
  const [fontFamily, setFontFamily] = useState<FontFamily>("font-roboto")
  const [textColor, setTextColor] = useState("#000000")
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)
  const [textAlignment, setTextAlignment] = useState<TextAlignment>("left")

  // Shape-specific state
  const [fillColor, setFillColor] = useState("#00639D")
  const [borderColor, setBorderColor] = useState("#000000")
  const [borderWidth, setBorderWidth] = useState(1)
  const [opacity, setOpacity] = useState(100)

  // Position state
  const [positionX, setPositionX] = useState(0)
  const [positionY, setPositionY] = useState(0)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [rotation, setRotation] = useState(0)

  // Font list
  const fontOptions = [
    { value: "font-roboto", label: "Roboto" },
    { value: "font-poppins", label: "Poppins" },
    { value: "font-playfair", label: "Playfair" },
    { value: "font-merriweather", label: "Merriweather" },
    { value: "font-montserrat", label: "Montserrat" },
    { value: "font-opensans", label: "Open Sans" },
  ]

  // Color palette
  const colorPalette = [
    "#000000",
    "#FFFFFF",
    "#0061A4",
    "#006C51",
    "#BA1A1A",
    "#6750A4",
    "#00639D",
    "#7D5260",
    "#FF5252",
    "#FFD740",
  ]

  // Update state when selected element changes
  useEffect(() => {
    if (!selectedElement) return

    setPositionX(selectedElement.position.x)
    setPositionY(selectedElement.position.y)
    setWidth(selectedElement.size.width)
    setHeight(selectedElement.size.height)
    setRotation(selectedElement.rotation)

    if (selectedElement.type === "text") {
      const textElement = selectedElement as TextElement
      setFontSize(textElement.fontSize)
      setFontFamily(textElement.fontFamily)
      setTextColor(textElement.color)
      setIsBold(textElement.bold)
      setIsItalic(textElement.italic)
      setIsUnderline(textElement.underline)
      setIsStrikethrough(textElement.strikethrough)
      setTextAlignment(textElement.alignment)
    } else if (selectedElement.type === "shape") {
      const shapeElement = selectedElement as ShapeElement
      setFillColor(shapeElement.fillColor)
      setBorderColor(shapeElement.borderColor)
      setBorderWidth(shapeElement.borderWidth)
      setOpacity(shapeElement.opacity * 100)

      // If shape has text, set text properties
      if (shapeElement.hasText && shapeElement.textProps) {
        setFontSize(shapeElement.textProps.fontSize)
        setFontFamily(shapeElement.textProps.fontFamily)
        setTextColor(shapeElement.textProps.color)
        setIsBold(shapeElement.textProps.bold)
        setIsItalic(shapeElement.textProps.italic)
        setIsUnderline(shapeElement.textProps.underline)
        setIsStrikethrough(shapeElement.textProps.strikethrough)
        setTextAlignment(shapeElement.textProps.alignment)
      }
    }
  }, [selectedElement])

  // Apply text formatting changes
  const applyTextFormatting = (property: keyof TextElement, value: any) => {
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
  const applyShapeFormatting = (property: keyof ShapeElement, value: any) => {
    if (!selectedElement || selectedElement.type !== "shape") return

    const updatedElement = {
      ...selectedElement,
      [property]: value,
    } as ShapeElement

    updateElement(updatedElement)
  }

  // Apply position changes
  const applyPositionChange = () => {
    if (!selectedElement) return

    const updatedElement = {
      ...selectedElement,
      position: { x: positionX, y: positionY },
      size: { width, height },
      rotation,
    }

    updateElement(updatedElement)
  }

  // Handle font size change
  const handleFontSizeChange = (newSize: number) => {
    setFontSize(newSize)
    applyTextFormatting("fontSize", newSize)
  }

  // Handle font family change
  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFamily = e.target.value as FontFamily
    setFontFamily(newFamily)
    applyTextFormatting("fontFamily", newFamily)
  }

  // Handle text color change
  const handleTextColorChange = (color: string) => {
    setTextColor(color)
    applyTextFormatting("color", color)
  }

  // Handle text style toggles
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

  const toggleStrikethrough = () => {
    const newValue = !isStrikethrough
    setIsStrikethrough(newValue)
    applyTextFormatting("strikethrough", newValue)
  }

  // Handle text alignment
  const setAlignment = (alignment: TextAlignment) => {
    setTextAlignment(alignment)
    applyTextFormatting("alignment", alignment)
  }

  // Handle shape fill color change
  const handleFillColorChange = (color: string) => {
    setFillColor(color)
    applyShapeFormatting("fillColor", color)
  }

  // Handle shape border color change
  const handleBorderColorChange = (color: string) => {
    setBorderColor(color)
    applyShapeFormatting("borderColor", color)
  }

  // Handle shape border width change
  const handleBorderWidthChange = (width: number) => {
    setBorderWidth(width)
    applyShapeFormatting("borderWidth", width)
  }

  // Handle shape opacity change
  const handleOpacityChange = (value: number) => {
    setOpacity(value)
    applyShapeFormatting("opacity", value / 100)
  }

  // Handle position input changes
  const handlePositionXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPositionX(Number(e.target.value))
  }

  const handlePositionYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPositionY(Number(e.target.value))
  }

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWidth(Number(e.target.value))
  }

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeight(Number(e.target.value))
  }

  const handleRotationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRotation(Number(e.target.value))
  }

  // Apply position changes when input loses focus
  const handlePositionBlur = () => {
    applyPositionChange()
  }

  // Check if the selected element has text capabilities
  const hasTextCapabilities =
    selectedElement &&
    (selectedElement.type === "text" || (selectedElement.type === "shape" && (selectedElement as ShapeElement).hasText))

  // If no element is selected, don't render the toolbar
  if (!selectedElement) return null

  return (
    <div className="fixed top-16 left-0 right-0 z-20 bg-white shadow-md-elevation-2 border-b border-md-outline-variant transition-transform duration-300 transform translate-y-0">
      <div className="flex items-center h-12 px-2 overflow-x-auto">
        {/* Edit button */}
        <button
          className="flex items-center justify-center h-8 px-3 mr-2 rounded-md-md text-md-on-surface hover:bg-gray-100 transition-colors"
          onClick={(e) => createRipple(e)}
        >
          <i className="material-icons mr-1 text-sm">edit</i>
          <span className="text-sm font-medium">Edit</span>
        </button>

        <div className="h-6 w-px bg-md-outline-variant mx-1"></div>

        {/* Font family dropdown - show for text elements and shapes with text */}
        {hasTextCapabilities && (
          <>
            <select
              className="h-8 px-2 mr-2 rounded-md-md border border-md-outline-variant bg-white text-md-on-surface text-sm"
              value={fontFamily}
              onChange={handleFontFamilyChange}
            >
              {fontOptions.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>

            {/* Font size controls */}
            <div className="flex items-center mr-2">
              <button
                className="flex items-center justify-center w-8 h-8 rounded-l-md-md border border-md-outline-variant text-md-on-surface hover:bg-gray-100 transition-colors"
                onClick={(e) => {
                  createRipple(e)
                  handleFontSizeChange(Math.max(8, fontSize - 1))
                }}
              >
                <i className="material-icons text-sm">remove</i>
              </button>
              <div className="flex items-center justify-center w-10 h-8 border-t border-b border-md-outline-variant text-md-on-surface text-sm">
                {fontSize}
              </div>
              <button
                className="flex\
