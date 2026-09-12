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
import { useRouter } from "next/navigation";

export interface PublicationItem {
  year: number;
  facultyIds?: number[];
  type: string;
  indexing?: string;
}

interface PublicationsChartProps {
  data: PublicationItem[];
  facfilter?: string;
  startYear?: number | null;
  endYear?: number | null;
  isJ?: boolean;
}

const BURGUNDY_PALETTE = ["#85261e", "#c85a44", "#d97706", "#0d9488", "#475569", "#7c3aed"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#33110e] text-white p-3 rounded-xl shadow-xl border border-[#eedfd8]/30 text-xs space-y-1.5 z-50">
        <p className="font-bold text-sm border-b border-white/20 pb-1 text-[#eedfd8]">
          {label ? `Year: ${label}` : payload[0]?.name || "Publications"}
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

export default function PublicationsChart({
  data,
  facfilter,
  startYear,
  endYear,
  isJ,
}: PublicationsChartProps) {
  const [chartType, setChartType] = useState<ChartType>("bar");
  const router = useRouter();

  // Aggregate data by year and publication type or indexing
  const aggregatedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    if (isJ) {
      const map: Record<number, { year: number; sci: number; scopus: number; other: number; total: number }> = {};
      data.forEach((item) => {
        if (!map[item.year]) {
          map[item.year] = { year: item.year, sci: 0, scopus: 0, other: 0, total: 0 };
        }
        const idx = (item.indexing || "").toLowerCase();
        if (idx.includes("sci")) {
          map[item.year].sci += 1;
        } else if (idx.includes("scopus")) {
          map[item.year].scopus += 1;
        } else {
          map[item.year].other += 1;
        }
        map[item.year].total += 1;
      });
      return Object.values(map).sort((a, b) => a.year - b.year);
    } else {
      const map: Record<
        number,
        { year: number; journal: number; conference: number; book: number; bookchapter: number; total: number }
      > = {};
      data.forEach((item) => {
        if (!map[item.year]) {
          map[item.year] = { year: item.year, journal: 0, conference: 0, book: 0, bookchapter: 0, total: 0 };
        }
        const t = (item.type || "").toLowerCase().replace(/[\s_-]/g, "");
        if (t.includes("journal")) {
          map[item.year].journal += 1;
        } else if (t.includes("conference")) {
          map[item.year].conference += 1;
        } else if (t.includes("chapter")) {
          map[item.year].bookchapter += 1;
        } else if (t.includes("book")) {
          map[item.year].book += 1;
        } else {
          map[item.year].journal += 1;
        }
        map[item.year].total += 1;
      });
      return Object.values(map).sort((a, b) => a.year - b.year);
    }
  }, [data, isJ]);

  // Pie chart aggregation
  const pieData = useMemo(() => {
    if (!data || data.length === 0) return [];
    if (isJ) {
      const sci = data.filter((d) => (d.indexing || "").toLowerCase().includes("sci")).length;
      const scopus = data.filter((d) => (d.indexing || "").toLowerCase().includes("scopus")).length;
      const other = data.length - sci - scopus;
      return [
        { name: "SCI / SCIE", value: sci },
        { name: "Scopus", value: scopus },
        { name: "Other Indexing", value: Math.max(0, other) },
      ].filter((d) => d.value > 0);
    } else {
      let j = 0,
        c = 0,
        b = 0,
        bc = 0;
      data.forEach((d) => {
        const t = (d.type || "").toLowerCase().replace(/[\s_-]/g, "");
        if (t.includes("chapter")) bc++;
        else if (t.includes("book")) b++;
        else if (t.includes("conf")) c++;
        else j++;
      });
      return [
        { name: "Journals", value: j },
        { name: "Conferences", value: c },
        { name: "Books", value: b },
        { name: "Book Chapters", value: bc },
      ].filter((d) => d.value > 0);
    }
  }, [data, isJ]);

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border border-dashed border-[#eedfd8] rounded-2xl bg-[#fff9f6]/40 p-6 text-center">
        <p className="text-sm font-semibold text-neutral-600">No publication records match current filters</p>
        <p className="text-xs text-neutral-400 mt-1">Adjust year range or publication type filters above</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ChartTypeSelector value={chartType} onValueChange={setChartType} />

      <div className="h-[320px] w-full pt-2">
        {chartType === "bar" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={aggregatedData as any[]} margin={{ top: 15, right: 20, left: -10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eedfd8" opacity={0.6} />
              <XAxis dataKey="year" stroke="#78716c" fontSize={12} tickLine={false} />
              <YAxis stroke="#78716c" fontSize={12} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: 10, fontSize: "12px" }} />
              {isJ ? (
                <>
                  <Bar dataKey="sci" name="SCI/SCIE" fill="#85261e" stackId="a" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="scopus" name="Scopus" fill="#c85a44" stackId="a" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="other" name="Other" fill="#d97706" stackId="a" radius={[4, 4, 0, 0]} />
                </>
              ) : (
                <>
                  <Bar dataKey="journal" name="Journal" fill="#85261e" stackId="a" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="conference" name="Conference" fill="#c85a44" stackId="a" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="book" name="Book" fill="#d97706" stackId="a" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="bookchapter" name="Chapter" fill="#0d9488" stackId="a" radius={[4, 4, 0, 0]} />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        )}

        {chartType === "line" && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={aggregatedData as any[]} margin={{ top: 15, right: 20, left: -10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eedfd8" opacity={0.6} />
              <XAxis dataKey="year" stroke="#78716c" fontSize={12} tickLine={false} />
              <YAxis stroke="#78716c" fontSize={12} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: 10, fontSize: "12px" }} />
              {isJ ? (
                <>
                  <Line type="monotone" dataKey="sci" name="SCI/SCIE" stroke="#85261e" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="scopus" name="Scopus" stroke="#c85a44" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="other" name="Other" stroke="#d97706" strokeWidth={2} dot={{ r: 3 }} />
                </>
              ) : (
                <>
                  <Line type="monotone" dataKey="journal" name="Journal" stroke="#85261e" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="conference" name="Conference" stroke="#c85a44" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="book" name="Book" stroke="#d97706" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="bookchapter" name="Chapter" stroke="#0d9488" strokeWidth={2} dot={{ r: 3 }} />
                </>
              )}
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
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={true}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={BURGUNDY_PALETTE[index % BURGUNDY_PALETTE.length]} stroke="#fff" strokeWidth={1.5} />
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
