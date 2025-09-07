"use client"

import type React from "react"

import { memo } from "react"
import {
  BarChart,
  LineChart,
  PieChart,
  AreaChart,
  ScatterChart,
  Bar,
  Line,
  Pie,
  Area,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts"
import type { ChartElement as ChartElementType } from "@/types/document-builder"

interface ChartElementProps {
  element: ChartElementType
}

const ChartElementComponent: React.FC<ChartElementProps> = ({ element }) => {
  const { chartType, chartData, title, xAxisLabel, yAxisLabel, showLegend, colors, size } = element

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <BarChart
            width={size.width - 20}
            height={size.height - 40}
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" label={{ value: xAxisLabel, position: "insideBottom", offset: -5 }} />
            <YAxis label={{ value: yAxisLabel, angle: -90, position: "insideLeft" }} />
            <Tooltip />
            {showLegend && <Legend />}
            <Bar dataKey="value">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        )

      case "line":
        return (
          <LineChart
            width={size.width - 20}
            height={size.height - 40}
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" label={{ value: xAxisLabel, position: "insideBottom", offset: -5 }} />
            <YAxis label={{ value: yAxisLabel, angle: -90, position: "insideLeft" }} />
            <Tooltip />
            {showLegend && <Legend />}
            <Line type="monotone" dataKey="value" stroke={colors[0]} strokeWidth={2} />
          </LineChart>
        )

      case "pie":
        return (
          <PieChart width={size.width - 20} height={size.height - 40}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={(Math.min(size.width, size.height) - 80) / 2}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            {showLegend && <Legend />}
          </PieChart>
        )

      case "area":
        return (
          <AreaChart
            width={size.width - 20}
            height={size.height - 40}
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" label={{ value: xAxisLabel, position: "insideBottom", offset: -5 }} />
            <YAxis label={{ value: yAxisLabel, angle: -90, position: "insideLeft" }} />
            <Tooltip />
            {showLegend && <Legend />}
            <Area type="monotone" dataKey="value" stroke={colors[0]} fill={colors[0]} />
          </AreaChart>
        )

      case "scatter":
        return (
          <ScatterChart
            width={size.width - 20}
            height={size.height - 40}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="x"
              name={xAxisLabel}
              label={{ value: xAxisLabel, position: "insideBottom", offset: -5 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name={yAxisLabel}
              label={{ value: yAxisLabel, angle: -90, position: "insideLeft" }}
            />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            {showLegend && <Legend />}
            <Scatter name="Data Points" data={chartData} fill={colors[0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Scatter>
          </ScatterChart>
        )

      default:
        return <div>Unsupported chart type</div>
    }
  }

  return (
    <div className="w-full h-full flex flex-col">
      {title && <h3 className="text-center font-medium text-md-on-surface mb-2">{title}</h3>}
      <div className="flex-1 flex items-center justify-center">{renderChart()}</div>
    </div>
  )
}

export const ChartElement = memo(ChartElementComponent)
