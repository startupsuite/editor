"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { createPortal } from "react-dom"
import styles from "@/styles/photo-menu-modal.module.css"

interface PhotoMenuModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Photo {
  id: string
  src: string
  alt: string
  category: string
}

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
    src: "/placeholder-6ab9x.png",
    alt: "Business photo",
    category: "Business",
  },
  {
    id: "4",
    src: "/technology-code-screen.png",
    alt: "Technology photo",
    category: "Technology",
  },
]

export function PhotoMenuModal({ isOpen, onClose }: PhotoMenuModalProps) {
  const [activeTab, setActiveTab] = useState<"Stock" | "Your Uploads">("Stock")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [mounted, setMounted] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  // Handle mounting
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
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
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey)
    }
    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isOpen, onClose])

  if (!mounted || !isOpen) return null

  const categories = ["All", "Nature", "Business", "Abstract"]

  const filteredPhotos = stockPhotos.filter((photo) => {
    if (selectedCategory !== "All" && photo.category !== selectedCategory) return false
    if (searchQuery && !photo.alt.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const modal = (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer} ref={modalRef}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Photos</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.tabContainer}>
          <button
            className={`${styles.tabButton} ${activeTab === "Stock" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("Stock")}
          >
            Stock
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "Your Uploads" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("Your Uploads")}
          >
            Your Uploads
          </button>
        </div>

        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search photos..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.categoryContainer}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.categoryButton} ${selectedCategory === category ? styles.activeCategory : ""}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className={styles.photoGrid}>
          {filteredPhotos.map((photo) => (
            <div key={photo.id} className={styles.photoCard}>
              <div className={styles.photoImageContainer}>
                <Image
                  src={photo.src || "/placeholder.svg"}
                  alt={photo.alt}
                  width={240}
                  height={160}
                  className={styles.photoImage}
                />
              </div>
              <p className={styles.photoCaption}>{photo.alt}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // Use portal for modal
  return createPortal(modal, document.body)
}
