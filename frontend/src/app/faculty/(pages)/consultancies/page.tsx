"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Trash2,
  Edit,
  FlaskConical,
  X,
  Search,
  CheckCircle2,
  Building2,
  Calendar,
  Briefcase,
  IndianRupee,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { formatINR } from "@/lib/utils";
import { MOCK_FACULTY, MOCK_CONSULTANCIES } from "@/lib/mock-data";
import { getStoredData, saveFacultyRecord } from "@/lib/faculty-storage";
import AssociatedFacultyPicker from "@/components/faculty/AssociatedFacultyPicker";
import { ACADEMIC_SESSIONS, MONTHS } from "@/lib/faculty-constants";

export default function FacultyConsultanciesPage() {
  const [user, setUser] = useState<any>(null);
  const [faculty, setFaculty] = useState<any>(MOCK_FACULTY[0]);
  const [consultancies, setConsultancies] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states matching tempcsebase
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [amount, setAmount] = useState<number | string>(1500000);
  const [status, setStatus] = useState("Completed");
  const [academicSession, setAcademicSession] = useState(ACADEMIC_SESSIONS[1] || "2024-2025");
  const [month, setMonth] = useState(MONTHS[0]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [consultants, setConsultants] = useState("");
  const [selectedAssociatedFaculty, setSelectedAssociatedFaculty] = useState<any[]>([]);

  const loadConsultancies = (activeFaculty: any) => {
    const lastName = activeFaculty.full_name?.toLowerCase().split(" ").pop() || "";
    const userConsultancies = MOCK_CONSULTANCIES.filter((c: any) => {
      if (c.faculty_ids && c.faculty_ids.includes(activeFaculty.id)) return true;
      if (c.author_text && c.author_text.toLowerCase().includes(lastName)) return true;
      return false;
    });

    const fallback = userConsultancies.length > 0 ? userConsultancies : MOCK_CONSULTANCIES;
    const stored = getStoredData(activeFaculty, "consultancies", fallback);
    setConsultancies(stored);
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

    loadConsultancies(activeFaculty);

    const handleStorageUpdate = (e: any) => {
      if (!e.detail?.section || e.detail.section === "consultancies") {
        loadConsultancies(activeFaculty);
      }
    };
    window.addEventListener("nith_faculty_storage_update", handleStorageUpdate);
    return () => window.removeEventListener("nith_faculty_storage_update", handleStorageUpdate);
  }, []);

  const filteredConsultancies = useMemo(() => {
    return consultancies.filter((c) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        c.title?.toLowerCase().includes(q) ||
        (c.client_organisation && c.client_organisation.toLowerCase().includes(q)) ||
        (c.author_text && c.author_text.toLowerCase().includes(q));

      const matchesStatus =
        statusFilter === "ALL" || c.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [consultancies, search, statusFilter]);

  const totalRevenue = useMemo(() => {
    return filteredConsultancies.reduce(
      (sum, c) => sum + (Number(c.amount) || 0),
      0
    );
  }, [filteredConsultancies]);

  const openAddModal = () => {
    setModalMode("add");
    setEditingId(null);
    setTitle("");
    setClient("");
    setAmount(1500000);
    setStatus("Completed");
    setAcademicSession(ACADEMIC_SESSIONS[1] || "2024-2025");
    setMonth(MONTHS[0]);
    setYear(new Date().getFullYear());
    setConsultants(faculty.full_name || "");
    setSelectedAssociatedFaculty([]);
    setShowModal(true);
  };

  const openEditModal = (c: any) => {
    setModalMode("edit");
    setEditingId(c.id);
    setTitle(c.title || "");
    setClient(c.client_organisation || c.client || "");
    setAmount(c.amount || 1500000);
    setStatus(c.status || "Completed");
    setAcademicSession(c.academic_session || ACADEMIC_SESSIONS[1]);
    setMonth(c.month || MONTHS[0]);
    setYear(Number(c.year) || new Date().getFullYear());
    setConsultants(c.author_text || c.consultants || "");

    const linked = Array.isArray(c.associated_faculty)
      ? c.associated_faculty
      : Array.isArray(c.faculty_ids)
      ? MOCK_FACULTY.filter((f) => c.faculty_ids.includes(f.id))
      : [];
    setSelectedAssociatedFaculty(linked);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !client.trim()) {
      toast.error("Please provide Consultancy Title and Client Organization");
      return;
    }

    const cRecord: any = {
      id: modalMode === "edit" && editingId ? editingId : `con-${Date.now()}`,
      title: title.trim(),
      client_organisation: client.trim(),
      client: client.trim(),
      amount: Number(amount) || 0,
      status: status,
      academic_session: academicSession,
      month: month,
      year: Number(year) || new Date().getFullYear(),
      author_text: consultants.trim() || faculty.full_name,
      consultants: consultants.trim() || faculty.full_name,
      associated_faculty: selectedAssociatedFaculty,
      faculty_ids: [
        faculty.id,
        ...selectedAssociatedFaculty.map((f) => f.id || f.employee_code),
      ],
      updated_at: new Date().toISOString(),
    };

    saveFacultyRecord(faculty, "consultancies", cRecord, false);
    loadConsultancies(faculty);
    setShowModal(false);
    toast.success(
      modalMode === "edit"
        ? "Consultancy record updated and synchronized successfully!"
        : "Industrial consultancy engagement recorded and synchronized with consultants!"
    );
  };

  const handleDelete = (c: any) => {
    if (!window.confirm(`Are you sure you want to delete "${c.title}"?`)) return;
    saveFacultyRecord(faculty, "consultancies", c, true);
    loadConsultancies(faculty);
    toast.success("Consultancy record removed and storage updated");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      {/* Header Banner */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <FlaskConical className="w-6 h-6 text-[#85261e]" />
              Industrial Consultancies &amp; Services
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2.5 py-0.5 rounded-full">
              {consultancies.length} Engagements
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Industry technical consultancies, corporate advisory, and contract research performed by{" "}
            <strong>{faculty.full_name}</strong>.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] text-white px-4 py-2.5 text-xs font-bold shadow-xs hover:shadow-md transition cursor-pointer"
        >
          <Plus className="h-4 w-4 text-amber-300" />
          <span>Add Consultancy</span>
        </button>
      </div>

      {/* Overview Stat Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-[#eedfd8] p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Total Consultancy Revenue
          </span>
          <p className="text-xl sm:text-2xl font-black text-[#85261e] mt-0.5">
            {formatINR(totalRevenue)}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#eedfd8] p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Completed Projects
          </span>
          <p className="text-xl sm:text-2xl font-black text-emerald-700 mt-0.5">
            {consultancies.filter((c) => c.status?.toLowerCase() === "completed").length} Delivered
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#eedfd8] p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Active Engagements
          </span>
          <p className="text-xl sm:text-2xl font-black text-blue-700 mt-0.5">
            {consultancies.filter((c) => c.status?.toLowerCase() === "ongoing").length} Ongoing
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search consultancies by title, client company, or consultant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#eedfd8] bg-white text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e] shadow-2xs"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-[#eedfd8] bg-white text-xs font-semibold text-[#33110e] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e] shadow-2xs cursor-pointer"
        >
          <option value="ALL">All Statuses</option>
          <option value="Completed">Completed</option>
          <option value="Ongoing">Ongoing</option>
        </select>
      </div>

      {/* Consultancies List */}
      <div className="space-y-3">
        {filteredConsultancies.map((c: any) => (
          <div
            key={c.id}
            className="rounded-2xl border border-[#eedfd8] bg-white p-5 shadow-2xs hover:shadow-md transition space-y-3 group"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  c.status?.toLowerCase() === "completed"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-blue-100 text-blue-800 border border-blue-300"
                }`}
              >
                {c.status || "Completed"}
              </span>

              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] px-2.5 py-0.5 rounded-full">
                <Building2 className="w-3 h-3 text-[#85261e]" />
                {c.client_organisation || c.client}
              </span>

              {c.academic_session && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-neutral-100 text-neutral-600">
                  Session: {c.academic_session}
                </span>
              )}

              <span className="text-xs font-bold text-neutral-400 ml-auto font-mono">
                {c.month ? `${c.month} ` : ""}{c.year}
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-[#1c110c] leading-snug">
              {c.title}
            </h3>

            <p className="text-xs text-neutral-600">
              <span className="font-semibold text-neutral-800">Consultant(s):</span>{" "}
              {c.author_text || c.consultants || faculty.full_name}
            </p>

            <div className="p-3 rounded-xl bg-[#fff9f6] border border-[#eedfd8]/60 flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-500 uppercase">Consultancy Fee</span>
              <span className="text-base font-extrabold text-[#85261e]">
                {formatINR(Number(c.amount) || 0)}
              </span>
            </div>

            {/* Actions Strip */}
            <div className="flex items-center justify-end gap-1 pt-3 border-t border-[#eedfd8]/60 text-xs">
              <button
                type="button"
                onClick={() => openEditModal(c)}
                className="p-1.5 text-neutral-500 hover:text-[#85261e] transition rounded-lg hover:bg-[#fdf5f2] cursor-pointer"
                title="Edit Consultancy"
              >
                <Edit className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => handleDelete(c)}
                className="p-1.5 text-neutral-400 hover:text-red-700 transition rounded-lg hover:bg-red-50 cursor-pointer"
                title="Remove Consultancy"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredConsultancies.length === 0 && (
          <div className="text-center py-16 text-neutral-500 text-xs bg-white rounded-2xl border border-[#eedfd8]">
            No industrial consultancies found matching your query.
          </div>
        )}
      </div>

      {/* Add / Edit Consultancy Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl border border-[#eedfd8] bg-white p-6 sm:p-8 shadow-2xl space-y-5 my-8 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#eedfd8]/60 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#85261e]">
                  {modalMode === "edit" ? "Modify Consultancy Record" : "New Consultancy Engagement"}
                </span>
                <h2 className="text-xl font-extrabold text-[#33110e]">
                  {modalMode === "edit" ? "Edit Industrial Consultancy" : "Register Industrial Consultancy"}
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
                  Consultancy Project Title *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Design Verification and Automated Testing Framework for Industrial IoT Gateways"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-3 text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              {/* Client & Amount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Client Organization / Industry Partner *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Power Grid Corporation of India / NHPC / Tata Consultancy Services"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Consultancy Fee / Sanctioned Amount (INR) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>
              </div>

              {/* Status, Session, Month, Year */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Status *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs font-semibold text-[#33110e] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Ongoing">Ongoing</option>
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

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Month
                  </label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs font-semibold text-[#33110e] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  >
                    {MONTHS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Year *
                  </label>
                  <input
                    type="number"
                    required
                    min={1980}
                    max={2035}
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>
              </div>

              {/* Consultants in Order */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                  Consultants in Order *
                </label>
                <input
                  type="text"
                  required
                  placeholder={`e.g. ${faculty.full_name}, Co-Consultant`}
                  value={consultants}
                  onChange={(e) => setConsultants(e.target.value)}
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              {/* Associated Faculty Picker for instant cross-sync */}
              <div className="pt-2 border-t border-[#eedfd8]/60">
                <AssociatedFacultyPicker
                  selected={selectedAssociatedFaculty}
                  onChange={setSelectedAssociatedFaculty}
                  currentFaculty={faculty}
                  label="Co-Consultants / Associated Faculty (NIT Hamirpur)"
                  placeholder="Link co-consultant colleagues..."
                  helperText="Selected colleagues will automatically see this consultancy on their profile."
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
                  {modalMode === "edit" ? "Save Changes" : "Register Consultancy"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
