"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { useDrag } from "react-dnd"
import type { Position, Size } from "@/types/document-builder"

interface OptimizedDragOptions {
  id: string
  type: string
  canDrag: boolean
  initialPosition: Position
  initialSize: Size
  onDragStart?: () => void
  onDragEnd?: (position: Position) => void
  onDragMove?: (position: Position) => void
}

export function useOptimizedDrag({
  id,
  type,
  canDrag,
  initialPosition,
  initialSize,
  onDragStart,
  onDragEnd,
  onDragMove,
}: OptimizedDragOptions) {
  const [dragOffset, setDragOffset] = useState<Position | null>(null)
  const positionRef = useRef(initialPosition)
  const requestRef = useRef<number | null>(null)
  const isDraggingRef = useRef(false)

  // Update the ref when initialPosition changes
  useEffect(() => {
    positionRef.current = initialPosition
  }, [initialPosition])

  // Use requestAnimationFrame for smoother updates
  const updatePosition = useCallback(
    (newPosition: Position) => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }

      requestRef.current = requestAnimationFrame(() => {
        if (onDragMove && isDraggingRef.current) {
          onDragMove(newPosition)
        }
        requestRef.current = null
      })
    },
    [onDragMove],
  )

  // Clean up any pending animation frames
  useEffect(() => {
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [])

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type,
      item: (monitor) => {
        // Set dragging state
        isDraggingRef.current = true

        // Calculate the mouse offset from the element's top-left corner
        const clientOffset = monitor.getClientOffset()
        const initialClientOffset = monitor.getInitialClientOffset()
        const initialSourceClientOffset = monitor.getInitialSourceClientOffset()

        if (clientOffset && initialClientOffset && initialSourceClientOffset) {
          const offset = {
            x: initialClientOffset.x - initialSourceClientOffset.x,
            y: initialClientOffset.y - initialSourceClientOffset.y,
          }
          setDragOffset(offset)
        }

        if (onDragStart) {
          onDragStart()
        }

        return { id, type, initialPosition: positionRef.current, initialSize }
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      canDrag,
      end: (item, monitor) => {
        // Reset dragging state
        isDraggingRef.current = false

        const dropResult = monitor.getDropResult()
        const didDrop = monitor.didDrop()

        if (didDrop && dropResult) {
          // Handle successful drop
        } else {
          // Handle cancelled drag or drop outside valid target
          const clientOffset = monitor.getClientOffset()
          const initialClientOffset = monitor.getInitialClientOffset()

          if (clientOffset && initialClientOffset && dragOffset) {
            const deltaX = clientOffset.x - initialClientOffset.x
            const deltaY = clientOffset.y - initialClientOffset.y

            const newPosition = {
              x: positionRef.current.x + deltaX,
              y: positionRef.current.y + deltaY,
            }

            if (onDragEnd) {
              onDragEnd(newPosition)
            }
          }
        }

        setDragOffset(null)
      },
      isDragging: (monitor) => {
        const clientOffset = monitor.getClientOffset()
        const initialClientOffset = monitor.getInitialClientOffset()

        if (clientOffset && initialClientOffset && dragOffset && isDraggingRef.current) {
          const deltaX = clientOffset.x - initialClientOffset.x
          const deltaY = clientOffset.y - initialClientOffset.y

          const newPosition = {
            x: positionRef.current.x + deltaX,
            y: positionRef.current.y + deltaY,
          }

          updatePosition(newPosition)
        }

        return monitor.getItemType() === type && monitor.getItem().id === id
      },
    }),
    [id, type, canDrag, initialSize, dragOffset, updatePosition, onDragStart, onDragEnd],
  )

  return { isDragging, drag, preview }
}
