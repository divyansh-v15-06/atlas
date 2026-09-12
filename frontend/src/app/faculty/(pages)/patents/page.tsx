"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Trash2,
  Edit,
  Shield,
  X,
  Search,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  FileText,
  Building2,
  Calendar,
  Award,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import { MOCK_FACULTY, MOCK_PATENTS } from "@/lib/mock-data";
import { getStoredData, saveFacultyRecord } from "@/lib/faculty-storage";
import AssociatedFacultyPicker from "@/components/faculty/AssociatedFacultyPicker";
import {
  ACADEMIC_SESSIONS,
  MONTHS,
  PATENT_STATUSES,
} from "@/lib/faculty-constants";

export default function FacultyPatentsPage() {
  const [user, setUser] = useState<any>(null);
  const [faculty, setFaculty] = useState<any>(MOCK_FACULTY[0]);
  const [patents, setPatents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields matching tempcsebase
  const [title, setTitle] = useState("");
  const [appNo, setAppNo] = useState("");
  const [patentNo, setPatentNo] = useState("");
  const [status, setStatus] = useState("Filed");
  const [place, setPlace] = useState("Indian Patent Office (New Delhi)");
  const [country, setCountry] = useState("India");
  const [academicSession, setAcademicSession] = useState(ACADEMIC_SESSIONS[1] || "2024-2025");
  const [month, setMonth] = useState(MONTHS[0]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [filingDate, setFilingDate] = useState(new Date().toISOString().split("T")[0]);
  const [grantDate, setGrantDate] = useState("");
  const [inventors, setInventors] = useState("");
  const [selectedAssociatedFaculty, setSelectedAssociatedFaculty] = useState<any[]>([]);

  const loadPatents = (activeFaculty: any) => {
    const lastName = activeFaculty.full_name?.toLowerCase().split(" ").pop() || "";
    const userPatents = MOCK_PATENTS.filter((p: any) => {
      if (p.faculty_ids && p.faculty_ids.includes(activeFaculty.id)) return true;
      if (p.raw_inventors && p.raw_inventors.toLowerCase().includes(lastName)) return true;
      return false;
    });

    const fallback = userPatents.length > 0 ? userPatents : MOCK_PATENTS;
    const stored = getStoredData(activeFaculty, "patents", fallback);
    setPatents(stored);
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

    loadPatents(activeFaculty);

    const handleStorageUpdate = (e: any) => {
      if (!e.detail?.section || e.detail.section === "patents") {
        loadPatents(activeFaculty);
      }
    };
    window.addEventListener("nith_faculty_storage_update", handleStorageUpdate);
    return () => window.removeEventListener("nith_faculty_storage_update", handleStorageUpdate);
  }, []);

  const filteredPatents = useMemo(() => {
    return patents.filter((p) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        p.title?.toLowerCase().includes(q) ||
        (p.application_number && String(p.application_number).toLowerCase().includes(q)) ||
        (p.patent_number && String(p.patent_number).toLowerCase().includes(q)) ||
        (p.raw_inventors && p.raw_inventors.toLowerCase().includes(q));

      const matchesStatus =
        statusFilter === "ALL" || p.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [patents, search, statusFilter]);

  const openAddModal = () => {
    setModalMode("add");
    setEditingId(null);
    setTitle("");
    setAppNo("");
    setPatentNo("");
    setStatus("Filed");
    setPlace("Indian Patent Office (New Delhi)");
    setCountry("India");
    setAcademicSession(ACADEMIC_SESSIONS[1] || "2024-2025");
    setMonth(MONTHS[0]);
    setYear(new Date().getFullYear());
    setFilingDate(new Date().toISOString().split("T")[0]);
    setGrantDate("");
    setInventors(faculty.full_name || "");
    setSelectedAssociatedFaculty([]);
    setShowModal(true);
  };

  const openEditModal = (pat: any) => {
    setModalMode("edit");
    setEditingId(pat.id);
    setTitle(pat.title || "");
    setAppNo(pat.application_number || "");
    setPatentNo(pat.patent_number || "");
    setStatus(pat.status || "Filed");
    setPlace(pat.place || pat.patent_office || "Indian Patent Office (New Delhi)");
    setCountry(pat.country || "India");
    setAcademicSession(pat.academic_session || ACADEMIC_SESSIONS[1]);
    setMonth(pat.month || MONTHS[0]);
    setYear(Number(pat.year) || new Date().getFullYear());
    setFilingDate(pat.filing_date || "");
    setGrantDate(pat.grant_date || "");
    setInventors(pat.raw_inventors || pat.inventors || "");

    const linked = Array.isArray(pat.associated_faculty)
      ? pat.associated_faculty
      : Array.isArray(pat.faculty_ids)
      ? MOCK_FACULTY.filter((f) => pat.faculty_ids.includes(f.id))
      : [];
    setSelectedAssociatedFaculty(linked);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !appNo.trim()) {
      toast.error("Please provide Patent Title and Application Number");
      return;
    }

    const patRecord: any = {
      id: modalMode === "edit" && editingId ? editingId : `pat-${Date.now()}`,
      title: title.trim(),
      application_number: appNo.trim(),
      patent_number: status === "Granted" ? patentNo.trim() || `IN ${Math.floor(100000 + Math.random() * 900000)}` : "",
      status: status,
      place: place.trim(),
      patent_office: place.trim(),
      country: country.trim(),
      academic_session: academicSession,
      month: month,
      year: Number(year) || new Date().getFullYear(),
      filing_date: filingDate,
      grant_date: status === "Granted" ? grantDate || new Date().toISOString().split("T")[0] : "",
      raw_inventors: inventors.trim() || faculty.full_name,
      inventors: inventors.trim() || faculty.full_name,
      abstract_text: `Patented technology developed by ${inventors || faculty.full_name}.`,
      associated_faculty: selectedAssociatedFaculty,
      faculty_ids: [
        faculty.id,
        ...selectedAssociatedFaculty.map((f) => f.id || f.employee_code),
      ],
      updated_at: new Date().toISOString(),
    };

    saveFacultyRecord(faculty, "patents", patRecord, false);
    loadPatents(faculty);
    setShowModal(false);
    toast.success(
      modalMode === "edit"
        ? "Patent record updated successfully and synchronized!"
        : "Intellectual property patent record saved and synchronized with co-inventors!"
    );
  };

  const handleDelete = (pat: any) => {
    if (!window.confirm(`Are you sure you want to delete "${pat.title}"?`)) return;
    saveFacultyRecord(faculty, "patents", pat, true);
    loadPatents(faculty);
    toast.success("Patent entry removed and storage updated");
  };

  const getStatusBadge = (st: string) => {
    const s = (st || "").toLowerCase();
    if (s.includes("grant")) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
          Granted
        </span>
      );
    }
    if (s.includes("publi")) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
          <Sparkles className="w-3 h-3 text-amber-700" />
          Published
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
        <FileText className="w-3 h-3 text-blue-600" />
        Filed
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      {/* Header Banner */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <Shield className="w-6 h-6 text-[#85261e]" />
              Patents &amp; Intellectual Property
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2.5 py-0.5 rounded-full">
              {patents.length} Patents
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Official patent filings, granted intellectual properties, and agency citations for{" "}
            <strong>{faculty.full_name}</strong>.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] text-white px-4 py-2.5 text-xs font-bold shadow-xs hover:shadow-md transition cursor-pointer"
        >
          <Plus className="h-4 w-4 text-amber-300" />
          <span>Add Patent</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search patents by title, application number, or inventor..."
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
          <option value="Granted">Granted</option>
          <option value="Published">Published</option>
          <option value="Filed">Filed</option>
        </select>
      </div>

      {/* Patents List */}
      <div className="space-y-3">
        {filteredPatents.map((pat: any) => (
          <div
            key={pat.id}
            className="rounded-2xl border border-[#eedfd8] bg-white p-5 shadow-2xs hover:shadow-md transition space-y-3 group"
          >
            <div className="flex flex-wrap items-center gap-2">
              {getStatusBadge(pat.status)}

              {pat.place && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] px-2.5 py-0.5 rounded-full">
                  <Building2 className="w-3 h-3 text-[#85261e]" />
                  {pat.place}
                </span>
              )}

              {pat.academic_session && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-neutral-100 text-neutral-600">
                  Session: {pat.academic_session}
                </span>
              )}

              <span className="text-xs font-bold text-neutral-400 ml-auto font-mono">
                {pat.month ? `${pat.month} ` : ""}{pat.year || (pat.filing_date ? pat.filing_date.split("-")[0] : "")}
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-[#1c110c] leading-snug">
              {pat.title}
            </h3>

            <p className="text-xs text-neutral-600">
              <span className="font-semibold text-neutral-800">Inventors:</span>{" "}
              {pat.raw_inventors || pat.inventors || faculty.full_name}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs pt-1">
              <div className="p-2.5 rounded-xl bg-[#fff9f6] border border-[#eedfd8]/60 space-y-0.5">
                <span className="text-[10px] font-bold text-neutral-400 uppercase">Application No.</span>
                <p className="font-mono font-semibold text-neutral-800">{pat.application_number || "Pending"}</p>
              </div>

              {pat.patent_number && (
                <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70 space-y-0.5">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase">Patent Number</span>
                  <p className="font-mono font-bold text-emerald-900">{pat.patent_number}</p>
                </div>
              )}

              <div className="p-2.5 rounded-xl bg-[#fff9f6] border border-[#eedfd8]/60 space-y-0.5">
                <span className="text-[10px] font-bold text-neutral-400 uppercase">Filing / Grant Date</span>
                <p className="font-semibold text-neutral-800">
                  {pat.grant_date ? `Granted: ${pat.grant_date}` : `Filed: ${pat.filing_date || "Recorded"}`}
                </p>
              </div>
            </div>

            {/* Actions Strip */}
            <div className="flex items-center justify-end gap-1 pt-3 border-t border-[#eedfd8]/60 text-xs">
              <button
                type="button"
                onClick={() => openEditModal(pat)}
                className="p-1.5 text-neutral-500 hover:text-[#85261e] transition rounded-lg hover:bg-[#fdf5f2] cursor-pointer"
                title="Edit Patent"
              >
                <Edit className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => handleDelete(pat)}
                className="p-1.5 text-neutral-400 hover:text-red-700 transition rounded-lg hover:bg-red-50 cursor-pointer"
                title="Remove Patent"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredPatents.length === 0 && (
          <div className="text-center py-16 text-neutral-500 text-xs bg-white rounded-2xl border border-[#eedfd8]">
            No patent records found matching your search.
          </div>
        )}
      </div>

      {/* Add / Edit Patent Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl border border-[#eedfd8] bg-white p-6 sm:p-8 shadow-2xl space-y-5 my-8 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#eedfd8]/60 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#85261e]">
                  {modalMode === "edit" ? "Modify Intellectual Property" : "New Intellectual Property"}
                </span>
                <h2 className="text-xl font-extrabold text-[#33110e]">
                  {modalMode === "edit" ? "Edit Patent Details" : "Register Patent"}
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
                  Patent Title *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. A Smart IoT Gateway for Distributed Agricultural Sensor Networks"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-3 text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              {/* Status & Awarding Agency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Patent Status *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs font-semibold text-[#33110e] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  >
                    {PATENT_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Awarding Agency / Place *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Indian Patent Office (New Delhi) / USPTO"
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>
              </div>

              {/* App No & Patent No */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Application / Reference Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 202311048291"
                    value={appNo}
                    onChange={(e) => setAppNo(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Patent Number {status !== "Granted" && "(Optional if not granted)"}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. IN 482910"
                    value={patentNo}
                    onChange={(e) => setPatentNo(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>
              </div>

              {/* Inventors */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                  Inventors in Order *
                </label>
                <input
                  type="text"
                  required
                  placeholder={`e.g. ${faculty.full_name}, Dr. Jane Doe`}
                  value={inventors}
                  onChange={(e) => setInventors(e.target.value)}
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              {/* Academic Session, Month, Year */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                    min={1970}
                    max={2035}
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>
              </div>

              {/* Dates & Country */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Filing Date
                  </label>
                  <input
                    type="date"
                    value={filingDate}
                    onChange={(e) => setFilingDate(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Grant Date (if granted)
                  </label>
                  <input
                    type="date"
                    value={grantDate}
                    onChange={(e) => setGrantDate(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
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
                  label="Co-Inventors / Associated Faculty (NIT Hamirpur)"
                  placeholder="Link co-inventor colleagues to auto-sync to their profile..."
                  helperText="Selected colleagues will automatically see this patent in their portfolio and profile."
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
                  {modalMode === "edit" ? "Save Changes" : "Register Patent"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
