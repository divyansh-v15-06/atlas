"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Search,
  Plus,
  Trash2,
  Edit,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  X,
  Filter,
  Check,
  Building2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import {
  getStoredEvents,
  saveStoredEvents,
  deleteStoredEvent,
  updateOrAddStoredEvent,
  deduplicateStoredEvents,
} from "@/lib/faculty-storage";
import { useDepartment } from "@/context/department-context";

interface EventFormData {
  id?: string;
  title: string;
  event_type: string;
  category: string;
  start_date: string;
  end_date: string;
  academic_session: string;
  venue: string;
  sponsoring_agency: string;
  coordinator: string;
  convenor: string;
  link_url?: string;
  faculty_ids?: string[];
}

const EVENT_TYPE_OPTIONS = [
  "Workshop",
  "FDP/STC",
  "Conference",
  "National Conference",
  "International Conference",
  "Seminar",
  "Symposium",
  "E-STC",
  "Other",
];

const CATEGORY_OPTIONS = ["organized", "attended", "invited"];

export default function AdminEventsPage() {
  const { activeDepartment } = useDepartment();
  const [events, setEvents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedSession, setSelectedSession] = useState("ALL");
  const [onlyDuplicates, setOnlyDuplicates] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    event_type: "Workshop",
    category: "organized",
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date().toISOString().split("T")[0],
    academic_session: "2024-2025",
    venue: "NIT Hamirpur",
    sponsoring_agency: "NIT Hamirpur",
    coordinator: "",
    convenor: "",
    link_url: "",
  });

  const loadEvents = () => {
    const data = getStoredEvents();
    setEvents(data);
  };

  useEffect(() => {
    loadEvents();

    const handleUpdate = () => loadEvents();
    window.addEventListener("nith_events_updated", handleUpdate);
    return () => window.removeEventListener("nith_events_updated", handleUpdate);
  }, []);

  // Compute duplicate occurrences
  const duplicateMap = useMemo(() => {
    const map = new Map<string, number>();
    events.forEach((e: any) => {
      const normTitle = (e.title || "").trim().toLowerCase().replace(/\s+/g, " ");
      const startDate = (e.start_date || "").trim();
      const key = `${normTitle}:::${startDate}`;
      map.set(key, (map.get(key) || 0) + 1);
    });
    return map;
  }, [events]);

  const duplicateCount = useMemo(() => {
    let count = 0;
    duplicateMap.forEach((qty) => {
      if (qty > 1) count += qty - 1;
    });
    return count;
  }, [duplicateMap]);

  // Available sessions
  const availableSessions = useMemo(() => {
    const sessions = new Set<string>();
    events.forEach((e: any) => {
      if (e.academic_session) sessions.add(e.academic_session.trim());
    });
    return Array.from(sessions).sort().reverse();
  }, [events]);

  // Filtered list
  const filteredEvents = useMemo(() => {
    return events.filter((e: any) => {
      const normTitle = (e.title || "").trim().toLowerCase().replace(/\s+/g, " ");
      const startDate = (e.start_date || "").trim();
      const key = `${normTitle}:::${startDate}`;
      const isDup = (duplicateMap.get(key) || 0) > 1;

      if (onlyDuplicates && !isDup) return false;

      if (selectedType !== "ALL") {
        if ((e.event_type || "").toLowerCase() !== selectedType.toLowerCase()) {
          return false;
        }
      }

      if (selectedSession !== "ALL") {
        if ((e.academic_session || "").trim() !== selectedSession.trim()) {
          return false;
        }
      }

      if (search.trim()) {
        const q = search.toLowerCase();
        const matches =
          (e.title && e.title.toLowerCase().includes(q)) ||
          (e.coordinator && e.coordinator.toLowerCase().includes(q)) ||
          (e.convenor && e.convenor.toLowerCase().includes(q)) ||
          (e.venue && e.venue.toLowerCase().includes(q)) ||
          (e.sponsoring_agency && e.sponsoring_agency.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [events, search, selectedType, selectedSession, onlyDuplicates, duplicateMap]);

  const openAddModal = () => {
    setEditingEvent(null);
    setFormData({
      title: "",
      event_type: "Workshop",
      category: "organized",
      start_date: new Date().toISOString().split("T")[0],
      end_date: new Date().toISOString().split("T")[0],
      academic_session: "2024-2025",
      venue: "NIT Hamirpur",
      sponsoring_agency: "NIT Hamirpur",
      coordinator: "",
      convenor: "",
      link_url: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (eventItem: any) => {
    setEditingEvent(eventItem);
    setFormData({
      id: eventItem.id,
      title: eventItem.title || "",
      event_type: eventItem.event_type || "Workshop",
      category: eventItem.category || "organized",
      start_date: eventItem.start_date || new Date().toISOString().split("T")[0],
      end_date: eventItem.end_date || eventItem.start_date || new Date().toISOString().split("T")[0],
      academic_session: eventItem.academic_session || "2024-2025",
      venue: eventItem.venue || "NIT Hamirpur",
      sponsoring_agency: eventItem.sponsoring_agency || "NIT Hamirpur",
      coordinator: eventItem.coordinator || "",
      convenor: eventItem.convenor || "",
      link_url: eventItem.link_url || "",
      faculty_ids: eventItem.faculty_ids || [],
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please enter an event title");
      return;
    }

    const saved = updateOrAddStoredEvent(formData);
    setEvents(saved);
    setIsModalOpen(false);
    toast.success(editingEvent ? "Event updated successfully!" : "New event created successfully!");
  };

  const handleDelete = (id: string, title: string) => {
    const updated = deleteStoredEvent(id);
    setEvents(updated);
    setDeleteConfirmId(null);
    toast.success(`Deleted event "${title.slice(0, 30)}..."`);
  };

  const handleDeduplicate = () => {
    const { cleaned, removedCount } = deduplicateStoredEvents();
    setEvents(cleaned);
    if (removedCount > 0) {
      toast.success(`Successfully deduplicated events! Consolidated records and removed ${removedCount} duplicate copies.`);
    } else {
      toast.info("No duplicate events detected.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-[#eedfd8] p-6 rounded-2xl shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#fff9f6] border border-[#eedfd8] text-[#85261e]">
              <Calendar className="w-6 h-6 text-[#85261e]" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#1c110c] tracking-tight">
                Department Events, Conferences &amp; STCs
              </h1>
              <p className="text-xs text-neutral-500 mt-0.5">
                Manage all academic events, edit details, and clean up duplicate records.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {duplicateCount > 0 && (
            <button
              onClick={handleDeduplicate}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Resolve Duplicates ({duplicateCount})
            </button>
          )}

          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer ml-auto sm:ml-0"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </button>
        </div>
      </div>

      {/* Duplicate Warning Banner */}
      {duplicateCount > 0 && (
        <div className="bg-amber-50 border border-amber-300/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-900">
                Duplicate Event Records Detected ({duplicateCount} surplus copies)
              </h4>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                Some event titles appear multiple times due to multiple faculty coordinator mappings or repeated entries.
                You can filter to inspect them or use the one-click deduplication engine to merge metadata onto the richest copy and remove the clones.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              onClick={() => setOnlyDuplicates(!onlyDuplicates)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                onlyDuplicates
                  ? "bg-amber-700 text-white border-amber-800"
                  : "bg-white text-amber-900 border-amber-300 hover:bg-amber-100"
              }`}
            >
              {onlyDuplicates ? "Show All Events" : "Filter Duplicates Only"}
            </button>
            <button
              onClick={handleDeduplicate}
              className="px-3.5 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" /> Deduplicate Now
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#eedfd8] p-4 rounded-xl shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by event title, coordinator, convenor, or venue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-[#eedfd8] bg-[#fff9f6]/40 text-xs text-[#1c110c] placeholder:text-neutral-400 focus:outline-hidden focus:border-[#85261e]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[#eedfd8] bg-white text-xs font-semibold text-neutral-700 focus:outline-hidden cursor-pointer"
          >
            <option value="ALL">All Event Types</option>
            {EVENT_TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* Session Filter */}
          <select
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[#eedfd8] bg-white text-xs font-semibold text-neutral-700 focus:outline-hidden cursor-pointer"
          >
            <option value="ALL">All Sessions</option>
            {availableSessions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {(search || selectedType !== "ALL" || selectedSession !== "ALL" || onlyDuplicates) && (
            <button
              onClick={() => {
                setSearch("");
                setSelectedType("ALL");
                setSelectedSession("ALL");
                setOnlyDuplicates(false);
              }}
              className="px-2.5 py-2 rounded-lg border border-[#eedfd8] bg-white text-xs font-bold text-neutral-600 hover:text-[#85261e] transition flex items-center gap-1"
              title="Reset Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white border border-[#eedfd8] rounded-2xl shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#eedfd8] bg-[#fff9f6] flex items-center justify-between">
          <span className="text-xs font-bold text-[#33110e]">
            Showing {filteredEvents.length} of {events.length} Events
          </span>
          {onlyDuplicates && (
            <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
              Filtered: Duplicate Candidates
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#eedfd8] bg-neutral-50/75 text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                <th className="py-3 px-3.5 text-center w-12">#</th>
                <th className="py-3 px-4 min-w-[280px]">Event Title &amp; Details</th>
                <th className="py-3 px-3 text-center min-w-[120px]">Type / Session</th>
                <th className="py-3 px-3 text-center min-w-[140px]">Dates &amp; Venue</th>
                <th className="py-3 px-3 text-center min-w-[150px]">Coordinators</th>
                <th className="py-3 px-3 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eedfd8]/60 text-xs">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((ev: any, idx: number) => {
                  const normTitle = (ev.title || "").trim().toLowerCase().replace(/\s+/g, " ");
                  const startDate = (ev.start_date || "").trim();
                  const key = `${normTitle}:::${startDate}`;
                  const copies = duplicateMap.get(key) || 1;
                  const isDup = copies > 1;

                  return (
                    <tr
                      key={ev.id || idx}
                      className={`hover:bg-[#fff9f6]/70 transition ${
                        isDup ? "bg-amber-50/40" : idx % 2 === 1 ? "bg-[#fcfaf9]" : "bg-white"
                      }`}
                    >
                      {/* Sr No */}
                      <td className="py-3.5 px-3 text-center font-mono font-bold text-neutral-400 align-top">
                        {idx + 1}
                      </td>

                      {/* Event Title */}
                      <td className="py-3.5 px-4 align-top space-y-1">
                        <div className="flex items-start gap-2">
                          <h3 className="font-bold text-[#1c110c] text-sm leading-snug">
                            {ev.title}
                          </h3>
                          {isDup && (
                            <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                              Duplicate (x{copies})
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-500">
                          <span className="capitalize font-semibold text-[#85261e]">
                            Category: {ev.category || "organized"}
                          </span>
                          {ev.sponsoring_agency && (
                            <span>• Sponsor: {ev.sponsoring_agency}</span>
                          )}
                          {ev.link_url && (
                            <a
                              href={ev.link_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#85261e] hover:underline font-semibold flex items-center gap-0.5"
                            >
                              <ExternalLink className="w-3 h-3" /> Brochure
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Type & Session */}
                      <td className="py-3.5 px-3 text-center align-top space-y-1">
                        <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#fff9f6] text-[#85261e] border border-[#eedfd8]">
                          {ev.event_type || "Workshop"}
                        </span>
                        <div className="font-mono text-[11px] font-semibold text-neutral-600">
                          {ev.academic_session || "—"}
                        </div>
                      </td>

                      {/* Dates & Venue */}
                      <td className="py-3.5 px-3 text-center align-top space-y-1 font-mono text-[11px]">
                        <div className="font-bold text-neutral-800">
                          {formatDate(ev.start_date)}
                          {ev.end_date && ev.end_date !== ev.start_date && (
                            <div>to {formatDate(ev.end_date)}</div>
                          )}
                        </div>
                        <div className="font-sans text-[11px] text-neutral-500 font-medium">
                          {ev.venue || "NIT Hamirpur"}
                        </div>
                      </td>

                      {/* Coordinators & Convenor */}
                      <td className="py-3.5 px-3 text-center align-top text-[11px] space-y-1">
                        {ev.coordinator ? (
                          <div className="font-semibold text-neutral-800">
                            {ev.coordinator}
                          </div>
                        ) : (
                          <div className="text-neutral-400 italic">No coordinator listed</div>
                        )}
                        {ev.convenor && (
                          <div className="text-[10px] text-neutral-500">
                            Convenor: {ev.convenor}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-3 text-center align-top">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(ev)}
                            className="p-1.5 rounded-lg border border-[#eedfd8] bg-white text-neutral-700 hover:text-[#85261e] hover:border-[#85261e] transition cursor-pointer shadow-2xs"
                            title="Edit Event"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {deleteConfirmId === ev.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleDelete(ev.id, ev.title)}
                                className="px-2 py-1 rounded-md bg-red-600 text-white text-[10px] font-bold hover:bg-red-700 transition cursor-pointer"
                              >
                                Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(null)}
                                className="p-1 rounded-md bg-neutral-200 text-neutral-700 hover:bg-neutral-300 transition cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(ev.id)}
                              className="p-1.5 rounded-lg border border-[#eedfd8] bg-white text-neutral-500 hover:text-red-600 hover:border-red-300 transition cursor-pointer shadow-2xs"
                              title="Delete Event"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400 text-xs">
                    No event records match your current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#eedfd8] rounded-2xl shadow-xl max-w-2xl w-full p-6 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-[#eedfd8] pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-[#fff9f6] text-[#85261e] border border-[#eedfd8]">
                  <Calendar className="w-4 h-4 text-[#85261e]" />
                </span>
                <h3 className="text-base font-bold text-[#1c110c]">
                  {editingEvent ? "Edit Event Details" : "Create New Department Event"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Event Title */}
              <div>
                <label className="block font-bold text-neutral-800 mb-1">
                  Event Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Research Applications of Deep Learning"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#eedfd8] text-xs focus:outline-hidden focus:border-[#85261e]"
                />
              </div>

              {/* Event Type & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Event Type</label>
                  <select
                    value={formData.event_type}
                    onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#eedfd8] text-xs font-semibold focus:outline-hidden"
                  >
                    {EVENT_TYPE_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#eedfd8] text-xs capitalize font-semibold focus:outline-hidden"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dates & Academic Session */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#eedfd8] text-xs focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-800 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#eedfd8] text-xs focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Academic Session</label>
                  <input
                    type="text"
                    placeholder="e.g. 2024-2025"
                    value={formData.academic_session}
                    onChange={(e) => setFormData({ ...formData, academic_session: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#eedfd8] text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Venue & Sponsoring Agency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Venue / Mode</label>
                  <input
                    type="text"
                    placeholder="e.g. Online, DoCSE, NIT Hamirpur"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#eedfd8] text-xs focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Sponsoring Agency</label>
                  <input
                    type="text"
                    placeholder="e.g. NIT Hamirpur / DST-SERB"
                    value={formData.sponsoring_agency}
                    onChange={(e) => setFormData({ ...formData, sponsoring_agency: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#eedfd8] text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Coordinators & Convenors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Coordinator(s)</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Mohammad Khalid Pandit, Dr. Ajay Kumar Mallick"
                    value={formData.coordinator}
                    onChange={(e) => setFormData({ ...formData, coordinator: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#eedfd8] text-xs focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Convenor(s)</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Rajeev Kumar"
                    value={formData.convenor}
                    onChange={(e) => setFormData({ ...formData, convenor: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#eedfd8] text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Brochure Link */}
              <div>
                <label className="block font-bold text-neutral-800 mb-1">Brochure / Document URL</label>
                <input
                  type="url"
                  placeholder="https://nith.ac.in/uploads/topics/..."
                  value={formData.link_url}
                  onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#eedfd8] text-xs focus:outline-hidden"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#eedfd8]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#eedfd8] text-xs font-semibold text-neutral-600 hover:bg-neutral-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  {editingEvent ? "Save Changes" : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

