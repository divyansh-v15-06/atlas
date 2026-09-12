"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Award, X, Building2, Calendar, Sparkles, Trophy, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { MOCK_FACULTY } from "@/lib/mock-data";
import { getStoredData, saveFacultyRecord } from "@/lib/faculty-storage";
import { ACADEMIC_SESSIONS } from "@/lib/faculty-constants";

export interface Honor {
  id?: string;
  title: string;
  organization: string;
  year: number | string;
  academic_session?: string;
  description?: string;
}

export default function HonorsPage() {
  const [user, setUser] = useState<any>(null);
  const [faculty, setFaculty] = useState<any>(MOCK_FACULTY[0]);
  const [honors, setHonors] = useState<Honor[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [year, setYear] = useState<number | string>(new Date().getFullYear());
  const [academicSession, setAcademicSession] = useState(ACADEMIC_SESSIONS[1] || "2024-2025");
  const [description, setDescription] = useState("");

  const loadHonors = (activeFaculty: any) => {
    const facultyHonors = (activeFaculty as any).honors || [];
    const fallback =
      facultyHonors.length > 0
        ? facultyHonors
        : [
            {
              id: "hnr-1",
              title: "Best Research Paper Award",
              organization: "IEEE International Conference on Advanced Networks",
              year: 2022,
              academic_session: "2022-2023",
              description: "Awarded for exceptional contribution in wireless sensor network security.",
            },
            {
              id: "hnr-2",
              title: "Excellence in Teaching & Research Citation",
              organization: "National Institute of Technology Hamirpur",
              year: 2020,
              academic_session: "2020-2021",
              description: "Institutional citation presented on Teacher's Day.",
            },
          ];

    const stored = getStoredData<Honor>(activeFaculty, "honors", fallback);
    setHonors(stored);
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

    loadHonors(activeFaculty);

    const handleStorageUpdate = (e: any) => {
      if (!e.detail?.section || e.detail.section === "honors") {
        loadHonors(activeFaculty);
      }
    };
    window.addEventListener("nith_faculty_storage_update", handleStorageUpdate);
    return () => window.removeEventListener("nith_faculty_storage_update", handleStorageUpdate);
  }, []);

  const openAddModal = () => {
    setModalMode("add");
    setEditingId(null);
    setTitle("");
    setOrganization("");
    setYear(new Date().getFullYear());
    setAcademicSession(ACADEMIC_SESSIONS[1] || "2024-2025");
    setDescription("");
    setShowModal(true);
  };

  const openEditModal = (hnr: Honor) => {
    setModalMode("edit");
    setEditingId(hnr.id || hnr.title);
    setTitle(hnr.title || "");
    setOrganization(hnr.organization || "");
    setYear(hnr.year || new Date().getFullYear());
    setAcademicSession(hnr.academic_session || ACADEMIC_SESSIONS[1]);
    setDescription(hnr.description || "");
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !organization.trim()) {
      toast.error("Please provide Award Title and Awarding Body");
      return;
    }

    const newHonor: Honor = {
      id: modalMode === "edit" && editingId ? editingId : `hnr-${Date.now()}`,
      title: title.trim(),
      organization: organization.trim(),
      year: year || new Date().getFullYear(),
      academic_session: academicSession,
      description: description.trim() || undefined,
    };

    saveFacultyRecord(faculty, "honors", newHonor, false);
    loadHonors(faculty);
    setShowModal(false);
    toast.success(
      modalMode === "edit"
        ? "Honor / recognition updated successfully!"
        : "Honor / recognition award recorded and saved!"
    );
  };

  const handleDelete = (hnr: Honor) => {
    if (!window.confirm(`Are you sure you want to delete "${hnr.title}"?`)) return;
    saveFacultyRecord(faculty, "honors", hnr, true);
    loadHonors(faculty);
    toast.success("Honor record removed and storage updated");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      {/* Header Banner */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <Trophy className="w-6 h-6 text-[#85261e]" />
              Honors &amp; Recognitions
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2.5 py-0.5 rounded-full">
              {honors.length} Awards
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Academic fellowships, prestigious recognitions, and awards conferred to{" "}
            <strong>{faculty.full_name}</strong>.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] text-white px-4 py-2.5 text-xs font-bold shadow-xs hover:shadow-md transition cursor-pointer"
        >
          <Plus className="h-4 w-4 text-amber-300" />
          <span>Add Recognition</span>
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {honors.map((hnr, idx) => (
          <div
            key={hnr.id || idx}
            className="rounded-2xl border border-[#eedfd8] bg-white p-5 shadow-2xs hover:shadow-md transition space-y-2 group"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                <Trophy className="w-3 h-3 text-amber-700" />
                Honor / Award
              </span>

              {hnr.academic_session && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-neutral-100 text-neutral-600">
                  Session: {hnr.academic_session}
                </span>
              )}

              <span className="text-xs font-bold text-neutral-400 ml-auto font-mono">
                {hnr.year}
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-[#1c110c] leading-snug">
              {hnr.title}
            </h3>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#85261e]">
              <Building2 className="w-3.5 h-3.5" />
              <span>{hnr.organization}</span>
            </div>

            {hnr.description && (
              <p className="text-xs text-neutral-600 leading-relaxed pt-1">
                {hnr.description}
              </p>
            )}

            {/* Actions Strip */}
            <div className="flex items-center justify-end gap-1 pt-3 border-t border-[#eedfd8]/60 text-xs">
              <button
                type="button"
                onClick={() => openEditModal(hnr)}
                className="p-1.5 text-neutral-500 hover:text-[#85261e] transition rounded-lg hover:bg-[#fdf5f2] cursor-pointer"
                title="Edit Honor"
              >
                <Edit className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => handleDelete(hnr)}
                className="p-1.5 text-neutral-400 hover:text-red-700 transition rounded-lg hover:bg-red-50 cursor-pointer"
                title="Remove Honor"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {honors.length === 0 && (
          <div className="text-center py-16 text-neutral-500 text-xs bg-white rounded-2xl border border-[#eedfd8]">
            No honors recorded. Click "Add Recognition" to log your academic awards.
          </div>
        )}
      </div>

      {/* Add / Edit Honor Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans">
          <div className="w-full max-w-lg rounded-3xl border border-[#eedfd8] bg-white p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#eedfd8]/60 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#85261e]">
                  {modalMode === "edit" ? "Modify Recognition" : "New Recognition"}
                </span>
                <h2 className="text-xl font-extrabold text-[#33110e]">
                  {modalMode === "edit" ? "Edit Academic Recognition" : "Add Academic Recognition"}
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

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                  Honor / Award Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Best Paper Award / IEEE Senior Member / National Award"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                  Awarding Body / Organization *
                </label>
                <input
                  type="text"
                  placeholder="e.g. IEEE / Springer / Government of India / NIT Hamirpur"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Year *
                  </label>
                  <input
                    type="number"
                    min={1970}
                    max={2035}
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Academic Session
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

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                  Description / Citation Details
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Awarded for exceptional research excellence in cloud computing at IEEE ICAN conference."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-3 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#eedfd8]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-[#eedfd8] bg-white px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#85261e] hover:bg-[#33110e] px-5 py-2 text-xs font-bold text-white shadow-xs hover:shadow-md transition cursor-pointer"
                >
                  {modalMode === "edit" ? "Save Changes" : "Save Honor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
