"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useDocument } from "@/context/document-context"
import { useRipple } from "@/hooks/use-ripple"
import { DropdownMenu, DropdownItem, DropdownSeparator } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip"

export const AppBar = () => {
  const { document, updateDocumentTitle } = useDocument()
  const { createRipple } = useRipple()
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(document.title)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const titleInputRef = useRef<HTMLInputElement>(null)

  // Update local title when document title changes
  useEffect(() => {
    setTitle(document.title)
  }, [document.title])

  const handleTitleClick = () => {
    setIsEditing(true)
    // Focus will be set in useEffect
  }

  // Focus the input when editing starts
  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus()
      titleInputRef.current.select()
    }
  }, [isEditing])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleTitleBlur = () => {
    setIsEditing(false)
    if (title.trim()) {
      updateDocumentTitle(title)
    } else {
      setTitle(document.title) // Reset to original if empty
    }
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false)
      if (title.trim()) {
        updateDocumentTitle(title)
      } else {
        setTitle(document.title) // Reset to original if empty
      }
    } else if (e.key === "Escape") {
      setIsEditing(false)
      setTitle(document.title) // Reset to original
    }
  }

  const toggleMobileMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(e)
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <TooltipProvider>
      <div className="bg-blue-600 text-white shadow-md-elevation-1 h-16 flex items-center justify-between px-4 z-10">
        {/* Left section - Document title and menu */}
        <div className="flex items-center">
          <Tooltip text="Main menu">
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-700 transition-colors"
              aria-label="Menu"
              onClick={toggleMobileMenu}
            >
              <i className="material-icons text-white">menu</i>
              <span className="md3-state-layer"></span>
            </button>
          </Tooltip>

          <div className="ml-4">
            {isEditing ? (
              <input
                ref={titleInputRef}
                type="text"
                value={title}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                onKeyDown={handleTitleKeyDown}
                className="bg-transparent border-b border-white outline-none w-48 md:w-64 text-white text-xl px-1"
                aria-label="Document title"
              />
            ) : (
              <button
                onClick={handleTitleClick}
                className="text-xl text-white hover:bg-blue-700 px-2 py-1 rounded transition-colors"
                aria-label="Edit document title"
              >
                {document.title}
              </button>
            )}
          </div>
        </div>

        {/* Center section - Editing tools */}
        <div className="flex items-center justify-center space-x-2 flex-1">
          {/* Undo/Redo buttons */}
          <Tooltip text="Undo">
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-700 transition-colors"
              aria-label="Undo"
              onClick={createRipple}
            >
              <i className="material-icons text-white">undo</i>
              <span className="md3-state-layer"></span>
            </button>
          </Tooltip>

          <Tooltip text="Redo">
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-700 transition-colors"
              aria-label="Redo"
              onClick={createRipple}
            >
              <i className="material-icons text-white">redo</i>
              <span className="md3-state-layer"></span>
            </button>
          </Tooltip>

          {/* Add button */}
          <Tooltip text="Add content">
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-700 transition-colors"
              aria-label="Add content"
              onClick={createRipple}
            >
              <i className="material-icons text-white">add</i>
              <span className="md3-state-layer"></span>
            </button>
          </Tooltip>

          {/* Analytics button */}
          <Tooltip text="Analytics">
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-700 transition-colors md:flex hidden"
              aria-label="Analytics"
              onClick={createRipple}
            >
              <i className="material-icons text-white">bar_chart</i>
              <span className="md3-state-layer"></span>
            </button>
          </Tooltip>

          {/* Layout button */}
          <Tooltip text="Layout options">
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-700 transition-colors md:flex hidden"
              aria-label="Layout options"
              onClick={createRipple}
            >
              <i className="material-icons text-white">dashboard</i>
              <span className="md3-state-layer"></span>
            </button>
          </Tooltip>
        </div>

        {/* Right section - User and sharing */}
        <div className="flex items-center justify-end space-x-3">
          {/* Present button */}
          <Tooltip text="Start presentation">
            <button
              className="h-10 px-4 rounded-full border border-white/30 text-white hover:bg-blue-700 transition-colors md:flex hidden items-center"
              aria-label="Present"
              onClick={createRipple}
            >
              Present
              <span className="md3-state-layer"></span>
            </button>
          </Tooltip>

          {/* Share button */}
          <Tooltip text="Share with others">
            <button
              className="h-10 px-4 rounded-full bg-white text-blue-600 hover:bg-white/90 transition-colors md:flex hidden items-center"
              aria-label="Share"
              onClick={createRipple}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>
              Share
              <span className="md3-state-layer"></span>
            </button>
          </Tooltip>

          {/* User avatar with dropdown */}
          <DropdownMenu
            trigger={
              <Tooltip text="Account">
                <button
                  className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center"
                  aria-label="User profile"
                  onClick={createRipple}
                >
                  P<span className="md3-state-layer"></span>
                </button>
              </Tooltip>
            }
            align="right"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  P
                </div>
                <div className="ml-3">
                  <div className="font-medium">User Name</div>
                  <div className="text-xs text-gray-500">user@example.com</div>
                </div>
              </div>
            </div>
            <div className="py-1">
              <DropdownItem icon="account_circle">Profile</DropdownItem>
              <DropdownItem icon="settings">Settings</DropdownItem>
              <DropdownSeparator />
              <DropdownItem icon="help_outline">Help & Feedback</DropdownItem>
              <DropdownItem icon="logout">Sign out</DropdownItem>
            </div>
          </DropdownMenu>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-md-elevation-3 z-20 md:hidden">
            <div className="p-2 flex flex-col">
              <button
                className="flex items-center p-2 text-gray-800 hover:bg-gray-100 rounded"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="material-icons mr-2">bar_chart</i>
                <span>Analytics</span>
              </button>
              <button
                className="flex items-center p-2 text-gray-800 hover:bg-gray-100 rounded"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="material-icons mr-2">dashboard</i>
                <span>Layout options</span>
              </button>
              <button
                className="flex items-center p-2 text-gray-800 hover:bg-gray-100 rounded"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="material-icons mr-2">slideshow</i>
                <span>Present</span>
              </button>
              <button
                className="flex items-center p-2 text-gray-800 hover:bg-gray-100 rounded"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="material-icons mr-2">share</i>
                <span>Share</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
