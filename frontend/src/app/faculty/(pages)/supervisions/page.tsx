"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Trash2,
  Edit,
  GraduationCap,
  X,
  Search,
  CheckCircle2,
  BookOpen,
  Calendar,
  Sparkles,
  Users,
  Award,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { MOCK_FACULTY } from "@/lib/mock-data";
import { getStoredData, saveFacultyRecord } from "@/lib/faculty-storage";
import AssociatedFacultyPicker from "@/components/faculty/AssociatedFacultyPicker";
import {
  ACADEMIC_SESSIONS,
  SUPERVISION_LEVELS,
  SUPERVISION_STATUSES,
} from "@/lib/faculty-constants";

export interface Supervision {
  id?: number | string;
  level: string;
  student_name: string;
  roll_number?: string | number;
  thesis_title: string;
  status: string;
  year?: number | string;
  academic_session?: string;
  co_supervisor?: string | null;
  associated_faculty?: any[];
  faculty_ids?: string[];
}

export default function FacultySupervisionsPage() {
  const [user, setUser] = useState<any>(null);
  const [faculty, setFaculty] = useState<any>(MOCK_FACULTY[0]);
  const [items, setItems] = useState<Supervision[]>([]);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states matching tempcsebase
  const [level, setLevel] = useState("Ph.D.");
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [topic, setTopic] = useState("");
  const [status, setStatus] = useState("Ongoing");
  const [academicSession, setAcademicSession] = useState(ACADEMIC_SESSIONS[1] || "2024-2025");
  const [year, setYear] = useState(new Date().getFullYear());
  const [coSupervisor, setCoSupervisor] = useState("");
  const [selectedAssociatedFaculty, setSelectedAssociatedFaculty] = useState<any[]>([]);

  const loadSupervisions = (activeFaculty: any) => {
    const facultySupervisions = (activeFaculty as any).supervisions || [];
    const fallback =
      facultySupervisions.length > 0
        ? facultySupervisions
        : [
            {
              id: "sup-default-1",
              level: "Ph.D.",
              student_name: "Praveen Prakash",
              roll_number: "23RCS004",
              thesis_title: "Lightweight Security Model of Internet of Things Systems",
              status: "Ongoing",
              year: 2023,
              academic_session: "2023-2024",
              co_supervisor: null,
            },
          ];

    const stored = getStoredData<Supervision>(activeFaculty, "supervisions", fallback);
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

    loadSupervisions(activeFaculty);

    const handleStorageUpdate = (e: any) => {
      if (!e.detail?.section || e.detail.section === "supervisions") {
        loadSupervisions(activeFaculty);
      }
    };
    window.addEventListener("nith_faculty_storage_update", handleStorageUpdate);
    return () => window.removeEventListener("nith_faculty_storage_update", handleStorageUpdate);
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((it) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        it.student_name?.toLowerCase().includes(q) ||
        (it.roll_number && String(it.roll_number).toLowerCase().includes(q)) ||
        it.thesis_title?.toLowerCase().includes(q) ||
        (it.co_supervisor && it.co_supervisor.toLowerCase().includes(q));

      const matchesLevel =
        levelFilter === "ALL" ||
        (levelFilter === "PHD" && it.level?.toLowerCase().includes("ph")) ||
        (levelFilter === "PG" && (it.level?.toLowerCase().includes("m.tech") || it.level?.toLowerCase().includes("pg"))) ||
        (levelFilter === "UG" && (it.level?.toLowerCase().includes("b.tech") || it.level?.toLowerCase().includes("ug")));

      const matchesStatus =
        statusFilter === "ALL" || it.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesLevel && matchesStatus;
    });
  }, [items, search, levelFilter, statusFilter]);

  const phdCount = useMemo(
    () => items.filter((it) => it.level?.toLowerCase().includes("ph")).length,
    [items]
  );
  const pgCount = useMemo(
    () => items.filter((it) => it.level?.toLowerCase().includes("m.tech") || it.level?.toLowerCase().includes("pg")).length,
    [items]
  );
  const ugCount = useMemo(
    () => items.filter((it) => it.level?.toLowerCase().includes("b.tech") || it.level?.toLowerCase().includes("ug")).length,
    [items]
  );

  const openAddModal = () => {
    setModalMode("add");
    setEditingId(null);
    setLevel("Ph.D.");
    setName("");
    setRollNo("");
    setTopic("");
    setStatus("Ongoing");
    setAcademicSession(ACADEMIC_SESSIONS[1] || "2024-2025");
    setYear(new Date().getFullYear());
    setCoSupervisor("");
    setSelectedAssociatedFaculty([]);
    setShowModal(true);
  };

  const openEditModal = (sup: Supervision) => {
    setModalMode("edit");
    setEditingId(String(sup.id || sup.student_name));
    setLevel(sup.level || "Ph.D.");
    setName(sup.student_name || "");
    setRollNo(String(sup.roll_number || ""));
    setTopic(sup.thesis_title || "");
    setStatus(sup.status || "Ongoing");
    setAcademicSession(sup.academic_session || ACADEMIC_SESSIONS[1]);
    setYear(Number(sup.year) || new Date().getFullYear());
    setCoSupervisor(sup.co_supervisor || "");

    const linked = Array.isArray(sup.associated_faculty)
      ? sup.associated_faculty
      : Array.isArray(sup.faculty_ids)
      ? MOCK_FACULTY.filter((f) => sup.faculty_ids?.includes(f.id))
      : [];
    setSelectedAssociatedFaculty(linked);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !topic.trim()) {
      toast.error("Please provide Scholar / Student Name and Dissertation Topic");
      return;
    }

    const coSupText = selectedAssociatedFaculty.length > 0
      ? selectedAssociatedFaculty.map((f) => f.full_name).join(", ")
      : coSupervisor.trim() || null;

    const newEntry: Supervision = {
      id: modalMode === "edit" && editingId ? editingId : `sup-${Date.now()}`,
      level: level,
      student_name: name.trim(),
      roll_number: rollNo.trim() || undefined,
      thesis_title: topic.trim(),
      status: status,
      year: Number(year) || new Date().getFullYear(),
      academic_session: academicSession,
      co_supervisor: coSupText,
      associated_faculty: selectedAssociatedFaculty,
      faculty_ids: [
        faculty.id,
        ...selectedAssociatedFaculty.map((f) => f.id || f.employee_code),
      ],
    };

    saveFacultyRecord(faculty, "supervisions", newEntry, false);
    loadSupervisions(faculty);
    setShowModal(false);
    toast.success(
      modalMode === "edit"
        ? "Research supervision record updated and synchronized successfully!"
        : "Research supervision record created and synchronized with co-supervisors!"
    );
  };

  const handleDelete = (sup: Supervision) => {
    if (!window.confirm(`Are you sure you want to delete "${sup.student_name}"?`)) return;
    saveFacultyRecord(faculty, "supervisions", sup, true);
    loadSupervisions(faculty);
    toast.success("Supervision record removed and storage updated");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      {/* Header Banner */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-[#85261e]" />
              Research Scholar Supervision
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2.5 py-0.5 rounded-full">
              {items.length} Guided
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Doctoral, Post-Graduate, and Undergraduate student research supervised by{" "}
            <strong>{faculty.full_name}</strong>.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] text-white px-4 py-2.5 text-xs font-bold shadow-xs hover:shadow-md transition cursor-pointer"
        >
          <Plus className="h-4 w-4 text-amber-300" />
          <span>Add Scholar</span>
        </button>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-[#eedfd8] p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Ph.D. Doctoral Scholars
          </span>
          <p className="text-xl sm:text-2xl font-black text-[#85261e] mt-0.5">
            {phdCount} Candidates
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#eedfd8] p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            M.Tech Dissertations
          </span>
          <p className="text-xl sm:text-2xl font-black text-blue-700 mt-0.5">
            {pgCount} Theses
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#eedfd8] p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            B.Tech Major Projects
          </span>
          <p className="text-xl sm:text-2xl font-black text-emerald-700 mt-0.5">
            {ugCount} Guided
          </p>
        </div>
      </div>

      {/* Filter Strip */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search scholars by name, roll number, topic or co-supervisor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#eedfd8] bg-white text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e] shadow-2xs"
          />
        </div>

        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-[#eedfd8] bg-white text-xs font-semibold text-[#33110e] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e] shadow-2xs cursor-pointer"
        >
          <option value="ALL">All Levels</option>
          <option value="PHD">Ph.D.</option>
          <option value="PG">M.Tech</option>
          <option value="UG">B.Tech</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-[#eedfd8] bg-white text-xs font-semibold text-[#33110e] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e] shadow-2xs cursor-pointer"
        >
          <option value="ALL">All Statuses</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Awarded">Awarded / Completed</option>
          <option value="Submitted">Submitted</option>
        </select>
      </div>

      {/* Scholars List */}
      <div className="space-y-3">
        {filteredItems.map((sup) => (
          <div
            key={sup.id}
            className="rounded-2xl border border-[#eedfd8] bg-white p-5 shadow-2xs hover:shadow-md transition space-y-3 group"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#33110e] text-white">
                {sup.level || "Ph.D."}
              </span>

              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  sup.status?.toLowerCase() === "awarded" || sup.status?.toLowerCase() === "completed"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-blue-100 text-blue-800 border border-blue-300"
                }`}
              >
                {sup.status || "Ongoing"}
              </span>

              {sup.academic_session && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-neutral-100 text-neutral-600">
                  Session: {sup.academic_session}
                </span>
              )}

              <span className="text-xs font-bold text-neutral-400 ml-auto font-mono">
                {sup.year}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <h3 className="text-sm sm:text-base font-bold text-[#1c110c]">
                {sup.student_name}
              </h3>
              {sup.roll_number && (
                <span className="font-mono text-xs font-semibold text-[#85261e]">
                  Roll: {sup.roll_number}
                </span>
              )}
            </div>

            <p className="text-xs text-neutral-700 italic bg-[#fff9f6] p-3 rounded-xl border border-[#eedfd8]/60">
              "{sup.thesis_title}"
            </p>

            {sup.co_supervisor && (
              <p className="text-xs text-neutral-500 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-neutral-400" />
                <span>Co-Supervisor(s): <strong>{sup.co_supervisor}</strong></span>
              </p>
            )}

            {/* Actions Strip */}
            <div className="flex items-center justify-end gap-1 pt-3 border-t border-[#eedfd8]/60 text-xs">
              <button
                type="button"
                onClick={() => openEditModal(sup)}
                className="p-1.5 text-neutral-500 hover:text-[#85261e] transition rounded-lg hover:bg-[#fdf5f2] cursor-pointer"
                title="Edit Scholar"
              >
                <Edit className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => handleDelete(sup)}
                className="p-1.5 text-neutral-400 hover:text-red-700 transition rounded-lg hover:bg-red-50 cursor-pointer"
                title="Remove Scholar"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="text-center py-16 text-neutral-500 text-xs bg-white rounded-2xl border border-[#eedfd8]">
            No supervision records found matching your query.
          </div>
        )}
      </div>

      {/* Add / Edit Supervision Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl border border-[#eedfd8] bg-white p-6 sm:p-8 shadow-2xl space-y-5 my-8 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#eedfd8]/60 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#85261e]">
                  {modalMode === "edit" ? "Modify Supervision" : "New Scholar Record"}
                </span>
                <h2 className="text-xl font-extrabold text-[#33110e]">
                  {modalMode === "edit" ? "Edit Supervision Details" : "Record Scholar Supervision"}
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
              {/* Level, Status, Academic Session */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Programme Level *
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs font-semibold text-[#33110e] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  >
                    {SUPERVISION_LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Supervision Status *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs font-semibold text-[#33110e] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  >
                    {SUPERVISION_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
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

              {/* Student Name & Roll No */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Scholar / Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Praveen Prakash"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Roll Number / Registration ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 23RCS004"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>
              </div>

              {/* Thesis Title */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                  Dissertation / Thesis Title *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Lightweight Cryptographic Primitives and Intrusion Detection in Edge Computing"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-3 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              {/* Year & External Co-Supervisor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Year (Enrollment / Awarded) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1990}
                    max={2035}
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    External Co-Supervisor (if outside NITH)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Prof. R. K. Sharma (IIT Roorkee)"
                    value={coSupervisor}
                    onChange={(e) => setCoSupervisor(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>
              </div>

              {/* Associated Faculty Picker for internal co-supervisors */}
              <div className="pt-2 border-t border-[#eedfd8]/60">
                <AssociatedFacultyPicker
                  selected={selectedAssociatedFaculty}
                  onChange={setSelectedAssociatedFaculty}
                  currentFaculty={faculty}
                  label="Internal Co-Supervisors (NIT Hamirpur Faculty)"
                  placeholder="Link internal co-supervisor colleagues..."
                  helperText="Selected colleagues will automatically see this scholar in their supervision list."
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
                  {modalMode === "edit" ? "Save Changes" : "Record Supervision"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
