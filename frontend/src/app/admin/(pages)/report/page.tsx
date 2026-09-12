"use client";

import { useState } from "react";
import {
  ClipboardList,
  Download,
  FileSpreadsheet,
  FileText,
  Calendar,
  Sparkles,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import Papa from "papaparse";
import {
  MOCK_FACULTY,
  MOCK_PUBLICATIONS,
  MOCK_PATENTS,
  MOCK_PROJECTS,
  MOCK_CONSULTANCIES,
  MOCK_PHD_SCHOLARS,
} from "@/lib/mock-data";

export default function AdminReportPage() {
  const currentYear = new Date().getFullYear();
  const [startYear, setStartYear] = useState(currentYear - 3);
  const [endYear, setEndYear] = useState(currentYear);
  const [format, setFormat] = useState<"docx" | "csv" | "pdf">("csv");
  const [reportType, setReportType] = useState<"annual" | "nirf" | "naac" | "teaching">("annual");

  const yearOptions = Array.from({ length: 12 }, (_, i) => currentYear - 8 + i);

  const handleDownloadReport = () => {
    if (startYear > endYear) {
      toast.error("Start Year must be less than or equal to End Year");
      return;
    }

    toast.loading(`Compiling ${reportType.toUpperCase()} dataset for ${startYear}-${endYear}...`, {
      id: "report-toast",
    });

    setTimeout(() => {
      if (format === "csv") {
        let csvData: any[] = [];

        if (reportType === "annual") {
          csvData = MOCK_PUBLICATIONS.filter((p) => {
            const y = Number(p.year);
            return y >= startYear && y <= endYear;
          }).map((p) => ({
            "Academic Year Range": `${startYear}-${endYear}`,
            "Record Type": p.publication_type,
            Title: p.title,
            Journal: p.journal_or_conference_name,
            Year: p.year,
            DOI: p.doi,
            Indexing: p.journal_quartile || p.indexing || "Scopus",
          }));
        } else if (reportType === "nirf") {
          csvData = [
            {
              Criterion: "Faculty Headcount",
              Metric: MOCK_FACULTY.length,
              "Time Period": `${startYear}-${endYear}`,
            },
            {
              Criterion: "Ph.D. Scholars Graduated",
              Metric: MOCK_PHD_SCHOLARS.filter((s) => s.status === "passed").length,
              "Time Period": `${startYear}-${endYear}`,
            },
            {
              Criterion: "Publications in Scopus / WoS",
              Metric: MOCK_PUBLICATIONS.length,
              "Time Period": `${startYear}-${endYear}`,
            },
            {
              Criterion: "Sponsored Projects Total Sanctioned (INR Lakhs)",
              Metric: "₹ 248.50 Lakhs",
              "Time Period": `${startYear}-${endYear}`,
            },
            {
              Criterion: "Industrial Consultancies Revenue",
              Metric: "₹ 62.00 Lakhs",
              "Time Period": `${startYear}-${endYear}`,
            },
            {
              Criterion: "Patents Granted / Published",
              Metric: MOCK_PATENTS.length,
              "Time Period": `${startYear}-${endYear}`,
            },
          ];
        } else {
          csvData = MOCK_FACULTY.map((f) => ({
            Faculty: f.full_name,
            Designation: f.designation,
            Department: "Computer Science & Engineering",
            "Publications (All)": f.publications?.length || 0,
            "Sponsored Projects": f.projects?.length || 0,
            "Ph.D. Guided": f.supervisions?.length || 0,
          }));
        }

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `NITH_${reportType.toUpperCase()}_Report_${startYear}_${endYear}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(`Successfully downloaded ${reportType.toUpperCase()} dataset (.csv)!`, {
          id: "report-toast",
        });
      } else {
        // Mock download for docx / pdf
        const element = document.createElement("a");
        const file = new Blob(
          [
            `NATIONAL INSTITUTE OF TECHNOLOGY HAMIRPUR\nDEPARTMENT OF COMPUTER SCIENCE & ENGINEERING\n${reportType.toUpperCase()} ACCREDITATION REPORT (${startYear} - ${endYear})\n\nGenerated on: ${new Date().toLocaleString()}\nFaculty Count: ${MOCK_FACULTY.length}\nPublications: ${MOCK_PUBLICATIONS.length}\nPatents: ${MOCK_PATENTS.length}`,
          ],
          { type: "text/plain" }
        );
        element.href = URL.createObjectURL(file);
        element.download = `NITH_${reportType.toUpperCase()}_Report_${startYear}_${endYear}.${format}`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);

        toast.success(`Successfully downloaded ${reportType.toUpperCase()} report (.${format})!`, {
          id: "report-toast",
        });
      }
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 font-sans">
      {/* Top Banner */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold uppercase tracking-wider mb-2">
          <ClipboardList className="w-3.5 h-3.5" /> Accreditation &amp; Governance
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-[#1c110c] tracking-tight">
          Academic Report Generator
        </h1>
        <p className="mt-1 text-sm text-[#5c4033]">
          Compile and export official NIRF, NAAC Criterion-3, NBA, and Department Annual Reports with customizable date ranges.
        </p>
      </div>

      {/* Configuration Console */}
      <div className="rounded-2xl border border-[#eedfd8] bg-white p-6 md:p-8 shadow-xs space-y-6">
        <h2 className="text-lg font-black text-[#1c110c] border-b border-[#eedfd8] pb-3">
          Report Parameters &amp; Filter Criteria
        </h2>

        {/* 1. Report Type */}
        <div>
          <label className="block text-xs font-bold text-[#33110e] uppercase mb-2">
            Select Report Type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { id: "annual", label: "Annual Dept Report", desc: "Publications, events, honors" },
              { id: "nirf", label: "NIRF Metric Dataset", desc: "Faculty, funding, PhD metrics" },
              { id: "naac", label: "NAAC Criterion-3", desc: "R&D outlay, consultancies" },
              { id: "teaching", label: "Teaching Load Audit", desc: "Course allocations, credits" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setReportType(t.id as any)}
                className={`p-4 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  reportType === t.id
                    ? "bg-[#fff9f6] border-[#85261e] ring-1 ring-[#85261e]"
                    : "bg-white border-[#eedfd8] hover:bg-neutral-50"
                }`}
              >
                <div>
                  <p className="font-black text-sm text-[#1c110c]">{t.label}</p>
                  <p className="text-xs text-[#5c4033] mt-1 leading-relaxed">{t.desc}</p>
                </div>
                {reportType === t.id && (
                  <CheckCircle2 className="w-4 h-4 text-[#85261e] mt-2 self-end" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Date Range & Format Pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
              Start Year
            </label>
            <select
              value={startYear}
              onChange={(e) => setStartYear(Number(e.target.value))}
              className="w-full rounded-xl border border-[#eedfd8] bg-white px-3.5 py-2.5 text-sm font-bold text-[#1c110c] focus:outline-none focus:border-[#85261e]"
            >
              {yearOptions.map((y) => (
                <option key={`start-${y}`} value={y}>
                  Academic Year {y}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
              End Year
            </label>
            <select
              value={endYear}
              onChange={(e) => setEndYear(Number(e.target.value))}
              className="w-full rounded-xl border border-[#eedfd8] bg-white px-3.5 py-2.5 text-sm font-bold text-[#1c110c] focus:outline-none focus:border-[#85261e]"
            >
              {yearOptions.map((y) => (
                <option key={`end-${y}`} value={y}>
                  Academic Year {y}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
              Output Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              className="w-full rounded-xl border border-[#eedfd8] bg-white px-3.5 py-2.5 text-sm font-bold text-[#1c110c] focus:outline-none focus:border-[#85261e]"
            >
              <option value="csv">CSV Spreadsheet (.csv)</option>
              <option value="docx">Microsoft Word (.docx)</option>
              <option value="pdf">Adobe PDF Document (.pdf)</option>
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-4 border-t border-[#eedfd8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="text-xs text-[#5c4033] flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#85261e]" /> Time Interval: <strong>{startYear} – {endYear}</strong> ({endYear - startYear + 1} Academic Sessions)
          </span>

          <button
            type="button"
            onClick={handleDownloadReport}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] px-6 py-3 text-sm font-bold text-white transition shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" /> Download Official {reportType.toUpperCase()} Report
          </button>
        </div>
      </div>
    </div>
  );
}
