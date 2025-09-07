"use client"

import type React from "react"

import { useState } from "react"
import { useDocument } from "@/context/document-context"
import type { TextType } from "@/types/document-builder"
import { useDrag } from "react-dnd"

interface TextModalProps {
  isOpen: boolean
  onClose: () => void
}

interface TextStyleCardProps {
  textType: TextType
  displayName: string
  labelName: string
  className: string
  children: React.ReactNode
}

const TextStyleCard: React.FC<TextStyleCardProps> = ({ textType, displayName, labelName, className, children }) => {
  const { addElement } = useDocument()

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TEXT",
    item: { textType },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  const handleClick = () => {
    let fontSize = 16
    switch (textType) {
      case "heading1":
        fontSize = 32
        break
      case "heading2":
        fontSize = 28
        break
      case "heading3":
        fontSize = 24
        break
      case "subtitle":
        fontSize = 18
        break
      case "body":
        fontSize = 16
        break
      case "quote":
        fontSize = 18
        break
    }

    addElement({
      type: "text",
      textType,
      content: displayName,
      position: { x: 300, y: 200 },
      size: { width: 300, height: 50 },
      rotation: 0,
      zIndex: 1,
      fontFamily: "font-roboto",
      fontSize,
      color: "#000000",
      bold: textType.includes("heading"),
      italic: textType === "subtitle" || textType === "quote",
      underline: false,
      strikethrough: false,
      alignment: "left",
      effect: "none",
      effectIntensity: 50,
    })
  }

  return (
    <div
      ref={drag}
      className="border border-gray-200 rounded-md p-4 cursor-pointer hover:bg-gray-50 transition-all mb-3 w-full"
      onClick={handleClick}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className={`text-center ${className}`}>{children}</div>
      <div className="text-xs text-gray-500 text-center mt-1">{labelName}</div>
    </div>
  )
}

export const TextModal: React.FC<TextModalProps> = ({ isOpen, onClose }) => {
  const { addElement } = useDocument()
  const [activeTab, setActiveTab] = useState<"text" | "tables" | "lists" | "callouts">("text")

  const addTextBox = () => {
    addElement({
      type: "text",
      textType: "body",
      content: "Add your text here",
      position: { x: 300, y: 200 },
      size: { width: 300, height: 50 },
      rotation: 0,
      zIndex: 1,
      fontFamily: "font-roboto",
      fontSize: 16,
      color: "#000000",
      bold: false,
      italic: false,
      underline: false,
      strikethrough: false,
      alignment: "left",
      effect: "none",
      effectIntensity: 50,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-md shadow-lg w-full max-w-md mx-auto overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-medium">Text</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 focus:outline-none">
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-sm text-gray-500 text-center mb-4">Click to add or drag text to the canvas</p>

          {/* Add text box button */}
          <button
            className="w-full flex items-center justify-center gap-2 p-3 mb-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            onClick={addTextBox}
          >
            <span className="text-blue-600 font-medium">T</span>
            <span>Add text box</span>
          </button>

          {/* Tabs */}
          <div className="flex w-full bg-gray-100 rounded-md mb-4">
            <button
              className={`flex-1 py-2 px-4 text-sm font-medium ${
                activeTab === "text" ? "bg-white text-black rounded-md" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("text")}
            >
              Text
            </button>
            <button
              className={`flex-1 py-2 px-4 text-sm font-medium ${
                activeTab === "tables" ? "bg-white text-black rounded-md" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("tables")}
            >
              Tables
            </button>
            <button
              className={`flex-1 py-2 px-4 text-sm font-medium ${
                activeTab === "lists" ? "bg-white text-black rounded-md" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("lists")}
            >
              Lists
            </button>
            <button
              className={`flex-1 py-2 px-4 text-sm font-medium ${
                activeTab === "callouts" ? "bg-white text-black rounded-md" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("callouts")}
            >
              Callouts
            </button>
          </div>

          {activeTab === "text" && (
            <>
              <h3 className="text-base font-medium text-center mb-4">Text Styles</h3>

              <div className="space-y-3">
                <TextStyleCard
                  textType="heading1"
                  displayName="Heading 1"
                  labelName="Heading 1"
                  className="text-4xl font-bold"
                >
                  Heading 1
                </TextStyleCard>

                <TextStyleCard
                  textType="heading2"
                  displayName="Heading 2"
                  labelName="Heading 2"
                  className="text-3xl font-bold"
                >
                  Heading 2
                </TextStyleCard>

                <TextStyleCard
                  textType="heading3"
                  displayName="Heading 3"
                  labelName="Heading 3"
                  className="text-2xl font-bold"
                >
                  Heading 3
                </TextStyleCard>

                <TextStyleCard
                  textType="body"
                  displayName="This is paragraph text"
                  labelName="Paragraph"
                  className="text-base"
                >
                  This is paragraph text
                </TextStyleCard>

                <TextStyleCard
                  textType="quote"
                  displayName="This is a quote"
                  labelName="Quote"
                  className="text-lg italic"
                >
                  "This is a quote"
                </TextStyleCard>
              </div>
            </>
          )}

          {activeTab === "tables" && (
            <div className="flex items-center justify-center h-40 border border-dashed border-gray-300 rounded-md">
              <p className="text-gray-500">Tables feature coming soon</p>
            </div>
          )}

          {activeTab === "lists" && (
            <div className="flex items-center justify-center h-40 border border-dashed border-gray-300 rounded-md">
              <p className="text-gray-500">Lists feature coming soon</p>
            </div>
          )}

          {activeTab === "callouts" && (
            <div className="flex items-center justify-center h-40 border border-dashed border-gray-300 rounded-md">
              <p className="text-gray-500">Callouts feature coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
