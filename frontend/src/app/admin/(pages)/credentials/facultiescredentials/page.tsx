"use client";

import { useState, useEffect, useMemo } from "react";
import { KeyRound, RefreshCw, CheckCircle2, Search, Users, Copy, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { MOCK_FACULTY } from "@/lib/mock-data";
import { useDepartment } from "@/context/department-context";

export default function AdminCredentialsPage() {
  const { activeDepartment } = useDepartment();
  const currentSlug = activeDepartment?.slug || "cse";
  const isCse = currentSlug === "cse";

  const [facultyList, setFacultyList] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`nith_admin_faculty_list_${currentSlug}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed;
        } catch {}
      }
      if (isCse) {
        const legacy = localStorage.getItem("nith_admin_faculty_list");
        if (legacy) {
          try {
            const parsed = JSON.parse(legacy);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
          } catch {}
        }
        return MOCK_FACULTY;
      }
      return [];
    }
    return isCse ? MOCK_FACULTY : [];
  });

  const [search, setSearch] = useState("");
  const [resettingId, setResettingId] = useState<string | null>(null);
  const [generatedPass, setGeneratedPass] = useState<{ [id: string]: string }>({});

  useEffect(() => {
    const scopedKey = `nith_admin_faculty_list_${currentSlug}`;
    const saved = localStorage.getItem(scopedKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setFacultyList(parsed);
          return;
        }
      } catch {}
    }
    if (isCse) {
      const legacy = localStorage.getItem("nith_admin_faculty_list");
      if (legacy) {
        try {
          const parsed = JSON.parse(legacy);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setFacultyList(parsed);
            return;
          }
        } catch {}
      }
      setFacultyList(MOCK_FACULTY);
    } else {
      setFacultyList([]);
    }
  }, [currentSlug, isCse]);

  const filteredFaculty = useMemo(() => {
    return facultyList.filter((f) => {
      const q = search.toLowerCase();
      return (
        f.full_name?.toLowerCase().includes(q) ||
        f.employee_code?.toLowerCase().includes(q) ||
        f.email?.toLowerCase().includes(q)
      );
    });
  }, [facultyList, search]);

  const handleReset = (id: string, name: string) => {
    setResettingId(id);
    const temp = `NITH@${Math.floor(100000 + Math.random() * 900000)}`;
    setTimeout(() => {
      setResettingId(null);
      setGeneratedPass((prev) => ({ ...prev, [id]: temp }));
      toast.success(`Temporary password generated for ${name}: "${temp}"`, {
        duration: 8000,
        description: "Credentials copied to buffer and ready for communication.",
      });
    }, 500);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 font-sans">
      {/* Banner */}
      <div className="rounded-3xl border border-[#eedfd8] bg-gradient-to-r from-[#33110e] via-[#4a1814] to-[#85261e] p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/20 px-3 py-0.5 font-mono text-xs font-bold text-amber-300 backdrop-blur-xs">
                {activeDepartment?.code || "CSE"} CREDENTIALS GATEWAY
              </span>
              <span className="text-xs text-neutral-300">
                Department of {activeDepartment?.name || "Computer Science & Engineering"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Faculty Access &amp; Password Reset Console
            </h1>
            <p className="text-xs text-neutral-300 max-w-xl">
              Provision temporary access tokens, perform secure password resets, and audit active sign-in access for faculty members.
            </p>
          </div>
        </div>
      </div>

      {/* Search & Statistics Bar */}
      <div className="rounded-2xl border border-[#eedfd8] bg-white p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search faculty by name, code, or email..."
            className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] pl-10 pr-3 py-2 text-xs text-[#1c110c] placeholder:text-neutral-400 focus:bg-white focus:border-[#85261e] focus:outline-hidden"
          />
        </div>

        <div className="text-xs font-bold text-[#6b5c58]">
          Showing <span className="text-[#85261e]">{filteredFaculty.length}</span> of {facultyList.length} faculty accounts
        </div>
      </div>

      {/* Faculty Credentials List */}
      <div className="overflow-hidden rounded-2xl border border-[#eedfd8] bg-white shadow-2xs divide-y divide-[#eedfd8]">
        {filteredFaculty.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#fff9f6] border border-[#eedfd8] mx-auto flex items-center justify-center text-neutral-400 shadow-2xs">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#33110e]">
                {facultyList.length === 0
                  ? `No faculty accounts registered for Department of ${activeDepartment?.name || "this department"}`
                  : `No faculty accounts matching "${search}"`}
              </p>
              <p className="text-xs text-[#6b5c58] mt-0.5">
                {facultyList.length === 0
                  ? `Department ${activeDepartment?.code || "this department"} has no faculty roster yet. Onboard faculty to manage credentials.`
                  : "Try clearing your search filters."}
              </p>
            </div>
          </div>
        ) : (
          filteredFaculty.map((f) => (
            <div key={f.id || f.employee_code} className="flex flex-col sm:flex-row sm:items-center justify-between p-4.5 hover:bg-[#fff9f6]/80 transition gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff9f6] border border-[#eedfd8] text-[#85261e] shrink-0">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-[#33110e] text-xs sm:text-sm">{f.full_name}</p>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#fff9f6] border border-[#eedfd8] text-[#85261e]">
                      {f.employee_code}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6b5c58] font-mono mt-0.5">
                    {f.email} • <span className="font-sans text-neutral-500">{f.designation}</span>
                  </p>
                  {generatedPass[f.id] && (
                    <div className="mt-1.5 inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] font-mono text-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Temp Token: <strong>{generatedPass[f.id]}</strong></span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => handleReset(f.id, f.full_name)}
                  disabled={resettingId === f.id}
                  className="flex items-center gap-1.5 rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2 text-xs font-bold text-[#33110e] hover:bg-[#33110e] hover:text-white transition shadow-2xs cursor-pointer"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${resettingId === f.id ? "animate-spin text-[#85261e]" : "text-[#85261e]"}`} />
                  Generate Temp Password
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

