"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, ShieldCheck, X, Building2, Calendar, Sparkles, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";
import { MOCK_FACULTY } from "@/lib/mock-data";
import { getStoredData, saveFacultyRecord } from "@/lib/faculty-storage";

interface AdminRole {
  id?: string;
  position: string;
  organization: string;
  start_date: string;
  end_date: string;
  full_start?: string;
  full_end?: string;
}

export default function AdminExpPage() {
  const [user, setUser] = useState<any>(null);
  const [faculty, setFaculty] = useState<any>(MOCK_FACULTY[0]);
  const [items, setItems] = useState<AdminRole[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [position, setPosition] = useState("");
  const [organization, setOrganization] = useState("National Institute of Technology Hamirpur");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("Present");
  const [isCurrent, setIsCurrent] = useState(true);

  const loadAdminRoles = (activeFaculty: any) => {
    const adminRoles =
      (activeFaculty as any).admin_experiences ||
      (activeFaculty as any).administrative_experiences ||
      [];
    const fallback =
      adminRoles.length > 0
        ? adminRoles
        : [
            {
              id: "adm-1",
              position: "Head of the Department (CSE)",
              organization: "Department of Computer Science & Engineering, NIT Hamirpur",
              start_date: "2024",
              end_date: "Present",
              full_start: "2024-04-01",
              full_end: "Present",
            },
            {
              id: "adm-2",
              position: "Faculty In-Charge (Departmental Laboratory)",
              organization: "National Institute of Technology Hamirpur",
              start_date: "2020",
              end_date: "2024",
              full_start: "2020-08-01",
              full_end: "2024-03-31",
            },
          ];

    const stored = getStoredData<AdminRole>(activeFaculty, "admin_experiences", fallback);
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

    loadAdminRoles(activeFaculty);

    const handleStorageUpdate = (e: any) => {
      if (!e.detail?.section || e.detail.section === "admin_experiences") {
        loadAdminRoles(activeFaculty);
      }
    };
    window.addEventListener("nith_faculty_storage_update", handleStorageUpdate);
    return () => window.removeEventListener("nith_faculty_storage_update", handleStorageUpdate);
  }, []);

  const openAddModal = () => {
    setModalMode("add");
    setEditingId(null);
    setPosition("");
    setOrganization("National Institute of Technology Hamirpur");
    setStart(`${new Date().getFullYear()}`);
    setEnd("Present");
    setIsCurrent(true);
    setShowModal(true);
  };

  const openEditModal = (role: AdminRole) => {
    setModalMode("edit");
    setEditingId(role.id || role.position);
    setPosition(role.position || "");
    setOrganization(role.organization || "National Institute of Technology Hamirpur");
    setStart(role.start_date || "");
    setEnd(role.end_date || "Present");
    setIsCurrent((role.end_date || "").toLowerCase() === "present");
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!position.trim() || !organization.trim() || !start.trim()) {
      toast.error("Please provide Role / Position, Organization, and Start Year");
      return;
    }

    const newRole: AdminRole = {
      id: modalMode === "edit" && editingId ? editingId : `adm-${Date.now()}`,
      position: position.trim(),
      organization: organization.trim(),
      start_date: start.trim(),
      end_date: isCurrent ? "Present" : end.trim() || "Present",
      full_start: start.trim(),
      full_end: isCurrent ? "Present" : end.trim() || "Present",
    };

    saveFacultyRecord(faculty, "admin_experiences", newRole, false);
    loadAdminRoles(faculty);
    setShowModal(false);
    toast.success(
      modalMode === "edit"
        ? "Administrative role updated successfully!"
        : "Administrative experience recorded and persisted!"
    );
  };

  const handleDelete = (role: AdminRole) => {
    if (!window.confirm(`Are you sure you want to delete "${role.position}"?`)) return;
    saveFacultyRecord(faculty, "admin_experiences", role, true);
    loadAdminRoles(faculty);
    toast.success("Role record removed and storage updated");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      {/* Header Banner */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#85261e]" />
              Administrative Experience
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2.5 py-0.5 rounded-full">
              {items.length} Appointments
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Departmental responsibilities, institutional leadership positions, and committee roles held by{" "}
            <strong>{faculty.full_name}</strong>.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] text-white px-4 py-2.5 text-xs font-bold shadow-xs hover:shadow-md transition cursor-pointer"
        >
          <Plus className="h-4 w-4 text-amber-300" />
          <span>Add Admin Role</span>
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {items.map((role, idx) => {
          const current = (role.end_date || "").toLowerCase() === "present";
          return (
            <div
              key={role.id || idx}
              className="rounded-2xl border border-[#eedfd8] bg-white p-5 shadow-2xs hover:shadow-md transition space-y-2 group"
            >
              <div className="flex flex-wrap items-center gap-2">
                {current ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    Active Leadership
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-100 text-neutral-600 border border-neutral-200">
                    <CheckCircle2 className="w-3 h-3 text-neutral-400" />
                    Completed Tenure
                  </span>
                )}

                <span className="text-xs font-bold text-neutral-400 ml-auto font-mono">
                  {role.start_date} – {role.end_date}
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-[#1c110c] leading-snug">
                {role.position}
              </h3>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#85261e]">
                <Building2 className="w-3.5 h-3.5" />
                <span>{role.organization}</span>
              </div>

              {/* Actions Strip */}
              <div className="flex items-center justify-end gap-1 pt-3 border-t border-[#eedfd8]/60 text-xs">
                <button
                  type="button"
                  onClick={() => openEditModal(role)}
                  className="p-1.5 text-neutral-500 hover:text-[#85261e] transition rounded-lg hover:bg-[#fdf5f2] cursor-pointer"
                  title="Edit Role"
                >
                  <Edit className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(role)}
                  className="p-1.5 text-neutral-400 hover:text-red-700 transition rounded-lg hover:bg-red-50 cursor-pointer"
                  title="Remove Role"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}

        {items.length === 0 && (
          <div className="text-center py-16 text-neutral-500 text-xs bg-white rounded-2xl border border-[#eedfd8]">
            No administrative experience records found. Click "Add Admin Role" to log your institutional responsibilities.
          </div>
        )}
      </div>

      {/* Add / Edit Role Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans">
          <div className="w-full max-w-lg rounded-3xl border border-[#eedfd8] bg-white p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#eedfd8]/60 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#85261e]">
                  {modalMode === "edit" ? "Modify Appointment" : "New Appointment"}
                </span>
                <h2 className="text-xl font-extrabold text-[#33110e]">
                  {modalMode === "edit" ? "Edit Administrative Role" : "Add Administrative Role"}
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
                  Administrative Position / Role *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Head of Department, Warden, Nodal Officer, Faculty In-charge"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                  Department / Organization *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Department of Computer Science & Engineering, NIT Hamirpur"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Start Year / Date *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2022 or 2022-08-01"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    required
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    End Year / Date
                  </label>
                  <input
                    type="text"
                    disabled={isCurrent}
                    placeholder="e.g. 2024 or Present"
                    value={isCurrent ? "Present" : end}
                    onChange={(e) => setEnd(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] disabled:opacity-50 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="currentRole"
                  checked={isCurrent}
                  onChange={(e) => {
                    setIsCurrent(e.target.checked);
                    if (e.target.checked) setEnd("Present");
                  }}
                  className="rounded border-[#eedfd8] text-[#85261e] focus:ring-[#85261e]"
                />
                <label htmlFor="currentRole" className="text-xs font-semibold text-neutral-700 cursor-pointer">
                  Currently holding this administrative appointment
                </label>
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
                  {modalMode === "edit" ? "Save Changes" : "Save Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
