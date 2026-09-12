"use client";

import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { type ChartType, ChartTypeSelector } from "../chart-type-selector";

export interface ProjectItem {
  id?: number | string;
  year: number;
  status: string;
  funding: number;
  facultyIds?: number[];
}

interface ProjectsChartProps {
  data: ProjectItem[];
  facfilter?: string;
  startYear?: number | null;
  endYear?: number | null;
}

const PROJECT_PALETTE = ["#0d9488", "#85261e", "#d97706", "#475569"];

function formatINR(val: number): string {
  if (val >= 10000000) {
    return `₹${(val / 10000000).toFixed(2)} Cr`;
  }
  if (val >= 100000) {
    return `₹${(val / 100000).toFixed(1)} L`;
  }
  return `₹${val.toLocaleString("en-IN")}`;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#33110e] text-white p-3 rounded-xl shadow-xl border border-[#eedfd8]/30 text-xs space-y-1.5 z-50">
        <p className="font-bold text-sm border-b border-white/20 pb-1 text-[#eedfd8]">
          {label ? `Year: ${label}` : payload[0]?.name || "Research Projects"}
        </p>
        {payload.map((entry: any, index: number) => {
          const isFunding = entry.dataKey?.toString().toLowerCase().includes("funding");
          return (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
                <span className="capitalize text-neutral-200">{entry.name}:</span>
              </div>
              <span className="font-bold text-white">
                {isFunding ? formatINR(entry.value) : entry.value}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

export default function ProjectsChart({
  data,
  facfilter,
  startYear,
  endYear,
}: ProjectsChartProps) {
  const [chartType, setChartType] = useState<ChartType>("bar");

  // Aggregate projects by year
  const aggregatedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const map: Record<
      number,
      { year: number; ongoing: number; completed: number; ongoingFunding: number; completedFunding: number; totalFunding: number; total: number }
    > = {};

    data.forEach((p) => {
      if (!map[p.year]) {
        map[p.year] = {
          year: p.year,
          ongoing: 0,
          completed: 0,
          ongoingFunding: 0,
          completedFunding: 0,
          totalFunding: 0,
          total: 0,
        };
      }
      const st = (p.status || "").toLowerCase();
      const fund = Number(p.funding) || 0;
      if (st.includes("ongoing")) {
        map[p.year].ongoing += 1;
        map[p.year].ongoingFunding += fund;
      } else {
        map[p.year].completed += 1;
        map[p.year].completedFunding += fund;
      }
      map[p.year].totalFunding += fund;
      map[p.year].total += 1;
    });

    return Object.values(map).sort((a, b) => a.year - b.year);
  }, [data]);

  // Pie chart by project status
  const pieData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const ongoing = data.filter((d) => (d.status || "").toLowerCase().includes("ongoing")).length;
    const completed = data.length - ongoing;
    return [
      { name: "Ongoing Projects", value: ongoing },
      { name: "Completed Projects", value: completed },
    ].filter((d) => d.value > 0);
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border border-dashed border-[#eedfd8] rounded-2xl bg-[#fff9f6]/40 p-6 text-center">
        <p className="text-sm font-semibold text-neutral-600">No research project records found</p>
        <p className="text-xs text-neutral-400 mt-1">Try expanding the year range or funding range filters</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ChartTypeSelector value={chartType} onValueChange={setChartType} />

      <div className="h-[320px] w-full pt-2">
        {chartType === "bar" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={aggregatedData} margin={{ top: 15, right: 20, left: -10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eedfd8" opacity={0.6} />
              <XAxis dataKey="year" stroke="#78716c" fontSize={12} tickLine={false} />
              <YAxis stroke="#78716c" fontSize={12} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: 10, fontSize: "12px" }} />
              <Bar dataKey="ongoing" name="Ongoing Projects" fill="#0d9488" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="completed" name="Completed Projects" fill="#85261e" stackId="a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {chartType === "line" && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={aggregatedData} margin={{ top: 15, right: 20, left: -10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eedfd8" opacity={0.6} />
              <XAxis dataKey="year" stroke="#78716c" fontSize={12} tickLine={false} />
              <YAxis stroke="#78716c" fontSize={12} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: 10, fontSize: "12px" }} />
              <Line type="monotone" dataKey="ongoing" name="Ongoing Projects" stroke="#0d9488" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="completed" name="Completed Projects" stroke="#85261e" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="total" name="Total Projects" stroke="#d97706" strokeWidth={1.8} strokeDasharray="3 3" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}

        {chartType === "pie" && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={true}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PROJECT_PALETTE[index % PROJECT_PALETTE.length]} stroke="#fff" strokeWidth={1.5} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: 10, fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
