"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
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
  ChevronLeft,
  ChevronRight,
  Filter,
  RotateCcw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect } from "react";
import { MOCK_FACULTY, MOCK_PHD_SCHOLARS } from "@/lib/mock-data";
import { getStoredData, getStoredObject } from "@/lib/faculty-storage";
import { useDepartment } from "@/context/department-context";

const PUBS_PER_PAGE = 10;

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

  useEffect(() => {
    if (baseFaculty) {
      setFaculty(getStoredObject(baseFaculty, "profile", baseFaculty));
      setAllFacultyPubs(getStoredData(baseFaculty, "publications", baseFaculty.publications || []));
      setAllFacultyPatents(getStoredData(baseFaculty, "patents", baseFaculty.patents || []));
      setAllFacultyProjects(getStoredData(baseFaculty, "projects", baseFaculty.projects || []));
      setAllSupervisions(getStoredData(baseFaculty, "supervisions", baseFaculty.supervisions || []));
      setAllQualifications(getStoredData(baseFaculty, "qualifications", baseFaculty.qualifications || []));
      setAllTeachingExp(getStoredData(baseFaculty, "teaching_experiences", baseFaculty.teaching_experiences || []));
      setAllAdminExp(getStoredData(baseFaculty, "admin_experiences", baseFaculty.administrative_experiences || []));
      setAllHonors(getStoredData(baseFaculty, "honors", baseFaculty.honors || []));
      setAllTalks(getStoredData(baseFaculty, "expert_talks", baseFaculty.expert_talks || []));
    }
  }, [baseFaculty]);

  const [activeTab, setActiveTab] = useState<
    "publications" | "patents" | "projects" | "supervisions" | "qualifications" | "experience"
  >("publications");
  const [pubSearch, setPubSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedAbstractId, setExpandedAbstractId] = useState<string | null>(null);

  // Combined Research Supervisions (base faculty supervisions + matching PhD scholars)
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

  // Highlight Stats (Inspired by MNIT presentation, calculated from canonical records)
  const journalCount = useMemo(() => {
    return allFacultyPubs.filter(
      (p: any) =>
        p.publication_type?.toUpperCase() === "JOURNAL" ||
        p.type?.toUpperCase() === "JOURNAL"
    ).length;
  }, [allFacultyPubs]);

  const conferenceCount = useMemo(() => {
    return allFacultyPubs.filter(
      (p: any) =>
        p.publication_type?.toUpperCase() === "CONFERENCE" ||
        p.type?.toUpperCase() === "CONFERENCE"
    ).length;
  }, [allFacultyPubs]);

  const projectCount = allFacultyProjects.length;

  const phdSupervisedCount = useMemo(() => {
    const phdList = combinedSupervisions.filter(
      (s: any) =>
        s.level?.toLowerCase().includes("ph") ||
        s.programme?.toLowerCase().includes("ph") ||
        !s.level
    );
    return phdList.length > 0 ? phdList.length : combinedSupervisions.length;
  }, [combinedSupervisions]);

  const patentCount = allFacultyPatents.length;

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

  if (!faculty) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-[#33110e]">Faculty Member Not Found</h2>
        <p className="mt-2 text-neutral-600">The faculty profile you are looking for does not exist.</p>
        <Link href={`/people/faculty?dept=${effectiveDeptSlug}`} className="mt-6 inline-flex items-center gap-2 text-[#85261e] font-semibold hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Faculty Directory
        </Link>
      </div>
    );
  }

  if (isDeptMismatch) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-6 bg-white min-h-[85vh] font-sans">
        {/* Back Link */}
        <Link
          href={`/people/faculty?dept=${effectiveDeptSlug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-[#33110e] transition"
        >
          <ArrowLeft className="h-4 w-4 text-[#85261e]" /> Back to {effectiveDepartment.code} Faculty Directory
        </Link>

        {/* Department Mismatch Card */}
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

  // Available Years for filter chips
  const pubYears = useMemo(() => {
    const years = new Set<number>();
    allFacultyPubs.forEach((p: any) => {
      if (p.year) years.add(Number(p.year));
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [allFacultyPubs]);

  // Filtered Publications
  const filteredPubs = useMemo(() => {
    return allFacultyPubs.filter((p: any) => {
      const searchLower = pubSearch.toLowerCase();
      const matchesSearch =
        !pubSearch ||
        p.title?.toLowerCase().includes(searchLower) ||
        p.journal_or_conference_name?.toLowerCase().includes(searchLower) ||
        p.raw_authors?.toLowerCase().includes(searchLower);

      const matchesYear = selectedYear === "ALL" || String(p.year) === selectedYear;
      const matchesType = selectedType === "ALL" || p.publication_type === selectedType;

      return matchesSearch && matchesYear && matchesType;
    });
  }, [allFacultyPubs, pubSearch, selectedYear, selectedType]);

  const totalPubPages = Math.ceil(filteredPubs.length / PUBS_PER_PAGE) || 1;
  const paginatedPubs = useMemo(() => {
    const start = (currentPage - 1) * PUBS_PER_PAGE;
    return filteredPubs.slice(start, start + PUBS_PER_PAGE);
  }, [filteredPubs, currentPage]);

  const handleCopyCitation = (pub: any) => {
    const authors = pub.raw_authors || faculty.full_name;
    const citation = `${authors} (${pub.year}). "${pub.title}." ${pub.journal_or_conference_name || 'Publication'}, ${pub.volume ? `Vol. ${pub.volume}, ` : ""}${pub.pages ? `pp. ${pub.pages}. ` : ""}${pub.doi ? `https://doi.org/${pub.doi}` : ""}`;
    navigator.clipboard.writeText(citation);
    setCopiedId(pub.id);
    toast.success("Citation copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6 bg-white min-h-[85vh]">
      {/* Back Link */}
      <Link
        href={`/people/faculty?dept=${facultyDeptSlug}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-[#33110e] transition"
      >
        <ArrowLeft className="h-4 w-4 text-[#85261e]" /> Back to {facultyDeptCode} Faculty Directory
      </Link>

      {/* 1. Header Hero Card (Signature tempcse Institutional Style) */}
      <div className="bg-[#fff9f6] border border-[#eedfd8] rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          {/* Profile Photo Frame */}
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-3 border-[#85261e] shadow-sm bg-neutral-100 flex-shrink-0 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={faculty.image_url || "/hod.jpg"}
              alt={faculty.full_name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400";
              }}
            />
          </div>

          {/* Core Info */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#33110e] text-white text-xs font-bold px-2.5 py-0.5 rounded font-mono">
                {faculty.employee_code}
              </span>
              <span className="bg-[#85261e]/10 text-[#85261e] text-xs font-bold px-2.5 py-0.5 rounded border border-[#85261e]/20">
                {faculty.designation}
              </span>
              <span className="text-xs text-neutral-600 font-semibold">
                Department of {facultyDeptName}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#33110e] tracking-tight">
              {faculty.full_name}
            </h1>

            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed max-w-3xl">
              {faculty.profile?.bio}
            </p>

            {/* Contacts & Social Links */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-neutral-600">
              <a
                href={`mailto:${faculty.email}`}
                className="flex items-center gap-1.5 font-medium hover:text-[#33110e] text-[#85261e]"
              >
                <Mail className="w-3.5 h-3.5" /> {faculty.email}
              </a>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-neutral-400" /> {faculty.phone}
              </span>
              {faculty.profile?.personal_website && (
                <a
                  href={faculty.profile.personal_website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[#33110e] font-semibold hover:underline"
                >
                  <Globe className="w-3.5 h-3.5" /> Institute Portfolio <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              )}
            </div>

            {/* Scholar Indices */}
            <div className="flex flex-wrap gap-2 pt-2 text-[11px]">
              {faculty.profile?.orcid && (
                <span className="bg-white border border-[#eedfd8] px-2.5 py-1 rounded text-neutral-700">
                  <strong className="text-neutral-900">ORCID:</strong> {faculty.profile.orcid}
                </span>
              )}
              {faculty.profile?.scopus_id && (
                <a
                  href={faculty.profile.scopus_id.startsWith("http") ? faculty.profile.scopus_id : `https://www.scopus.com/authid/detail.uri?authorId=${faculty.profile.scopus_id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white border border-[#eedfd8] px-2.5 py-1 rounded text-[#85261e] font-semibold hover:underline flex items-center gap-1"
                >
                  Scopus Profile <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              )}
              {faculty.profile?.google_scholar_id && (
                <a
                  href={faculty.profile.google_scholar_id.startsWith("http") ? faculty.profile.google_scholar_id : `https://scholar.google.com/citations?user=${faculty.profile.google_scholar_id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white border border-[#eedfd8] px-2.5 py-1 rounded text-[#85261e] font-semibold hover:underline flex items-center gap-1"
                >
                  Google Scholar <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Faculty Stats Highlight Cards (Inspired by MNIT presentation, formatted with NITH institutional design) */}
      <div className={`grid grid-cols-2 ${patentCount > 0 ? "sm:grid-cols-3 lg:grid-cols-5" : "lg:grid-cols-4"} gap-3 sm:gap-4`}>
        {/* Card 1: Journal Publications */}
        <button
          type="button"
          onClick={() => {
            setActiveTab("publications");
            setSelectedType("JOURNAL");
            setCurrentPage(1);
          }}
          className="group flex flex-col items-center justify-center p-4 sm:p-5 rounded-xl border border-[#eedfd8] bg-[#fff9f6] hover:bg-white hover:border-[#85261e]/50 transition-all duration-200 shadow-xs hover:shadow-md text-center relative overflow-hidden cursor-pointer"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#85261e] opacity-85 group-hover:opacity-100 transition" />
          <div className="w-10 h-10 rounded-xl bg-[#85261e]/10 text-[#85261e] flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:bg-[#85261e] group-hover:text-white transition-all duration-200">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#33110e] tracking-tight group-hover:text-[#85261e] transition">
            {journalCount}
          </div>
          <div className="text-xs sm:text-sm font-bold text-neutral-800 mt-1">
            Journal Publications
          </div>
          <div className="text-[11px] text-neutral-500 font-medium mt-0.5 flex items-center gap-1">
            <span>Peer-Reviewed</span>
            <span className="text-[#85261e] opacity-0 group-hover:opacity-100 transition text-[10px]">→</span>
          </div>
        </button>

        {/* Card 2: Conference Publications */}
        <button
          type="button"
          onClick={() => {
            setActiveTab("publications");
            setSelectedType("CONFERENCE");
            setCurrentPage(1);
          }}
          className="group flex flex-col items-center justify-center p-4 sm:p-5 rounded-xl border border-[#eedfd8] bg-[#fffdfa] hover:bg-white hover:border-amber-600/50 transition-all duration-200 shadow-xs hover:shadow-md text-center relative overflow-hidden cursor-pointer"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-600 opacity-85 group-hover:opacity-100 transition" />
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-800 flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all duration-200">
            <Award className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#33110e] tracking-tight group-hover:text-amber-800 transition">
            {conferenceCount}
          </div>
          <div className="text-xs sm:text-sm font-bold text-neutral-800 mt-1">
            Conference Publications
          </div>
          <div className="text-[11px] text-neutral-500 font-medium mt-0.5 flex items-center gap-1">
            <span>Proceedings & Talks</span>
            <span className="text-amber-700 opacity-0 group-hover:opacity-100 transition text-[10px]">→</span>
          </div>
        </button>

        {/* Optional Card 3: Patents (rendered when faculty has patents) */}
        {patentCount > 0 && (
          <button
            type="button"
            onClick={() => {
              setActiveTab("patents");
            }}
            className="group flex flex-col items-center justify-center p-4 sm:p-5 rounded-xl border border-[#eedfd8] bg-[#fdfcff] hover:bg-white hover:border-purple-600/50 transition-all duration-200 shadow-xs hover:shadow-md text-center relative overflow-hidden cursor-pointer"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-purple-600 opacity-85 group-hover:opacity-100 transition" />
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-800 flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-200">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#33110e] tracking-tight group-hover:text-purple-800 transition">
              {patentCount}
            </div>
            <div className="text-xs sm:text-sm font-bold text-neutral-800 mt-1">
              Patents
            </div>
            <div className="text-[11px] text-neutral-500 font-medium mt-0.5 flex items-center gap-1">
              <span>Filed & Granted</span>
              <span className="text-purple-700 opacity-0 group-hover:opacity-100 transition text-[10px]">→</span>
            </div>
          </button>
        )}

        {/* Card 4: Research Projects */}
        <button
          type="button"
          onClick={() => {
            setActiveTab("projects");
          }}
          className="group flex flex-col items-center justify-center p-4 sm:p-5 rounded-xl border border-[#eedfd8] bg-[#fafdfb] hover:bg-white hover:border-emerald-600/50 transition-all duration-200 shadow-xs hover:shadow-md text-center relative overflow-hidden cursor-pointer"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-700 opacity-85 group-hover:opacity-100 transition" />
          <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-800 flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:bg-emerald-700 group-hover:text-white transition-all duration-200">
            <Briefcase className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#33110e] tracking-tight group-hover:text-emerald-800 transition">
            {projectCount}
          </div>
          <div className="text-xs sm:text-sm font-bold text-neutral-800 mt-1">
            Research Projects
          </div>
          <div className="text-[11px] text-neutral-500 font-medium mt-0.5 flex items-center gap-1">
            <span>Sponsored R&D Grants</span>
            <span className="text-emerald-700 opacity-0 group-hover:opacity-100 transition text-[10px]">→</span>
          </div>
        </button>

        {/* Card 5: PhD Research Supervised */}
        <button
          type="button"
          onClick={() => {
            setActiveTab("supervisions");
          }}
          className="group flex flex-col items-center justify-center p-4 sm:p-5 rounded-xl border border-[#eedfd8] bg-[#fafaff] hover:bg-white hover:border-indigo-600/50 transition-all duration-200 shadow-xs hover:shadow-md text-center relative overflow-hidden cursor-pointer"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-700 opacity-85 group-hover:opacity-100 transition" />
          <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-800 flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:bg-indigo-700 group-hover:text-white transition-all duration-200">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#33110e] tracking-tight group-hover:text-indigo-800 transition">
            {phdSupervisedCount}
          </div>
          <div className="text-xs sm:text-sm font-bold text-neutral-800 mt-1">
            PhD Supervised
          </div>
          <div className="text-[11px] text-neutral-500 font-medium mt-0.5 flex items-center gap-1">
            <span>Doctoral Research</span>
            <span className="text-indigo-700 opacity-0 group-hover:opacity-100 transition text-[10px]">→</span>
          </div>
        </button>
      </div>

      {/* 3. Interactive Section Tabs */}
      <div className="border-b border-[#eedfd8] flex flex-wrap gap-2">
        {[
          { id: "publications", label: `Publications (${allFacultyPubs.length})`, icon: BookOpen },
          { id: "patents", label: `Patents (${allFacultyPatents.length})`, icon: Lightbulb },
          { id: "projects", label: `R&D Projects (${allFacultyProjects.length})`, icon: Award },
          { id: "supervisions", label: `Research Guidance (${combinedSupervisions.length})`, icon: GraduationCap },
          { id: "qualifications", label: `Qualifications (${allQualifications.length})`, icon: FileText },
          { id: "experience", label: `Experience & Talks (${allAdminExp.length + allTalks.length})`, icon: Briefcase },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition -mb-[2px] ${
                isActive
                  ? "border-[#85261e] text-[#33110e] bg-[#fff9f6]"
                  : "border-transparent text-neutral-600 hover:text-[#33110e] hover:border-neutral-300"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-[#85261e]" : "text-neutral-400"}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB 1: PUBLICATIONS (Optimized with Year Filters, Type Segment, Search & Compact Cards) */}
      {activeTab === "publications" && (
        <div className="space-y-5">
          {/* Controls Bar: Search + Type Filter */}
          <div className="bg-[#fff9f6] p-3 rounded-lg border border-[#eedfd8] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search within this faculty's papers..."
                value={pubSearch}
                onChange={(e) => {
                  setPubSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded border border-[#eedfd8] bg-white focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
              />
            </div>

            {/* Type Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {[
                { id: "ALL", label: "All Types" },
                { id: "JOURNAL", label: "Journals" },
                { id: "CONFERENCE", label: "Conferences" },
                { id: "BOOK_CHAPTER", label: "Book Chapters" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedType(t.id);
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1 text-xs font-semibold rounded transition ${
                    selectedType === t.id
                      ? "bg-[#33110e] text-white shadow-xs"
                      : "bg-white text-neutral-700 border border-[#eedfd8] hover:bg-[#eedfd8]/40"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Year Filter Chips (Horizontal Scroller) */}
          {pubYears.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-xs font-bold text-[#33110e] flex items-center gap-1 mr-1 flex-shrink-0">
                <Calendar className="w-3.5 h-3.5 text-[#85261e]" /> Year:
              </span>
              <button
                onClick={() => {
                  setSelectedYear("ALL");
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition flex-shrink-0 ${
                  selectedYear === "ALL"
                    ? "bg-[#85261e] text-white font-bold"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                All ({allFacultyPubs.length})
              </button>
              {pubYears.map((yr) => {
                const count = allFacultyPubs.filter((p: any) => p.year === yr).length;
                return (
                  <button
                    key={yr}
                    onClick={() => {
                      setSelectedYear(yr.toString());
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1 text-xs font-semibold rounded-full transition flex-shrink-0 ${
                      selectedYear === yr.toString()
                        ? "bg-[#85261e] text-white font-bold"
                        : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                    }`}
                  >
                    {yr} ({count})
                  </button>
                );
              })}
            </div>
          )}

          {/* Publications List */}
          <div className="space-y-3">
            {paginatedPubs.map((pub: any, idx: number) => {
              const itemNum = (currentPage - 1) * PUBS_PER_PAGE + idx + 1;
              const isExpanded = expandedAbstractId === pub.id;

              return (
                <div
                  key={pub.id}
                  className="bg-white border border-[#eedfd8] rounded-lg p-4 hover:border-[#85261e]/40 transition shadow-xs hover:shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="flex-1 space-y-1.5">
                      {/* Badges & Meta */}
                      <div className="flex flex-wrap items-center gap-2 text-[10px]">
                        <span className="font-mono font-bold text-neutral-500">
                          #{itemNum}
                        </span>
                        <span className="bg-[#33110e] text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                          {pub.publication_type}
                        </span>
                        <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded">
                          {pub.year}
                        </span>
                        {pub.is_sci && (
                          <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-1.5 py-0.5 rounded">
                            SCI Indexed
                          </span>
                        )}
                        {pub.is_scopus && !pub.is_sci && (
                          <span className="bg-sky-100 text-sky-900 border border-sky-300 font-bold px-1.5 py-0.5 rounded">
                            Scopus
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-sm font-bold text-[#1c110c] leading-snug hover:text-[#85261e] transition cursor-pointer">
                        {pub.title}
                      </h3>

                      {/* Authors */}
                      <p className="text-xs text-neutral-600">
                        <strong className="text-neutral-800">Authors:</strong> {pub.raw_authors || faculty.full_name}
                      </p>

                      {/* Journal / Conference Venue */}
                      <p className="text-xs italic text-[#85261e] font-medium">
                        {pub.journal_or_conference_name}
                        {pub.volume && `, Vol. ${pub.volume}`}
                        {pub.issue && `(${pub.issue})`}
                        {pub.pages && `, pp. ${pub.pages}`}
                      </p>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex items-center sm:flex-col gap-1.5 flex-shrink-0 pt-2 sm:pt-0">
                      {pub.doi && (
                        <a
                          href={pub.doi.startsWith("http") ? pub.doi : `https://doi.org/${pub.doi}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 bg-[#33110e] text-white rounded text-[11px] font-semibold hover:bg-[#85261e] transition flex items-center gap-1"
                        >
                          DOI Link <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                      <button
                        onClick={() => handleCopyCitation(pub)}
                        className="px-2.5 py-1 border border-[#eedfd8] text-neutral-700 bg-[#fff9f6] rounded text-[11px] font-semibold hover:bg-[#eedfd8] transition flex items-center gap-1"
                      >
                        {copiedId === pub.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-neutral-500" /> Cite
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredPubs.length === 0 && (
              <div className="text-center py-12 text-neutral-500 text-xs bg-[#fff9f6] rounded-lg border border-[#eedfd8]">
                No publications found matching your search or year criteria.
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPubPages > 1 && (
            <div className="flex items-center justify-between pt-3 text-xs text-neutral-600 border-t border-[#eedfd8]">
              <p>
                Showing {(currentPage - 1) * PUBS_PER_PAGE + 1} to{" "}
                {Math.min(currentPage * PUBS_PER_PAGE, filteredPubs.length)} of {filteredPubs.length} papers
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded border border-[#eedfd8] bg-white disabled:opacity-40 hover:bg-[#fff9f6]"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 py-1 font-semibold text-[#33110e]">
                  Page {currentPage} of {totalPubPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPubPages, p + 1))}
                  disabled={currentPage === totalPubPages}
                  className="p-1.5 rounded border border-[#eedfd8] bg-white disabled:opacity-40 hover:bg-[#fff9f6]"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PATENTS */}
      {activeTab === "patents" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allFacultyPatents.map((pat: any) => (
              <div key={pat.id} className="bg-white border border-[#eedfd8] rounded-lg p-4 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    pat.status === "Granted" ? "bg-emerald-100 text-emerald-900 border border-emerald-300" : "bg-amber-100 text-amber-900 border border-amber-300"
                  }`}>
                    {pat.status}
                  </span>
                  <span className="text-xs text-neutral-500 font-semibold">{pat.year}</span>
                </div>
                <h3 className="text-sm font-bold text-[#33110e]">{pat.title}</h3>
                <div className="text-xs text-neutral-600 space-y-0.5 border-t border-[#f4ece8] pt-2">
                  <p><strong>App Number:</strong> {pat.application_number}</p>
                  <p><strong>Inventors:</strong> {pat.raw_inventors || faculty.full_name}</p>
                  <p><strong>Office:</strong> {pat.patent_office} ({pat.country})</p>
                </div>
              </div>
            ))}
          </div>
          {allFacultyPatents.length === 0 && (
            <div className="text-center py-12 text-neutral-500 text-xs bg-[#fff9f6] rounded-lg border border-[#eedfd8]">
              No patents on record for this faculty member.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SPONSORED PROJECTS */}
      {activeTab === "projects" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allFacultyProjects.map((prj: any) => (
              <div key={prj.id} className="bg-white border border-[#eedfd8] rounded-lg p-4 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    prj.status === "Ongoing" ? "bg-blue-100 text-blue-900 border border-blue-300" : "bg-neutral-100 text-neutral-800"
                  }`}>
                    {prj.status}
                  </span>
                  <span className="text-xs text-[#85261e] font-bold">
                    ₹{(prj.total_sanctioned_amount / 100000).toFixed(2)} Lakhs
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#33110e]">{prj.title}</h3>
                <div className="text-xs text-neutral-600 space-y-0.5 border-t border-[#f4ece8] pt-2">
                  <p><strong>Funding Agency:</strong> {prj.funding_agency}</p>
                  <p><strong>Ref Number:</strong> {prj.reference_number || "N/A"}</p>
                  <p><strong>Principal Investigator:</strong> {prj.raw_investigators || faculty.full_name}</p>
                </div>
              </div>
            ))}
          </div>
          {allFacultyProjects.length === 0 && (
            <div className="text-center py-12 text-neutral-500 text-xs bg-[#fff9f6] rounded-lg border border-[#eedfd8]">
              No sponsored projects on record for this faculty member.
            </div>
          )}
        </div>
      )}

      {/* TAB 4: RESEARCH GUIDANCE & SUPERVISIONS (Doctoral & PG Scholars) */}
      {activeTab === "supervisions" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#eedfd8] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#33110e] uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#85261e]" /> Doctoral & Master&apos;s Research Guidance
              </h3>
              <p className="text-xs text-neutral-600 mt-0.5">
                Scholars guided for Ph.D. dissertations and postgraduate research.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-semibold">
                Completed / Awarded: {combinedSupervisions.filter((s: any) => s.status?.toLowerCase().includes("award") || s.status?.toLowerCase().includes("complet") || s.status?.toLowerCase().includes("pass")).length}
              </span>
              <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full font-semibold">
                Ongoing: {combinedSupervisions.filter((s: any) => s.status?.toLowerCase().includes("ongoing") || s.status?.toLowerCase().includes("pursu")).length}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {combinedSupervisions.map((sup: any, i: number) => {
              const isAwarded =
                sup.status?.toLowerCase().includes("award") ||
                sup.status?.toLowerCase().includes("complet") ||
                sup.status?.toLowerCase().includes("pass");
              return (
                <div
                  key={i}
                  className="bg-[#fff9f6] border border-[#eedfd8] rounded-xl p-4 shadow-xs hover:shadow-md transition space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-white border border-[#eedfd8] text-[#33110e]">
                        <GraduationCap className="w-3.5 h-3.5 text-[#85261e]" />
                        {sup.level || "Ph.D."}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isAwarded
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-amber-50 text-amber-800 border-amber-200"
                        }`}
                      >
                        {isAwarded ? "Degree Awarded" : "Ongoing"}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#33110e]">
                      {sup.student_name}
                    </h4>

                    {sup.roll_number && (
                      <p className="text-[11px] font-mono text-neutral-500">
                        Roll No: {sup.roll_number}
                      </p>
                    )}

                    <p className="text-xs text-neutral-700 leading-relaxed">
                      <strong className="text-neutral-900 font-medium">Topic:</strong> &ldquo;{sup.thesis_title}&rdquo;
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#eedfd8]/60 text-[11px] text-neutral-600 flex flex-wrap items-center justify-between gap-1">
                    {sup.year && (
                      <span><strong>Year:</strong> {sup.year}</span>
                    )}
                    {sup.co_supervisor && (
                      <span><strong>Co-Supervisor:</strong> {sup.co_supervisor}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {combinedSupervisions.length === 0 && (
            <div className="text-center py-12 text-neutral-500 text-xs bg-[#fff9f6] rounded-lg border border-[#eedfd8]">
              No research supervision records currently listed for this faculty member.
            </div>
          )}
        </div>
      )}

      {/* TAB 5: QUALIFICATIONS */}
      {activeTab === "qualifications" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {allQualifications.map((q: any, i: number) => (
              <div key={i} className="bg-[#fff9f6] border border-[#eedfd8] rounded-lg p-4 shadow-xs space-y-1">
                <GraduationCap className="w-5 h-5 text-[#85261e] mb-1" />
                <h3 className="text-sm font-bold text-[#33110e]">{q.degree}</h3>
                <p className="text-xs text-neutral-700">{q.institute}</p>
                <p className="text-[11px] font-semibold text-[#85261e]">Year of Completion: {q.year}</p>
              </div>
            ))}
          </div>
          {allQualifications.length === 0 && (
            <div className="text-center py-12 text-neutral-500 text-xs bg-[#fff9f6] rounded-lg border border-[#eedfd8]">
              Educational qualification records are being updated.
            </div>
          )}
        </div>
      )}

      {/* TAB 5: ADMINISTRATIVE EXPERIENCE & TALKS */}
      {activeTab === "experience" && (
        <div className="space-y-6">
          {/* Admin Posts */}
          <div>
            <h3 className="text-sm font-bold text-[#33110e] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#85261e]" /> Administrative Responsibilities
            </h3>
            <div className="divide-y divide-[#eedfd8] border border-[#eedfd8] rounded-lg overflow-hidden bg-white">
              {allAdminExp.map((exp: any, i: number) => (
                <div key={i} className="p-3 hover:bg-[#fff9f6] transition flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-bold text-[#33110e]">{exp.position}</h4>
                    <p className="text-neutral-600">{exp.organization}</p>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-500">
                    {exp.start_date} – {exp.end_date}
                  </span>
                </div>
              ))}
              {allAdminExp.length === 0 && (
                <div className="p-4 text-xs text-neutral-500">No administrative posts on record.</div>
              )}
            </div>
          </div>

          {/* Expert Talks */}
          <div>
            <h3 className="text-sm font-bold text-[#33110e] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Mic className="w-4 h-4 text-[#85261e]" /> Expert Talks & Keynotes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allTalks.map((talk: any, i: number) => (
                <div key={i} className="bg-white border border-[#eedfd8] rounded-lg p-3.5 shadow-xs space-y-1 text-xs">
                  <h4 className="font-bold text-[#33110e]">{talk.title}</h4>
                  <p className="text-neutral-700"><strong>Venue / Host:</strong> {talk.venue}</p>
                  <p className="text-neutral-500 text-[11px]"><strong>Dates:</strong> {talk.start_date} to {talk.end_date}</p>
                </div>
              ))}
              {allTalks.length === 0 && (
                <div className="col-span-2 p-4 text-xs text-neutral-500 bg-[#fff9f6] rounded border border-[#eedfd8]">
                  No expert talks recorded.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
