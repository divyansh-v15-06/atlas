"use client";

import { useEffect, useState, useMemo } from "react";
import {
  BookOpen,
  Search,
  Clock,
  Layers,
  GraduationCap,
  Calendar,
  Eye,
  X,
  Info,
  CheckCircle2,
  FileText,
  Filter,
} from "lucide-react";
import { MOCK_FACULTY, MOCK_COURSES_TAUGHT } from "@/lib/mock-data";
import { getStoredData, setStoredData } from "@/lib/faculty-storage";
import { CourseTaught } from "@/lib/types";

export default function FacultyCoursesPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [courses, setCourses] = useState<CourseTaught[]>([]);
  const [search, setSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState("ALL");
  const [selectedLevel, setSelectedLevel] = useState("ALL");
  const [selectedCourse, setSelectedCourse] = useState<CourseTaught | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("auth_user");
    if (raw) {
      try {
        setCurrentUser(JSON.parse(raw));
      } catch {}
    }
  }, []);

  const activeFaculty = useMemo(() => {
    return (
      MOCK_FACULTY.find(
        (f) =>
          f.employee_code?.toLowerCase() === currentUser?.employee_code?.toLowerCase() ||
          f.email?.toLowerCase() === currentUser?.email?.toLowerCase() ||
          f.id === currentUser?.faculty_id
      ) || MOCK_FACULTY[0]
    );
  }, [currentUser]);

  // Load courses assigned to active faculty
  useEffect(() => {
    const facultyFallback = MOCK_COURSES_TAUGHT.filter(
      (c) =>
        c.faculty_code === activeFaculty.employee_code ||
        c.faculty_name === activeFaculty.full_name ||
        c.faculty_id === activeFaculty.id
    );
    const stored = getStoredData<CourseTaught>(
      activeFaculty,
      "courses",
      facultyFallback.length > 0 ? facultyFallback : MOCK_COURSES_TAUGHT.slice(0, 3)
    );
    setCourses(stored);
  }, [activeFaculty]);

  // Unique Academic Sessions for Filter
  const academicYears = useMemo(() => {
    const years = new Set<string>();
    courses.forEach((c) => {
      if (c.academic_year) years.add(c.academic_year);
    });
    return Array.from(years).sort().reverse();
  }, [courses]);

  // Filtered Courses
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        c.course_code.toLowerCase().includes(q) ||
        c.course_name.toLowerCase().includes(q) ||
        (c.section && c.section.toLowerCase().includes(q));

      const matchesYear = selectedYear === "ALL" || c.academic_year === selectedYear;
      const matchesLevel = selectedLevel === "ALL" || c.course_level === selectedLevel;

      return matchesSearch && matchesYear && matchesLevel;
    });
  }, [courses, search, selectedYear, selectedLevel]);

  // Aggregated Teaching Stats
  const totalCredits = useMemo(
    () => filteredCourses.reduce((sum, c) => sum + (Number(c.credits) || 0), 0),
    [filteredCourses]
  );
  const ugCount = useMemo(
    () => filteredCourses.filter((c) => c.course_level === "UG").length,
    [filteredCourses]
  );
  const pgCount = useMemo(
    () => filteredCourses.filter((c) => c.course_level === "PG" || c.course_level === "Doctoral").length,
    [filteredCourses]
  );

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner */}
      <div className="rounded-2xl border border-[#eedfd8] bg-white p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold uppercase tracking-wider mb-2">
              <GraduationCap className="w-3.5 h-3.5" /> Teaching Allocation &amp; Timetable
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-[#1c110c] tracking-tight">
              Courses Taught
            </h1>
            <p className="mt-1 text-sm text-[#5c4033]">
              Department curriculum offerings and teaching assignments for {activeFaculty.full_name}.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#fff9f6] p-3 rounded-xl border border-[#eedfd8]">
            <Info className="w-5 h-5 text-[#85261e] flex-shrink-0" />
            <p className="text-xs text-[#5c4033] leading-relaxed">
              Allocations are synchronized with the Department Academic Cell. Contact HOD office for timetable revisions.
            </p>
          </div>
        </div>

        {/* Quick KPI Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-4">
            <span className="text-xs font-bold text-[#85261e] uppercase tracking-wider">Assigned Courses</span>
            <p className="text-2xl md:text-3xl font-black text-[#1c110c] mt-1">{filteredCourses.length}</p>
          </div>
          <div className="rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-4">
            <span className="text-xs font-bold text-[#85261e] uppercase tracking-wider">Total Teaching Credits</span>
            <p className="text-2xl md:text-3xl font-black text-[#85261e] mt-1">{totalCredits}</p>
          </div>
          <div className="rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-4">
            <span className="text-xs font-bold text-[#85261e] uppercase tracking-wider">Undergraduate (UG)</span>
            <p className="text-2xl md:text-3xl font-black text-[#1c110c] mt-1">{ugCount}</p>
          </div>
          <div className="rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-4">
            <span className="text-xs font-bold text-[#85261e] uppercase tracking-wider">Postgraduate (PG)</span>
            <p className="text-2xl md:text-3xl font-black text-[#1c110c] mt-1">{pgCount}</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-xl border border-[#eedfd8] bg-white p-4 shadow-2xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#85261e]/60" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by course code, title, section..."
            className="w-full rounded-lg border border-[#eedfd8] bg-[#fff9f6] pl-10 pr-4 py-2 text-sm text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-none focus:ring-1 focus:ring-[#85261e]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Level Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#5c4033]">Level:</span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="rounded-lg border border-[#eedfd8] bg-white px-3 py-1.5 text-xs font-bold text-[#1c110c] focus:outline-none focus:border-[#85261e]"
            >
              <option value="ALL">All Levels</option>
              <option value="UG">UG (Undergraduate)</option>
              <option value="PG">PG (Postgraduate)</option>
              <option value="Doctoral">Doctoral</option>
            </select>
          </div>

          {/* Academic Year Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#5c4033]">Session:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="rounded-lg border border-[#eedfd8] bg-white px-3 py-1.5 text-xs font-bold text-[#1c110c] focus:outline-none focus:border-[#85261e]"
            >
              <option value="ALL">All Academic Years</option>
              {academicYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Courses Table / Cards */}
      <div className="overflow-hidden rounded-2xl border border-[#eedfd8] bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#fff9f6] text-xs font-black uppercase text-[#33110e] border-b border-[#eedfd8]">
              <tr>
                <th className="px-6 py-4 text-center w-16">Sr. No.</th>
                <th className="px-6 py-4">Course Code</th>
                <th className="px-6 py-4">Course Title</th>
                <th className="px-6 py-4 text-center">Level</th>
                <th className="px-6 py-4 text-center">Semester</th>
                <th className="px-6 py-4 text-center">L - T - P</th>
                <th className="px-6 py-4 text-center">Credits</th>
                <th className="px-6 py-4 text-center">Session</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eedfd8]/60 text-[#1c110c]">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-[#fff9f6]/80 transition-colors">
                    <td className="px-6 py-4 text-center font-mono font-bold text-[#85261e]">{idx + 1}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#33110e] text-white font-mono text-xs font-bold">
                        {item.course_code}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-base text-[#1c110c]">
                      <div>
                        {item.course_name}
                        {item.section && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-[#eedfd8]/60 text-[#5c4033]">
                            {item.section}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                          item.course_level === "PG"
                            ? "bg-purple-100 text-purple-800 border border-purple-200"
                            : item.course_level === "Doctoral"
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-blue-100 text-blue-800 border border-blue-200"
                        }`}
                      >
                        {item.course_level || "UG"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-sm">
                      {item.semester ? `Sem ${item.semester}` : "-"}
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-xs font-bold text-[#5c4033]">
                      {item.lecture_hours ?? 3} - {item.tutorial_hours ?? 0} - {item.practical_hours ?? 0}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] font-mono font-black text-sm">
                        {item.credits}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-xs text-[#5c4033]">
                      {item.academic_year || "2024-2025"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedCourse(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#eedfd8] bg-white text-[#33110e] text-xs font-bold hover:bg-[#33110e] hover:text-white transition shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-[#5c4033]">
                    <BookOpen className="w-8 h-8 mx-auto text-[#85261e]/40 mb-2" />
                    <p className="font-bold text-base">No courses assigned matching your filters</p>
                    <p className="text-xs text-neutral-400 mt-1">Try resetting your search query or academic session.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Course Details Modal (Parity with SubjectTaughtModal in tempcsebase) */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-2xl border border-[#eedfd8] bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#eedfd8] bg-[#fff9f6] px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="rounded bg-[#33110e] px-2.5 py-1 font-mono text-xs font-black text-white">
                  {selectedCourse.course_code}
                </span>
                <h3 className="text-lg font-black text-[#1c110c]">{selectedCourse.course_name}</h3>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-[#eedfd8] hover:text-[#1c110c] transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 rounded-xl border border-[#eedfd8] bg-[#fff9f6]">
                  <span className="text-[11px] font-bold text-[#85261e] uppercase">Academic Session</span>
                  <p className="text-sm font-black text-[#1c110c] mt-0.5">{selectedCourse.academic_year}</p>
                </div>
                <div className="p-3.5 rounded-xl border border-[#eedfd8] bg-[#fff9f6]">
                  <span className="text-[11px] font-bold text-[#85261e] uppercase">Course Level</span>
                  <p className="text-sm font-black text-[#1c110c] mt-0.5">{selectedCourse.course_level}</p>
                </div>
                <div className="p-3.5 rounded-xl border border-[#eedfd8] bg-[#fff9f6]">
                  <span className="text-[11px] font-bold text-[#85261e] uppercase">Semester</span>
                  <p className="text-sm font-black text-[#1c110c] mt-0.5">Semester {selectedCourse.semester}</p>
                </div>
                <div className="p-3.5 rounded-xl border border-[#eedfd8] bg-[#fff9f6]">
                  <span className="text-[11px] font-bold text-[#85261e] uppercase">Total Credits</span>
                  <p className="text-sm font-black text-[#85261e] mt-0.5">{selectedCourse.credits} Credits</p>
                </div>
              </div>

              {/* Contact Hours Breakdown */}
              <div className="rounded-xl border border-[#eedfd8] p-4 bg-white">
                <h4 className="text-xs font-bold text-[#33110e] uppercase tracking-wider mb-3">
                  Weekly Teaching Contact Hours (L - T - P)
                </h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-lg bg-[#fff9f6] border border-[#eedfd8]">
                    <span className="text-xs text-[#5c4033] font-medium">Lecture (L)</span>
                    <p className="text-xl font-black text-[#1c110c] mt-1">{selectedCourse.lecture_hours ?? 3} hrs</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#fff9f6] border border-[#eedfd8]">
                    <span className="text-xs text-[#5c4033] font-medium">Tutorial (T)</span>
                    <p className="text-xl font-black text-[#1c110c] mt-1">{selectedCourse.tutorial_hours ?? 0} hrs</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#fff9f6] border border-[#eedfd8]">
                    <span className="text-xs text-[#5c4033] font-medium">Practical (P)</span>
                    <p className="text-xl font-black text-[#1c110c] mt-1">{selectedCourse.practical_hours ?? 0} hrs</p>
                  </div>
                </div>
              </div>

              {/* Course Description / Syllabus */}
              {selectedCourse.description && (
                <div className="rounded-xl border border-[#eedfd8] p-4 bg-white space-y-1.5">
                  <h4 className="text-xs font-bold text-[#33110e] uppercase tracking-wider">
                    Syllabus Outline &amp; Scope
                  </h4>
                  <p className="text-sm text-[#5c4033] leading-relaxed">
                    {selectedCourse.description}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end border-t border-[#eedfd8] bg-[#fff9f6] px-6 py-3">
              <button
                onClick={() => setSelectedCourse(null)}
                className="px-4 py-2 rounded-lg bg-[#33110e] hover:bg-[#85261e] text-white text-xs font-bold transition shadow-xs"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
