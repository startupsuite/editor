"use client"

import type React from "react"

import { useState } from "react"
import { Modal } from "@/components/ui/modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDocument } from "@/context/document-context"
import { useRipple } from "@/hooks/use-ripple"

interface ChartModalProps {
  isOpen: boolean
  onClose: () => void
}

type ChartType = "bar" | "line" | "pie" | "area" | "scatter"

interface ChartOption {
  id: ChartType
  name: string
  icon: string
  description: string
  category: "comparison" | "trend" | "proportion" | "correlation"
}

const CHART_OPTIONS: ChartOption[] = [
  {
    id: "bar",
    name: "Bar Chart",
    icon: "bar_chart",
    description: "Compare data across categories",
    category: "comparison",
  },
  {
    id: "line",
    name: "Line Chart",
    icon: "show_chart",
    description: "Show trends over time",
    category: "trend",
  },
  {
    id: "pie",
    name: "Pie Chart",
    icon: "pie_chart",
    description: "Show proportions of a whole",
    category: "proportion",
  },
  {
    id: "area",
    name: "Area Chart",
    icon: "area_chart",
    description: "Similar to line chart with filled areas",
    category: "trend",
  },
  {
    id: "scatter",
    name: "Scatter Plot",
    icon: "scatter_plot",
    description: "Show correlation between variables",
    category: "correlation",
  },
]

export const ChartsModal: React.FC<ChartModalProps> = ({ isOpen, onClose }) => {
  const { createRipple } = useRipple()
  const { addElement } = useDocument()
  const [activeTab, setActiveTab] = useState<string>("all")

  const handleSelectChart = (chartType: ChartType) => {
    // Add a new chart element to the document
    addElement({
      type: "chart",
      chartType,
      chartData: generateSampleData(chartType),
      position: { x: 200, y: 150 },
      size: { width: 400, height: 300 },
      rotation: 0,
      zIndex: 1,
      title: `My ${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart`,
      xAxisLabel: "Categories",
      yAxisLabel: "Values",
      showLegend: true,
      colors: ["#6750A4", "#7F67BE", "#9A82DB", "#B598F8", "#D0BCFF"],
    })

    onClose()
  }

  const generateSampleData = (chartType: ChartType) => {
    switch (chartType) {
      case "bar":
      case "pie":
        return [
          { name: "Category A", value: 400 },
          { name: "Category B", value: 300 },
          { name: "Category C", value: 200 },
          { name: "Category D", value: 278 },
          { name: "Category E", value: 189 },
        ]
      case "line":
      case "area":
        return [
          { name: "Jan", value: 400 },
          { name: "Feb", value: 300 },
          { name: "Mar", value: 600 },
          { name: "Apr", value: 800 },
          { name: "May", value: 500 },
          { name: "Jun", value: 700 },
        ]
      case "scatter":
        return [
          { x: 100, y: 200, name: "Point A" },
          { x: 120, y: 100, name: "Point B" },
          { x: 170, y: 300, name: "Point C" },
          { x: 140, y: 250, name: "Point D" },
          { x: 150, y: 400, name: "Point E" },
          { x: 110, y: 280, name: "Point F" },
        ]
      default:
        return []
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Chart" width="600px">
      <div className="p-6">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start mb-6 border-b border-md-outline-variant">
            <TabsTrigger
              value="all"
              className={`py-3 px-4 text-sm font-medium relative ${activeTab === "all" ? "text-md-primary" : "text-md-on-surface-variant"}`}
            >
              All Charts
              {activeTab === "all" && (
                <div className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-md-primary rounded-t-full"></div>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="comparison"
              className={`py-3 px-4 text-sm font-medium relative ${activeTab === "comparison" ? "text-md-primary" : "text-md-on-surface-variant"}`}
            >
              Comparison
              {activeTab === "comparison" && (
                <div className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-md-primary rounded-t-full"></div>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="trend"
              className={`py-3 px-4 text-sm font-medium relative ${activeTab === "trend" ? "text-md-primary" : "text-md-on-surface-variant"}`}
            >
              Trends
              {activeTab === "trend" && (
                <div className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-md-primary rounded-t-full"></div>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="proportion"
              className={`py-3 px-4 text-sm font-medium relative ${activeTab === "proportion" ? "text-md-primary" : "text-md-on-surface-variant"}`}
            >
              Proportions
              {activeTab === "proportion" && (
                <div className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-md-primary rounded-t-full"></div>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="correlation"
              className={`py-3 px-4 text-sm font-medium relative ${activeTab === "correlation" ? "text-md-primary" : "text-md-on-surface-variant"}`}
            >
              Correlation
              {activeTab === "correlation" && (
                <div className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-md-primary rounded-t-full"></div>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {CHART_OPTIONS.map((chart) => (
                <ChartCard key={chart.id} chart={chart} onClick={() => handleSelectChart(chart.id)} />
              ))}
            </div>
          </TabsContent>

          {["comparison", "trend", "proportion", "correlation"].map((category) => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {CHART_OPTIONS.filter((chart) => chart.category === category).map((chart) => (
                  <ChartCard key={chart.id} chart={chart} onClick={() => handleSelectChart(chart.id)} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Modal>
  )
}

interface ChartCardProps {
  chart: ChartOption
  onClick: () => void
}

const ChartCard: React.FC<ChartCardProps> = ({ chart, onClick }) => {
  const { createRipple } = useRipple()

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    createRipple(e)
    onClick()
  }

  return (
    <div
      className="border border-md-outline-variant rounded-md-lg p-4 flex flex-col items-center gap-2 hover:bg-md-surface-container-low cursor-pointer transition-colors duration-200 relative overflow-hidden"
      onClick={handleClick}
    >
      <div className="text-md-primary">
        <i className="material-icons text-3xl">{chart.icon}</i>
      </div>
      <h3 className="font-medium text-md-on-surface">{chart.name}</h3>
      <p className="text-xs text-md-on-surface-variant text-center">{chart.description}</p>
    </div>
  )
}
