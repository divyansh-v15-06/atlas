"use client";

import { useState, useMemo } from "react";
import {
  Search,
  BookOpen,
  ExternalLink,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Copy,
  Check,
  Building2,
  Calendar,
  Layers,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { MOCK_PUBLICATIONS, MOCK_FACULTY } from "@/lib/mock-data";
import { useDepartment } from "@/context/department-context";
import { DepartmentEmptyState } from "@/components/common/department-empty-state";

const ITEMS_PER_PAGE = 20;

export default function PublicationsPage() {
  const { activeDepartment } = useDepartment();
  const hasData = activeDepartment.slug === "cse";

  // Filters State
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [startYear, setStartYear] = useState<string>("ALL");
  const [endYear, setEndYear] = useState<string>("ALL");
  const [selectedFaculty, setSelectedFaculty] = useState<string>("ALL");
  const [selectedIndexing, setSelectedIndexing] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Active Modal Publication Details State
  const [selectedPub, setSelectedPub] = useState<any | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Available Years for Dropdown (e.g. 2026 down to 2005)
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    MOCK_PUBLICATIONS.forEach((p) => {
      if (p.year) years.add(Number(p.year));
    });
    return Array.from(years).sort((a, b) => b - a);
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
  const filteredPubs = useMemo(() => {
    return MOCK_PUBLICATIONS.filter((pub) => {
      // Publication Type
      if (selectedType !== "ALL") {
        if (pub.publication_type?.toLowerCase() !== selectedType.toLowerCase()) {
          return false;
        }
      }

      // Year Range Filtering (Start Year <= Year <= End Year)
      const pubYr = Number(pub.year);
      if (startYear !== "ALL" && endYear !== "ALL") {
        const sYr = Math.min(Number(startYear), Number(endYear));
        const eYr = Math.max(Number(startYear), Number(endYear));
        if (pubYr < sYr || pubYr > eYr) return false;
      } else if (startYear !== "ALL") {
        if (pubYr < Number(startYear)) return false;
      } else if (endYear !== "ALL") {
        if (pubYr > Number(endYear)) return false;
      }

      // Faculty Name Filtering (Relational ID + Robust Name Normalization)
      if (selectedFaculty !== "ALL") {
        const fac = MOCK_FACULTY.find(
          (f: any) =>
            String(f.id) === selectedFaculty ||
            String(f.legacy_id) === selectedFaculty
        );
        if (fac) {
          const matchLegacy =
            fac.legacy_id &&
            pub.faculty_legacy_ids?.includes(Number(fac.legacy_id));

          const matchUUID =
            pub.faculty_ids &&
            (pub.faculty_ids.includes(fac.id) || pub.faculty_ids.includes(String(fac.id)));

          if (!matchLegacy && !matchUUID) {
            const authorText = (
              pub.author_text ||
              pub.authors?.map((a: any) => a.author_name).join(" ") ||
              ""
            ).toLowerCase();

            // Clean title prefixes (Dr., Prof., etc.)
            const cleanName = fac.full_name
              .replace(/^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.)\s*/i, "")
              .replace(/\(Mrs\.\)/i, "")
              .replace(/\./g, "")
              .trim()
              .toLowerCase();

            const nameWords = cleanName.split(/\s+/).filter((w: string) => w.length > 2);

            const hasFullName = authorText.includes(cleanName);
            const hasFirstAndLast =
              nameWords.length >= 2 &&
              authorText.includes(nameWords[0]) &&
              authorText.includes(nameWords[nameWords.length - 1]);

            // Special aliases
            let hasAlias = false;
            if (cleanName.includes("khalid")) {
              hasAlias = authorText.includes("khalid");
            } else if (cleanName.includes("arun")) {
              hasAlias = authorText.includes("arun") && authorText.includes("yadav");
            } else if (cleanName.includes("kamlesh")) {
              hasAlias = authorText.includes("kamlesh");
            } else if (cleanName.includes("awasthi")) {
              hasAlias = authorText.includes("awasthi");
            } else if (cleanName.includes("chauhan")) {
              hasAlias = authorText.includes("chauhan") && authorText.includes(nameWords[0]);
            }

            if (!hasFullName && !hasFirstAndLast && !hasAlias) {
              return false;
            }
          }
        }
      }

      // Indexing Filter
      if (selectedIndexing !== "ALL") {
        const pubInd = (pub.indexing || "").toLowerCase();
        const selInd = selectedIndexing.toLowerCase();

        if (selInd === "sci(e)" || selInd === "sci" || selInd === "scie") {
          if (!pubInd.includes("sci") || pubInd.includes("esci")) {
            return false;
          }
        } else if (selInd === "scopus") {
          if (!pubInd.includes("scopus")) {
            return false;
          }
        } else if (selInd === "esci") {
          if (!pubInd.includes("esci")) {
            return false;
          }
        } else if (selInd === "other") {
          if (pubInd !== "other") {
            return false;
          }
        } else if (pubInd !== selInd) {
          return false;
        }
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = pub.title?.toLowerCase().includes(q);
        const matchesAuthors = pub.author_text?.toLowerCase().includes(q);
        const matchesVenue = pub.venue_name?.toLowerCase().includes(q);
        const matchesDoi = pub.doi?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesAuthors && !matchesVenue && !matchesDoi) {
          return false;
        }
      }

      return true;
    });
  }, [selectedType, startYear, endYear, selectedFaculty, selectedIndexing, searchQuery]);

  const totalPages = Math.ceil(filteredPubs.length / ITEMS_PER_PAGE) || 1;
  const paginatedPubs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPubs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPubs, currentPage]);

  const resetFilters = () => {
    setSelectedType("ALL");
    setStartYear("ALL");
    setEndYear("ALL");
    setSelectedFaculty("ALL");
    setSelectedIndexing("ALL");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleCopyCitation = (pub: any) => {
    const citation = `${pub.author_text || "Faculty"} (${pub.year}). "${pub.title}." ${pub.venue_name || pub.journal_or_conference_name}, ${pub.volume ? `Vol. ${pub.volume}, ` : ""}${pub.issue ? `Issue ${pub.issue}, ` : ""}${pub.page_range ? `pp. ${pub.page_range}. ` : ""}${pub.doi ? `https://doi.org/${pub.doi}` : ""}`;
    navigator.clipboard.writeText(citation);
    setCopiedId(pub.id);
    toast.success("Citation copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getIndexingBadge = (indexing: string) => {
    const ind = indexing?.toUpperCase();
    if (ind === "SCI(E)" || ind === "SCI") {
      return "bg-amber-100 text-amber-900 border border-amber-300 font-bold";
    }
    if (ind === "SCOPUS") {
      return "bg-sky-100 text-sky-900 border border-sky-300 font-bold";
    }
    if (ind === "ESCI") {
      return "bg-indigo-100 text-indigo-900 border border-indigo-300 font-bold";
    }
    return "bg-neutral-100 text-neutral-800 border border-neutral-300";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6 bg-white min-h-[85vh] font-sans">
      {/* Title Header */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-[#85261e]" />
              Research Publications
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2 py-0.5 rounded uppercase">
              {activeDepartment.code}
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-0.5">
            Peer-reviewed SCI/Scopus journal articles, international conference proceedings, and book chapters from Department of {activeDepartment.name}.
          </p>
        </div>
      </div>

      {!hasData ? (
        <DepartmentEmptyState sectionTitle="Scholarly Publications" />
      ) : (
        <>
          {/* 1. Institutional Filter Bar (#33110e & #fff9f6 palette) */}
          <div className="bg-[#fff9f6] border border-[#eedfd8] rounded-xl p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Publication Type Dropdown */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#85261e] mb-1">
              Publication Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-[#eedfd8] rounded-lg px-3 py-2 text-xs font-semibold text-[#33110e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
            >
              <option value="ALL">All Types</option>
              <option value="Journal">Journal</option>
              <option value="Conference">Conference</option>
              <option value="Book">Book</option>
              <option value="BookChapter">Book Chapter</option>
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

          {/* Faculty Name Dropdown */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#85261e] mb-1">
              Faculty Author
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

          {/* Indexing Dropdown */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#85261e] mb-1">
              Indexing
            </label>
            <select
              value={selectedIndexing}
              onChange={(e) => {
                setSelectedIndexing(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-[#eedfd8] rounded-lg px-3 py-2 text-xs font-semibold text-[#33110e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
            >
              <option value="ALL">All Indexing</option>
              <option value="SCI(E)">SCI / SCIE</option>
              <option value="Scopus">Scopus</option>
              <option value="ESCI">ESCI</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Filter Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#eedfd8]">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search keyword in title, venue, or authors..."
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
              Showing {filteredPubs.length} of {MOCK_PUBLICATIONS.length} papers
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
                Publication Details
              </th>
              <th className="py-3 px-3 text-center w-20 border-r border-neutral-800">
                Year
              </th>
              <th className="py-3 px-3 text-center w-24 border-r border-neutral-800">
                Indexing
              </th>
              <th className="py-3 px-3 text-center w-24">
                View
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#eedfd8] text-xs">
            {paginatedPubs.map((pub, idx) => {
              const srNo = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
              return (
                <tr
                  key={pub.id}
                  className="hover:bg-[#fff9f6] transition duration-150"
                >
                  {/* Sr. No */}
                  <td className="py-3.5 px-3 text-center font-bold text-neutral-500 border-r border-[#eedfd8] align-top">
                    #{srNo}
                  </td>

                  {/* Publication Details */}
                  <td className="py-3.5 px-4 border-r border-[#eedfd8] space-y-1">
                    <p className="leading-relaxed">
                      {/* Authors in bold maroon */}
                      <strong className="text-[#85261e] font-extrabold">
                        {pub.author_text || pub.authors?.map((a: any) => a.author_name).join(", ")},
                      </strong>{" "}
                      {/* Title */}
                      <span className="font-bold text-[#1c110c]">
                        {pub.title},{" "}
                      </span>
                      {/* Venue in italic */}
                      <span className="italic text-[#85261e] font-semibold">
                        {pub.venue_name || pub.journal_or_conference_name}
                      </span>
                      {pub.volume && `, Vol. ${pub.volume}`}
                      {pub.issue && ` (${pub.issue})`}
                      {pub.journal_quartile && ["Q1", "Q2", "Q3", "Q4"].includes(pub.journal_quartile.toUpperCase().trim()) && `, Quartile: ${pub.journal_quartile.toUpperCase().trim()}`}
                      {(() => {
                        const rawQ = pub.journal_quartile || pub.quartile;
                        const q = rawQ ? String(rawQ).toUpperCase().trim() : null;
                        return q && ["Q1", "Q2", "Q3", "Q4"].includes(q) ? `, Quartile: ${q}` : null;
                      })()}
                      {pub.page_range && `, pp. ${pub.page_range}`}
                    </p>
                  </td>

                  {/* Year */}
                  <td className="py-3.5 px-3 text-center font-bold text-neutral-800 border-r border-[#eedfd8] align-top">
                    {pub.year}
                  </td>

                  {/* Indexing */}
                  <td className="py-3.5 px-3 text-center border-r border-[#eedfd8] align-top">
                    <span className={`text-[10px] px-2 py-0.5 rounded ${getIndexingBadge(pub.indexing || "Other")}`}>
                      {pub.indexing || "Other"}
                    </span>
                  </td>

                  {/* View Details Action (Institutional Maroon Button) */}
                  <td className="py-3.5 px-3 text-center align-top">
                    <button
                      onClick={() => setSelectedPub(pub)}
                      className="bg-[#33110e] hover:bg-[#85261e] text-white text-xs font-semibold px-3 py-1 rounded-md transition duration-150 shadow-xs cursor-pointer"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              );
            })}

            {filteredPubs.length === 0 && (
              <tr>
                <td colSpan={5} className="py-16 text-center text-neutral-500 text-xs bg-[#fff9f6]">
                  No research publications found matching your selected filters.
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
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredPubs.length)} of {filteredPubs.length} publications
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

      {/* 3. Redesigned Institutional Details Modal Popup (No Green Colors) */}
      {selectedPub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#eedfd8] w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header with Institutional Maroon Background & Gold Accents */}
            <div className="bg-[#33110e] text-white px-5 py-3.5 flex items-center justify-between border-b border-[#4a1814]">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm sm:text-base font-bold tracking-tight text-white">
                  Complete Publication Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedPub(null)}
                className="p-1 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2-Column Property Grid Table */}
            <div className="p-6 max-h-[75vh] overflow-y-auto divide-y divide-[#f4ece8] text-xs space-y-0.5">
              <div className="py-2.5 grid grid-cols-12 gap-2">
                <span className="col-span-4 font-bold text-[#33110e]">Authors:</span>
                <span className="col-span-8 text-neutral-800 font-semibold leading-relaxed">
                  {selectedPub.author_text || selectedPub.authors?.map((a: any) => a.author_name).join(", ")}
                </span>
              </div>

              <div className="py-2.5 grid grid-cols-12 gap-2">
                <span className="col-span-4 font-bold text-[#33110e]">Title:</span>
                <span className="col-span-8 text-neutral-900 font-bold leading-relaxed">
                  {selectedPub.title}
                </span>
              </div>

              <div className="py-2.5 grid grid-cols-12 gap-2">
                <span className="col-span-4 font-bold text-[#33110e]">Venue:</span>
                <span className="col-span-8 text-[#85261e] font-semibold italic">
                  {selectedPub.venue_name || selectedPub.journal_or_conference_name}
                </span>
              </div>

              <div className="py-2.5 grid grid-cols-12 gap-2">
                <span className="col-span-4 font-bold text-[#33110e]">Volume:</span>
                <span className="col-span-8 text-neutral-800 font-mono">
                  {selectedPub.volume || "—"}
                </span>
              </div>

              <div className="py-2.5 grid grid-cols-12 gap-2">
                <span className="col-span-4 font-bold text-[#33110e]">Issue:</span>
                <span className="col-span-8 text-neutral-800 font-mono">
                  {selectedPub.issue || "—"}
                </span>
              </div>

              {selectedPub.journal_quartile && ["Q1", "Q2", "Q3", "Q4"].includes(selectedPub.journal_quartile.toUpperCase().trim()) && (
                <div className="py-2.5 grid grid-cols-12 gap-2">
                  <span className="col-span-4 font-bold text-[#33110e]">Journal Quartile:</span>
                  <span className="col-span-8 font-mono font-bold text-neutral-800">
                    {selectedPub.journal_quartile.toUpperCase().trim()}
                  </span>
                </div>
              )}
              {(() => {
                const rawQ = selectedPub.journal_quartile || selectedPub.quartile;
                const q = rawQ ? String(rawQ).toUpperCase().trim() : null;
                return q && ["Q1", "Q2", "Q3", "Q4"].includes(q) ? (
                  <div className="py-2.5 grid grid-cols-12 gap-2">
                    <span className="col-span-4 font-bold text-[#33110e]">Journal Quartile:</span>
                    <span className="col-span-8 font-mono font-bold text-neutral-800">
                      {q}
                    </span>
                  </div>
                ) : null;
              })()}

              <div className="py-2.5 grid grid-cols-12 gap-2">
                <span className="col-span-4 font-bold text-[#33110e]">Page:</span>
                <span className="col-span-8 text-neutral-800 font-mono">
                  {selectedPub.page_range || selectedPub.pages || "—"}
                </span>
              </div>

              <div className="py-2.5 grid grid-cols-12 gap-2">
                <span className="col-span-4 font-bold text-[#33110e]">Year:</span>
                <span className="col-span-8 text-neutral-800 font-bold">
                  {selectedPub.year}
                </span>
              </div>

              <div className="py-2.5 grid grid-cols-12 gap-2">
                <span className="col-span-4 font-bold text-[#33110e]">Academic Session:</span>
                <span className="col-span-8 text-neutral-800 font-mono">
                  {selectedPub.academic_session}
                </span>
              </div>

              <div className="py-2.5 grid grid-cols-12 gap-2">
                <span className="col-span-4 font-bold text-[#33110e]">Indexing:</span>
                <span className="col-span-8">
                  <span className={`text-[10px] px-2 py-0.5 rounded ${getIndexingBadge(selectedPub.indexing || "Other")}`}>
                    {selectedPub.indexing || "Other"}
                  </span>
                </span>
              </div>

              <div className="py-2.5 grid grid-cols-12 gap-2 items-center">
                <span className="col-span-4 font-bold text-[#33110e]">Doi Link:</span>
                <span className="col-span-8">
                  {selectedPub.doi ? (
                    <a
                      href={selectedPub.doi.startsWith("http") ? selectedPub.doi : `https://doi.org/${selectedPub.doi}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#85261e] hover:underline font-mono break-all flex items-center gap-1 font-semibold"
                    >
                      <span>{selectedPub.doi.startsWith("http") ? selectedPub.doi : `https://doi.org/${selectedPub.doi}`}</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  ) : (
                    <span className="text-neutral-400">—</span>
                  )}
                </span>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 bg-[#fff9f6] border-t border-[#eedfd8] flex items-center justify-between">
              <button
                onClick={() => handleCopyCitation(selectedPub)}
                className="px-3.5 py-1.5 rounded-lg border border-[#eedfd8] bg-white hover:bg-neutral-100 text-xs font-semibold text-neutral-700 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                {copiedId === selectedPub.id ? (
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

              {selectedPub.doi && (
                <a
                  href={selectedPub.doi.startsWith("http") ? selectedPub.doi : `https://doi.org/${selectedPub.doi}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-1.5 rounded-lg bg-[#33110e] hover:bg-[#85261e] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  <span>Open Paper</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )}
</div>
  );
}
