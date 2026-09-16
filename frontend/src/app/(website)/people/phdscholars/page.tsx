"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ExternalLink,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Calendar,
  UserCheck,
  Mail,
  LayoutGrid,
  Table as TableIcon,
  BookOpen,
  Award,
} from "lucide-react";
import { FaLinkedin, FaGoogle } from "react-icons/fa";
import { SiScopus } from "react-icons/si";
import { MOCK_PHD_SCHOLARS } from "@/lib/mock-data";
import { useDepartment } from "@/context/department-context";
import { DepartmentEmptyState } from "@/components/common/department-empty-state";

const ITEMS_PER_PAGE = 24;

const normalizeScholar = (p: any) => {
  const statusStr = String(p.status || "").toLowerCase();
  const isPassed =
    statusStr === "passed" ||
    statusStr === "completed" ||
    statusStr === "alumni" ||
    statusStr.includes("award");
  return {
    ...p,
    id: p.id || p.enrollment_number || p.roll_number || Math.random().toString(),
    name: p.name || p.full_name || "Ph.D. Scholar",
    enrollment_number: p.enrollment_number || p.roll_number || "",
    status: isPassed ? ("passed" as const) : ("pursuing" as const),
    supervisor: p.supervisor || p.supervisor_name || "Faculty Supervisor",
    co_supervisor: p.co_supervisor || p.co_supervisor_name || "",
    last_qualification: p.last_qualification || "Ph.D. Scholar",
    research_area: p.research_area || p.area_of_research || "",
    topic: p.topic || p.dissertation_title || "",
    dissertation_title: p.dissertation_title || p.topic || "",
    email: p.email || "",
    photo_url: p.photo_url || p.image_url || p.photo || "",
    registration_year:
      p.registration_year ||
      p.admission_year ||
      (p.registration_date ? String(p.registration_date).split("-")[0] : ""),
    end_date: p.end_date || p.defense_date || "",
    linkedin_url: p.linkedin_url || p.linkedin || "",
    google_scholar_url: p.google_scholar_url || p.google_scholar || "",
    scopus_url: p.scopus_url || p.scopus || "",
  };
};

interface ScholarCardProps {
  sch: any;
}

function ScholarCard({ sch }: ScholarCardProps) {
  const [imgError, setImgError] = useState(false);
  const isPassed = sch.status === "passed";
  const photo = sch.photo_url || sch.image_url || sch.photo;

  return (
    <div className="bg-white rounded-2xl border border-[#eedfd8] p-5 shadow-xs hover:shadow-md hover:border-[#85261e]/40 transition duration-200 flex flex-col justify-between space-y-4 group">
      <div className="space-y-3.5">
        {/* Header with Roll No and Status Badge */}
        <div className="flex items-center justify-between gap-2 border-b border-[#eedfd8]/60 pb-3">
          <span className="font-mono text-xs font-bold text-[#85261e] bg-[#fff9f6] px-2.5 py-0.5 rounded-md border border-[#eedfd8]">
            {sch.enrollment_number || "Ph.D. Scholar"}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
              isPassed
                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                : "bg-sky-50 text-sky-800 border-sky-300"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isPassed ? "bg-emerald-600" : "bg-sky-500 animate-pulse"
              }`}
            />
            {isPassed ? "Degree Awarded (Alumni)" : "Ongoing Research"}
          </span>
        </div>

        {/* Scholar Profile Photo + Name & Socials */}
        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0">
            {photo && !imgError ? (
              <img
                src={photo}
                alt={sch.name}
                onError={() => setImgError(true)}
                className="w-24 h-28 sm:w-28 sm:h-32 object-cover object-top rounded-xl border border-[#eedfd8] shadow-xs group-hover:shadow-sm transition"
              />
            ) : (
              <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-xl bg-gradient-to-br from-[#fdf5f2] to-[#eedfd8] border border-[#eedfd8] flex flex-col items-center justify-center text-[#85261e] p-2 text-center">
                <GraduationCap className="w-8 h-8 opacity-50 mb-1" />
                <span className="text-[10px] font-bold text-[#33110e] line-clamp-1">
                  {sch.name?.split(" ")[0]}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-1.5">
            <h2 className="text-base font-bold text-[#1c110c] group-hover:text-[#85261e] transition leading-snug">
              {sch.name}
            </h2>

            {sch.last_qualification && (
              <div className="inline-block bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-[10px] font-bold px-2 py-0.5 rounded">
                {sch.last_qualification}
              </div>
            )}

            {sch.email && (
              <a
                href={`mailto:${sch.email}`}
                className="flex items-center gap-1 text-xs text-neutral-500 hover:text-[#85261e] transition truncate"
                title={sch.email}
              >
                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{sch.email}</span>
              </a>
            )}

            {/* Social & Research Links */}
            <div className="flex items-center gap-2 pt-1">
              {sch.linkedin_url && (
                <a
                  href={
                    sch.linkedin_url.startsWith("http")
                      ? sch.linkedin_url
                      : `https://${sch.linkedin_url}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-[#0077b5] hover:bg-[#0077b5] hover:text-white transition shadow-2xs"
                  title="LinkedIn Profile"
                >
                  <FaLinkedin className="w-3.5 h-3.5" />
                </a>
              )}
              {sch.google_scholar_url && (
                <a
                  href={
                    sch.google_scholar_url.startsWith("http")
                      ? sch.google_scholar_url
                      : `https://${sch.google_scholar_url}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-[#4285F4] hover:bg-[#4285F4] hover:text-white transition shadow-2xs"
                  title="Google Scholar Profile"
                >
                  <FaGoogle className="w-3.5 h-3.5" />
                </a>
              )}
              {sch.scopus_url && (
                <a
                  href={
                    sch.scopus_url.startsWith("http")
                      ? sch.scopus_url
                      : `https://${sch.scopus_url}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-[#ff671b] hover:bg-[#ff671b] hover:text-white transition shadow-2xs"
                  title="Scopus Author Profile"
                >
                  <SiScopus className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Research Area & Topic */}
        <div className="bg-[#fff9f6] border border-[#eedfd8]/80 rounded-xl p-3 text-xs leading-relaxed space-y-1">
          {sch.research_area && (
            <div className="text-[11px] text-neutral-600">
              <span className="font-bold text-[#33110e]">Area: </span>
              <span>{sch.research_area}</span>
            </div>
          )}
          <div className="text-[11px] text-neutral-800 font-medium italic">
            <span className="font-bold uppercase text-[9px] text-[#85261e] tracking-wider not-italic block mb-0.5">
              Dissertation Topic:
            </span>
            &quot;{sch.topic || sch.dissertation_title || "Doctoral Research"}&quot;
          </div>
        </div>
      </div>

      {/* Supervision & Timeline Footer */}
      <div className="pt-3 border-t border-[#eedfd8]/60 space-y-1.5 text-xs text-neutral-600">
        <div className="flex items-start gap-1.5">
          <UserCheck className="w-3.5 h-3.5 text-[#85261e] flex-shrink-0 mt-0.5" />
          <div>
            <span>Supervisor: </span>
            <strong className="text-[#1c110c]">{sch.supervisor}</strong>
            {sch.co_supervisor && (
              <span className="text-neutral-500 block text-[11px]">
                Co-Supervisor: {sch.co_supervisor}
              </span>
            )}
          </div>
        </div>

        {(sch.registration_year || sch.end_date) && (
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 pt-0.5">
            <Calendar className="w-3 h-3 text-[#85261e]" />
            {sch.registration_year && <span>Registered: {sch.registration_year}</span>}
            {sch.end_date && <span>• Completed: {sch.end_date}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PhdScholarsPage() {
  const { activeDepartment } = useDepartment();
  const [scholarsList, setScholarsList] = useState<any[]>(() =>
    MOCK_PHD_SCHOLARS.map(normalizeScholar)
  );
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");
  const [supervisorFilter, setSupervisorFilter] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const hasData = activeDepartment.slug === "cse";

  useEffect(() => {
    const loadScholars = async () => {
      // 1. First check localStorage (for any additions/edits made in Admin)
      let initialList = MOCK_PHD_SCHOLARS.map(normalizeScholar);
      try {
        const saved = localStorage.getItem("nith_admin_phd_scholars");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            initialList = parsed.map(normalizeScholar);
            setScholarsList(initialList);
          }
        }
      } catch {}

      // 2. Query live Go backend API
      try {
        const res = await fetch("/api/v1/phd-scholars");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            const liveList = json.data.map(normalizeScholar);
            const existingRolls = new Set(liveList.map((s: any) => s.enrollment_number || s.id));
            const extraLocal = initialList.filter(
              (s: any) => !existingRolls.has(s.enrollment_number) && !existingRolls.has(s.id)
            );
            setScholarsList([...liveList, ...extraLocal]);
          }
        }
      } catch (err) {
        console.warn("Could not fetch live PhD scholars from backend", err);
      }
    };

    loadScholars();
  }, [activeDepartment.slug]);

  // Extract unique supervisors list
  const supervisorsList = useMemo(() => {
    if (!hasData) return [];
    const set = new Set<string>();
    scholarsList.forEach((p) => {
      if (p.supervisor && p.supervisor !== "Faculty Supervisor") {
        set.add(p.supervisor);
      }
    });
    return Array.from(set).sort();
  }, [hasData, scholarsList]);

  const countByStatus = useMemo(() => {
    if (!hasData) return { total: 0, pursuing: 0, passed: 0 };
    const total = scholarsList.length;
    const pursuing = scholarsList.filter((p) => p.status === "pursuing").length;
    const passed = scholarsList.filter((p) => p.status === "passed").length;
    return { total, pursuing, passed };
  }, [hasData, scholarsList]);

  const filteredScholars = useMemo(() => {
    if (!hasData) return [];
    return scholarsList.filter((sch) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        sch.name.toLowerCase().includes(q) ||
        sch.enrollment_number?.toLowerCase().includes(q) ||
        sch.topic?.toLowerCase().includes(q) ||
        sch.dissertation_title?.toLowerCase().includes(q) ||
        sch.supervisor?.toLowerCase().includes(q) ||
        sch.co_supervisor?.toLowerCase().includes(q) ||
        sch.research_area?.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "ALL" || sch.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesSupervisor =
        supervisorFilter === "ALL" ||
        sch.supervisor?.toLowerCase().includes(supervisorFilter.toLowerCase()) ||
        sch.co_supervisor?.toLowerCase().includes(supervisorFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesSupervisor;
    });
  }, [search, statusFilter, supervisorFilter, hasData, scholarsList]);

  const totalPages = Math.ceil(filteredScholars.length / ITEMS_PER_PAGE) || 1;
  const paginatedScholars = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredScholars.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredScholars, currentPage]);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setSupervisorFilter("ALL");
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6 bg-white min-h-[85vh] font-sans">
      {/* Title Header */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-[#85261e]" />
              Doctoral Ph.D. Scholars
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2 py-0.5 rounded uppercase">
              {activeDepartment.code}
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Research scholars pursuing doctoral degrees and alumni who graduated from Department of{" "}
            {activeDepartment.name}.
          </p>
        </div>

        {/* Status Filter Tabs (only when data is present) */}
        {hasData && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-[#fff9f6] p-1 rounded-lg border border-[#eedfd8]">
              {[
                { id: "ALL", label: `All (${countByStatus.total})` },
                { id: "pursuing", label: `Current Scholars (${countByStatus.pursuing})` },
                { id: "passed", label: `Former / Alumni (${countByStatus.passed})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setStatusFilter(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
                    statusFilter === tab.id
                      ? "bg-[#33110e] text-white shadow-xs"
                      : "text-[#33110e] hover:bg-[#eedfd8]/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-[#fff9f6] p-1 rounded-lg border border-[#eedfd8]">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-[#85261e] text-white shadow-2xs"
                    : "text-neutral-600 hover:bg-[#eedfd8]/50"
                }`}
                title="Grid Card View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md transition cursor-pointer ${
                  viewMode === "table"
                    ? "bg-[#85261e] text-white shadow-2xs"
                    : "text-neutral-600 hover:bg-[#eedfd8]/50"
                }`}
                title="Dense Table View"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {!hasData ? (
        <DepartmentEmptyState sectionTitle="Doctoral Ph.D. Scholar Records" />
      ) : (
        <>
          {/* Filter and Search Bar */}
          <div className="bg-[#fff9f6] border border-[#eedfd8] rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Keyword Search */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search scholar name, roll number, topic..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-[#eedfd8] bg-white text-xs text-[#1c110c] placeholder:text-neutral-400 focus:outline-none focus:border-[#85261e] shadow-2xs"
                />
              </div>

              {/* Supervisor Dropdown */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <select
                  value={supervisorFilter}
                  onChange={(e) => {
                    setSupervisorFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 rounded-lg border border-[#eedfd8] bg-white text-xs font-semibold text-[#33110e] focus:outline-none focus:border-[#85261e] shadow-2xs cursor-pointer max-w-[220px] truncate"
                >
                  <option value="ALL">All Supervisors ({supervisorsList.length})</option>
                  {supervisorsList.map((sup) => (
                    <option key={sup} value={sup}>
                      {sup}
                    </option>
                  ))}
                </select>

                {(search || statusFilter !== "ALL" || supervisorFilter !== "ALL") && (
                  <button
                    onClick={resetFilters}
                    className="px-2.5 py-1.5 text-xs font-semibold text-neutral-600 hover:text-[#33110e] transition flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Scholars Content: Grid or Table View */}
          {filteredScholars.length === 0 ? (
            <div className="p-12 text-center text-neutral-500 border border-dashed border-[#eedfd8] rounded-2xl">
              <GraduationCap className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
              <p className="text-sm font-semibold">No Ph.D. scholars match your search filters.</p>
              <button
                onClick={resetFilters}
                className="mt-3 text-xs font-bold text-[#85261e] hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            /* Grid View */
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedScholars.map((sch) => (
                <ScholarCard key={sch.id} sch={sch} />
              ))}
            </div>
          ) : (
            /* Table View (Similar to tempcsebase Former Scholars) */
            <div className="overflow-hidden rounded-2xl border border-[#eedfd8] bg-white shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-[#fff9f6] text-xs font-bold uppercase text-[#33110e] border-b border-[#eedfd8]">
                    <tr>
                      <th className="px-4 py-3.5 text-center w-12">Sr.</th>
                      <th className="px-4 py-3.5">Scholar</th>
                      <th className="px-4 py-3.5 font-mono">Roll No</th>
                      <th className="px-4 py-3.5 min-w-[260px]">Research Area &amp; Topic</th>
                      <th className="px-4 py-3.5">Supervisor(s)</th>
                      <th className="px-4 py-3.5 text-center">Status / Passing</th>
                      <th className="px-4 py-3.5 text-center">Profiles</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eedfd8]/60 text-[#1c110c]">
                    {paginatedScholars.map((sch, idx) => {
                      const isPassed = sch.status === "passed";
                      const photo = sch.photo_url || sch.image_url || sch.photo;
                      const globalIdx = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                      return (
                        <tr key={sch.id} className="hover:bg-[#fff9f6]/60 transition-colors">
                          <td className="px-4 py-3 text-center text-xs font-mono font-bold text-neutral-400">
                            {globalIdx}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {photo ? (
                                <img
                                  src={photo}
                                  alt={sch.name}
                                  className="w-10 h-10 object-cover object-top rounded-lg border border-[#eedfd8] shadow-2xs flex-shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-[#fff9f6] border border-[#eedfd8] flex items-center justify-center text-[#85261e] font-bold text-xs flex-shrink-0">
                                  {sch.name?.charAt(0) || "S"}
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="font-bold text-xs text-[#1c110c]">{sch.name}</div>
                                {sch.email && (
                                  <a
                                    href={`mailto:${sch.email}`}
                                    className="text-[11px] text-neutral-400 hover:text-[#85261e] transition block truncate"
                                  >
                                    {sch.email}
                                  </a>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-mono text-xs font-bold text-[#85261e] whitespace-nowrap">
                            {sch.enrollment_number || "—"}
                          </td>
                          <td className="px-4 py-3 text-xs leading-relaxed">
                            {sch.research_area && (
                              <div className="font-semibold text-neutral-700">
                                {sch.research_area}
                              </div>
                            )}
                            <div className="text-neutral-500 italic">
                              &quot;{sch.topic || sch.dissertation_title || "Doctoral Research"}&quot;
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs">
                            <div className="font-bold text-neutral-800">{sch.supervisor}</div>
                            {sch.co_supervisor && (
                              <div className="text-[11px] text-neutral-500">
                                Co-Supervisor: {sch.co_supervisor}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center whitespace-nowrap">
                            <span
                              className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                isPassed
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                  : "bg-sky-50 text-sky-800 border-sky-300"
                              }`}
                            >
                              {isPassed ? "Awarded" : "Ongoing"}
                            </span>
                            {sch.end_date && (
                              <div className="text-[10px] text-neutral-400 mt-0.5">
                                {sch.end_date}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              {sch.linkedin_url && (
                                <a
                                  href={
                                    sch.linkedin_url.startsWith("http")
                                      ? sch.linkedin_url
                                      : `https://${sch.linkedin_url}`
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 rounded text-[#0077b5] hover:bg-neutral-100"
                                  title="LinkedIn"
                                >
                                  <FaLinkedin className="w-3.5 h-3.5" />
                                </a>
                              )}
                              {sch.google_scholar_url && (
                                <a
                                  href={
                                    sch.google_scholar_url.startsWith("http")
                                      ? sch.google_scholar_url
                                      : `https://${sch.google_scholar_url}`
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 rounded text-[#4285F4] hover:bg-neutral-100"
                                  title="Google Scholar"
                                >
                                  <FaGoogle className="w-3.5 h-3.5" />
                                </a>
                              )}
                              {sch.scopus_url && (
                                <a
                                  href={
                                    sch.scopus_url.startsWith("http")
                                      ? sch.scopus_url
                                      : `https://${sch.scopus_url}`
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 rounded text-[#ff671b] hover:bg-neutral-100"
                                  title="Scopus"
                                >
                                  <SiScopus className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-[#eedfd8] pt-4">
              <span className="text-xs text-neutral-600">
                Showing {paginatedScholars.length} of {filteredScholars.length} scholars (Page{" "}
                {currentPage} of {totalPages})
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-[#eedfd8] rounded-lg text-xs font-semibold hover:bg-[#fff9f6] disabled:opacity-40 cursor-pointer"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border border-[#eedfd8] rounded-lg text-xs font-semibold hover:bg-[#fff9f6] disabled:opacity-40 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
