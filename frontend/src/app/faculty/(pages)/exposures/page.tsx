"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Globe, X, MapPin, Plane, Building2, Sparkles, Calendar, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { MOCK_FACULTY } from "@/lib/mock-data";
import { getStoredData, saveFacultyRecord } from "@/lib/faculty-storage";
import { ACADEMIC_SESSIONS } from "@/lib/faculty-constants";

export interface Exposure {
  id?: string;
  title: string;
  country?: string;
  organization?: string;
  year?: number | string;
  academic_session?: string;
  details?: string;
  description?: string;
}

export default function ExposuresPage() {
  const [user, setUser] = useState<any>(null);
  const [faculty, setFaculty] = useState<any>(MOCK_FACULTY[0]);
  const [items, setItems] = useState<Exposure[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [country, setCountry] = useState("");
  const [year, setYear] = useState<number | string>(new Date().getFullYear());
  const [academicSession, setAcademicSession] = useState(ACADEMIC_SESSIONS[1] || "2024-2025");
  const [description, setDescription] = useState("");

  const loadExposures = (activeFaculty: any) => {
    const facultyExposures = (activeFaculty as any).exposures || [];
    const fallback =
      facultyExposures.length > 0
        ? facultyExposures
        : [
            {
              id: "exp-1",
              title: "International Conference on Information Technology & Distributed Systems",
              country: "United States",
              organization: "IEEE Computer Society",
              year: 2023,
              academic_session: "2023-2024",
              description: "Paper presentation and international collaborative research visit.",
              details: "Paper presentation and international collaborative research visit.",
            },
          ];

    const stored = getStoredData<Exposure>(activeFaculty, "exposures", fallback);
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

    loadExposures(activeFaculty);

    const handleStorageUpdate = (e: any) => {
      if (!e.detail?.section || e.detail.section === "exposures") {
        loadExposures(activeFaculty);
      }
    };
    window.addEventListener("nith_faculty_storage_update", handleStorageUpdate);
    return () => window.removeEventListener("nith_faculty_storage_update", handleStorageUpdate);
  }, []);

  const openAddModal = () => {
    setModalMode("add");
    setEditingId(null);
    setTitle("");
    setCountry("");
    setYear(new Date().getFullYear());
    setAcademicSession(ACADEMIC_SESSIONS[1] || "2024-2025");
    setDescription("");
    setShowModal(true);
  };

  const openEditModal = (exp: Exposure) => {
    setModalMode("edit");
    setEditingId(exp.id || exp.title);
    setTitle(exp.title || "");
    setCountry(exp.country || exp.organization || "");
    setYear(exp.year || new Date().getFullYear());
    setAcademicSession(exp.academic_session || ACADEMIC_SESSIONS[1]);
    setDescription(exp.description || exp.details || "");
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please provide Visit Title / Purpose");
      return;
    }

    const newExposure: Exposure = {
      id: modalMode === "edit" && editingId ? editingId : `exp-${Date.now()}`,
      title: title.trim(),
      country: country.trim() || undefined,
      organization: country.trim() || undefined,
      year: year || new Date().getFullYear(),
      academic_session: academicSession,
      description: description.trim() || undefined,
      details: description.trim() || undefined,
    };

    saveFacultyRecord(faculty, "exposures", newExposure, false);
    loadExposures(faculty);
    setShowModal(false);
    toast.success(
      modalMode === "edit"
        ? "Academic exposure visit updated successfully!"
        : "Academic exposure record saved and persisted!"
    );
  };

  const handleDelete = (exp: Exposure) => {
    if (!window.confirm(`Are you sure you want to delete "${exp.title}"?`)) return;
    saveFacultyRecord(faculty, "exposures", exp, true);
    loadExposures(faculty);
    toast.success("Exposure record removed and storage updated");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      {/* Header Banner */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <Globe className="w-6 h-6 text-[#85261e]" />
              International &amp; National Exposure
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2.5 py-0.5 rounded-full">
              {items.length} Visits Logged
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Academic delegations, international conference visits, and collaborative research exposure for{" "}
            <strong>{faculty.full_name}</strong>.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] text-white px-4 py-2.5 text-xs font-bold shadow-xs hover:shadow-md transition cursor-pointer"
        >
          <Plus className="h-4 w-4 text-amber-300" />
          <span>Add Visit</span>
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {items.map((exp, idx) => (
          <div
            key={exp.id || idx}
            className="rounded-2xl border border-[#eedfd8] bg-white p-5 shadow-2xs hover:shadow-md transition space-y-2 group"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                <Plane className="w-3 h-3 text-indigo-600" />
                Academic Travel
              </span>

              {exp.country && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] px-2.5 py-0.5 rounded-full">
                  <MapPin className="w-3 h-3 text-[#85261e]" />
                  {exp.country}
                </span>
              )}

              {exp.academic_session && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-neutral-100 text-neutral-600">
                  Session: {exp.academic_session}
                </span>
              )}

              <span className="text-xs font-bold text-neutral-400 ml-auto font-mono">
                {exp.year}
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-[#1c110c] leading-snug">
              {exp.title}
            </h3>

            {(exp.description || exp.details) && (
              <p className="text-xs text-neutral-600 leading-relaxed pt-1">
                {exp.description || exp.details}
              </p>
            )}

            {/* Actions Strip */}
            <div className="flex items-center justify-end gap-1 pt-3 border-t border-[#eedfd8]/60 text-xs">
              <button
                type="button"
                onClick={() => openEditModal(exp)}
                className="p-1.5 text-neutral-500 hover:text-[#85261e] transition rounded-lg hover:bg-[#fdf5f2] cursor-pointer"
                title="Edit Exposure"
              >
                <Edit className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => handleDelete(exp)}
                className="p-1.5 text-neutral-400 hover:text-red-700 transition rounded-lg hover:bg-red-50 cursor-pointer"
                title="Remove Exposure"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-16 text-neutral-500 text-xs bg-white rounded-2xl border border-[#eedfd8]">
            No academic visits or exposure records found. Click "Add Visit" to log your travel.
          </div>
        )}
      </div>

      {/* Add / Edit Exposure Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans">
          <div className="w-full max-w-lg rounded-3xl border border-[#eedfd8] bg-white p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#eedfd8]/60 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#85261e]">
                  {modalMode === "edit" ? "Modify Travel Record" : "New Travel Record"}
                </span>
                <h2 className="text-xl font-extrabold text-[#33110e]">
                  {modalMode === "edit" ? "Edit Academic Travel" : "Add Academic Travel / Exposure"}
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
                  Visit Purpose / Conference / Collaboration *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Keynote Address at IEEE CloudCom / Research Visit to NUS Singapore"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                  Country / Host Organization
                </label>
                <input
                  type="text"
                  placeholder="e.g. United States / Singapore / Germany / IIT Bombay"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Year of Travel *
                  </label>
                  <input
                    type="number"
                    min={1970}
                    max={2035}
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
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
                  Visit Details / Outcomes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Delivered keynote lecture and conducted bilateral discussions on distributed sensor network security."
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
                  {modalMode === "edit" ? "Save Changes" : "Save Travel Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
