"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDocument } from "@/context/document-context"
import type { SlideElement, TextElement } from "@/types/document-builder"

interface PositionPanelProps {
  selectedElement: SlideElement | null
  isOpen: boolean
  onClose: () => void
}

export const PositionPanel: React.FC<PositionPanelProps> = ({ selectedElement, isOpen, onClose }) => {
  const { updateElement, currentSlide } = useDocument()
  const [activeTab, setActiveTab] = useState<"arrange" | "layers">("arrange")
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const [rotation, setRotation] = useState(0)
  const [aspectRatioLocked, setAspectRatioLocked] = useState(false)
  const [aspectRatio, setAspectRatio] = useState(1)

  // Update state when selected element changes
  useEffect(() => {
    if (!selectedElement) return

    setWidth(selectedElement.size.width)
    setHeight(selectedElement.size.height)
    setX(selectedElement.position.x)
    setY(selectedElement.position.y)
    setRotation(selectedElement.rotation)
    setAspectRatio(selectedElement.size.width / selectedElement.size.height)
  }, [selectedElement])

  // Apply position changes
  const applyPositionChange = () => {
    if (!selectedElement) return

    const updatedElement = {
      ...selectedElement,
      position: { x, y },
      size: { width, height },
      rotation,
    }

    updateElement(updatedElement)
  }

  // Handle width change
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = Number(e.target.value)
    setWidth(newWidth)

    if (aspectRatioLocked) {
      setHeight(Math.round(newWidth / aspectRatio))
    }
  }

  // Handle height change
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = Number(e.target.value)
    setHeight(newHeight)

    if (aspectRatioLocked) {
      setWidth(Math.round(newHeight * aspectRatio))
    }
  }

  // Handle X position change
  const handleXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setX(Number(e.target.value))
  }

  // Handle Y position change
  const handleYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setY(Number(e.target.value))
  }

  // Handle rotation change
  const handleRotationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRotation(Number(e.target.value))
  }

  // Apply changes on blur
  const handleBlur = () => {
    applyPositionChange()
  }

  // Move element to front
  const moveToFront = () => {
    if (!selectedElement) return

    const maxZIndex = Math.max(0, ...currentSlide.elements.map((el) => el.zIndex))
    const updatedElement = {
      ...selectedElement,
      zIndex: maxZIndex + 1,
    }

    updateElement(updatedElement)
  }

  // Move element to back
  const moveToBack = () => {
    if (!selectedElement) return

    const minZIndex = Math.min(...currentSlide.elements.map((el) => el.zIndex))
    const updatedElement = {
      ...selectedElement,
      zIndex: minZIndex - 1,
    }

    updateElement(updatedElement)
  }

  // Move element forward
  const moveForward = () => {
    if (!selectedElement) return

    const updatedElement = {
      ...selectedElement,
      zIndex: selectedElement.zIndex + 1,
    }

    updateElement(updatedElement)
  }

  // Move element backward
  const moveBackward = () => {
    if (!selectedElement) return

    const updatedElement = {
      ...selectedElement,
      zIndex: Math.max(0, selectedElement.zIndex - 1),
    }

    updateElement(updatedElement)
  }

  // Align element
  const alignElement = (position: string) => {
    if (!selectedElement) return

    let newX = selectedElement.position.x
    let newY = selectedElement.position.y

    // Get canvas dimensions
    const canvasWidth = 720 // Default canvas width
    const canvasHeight = 405 // Default canvas height

    switch (position) {
      case "top":
        newY = 0
        break
      case "middle":
        newY = (canvasHeight - selectedElement.size.height) / 2
        break
      case "bottom":
        newY = canvasHeight - selectedElement.size.height
        break
      case "left":
        newX = 0
        break
      case "center":
        newX = (canvasWidth - selectedElement.size.width) / 2
        break
      case "right":
        newX = canvasWidth - selectedElement.size.width
        break
    }

    setX(newX)
    setY(newY)

    const updatedElement = {
      ...selectedElement,
      position: { x: newX, y: newY },
    }

    updateElement(updatedElement)
  }

  if (!isOpen) return null

  return (
    <div className="fixed top-16 left-0 w-72 h-[calc(100vh-64px)] bg-white shadow-md-elevation-2 z-40 overflow-y-auto">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium">Position</h2>
        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100" onClick={onClose}>
          <span className="material-icons">close</span>
        </button>
      </div>

      <div className="p-4">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            className={`flex-1 py-2 text-sm font-medium ${activeTab === "arrange" ? "text-canva-purple border-b-2 border-canva-purple" : "text-gray-600"}`}
            onClick={() => setActiveTab("arrange")}
          >
            Arrange
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium ${activeTab === "layers" ? "text-canva-purple border-b-2 border-canva-purple" : "text-gray-600"}`}
            onClick={() => setActiveTab("layers")}
          >
            Layers
          </button>
        </div>

        {activeTab === "arrange" && (
          <div>
            {/* Forward/Backward */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                onClick={moveForward}
              >
                <span className="material-icons text-gray-600 mr-2 text-sm">arrow_upward</span>
                Forward
              </button>
              <button
                className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                onClick={moveBackward}
              >
                <span className="material-icons text-gray-600 mr-2 text-sm">arrow_downward</span>
                Backward
              </button>
            </div>

            {/* To Front/To Back */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              <button
                className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                onClick={moveToFront}
              >
                <span className="material-icons text-gray-600 mr-2 text-sm">vertical_align_top</span>
                To front
              </button>
              <button
                className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                onClick={moveToBack}
              >
                <span className="material-icons text-gray-600 mr-2 text-sm">vertical_align_bottom</span>
                To back
              </button>
            </div>

            {/* Align to page */}
            <h3 className="text-sm font-medium text-gray-700 mb-2">Align to page</h3>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                onClick={() => alignElement("top")}
              >
                <span className="material-icons text-gray-600 mr-2 text-sm">align_vertical_top</span>
                Top
              </button>
              <button
                className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                onClick={() => alignElement("left")}
              >
                <span className="material-icons text-gray-600 mr-2 text-sm">align_horizontal_left</span>
                Left
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                onClick={() => alignElement("middle")}
              >
                <span className="material-icons text-gray-600 mr-2 text-sm">align_vertical_center</span>
                Middle
              </button>
              <button
                className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                onClick={() => alignElement("center")}
              >
                <span className="material-icons text-gray-600 mr-2 text-sm">align_horizontal_center</span>
                Center
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-6">
              <button
                className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                onClick={() => alignElement("bottom")}
              >
                <span className="material-icons text-gray-600 mr-2 text-sm">align_vertical_bottom</span>
                Bottom
              </button>
              <button
                className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                onClick={() => alignElement("right")}
              >
                <span className="material-icons text-gray-600 mr-2 text-sm">align_horizontal_right</span>
                Right
              </button>
            </div>

            {/* Advanced */}
            <h3 className="text-sm font-medium text-gray-700 mb-4">Advanced</h3>

            {/* Width/Height */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Width</label>
                <input
                  type="number"
                  value={width}
                  onChange={handleWidthChange}
                  onBlur={handleBlur}
                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Height</label>
                <input
                  type="number"
                  value={height}
                  onChange={handleHeightChange}
                  onBlur={handleBlur}
                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>

            {/* Ratio lock */}
            <div className="mb-4">
              <label className="block text-xs text-gray-500 mb-1">Ratio</label>
              <div className="relative">
                <input
                  type="text"
                  value={`${(aspectRatio).toFixed(2)}`}
                  readOnly
                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                />
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setAspectRatioLocked(!aspectRatioLocked)}
                >
                  <span className="material-icons text-gray-500 text-sm">
                    {aspectRatioLocked ? "lock" : "lock_open"}
                  </span>
                </button>
              </div>
            </div>

            {/* X/Y Position */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">X</label>
                <input
                  type="number"
                  value={x}
                  onChange={handleXChange}
                  onBlur={handleBlur}
                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Y</label>
                <input
                  type="number"
                  value={y}
                  onChange={handleYChange}
                  onBlur={handleBlur}
                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>

            {/* Rotation */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Rotate</label>
              <div className="flex">
                <input
                  type="number"
                  value={rotation}
                  onChange={handleRotationChange}
                  onBlur={handleBlur}
                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                />
                <span className="ml-2 text-sm flex items-center">°</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "layers" && (
          <div>
            <p className="text-sm text-gray-500 mb-4">Manage layers and their visibility</p>

            {/* Layer list */}
            <div className="space-y-2">
              {currentSlide.elements.map((element, index) => (
                <div
                  key={element.id}
                  className={`flex items-center p-2 rounded-md ${element.id === selectedElement?.id ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"}`}
                >
                  <span className="material-icons text-gray-500 mr-2 text-sm">
                    {element.type === "shape" ? "category" : element.type === "text" ? "text_fields" : "image"}
                  </span>
                  <span className="text-sm flex-1 truncate">
                    {element.type === "text"
                      ? (element as TextElement).content.substring(0, 20)
                      : `${element.type} ${index + 1}`}
                  </span>
                  <span className="material-icons text-gray-500 text-sm">visibility</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
