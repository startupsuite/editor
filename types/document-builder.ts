export type ElementType = "text" | "shape" | "image" | "chart"

export type ShapeType =
  | "rect"
  | "circle"
  | "triangle"
  | "line"
  | "arrow-right"
  | "arrow-left"
  | "arrow-up"
  | "arrow-down"
  | "solid-line"
  | "dashed-line"
  | "dotted-line"
  | "thick-line"

export type TextType = "heading1" | "heading2" | "heading3" | "subtitle" | "body" | "quote"

export type TextEffect = "shadow" | "outline" | "gradient" | "glow" | "none"

export type FontFamily =
  | "font-roboto"
  | "font-poppins"
  | "font-playfair"
  | "font-merriweather"
  | "font-montserrat"
  | "font-opensans"

export type TextAlignment = "left" | "center" | "right" | "justify"

export type BorderStyle = "solid" | "dashed" | "dotted"

export type ChartType = "bar" | "line" | "pie" | "area" | "scatter"

export interface Position {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface BaseElement {
  id: string
  type: ElementType
  position: Position
  size: Size
  rotation: number
  zIndex: number
}

export interface TextElement extends BaseElement {
  type: "text"
  content: string
  textType: TextType
  fontFamily: FontFamily
  fontSize: number
  color: string
  bold: boolean
  italic: boolean
  underline: boolean
  strikethrough: boolean
  alignment: TextAlignment
  effect: TextEffect
  effectIntensity: number
}

export interface ShapeElement extends BaseElement {
  type: "shape"
  shapeType: ShapeType
  fillColor: string
  borderColor: string
  borderWidth: number
  borderStyle: BorderStyle
  opacity: number
  // New text properties for shapes
  hasText: boolean
  text?: string
  textProps?: {
    fontFamily: FontFamily
    fontSize: number
    color: string
    bold: boolean
    italic: boolean
    underline: boolean
    strikethrough: boolean
    alignment: TextAlignment
    effect: TextEffect
    effectIntensity: number
  }
}

export interface ImageElement extends BaseElement {
  type: "image"
  src: string
  alt: string
  opacity: number
}

export interface ChartElement extends BaseElement {
  type: "chart"
  chartType: ChartType
  chartData: any[]
  title: string
  xAxisLabel: string
  yAxisLabel: string
  showLegend: boolean
  colors: string[]
}

export type SlideElement = TextElement | ShapeElement | ImageElement | ChartElement

export interface Slide {
  id: string
  elements: SlideElement[]
  background: string
}

export interface Document {
  id: string
  title: string
  slides: Slide[]
  currentSlideIndex: number
}
