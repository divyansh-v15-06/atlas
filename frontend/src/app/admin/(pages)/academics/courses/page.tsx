"use client";

import { useState, useMemo, useEffect } from "react";
import {
  BookOpen,
  Plus,
  Trash2,
  Edit,
  UserPlus,
  Search,
  Download,
  UploadCloud,
  X,
  Check,
  Filter,
  GraduationCap,
  Layers,
  Clock,
  Users,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";
import Papa from "papaparse";
import { MOCK_COURSES, MOCK_COURSES_TAUGHT, MOCK_FACULTY } from "@/lib/mock-data";
import { Course, CourseTaught } from "@/lib/types";
import { getFacultyStorageKey } from "@/lib/faculty-storage";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("nith_admin_courses");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return MOCK_COURSES;
  });

  const [allocations, setAllocations] = useState<CourseTaught[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("nith_admin_course_allocations");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return MOCK_COURSES_TAUGHT;
  });

  // Persist admin courses and allocations
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("nith_admin_courses", JSON.stringify(courses));
    }
  }, [courses]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("nith_admin_course_allocations", JSON.stringify(allocations));
    }
  }, [allocations]);

  // Filters
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [semesterFilter, setSemesterFilter] = useState("ALL");
  const [selectedFacultyFilter, setSelectedFacultyFilter] = useState("ALL");

  // Modals
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [courseModalMode, setCourseModalMode] = useState<"add" | "edit">("add");
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);

  // Form State: Add / Edit Course
  const [courseForm, setCourseForm] = useState({
    code: "",
    name: "",
    credits: 4,
    level: "UG",
    semester: 3,
    type: "Core",
    lecture_hours: 3,
    tutorial_hours: 1,
    practical_hours: 2,
    description: "",
  });

  // Form State: Assign Course to Faculty
  const [assignForm, setAssignForm] = useState({
    course_code: "",
    faculty_id: "",
    academic_year: "2024-2025",
    section: "B.Tech Sec A",
  });

  const handleOpenAddCourse = () => {
    setCourseModalMode("add");
    setEditingCourse(null);
    setCourseForm({
      code: "",
      name: "",
      credits: 4,
      level: "UG",
      semester: 3,
      type: "Core",
      lecture_hours: 3,
      tutorial_hours: 1,
      practical_hours: 2,
      description: "",
    });
    setIsCourseModalOpen(true);
  };

  const handleOpenEditCourse = (c: Course) => {
    setCourseModalMode("edit");
    setEditingCourse(c);
    setCourseForm({
      code: c.code,
      name: c.name,
      credits: Number(c.credits) || 4,
      level: c.level || "UG",
      semester: Number(c.semester) || 3,
      type: c.type || "Core",
      lecture_hours: c.lecture_hours ?? 3,
      tutorial_hours: c.tutorial_hours ?? 1,
      practical_hours: c.practical_hours ?? 2,
      description: c.description || "",
    });
    setIsCourseModalOpen(true);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.code.trim() || !courseForm.name.trim()) {
      toast.error("Course Code and Title are required");
      return;
    }

    if (courseModalMode === "add") {
      if (courses.some((c) => c.code.toLowerCase() === courseForm.code.trim().toLowerCase())) {
        toast.error(`Course with code ${courseForm.code} already exists`);
        return;
      }
      const newCourse: Course = {
        id: `c-${Date.now()}`,
        code: courseForm.code.trim().toUpperCase(),
        name: courseForm.name.trim(),
        credits: Number(courseForm.credits) || 4,
        level: courseForm.level,
        semester: Number(courseForm.semester),
        type: courseForm.type,
        lecture_hours: Number(courseForm.lecture_hours) || 0,
        tutorial_hours: Number(courseForm.tutorial_hours) || 0,
        practical_hours: Number(courseForm.practical_hours) || 0,
        description: courseForm.description.trim(),
      };
      setCourses([newCourse, ...courses]);
      toast.success(`Course ${newCourse.code} created successfully`);
    } else if (editingCourse) {
      setCourses(
        courses.map((c) =>
          c.code === editingCourse.code
            ? {
                ...c,
                code: courseForm.code.trim().toUpperCase(),
                name: courseForm.name.trim(),
                credits: Number(courseForm.credits) || 4,
                level: courseForm.level,
                semester: Number(courseForm.semester),
                type: courseForm.type,
                lecture_hours: Number(courseForm.lecture_hours) || 0,
                tutorial_hours: Number(courseForm.tutorial_hours) || 0,
                practical_hours: Number(courseForm.practical_hours) || 0,
                description: courseForm.description.trim(),
              }
            : c
        )
      );
      toast.success(`Course ${courseForm.code} updated`);
    }
    setIsCourseModalOpen(false);
  };

  const handleDeleteCourse = (code: string) => {
    if (confirm(`Are you sure you want to remove course ${code}?`)) {
      setCourses(courses.filter((c) => c.code !== code));
      setAllocations(allocations.filter((a) => a.course_code !== code));
      toast.success(`Course ${code} removed`);
    }
  };

  const handleOpenAssignModal = (courseCode?: string) => {
    setAssignForm({
      course_code: courseCode || (courses[0]?.code ?? ""),
      faculty_id: MOCK_FACULTY[0]?.id || "",
      academic_year: "2024-2025",
      section: "B.Tech Sec A",
    });
    setIsAssignModalOpen(true);
  };

  const handleSaveAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    const targetCourse = courses.find((c) => c.code === assignForm.course_code);
    const targetFaculty = MOCK_FACULTY.find(
      (f) => f.id === assignForm.faculty_id || f.employee_code === assignForm.faculty_id
    );

    if (!targetCourse || !targetFaculty) {
      toast.error("Please select a valid course and faculty member");
      return;
    }

    const newAllocation: CourseTaught = {
      id: `ct-${Date.now()}`,
      faculty_id: targetFaculty.id,
      faculty_code: targetFaculty.employee_code,
      faculty_name: targetFaculty.full_name,
      course_code: targetCourse.code,
      course_name: targetCourse.name,
      semester: targetCourse.semester || 3,
      course_level: targetCourse.level || "UG",
      lecture_hours: targetCourse.lecture_hours ?? 3,
      tutorial_hours: targetCourse.tutorial_hours ?? 1,
      practical_hours: targetCourse.practical_hours ?? 2,
      credits: targetCourse.credits || 4,
      academic_year: assignForm.academic_year,
      section: assignForm.section,
      description: targetCourse.description,
    };

    // 1. Update admin allocations list
    setAllocations([newAllocation, ...allocations]);

    // 2. Also save to the specific faculty's localStorage persistent key
    if (typeof window !== "undefined") {
      const facultyKey = getFacultyStorageKey(targetFaculty, "courses");
      let facultyExisting: any[] = [];
      try {
        const raw = localStorage.getItem(facultyKey);
        if (raw) facultyExisting = JSON.parse(raw);
      } catch {}
      localStorage.setItem(facultyKey, JSON.stringify([newAllocation, ...facultyExisting]));
      // Notify other tabs / profile view
      window.dispatchEvent(new Event("nith_faculty_storage_update"));
    }

    setIsAssignModalOpen(false);
    toast.success(
      `Assigned ${targetCourse.code} to ${targetFaculty.full_name} for session ${assignForm.academic_year}!`
    );
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows: any[] = results.data;
        if (!rows || rows.length === 0) {
          toast.error("CSV file contains no valid rows");
          return;
        }

        const newParsedCourses: Course[] = rows
          .filter((r) => r.code && r.name)
          .map((r, i) => ({
            id: `c-import-${Date.now()}-${i}`,
            code: String(r.code).trim().toUpperCase(),
            name: String(r.name).trim(),
            credits: Number(r.credits) || 4,
            level: r.level || "UG",
            semester: Number(r.semester) || 1,
            type: r.type || "Core",
            lecture_hours: Number(r.lecture_hours || r.L) || 3,
            tutorial_hours: Number(r.tutorial_hours || r.T) || 0,
            practical_hours: Number(r.practical_hours || r.P) || 0,
            description: r.description || "",
          }));

        if (newParsedCourses.length === 0) {
          toast.error("No valid courses found. Ensure 'code' and 'name' columns exist.");
          return;
        }

        // Merge avoiding duplicate codes
        const merged = [...newParsedCourses];
        courses.forEach((c) => {
          if (!merged.some((m) => m.code === c.code)) {
            merged.push(c);
          }
        });

        setCourses(merged);
        setIsCsvModalOpen(false);
        toast.success(`Successfully imported ${newParsedCourses.length} courses!`);
      },
      error: (err) => {
        toast.error(`CSV Parsing error: ${err.message}`);
      },
    });
  };

  const handleExportCsv = () => {
    const exportData = courses.map((c) => {
      const assigned = allocations.filter((a) => a.course_code === c.code);
      return {
        "Course Code": c.code,
        "Course Title": c.name,
        Level: c.level,
        Semester: c.semester,
        Type: c.type,
        Credits: c.credits,
        "Lecture Hours (L)": c.lecture_hours,
        "Tutorial Hours (T)": c.tutorial_hours,
        "Practical Hours (P)": c.practical_hours,
        "Assigned Faculty": assigned.map((a) => `${a.faculty_name} (${a.academic_year})`).join("; ") || "Unassigned",
        Description: c.description || "",
      };
    });

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `nith_courses_curriculum_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Courses and allocations exported to CSV");
  };

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search || c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q);

      const matchesLevel = levelFilter === "ALL" || c.level === levelFilter;
      const matchesSemester =
        semesterFilter === "ALL" || String(c.semester) === semesterFilter;

      let matchesFaculty = true;
      if (selectedFacultyFilter !== "ALL") {
        matchesFaculty = allocations.some(
          (a) => a.course_code === c.code && a.faculty_code === selectedFacultyFilter
        );
      }

      return matchesSearch && matchesLevel && matchesSemester && matchesFaculty;
    });
  }, [courses, search, levelFilter, semesterFilter, selectedFacultyFilter, allocations]);

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" /> Academics &amp; Curricula
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#1c110c] tracking-tight">
            Courses &amp; Faculty Allocations
          </h1>
          <p className="mt-1 text-sm text-[#5c4033]">
            Manage department syllabus, courses catalog, and faculty teaching assignments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#eedfd8] bg-white px-3.5 py-2 text-xs font-bold text-[#33110e] hover:bg-[#fff9f6] transition shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#85261e]" /> Export CSV
          </button>
          <button
            type="button"
            onClick={() => setIsCsvModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#eedfd8] bg-white px-3.5 py-2 text-xs font-bold text-[#33110e] hover:bg-[#fff9f6] transition shadow-2xs cursor-pointer"
          >
            <UploadCloud className="w-4 h-4 text-[#85261e]" /> Bulk Import
          </button>
          <button
            type="button"
            onClick={() => handleOpenAssignModal()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#85261e] px-4 py-2 text-xs font-bold text-white hover:bg-[#33110e] transition shadow-2xs cursor-pointer"
          >
            <UserPlus className="w-4 h-4" /> Assign Faculty
          </button>
          <button
            type="button"
            onClick={handleOpenAddCourse}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#33110e] px-4 py-2 text-xs font-bold text-white hover:bg-[#85261e] transition shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4" /> New Course
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#eedfd8] bg-white p-4 shadow-2xs">
          <span className="text-xs font-bold text-[#85261e] uppercase tracking-wider">Total Courses</span>
          <p className="text-2xl font-black text-[#1c110c] mt-1">{courses.length}</p>
        </div>
        <div className="rounded-xl border border-[#eedfd8] bg-white p-4 shadow-2xs">
          <span className="text-xs font-bold text-[#85261e] uppercase tracking-wider">Active Allocations</span>
          <p className="text-2xl font-black text-[#85261e] mt-1">{allocations.length}</p>
        </div>
        <div className="rounded-xl border border-[#eedfd8] bg-white p-4 shadow-2xs">
          <span className="text-xs font-bold text-[#85261e] uppercase tracking-wider">Undergraduate (UG)</span>
          <p className="text-2xl font-black text-[#1c110c] mt-1">
            {courses.filter((c) => c.level === "UG").length}
          </p>
        </div>
        <div className="rounded-xl border border-[#eedfd8] bg-white p-4 shadow-2xs">
          <span className="text-xs font-bold text-[#85261e] uppercase tracking-wider">PG &amp; Doctoral</span>
          <p className="text-2xl font-black text-[#1c110c] mt-1">
            {courses.filter((c) => c.level !== "UG").length}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="rounded-2xl border border-[#eedfd8] bg-white p-4 shadow-2xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#85261e]/60" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by course code or title..."
            className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] pl-10 pr-4 py-2 text-sm text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-none focus:ring-1 focus:ring-[#85261e]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Level Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#5c4033]">Level:</span>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="rounded-lg border border-[#eedfd8] bg-white px-3 py-1.5 text-xs font-bold text-[#1c110c] focus:outline-none focus:border-[#85261e]"
            >
              <option value="ALL">All Levels</option>
              <option value="UG">UG</option>
              <option value="PG">PG</option>
              <option value="Doctoral">Doctoral</option>
            </select>
          </div>

          {/* Semester Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#5c4033]">Semester:</span>
            <select
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              className="rounded-lg border border-[#eedfd8] bg-white px-3 py-1.5 text-xs font-bold text-[#1c110c] focus:outline-none focus:border-[#85261e]"
            >
              <option value="ALL">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={String(s)}>
                  Sem {s}
                </option>
              ))}
            </select>
          </div>

          {/* Faculty Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#5c4033]">Faculty:</span>
            <select
              value={selectedFacultyFilter}
              onChange={(e) => setSelectedFacultyFilter(e.target.value)}
              className="rounded-lg border border-[#eedfd8] bg-white px-3 py-1.5 text-xs font-bold text-[#1c110c] focus:outline-none focus:border-[#85261e] max-w-[180px] truncate"
            >
              <option value="ALL">All Faculty</option>
              {MOCK_FACULTY.map((f) => (
                <option key={f.id} value={f.employee_code}>
                  {f.full_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-hidden rounded-2xl border border-[#eedfd8] bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#fff9f6] text-xs font-black uppercase text-[#33110e] border-b border-[#eedfd8]">
              <tr>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Course Title</th>
                <th className="px-6 py-4 text-center">Level</th>
                <th className="px-6 py-4 text-center">Semester</th>
                <th className="px-6 py-4 text-center">L - T - P</th>
                <th className="px-6 py-4 text-center">Credits</th>
                <th className="px-6 py-4">Assigned Faculty</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eedfd8]/60 text-[#1c110c]">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((c) => {
                  const assignedList = allocations.filter((a) => a.course_code === c.code);
                  return (
                    <tr key={c.code} className="hover:bg-[#fff9f6]/60 transition-colors">
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#33110e] text-white font-mono text-xs font-bold">
                          {c.code}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-sm text-[#1c110c]">
                        <div>
                          {c.name}
                          {c.type && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-[#eedfd8]/60 text-[#5c4033]">
                              {c.type}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                            c.level === "PG"
                              ? "bg-purple-100 text-purple-800 border border-purple-200"
                              : c.level === "Doctoral"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-blue-100 text-blue-800 border border-blue-200"
                          }`}
                        >
                          {c.level || "UG"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-xs">
                        {c.semester ? `Sem ${c.semester}` : "-"}
                      </td>
                      <td className="px-6 py-4 text-center font-mono text-xs font-bold text-[#5c4033]">
                        {c.lecture_hours ?? 3} - {c.tutorial_hours ?? 1} - {c.practical_hours ?? 2}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] font-mono font-bold text-xs">
                          {c.credits}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {assignedList.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {assignedList.map((a, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold"
                              >
                                <span>{a.faculty_name}</span>
                                <span className="text-[10px] font-mono text-neutral-400">({a.academic_year})</span>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-neutral-400 italic">Not Assigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenAssignModal(c.code)}
                            title="Assign to Faculty"
                            className="p-1.5 rounded-lg border border-[#eedfd8] text-[#85261e] hover:bg-[#85261e] hover:text-white transition cursor-pointer"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditCourse(c)}
                            title="Edit Course"
                            className="p-1.5 rounded-lg border border-[#eedfd8] text-neutral-600 hover:bg-[#33110e] hover:text-white transition cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCourse(c.code)}
                            title="Delete Course"
                            className="p-1.5 rounded-lg border border-[#eedfd8] text-red-600 hover:bg-red-600 hover:text-white transition cursor-pointer"
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
                  <td colSpan={8} className="px-6 py-12 text-center text-[#5c4033]">
                    <BookOpen className="w-8 h-8 mx-auto text-[#85261e]/40 mb-2" />
                    <p className="font-bold text-base">No courses found matching filters</p>
                    <p className="text-xs text-neutral-400 mt-1">Try clearing your search query or level filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: ADD / EDIT COURSE (Parity with adminModalProgramms) */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#eedfd8] shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-[#fff9f6] border-b border-[#eedfd8] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-[#85261e] tracking-wider">
                  {courseModalMode === "add" ? "New Course Offering" : "Edit Course Details"}
                </span>
                <h3 className="text-lg font-black text-[#1c110c]">
                  {courseModalMode === "add" ? "Create Academic Course" : `Edit ${editingCourse?.code}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCourseModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:bg-[#eedfd8] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                    Course Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={courseForm.code}
                    onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                    placeholder="e.g. CS-301"
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm font-mono focus:border-[#85261e] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                    Level
                  </label>
                  <select
                    value={courseForm.level}
                    onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                  >
                    <option value="UG">Undergraduate (UG)</option>
                    <option value="PG">Postgraduate (PG)</option>
                    <option value="Doctoral">Doctoral (Ph.D.)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                  Course Title / Name *
                </label>
                <input
                  type="text"
                  required
                  value={courseForm.name}
                  onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                  placeholder="e.g. Database Management Systems"
                  className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                    Semester
                  </label>
                  <select
                    value={courseForm.semester}
                    onChange={(e) => setCourseForm({ ...courseForm, semester: Number(e.target.value) })}
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Sem {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                    L (Lecture)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={courseForm.lecture_hours}
                    onChange={(e) => setCourseForm({ ...courseForm, lecture_hours: Number(e.target.value) })}
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm text-center font-mono focus:border-[#85261e] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                    T (Tutorial)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={courseForm.tutorial_hours}
                    onChange={(e) => setCourseForm({ ...courseForm, tutorial_hours: Number(e.target.value) })}
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm text-center font-mono focus:border-[#85261e] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                    P (Practical)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={courseForm.practical_hours}
                    onChange={(e) => setCourseForm({ ...courseForm, practical_hours: Number(e.target.value) })}
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm text-center font-mono focus:border-[#85261e] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                    Total Credits
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={courseForm.credits}
                    onChange={(e) => setCourseForm({ ...courseForm, credits: Number(e.target.value) })}
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm font-mono focus:border-[#85261e] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                    Course Type
                  </label>
                  <select
                    value={courseForm.type}
                    onChange={(e) => setCourseForm({ ...courseForm, type: e.target.value })}
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                  >
                    <option value="Core">Department Core</option>
                    <option value="Elective">Program Elective</option>
                    <option value="Open Elective">Open Elective</option>
                    <option value="Lab">Laboratory Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                  Syllabus Outline &amp; Course Scope
                </label>
                <textarea
                  rows={3}
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  placeholder="Key topics, prerequisites, and learning outcomes..."
                  className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#eedfd8]">
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#eedfd8] text-xs font-bold text-[#5c4033] hover:bg-[#fff9f6] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  {courseModalMode === "add" ? "Create Course" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ASSIGN COURSE TO FACULTY (Parity with ProgramofferedAssignModal) */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#eedfd8] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-[#fff9f6] border-b border-[#eedfd8] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-[#85261e] tracking-wider">
                  Teaching Assignment
                </span>
                <h3 className="text-lg font-black text-[#1c110c]">Assign Course to Faculty</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:bg-[#eedfd8] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAssignment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                  Select Course *
                </label>
                <select
                  required
                  value={assignForm.course_code}
                  onChange={(e) => setAssignForm({ ...assignForm, course_code: e.target.value })}
                  className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                >
                  <option value="">-- Choose Course --</option>
                  {courses.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} — {c.name} ({c.level})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                  Select Faculty Member *
                </label>
                <select
                  required
                  value={assignForm.faculty_id}
                  onChange={(e) => setAssignForm({ ...assignForm, faculty_id: e.target.value })}
                  className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                >
                  <option value="">-- Choose Faculty --</option>
                  {MOCK_FACULTY.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.full_name} ({f.designation} • {f.employee_code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                    Academic Session
                  </label>
                  <select
                    value={assignForm.academic_year}
                    onChange={(e) => setAssignForm({ ...assignForm, academic_year: e.target.value })}
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                  >
                    <option value="2025-2026">2025-2026</option>
                    <option value="2024-2025">2024-2025</option>
                    <option value="2023-2024">2023-2024</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                    Section / Batch
                  </label>
                  <input
                    type="text"
                    value={assignForm.section}
                    onChange={(e) => setAssignForm({ ...assignForm, section: e.target.value })}
                    placeholder="e.g. B.Tech Sec A"
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#eedfd8]">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#eedfd8] text-xs font-bold text-[#5c4033] hover:bg-[#fff9f6] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#85261e] hover:bg-[#33110e] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: BULK CSV UPLOAD (Parity with adminCsvModal) */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#eedfd8] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-[#fff9f6] border-b border-[#eedfd8] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-[#85261e] tracking-wider">
                  Bulk Operations
                </span>
                <h3 className="text-lg font-black text-[#1c110c]">Import Courses via CSV</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCsvModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:bg-[#eedfd8] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-[#5c4033] leading-relaxed">
                Upload a CSV spreadsheet with course specifications. Column headers should include:
                <br />
                <code className="bg-[#fff9f6] text-[#85261e] px-1 py-0.5 rounded font-mono text-[11px] font-bold">
                  code, name, credits, level, semester, L, T, P, description
                </code>
              </p>

              <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#eedfd8] hover:border-[#85261e] rounded-xl p-6 bg-[#fff9f6]/50 cursor-pointer transition">
                <FileSpreadsheet className="w-10 h-10 text-[#85261e] mb-2" />
                <span className="text-xs font-bold text-[#1c110c]">Click to select or drag CSV file</span>
                <span className="text-[11px] text-neutral-400 mt-1">.csv format only</span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCsvUpload}
                  className="hidden"
                />
              </label>

              <div className="flex justify-end pt-2 border-t border-[#eedfd8]">
                <button
                  type="button"
                  onClick={() => setIsCsvModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#eedfd8] text-xs font-bold text-[#5c4033] hover:bg-[#fff9f6] transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
