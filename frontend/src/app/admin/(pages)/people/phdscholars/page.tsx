"use client";

import { useState, useMemo, useEffect } from "react";
import {
  GraduationCap,
  Plus,
  Trash2,
  Edit,
  Search,
  Download,
  X,
  ExternalLink,
  Award,
  CheckCircle2,
  Clock,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import Papa from "papaparse";
import { MOCK_PHD_SCHOLARS, MOCK_FACULTY } from "@/lib/mock-data";
import { PhdScholar } from "@/lib/types";

export default function AdminPhdPage() {
  const [scholars, setScholars] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nith_admin_phd_scholars");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return MOCK_PHD_SCHOLARS;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("nith_admin_phd_scholars", JSON.stringify(scholars));
    }
  }, [scholars]);

  // Filters & Search
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [supervisorFilter, setSupervisorFilter] = useState("ALL");

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingScholar, setEditingScholar] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    enrollment_number: "",
    name: "",
    status: "pursuing" as "pursuing" | "passed",
    supervisor: MOCK_FACULTY[0]?.full_name || "Prof. Lalit Kumar Awasthi",
    co_supervisor: "",
    research_area: "Distributed Systems & Cloud Computing",
    topic: "",
    email: "",
    photo_url: "",
    registration_date: "2022-08-01",
    defense_date: "",
    google_scholar: "",
    scopus: "",
    linkedin: "",
  });

  const handleOpenAdd = () => {
    setModalMode("add");
    setEditingScholar(null);
    setFormData({
      enrollment_number: "",
      name: "",
      status: "pursuing",
      supervisor: MOCK_FACULTY[0]?.full_name || "Prof. Lalit Kumar Awasthi",
      co_supervisor: "",
      research_area: "Distributed Systems & Cloud Computing",
      topic: "",
      email: "",
      photo_url: "",
      registration_date: new Date().toISOString().split("T")[0],
      defense_date: "",
      google_scholar: "",
      scopus: "",
      linkedin: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sch: any) => {
    setModalMode("edit");
    setEditingScholar(sch);
    setFormData({
      enrollment_number: sch.enrollment_number || "",
      name: sch.name || sch.full_name || "",
      status: sch.status === "passed" ? "passed" : "pursuing",
      supervisor: sch.supervisor || MOCK_FACULTY[0]?.full_name || "",
      co_supervisor: sch.co_supervisor || "",
      research_area: sch.research_area || sch.topic || "",
      topic: sch.topic || sch.thesis_title || "",
      email: sch.email || "",
      photo_url: sch.photo_url || sch.image_url || sch.photo || "",
      registration_date: sch.registration_date || "2022-08-01",
      defense_date: sch.defense_date || "",
      google_scholar: sch.google_scholar || "",
      scopus: sch.scopus || "",
      linkedin: sch.linkedin || "",
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.enrollment_number.trim()) {
      toast.error("Scholar Name and Enrollment Number are required");
      return;
    }

    if (modalMode === "add") {
      const newScholar = {
        id: `phd-${Date.now()}`,
        enrollment_number: formData.enrollment_number.trim().toUpperCase(),
        name: formData.name.trim(),
        status: formData.status,
        supervisor: formData.supervisor,
        co_supervisor: formData.co_supervisor.trim() || undefined,
        research_area: formData.research_area.trim(),
        topic: formData.topic.trim() || formData.research_area.trim(),
        thesis_title: formData.topic.trim(),
        email: formData.email.trim(),
        photo_url: formData.photo_url.trim(),
        image_url: formData.photo_url.trim(),
        photo: formData.photo_url.trim(),
        registration_date: formData.registration_date,
        defense_date: formData.status === "passed" ? formData.defense_date : undefined,
        google_scholar: formData.google_scholar.trim(),
        scopus: formData.scopus.trim(),
        linkedin: formData.linkedin.trim(),
      };
      setScholars([newScholar, ...scholars]);
      toast.success(`Ph.D. Scholar ${newScholar.name} registered successfully`);
    } else if (editingScholar) {
      setScholars(
        scholars.map((sch) =>
          sch.id === editingScholar.id
            ? {
                ...sch,
                enrollment_number: formData.enrollment_number.trim().toUpperCase(),
                name: formData.name.trim(),
                status: formData.status,
                supervisor: formData.supervisor,
                co_supervisor: formData.co_supervisor.trim() || undefined,
                research_area: formData.research_area.trim(),
                topic: formData.topic.trim() || formData.research_area.trim(),
                thesis_title: formData.topic.trim(),
                email: formData.email.trim(),
                photo_url: formData.photo_url.trim(),
                image_url: formData.photo_url.trim(),
                photo: formData.photo_url.trim(),
                registration_date: formData.registration_date,
                defense_date: formData.status === "passed" ? formData.defense_date : undefined,
                google_scholar: formData.google_scholar.trim(),
                scopus: formData.scopus.trim(),
                linkedin: formData.linkedin.trim(),
              }
            : sch
        )
      );
      toast.success("Scholar record updated");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove scholar record "${name}"?`)) {
      setScholars(scholars.filter((x) => x.id !== id));
      toast.success("Scholar record removed");
    }
  };

  const handleExportCsv = () => {
    const csv = Papa.unparse(
      scholars.map((s) => ({
        "Enrollment No": s.enrollment_number,
        "Scholar Name": s.name,
        Status: s.status === "passed" ? "Doctorate Awarded" : "Pursuing",
        Supervisor: s.supervisor,
        "Co-Supervisor": s.co_supervisor || "",
        "Research Area": s.research_area || s.topic || "",
        "Thesis Title": s.thesis_title || s.topic || "",
        Email: s.email || "",
        "Registration Date": s.registration_date || "",
        "Defense Date": s.defense_date || "",
        "Google Scholar": s.google_scholar || "",
        Scopus: s.scopus || "",
        LinkedIn: s.linkedin || "",
      }))
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `nith_phd_scholars_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Ph.D. Scholars roster exported to CSV");
  };

  const supervisors = useMemo(() => {
    const set = new Set<string>();
    scholars.forEach((s) => {
      if (s.supervisor) set.add(s.supervisor);
    });
    return Array.from(set).sort();
  }, [scholars]);

  const filtered = useMemo(() => {
    return scholars.filter((s) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        s.name?.toLowerCase().includes(q) ||
        s.enrollment_number?.toLowerCase().includes(q) ||
        s.topic?.toLowerCase().includes(q) ||
        s.thesis_title?.toLowerCase().includes(q) ||
        s.supervisor?.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "ALL" || s.status === statusFilter;
      const matchesSupervisor =
        supervisorFilter === "ALL" || s.supervisor === supervisorFilter;

      return matchesSearch && matchesStatus && matchesSupervisor;
    });
  }, [scholars, search, statusFilter, supervisorFilter]);

  const pursuingCount = useMemo(() => scholars.filter((s) => s.status !== "passed").length, [scholars]);
  const passedCount = useMemo(() => scholars.filter((s) => s.status === "passed").length, [scholars]);

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold uppercase tracking-wider mb-2">
            <GraduationCap className="w-3.5 h-3.5" /> Doctoral Oversight
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#1c110c] tracking-tight">
            Ph.D. Scholars &amp; Alumni
          </h1>
          <p className="mt-1 text-sm text-[#5c4033]">
            Track enrolled research scholars, supervisors, thesis titles, and graduated doctoral alumni.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#eedfd8] bg-white px-3.5 py-2 text-xs font-bold text-[#33110e] hover:bg-[#fff9f6] transition shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#85261e]" /> Export CSV
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#33110e] hover:bg-[#85261e] px-4 py-2 text-xs font-bold text-white transition shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Ph.D. Scholar
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#eedfd8] bg-white p-4 shadow-2xs">
          <span className="text-xs font-bold text-[#85261e] uppercase tracking-wider">Total Scholars</span>
          <p className="text-2xl font-black text-[#1c110c] mt-1">{scholars.length}</p>
        </div>
        <div className="rounded-xl border border-[#eedfd8] bg-white p-4 shadow-2xs">
          <span className="text-xs font-bold text-[#85261e] uppercase tracking-wider">Enrolled (Pursuing)</span>
          <p className="text-2xl font-black text-[#85261e] mt-1">{pursuingCount}</p>
        </div>
        <div className="rounded-xl border border-[#eedfd8] bg-white p-4 shadow-2xs">
          <span className="text-xs font-bold text-[#85261e] uppercase tracking-wider">Doctorates Awarded</span>
          <p className="text-2xl font-black text-emerald-800 mt-1">{passedCount}</p>
        </div>
        <div className="rounded-xl border border-[#eedfd8] bg-white p-4 shadow-2xs">
          <span className="text-xs font-bold text-[#85261e] uppercase tracking-wider">Active Supervisors</span>
          <p className="text-2xl font-black text-[#1c110c] mt-1">{supervisors.length}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="rounded-2xl border border-[#eedfd8] bg-white p-4 shadow-2xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#85261e]/60" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by scholar name, roll, thesis topic..."
            className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] pl-10 pr-4 py-2 text-sm text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-none focus:ring-1 focus:ring-[#85261e]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#5c4033]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-[#eedfd8] bg-white px-3 py-1.5 text-xs font-bold text-[#1c110c] focus:outline-none focus:border-[#85261e]"
            >
              <option value="ALL">All Status</option>
              <option value="pursuing">Enrolled (Pursuing)</option>
              <option value="passed">Graduated (Awarded)</option>
            </select>
          </div>

          {/* Supervisor Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#5c4033]">Supervisor:</span>
            <select
              value={supervisorFilter}
              onChange={(e) => setSupervisorFilter(e.target.value)}
              className="rounded-lg border border-[#eedfd8] bg-white px-3 py-1.5 text-xs font-bold text-[#1c110c] focus:outline-none focus:border-[#85261e] max-w-[200px] truncate"
            >
              <option value="ALL">All Supervisors</option>
              {supervisors.map((sup) => (
                <option key={sup} value={sup}>
                  {sup}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Scholars Table */}
      <div className="overflow-hidden rounded-2xl border border-[#eedfd8] bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#fff9f6] text-xs font-black uppercase text-[#33110e] border-b border-[#eedfd8]">
              <tr>
                <th className="px-6 py-4">Enrollment No.</th>
                <th className="px-6 py-4">Scholar Name</th>
                <th className="px-6 py-4">Research Area &amp; Thesis</th>
                <th className="px-6 py-4">Supervisor(s)</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eedfd8]/60 text-[#1c110c]">
              {filtered.length > 0 ? (
                filtered.map((sch) => (
                  <tr key={sch.id} className="hover:bg-[#fff9f6]/60 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-xs">
                      <span className="px-2.5 py-1 rounded bg-[#33110e] text-white">
                        {sch.enrollment_number}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-sm text-[#1c110c]">
                      <div className="flex items-center gap-3">
                        {sch.photo_url || sch.image_url || sch.photo ? (
                          <img
                            src={sch.photo_url || sch.image_url || sch.photo}
                            alt={sch.name}
                            className="w-10 h-10 object-cover object-top rounded-xl border border-[#eedfd8] shadow-2xs flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-[#fff9f6] border border-[#eedfd8] flex items-center justify-center text-[#85261e] font-bold text-xs flex-shrink-0">
                            {sch.name?.charAt(0) || "S"}
                          </div>
                        )}
                        <div>
                          <div>{sch.name}</div>
                          {sch.email && (
                            <p className="text-xs font-normal text-neutral-400 mt-0.5">{sch.email}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-sm">
                      <p className="font-bold text-xs text-[#1c110c] line-clamp-2">
                        {sch.thesis_title || sch.topic}
                      </p>
                      {sch.research_area && sch.research_area !== sch.topic && (
                        <p className="text-[11px] text-[#85261e] font-semibold mt-0.5">
                          Area: {sch.research_area}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <p className="font-bold text-[#1c110c]">{sch.supervisor}</p>
                      {sch.co_supervisor && (
                        <p className="text-[11px] text-neutral-500 mt-0.5">Co: {sch.co_supervisor}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                          sch.status === "passed"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-blue-100 text-blue-800 border border-blue-200"
                        }`}
                      >
                        {sch.status === "passed" ? "Awarded" : "Pursuing"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(sch)}
                          className="p-1.5 rounded-lg border border-[#eedfd8] text-neutral-600 hover:bg-[#33110e] hover:text-white transition cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(sch.id, sch.name)}
                          className="p-1.5 rounded-lg border border-[#eedfd8] text-red-600 hover:bg-red-600 hover:text-white transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#5c4033]">
                    <GraduationCap className="w-8 h-8 mx-auto text-[#85261e]/40 mb-2" />
                    <p className="font-bold text-base">No doctoral scholars found</p>
                    <p className="text-xs text-neutral-400 mt-1">Try adjusting your search query or filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT SCHOLAR MODAL (Parity with adminModalPhdScholar & adminModalPhdPassed) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#eedfd8] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-[#fff9f6] border-b border-[#eedfd8] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-[#85261e] tracking-wider">
                  Doctoral Enrollment &amp; Alumni
                </span>
                <h3 className="text-lg font-black text-[#1c110c]">
                  {modalMode === "add" ? "Register Ph.D. Scholar" : "Edit Scholar Record"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:bg-[#eedfd8] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                    Enrollment / Roll Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.enrollment_number}
                    onChange={(e) => setFormData({ ...formData, enrollment_number: e.target.value })}
                    placeholder="e.g. 21DCS001"
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm font-mono focus:border-[#85261e] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                    Scholar Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. / Mr. Anurag Sharma"
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                  />
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                  Doctoral Candidate Status *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: "pursuing" })}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                      formData.status === "pursuing"
                        ? "bg-[#33110e] text-white border-[#33110e]"
                        : "bg-white text-neutral-700 border-[#eedfd8] hover:bg-[#fff9f6]"
                    }`}
                  >
                    <Clock className="w-4 h-4" /> Enrolled (Pursuing)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: "passed" })}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                      formData.status === "passed"
                        ? "bg-emerald-800 text-white border-emerald-800"
                        : "bg-white text-neutral-700 border-[#eedfd8] hover:bg-emerald-50"
                    }`}
                  >
                    <Award className="w-4 h-4" /> Graduated (Doctorate Awarded)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                    Scholar Institute / Personal Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="scholar@nith.ac.in"
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                    Profile Photo URL (Cloudinary / Image Link)
                  </label>
                  <input
                    type="url"
                    value={formData.photo_url}
                    onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                    placeholder="https://res.cloudinary.com/..."
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                    Faculty Supervisor *
                  </label>
                  <select
                    required
                    value={formData.supervisor}
                    onChange={(e) => setFormData({ ...formData, supervisor: e.target.value })}
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                  >
                    {MOCK_FACULTY.map((f) => (
                      <option key={f.id} value={f.full_name}>
                        {f.full_name} ({f.designation})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                    Co-Supervisor (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.co_supervisor}
                    onChange={(e) => setFormData({ ...formData, co_supervisor: e.target.value })}
                    placeholder="e.g. Dr. Kamlesh Dutta"
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                  Research Area / Specialization
                </label>
                <input
                  type="text"
                  value={formData.research_area}
                  onChange={(e) => setFormData({ ...formData, research_area: e.target.value })}
                  placeholder="e.g. Deep Learning, Network Security, Cloud Orchestration"
                  className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                  {formData.status === "passed" ? "Thesis Title (Awarded) *" : "Doctoral Research Topic / Title"}
                </label>
                <input
                  type="text"
                  required={formData.status === "passed"}
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="e.g. Energy-Efficient Resource Scheduling in Fog Computing Environments"
                  className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                    Registration Date
                  </label>
                  <input
                    type="date"
                    value={formData.registration_date}
                    onChange={(e) => setFormData({ ...formData, registration_date: e.target.value })}
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                  />
                </div>

                {formData.status === "passed" && (
                  <div>
                    <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                      Defense / Viva Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.defense_date}
                      onChange={(e) => setFormData({ ...formData, defense_date: e.target.value })}
                      className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Social / Scholar Profile URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                    Google Scholar Link
                  </label>
                  <input
                    type="url"
                    value={formData.google_scholar}
                    onChange={(e) => setFormData({ ...formData, google_scholar: e.target.value })}
                    placeholder="https://scholar.google.com/..."
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-1.5 text-xs focus:border-[#85261e] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                    Scopus Author ID
                  </label>
                  <input
                    type="text"
                    value={formData.scopus}
                    onChange={(e) => setFormData({ ...formData, scopus: e.target.value })}
                    placeholder="Scopus ID"
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-1.5 text-xs focus:border-[#85261e] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-1.5 text-xs focus:border-[#85261e] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#eedfd8]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#eedfd8] text-xs font-bold text-[#5c4033] hover:bg-[#fff9f6] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  {modalMode === "add" ? "Register Scholar" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
