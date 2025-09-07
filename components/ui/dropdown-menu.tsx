"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface DropdownMenuProps {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: "left" | "right"
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ trigger, children, align = "right" }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={toggleDropdown} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`absolute top-full mt-1 bg-white rounded-md-md shadow-md-elevation-2 z-50 min-w-[200px] ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {children}
        </div>
      )}
    </div>
  )
}

interface DropdownItemProps {
  children: React.ReactNode
  onClick?: () => void
  icon?: string
  disabled?: boolean
}

export const DropdownItem: React.FC<DropdownItemProps> = ({ children, onClick, icon, disabled = false }) => {
  return (
    <button
      className={`w-full text-left px-4 py-2 flex items-center gap-2 text-sm ${
        disabled
          ? "text-gray-400 cursor-not-allowed"
          : "text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <i className="material-icons text-sm">{icon}</i>}
      {children}
    </button>
  )
}

export const DropdownSeparator: React.FC = () => {
  return <div className="h-px bg-gray-200 my-1"></div>
}
