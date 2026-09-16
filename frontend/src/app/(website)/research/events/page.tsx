"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Copy,
  Check,
  X,
  ExternalLink,
  MapPin,
  Users,
  Edit,
  Trash2,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import { MOCK_FACULTY } from "@/lib/mock-data";
import { getStoredEvents, deleteStoredEvent, updateOrAddStoredEvent } from "@/lib/faculty-storage";
import { useDepartment } from "@/context/department-context";
import { DepartmentEmptyState } from "@/components/common/department-empty-state";

const ITEMS_PER_PAGE = 20;

export default function EventsPage() {
  const { activeDepartment } = useDepartment();
  const hasData = activeDepartment.slug === "cse";

  // Events State from persistent storage
  const [eventsList, setEventsList] = useState<any[]>(() => getStoredEvents());
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({
    title: "",
    event_type: "Workshop",
    category: "organized",
    start_date: "",
    end_date: "",
    academic_session: "2024-2025",
    venue: "NIT Hamirpur",
    sponsoring_agency: "NIT Hamirpur",
    coordinator: "",
    convenor: "",
    link_url: "",
  });

  useEffect(() => {
    const handleUpdate = () => {
      setEventsList(getStoredEvents());
    };
    window.addEventListener("nith_events_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    if (typeof window !== "undefined") {
      const rawUser = localStorage.getItem("auth_user");
      if (rawUser) {
        try {
          const u = JSON.parse(rawUser);
          if (
            u.role === "ADMIN" ||
            u.role === "HOD_ADMIN" ||
            u.roles?.includes("ADMIN") ||
            u.roles?.includes("HOD_ADMIN")
          ) {
            setIsAdmin(true);
          }
        } catch {}
      }
    }

    return () => {
      window.removeEventListener("nith_events_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const handleOpenEdit = (ev: any) => {
    setEditFormData({
      id: ev.id,
      title: ev.title || "",
      event_type: ev.event_type || "Workshop",
      category: ev.category || "organized",
      start_date: ev.start_date || "",
      end_date: ev.end_date || ev.start_date || "",
      academic_session: ev.academic_session || "2024-2025",
      venue: ev.venue || "NIT Hamirpur",
      sponsoring_agency: ev.sponsoring_agency || "NIT Hamirpur",
      coordinator: ev.coordinator || "",
      convenor: ev.convenor || "",
      link_url: ev.link_url || "",
      faculty_ids: ev.faculty_ids || [],
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData.title?.trim()) {
      toast.error("Please enter an event title");
      return;
    }
    const updated = updateOrAddStoredEvent(editFormData);
    setEventsList(updated);
    setIsEditModalOpen(false);
    toast.success("Event updated successfully!");
  };

  const handleDeleteEvent = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      const updated = deleteStoredEvent(id);
      setEventsList(updated);
      if (selectedEvent?.id === id) {
        setSelectedEvent(null);
      }
      toast.success("Event deleted successfully!");
    }
  };

  // Filters State
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedSession, setSelectedSession] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedFaculty, setSelectedFaculty] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Active Modal Details State
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Available Event Types
  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    eventsList.forEach((ev: any) => {
      if (ev.event_type) types.add(ev.event_type.trim());
    });
    return Array.from(types).sort();
  }, [eventsList]);

  // Available Academic Sessions
  const availableSessions = useMemo(() => {
    const sessions = new Set<string>();
    eventsList.forEach((ev: any) => {
      if (ev.academic_session) sessions.add(ev.academic_session.trim());
    });
    return Array.from(sessions).sort().reverse();
  }, [eventsList]);

  // Available Categories
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    eventsList.forEach((ev: any) => {
      if (ev.category) cats.add(ev.category.trim());
    });
    return Array.from(cats).sort();
  }, [eventsList]);

  // Filter Logic
  const filteredEvents = useMemo(() => {
    return eventsList.filter((ev: any) => {
      // Event Type Filter
      if (selectedType !== "ALL") {
        if ((ev.event_type || "").toLowerCase() !== selectedType.toLowerCase()) {
          return false;
        }
      }

      // Academic Session Filter
      if (selectedSession !== "ALL") {
        if (ev.academic_session !== selectedSession) {
          return false;
        }
      }

      // Category Filter
      if (selectedCategory !== "ALL") {
        if ((ev.category || "").toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      // Faculty / Coordinator / Convenor Filter
      if (selectedFaculty !== "ALL") {
        const fac = MOCK_FACULTY.find(
          (f: any) =>
            String(f.id) === selectedFaculty ||
            String(f.legacy_id) === selectedFaculty
        );
        if (fac) {
          // Check if faculty id in faculty_ids array
          const inIds = Array.isArray(ev.faculty_ids) && (
            ev.faculty_ids.includes(fac.id) ||
            ev.faculty_ids.includes(fac.legacy_id) ||
            ev.faculty_ids.includes(String(fac.id)) ||
            ev.faculty_ids.includes(String(fac.legacy_id))
          );

          // Also check text matching in convenor and coordinator
          const combinedNames = `${ev.convenor || ""} ${ev.coordinator || ""}`.toLowerCase();
          const cleanName = fac.full_name
            .replace(/^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.)\s*/i, "")
            .replace(/\(Mrs\.\)/i, "")
            .replace(/\./g, "")
            .trim()
            .toLowerCase();

          const nameWords = cleanName.split(/\s+/).filter((w: string) => w.length > 2);
          const hasFullName = combinedNames.includes(cleanName);
          const hasFirstAndLast =
            nameWords.length >= 2 &&
            combinedNames.includes(nameWords[0]) &&
            combinedNames.includes(nameWords[nameWords.length - 1]);

          if (!inIds && !hasFullName && !hasFirstAndLast) {
            return false;
          }
        }
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = ev.title?.toLowerCase().includes(q);
        const matchesType = ev.event_type?.toLowerCase().includes(q);
        const matchesConvenor = ev.convenor?.toLowerCase().includes(q);
        const matchesCoordinator = ev.coordinator?.toLowerCase().includes(q);
        const matchesVenue = ev.venue?.toLowerCase().includes(q);
        const matchesAgency = ev.sponsoring_agency?.toLowerCase().includes(q);
        const matchesSession = ev.academic_session?.toLowerCase().includes(q);

        if (
          !matchesTitle &&
          !matchesType &&
          !matchesConvenor &&
          !matchesCoordinator &&
          !matchesVenue &&
          !matchesAgency &&
          !matchesSession
        ) {
          return false;
        }
      }

      return true;
    });
  }, [eventsList, selectedType, selectedSession, selectedCategory, selectedFaculty, searchQuery]);

  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE) || 1;
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEvents.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredEvents, currentPage]);

  const resetFilters = () => {
    setSelectedType("ALL");
    setSelectedSession("ALL");
    setSelectedCategory("ALL");
    setSelectedFaculty("ALL");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleCopyCitation = (eventItem: any) => {
    const organizers = [eventItem.coordinator, eventItem.convenor].filter(Boolean).join(" (Convenor: ") + (eventItem.convenor ? ")" : "");
    const citation = `"${eventItem.title}." Type: ${eventItem.event_type || "Event"}. Organizers: ${organizers || "Department of CSE"}. Sponsoring Agency: ${eventItem.sponsoring_agency || "NIT Hamirpur"}. Duration: ${formatDate(eventItem.start_date, "")} to ${formatDate(eventItem.end_date, "")}. Venue: ${eventItem.venue || "NIT Hamirpur"}. Session: ${eventItem.academic_session || "—"}.`;
    navigator.clipboard.writeText(citation);
    setCopiedId(eventItem.id);
    toast.success("Event details copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getTypeBadgeStyle = (type: string) => {
    const t = (type || "").toLowerCase();
    if (t.includes("workshop")) {
      return "bg-amber-100 text-amber-900 border border-amber-300";
    }
    if (t.includes("conference")) {
      return "bg-purple-100 text-purple-900 border border-purple-300";
    }
    if (t.includes("stc") || t.includes("fdp")) {
      return "bg-sky-100 text-sky-900 border border-sky-300";
    }
    return "bg-emerald-100 text-emerald-900 border border-emerald-300";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6 bg-white min-h-[85vh] font-sans">
      {/* Title Header */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#85261e]" />
              Conferences, STCs, FDPs &amp; Workshops
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2 py-0.5 rounded uppercase">
              {activeDepartment.code}
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-0.5">
            Academic conferences, short-term courses (STC), faculty development programmes (FDP), and international workshops organized by Department of {activeDepartment.name}.
          </p>
        </div>
      </div>

      {isAdmin && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs shadow-2xs">
          <div className="flex items-center gap-2 text-emerald-900 font-semibold">
            <Shield className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong>Administrator Access Active:</strong> You can edit or delete any event directly from the table below, or manage events and deduplication in the Admin Portal.
            </span>
          </div>
          <Link
            href="/admin/research/events"
            className="px-3 py-1.5 rounded-lg bg-[#33110e] hover:bg-[#85261e] text-white font-bold text-xs transition shrink-0 flex items-center gap-1 cursor-pointer"
          >
            Admin Events Portal →
          </Link>
        </div>
      )}

      {!hasData ? (
        <DepartmentEmptyState sectionTitle="Academic Event Records" />
      ) : (
        <>
          {/* 1. Institutional Filter Bar (#33110e & #fff9f6 palette) */}
          <div className="bg-[#fff9f6] border border-[#eedfd8] rounded-xl p-4 shadow-xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {/* Event Type Dropdown */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#85261e] mb-1">
                  Event Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-white border border-[#eedfd8] rounded-lg px-3 py-2 text-xs font-semibold text-[#33110e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                >
                  <option value="ALL">All Event Types</option>
                  {availableTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
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

              {/* Category Dropdown */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#85261e] mb-1">
                  Category / Role
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-white border border-[#eedfd8] rounded-lg px-3 py-2 text-xs font-semibold text-[#33110e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                >
                  <option value="ALL">All Categories</option>
                  {availableCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Faculty / Coordinator Dropdown */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#85261e] mb-1">
                  Faculty / Coordinator
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
                  placeholder="Search title, venue, coordinators, agency..."
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
                  Showing {filteredEvents.length} of {eventsList.length} events
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
                    Event Title &amp; Organizing Details
                  </th>
                  <th className="py-3 px-3 text-center w-40 border-r border-neutral-800">
                    Type &amp; Session
                  </th>
                  <th className="py-3 px-3 text-center w-48 border-r border-neutral-800">
                    Schedule &amp; Venue
                  </th>
                  <th className="py-3 px-3 text-center w-24">
                    View
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#eedfd8] text-xs">
                {paginatedEvents.map((eventItem: any, idx: number) => {
                  const srNo = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                  const organizerText = [
                    eventItem.coordinator && `Coord: ${eventItem.coordinator}`,
                    eventItem.convenor && `Convenor: ${eventItem.convenor}`,
                  ]
                    .filter(Boolean)
                    .join(" | ");

                  return (
                    <tr
                      key={eventItem.id || idx}
                      className="hover:bg-[#fff9f6] transition duration-150"
                    >
                      {/* Sr. No */}
                      <td className="py-3.5 px-3 text-center font-bold text-neutral-500 border-r border-[#eedfd8] align-top">
                        #{srNo}
                      </td>

                      {/* Event Title & Details */}
                      <td className="py-3.5 px-4 border-r border-[#eedfd8] space-y-1.5">
                        <p className="leading-relaxed">
                          {/* Title */}
                          <span className="font-bold text-[#1c110c] text-sm">
                            {eventItem.title}
                          </span>
                        </p>

                        {organizerText && (
                          <p className="text-[11px] text-neutral-700">
                            <strong className="text-[#85261e] font-bold">Organizers: </strong>
                            <span className="font-semibold">{organizerText}</span>
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-neutral-500 font-mono">
                          {eventItem.sponsoring_agency && (
                            <span>
                              <span className="font-sans font-semibold text-neutral-700">Sponsor:</span>{" "}
                              <strong className="text-neutral-900">{eventItem.sponsoring_agency}</strong>
                            </span>
                          )}
                          {eventItem.venue && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#85261e]" />
                              <span className="font-sans text-neutral-800 font-semibold">{eventItem.venue}</span>
                            </span>
                          )}
                          {eventItem.link_url && (
                            <a
                              href={eventItem.link_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#85261e] hover:underline font-sans font-bold flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" /> Brochure
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Event Type & Session */}
                      <td className="py-3.5 px-3 text-center border-r border-[#eedfd8] align-top space-y-1.5">
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider inline-block ${getTypeBadgeStyle(
                            eventItem.event_type
                          )}`}
                        >
                          {eventItem.event_type || "Workshop/STC"}
                        </span>
                        <div className="text-[11px] font-mono text-neutral-600 font-semibold">
                          {eventItem.academic_session || "—"}
                        </div>
                      </td>

                      {/* Schedule & Venue */}
                      <td className="py-3.5 px-3 text-center border-r border-[#eedfd8] align-top space-y-1">
                        <div className="flex items-center justify-center gap-1 font-mono text-neutral-800 font-bold">
                          <Calendar className="w-3.5 h-3.5 text-[#85261e]" />
                          <span>
                            {eventItem.start_date
                              ? `${formatDate(eventItem.start_date)}${eventItem.end_date && eventItem.end_date !== eventItem.start_date ? ` to ${formatDate(eventItem.end_date)}` : ""}`
                              : "—"}
                          </span>
                        </div>
                        {eventItem.category && (
                          <span className="inline-block text-[10px] px-2 py-0.2 rounded bg-neutral-100 text-neutral-700 font-semibold uppercase">
                            {eventItem.category}
                          </span>
                        )}
                      </td>

                      {/* View Details Action (Institutional Maroon Button) */}
                      <td className="py-3.5 px-3 text-center align-top">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedEvent(eventItem)}
                            className="bg-[#33110e] hover:bg-[#85261e] text-white text-xs font-semibold px-3 py-1 rounded-md transition duration-150 shadow-xs cursor-pointer"
                          >
                            Details
                          </button>
                          {isAdmin && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(eventItem)}
                                className="p-1 rounded-md border border-[#eedfd8] bg-white text-neutral-700 hover:text-[#85261e] hover:border-[#85261e] transition cursor-pointer shadow-2xs"
                                title="Edit Event"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteEvent(eventItem.id, eventItem.title)}
                                className="p-1 rounded-md border border-[#eedfd8] bg-white text-neutral-500 hover:text-red-600 hover:border-red-300 transition cursor-pointer shadow-2xs"
                                title="Delete Event"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredEvents.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-neutral-500 text-xs bg-[#fff9f6]">
                      No conferences, workshops, or academic events found matching your selected filters.
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
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredEvents.length)} of {filteredEvents.length} events
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
          {selectedEvent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl shadow-2xl border border-[#eedfd8] w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header with Institutional Maroon Background & Gold Accents */}
                <div className="bg-[#33110e] text-white px-5 py-3.5 flex items-center justify-between border-b border-[#4a1814]">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm sm:text-base font-bold tracking-tight text-white">
                      Complete Academic Event Details
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="p-1 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* 2-Column Property Grid Table */}
                <div className="p-6 max-h-[75vh] overflow-y-auto divide-y divide-[#f4ece8] text-xs space-y-0.5">
                  <div className="py-2.5 grid grid-cols-12 gap-2">
                    <span className="col-span-4 font-bold text-[#33110e]">Event Title:</span>
                    <span className="col-span-8 text-neutral-900 font-bold leading-relaxed">
                      {selectedEvent.title}
                    </span>
                  </div>

                  <div className="py-2.5 grid grid-cols-12 gap-2">
                    <span className="col-span-4 font-bold text-[#33110e]">Event Type:</span>
                    <span className="col-span-8">
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider ${getTypeBadgeStyle(
                          selectedEvent.event_type
                        )}`}
                      >
                        {selectedEvent.event_type || "Workshop"}
                      </span>
                    </span>
                  </div>

                  <div className="py-2.5 grid grid-cols-12 gap-2">
                    <span className="col-span-4 font-bold text-[#33110e]">Category:</span>
                    <span className="col-span-8 text-neutral-800 font-semibold uppercase">
                      {selectedEvent.category || "Organized"}
                    </span>
                  </div>

                  {selectedEvent.coordinator && (
                    <div className="py-2.5 grid grid-cols-12 gap-2">
                      <span className="col-span-4 font-bold text-[#33110e]">Coordinator(s):</span>
                      <span className="col-span-8 text-[#85261e] font-bold leading-relaxed">
                        {selectedEvent.coordinator}
                      </span>
                    </div>
                  )}

                  {selectedEvent.convenor && (
                    <div className="py-2.5 grid grid-cols-12 gap-2">
                      <span className="col-span-4 font-bold text-[#33110e]">Convenor:</span>
                      <span className="col-span-8 text-neutral-800 font-bold">
                        {selectedEvent.convenor}
                      </span>
                    </div>
                  )}

                  <div className="py-2.5 grid grid-cols-12 gap-2">
                    <span className="col-span-4 font-bold text-[#33110e]">Sponsoring Agency:</span>
                    <span className="col-span-8 text-neutral-900 font-semibold">
                      {selectedEvent.sponsoring_agency || "NIT Hamirpur"}
                    </span>
                  </div>

                  <div className="py-2.5 grid grid-cols-12 gap-2">
                    <span className="col-span-4 font-bold text-[#33110e]">Duration / Dates:</span>
                    <span className="col-span-8 text-neutral-900 font-mono font-bold">
                      {selectedEvent.start_date
                        ? `${formatDate(selectedEvent.start_date)}${selectedEvent.end_date && selectedEvent.end_date !== selectedEvent.start_date ? ` to ${formatDate(selectedEvent.end_date)}` : ""}`
                        : "—"}
                    </span>
                  </div>

                  <div className="py-2.5 grid grid-cols-12 gap-2">
                    <span className="col-span-4 font-bold text-[#33110e]">Venue / Mode:</span>
                    <span className="col-span-8 text-neutral-800 font-semibold">
                      {selectedEvent.venue || "NIT Hamirpur"}
                    </span>
                  </div>

                  <div className="py-2.5 grid grid-cols-12 gap-2">
                    <span className="col-span-4 font-bold text-[#33110e]">Academic Session:</span>
                    <span className="col-span-8 text-neutral-800 font-mono font-semibold">
                      {selectedEvent.academic_session || "—"}
                    </span>
                  </div>

                  {selectedEvent.link_url && (
                    <div className="py-2.5 grid grid-cols-12 gap-2">
                      <span className="col-span-4 font-bold text-[#33110e]">Official Brochure:</span>
                      <span className="col-span-8">
                        <a
                          href={selectedEvent.link_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] hover:bg-[#85261e] hover:text-white transition font-bold text-xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          View Document / Brochure
                        </a>
                      </span>
                    </div>
                  )}
                </div>

                {/* Modal Actions Footer */}
                <div className="p-4 bg-[#fff9f6] border-t border-[#eedfd8] flex items-center justify-between">
                  <button
                    onClick={() => handleCopyCitation(selectedEvent)}
                    className="px-3.5 py-1.5 rounded-lg border border-[#eedfd8] bg-white hover:bg-neutral-100 text-xs font-semibold text-neutral-700 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    {copiedId === selectedEvent.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-neutral-800 font-bold" />
                        <span className="text-[#33110e] font-bold">Details Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Copy Information</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    {isAdmin && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            const ev = selectedEvent;
                            setSelectedEvent(null);
                            handleOpenEdit(ev);
                          }}
                          className="px-3 py-1.5 rounded-lg border border-[#eedfd8] bg-white text-neutral-700 hover:text-[#85261e] font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <Edit className="w-3.5 h-3.5" /> Edit Event
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const id = selectedEvent.id;
                            const title = selectedEvent.title;
                            handleDeleteEvent(id, title);
                          }}
                          className="px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-600 hover:text-white font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="px-4 py-1.5 rounded-lg bg-[#33110e] hover:bg-[#85261e] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Admin Inline Edit Modal */}
          {isEditModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white border border-[#eedfd8] rounded-2xl shadow-xl max-w-2xl w-full p-6 space-y-5 my-8">
                <div className="flex items-center justify-between border-b border-[#eedfd8] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-lg bg-[#fff9f6] text-[#85261e] border border-[#eedfd8]">
                      <Calendar className="w-4 h-4 text-[#85261e]" />
                    </span>
                    <h3 className="text-base font-bold text-[#1c110c]">Edit Academic Event Details</h3>
                  </div>
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-neutral-800 mb-1">
                      Event Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editFormData.title || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#eedfd8] text-xs focus:outline-hidden focus:border-[#85261e]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-neutral-800 mb-1">Event Type</label>
                      <input
                        type="text"
                        value={editFormData.event_type || ""}
                        onChange={(e) => setEditFormData({ ...editFormData, event_type: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#eedfd8] text-xs focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-neutral-800 mb-1">Category</label>
                      <select
                        value={editFormData.category || "organized"}
                        onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#eedfd8] text-xs capitalize font-semibold focus:outline-hidden"
                      >
                        <option value="organized">Organized</option>
                        <option value="attended">Attended</option>
                        <option value="invited">Invited</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-neutral-800 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={editFormData.start_date || ""}
                        onChange={(e) => setEditFormData({ ...editFormData, start_date: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#eedfd8] text-xs focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-neutral-800 mb-1">End Date</label>
                      <input
                        type="date"
                        value={editFormData.end_date || ""}
                        onChange={(e) => setEditFormData({ ...editFormData, end_date: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#eedfd8] text-xs focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-neutral-800 mb-1">Academic Session</label>
                      <input
                        type="text"
                        value={editFormData.academic_session || ""}
                        onChange={(e) => setEditFormData({ ...editFormData, academic_session: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#eedfd8] text-xs focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-neutral-800 mb-1">Venue</label>
                      <input
                        type="text"
                        value={editFormData.venue || ""}
                        onChange={(e) => setEditFormData({ ...editFormData, venue: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#eedfd8] text-xs focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-neutral-800 mb-1">Sponsoring Agency</label>
                      <input
                        type="text"
                        value={editFormData.sponsoring_agency || ""}
                        onChange={(e) => setEditFormData({ ...editFormData, sponsoring_agency: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#eedfd8] text-xs focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-neutral-800 mb-1">Coordinator(s)</label>
                      <input
                        type="text"
                        value={editFormData.coordinator || ""}
                        onChange={(e) => setEditFormData({ ...editFormData, coordinator: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#eedfd8] text-xs focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-neutral-800 mb-1">Convenor(s)</label>
                      <input
                        type="text"
                        value={editFormData.convenor || ""}
                        onChange={(e) => setEditFormData({ ...editFormData, convenor: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#eedfd8] text-xs focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-800 mb-1">Brochure Link</label>
                    <input
                      type="url"
                      value={editFormData.link_url || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, link_url: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#eedfd8] text-xs focus:outline-hidden"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#eedfd8]">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="px-4 py-2 rounded-xl border border-[#eedfd8] text-xs font-semibold text-neutral-600 hover:bg-neutral-50 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
