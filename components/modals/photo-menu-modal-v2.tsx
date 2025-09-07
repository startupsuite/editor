"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { createPortal } from "react-dom"
import { addCustomEventListener } from "@/utils/event-utils"

// Define the modal's props
interface PhotoMenuModalProps {
  onClose?: () => void
}

// Define the photo interface
interface Photo {
  id: string
  src: string
  alt: string
  category: string
}

// Sample photo data
const stockPhotos: Photo[] = [
  {
    id: "1",
    src: "/mountain-lake-sunset.png",
    alt: "Nature photo",
    category: "Nature",
  },
  {
    id: "2",
    src: "/sunlit-forest.png",
    alt: "Nature photo",
    category: "Nature",
  },
  {
    id: "3",
    src: "/business-meeting-office.png",
    alt: "Business photo",
    category: "Business",
  },
  {
    id: "4",
    src: "/computer-code-technology.png",
    alt: "Technology photo",
    category: "Technology",
  },
]

export function PhotoMenuModalV2({ onClose }: PhotoMenuModalProps) {
  // State for the modal
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"Stock" | "Your Uploads">("Stock")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const modalRef = useRef<HTMLDivElement>(null)

  // Handle opening and closing the modal
  useEffect(() => {
    // Function to open the modal
    const handleOpenModal = () => {
      console.log("Opening Photo Menu modal")
      setIsOpen(true)
    }

    // Function to close the modal
    const handleCloseModal = () => {
      setIsOpen(false)
      if (onClose) onClose()
    }

    // Add event listeners for custom events
    const removeOpenListener = addCustomEventListener("open-photo-menu", handleOpenModal)
    const removeCloseListener = addCustomEventListener("close-photo-menu", handleCloseModal)

    // Clean up event listeners
    return () => {
      removeOpenListener()
      removeCloseListener()
    }
  }, [onClose])

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        if (onClose) onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // Handle escape key to close
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
        if (onClose) onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isOpen, onClose])

  // If the modal is not open, don't render anything
  if (!isOpen) return null

  // Filter photos based on category and search query
  const categories = ["All", "Nature", "Business", "Abstract"]

  const filteredPhotos = stockPhotos.filter((photo) => {
    if (selectedCategory !== "All" && photo.category !== selectedCategory) return false
    if (searchQuery && !photo.alt.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  // Render the modal
  const modal = (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <div
        ref={modalRef}
        className="absolute top-16 left-[90px] bottom-0 w-[380px] bg-white shadow-lg pointer-events-auto border-r border-gray-200 overflow-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-medium">Photos</h2>
          <button
            onClick={() => {
              setIsOpen(false)
              if (onClose) onClose()
            }}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-2 px-4 text-center font-medium text-sm ${
              activeTab === "Stock"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("Stock")}
          >
            Stock
          </button>
          <button
            className={`flex-1 py-2 px-4 text-center font-medium text-sm ${
              activeTab === "Your Uploads"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("Your Uploads")}
          >
            Your Uploads
          </button>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search photos..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Categories */}
        <div className="px-4 pb-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedCategory === category
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        <div className="px-4 pb-4 grid grid-cols-2 gap-4">
          {filteredPhotos.map((photo) => (
            <div key={photo.id} className="flex flex-col">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                <Image src={photo.src || "/placeholder.svg"} alt={photo.alt} fill className="object-cover" />
              </div>
              <p className="mt-2 text-sm text-center">{photo.alt}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // Use createPortal to render the modal at the end of the document body
  return createPortal(modal, document.body)
}

// Add some global styles for the animation
const globalStyles = `
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
`

// Add the global styles to the document
if (typeof document !== "undefined") {
  const style = document.createElement("style")
  style.textContent = globalStyles
  document.head.appendChild(style)
}
