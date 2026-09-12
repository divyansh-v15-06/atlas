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

export interface PatentItem {
  id?: number | string;
  year: number;
  status: string;
  facultyIds?: number[];
}

interface PatentsChartProps {
  data: PatentItem[];
  facfilter?: string;
  startYear?: number | null;
  endYear?: number | null;
}

const PATENT_COLORS = ["#d97706", "#85261e", "#0d9488", "#475569"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#33110e] text-white p-3 rounded-xl shadow-xl border border-[#eedfd8]/30 text-xs space-y-1.5 z-50">
        <p className="font-bold text-sm border-b border-white/20 pb-1 text-[#eedfd8]">
          {label ? `Year: ${label}` : payload[0]?.name || "Patents"}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
              <span className="capitalize text-neutral-200">{entry.name}:</span>
            </div>
            <span className="font-bold text-white">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function PatentsChart({
  data,
  facfilter,
  startYear,
  endYear,
}: PatentsChartProps) {
  const [chartType, setChartType] = useState<ChartType>("bar");

  // Aggregate patents by year
  const aggregatedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const map: Record<number, { year: number; published: number; granted: number; total: number }> = {};

    data.forEach((item) => {
      if (!map[item.year]) {
        map[item.year] = { year: item.year, published: 0, granted: 0, total: 0 };
      }
      const st = (item.status || "").toLowerCase();
      if (st.includes("grant")) {
        map[item.year].granted += 1;
      } else {
        map[item.year].published += 1;
      }
      map[item.year].total += 1;
    });

    return Object.values(map).sort((a, b) => a.year - b.year);
  }, [data]);

  // Pie data by status
  const pieData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const granted = data.filter((d) => (d.status || "").toLowerCase().includes("grant")).length;
    const published = data.length - granted;
    return [
      { name: "Patents Granted", value: granted },
      { name: "Patents Published / Filed", value: published },
    ].filter((d) => d.value > 0);
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border border-dashed border-[#eedfd8] rounded-2xl bg-[#fff9f6]/40 p-6 text-center">
        <p className="text-sm font-semibold text-neutral-600">No patent records found</p>
        <p className="text-xs text-neutral-400 mt-1">Adjust year range or patent filters above</p>
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
              <Bar dataKey="granted" name="Patents Granted" fill="#85261e" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="published" name="Patents Published/Filed" fill="#d97706" stackId="a" radius={[4, 4, 0, 0]} />
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
              <Line type="monotone" dataKey="granted" name="Patents Granted" stroke="#85261e" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="published" name="Patents Published/Filed" stroke="#d97706" strokeWidth={2.5} dot={{ r: 4 }} />
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
                  <Cell key={`cell-${index}`} fill={PATENT_COLORS[index % PATENT_COLORS.length]} stroke="#fff" strokeWidth={1.5} />
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
