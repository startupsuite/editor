"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useMemo } from "react"
import type { Document, Slide, SlideElement, Position, TextElement, ShapeElement } from "@/types/document-builder"
import { v4 as uuidv4 } from "uuid"

interface DocumentContextProps {
  document: Document
  currentSlide: Slide
  selectedElementId: string | null
  setSelectedElementId: (id: string | null) => void
  addSlide: () => void
  removeSlide: (id: string) => void
  reorderSlides: (sourceIndex: number, destinationIndex: number) => void
  updateSlideBackground: (slideId: string, background: string) => void
  addElement: (element: Omit<SlideElement, "id">) => void
  updateElement: (element: SlideElement) => void
  removeElement: (elementId: string) => void
  duplicateElement: (elementId: string) => void
  moveElement: (elementId: string, position: Position) => void
  resizeElement: (elementId: string, width: number, height: number) => void
  rotateElement: (elementId: string, rotation: number) => void
  changeSlide: (index: number) => void
  updateDocumentTitle: (title: string) => void
}

const defaultDocument: Document = {
  id: uuidv4(),
  title: "Untitled Presentation",
  slides: [
    {
      id: uuidv4(),
      elements: [],
      background: "#FFFFFF",
    },
  ],
  currentSlideIndex: 0,
}

const DocumentContext = createContext<DocumentContextProps | undefined>(undefined)

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [document, setDocument] = useState<Document>(defaultDocument)
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)

  // Get the current slide safely with a useMemo to prevent unnecessary recalculations
  const currentSlide = useMemo(() => {
    if (
      document &&
      document.slides &&
      Array.isArray(document.slides) &&
      document.slides.length > 0 &&
      typeof document.currentSlideIndex === "number" &&
      document.currentSlideIndex >= 0 &&
      document.currentSlideIndex < document.slides.length
    ) {
      return document.slides[document.currentSlideIndex]
    }

    // Return a default slide if the current slide is invalid
    return {
      id: "default-slide",
      elements: [],
      background: "#FFFFFF",
    }
  }, [document])

  // Save document to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("document", JSON.stringify(document))
    } catch (error) {
      console.error("Failed to save document to localStorage:", error)
    }
  }, [document])

  // Load document from localStorage on initial render
  useEffect(() => {
    try {
      // Create a default document
      const defaultDoc = {
        id: uuidv4(),
        title: "Untitled Presentation",
        slides: [
          {
            id: uuidv4(),
            elements: [],
            background: "#FFFFFF",
          },
        ],
        currentSlideIndex: 0,
      }

      // Set the default document first to ensure we have something valid
      setDocument(defaultDoc)

      // Try to load from localStorage
      const savedDocument = localStorage.getItem("document")
      if (savedDocument) {
        try {
          const parsedDoc = JSON.parse(savedDocument)

          // Validate the document structure
          if (
            parsedDoc &&
            parsedDoc.slides &&
            Array.isArray(parsedDoc.slides) &&
            parsedDoc.slides.length > 0 &&
            typeof parsedDoc.currentSlideIndex === "number" &&
            parsedDoc.currentSlideIndex >= 0 &&
            parsedDoc.currentSlideIndex < parsedDoc.slides.length
          ) {
            setDocument(parsedDoc)
            console.log("Loaded document from localStorage")
          } else {
            console.warn("Invalid document in localStorage, using default")
            localStorage.setItem("document", JSON.stringify(defaultDoc))
          }
        } catch (error) {
          console.error("Failed to parse document from localStorage:", error)
          localStorage.setItem("document", JSON.stringify(defaultDoc))
        }
      } else {
        // No document in localStorage, use default
        localStorage.setItem("document", JSON.stringify(defaultDoc))
      }
    } catch (error) {
      console.error("Error initializing document:", error)
    }
  }, [])

  const addSlide = () => {
    const newSlide: Slide = {
      id: uuidv4(),
      elements: [],
      background: "#FFFFFF",
    }

    setDocument((prev) => ({
      ...prev,
      slides: [...prev.slides, newSlide],
      currentSlideIndex: prev.slides.length,
    }))
  }

  const removeSlide = (id: string) => {
    if (document.slides.length <= 1) return

    const slideIndex = document.slides.findIndex((slide) => slide.id === id)
    if (slideIndex === -1) return

    const newSlides = document.slides.filter((slide) => slide.id !== id)
    const newCurrentIndex = Math.min(document.currentSlideIndex, newSlides.length - 1)

    setDocument((prev) => ({
      ...prev,
      slides: newSlides,
      currentSlideIndex: newCurrentIndex,
    }))
  }

  const reorderSlides = (sourceIndex: number, destinationIndex: number) => {
    const newSlides = [...document.slides]
    const [removed] = newSlides.splice(sourceIndex, 1)
    newSlides.splice(destinationIndex, 0, removed)

    let newCurrentIndex = document.currentSlideIndex
    if (document.currentSlideIndex === sourceIndex) {
      newCurrentIndex = destinationIndex
    } else if (document.currentSlideIndex > sourceIndex && document.currentSlideIndex <= destinationIndex) {
      newCurrentIndex--
    } else if (document.currentSlideIndex < sourceIndex && document.currentSlideIndex >= destinationIndex) {
      newCurrentIndex++
    }

    setDocument((prev) => ({
      ...prev,
      slides: newSlides,
      currentSlideIndex: newCurrentIndex,
    }))
  }

  const updateSlideBackground = (slideId: string, background: string) => {
    setDocument((prev) => ({
      ...prev,
      slides: prev.slides.map((slide) => (slide.id === slideId ? { ...slide, background } : slide)),
    }))
  }

  const addElement = (element: Omit<SlideElement, "id">) => {
    // Ensure we have a valid current slide
    if (!currentSlide) return

    const newElement = {
      ...element,
      id: uuidv4(),
      zIndex: Math.max(0, ...currentSlide.elements.map((el) => el.zIndex)) + 1,
    } as SlideElement

    setDocument((prev) => ({
      ...prev,
      slides: prev.slides.map((slide, index) =>
        index === prev.currentSlideIndex ? { ...slide, elements: [...slide.elements, newElement] } : slide,
      ),
    }))

    setSelectedElementId(newElement.id)
  }

  const updateElement = (element: SlideElement) => {
    setDocument((prev) => ({
      ...prev,
      slides: prev.slides.map((slide, index) =>
        index === prev.currentSlideIndex
          ? {
              ...slide,
              elements: slide.elements.map((el) => (el.id === element.id ? element : el)),
            }
          : slide,
      ),
    }))
  }

  const removeElement = (elementId: string) => {
    setDocument((prev) => ({
      ...prev,
      slides: prev.slides.map((slide, index) =>
        index === prev.currentSlideIndex
          ? {
              ...slide,
              elements: slide.elements.filter((el) => el.id !== elementId),
            }
          : slide,
      ),
    }))

    if (selectedElementId === elementId) {
      setSelectedElementId(null)
    }
  }

  const duplicateElement = (elementId: string) => {
    const element = currentSlide.elements.find((el) => el.id === elementId)
    if (!element) return

    const newElement = {
      ...element,
      id: uuidv4(),
      position: {
        x: element.position.x + 20,
        y: element.position.y + 20,
      },
      zIndex: Math.max(0, ...currentSlide.elements.map((el) => el.zIndex)) + 1,
    }

    setDocument((prev) => ({
      ...prev,
      slides: prev.slides.map((slide, index) =>
        index === prev.currentSlideIndex ? { ...slide, elements: [...slide.elements, newElement] } : slide,
      ),
    }))

    setSelectedElementId(newElement.id)
  }

  const moveElement = (elementId: string, position: Position) => {
    setDocument((prev) => ({
      ...prev,
      slides: prev.slides.map((slide, index) =>
        index === prev.currentSlideIndex
          ? {
              ...slide,
              elements: slide.elements.map((el) => (el.id === elementId ? { ...el, position } : el)),
            }
          : slide,
      ),
    }))
  }

  const resizeElement = (elementId: string, width: number, height: number) => {
    setDocument((prev) => {
      const currentElement = prev.slides[prev.currentSlideIndex]?.elements.find((el) => el.id === elementId)

      if (!currentElement) return prev

      // Calculate scale factor based on size change
      const oldSize = currentElement.size
      const scaleFactor = Math.min(width / oldSize.width, height / oldSize.height)

      return {
        ...prev,
        slides: prev.slides.map((slide, index) =>
          index === prev.currentSlideIndex
            ? {
                ...slide,
                elements: slide.elements.map((el) => {
                  if (el.id !== elementId) return el

                  // Update size for all elements
                  const updatedElement = { ...el, size: { width, height } }

                  // For text elements, scale the font size proportionally
                  if (el.type === "text") {
                    const textElement = el as TextElement
                    // Only update font size if it's a significant change
                    if (Math.abs(scaleFactor - 1) > 0.05) {
                      const newFontSize = Math.max(8, Math.round(textElement.fontSize * scaleFactor))
                      ;(updatedElement as TextElement).fontSize = newFontSize
                    }
                  }

                  // For shapes with text, scale the text properties
                  if (el.type === "shape") {
                    const shapeElement = el as ShapeElement
                    if (shapeElement.hasText && shapeElement.textProps) {
                      // Only update font size if it's a significant change
                      if (Math.abs(scaleFactor - 1) > 0.05) {
                        const newFontSize = Math.max(8, Math.round(shapeElement.textProps.fontSize * scaleFactor))
                        ;(updatedElement as ShapeElement).textProps = {
                          ...shapeElement.textProps,
                          fontSize: newFontSize,
                        }
                      }
                    }
                  }

                  return updatedElement
                }),
              }
            : slide,
        ),
      }
    })
  }

  const rotateElement = (elementId: string, rotation: number) => {
    setDocument((prev) => ({
      ...prev,
      slides: prev.slides.map((slide, index) =>
        index === prev.currentSlideIndex
          ? {
              ...slide,
              elements: slide.elements.map((el) => (el.id === elementId ? { ...el, rotation } : el)),
            }
          : slide,
      ),
    }))
  }

  const changeSlide = (index: number) => {
    if (index >= 0 && index < document.slides.length) {
      setDocument((prev) => ({
        ...prev,
        currentSlideIndex: index,
      }))
      setSelectedElementId(null)
    }
  }

  const updateDocumentTitle = (title: string) => {
    setDocument((prev) => ({
      ...prev,
      title,
    }))
  }

  return (
    <DocumentContext.Provider
      value={{
        document,
        currentSlide,
        selectedElementId,
        setSelectedElementId,
        addSlide,
        removeSlide,
        reorderSlides,
        updateSlideBackground,
        addElement,
        updateElement,
        removeElement,
        duplicateElement,
        moveElement,
        resizeElement,
        rotateElement,
        changeSlide,
        updateDocumentTitle,
      }}
    >
      {children}
    </DocumentContext.Provider>
  )
}

export const useDocument = () => {
  const context = useContext(DocumentContext)
  if (context === undefined) {
    throw new Error("useDocument must be used within a DocumentProvider")
  }
  return context
}
