"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
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
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  BookOpenCheck,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { MOCK_FACULTY, MOCK_COURSES, MOCK_COURSES_TAUGHT } from "@/lib/mock-data";
import {
  getStoredData,
  setStoredData,
  recordFacultyDeletion,
  getFacultyCanonicalCode,
} from "@/lib/faculty-storage";
import { CourseTaught, Course } from "@/lib/types";

export default function FacultyCoursesPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeFaculty, setActiveFaculty] = useState<any>(MOCK_FACULTY[0]);
  const [courses, setCourses] = useState<CourseTaught[]>([]);
  const [search, setSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState("ALL");
  const [selectedLevel, setSelectedLevel] = useState("ALL");

  // Modals
  const [selectedCourse, setSelectedCourse] = useState<CourseTaught | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseTaught | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CourseTaught | null>(null);

  // Form State for Add / Edit Course
  const [formData, setFormData] = useState({
    catalogue_selection: "",
    course_code: "",
    course_name: "",
    course_level: "UG" as "UG" | "PG" | "Doctoral",
    semester: 1,
    academic_year: "2024-2025",
    section: "Section A",
    lecture_hours: 3,
    tutorial_hours: 0,
    practical_hours: 0,
    credits: 3,
    description: "",
  });

  // 1. Resolve logged-in faculty
  const resolveCurrentFaculty = useCallback(() => {
    let resolved = MOCK_FACULTY[0];
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("auth_user");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          setCurrentUser(parsed);

          const idLower = (parsed.employee_code || parsed.username || parsed.identifier || "").toLowerCase().trim();
          const emailLower = (parsed.email || "").toLowerCase().trim();
          const facIdLower = (parsed.faculty_id || parsed.id || "").toLowerCase().trim();
          const nameLower = (parsed.full_name || parsed.name || "").toLowerCase().trim();

          const match = MOCK_FACULTY.find((f) => {
            const fCode = (f.employee_code || "").toLowerCase().trim();
            const fEmail = (f.email || "").toLowerCase().trim();
            const fId = (f.id || "").toLowerCase().trim();
            const fName = (f.full_name || "").toLowerCase().trim();

            return Boolean(
              (idLower && fCode === idLower) ||
              (emailLower && fEmail === emailLower) ||
              (facIdLower && fId === facIdLower) ||
              (nameLower && fName === nameLower)
            );
          });

          if (match) {
            resolved = match;
          } else if (parsed.employee_code || parsed.full_name) {
            resolved = {
              ...MOCK_FACULTY[0],
              ...parsed,
              id: parsed.faculty_id || parsed.id || `fac-${parsed.employee_code?.toLowerCase()}`,
              employee_code: parsed.employee_code || "FACULTY",
              full_name: parsed.full_name || "Faculty Member",
            };
          }
        } catch (e) {
          console.error("Failed to parse auth_user", e);
        }
      }
    }
    setActiveFaculty(resolved);
    return resolved;
  }, []);

  // 2. Load courses for the resolved faculty
  const loadFacultyCourses = useCallback((facultyObj: any) => {
    if (!facultyObj) return;
    const canonicalCode = getFacultyCanonicalCode(facultyObj);
    const facCode = (facultyObj.employee_code || "").toLowerCase().trim();
    const facId = String(facultyObj.id || "").toLowerCase().trim();
    const facName = (facultyObj.full_name || "").toLowerCase().trim();

    // Check if admin has set custom allocations
    let sourceAllocations = MOCK_COURSES_TAUGHT;
    if (typeof window !== "undefined") {
      try {
        const adminRaw = localStorage.getItem("nith_admin_course_allocations");
        if (adminRaw) {
          const parsed = JSON.parse(adminRaw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            sourceAllocations = parsed;
          }
        }
      } catch {}
    }

    // Filter baseline exclusively for this faculty member
    const baseline = sourceAllocations.filter((c) => {
      const cCode = (c.faculty_code || "").toLowerCase().trim();
      const cId = String(c.faculty_id || "").toLowerCase().trim();
      const cName = (c.faculty_name || "").toLowerCase().trim();

      return Boolean(
        (canonicalCode && canonicalCode !== "default" && cCode === canonicalCode) ||
        (facCode && cCode === facCode) ||
        (facId && cId === facId) ||
        (facName && cName === facName)
      );
    });

    const stored = getStoredData<CourseTaught>(facultyObj, "courses", baseline);
    setCourses(stored);
  }, []);

  // Initial mount & sync listener
  useEffect(() => {
    const faculty = resolveCurrentFaculty();
    loadFacultyCourses(faculty);

    const handleSync = (e: any) => {
      if (!e.detail?.section || e.detail.section === "courses") {
        const refreshedFaculty = resolveCurrentFaculty();
        loadFacultyCourses(refreshedFaculty);
      }
    };

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === "auth_user" || e.key?.startsWith("nith_faculty_courses_") || e.key === "nith_admin_course_allocations") {
        const refreshedFaculty = resolveCurrentFaculty();
        loadFacultyCourses(refreshedFaculty);
      }
    };

    window.addEventListener("nith_faculty_storage_update", handleSync);
    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener("nith_faculty_storage_update", handleSync);
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, [resolveCurrentFaculty, loadFacultyCourses]);

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
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.course_code?.toLowerCase().includes(q) ||
        c.course_name?.toLowerCase().includes(q) ||
        (c.section && c.section.toLowerCase().includes(q)) ||
        (c.description && c.description.toLowerCase().includes(q));

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
    () => filteredCourses.filter((c) => c.course_level === "PG").length,
    [filteredCourses]
  );
  const doctoralCount = useMemo(
    () => filteredCourses.filter((c) => c.course_level === "Doctoral").length,
    [filteredCourses]
  );

  // Form Handlers
  const handleCatalogueSelect = (courseCode: string) => {
    if (!courseCode) {
      setFormData((prev) => ({ ...prev, catalogue_selection: "" }));
      return;
    }
    const found = MOCK_COURSES.find((c) => c.code === courseCode);
    if (found) {
      setFormData((prev) => ({
        ...prev,
        catalogue_selection: courseCode,
        course_code: found.code,
        course_name: found.title,
        course_level: found.level,
        semester: found.semester || 1,
        lecture_hours: found.lecture_hours ?? 3,
        tutorial_hours: found.tutorial_hours ?? 0,
        practical_hours: found.practical_hours ?? 0,
        credits: found.credits,
        description: found.description || "",
      }));
    }
  };

  const openAddModal = () => {
    setEditingCourse(null);
    setFormData({
      catalogue_selection: "",
      course_code: "",
      course_name: "",
      course_level: "UG",
      semester: 1,
      academic_year: "2024-2025",
      section: "Section A",
      lecture_hours: 3,
      tutorial_hours: 0,
      practical_hours: 0,
      credits: 3,
      description: "",
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (course: CourseTaught) => {
    setEditingCourse(course);
    setFormData({
      catalogue_selection: course.course_code,
      course_code: course.course_code,
      course_name: course.course_name,
      course_level: (course.course_level as any) || "UG",
      semester: course.semester || 1,
      academic_year: course.academic_year || "2024-2025",
      section: course.section || "",
      lecture_hours: course.lecture_hours ?? 3,
      tutorial_hours: course.tutorial_hours ?? 0,
      practical_hours: course.practical_hours ?? 0,
      credits: course.credits ?? 3,
      description: course.description || "",
    });
    setIsAddModalOpen(true);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.course_code.trim() || !formData.course_name.trim()) {
      toast.error("Please provide both Course Code and Course Title");
      return;
    }

    const payload: CourseTaught = {
      id: editingCourse?.id || `ct-user-${Date.now()}`,
      faculty_id: activeFaculty.id,
      faculty_code: activeFaculty.employee_code,
      faculty_name: activeFaculty.full_name,
      course_code: formData.course_code.trim().toUpperCase(),
      course_name: formData.course_name.trim(),
      course_level: formData.course_level,
      semester: Number(formData.semester) || 1,
      academic_year: formData.academic_year.trim() || "2024-2025",
      section: formData.section.trim(),
      lecture_hours: Number(formData.lecture_hours) || 0,
      tutorial_hours: Number(formData.tutorial_hours) || 0,
      practical_hours: Number(formData.practical_hours) || 0,
      credits: Number(formData.credits) || 0,
      description: formData.description.trim(),
      department_id: activeFaculty.department_id || "22222222-2222-2222-2222-222222222222",
    };

    let updatedList: CourseTaught[];
    if (editingCourse) {
      updatedList = courses.map((c) => (c.id === editingCourse.id ? payload : c));
      toast.success(`Updated ${payload.course_code} assignment successfully!`);
    } else {
      updatedList = [payload, ...courses];
      toast.success(`Added ${payload.course_code} - ${payload.course_name} to teaching offerings!`);
    }

    setCourses(updatedList);
    setStoredData(activeFaculty, "courses", updatedList);
    setIsAddModalOpen(false);
  };

  const handleDeleteCourse = (course: CourseTaught) => {
    const updated = courses.filter((c) => c.id !== course.id && !(c.course_code === course.course_code && c.academic_year === course.academic_year && c.semester === course.semester && c.section === course.section));
    setCourses(updated);
    recordFacultyDeletion(activeFaculty, "courses", course);
    setStoredData(activeFaculty, "courses", updated);
    setDeleteTarget(null);
    toast.success(`Removed ${course.course_code} from teaching allocations.`);
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner */}
      <div className="rounded-2xl border border-[#eedfd8] bg-white p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold uppercase tracking-wider mb-2">
              <GraduationCap className="w-3.5 h-3.5" /> Teaching Allocation &amp; Curriculum Portfolio
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-[#1c110c] tracking-tight">
              Courses Taught
            </h1>
            <p className="mt-1 text-sm text-[#5c4033]">
              Curriculum offerings and assigned contact hours for{" "}
              <span className="font-bold text-[#1c110c]">{activeFaculty.full_name}</span>{" "}
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[#fff9f6] border border-[#eedfd8] text-[#85261e]">
                {activeFaculty.employee_code}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#85261e] hover:bg-[#6b1e17] text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Teaching Course
            </button>
          </div>
        </div>

        {/* 5 KPI Stat Cards (Including Doctoral Tier) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
          <div className="rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-4 shadow-2xs">
            <span className="text-[11px] font-bold text-[#85261e] uppercase tracking-wider">Assigned Courses</span>
            <p className="text-2xl md:text-3xl font-black text-[#1c110c] mt-1">{filteredCourses.length}</p>
            <span className="text-[10px] text-neutral-500">Active Offerings</span>
          </div>
          <div className="rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-4 shadow-2xs">
            <span className="text-[11px] font-bold text-[#85261e] uppercase tracking-wider">Teaching Credits</span>
            <p className="text-2xl md:text-3xl font-black text-[#85261e] mt-1">{totalCredits}</p>
            <span className="text-[10px] text-neutral-500">Semester Total</span>
          </div>
          <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-4 shadow-2xs">
            <span className="text-[11px] font-bold text-sky-900 uppercase tracking-wider">Undergraduate (UG)</span>
            <p className="text-2xl md:text-3xl font-black text-sky-950 mt-1">{ugCount}</p>
            <span className="text-[10px] text-sky-700">B.Tech Courses</span>
          </div>
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4 shadow-2xs">
            <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider">Postgraduate (PG)</span>
            <p className="text-2xl md:text-3xl font-black text-indigo-950 mt-1">{pgCount}</p>
            <span className="text-[10px] text-indigo-700">M.Tech Specializations</span>
          </div>
          <div className="rounded-xl border border-purple-300 bg-purple-50/70 p-4 shadow-2xs col-span-2 sm:col-span-1">
            <span className="text-[11px] font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-purple-700" /> Doctoral (Ph.D.)
            </span>
            <p className="text-2xl md:text-3xl font-black text-purple-950 mt-1">{doctoralCount}</p>
            <span className="text-[10px] text-purple-700">Advanced Research</span>
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
            placeholder="Search by code, title, section..."
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
              <option value="Doctoral">Doctoral (Ph.D.)</option>
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
              <option value="ALL">All Academic Sessions</option>
              {academicYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          {(search || selectedLevel !== "ALL" || selectedYear !== "ALL") && (
            <button
              onClick={() => {
                setSearch("");
                setSelectedLevel("ALL");
                setSelectedYear("ALL");
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#eedfd8] text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Courses Table */}
      <div className="overflow-hidden rounded-2xl border border-[#eedfd8] bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#fff9f6] text-xs font-black uppercase text-[#33110e] border-b border-[#eedfd8]">
              <tr>
                <th className="px-5 py-4 text-center w-14">Sr.</th>
                <th className="px-5 py-4">Course Code</th>
                <th className="px-5 py-4">Course Title</th>
                <th className="px-5 py-4 text-center">Level</th>
                <th className="px-5 py-4 text-center">Semester</th>
                <th className="px-5 py-4 text-center">L - T - P</th>
                <th className="px-5 py-4 text-center">Credits</th>
                <th className="px-5 py-4 text-center">Session</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eedfd8]/60 text-[#1c110c]">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((item, idx) => {
                  const isDoctoral = item.course_level === "Doctoral";
                  const isPG = item.course_level === "PG";
                  return (
                    <tr
                      key={item.id || `${item.course_code}-${idx}`}
                      className={`hover:bg-[#fff9f6]/80 transition-colors ${
                        isDoctoral ? "bg-purple-50/20" : ""
                      }`}
                    >
                      <td className="px-5 py-4 text-center font-mono font-bold text-[#85261e] text-xs">
                        {idx + 1}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md font-mono text-xs font-bold ${
                            isDoctoral
                              ? "bg-purple-900 text-white shadow-2xs"
                              : isPG
                              ? "bg-indigo-900 text-white shadow-2xs"
                              : "bg-[#33110e] text-white"
                          }`}
                        >
                          {item.course_code}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-bold text-sm text-[#1c110c]">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span>{item.course_name}</span>
                          {item.section && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-[#eedfd8]/60 text-[#5c4033]">
                              {item.section}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold border ${
                            isDoctoral
                              ? "bg-purple-100 text-purple-950 border-purple-300 font-extrabold"
                              : isPG
                              ? "bg-indigo-50 text-indigo-900 border-indigo-200 font-bold"
                              : "bg-sky-50 text-sky-900 border-sky-200 font-bold"
                          }`}
                        >
                          {isDoctoral && <GraduationCap className="w-3 h-3 text-purple-700" />}
                          {isDoctoral ? "Doctoral (Ph.D.)" : item.course_level || "UG"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center font-bold text-xs text-neutral-700">
                        {isDoctoral
                          ? `Ph.D. Coursework`
                          : item.semester
                          ? `Sem ${item.semester}`
                          : "-"}
                      </td>
                      <td className="px-5 py-4 text-center font-mono text-xs font-bold text-[#5c4033]">
                        {item.lecture_hours ?? 3} - {item.tutorial_hours ?? 0} - {item.practical_hours ?? 0}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] font-mono font-black text-xs">
                          {item.credits}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center font-mono text-xs text-[#5c4033]">
                        {item.academic_year || "2024-2025"}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedCourse(item)}
                            title="View Syllabus & Teaching Details"
                            className="p-1.5 rounded-lg border border-[#eedfd8] bg-white text-[#33110e] hover:bg-[#33110e] hover:text-white transition shadow-2xs cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openEditModal(item)}
                            title="Edit Allocation"
                            className="p-1.5 rounded-lg border border-[#eedfd8] bg-white text-blue-700 hover:bg-blue-600 hover:text-white transition shadow-2xs cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(item)}
                            title="Remove Course"
                            className="p-1.5 rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-600 hover:text-white transition shadow-2xs cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-[#5c4033]">
                    <BookOpen className="w-10 h-10 mx-auto text-[#85261e]/40 mb-3" />
                    <p className="font-bold text-base text-[#1c110c]">
                      No courses assigned matching your filters
                    </p>
                    <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
                      You can add custom teaching offerings or select from the department curriculum using the &quot;Add Teaching Course&quot; button above.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Course Details Modal */}
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
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-[#eedfd8] hover:text-[#1c110c] transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 rounded-xl border border-[#eedfd8] bg-[#fff9f6]">
                  <span className="text-[11px] font-bold text-[#85261e] uppercase">Academic Session</span>
                  <p className="text-sm font-black text-[#1c110c] mt-0.5">{selectedCourse.academic_year || "2024-2025"}</p>
                </div>
                <div className="p-3.5 rounded-xl border border-[#eedfd8] bg-[#fff9f6]">
                  <span className="text-[11px] font-bold text-[#85261e] uppercase">Course Level</span>
                  <p className="text-sm font-black text-[#1c110c] mt-0.5">
                    {selectedCourse.course_level === "Doctoral" ? "Doctoral (Ph.D.)" : selectedCourse.course_level}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-[#eedfd8] bg-[#fff9f6]">
                  <span className="text-[11px] font-bold text-[#85261e] uppercase">Semester / Module</span>
                  <p className="text-sm font-black text-[#1c110c] mt-0.5">
                    {selectedCourse.course_level === "Doctoral" ? "Ph.D. Coursework" : `Semester ${selectedCourse.semester}`}
                  </p>
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

              {/* Course Coordinator */}
              {selectedCourse.course_coordinator && (
                <div className="rounded-xl border border-[#eedfd8] p-3.5 bg-[#fff9f6] flex items-center justify-between text-xs text-[#33110e]">
                  <span className="font-bold uppercase tracking-wider text-[11px] text-neutral-600">Course Coordinator:</span>
                  <span className="font-bold text-[#85261e]">{selectedCourse.course_coordinator}</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end border-t border-[#eedfd8] bg-[#fff9f6] px-6 py-3">
              <button
                onClick={() => setSelectedCourse(null)}
                className="px-4 py-2 rounded-lg bg-[#33110e] hover:bg-[#85261e] text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Course Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-2xl border border-[#eedfd8] bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#eedfd8] bg-[#fff9f6] px-6 py-4">
              <div className="flex items-center gap-2">
                <BookOpenCheck className="w-5 h-5 text-[#85261e]" />
                <h3 className="text-lg font-black text-[#1c110c]">
                  {editingCourse ? "Edit Teaching Course Assignment" : "Add Teaching Course Offering"}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-[#eedfd8] hover:text-[#1c110c] transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveCourse} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {!editingCourse && (
                <div className="rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-4 space-y-2">
                  <label className="text-xs font-bold text-[#85261e] uppercase tracking-wider block">
                    Quick-Fill from Department Curriculum Catalogue
                  </label>
                  <select
                    value={formData.catalogue_selection}
                    onChange={(e) => handleCatalogueSelect(e.target.value)}
                    className="w-full rounded-lg border border-[#eedfd8] bg-white px-3 py-2 text-sm text-[#1c110c] focus:outline-none focus:border-[#85261e]"
                  >
                    <option value="">-- Choose from standard curriculum (or enter custom below) --</option>
                    <optgroup label="Doctoral (Ph.D.) Research Courses">
                      {MOCK_COURSES.filter((c) => c.level === "Doctoral").map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code}: {c.title} (Doctoral, {c.credits} Credits)
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Postgraduate (PG) Courses">
                      {MOCK_COURSES.filter((c) => c.level === "PG").map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code}: {c.title} (PG Sem {c.semester}, {c.credits} Credits)
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Undergraduate (UG) Courses">
                      {MOCK_COURSES.filter((c) => c.level === "UG").map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code}: {c.title} (UG Sem {c.semester}, {c.credits} Credits)
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  <p className="text-[11px] text-neutral-500">
                    Selecting an existing curriculum course will automatically prefill syllabus details, contact hours, and credit weights.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#33110e] uppercase block mb-1">
                    Course Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS-607 or CS-301"
                    value={formData.course_code}
                    onChange={(e) => setFormData({ ...formData, course_code: e.target.value })}
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#85261e]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#33110e] uppercase block mb-1">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Frontier Research in Wireless Networks"
                    value={formData.course_name}
                    onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:outline-none focus:border-[#85261e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#33110e] uppercase block mb-1">
                    Course Level
                  </label>
                  <select
                    value={formData.course_level}
                    onChange={(e) => setFormData({ ...formData, course_level: e.target.value as any })}
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm font-bold focus:outline-none focus:border-[#85261e]"
                  >
                    <option value="UG">Undergraduate (UG)</option>
                    <option value="PG">Postgraduate (PG)</option>
                    <option value="Doctoral">Doctoral (Ph.D.)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#33110e] uppercase block mb-1">
                    Semester
                  </label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:outline-none focus:border-[#85261e]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#33110e] uppercase block mb-1">
                    Academic Session
                  </label>
                  <input
                    type="text"
                    value={formData.academic_year}
                    onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                    placeholder="2024-2025"
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:outline-none focus:border-[#85261e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#33110e] uppercase block mb-1">
                    Section / Batch
                  </label>
                  <input
                    type="text"
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    placeholder="Section A or Ph.D. Batch"
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:outline-none focus:border-[#85261e]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#33110e] uppercase block mb-1">
                    Lectures (L)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.lecture_hours}
                    onChange={(e) => setFormData({ ...formData, lecture_hours: Number(e.target.value) })}
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm text-center focus:outline-none focus:border-[#85261e]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#33110e] uppercase block mb-1">
                    Tutorials (T)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.tutorial_hours}
                    onChange={(e) => setFormData({ ...formData, tutorial_hours: Number(e.target.value) })}
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm text-center focus:outline-none focus:border-[#85261e]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#33110e] uppercase block mb-1">
                    Practicals (P)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.practical_hours}
                    onChange={(e) => setFormData({ ...formData, practical_hours: Number(e.target.value) })}
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm text-center focus:outline-none focus:border-[#85261e]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#33110e] uppercase block mb-1">
                  Total Course Credits
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={formData.credits}
                  onChange={(e) => setFormData({ ...formData, credits: Number(e.target.value) })}
                  className="w-32 rounded-lg border border-[#eedfd8] px-3 py-2 text-sm font-bold text-center focus:outline-none focus:border-[#85261e]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#33110e] uppercase block mb-1">
                  Syllabus Outline &amp; Course Scope
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summary of modules taught, learning objectives, and lab components..."
                  className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:outline-none focus:border-[#85261e]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#eedfd8]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#eedfd8] text-xs font-bold text-neutral-600 hover:bg-neutral-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#85261e] hover:bg-[#6b1e17] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  {editingCourse ? "Save Changes" : "Confirm Allocation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <h3 className="text-lg font-black text-[#1c110c]">Confirm Removal</h3>
            </div>
            <p className="text-sm text-[#5c4033] leading-relaxed">
              Are you sure you want to remove{" "}
              <span className="font-bold text-[#1c110c]">
                {deleteTarget.course_code} - {deleteTarget.course_name}
              </span>{" "}
              from your teaching offerings?
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg border border-[#eedfd8] text-xs font-bold text-neutral-600 hover:bg-neutral-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCourse(deleteTarget)}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                Yes, Remove Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
