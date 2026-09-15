"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Trash2,
  Edit,
  Calendar,
  X,
  Search,
  CheckCircle2,
  Building2,
  Sparkles,
  Users,
  Presentation,
  Clock,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { MOCK_FACULTY, MOCK_EVENTS } from "@/lib/mock-data";
import { getStoredData, saveFacultyRecord } from "@/lib/faculty-storage";
import AssociatedFacultyPicker from "@/components/faculty/AssociatedFacultyPicker";
import { ACADEMIC_SESSIONS } from "@/lib/faculty-constants";

export default function FacultyEventsPage() {
  const [user, setUser] = useState<any>(null);
  const [faculty, setFaculty] = useState<any>(MOCK_FACULTY[0]);
  const [events, setEvents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields matching tempcsebase
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState("Workshop");
  const [category, setCategory] = useState("organized");
  const [venue, setVenue] = useState("NIT Hamirpur");
  const [agency, setAgency] = useState("NIT Hamirpur");
  const [academicSession, setAcademicSession] = useState(ACADEMIC_SESSIONS[1] || "2024-2025");
  const [startDate, setStartDate] = useState("2024-07-01");
  const [endDate, setEndDate] = useState("2024-07-05");
  const [position1, setPosition1] = useState("Coordinator");
  const [position2, setPosition2] = useState("");
  const [selectedAssociatedFaculty, setSelectedAssociatedFaculty] = useState<any[]>([]);

  const loadEvents = (activeFaculty: any) => {
    const facId = activeFaculty?.id;
    const legacyId = activeFaculty?.legacy_id;
    const userEvents = MOCK_EVENTS.filter((e: any) => {
      if (facId && e.faculty_ids && e.faculty_ids.includes(facId)) return true;
      if (legacyId && e.faculty_legacy_ids && e.faculty_legacy_ids.includes(legacyId)) return true;
      return false;
    });

    const fallback =
      Array.isArray(activeFaculty?.events) && activeFaculty.events.length > 0
        ? activeFaculty.events
        : userEvents;
    const stored = getStoredData(activeFaculty, "events", fallback);
    setEvents(stored);
  };

  useEffect(() => {
    let activeFaculty = MOCK_FACULTY[0];
    const raw = localStorage.getItem("auth_user");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setUser(parsed);
        const match = MOCK_FACULTY.find(
          (f) =>
            f.employee_code?.toLowerCase() === parsed.employee_code?.toLowerCase() ||
            f.email?.toLowerCase() === parsed.email?.toLowerCase() ||
            f.id === parsed.faculty_id
        );
        if (match) {
          activeFaculty = match;
          setFaculty(match);
        }
      } catch {}
    }

    loadEvents(activeFaculty);

    const handleStorageUpdate = (e: any) => {
      if (!e.detail?.section || e.detail.section === "events") {
        loadEvents(activeFaculty);
      }
    };
    window.addEventListener("nith_faculty_storage_update", handleStorageUpdate);
    return () => window.removeEventListener("nith_faculty_storage_update", handleStorageUpdate);
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        e.title?.toLowerCase().includes(q) ||
        (e.venue && e.venue.toLowerCase().includes(q)) ||
        (e.convenor && e.convenor.toLowerCase().includes(q)) ||
        (e.coordinator && e.coordinator.toLowerCase().includes(q));

      const matchesCategory =
        categoryFilter === "ALL" || e.category?.toLowerCase() === categoryFilter.toLowerCase();

      const matchesType =
        typeFilter === "ALL" || e.event_type?.toLowerCase() === typeFilter.toLowerCase();

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [events, search, categoryFilter, typeFilter]);

  const openAddModal = () => {
    setModalMode("add");
    setEditingId(null);
    setTitle("");
    setEventType("Workshop");
    setCategory("organized");
    setVenue("NIT Hamirpur");
    setAgency("NIT Hamirpur");
    setAcademicSession(ACADEMIC_SESSIONS[1] || "2024-2025");
    setStartDate(new Date().toISOString().split("T")[0]);
    setEndDate(new Date().toISOString().split("T")[0]);
    setPosition1("Coordinator");
    setPosition2("");
    setSelectedAssociatedFaculty([]);
    setShowModal(true);
  };

  const openEditModal = (ev: any) => {
    setModalMode("edit");
    setEditingId(ev.id);
    setTitle(ev.title || "");
    setEventType(ev.event_type || "Workshop");
    setCategory(ev.category || "organized");
    setVenue(ev.venue || "NIT Hamirpur");
    setAgency(ev.sponsoring_agency || ev.agency || "NIT Hamirpur");
    setAcademicSession(ev.academic_session || ACADEMIC_SESSIONS[1]);
    setStartDate(ev.start_date || "");
    setEndDate(ev.end_date || ev.start_date || "");
    setPosition1(ev.position1 || ev.convenor || "Coordinator");
    setPosition2(ev.position2 || ev.coordinator || "");

    const linked = Array.isArray(ev.associated_faculty)
      ? ev.associated_faculty
      : Array.isArray(ev.faculty_ids)
      ? MOCK_FACULTY.filter((f) => ev.faculty_ids.includes(f.id))
      : [];
    setSelectedAssociatedFaculty(linked);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !venue.trim()) {
      toast.error("Please provide Event Title and Venue");
      return;
    }

    const evRecord: any = {
      id: modalMode === "edit" && editingId ? editingId : `ev-${Date.now()}`,
      title: title.trim(),
      category: category,
      event_type: eventType,
      type: eventType,
      venue: venue.trim(),
      sponsoring_agency: agency.trim() || "NIT Hamirpur",
      agency: agency.trim() || "NIT Hamirpur",
      start_date: startDate,
      end_date: endDate || startDate,
      academic_session: academicSession,
      position1: position1.trim() || "Coordinator",
      position2: position2.trim() || undefined,
      convenor: position1.trim() || `${faculty.full_name} (Coordinator)`,
      coordinator: position2.trim() || undefined,
      associated_faculty: selectedAssociatedFaculty,
      faculty_ids: [
        faculty.id,
        ...selectedAssociatedFaculty.map((f) => f.id || f.employee_code),
      ],
      updated_at: new Date().toISOString(),
    };

    saveFacultyRecord(faculty, "events", evRecord, false);
    loadEvents(faculty);
    setShowModal(false);
    toast.success(
      modalMode === "edit"
        ? "Academic event entry updated and synchronized successfully!"
        : "Academic event recorded and synchronized with co-organizers!"
    );
  };

  const handleDelete = (ev: any) => {
    if (!window.confirm(`Are you sure you want to delete "${ev.title}"?`)) return;
    saveFacultyRecord(faculty, "events", ev, true);
    loadEvents(faculty);
    toast.success("Academic event removed and storage updated");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      {/* Header Banner */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <Calendar className="w-6 h-6 text-[#85261e]" />
              Conferences, STCs &amp; FDPs
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2.5 py-0.5 rounded-full">
              {events.length} Events Logged
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Conferences, Short-Term Courses, Faculty Development Programmes organized or attended by{" "}
            <strong>{faculty.full_name}</strong>.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] text-white px-4 py-2.5 text-xs font-bold shadow-xs hover:shadow-md transition cursor-pointer"
        >
          <Plus className="h-4 w-4 text-amber-300" />
          <span>Add Event</span>
        </button>
      </div>

      {/* Filter Strip */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search events by title, venue, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#eedfd8] bg-white text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e] shadow-2xs"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-[#eedfd8] bg-white text-xs font-semibold text-[#33110e] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e] shadow-2xs cursor-pointer"
        >
          <option value="ALL">All Categories</option>
          <option value="organized">Organized</option>
          <option value="attended">Attended</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-[#eedfd8] bg-white text-xs font-semibold text-[#33110e] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e] shadow-2xs cursor-pointer"
        >
          <option value="ALL">All Types</option>
          <option value="Conference">Conferences</option>
          <option value="Workshop">Workshops</option>
          <option value="FDP">FDPs</option>
          <option value="STC">STCs</option>
          <option value="Seminar">Seminars</option>
        </select>
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {filteredEvents.map((ev: any) => (
          <div
            key={ev.id}
            className="rounded-2xl border border-[#eedfd8] bg-white p-5 shadow-2xs hover:shadow-md transition space-y-3 group"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  ev.category?.toLowerCase() === "organized"
                    ? "bg-purple-100 text-purple-800 border border-purple-300"
                    : "bg-blue-100 text-blue-800 border border-blue-300"
                }`}
              >
                {ev.category?.toLowerCase() === "organized" ? "Organized" : "Attended"}
              </span>

              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#33110e] text-white">
                {ev.event_type || ev.type || "Event"}
              </span>

              {ev.academic_session && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-neutral-100 text-neutral-600">
                  Session: {ev.academic_session}
                </span>
              )}

              <span className="text-xs font-bold text-neutral-400 ml-auto font-mono">
                {ev.start_date} {ev.end_date && ev.end_date !== ev.start_date ? `to ${ev.end_date}` : ""}
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-[#1c110c] leading-snug">
              {ev.title}
            </h3>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-600">
              <span className="font-semibold text-[#85261e] flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                {ev.venue || "NIT Hamirpur"}
              </span>
              {ev.sponsoring_agency && (
                <>
                  <span>•</span>
                  <span>Sponsored by {ev.sponsoring_agency}</span>
                </>
              )}
            </div>

            {(ev.position1 || ev.position2 || ev.convenor || ev.coordinator) && (
              <div className="p-2.5 rounded-xl bg-[#fff9f6] border border-[#eedfd8]/60 text-xs text-neutral-700 flex flex-wrap items-center gap-3">
                <span className="font-bold text-neutral-900">Role / Position:</span>
                <span>{ev.position1 || ev.convenor}</span>
                {(ev.position2 || ev.coordinator) && (
                  <span>• {ev.position2 || ev.coordinator}</span>
                )}
              </div>
            )}

            {/* Actions Strip */}
            <div className="flex items-center justify-end gap-1 pt-3 border-t border-[#eedfd8]/60 text-xs">
              <button
                type="button"
                onClick={() => openEditModal(ev)}
                className="p-1.5 text-neutral-500 hover:text-[#85261e] transition rounded-lg hover:bg-[#fdf5f2] cursor-pointer"
                title="Edit Event"
              >
                <Edit className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => handleDelete(ev)}
                className="p-1.5 text-neutral-400 hover:text-red-700 transition rounded-lg hover:bg-red-50 cursor-pointer"
                title="Remove Event"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredEvents.length === 0 && (
          <div className="text-center py-16 text-neutral-500 text-xs bg-white rounded-2xl border border-[#eedfd8]">
            No events found matching your search.
          </div>
        )}
      </div>

      {/* Add / Edit Event Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl border border-[#eedfd8] bg-white p-6 sm:p-8 shadow-2xl space-y-5 my-8 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#eedfd8]/60 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#85261e]">
                  {modalMode === "edit" ? "Modify Academic Event" : "New Academic Event"}
                </span>
                <h2 className="text-xl font-extrabold text-[#33110e]">
                  {modalMode === "edit" ? "Edit Event Details" : "Register Conference, STC or FDP"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-[#33110e] hover:bg-[#fff9f6] transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="space-y-4 overflow-y-auto pr-1 flex-1 text-xs">
              {/* Title */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                  Event Title *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. One-Week Short Term Course on Machine Learning and High-Performance Computing"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-3 text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              {/* Category, Type, Academic Session */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs font-semibold text-[#33110e] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  >
                    <option value="organized">Organized</option>
                    <option value="attended">Attended</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Event Type *
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs font-semibold text-[#33110e] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  >
                    <option value="Conference">Conference</option>
                    <option value="Workshop">Workshop</option>
                    <option value="FDP">Faculty Development Programme (FDP)</option>
                    <option value="STC">Short Term Course (STC)</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Symposium">Symposium</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Academic Session *
                  </label>
                  <select
                    value={academicSession}
                    onChange={(e) => setAcademicSession(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs font-semibold text-[#33110e] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  >
                    {ACADEMIC_SESSIONS.map((sess) => (
                      <option key={sess} value={sess}>
                        {sess}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Venue & Sponsoring Agency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Event Venue / Location *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NIT Hamirpur (H.P.)"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Sponsoring / Funding Agency
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TEQIP-III / AICTE / Self-Sponsored"
                    value={agency}
                    onChange={(e) => setAgency(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>
              </div>

              {/* Roles / Positions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Designation / Role 1 *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Coordinator / Convenor / Organizing Secretary"
                    value={position1}
                    onChange={(e) => setPosition1(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Designation / Role 2 (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Co-Coordinator / Joint Secretary"
                    value={position2}
                    onChange={(e) => setPosition2(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>
              </div>

              {/* Associated Faculty Picker for instant cross-sync */}
              <div className="pt-2 border-t border-[#eedfd8]/60">
                <AssociatedFacultyPicker
                  selected={selectedAssociatedFaculty}
                  onChange={setSelectedAssociatedFaculty}
                  currentFaculty={faculty}
                  label="Co-Organizers / Associated Faculty (NIT Hamirpur)"
                  placeholder="Link co-convenor or co-coordinator colleagues..."
                  helperText="Selected colleagues will automatically see this event logged on their profile."
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#eedfd8]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-[#eedfd8] bg-white px-4 py-2.5 text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#85261e] hover:bg-[#33110e] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:shadow-md transition cursor-pointer"
                >
                  {modalMode === "edit" ? "Save Changes" : "Register Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
