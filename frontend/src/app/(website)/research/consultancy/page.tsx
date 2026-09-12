"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Copy,
  Check,
  X,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";
import { formatINR } from "@/lib/utils";
import { MOCK_CONSULTANCIES, MOCK_FACULTY } from "@/lib/mock-data";
import { useDepartment } from "@/context/department-context";
import { DepartmentEmptyState } from "@/components/common/department-empty-state";

const ITEMS_PER_PAGE = 20;

export default function ConsultancyPage() {
  const { activeDepartment } = useDepartment();
  const hasData = activeDepartment.slug === "cse";

  // Filters State
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedSession, setSelectedSession] = useState<string>("ALL");
  const [selectedClient, setSelectedClient] = useState<string>("ALL");
  const [selectedFaculty, setSelectedFaculty] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Active Modal Details State
  const [selectedConsultancy, setSelectedConsultancy] = useState<any | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Available Academic Sessions
  const availableSessions = useMemo(() => {
    const sessions = new Set<string>();
    MOCK_CONSULTANCIES.forEach((c) => {
      if (c.academic_session) sessions.add(c.academic_session);
    });
    return Array.from(sessions).sort().reverse();
  }, []);

  // Available Client Organisations
  const availableClients = useMemo(() => {
    const clients = new Set<string>();
    MOCK_CONSULTANCIES.forEach((c) => {
      if (c.client_organisation) clients.add(c.client_organisation);
    });
    return Array.from(clients).sort();
  }, []);

  // Filter Logic
  const filteredConsultancies = useMemo(() => {
    return MOCK_CONSULTANCIES.filter((c) => {
      // Status Filter
      if (selectedStatus !== "ALL") {
        if (c.status?.toLowerCase() !== selectedStatus.toLowerCase()) {
          return false;
        }
      }

      // Academic Session Filter
      if (selectedSession !== "ALL") {
        if (c.academic_session !== selectedSession) {
          return false;
        }
      }

      // Client Filter
      if (selectedClient !== "ALL") {
        if (c.client_organisation !== selectedClient) {
          return false;
        }
      }

      // Faculty Consultant Filter
      if (selectedFaculty !== "ALL") {
        const fac = MOCK_FACULTY.find(
          (f: any) =>
            String(f.id) === selectedFaculty ||
            String(f.legacy_id) === selectedFaculty
        );
        if (fac) {
          const rawText = (c.author_text || "").toLowerCase();
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
        const matchesTitle = c.title?.toLowerCase().includes(q);
        const matchesClient = c.client_organisation?.toLowerCase().includes(q);
        const matchesConsultants = c.author_text?.toLowerCase().includes(q);
        const matchesSession = c.academic_session?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesClient && !matchesConsultants && !matchesSession) {
          return false;
        }
      }

      return true;
    });
  }, [selectedStatus, selectedSession, selectedClient, selectedFaculty, searchQuery]);

  const totalPages = Math.ceil(filteredConsultancies.length / ITEMS_PER_PAGE) || 1;
  const paginatedConsultancies = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredConsultancies.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredConsultancies, currentPage]);

  const resetFilters = () => {
    setSelectedStatus("ALL");
    setSelectedSession("ALL");
    setSelectedClient("ALL");
    setSelectedFaculty("ALL");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleCopyCitation = (consultancy: any) => {
    const citation = `${consultancy.author_text || "Faculty Consultants"}. "${consultancy.title}." Client: ${consultancy.client_organisation || "Industry Partner"}. Contract Value: ${formatINR(consultancy.amount)}. Session: ${consultancy.academic_session || "—"}. Status: ${consultancy.status || "Completed"}.`;
    navigator.clipboard.writeText(citation);
    setCopiedId(consultancy.id);
    toast.success("Consultancy citation copied to clipboard!");
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
              <Building2 className="w-6 h-6 text-[#85261e]" />
              Industrial Consultancies &amp; Services
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2 py-0.5 rounded uppercase">
              {activeDepartment.code}
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-0.5">
            Industry advisory, system architecture deployment, technical audits, and applied technology consultancy conducted by Department of {activeDepartment.name}.
          </p>
        </div>
      </div>

      {!hasData ? (
        <DepartmentEmptyState sectionTitle="Industrial Consultancy Records" />
      ) : (
        <>
          {/* 1. Institutional Filter Bar (#33110e & #fff9f6 palette) */}
          <div className="bg-[#fff9f6] border border-[#eedfd8] rounded-xl p-4 shadow-xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {/* Status Dropdown */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#85261e] mb-1">
                  Contract Status
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
                  <option value="Completed">Completed</option>
                  <option value="Ongoing">Ongoing</option>
                </select>
              </div>

              {/* Academic Session Dropdown */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#85261e] mb-1">
                  Academic Session
                </label>
                <select
                  value={selectedSession}
                  onChange={(e) => {
                    setSelectedSession(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-white border border-[#eedfd8] rounded-lg px-3 py-2 text-xs font-semibold text-[#33110e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                >
                  <option value="ALL">All Sessions</option>
                  {availableSessions.map((ses) => (
                    <option key={ses} value={ses}>
                      {ses}
                    </option>
                  ))}
                </select>
              </div>

              {/* Client Organisation Dropdown */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#85261e] mb-1">
                  Client Organisation
                </label>
                <select
                  value={selectedClient}
                  onChange={(e) => {
                    setSelectedClient(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-white border border-[#eedfd8] rounded-lg px-3 py-2 text-xs font-semibold text-[#33110e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                >
                  <option value="ALL">All Clients</option>
                  {availableClients.map((client) => (
                    <option key={client} value={client}>
                      {client}
                    </option>
                  ))}
                </select>
              </div>

              {/* Faculty Consultant Dropdown */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#85261e] mb-1">
                  Faculty Consultant
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
                  placeholder="Search title, client organization, or consultants..."
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
                  Showing {filteredConsultancies.length} of {MOCK_CONSULTANCIES.length} assignments
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
                    Consultancy &amp; Client Details
                  </th>
                  <th className="py-3 px-3 text-center w-36 border-r border-neutral-800">
                    Contract Value
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
                {paginatedConsultancies.map((consultancy, idx) => {
                  const srNo = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                  return (
                    <tr
                      key={consultancy.id || idx}
                      className="hover:bg-[#fff9f6] transition duration-150"
                    >
                      {/* Sr. No */}
                      <td className="py-3.5 px-3 text-center font-bold text-neutral-500 border-r border-[#eedfd8] align-top">
                        #{srNo}
                      </td>

                      {/* Consultancy Details */}
                      <td className="py-3.5 px-4 border-r border-[#eedfd8] space-y-1.5">
                        <p className="leading-relaxed">
                          {/* Consultants in bold maroon */}
                          <strong className="text-[#85261e] font-extrabold">
                            {consultancy.author_text || "Faculty Consultants"},
                          </strong>{" "}
                          {/* Title */}
                          <span className="font-bold text-[#1c110c]">
                            &quot;{consultancy.title}&quot;
                          </span>
                        </p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-neutral-500 font-mono">
                          <span>
                            <span className="font-sans font-semibold text-neutral-700">Client:</span>{" "}
                            <strong className="text-neutral-900">{consultancy.client_organisation}</strong>
                          </span>
                          {consultancy.academic_session && (
                            <span>
                              <span className="font-sans font-semibold text-neutral-700">Session:</span>{" "}
                              {consultancy.academic_session}
                            </span>
                          )}
                          <span>
                            <span className="font-sans font-semibold text-neutral-700">Start Year:</span>{" "}
                            {consultancy.start_year || 2024}
                          </span>
                        </div>
                      </td>

                      {/* Contract Value */}
                      <td className="py-3.5 px-3 text-center font-bold text-[#85261e] font-mono border-r border-[#eedfd8] align-top">
                        {formatINR(consultancy.amount)}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3 text-center border-r border-[#eedfd8] align-top">
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded uppercase tracking-wider ${getStatusBadge(
                            consultancy.status || "Completed"
                          )}`}
                        >
                          {consultancy.status || "Completed"}
                        </span>
                      </td>

                      {/* View Details Action (Institutional Maroon Button) */}
                      <td className="py-3.5 px-3 text-center align-top">
                        <button
                          onClick={() => setSelectedConsultancy(consultancy)}
                          className="bg-[#33110e] hover:bg-[#85261e] text-white text-xs font-semibold px-3 py-1 rounded-md transition duration-150 shadow-xs cursor-pointer"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredConsultancies.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-neutral-500 text-xs bg-[#fff9f6]">
                      No consultancy assignments found matching your selected filters.
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
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredConsultancies.length)} of {filteredConsultancies.length} assignments
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
          {selectedConsultancy && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl shadow-2xl border border-[#eedfd8] w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header with Institutional Maroon Background & Gold Accents */}
                <div className="bg-[#33110e] text-white px-5 py-3.5 flex items-center justify-between border-b border-[#4a1814]">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm sm:text-base font-bold tracking-tight text-white">
                      Complete Consultancy Contract Details
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedConsultancy(null)}
                    className="p-1 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* 2-Column Property Grid Table */}
                <div className="p-6 max-h-[75vh] overflow-y-auto divide-y divide-[#f4ece8] text-xs space-y-0.5">
                  <div className="py-2.5 grid grid-cols-12 gap-2">
                    <span className="col-span-4 font-bold text-[#33110e]">Faculty Consultants:</span>
                    <span className="col-span-8 text-neutral-800 font-semibold leading-relaxed">
                      {selectedConsultancy.author_text || "Faculty Technical Advisors"}
                    </span>
                  </div>

                  <div className="py-2.5 grid grid-cols-12 gap-2">
                    <span className="col-span-4 font-bold text-[#33110e]">Assignment Title:</span>
                    <span className="col-span-8 text-neutral-900 font-bold leading-relaxed">
                      {selectedConsultancy.title}
                    </span>
                  </div>

                  <div className="py-2.5 grid grid-cols-12 gap-2">
                    <span className="col-span-4 font-bold text-[#33110e]">Client Organisation:</span>
                    <span className="col-span-8 text-[#85261e] font-bold">
                      {selectedConsultancy.client_organisation}
                    </span>
                  </div>

                  <div className="py-2.5 grid grid-cols-12 gap-2">
                    <span className="col-span-4 font-bold text-[#33110e]">Contract Value:</span>
                    <span className="col-span-8 font-mono font-bold text-[#85261e] text-sm">
                      {formatINR(selectedConsultancy.amount)}
                    </span>
                  </div>

                  <div className="py-2.5 grid grid-cols-12 gap-2">
                    <span className="col-span-4 font-bold text-[#33110e]">Contract Status:</span>
                    <span className="col-span-8">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${getStatusBadge(
                          selectedConsultancy.status || "Completed"
                        )}`}
                      >
                        {selectedConsultancy.status || "Completed"}
                      </span>
                    </span>
                  </div>

                  <div className="py-2.5 grid grid-cols-12 gap-2">
                    <span className="col-span-4 font-bold text-[#33110e]">Academic Session:</span>
                    <span className="col-span-8 text-neutral-800 font-mono font-semibold">
                      {selectedConsultancy.academic_session || "—"}
                    </span>
                  </div>

                  <div className="py-2.5 grid grid-cols-12 gap-2">
                    <span className="col-span-4 font-bold text-[#33110e]">Start Year:</span>
                    <span className="col-span-8 text-neutral-800 font-mono">
                      {selectedConsultancy.start_year || 2024}
                    </span>
                  </div>
                </div>

                {/* Modal Actions Footer */}
                <div className="p-4 bg-[#fff9f6] border-t border-[#eedfd8] flex items-center justify-between">
                  <button
                    onClick={() => handleCopyCitation(selectedConsultancy)}
                    className="px-3.5 py-1.5 rounded-lg border border-[#eedfd8] bg-white hover:bg-neutral-100 text-xs font-semibold text-neutral-700 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    {copiedId === selectedConsultancy.id ? (
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
                    onClick={() => setSelectedConsultancy(null)}
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
