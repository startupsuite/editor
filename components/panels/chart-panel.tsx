"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDocument } from "@/context/document-context"
import { useRipple } from "@/hooks/use-ripple"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ChartElement } from "@/types/document-builder"

interface ChartPanelProps {
  isOpen: boolean
  onClose: () => void
  selectedElement: ChartElement | null
}

export const ChartPanel: React.FC<ChartPanelProps> = ({ isOpen, onClose, selectedElement }) => {
  const { updateElement } = useDocument()
  const { createRipple } = useRipple()
  const [activeTab, setActiveTab] = useState<string>("data")

  // Local state for chart properties
  const [chartTitle, setChartTitle] = useState<string>("")
  const [xAxisLabel, setXAxisLabel] = useState<string>("")
  const [yAxisLabel, setYAxisLabel] = useState<string>("")
  const [showLegend, setShowLegend] = useState<boolean>(true)
  const [chartData, setChartData] = useState<any[]>([])
  const [colors, setColors] = useState<string[]>([])

  // Update local state when selected element changes
  useEffect(() => {
    if (selectedElement) {
      setChartTitle(selectedElement.title)
      setXAxisLabel(selectedElement.xAxisLabel)
      setYAxisLabel(selectedElement.yAxisLabel)
      setShowLegend(selectedElement.showLegend)
      setChartData(selectedElement.chartData)
      setColors(selectedElement.colors)
    }
  }, [selectedElement])

  // Apply changes to the element
  const applyChanges = () => {
    if (!selectedElement) return

    updateElement({
      ...selectedElement,
      title: chartTitle,
      xAxisLabel,
      yAxisLabel,
      showLegend,
      chartData,
      colors,
    })
  }

  // Handle data changes
  const handleDataChange = (index: number, field: string, value: any) => {
    const newData = [...chartData]
    newData[index] = { ...newData[index], [field]: value }
    setChartData(newData)
  }

  // Add new data point
  const handleAddDataPoint = () => {
    if (selectedElement?.chartType === "scatter") {
      setChartData([...chartData, { x: 0, y: 0, name: `Point ${chartData.length + 1}` }])
    } else {
      setChartData([...chartData, { name: `Item ${chartData.length + 1}`, value: 0 }])
    }
  }

  // Remove data point
  const handleRemoveDataPoint = (index: number) => {
    setChartData(chartData.filter((_, i) => i !== index))
  }

  // Handle color change
  const handleColorChange = (index: number, color: string) => {
    const newColors = [...colors]
    newColors[index] = color
    setColors(newColors)
  }

  // Auto-apply changes when properties change
  useEffect(() => {
    applyChanges()
  }, [chartTitle, xAxisLabel, yAxisLabel, showLegend, chartData, colors])

  if (!isOpen || !selectedElement) return null

  return (
    <div className={`side-panel ${isOpen ? "open" : ""}`} id="chart-panel">
      <div className="panel-header">
        <div className="panel-title">Chart Editor</div>
        <div className="panel-close" onClick={onClose}>
          <i className="material-icons">close</i>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
        <TabsList className="px-4 border-b w-full justify-start">
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="axes">Axes</TabsTrigger>
        </TabsList>

        {/* Data Tab */}
        <TabsContent value="data" className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-medium">Chart Data</h3>
              <button
                className="px-3 py-1 rounded-md-md bg-canva-purple text-white text-sm"
                onClick={handleAddDataPoint}
              >
                Add Item
              </button>
            </div>

            <div className="space-y-2">
              {chartData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleDataChange(index, "name", e.target.value)}
                    className="flex-1 p-2 border border-md-outline-variant rounded-md-sm text-sm"
                    placeholder="Label"
                  />

                  {selectedElement.chartType === "scatter" ? (
                    <>
                      <input
                        type="number"
                        value={item.x}
                        onChange={(e) => handleDataChange(index, "x", Number(e.target.value))}
                        className="w-16 p-2 border border-md-outline-variant rounded-md-sm text-sm"
                        placeholder="X"
                      />
                      <input
                        type="number"
                        value={item.y}
                        onChange={(e) => handleDataChange(index, "y", Number(e.target.value))}
                        className="w-16 p-2 border border-md-outline-variant rounded-md-sm text-sm"
                        placeholder="Y"
                      />
                    </>
                  ) : (
                    <input
                      type="number"
                      value={item.value}
                      onChange={(e) => handleDataChange(index, "value", Number(e.target.value))}
                      className="w-24 p-2 border border-md-outline-variant rounded-md-sm text-sm"
                      placeholder="Value"
                    />
                  )}

                  <button
                    className="w-8 h-8 flex items-center justify-center text-red-500"
                    onClick={() => handleRemoveDataPoint(index)}
                  >
                    <i className="material-icons text-sm">delete</i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Style Tab */}
        <TabsContent value="style" className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-md-on-surface-variant">Chart Title</label>
              <input
                type="text"
                value={chartTitle}
                onChange={(e) => setChartTitle(e.target.value)}
                className="w-full p-2 border border-md-outline-variant rounded-md-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-md-on-surface-variant">Show Legend</label>
              <div className="flex items-center">
                <div
                  className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ${
                    showLegend ? "bg-canva-purple" : "bg-md-surface-variant"
                  }`}
                  onClick={() => setShowLegend(!showLegend)}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-200 ${
                      showLegend ? "left-7 bg-white" : "left-1 bg-md-on-surface-variant"
                    }`}
                  ></div>
                </div>
                <span className="ml-3 text-md-on-surface-variant">{showLegend ? "Enabled" : "Disabled"}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-md-on-surface-variant">Colors</label>
              <div className="flex flex-wrap gap-2">
                {colors.map((color, index) => (
                  <div key={index} className="relative">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => handleColorChange(index, e.target.value)}
                      className="w-8 h-8 rounded-md-sm cursor-pointer border border-md-outline-variant"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Axes Tab */}
        <TabsContent value="axes" className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-md-on-surface-variant">X-Axis Label</label>
              <input
                type="text"
                value={xAxisLabel}
                onChange={(e) => setXAxisLabel(e.target.value)}
                className="w-full p-2 border border-md-outline-variant rounded-md-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-md-on-surface-variant">Y-Axis Label</label>
              <input
                type="text"
                value={yAxisLabel}
                onChange={(e) => setYAxisLabel(e.target.value)}
                className="w-full p-2 border border-md-outline-variant rounded-md-sm"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
