"use client";

import { use, useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  Award,
  FileText,
  Lightbulb,
  Globe,
  ExternalLink,
  ArrowLeft,
  Search,
  Copy,
  Check,
  Calendar,
  Building2,
  Briefcase,
  Mic,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Filter,
  RotateCcw,
  UserCheck,
  Book,
  Bookmark,
  Presentation,
  Trophy,
  Users,
  Compass,
  LogIn,
  MapPin,
  Sparkles,
  Plus,
  Edit,
  Trash2,
  X,
  Info,
  CheckCircle2,
  AlertTriangle,
  Eye,
  BookOpenCheck,
  BarChart2,
  TrendingUp,
  Download,
  ShieldCheck,
} from "lucide-react";
import {
  BarChart as RechartsBarChart,
  Bar as RechartsBar,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  CartesianGrid as RechartsCartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer as RechartsResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie as RechartsPie,
  Cell as RechartsCell,
} from "recharts";
import { toast } from "sonner";
import {
  MOCK_FACULTY,
  MOCK_PHD_SCHOLARS,
  MOCK_CONSULTANCIES,
  MOCK_EVENTS,
  MOCK_COURSES_TAUGHT,
} from "@/lib/mock-data";
import { CourseTaught } from "@/lib/types";
import {
  getStoredData,
  setStoredData,
  getStoredObject,
  setStoredObject,
  syncMultiFacultyRecord,
  isMatchingRecord,
} from "@/lib/faculty-storage";
import { useDepartment } from "@/context/department-context";

export type TabKey =
  | "facultyInfo"
  | "journal"
  | "conference"
  | "book"
  | "book_chapter"
  | "patents"
  | "projects"
  | "events"
  | "consultancies"
  | "experttalk"
  | "researchSupervision"
  | "administrativeexperience"
  | "honors"
  | "internationalAndNationalExposure"
  | "courses";

const PUBS_PER_PAGE = 10;

const MONTH_OPTIONS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const ACADEMIC_SESSIONS = [
  "2025-2026",
  "2024-2025",
  "2023-2024",
  "2022-2023",
  "2021-2022",
  "2020-2021",
  "2019-2020",
  "2018-2019",
  "2017-2018",
  "2016-2017",
  "2015-2016",
  "2014-2015",
  "2013-2014",
  "2012-2013",
  "2011-2012",
  "2010-2011",
];

const JOURNAL_QUARTILES = ["Q1", "Q2", "Q3", "Q4", "T"];
const EVENT_POSTS = ["Chairman", "Convenor", "Coordinator", "Organizing Secretary", "Other"];
const EVENT_TYPES = ["FDP / STC", "Conference", "Workshop", "Symposium", "Seminar", "STC", "E-STC", "GIAN"];
const EVENT_CATEGORIES = [
  { value: "organized", label: "Organized" },
  { value: "attended", label: "Attended" },
];


export default function FacultyPortfolioPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const router = useRouter();
  const { activeDepartment, departments, selectDepartmentBySlug } = useDepartment();
  const resolvedParams = use(params);
  const resolvedSearchParams = searchParams ? use(searchParams) : {};
  const queryDept = typeof resolvedSearchParams?.dept === "string" ? resolvedSearchParams.dept : undefined;
  const initialTab = typeof resolvedSearchParams?.tab === "string" ? (resolvedSearchParams.tab as TabKey) : "facultyInfo";

  const code = resolvedParams.slug.toUpperCase();

  const baseFaculty = MOCK_FACULTY.find(
    (f: any) =>
      f.employee_code?.toUpperCase() === code ||
      f.id?.toLowerCase() === resolvedParams.slug.toLowerCase() ||
      String(f.legacy_id) === resolvedParams.slug
  );

  const [faculty, setFaculty] = useState<any>(baseFaculty);
  const [allFacultyPubs, setAllFacultyPubs] = useState<any[]>(baseFaculty?.publications || []);
  const [allFacultyPatents, setAllFacultyPatents] = useState<any[]>(baseFaculty?.patents || []);
  const [allFacultyProjects, setAllFacultyProjects] = useState<any[]>(baseFaculty?.projects || []);
  const [allSupervisions, setAllSupervisions] = useState<any[]>(baseFaculty?.supervisions || []);
  const [allQualifications, setAllQualifications] = useState<any[]>(baseFaculty?.qualifications || []);
  const [allTeachingExp, setAllTeachingExp] = useState<any[]>(baseFaculty?.teaching_experiences || []);
  const [allAdminExp, setAllAdminExp] = useState<any[]>(baseFaculty?.administrative_experiences || []);
  const [allHonors, setAllHonors] = useState<any[]>(baseFaculty?.honors || []);
  const [allTalks, setAllTalks] = useState<any[]>(baseFaculty?.expert_talks || []);
  const [allExposures, setAllExposures] = useState<any[]>(baseFaculty?.exposures || []);
  const [allConsultancies, setAllConsultancies] = useState<any[]>([]);
  const [allEvents, setAllEvents] = useState<any[]>([]);

  // Load and synchronize stored data
  useEffect(() => {
    if (baseFaculty) {
      setFaculty(getStoredObject(baseFaculty, "profile", baseFaculty));
      setAllFacultyPubs(getStoredData(baseFaculty, "publications", baseFaculty.publications || []));
      setAllFacultyPatents(getStoredData(baseFaculty, "patents", baseFaculty.patents || []));
      setAllFacultyProjects(getStoredData(baseFaculty, "projects", baseFaculty.projects || []));
      setAllSupervisions(getStoredData(baseFaculty, "supervisions", baseFaculty.supervisions || []));
      setAllQualifications(getStoredData(baseFaculty, "qualifications", baseFaculty.qualifications || []));
      setAllTeachingExp(getStoredData(baseFaculty, "teaching_experiences", baseFaculty.teaching_experiences || []));
      setAllAdminExp(getStoredData(baseFaculty, "admin_experiences", baseFaculty.administrative_experiences || baseFaculty.admin_experiences || []));
      setAllHonors(getStoredData(baseFaculty, "honors", baseFaculty.honors || []));
      setAllTalks(getStoredData(baseFaculty, "expert_talks", baseFaculty.expert_talks || []));
      setAllExposures(getStoredData(baseFaculty, "exposures", baseFaculty.exposures || []));

      const lastName = (baseFaculty.full_name || "").split(" ").pop()?.toLowerCase() || "";
      
      // Match consultancies from seed and stored
      const defaultConsultancies = MOCK_CONSULTANCIES.filter((c: any) =>
        (c.faculty_ids && c.faculty_ids.includes(baseFaculty.id)) ||
        (lastName.length > 2 && c.author_text?.toLowerCase().includes(lastName))
      );
      setAllConsultancies(getStoredData(baseFaculty, "consultancies", defaultConsultancies));

      // Match events from seed and stored
      const defaultEvents = MOCK_EVENTS.filter((e: any) =>
        (e.faculty_ids && e.faculty_ids.includes(baseFaculty.id)) ||
        (lastName.length > 2 && (e.convenor?.toLowerCase().includes(lastName) || e.coordinator?.toLowerCase().includes(lastName)))
      );
      setAllEvents(getStoredData(baseFaculty, "events", defaultEvents));
    }
  }, [baseFaculty]);

  // Reactive synchronization across profiles & tabs
  useEffect(() => {
    const handleStorageUpdate = () => {
      if (baseFaculty) {
        setAllFacultyPubs(getStoredData(baseFaculty, "publications", baseFaculty.publications || []));
        setAllFacultyPatents(getStoredData(baseFaculty, "patents", baseFaculty.patents || []));
        setAllFacultyProjects(getStoredData(baseFaculty, "projects", baseFaculty.projects || []));
        setAllConsultancies(getStoredData(baseFaculty, "consultancies", []));
        setAllEvents(getStoredData(baseFaculty, "events", []));
      }
    };
    window.addEventListener("nith_faculty_storage_update", handleStorageUpdate);
    return () => window.removeEventListener("nith_faculty_storage_update", handleStorageUpdate);
  }, [baseFaculty]);

  // Authentication & permission check: only authenticated profile owner or admin can edit
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [canEdit, setCanEdit] = useState<boolean>(false);

  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const raw = localStorage.getItem("auth_user");
        if (raw) {
          const user = JSON.parse(raw);
          setCurrentUser(user);
          const roleUpper = (user?.role || "").toUpperCase();
          const isAdmin = roleUpper === "ADMIN" || roleUpper === "SUPERADMIN";
          const isOwner = Boolean(
            (user?.employee_code && faculty?.employee_code && user.employee_code.trim().toUpperCase() === faculty.employee_code.trim().toUpperCase()) ||
            (user?.email && faculty?.email && user.email.trim().toLowerCase() === faculty.email.trim().toLowerCase()) ||
            (user?.faculty_id && faculty?.id && String(user.faculty_id) === String(faculty.id)) ||
            (user?.id && faculty?.id && String(user.id) === String(faculty.id))
          );
          setCanEdit(isAdmin || isOwner);
        } else {
          setCurrentUser(null);
          setCanEdit(false);
        }
      } catch {
        setCurrentUser(null);
        setCanEdit(false);
      }
    };

    checkAuthStatus();
    window.addEventListener("storage", checkAuthStatus);
    window.addEventListener("nith_faculty_storage_update", checkAuthStatus);
    return () => {
      window.removeEventListener("storage", checkAuthStatus);
      window.removeEventListener("nith_faculty_storage_update", checkAuthStatus);
    };
  }, [faculty]);

  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [pubSearch, setPubSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedAbstractId, setExpandedAbstractId] = useState<string | null>(null);

// Dynamic Modals State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [selectedAssociatedFaculty, setSelectedAssociatedFaculty] = useState<any[]>([]);
  const [isCustomIndexing, setIsCustomIndexing] = useState(false);
  const [customIndexingText, setCustomIndexingText] = useState("");
  const [facultySearchQuery, setFacultySearchQuery] = useState("");

  // Details Modal State (tempcsebase PublicationsModal / ConsultanciesModal)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<any>(null);

  // Combined Research Supervisions
  const combinedSupervisions = useMemo(() => {
    if (allSupervisions && allSupervisions.length > 0) {
      return allSupervisions;
    }
    const nameLower = faculty?.full_name?.toLowerCase() || "";
    const lastName = nameLower.split(" ").pop() || "";
    if (lastName && lastName.length > 2) {
      const matched = MOCK_PHD_SCHOLARS.filter((s: any) =>
        s.supervisor?.toLowerCase().includes(lastName) ||
        s.co_supervisor?.toLowerCase().includes(lastName)
      ).map((s: any) => ({
        id: s.id,
        level: "Ph.D.",
        student_name: s.full_name || s.scholar_name,
        roll_number: s.roll_number || "",
        thesis_title: s.research_topic || s.title || "Doctoral Research",
        status: s.status === "passed" ? "Awarded" : "Ongoing",
        year: s.registration_year || s.batch_year || 2023,
        co_supervisor: s.co_supervisor || null,
      }));
      return matched;
    }
    return [];
  }, [allSupervisions, faculty]);

  // Categorized Publications
  const journals = useMemo(() => {
    return allFacultyPubs.filter(
      (p: any) =>
        p.publication_type?.toUpperCase() === "JOURNAL" ||
        p.type?.toUpperCase() === "JOURNAL" ||
        p.research_type_id === 1 ||
        p.research_type_id === "1"
    );
  }, [allFacultyPubs]);

  const conferences = useMemo(() => {
    return allFacultyPubs.filter(
      (p: any) =>
        p.publication_type?.toUpperCase() === "CONFERENCE" ||
        p.type?.toUpperCase() === "CONFERENCE" ||
        p.research_type_id === 2 ||
        p.research_type_id === "2"
    );
  }, [allFacultyPubs]);

  const books = useMemo(() => {
    return allFacultyPubs.filter(
      (p: any) =>
        p.publication_type?.toUpperCase() === "BOOK" ||
        p.type?.toUpperCase() === "BOOK" ||
        p.research_type_id === 3 ||
        p.research_type_id === "3"
    );
  }, [allFacultyPubs]);

  const bookChapters = useMemo(() => {
    return allFacultyPubs.filter(
      (p: any) =>
        p.publication_type?.toUpperCase() === "BOOK CHAPTER" ||
        p.publication_type?.toUpperCase() === "BOOK_CHAPTER" ||
        p.type?.toUpperCase() === "BOOK_CHAPTER" ||
        p.research_type_id === 4 ||
        p.research_type_id === "4"
    );
  }, [allFacultyPubs]);

  // Stats Counters
  const journalCount = journals.length;
  const conferenceCount = conferences.length;
  const bookCount = books.length;
  const bookChapterCount = bookChapters.length;
  const patentCount = allFacultyPatents.length;
  const projectCount = allFacultyProjects.length;
  const eventCount = allEvents.length;
  const consultancyCount = allConsultancies.length;
  const expertTalkCount = allTalks.length;
  const supervisionCount = combinedSupervisions.length;
  const adminExpCount = allAdminExp.length;
  const honorCount = allHonors.length;
  const exposureCount = allExposures.length;

  const phdSupervisedCount = useMemo(() => {
    const phdList = combinedSupervisions.filter(
      (s: any) =>
        s.level?.toLowerCase().includes("ph") ||
        s.programme?.toLowerCase().includes("ph") ||
        !s.level
    );
    return phdList.length > 0 ? phdList.length : combinedSupervisions.length;
  }, [combinedSupervisions]);

  // Analytics & Research Trends
  const facultyPubsTimeline = useMemo(() => {
    const map: Record<number, { year: number; journal: number; conference: number; book: number; total: number }> = {};
    allFacultyPubs.forEach((p: any) => {
      const yr = Number(p.year);
      if (!yr || isNaN(yr)) return;
      if (!map[yr]) {
        map[yr] = { year: yr, journal: 0, conference: 0, book: 0, total: 0 };
      }
      const t = (p.publication_type || p.type || "").toUpperCase();
      if (t === "CONFERENCE") map[yr].conference++;
      else if (t === "BOOK" || t === "BOOK_CHAPTER" || t === "BOOK CHAPTER") map[yr].book++;
      else map[yr].journal++;
      map[yr].total++;
    });
    const list = Object.values(map).sort((a, b) => a.year - b.year);
    return list.slice(-7);
  }, [allFacultyPubs]);

  const facultyResearchMix = useMemo(() => {
    return [
      { name: "Journals", value: journalCount, color: "#85261e" },
      { name: "Conferences", value: conferenceCount, color: "#c85a44" },
      { name: "Books / Chapters", value: bookCount + bookChapterCount, color: "#d97706" },
      { name: "Patents", value: patentCount, color: "#0d9488" },
    ].filter((item) => item.value > 0);
  }, [journalCount, conferenceCount, bookCount, bookChapterCount, patentCount]);

  const totalProjectGrantsAmount = useMemo(() => {
    return allFacultyProjects.reduce((sum: number, prj: any) => {
      return sum + (Number(prj.sanctioned_amount) || 0);
    }, 0);
  }, [allFacultyProjects]);

  const sciIndexedCount = useMemo(() => {
    return allFacultyPubs.filter(
      (p: any) => p.is_sci === true || (p.indexing || "").toLowerCase().includes("sci")
    ).length;
  }, [allFacultyPubs]);

  const scopusIndexedCount = useMemo(() => {
    return allFacultyPubs.filter(
      (p: any) => p.is_scopus === true || (p.indexing || "").toLowerCase().includes("scopus")
    ).length;
  }, [allFacultyPubs]);

  const facultyDeptSlug = faculty?.department_slug || "cse";
  const facultyDeptName = faculty?.department_name || "Computer Science & Engineering";
  const facultyDeptCode = faculty?.department_code || "CSE";

  const effectiveDeptSlug = (queryDept || activeDepartment?.slug || "cse").toLowerCase();
  const effectiveDepartment =
    departments.find((d) => d.slug.toLowerCase() === effectiveDeptSlug) || activeDepartment;

  const isDeptMismatch = Boolean(
    faculty &&
    effectiveDeptSlug &&
    effectiveDeptSlug !== facultyDeptSlug.toLowerCase()
  );

  const highestQualification = useMemo(() => {
    if (faculty?.highest_qualification) return faculty.highest_qualification;
    if (allQualifications && allQualifications.length > 0) {
      const phds = allQualifications.filter((q: any) => (q.degree || q.nameOfDegree || "").toLowerCase().includes("ph"));
      if (phds.length > 0) return phds[0].degree || phds[0].nameOfDegree;
      return allQualifications[0].degree || allQualifications[0].nameOfDegree || "Ph.D.";
    }
    return "Ph.D. (Computer Science & Engineering)";
  }, [allQualifications, faculty]);

  const netTeachingExpText = useMemo(() => {
    if (faculty?.teaching_experience_summary) return faculty.teaching_experience_summary;
    if (allTeachingExp && allTeachingExp.length > 0) {
      return `${allTeachingExp.length} Appointments / Positions`;
    }
    return "15+ Years Academic Experience";
  }, [allTeachingExp, faculty]);

  // Courses Taught
  const facultyCoursesFallback = useMemo(() => {
    return MOCK_COURSES_TAUGHT.filter(
      (c) =>
        c.faculty_code === baseFaculty?.employee_code ||
        c.faculty_name === baseFaculty?.full_name ||
        c.faculty_id === baseFaculty?.id
    );
  }, [baseFaculty]);

  const allCoursesTaught = useMemo(() => {
    return getStoredData<CourseTaught>(
      baseFaculty,
      "courses",
      facultyCoursesFallback.length > 0 ? facultyCoursesFallback : MOCK_COURSES_TAUGHT.slice(0, 3)
    );
  }, [baseFaculty, facultyCoursesFallback]);

  const coursesCount = allCoursesTaught.length;

  // Sidebar navigation items (15 Categories matching tempcsebase + courses)
  const sidebarItems: {
    key: TabKey;
    label: string;
    icon: any;
    count?: number;
  }[] = [
    { key: "facultyInfo", label: "Faculty Profile", icon: UserCheck },
    { key: "journal", label: "Journal", icon: BookOpen, count: journalCount },
    { key: "conference", label: "Conference", icon: Presentation, count: conferenceCount },
    { key: "book", label: "Book", icon: Book, count: bookCount },
    { key: "book_chapter", label: "Book Chapter", icon: Bookmark, count: bookChapterCount },
    { key: "patents", label: "Patents", icon: Lightbulb, count: patentCount },
    { key: "projects", label: "Projects", icon: Briefcase, count: projectCount },
    { key: "events", label: "Events", icon: Calendar, count: eventCount },
    { key: "consultancies", label: "Consultancies", icon: Building2, count: consultancyCount },
    { key: "experttalk", label: "Expert Talk", icon: Mic, count: expertTalkCount },
    { key: "researchSupervision", label: "Research Supervision", icon: GraduationCap, count: supervisionCount },
    { key: "courses", label: "Courses Taught", icon: BookOpenCheck, count: coursesCount },
    { key: "administrativeexperience", label: "Administrative Experience", icon: Award, count: adminExpCount },
    { key: "honors", label: "Honors & Recognitions", icon: Trophy, count: honorCount },
    { key: "internationalAndNationalExposure", label: "International & National Exposure", icon: Globe, count: exposureCount },
  ];

  // Active publications list based on active tab
  // Colleague faculty list for associated faculty selection
  const colleagueFacultyList = useMemo(() => {
    return MOCK_FACULTY.filter(
      (f: any) =>
        f.employee_code?.toUpperCase() !== baseFaculty?.employee_code?.toUpperCase() &&
        f.id !== baseFaculty?.id
    );
  }, [baseFaculty]);

  const filteredColleagueOptions = useMemo(() => {
    if (!facultySearchQuery.trim()) return colleagueFacultyList;
    const q = facultySearchQuery.toLowerCase();
    return colleagueFacultyList.filter(
      (f: any) =>
        f.full_name?.toLowerCase().includes(q) ||
        f.employee_code?.toLowerCase().includes(q) ||
        f.department_name?.toLowerCase().includes(q)
    );
  }, [colleagueFacultyList, facultySearchQuery]);

  const currentPubList = activeTab === "conference" ? conferences : activeTab === "book" ? books : activeTab === "book_chapter" ? bookChapters : journals;

  // Available Years for filter chips
  const pubYears = Array.from(
    new Set(
      currentPubList
        .map((p: any) => Number(p.year))
        .filter((y) => !isNaN(y) && y > 0)
    )
  ).sort((a, b) => b - a);

  // Filtered publications
  const filteredPubs = currentPubList.filter((p: any) => {
    const q = pubSearch.toLowerCase();
    const matchesSearch =
      !q ||
      p.title?.toLowerCase().includes(q) ||
      p.venue_name?.toLowerCase().includes(q) ||
      p.journal_or_conference_name?.toLowerCase().includes(q) ||
      p.author_text?.toLowerCase().includes(q) ||
      p.doi?.toLowerCase().includes(q);

    const matchesYear = selectedYear === "ALL" || String(p.year) === selectedYear;

    return matchesSearch && matchesYear;
  });

  const totalPages = Math.ceil(filteredPubs.length / PUBS_PER_PAGE) || 1;
  const paginatedPubs = filteredPubs.slice(
    (currentPage - 1) * PUBS_PER_PAGE,
    currentPage * PUBS_PER_PAGE
  );

  const copyCitation = (pub: any) => {
    const authors = pub.author_text || pub.raw_authors || faculty.full_name;
    const year = pub.year ? `(${pub.year})` : "";
    const venue = pub.journal_or_conference_name || pub.venue_name || "";
    const volume = pub.volume ? `Vol. ${pub.volume}` : "";
    const issue = pub.issue ? `No. ${pub.issue}` : "";
    const pages = pub.page_range || pub.pages ? `pp. ${pub.page_range || pub.pages}` : "";
    const doi = pub.doi ? `DOI: ${pub.doi}` : "";

    const parts = [authors, year, `"${pub.title}"`, venue, volume, issue, pages, doi].filter(Boolean);
    const citation = parts.join(", ") + ".";

    navigator.clipboard.writeText(citation);
    setCopiedId(pub.id);
    toast.success("Citation copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Open Details Modal
  const openDetails = (item: any) => {
    setDetailItem(item);
    setIsDetailsModalOpen(true);
  };

  // Reusable Associated Faculty Multi-select Picker
  const renderAssociatedFacultyPicker = (label: string = "Associated Faculty (Automatic Co-Author / Co-PI Sync)") => (
    <div className="space-y-2.5 sm:col-span-2 border border-[#eedfd8]/80 bg-[#fff9f6] p-4 rounded-2xl">
      <div className="flex items-center justify-between">
        <label className="font-bold text-neutral-800 text-sm sm:text-base flex items-center gap-2">
          <Users className="w-4 h-4 text-[#85261e]" />
          <span>{label}</span>
        </label>
        <span className="text-xs text-neutral-500 font-medium">
          Auto-syncs record to chosen colleagues
        </span>
      </div>

      {/* Selected Faculty Pills */}
      {selectedAssociatedFaculty.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {selectedAssociatedFaculty.map((f: any) => (
            <span
              key={f.id || f.employee_code}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-semibold bg-[#85261e] text-white shadow-xs"
            >
              <span>{f.full_name}</span>
              <span className="opacity-80 text-xs">({f.employee_code || "CSE"})</span>
              <button
                type="button"
                onClick={() =>
                  setSelectedAssociatedFaculty((prev) =>
                    prev.filter((item) => item.employee_code !== f.employee_code && item.id !== f.id)
                  )
                }
                className="ml-1 hover:text-red-200 cursor-pointer font-bold text-base"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search & Add Picker */}
      <div className="space-y-2 pt-1">
        <input
          type="text"
          placeholder="Search colleague by name or employee code to associate..."
          value={facultySearchQuery}
          onChange={(e) => setFacultySearchQuery(e.target.value)}
          className="w-full text-sm p-3 rounded-xl border border-[#eedfd8] bg-white focus:ring-1 focus:ring-[#85261e] focus:outline-none"
        />
        {facultySearchQuery.trim().length > 0 && (
          <div className="max-h-48 overflow-y-auto border border-[#eedfd8] rounded-xl bg-white divide-y divide-neutral-100 shadow-md">
            {filteredColleagueOptions.length > 0 ? (
              filteredColleagueOptions.slice(0, 8).map((colleague: any) => {
                const isSelected = selectedAssociatedFaculty.some(
                  (item) => item.employee_code === colleague.employee_code || item.id === colleague.id
                );
                return (
                  <button
                    key={colleague.id || colleague.employee_code}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedAssociatedFaculty((prev) =>
                          prev.filter(
                            (item) =>
                              item.employee_code !== colleague.employee_code && item.id !== colleague.id
                          )
                        );
                      } else {
                        setSelectedAssociatedFaculty((prev) => [...prev, colleague]);
                      }
                      setFacultySearchQuery("");
                    }}
                    className={`w-full text-left px-3.5 py-2.5 text-sm flex items-center justify-between hover:bg-[#eedfd8]/30 transition ${
                      isSelected ? "bg-[#eedfd8]/50 font-bold text-[#85261e]" : "text-neutral-700"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">{colleague.full_name}</span>
                      <span className="text-xs text-neutral-500">
                        {colleague.designation} • {colleague.department_name || "CSE"}
                      </span>
                    </div>
                    <span className="font-mono text-xs bg-neutral-100 px-2 py-0.5 rounded font-medium">
                      {isSelected ? "Selected ✓" : colleague.employee_code}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="p-3 text-sm text-neutral-400 text-center">No colleagues found matching query</div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Open Dynamic Add Form
  const openAddModal = () => {
    setFormMode("add");
    setEditingItem(null);
    setSelectedAssociatedFaculty([]);
    setIsCustomIndexing(false);
    setCustomIndexingText("");
    setFacultySearchQuery("");

    if (activeTab === "facultyInfo") {
      setFormData({
        full_name: faculty?.full_name || "",
        designation: faculty?.designation || "",
        email: faculty?.email || "",
        phone: faculty?.phone || "",
        highest_qualification: highestQualification,
        teaching_experience_summary: netTeachingExpText,
        research_interests: (faculty?.research_interests || []).join(", "),
        bio: faculty?.bio || "",
        google_scholar_id: faculty?.profile?.google_scholar_id || faculty?.google_scholar_url || "",
        scopus_id: faculty?.profile?.scopus_id || faculty?.scopus_url || "",
        orcid: faculty?.profile?.orcid || faculty?.orcid || "",
        rg_url: faculty?.profile?.rg_url || "",
        linkedin_url: faculty?.profile?.linkedin_url || faculty?.linkedin_url || "",
        vidwan_url: faculty?.profile?.vidwan_url || "",
        publons_url: faculty?.profile?.publons_url || "",
      });
    } else if (activeTab === "journal" || activeTab === "conference" || activeTab === "book" || activeTab === "book_chapter") {
      setFormData({
        title: "",
        year: new Date().getFullYear(),
        month: "",
        academic_session: "2024-2025",
        indexing: "Scopus",
        journal_quartile: "T",
        isbn: "",
        author_text: faculty?.full_name || "",
        journal_or_conference_name: "",
        volume: "",
        issue: "",
        page_range: "",
        doi: "",
        abstract_text: "",
        type: activeTab === "journal" ? "Journal" : activeTab === "conference" ? "Conference" : activeTab === "book" ? "Book" : "Book Chapter",
      });
    } else if (activeTab === "projects") {
      setFormData({
        title: "",
        reference_number: "",
        year: new Date().getFullYear(),
        month: "",
        academic_session: "2024-2025",
        status: "Ongoing",
        duration: "36 Months",
        principal_investigator: faculty?.full_name || "",
        co_principal_investigator: "",
        funding_agency: "DST-SERB",
        total_sanctioned_amount: 1500000,
        raw_investigators: faculty?.full_name || "",
      });
    } else if (activeTab === "patents") {
      setFormData({
        title: "",
        application_number: "",
        year: new Date().getFullYear(),
        month: "",
        academic_session: "2024-2025",
        status: "Published",
        place: "Indian Patent Office, New Delhi",
        filing_date: new Date().toISOString().split("T")[0],
        grant_date: "",
        raw_inventors: faculty?.full_name || "",
      });
    } else if (activeTab === "consultancies") {
      setFormData({
        title: "",
        client_organisation: "",
        reference_number: "",
        amount: 250000,
        year: new Date().getFullYear(),
        month: "",
        academic_session: "2024-2025",
        status: "Completed",
        author_text: faculty?.full_name || "",
      });
    } else if (activeTab === "events") {
      setFormData({
        title: "",
        event_type: "FDP / STC",
        category: "organized",
        academic_session: "2024-2025",
        position1: "Coordinator",
        positionother1: "",
        convenor: faculty?.full_name || "",
        position2: "",
        positionother2: "",
        coordinator: "",
        sponsoring_agency: "NIT Hamirpur",
        venue: "DoCSE, NIT Hamirpur",
        start_date: new Date().toISOString().split("T")[0],
        end_date: "",
        link_url: "",
      });
    } else if (activeTab === "experttalk") {
      setFormData({
        title: "",
        host_organization: "",
        venue: "",
        date: new Date().toISOString().split("T")[0],
        end_date: "",
        is_present: false,
        academic_session: "2024-2025",
        description: "",
      });
    } else if (activeTab === "researchSupervision") {
      setFormData({
        level: "Ph.D.",
        student_name: "",
        roll_number: "",
        thesis_title: "",
        status: "Ongoing",
        year: new Date().getFullYear(),
        academic_session: "2024-2025",
        co_supervisor: "",
      });
    } else {
      setFormData({});
    }
    setIsFormModalOpen(true);
  };

  // Open Dynamic Edit Form
  const openEditModal = (item: any) => {
    setFormMode("edit");
    setEditingItem(item);
    setFormData({
      ...item,
      is_present: item.end_date === "Present" || item.is_present || false,
      position1: item.position1 || "Coordinator",
      positionother1: item.positionother1 || "",
      position2: item.position2 || "",
      positionother2: item.positionother2 || "",
    });
    setFacultySearchQuery("");

    // Detect if indexing is custom
    const standardIndexings = ["Scopus", "SCI(E)", "SCI", "SCIE", "ESCI", "Web of Science", "UGC CARE"];
    if (item.indexing && !standardIndexings.includes(item.indexing)) {
      setIsCustomIndexing(true);
      setCustomIndexingText(item.indexing);
    } else {
      setIsCustomIndexing(item.indexing === "Other");
      setCustomIndexingText(item.indexing === "Other" ? "" : "");
    }

    // Populate selected associated faculty
    let matchedFaculties: any[] = [];
    if (Array.isArray(item.associated_faculty) && item.associated_faculty.length > 0) {
      matchedFaculties = item.associated_faculty.map((af: any) => {
        const found = MOCK_FACULTY.find(
          (f: any) =>
            f.employee_code?.toUpperCase() === (af.employee_code || af.code || "").toUpperCase() ||
            f.id === af.id ||
            f.full_name?.toLowerCase() === (af.full_name || af.name || "").toLowerCase()
        );
        return found || {
          id: af.id || `ext-${Date.now()}`,
          employee_code: af.employee_code || af.code || "EXT",
          full_name: af.full_name || af.name || "Faculty",
          designation: af.designation || "Faculty",
          department_name: af.department_name || "CSE",
        };
      });
    } else if (Array.isArray(item.faculty_ids) && item.faculty_ids.length > 0) {
      matchedFaculties = MOCK_FACULTY.filter(
        (f: any) =>
          f.employee_code?.toUpperCase() !== baseFaculty?.employee_code?.toUpperCase() &&
          f.id !== baseFaculty?.id &&
          (item.faculty_ids.includes(f.employee_code) || item.faculty_ids.includes(f.id))
      );
    }
    setSelectedAssociatedFaculty(matchedFaculties);

    setIsDetailsModalOpen(false);
    setIsFormModalOpen(true);
  };

  // Handle Dynamic Form Input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save Dynamic Form Submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!baseFaculty) return;
    const id = formMode === "edit" ? editingItem?.id : `custom-${Date.now()}`;

    if (activeTab === "facultyInfo") {
      const updatedFaculty = {
        ...faculty,
        full_name: formData.full_name || faculty.full_name,
        designation: formData.designation || faculty.designation,
        email: formData.email || faculty.email,
        phone: formData.phone || faculty.phone,
        highest_qualification: formData.highest_qualification || highestQualification,
        teaching_experience_summary: formData.teaching_experience_summary || netTeachingExpText,
        research_interests: typeof formData.research_interests === "string" ? formData.research_interests.split(",").map((s: string) => s.trim()).filter(Boolean) : faculty.research_interests,
        bio: formData.bio || faculty.bio,
        google_scholar_url: formData.google_scholar_id,
        scopus_url: formData.scopus_id,
        orcid: formData.orcid,
        linkedin_url: formData.linkedin_url,
        profile: {
          ...faculty.profile,
          google_scholar_id: formData.google_scholar_id,
          scopus_id: formData.scopus_id,
          orcid: formData.orcid,
          rg_url: formData.rg_url,
          linkedin_url: formData.linkedin_url,
          vidwan_url: formData.vidwan_url,
          publons_url: formData.publons_url,
          bio: formData.bio,
        },
      };
      setFaculty(updatedFaculty);
      setStoredObject(baseFaculty, "profile", updatedFaculty);
      toast.success("Faculty profile updated successfully!");
    } else if (activeTab === "journal" || activeTab === "conference" || activeTab === "book" || activeTab === "book_chapter") {
      const typeMap: Record<string, { type: string; id: number }> = {
        journal: { type: "Journal", id: 1 },
        conference: { type: "Conference", id: 2 },
        book: { type: "Book", id: 3 },
        book_chapter: { type: "Book Chapter", id: 4 },
      };

      const canonicalDoi = (formData.doi || "").trim();
      const finalIndexing = isCustomIndexing ? (customIndexingText.trim() || "Other") : (formData.indexing || "Scopus");
      const assignedFacultyIds = Array.from(
        new Set([
          baseFaculty.employee_code,
          baseFaculty.id,
          ...selectedAssociatedFaculty.map((f: any) => f.employee_code),
          ...selectedAssociatedFaculty.map((f: any) => f.id),
        ])
      );
      const associatedFaculty = selectedAssociatedFaculty.map((f: any) => ({
        id: f.id,
        employee_code: f.employee_code,
        full_name: f.full_name,
        designation: f.designation,
        department_name: f.department_name || "CSE",
      }));

      const record = {
        id: formMode === "edit" ? (editingItem?.id || canonicalDoi || `pub-${Date.now()}`) : (canonicalDoi || `pub-${Date.now()}`),
        title: formData.title || "Untitled Publication",
        publication_type: typeMap[activeTab].type,
        research_type_id: typeMap[activeTab].id,
        author_text: formData.author_text || formData.authors || faculty.full_name,
        journal_or_conference_name: formData.journal_or_conference_name || formData.venue_name || "Academic Proceedings",
        venue_name: formData.venue_name || formData.journal_or_conference_name || "",
        volume: formData.volume || "",
        issue: formData.issue || "",
        page_range: formData.page_range || formData.pages || "",
        pages: formData.pages || formData.page_range || "",
        year: Number(formData.year) || new Date().getFullYear(),
        month: formData.month ? Number(formData.month) : null,
        academic_session: formData.academic_session || "2024-2025",
        doi: canonicalDoi,
        indexing: finalIndexing,
        journal_quartile: formData.journal_quartile || "T",
        isbn: formData.isbn || "",
        abstract_text: formData.abstract_text || "",
        faculty_ids: assignedFacultyIds,
        associated_faculty: associatedFaculty,
      };

      syncMultiFacultyRecord(baseFaculty, "publications", record, selectedAssociatedFaculty, false);
      setAllFacultyPubs(getStoredData(baseFaculty, "publications", baseFaculty.publications || []));
      toast.success(`${typeMap[activeTab].type} record saved & synced with associated faculty!`);
    } else if (activeTab === "patents") {
      const canonicalAppNum = (formData.application_number || "").trim();
      const assignedFacultyIds = Array.from(
        new Set([
          baseFaculty.employee_code,
          baseFaculty.id,
          ...selectedAssociatedFaculty.map((f: any) => f.employee_code),
          ...selectedAssociatedFaculty.map((f: any) => f.id),
        ])
      );
      const associatedFaculty = selectedAssociatedFaculty.map((f: any) => ({
        id: f.id,
        employee_code: f.employee_code,
        full_name: f.full_name,
        designation: f.designation,
        department_name: f.department_name || "CSE",
      }));

      const record = {
        id: formMode === "edit" ? (editingItem?.id || canonicalAppNum || `pat-${Date.now()}`) : (canonicalAppNum || `pat-${Date.now()}`),
        title: formData.title || "Untitled Patent",
        application_number: canonicalAppNum || "Application Pending",
        reference_no: canonicalAppNum,
        patent_number: formData.patent_number || "",
        status: formData.status || "Published",
        filing_date: formData.filing_date || new Date().toISOString().split("T")[0],
        grant_date: formData.grant_date || "",
        year: Number(formData.year) || new Date().getFullYear(),
        month: formData.month ? Number(formData.month) : null,
        academic_session: formData.academic_session || "2024-2025",
        place: formData.place || "Indian Patent Office, New Delhi",
        raw_inventors: formData.raw_inventors || faculty.full_name,
        patent_office: formData.place || "Indian Patent Office",
        country: "India",
        faculty_ids: assignedFacultyIds,
        associated_faculty: associatedFaculty,
      };

      syncMultiFacultyRecord(baseFaculty, "patents", record, selectedAssociatedFaculty, false);
      setAllFacultyPatents(getStoredData(baseFaculty, "patents", baseFaculty.patents || []));
      toast.success(`Patent record saved & synced with associated faculty!`);
    } else if (activeTab === "projects") {
      const canonicalRefNum = (formData.reference_number || "").trim();
      const assignedFacultyIds = Array.from(
        new Set([
          baseFaculty.employee_code,
          baseFaculty.id,
          ...selectedAssociatedFaculty.map((f: any) => f.employee_code),
          ...selectedAssociatedFaculty.map((f: any) => f.id),
        ])
      );
      const associatedFaculty = selectedAssociatedFaculty.map((f: any) => ({
        id: f.id,
        employee_code: f.employee_code,
        full_name: f.full_name,
        designation: f.designation,
        department_name: f.department_name || "CSE",
      }));

      const record = {
        id: formMode === "edit" ? (editingItem?.id || canonicalRefNum || `proj-${Date.now()}`) : (canonicalRefNum || `proj-${Date.now()}`),
        title: formData.title || "Research Project",
        funding_agency: formData.funding_agency || "DST-SERB",
        total_sanctioned_amount: Number(formData.total_sanctioned_amount) || 1500000,
        status: formData.status || "Ongoing",
        raw_investigators: formData.raw_investigators || faculty.full_name,
        reference_number: canonicalRefNum,
        reference_no: canonicalRefNum,
        year: Number(formData.year) || new Date().getFullYear(),
        month: formData.month ? Number(formData.month) : null,
        academic_session: formData.academic_session || "2024-2025",
        duration: formData.duration || "3 Years",
        principal_investigator: formData.principal_investigator || faculty.full_name,
        co_principal_investigator: formData.co_principal_investigator || "",
        faculty_ids: assignedFacultyIds,
        associated_faculty: associatedFaculty,
      };

      syncMultiFacultyRecord(baseFaculty, "projects", record, selectedAssociatedFaculty, false);
      setAllFacultyProjects(getStoredData(baseFaculty, "projects", baseFaculty.projects || []));
      toast.success(`Project record saved & synced with associated faculty!`);
    } else if (activeTab === "events") {
      const assignedFacultyIds = Array.from(
        new Set([
          baseFaculty.employee_code,
          baseFaculty.id,
          ...selectedAssociatedFaculty.map((f: any) => f.employee_code),
          ...selectedAssociatedFaculty.map((f: any) => f.id),
        ])
      );
      const associatedFaculty = selectedAssociatedFaculty.map((f: any) => ({
        id: f.id,
        employee_code: f.employee_code,
        full_name: f.full_name,
        designation: f.designation,
        department_name: f.department_name || "CSE",
      }));

      const record = {
        id,
        title: formData.title || "Department Event / STC",
        event_type: formData.event_type || "FDP / STC",
        category: formData.category || "organized",
        position1: formData.position1 || "Coordinator",
        positionother1: formData.positionother1 || "",
        convenor: formData.convenor || faculty.full_name,
        position2: formData.position2 || "",
        positionother2: formData.positionother2 || "",
        coordinator: formData.coordinator || "",
        sponsoring_agency: formData.sponsoring_agency || "NIT Hamirpur",
        venue: formData.venue || "DoCSE, NIT Hamirpur",
        start_date: formData.start_date || new Date().toISOString().split("T")[0],
        end_date: formData.end_date || "",
        academic_session: formData.academic_session || "2024-2025",
        link_url: formData.link_url || "",
        faculty_ids: assignedFacultyIds,
        associated_faculty: associatedFaculty,
      };

      syncMultiFacultyRecord(baseFaculty, "events", record, selectedAssociatedFaculty, false);
      setAllEvents(getStoredData(baseFaculty, "events", []));
      toast.success(`Event saved & synced with associated faculty!`);
    } else if (activeTab === "consultancies") {
      const assignedFacultyIds = Array.from(
        new Set([
          baseFaculty.employee_code,
          baseFaculty.id,
          ...selectedAssociatedFaculty.map((f: any) => f.employee_code),
          ...selectedAssociatedFaculty.map((f: any) => f.id),
        ])
      );
      const associatedFaculty = selectedAssociatedFaculty.map((f: any) => ({
        id: f.id,
        employee_code: f.employee_code,
        full_name: f.full_name,
        designation: f.designation,
        department_name: f.department_name || "CSE",
      }));

      const record = {
        id,
        title: formData.title || "Consultancy Project",
        client_organisation: formData.client_organisation || "Industry Partner",
        amount: Number(formData.amount) || 250000,
        year: Number(formData.year) || new Date().getFullYear(),
        month: formData.month ? Number(formData.month) : null,
        academic_session: formData.academic_session || "2024-2025",
        reference_number: formData.reference_number || "",
        reference_no: formData.reference_number || "",
        status: formData.status || "Completed",
        author_text: formData.author_text || faculty.full_name,
        faculty_ids: assignedFacultyIds,
        associated_faculty: associatedFaculty,
      };

      syncMultiFacultyRecord(baseFaculty, "consultancies", record, selectedAssociatedFaculty, false);
      setAllConsultancies(getStoredData(baseFaculty, "consultancies", []));
      toast.success(`Consultancy saved & synced with associated faculty!`);
    } else if (activeTab === "experttalk") {
      const assignedFacultyIds = Array.from(
        new Set([
          baseFaculty.employee_code,
          baseFaculty.id,
          ...selectedAssociatedFaculty.map((f: any) => f.employee_code),
          ...selectedAssociatedFaculty.map((f: any) => f.id),
        ])
      );
      const associatedFaculty = selectedAssociatedFaculty.map((f: any) => ({
        id: f.id,
        employee_code: f.employee_code,
        full_name: f.full_name,
        designation: f.designation,
        department_name: f.department_name || "CSE",
      }));

      const finalEndDate = formData.is_present ? "Present" : (formData.end_date || "");
      const record = {
        id,
        title: formData.title || "Invited Keynote Address",
        host_organization: formData.host_organization || "",
        venue: formData.venue || "Host Institution",
        talk_date: formData.date || formData.start_date || new Date().toISOString().split("T")[0],
        date: formData.date || formData.start_date || new Date().toISOString().split("T")[0],
        start_date: formData.date || formData.start_date || new Date().toISOString().split("T")[0],
        end_date: finalEndDate,
        is_present: Boolean(formData.is_present),
        academic_session: formData.academic_session || "2024-2025",
        description: formData.description || "",
        faculty_ids: assignedFacultyIds,
        associated_faculty: associatedFaculty,
      };

      syncMultiFacultyRecord(baseFaculty, "expert_talks", record, selectedAssociatedFaculty, false);
      setAllTalks(getStoredData(baseFaculty, "expert_talks", []));
      toast.success(`Expert talk ${formMode === "edit" ? "updated" : "saved"} & synced!`);
    } else if (activeTab === "researchSupervision") {
      const assignedFacultyIds = Array.from(
        new Set([
          baseFaculty.employee_code,
          baseFaculty.id,
          ...selectedAssociatedFaculty.map((f: any) => f.employee_code),
          ...selectedAssociatedFaculty.map((f: any) => f.id),
        ])
      );
      const associatedFaculty = selectedAssociatedFaculty.map((f: any) => ({
        id: f.id,
        employee_code: f.employee_code,
        full_name: f.full_name,
        designation: f.designation,
        department_name: f.department_name || "CSE",
      }));

      const record = {
        id,
        student_name: formData.student_name || "Research Scholar",
        scholar_name: formData.student_name || "Research Scholar",
        roll_number: formData.roll_number || "",
        thesis_title: formData.thesis_title || "Doctoral Thesis",
        level: formData.level || "Ph.D.",
        status: formData.status || "Ongoing",
        year: formData.year || "2024",
        academic_session: formData.academic_session || "2024-2025",
        co_supervisor: formData.co_supervisor || "",
        faculty_ids: assignedFacultyIds,
        associated_faculty: associatedFaculty,
      };

      syncMultiFacultyRecord(baseFaculty, "supervisions", record, selectedAssociatedFaculty, false);
      setAllSupervisions(getStoredData(baseFaculty, "supervisions", baseFaculty.supervisions || []));
      toast.success(`Research supervision ${formMode === "edit" ? "updated" : "saved"} & synced!`);
    } else if (activeTab === "administrativeexperience") {
      const record = {
        id,
        position: formData.position || "Head / Coordinator",
        organization: formData.organization || "NIT Hamirpur",
        start_date: formData.start_date || "2020",
        end_date: formData.end_date || "Present",
      };
      let nextList = [...allAdminExp];
      if (formMode === "edit") {
        nextList = nextList.map((a) => (a.id === editingItem.id ? { ...a, ...record } : a));
      } else {
        nextList = [record, ...nextList];
      }
      setAllAdminExp(nextList);
      setStoredData(baseFaculty, "admin_experiences", nextList);
      toast.success(`Administrative role ${formMode === "edit" ? "updated" : "added"}!`);
    } else if (activeTab === "honors") {
      const record = {
        id,
        title: formData.title || "Academic Recognition",
        organization: formData.organization || "Awarding Body",
        year: formData.year || "2024",
        description: formData.description || "",
      };
      let nextList = [...allHonors];
      if (formMode === "edit") {
        nextList = nextList.map((h) => (h.id === editingItem.id ? { ...h, ...record } : h));
      } else {
        nextList = [record, ...nextList];
      }
      setAllHonors(nextList);
      setStoredData(baseFaculty, "honors", nextList);
      toast.success(`Honor / Award ${formMode === "edit" ? "updated" : "added"}!`);
    } else if (activeTab === "internationalAndNationalExposure") {
      const record = {
        id,
        title: formData.title || "International Delegation",
        organization: formData.organization || "Host University / Country",
        year: formData.year || "2024",
        details: formData.details || "",
      };
      let nextList = [...allExposures];
      if (formMode === "edit") {
        nextList = nextList.map((x) => (x.id === editingItem.id ? { ...x, ...record } : x));
      } else {
        nextList = [record, ...nextList];
      }
      setAllExposures(nextList);
      setStoredData(baseFaculty, "exposures", nextList);
      toast.success(`Exposure record ${formMode === "edit" ? "updated" : "added"}!`);
    }

    setIsFormModalOpen(false);
  };

  // Delete Record
  const handleDeleteRecord = (item: any) => {
    if (!confirm("Are you sure you want to remove this record?")) return;
    if (!baseFaculty) return;

    const coFacultyList = (item.associated_faculty || []).map((af: any) => {
      return MOCK_FACULTY.find(
        (f: any) =>
          f.employee_code?.toUpperCase() === (af.employee_code || af.code || "").toUpperCase() ||
          f.id === af.id
      ) || af;
    });

    if (activeTab === "journal" || activeTab === "conference" || activeTab === "book" || activeTab === "book_chapter") {
      syncMultiFacultyRecord(baseFaculty, "publications", item, coFacultyList, true);
      setAllFacultyPubs(getStoredData(baseFaculty, "publications", baseFaculty.publications || []));
    } else if (activeTab === "patents") {
      syncMultiFacultyRecord(baseFaculty, "patents", item, coFacultyList, true);
      setAllFacultyPatents(getStoredData(baseFaculty, "patents", baseFaculty.patents || []));
    } else if (activeTab === "projects") {
      syncMultiFacultyRecord(baseFaculty, "projects", item, coFacultyList, true);
      setAllFacultyProjects(getStoredData(baseFaculty, "projects", baseFaculty.projects || []));
    } else if (activeTab === "events") {
      syncMultiFacultyRecord(baseFaculty, "events", item, coFacultyList, true);
      setAllEvents(getStoredData(baseFaculty, "events", []));
    } else if (activeTab === "consultancies") {
      syncMultiFacultyRecord(baseFaculty, "consultancies", item, coFacultyList, true);
      setAllConsultancies(getStoredData(baseFaculty, "consultancies", []));
    } else if (activeTab === "experttalk") {
      const nextList = allTalks.filter((t) => t.id !== item.id);
      setAllTalks(nextList);
      setStoredData(baseFaculty, "expert_talks", nextList);
    } else if (activeTab === "researchSupervision") {
      const nextList = combinedSupervisions.filter((s) => s.id !== item.id);
      setAllSupervisions(nextList);
      setStoredData(baseFaculty, "supervisions", nextList);
    } else if (activeTab === "administrativeexperience") {
      const nextList = allAdminExp.filter((a) => a.id !== item.id);
      setAllAdminExp(nextList);
      setStoredData(baseFaculty, "admin_experiences", nextList);
    } else if (activeTab === "honors") {
      const nextList = allHonors.filter((h) => h.id !== item.id);
      setAllHonors(nextList);
      setStoredData(baseFaculty, "honors", nextList);
    } else if (activeTab === "internationalAndNationalExposure") {
      const nextList = allExposures.filter((x) => x.id !== item.id);
      setAllExposures(nextList);
      setStoredData(baseFaculty, "exposures", nextList);
    }

    setIsDetailsModalOpen(false);
    toast.success("Record deleted successfully!");
  };

  if (!faculty) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center font-sans">
        <h2 className="text-2xl font-bold text-[#33110e]">Faculty Member Not Found</h2>
        <p className="mt-2 text-neutral-600">The faculty profile you are looking for does not exist.</p>
        <Link
          href={`/people/faculty?dept=${effectiveDeptSlug}`}
          className="mt-6 inline-flex items-center gap-2 text-[#85261e] font-semibold hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Faculty Directory
        </Link>
      </div>
    );
  }

  if (isDeptMismatch) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-6 bg-white min-h-[85vh] font-sans">
        <Link
          href={`/people/faculty?dept=${effectiveDeptSlug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-[#33110e] transition"
        >
          <ArrowLeft className="h-4 w-4 text-[#85261e]" /> Back to {effectiveDepartment.code} Faculty Directory
        </Link>

        <div className="rounded-3xl border border-[#eedfd8] bg-[#fff9f6] p-8 sm:p-12 text-center space-y-6 shadow-xs my-6 max-w-3xl mx-auto">
          <div className="mx-auto w-16 h-16 rounded-3xl bg-white border border-[#eedfd8] flex items-center justify-center text-[#85261e] shadow-xs">
            <Building2 className="w-8 h-8 opacity-80" />
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-white text-[#85261e] border border-[#eedfd8] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Department Context Mismatch</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-[#33110e] tracking-tight">
              Faculty Profile Does Not Belong to Department of {effectiveDepartment.name}
            </h2>

            <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto leading-relaxed">
              <strong className="text-neutral-900 font-semibold">{faculty.full_name} ({faculty.employee_code})</strong> is an official faculty member of the{" "}
              <span className="text-[#85261e] font-bold">Department of {facultyDeptName} ({facultyDeptCode})</span>, but your current departmental context is set to{" "}
              <span className="text-[#33110e] font-bold">Department of {effectiveDepartment.name} ({effectiveDepartment.code})</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                selectDepartmentBySlug(facultyDeptSlug);
                router.push(`/people/faculty/${code.toLowerCase()}?dept=${facultyDeptSlug}`);
              }}
              className="inline-flex items-center gap-2 bg-[#33110e] hover:bg-[#85261e] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-amber-300" />
              <span>Switch to {facultyDeptCode} &amp; View Profile</span>
            </button>

            <Link
              href={`/people/faculty?dept=${effectiveDeptSlug}`}
              className="inline-flex items-center gap-2 bg-white hover:bg-neutral-50 text-[#33110e] border border-[#eedfd8] px-4 py-2.5 rounded-xl text-xs font-bold shadow-2xs transition"
            >
              <span>View {effectiveDepartment.code} Faculty Directory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Academic URLs
  const scholarUrl = faculty.profile?.google_scholar_id || faculty.google_scholar_url || `https://scholar.google.com/citations?view_op=search_authors&mauthors=${encodeURIComponent(faculty.full_name)}`;
  const scopusUrl = faculty.profile?.scopus_id || faculty.scopus_url || `https://www.scopus.com/results/authorNamesList.uri?st1=${encodeURIComponent(faculty.full_name)}`;
  const orcidUrl = faculty.profile?.orcid || faculty.orcid ? `https://orcid.org/${faculty.profile?.orcid || faculty.orcid}` : "https://orcid.org";
  const linkedInUrl = faculty.profile?.linkedin_url || faculty.linkedin_url || "https://linkedin.com";
  const researchGateUrl = faculty.profile?.rg_url || `https://www.researchgate.net/search?q=${encodeURIComponent(faculty.full_name)}`;
  const vidwanUrl = faculty.profile?.vidwan_url || `https://vidwan.inflibnet.ac.in/search?q=${encodeURIComponent(faculty.full_name)}`;
  const publonsUrl = faculty.profile?.publons_url || `https://www.webofscience.com/wos/author/record?search=${encodeURIComponent(faculty.full_name)}`;

  return (
    <div className="min-h-screen bg-[#faf8f6] font-sans pb-16">
      {/* 1. TOP BREADCRUMB & CONTEXT BAR */}
      <div className="bg-white border-b border-[#ebdcd5] sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-neutral-500 overflow-x-auto no-scrollbar">
            <Link href="/" className="hover:text-[#33110e] transition">Home</Link>
            <span>/</span>
            <Link href={`/people/faculty?dept=${facultyDeptSlug}`} className="hover:text-[#33110e] transition">
              Department of {facultyDeptCode}
            </Link>
            <span>/</span>
            <Link href={`/people/faculty?dept=${facultyDeptSlug}`} className="hover:text-[#33110e] transition">
              Faculty Directory
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#85261e] truncate">{faculty.full_name}</span>
          </div>

          <Link
            href={`/people/faculty?dept=${facultyDeptSlug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#85261e] hover:text-[#33110e] transition shrink-0 ml-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to {facultyDeptCode} Faculty</span>
          </Link>
        </div>
      </div>

      {/* 2. INSTITUTIONAL FACULTY HEADER (Matching tempcsebase PublicTopNavbar) */}
      <div className="bg-[#1f1412] text-white shadow-md relative overflow-hidden border-b-4 border-[#85261e]">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#85261e]/20 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-20 w-96 h-96 rounded-full bg-amber-600/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left: Faculty Avatar + Identity */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
              <div className="relative group shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-amber-300/30 shadow-xl bg-neutral-900/60 ring-4 ring-white/10">
                  <Image
                    src={faculty.image_url || "/hod.jpg"}
                    alt={faculty.full_name}
                    width={112}
                    height={112}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute -bottom-1.5 -right-1.5 bg-[#85261e] text-white font-mono text-xs font-bold px-2.5 py-0.5 rounded-md border border-white/20 shadow-xs">
                  {faculty.employee_code || "FACULTY"}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-amber-300 bg-amber-500/15 border border-amber-400/25 px-3 py-1 rounded-full">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Dept. of {facultyDeptCode}</span>
                  </span>
                  <span className="text-sm text-neutral-200 bg-white/15 px-3 py-1 rounded-md font-semibold">
                    {faculty.designation}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white drop-shadow-xs">
                  {faculty.full_name}
                </h1>

                <div className="flex flex-wrap items-center gap-y-1.5 gap-x-5 text-sm text-neutral-200 pt-0.5">
                  {faculty.email && (
                    <a
                      href={`mailto:${faculty.email}`}
                      className="inline-flex items-center gap-1.5 hover:text-amber-200 transition"
                    >
                      <Mail className="w-3.5 h-3.5 text-amber-400" />
                      <span>{faculty.email}</span>
                    </a>
                  )}
                  {faculty.phone && (
                    <a
                      href={`tel:${faculty.phone}`}
                      className="inline-flex items-center gap-1.5 hover:text-amber-200 transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                      <span>{faculty.phone}</span>
                    </a>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-neutral-400">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>NIT Hamirpur Campus, HP</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Authentic Profile SVG Badges & Faculty Login */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-2 lg:pt-0">
              {/* Google Scholar SVG */}
              <a
                href={scholarUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Google Scholar Profile"
                className="group relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 hover:bg-[#85261e] border border-white/15 hover:border-amber-400/50 text-white transition-all shadow-xs hover:scale-105"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 50 50"
                  className="fill-current text-white group-hover:text-amber-200 transition"
                >
                  <path d="M 25 2 C 12.309534 2 2 12.309534 2 25 C 2 37.690466 12.309534 48 25 48 C 37.690466 48 48 37.690466 48 25 C 48 12.309534 37.690466 2 25 2 z M 25 4 C 36.609534 4 46 13.390466 46 25 C 46 36.609534 36.609534 46 25 46 C 13.390466 46 4 36.609534 4 25 C 4 13.390466 13.390466 4 25 4 z M 21 11 L 11 20 L 17.78125 20 C 17.80125 22.847 19.967531 25.730469 23.769531 25.730469 C 24.129531 25.730469 24.529688 25.690391 24.929688 25.650391 C 24.749688 26.100391 24.560547 26.470078 24.560547 27.080078 C 24.560547 28.230078 25.140391 28.920078 25.650391 29.580078 C 24.020391 29.690078 20.989766 29.879531 18.759766 31.269531 C 16.629766 32.559531 15.980469 34.43 15.980469 35.75 C 15.980469 38.47 18.500469 41 23.730469 41 C 29.930469 41 33.220703 37.510547 33.220703 34.060547 C 33.220703 31.530547 31.779453 30.279922 30.189453 28.919922 L 28.900391 27.890625 C 28.500391 27.570625 27.949219 27.120312 27.949219 26.320312 C 27.949219 25.510313 28.500703 24.989766 28.970703 24.509766 C 30.480703 23.309766 32 21.960234 32 19.240234 C 32 18.197234 31.756203 17.348391 31.408203 16.650391 L 35 13.570312 L 35 17.277344 C 34.405 17.623344 34 18.261 34 19 L 34 25 C 34 26.104 34.896 27 36 27 C 37.104 27 38 26.104 38 25 L 38 19 C 38 18.262 37.595 17.624344 37 17.277344 L 37 12 C 37 11.957 36.980609 11.920906 36.974609 11.878906 L 38 11 L 21 11 z M 24.269531 14.240234 C 27.269531 14.240234 28.820312 18.35 28.820312 21 C 28.820312 21.65 28.739922 22.819922 27.919922 23.669922 C 27.339922 24.259922 26.370938 24.699219 25.460938 24.699219 C 22.370938 24.699219 20.949219 20.620156 20.949219 18.160156 C 20.949219 17.210156 21.14 16.220938 21.75 15.460938 C 22.33 14.710938 23.339531 14.240234 24.269531 14.240234 z M 26.039062 30.609375 C 26.409063 30.609375 26.590859 30.610391 26.880859 30.650391 C 29.620859 32.630391 30.800781 33.620234 30.800781 35.490234 C 30.800781 37.760234 28.97 39.460938 25.5 39.460938 C 21.64 39.460938 19.160156 37.590469 19.160156 34.980469 C 19.160156 32.370469 21.459766 31.499219 22.259766 31.199219 C 23.769766 30.679219 25.719062 30.609375 26.039062 30.609375 z" />
                </svg>
              </a>

              {/* Scopus SVG */}
              <a
                href={scopusUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Elsevier Scopus Profile"
                className="group relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 hover:bg-[#85261e] border border-white/15 hover:border-amber-400/50 text-white transition-all shadow-xs hover:scale-105"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  className="fill-current text-white group-hover:text-amber-200 transition"
                >
                  <path d="m24 19.059l-.14-1.777c-1.426.772-2.945 1.076-4.465 1.076c-3.319 0-5.96-2.782-5.96-6.475c0-3.903 2.595-6.31 5.633-6.31c1.917 0 3.39.303 4.792 1.075L24 4.895c-1.286-.608-2.337-.889-4.698-.889c-4.534 0-7.97 3.53-7.97 8.017c0 5.12 4.09 7.924 7.9 7.924c1.916 0 3.506-.257 4.768-.888m-14.954-3.46c0-2.22-1.964-3.225-3.857-4.347C3.716 10.364 2.15 9.756 2.15 8.12c0-1.215.889-2.548 2.642-2.548c1.519 0 2.57.234 3.903 1.029l.117-1.847c-1.239-.514-2.127-.748-4.137-.748C1.8 4.006.047 5.876.047 8.26s2.103 3.413 4.02 4.581c1.426.865 2.922 1.45 2.922 2.992c0 1.496-1.333 2.571-2.922 2.571c-1.566 0-2.594-.35-3.786-1.075L0 19.176c1.215.56 2.454.818 4.16.818c2.385 0 4.885-1.473 4.885-4.395z" />
                </svg>
              </a>

              {/* ORCID SVG */}
              <a
                href={orcidUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="ORCID ID"
                className="group relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 hover:bg-[#85261e] border border-white/15 hover:border-amber-400/50 text-white transition-all shadow-xs hover:scale-105"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 512 512"
                  className="fill-current text-white group-hover:text-amber-200 transition"
                >
                  <path d="M294.8 188.2h-45.9V342h47.5c67.6 0 83.1-51.3 83.1-76.9 0-41.6-26.5-76.9-84.7-76.9zM256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm-80.8 360.8h-29.8v-207.5h29.8zm-14.9-231.1a19.6 19.6 0 1 1 19.6-19.6 19.6 19.6 0 0 1 -19.6 19.6zM300 369h-81V161.3h80.6c76.7 0 110.4 54.8 110.4 103.9C410 318.4 368.4 369 300 369z" />
                </svg>
              </a>

              {/* LinkedIn SVG */}
              <a
                href={linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn Profile"
                className="group relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 hover:bg-[#85261e] border border-white/15 hover:border-amber-400/50 text-white transition-all shadow-xs hover:scale-105"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 50 50"
                  className="fill-current text-white group-hover:text-amber-200 transition"
                >
                  <path d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z" />
                </svg>
              </a>

              {/* Publons SVG */}
              <a
                href={publonsUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Publons / Web of Science Profile"
                className="group relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 hover:bg-[#85261e] border border-white/15 hover:border-amber-400/50 text-white transition-all shadow-xs hover:scale-105"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="18"
                  viewBox="0 0 320 512"
                  className="fill-current text-white group-hover:text-amber-200 transition"
                >
                  <path d="M282.067 122.981c-3.221-7.856-7.836-15.067-12.993-21.776c-12.29-15.522-28.523-28.691-47.878-33.997c-29.087-8.043-61.327-.414-85.05 17.843c-5.098 3.864-9.623 8.389-13.812 13.2c-2.006-10.384-2.628-21.005-4.98-31.31c-1.205-1.294-2.372-3.23-4.446-2.905c-5.158.1-9.948 2.272-14.643 4.19c-20.224 8.793-40.38 17.724-60.594 26.507c-2.135 1.017-4.803 1.542-6.167 3.667c-.445 2.846-.414 5.8-.03 8.656c1.226 2.805 4.278 4.088 6.76 5.6c6.52 3.666 13.546 6.678 19.266 11.61c5.138 4.228 7.854 10.73 8.32 17.27c.206 2.165.277 4.338.286 6.52c-.019 79.378.012 158.766-.019 238.144c-.513 10.029.14 20.146-1.472 30.095c-.83 4.683-3.517 9.92-8.635 10.848c-7.668.591-15.404-.287-23.06.395c-2.046.078-2.766 2.302-2.639 4.02c.02 4.565-.128 9.14.079 13.714c-.01 1.254 1.353 1.848 2.056 2.707c14.306-.374 28.603-1.413 42.909-1.58c27.347-.533 54.715-.05 82.015 1.6c2.144.01 5.523.039 5.996-2.677c.426-4.882.367-9.83.04-14.703c-.04-2.164-2.243-3.192-4.12-3.192c-5.909-.305-11.816-.038-17.725-.099c-3.437-.09-7.173.414-10.304-1.334c-3.122-1.897-4.21-5.691-5.05-9.021c-2.49-12.47-1.57-25.264-2.035-37.892c-.307-28.069-.73-56.14-.83-84.218c11.619 5.237 24.237 7.964 36.893 9.08c21.984 2.114 44.639-2.233 64.034-12.873c24.434-13.122 43.188-35.511 53.778-60.962c8.389-19.95 12.083-41.724 11.709-63.313c-.072-14.875-1.851-30.002-7.66-43.815z" />
                </svg>
              </a>

              {/* ResearchGate Text Badge */}
              <a
                href={researchGateUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="ResearchGate Profile"
                className="inline-flex items-center px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-[#85261e] border border-white/15 hover:border-amber-400/50 text-white text-xs font-bold transition-all shadow-xs hover:scale-105"
              >
                RG
              </a>

              {/* Vidwan Badge */}
              <a
                href={vidwanUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="INFLIBNET Vidwan Profile"
                className="inline-flex items-center px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-[#85261e] border border-white/15 hover:border-amber-400/50 text-white text-xs font-bold transition-all shadow-xs hover:scale-105"
              >
                Vidwan
              </a>

              {/* Faculty Portal Login Link or Dashboard */}
              {canEdit ? (
                <Link
                  href="/faculty"
                  className="inline-flex items-center gap-1.5 bg-[#85261e] hover:bg-[#33110e] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition cursor-pointer ml-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                  <span>Faculty Dashboard</span>
                </Link>
              ) : (
                <Link
                  href="/faculty/login"
                  className="inline-flex items-center gap-1.5 bg-white hover:bg-neutral-100 text-[#1f1412] px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition cursor-pointer ml-1"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#85261e]" />
                  <span>Faculty Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. MNIT-STYLE RESEARCH IMPACT METRICS STRIP */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-20">
        <div className="bg-white rounded-2xl border border-[#eedfd8] shadow-md p-3 sm:p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {[
              { label: "Journals", count: journalCount, tab: "journal" as TabKey, icon: BookOpen, color: "text-[#85261e] bg-[#fcf2ef]" },
              { label: "Conferences", count: conferenceCount, tab: "conference" as TabKey, icon: Presentation, color: "text-amber-700 bg-amber-50" },
              { label: "Patents", count: patentCount, tab: "patents" as TabKey, icon: Lightbulb, color: "text-indigo-700 bg-indigo-50" },
              { label: "Projects", count: projectCount, tab: "projects" as TabKey, icon: Briefcase, color: "text-emerald-700 bg-emerald-50" },
              { label: "PhD Guided", count: phdSupervisedCount, tab: "researchSupervision" as TabKey, icon: GraduationCap, color: "text-blue-700 bg-blue-50" },
              { label: "Consultancies", count: consultancyCount, tab: "consultancies" as TabKey, icon: Building2, color: "text-purple-700 bg-purple-50" },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              const isSelected = activeTab === stat.tab;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setActiveTab(stat.tab);
                    setSelectedYear("ALL");
                    setPubSearch("");
                  }}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#85261e] bg-[#fff9f6] shadow-sm ring-1 ring-[#85261e]/30"
                      : "border-neutral-100 hover:border-[#eedfd8] hover:bg-neutral-50"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xl sm:text-2xl font-black text-neutral-900 leading-tight">
                      {stat.count}
                    </div>
                    <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider truncate">
                      {stat.label}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. MAIN LAYOUT: OPTIONS TO THE LEFT (PublicSidebar architecture) + MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* A. LEFT OPTIONS NAVIGATION SIDEBAR */}
          <aside className="lg:col-span-3 bg-white rounded-2xl border border-[#eedfd8] shadow-xs overflow-hidden lg:sticky lg:top-16">
            <div className="p-3.5 bg-[#fdf5f2] border-b border-[#eedfd8] flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-[#33110e] uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#85261e]" />
                Portfolio Navigation
              </span>
              <span className="text-xs font-mono text-[#85261e] font-semibold bg-white px-2.5 py-0.5 rounded-full border border-[#eedfd8]">
                15 Sections
              </span>
            </div>

            <nav className="p-2.5 space-y-1.5 max-h-[75vh] overflow-y-auto no-scrollbar">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.key);
                      setSelectedYear("ALL");
                      setPubSearch("");
                      setCurrentPage(1);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer text-left ${
                      isActive
                        ? "bg-[#85261e] text-white shadow-xs"
                        : "text-neutral-700 hover:bg-[#fff9f6] hover:text-[#85261e]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-amber-300" : "text-neutral-400"}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {typeof item.count === "number" && (
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full shrink-0 ml-1.5 ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-neutral-100 text-neutral-600 group-hover:bg-[#eedfd8]"
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* B. MAIN DISPLAY PANE WITH DYNAMIC ACTIONS & TABLES */}
          <main className="lg:col-span-9 space-y-5">
            
            {/* Top Action Bar for Current Tab: Title + Dynamic "+ Add / Edit" Button */}
            <div className="bg-white rounded-2xl border border-[#eedfd8] p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#33110e] flex items-center gap-2">
                  {activeTab === "facultyInfo" && "Faculty Information & Credentials"}
                  {activeTab === "journal" && "Journal Publications"}
                  {activeTab === "conference" && "Conference Proceedings"}
                  {activeTab === "book" && "Books Authored & Edited"}
                  {activeTab === "book_chapter" && "Book Chapters Contributed"}
                  {activeTab === "patents" && "Patents & Intellectual Property"}
                  {activeTab === "projects" && "Sponsored Research Projects"}
                  {activeTab === "events" && "Conferences, STCs & FDPs Organized"}
                  {activeTab === "consultancies" && "Industrial Consultancies"}
                  {activeTab === "experttalk" && "Keynote Lectures & Expert Talks"}
                  {activeTab === "researchSupervision" && "Research Scholar Supervision"}
                  {activeTab === "administrativeexperience" && "Administrative Experience"}
                  {activeTab === "honors" && "Honors & Recognitions Achieved"}
                  {activeTab === "internationalAndNationalExposure" && "International & National Exposure"}
                  {activeTab === "courses" && "Curriculum Teaching & Courses Assigned"}
                </h2>
                <p className="text-sm text-neutral-500 mt-0.5">
                  {activeTab === "facultyInfo"
                    ? "Official profile details, verified credentials, and institutional information"
                    : activeTab === "courses"
                    ? `Curriculum allocations and weekly teaching hours for ${faculty.full_name}`
                    : `Active records verified for ${faculty.full_name}`}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {canEdit ? (
                  activeTab === "courses" ? (
                    <Link
                      href="/faculty/courses"
                      className="inline-flex items-center gap-2 bg-[#85261e] hover:bg-[#33110e] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-xs hover:shadow-md transition cursor-pointer"
                    >
                      <BookOpenCheck className="w-4 h-4 text-amber-300" />
                      <span>Faculty Timetable</span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={openAddModal}
                      className="inline-flex items-center gap-2 bg-[#85261e] hover:bg-[#33110e] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-xs hover:shadow-md transition cursor-pointer"
                    >
                      {activeTab === "facultyInfo" ? (
                        <>
                          <Edit className="w-4 h-4 text-amber-300" />
                          <span>Edit Profile</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 text-amber-300" />
                          <span>Add {sidebarItems.find((i) => i.key === activeTab)?.label}</span>
                        </>
                      )}
                    </button>
                  )
                ) : (
                  <Link
                    href="/faculty/export"
                    className="inline-flex items-center gap-2 bg-[#fff9f6] hover:bg-[#85261e] hover:text-white text-[#85261e] border border-[#eedfd8] px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-500" />
                    <span>Download CV</span>
                  </Link>
                )}
              </div>
            </div>

            {/* 1. FACULTY INFO TAB */}
            {activeTab === "facultyInfo" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-[#eedfd8] shadow-xs p-6">
                  <div className="flex items-center justify-between border-b border-[#eedfd8] pb-4 mb-5">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-[#33110e]">Core Institutional Credentials</h3>
                      <p className="text-sm text-neutral-500">Official academic appointment and contact channels</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 bg-[#fcf2ef] text-[#85261e] text-sm font-bold px-3.5 py-1.5 rounded-full border border-[#eedfd8]">
                      <UserCheck className="w-4 h-4" />
                      Verified
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="p-4 rounded-xl bg-[#faf8f6] border border-[#eedfd8]/70 space-y-1">
                      <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Full Name</span>
                      <p className="text-base font-semibold text-neutral-900">{faculty.full_name}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#faf8f6] border border-[#eedfd8]/70 space-y-1">
                      <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Designation</span>
                      <p className="text-base font-semibold text-[#85261e]">{faculty.designation}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#faf8f6] border border-[#eedfd8]/70 space-y-1">
                      <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Department</span>
                      <p className="text-base font-semibold text-neutral-900">{facultyDeptName} ({facultyDeptCode})</p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#faf8f6] border border-[#eedfd8]/70 space-y-1">
                      <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Highest Qualification</span>
                      <p className="text-base font-semibold text-neutral-900">{highestQualification}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#faf8f6] border border-[#eedfd8]/70 space-y-1">
                      <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Teaching Experience</span>
                      <p className="text-base font-semibold text-neutral-900">{netTeachingExpText}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#faf8f6] border border-[#eedfd8]/70 space-y-1">
                      <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Contact Phone</span>
                      <p className="text-base font-semibold text-neutral-900">{faculty.phone || "+91-1972-254400"}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#faf8f6] border border-[#eedfd8]/70 space-y-1 md:col-span-2">
                      <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Official Email Address</span>
                      <p className="text-base font-semibold text-[#85261e]">{faculty.email}</p>
                    </div>
                  </div>
                </div>

                {/* Specializations & Bio */}
                <div className="bg-white rounded-2xl border border-[#eedfd8] shadow-xs p-6">
                  <h3 className="text-lg font-bold text-[#33110e] mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    Specialization &amp; Research Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(faculty.research_interests || ["Computer Science & Engineering"]).map((interest: string, idx: number) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-sm font-semibold bg-[#fff9f6] text-[#85261e] border border-[#eedfd8]"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>

                  {faculty.bio && (
                    <div className="mt-5 pt-4 border-t border-neutral-100">
                      <h4 className="text-sm font-bold text-neutral-600 uppercase tracking-wider mb-2">Faculty Biography</h4>
                      <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">{faculty.bio}</p>
                    </div>
                  )}
                </div>

                {/* Research Output & Career Visualizations */}
                <div className="bg-white rounded-2xl border border-[#eedfd8] shadow-xs p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#eedfd8] gap-2">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-[#33110e] flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-[#85261e]" />
                        Scholarly Output &amp; Research Visualizations
                      </h3>
                      <p className="text-sm text-neutral-500">Career research trajectory, indexed publications, and grants</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] px-3.5 py-1.5 rounded-full text-xs font-bold self-start sm:self-auto">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Interactive Analytics
                    </span>
                  </div>

                  {/* Scholarly Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 rounded-xl bg-[#faf8f6] border border-[#eedfd8] text-center">
                      <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">Publications</span>
                      <span className="text-2xl sm:text-3xl font-black text-[#85261e]">{allFacultyPubs.length}</span>
                      <span className="text-[11px] text-neutral-500 block mt-1">{sciIndexedCount} SCI · {scopusIndexedCount} Scopus</span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#faf8f6] border border-[#eedfd8] text-center">
                      <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">R&amp;D Projects</span>
                      <span className="text-2xl sm:text-3xl font-black text-[#0d9488]">
                        {totalProjectGrantsAmount >= 10000000
                          ? `₹${(totalProjectGrantsAmount / 10000000).toFixed(1)}Cr`
                          : totalProjectGrantsAmount >= 100000
                          ? `₹${(totalProjectGrantsAmount / 100000).toFixed(0)}L`
                          : `₹${totalProjectGrantsAmount.toLocaleString("en-IN")}`}
                      </span>
                      <span className="text-[11px] text-neutral-500 block mt-1">{allFacultyProjects.length} Sponsored Grants</span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#faf8f6] border border-[#eedfd8] text-center">
                      <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">Patents</span>
                      <span className="text-2xl sm:text-3xl font-black text-amber-600">{allFacultyPatents.length}</span>
                      <span className="text-[11px] text-neutral-500 block mt-1">
                        {allFacultyPatents.filter((pt: any) => (pt.status || "").toLowerCase().includes("grant")).length} Granted
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#faf8f6] border border-[#eedfd8] text-center">
                      <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">Ph.D. Scholars</span>
                      <span className="text-2xl sm:text-3xl font-black text-indigo-600">{phdSupervisedCount}</span>
                      <span className="text-[11px] text-neutral-500 block mt-1">Guided / Defended</span>
                    </div>
                  </div>

                  {/* Visual Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 pt-1">
                    {/* Publication Output Timeline */}
                    <div className="lg:col-span-3 bg-[#faf8f6] rounded-xl p-4 border border-[#eedfd8]/80">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-bold text-[#33110e] uppercase tracking-wider flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-[#85261e]" />
                          Publication Output Over Recent Years
                        </h4>
                        <span className="text-[11px] text-neutral-400">Journals, Conferences &amp; Books</span>
                      </div>
                      {facultyPubsTimeline.length > 0 ? (
                        <div className="h-56 w-full">
                          <RechartsResponsiveContainer width="100%" height="100%">
                            <RechartsBarChart data={facultyPubsTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                              <RechartsCartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eedfd8" opacity={0.6} />
                              <RechartsXAxis dataKey="year" stroke="#78716c" fontSize={11} tickLine={false} />
                              <RechartsYAxis stroke="#78716c" fontSize={11} tickLine={false} allowDecimals={false} />
                              <RechartsTooltip
                                contentStyle={{
                                  backgroundColor: "#33110e",
                                  borderColor: "#eedfd8",
                                  borderRadius: "10px",
                                  color: "#fff",
                                  fontSize: "12px",
                                }}
                              />
                              <RechartsBar dataKey="journal" name="Journals" fill="#85261e" stackId="a" radius={[0, 0, 0, 0]} />
                              <RechartsBar dataKey="conference" name="Conferences" fill="#c85a44" stackId="a" radius={[0, 0, 0, 0]} />
                              <RechartsBar dataKey="book" name="Books" fill="#d97706" stackId="a" radius={[3, 3, 0, 0]} />
                            </RechartsBarChart>
                          </RechartsResponsiveContainer>
                        </div>
                      ) : (
                        <div className="h-56 flex items-center justify-center text-xs text-neutral-400">
                          No publication timeline records found
                        </div>
                      )}
                    </div>

                    {/* Scholarly Portfolio Mix */}
                    <div className="lg:col-span-2 bg-[#faf8f6] rounded-xl p-4 border border-[#eedfd8]/80 flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-bold text-[#33110e] uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          Scholarly Distribution Mix
                        </h4>
                      </div>
                      {facultyResearchMix.length > 0 ? (
                        <div className="h-44 w-full">
                          <RechartsResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                              <RechartsPie
                                data={facultyResearchMix}
                                cx="50%"
                                cy="50%"
                                innerRadius={36}
                                outerRadius={60}
                                paddingAngle={3}
                                dataKey="value"
                              >
                                {facultyResearchMix.map((entry, index) => (
                                  <RechartsCell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={1} />
                                ))}
                              </RechartsPie>
                              <RechartsTooltip
                                contentStyle={{
                                  backgroundColor: "#33110e",
                                  borderColor: "#eedfd8",
                                  borderRadius: "10px",
                                  color: "#fff",
                                  fontSize: "12px",
                                }}
                              />
                            </RechartsPieChart>
                          </RechartsResponsiveContainer>
                        </div>
                      ) : (
                        <div className="h-44 flex items-center justify-center text-xs text-neutral-400">
                          No scholarly distribution records available
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-[#eedfd8]/60 text-[11px]">
                        {facultyResearchMix.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                            <span className="text-neutral-600 truncate">{item.name}:</span>
                            <span className="font-bold text-neutral-900">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Educational Qualifications Table */}
                <div className="bg-white rounded-2xl border border-[#eedfd8] shadow-xs overflow-hidden">
                  <div className="p-4 bg-[#fdf5f2] border-b border-[#eedfd8] flex items-center justify-between">
                    <h3 className="text-base font-bold text-[#33110e] flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-[#85261e]" />
                      Educational Qualifications
                    </h3>
                    <span className="text-sm font-semibold text-neutral-500">{allQualifications.length} Degree(s)</span>
                  </div>
                  {allQualifications.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm border-collapse">
                        <thead>
                          <tr className="bg-neutral-50 border-b border-[#eedfd8] text-neutral-700 font-bold uppercase tracking-wider text-xs">
                            <th className="p-3.5 w-16 text-center">Sr.</th>
                            <th className="p-3.5">Degree</th>
                            <th className="p-3.5">Institution / University</th>
                            <th className="p-3.5 w-32 text-center">Year</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          {allQualifications.map((q: any, idx: number) => (
                            <tr key={idx} className={idx % 2 === 1 ? "bg-[#fffaf8]" : "bg-white"}>
                              <td className="p-3.5 text-center text-neutral-500 font-mono text-sm">{idx + 1}</td>
                              <td className="p-3.5 font-bold text-[#85261e] text-base">{q.degree || q.nameOfDegree}</td>
                              <td className="p-3.5 text-neutral-800 font-medium text-sm">{q.institute || q.university || "—"}</td>
                              <td className="p-3.5 text-center text-neutral-700 font-semibold text-sm">{q.year || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-sm text-neutral-500">
                      No qualification records added yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. PUBLICATIONS TABS (Journal, Conference, Book, Book Chapter) */}
            {(activeTab === "journal" || activeTab === "conference" || activeTab === "book" || activeTab === "book_chapter") && (
              <div className="space-y-4">
                {/* Search & Year Filtering */}
                <div className="bg-white rounded-2xl border border-[#eedfd8] p-4 shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="relative w-full sm:w-80">
                      <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search publications by title, author, venue..."
                        value={pubSearch}
                        onChange={(e) => {
                          setPubSearch(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-full pl-9 pr-3.5 py-2 text-sm rounded-xl border border-[#eedfd8] focus:outline-none focus:ring-1 focus:ring-[#85261e] bg-[#faf8f6]"
                      />
                    </div>
                    <span className="text-sm font-medium text-neutral-500">
                      {filteredPubs.length} publication(s) match
                    </span>
                  </div>

                  {pubYears.length > 0 && (
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-sm">
                      <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
                        <Filter className="w-3.5 h-3.5" /> Filter Year:
                      </span>
                      <button
                        type="button"
                        onClick={() => { setSelectedYear("ALL"); setCurrentPage(1); }}
                        className={`px-3.5 py-1 rounded-full text-xs font-bold transition shrink-0 cursor-pointer ${
                          selectedYear === "ALL"
                            ? "bg-[#33110e] text-white"
                            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                        }`}
                      >
                        All ({currentPubList.length})
                      </button>
                      {pubYears.map((year) => {
                        const count = currentPubList.filter((p) => Number(p.year) === year).length;
                        return (
                          <button
                            key={year}
                            type="button"
                            onClick={() => { setSelectedYear(String(year)); setCurrentPage(1); }}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition shrink-0 cursor-pointer ${
                              selectedYear === String(year)
                                ? "bg-[#85261e] text-white"
                                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                            }`}
                          >
                            {year} ({count})
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Publications Table with Details & Actions (tempcsebase design) */}
                <div className="bg-white rounded-2xl border border-[#eedfd8] shadow-xs overflow-hidden">
                  {paginatedPubs.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm border-collapse">
                        <thead>
                          <tr className="bg-[#1f1412] text-white uppercase text-xs font-bold tracking-wider">
                            <th className="p-3.5 w-14 text-center border-r border-neutral-700">Sr.</th>
                            <th className="p-3.5 border-r border-neutral-700 min-w-[320px]">Publication Details</th>
                            <th className="p-3.5 w-24 text-center border-r border-neutral-700">Year</th>
                            <th className="p-3.5 w-32 text-center border-r border-neutral-700">Indexing</th>
                            <th className="p-3.5 w-36 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#eedfd8]/60">
                          {paginatedPubs.map((pub: any, idx: number) => {
                            const isExpanded = expandedAbstractId === pub.id;
                            const isCopied = copiedId === pub.id;
                            const serial = (currentPage - 1) * PUBS_PER_PAGE + idx + 1;
                            return (
                              <tr key={pub.id || idx} className={idx % 2 === 1 ? "bg-[#fffaf8]" : "bg-white"}>
                                <td className="p-3.5 text-center text-neutral-500 font-mono font-bold align-top text-sm">
                                  {serial}
                                </td>

                                <td className="p-3.5 align-top space-y-1.5">
                                  <div className="text-sm font-semibold text-[#800000] leading-snug">
                                    {pub.author_text || pub.raw_authors || faculty.full_name}
                                  </div>

                                  {Array.isArray(pub.associated_faculty) && pub.associated_faculty.length > 0 && (
                                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                      <span className="text-xs font-bold text-[#85261e] flex items-center gap-1">
                                        <Users className="w-3 h-3" /> Co-Authors:
                                      </span>
                                      {pub.associated_faculty.map((co: any, ci: number) => (
                                        <Link
                                          key={ci}
                                          href={`/people/faculty/${co.employee_code || co.code || co.id}`}
                                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-[#eedfd8]/60 text-[#85261e] hover:bg-[#85261e] hover:text-white transition"
                                        >
                                          <span>{co.full_name || co.name}</span>
                                        </Link>
                                      ))}
                                    </div>
                                  )}

                                  <div className="text-base font-bold text-neutral-900 leading-snug">
                                    "{pub.title}"
                                  </div>

                                  <div className="text-sm text-[#0f376f] font-semibold italic">
                                    {pub.journal_or_conference_name || pub.venue_name || "Academic Publication"}
                                    {pub.volume && `, Vol: ${pub.volume}`}
                                    {pub.issue && `, Issue: ${pub.issue}`}
                                    {pub.page_range && `, pp. ${pub.page_range}`}
                                    {pub.pages && !pub.page_range && `, pp. ${pub.pages}`}
                                  </div>

                                  {pub.doi && (
                                    <div className="text-xs text-neutral-500">
                                      <a
                                        href={pub.doi.startsWith("http") ? pub.doi : `https://doi.org/${pub.doi}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-[#85261e] hover:underline"
                                      >
                                        <ExternalLink className="w-3 h-3" />
                                        <span>DOI: {pub.doi}</span>
                                      </a>
                                    </div>
                                  )}

                                  {pub.abstract_text && (
                                    <div className="pt-1">
                                      <button
                                        type="button"
                                        onClick={() => setExpandedAbstractId(isExpanded ? null : pub.id)}
                                        className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 inline-flex items-center gap-1"
                                      >
                                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                        <span>{isExpanded ? "Hide Abstract" : "View Abstract"}</span>
                                      </button>
                                      {isExpanded && (
                                        <p className="mt-1.5 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-700 text-xs leading-relaxed">
                                          {pub.abstract_text}
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </td>

                                <td className="p-3.5 text-center align-top space-y-1">
                                  <div className="font-bold text-neutral-800 text-sm">
                                    {pub.year || "—"}
                                  </div>
                                  {pub.month && (
                                    <div className="text-xs text-neutral-500 font-semibold">
                                      {MONTH_OPTIONS.find((m) => m.value === Number(pub.month))?.label || pub.month}
                                    </div>
                                  )}
                                  {pub.academic_session && (
                                    <div className="inline-block px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 text-xs font-mono font-medium">
                                      {pub.academic_session}
                                    </div>
                                  )}
                                </td>

                                <td className="p-3.5 text-center align-top space-y-1">
                                  {pub.indexing && (
                                    <span className="inline-block px-2.5 py-1 rounded bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold">
                                      {pub.indexing}
                                    </span>
                                  )}
                                  {pub.is_scopus && pub.indexing !== "Scopus" && (
                                    <span className="inline-block px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                                      Scopus
                                    </span>
                                  )}
                                  {pub.is_sci && pub.indexing !== "SCI" && pub.indexing !== "SCI(E)" && (
                                    <span className="inline-block px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                                      SCI
                                    </span>
                                  )}
                                  {pub.journal_quartile && (
                                    <span className="inline-block px-2.5 py-1 rounded bg-purple-50 text-purple-800 border border-purple-200 text-xs font-bold">
                                      {pub.journal_quartile === "T" ? "T (Temp)" : `Q${pub.journal_quartile}`}
                                    </span>
                                  )}
                                  {!pub.indexing && !pub.is_scopus && !pub.is_sci && (
                                    <span className="text-neutral-400 text-xs">—</span>
                                  )}
                                </td>

                                  <td className="p-3.5 text-center align-top space-y-1.5">
                                    {/* Details Button (tempcsebase PublicationsModal) */}
                                    <button
                                      type="button"
                                      onClick={() => openDetails(pub)}
                                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] hover:bg-[#85261e] hover:text-white transition font-bold text-xs cursor-pointer shadow-2xs"
                                    >
                                      <Info className="w-3.5 h-3.5" />
                                      <span>Details</span>
                                    </button>

                                    <div className="flex items-center gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => copyCitation(pub)}
                                        className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl bg-neutral-100 hover:bg-[#85261e] hover:text-white text-neutral-700 transition font-bold text-xs cursor-pointer"
                                        title="Copy Citation"
                                      >
                                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                        <span>Cite</span>
                                      </button>

                                      {canEdit && (
                                        <>
                                          <button
                                            type="button"
                                            onClick={() => openEditModal(pub)}
                                            className="p-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition cursor-pointer"
                                            title="Edit Record"
                                          >
                                            <Edit className="w-3.5 h-3.5" />
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() => handleDeleteRecord(pub)}
                                            className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                                            title="Delete Record"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-12 text-center space-y-2">
                      <BookOpen className="w-8 h-8 text-neutral-300 mx-auto" />
                      <p className="text-sm font-bold text-neutral-600">No records found matching your filters</p>
                      <button
                        type="button"
                        onClick={() => { setSelectedYear("ALL"); setPubSearch(""); }}
                        className="text-sm text-[#85261e] font-semibold hover:underline cursor-pointer"
                      >
                        Reset filters
                      </button>
                    </div>
                  )}

                  {totalPages > 1 && (
                    <div className="p-4 bg-[#fdf5f2] border-t border-[#eedfd8] flex items-center justify-between text-sm">
                      <span className="text-neutral-600 font-semibold text-sm">
                        Page {currentPage} of {totalPages} ({filteredPubs.length} items)
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          className="px-3.5 py-1.5 rounded-xl border border-[#eedfd8] bg-white text-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50 font-semibold text-sm cursor-pointer"
                        >
                          Prev
                        </button>
                        <button
                          type="button"
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          className="px-3.5 py-1.5 rounded-xl border border-[#eedfd8] bg-white text-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50 font-semibold text-sm cursor-pointer"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 6. PATENTS TAB */}
            {activeTab === "patents" && (
              <div className="bg-white rounded-2xl border border-[#eedfd8] shadow-xs overflow-hidden">
                <div className="p-4 bg-[#fdf5f2] border-b border-[#eedfd8] flex items-center justify-between">
                  <span className="text-sm sm:text-base font-bold text-[#33110e] flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-600" />
                    Intellectual Property Register ({allFacultyPatents.length})
                  </span>
                </div>
                {allFacultyPatents.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-[#1f1412] text-white uppercase text-xs font-bold tracking-wider">
                          <th className="p-3.5 w-14 text-center border-r border-neutral-700">Sr.</th>
                          <th className="p-3.5 border-r border-neutral-700">Patent Title</th>
                          <th className="p-3.5 w-40 border-r border-neutral-700">Application No.</th>
                          <th className="p-3.5 w-32 text-center border-r border-neutral-700">Status</th>
                          <th className="p-3.5 w-28 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#eedfd8]/60">
                        {allFacultyPatents.map((pat: any, idx: number) => {
                          const isGranted = (pat.status || "").toLowerCase().includes("grant");
                          return (
                            <tr key={pat.id || idx} className={idx % 2 === 1 ? "bg-[#fffaf8]" : "bg-white"}>
                              <td className="p-3.5 text-center text-neutral-500 font-mono font-bold align-top text-sm">
                                {idx + 1}
                              </td>
                              <td className="p-3.5 align-top space-y-1.5">
                                <div className="font-bold text-neutral-900 leading-snug text-base">{pat.title}</div>
                                <div className="text-xs text-neutral-500">
                                  Inventors: {pat.raw_inventors || faculty.full_name}
                                </div>
                                {pat.patent_office && (
                                  <div className="text-xs text-neutral-400">
                                    Office: {pat.patent_office} ({pat.country || "India"})
                                  </div>
                                )}
                              </td>
                              <td className="p-3.5 align-top font-mono text-neutral-700 font-semibold text-sm">
                                {pat.application_number || pat.patent_number || "—"}
                              </td>
                              <td className="p-3.5 text-center align-top">
                                <span
                                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                    isGranted
                                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                      : "bg-amber-100 text-amber-800 border border-amber-300"
                                  }`}
                                >
                                  {pat.status || "Published"}
                                </span>
                              </td>
                              <td className="p-3.5 text-center align-top space-y-1.5">
                                <button
                                  type="button"
                                  onClick={() => openDetails(pat)}
                                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] hover:bg-[#85261e] hover:text-white transition font-bold text-xs cursor-pointer shadow-2xs"
                                >
                                  <Info className="w-3.5 h-3.5" /> Details
                                </button>
                                {canEdit && (
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => openEditModal(pat)}
                                      className="p-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition cursor-pointer"
                                      title="Edit Record"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteRecord(pat)}
                                      className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                                      title="Delete Record"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-12 text-center text-neutral-500 text-sm">
                    {canEdit
                      ? 'No patent records listed. Click "+ Add Patents" to register a patent.'
                      : "No patent records listed for this faculty member."}
                  </div>
                )}
              </div>
            )}

            {/* 7. PROJECTS TAB */}
            {activeTab === "projects" && (
              <div className="bg-white rounded-2xl border border-[#eedfd8] shadow-xs overflow-hidden">
                <div className="p-4 bg-[#fdf5f2] border-b border-[#eedfd8] flex items-center justify-between">
                  <span className="text-sm sm:text-base font-bold text-[#33110e] flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-emerald-700" />
                    Sponsored Projects Register ({allFacultyProjects.length})
                  </span>
                </div>
                {allFacultyProjects.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-[#1f1412] text-white uppercase text-xs font-bold tracking-wider">
                          <th className="p-3.5 w-14 text-center border-r border-neutral-700">Sr.</th>
                          <th className="p-3.5 border-r border-neutral-700 min-w-[280px]">Project Title</th>
                          <th className="p-3.5 border-r border-neutral-700">Sponsoring Agency</th>
                          <th className="p-3.5 w-32 text-center border-r border-neutral-700">Amount (INR)</th>
                          <th className="p-3.5 w-28 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#eedfd8]/60">
                        {allFacultyProjects.map((prj: any, idx: number) => (
                          <tr key={prj.id || idx} className={idx % 2 === 1 ? "bg-[#fffaf8]" : "bg-white"}>
                            <td className="p-3.5 text-center text-neutral-500 font-mono font-bold align-top text-sm">
                              {idx + 1}
                            </td>
                            <td className="p-3.5 align-top space-y-1.5">
                              <div className="font-bold text-neutral-900 leading-snug text-base">{prj.title}</div>
                              <div className="text-xs text-neutral-500">
                                Investigators: {prj.raw_investigators || faculty.full_name}
                              </div>
                            </td>
                            <td className="p-3.5 align-top font-semibold text-[#85261e] text-sm">
                              {prj.funding_agency || "DST-SERB"}
                            </td>
                            <td className="p-3.5 text-center align-top font-bold text-neutral-900 text-sm">
                              {prj.total_sanctioned_amount ? `₹ ${(prj.total_sanctioned_amount / 100000).toFixed(1)} L` : "—"}
                            </td>
                            <td className="p-3.5 text-center align-top space-y-1.5">
                              <button
                                type="button"
                                onClick={() => openDetails(prj)}
                                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] hover:bg-[#85261e] hover:text-white transition font-bold text-xs cursor-pointer shadow-2xs"
                              >
                                <Info className="w-3.5 h-3.5" /> Details
                              </button>
                              {canEdit && (
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => openEditModal(prj)}
                                    className="p-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition cursor-pointer"
                                    title="Edit Record"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteRecord(prj)}
                                    className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                                    title="Delete Record"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-12 text-center text-neutral-500 text-sm">
                    {canEdit
                      ? 'No sponsored projects listed. Click "+ Add Projects" to register one.'
                      : "No sponsored projects listed for this faculty member."}
                  </div>
                )}
              </div>
            )}

            {/* 8. EVENTS TAB */}
            {activeTab === "events" && (
              <div className="bg-white rounded-2xl border border-[#eedfd8] shadow-xs overflow-hidden">
                <div className="p-4 bg-[#fdf5f2] border-b border-[#eedfd8] flex items-center justify-between">
                  <span className="text-sm sm:text-base font-bold text-[#33110e] flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    Organized Academic Events ({allEvents.length})
                  </span>
                </div>
                {allEvents.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-[#1f1412] text-white uppercase text-xs font-bold tracking-wider">
                          <th className="p-3.5 w-14 text-center border-r border-neutral-700">Sr.</th>
                          <th className="p-3.5 border-r border-neutral-700 min-w-[260px]">Event Title</th>
                          <th className="p-3.5 w-36 border-r border-neutral-700">Role</th>
                          <th className="p-3.5 border-r border-neutral-700">Venue &amp; Dates</th>
                          <th className="p-3.5 w-28 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#eedfd8]/60">
                        {allEvents.map((evt: any, idx: number) => (
                          <tr key={evt.id || idx} className={idx % 2 === 1 ? "bg-[#fffaf8]" : "bg-white"}>
                            <td className="p-3.5 text-center text-neutral-500 font-mono font-bold align-top text-sm">
                              {idx + 1}
                            </td>
                            <td className="p-3.5 align-top space-y-1.5">
                              <div className="font-bold text-neutral-900 leading-snug text-base">{evt.title}</div>
                              <div className="text-xs text-neutral-500">Type: {evt.event_type || "FDP / STC"}</div>
                            </td>
                            <td className="p-3.5 align-top font-bold text-[#85261e] text-sm">
                              {evt.convenor || "Convenor"}
                            </td>
                            <td className="p-3.5 align-top text-neutral-700 text-sm">
                              <div className="font-semibold text-neutral-900">{evt.venue || "NIT Hamirpur"}</div>
                              <div className="text-xs text-neutral-500">{evt.start_date} to {evt.end_date}</div>
                            </td>
                            <td className="p-3.5 text-center align-top space-y-1.5">
                              <button
                                type="button"
                                onClick={() => openDetails(evt)}
                                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] hover:bg-[#85261e] hover:text-white transition font-bold text-xs cursor-pointer shadow-2xs"
                              >
                                <Info className="w-3.5 h-3.5" /> Details
                              </button>
                              {canEdit && (
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => openEditModal(evt)}
                                    className="p-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition cursor-pointer"
                                    title="Edit Record"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteRecord(evt)}
                                    className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                                    title="Delete Record"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-12 text-center text-neutral-500 text-sm">
                    No event records listed.
                  </div>
                )}
              </div>
            )}

            {/* 9. CONSULTANCIES TAB (tempcsebase consultancies view) */}
            {activeTab === "consultancies" && (
              <div className="bg-white rounded-2xl border border-[#eedfd8] shadow-xs overflow-hidden">
                <div className="p-4 bg-[#fdf5f2] border-b border-[#eedfd8] flex items-center justify-between">
                  <span className="text-sm sm:text-base font-bold text-[#33110e] flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-purple-700" />
                    Industrial Consultancies ({allConsultancies.length})
                  </span>
                </div>
                {allConsultancies.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-[#1f1412] text-white uppercase text-xs font-bold tracking-wider">
                          <th className="p-3.5 w-14 text-center border-r border-neutral-700">Sr.</th>
                          <th className="p-3.5 border-r border-neutral-700 min-w-[260px]">Consultancy Title</th>
                          <th className="p-3.5 border-r border-neutral-700">Client Organization</th>
                          <th className="p-3.5 w-36 text-center border-r border-neutral-700">Amount (INR)</th>
                          <th className="p-3.5 w-28 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#eedfd8]/60">
                        {allConsultancies.map((c: any, idx: number) => (
                          <tr key={c.id || idx} className={idx % 2 === 1 ? "bg-[#fffaf8]" : "bg-white"}>
                            <td className="p-3.5 text-center text-neutral-500 font-mono font-bold align-top text-sm">
                              {idx + 1}
                            </td>
                            <td className="p-3.5 align-top space-y-1.5">
                              <div className="font-bold text-neutral-900 leading-snug text-base">{c.title}</div>
                              <div className="text-xs text-neutral-500">Investigators: {c.author_text || faculty.full_name}</div>
                            </td>
                            <td className="p-3.5 align-top font-semibold text-[#85261e] text-sm">
                              {c.client_organisation}
                            </td>
                            <td className="p-3.5 text-center align-top font-bold text-neutral-900 text-sm">
                              {c.amount ? `₹ ${Number(c.amount).toLocaleString("en-IN")}` : "—"}
                            </td>
                            <td className="p-3.5 text-center align-top space-y-1.5">
                              <button
                                type="button"
                                onClick={() => openDetails(c)}
                                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] hover:bg-[#85261e] hover:text-white transition font-bold text-xs cursor-pointer shadow-2xs"
                              >
                                <Info className="w-3.5 h-3.5" /> Details
                              </button>
                              {canEdit && (
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => openEditModal(c)}
                                    className="p-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition cursor-pointer"
                                    title="Edit Record"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteRecord(c)}
                                    className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                                    title="Delete Record"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-12 text-center text-neutral-500 text-sm">
                    No consultancy projects listed.
                  </div>
                )}
              </div>
            )}

            {/* 10. EXPERT TALK TAB */}
            {activeTab === "experttalk" && (
              <div className="bg-white rounded-2xl border border-[#eedfd8] shadow-xs overflow-hidden">
                <div className="p-4 bg-[#fdf5f2] border-b border-[#eedfd8] flex items-center justify-between">
                  <span className="text-sm sm:text-base font-bold text-[#33110e] flex items-center gap-2">
                    <Mic className="w-5 h-5 text-amber-600" />
                    Keynote &amp; Invited Expert Lectures ({allTalks.length})
                  </span>
                </div>
                {allTalks.length > 0 ? (
                  <div className="divide-y divide-neutral-100">
                    {allTalks.map((talk: any, idx: number) => (
                      <div key={idx} className="p-4 sm:p-5 hover:bg-[#fffaf8] transition flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 min-w-0 flex-1">
                          <div className="w-11 h-11 rounded-xl bg-[#fcf2ef] text-[#85261e] flex items-center justify-center shrink-0 border border-[#eedfd8]">
                            <Mic className="w-5 h-5" />
                          </div>
                          <div className="space-y-1.5 min-w-0 flex-1">
                            <h4 className="text-base font-bold text-neutral-900 leading-snug">{talk.title}</h4>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-600">
                              <span className="font-semibold text-[#85261e]">{talk.venue || "Host Institution"}</span>
                              <span>•</span>
                              <span className="text-neutral-500">{talk.date}</span>
                            </div>
                            {talk.description && (
                              <p className="text-sm text-neutral-600 leading-relaxed pt-0.5">{talk.description}</p>
                            )}
                          </div>
                        </div>
                        {canEdit && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => openEditModal(talk)}
                              className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition cursor-pointer"
                              title="Edit Record"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteRecord(talk)}
                              className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center text-neutral-500 text-sm">
                    No expert talks recorded.
                  </div>
                )}
              </div>
            )}

            {/* 11. RESEARCH SUPERVISION TAB */}
            {activeTab === "researchSupervision" && (
              <div className="bg-white rounded-2xl border border-[#eedfd8] shadow-xs overflow-hidden">
                <div className="p-4 bg-[#fdf5f2] border-b border-[#eedfd8] flex items-center justify-between">
                  <span className="text-sm sm:text-base font-bold text-[#33110e] flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-blue-700" />
                    Doctoral &amp; Postgraduate Scholars Mentored ({combinedSupervisions.length})
                  </span>
                </div>
                {combinedSupervisions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-[#1f1412] text-white uppercase text-xs font-bold tracking-wider">
                          <th className="p-3.5 w-14 text-center border-r border-neutral-700">Sr.</th>
                          <th className="p-3.5 border-r border-neutral-700">Scholar Name</th>
                          <th className="p-3.5 border-r border-neutral-700 min-w-[240px]">Thesis / Research Title</th>
                          <th className="p-3.5 w-28 text-center border-r border-neutral-700">Program</th>
                          <th className="p-3.5 w-28 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#eedfd8]/60">
                        {combinedSupervisions.map((s: any, idx: number) => (
                          <tr key={s.id || idx} className={idx % 2 === 1 ? "bg-[#fffaf8]" : "bg-white"}>
                            <td className="p-3.5 text-center text-neutral-500 font-mono font-bold align-top text-sm">
                              {idx + 1}
                            </td>
                            <td className="p-3.5 align-top space-y-1">
                              <div className="font-bold text-neutral-900 text-base">{s.student_name}</div>
                              {s.roll_number && (
                                <div className="font-mono text-xs text-neutral-500 font-medium">Roll: {s.roll_number}</div>
                              )}
                            </td>
                            <td className="p-3.5 align-top space-y-1">
                              <div className="text-neutral-900 font-semibold leading-snug text-sm">{s.thesis_title}</div>
                              {s.co_supervisor && (
                                <div className="text-xs text-neutral-500">Co-Supervisor: {s.co_supervisor}</div>
                              )}
                            </td>
                            <td className="p-3.5 text-center align-top font-bold text-[#85261e] text-sm">
                              {s.level || "Ph.D."}
                            </td>
                            <td className="p-3.5 text-center align-top space-y-1.5">
                              <button
                                type="button"
                                onClick={() => openDetails(s)}
                                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] hover:bg-[#85261e] hover:text-white transition font-bold text-xs cursor-pointer shadow-2xs"
                              >
                                <Info className="w-3.5 h-3.5" /> Details
                              </button>
                              {canEdit && (
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => openEditModal(s)}
                                    className="p-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition cursor-pointer"
                                    title="Edit Record"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteRecord(s)}
                                    className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                                    title="Delete Record"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-12 text-center text-neutral-500 text-sm">
                    No supervision records listed.
                  </div>
                )}
              </div>
            )}

            {/* 12. ADMINISTRATIVE EXPERIENCE TAB */}
            {activeTab === "administrativeexperience" && (
              <div className="bg-white rounded-2xl border border-[#eedfd8] shadow-xs overflow-hidden">
                <div className="p-4 bg-[#fdf5f2] border-b border-[#eedfd8] flex items-center justify-between">
                  <span className="text-sm sm:text-base font-bold text-[#33110e] flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#85261e]" />
                    Institutional Leadership Appointments ({allAdminExp.length})
                  </span>
                </div>
                {allAdminExp.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-[#1f1412] text-white uppercase text-xs font-bold tracking-wider">
                          <th className="p-3.5 w-14 text-center border-r border-neutral-700">Sr.</th>
                          <th className="p-3.5 border-r border-neutral-700">Position / Designation</th>
                          <th className="p-3.5 border-r border-neutral-700">Department / Organization</th>
                          <th className="p-3.5 w-44 text-center border-r border-neutral-700">Duration</th>
                          {canEdit && <th className="p-3.5 w-28 text-center">Actions</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#eedfd8]/60">
                        {allAdminExp.map((adm: any, idx: number) => (
                          <tr key={adm.id || idx} className={idx % 2 === 1 ? "bg-[#fffaf8]" : "bg-white"}>
                            <td className="p-3.5 text-center text-neutral-500 font-mono font-bold align-top text-sm">
                              {idx + 1}
                            </td>
                            <td className="p-3.5 align-top font-bold text-[#85261e] text-base">
                              {adm.position || adm.role}
                            </td>
                            <td className="p-3.5 align-top text-neutral-800 font-medium text-sm">
                              {adm.organization || "NIT Hamirpur"}
                            </td>
                            <td className="p-3.5 text-center align-top text-neutral-700 font-semibold text-sm">
                              {adm.start_date ? `${adm.start_date} to ${adm.end_date || "Present"}` : "Completed"}
                            </td>
                            {canEdit && (
                              <td className="p-3.5 text-center align-top">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => openEditModal(adm)}
                                    className="p-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition cursor-pointer"
                                    title="Edit Record"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteRecord(adm)}
                                    className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                                    title="Delete Record"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-12 text-center text-neutral-500 text-sm">
                    No administrative experience records updated.
                  </div>
                )}
              </div>
            )}

            {/* 13. HONORS & RECOGNITIONS TAB */}
            {activeTab === "honors" && (
              <div className="bg-white rounded-2xl border border-[#eedfd8] shadow-xs overflow-hidden">
                <div className="p-4 bg-[#fdf5f2] border-b border-[#eedfd8] flex items-center justify-between">
                  <span className="text-sm sm:text-base font-bold text-[#33110e] flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-600" />
                    Honors &amp; Recognitions ({allHonors.length})
                  </span>
                </div>
                {allHonors.length > 0 ? (
                  <div className="divide-y divide-neutral-100">
                    {allHonors.map((hnr: any, idx: number) => (
                      <div key={idx} className="p-4 sm:p-5 hover:bg-[#fffaf8] transition flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 min-w-0 flex-1">
                          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                            <Trophy className="w-5 h-5" />
                          </div>
                          <div className="space-y-1 min-w-0 flex-1">
                            <h4 className="text-base font-bold text-neutral-900 leading-snug">{hnr.title}</h4>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-600">
                              <span className="font-semibold text-[#85261e]">{hnr.organization || "Awarding Body"}</span>
                              {hnr.year && (
                                <>
                                  <span>•</span>
                                  <span className="font-bold text-neutral-800">Year {hnr.year}</span>
                                </>
                              )}
                            </div>
                            {hnr.description && (
                              <p className="text-sm text-neutral-600 leading-relaxed pt-1">{hnr.description}</p>
                            )}
                          </div>
                        </div>
                        {canEdit && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => openEditModal(hnr)}
                              className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition cursor-pointer"
                              title="Edit Record"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteRecord(hnr)}
                              className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center text-neutral-500 text-sm">
                    No honors recorded.
                  </div>
                )}
              </div>
            )}

            {/* 14. INTERNATIONAL AND NATIONAL EXPOSURE TAB */}
            {activeTab === "internationalAndNationalExposure" && (
              <div className="bg-white rounded-2xl border border-[#eedfd8] shadow-xs overflow-hidden">
                <div className="p-4 bg-[#fdf5f2] border-b border-[#eedfd8] flex items-center justify-between">
                  <span className="text-sm sm:text-base font-bold text-[#33110e] flex items-center gap-2">
                    <Globe className="w-5 h-5 text-indigo-600" />
                    Global &amp; National Academic Exposure ({allExposures.length})
                  </span>
                </div>
                {allExposures.length > 0 ? (
                  <div className="divide-y divide-neutral-100">
                    {allExposures.map((exp: any, idx: number) => (
                      <div key={idx} className="p-4 sm:p-5 hover:bg-[#fffaf8] transition flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 min-w-0 flex-1">
                          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-200">
                            <Globe className="w-5 h-5" />
                          </div>
                          <div className="space-y-1 min-w-0 flex-1">
                            <h4 className="text-base font-bold text-neutral-900 leading-snug">{exp.title || exp.purpose}</h4>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-600">
                              <span className="font-semibold text-[#85261e]">{exp.organization || exp.country || "Host"}</span>
                              {exp.year && (
                                <>
                                  <span>•</span>
                                  <span className="font-bold text-neutral-800">{exp.year}</span>
                                </>
                              )}
                            </div>
                            {exp.details && (
                              <p className="text-sm text-neutral-600 leading-relaxed pt-1">{exp.details}</p>
                            )}
                          </div>
                        </div>
                        {canEdit && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => openEditModal(exp)}
                              className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition cursor-pointer"
                              title="Edit Record"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteRecord(exp)}
                              className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center text-neutral-500 text-sm">
                    No exposure records registered.
                  </div>
                )}
              </div>
            )}

            {/* 15. COURSES TAUGHT TAB */}
            {activeTab === "courses" && (
              <div className="bg-white rounded-2xl border border-[#eedfd8] shadow-xs overflow-hidden">
                <div className="p-4 sm:p-5 bg-[#fdf5f2] border-b border-[#eedfd8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-base sm:text-lg font-bold text-[#33110e] flex items-center gap-2">
                      <BookOpenCheck className="w-5 h-5 text-[#85261e]" />
                      Curriculum Teaching &amp; Courses Assigned ({allCoursesTaught.length})
                    </span>
                    <p className="text-xs sm:text-sm text-[#5c4033] mt-0.5">
                      Official course assignments, credits, and weekly contact hours for {faculty.full_name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#85261e] bg-white px-3 py-1 rounded-full border border-[#eedfd8]">
                      {allCoursesTaught.reduce((sum: number, c: any) => sum + (Number(c.credits) || 0), 0)} Total Teaching Credits
                    </span>
                  </div>
                </div>

                {allCoursesTaught.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-[#fff9f6] text-xs font-black uppercase text-[#33110e] border-b border-[#eedfd8]">
                        <tr>
                          <th className="px-5 py-3.5 text-center w-14">Sr.</th>
                          <th className="px-5 py-3.5">Course Code</th>
                          <th className="px-5 py-3.5">Course Title</th>
                          <th className="px-5 py-3.5 text-center">Level</th>
                          <th className="px-5 py-3.5 text-center">Semester</th>
                          <th className="px-5 py-3.5 text-center">L - T - P</th>
                          <th className="px-5 py-3.5 text-center">Credits</th>
                          <th className="px-5 py-3.5 text-center">Session</th>
                          <th className="px-5 py-3.5 text-right">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#eedfd8]/60 text-[#1c110c]">
                        {allCoursesTaught.map((course: any, idx: number) => (
                          <tr key={course.id || idx} className="hover:bg-[#fff9f6]/70 transition-colors">
                            <td className="px-5 py-3.5 text-center font-mono font-bold text-[#85261e] text-xs">{idx + 1}</td>
                            <td className="px-5 py-3.5 font-mono font-bold text-xs">
                              <span className="px-2.5 py-1 rounded bg-[#33110e] text-white">
                                {course.course_code}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 font-bold text-sm text-neutral-900">
                              <div>
                                {course.course_name}
                                {course.section && (
                                  <span className="ml-2 px-2 py-0.5 rounded text-xs font-semibold bg-[#eedfd8]/60 text-[#5c4033]">
                                    {course.section}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-5 py-3.5 text-center">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                                  course.course_level === "PG"
                                    ? "bg-purple-100 text-purple-800 border border-purple-200"
                                    : course.course_level === "Doctoral"
                                    ? "bg-amber-100 text-amber-800 border border-amber-200"
                                    : "bg-blue-100 text-blue-800 border border-blue-200"
                                }`}
                              >
                                {course.course_level || "UG"}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-center font-bold text-xs text-neutral-700">
                              {course.semester ? `Sem ${course.semester}` : "-"}
                            </td>
                            <td className="px-5 py-3.5 text-center font-mono text-xs font-bold text-[#5c4033]">
                              {course.lecture_hours ?? 3} - {course.tutorial_hours ?? 0} - {course.practical_hours ?? 0}
                            </td>
                            <td className="px-5 py-3.5 text-center">
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] font-mono font-black text-xs">
                                {course.credits}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-center font-mono text-xs text-[#5c4033]">
                              {course.academic_year || "2024-2025"}
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <button
                                type="button"
                                onClick={() => openDetails(course)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#eedfd8] bg-white text-[#33110e] text-xs font-bold hover:bg-[#33110e] hover:text-white transition shadow-2xs cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" /> Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-12 text-center text-neutral-500 text-sm">
                    <BookOpenCheck className="w-8 h-8 mx-auto text-[#85261e]/40 mb-2" />
                    No course assignments recorded for this academic session.
                  </div>
                )}
              </div>
            )}

          </main>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. DYNAMIC MODAL FORM (Contextual to activeTab, styled in new theme)      */}
      {/* ========================================================================= */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#eedfd8] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 bg-[#fdf5f2] border-b border-[#eedfd8] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#85261e]">
                  {formMode === "edit" ? "Edit Entry" : "Add New Record"}
                </span>
                <h3 className="text-xl font-extrabold text-[#33110e]">
                  {sidebarItems.find((i) => i.key === activeTab)?.label}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-5 text-sm flex-1">
              
              {/* Form fields for FACULTY INFO */}
              {activeTab === "facultyInfo" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Full Name *</label>
                    <input
                      type="text"
                      name="full_name"
                      required
                      value={formData.full_name || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Designation *</label>
                    <input
                      type="text"
                      name="designation"
                      required
                      value={formData.designation || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Official Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Highest Qualification</label>
                    <input
                      type="text"
                      name="highest_qualification"
                      value={formData.highest_qualification || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Teaching Experience Summary</label>
                    <input
                      type="text"
                      name="teaching_experience_summary"
                      value={formData.teaching_experience_summary || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-neutral-700">Specialization &amp; Research Interests (comma separated)</label>
                    <input
                      type="text"
                      name="research_interests"
                      value={formData.research_interests || ""}
                      onChange={handleInputChange}
                      placeholder="e.g. Distributed Systems, Network Security, Machine Learning"
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-neutral-700">Biography</label>
                    <textarea
                      name="bio"
                      rows={3}
                      value={formData.bio || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>

                  {/* Academic Profile Links */}
                  <div className="sm:col-span-2 pt-2 border-t border-neutral-100">
                    <h4 className="font-bold text-neutral-900 mb-2">Research Profile URLs (Badges)</h4>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Google Scholar URL / ID</label>
                    <input
                      type="text"
                      name="google_scholar_id"
                      value={formData.google_scholar_id || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Scopus URL / ID</label>
                    <input
                      type="text"
                      name="scopus_id"
                      value={formData.scopus_id || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">ORCID ID</label>
                    <input
                      type="text"
                      name="orcid"
                      value={formData.orcid || ""}
                      onChange={handleInputChange}
                      placeholder="0000-0002-1825-0097"
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">ResearchGate URL</label>
                    <input
                      type="text"
                      name="rg_url"
                      value={formData.rg_url || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">LinkedIn Profile URL</label>
                    <input
                      type="text"
                      name="linkedin_url"
                      value={formData.linkedin_url || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Vidwan Profile URL</label>
                    <input
                      type="text"
                      name="vidwan_url"
                      value={formData.vidwan_url || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Form fields for PUBLICATIONS (Journal, Conference, Book, Book Chapter) */}
              {(activeTab === "journal" || activeTab === "conference" || activeTab === "book" || activeTab === "book_chapter") && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-neutral-700">Title of Publication *</label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={formData.title || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-neutral-700">Authors (comma separated) *</label>
                    <input
                      type="text"
                      name="author_text"
                      required
                      placeholder="e.g. Lalit Kumar, Parveen Kumar, RK Chauhan"
                      value={formData.author_text || formData.authors || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-neutral-700">
                      {activeTab === "journal" ? "Journal Name *" : activeTab === "conference" ? "Conference Name *" : "Publisher / Book Title *"}
                    </label>
                    <input
                      type="text"
                      name="journal_or_conference_name"
                      required
                      value={formData.journal_or_conference_name || formData.venue_name || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Publication Year *</label>
                    <input
                      type="number"
                      name="year"
                      required
                      value={formData.year || new Date().getFullYear()}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Month of Publication</label>
                    <select
                      name="month"
                      value={formData.month || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none bg-white"
                    >
                      <option value="">Select Month</option>
                      {MONTH_OPTIONS.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Academic Session *</label>
                    <select
                      name="academic_session"
                      required
                      value={formData.academic_session || "2024-2025"}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none bg-white font-mono"
                    >
                      {ACADEMIC_SESSIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">DOI</label>
                    <input
                      type="text"
                      name="doi"
                      placeholder="10.1080/03772063..."
                      value={formData.doi || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Volume</label>
                    <input
                      type="text"
                      name="volume"
                      value={formData.volume || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Issue / Number</label>
                    <input
                      type="text"
                      name="issue"
                      value={formData.issue || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Page Numbers</label>
                    <input
                      type="text"
                      name="page_range"
                      placeholder="e.g. 485-490"
                      value={formData.page_range || formData.pages || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Indexing</label>
                    <select
                      name="indexing"
                      value={isCustomIndexing ? "Other" : (formData.indexing || "Scopus")}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "Other") {
                          setIsCustomIndexing(true);
                          setFormData((prev) => ({ ...prev, indexing: "Other" }));
                        } else {
                          setIsCustomIndexing(false);
                          setCustomIndexingText("");
                          setFormData((prev) => ({ ...prev, indexing: val }));
                        }
                      }}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none bg-white"
                    >
                      <option value="Scopus">Scopus</option>
                      <option value="SCI">SCI</option>
                      <option value="SCIE">SCIE</option>
                      <option value="ESCI">ESCI</option>
                      <option value="Web of Science">Web of Science</option>
                      <option value="UGC CARE">UGC CARE</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {(isCustomIndexing || formData.indexing === "Other") && (
                    <div className="space-y-1">
                      <label className="font-bold text-[#85261e]">Specify Other Indexing *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. IEEE Xplore, Google Scholar, PubMed"
                        value={customIndexingText}
                        onChange={(e) => setCustomIndexingText(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-[#85261e] focus:ring-1 focus:ring-[#85261e] focus:outline-none bg-red-50/20"
                      />
                    </div>
                  )}
                  {activeTab === "journal" && (
                    <div className="space-y-1">
                      <label className="font-bold text-neutral-700">Journal Quartile</label>
                      <select
                        name="journal_quartile"
                        value={formData.journal_quartile || "T"}
                        onChange={handleInputChange}
                        className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none bg-white"
                      >
                        <option value="Q1">Q1 (Top Quartile)</option>
                        <option value="Q2">Q2 (Second Quartile)</option>
                        <option value="Q3">Q3 (Third Quartile)</option>
                        <option value="Q4">Q4 (Fourth Quartile)</option>
                        <option value="T">T (Temporary / Unclassified)</option>
                      </select>
                    </div>
                  )}
                  {(activeTab === "book" || activeTab === "book_chapter") && (
                    <div className="space-y-1">
                      <label className="font-bold text-neutral-700">ISBN Number</label>
                      <input
                        type="text"
                        name="isbn"
                        placeholder="e.g. 978-3-16-148410-0"
                        value={formData.isbn || ""}
                        onChange={handleInputChange}
                        className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none font-mono"
                      />
                    </div>
                  )}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-neutral-700">Abstract</label>
                    <textarea
                      name="abstract_text"
                      rows={3}
                      value={formData.abstract_text || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  {renderAssociatedFacultyPicker("Associated Faculty (Co-Authors)")}
                </div>
              )}

              {/* Form fields for PATENTS */}
              {activeTab === "patents" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-neutral-700">Patent Title *</label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={formData.title || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Application Number *</label>
                    <input
                      type="text"
                      name="application_number"
                      required
                      value={formData.application_number || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Patent Status</label>
                    <select
                      name="status"
                      value={formData.status || "Published"}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none bg-white"
                    >
                      <option value="Granted">Granted</option>
                      <option value="Published">Published</option>
                      <option value="Filed">Filed</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Awarding Agency / Place</label>
                    <input
                      type="text"
                      name="place"
                      placeholder="e.g. Indian Patent Office, New Delhi"
                      value={formData.place || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Filing Date</label>
                    <input
                      type="text"
                      name="filing_date"
                      placeholder="YYYY-MM-DD"
                      value={formData.filing_date || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Grant Date</label>
                    <input
                      type="text"
                      name="grant_date"
                      placeholder="YYYY-MM-DD"
                      value={formData.grant_date || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Patent Year *</label>
                    <input
                      type="number"
                      name="year"
                      required
                      value={formData.year || new Date().getFullYear()}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Month</label>
                    <select
                      name="month"
                      value={formData.month || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none bg-white"
                    >
                      <option value="">Select Month</option>
                      {MONTH_OPTIONS.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Academic Session *</label>
                    <select
                      name="academic_session"
                      required
                      value={formData.academic_session || "2024-2025"}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none bg-white font-mono"
                    >
                      {ACADEMIC_SESSIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-neutral-700">Inventors (text)</label>
                    <input
                      type="text"
                      name="raw_inventors"
                      placeholder="e.g. Faculty Name, Co-inventors"
                      value={formData.raw_inventors || faculty.full_name}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  {renderAssociatedFacultyPicker("Associated Faculty (Co-Inventors)")}
                </div>
              )}

              {/* Form fields for PROJECTS */}
              {activeTab === "projects" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-neutral-700">Project Title *</label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={formData.title || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Status</label>
                    <select
                      name="status"
                      value={formData.status || "Ongoing"}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none bg-white"
                    >
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Reference / Sanction Number *</label>
                    <input
                      type="text"
                      name="reference_number"
                      required
                      placeholder="e.g. CRG/2023/001428"
                      value={formData.reference_number || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Funding / Sponsoring Agency *</label>
                    <input
                      type="text"
                      name="funding_agency"
                      required
                      placeholder="e.g. DST-SERB, MeitY, DRDO, CSIR"
                      value={formData.funding_agency || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Sanctioned Amount (INR) *</label>
                    <input
                      type="number"
                      name="total_sanctioned_amount"
                      required
                      placeholder="e.g. 2500000"
                      value={formData.total_sanctioned_amount || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Duration (in Months / Years)</label>
                    <input
                      type="text"
                      name="duration"
                      placeholder="e.g. 36 Months or 3 Years"
                      value={formData.duration || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Year of Sanction *</label>
                    <input
                      type="number"
                      name="year"
                      required
                      value={formData.year || new Date().getFullYear()}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Month of Sanction</label>
                    <select
                      name="month"
                      value={formData.month || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none bg-white"
                    >
                      <option value="">Select Month</option>
                      {MONTH_OPTIONS.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Academic Session *</label>
                    <select
                      name="academic_session"
                      required
                      value={formData.academic_session || "2024-2025"}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none bg-white font-mono"
                    >
                      {ACADEMIC_SESSIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Principal Investigator (PI) *</label>
                    <input
                      type="text"
                      name="principal_investigator"
                      required
                      value={formData.principal_investigator || faculty.full_name}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Co-Principal Investigator (Co-PI)</label>
                    <input
                      type="text"
                      name="co_principal_investigator"
                      placeholder="e.g. Dr. Faculty Colleague"
                      value={formData.co_principal_investigator || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-neutral-700">All Investigators (text summary)</label>
                    <input
                      type="text"
                      name="raw_investigators"
                      value={formData.raw_investigators || faculty.full_name}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  {renderAssociatedFacultyPicker("Associated Co-PIs (Colleague Faculty Sync)")}
                </div>
              )}

              {/* Form fields for EVENTS */}
              {activeTab === "events" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-neutral-700">Event Title *</label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={formData.title || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Event Type</label>
                    <select
                      name="event_type"
                      value={formData.event_type || "FDP / STC"}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none bg-white"
                    >
                      {EVENT_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Category</label>
                    <select
                      name="category"
                      value={formData.category || "organized"}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none bg-white capitalize"
                    >
                      {EVENT_CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Venue *</label>
                    <input
                      type="text"
                      name="venue"
                      required
                      value={formData.venue || "DoCSE, NIT Hamirpur"}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Sponsoring Agency *</label>
                    <input
                      type="text"
                      name="sponsoring_agency"
                      required
                      value={formData.sponsoring_agency || "NIT Hamirpur"}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Start Date *</label>
                    <input
                      type="text"
                      name="start_date"
                      required
                      placeholder="YYYY-MM-DD"
                      value={formData.start_date || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">End Date</label>
                    <input
                      type="text"
                      name="end_date"
                      placeholder="YYYY-MM-DD"
                      value={formData.end_date || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Academic Session *</label>
                    <select
                      name="academic_session"
                      required
                      value={formData.academic_session || "2024-2025"}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none bg-white font-mono"
                    >
                      {ACADEMIC_SESSIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Brochure Link / Document URL</label>
                    <input
                      type="text"
                      name="link_url"
                      placeholder="https://..."
                      value={formData.link_url || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>

                  {/* Position 1 Block (Matching tempcsebase) */}
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Position 1</label>
                    <select
                      name="position1"
                      value={formData.position1 || "Coordinator"}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none bg-white"
                    >
                      {EVENT_POSTS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                  {formData.position1 === "Other" && (
                    <div className="space-y-1">
                      <label className="font-bold text-[#85261e]">Other Position 1</label>
                      <input
                        type="text"
                        name="positionother1"
                        placeholder="Specify role title"
                        value={formData.positionother1 || ""}
                        onChange={handleInputChange}
                        className="w-full p-2.5 rounded-xl border border-[#85261e] focus:ring-1 focus:ring-[#85261e] focus:outline-none bg-red-50/20"
                      />
                    </div>
                  )}
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">
                      {formData.position1 === "Other"
                        ? formData.positionother1 || "Other Role"
                        : formData.position1 || "Convenor"}{" "}
                      Faculty Names
                    </label>
                    <input
                      type="text"
                      name="convenor"
                      placeholder="e.g. Dr. Faculty One, Dr. Faculty Two"
                      value={formData.convenor || faculty.full_name}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>

                  {/* Position 2 Block (Matching tempcsebase) */}
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Position 2</label>
                    <select
                      name="position2"
                      value={formData.position2 || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none bg-white"
                    >
                      <option value="">None / Not Applicable</option>
                      {EVENT_POSTS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                  {formData.position2 === "Other" && (
                    <div className="space-y-1">
                      <label className="font-bold text-[#85261e]">Other Position 2</label>
                      <input
                        type="text"
                        name="positionother2"
                        placeholder="Specify role title"
                        value={formData.positionother2 || ""}
                        onChange={handleInputChange}
                        className="w-full p-2.5 rounded-xl border border-[#85261e] focus:ring-1 focus:ring-[#85261e] focus:outline-none bg-red-50/20"
                      />
                    </div>
                  )}
                  {formData.position2 && (
                    <div className="space-y-1">
                      <label className="font-bold text-neutral-700">
                        {formData.position2 === "Other"
                          ? formData.positionother2 || "Other Role"
                          : formData.position2}{" "}
                        Faculty Names
                      </label>
                      <input
                        type="text"
                        name="coordinator"
                        placeholder="e.g. Dr. Faculty Three"
                        value={formData.coordinator || ""}
                        onChange={handleInputChange}
                        className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                      />
                    </div>
                  )}

                  {renderAssociatedFacultyPicker("Associated Faculty (Event Organizers / Coordinators)")}
                </div>
              )}

              {/* Form fields for CONSULTANCIES */}
              {activeTab === "consultancies" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-neutral-700">Consultancy Title *</label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={formData.title || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-neutral-700">Client Organization *</label>
                    <input
                      type="text"
                      name="client_organisation"
                      required
                      value={formData.client_organisation || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Status</label>
                    <select
                      name="status"
                      value={formData.status || "Ongoing"}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none bg-white"
                    >
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Reference / Sanction Number</label>
                    <input
                      type="text"
                      name="reference_number"
                      placeholder="e.g. NITH/CONS/2024/09"
                      value={formData.reference_number || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Amount (INR) *</label>
                    <input
                      type="number"
                      name="amount"
                      required
                      value={formData.amount || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Start Year *</label>
                    <input
                      type="number"
                      name="year"
                      required
                      value={formData.year || new Date().getFullYear()}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Month</label>
                    <select
                      name="month"
                      value={formData.month || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none bg-white"
                    >
                      <option value="">Select Month</option>
                      {MONTH_OPTIONS.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Academic Session *</label>
                    <select
                      name="academic_session"
                      required
                      value={formData.academic_session || "2024-2025"}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none bg-white font-mono"
                    >
                      {ACADEMIC_SESSIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-neutral-700">Investigators Involved (text)</label>
                    <input
                      type="text"
                      name="author_text"
                      value={formData.author_text || faculty.full_name}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  {renderAssociatedFacultyPicker("Associated Faculty (Co-Consultants)")}
                </div>
              )}

              {/* Form fields for EXPERT TALKS */}
              {activeTab === "experttalk" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Talk Title *</label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={formData.title || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-neutral-700">Host Institution / Organization *</label>
                      <input
                        type="text"
                        name="host_organization"
                        required
                        placeholder="e.g. IIT Roorkee / IEEE Chapter"
                        value={formData.host_organization || ""}
                        onChange={handleInputChange}
                        className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-neutral-700">Venue / Location *</label>
                      <input
                        type="text"
                        name="venue"
                        required
                        placeholder="e.g. Virtual / Roorkee, India"
                        value={formData.venue || ""}
                        onChange={handleInputChange}
                        className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-neutral-700">Start Date *</label>
                      <input
                        type="text"
                        name="date"
                        required
                        placeholder="YYYY-MM-DD"
                        value={formData.date || ""}
                        onChange={handleInputChange}
                        className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-neutral-700">End Date</label>
                        <label className="flex items-center gap-1.5 text-xs text-[#85261e] font-semibold cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(formData.is_present)}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                is_present: e.target.checked,
                                end_date: e.target.checked ? "Present" : "",
                              }))
                            }
                            className="rounded border-[#eedfd8] text-[#85261e] focus:ring-[#85261e]"
                          />
                          <span>Ongoing / Present</span>
                        </label>
                      </div>
                      {formData.is_present ? (
                        <input
                          type="text"
                          readOnly
                          value="Present"
                          className="w-full p-2.5 rounded-xl border border-emerald-300 bg-emerald-50/50 text-emerald-900 font-bold"
                        />
                      ) : (
                        <input
                          type="text"
                          name="end_date"
                          placeholder="YYYY-MM-DD"
                          value={formData.end_date || ""}
                          onChange={handleInputChange}
                          className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                        />
                      )}
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-bold text-neutral-700">Academic Session *</label>
                      <select
                        name="academic_session"
                        required
                        value={formData.academic_session || "2024-2025"}
                        onChange={handleInputChange}
                        className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none bg-white font-mono"
                      >
                        {ACADEMIC_SESSIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Description / Program Context</label>
                    <textarea
                      name="description"
                      rows={3}
                      value={formData.description || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  {renderAssociatedFacultyPicker("Associated Faculty")}
                </div>
              )}

              {/* Form fields for RESEARCH SUPERVISION */}
              {activeTab === "researchSupervision" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Degree / Program *</label>
                    <select
                      name="level"
                      value={formData.level || "Ph.D."}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none bg-white"
                    >
                      <option value="Ph.D.">Ph.D.</option>
                      <option value="M.Tech">M.Tech</option>
                      <option value="B.Tech">B.Tech</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Scholar Name *</label>
                    <input
                      type="text"
                      name="student_name"
                      required
                      value={formData.student_name || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Roll / Registration No. *</label>
                    <input
                      type="text"
                      name="roll_number"
                      required
                      placeholder="e.g. 21DCS005"
                      value={formData.roll_number || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-neutral-700">Thesis / Research Title *</label>
                    <input
                      type="text"
                      name="thesis_title"
                      required
                      value={formData.thesis_title || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Status</label>
                    <select
                      name="status"
                      value={formData.status || "Ongoing"}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none bg-white"
                    >
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                      <option value="Awarded">Awarded</option>
                      <option value="Submitted">Submitted</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Year *</label>
                    <input
                      type="number"
                      name="year"
                      required
                      value={formData.year || new Date().getFullYear()}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Academic Session *</label>
                    <select
                      name="academic_session"
                      required
                      value={formData.academic_session || "2024-2025"}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none bg-white font-mono"
                    >
                      {ACADEMIC_SESSIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Co-Supervisors</label>
                    <input
                      type="text"
                      name="co_supervisor"
                      placeholder="e.g. Dr. Co-Supervisor Name"
                      value={formData.co_supervisor || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  {renderAssociatedFacultyPicker("Associated Faculty (Co-Supervisors)")}
                </div>
              )}

              {/* Form fields for ADMINISTRATIVE EXPERIENCE */}
              {activeTab === "administrativeexperience" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Position / Role *</label>
                    <input
                      type="text"
                      name="position"
                      required
                      placeholder="e.g. Head of the Department, Dean, Warden"
                      value={formData.position || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Department / Organization *</label>
                    <input
                      type="text"
                      name="organization"
                      required
                      value={formData.organization || "NIT Hamirpur"}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-neutral-700">Start Date / Year</label>
                      <input
                        type="text"
                        name="start_date"
                        value={formData.start_date || ""}
                        onChange={handleInputChange}
                        className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-neutral-700">End Date / Year</label>
                      <input
                        type="text"
                        name="end_date"
                        placeholder="Present"
                        value={formData.end_date || ""}
                        onChange={handleInputChange}
                        className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Form fields for HONORS */}
              {activeTab === "honors" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Honor / Award Title *</label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={formData.title || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-neutral-700">Awarding Organization *</label>
                      <input
                        type="text"
                        name="organization"
                        required
                        value={formData.organization || ""}
                        onChange={handleInputChange}
                        className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-neutral-700">Year</label>
                      <input
                        type="text"
                        name="year"
                        value={formData.year || "2024"}
                        onChange={handleInputChange}
                        className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Description / Citation</label>
                    <textarea
                      name="description"
                      rows={3}
                      value={formData.description || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Form fields for INTERNATIONAL EXPOSURE */}
              {activeTab === "internationalAndNationalExposure" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Exposure / Purpose Title *</label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={formData.title || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-neutral-700">Host Organization / Country *</label>
                      <input
                        type="text"
                        name="organization"
                        required
                        value={formData.organization || ""}
                        onChange={handleInputChange}
                        className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-neutral-700">Year</label>
                      <input
                        type="text"
                        name="year"
                        value={formData.year || "2024"}
                        onChange={handleInputChange}
                        className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Details</label>
                    <textarea
                      name="details"
                      rows={3}
                      value={formData.details || ""}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl border border-[#eedfd8] focus:ring-1 focus:ring-[#85261e] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#eedfd8] bg-white text-neutral-700 hover:bg-neutral-50 font-semibold text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#85261e] hover:bg-[#33110e] text-white font-bold text-sm shadow-xs hover:shadow-md transition cursor-pointer"
                >
                  {formMode === "edit" ? "Update Record" : "Save Record"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. DETAILS MODAL (Matching tempcsebase PublicationsModal)                  */}
      {/* ========================================================================= */}
      {isDetailsModalOpen && detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#eedfd8] shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header matching tempcsebase */}
            <div className="p-4 sm:p-5 bg-[#fcf2ef] border-b border-[#eedfd8] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Info className="w-5 h-5 text-[#85261e]" />
                <h3 className="text-lg sm:text-xl font-bold text-[#33110e]">
                  Complete Record Details
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailsModalOpen(false)}
                className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Details Content Table (tempcsebase tabular structure) */}
            <div className="p-6 overflow-y-auto space-y-4 text-sm flex-1">
              <table className="w-full border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-100 text-sm">
                <tbody className="divide-y divide-neutral-100">
                  {(detailItem.title || detailItem.course_name) && (
                    <tr className="bg-white">
                      <td className="p-3.5 w-1/3 font-bold text-[#85261e] bg-neutral-50/80 text-sm">
                        {detailItem.course_name ? "Course Title" : "Title"}
                      </td>
                      <td className="p-3.5 font-bold text-neutral-900 text-base">
                        {detailItem.course_name || detailItem.title}
                      </td>
                    </tr>
                  )}
                  {detailItem.course_code && (
                    <tr className="bg-white">
                      <td className="p-3.5 w-1/3 font-bold text-neutral-700 bg-neutral-50/80 text-sm">Course Code</td>
                      <td className="p-3.5 font-mono font-bold text-[#85261e] text-sm">{detailItem.course_code}</td>
                    </tr>
                  )}
                  {detailItem.course_level && (
                    <tr className="bg-white">
                      <td className="p-3.5 w-1/3 font-bold text-neutral-700 bg-neutral-50/80 text-sm">Course Level</td>
                      <td className="p-3.5 font-bold text-neutral-800 text-sm">{detailItem.course_level}</td>
                    </tr>
                  )}
                  {detailItem.semester && (
                    <tr className="bg-white">
                      <td className="p-3.5 w-1/3 font-bold text-neutral-700 bg-neutral-50/80 text-sm">Semester</td>
                      <td className="p-3.5 font-bold text-neutral-800 text-sm">Semester {detailItem.semester}</td>
                    </tr>
                  )}
                  {(typeof detailItem.lecture_hours === "number" || typeof detailItem.tutorial_hours === "number" || typeof detailItem.practical_hours === "number") && (
                    <tr className="bg-white">
                      <td className="p-3.5 w-1/3 font-bold text-neutral-700 bg-neutral-50/80 text-sm">Contact Hours (L - T - P)</td>
                      <td className="p-3.5 font-mono font-bold text-neutral-800 text-sm">
                        {detailItem.lecture_hours ?? 3} hrs (L) — {detailItem.tutorial_hours ?? 0} hrs (T) — {detailItem.practical_hours ?? 0} hrs (P)
                      </td>
                    </tr>
                  )}
                  {detailItem.credits && (
                    <tr className="bg-white">
                      <td className="p-3.5 w-1/3 font-bold text-neutral-700 bg-neutral-50/80 text-sm">Credits</td>
                      <td className="p-3.5 font-bold text-[#85261e] text-sm">{detailItem.credits} Credits</td>
                    </tr>
                  )}
                  {detailItem.academic_year && (
                    <tr className="bg-white">
                      <td className="p-3.5 w-1/3 font-bold text-neutral-700 bg-neutral-50/80 text-sm">Academic Session</td>
                      <td className="p-3.5 font-mono text-neutral-800 text-sm">{detailItem.academic_year}</td>
                    </tr>
                  )}
                  {detailItem.description && (
                    <tr className="bg-white">
                      <td className="p-3.5 w-1/3 font-bold text-neutral-700 bg-neutral-50/80 text-sm">Syllabus Outline</td>
                      <td className="p-3.5 text-neutral-700 leading-relaxed text-sm">{detailItem.description}</td>
                    </tr>
                  )}
                  {(detailItem.author_text || detailItem.authors || detailItem.student_name || detailItem.raw_inventors || detailItem.convenor) && (
                    <tr className="bg-white">
                      <td className="p-3.5 w-1/3 font-bold text-neutral-700 bg-neutral-50/80 text-sm">
                        {detailItem.student_name ? "Scholar / Student" : detailItem.raw_inventors ? "Inventors" : "Authors / Investigators"}
                      </td>
                      <td className="p-3.5 text-neutral-800 font-medium text-sm">
                        {detailItem.author_text || detailItem.authors || detailItem.student_name || detailItem.raw_inventors || detailItem.convenor}
                      </td>
                    </tr>
                  )}
                  {(detailItem.journal_or_conference_name || detailItem.venue_name || detailItem.venue) && (
                    <tr className="bg-white">
                      <td className="p-3.5 w-1/3 font-bold text-neutral-700 bg-neutral-50/80 text-sm">Venue / Journal</td>
                      <td className="p-3.5 text-[#0f376f] font-semibold text-sm">
                        {detailItem.journal_or_conference_name || detailItem.venue_name || detailItem.venue}
                      </td>
                    </tr>
                  )}
                  {detailItem.funding_agency && (
                    <tr className="bg-white">
                      <td className="p-3.5 w-1/3 font-bold text-neutral-700 bg-neutral-50/80 text-sm">Sponsoring Agency</td>
                      <td className="p-3.5 text-neutral-900 font-semibold text-sm">{detailItem.funding_agency}</td>
                    </tr>
                  )}
                  {detailItem.client_organisation && (
                    <tr className="bg-white">
                      <td className="p-3.5 w-1/3 font-bold text-neutral-700 bg-neutral-50/80 text-sm">Client Organization</td>
                      <td className="p-3.5 text-neutral-900 font-semibold text-sm">{detailItem.client_organisation}</td>
                    </tr>
                  )}
                  {detailItem.total_sanctioned_amount && (
                    <tr className="bg-white">
                      <td className="p-3.5 w-1/3 font-bold text-neutral-700 bg-neutral-50/80 text-sm">Sanctioned Amount</td>
                      <td className="p-3.5 text-neutral-900 font-bold text-sm">₹ {Number(detailItem.total_sanctioned_amount).toLocaleString("en-IN")}</td>
                    </tr>
                  )}
                  {detailItem.amount && (
                    <tr className="bg-white">
                      <td className="p-3.5 w-1/3 font-bold text-neutral-700 bg-neutral-50/80 text-sm">Consultancy Amount</td>
                      <td className="p-3.5 text-neutral-900 font-bold text-sm">₹ {Number(detailItem.amount).toLocaleString("en-IN")}</td>
                    </tr>
                  )}
                  {detailItem.application_number && (
                    <tr className="bg-white">
                      <td className="p-3.5 w-1/3 font-bold text-neutral-700 bg-neutral-50/80 text-sm">Application Number</td>
                      <td className="p-3.5 font-mono text-neutral-800 font-bold text-sm">{detailItem.application_number}</td>
                    </tr>
                  )}
                  {detailItem.status && (
                    <tr className="bg-white">
                      <td className="p-3.5 w-1/3 font-bold text-neutral-700 bg-neutral-50/80 text-sm">Status</td>
                      <td className="p-3.5">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {detailItem.status}
                        </span>
                      </td>
                    </tr>
                  )}
                  {detailItem.year && (
                    <tr className="bg-white">
                      <td className="p-3.5 w-1/3 font-bold text-neutral-700 bg-neutral-50/80 text-sm">Year</td>
                      <td className="p-3.5 text-neutral-800 font-semibold text-sm">{detailItem.year}</td>
                    </tr>
                  )}
                  {detailItem.month && (
                    <tr className="bg-white">
                      <td className="p-3.5 w-1/3 font-bold text-neutral-700 bg-neutral-50/80 text-sm">Month</td>
                      <td className="p-3.5 text-neutral-800 font-semibold text-sm">
                        {MONTH_OPTIONS.find((m) => m.value === Number(detailItem.month))?.label || detailItem.month}
                      </td>
                    </tr>
                  )}
                  {detailItem.academic_session && (
                    <tr className="bg-white">
                      <td className="p-3.5 w-1/3 font-bold text-neutral-700 bg-neutral-50/80 text-sm">Academic Session</td>
                      <td className="p-3.5 font-mono font-bold text-neutral-800 text-sm">{detailItem.academic_session}</td>
                    </tr>
                  )}
                  {detailItem.indexing && (
                    <tr className="bg-white">
                      <td className="p-3.5 w-1/3 font-bold text-neutral-700 bg-neutral-50/80 text-sm">Indexing</td>
                      <td className="p-3.5">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-300">
                          {detailItem.indexing}
                        </span>
                      </td>
                    </tr>
                  )}
                  {detailItem.journal_quartile && (
                    <tr className="bg-white">
                      <td className="p-3.5 w-1/3 font-bold text-neutral-700 bg-neutral-50/80 text-sm">Journal Quartile</td>
                      <td className="p-3.5 font-semibold text-purple-900 text-sm">
                        {detailItem.journal_quartile === "T" ? "T (Temporary)" : `Q${detailItem.journal_quartile}`}
                      </td>
                    </tr>
                  )}
                  {detailItem.isbn && (
                    <tr className="bg-white">
                      <td className="p-3.5 w-1/3 font-bold text-neutral-700 bg-neutral-50/80 text-sm">ISBN Number</td>
                      <td className="p-3.5 font-mono font-semibold text-neutral-800 text-sm">{detailItem.isbn}</td>
                    </tr>
                  )}
                  {Array.isArray(detailItem.associated_faculty) && detailItem.associated_faculty.length > 0 && (
                    <tr className="bg-white">
                      <td className="p-3.5 w-1/3 font-bold text-[#85261e] bg-neutral-50/80 text-sm">Associated Faculty</td>
                      <td className="p-3.5">
                        <div className="flex flex-wrap gap-2">
                          {detailItem.associated_faculty.map((co: any, ci: number) => (
                            <Link
                              key={ci}
                              href={`/people/faculty/${co.employee_code || co.code || co.id}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-[#85261e]/10 text-[#85261e] hover:bg-[#85261e] hover:text-white transition"
                            >
                              <Users className="w-3.5 h-3.5" />
                              <span>{co.full_name || co.name}</span>
                              <span className="text-xs opacity-75 font-mono">({co.employee_code || co.code || "CSE"})</span>
                            </Link>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                  {detailItem.doi && (
                    <tr className="bg-white">
                      <td className="p-3.5 w-1/3 font-bold text-neutral-700 bg-neutral-50/80 text-sm">DOI Link</td>
                      <td className="p-3.5">
                        <a
                          href={detailItem.doi.startsWith("http") ? detailItem.doi : `https://doi.org/${detailItem.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#85261e] hover:underline font-semibold inline-flex items-center gap-1 text-sm"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> {detailItem.doi}
                        </a>
                      </td>
                    </tr>
                  )}
                  {detailItem.place && (
                    <tr className="bg-white">
                      <td className="p-3.5 w-1/3 font-bold text-neutral-700 bg-neutral-50/80 text-sm">Awarding Agency / Place</td>
                      <td className="p-3.5 text-neutral-800 font-semibold text-sm">{detailItem.place}</td>
                    </tr>
                  )}
                  {(detailItem.reference_number || detailItem.reference_no) && (
                    <tr className="bg-white">
                      <td className="p-3.5 w-1/3 font-bold text-neutral-700 bg-neutral-50/80 text-sm">Reference / Sanction No.</td>
                      <td className="p-3.5 font-mono font-bold text-neutral-800 text-sm">{detailItem.reference_number || detailItem.reference_no}</td>
                    </tr>
                  )}
                  {detailItem.duration && (
                    <tr className="bg-white">
                      <td className="p-3.5 w-1/3 font-bold text-neutral-700 bg-neutral-50/80 text-sm">Duration</td>
                      <td className="p-3.5 text-neutral-800 font-semibold text-sm">{detailItem.duration}</td>
                    </tr>
                  )}
                  {detailItem.principal_investigator && (
                    <tr className="bg-white">
                      <td className="p-3.5 w-1/3 font-bold text-neutral-700 bg-neutral-50/80 text-sm">Principal Investigator (PI)</td>
                      <td className="p-3.5 text-neutral-900 font-semibold text-sm">{detailItem.principal_investigator}</td>
                    </tr>
                  )}
                  {detailItem.co_principal_investigator && (
                    <tr className="bg-white">
                      <td className="p-3.5 w-1/3 font-bold text-neutral-700 bg-neutral-50/80 text-sm">Co-PI</td>
                      <td className="p-3.5 text-neutral-800 text-sm">{detailItem.co_principal_investigator}</td>
                    </tr>
                  )}
                  {detailItem.co_supervisor && (
                    <tr className="bg-white">
                      <td className="p-3.5 w-1/3 font-bold text-neutral-700 bg-neutral-50/80 text-sm">Co-Supervisors</td>
                      <td className="p-3.5 text-neutral-800 font-semibold text-sm">{detailItem.co_supervisor}</td>
                    </tr>
                  )}
                  {detailItem.category && (
                    <tr className="bg-white">
                      <td className="p-3.5 w-1/3 font-bold text-neutral-700 bg-neutral-50/80 text-sm">Category</td>
                      <td className="p-3.5 capitalize font-semibold text-neutral-800 text-sm">{detailItem.category}</td>
                    </tr>
                  )}
                  {detailItem.host_organization && (
                    <tr className="bg-white">
                      <td className="p-3.5 w-1/3 font-bold text-neutral-700 bg-neutral-50/80 text-sm">Host Institution</td>
                      <td className="p-3.5 text-neutral-800 font-semibold text-sm">{detailItem.host_organization}</td>
                    </tr>
                  )}
                  {(detailItem.start_date || detailItem.date || detailItem.talk_date) && (
                    <tr className="bg-white">
                      <td className="p-3.5 w-1/3 font-bold text-neutral-700 bg-neutral-50/80 text-sm">Start Date</td>
                      <td className="p-3.5 text-neutral-800 font-semibold text-sm">{detailItem.start_date || detailItem.date || detailItem.talk_date}</td>
                    </tr>
                  )}
                  {detailItem.end_date && (
                    <tr className="bg-white">
                      <td className="p-3.5 w-1/3 font-bold text-neutral-700 bg-neutral-50/80 text-sm">End Date</td>
                      <td className="p-3.5 text-neutral-800 font-semibold text-sm">{detailItem.end_date}</td>
                    </tr>
                  )}
                  {detailItem.abstract_text && (
                    <tr className="bg-white">
                      <td className="p-3.5 w-1/3 font-bold text-neutral-700 bg-neutral-50/80 text-sm">Abstract / Summary</td>
                      <td className="p-3.5 text-neutral-700 leading-relaxed text-sm">{detailItem.abstract_text}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100">
                {canEdit ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(detailItem)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-sm transition cursor-pointer"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit Entry</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteRecord(detailItem)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-xs text-neutral-400 font-medium">
                    Official Institutional Record • NIT Hamirpur
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {detailItem.doi && (
                    <a
                      href={detailItem.doi.startsWith("http") ? detailItem.doi : `https://doi.org/${detailItem.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#85261e] text-white hover:bg-[#33110e] font-bold text-sm transition"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Open Document</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsDetailsModalOpen(false)}
                    className="px-5 py-2 rounded-xl border border-[#eedfd8] text-neutral-700 hover:bg-neutral-50 font-bold text-sm cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
