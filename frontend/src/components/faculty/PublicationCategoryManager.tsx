"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Plus,
  Trash2,
  Edit,
  BookOpen,
  Presentation,
  Book,
  Bookmark,
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
import CoAuthorsInput from "@/components/faculty/CoAuthorsInput";
import {
  ACADEMIC_SESSIONS,
  MONTHS,
  JOURNAL_QUARTILES,
  INDEXING_OPTIONS,
  PUBLICATION_TYPES,
} from "@/lib/faculty-constants";
import { useFacultySidebarCounts } from "@/hooks/useFacultySidebarCounts";

export type PublicationCategory = "Journal" | "Conference" | "Book" | "Book Chapter" | "ALL";

interface Props {
  category: PublicationCategory;
}

export default function PublicationCategoryManager({ category }: Props) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [faculty, setFaculty] = useState<any>(MOCK_FACULTY[0]);
  const [allPublications, setAllPublications] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [quartileFilter, setQuartileFilter] = useState<string>("ALL");
  const [sessionFilter, setSessionFilter] = useState<string>("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const counts = useFacultySidebarCounts(faculty);

  // Modal State (Add / Edit)
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [pubType, setPubType] = useState(category === "ALL" ? "Journal" : category);
  const [venue, setVenue] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [editors, setEditors] = useState("");
  const [authors, setAuthors] = useState("");
  const [academicSession, setAcademicSession] = useState(ACADEMIC_SESSIONS[1] || "2024-2025");
  const [month, setMonth] = useState(MONTHS[0]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [indexing, setIndexing] = useState("Scopus");
  const [customIndexing, setCustomIndexing] = useState("");
  const [quartile, setQuartile] = useState("Not Applicable");
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
    const facId = baseFaculty?.id;

    const userPapers = MOCK_PUBLICATIONS.filter((p: any) => {
      if (facId && p.faculty_ids?.includes(facId)) return true;
      if (legacyId && p.faculty_legacy_ids?.includes(legacyId)) return true;
      return false;
    });

    const fallback =
      Array.isArray(baseFaculty?.publications) && baseFaculty.publications.length > 0
        ? baseFaculty.publications
        : userPapers;

    const stored = getStoredData(baseFaculty, "publications", fallback);
    setAllPublications(stored);
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
        if (match) activeFaculty = match;
      } catch {}
    }
    setFaculty(activeFaculty);
    loadPublications(activeFaculty);
  }, []);

  // Filter for this specific category
  const filteredPublications = useMemo(() => {
    let list = allPublications;

    if (category === "Journal") {
      list = list.filter(
        (p: any) =>
          p.publication_type?.toUpperCase() === "JOURNAL" ||
          p.type?.toUpperCase() === "JOURNAL" ||
          p.research_type_id === 1 ||
          p.research_type_id === "1"
      );
    } else if (category === "Conference") {
      list = list.filter(
        (p: any) =>
          p.publication_type?.toUpperCase() === "CONFERENCE" ||
          p.type?.toUpperCase() === "CONFERENCE" ||
          p.research_type_id === 2 ||
          p.research_type_id === "2"
      );
    } else if (category === "Book") {
      list = list.filter(
        (p: any) =>
          p.publication_type?.toUpperCase() === "BOOK" ||
          p.type?.toUpperCase() === "BOOK" ||
          p.research_type_id === 3 ||
          p.research_type_id === "3"
      );
    } else if (category === "Book Chapter") {
      list = list.filter(
        (p: any) =>
          p.publication_type?.toUpperCase() === "BOOK CHAPTER" ||
          p.publication_type?.toUpperCase() === "BOOK_CHAPTER" ||
          p.publication_type?.toUpperCase() === "BOOKCHAPTER" ||
          p.type?.toUpperCase() === "BOOK CHAPTER" ||
          p.type?.toUpperCase() === "BOOK_CHAPTER" ||
          p.type?.toUpperCase() === "BOOKCHAPTER" ||
          p.research_type_id === 4 ||
          p.research_type_id === "4"
      );
    } else if (typeFilter !== "ALL") {
      list = list.filter((p: any) => (p.publication_type || p.type) === typeFilter);
    }

    if (quartileFilter !== "ALL") {
      list = list.filter((p: any) => (p.journal_quartile || p.quartile) === quartileFilter);
    }

    if (sessionFilter !== "ALL") {
      list = list.filter((p: any) => p.academic_session === sessionFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p: any) =>
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.journal_or_conference_name && p.journal_or_conference_name.toLowerCase().includes(q)) ||
          (p.venue_name && p.venue_name.toLowerCase().includes(q)) ||
          (p.author_text && p.author_text.toLowerCase().includes(q)) ||
          (p.doi && p.doi.toLowerCase().includes(q)) ||
          (p.isbn && p.isbn.toLowerCase().includes(q))
      );
    }

    return list;
  }, [allPublications, category, typeFilter, quartileFilter, sessionFilter, search]);

  const copyCitation = (pub: any) => {
    const authorsStr = pub.author_text || faculty.full_name;
    const yearStr = pub.year ? `(${pub.year}). ` : "";
    const titleStr = pub.title ? `"${pub.title}." ` : "";
    const venueStr = pub.journal_or_conference_name || pub.venue_name || pub.publisher || "";
    const volStr = pub.volume ? `, vol. ${pub.volume}` : "";
    const issueStr = pub.issue ? `, no. ${pub.issue}` : "";
    const pageStr = pub.pages || pub.page_range ? `, pp. ${pub.pages || pub.page_range}` : "";
    const doiStr = pub.doi ? ` https://doi.org/${pub.doi.replace(/^https?:\/\/doi\.org\//, "")}` : "";

    const citation = `${authorsStr} ${yearStr}${titleStr}${venueStr}${volStr}${issueStr}${pageStr}.${doiStr}`.trim();
    navigator.clipboard.writeText(citation);
    setCopiedId(pub.id);
    toast.success("Citation copied in standard format!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  const openAddModal = () => {
    setModalMode("add");
    setEditingId(null);
    setTitle("");
    setPubType(category === "ALL" ? "Journal" : category);
    setVenue("");
    setBookTitle("");
    setEditors("");
    setAuthors(faculty.full_name || "");
    setAcademicSession(ACADEMIC_SESSIONS[1] || "2024-2025");
    setMonth(MONTHS[0]);
    setYear(new Date().getFullYear());
    setIndexing("Scopus");
    setCustomIndexing("");
    setQuartile("Not Applicable");
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
    setPubType(pub.publication_type || pub.type || (category === "ALL" ? "Journal" : category));
    setVenue(pub.journal_or_conference_name || pub.venue_name || pub.publisher || "");
    setBookTitle(pub.book_title || "");
    setEditors(pub.editors || "");
    setAuthors(pub.author_text || "");
    setAcademicSession(pub.academic_session || ACADEMIC_SESSIONS[1]);
    setMonth(pub.publication_month || pub.month || MONTHS[0]);
    setYear(Number(pub.year) || new Date().getFullYear());
    setIndexing(pub.indexing || "Scopus");
    setCustomIndexing(pub.custom_indexing || "");
    const qVal = String(pub.journal_quartile || pub.quartile || "").toUpperCase().trim();
    setQuartile(["Q1", "Q2", "Q3", "Q4"].includes(qVal) ? qVal : "Not Applicable");
    setIsbn(pub.isbn || "");
    setVolume(pub.volume || "");
    setIssue(pub.issue || "");
    setPages(pub.pages || pub.page_range || "");
    setDoi(pub.doi || "");

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
    if (!title.trim()) {
      toast.error("Please provide Publication Title");
      return;
    }

    const effectiveType = category !== "ALL" ? category : pubType;
    const effectiveIndexing = indexing === "Other" && customIndexing.trim() ? customIndexing.trim() : indexing;

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

    const rtype =
      effectiveType === "Journal"
        ? 1
        : effectiveType === "Conference"
        ? 2
        : effectiveType === "Book"
        ? 3
        : 4;

    const pubRecord: any = {
      id: modalMode === "edit" && editingId ? editingId : `pub-${Date.now()}`,
      title: title.trim(),
      publication_type: effectiveType,
      type: effectiveType,
      research_type_id: rtype,
      journal_or_conference_name: venue.trim(),
      venue_name: venue.trim(),
      publisher: effectiveType === "Book" || effectiveType === "Book Chapter" ? venue.trim() : undefined,
      book_title: effectiveType === "Book Chapter" ? bookTitle.trim() : undefined,
      editors: effectiveType === "Book Chapter" ? editors.trim() : undefined,
      year: Number(year) || new Date().getFullYear(),
      month: month,
      publication_month: month,
      academic_session: academicSession,
      indexing: effectiveIndexing,
      custom_indexing: customIndexing.trim() || undefined,
      journal_quartile: effectiveType === "Journal" && ["Q1", "Q2", "Q3", "Q4"].includes(quartile.toUpperCase().trim()) ? quartile.toUpperCase().trim() : undefined,
      quartile: effectiveType === "Journal" && ["Q1", "Q2", "Q3", "Q4"].includes(quartile.toUpperCase().trim()) ? quartile.toUpperCase().trim() : undefined,
      isbn: (effectiveType === "Book" || effectiveType === "Book Chapter") && isbn.trim() ? isbn.trim() : undefined,
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

    saveFacultyRecord(faculty, "publications", pubRecord, false);
    loadPublications(faculty);
    setShowModal(false);

    // Persist to Go Backend API if available
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
        publication_type: typeMapping[effectiveType] || "JOURNAL",
        doi: doi.trim() || undefined,
        isbn: isbn.trim() || undefined,
        venue: venue.trim(),
        publisher: venue.trim(),
        volume: volume.trim() || undefined,
        issue: issue.trim() || undefined,
        pages: pages.trim() || undefined,
        year: Number(year) || new Date().getFullYear(),
        indexing: effectiveIndexing,
        quartile: effectiveType === "Journal" && ["Q1", "Q2", "Q3", "Q4"].includes(quartile.toUpperCase().trim()) ? quartile.toUpperCase().trim() : undefined,
        raw_authors: authors.trim() || faculty.full_name,
        department_ids: [faculty.department_id || "22222222-2222-2222-2222-222222222222"],
        authors: structuredAuthors,
      }),
    }).catch(() => {});

    toast.success(
      modalMode === "edit"
        ? `${effectiveType} record updated and synchronized!`
        : `New ${effectiveType} record saved and synchronized with co-authors!`
    );
  };

  const handleDelete = (pub: any) => {
    if (!window.confirm(`Are you sure you want to delete "${pub.title}"?`)) return;
    saveFacultyRecord(faculty, "publications", pub, true);
    loadPublications(faculty);
    toast.success("Record removed from portfolio and storage updated");
  };

  const getCategoryHeader = () => {
    switch (category) {
      case "Journal":
        return {
          title: "Journal Articles",
          icon: BookOpen,
          description: "Peer-reviewed SCI, Scopus, and refereed journal papers published in national and international journals.",
          count: counts.journals,
          addBtnLabel: "+ Add Journal Article",
        };
      case "Conference":
        return {
          title: "Conference Proceedings",
          icon: Presentation,
          description: "Conference papers published in proceedings of national and international conferences, symposiums, and workshops.",
          count: counts.conferences,
          addBtnLabel: "+ Add Conference Paper",
        };
      case "Book":
        return {
          title: "Books Authored & Edited",
          icon: Book,
          description: "Academic textbooks, reference monographs, and scholarly books authored, co-authored, or edited.",
          count: counts.books,
          addBtnLabel: "+ Add Book Record",
        };
      case "Book Chapter":
        return {
          title: "Book Chapters Contributed",
          icon: Bookmark,
          description: "Chapters, sections, and scholarly contributions in edited books, volumes, and handbooks.",
          count: counts.bookChapters,
          addBtnLabel: "+ Add Book Chapter",
        };
      default:
        return {
          title: "All Publications & Scholarly Output",
          icon: Layers,
          description: "Complete academic portfolio of journals, conferences, books, and book chapters.",
          count: counts.allPublications,
          addBtnLabel: "+ Add Publication",
        };
    }
  };

  const header = getCategoryHeader();
  const HeaderIcon = header.icon;

  const publicationTabs = [
    { label: "All Output", href: "/faculty/publications", count: counts.allPublications, icon: Layers },
    { label: "Journals", href: "/faculty/journals", count: counts.journals, icon: BookOpen },
    { label: "Conferences", href: "/faculty/conferences", count: counts.conferences, icon: Presentation },
    { label: "Books", href: "/faculty/books", count: counts.books, icon: Book },
    { label: "Book Chapters", href: "/faculty/book-chapters", count: counts.bookChapters, icon: Bookmark },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      {/* Category Tabs Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#eedfd8]">
        {publicationTabs.map((tab) => {
          const isActive = pathname === tab.href;
          const TabIcon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                isActive
                  ? "bg-[#33110e] text-white shadow-xs"
                  : "bg-white text-neutral-600 hover:text-[#33110e] hover:bg-[#fff9f6] border border-[#eedfd8]"
              }`}
            >
              <TabIcon className={`w-3.5 h-3.5 ${isActive ? "text-amber-300" : "text-[#85261e]"}`} />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  isActive ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {tab.count}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Header Banner */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <HeaderIcon className="w-6 h-6 text-[#85261e]" />
              {header.title}
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2.5 py-0.5 rounded-full">
              {header.count} {header.count === 1 ? "Record" : "Records"}
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1 max-w-2xl">
            {header.description}
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] text-white px-4 py-2.5 text-xs font-bold shadow-xs hover:shadow-md transition cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          {header.addBtnLabel}
        </button>
      </div>

      {/* Filters & Search Strip */}
      <div className="bg-white rounded-2xl border border-[#eedfd8] p-4 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${category === "ALL" ? "publications" : category.toLowerCase() + "s"} by title, authors, DOI...`}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#eedfd8] bg-[#fff9f6]/40 focus:outline-none focus:border-[#85261e] focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {category === "Journal" && (
            <select
              value={quartileFilter}
              onChange={(e) => setQuartileFilter(e.target.value)}
              className="text-xs border border-[#eedfd8] rounded-xl px-2.5 py-2 bg-white text-neutral-700 focus:outline-none focus:border-[#85261e]"
            >
              <option value="ALL">All Quartiles</option>
              <option value="Q1">Q1 Quartile</option>
              <option value="Q2">Q2 Quartile</option>
              <option value="Q3">Q3 Quartile</option>
              <option value="Q4">Q4 Quartile</option>
            </select>
          )}

          <select
            value={sessionFilter}
            onChange={(e) => setSessionFilter(e.target.value)}
            className="text-xs border border-[#eedfd8] rounded-xl px-2.5 py-2 bg-white text-neutral-700 focus:outline-none focus:border-[#85261e]"
          >
            <option value="ALL">All Academic Sessions</option>
            {ACADEMIC_SESSIONS.map((sess) => (
              <option key={sess} value={sess}>
                {sess}
              </option>
            ))}
          </select>

          {(search || quartileFilter !== "ALL" || sessionFilter !== "ALL") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setQuartileFilter("ALL");
                setSessionFilter("ALL");
              }}
              className="p-2 text-neutral-500 hover:text-[#85261e] border border-[#eedfd8] rounded-xl bg-neutral-50 hover:bg-[#fff9f6] transition cursor-pointer"
              title="Reset Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Publications Listing */}
      <div className="space-y-3">
        {filteredPublications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-[#eedfd8] p-12 text-center">
            <HeaderIcon className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-neutral-700">No {category === "ALL" ? "publications" : category.toLowerCase() + " records"} found</p>
            <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
              {search || sessionFilter !== "ALL"
                ? "No matching records found with current filters. Try resetting search."
                : `You haven't added any ${category === "ALL" ? "publications" : category.toLowerCase() + " records"} yet. Click the button above to add one.`}
            </p>
          </div>
        ) : (
          filteredPublications.map((pub, index) => {
            const authorsText = pub.author_text || pub.raw_authors || faculty.full_name;
            const qBadge = pub.journal_quartile || pub.quartile;

            return (
              <div
                key={pub.id || index}
                className="bg-white rounded-2xl border border-[#eedfd8] p-4 sm:p-5 shadow-xs hover:border-[#85261e]/40 transition group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-[#33110e] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {pub.publication_type || pub.type || category}
                      </span>
                      {qBadge && ["Q1", "Q2", "Q3", "Q4"].includes(qBadge.toUpperCase().trim()) && (
                        <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {qBadge.toUpperCase().trim()}
                        </span>
                      )}
                      {pub.indexing && (
                        <span className="bg-neutral-100 text-neutral-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-neutral-200">
                          {pub.indexing}
                        </span>
                      )}
                      {pub.year && (
                        <span className="text-neutral-500 text-xs font-mono font-medium">
                          {pub.year}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-[#1c110c] leading-snug">
                      {pub.title}
                    </h3>

                    <p className="text-xs text-neutral-600">
                      <strong>Authors:</strong> {authorsText}
                    </p>

                    <div className="text-xs text-neutral-700 space-y-0.5 pt-1">
                      {category === "Book Chapter" && pub.book_title && (
                        <p>
                          <strong>Book:</strong> {pub.book_title}
                          {pub.editors && <span> (Eds. {pub.editors})</span>}
                        </p>
                      )}
                      <p className="italic text-neutral-800">
                        {pub.journal_or_conference_name || pub.venue_name || pub.publisher}
                        {pub.volume && `, Vol. ${pub.volume}`}
                        {pub.issue && `, No. ${pub.issue}`}
                        {(pub.pages || pub.page_range) && `, pp. ${pub.pages || pub.page_range}`}
                      </p>
                      {pub.isbn && (
                        <p className="font-mono text-[11px] text-neutral-500">
                          ISBN: {pub.isbn}
                        </p>
                      )}
                      {pub.doi && (
                        <p className="text-[11px] text-blue-700 flex items-center gap-1 font-mono">
                          <ExternalLink className="w-3 h-3 shrink-0" />
                          <a
                            href={`https://doi.org/${pub.doi.replace(/^https?:\/\/doi\.org\//, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {pub.doi}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5 self-end sm:self-start shrink-0">
                    <button
                      type="button"
                      onClick={() => copyCitation(pub)}
                      className="p-1.5 rounded-lg border border-[#eedfd8] bg-neutral-50 text-neutral-600 hover:text-[#85261e] hover:bg-white transition cursor-pointer"
                      title="Copy Citation"
                    >
                      {copiedId === pub.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(pub)}
                      className="p-1.5 rounded-lg border border-[#eedfd8] bg-neutral-50 text-neutral-600 hover:text-[#85261e] hover:bg-white transition cursor-pointer"
                      title="Edit Record"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(pub)}
                      className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#eedfd8] max-w-2xl w-full p-6 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#eedfd8] pb-3">
              <h2 className="text-lg font-black text-[#33110e] uppercase tracking-tight flex items-center gap-2">
                <HeaderIcon className="w-5 h-5 text-[#85261e]" />
                {modalMode === "add" ? `Record New ${category !== "ALL" ? category : "Publication"}` : `Edit ${category !== "ALL" ? category : "Publication"}`}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Publication Category Selector (only in ALL view) */}
              {category === "ALL" && (
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    Publication Category *
                  </label>
                  <select
                    value={pubType}
                    onChange={(e) => setPubType(e.target.value)}
                    className="w-full text-xs border border-[#eedfd8] rounded-xl px-3 py-2 bg-white"
                  >
                    <option value="Journal">Journal Article</option>
                    <option value="Conference">Conference Proceeding</option>
                    <option value="Book">Book Authored / Edited</option>
                    <option value="Book Chapter">Book Chapter Contributed</option>
                  </select>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  {(category === "Book" || pubType === "Book")
                    ? "Book Title *"
                    : (category === "Book Chapter" || pubType === "Book Chapter")
                    ? "Chapter Title *"
                    : "Paper Title *"}
                </label>
                <textarea
                  rows={2}
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter full title..."
                  className="w-full text-xs border border-[#eedfd8] rounded-xl p-3 bg-white focus:outline-none focus:border-[#85261e]"
                />
              </div>

              {/* If Book Chapter, Book Title & Editors */}
              {(category === "Book Chapter" || pubType === "Book Chapter") && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                      Main Book Title *
                    </label>
                    <input
                      type="text"
                      value={bookTitle}
                      onChange={(e) => setBookTitle(e.target.value)}
                      placeholder="e.g. Handbook of Cloud Computing"
                      className="w-full text-xs border border-[#eedfd8] rounded-xl px-3 py-2 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                      Book Editors
                    </label>
                    <input
                      type="text"
                      value={editors}
                      onChange={(e) => setEditors(e.target.value)}
                      placeholder="e.g. Dr. A. Smith, Dr. B. Roy"
                      className="w-full text-xs border border-[#eedfd8] rounded-xl px-3 py-2 bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Venue / Journal Name / Conference / Publisher */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  {(category === "Journal" || pubType === "Journal")
                    ? "Journal Name *"
                    : (category === "Conference" || pubType === "Conference")
                    ? "Conference Name & Venue *"
                    : "Publisher Name *"}
                </label>
                <input
                  type="text"
                  required
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder={
                    (category === "Journal" || pubType === "Journal")
                      ? "e.g. IEEE Transactions on Knowledge and Data Engineering"
                      : (category === "Conference" || pubType === "Conference")
                      ? "e.g. IEEE International Conference on Computer Communications (INFOCOM)"
                      : "e.g. Springer Nature / CRC Press"
                  }
                  className="w-full text-xs border border-[#eedfd8] rounded-xl px-3 py-2 bg-white"
                />
              </div>

              {/* Journal Quartile & Indexing (if Journal) */}
              {(category === "Journal" || pubType === "Journal") && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                      Journal Quartile (JCR / Scimago)
                    </label>
                    <select
                      value={quartile}
                      onChange={(e) => setQuartile(e.target.value)}
                      className="w-full text-xs border border-[#eedfd8] rounded-xl px-3 py-2 bg-white"
                    >
                      <option value="Not Applicable">Not Applicable / None</option>
                      <option value="Q1">Q1 (Top 25%)</option>
                      <option value="Q2">Q2 (25% - 50%)</option>
                      <option value="Q3">Q3 (50% - 75%)</option>
                      <option value="Q4">Q4 (75% - 100%)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                      Indexing / Abstracting
                    </label>
                    <select
                      value={indexing}
                      onChange={(e) => setIndexing(e.target.value)}
                      className="w-full text-xs border border-[#eedfd8] rounded-xl px-3 py-2 bg-white"
                    >
                      {INDEXING_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Volume, Issue, Pages, ISBN/DOI */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    Volume
                  </label>
                  <input
                    type="text"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    placeholder="e.g. 14"
                    className="w-full text-xs border border-[#eedfd8] rounded-xl px-3 py-2 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    Issue
                  </label>
                  <input
                    type="text"
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    placeholder="e.g. 3"
                    className="w-full text-xs border border-[#eedfd8] rounded-xl px-3 py-2 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    Page Range
                  </label>
                  <input
                    type="text"
                    value={pages}
                    onChange={(e) => setPages(e.target.value)}
                    placeholder="e.g. 120-135"
                    className="w-full text-xs border border-[#eedfd8] rounded-xl px-3 py-2 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    Year *
                  </label>
                  <input
                    type="number"
                    required
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full text-xs border border-[#eedfd8] rounded-xl px-3 py-2 bg-white"
                  />
                </div>
              </div>

              {/* DOI / ISBN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    DOI Identifier / Link
                  </label>
                  <input
                    type="text"
                    value={doi}
                    onChange={(e) => setDoi(e.target.value)}
                    placeholder="10.1109/..."
                    className="w-full text-xs border border-[#eedfd8] rounded-xl px-3 py-2 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    ISBN / ISSN Number
                  </label>
                  <input
                    type="text"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    placeholder="978-..."
                    className="w-full text-xs border border-[#eedfd8] rounded-xl px-3 py-2 bg-white font-mono"
                  />
                </div>
              </div>

              {/* Authors List & Associated Faculty */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  Full Author Citation String
                </label>
                <input
                  type="text"
                  value={authors}
                  onChange={(e) => setAuthors(e.target.value)}
                  placeholder="e.g. John Doe, Jane Smith"
                  className="w-full text-xs border border-[#eedfd8] rounded-xl px-3 py-2 bg-white"
                />
              </div>

              {/* Internal & External Co-Authors Picker */}
              <div className="border border-[#eedfd8] rounded-2xl p-3 bg-[#fff9f6]/40">
                <CoAuthorsInput
                  currentUser={faculty}
                  selectedAssociatedFaculty={selectedAssociatedFaculty}
                  setSelectedAssociatedFaculty={setSelectedAssociatedFaculty}
                  externalAuthors={externalAuthors}
                  setExternalAuthors={setExternalAuthors}
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 border-t border-[#eedfd8] pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#33110e] hover:bg-[#85261e] rounded-xl shadow-xs transition"
                >
                  {modalMode === "add" ? "Save & Synchronize" : "Update Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
