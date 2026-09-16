"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Users, ChevronLeft, ChevronRight, GraduationCap } from "lucide-react";
import { MOCK_STUDENTS } from "@/lib/mock-data";
import { useDepartment } from "@/context/department-context";
import { DepartmentEmptyState } from "@/components/common/department-empty-state";

const ITEMS_PER_PAGE = 50;

const normalizeStudent = (s: any) => {
  let progName = s.programme_name || "";
  if (!progName) {
    if (s.programme_id === "66666666-6666-6666-6666-666666666661" || s.programme_code === "BTECH_CSE") progName = "B.Tech CSE";
    else if (s.programme_id === "66666666-6666-6666-6666-666666666662" || s.programme_code === "MTECH_CSE") progName = "M.Tech CSE";
    else if (s.programme_id === "66666666-6666-6666-6666-666666666663" || s.programme_code === "DUAL_CSE") progName = "Dual Degree CSE";
    else progName = "B.Tech CSE";
  }

  const rollMatch = typeof s.roll_number === "string" ? s.roll_number.match(/^(\d{2})/) : null;
  const inferredYear = rollMatch ? 2000 + parseInt(rollMatch[1], 10) : 2024;
  const batchYear = Number(s.batch_year || s.admission_year || inferredYear);

  return {
    ...s,
    id: s.id || s.roll_number || Math.random().toString(),
    name: s.name || s.full_name || "Student",
    roll_number: s.roll_number || "",
    batch_year: batchYear,
    current_semester: s.current_semester || 1,
    programme_name: progName,
    email: s.email || `${s.roll_number || "student"}@nith.ac.in`,
  };
};

export default function StudentsPage() {
  const { activeDepartment } = useDepartment();
  const [studentsList, setStudentsList] = useState<any[]>(() =>
    MOCK_STUDENTS.map(normalizeStudent)
  );
  const [search, setSearch] = useState("");
  const [progFilter, setProgFilter] = useState("ALL");
  const [batchFilter, setBatchFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const hasData = activeDepartment.slug === "cse";

  useEffect(() => {
    const loadStudents = async () => {
      // 1. First check localStorage (for any additions/bulk CSV imports made in Admin)
      let initialList = MOCK_STUDENTS.map(normalizeStudent);
      try {
        const saved = localStorage.getItem("nith_admin_students");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            initialList = parsed.map(normalizeStudent);
            setStudentsList(initialList);
          }
        }
      } catch {}

      // 2. Query live Go backend API
      try {
        const res = await fetch("/api/v1/students");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            const liveList = json.data.map(normalizeStudent);
            const existingRolls = new Set(liveList.map((s: any) => s.roll_number || s.id));
            const extraLocal = initialList.filter(
              (s: any) => !existingRolls.has(s.roll_number) && !existingRolls.has(s.id)
            );
            setStudentsList([...liveList, ...extraLocal]);
          }
        }
      } catch (err) {
        console.warn("Could not fetch live students from backend", err);
      }
    };

    loadStudents();
  }, [activeDepartment.slug]);

  const batches = useMemo(() => {
    if (!hasData) return [];
    const set = new Set(studentsList.map((s) => s.batch_year).filter(Boolean));
    return Array.from(set).sort((a, b) => b - a);
  }, [hasData, studentsList]);

  const filtered = useMemo(() => {
    if (!hasData) return [];
    return studentsList.filter((s) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        s.name.toLowerCase().includes(searchLower) ||
        s.roll_number.toLowerCase().includes(searchLower) ||
        (s.email && s.email.toLowerCase().includes(searchLower));

      const matchesProg =
        progFilter === "ALL" ||
        (progFilter === "btech" && s.programme_name?.includes("B.Tech")) ||
        (progFilter === "mtech" && s.programme_name?.includes("M.Tech")) ||
        (progFilter === "dual" && s.programme_name?.includes("Dual"));

      const matchesBatch =
        batchFilter === "ALL" || s.batch_year.toString() === batchFilter;

      return matchesSearch && matchesProg && matchesBatch;
    });
  }, [search, progFilter, batchFilter, hasData, studentsList]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const handleProgChange = (prog: string) => {
    setProgFilter(prog);
    setCurrentPage(1);
  };

  const handleBatchChange = (batch: string) => {
    setBatchFilter(batch);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6 bg-white min-h-[80vh] font-sans">
      {/* Title & Stats Header */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <Users className="w-6 h-6 text-[#85261e]" />
              Enrolled Students Roster
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2 py-0.5 rounded uppercase">
              {activeDepartment.code}
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Complete database of enrolled undergraduate (B.Tech), postgraduate (M.Tech), and Dual Degree students in Department of {activeDepartment.name}.
          </p>
        </div>

        {hasData && (
          <div className="flex items-center gap-2 bg-[#fff9f6] border border-[#eedfd8] px-3 py-1.5 rounded-lg text-xs font-semibold text-[#33110e]">
            <span>Total Enrolled:</span>
            <span className="font-bold text-[#85261e]">{filtered.length} Students</span>
          </div>
        )}
      </div>

      {!hasData ? (
        <DepartmentEmptyState sectionTitle="Student Roster Records" />
      ) : (
        <>
          {/* Filter Toolbar */}
          <div className="bg-[#fff9f6] border border-[#eedfd8] rounded-xl p-3.5 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              {/* Search */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by student name or roll number..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#eedfd8] bg-white text-[#33110e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              {/* Programme Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {[
                  { id: "ALL", label: "All Programmes" },
                  { id: "btech", label: "B.Tech" },
                  { id: "mtech", label: "M.Tech" },
                  { id: "dual", label: "Dual Degree" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleProgChange(tab.id)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition whitespace-nowrap cursor-pointer ${
                      progFilter === tab.id
                        ? "bg-[#33110e] text-white shadow-xs"
                        : "bg-white text-neutral-700 hover:bg-[#eedfd8]/40 border border-[#eedfd8]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Batch Filter Row */}
            <div className="flex items-center gap-1.5 flex-wrap border-t border-[#eedfd8]/60 pt-2.5">
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mr-1">
                Batch Year:
              </span>
              <button
                onClick={() => handleBatchChange("ALL")}
                className={`px-2 py-0.5 text-[11px] font-medium rounded transition cursor-pointer ${
                  batchFilter === "ALL"
                    ? "bg-[#85261e] text-white font-bold"
                    : "text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                All Batches
              </button>
              {batches.map((b) => (
                <button
                  key={b}
                  onClick={() => handleBatchChange(b.toString())}
                  className={`px-2 py-0.5 text-[11px] font-medium rounded transition cursor-pointer ${
                    batchFilter === b.toString()
                      ? "bg-[#85261e] text-white font-bold"
                      : "text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Table Container */}
          <div className="rounded-xl border border-[#eedfd8] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#33110e] text-white uppercase text-[10px] tracking-wider font-bold">
                  <tr>
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Roll Number</th>
                    <th className="py-3 px-4">Student Full Name</th>
                    <th className="py-3 px-4">Programme</th>
                    <th className="py-3 px-4">Batch</th>
                    <th className="py-3 px-4">Official Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eedfd8] bg-white">
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-neutral-500">
                        No students found matching your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    paginated.map((student, idx) => (
                      <tr
                        key={student.id || student.roll_number}
                        className="hover:bg-[#fff9f6] transition-colors"
                      >
                        <td className="py-2.5 px-4 font-mono text-neutral-400">
                          {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                        </td>
                        <td className="py-2.5 px-4 font-mono font-bold text-[#85261e]">
                          {student.roll_number}
                        </td>
                        <td className="py-2.5 px-4 font-bold text-[#1c110c]">
                          {student.name}
                        </td>
                        <td className="py-2.5 px-4">
                          <span className="bg-[#fff9f6] text-[#33110e] border border-[#eedfd8] text-[10px] font-semibold px-2 py-0.5 rounded">
                            {student.programme_name}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 font-mono font-semibold text-neutral-600">
                          {student.batch_year}
                        </td>
                        <td className="py-2.5 px-4 text-neutral-600 font-mono text-[11px]">
                          {student.email || `${student.roll_number.toLowerCase()}@nith.ac.in`}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="bg-[#fff9f6] border-t border-[#eedfd8] px-4 py-3 flex items-center justify-between">
              <span className="text-xs text-neutral-600 font-medium">
                Page {currentPage} of {totalPages} ({filtered.length} total students)
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-[#eedfd8] bg-white text-[#33110e] hover:bg-[#eedfd8]/40 disabled:opacity-40 transition cursor-pointer"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-[#eedfd8] bg-white text-[#33110e] hover:bg-[#eedfd8]/40 disabled:opacity-40 transition cursor-pointer"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
