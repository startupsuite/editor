"use client"

import type React from "react"
import { useState } from "react"
import { useDocument } from "@/context/document-context"

interface TextModalExactProps {
  isOpen: boolean
  onClose: () => void
}

export const TextModalExact: React.FC<TextModalExactProps> = ({ isOpen, onClose }) => {
  const { addElement } = useDocument()
  const [activeTab, setActiveTab] = useState("preset")

  // Handle adding text elements
  const handleAddText = (textType: string, content: string) => {
    let fontSize = 16
    let bold = false
    let italic = false

    switch (textType) {
      case "heading1":
        fontSize = 32
        bold = true
        break
      case "heading2":
        fontSize = 28
        bold = true
        break
      case "heading3":
        fontSize = 24
        bold = true
        break
      case "subtitle":
        fontSize = 18
        break
      case "body":
        fontSize = 16
        break
      case "quote":
        fontSize = 18
        italic = true
        break
    }

    addElement({
      type: "text",
      textType,
      content,
      position: { x: 300, y: 200 },
      size: { width: 300, height: 50 },
      rotation: 0,
      zIndex: 1,
      fontFamily: "font-roboto",
      fontSize,
      color: "#000000",
      bold,
      italic,
      underline: false,
      strikethrough: false,
      alignment: "left",
      effect: "none",
      effectIntensity: 50,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

      <div className="relative bg-white w-full max-w-md rounded-md shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Text</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 focus:outline-none">
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">Add and format text elements</p>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-4">
            <div className="flex -mb-px">
              <button
                className={`mr-8 py-2 text-sm font-medium ${
                  activeTab === "preset"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("preset")}
              >
                Preset
              </button>
              <button
                className={`mr-8 py-2 text-sm font-medium ${
                  activeTab === "custom"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("custom")}
              >
                Custom
              </button>
              <button
                className={`py-2 text-sm font-medium ${
                  activeTab === "effects"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("effects")}
              >
                Effects
              </button>
            </div>
          </div>

          {/* Text Styles Grid */}
          {activeTab === "preset" && (
            <div className="grid grid-cols-2 gap-4">
              {/* Heading 1 */}
              <div
                className="bg-purple-50 rounded-lg p-4 cursor-pointer hover:bg-purple-100 transition-colors"
                onClick={() => {
                  handleAddText("heading1", "Heading 1")
                  onClose()
                }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold">Heading 1</div>
                  <div className="text-xs text-gray-500 mt-1">Heading 1</div>
                </div>
              </div>

              {/* Heading 2 */}
              <div
                className="bg-purple-50 rounded-lg p-4 cursor-pointer hover:bg-purple-100 transition-colors"
                onClick={() => {
                  handleAddText("heading2", "Heading 2")
                  onClose()
                }}
              >
                <div className="text-center">
                  <div className="text-xl font-bold">Heading 2</div>
                  <div className="text-xs text-gray-500 mt-1">Heading 2</div>
                </div>
              </div>

              {/* Heading 3 */}
              <div
                className="bg-purple-50 rounded-lg p-4 cursor-pointer hover:bg-purple-100 transition-colors"
                onClick={() => {
                  handleAddText("heading3", "Heading 3")
                  onClose()
                }}
              >
                <div className="text-center">
                  <div className="text-lg font-bold">Heading 3</div>
                  <div className="text-xs text-gray-500 mt-1">Heading 3</div>
                </div>
              </div>

              {/* Subtitle */}
              <div
                className="bg-purple-50 rounded-lg p-4 cursor-pointer hover:bg-purple-100 transition-colors"
                onClick={() => {
                  handleAddText("subtitle", "Subtitle text")
                  onClose()
                }}
              >
                <div className="text-center">
                  <div className="text-base italic">Subtitle text</div>
                  <div className="text-xs text-gray-500 mt-1">Subtitle</div>
                </div>
              </div>

              {/* Body Text */}
              <div
                className="bg-purple-50 rounded-lg p-4 cursor-pointer hover:bg-purple-100 transition-colors"
                onClick={() => {
                  handleAddText("body", "Body text")
                  onClose()
                }}
              >
                <div className="text-center">
                  <div className="text-base">Body text</div>
                  <div className="text-xs text-gray-500 mt-1">Body Text</div>
                </div>
              </div>

              {/* Quote */}
              <div
                className="bg-purple-50 rounded-lg p-4 cursor-pointer hover:bg-purple-100 transition-colors"
                onClick={() => {
                  handleAddText("quote", "Quote")
                  onClose()
                }}
              >
                <div className="text-center flex">
                  <div className="w-1 bg-blue-600 mr-2"></div>
                  <div>
                    <div className="text-base italic">Quote</div>
                    <div className="text-xs text-gray-500 mt-1">Quote</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "custom" && (
            <div className="h-64 flex items-center justify-center text-gray-500">
              Custom text options will appear here
            </div>
          )}

          {activeTab === "effects" && (
            <div className="h-64 flex items-center justify-center text-gray-500">
              Text effects options will appear here
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
