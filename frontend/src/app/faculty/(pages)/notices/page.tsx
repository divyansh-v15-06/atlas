"use client";

import { useState, useMemo, useEffect } from "react";
import {
  FileText,
  Search,
  Download,
  Calendar,
  Lock,
  ExternalLink,
  Filter,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  Building2,
  Sparkles,
} from "lucide-react";
import { MOCK_FACULTY } from "@/lib/mock-data";
import { resolveFacultyDepartment } from "@/lib/faculty-storage";

interface InternalNotice {
  id: string;
  reference_no: string;
  title: string;
  category: "Academic" | "Examination" | "Administrative" | "Meeting" | "Faculty Duty";
  publish_date: string;
  issued_by: string;
  description: string;
  pdf_url?: string;
  is_urgent?: boolean;
}

const INITIAL_INTERNAL_NOTICES: InternalNotice[] = [
  {
    id: "not-1",
    reference_no: "NITH/CSE/OFFICE/2026/084",
    title: "End-Semester Examination Theory & Practical Invigilation Duty Roster — Spring 2026",
    category: "Examination",
    publish_date: "2026-05-18",
    issued_by: "Officer In-charge Examinations, DoCSE",
    description:
      "All regular and contractual faculty members are allocated examination superintendent and invigilation duties as per the enclosed roster. Swap requests must be submitted 48 hours in advance.",
    pdf_url: "https://nith.ac.in/academic-calendar",
    is_urgent: true,
  },
  {
    id: "not-2",
    reference_no: "NITH/CSE/DFAC/2026/021",
    title: "Minutes of 4th Departmental Faculty Board (DFAC) Meeting — Curriculum Revision (NEP-2020)",
    category: "Meeting",
    publish_date: "2026-05-12",
    issued_by: "Head of Department, CSE",
    description:
      "Approved resolutions regarding the restructuring of 5th and 6th semester electives, inclusion of Edge AI & Cloud Systems laboratory tracks, and major capstone evaluation rubrics.",
    pdf_url: "https://nith.ac.in/syllabus",
    is_urgent: false,
  },
  {
    id: "not-3",
    reference_no: "NITH/DEAN-R&C/2026/341",
    title: "Call for Internal Seed Grant Proposals for Newly Joined Assistant Professors (Round II)",
    category: "Academic",
    publish_date: "2026-05-02",
    issued_by: "Dean (Research & Consultancy)",
    description:
      "Faculty members appointed within the last three years may apply for institutional seed grants up to ₹5.00 Lakhs for preliminary computational and laboratory experimental setups.",
    pdf_url: "https://nith.ac.in",
    is_urgent: false,
  },
  {
    id: "not-4",
    reference_no: "NITH/CSE/ADMIN/2026/059",
    title: "Reconstitution of Departmental Purchase Committee (DPC) & Annual Physical Stock Verification",
    category: "Administrative",
    publish_date: "2026-04-25",
    issued_by: "Head of Department, CSE",
    description:
      "Nomination of faculty convenors and laboratory staff for annual stock verification of computing hardware, networking gear, and licensed software across all department laboratories.",
    pdf_url: "https://nith.ac.in",
    is_urgent: false,
  },
  {
    id: "not-5",
    reference_no: "NITH/CSE/PG-PHD/2026/014",
    title: "Schedule for Ph.D. Comprehensive Viva-Voce & State-of-the-Art Seminar Presentations",
    category: "Faculty Duty",
    publish_date: "2026-04-15",
    issued_by: "PG & Doctoral Committee (DPGC)",
    description:
      "Doctoral progress reviews and state-of-the-art seminars will be conducted in Hybrid mode. Respective Doctoral Scrutiny Committee (DSC) members must be present.",
    pdf_url: "https://nith.ac.in",
    is_urgent: false,
  },
];

export default function FacultyNoticesPage() {
  const [user, setUser] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [selectedNotice, setSelectedNotice] = useState<InternalNotice | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("auth_user");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {}
    }
  }, []);

  const activeFaculty =
    MOCK_FACULTY.find(
      (f) =>
        f.employee_code?.toLowerCase() === user?.employee_code?.toLowerCase() ||
        f.email?.toLowerCase() === user?.email?.toLowerCase() ||
        f.id === user?.faculty_id
    ) || MOCK_FACULTY[0];

  const facultyDept = resolveFacultyDepartment(activeFaculty, user);

  // Filtered notices
  const filteredNotices = useMemo(() => {
    return INITIAL_INTERNAL_NOTICES.filter((item) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        item.title.toLowerCase().includes(q) ||
        item.reference_no.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.issued_by.toLowerCase().includes(q);

      const matchesCat = categoryFilter === "ALL" || item.category === categoryFilter;

      return matchesSearch && matchesCat;
    });
  }, [search, categoryFilter]);

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#85261e]" />
              Department Office Circulars &amp; Internal Notices
            </h1>
            <span className="bg-[#85261e] text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded shadow-xs">
              Confidential
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Official internal memos, examination duties, meeting minutes, and administrative orders for{" "}
            <strong>Department of {facultyDept.name}</strong> faculty &amp; staff.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] px-3 py-1.5 rounded-xl">
            {filteredNotices.length} Circulars Listed
          </span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search circulars by subject, reference no, or keyword..."
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
          <option value="ALL">All Circular Categories</option>
          <option value="Academic">Academic Orders</option>
          <option value="Examination">Examination Duties</option>
          <option value="Meeting">Meeting Minutes (DFAC/DAC)</option>
          <option value="Administrative">Administrative Notices</option>
          <option value="Faculty Duty">Faculty Duties &amp; Schedules</option>
        </select>
      </div>

      {/* Circulars Card List */}
      <div className="space-y-3.5">
        {filteredNotices.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-[#eedfd8] space-y-2">
            <FileText className="w-10 h-10 text-neutral-300 mx-auto" />
            <h3 className="text-sm font-bold text-[#33110e]">No circulars found</h3>
            <p className="text-xs text-neutral-500">
              Try adjusting your keyword search or category filter.
            </p>
          </div>
        ) : (
          filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className="bg-white rounded-2xl border border-[#eedfd8] p-5 shadow-2xs hover:shadow-xs hover:border-[#85261e]/50 transition space-y-3"
            >
              {/* Card Meta Header */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-[#85261e] bg-[#fff9f6] border border-[#eedfd8] px-2 py-0.5 rounded">
                    {notice.reference_no}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      notice.category === "Examination"
                        ? "bg-amber-100 text-amber-800"
                        : notice.category === "Meeting"
                        ? "bg-purple-100 text-purple-800"
                        : notice.category === "Academic"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {notice.category}
                  </span>
                  {notice.is_urgent && (
                    <span className="bg-red-600 text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded animate-pulse">
                      Urgent Action
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#85261e]" />
                  <span>Issued: {notice.publish_date}</span>
                </div>
              </div>

              {/* Title & Body */}
              <div>
                <h3 className="text-sm font-bold text-[#1c110c] leading-snug">
                  {notice.title}
                </h3>
                <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
                  {notice.description}
                </p>
              </div>

              {/* Footer Attribution & Download Action */}
              <div className="pt-3 border-t border-[#eedfd8]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="text-[11px] text-neutral-500 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Authority: <strong>{notice.issued_by}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedNotice(notice)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#eedfd8] bg-[#fff9f6] hover:bg-[#eedfd8]/40 text-[#33110e] text-xs font-bold transition cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#85261e]" />
                    <span>View Notice</span>
                  </button>

                  {notice.pdf_url && (
                    <a
                      href={notice.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#33110e] hover:bg-[#85261e] text-white text-xs font-bold transition shadow-2xs cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-300" />
                      <span>Download PDF Circular</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#eedfd8] space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#eedfd8] pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-[#85261e]">
                  {selectedNotice.reference_no}
                </span>
                <h3 className="text-base font-bold text-[#1c110c] mt-0.5">
                  {selectedNotice.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNotice(null)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-neutral-700 leading-relaxed bg-[#fff9f6] p-4 rounded-xl border border-[#eedfd8]">
              <p className="font-semibold text-[#85261e]">Full Circular Details:</p>
              <p>{selectedNotice.description}</p>
            </div>

            <div className="text-[11px] text-neutral-500 space-y-1">
              <p><strong>Issuing Authority:</strong> {selectedNotice.issued_by}</p>
              <p><strong>Date of Publication:</strong> {selectedNotice.publish_date}</p>
              <p><strong>Classification:</strong> Internal Departmental Communication</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#eedfd8]">
              <button
                type="button"
                onClick={() => setSelectedNotice(null)}
                className="px-4 py-2 rounded-xl border border-[#eedfd8] text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
              >
                Close
              </button>
              {selectedNotice.pdf_url && (
                <a
                  href={selectedNotice.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#85261e] hover:bg-[#33110e] text-white text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Circular</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
