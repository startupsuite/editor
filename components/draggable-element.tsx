"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback, memo } from "react"
import { useDocument } from "@/context/document-context"
import type { SlideElement, Position, ShapeElement, TextElement, Size } from "@/types/document-builder"
import { useOptimizedDrag } from "@/hooks/use-optimized-drag"
import { ChartElement } from "./chart-element"

interface DraggableElementProps {
  element: SlideElement
  isSelected: boolean
  onSelect: () => void
  gridSize: number
  snapToGrid: boolean
  canvasRef: React.RefObject<HTMLDivElement>
  scale?: number
}

const DraggableElement: React.FC<DraggableElementProps> = ({
  element,
  isSelected,
  onSelect,
  gridSize,
  snapToGrid,
  canvasRef,
  scale = 1,
}) => {
  const { moveElement, resizeElement, rotateElement, updateElement } = useDocument()

  const [resizing, setResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState<string | null>(null)
  const [rotating, setRotating] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [resizeStart, setResizeStart] = useState<Position | null>(null)
  const [dragStart, setDragStart] = useState<Position | null>(null)
  const [initialPosition, setInitialPosition] = useState<Position>({ x: 0, y: 0 })
  const [initialSize, setInitialSize] = useState<Size>({ width: 0, height: 0 })
  const [rotateStart, setRotateStart] = useState<Position | null>(null)
  const [initialRotation, setInitialRotation] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [aspectRatio, setAspectRatio] = useState(1)
  const [preserveAspectRatio, setPreserveAspectRatio] = useState(false)
  const [initialScale, setInitialScale] = useState(1)
  const [dragPreview, setDragPreview] = useState<string | null>(null)

  const elementRef = useRef<HTMLDivElement>(null)
  const textEditRef = useRef<HTMLDivElement>(null)
  const shapeContentRef = useRef<HTMLDivElement>(null)
  const lastPositionRef = useRef<Position>(element.position)
  const lastUpdateTimeRef = useRef<number>(0)
  const isInitializedRef = useRef(false)

  // Initialize aspect ratio when element changes
  useEffect(() => {
    if (element && !isInitializedRef.current) {
      setAspectRatio(element.size.width / element.size.height)
      lastPositionRef.current = element.position
      isInitializedRef.current = true

      // Calculate initial scale for shapes
      if (element.type === "shape") {
        // Store the initial scale factor based on the element's size
        // This will be used as a reference when resizing
        setInitialScale(Math.min(element.size.width, element.size.height) / 100)
      }
    }
  }, [element])

  // Set up keyboard event listeners for shift key (preserve aspect ratio)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setPreserveAspectRatio(true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setPreserveAspectRatio(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  // Throttle position updates for smoother performance
  const throttledMoveElement = useCallback(
    (elementId: string, position: Position) => {
      const now = Date.now()
      // Only update if it's been at least 16ms (60fps) since the last update
      if (now - lastUpdateTimeRef.current >= 16) {
        moveElement(elementId, position)
        lastUpdateTimeRef.current = now
        lastPositionRef.current = position
      }
    },
    [moveElement],
  )

  // Snap value to grid
  const snapToGridValue = useCallback(
    (value: number): number => {
      if (!snapToGrid) return value
      return Math.round(value / gridSize) * gridSize
    },
    [snapToGrid, gridSize],
  )

  // Handle drag start
  const handleDragStart = useCallback(() => {
    setDragging(true)
    setInitialPosition({ ...element.position })

    // Generate a preview image for the drag operation
    if (elementRef.current) {
      try {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        const rect = elementRef.current.getBoundingClientRect()

        canvas.width = rect.width
        canvas.height = rect.height

        if (ctx) {
          // Apply a semi-transparent effect
          ctx.globalAlpha = 0.7

          // Draw a simplified representation based on element type
          if (element.type === "shape") {
            const shapeElement = element as ShapeElement
            ctx.fillStyle = shapeElement.fillColor

            if (shapeElement.shapeType === "rect") {
              ctx.fillRect(0, 0, rect.width, rect.height)
            } else if (shapeElement.shapeType === "circle") {
              ctx.beginPath()
              ctx.arc(rect.width / 2, rect.height / 2, Math.min(rect.width, rect.height) / 2, 0, 2 * Math.PI)
              ctx.fill()
            }
          } else if (element.type === "text") {
            const textElement = element as TextElement
            ctx.fillStyle = "#f0f0f0"
            ctx.fillRect(0, 0, rect.width, rect.height)

            ctx.fillStyle = textElement.color
            ctx.font = `${textElement.fontSize}px ${textElement.fontFamily.replace("font-", "")}`
            ctx.textAlign = "center"
            ctx.fillText(textElement.content.substring(0, 10), rect.width / 2, rect.height / 2)
          }

          setDragPreview(canvas.toDataURL())
        }
      } catch (error) {
        console.error("Failed to generate drag preview", error)
      }
    }
  }, [element])

  // Handle drag move
  const handleDragMove = useCallback(
    (position: Position) => {
      if (!dragging) return

      let newX = position.x
      let newY = position.y

      // Apply grid snapping if enabled
      if (snapToGrid) {
        newX = snapToGridValue(newX)
        newY = snapToGridValue(newY)
      }

      // Check canvas boundaries if canvasRef is provided
      if (canvasRef.current && elementRef.current) {
        const canvasRect = canvasRef.current.getBoundingClientRect()
        const elementRect = elementRef.current.getBoundingClientRect()

        // Calculate element bounds relative to canvas
        const minX = 0
        const minY = 0
        const maxX = canvasRect.width - element.size.width
        const maxY = canvasRect.height - element.size.height

        // Constrain position within canvas
        newX = Math.max(minX, Math.min(maxX, newX))
        newY = Math.max(minY, Math.min(maxY, newY))
      }

      throttledMoveElement(element.id, { x: newX, y: newY })
    },
    [
      dragging,
      snapToGrid,
      snapToGridValue,
      canvasRef,
      element.id,
      element.size.width,
      element.size.height,
      throttledMoveElement,
    ],
  )

  // Handle drag end
  const handleDragEnd = useCallback(
    (position: Position) => {
      setDragging(false)
      setDragPreview(null)

      let newX = position.x
      let newY = position.y

      // Apply grid snapping if enabled
      if (snapToGrid) {
        newX = snapToGridValue(newX)
        newY = snapToGridValue(newY)
      }

      // Check canvas boundaries if canvasRef is provided
      if (canvasRef.current && elementRef.current) {
        const canvasRect = canvasRef.current.getBoundingClientRect()

        // Calculate element bounds relative to canvas
        const minX = 0
        const minY = 0
        const maxX = canvasRect.width - element.size.width
        const maxY = canvasRect.height - element.size.height

        // Constrain position within canvas
        newX = Math.max(minX, Math.min(maxX, newX))
        newY = Math.max(minY, Math.min(maxY, newY))
      }

      moveElement(element.id, { x: newX, y: newY })
    },
    [snapToGrid, snapToGridValue, canvasRef, element.id, element.size.width, element.size.height, moveElement],
  )

  // Use our optimized drag hook
  const { isDragging, drag, preview } = useOptimizedDrag({
    id: element.id,
    type: "ELEMENT",
    canDrag: !isEditing && !resizing && !rotating,
    initialPosition: element.position,
    initialSize: element.size,
    onDragStart: handleDragStart,
    onDragMove: handleDragMove,
    onDragEnd: handleDragEnd,
  })

  const handleElementClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect()
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect()

    // Start dragging if not resizing or rotating
    if (!isEditing && !resizing && !rotating && e.button === 0) {
      setDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
      setInitialPosition({ ...element.position })
    }
  }

  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation()
    e.preventDefault()
    setResizing(true)
    setResizeDirection(direction)
    setResizeStart({ x: e.clientX, y: e.clientY })
    setInitialSize({ ...element.size })
    setInitialPosition({ ...element.position })

    // For shapes, store the current scale
    if (element.type === "shape") {
      setInitialScale(Math.min(element.size.width, element.size.height) / 100)
    }
  }

  const handleRotateStart = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setRotating(true)
    setRotateStart({ x: e.clientX, y: e.clientY })
    setInitialRotation(element.rotation)
  }

  // Throttle resize updates for smoother performance
  const throttledResizeElement = useCallback(
    (elementId: string, width: number, height: number) => {
      const now = Date.now()
      // Only update if it's been at least 16ms (60fps) since the last update
      if (now - lastUpdateTimeRef.current >= 16) {
        resizeElement(elementId, width, height)
        lastUpdateTimeRef.current = now
      }
    },
    [resizeElement],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (resizing && resizeStart && resizeDirection) {
        const dx = e.clientX - resizeStart.x
        const dy = e.clientY - resizeStart.y

        let newWidth = initialSize.width
        let newHeight = initialSize.height
        let newX = initialPosition.x
        let newY = initialPosition.y

        // Calculate new dimensions based on resize direction
        if (resizeDirection.includes("e")) {
          newWidth = Math.max(20, initialSize.width + dx)
          if (preserveAspectRatio) {
            newHeight = newWidth / aspectRatio
          }
        }
        if (resizeDirection.includes("w")) {
          const widthChange = -dx
          newWidth = Math.max(20, initialSize.width + widthChange)
          newX = initialPosition.x - widthChange

          if (preserveAspectRatio) {
            const oldHeight = newHeight
            newHeight = newWidth / aspectRatio
            const heightChange = newHeight - oldHeight
            newY = initialPosition.y - heightChange / 2
          }
        }
        if (resizeDirection.includes("s")) {
          newHeight = Math.max(20, initialSize.height + dy)
          if (preserveAspectRatio && !resizeDirection.includes("e") && !resizeDirection.includes("w")) {
            newWidth = newHeight * aspectRatio
          }
        }
        if (resizeDirection.includes("n")) {
          const heightChange = -dy
          newHeight = Math.max(20, initialSize.height + heightChange)
          newY = initialPosition.y - heightChange

          if (preserveAspectRatio && !resizeDirection.includes("e") && !resizeDirection.includes("w")) {
            const oldWidth = newWidth
            newWidth = newHeight * aspectRatio
            const widthChange = newWidth - oldWidth
            newX = initialPosition.x - widthChange / 2
          }
        }

        // Apply grid snapping if enabled
        if (snapToGrid) {
          newWidth = snapToGridValue(newWidth)
          newHeight = snapToGridValue(newHeight)
          newX = snapToGridValue(newX)
          newY = snapToGridValue(newY)
        }

        // Update element position and size with throttling
        throttledMoveElement(element.id, { x: newX, y: newY })
        throttledResizeElement(element.id, newWidth, newHeight)

        // For text elements, update font size proportionally
        if (element.type === "text") {
          const textElement = element as TextElement
          const scaleFactor = Math.min(newWidth / initialSize.width, newHeight / initialSize.height)
          const newFontSize = Math.max(8, Math.round(textElement.fontSize * scaleFactor))

          // Only update if there's a significant change to reduce re-renders
          if (Math.abs(newFontSize - textElement.fontSize) > 1) {
            updateElement({
              ...textElement,
              fontSize: newFontSize,
            })
          }
        }
      } else if (rotating && rotateStart && elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        const startAngle = Math.atan2(rotateStart.y - centerY, rotateStart.x - centerX)
        const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX)

        let angleDiff = (currentAngle - startAngle) * (180 / Math.PI)

        // Snap rotation to 15-degree increments if Shift is held
        if (preserveAspectRatio) {
          angleDiff = Math.round(angleDiff / 15) * 15
        }

        const newRotation = (initialRotation + angleDiff) % 360

        // Throttle rotation updates
        const now = Date.now()
        if (now - lastUpdateTimeRef.current >= 16) {
          rotateElement(element.id, newRotation)
          lastUpdateTimeRef.current = now
        }
      } else if (dragging && dragStart) {
        const dx = e.clientX - dragStart.x
        const dy = e.clientY - dragStart.y

        let newX = initialPosition.x + dx
        let newY = initialPosition.y + dy

        // Apply grid snapping if enabled
        if (snapToGrid) {
          newX = snapToGridValue(newX)
          newY = snapToGridValue(newY)
        }

        // Check canvas boundaries if canvasRef is provided
        if (canvasRef.current) {
          const canvasRect = canvasRef.current.getBoundingClientRect()
          const elementRect = elementRef.current?.getBoundingClientRect()

          if (elementRect) {
            // Calculate element bounds relative to canvas
            const minX = 0
            const minY = 0
            const maxX = canvasRect.width - elementRect.width
            const maxY = canvasRect.height - elementRect.height

            // Constrain position within canvas
            newX = Math.max(minX, Math.min(maxX, newX))
            newY = Math.max(minY, Math.min(maxY, newY))
          }
        }

        throttledMoveElement(element.id, { x: newX, y: newY })
      }
    },
    [
      resizing,
      rotating,
      dragging,
      resizeDirection,
      resizeStart,
      dragStart,
      initialSize,
      initialPosition,
      initialRotation,
      preserveAspectRatio,
      aspectRatio,
      snapToGrid,
      snapToGridValue,
      element,
      throttledMoveElement,
      throttledResizeElement,
      updateElement,
      rotateElement,
    ],
  )

  const handleMouseUp = useCallback(() => {
    setResizing(false)
    setResizeDirection(null)
    setRotating(false)
    setDragging(false)
  }, [])

  // Handle double click to edit text
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (element.type === "text" || (element.type === "shape" && (element as ShapeElement).hasText)) {
      setIsEditing(true)
      // Focus will be set in useEffect when isEditing becomes true
    }
  }

  // Handle text edit blur
  const handleTextBlur = () => {
    setIsEditing(false)

    if (textEditRef.current) {
      if (element.type === "text") {
        const textElement = element as TextElement
        updateElement({
          ...textElement,
          content: textEditRef.current.innerText || "Text",
        })
      } else if (element.type === "shape") {
        const shapeElement = element as ShapeElement
        updateElement({
          ...shapeElement,
          text: textEditRef.current.innerText || "Add text",
        })
      }
    }
  }

  // Handle text edit keydown
  const handleTextKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      setIsEditing(false)
      handleTextBlur()
    }
  }

  useEffect(() => {
    if (resizing || rotating || dragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [resizing, rotating, dragging, handleMouseMove, handleMouseUp])

  // Focus text element when editing starts
  useEffect(() => {
    if (isEditing && textEditRef.current) {
      textEditRef.current.focus()

      // Place cursor at the end of the text
      const range = document.createRange()
      const selection = window.getSelection()
      range.selectNodeContents(textEditRef.current)
      range.collapse(false)
      selection?.removeAllRanges()
      selection?.addRange(range)
    }
  }, [isEditing])

  const renderShape = (shapeElement: ShapeElement) => {
    // Calculate scale factor based on current element size
    const scaleFactor = Math.min(element.size.width, element.size.height) / 100

    const shapeContent = (() => {
      switch (shapeElement.shapeType) {
        case "rect":
          return (
            <div
              ref={shapeContentRef}
              className="w-full h-full rounded-md-sm"
              style={{ backgroundColor: shapeElement.fillColor }}
            />
          )
        case "circle":
          return (
            <div
              ref={shapeContentRef}
              className="w-full h-full rounded-full"
              style={{ backgroundColor: shapeElement.fillColor }}
            />
          )
        case "triangle":
          return (
            <div
              ref={shapeContentRef}
              className="w-0 h-0 relative"
              style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  borderLeft: `${element.size.width / 2}px solid transparent`,
                  borderRight: `${element.size.width / 2}px solid transparent`,
                  borderBottom: `${element.size.height}px solid ${shapeElement.fillColor}`,
                  top: 0,
                  left: 0,
                }}
              />
            </div>
          )
        case "line":
          return (
            <div
              ref={shapeContentRef}
              className="w-full"
              style={{
                height: `${Math.max(2, element.size.height / 20)}px`,
                backgroundColor: shapeElement.fillColor,
                marginTop: `${element.size.height / 2 - Math.max(1, element.size.height / 40)}px`,
              }}
            />
          )
        case "arrow-right":
          return (
            <i
              ref={shapeContentRef}
              className="material-icons"
              style={{
                color: shapeElement.fillColor,
                fontSize: `${Math.min(element.size.width, element.size.height) * 0.8}px`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
              }}
            >
              arrow_right_alt
            </i>
          )
        case "arrow-left":
          return (
            <i
              ref={shapeContentRef}
              className="material-icons transform rotate-180"
              style={{
                color: shapeElement.fillColor,
                fontSize: `${Math.min(element.size.width, element.size.height) * 0.8}px`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
              }}
            >
              arrow_right_alt
            </i>
          )
        case "arrow-up":
          return (
            <i
              ref={shapeContentRef}
              className="material-icons transform -rotate-90"
              style={{
                color: shapeElement.fillColor,
                fontSize: `${Math.min(element.size.width, element.size.height) * 0.8}px`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
              }}
            >
              arrow_right_alt
            </i>
          )
        case "arrow-down":
          return (
            <i
              ref={shapeContentRef}
              className="material-icons transform rotate-90"
              style={{
                color: shapeElement.fillColor,
                fontSize: `${Math.min(element.size.width, element.size.height) * 0.8}px`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
              }}
            >
              arrow_right_alt
            </i>
          )
        case "solid-line":
          return (
            <div
              ref={shapeContentRef}
              className="w-full"
              style={{
                height: `${Math.max(2, element.size.height / 20)}px`,
                backgroundColor: shapeElement.fillColor,
                marginTop: `${element.size.height / 2 - Math.max(1, element.size.height / 40)}px`,
              }}
            />
          )
        case "dashed-line":
          return (
            <div
              ref={shapeContentRef}
              className="w-full"
              style={{
                height: `${Math.max(2, element.size.height / 20)}px`,
                borderTop: `${Math.max(2, element.size.height / 20)}px dashed ${shapeElement.fillColor}`,
                marginTop: `${element.size.height / 2 - Math.max(1, element.size.height / 40)}px`,
              }}
            />
          )
        case "dotted-line":
          return (
            <div
              ref={shapeContentRef}
              className="w-full"
              style={{
                height: `${Math.max(2, element.size.height / 20)}px`,
                borderTop: `${Math.max(2, element.size.height / 20)}px dotted ${shapeElement.fillColor}`,
                marginTop: `${element.size.height / 2 - Math.max(1, element.size.height / 40)}px`,
              }}
            />
          )
        case "thick-line":
          return (
            <div
              ref={shapeContentRef}
              className="w-full"
              style={{
                height: `${Math.max(4, element.size.height / 10)}px`,
                backgroundColor: shapeElement.fillColor,
                marginTop: `${element.size.height / 2 - Math.max(2, element.size.height / 20)}px`,
              }}
            />
          )
        default:
          return null
      }
    })()

    // If shape has text, render it on top of the shape
    if (shapeElement.hasText) {
      const textProps = shapeElement.textProps || {
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
      }

      // Scale font size based on element size
      const scaledFontSize = Math.max(8, Math.round((textProps.fontSize * scaleFactor) / initialScale))

      const textStyle: React.CSSProperties = {
        fontFamily: textProps.fontFamily.replace("font-", ""),
        fontSize: `${scaledFontSize}px`,
        fontWeight: textProps.bold ? "bold" : "normal",
        fontStyle: textProps.italic ? "italic" : "normal",
        textDecoration: textProps.underline
          ? textProps.strikethrough
            ? "underline line-through"
            : "underline"
          : textProps.strikethrough
            ? "line-through"
            : "none",
        textAlign: textProps.alignment,
        color: textProps.color,
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent:
          textProps.alignment === "left" ? "flex-start" : textProps.alignment === "right" ? "flex-end" : "center",
        padding: "4px",
        boxSizing: "border-box",
        outline: "none",
        userSelect: isEditing ? "text" : "none",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        overflow: "hidden",
      }

      // Apply text effects
      switch (textProps.effect) {
        case "shadow":
          textStyle.textShadow = `2px 2px 4px rgba(0,0,0,${textProps.effectIntensity / 100})`
          break
        case "outline":
          textStyle.WebkitTextStroke = `${textProps.effectIntensity / 50}px #0061A4`
          textStyle.color = "transparent"
          break
        case "gradient":
          textStyle.background = "linear-gradient(45deg, #0061A4, #00639D)"
          textStyle.WebkitBackgroundClip = "text"
          textStyle.WebkitTextFillColor = "transparent"
          break
        case "glow":
          textStyle.textShadow = `0 0 ${textProps.effectIntensity / 5}px #00639D`
          break
      }

      return (
        <div className="relative w-full h-full">
          {shapeContent}
          <div
            ref={textEditRef}
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={handleTextBlur}
            onKeyDown={handleTextKeyDown}
            style={textStyle}
          >
            {shapeElement.text || "Add text"}
          </div>
        </div>
      )
    }

    return shapeContent
  }

  const renderText = (textElement: TextElement) => {
    // Calculate scale factor based on current element size
    const scaleFactor = Math.min(element.size.width / (textElement.content.length * 10), element.size.height / 50)

    // Scale font size based on element size, but ensure it's not too small
    const scaledFontSize = Math.max(8, textElement.fontSize)

    const textStyle: React.CSSProperties = {
      fontFamily: textElement.fontFamily.replace("font-", ""),
      fontSize: `${scaledFontSize}px`,
      fontWeight: textElement.bold ? "bold" : "normal",
      fontStyle: textElement.italic ? "italic" : "normal",
      textDecoration: textElement.underline
        ? textElement.strikethrough
          ? "underline line-through"
          : "underline"
        : textElement.strikethrough
          ? "line-through"
          : "none",
      textAlign: textElement.alignment,
      color: textElement.color,
      outline: "none",
      userSelect: isEditing ? "text" : "none",
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
      overflow: "hidden",
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent:
        textElement.alignment === "left" ? "flex-start" : textElement.alignment === "right" ? "flex-end" : "center",
    }

    // Apply text effects
    switch (textElement.effect) {
      case "shadow":
        textStyle.textShadow = `2px 2px 4px rgba(0,0,0,${textElement.effectIntensity / 100})`
        break
      case "outline":
        textStyle.WebkitTextStroke = `${textElement.effectIntensity / 50}px #0061A4`
        textStyle.color = "transparent"
        break
      case "gradient":
        textStyle.background = "linear-gradient(45deg, #0061A4, #00639D)"
        textStyle.WebkitBackgroundClip = "text"
        textStyle.WebkitTextFillColor = "transparent"
        break
      case "glow":
        textStyle.textShadow = `0 0 ${textElement.effectIntensity / 5}px #00639D`
        break
    }

    // Add specific styles for quote
    if (textElement.textType === "quote") {
      return (
        <div
          ref={textEditRef}
          contentEditable={isEditing}
          suppressContentEditableWarning={true}
          onBlur={handleTextBlur}
          onKeyDown={handleTextKeyDown}
          className="w-full h-full flex items-center"
          style={{
            borderLeft: "4px solid #0061A4",
            paddingLeft: "12px",
            ...textStyle,
          }}
        >
          {textElement.content}
        </div>
      )
    }

    return (
      <div
        ref={textEditRef}
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
        onBlur={handleTextBlur}
        onKeyDown={handleTextKeyDown}
        className="w-full h-full flex items-center"
        style={textStyle}
      >
        {textElement.content}
      </div>
    )
  }

  // Determine cursor style based on interaction state
  const getCursorStyle = () => {
    if (isEditing) return "cursor-text"
    if (dragging) return "cursor-grabbing"
    return "cursor-grab"
  }

  // Add CSS transition for smoother movement when not actively dragging
  const getTransitionStyle = () => {
    if (dragging || resizing || rotating) return "none"
    return "transform 0.05s ease-out, box-shadow 0.2s ease-in-out"
  }

  // Add drag preview if available
  useEffect(() => {
    if (dragPreview && preview) {
      const img = new Image()
      img.src = dragPreview
      img.onload = () => preview(img)
    }
  }, [dragPreview, preview])

  return (
    <>
      {/* Drag ghost/preview element */}
      {isDragging && dragPreview && (
        <div
          className="fixed pointer-events-none opacity-70 z-50"
          style={{
            left: `${element.position.x}px`,
            top: `${element.position.y}px`,
            width: `${element.size.width}px`,
            height: `${element.size.height}px`,
            backgroundImage: `url(${dragPreview})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            transform: `rotate(${element.rotation}deg)`,
          }}
        />
      )}

      <div
        ref={(node) => {
          drag(node)
          elementRef.current = node
        }}
        className={`absolute ${getCursorStyle()} ${isSelected ? "outline outline-2 outline-purple-500" : ""} ${isDragging ? "opacity-30" : ""}`}
        style={{
          left: `${element.position.x}px`,
          top: `${element.position.y}px`,
          width: `${element.size.width}px`,
          height: `${element.size.height}px`,
          transform: `rotate(${element.rotation}deg)`,
          zIndex: element.zIndex,
          transition: getTransitionStyle(),
          boxShadow: isSelected ? "0 0 0 1px rgba(139, 61, 255, 0.5), 0 0 8px rgba(139, 61, 255, 0.3)" : "none",
          willChange: dragging || resizing || rotating ? "transform, left, top, width, height" : "auto",
        }}
        onClick={handleElementClick}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      >
        {element.type === "shape" && renderShape(element as ShapeElement)}
        {element.type === "text" && renderText(element as TextElement)}
        {element.type === "chart" && <ChartElement element={element as ChartElement} />}

        {isSelected && !isEditing && (
          <>
            {/* Resize handles */}
            <div
              className="absolute top-0 left-0 w-3 h-3 bg-white border-2 border-purple-500 rounded-full cursor-nwse-resize z-10"
              onMouseDown={(e) => handleResizeStart(e, "nw")}
            />
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-purple-500 rounded-full cursor-ns-resize z-10"
              onMouseDown={(e) => handleResizeStart(e, "n")}
            />
            <div
              className="absolute top-0 right-0 w-3 h-3 bg-white border-2 border-purple-500 rounded-full cursor-nesw-resize z-10"
              onMouseDown={(e) => handleResizeStart(e, "ne")}
            />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-purple-500 rounded-full cursor-ew-resize z-10"
              onMouseDown={(e) => handleResizeStart(e, "w")}
            />
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-purple-500 rounded-full cursor-ew-resize z-10"
              onMouseDown={(e) => handleResizeStart(e, "e")}
            />
            <div
              className="absolute bottom-0 left-0 w-3 h-3 bg-white border-2 border-purple-500 rounded-full cursor-nesw-resize z-10"
              onMouseDown={(e) => handleResizeStart(e, "sw")}
            />
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-purple-500 rounded-full cursor-ns-resize z-10"
              onMouseDown={(e) => handleResizeStart(e, "s")}
            />
            <div
              className="absolute bottom-0 right-0 w-3 h-3 bg-white border-2 border-purple-500 rounded-full cursor-nwse-resize z-10"
              onMouseDown={(e) => handleResizeStart(e, "se")}
            />

            {/* Rotation handle */}
            <div
              className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-2 border-purple-500 rounded-full cursor-crosshair z-10"
              onMouseDown={handleRotateStart}
            >
              <div className="absolute top-full left-1/2 w-[1px] h-6 bg-purple-500 -translate-x-1/2"></div>
            </div>

            {/* Size indicator */}
            {(resizing || rotating) && (
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded pointer-events-none z-20">
                {Math.round(element.size.width)} × {Math.round(element.size.height)}
                {rotating && ` | ${Math.round(element.rotation)}°`}
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

// Use React.memo to prevent unnecessary re-renders
export default memo(DraggableElement)
