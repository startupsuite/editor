"use client"

import type React from "react"

import { useState } from "react"
import { Modal } from "@/components/ui/modal"
import { useRipple } from "@/hooks/use-ripple"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { createRipple } = useRipple()
  const [theme, setTheme] = useState("light")
  const [autoSave, setAutoSave] = useState(true)
  const [gridSize, setGridSize] = useState(8)

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Document Settings" width="450px">
      <div className="space-y-8 p-6">
        <div>
          <h3 className="text-md-on-surface font-medium mb-4">Theme</h3>
          <div className="flex space-x-3">
            <div
              className={`w-16 h-16 rounded-md-lg flex items-center justify-center cursor-pointer transition-all duration-200 ${
                theme === "light"
                  ? "bg-md-primary-container text-md-on-primary-container ring-2 ring-md-primary"
                  : "bg-md-surface-container-high text-md-on-surface-variant hover:bg-md-surface-container-low"
              }`}
              onClick={(e) => {
                createRipple(e)
                setTheme("light")
              }}
            >
              <i className="material-icons text-2xl">light_mode</i>
            </div>
            <div
              className={`w-16 h-16 rounded-md-lg flex items-center justify-center cursor-pointer transition-all duration-200 ${
                theme === "dark"
                  ? "bg-md-primary-container text-md-on-primary-container ring-2 ring-md-primary"
                  : "bg-md-surface-container-high text-md-on-surface-variant hover:bg-md-surface-container-low"
              }`}
              onClick={(e) => {
                createRipple(e)
                setTheme("dark")
              }}
            >
              <i className="material-icons text-2xl">dark_mode</i>
            </div>
            <div
              className={`w-16 h-16 rounded-md-lg flex items-center justify-center cursor-pointer transition-all duration-200 ${
                theme === "system"
                  ? "bg-md-primary-container text-md-on-primary-container ring-2 ring-md-primary"
                  : "bg-md-surface-container-high text-md-on-surface-variant hover:bg-md-surface-container-low"
              }`}
              onClick={(e) => {
                createRipple(e)
                setTheme("system")
              }}
            >
              <i className="material-icons text-2xl">settings_suggest</i>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-md-on-surface font-medium mb-4">Auto-save</h3>
          <div className="flex items-center">
            <div
              className={`relative w-14 h-7 rounded-full cursor-pointer transition-colors duration-200 ${
                autoSave ? "bg-md-primary" : "bg-md-surface-variant"
              }`}
              onClick={() => setAutoSave(!autoSave)}
            >
              <div
                className={`absolute top-1 w-5 h-5 rounded-full shadow-sm transition-all duration-200 ${
                  autoSave ? "left-8 bg-md-on-primary" : "left-1 bg-md-on-surface-variant"
                }`}
              ></div>
            </div>
            <span className="ml-3 text-md-on-surface-variant">
              {autoSave ? "Enabled (every 60 seconds)" : "Disabled"}
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-md-on-surface font-medium mb-4">Grid Size</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-md-on-surface-variant">Grid Size: {gridSize}px</span>
            </div>
            <div className="h-9 flex items-center">
              <div className="w-full h-4 bg-md-surface-container-highest rounded-full relative">
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-md-primary rounded-full"
                  style={{ width: `${((gridSize - 4) / 20) * 100}%` }}
                ></div>
                <input
                  type="range"
                  min="4"
                  max="24"
                  step="4"
                  value={gridSize}
                  onChange={(e) => setGridSize(Number.parseInt(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div
                  className="absolute top-1/2 w-5 h-5 bg-md-primary border-2 border-white rounded-full shadow-md pointer-events-none"
                  style={{ left: `${((gridSize - 4) / 20) * 100}%`, transform: "translate(-50%, -50%)" }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-md-on-surface-variant">
              <span>4px</span>
              <span>24px</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-md-on-surface font-medium mb-4">Canvas Background</h3>
          <div className="grid grid-cols-4 gap-3">
            {["#FFFFFF", "#F8F9FA", "#F5F5F5", "#EEEEEE", "#E0F7FA", "#E8F5E9", "#FFF8E1", "#FFEBEE"].map((color) => (
              <div
                key={color}
                className="w-full aspect-square rounded-md-md cursor-pointer border border-md-outline-variant hover:scale-105 transition-transform duration-200"
                style={{ backgroundColor: color }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}
