"use client"

import type React from "react"
import { useState } from "react"
import { Modal } from "@/components/ui/modal"
import { useDocument } from "@/context/document-context"
import { useRipple } from "@/hooks/use-ripple"
import type { TextType } from "@/types/document-builder"
import { useDrag } from "react-dnd"
import { ColumnLayout } from "@/components/ui/column-layout"

interface TextModalProps {
  isOpen: boolean
  onClose: () => void
  columns?: number
}

interface TextCardProps {
  textType: TextType
  name: string
  className: string
  children: React.ReactNode
}

const TextCard: React.FC<TextCardProps> = ({ textType, name, className, children }) => {
  const { createRipple } = useRipple()
  const { addElement } = useDocument()

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TEXT",
    item: { textType },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    createRipple(e)

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
      content: children as string,
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
      className="bg-white border border-gray-200 rounded-md p-4 cursor-pointer hover:bg-gray-50 transition-all relative overflow-hidden mb-3 w-full"
      onClick={handleClick}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className={`text-center ${className}`}>{children}</div>
      <div className="text-xs text-gray-500 text-center mt-1">{name}</div>
    </div>
  )
}

export const TextModalFinal: React.FC<TextModalProps> = ({ isOpen, onClose, columns = 1 }) => {
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
    <Modal isOpen={isOpen} onClose={onClose} title="Text" width="450px" className="text-modal-neutral">
      <div className="p-6 bg-white">
        <p className="text-sm text-gray-500 mb-6 text-center">Click to add or drag text to the canvas</p>

        <button
          className="w-full flex items-center justify-center gap-2 p-3 mb-6 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          onClick={addTextBox}
        >
          <span className="material-icons text-blue-600 text-base">text_fields</span>
          <span className="text-black">Add text box</span>
        </button>

        <div className="mb-6">
          <div className="flex w-full bg-gray-100 rounded-md">
            <button
              className={`flex-1 py-2 px-4 text-sm font-medium relative ${
                activeTab === "text" ? "text-black bg-white rounded-md" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("text")}
            >
              Text
            </button>
            <button
              className={`flex-1 py-2 px-4 text-sm font-medium relative ${
                activeTab === "tables" ? "text-black bg-white rounded-md" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("tables")}
            >
              Tables
            </button>
            <button
              className={`flex-1 py-2 px-4 text-sm font-medium relative ${
                activeTab === "lists" ? "text-black bg-white rounded-md" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("lists")}
            >
              Lists
            </button>
            <button
              className={`flex-1 py-2 px-4 text-sm font-medium relative ${
                activeTab === "callouts" ? "text-black bg-white rounded-md" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("callouts")}
            >
              Callouts
            </button>
          </div>
        </div>

        {activeTab === "text" && (
          <>
            <h3 className="text-base font-medium text-black mb-4">Text Styles</h3>

            <ColumnLayout forceColumns={1}>
              <TextCard textType="heading1" name="Heading 1" className="text-4xl font-bold">
                Heading 1
              </TextCard>

              <TextCard textType="heading2" name="Heading 2" className="text-3xl font-bold">
                Heading 2
              </TextCard>

              <TextCard textType="heading3" name="Heading 3" className="text-2xl font-bold">
                Heading 3
              </TextCard>

              <TextCard textType="body" name="Paragraph" className="text-base">
                This is paragraph text
              </TextCard>

              <TextCard textType="quote" name="Quote" className="text-lg italic">
                "This is a quote"
              </TextCard>
            </ColumnLayout>
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
    </Modal>
  )
}
