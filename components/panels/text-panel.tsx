"use client"

import { useState } from "react"

import type React from "react"
import { useRipple } from "@/hooks/use-ripple"
import { useDocument } from "@/context/document-context"
import { useDrag } from "react-dnd"
import { Tabs } from "@/components/ui/tabs"

type TextPanelProps = {
  isOpen: boolean
  onClose: () => void
}

type FontFamily =
  | "font-roboto"
  | "font-poppins"
  | "font-playfair"
  | "font-merriweather"
  | "font-montserrat"
  | "font-opensans"

type TextAlignment = "left" | "center" | "right" | "justify"

type TextCardProps = {
  textType: string
  name: string
  className?: string
  children: React.ReactNode
}

type TextEffectCardProps = {
  effect: string
  name: string
  style: React.CSSProperties
  children: React.ReactNode
}

// Update the TextCard component to match the styling of ShapeCard
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
      className="bg-[#F5F3FF] rounded-[16px] p-4 flex flex-col items-center justify-center cursor-pointer h-[100px] hover:bg-[#EDE9FE] transition-all relative overflow-hidden"
      onClick={handleClick}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className={`flex items-center justify-center h-[60px] ${className}`}>{children}</div>
      <div className="text-xs text-[#333333] font-normal">{name}</div>
    </div>
  )
}

// Update the TextEffectCard component to match the styling of ShapeCard
const TextEffectCard: React.FC<TextEffectCardProps> = ({ effect, name, style, children }) => {
  const { createRipple } = useRipple()
  const { addElement } = useDocument()

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    createRipple(e)

    addElement({
      type: "text",
      textType: "body",
      content: children as string,
      position: { x: 300, y: 200 },
      size: { width: 300, height: 50 },
      rotation: 0,
      zIndex: 1,
      fontFamily: "font-roboto",
      fontSize: 24,
      color: "#000000",
      bold: false,
      italic: false,
      underline: false,
      strikethrough: false,
      alignment: "left",
      effect,
      effectIntensity: 50,
    })
  }

  return (
    <div
      className="bg-[#F5F3FF] rounded-[16px] p-4 flex flex-col items-center justify-center cursor-pointer h-[100px] hover:bg-[#EDE9FE] transition-all relative overflow-hidden"
      onClick={handleClick}
    >
      <div className="flex items-center justify-center h-[60px]" style={style}>
        {children}
      </div>
      <div className="text-xs text-[#333333] font-normal">{name}</div>
    </div>
  )
}

export const TextPanel: React.FC<TextPanelProps> = ({ isOpen, onClose }) => {
  const { createRipple } = useRipple()
  const { addElement } = useDocument()
  const [activeTab, setActiveTab] = useState<"preset" | "custom" | "effects">("preset")
  const [fontFamily, setFontFamily] = useState<FontFamily>("font-roboto")
  const [fontSize, setFontSize] = useState(24)
  const [textColor, setTextColor] = useState("#000000")
  const [effectIntensity, setEffectIntensity] = useState(50)

  // Format states
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)
  const [alignment, setAlignment] = useState<TextAlignment>("left")

  const toggleFormat = (
    format: "bold" | "italic" | "underline" | "strikethrough",
    e: React.MouseEvent<HTMLDivElement>,
  ) => {
    createRipple(e)
    switch (format) {
      case "bold":
        setIsBold(!isBold)
        break
      case "italic":
        setIsItalic(!isItalic)
        break
      case "underline":
        setIsUnderline(!isUnderline)
        break
      case "strikethrough":
        setIsStrikethrough(!isStrikethrough)
        break
    }
  }

  const setTextAlignment = (align: TextAlignment, e: React.MouseEvent<HTMLDivElement>) => {
    createRipple(e)
    setAlignment(align)
  }

  const selectTextColor = (color: string, e: React.MouseEvent<HTMLDivElement>) => {
    createRipple(e)
    setTextColor(color)
  }

  const addCustomText = (e: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(e)

    addElement({
      type: "text",
      textType: "body",
      content: "Custom Text",
      position: { x: 300, y: 200 },
      size: { width: 300, height: 50 },
      rotation: 0,
      zIndex: 1,
      fontFamily,
      fontSize,
      color: textColor,
      bold: isBold,
      italic: isItalic,
      underline: isUnderline,
      strikethrough: isStrikethrough,
      alignment,
      effect: "none",
      effectIntensity: 50,
    })
  }

  if (!isOpen) return null

  return (
    <div className="w-[380px] bg-white h-full overflow-y-auto border-r border-gray-200">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-xl font-medium">Text</h2>
        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100" onClick={onClose}>
          <i className="material-icons">close</i>
        </button>
      </div>

      <div className="p-4">
        <p className="text-sm text-gray-600 mb-4">Add and format text elements</p>

        {/* Use the new Tabs component */}
        <Tabs
          tabs={["preset", "custom", "effects"]}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as "preset" | "custom" | "effects")}
          className="mb-6"
        />

        {/* Text Presets */}
        {activeTab === "preset" && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <TextCard textType="heading1" name="Heading 1" className="font-poppins text-heading1">
              Heading 1
            </TextCard>
            <TextCard textType="heading2" name="Heading 2" className="font-poppins text-heading2">
              Heading 2
            </TextCard>
            <TextCard textType="heading3" name="Heading 3" className="font-poppins text-heading3">
              Heading 3
            </TextCard>
            <TextCard textType="subtitle" name="Subtitle" className="font-poppins text-subtitle">
              Subtitle text
            </TextCard>
            <TextCard textType="body" name="Body Text" className="font-roboto text-body">
              Body text
            </TextCard>
            <TextCard textType="quote" name="Quote" className="font-merriweather text-quote">
              Quote
            </TextCard>
          </div>
        )}

        {/* Custom Text */}
        {activeTab === "custom" && (
          <div>
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Font Family</div>
              <select
                className="w-full p-2 rounded-md border border-gray-300 bg-white text-gray-700 text-sm cursor-pointer transition-colors duration-200"
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value as FontFamily)}
              >
                <option value="font-roboto">Roboto</option>
                <option value="font-poppins">Poppins</option>
                <option value="font-playfair">Playfair Display</option>
                <option value="font-merriweather">Merriweather</option>
                <option value="font-montserrat">Montserrat</option>
                <option value="font-opensans">Open Sans</option>
              </select>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Font Size</span>
                <span className="text-sm text-gray-600">{fontSize}px</span>
              </div>
              <div className="relative h-8 flex items-center">
                <div className="absolute inset-0 bg-gradient-to-r from-[#5B21B6] to-[#7C3AED] rounded-full h-1 top-1/2 transform -translate-y-1/2"></div>
                <input
                  type="range"
                  min="8"
                  max="72"
                  value={fontSize}
                  className="w-full h-1 appearance-none bg-transparent focus:outline-none"
                  onChange={(e) => setFontSize(Number.parseInt(e.target.value))}
                />
                <div
                  className="absolute w-6 h-6 bg-white border-2 border-[#5B21B6] rounded-full shadow-md"
                  style={{
                    left: `calc(${((fontSize - 8) / 64) * 100}% - 12px)`,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                ></div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-4 p-2 bg-gray-50 rounded-md">
              <div
                className={`w-9 h-9 flex items-center justify-center rounded-md cursor-pointer transition-colors duration-200 ${
                  isBold ? "bg-[#E4D3FF] text-[#5B21B6]" : "bg-transparent text-gray-600 hover:bg-gray-100"
                }`}
                title="Bold"
                onClick={(e) => toggleFormat("bold", e)}
              >
                <i className="material-icons">format_bold</i>
              </div>
              <div
                className={`w-9 h-9 flex items-center justify-center rounded-md cursor-pointer transition-colors duration-200 ${
                  isItalic ? "bg-[#E4D3FF] text-[#5B21B6]" : "bg-transparent text-gray-600 hover:bg-gray-100"
                }`}
                title="Italic"
                onClick={(e) => toggleFormat("italic", e)}
              >
                <i className="material-icons">format_italic</i>
              </div>
              <div
                className={`w-9 h-9 flex items-center justify-center rounded-md cursor-pointer transition-colors duration-200 ${
                  isUnderline ? "bg-[#E4D3FF] text-[#5B21B6]" : "bg-transparent text-gray-600 hover:bg-gray-100"
                }`}
                title="Underline"
                onClick={(e) => toggleFormat("underline", e)}
              >
                <i className="material-icons">format_underline</i>
              </div>
              <div
                className={`w-9 h-9 flex items-center justify-center rounded-md cursor-pointer transition-colors duration-200 ${
                  isStrikethrough ? "bg-[#E4D3FF] text-[#5B21B6]" : "bg-transparent text-gray-600 hover:bg-gray-100"
                }`}
                title="Strikethrough"
                onClick={(e) => toggleFormat("strikethrough", e)}
              >
                <i className="material-icons">format_strikethrough</i>
              </div>
              <div
                className={`w-9 h-9 flex items-center justify-center rounded-md cursor-pointer transition-colors duration-200 ${
                  alignment === "left"
                    ? "bg-[#E4D3FF] text-[#5B21B6]"
                    : "bg-transparent text-gray-600 hover:bg-gray-100"
                }`}
                title="Align Left"
                onClick={(e) => setTextAlignment("left", e)}
              >
                <i className="material-icons">format_align_left</i>
              </div>
              <div
                className={`w-9 h-9 flex items-center justify-center rounded-md cursor-pointer transition-colors duration-200 ${
                  alignment === "center"
                    ? "bg-[#E4D3FF] text-[#5B21B6]"
                    : "bg-transparent text-gray-600 hover:bg-gray-100"
                }`}
                title="Align Center"
                onClick={(e) => setTextAlignment("center", e)}
              >
                <i className="material-icons">format_align_center</i>
              </div>
              <div
                className={`w-9 h-9 flex items-center justify-center rounded-md cursor-pointer transition-colors duration-200 ${
                  alignment === "right"
                    ? "bg-[#E4D3FF] text-[#5B21B6]"
                    : "bg-transparent text-gray-600 hover:bg-gray-100"
                }`}
                title="Align Right"
                onClick={(e) => setTextAlignment("right", e)}
              >
                <i className="material-icons">format_align_right</i>
              </div>
              <div
                className={`w-9 h-9 flex items-center justify-center rounded-md cursor-pointer transition-colors duration-200 ${
                  alignment === "justify"
                    ? "bg-[#E4D3FF] text-[#5B21B6]"
                    : "bg-transparent text-gray-600 hover:bg-gray-100"
                }`}
                title="Justify"
                onClick={(e) => setTextAlignment("justify", e)}
              >
                <i className="material-icons">format_align_justify</i>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Text Color</div>
              <div className="flex flex-wrap gap-2">
                <div
                  className={`w-8 h-8 rounded-md cursor-pointer border transition-transform duration-200 ${
                    textColor === "#000000" ? "border-2 border-gray-800 scale-110" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: "#000000" }}
                  onClick={(e) => selectTextColor("#000000", e)}
                ></div>
                <div
                  className={`w-8 h-8 rounded-md cursor-pointer border transition-transform duration-200 ${
                    textColor === "#FFFFFF" ? "border-2 border-gray-800 scale-110" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: "#FFFFFF" }}
                  onClick={(e) => selectTextColor("#FFFFFF", e)}
                ></div>
                <div
                  className={`w-8 h-8 rounded-md cursor-pointer border transition-transform duration-200 ${
                    textColor === "#0061A4" ? "border-2 border-gray-800 scale-110" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: "#0061A4" }}
                  onClick={(e) => selectTextColor("#0061A4", e)}
                ></div>
                <div
                  className={`w-8 h-8 rounded-md cursor-pointer border transition-transform duration-200 ${
                    textColor === "#006C51" ? "border-2 border-gray-800 scale-110" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: "#006C51" }}
                  onClick={(e) => selectTextColor("#006C51", e)}
                ></div>
                <div
                  className={`w-8 h-8 rounded-md cursor-pointer border transition-transform duration-200 ${
                    textColor === "#BA1A1A" ? "border-2 border-gray-800 scale-110" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: "#BA1A1A" }}
                  onClick={(e) => selectTextColor("#BA1A1A", e)}
                ></div>
                <div
                  className={`w-8 h-8 rounded-md cursor-pointer border transition-transform duration-200 ${
                    textColor === "#5B21B6" ? "border-2 border-gray-800 scale-110" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: "#5B21B6" }}
                  onClick={(e) => selectTextColor("#5B21B6", e)}
                ></div>
                <div
                  className={`w-8 h-8 rounded-md cursor-pointer border transition-transform duration-200 ${
                    textColor === "#00639D" ? "border-2 border-gray-800 scale-110" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: "#00639D" }}
                  onClick={(e) => selectTextColor("#00639D", e)}
                ></div>
                <div
                  className={`w-8 h-8 rounded-md cursor-pointer border transition-transform duration-200 ${
                    textColor === "#7D5260" ? "border-2 border-gray-800 scale-110" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: "#7D5260" }}
                  onClick={(e) => selectTextColor("#7D5260", e)}
                ></div>
              </div>
            </div>

            <div className="mt-4">
              <button
                className="w-full py-2 px-4 bg-[#5B21B6] text-white rounded-full font-medium text-sm hover:bg-[#4C1D95] transition-colors flex items-center justify-center gap-2"
                onClick={addCustomText}
              >
                <i className="material-icons text-sm">add</i>
                Add Text
              </button>
            </div>
          </div>
        )}

        {/* Text Effects */}
        {activeTab === "effects" && (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <TextEffectCard effect="shadow" name="Shadow" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>
                Text Shadow
              </TextEffectCard>
              <TextEffectCard
                effect="outline"
                name="Outline"
                style={{ WebkitTextStroke: "1px #0061A4", color: "transparent" }}
              >
                Outline
              </TextEffectCard>
              <TextEffectCard
                effect="gradient"
                name="Gradient"
                style={{
                  background: "linear-gradient(45deg, #0061A4, #00639D)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Gradient
              </TextEffectCard>
              <TextEffectCard effect="glow" name="Glow" style={{ textShadow: "0 0 10px #00639D" }}>
                Glow
              </TextEffectCard>
            </div>

            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Effect Intensity</span>
                <span className="text-sm text-gray-600">{effectIntensity}%</span>
              </div>
              <div className="relative h-8 flex items-center">
                <div className="absolute inset-0 bg-gradient-to-r from-[#5B21B6] to-[#7C3AED] rounded-full h-1 top-1/2 transform -translate-y-1/2"></div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={effectIntensity}
                  className="w-full h-1 appearance-none bg-transparent focus:outline-none"
                  onChange={(e) => setEffectIntensity(Number.parseInt(e.target.value))}
                />
                <div
                  className="absolute w-6 h-6 bg-white border-2 border-[#5B21B6] rounded-full shadow-md"
                  style={{ left: `calc(${effectIntensity}% - 12px)`, top: "50%", transform: "translateY(-50%)" }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
