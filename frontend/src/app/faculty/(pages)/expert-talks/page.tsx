"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit,
  Mic2,
  X,
  Building2,
  Calendar,
  Sparkles,
  BookOpen,
  Clock,
  Presentation,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { MOCK_FACULTY } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { getStoredData, saveFacultyRecord } from "@/lib/faculty-storage";
import AssociatedFacultyPicker from "@/components/faculty/AssociatedFacultyPicker";
import { ACADEMIC_SESSIONS } from "@/lib/faculty-constants";

export interface ExpertTalk {
  id?: string;
  title: string;
  venue: string;
  start_date?: string;
  date?: string;
  end_date?: string;
  academic_session?: string;
  is_present?: boolean;
  status?: string;
  description?: string;
  associated_faculty?: any[];
  faculty_ids?: string[];
}

export default function ExpertTalksPage() {
  const [user, setUser] = useState<any>(null);
  const [faculty, setFaculty] = useState<any>(MOCK_FACULTY[0]);
  const [items, setItems] = useState<ExpertTalk[]>([]);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states matching tempcsebase
  const [title, setTitle] = useState("");
  const [venue, setVenue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [academicSession, setAcademicSession] = useState(ACADEMIC_SESSIONS[1] || "2024-2025");
  const [isPresent, setIsPresent] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedAssociatedFaculty, setSelectedAssociatedFaculty] = useState<any[]>([]);

  const loadTalks = (activeFaculty: any) => {
    const facultyTalks = (activeFaculty as any).expert_talks || [];
    const fallback =
      facultyTalks.length > 0
        ? facultyTalks
        : [
            {
              id: "talk-1",
              title: "Emerging Trends in Artificial Intelligence and Cloud Systems",
              venue: "National Institute of Technology Hamirpur",
              start_date: "2024-04-12",
              date: "2024-04-12",
              academic_session: "2023-2024",
              description: "Keynote lecture in One-Week Faculty Development Programme.",
            },
            {
              id: "talk-2",
              title: "Wireless Sensor Networks & Distributed Security",
              venue: "IEEE Delhi Section & IIT Roorkee",
              start_date: "2023-11-20",
              date: "2023-11-20",
              academic_session: "2023-2024",
              description: "Invited expert session for postgraduate researchers.",
            },
          ];

    const stored = getStoredData<ExpertTalk>(activeFaculty, "expert_talks", fallback);
    setItems(stored);
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

    loadTalks(activeFaculty);

    const handleStorageUpdate = (e: any) => {
      if (!e.detail?.section || e.detail.section === "expert_talks") {
        loadTalks(activeFaculty);
      }
    };
    window.addEventListener("nith_faculty_storage_update", handleStorageUpdate);
    return () => window.removeEventListener("nith_faculty_storage_update", handleStorageUpdate);
  }, []);

  const openAddModal = () => {
    setModalMode("add");
    setEditingId(null);
    setTitle("");
    setVenue("");
    setStartDate(new Date().toISOString().split("T")[0]);
    setEndDate("");
    setAcademicSession(ACADEMIC_SESSIONS[1] || "2024-2025");
    setIsPresent(false);
    setDescription("");
    setSelectedAssociatedFaculty([]);
    setShowModal(true);
  };

  const openEditModal = (talk: ExpertTalk) => {
    setModalMode("edit");
    setEditingId(talk.id || talk.title);
    setTitle(talk.title || "");
    setVenue(talk.venue || "");
    setStartDate(talk.start_date || talk.date || "");
    setEndDate(talk.end_date || "");
    setAcademicSession(talk.academic_session || ACADEMIC_SESSIONS[1]);
    setIsPresent(Boolean(talk.is_present));
    setDescription(talk.description || "");

    const linked = Array.isArray(talk.associated_faculty)
      ? talk.associated_faculty
      : Array.isArray(talk.faculty_ids)
      ? MOCK_FACULTY.filter((f) => talk.faculty_ids?.includes(f.id))
      : [];
    setSelectedAssociatedFaculty(linked);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !venue.trim()) {
      toast.error("Please provide Talk Title and Host Institution / Venue");
      return;
    }

    const talkRecord: ExpertTalk = {
      id: modalMode === "edit" && editingId ? editingId : `talk-${Date.now()}`,
      title: title.trim(),
      venue: venue.trim(),
      start_date: startDate.trim() || undefined,
      date: startDate.trim() || undefined,
      end_date: isPresent ? "Present" : endDate.trim() || undefined,
      academic_session: academicSession,
      is_present: isPresent,
      status: isPresent ? "Ongoing" : "Delivered",
      description: description.trim() || undefined,
      associated_faculty: selectedAssociatedFaculty,
      faculty_ids: [
        faculty.id,
        ...selectedAssociatedFaculty.map((f) => f.id || f.employee_code),
      ],
    };

    saveFacultyRecord(faculty, "expert_talks", talkRecord, false);
    loadTalks(faculty);
    setShowModal(false);
    toast.success(
      modalMode === "edit"
        ? "Expert talk updated and synchronized successfully!"
        : "Expert talk and keynote lecture recorded and synchronized!"
    );
  };

  const handleDelete = (talk: ExpertTalk) => {
    if (!window.confirm(`Are you sure you want to delete "${talk.title}"?`)) return;
    saveFacultyRecord(faculty, "expert_talks", talk, true);
    loadTalks(faculty);
    toast.success("Talk record removed and storage updated");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      {/* Header Banner */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <Mic2 className="w-6 h-6 text-[#85261e]" />
              Keynote Lectures &amp; Expert Talks
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2.5 py-0.5 rounded-full">
              {items.length} Delivered
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Invited keynote talks, plenary addresses, and expert lectures delivered at national and
            international venues by <strong>{faculty.full_name}</strong>.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] text-white px-4 py-2.5 text-xs font-bold shadow-xs hover:shadow-md transition cursor-pointer"
        >
          <Plus className="h-4 w-4 text-amber-300" />
          <span>Add Talk</span>
        </button>
      </div>

      {/* Talks List */}
      <div className="space-y-3">
        {items.map((talk, idx) => (
          <div
            key={talk.id || idx}
            className="rounded-2xl border border-[#eedfd8] bg-white p-5 shadow-2xs hover:shadow-md transition space-y-2 group"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#33110e] text-white uppercase">
                <Presentation className="w-3 h-3 text-amber-300" />
                Keynote / Lecture
              </span>

              {talk.academic_session && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-neutral-100 text-neutral-600">
                  Session: {talk.academic_session}
                </span>
              )}

              <span className="text-xs font-bold text-neutral-400 ml-auto font-mono">
                {formatDate(talk.start_date || talk.date, "Delivered")}
                {talk.end_date && talk.end_date !== talk.start_date && ` to ${formatDate(talk.end_date)}`}
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-[#1c110c] leading-snug">
              {talk.title}
            </h3>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#85261e]">
              <Building2 className="w-3.5 h-3.5" />
              <span>{talk.venue}</span>
            </div>

            {talk.description && (
              <p className="text-xs text-neutral-600 leading-relaxed pt-1">
                {talk.description}
              </p>
            )}

            {/* Actions Strip */}
            <div className="flex items-center justify-end gap-1 pt-3 border-t border-[#eedfd8]/60 text-xs">
              <button
                type="button"
                onClick={() => openEditModal(talk)}
                className="p-1.5 text-neutral-500 hover:text-[#85261e] transition rounded-lg hover:bg-[#fdf5f2] cursor-pointer"
                title="Edit Talk"
              >
                <Edit className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => handleDelete(talk)}
                className="p-1.5 text-neutral-400 hover:text-red-700 transition rounded-lg hover:bg-red-50 cursor-pointer"
                title="Remove Talk"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-16 text-neutral-500 text-xs bg-white rounded-2xl border border-[#eedfd8]">
            No expert talks recorded. Click "+ Add Talk" to log your keynote presentations.
          </div>
        )}
      </div>

      {/* Add / Edit Talk Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl border border-[#eedfd8] bg-white p-6 sm:p-8 shadow-2xl space-y-5 my-8 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#eedfd8]/60 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#85261e]">
                  {modalMode === "edit" ? "Modify Lecture Record" : "New Keynote Entry"}
                </span>
                <h2 className="text-xl font-extrabold text-[#33110e]">
                  {modalMode === "edit" ? "Edit Keynote Lecture" : "Register Keynote / Expert Talk"}
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
                  Lecture / Talk Topic *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Scalable Machine Learning Architectures for Edge Computing"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-3 text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              {/* Venue & Academic Session */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Hosting Institution / Venue *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IIT Roorkee / IEEE Delhi Section / NIT Hamirpur"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
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

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Start Date / Date Delivered
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    End Date (if multi-day event)
                  </label>
                  <input
                    type="date"
                    disabled={isPresent}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs text-[#1c110c] disabled:opacity-50 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                  Brief Description / Target Audience
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Delivered as part of AICTE sponsored Faculty Development Programme for 120 faculty attendees."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-3 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              {/* Associated Faculty Picker for instant cross-sync */}
              <div className="pt-2 border-t border-[#eedfd8]/60">
                <AssociatedFacultyPicker
                  selected={selectedAssociatedFaculty}
                  onChange={setSelectedAssociatedFaculty}
                  currentFaculty={faculty}
                  label="Co-Speakers / Associated Faculty (NIT Hamirpur)"
                  placeholder="Link co-speaker colleagues..."
                  helperText="Selected colleagues will automatically see this talk logged on their profile."
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
                  {modalMode === "edit" ? "Save Changes" : "Record Talk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
