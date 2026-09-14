"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  Layers,
  Filter,
  CheckCircle2,
  RotateCcw,
  GraduationCap,
  Clock,
  Users,
  FileText,
  ExternalLink,
  Download,
  X,
  Sparkles,
  ChevronRight,
  Info,
} from "lucide-react";
import { MOCK_COURSES, MOCK_COURSES_TAUGHT, MOCK_FACULTY } from "@/lib/mock-data";
import { Course, CourseTaught } from "@/lib/types";
import { useDepartment } from "@/context/department-context";
import { DepartmentEmptyState } from "@/components/common/department-empty-state";

export default function CoursesPage() {
  const { activeDepartment } = useDepartment();
  const hasData = activeDepartment.slug === "cse";

  // Search & Filter States
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [semesterFilter, setSemesterFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Load courses from localStorage if customized by admin, otherwise use authoritative MOCK_COURSES
  const [coursesList, setCoursesList] = useState<Course[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("nith_admin_courses");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch {}
      }
    }
    return MOCK_COURSES;
  });

  // Load allocations from localStorage if customized by admin, otherwise use MOCK_COURSES_TAUGHT
  const [allocationsList] = useState<CourseTaught[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("nith_admin_course_allocations");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch {}
      }
    }
    return MOCK_COURSES_TAUGHT;
  });

  // Re-sync with localStorage if changed
  useEffect(() => {
    const handleStorage = () => {
      const stored = localStorage.getItem("nith_admin_courses");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) setCoursesList(parsed);
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Enrich each course with live instructors if not already populated
  const enrichedCourses: Course[] = useMemo(() => {
    if (!hasData) return [];
    return coursesList.map((course) => {
      if (course.instructors && course.instructors.length > 0) {
        return course;
      }
      // Check allocations
      const matchingAllocations = allocationsList.filter(
        (a) => a.course_code?.toLowerCase() === course.code?.toLowerCase()
      );
      if (matchingAllocations.length > 0) {
        const instructors = matchingAllocations.map((a) => {
          const fac = MOCK_FACULTY.find(
            (f) =>
              f.employee_code?.toLowerCase() === a.faculty_code?.toLowerCase() ||
              f.full_name?.toLowerCase() === a.faculty_name?.toLowerCase()
          );
          return {
            faculty_id: a.faculty_id || fac?.id,
            faculty_code: a.faculty_code || fac?.employee_code,
            faculty_name: a.faculty_name || fac?.full_name || "Faculty Member",
            faculty_slug: (a.faculty_code || fac?.employee_code || "").toLowerCase(),
            designation: fac?.designation || "Faculty Member",
          };
        });
        return { ...course, instructors };
      }
      return course;
    });
  }, [coursesList, allocationsList, hasData]);

  // Filtered Courses
  const filtered = useMemo(() => {
    if (!hasData) return [];
    return enrichedCourses.filter((c) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.type?.toLowerCase().includes(q) ||
        (c.instructors &&
          c.instructors.some(
            (inst) =>
              inst.faculty_name.toLowerCase().includes(q) ||
              inst.faculty_code?.toLowerCase().includes(q)
          ));

      const matchesLevel =
        levelFilter === "ALL" || c.level?.toUpperCase() === levelFilter.toUpperCase();
      const matchesSemester =
        semesterFilter === "ALL" || String(c.semester) === String(semesterFilter);
      
      const matchesType =
        typeFilter === "ALL" ||
        (typeFilter === "Core" && c.type?.toLowerCase().includes("core")) ||
        (typeFilter === "Elective" && c.type?.toLowerCase().includes("elective")) ||
        (typeFilter === "Laboratory" && c.type?.toLowerCase().includes("lab")) ||
        (typeFilter === "Project" && c.type?.toLowerCase().includes("project"));

      return matchesSearch && matchesLevel && matchesSemester && matchesType;
    });
  }, [search, levelFilter, semesterFilter, typeFilter, enrichedCourses, hasData]);

  // Statistics Summary
  const stats = useMemo(() => {
    const total = enrichedCourses.length;
    const ug = enrichedCourses.filter((c) => c.level === "UG").length;
    const pg = enrichedCourses.filter((c) => c.level === "PG").length;
    const doctoral = enrichedCourses.filter((c) => c.level === "Doctoral").length;
    const labs = enrichedCourses.filter((c) => c.type?.toLowerCase().includes("lab")).length;
    return { total, ug, pg, doctoral, labs };
  }, [enrichedCourses]);

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  const resetFilters = () => {
    setSearch("");
    setLevelFilter("ALL");
    setSemesterFilter("ALL");
    setTypeFilter("ALL");
  };

  const isFilterActive =
    search !== "" || levelFilter !== "ALL" || semesterFilter !== "ALL" || typeFilter !== "ALL";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6 bg-white min-h-[85vh] font-sans">
      {/* 1. Header with Actions & Syllabus Link */}
      <div className="border-b border-[#eedfd8] pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-[#85261e]" />
              Curriculum &amp; Course Catalogue
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-extrabold px-2.5 py-0.5 rounded uppercase font-mono shadow-2xs">
              {activeDepartment.code}
            </span>
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold px-2 py-0.5 rounded">
              NEP-2020 Restructured Scheme
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1 max-w-3xl leading-relaxed">
            Authoritative curriculum database of core theory courses, discipline &amp; stream electives,
            practical computing laboratories, and capstone research modules offered across Undergraduate (UG),
            Postgraduate (PG), and Doctoral (Ph.D.) levels by the Department of {activeDepartment.name}.
          </p>
        </div>

        {/* Action: Official Syllabus Download Button */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <a
            href="https://nith.ac.in/uploads/topics/new-nep-cse-syllabus17222307132912.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#33110e] hover:bg-[#85261e] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Official Syllabus PDF</span>
          </a>
        </div>
      </div>

      {!hasData ? (
        <DepartmentEmptyState sectionTitle="Curriculum & Course Catalogue" />
      ) : (
        <>
          {/* 2. Key Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-[#fff9f6] border border-[#eedfd8] rounded-xl p-3.5 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Total Courses</span>
              <p className="text-xl font-extrabold text-[#33110e] mt-0.5">{stats.total}</p>
              <span className="text-[10px] text-neutral-500">Across All Programs</span>
            </div>
            <div className="bg-[#fff9f6] border border-[#eedfd8] rounded-xl p-3.5 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Undergraduate</span>
              <p className="text-xl font-extrabold text-[#85261e] mt-0.5">{stats.ug}</p>
              <span className="text-[10px] text-neutral-500">B.Tech &amp; Dual Degree</span>
            </div>
            <div className="bg-[#fff9f6] border border-[#eedfd8] rounded-xl p-3.5 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Postgraduate</span>
              <p className="text-xl font-extrabold text-amber-700 mt-0.5">{stats.pg}</p>
              <span className="text-[10px] text-neutral-500">M.Tech AI &amp; Computing</span>
            </div>
            <div className="bg-[#fff9f6] border border-purple-200 rounded-xl p-3.5 shadow-2xs bg-gradient-to-br from-purple-50/50 to-white">
              <span className="text-[10px] uppercase font-bold text-purple-800 tracking-wider flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-purple-700" />
                Doctoral (Ph.D.)
              </span>
              <p className="text-xl font-extrabold text-purple-950 mt-0.5">{stats.doctoral}</p>
              <span className="text-[10px] text-purple-700 font-medium">Advanced Research Modules</span>
            </div>
            <div className="bg-[#fff9f6] border border-[#eedfd8] rounded-xl p-3.5 shadow-2xs col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Computing Labs</span>
              <p className="text-xl font-extrabold text-emerald-800 mt-0.5">{stats.labs}</p>
              <span className="text-[10px] text-neutral-500">Software &amp; Systems Labs</span>
            </div>
          </div>

          {/* 3. Filter Bar */}
          <div className="bg-[#fff9f6] border border-[#eedfd8] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
            {/* Top row: Search + Level + Reset */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by course code, title, instructor name (e.g. Lalit, Naveen), or topic..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#eedfd8] bg-white text-[#33110e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e] shadow-2xs"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Level Filter */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#eedfd8] shadow-2xs overflow-x-auto no-scrollbar">
                {[
                  { id: "ALL", label: "All Levels" },
                  { id: "UG", label: "Undergraduate (UG)" },
                  { id: "PG", label: "Postgraduate (PG)" },
                  { id: "Doctoral", label: "Doctoral (Ph.D.)" },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => setLevelFilter(lvl.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap cursor-pointer ${
                      levelFilter === lvl.id
                        ? "bg-[#33110e] text-white shadow-xs"
                        : "text-[#33110e] hover:bg-[#eedfd8]/40"
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>

              {/* Reset Filters button */}
              {isFilterActive && (
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#85261e] bg-white border border-[#eedfd8] hover:bg-[#eedfd8]/50 px-3 py-2 rounded-xl transition cursor-pointer shadow-2xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Middle row: Course Type Filter */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-[#eedfd8]/60">
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mr-1">
                Course Type:
              </span>
              {[
                { id: "ALL", label: "All Types" },
                { id: "Core", label: "Core Theory" },
                { id: "Elective", label: "Electives (Discipline/Stream)" },
                { id: "Laboratory", label: "Laboratory Practical" },
                { id: "Project", label: "Capstone / Major Project" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTypeFilter(t.id)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                    typeFilter === t.id
                      ? "bg-[#85261e] text-white font-bold shadow-2xs"
                      : "bg-white text-neutral-700 border border-[#eedfd8] hover:bg-[#eedfd8]/40"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Bottom row: Semester Pills */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-[#eedfd8]/60">
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mr-1">
                Semester:
              </span>
              <button
                onClick={() => setSemesterFilter("ALL")}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  semesterFilter === "ALL"
                    ? "bg-[#33110e] text-white font-bold"
                    : "bg-white text-neutral-700 border border-[#eedfd8] hover:bg-neutral-100"
                }`}
              >
                All Semesters
              </button>
              {semesters.map((sem) => (
                <button
                  key={sem}
                  onClick={() => setSemesterFilter(String(sem))}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                    semesterFilter === String(sem)
                      ? "bg-[#85261e] text-white font-bold shadow-2xs"
                      : "bg-white text-neutral-700 border border-[#eedfd8] hover:bg-neutral-100"
                  }`}
                >
                  Sem {sem}
                </button>
              ))}
              <button
                onClick={() => {
                  setLevelFilter("PG");
                  setSemesterFilter("1");
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  levelFilter === "PG" && semesterFilter === "1"
                    ? "bg-[#85261e] text-white font-bold shadow-2xs"
                    : "bg-white text-neutral-700 border border-[#eedfd8] hover:bg-neutral-100"
                }`}
              >
                PG Sem 1
              </button>
              <button
                onClick={() => {
                  setLevelFilter("PG");
                  setSemesterFilter("2");
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  levelFilter === "PG" && semesterFilter === "2"
                    ? "bg-[#85261e] text-white font-bold shadow-2xs"
                    : "bg-white text-neutral-700 border border-[#eedfd8] hover:bg-neutral-100"
                }`}
              >
                PG Sem 2
              </button>
              <button
                onClick={() => {
                  setLevelFilter("Doctoral");
                  setSemesterFilter("ALL");
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  levelFilter === "Doctoral"
                    ? "bg-purple-900 text-white font-bold shadow-xs"
                    : "bg-purple-50 text-purple-950 border border-purple-200 hover:bg-purple-100"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-purple-700" />
                <span>Doctoral (Ph.D.)</span>
              </button>
            </div>
          </div>

          {/* Results count header */}
          <div className="flex items-center justify-between text-xs text-neutral-600 px-1">
            <p>
              Showing <strong className="text-[#33110e]">{filtered.length}</strong> course
              {filtered.length === 1 ? "" : "s"}
              {isFilterActive && " matching active filters"}
            </p>
            <span className="text-[11px] font-mono text-neutral-500">
              Academic Session 2024-2025
            </span>
          </div>

          {/* 4. Course Cards Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-[#fff9f6]/40 border border-dashed border-[#eedfd8] rounded-2xl p-8 space-y-3">
              <BookOpen className="w-10 h-10 text-[#85261e]/40 mx-auto" />
              <h3 className="text-sm font-bold text-[#33110e]">No Courses Found</h3>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                No course matches your current search criteria. Try modifying your search keywords
                or resetting filters.
              </p>
              <button
                onClick={resetFilters}
                className="mt-2 text-xs font-bold text-[#85261e] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset all filters</span>
              </button>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {filtered.map((course) => {
                const isDoctoral = course.level === "Doctoral";
                const isLab = course.type?.toLowerCase().includes("lab");
                const isCore = course.type?.toLowerCase().includes("core");
                const isElective = course.type?.toLowerCase().includes("elective");

                return (
                  <div
                    key={course.id || course.code}
                    className={`bg-white border rounded-2xl p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4 group ${
                      isDoctoral
                        ? "border-purple-200/80 hover:border-purple-400"
                        : "border-[#eedfd8] hover:border-[#85261e]/40"
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Top Badges & Credits */}
                      <div className="flex items-start justify-between gap-2 border-b border-[#eedfd8]/60 pb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`font-mono font-extrabold text-sm px-2.5 py-0.5 rounded-lg border ${
                              isDoctoral
                                ? "text-purple-900 bg-purple-50 border-purple-200"
                                : "text-[#85261e] bg-[#fff9f6] border-[#eedfd8]"
                            }`}
                          >
                            {course.code}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${
                              isDoctoral
                                ? "bg-purple-50 text-purple-900 border-purple-200"
                                : "bg-[#fff9f6] text-[#33110e] border-[#eedfd8]"
                            }`}
                          >
                            {course.level} • {course.level === "Doctoral" ? "Ph.D. Research" : `Sem ${course.semester}`}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1 ${
                              isDoctoral
                                ? "bg-purple-100 text-purple-950 border border-purple-300 font-extrabold"
                                : isLab
                                ? "bg-teal-50 text-teal-800 border border-teal-200"
                                : isCore
                                ? "bg-rose-50 text-rose-900 border border-rose-200"
                                : isElective
                                ? "bg-amber-50 text-amber-900 border border-amber-200"
                                : "bg-neutral-100 text-neutral-800 border border-neutral-200"
                            }`}
                          >
                            {isDoctoral && <GraduationCap className="w-3 h-3 text-purple-700" />}
                            <span>{course.type || (isDoctoral ? "Doctoral Coursework" : "Course")}</span>
                          </span>
                        </div>

                        {/* Credits & L-T-P Pill */}
                        <div className="text-right flex-shrink-0">
                          <span className="font-mono font-bold text-xs bg-amber-50 text-amber-950 border border-amber-300 px-2.5 py-0.5 rounded-md shadow-2xs block">
                            {course.credits} Credits
                          </span>
                          <span className="text-[10px] font-mono text-neutral-500 mt-0.5 block">
                            L-T-P: {course.lecture_hours ?? 3}-{course.tutorial_hours ?? 0}-{course.practical_hours ?? 0}
                          </span>
                        </div>
                      </div>

                      {/* Course Title */}
                      <h3 className="font-bold text-base text-[#1c110c] leading-snug group-hover:text-[#85261e] transition-colors">
                        {course.name}
                      </h3>

                      {/* Instructors / Courses Taught Association */}
                      <div className="bg-[#fff9f6] border border-[#eedfd8]/70 rounded-xl p-3 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                          <Users className="w-3 h-3 text-[#85261e]" />
                          <span>Offered / Taught by:</span>
                        </div>
                        {course.instructors && course.instructors.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {course.instructors.map((inst, idx) => (
                              <Link
                                key={inst.faculty_code || idx}
                                href={`/people/faculty/${inst.faculty_slug || inst.faculty_code?.toLowerCase()}?dept=${activeDepartment.slug}`}
                                className="inline-flex items-center gap-1 bg-white hover:bg-[#eedfd8]/60 border border-[#eedfd8] hover:border-[#85261e]/40 px-2 py-1 rounded-md text-[11px] font-semibold text-[#33110e] transition cursor-pointer shadow-2xs"
                                title={`View ${inst.faculty_name}'s Profile & Teaching Portfolio`}
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-[#85261e]"></span>
                                <span>{inst.faculty_name}</span>
                                <ChevronRight className="w-2.5 h-2.5 text-neutral-400" />
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[11px] text-neutral-500 italic">
                            Department Faculty Team
                          </span>
                        )}
                        {course.coordinator && (
                          <div className="text-[11px] text-[#5c4033] flex items-center gap-1.5 pt-1.5 border-t border-[#eedfd8]/50">
                            <span className="font-bold text-[#33110e]">Coordinator:</span>
                            <span className="font-semibold text-[#85261e]">{course.coordinator}</span>
                          </div>
                        )}
                      </div>

                      {/* Course Description / Outline */}
                      {course.description && (
                        <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3">
                          {course.description}
                        </p>
                      )}
                    </div>

                    {/* Bottom Card Footer */}
                    <div className="pt-3 border-t border-[#eedfd8]/60 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-neutral-500 font-mono">
                        Session: {course.academic_year || "2024-2025"}
                      </span>
                      <button
                        onClick={() => setSelectedCourse(course)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#85261e] hover:text-[#33110e] transition cursor-pointer hover:underline"
                      >
                        <span>View Syllabus Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 5. Detailed Course Syllabus Modal */}
          {selectedCourse && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-[#eedfd8] animate-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="bg-[#33110e] text-white p-5 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-amber-400 text-black text-xs font-extrabold px-2 py-0.5 rounded font-mono">
                        {selectedCourse.code}
                      </span>
                      <span className="bg-white/10 text-white text-[11px] font-semibold px-2 py-0.5 rounded">
                        {selectedCourse.level} • {selectedCourse.level === "Doctoral" ? "Ph.D. Research" : `Semester ${selectedCourse.semester}`}
                      </span>
                      <span className="bg-white/10 text-white text-[11px] font-semibold px-2 py-0.5 rounded">
                        {selectedCourse.type}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white leading-snug">
                      {selectedCourse.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto space-y-5 text-sm text-[#1c110c] divide-y divide-[#eedfd8]/60">
                  {/* Credits and Contact Hours */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-[#fff9f6] border border-[#eedfd8] p-3 rounded-xl text-center">
                      <span className="text-[10px] text-neutral-500 uppercase font-bold block">Total Credits</span>
                      <strong className="text-base text-[#85261e]">{selectedCourse.credits}</strong>
                    </div>
                    <div className="bg-[#fff9f6] border border-[#eedfd8] p-3 rounded-xl text-center">
                      <span className="text-[10px] text-neutral-500 uppercase font-bold block">Lecture Hours (L)</span>
                      <strong className="text-base text-[#33110e]">{selectedCourse.lecture_hours ?? 3} hrs/wk</strong>
                    </div>
                    <div className="bg-[#fff9f6] border border-[#eedfd8] p-3 rounded-xl text-center">
                      <span className="text-[10px] text-neutral-500 uppercase font-bold block">Tutorial (T)</span>
                      <strong className="text-base text-[#33110e]">{selectedCourse.tutorial_hours ?? 0} hrs/wk</strong>
                    </div>
                    <div className="bg-[#fff9f6] border border-[#eedfd8] p-3 rounded-xl text-center">
                      <span className="text-[10px] text-neutral-500 uppercase font-bold block">Practical (P)</span>
                      <strong className="text-base text-[#33110e]">{selectedCourse.practical_hours ?? 0} hrs/wk</strong>
                    </div>
                  </div>

                  {/* Course Instructors / Teaching Faculty */}
                  <div className="pt-4 space-y-2">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-600 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#85261e]" />
                      <span>Assigned Instructors &amp; Course Faculty</span>
                    </h4>
                    {selectedCourse.instructors && selectedCourse.instructors.length > 0 ? (
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        {selectedCourse.instructors.map((inst, idx) => (
                          <div
                            key={idx}
                            className="bg-[#fff9f6] border border-[#eedfd8] p-3 rounded-xl flex items-center justify-between gap-2"
                          >
                            <div>
                              <p className="font-bold text-xs text-[#33110e]">{inst.faculty_name}</p>
                              <p className="text-[11px] text-neutral-500">{inst.designation}</p>
                            </div>
                            <Link
                              href={`/people/faculty/${inst.faculty_slug || inst.faculty_code?.toLowerCase()}?dept=${activeDepartment.slug}`}
                              className="text-[11px] font-bold text-[#85261e] hover:underline flex items-center gap-0.5 flex-shrink-0"
                            >
                              <span>Profile</span>
                              <ChevronRight className="w-3 h-3" />
                            </Link>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-500 italic">
                        Department of {activeDepartment.name} Faculty Team
                      </p>
                    )}
                    {selectedCourse.coordinator && (
                      <div className="bg-[#fff9f6] border border-[#eedfd8] p-3 rounded-xl flex items-center justify-between text-xs text-[#33110e]">
                        <span className="font-bold uppercase tracking-wider text-[11px] text-neutral-600">Course Coordinator:</span>
                        <span className="font-bold text-[#85261e]">{selectedCourse.coordinator}</span>
                      </div>
                    )}
                  </div>

                  {/* Syllabus / Content Outline */}
                  <div className="pt-4 space-y-2">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-600 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#85261e]" />
                      <span>Course Content &amp; Syllabus Modules</span>
                    </h4>
                    <p className="text-xs text-neutral-700 leading-relaxed whitespace-pre-line bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                      {selectedCourse.description || "Detailed syllabus modules approved under the NEP-2020 ordinance."}
                    </p>
                  </div>

                  {/* Academic Session */}
                  <div className="pt-4 flex items-center justify-between text-xs text-neutral-500">
                    <span>Applicable Academic Session: <strong>{selectedCourse.academic_year || "2024-2025"}</strong></span>
                    <span className="font-mono">Department of {activeDepartment.name}</span>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-[#fff9f6] border-t border-[#eedfd8] p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <a
                    href="https://nith.ac.in/uploads/topics/new-nep-cse-syllabus17222307132912.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#85261e] hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Full Department Syllabus PDF</span>
                  </a>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="w-full sm:w-auto bg-[#33110e] hover:bg-[#85261e] text-white text-xs font-bold px-5 py-2 rounded-xl transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
