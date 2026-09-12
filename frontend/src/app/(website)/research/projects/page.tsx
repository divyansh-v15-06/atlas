"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Briefcase,
  Building,
  Calendar,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Copy,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { formatINR } from "@/lib/utils";
import { MOCK_PROJECTS, MOCK_FACULTY } from "@/lib/mock-data";
import { useDepartment } from "@/context/department-context";
import { DepartmentEmptyState } from "@/components/common/department-empty-state";

const ITEMS_PER_PAGE = 20;

export default function ProjectsPage() {
  const { activeDepartment } = useDepartment();
  const hasData = activeDepartment.slug === "cse";

  // Filters State
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [startYear, setStartYear] = useState<string>("ALL");
  const [endYear, setEndYear] = useState<string>("ALL");
  const [selectedAgency, setSelectedAgency] = useState<string>("ALL");
  const [selectedFaculty, setSelectedFaculty] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Active Modal Project Details State
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Available Years for Dropdowns
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    MOCK_PROJECTS.forEach((p) => {
      const yr = Number(p.year) || Number(p.start_date?.split("-")[0]);
      if (yr) years.add(yr);
    });
    return Array.from(years).sort((a, b) => b - a);
  }, []);

  // Available Sponsoring Agencies
  const availableAgencies = useMemo(() => {
    const agencies = new Set<string>();
    MOCK_PROJECTS.forEach((p) => {
      if (p.funding_agency) agencies.add(p.funding_agency);
    });
    return Array.from(agencies).sort();
  }, []);

  const handleStartYearChange = (val: string) => {
    setStartYear(val);
    setCurrentPage(1);
    if (val !== "ALL" && endYear !== "ALL" && Number(val) > Number(endYear)) {
      setEndYear(val);
      toast.info(`End year adjusted to ${val} (Start year must be ≤ End year)`);
    }
  };

  const handleEndYearChange = (val: string) => {
    setEndYear(val);
    setCurrentPage(1);
    if (val !== "ALL" && startYear !== "ALL" && Number(val) < Number(startYear)) {
      setStartYear(val);
      toast.info(`Start year adjusted to ${val} (Start year must be ≤ End year)`);
    }
  };

  // Filter Logic
  const filteredProjects = useMemo(() => {
    return MOCK_PROJECTS.filter((prj) => {
      // Status Filter
      if (selectedStatus !== "ALL") {
        if (prj.status?.toLowerCase() !== selectedStatus.toLowerCase()) {
          return false;
        }
      }

      // Year Range Filtering
      const prjYr = Number(prj.year) || Number(prj.start_date?.split("-")[0]) || 2023;
      if (startYear !== "ALL" && endYear !== "ALL") {
        const sYr = Math.min(Number(startYear), Number(endYear));
        const eYr = Math.max(Number(startYear), Number(endYear));
        if (prjYr < sYr || prjYr > eYr) return false;
      } else if (startYear !== "ALL") {
        if (prjYr < Number(startYear)) return false;
      } else if (endYear !== "ALL") {
        if (prjYr > Number(endYear)) return false;
      }

      // Funding Agency Filter
      if (selectedAgency !== "ALL") {
        if (prj.funding_agency !== selectedAgency) {
          return false;
        }
      }

      // Faculty Investigator Filter
      if (selectedFaculty !== "ALL") {
        const fac = MOCK_FACULTY.find(
          (f: any) =>
            String(f.id) === selectedFaculty ||
            String(f.legacy_id) === selectedFaculty
        );
        if (fac) {
          const rawText = (prj.raw_investigators || "").toLowerCase();
          const cleanName = fac.full_name
            .replace(/^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.)\s*/i, "")
            .replace(/\(Mrs\.\)/i, "")
            .replace(/\./g, "")
            .trim()
            .toLowerCase();

          const nameWords = cleanName.split(/\s+/).filter((w: string) => w.length > 2);
          const hasFullName = rawText.includes(cleanName);
          const hasFirstAndLast =
            nameWords.length >= 2 &&
            rawText.includes(nameWords[0]) &&
            rawText.includes(nameWords[nameWords.length - 1]);

          if (!hasFullName && !hasFirstAndLast) {
            return false;
          }
        }
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = prj.title?.toLowerCase().includes(q);
        const matchesAgency = prj.funding_agency?.toLowerCase().includes(q);
        const matchesScheme = prj.scheme?.toLowerCase().includes(q);
        const matchesRef = prj.reference_number?.toLowerCase().includes(q);
        const matchesInvestigators = prj.raw_investigators?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesAgency && !matchesScheme && !matchesRef && !matchesInvestigators) {
          return false;
        }
      }

      return true;
    });
  }, [selectedStatus, startYear, endYear, selectedAgency, selectedFaculty, searchQuery]);

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE) || 1;
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProjects.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProjects, currentPage]);

  const resetFilters = () => {
    setSelectedStatus("ALL");
    setStartYear("ALL");
    setEndYear("ALL");
    setSelectedAgency("ALL");
    setSelectedFaculty("ALL");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleCopyCitation = (project: any) => {
    const citation = `${project.raw_investigators || "Faculty Investigators"} (${project.year || project.start_date?.split("-")[0] || "2023"}). "${project.title}." Sponsoring Agency: ${project.funding_agency || "DST-SERB / MeitY"}${project.scheme ? `, Scheme: ${project.scheme}` : ""}. Sanctioned Budget: ${formatINR(project.total_sanctioned_amount)}. Reference: ${project.reference_number || "N/A"}.`;
    navigator.clipboard.writeText(citation);
    setCopiedId(project.id);
    toast.success("Project citation copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getStatusBadge = (status: string) => {
    const isOngoing = (status || "").toLowerCase() === "ongoing";
    if (isOngoing) {
      return "bg-sky-100 text-sky-900 border border-sky-300 font-bold";
    }
    return "bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6 bg-white min-h-[85vh] font-sans">
      {/* Title Header */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-[#85261e]" />
              Sponsored Research Grants &amp; Projects
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2 py-0.5 rounded uppercase">
              {activeDepartment.code}
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-0.5">
            Externally funded research initiatives supported by national ministries (SERB, MeitY, DST) and industry partners in Department of {activeDepartment.name}.
          </p>
        </div>
      </div>

      {!hasData ? (
        <DepartmentEmptyState sectionTitle="Sponsored Research Grants & Projects" />
      ) : (
        <>
          {/* 1. Institutional Filter Bar (#33110e & #fff9f6 palette) */}
          <div className="bg-[#fff9f6] border border-[#eedfd8] rounded-xl p-4 shadow-xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {/* Project Status Dropdown */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#85261e] mb-1">
                  Project Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-white border border-[#eedfd8] rounded-lg px-3 py-2 text-xs font-semibold text-[#33110e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* Funding Agency Dropdown */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#85261e] mb-1">
                  Funding Agency
                </label>
                <select
                  value={selectedAgency}
                  onChange={(e) => {
                    setSelectedAgency(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-white border border-[#eedfd8] rounded-lg px-3 py-2 text-xs font-semibold text-[#33110e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                >
                  <option value="ALL">All Agencies</option>
                  {availableAgencies.map((agency) => (
                    <option key={agency} value={agency}>
                      {agency}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Year Dropdown */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#85261e] mb-1">
                  Start Year
                </label>
                <select
                  value={startYear}
                  onChange={(e) => handleStartYearChange(e.target.value)}
                  className="w-full bg-white border border-[#eedfd8] rounded-lg px-3 py-2 text-xs font-semibold text-[#33110e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                >
                  <option value="ALL">Start Year (All)</option>
                  {availableYears.map((yr) => {
                    const isDisabled = endYear !== "ALL" && yr > Number(endYear);
                    return (
                      <option key={`start-${yr}`} value={yr.toString()} disabled={isDisabled}>
                        {yr} {isDisabled ? "(> End Year)" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* End Year Dropdown */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#85261e] mb-1">
                  End Year
                </label>
                <select
                  value={endYear}
                  onChange={(e) => handleEndYearChange(e.target.value)}
                  className="w-full bg-white border border-[#eedfd8] rounded-lg px-3 py-2 text-xs font-semibold text-[#33110e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                >
                  <option value="ALL">End Year (All)</option>
                  {availableYears.map((yr) => {
                    const isDisabled = startYear !== "ALL" && yr < Number(startYear);
                    return (
                      <option key={`end-${yr}`} value={yr.toString()} disabled={isDisabled}>
                        {yr} {isDisabled ? "(< Start Year)" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Faculty Investigator Dropdown */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#85261e] mb-1">
                  Faculty Investigator
                </label>
                <select
                  value={selectedFaculty}
                  onChange={(e) => {
                    setSelectedFaculty(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-white border border-[#eedfd8] rounded-lg px-3 py-2 text-xs font-semibold text-[#33110e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                >
                  <option value="ALL">All Faculty Members</option>
                  {MOCK_FACULTY.map((f: any) => (
                    <option key={f.id} value={f.id}>
                      {f.full_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#eedfd8]">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search title, agency, scheme, or ref no..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#eedfd8] bg-white text-[#33110e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <span className="text-xs text-neutral-500 font-semibold">
                  Showing {filteredProjects.length} of {MOCK_PROJECTS.length} projects
                </span>
                <button
                  onClick={resetFilters}
                  className="px-3 py-1.5 rounded-lg border border-[#eedfd8] bg-white hover:bg-[#eedfd8]/40 text-xs font-semibold text-[#33110e] transition flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
                <button
                  onClick={() => setCurrentPage(1)}
                  className="px-5 py-1.5 rounded-lg bg-[#33110e] hover:bg-[#85261e] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  Apply Filter
                </button>
              </div>
            </div>
          </div>

          {/* 2. Institutional Table Design */}
          <div className="overflow-x-auto rounded-xl border border-[#eedfd8] shadow-xs">
            <table className="w-full text-left border-collapse bg-white">
              {/* Institutional Slate/Maroon Header */}
              <thead>
                <tr className="bg-[#1c110c] text-white text-xs font-bold uppercase tracking-wider">
                  <th className="py-3 px-3 text-center w-16 border-r border-neutral-800">
                    Sr. No.
                  </th>
                  <th className="py-3 px-4 border-r border-neutral-800">
                    Project &amp; Grant Details
                  </th>
                  <th className="py-3 px-3 text-center w-36 border-r border-neutral-800">
                    Sanctioned Budget
                  </th>
                  <th className="py-3 px-3 text-center w-28 border-r border-neutral-800">
                    Status
                  </th>
                  <th className="py-3 px-3 text-center w-24">
                    View
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#eedfd8] text-xs">
                {paginatedProjects.map((project, idx) => {
                  const srNo = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                  return (
                    <tr
                      key={project.id || idx}
                      className="hover:bg-[#fff9f6] transition duration-150"
                    >
                      {/* Sr. No */}
                      <td className="py-3.5 px-3 text-center font-bold text-neutral-500 border-r border-[#eedfd8] align-top">
                        #{srNo}
                      </td>

                      {/* Project Details */}
                      <td className="py-3.5 px-4 border-r border-[#eedfd8] space-y-1.5">
                        <p className="leading-relaxed">
                          {/* Investigators in bold maroon */}
                          <strong className="text-[#85261e] font-extrabold">
                            {project.raw_investigators || "Faculty Investigators"},
                          </strong>{" "}
                          {/* Title */}
                          <span className="font-bold text-[#1c110c]">
                            &quot;{project.title}&quot;
                          </span>
                        </p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-neutral-500 font-mono">
                          <span>
                            <span className="font-sans font-semibold text-neutral-700">Agency:</span>{" "}
                            <strong className="text-neutral-900">{project.funding_agency}</strong>
                          </span>
                          {project.scheme && (
                            <span>
                              <span className="font-sans font-semibold text-neutral-700">Scheme:</span>{" "}
                              {project.scheme}
                            </span>
                          )}
                          {project.reference_number && (
                            <span>
                              <span className="font-sans font-semibold text-neutral-700">Ref:</span>{" "}
                              {project.reference_number}
                            </span>
                          )}
                          <span>
                            <span className="font-sans font-semibold text-neutral-700">Duration:</span>{" "}
                            {project.start_date?.split("-")[0] || "2023"} - {project.end_date?.split("-")[0] || "2026"}
                          </span>
                        </div>
                      </td>

                      {/* Sanctioned Budget */}
                      <td className="py-3.5 px-3 text-center font-bold text-[#85261e] font-mono border-r border-[#eedfd8] align-top">
                        {formatINR(project.total_sanctioned_amount)}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3 text-center border-r border-[#eedfd8] align-top">
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded uppercase tracking-wider ${getStatusBadge(
                            project.status || "Ongoing"
                          )}`}
                        >
                          {project.status || "Ongoing"}
                        </span>
                      </td>

                      {/* View Details Action (Institutional Maroon Button) */}
                      <td className="py-3.5 px-3 text-center align-top">
                        <button
                          onClick={() => setSelectedProject(project)}
                          className="bg-[#33110e] hover:bg-[#85261e] text-white text-xs font-semibold px-3 py-1 rounded-md transition duration-150 shadow-xs cursor-pointer"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredProjects.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-neutral-500 text-xs bg-[#fff9f6]">
                      No research projects found matching your selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 text-xs text-neutral-600 border-t border-[#eedfd8]">
              <p>
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredProjects.length)} of {filteredProjects.length} projects
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-[#eedfd8] bg-white disabled:opacity-40 hover:bg-[#fff9f6] cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-[#33110e]" />
                </button>
                <span className="px-3 py-1 font-semibold text-[#33110e]">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-[#eedfd8] bg-white disabled:opacity-40 hover:bg-[#fff9f6] cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 text-[#33110e]" />
                </button>
              </div>
            </div>
          )}

          {/* 3. Redesigned Institutional Details Modal Popup */}
          {selectedProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl shadow-2xl border border-[#eedfd8] w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header with Institutional Maroon Background & Gold Accents */}
                <div className="bg-[#33110e] text-white px-5 py-3.5 flex items-center justify-between border-b border-[#4a1814]">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm sm:text-base font-bold tracking-tight text-white">
                      Complete Research Grant Details
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-1 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* 2-Column Property Grid Table */}
                <div className="p-6 max-h-[75vh] overflow-y-auto divide-y divide-[#f4ece8] text-xs space-y-0.5">
                  <div className="py-2.5 grid grid-cols-12 gap-2">
                    <span className="col-span-4 font-bold text-[#33110e]">Investigators:</span>
                    <span className="col-span-8 text-neutral-800 font-semibold leading-relaxed">
                      {selectedProject.raw_investigators || "Faculty Principal Investigators"}
                    </span>
                  </div>

                  <div className="py-2.5 grid grid-cols-12 gap-2">
                    <span className="col-span-4 font-bold text-[#33110e]">Project Title:</span>
                    <span className="col-span-8 text-neutral-900 font-bold leading-relaxed">
                      {selectedProject.title}
                    </span>
                  </div>

                  <div className="py-2.5 grid grid-cols-12 gap-2">
                    <span className="col-span-4 font-bold text-[#33110e]">Funding Agency:</span>
                    <span className="col-span-8 text-[#85261e] font-bold">
                      {selectedProject.funding_agency}
                    </span>
                  </div>

                  <div className="py-2.5 grid grid-cols-12 gap-2">
                    <span className="col-span-4 font-bold text-[#33110e]">Scheme:</span>
                    <span className="col-span-8 text-neutral-800 font-semibold">
                      {selectedProject.scheme || "Sponsored R&D Grant"}
                    </span>
                  </div>

                  <div className="py-2.5 grid grid-cols-12 gap-2">
                    <span className="col-span-4 font-bold text-[#33110e]">Sanctioned Budget:</span>
                    <span className="col-span-8 font-mono font-bold text-[#85261e] text-sm">
                      {formatINR(selectedProject.total_sanctioned_amount)}
                    </span>
                  </div>

                  <div className="py-2.5 grid grid-cols-12 gap-2">
                    <span className="col-span-4 font-bold text-[#33110e]">Amount Received:</span>
                    <span className="col-span-8 font-mono font-semibold text-neutral-800">
                      {formatINR(selectedProject.total_amount_received || selectedProject.total_sanctioned_amount)}
                    </span>
                  </div>

                  <div className="py-2.5 grid grid-cols-12 gap-2">
                    <span className="col-span-4 font-bold text-[#33110e]">Status:</span>
                    <span className="col-span-8">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${getStatusBadge(
                          selectedProject.status || "Ongoing"
                        )}`}
                      >
                        {selectedProject.status || "Ongoing"}
                      </span>
                    </span>
                  </div>

                  <div className="py-2.5 grid grid-cols-12 gap-2">
                    <span className="col-span-4 font-bold text-[#33110e]">Reference No:</span>
                    <span className="col-span-8 text-neutral-800 font-mono">
                      {selectedProject.reference_number || "—"}
                    </span>
                  </div>

                  <div className="py-2.5 grid grid-cols-12 gap-2">
                    <span className="col-span-4 font-bold text-[#33110e]">Start Date:</span>
                    <span className="col-span-8 text-neutral-800 font-mono">
                      {selectedProject.start_date || `${selectedProject.year || 2023}-04-01`}
                    </span>
                  </div>

                  <div className="py-2.5 grid grid-cols-12 gap-2">
                    <span className="col-span-4 font-bold text-[#33110e]">End Date:</span>
                    <span className="col-span-8 text-neutral-800 font-mono">
                      {selectedProject.end_date || `${Number(selectedProject.year || 2023) + 3}-03-31`}
                    </span>
                  </div>
                </div>

                {/* Modal Actions Footer */}
                <div className="p-4 bg-[#fff9f6] border-t border-[#eedfd8] flex items-center justify-between">
                  <button
                    onClick={() => handleCopyCitation(selectedProject)}
                    className="px-3.5 py-1.5 rounded-lg border border-[#eedfd8] bg-white hover:bg-neutral-100 text-xs font-semibold text-neutral-700 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    {copiedId === selectedProject.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-neutral-800 font-bold" />
                        <span className="text-[#33110e] font-bold">Citation Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Copy Citation</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setSelectedProject(null)}
                    className="px-4 py-1.5 rounded-lg bg-[#33110e] hover:bg-[#85261e] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
