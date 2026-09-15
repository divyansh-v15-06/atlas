"use client";

import { useState, useEffect, useMemo } from "react";
import {
  UploadCloud,
  FileSpreadsheet,
  Plus,
  Trash2,
  Search,
  ArrowUpRight,
  GraduationCap,
  Users,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import Papa from "papaparse";
import { MOCK_STUDENTS } from "@/lib/mock-data";
import { Student } from "@/lib/types";

const PROGRAMME_MAP: Record<string, string> = {
  "66666666-6666-6666-6666-666666666661": "B.Tech CSE",
  "66666666-6666-6666-6666-666666666663": "Dual Degree CSE",
  "66666666-6666-6666-6666-666666666662": "M.Tech CSE",
  "btech": "B.Tech CSE",
  "mtech": "M.Tech CSE",
  "dual": "Dual Degree CSE",
  "phd": "Ph.D. Scholar",
};

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [progFilter, setProgFilter] = useState("ALL");
  const [semFilter, setSemFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 25;

  // Modals
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [showPromoteModal, setShowPromoteModal] = useState(false);

  // Bulk Promotion State
  const [promoProg, setPromoProg] = useState("ALL");
  const [promoFromSem, setPromoFromSem] = useState<number | "ALL">("ALL");
  const [promoAction, setPromoAction] = useState<"INCREMENT" | "SET_EXACT" | "GRADUATE">("INCREMENT");
  const [targetExactSem, setTargetExactSem] = useState(2);

  // Initial Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("nith_admin_students");
      if (saved) {
        setStudents(JSON.parse(saved));
      } else {
        setStudents(MOCK_STUDENTS);
        localStorage.setItem("nith_admin_students", JSON.stringify(MOCK_STUDENTS));
      }
    } catch {
      setStudents(MOCK_STUDENTS);
    }
    setIsLoaded(true);
  }, []);

  const saveStudents = (newStudents: Student[]) => {
    setStudents(newStudents);
    try {
      localStorage.setItem("nith_admin_students", JSON.stringify(newStudents));
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  };

  const handleResetToSeed = () => {
    if (confirm("Reset student roster back to institute initial seed data?")) {
      saveStudents(MOCK_STUDENTS);
      setCurrentPage(1);
      toast.info("Roster reset to default institute seed data.");
    }
  };

  // CSV Import
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows: any[] = results.data;
        if (!rows || rows.length === 0) {
          toast.error("CSV file is empty");
          return;
        }
        const newStudents: Student[] = rows.map((r, i) => ({
          id: `s-import-${Date.now()}-${i}`,
          department_id: "22222222-2222-2222-2222-222222222222",
          programme_id: r.programme || r.programme_id || "66666666-6666-6666-6666-666666666661",
          name: r.name || r.student_name || "Unknown Student",
          roll_number: r.roll_number || r.roll || `ROLL-${i + 100}`,
          email: r.email || "",
          batch_year: Number(r.batch_year || r.year || 2024),
          current_semester: Number(r.current_semester || r.semester || 1),
          cgpa: Number(r.cgpa || 8.0),
          status: "enrolled",
        }));

        const updated = [...newStudents, ...students];
        saveStudents(updated);
        setShowCsvModal(false);
        toast.success(`Successfully imported ${newStudents.length} students from CSV!`);
      },
      error: (err) => {
        toast.error(`CSV Parsing error: ${err.message}`);
      },
    });
  };

  // Filtered List
  const filtered = useMemo(() => {
    return students.filter((s) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        s.name.toLowerCase().includes(q) ||
        s.roll_number.toLowerCase().includes(q) ||
        (s.email && s.email.toLowerCase().includes(q));

      const matchProg =
        progFilter === "ALL" ||
        s.programme_id === progFilter ||
        PROGRAMME_MAP[s.programme_id] === progFilter;

      const semNum = s.current_semester || 1;
      const isGrad = s.status === "graduated" || semNum > 10;
      const matchSem =
        semFilter === "ALL" ||
        (semFilter === "GRADUATED" && isGrad) ||
        (!isGrad && String(semNum) === semFilter);

      return matchSearch && matchProg && matchSem;
    });
  }, [students, search, progFilter, semFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  // Bulk Promotion Calculation
  const promotionCandidates = useMemo(() => {
    return students.filter((s) => {
      if (s.status === "graduated") return false;

      const matchProg =
        promoProg === "ALL" ||
        s.programme_id === promoProg ||
        PROGRAMME_MAP[s.programme_id] === promoProg;

      const semNum = s.current_semester || 1;
      const matchSem = promoFromSem === "ALL" || semNum === promoFromSem;

      return matchProg && matchSem;
    });
  }, [students, promoProg, promoFromSem]);

  const executeBulkPromotion = () => {
    if (promotionCandidates.length === 0) {
      toast.error("No eligible students match the selected promotion criteria.");
      return;
    }

    const candidateIds = new Set(promotionCandidates.map((c) => c.id));
    let graduatedCount = 0;
    let promotedCount = 0;

    const updated = students.map((s) => {
      if (!candidateIds.has(s.id)) return s;

      const current = s.current_semester || 1;
      const progName = PROGRAMME_MAP[s.programme_id] || "";
      const maxSem = progName.includes("Dual") ? 10 : progName.includes("M.Tech") ? 4 : 8;

      if (promoAction === "GRADUATE") {
        graduatedCount++;
        return {
          ...s,
          status: "graduated",
        };
      } else if (promoAction === "INCREMENT") {
        const nextSem = current + 1;
        if (nextSem > maxSem) {
          graduatedCount++;
          return {
            ...s,
            current_semester: nextSem,
            status: "graduated",
          };
        }
        promotedCount++;
        return {
          ...s,
          current_semester: nextSem,
        };
      } else {
        // SET_EXACT
        promotedCount++;
        return {
          ...s,
          current_semester: targetExactSem,
          status: targetExactSem > maxSem ? "graduated" : "enrolled",
        };
      }
    });

    saveStudents(updated);
    setShowPromoteModal(false);

    if (graduatedCount > 0 && promotedCount > 0) {
      toast.success(`🎓 Processed ${promotionCandidates.length} students: ${promotedCount} promoted, ${graduatedCount} graduated!`);
    } else if (graduatedCount > 0) {
      toast.success(`🎓 Successfully transitioned ${graduatedCount} students to Graduated / Alumni roll!`);
    } else {
      toast.success(`🚀 Successfully promoted ${promotedCount} students!`);
    }
  };

  const handleSinglePromote = (studentId: string) => {
    const updated = students.map((s) => {
      if (s.id !== studentId) return s;
      const cur = s.current_semester || 1;
      const progName = PROGRAMME_MAP[s.programme_id] || "";
      const maxSem = progName.includes("Dual") ? 10 : progName.includes("M.Tech") ? 4 : 8;
      const nextSem = cur + 1;
      return {
        ...s,
        current_semester: nextSem,
        status: nextSem > maxSem ? "graduated" : s.status,
      };
    });
    saveStudents(updated);
    toast.success("Student semester advanced by 1");
  };

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#85261e] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Main Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Student Records &amp; Semester Management
            </h1>
            <span className="rounded-full bg-[#85261e]/10 px-2.5 py-0.5 text-xs font-bold text-[#85261e]">
              {students.length} Enrolled
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage cohort academic progression, batch CSV uploads, and one-click semester promotions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetToSeed}
            title="Reset roster to default seed"
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-accent hover:text-foreground transition shadow-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>

          <button
            type="button"
            onClick={() => setShowCsvModal(true)}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-accent transition shadow-xs"
          >
            <UploadCloud className="h-4 w-4 text-muted-foreground" /> CSV Import
          </button>

          <button
            type="button"
            onClick={() => setShowPromoteModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#85261e] to-[#a33228] px-4 py-2 text-xs font-bold text-white shadow-sm hover:opacity-95 transition"
          >
            <ArrowUpRight className="h-4 w-4" /> Promote Cohort
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
        <div className="p-4 border-b border-border bg-muted/20 flex flex-col md:flex-row items-stretch md:items-center gap-3 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by student name, roll number, or email..."
              className="w-full rounded-xl border border-input bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#85261e]/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-background border border-input rounded-xl px-3 py-1.5 text-xs">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <select
                value={progFilter}
                onChange={(e) => {
                  setProgFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-foreground focus:outline-none text-xs font-medium cursor-pointer"
              >
                <option value="ALL">All Programmes</option>
                <option value="66666666-6666-6666-6666-666666666661">B.Tech CSE</option>
                <option value="66666666-6666-6666-6666-666666666663">Dual Degree CSE</option>
                <option value="66666666-6666-6666-6666-666666666662">M.Tech CSE</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-background border border-input rounded-xl px-3 py-1.5 text-xs">
              <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
              <select
                value={semFilter}
                onChange={(e) => {
                  setSemFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-foreground focus:outline-none text-xs font-medium cursor-pointer"
              >
                <option value="ALL">All Semesters</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
                <option value="3">Semester 3</option>
                <option value="4">Semester 4</option>
                <option value="5">Semester 5</option>
                <option value="6">Semester 6</option>
                <option value="7">Semester 7</option>
                <option value="8">Semester 8</option>
                <option value="9">Semester 9</option>
                <option value="10">Semester 10</option>
                <option value="GRADUATED">Graduated / Alumni</option>
              </select>
            </div>
          </div>
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
              <tr>
                <th className="px-5 py-3.5">Roll Number</th>
                <th className="px-5 py-3.5">Full Name</th>
                <th className="px-5 py-3.5">Programme</th>
                <th className="px-5 py-3.5 text-center">Semester</th>
                <th className="px-5 py-3.5 text-center">Batch Year</th>
                <th className="px-5 py-3.5 text-center">CGPA</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    <p className="font-semibold">No students match your filter criteria.</p>
                    <p className="text-xs mt-1">Try broadening your search term or resetting filters.</p>
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((s) => {
                  const semNum = s.current_semester || 1;
                  const isGrad = s.status === "graduated" || semNum > 10;
                  const progLabel =
                    (s as any).programme_name ||
                    PROGRAMME_MAP[s.programme_id] ||
                    s.programme_id;

                  return (
                    <tr key={s.id} className="hover:bg-accent/30 transition group">
                      <td className="px-5 py-3.5 font-mono font-bold text-xs text-[#85261e]">
                        {s.roll_number}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-foreground">
                        <div>{s.name}</div>
                        {s.email && (
                          <div className="text-[11px] text-muted-foreground font-mono">
                            {s.email}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">
                        <span className="inline-block rounded-md bg-muted px-2 py-0.5 font-medium">
                          {progLabel}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        {isGrad ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-0.5 text-[11px] font-bold">
                            <GraduationCap className="h-3 w-3" /> Graduated
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center rounded-full bg-amber-50 text-amber-900 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40 px-2.5 py-0.5 text-xs font-bold">
                            Sem {semNum}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-center text-xs text-muted-foreground font-mono">
                        {s.batch_year}
                      </td>
                      <td className="px-5 py-3.5 text-center font-mono font-semibold text-xs">
                        {s.cgpa ? s.cgpa.toFixed(2) : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {!isGrad && (
                            <button
                              type="button"
                              onClick={() => handleSinglePromote(s.id)}
                              title="Promote to Next Semester"
                              className="rounded-lg p-1.5 text-xs font-bold text-amber-700 hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-950 transition flex items-center gap-0.5"
                            >
                              <ArrowUpRight className="h-3.5 w-3.5" />
                              <span className="text-[10px] hidden sm:inline">+1 Sem</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              const updated = students.filter((x) => x.id !== s.id);
                              saveStudents(updated);
                              toast.success("Student removed from roster");
                            }}
                            title="Delete Student"
                            className="rounded-lg p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-border bg-muted/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>
            Showing <span className="font-semibold text-foreground">{Math.min(filtered.length, (currentPage - 1) * PAGE_SIZE + 1)}</span> to{" "}
            <span className="font-semibold text-foreground">{Math.min(filtered.length, currentPage * PAGE_SIZE)}</span> of{" "}
            <span className="font-semibold text-foreground">{filtered.length}</span> students
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-border bg-background disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent transition"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-medium px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-border bg-background disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent transition"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Semester Promotion Modal */}
      {showPromoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#85261e]/10 text-[#85261e] flex items-center justify-center">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">One-Click Bulk Semester Promotion</h2>
                  <p className="text-xs text-muted-foreground">
                    Advance entire cohorts into the next academic semester seamlessly.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPromoteModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Source Programme</label>
                  <select
                    value={promoProg}
                    onChange={(e) => setPromoProg(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground focus:ring-2 focus:ring-[#85261e]/20"
                  >
                    <option value="ALL">All Programmes</option>
                    <option value="66666666-6666-6666-6666-666666666661">B.Tech CSE</option>
                    <option value="66666666-6666-6666-6666-666666666663">Dual Degree CSE</option>
                    <option value="66666666-6666-6666-6666-666666666662">M.Tech CSE</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">Source Current Semester</label>
                  <select
                    value={promoFromSem}
                    onChange={(e) => setPromoFromSem(e.target.value === "ALL" ? "ALL" : Number(e.target.value))}
                    className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground focus:ring-2 focus:ring-[#85261e]/20"
                  >
                    <option value="ALL">All Active Cohorts</option>
                    <option value="1">Semester 1 (Freshers)</option>
                    <option value="2">Semester 2</option>
                    <option value="3">Semester 3 (Sophomores)</option>
                    <option value="4">Semester 4</option>
                    <option value="5">Semester 5 (Pre-Final)</option>
                    <option value="6">Semester 6</option>
                    <option value="7">Semester 7 (Final Year)</option>
                    <option value="8">Semester 8 (Graduating)</option>
                    <option value="9">Semester 9 (Dual Degree)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1.5">Promotion Operation</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPromoAction("INCREMENT")}
                    className={`rounded-xl border p-3 text-left transition ${
                      promoAction === "INCREMENT"
                        ? "border-[#85261e] bg-[#85261e]/10 text-[#85261e] font-bold"
                        : "border-border hover:bg-accent text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Next Semester (+1)</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 font-normal">
                      Advances each student into (Semester + 1).
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPromoAction("SET_EXACT")}
                    className={`rounded-xl border p-3 text-left transition ${
                      promoAction === "SET_EXACT"
                        ? "border-[#85261e] bg-[#85261e]/10 text-[#85261e] font-bold"
                        : "border-border hover:bg-accent text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Specific Semester</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 font-normal">
                      Assigns exact target semester value.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPromoAction("GRADUATE")}
                    className={`rounded-xl border p-3 text-left transition ${
                      promoAction === "GRADUATE"
                        ? "border-[#85261e] bg-[#85261e]/10 text-[#85261e] font-bold"
                        : "border-border hover:bg-accent text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="h-3.5 w-3.5" />
                      <span>Graduate Cohort</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 font-normal">
                      Transitions cohort to Alumni status.
                    </p>
                  </button>
                </div>
              </div>

              {promoAction === "SET_EXACT" && (
                <div className="p-3 bg-muted/40 rounded-xl border border-border">
                  <label className="block font-semibold text-foreground mb-1">Target Semester</label>
                  <select
                    value={targetExactSem}
                    onChange={(e) => setTargetExactSem(Number(e.target.value))}
                    className="w-full rounded-lg border border-input bg-background p-2 text-xs text-foreground"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Impact Card & Preview */}
              <div className="rounded-xl border border-border bg-muted/30 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-[#85261e]" />
                    Impact Summary:
                  </span>
                  <span className="font-bold text-xs bg-[#85261e] text-white px-2.5 py-0.5 rounded-full">
                    {promotionCandidates.length} students affected
                  </span>
                </div>

                {promotionCandidates.length > 0 ? (
                  <div className="text-[11px] text-muted-foreground">
                    <p>
                      Previewing sample students from this cohort:
                    </p>
                    <div className="mt-2 space-y-1 max-h-28 overflow-y-auto border border-border/60 rounded-lg p-2 bg-background">
                      {promotionCandidates.slice(0, 5).map((c) => (
                        <div key={c.id} className="flex items-center justify-between py-0.5 border-b border-border/30 last:border-0 font-mono">
                          <span className="font-bold text-foreground">{c.roll_number} — {c.name}</span>
                          <span className="text-muted-foreground">
                            Sem {c.current_semester || 1} →{" "}
                            <span className="font-bold text-[#85261e]">
                              {promoAction === "GRADUATE"
                                ? "Graduated"
                                : promoAction === "INCREMENT"
                                ? `Sem ${(c.current_semester || 1) + 1}`
                                : `Sem ${targetExactSem}`}
                            </span>
                          </span>
                        </div>
                      ))}
                      {promotionCandidates.length > 5 && (
                        <div className="text-center pt-1 text-[10px] text-muted-foreground">
                          ...and {promotionCandidates.length - 5} more students
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-amber-700 dark:text-amber-400">
                    No enrolled students match this exact combination.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-border pt-4 mt-5">
              <button
                type="button"
                onClick={() => setShowPromoteModal(false)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-accent transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={promotionCandidates.length === 0}
                onClick={executeBulkPromotion}
                className="rounded-xl bg-gradient-to-r from-[#85261e] to-[#a33228] px-4 py-2 text-xs font-bold text-white shadow-sm hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1.5"
              >
                <ArrowUpRight className="h-4 w-4" /> Confirm &amp; Execute Promotion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {showCsvModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-foreground mb-2">Import Students via CSV</h2>
            <p className="text-xs text-muted-foreground mb-4">
              Upload a .csv file containing columns: <code>name</code>, <code>roll_number</code>, <code>programme</code>, <code>batch_year</code>, <code>current_semester</code>, <code>cgpa</code>.
            </p>

            <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-8 text-center cursor-pointer hover:bg-primary/10 transition">
              <FileSpreadsheet className="h-10 w-10 text-primary mb-2" />
              <span className="text-sm font-bold text-foreground">Click to select CSV File</span>
              <span className="text-xs text-muted-foreground mt-1">Accepts UTF-8 .csv files</span>
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            </label>

            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={() => setShowCsvModal(false)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-accent"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
