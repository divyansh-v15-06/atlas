"use client"

import { BarChart3, PieChart, LineChart } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export type ChartType = "bar" | "pie" | "line"

interface ChartTypeSelectorProps {
  value: ChartType
  onValueChange: (value: ChartType) => void
}

export function ChartTypeSelector({ value, onValueChange }: ChartTypeSelectorProps) {
  return (
    <div className="flex items-center justify-end mb-3 gap-2">
      <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">View:</span>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(val) => val && onValueChange(val as ChartType)}
        className="bg-[#faf8f6] p-0.5 rounded-lg border border-[#eedfd8]"
      >
        <ToggleGroupItem
          value="bar"
          aria-label="Bar Chart"
          title="Bar Chart"
          className="data-[state=on]:bg-[#85261e] data-[state=on]:text-white text-neutral-600 hover:text-[#85261e] h-8 px-2.5 text-xs font-medium rounded-md transition-colors"
        >
          <BarChart3 className="h-3.5 w-3.5 mr-1" />
          <span>Bar</span>
        </ToggleGroupItem>
        <ToggleGroupItem
          value="pie"
          aria-label="Pie Chart"
          title="Pie Chart"
          className="data-[state=on]:bg-[#85261e] data-[state=on]:text-white text-neutral-600 hover:text-[#85261e] h-8 px-2.5 text-xs font-medium rounded-md transition-colors"
        >
          <PieChart className="h-3.5 w-3.5 mr-1" />
          <span>Pie</span>
        </ToggleGroupItem>
        <ToggleGroupItem
          value="line"
          aria-label="Line Chart"
          title="Line Chart"
          className="data-[state=on]:bg-[#85261e] data-[state=on]:text-white text-neutral-600 hover:text-[#85261e] h-8 px-2.5 text-xs font-medium rounded-md transition-colors"
        >
          <LineChart className="h-3.5 w-3.5 mr-1" />
          <span>Line</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

