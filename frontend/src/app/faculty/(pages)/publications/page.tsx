"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Trash2,
  Edit,
  BookOpen,
  X,
  Copy,
  ExternalLink,
  Search,
  Check,
  RotateCcw,
  Sparkles,
  Layers,
  FileText,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { MOCK_FACULTY, MOCK_PUBLICATIONS } from "@/lib/mock-data";
import { getStoredData, saveFacultyRecord } from "@/lib/faculty-storage";
import CoAuthorsInput, { CoAuthorInternal } from "@/components/faculty/CoAuthorsInput";
import {
  ACADEMIC_SESSIONS,
  MONTHS,
  JOURNAL_QUARTILES,
  INDEXING_OPTIONS,
  PUBLICATION_TYPES,
} from "@/lib/faculty-constants";

export default function FacultyPublicationsPage() {
  const [user, setUser] = useState<any>(null);
  const [faculty, setFaculty] = useState<any>(MOCK_FACULTY[0]);
  const [publications, setPublications] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal State (Add / Edit)
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields matching tempcsebase
  const [title, setTitle] = useState("");
  const [pubType, setPubType] = useState("Journal");
  const [venue, setVenue] = useState("");
  const [authors, setAuthors] = useState("");
  const [academicSession, setAcademicSession] = useState(ACADEMIC_SESSIONS[1] || "2024-2025");
  const [month, setMonth] = useState(MONTHS[0]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [indexing, setIndexing] = useState("Scopus");
  const [customIndexing, setCustomIndexing] = useState("");
  const [quartile, setQuartile] = useState("Q1");
  const [isbn, setIsbn] = useState("");
  const [volume, setVolume] = useState("");
  const [issue, setIssue] = useState("");
  const [pages, setPages] = useState("");
  const [doi, setDoi] = useState("");
  const [selectedAssociatedFaculty, setSelectedAssociatedFaculty] = useState<any[]>([]);
  const [externalAuthors, setExternalAuthors] = useState<string[]>([]);

  const loadPublications = (activeFaculty: any) => {
    const baseFaculty =
      MOCK_FACULTY.find(
        (f) =>
          f.id === activeFaculty?.id ||
          (f.employee_code && activeFaculty?.employee_code && f.employee_code.toLowerCase() === activeFaculty.employee_code.toLowerCase()) ||
          (f.legacy_id && activeFaculty?.legacy_id && f.legacy_id === activeFaculty.legacy_id)
      ) || activeFaculty;

    const legacyId = baseFaculty?.legacy_id;
    const lastName = baseFaculty?.full_name?.toLowerCase().split(" ").pop() || "";

    const userPapers = MOCK_PUBLICATIONS.filter((p: any) => {
      if (legacyId && p.faculty_legacy_ids?.includes(legacyId)) return true;
      if (p.author_text && typeof p.author_text === "string" && p.author_text.toLowerCase().includes(lastName)) return true;
      if (Array.isArray(p.authors) && p.authors.some((a: any) => typeof a === "string" && a.toLowerCase().includes(lastName))) return true;
      return false;
    });

    const fallback =
      baseFaculty?.publications && baseFaculty.publications.length > 0
        ? baseFaculty.publications
        : userPapers.length > 0
        ? userPapers
        : MOCK_PUBLICATIONS.slice(0, 15);

    const stored = getStoredData(baseFaculty, "publications", fallback);
    setPublications(stored);
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

    loadPublications(activeFaculty);

    const handleStorageUpdate = (e: any) => {
      if (!e.detail?.section || e.detail.section === "publications") {
        loadPublications(activeFaculty);
      }
    };
    window.addEventListener("nith_faculty_storage_update", handleStorageUpdate);
    return () => window.removeEventListener("nith_faculty_storage_update", handleStorageUpdate);
  }, []);

  const filteredPublications = useMemo(() => {
    return publications.filter((p) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        p.title?.toLowerCase().includes(q) ||
        (p.journal_or_conference_name && p.journal_or_conference_name.toLowerCase().includes(q)) ||
        (p.venue_name && p.venue_name.toLowerCase().includes(q)) ||
        (p.author_text && p.author_text.toLowerCase().includes(q)) ||
        (p.doi && p.doi.toLowerCase().includes(q));

      const matchesType =
        typeFilter === "ALL" ||
        p.publication_type?.toLowerCase() === typeFilter.toLowerCase();

      return matchesSearch && matchesType;
    });
  }, [publications, search, typeFilter]);

  const handleCopyCitation = (pub: any) => {
    const pubAuthors = pub.author_text || faculty.full_name;
    const citation = `${pubAuthors} (${pub.year}). "${pub.title}". ${pub.journal_or_conference_name || pub.venue_name}${pub.volume ? `, vol. ${pub.volume}` : ""}${pub.issue ? `, no. ${pub.issue}` : ""}${pub.page_range || pub.pages ? `, pp. ${pub.page_range || pub.pages}` : ""}.${pub.doi ? ` DOI: ${pub.doi}` : ""}`;
    navigator.clipboard.writeText(citation);
    setCopiedId(pub.id);
    toast.success("Citation copied in standard format!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  const openAddModal = () => {
    setModalMode("add");
    setEditingId(null);
    setTitle("");
    setPubType("Journal");
    setVenue("");
    setAuthors(faculty.full_name || "");
    setAcademicSession(ACADEMIC_SESSIONS[1] || "2024-2025");
    setMonth(MONTHS[0]);
    setYear(new Date().getFullYear());
    setIndexing("Scopus");
    setCustomIndexing("");
    setQuartile("Q1");
    setIsbn("");
    setVolume("");
    setIssue("");
    setPages("");
    setDoi("");
    setSelectedAssociatedFaculty([]);
    setExternalAuthors([]);
    setShowModal(true);
  };

  const openEditModal = (pub: any) => {
    setModalMode("edit");
    setEditingId(pub.id);
    setTitle(pub.title || "");
    setPubType(pub.publication_type || "Journal");
    setVenue(pub.journal_or_conference_name || pub.venue_name || "");
    setAuthors(pub.author_text || "");
    setAcademicSession(pub.academic_session || ACADEMIC_SESSIONS[1]);
    setMonth(pub.publication_month || pub.month || MONTHS[0]);
    setYear(Number(pub.year) || new Date().getFullYear());
    setIndexing(pub.indexing || "Scopus");
    setCustomIndexing(pub.custom_indexing || "");
    setQuartile(pub.journal_quartile || "Q1");
    setIsbn(pub.isbn || "");
    setVolume(pub.volume || "");
    setIssue(pub.issue || "");
    setPages(pub.pages || pub.page_range || "");
    setDoi(pub.doi || "");

    // Resolve associated internal faculty
    const linked = Array.isArray(pub.associated_faculty)
      ? pub.associated_faculty
      : Array.isArray(pub.internal_authors)
      ? pub.internal_authors
      : Array.isArray(pub.faculty_ids)
      ? MOCK_FACULTY.filter((f) => pub.faculty_ids.includes(f.id) && f.id !== faculty.id)
      : [];
    setSelectedAssociatedFaculty(linked);
    setExternalAuthors(Array.isArray(pub.external_authors) ? pub.external_authors : []);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !venue.trim()) {
      toast.error("Please provide Publication Title and Journal/Conference/Publisher Name");
      return;
    }

    const effectiveIndexing = indexing === "Other" && customIndexing.trim() ? customIndexing.trim() : indexing;

    // Structured authors list for PostgreSQL M:N join table (publication_authors)
    const structuredAuthors = [
      {
        author_name: faculty.full_name,
        author_order: 1,
        faculty_id: faculty.id || null,
        is_corresponding: true,
      },
      ...selectedAssociatedFaculty.map((f: any, idx: number) => ({
        author_name: f.full_name,
        author_order: idx + 2,
        faculty_id: f.id || null,
        is_corresponding: false,
      })),
      ...externalAuthors.map((ext: string, idx: number) => ({
        author_name: ext,
        author_order: idx + 2 + selectedAssociatedFaculty.length,
        faculty_id: null,
        is_corresponding: false,
      })),
    ];

    const pubRecord: any = {
      id: modalMode === "edit" && editingId ? editingId : `pub-${Date.now()}`,
      title: title.trim(),
      publication_type: pubType,
      type: pubType,
      journal_or_conference_name: venue.trim(),
      venue_name: venue.trim(),
      publisher: venue.trim(),
      year: Number(year) || new Date().getFullYear(),
      month: month,
      publication_month: month,
      academic_session: academicSession,
      indexing: effectiveIndexing,
      custom_indexing: customIndexing.trim() || undefined,
      journal_quartile: pubType === "Journal" && quartile !== "N/A" ? quartile : undefined,
      isbn: (pubType === "Book" || pubType === "Book Chapter") && isbn.trim() ? isbn.trim() : undefined,
      doi: doi.trim() || undefined,
      author_text: authors.trim() || faculty.full_name,
      volume: volume.trim() || undefined,
      issue: issue.trim() || undefined,
      pages: pages.trim() || undefined,
      page_range: pages.trim() || undefined,
      associated_faculty: selectedAssociatedFaculty,
      internal_authors: selectedAssociatedFaculty,
      external_authors: externalAuthors,
      faculty_ids: [
        faculty.id,
        ...selectedAssociatedFaculty.map((f: any) => f.id || f.employee_code),
      ],
      faculty_legacy_ids: [faculty.legacy_id],
      updated_at: new Date().toISOString(),
    };

    // 1. Client-side and local storage update with cross-faculty sync
    saveFacultyRecord(faculty, "publications", pubRecord, false);
    loadPublications(faculty);
    setShowModal(false);

    // 2. Dispatch to Go Backend API to persist in PostgreSQL M:N tables
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
    const typeMapping: Record<string, string> = {
      "Journal": "JOURNAL",
      "Conference": "CONFERENCE",
      "Book": "BOOK",
      "Book Chapter": "BOOK_CHAPTER",
    };

    fetch(`${apiUrl}/publications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        title: title.trim(),
        publication_type: typeMapping[pubType] || "JOURNAL",
        doi: doi.trim() || undefined,
        isbn: isbn.trim() || undefined,
        venue: venue.trim(),
        publisher: venue.trim(),
        volume: volume.trim() || undefined,
        issue: issue.trim() || undefined,
        pages: pages.trim() || undefined,
        year: Number(year) || new Date().getFullYear(),
        indexing: effectiveIndexing,
        quartile: pubType === "Journal" && quartile !== "N/A" ? quartile : undefined,
        raw_authors: authors.trim() || faculty.full_name,
        department_ids: [faculty.department_id || "22222222-2222-2222-2222-222222222222"],
        authors: structuredAuthors,
      }),
    })
      .then((res) => {
        if (res.ok) {
          console.log("Publication persisted to PostgreSQL backend!");
        }
      })
      .catch((err) => {
        console.warn("Backend API sync offline or skipped:", err);
      });

    toast.success(
      modalMode === "edit"
        ? "Publication updated successfully and synchronized!"
        : "New publication recorded and synchronized with internal colleagues & external co-authors!"
    );
  };

  const handleDelete = (pub: any) => {
    if (!window.confirm(`Are you sure you want to delete "${pub.title}"?`)) return;
    saveFacultyRecord(faculty, "publications", pub, true);
    loadPublications(faculty);
    toast.success("Publication removed from portfolio and storage updated");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      {/* Header Banner */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-[#85261e]" />
              Publications &amp; Scholarly Output
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2.5 py-0.5 rounded-full">
              {publications.length} Papers Linked
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Manage your peer-reviewed journal papers, conference proceedings, and book chapters for{" "}
            <strong>{faculty.full_name}</strong> ({faculty.employee_code || "Faculty"}).
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] text-white px-4 py-2.5 text-xs font-bold shadow-xs hover:shadow-md transition cursor-pointer"
        >
          <Plus className="h-4 w-4 text-amber-300" />
          <span>Add Publication</span>
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search papers by title, journal venue, author or DOI..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#eedfd8] bg-white text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e] shadow-2xs"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-[#eedfd8] bg-white text-xs font-semibold text-[#33110e] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e] shadow-2xs cursor-pointer"
        >
          <option value="ALL">All Categories</option>
          <option value="Journal">Journals</option>
          <option value="Conference">Conferences</option>
          <option value="Book Chapter">Book Chapters</option>
          <option value="Book">Authored Books</option>
        </select>
      </div>

      {/* Publications List */}
      <div className="space-y-3">
        {filteredPublications.map((pub: any) => (
          <div
            key={pub.id}
            className="rounded-2xl border border-[#eedfd8] bg-white p-5 shadow-2xs hover:shadow-md transition space-y-3 group"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#33110e] text-white">
                {pub.publication_type || pub.type || "Publication"}
              </span>

              {pub.journal_quartile && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                  {pub.journal_quartile}
                </span>
              )}

              {pub.indexing && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#fdf5f2] text-[#85261e] border border-[#eedfd8]">
                  {pub.indexing}
                </span>
              )}

              {pub.academic_session && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-neutral-100 text-neutral-600">
                  Session: {pub.academic_session}
                </span>
              )}

              <span className="text-xs font-bold text-neutral-400 ml-auto font-mono">
                {pub.month ? `${pub.month} ` : ""}{pub.year}
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-[#1c110c] leading-snug">
              {pub.title}
            </h3>

            <p className="text-xs text-neutral-600">
              <span className="font-semibold text-neutral-800">Authors:</span>{" "}
              {pub.author_text || faculty.full_name}
            </p>

            <div className="text-xs text-neutral-500 space-y-1">
              <p className="italic text-[#85261e] font-medium">
                {pub.journal_or_conference_name || pub.venue_name || pub.publisher}
                {pub.volume && `, Vol. ${pub.volume}`}
                {pub.issue && `, No. ${pub.issue}`}
                {(pub.page_range || pub.pages) && `, pp. ${pub.page_range || pub.pages}`}
              </p>

              {pub.isbn && (
                <p className="text-[11px] font-mono text-neutral-600">
                  ISBN: {pub.isbn}
                </p>
              )}

              {pub.doi && (
                <div className="pt-1">
                  <a
                    href={pub.doi.startsWith("http") ? pub.doi : `https://doi.org/${pub.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[11px] text-[#85261e] hover:underline"
                  >
                    <span>DOI: {pub.doi}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Actions Strip */}
            <div className="flex items-center justify-between pt-3 border-t border-[#eedfd8]/60 text-xs">
              <button
                type="button"
                onClick={() => handleCopyCitation(pub)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#eedfd8] bg-[#fff9f6] text-[#33110e] hover:bg-[#33110e] hover:text-white transition font-medium cursor-pointer shadow-2xs"
              >
                {copiedId === pub.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#85261e]" />
                    <span>Copy Citation</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => openEditModal(pub)}
                  className="p-1.5 text-neutral-500 hover:text-[#85261e] transition rounded-lg hover:bg-[#fdf5f2] cursor-pointer"
                  title="Edit Publication"
                >
                  <Edit className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(pub)}
                  className="p-1.5 text-neutral-400 hover:text-red-700 transition rounded-lg hover:bg-red-50 cursor-pointer"
                  title="Remove Publication"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredPublications.length === 0 && (
          <div className="text-center py-16 text-neutral-500 text-xs bg-white rounded-2xl border border-[#eedfd8]">
            No publications found matching your search.
          </div>
        )}
      </div>

      {/* Add / Edit Publication Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl border border-[#eedfd8] bg-white p-6 sm:p-8 shadow-2xl space-y-5 my-8 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#eedfd8]/60 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#85261e]">
                  {modalMode === "edit" ? "Modify Existing Record" : "New Scholarly Entry"}
                </span>
                <h2 className="text-xl font-extrabold text-[#33110e]">
                  {modalMode === "edit" ? "Edit Publication Details" : "Add Research Publication"}
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
                  Paper / Publication Title *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Deep Residual Learning for Image Recognition"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-3 text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              {/* Type, Indexing, Quartile */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Publication Type *
                  </label>
                  <select
                    value={pubType}
                    onChange={(e) => setPubType(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs font-semibold text-[#33110e] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  >
                    {PUBLICATION_TYPES.map((pt) => (
                      <option key={pt.value} value={pt.value}>
                        {pt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Indexing Authority
                  </label>
                  <select
                    value={indexing}
                    onChange={(e) => setIndexing(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs font-semibold text-[#33110e] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  >
                    {INDEXING_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {pubType === "Journal" ? (
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                      Journal Quartile
                    </label>
                    <select
                      value={quartile}
                      onChange={(e) => setQuartile(e.target.value)}
                      className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs font-semibold text-[#33110e] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                    >
                      {JOURNAL_QUARTILES.map((q) => (
                        <option key={q} value={q}>
                          {q}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                      ISBN (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 978-3-16-148410-0"
                      value={isbn}
                      onChange={(e) => setIsbn(e.target.value)}
                      className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                    />
                  </div>
                )}
              </div>

              {/* Custom Indexing Input (conditional) */}
              {indexing === "Other" && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Specify Custom Indexing *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DBLP, ACM Digital Library, Google Scholar"
                    value={customIndexing}
                    onChange={(e) => setCustomIndexing(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>
              )}

              {/* Venue / Journal Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                  {pubType === "Journal"
                    ? "Journal Name *"
                    : pubType === "Conference"
                    ? "Conference Title / Proceedings *"
                    : "Publisher / Book Title *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    pubType === "Journal"
                      ? "e.g. IEEE Transactions on Neural Networks and Learning Systems"
                      : pubType === "Conference"
                      ? "e.g. 2024 IEEE International Conference on Computer Communications (INFOCOM)"
                      : "e.g. Springer Nature / CRC Press"
                  }
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              {/* Authors */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                  Author(s) in Exact Publication Order *
                </label>
                <input
                  type="text"
                  required
                  placeholder={`e.g. ${faculty.full_name}, Alice Smith, Bob Johnson`}
                  value={authors}
                  onChange={(e) => setAuthors(e.target.value)}
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
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
                    Publication Year *
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

              {/* Volume, Issue, Pages, DOI */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Volume
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 42"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Issue No.
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 4"
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Page Range
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 102-115"
                    value={pages}
                    onChange={(e) => setPages(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    DOI / Document Link
                  </label>
                  <input
                    type="text"
                    placeholder="10.1109/..."
                    value={doi}
                    onChange={(e) => setDoi(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>
              </div>

              {/* Dual Co-Authors Selection (NIT Hamirpur College Dropdown vs External Text Box) */}
              <div className="pt-2">
                <CoAuthorsInput
                  currentFaculty={faculty}
                  internalAuthors={selectedAssociatedFaculty}
                  externalAuthors={externalAuthors}
                  onChange={({ internalAuthors, externalAuthors: extAuthors, combinedAuthorText }) => {
                    setSelectedAssociatedFaculty(internalAuthors);
                    setExternalAuthors(extAuthors);
                    setAuthors(combinedAuthorText);
                  }}
                  label="Co-Authors & Academic Collaborators"
                  helperText="Choose colleagues from NIT Hamirpur (Option 1) to auto-sync to their profile, and enter external authors outside the college (Option 2)."
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
                  {modalMode === "edit" ? "Save Changes" : "Record Publication"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
