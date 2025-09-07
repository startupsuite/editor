"use client"

import type React from "react"

import { useRef, useState, useEffect, useCallback, useMemo } from "react"
import { useDocument } from "@/context/document-context"
import { useDrop } from "react-dnd"
import type { Position, ShapeType, TextType, ChartElement } from "@/types/document-builder"
import DraggableElement from "./draggable-element"
import { FloatingToolbar } from "./editor/floating-toolbar"
import { PositionPanel } from "./editor/position-panel"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { ChartPanel } from "./panels/chart-panel"
import { KeyboardShortcutsPanel } from "@/components/keyboard-shortcuts-panel"
import { useZoom } from "@/context/zoom-context"

// Standard slide dimensions
const SLIDE_WIDTH = 720
const SLIDE_HEIGHT = 405

export const Canvas = () => {
  const { currentSlide, addElement, selectedElementId, setSelectedElementId } = useDocument()
  const { scale, setScale, fitToView } = useZoom()
  const canvasRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const slideRef = useRef<HTMLDivElement>(null)
  const [canvasSize] = useState({ width: SLIDE_WIDTH, height: SLIDE_HEIGHT })
  const [showPositionPanel, setShowPositionPanel] = useState(false)
  const [gridSize, setGridSize] = useState(8)
  const [snapToGrid, setSnapToGrid] = useState(false)
  const [showGrid, setShowGrid] = useState(false)
  const [dropIndicator, setDropIndicator] = useState<{ x: number; y: number; visible: boolean }>({
    x: 0,
    y: 0,
    visible: false,
  })
  const [showChartPanel, setShowChartPanel] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [editorSize, setEditorSize] = useState({ width: 0, height: 0 })

  // Create a safe reference to currentSlide that can't be undefined
  const safeCurrentSlide = useMemo(() => {
    return (
      currentSlide || {
        id: "fallback-slide",
        elements: [],
        background: "#FFFFFF",
      }
    )
  }, [currentSlide])

  // Get the selected element
  const selectedElement = safeCurrentSlide.elements.find((element) => element.id === selectedElementId) || null

  // Set up keyboard shortcuts
  useKeyboardShortcuts({
    selectedElementId,
    setShowGrid,
    setSnapToGrid,
    showGrid,
    snapToGrid,
  })

  // Update editor size on window resize
  useEffect(() => {
    const updateEditorSize = () => {
      if (!editorRef.current) return

      const rect = editorRef.current.getBoundingClientRect()
      setEditorSize({
        width: rect.width,
        height: rect.height,
      })
    }

    // Initial update
    updateEditorSize()

    // Auto-fit the slide to the editor on initial load
    if (editorSize.width > 0 && editorSize.height > 0) {
      fitToView(editorSize.width, editorSize.height)
    }

    // Add resize listener
    if (typeof window !== "undefined") {
      window.addEventListener("resize", updateEditorSize)
      return () => window.removeEventListener("resize", updateEditorSize)
    }
  }, [editorSize.width, editorSize.height, fitToView])

  // Set up keyboard event listeners for grid snapping
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleKeyDown = (e: KeyboardEvent) => {
        // Toggle grid snapping with Alt key
        if (e.key === "Alt") {
          setSnapToGrid(true)
        }
      }

      const handleKeyUp = (e: KeyboardEvent) => {
        if (e.key === "Alt") {
          setSnapToGrid(false)
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      window.addEventListener("keyup", handleKeyUp)

      return () => {
        window.removeEventListener("keydown", handleKeyDown)
        window.removeEventListener("keyup", handleKeyUp)
      }
    }
  }, [])

  // Handle zoom with mouse wheel
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()

        // Calculate new scale with smoother increments
        const delta = e.deltaY > 0 ? 0.95 : 1.05
        const newScale = Math.max(0.25, Math.min(2.5, scale * delta))

        setScale(newScale)
      }
    },
    [scale, setScale],
  )

  // Handle editor background drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only allow dragging when clicking directly on the editor background
    if (e.target !== e.currentTarget) return

    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })

    // Prevent text selection during drag
    e.preventDefault()
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return

      const dx = e.clientX - dragStart.x
      const dy = e.clientY - dragStart.y

      setDragStart({ x: e.clientX, y: e.clientY })

      // Handle drag logic if needed
    },
    [isDragging, dragStart],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Add event listeners for mouse up even outside the component
  useEffect(() => {
    if (isDragging && typeof window !== "undefined") {
      const handleGlobalMouseUp = () => {
        setIsDragging(false)
      }

      window.addEventListener("mouseup", handleGlobalMouseUp)
      return () => {
        window.removeEventListener("mouseup", handleGlobalMouseUp)
      }
    }
  }, [isDragging])

  // Snap position to grid
  const snapToGridPosition = useCallback(
    (position: Position): Position => {
      if (!snapToGrid) return position
      return {
        x: Math.round(position.x / gridSize) * gridSize,
        y: Math.round(position.y / gridSize) * gridSize,
      }
    },
    [snapToGrid, gridSize],
  )

  // Handle hover over drop target
  const handleHover = useCallback(
    (monitor: any) => {
      if (!canvasRef.current || !slideRef.current) return

      const slideRect = slideRef.current.getBoundingClientRect()
      const clientOffset = monitor.getClientOffset()

      if (clientOffset) {
        // Calculate position relative to the slide
        const x = (clientOffset.x - slideRect.left) / scale
        const y = (clientOffset.y - slideRect.top) / scale

        // Apply grid snapping if enabled
        const snappedPosition = snapToGridPosition({ x, y })

        setDropIndicator({
          x: snappedPosition.x,
          y: snappedPosition.y,
          visible: true,
        })
      }
    },
    [snapToGridPosition, scale],
  )

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ["SHAPE", "TEXT"],
      drop: (item: { shapeType?: ShapeType; textType?: TextType }, monitor) => {
        if (!canvasRef.current || !slideRef.current) return

        const slideRect = slideRef.current.getBoundingClientRect()
        const dropPosition = monitor.getClientOffset()

        if (!dropPosition) return

        // Calculate position relative to the slide
        let position: Position = {
          x: (dropPosition.x - slideRect.left) / scale,
          y: (dropPosition.y - slideRect.top) / scale,
        }

        // Apply grid snapping if enabled
        position = snapToGridPosition(position)

        if (item.shapeType) {
          addElement({
            type: "shape",
            shapeType: item.shapeType,
            position,
            size: { width: 100, height: 100 },
            rotation: 0,
            zIndex: 1,
            fillColor: "#00639D",
            borderColor: "#000000",
            borderWidth: 1,
            borderStyle: "solid",
            opacity: 1,
            hasText: false,
          })
        } else if (item.textType) {
          let fontSize = 16
          let content = "Text"

          switch (item.textType) {
            case "heading1":
              fontSize = 32
              content = "Heading 1"
              break
            case "heading2":
              fontSize = 28
              content = "Heading 2"
              break
            case "heading3":
              fontSize = 24
              content = "Heading 3"
              break
            case "subtitle":
              fontSize = 18
              content = "Subtitle text"
              break
            case "body":
              fontSize = 16
              content = "Body text"
              break
            case "quote":
              fontSize = 18
              content = "Quote"
              break
          }

          addElement({
            type: "text",
            textType: item.textType,
            content,
            position,
            size: { width: 300, height: 50 },
            rotation: 0,
            zIndex: 1,
            fontFamily: "font-roboto",
            fontSize,
            color: "#000000",
            bold: item.textType.includes("heading"),
            italic: item.textType === "subtitle" || item.textType === "quote",
            underline: false,
            strikethrough: false,
            alignment: "left",
            effect: "none",
            effectIntensity: 50,
          })
        }

        // Hide drop indicator after drop
        setDropIndicator((prev) => ({ ...prev, visible: false }))
      },
      hover: handleHover,
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [addElement, snapToGridPosition, handleHover, scale],
  )

  // Hide drop indicator when not hovering
  useEffect(() => {
    if (!isOver && dropIndicator.visible) {
      setDropIndicator((prev) => ({ ...prev, visible: false }))
    }
  }, [isOver, dropIndicator.visible])

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only deselect if clicking directly on the canvas, not on an element
    if (e.currentTarget === e.target) {
      setSelectedElementId(null)
      setShowPositionPanel(false)
    }
  }

  // Toggle grid visibility
  const toggleGrid = useCallback(() => {
    setShowGrid((prev) => !prev)
  }, [])

  // Render grid lines
  const renderGrid = () => {
    if (!showGrid) return null

    const horizontalLines = []
    const verticalLines = []

    for (let i = 0; i <= canvasSize.width; i += gridSize) {
      verticalLines.push(
        <div key={`v-${i}`} className="absolute top-0 bottom-0 w-[1px] bg-gray-200" style={{ left: `${i}px` }} />,
      )
    }

    for (let i = 0; i <= canvasSize.height; i += gridSize) {
      horizontalLines.push(
        <div key={`h-${i}`} className="absolute left-0 right-0 h-[1px] bg-gray-200" style={{ top: `${i}px` }} />,
      )
    }

    return (
      <>
        {horizontalLines}
        {verticalLines}
      </>
    )
  }

  // Memoize elements to prevent unnecessary re-renders
  const memoizedElements = useMemo(() => {
    return safeCurrentSlide.elements.map((element) => (
      <DraggableElement
        key={element.id}
        element={element}
        isSelected={element.id === selectedElementId}
        onSelect={() => {
          setSelectedElementId(element.id)
          setShowPositionPanel(true)
        }}
        gridSize={gridSize}
        snapToGrid={snapToGrid}
        canvasRef={canvasRef}
        scale={scale}
      />
    ))
  }, [safeCurrentSlide.elements, selectedElementId, gridSize, snapToGrid, setSelectedElementId, scale])

  useEffect(() => {
    if (selectedElement?.type === "chart") {
      setShowChartPanel(true)
    } else {
      setShowChartPanel(false)
    }
  }, [selectedElement])

  return (
    <>
      {/* Floating Toolbar */}
      <FloatingToolbar
        selectedElement={selectedElement}
        onToggleGrid={toggleGrid}
        showGrid={showGrid}
        snapToGrid={snapToGrid}
        setSnapToGrid={setSnapToGrid}
        gridSize={gridSize}
        setGridSize={setGridSize}
      />

      {/* Position Panel */}
      <PositionPanel
        selectedElement={selectedElement}
        isOpen={showPositionPanel}
        onClose={() => setShowPositionPanel(false)}
      />

      {/* Chart Panel */}
      <ChartPanel
        isOpen={showChartPanel}
        onClose={() => setShowChartPanel(false)}
        selectedElement={selectedElement?.type === "chart" ? (selectedElement as ChartElement) : null}
      />

      {/* Main Editor Container */}
      <div className="slide-editor-container" ref={editorRef} onWheel={handleWheel} data-testid="slide-editor">
        <div
          className="editor-background"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Slide Container */}
          <div
            ref={(node) => {
              drop(node)
              slideRef.current = node
            }}
            className="slide-container"
            style={{
              width: `${canvasSize.width * scale}px`,
              height: `${canvasSize.height * scale}px`,
              backgroundColor: safeCurrentSlide.background,
              boxShadow: "0 6px 10px 4px rgba(0, 0, 0, 0.15), 0 2px 3px rgba(0, 0, 0, 0.3)",
              borderRadius: "12px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Slide Content */}
            <div
              ref={canvasRef}
              className="slide-content"
              style={{
                width: `${canvasSize.width}px`,
                height: `${canvasSize.height}px`,
                transform: `scale(${scale})`,
                transformOrigin: "0 0",
                position: "absolute",
                top: 0,
                left: 0,
              }}
              onClick={handleCanvasClick}
              data-testid="slide-canvas"
            >
              {/* Grid lines */}
              {renderGrid()}

              {/* Drop indicator */}
              {dropIndicator.visible && (
                <div
                  className="absolute w-6 h-6 rounded-full border-2 border-purple-500 bg-purple-200 bg-opacity-50 pointer-events-none z-20 transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${dropIndicator.x}px`, top: `${dropIndicator.y}px` }}
                />
              )}

              {/* Snap indicator */}
              {snapToGrid && (
                <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded pointer-events-none z-20">
                  Snap to Grid ({gridSize}px)
                </div>
              )}

              {/* Drop area indicator */}
              {isOver && canDrop && (
                <div className="absolute inset-0 border-2 border-dashed border-purple-400 bg-purple-100 bg-opacity-10 pointer-events-none z-10"></div>
              )}

              {/* Show elements or empty state message */}
              {safeCurrentSlide.elements.length > 0 ? (
                memoizedElements
              ) : (
                <div className="slide-empty-state">Click Elements or Text to add content</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard shortcuts help */}
      <KeyboardShortcutsPanel />
    </>
  )
}
