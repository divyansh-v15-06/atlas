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

export interface EventItem {
  id?: number | string;
  year: number;
  type: string;
  facultyIds?: number[];
}

interface EventsChartProps {
  data: EventItem[];
  facfilter?: string;
  startYear?: number | null;
  endYear?: number | null;
}

const EVENT_COLORS = ["#85261e", "#0d9488", "#d97706", "#475569", "#c85a44", "#7c3aed"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#33110e] text-white p-3 rounded-xl shadow-xl border border-[#eedfd8]/30 text-xs space-y-1.5 z-50">
        <p className="font-bold text-sm border-b border-white/20 pb-1 text-[#eedfd8]">
          {label ? `Year: ${label}` : payload[0]?.name || "Events"}
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

export default function EventsChart({
  data,
  facfilter,
  startYear,
  endYear,
}: EventsChartProps) {
  const [chartType, setChartType] = useState<ChartType>("bar");

  // Aggregate events by year
  const aggregatedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const map: Record<
      number,
      { year: number; stc: number; workshop: number; conference: number; gian: number; total: number }
    > = {};

    data.forEach((item) => {
      if (!map[item.year]) {
        map[item.year] = { year: item.year, stc: 0, workshop: 0, conference: 0, gian: 0, total: 0 };
      }
      const t = (item.type || "").toLowerCase().replace(/[\s_-]/g, "");
      if (t.includes("gian")) {
        map[item.year].gian += 1;
      } else if (t.includes("workshop")) {
        map[item.year].workshop += 1;
      } else if (t.includes("conference") || t.includes("conf")) {
        map[item.year].conference += 1;
      } else {
        map[item.year].stc += 1; // STC / FDP / Symposium / Seminar
      }
      map[item.year].total += 1;
    });

    return Object.values(map).sort((a, b) => a.year - b.year);
  }, [data]);

  // Pie chart by event category
  const pieData = useMemo(() => {
    if (!data || data.length === 0) return [];
    let stc = 0,
      ws = 0,
      conf = 0,
      gian = 0;
    data.forEach((item) => {
      const t = (item.type || "").toLowerCase().replace(/[\s_-]/g, "");
      if (t.includes("gian")) gian++;
      else if (t.includes("workshop")) ws++;
      else if (t.includes("conference") || t.includes("conf")) conf++;
      else stc++;
    });
    return [
      { name: "FDP / STC", value: stc },
      { name: "Workshops", value: ws },
      { name: "Conferences", value: conf },
      { name: "GIAN / Other", value: gian },
    ].filter((d) => d.value > 0);
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border border-dashed border-[#eedfd8] rounded-2xl bg-[#fff9f6]/40 p-6 text-center">
        <p className="text-sm font-semibold text-neutral-600">No event records found</p>
        <p className="text-xs text-neutral-400 mt-1">Adjust year range or event type filters above</p>
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
              <Bar dataKey="stc" name="FDP / STC" fill="#85261e" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="workshop" name="Workshop" fill="#0d9488" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="conference" name="Conference" fill="#d97706" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="gian" name="GIAN" fill="#475569" stackId="a" radius={[4, 4, 0, 0]} />
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
              <Line type="monotone" dataKey="stc" name="FDP / STC" stroke="#85261e" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="workshop" name="Workshop" stroke="#0d9488" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="conference" name="Conference" stroke="#d97706" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="gian" name="GIAN" stroke="#475569" strokeWidth={2} dot={{ r: 3 }} />
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
                  <Cell key={`cell-${index}`} fill={EVENT_COLORS[index % EVENT_COLORS.length]} stroke="#fff" strokeWidth={1.5} />
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
