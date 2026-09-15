"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Trash2,
  Edit,
  Lightbulb,
  X,
  Search,
  CheckCircle2,
  Building2,
  Calendar,
  IndianRupee,
  Sparkles,
  Award,
  Layers,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { formatINR } from "@/lib/utils";
import { MOCK_FACULTY, MOCK_PROJECTS } from "@/lib/mock-data";
import { getStoredData, saveFacultyRecord } from "@/lib/faculty-storage";
import AssociatedFacultyPicker from "@/components/faculty/AssociatedFacultyPicker";
import {
  ACADEMIC_SESSIONS,
  MONTHS,
  PROJECT_STATUSES,
} from "@/lib/faculty-constants";

export default function FacultyProjectsPage() {
  const [user, setUser] = useState<any>(null);
  const [faculty, setFaculty] = useState<any>(MOCK_FACULTY[0]);
  const [projects, setProjects] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields matching tempcsebase
  const [title, setTitle] = useState("");
  const [agency, setAgency] = useState("");
  const [refNo, setRefNo] = useState("");
  const [budget, setBudget] = useState<number | string>(2500000);
  const [duration, setDuration] = useState("36 Months");
  const [status, setStatus] = useState("Ongoing");
  const [projectType, setProjectType] = useState("Sponsored Research Project");
  const [academicSession, setAcademicSession] = useState(ACADEMIC_SESSIONS[1] || "2024-2025");
  const [month, setMonth] = useState(MONTHS[3] || "April");
  const [year, setYear] = useState(new Date().getFullYear());
  const [investigators, setInvestigators] = useState("");
  const [selectedAssociatedFaculty, setSelectedAssociatedFaculty] = useState<any[]>([]);

  const loadProjects = (activeFaculty: any) => {
    const facId = activeFaculty?.id;
    const legacyId = activeFaculty?.legacy_id;
    const userProjects = MOCK_PROJECTS.filter((p: any) => {
      if (facId && p.faculty_ids && p.faculty_ids.includes(facId)) return true;
      if (legacyId && p.faculty_legacy_ids && p.faculty_legacy_ids.includes(legacyId)) return true;
      return false;
    });

    const fallback =
      Array.isArray(activeFaculty?.projects) && activeFaculty.projects.length > 0
        ? activeFaculty.projects
        : userProjects;
    const stored = getStoredData(activeFaculty, "projects", fallback);
    setProjects(stored);
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

    loadProjects(activeFaculty);

    const handleStorageUpdate = (e: any) => {
      if (!e.detail?.section || e.detail.section === "projects") {
        loadProjects(activeFaculty);
      }
    };
    window.addEventListener("nith_faculty_storage_update", handleStorageUpdate);
    return () => window.removeEventListener("nith_faculty_storage_update", handleStorageUpdate);
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        p.title?.toLowerCase().includes(q) ||
        (p.funding_agency && p.funding_agency.toLowerCase().includes(q)) ||
        (p.reference_number && p.reference_number.toLowerCase().includes(q)) ||
        (p.raw_investigators && p.raw_investigators.toLowerCase().includes(q));

      const matchesStatus =
        statusFilter === "ALL" || p.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [projects, search, statusFilter]);

  const totalFunding = useMemo(() => {
    return filteredProjects.reduce(
      (sum, p) => sum + (Number(p.total_sanctioned_amount || p.amount) || 0),
      0
    );
  }, [filteredProjects]);

  const openAddModal = () => {
    setModalMode("add");
    setEditingId(null);
    setTitle("");
    setAgency("DST-SERB");
    setRefNo(`CRG/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`);
    setBudget(2500000);
    setDuration("36 Months");
    setStatus("Ongoing");
    setProjectType("Sponsored Research Project");
    setAcademicSession(ACADEMIC_SESSIONS[1] || "2024-2025");
    setMonth(MONTHS[3] || "April");
    setYear(new Date().getFullYear());
    setInvestigators(faculty.full_name || "");
    setSelectedAssociatedFaculty([]);
    setShowModal(true);
  };

  const openEditModal = (prj: any) => {
    setModalMode("edit");
    setEditingId(prj.id);
    setTitle(prj.title || "");
    setAgency(prj.funding_agency || prj.agency || "");
    setRefNo(prj.reference_number || prj.ref_no || "");
    setBudget(prj.total_sanctioned_amount || prj.amount || 2500000);
    setDuration(prj.duration || "36 Months");
    setStatus(prj.status || "Ongoing");
    setProjectType(prj.project_type || prj.category || "Sponsored Research Project");
    setAcademicSession(prj.academic_session || ACADEMIC_SESSIONS[1]);
    setMonth(prj.month || MONTHS[3]);
    setYear(Number(prj.year) || new Date().getFullYear());
    setInvestigators(prj.raw_investigators || prj.investigators || "");

    const linked = Array.isArray(prj.associated_faculty)
      ? prj.associated_faculty
      : Array.isArray(prj.faculty_ids)
      ? MOCK_FACULTY.filter((f) => prj.faculty_ids.includes(f.id))
      : [];
    setSelectedAssociatedFaculty(linked);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !agency.trim()) {
      toast.error("Please provide Project Title and Sponsoring Agency");
      return;
    }

    const prjRecord: any = {
      id: modalMode === "edit" && editingId ? editingId : `prj-${Date.now()}`,
      title: title.trim(),
      funding_agency: agency.trim(),
      agency: agency.trim(),
      reference_number: refNo.trim() || `CRG/${year}/${Math.floor(1000 + Math.random() * 9000)}`,
      total_sanctioned_amount: Number(budget) || 0,
      amount: Number(budget) || 0,
      duration: duration.trim() || "36 Months",
      status: status,
      project_type: projectType,
      category: projectType,
      academic_session: academicSession,
      month: month,
      year: Number(year) || new Date().getFullYear(),
      raw_investigators: investigators.trim() || faculty.full_name,
      investigators: investigators.trim() || faculty.full_name,
      associated_faculty: selectedAssociatedFaculty,
      faculty_ids: [
        faculty.id,
        ...selectedAssociatedFaculty.map((f) => f.id || f.employee_code),
      ],
      updated_at: new Date().toISOString(),
    };

    saveFacultyRecord(faculty, "projects", prjRecord, false);
    loadProjects(faculty);
    setShowModal(false);
    toast.success(
      modalMode === "edit"
        ? "Sponsored project updated and synchronized successfully!"
        : "Sponsored research project recorded and synchronized with Co-PIs!"
    );
  };

  const handleDelete = (prj: any) => {
    if (!window.confirm(`Are you sure you want to delete "${prj.title}"?`)) return;
    saveFacultyRecord(faculty, "projects", prj, true);
    loadProjects(faculty);
    toast.success("Sponsored project removed from portfolio and storage updated");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      {/* Header Banner */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-[#85261e]" />
              Sponsored Research Projects
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2.5 py-0.5 rounded-full">
              {projects.length} Grants
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            External sponsored projects, funded R&amp;D grants, and consultancy projects for{" "}
            <strong>{faculty.full_name}</strong>.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] text-white px-4 py-2.5 text-xs font-bold shadow-xs hover:shadow-md transition cursor-pointer"
        >
          <Plus className="h-4 w-4 text-amber-300" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Overview Stat Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-[#eedfd8] p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Total Sanctioned Capital
          </span>
          <p className="text-xl sm:text-2xl font-black text-[#85261e] mt-0.5">
            {formatINR(totalFunding)}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#eedfd8] p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Ongoing Grants
          </span>
          <p className="text-xl sm:text-2xl font-black text-emerald-700 mt-0.5">
            {projects.filter((p) => p.status?.toLowerCase() === "ongoing").length} Projects
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#eedfd8] p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Completed Projects
          </span>
          <p className="text-xl sm:text-2xl font-black text-neutral-700 mt-0.5">
            {projects.filter((p) => p.status?.toLowerCase() === "completed").length} Delivered
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search projects by title, funding agency, reference no, or investigator..."
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
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Projects List */}
      <div className="space-y-3">
        {filteredProjects.map((prj: any) => (
          <div
            key={prj.id}
            className="rounded-2xl border border-[#eedfd8] bg-white p-5 shadow-2xs hover:shadow-md transition space-y-3 group"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  prj.status?.toLowerCase() === "ongoing"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-neutral-100 text-neutral-700 border border-neutral-300"
                }`}
              >
                {prj.status || "Ongoing"}
              </span>

              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] px-2.5 py-0.5 rounded-full">
                <Building2 className="w-3 h-3 text-[#85261e]" />
                {prj.funding_agency || prj.agency}
              </span>

              {prj.academic_session && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-neutral-100 text-neutral-600">
                  Session: {prj.academic_session}
                </span>
              )}

              <span className="text-xs font-bold text-neutral-400 ml-auto font-mono">
                {prj.month ? `${prj.month} ` : ""}{prj.year}
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-[#1c110c] leading-snug">
              {prj.title}
            </h3>

            <p className="text-xs text-neutral-600">
              <span className="font-semibold text-neutral-800">Investigators:</span>{" "}
              {prj.raw_investigators || prj.investigators || faculty.full_name}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
              <div className="p-2.5 rounded-xl bg-[#fff9f6] border border-[#eedfd8]/60 space-y-0.5">
                <span className="text-[10px] font-bold text-neutral-400 uppercase">Sanction / Ref No.</span>
                <p className="font-mono font-semibold text-neutral-800">{prj.reference_number || "Recorded"}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70 space-y-0.5">
                <span className="text-[10px] font-bold text-emerald-800 uppercase">Sanctioned Amount</span>
                <p className="font-bold text-emerald-900">
                  {formatINR(Number(prj.total_sanctioned_amount || prj.amount) || 0)}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#fff9f6] border border-[#eedfd8]/60 space-y-0.5">
                <span className="text-[10px] font-bold text-neutral-400 uppercase">Duration</span>
                <p className="font-semibold text-neutral-800">{prj.duration || "36 Months"}</p>
              </div>
            </div>

            {/* Actions Strip */}
            <div className="flex items-center justify-end gap-1 pt-3 border-t border-[#eedfd8]/60 text-xs">
              <button
                type="button"
                onClick={() => openEditModal(prj)}
                className="p-1.5 text-neutral-500 hover:text-[#85261e] transition rounded-lg hover:bg-[#fdf5f2] cursor-pointer"
                title="Edit Project"
              >
                <Edit className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => handleDelete(prj)}
                className="p-1.5 text-neutral-400 hover:text-red-700 transition rounded-lg hover:bg-red-50 cursor-pointer"
                title="Remove Project"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 text-neutral-500 text-xs bg-white rounded-2xl border border-[#eedfd8]">
            No sponsored projects found matching your search.
          </div>
        )}
      </div>

      {/* Add / Edit Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl border border-[#eedfd8] bg-white p-6 sm:p-8 shadow-2xl space-y-5 my-8 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#eedfd8]/60 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#85261e]">
                  {modalMode === "edit" ? "Modify Project Record" : "New Sponsored Grant"}
                </span>
                <h2 className="text-xl font-extrabold text-[#33110e]">
                  {modalMode === "edit" ? "Edit Research Project" : "Register Sponsored Project"}
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
                  Project Title *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Design and Development of High-Performance Resilient Microgrid Architectures"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-3 text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              {/* Sponsoring Agency & Reference No */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Funding / Sponsoring Agency *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DST-SERB, MeitY, DRDO, CSIR, ISRO"
                    value={agency}
                    onChange={(e) => setAgency(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Sanction / Reference Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CRG/2023/004812"
                    value={refNo}
                    onChange={(e) => setRefNo(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>
              </div>

              {/* Budget, Duration, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Sanctioned Amount (INR) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 36 Months / 3 Years"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Project Status *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs font-semibold text-[#33110e] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  >
                    {PROJECT_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Investigators */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                  Principal &amp; Co-Investigators in Order *
                </label>
                <input
                  type="text"
                  required
                  placeholder={`e.g. ${faculty.full_name} (PI), Dr. Co-PI Name (Co-PI)`}
                  value={investigators}
                  onChange={(e) => setInvestigators(e.target.value)}
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
                    Sanction Month
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
                    Sanction Year *
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

              {/* Associated Faculty Picker for instant cross-sync */}
              <div className="pt-2 border-t border-[#eedfd8]/60">
                <AssociatedFacultyPicker
                  selected={selectedAssociatedFaculty}
                  onChange={setSelectedAssociatedFaculty}
                  currentFaculty={faculty}
                  label="Co-Principal Investigators / Associated Faculty (NIT Hamirpur)"
                  placeholder="Link Co-PI colleagues to auto-sync to their profile..."
                  helperText="Selected colleagues will automatically see this research grant on their faculty profile."
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
                  {modalMode === "edit" ? "Save Changes" : "Register Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
