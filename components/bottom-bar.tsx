"use client"

import { useDocument } from "@/context/document-context"
import { useRipple } from "@/hooks/use-ripple"
import { useState, useRef, useEffect } from "react"
import { ZoomIn, ZoomOut, MousePointer, Maximize2, ChevronDown } from "lucide-react"
import { useZoom, ZOOM_PRESETS } from "@/context/zoom-context"

export const BottomBar = () => {
  const { document, currentSlide, changeSlide, addSlide } = useDocument()
  const { createRipple } = useRipple()
  const [isExpanded, setIsExpanded] = useState(false)
  const { scale, zoomIn, zoomOut, resetZoom, fitToView, zoomToPreset, getZoomPercentage } = useZoom()
  const [showZoomPresets, setShowZoomPresets] = useState(false)
  const zoomPresetsRef = useRef<HTMLDivElement>(null)

  // Get current zoom percentage
  const zoomPercentage = getZoomPercentage()

  // Close zoom presets dropdown when clicking outside
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== "undefined") {
      const handleClickOutside = (event: MouseEvent) => {
        if (zoomPresetsRef.current && !zoomPresetsRef.current.contains(event.target as Node)) {
          setShowZoomPresets(false)
        }
      }

      window.addEventListener("mousedown", handleClickOutside)
      return () => {
        window.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [])

  // Get container dimensions for fitToView
  const handleFitToView = () => {
    if (typeof window !== "undefined") {
      const editorContainer = document.querySelector(".slide-editor-container")
      if (editorContainer) {
        const { clientWidth, clientHeight } = editorContainer
        fitToView(clientWidth, clientHeight)
      }
    }
  }

  return (
    <div className="h-20 bg-gray-100 border-t border-gray-200 flex flex-col z-10">
      {/* Thumbnails container */}
      <div className="flex-1 flex items-center justify-center relative">
        <div className="flex items-center h-full px-4 space-x-3 max-w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {document.slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`group relative cursor-pointer transition-all duration-200 ${
                index === document.currentSlideIndex ? "scale-105" : "hover:scale-105"
              }`}
              onClick={() => changeSlide(index)}
            >
              {/* Thumbnail */}
              <div
                className={`w-28 h-16 bg-white rounded-md border flex items-center justify-center overflow-hidden
                  ${index === document.currentSlideIndex ? "border-blue-600 border-2 shadow-md" : "border-gray-300"}`}
              >
                {/* This would show slide content preview - simplified for this example */}
                {slide.elements && slide.elements.length > 0 ? (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                    {/* Placeholder for slide content */}
                    {index === 1 && <div className="w-8 h-8 bg-blue-500 transform rotate-45"></div>}
                  </div>
                ) : (
                  <div className="text-xs text-gray-400">Empty slide</div>
                )}
              </div>

              {/* Slide number indicator */}
              <div className="flex items-center justify-center mt-1">
                <div className="flex items-center">
                  <i className="material-icons text-gray-500 text-xs mr-0.5">slideshow</i>
                  <span className="text-xs text-gray-600 font-medium">{index + 1}</span>
                </div>
              </div>

              {/* Current slide indicator - blue dot */}
              {index === document.currentSlideIndex && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-600"></div>
              )}

              {/* Contextual menu button - only visible on hover or for current slide */}
              <div
                className={`absolute -right-1 -top-1 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center 
                  ${index === document.currentSlideIndex ? "opacity-100" : "opacity-0 group-hover:opacity-100"} 
                  transition-opacity duration-200`}
              >
                <i className="material-icons text-gray-700 text-sm">more_horiz</i>
              </div>
            </div>
          ))}

          {/* Add slide button */}
          <div
            className="w-28 h-16 flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-md bg-white/50 hover:bg-white cursor-pointer transition-colors duration-200"
            onClick={(e) => {
              createRipple(e)
              addSlide()
            }}
          >
            <i className="material-icons text-blue-600 mb-1">add</i>
            <span className="text-xs text-gray-500">New slide</span>
          </div>
        </div>

        {/* Improved Zoom controls - Added to the center of the bottom bar */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-white rounded-full shadow-md px-2 py-1">
          <button
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full"
            onClick={zoomOut}
            aria-label="Zoom out"
          >
            <ZoomOut size={18} />
          </button>

          {/* Zoom percentage with dropdown */}
          <div className="relative" ref={zoomPresetsRef}>
            <button
              className="px-2 py-1 text-center text-xs font-medium min-w-[60px] flex items-center justify-center gap-1 hover:bg-gray-100 rounded-md"
              onClick={() => setShowZoomPresets(!showZoomPresets)}
            >
              <span>{zoomPercentage}%</span>
              <ChevronDown size={12} />
            </button>

            {/* Zoom presets dropdown */}
            {showZoomPresets && (
              <div className="absolute bottom-full mb-2 bg-white rounded-md shadow-md py-1 w-24 z-50">
                {ZOOM_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    className={`w-full text-left px-3 py-1 text-xs hover:bg-gray-100 ${
                      zoomPercentage === preset ? "font-bold bg-gray-50" : ""
                    }`}
                    onClick={() => {
                      zoomToPreset(preset)
                      setShowZoomPresets(false)
                    }}
                  >
                    {preset}%
                  </button>
                ))}
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  className="w-full text-left px-3 py-1 text-xs hover:bg-gray-100"
                  onClick={() => {
                    handleFitToView()
                    setShowZoomPresets(false)
                  }}
                >
                  Fit to view
                </button>
              </div>
            )}
          </div>

          <button
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full"
            onClick={zoomIn}
            aria-label="Zoom in"
          >
            <ZoomIn size={18} />
          </button>

          <div className="h-4 w-px bg-gray-200 mx-1"></div>

          <button
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full"
            onClick={resetZoom}
            aria-label="Reset zoom"
            title="Reset zoom"
          >
            <MousePointer size={16} />
          </button>

          <button
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full"
            onClick={handleFitToView}
            aria-label="Fit to view"
            title="Fit to view"
          >
            <Maximize2 size={16} />
          </button>
        </div>

        {/* Page controls on the right */}
        <div className="absolute right-4 flex items-center space-x-4">
          <div className="flex items-center">
            <span className="text-sm text-gray-600 font-medium">
              {document.currentSlideIndex + 1} / {document.slides.length}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Grid view button */}
            <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 transition-colors">
              <i className="material-icons text-gray-700">grid_view</i>
            </button>

            {/* Fullscreen button */}
            <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 transition-colors">
              <i className="material-icons text-gray-700">fullscreen</i>
            </button>
          </div>
        </div>

        {/* View toggle on the left */}
        <div className="absolute left-4">
          <button
            className="flex items-center space-x-1 px-3 py-1.5 rounded-md hover:bg-gray-200 transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <i className="material-icons text-gray-700 text-sm">{isExpanded ? "expand_more" : "expand_less"}</i>
            <span className="text-xs text-gray-700">{isExpanded ? "Collapse" : "Expand"}</span>
          </button>
        </div>
      </div>

      {/* Timeline or additional controls - can be toggled */}
      {isExpanded && (
        <div className="h-12 bg-gray-50 border-t border-gray-200 flex items-center px-4">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 text-gray-700 text-sm">
              <i className="material-icons text-sm">play_arrow</i>
              <span>Present</span>
            </button>

            <button className="flex items-center space-x-1 text-gray-700 text-sm">
              <i className="material-icons text-sm">timer</i>
              <span>Timer</span>
            </button>

            <button className="flex items-center space-x-1 text-gray-700 text-sm">
              <i className="material-icons text-sm">notes</i>
              <span>Notes</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
