"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MOCK_FACULTY } from "@/lib/mock-data";
import {
  Search,
  Mail,
  Phone,
  ExternalLink,
  BookOpen,
  GraduationCap,
  ChevronRight,
  Building2,
  Layers,
  Sparkles,
  Award,
  FileText,
  User,
  RotateCcw,
} from "lucide-react";
import { useDepartment } from "@/context/department-context";
import { DepartmentEmptyState } from "@/components/common/department-empty-state";

export default function FacultyDirectoryPage() {
  const { activeDepartment } = useDepartment();
  const [search, setSearch] = useState("");
  const [designationFilter, setDesignationFilter] = useState("ALL");
  const [facultyList, setFacultyList] = useState<any[]>(() => {
    return MOCK_FACULTY.filter((f) => f.is_visible !== false);
  });

  const hasData = activeDepartment.slug === "cse";

  // Dynamically load faculty from API / Admin Storage and enforce visibility filter
  useEffect(() => {
    const loadFaculty = async () => {
      // 1. Check local storage cache for instant sync with Admin actions
      if (typeof window !== "undefined") {
        const scopedKey = `nith_admin_faculty_list_${activeDepartment.slug}`;
        const saved =
          localStorage.getItem(scopedKey) ||
          (activeDepartment.slug === "cse" ? localStorage.getItem("nith_admin_faculty_list") : null);

        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const visibleOnly = parsed.filter((f: any) => f.is_visible !== false);
              setFacultyList(visibleOnly);
              return;
            }
          } catch {}
        }
      }

      // 2. Fetch from backend API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
      try {
        const deptParam = activeDepartment?.id
          ? `?department_id=${encodeURIComponent(activeDepartment.id)}&visible=true`
          : "?visible=true";
        const res = await fetch(`${apiUrl}/faculty${deptParam}`);
        if (res.ok) {
          const json = await res.json();
          const items = Array.isArray(json) ? json : json.data;
          if (Array.isArray(items) && items.length > 0) {
            setFacultyList(items.filter((f: any) => f.is_visible !== false));
            return;
          }
        }
      } catch {}

      // 3. Fallback to MOCK_FACULTY
      if (activeDepartment.slug === "cse") {
        setFacultyList(MOCK_FACULTY.filter((f) => f.is_visible !== false));
      } else {
        setFacultyList([]);
      }
    };

    loadFaculty();
  }, [activeDepartment.id, activeDepartment.slug]);

  const filteredFaculty = useMemo(() => {
    if (!hasData) return [];
    return facultyList.filter((f) => {
      const searchLower = search.toLowerCase();
      const rawInterests = f.research_interests || f.specialization;
      const interests: string[] = Array.isArray(rawInterests)
        ? rawInterests
        : typeof rawInterests === "string"
        ? rawInterests.split(",").map((r: string) => r.trim()).filter(Boolean)
        : [];

      const matchesSearch =
        !search ||
        (f.full_name && f.full_name.toLowerCase().includes(searchLower)) ||
        (f.employee_code && f.employee_code.toLowerCase().includes(searchLower)) ||
        interests.some((r: string) => r.toLowerCase().includes(searchLower)) ||
        ((f.official_email || f.email || "").toLowerCase().includes(searchLower));

      const matchesDesignation =
        designationFilter === "ALL" ||
        (f.designation && f.designation.toLowerCase().includes(designationFilter.toLowerCase()));

      return matchesSearch && matchesDesignation;
    });
  }, [search, designationFilter, hasData, facultyList]);

  const countByDesignation = useMemo(() => {
    if (!hasData) return { total: 0, profs: 0, assoc: 0, assist: 0 };
    const total = facultyList.length;
    const profs = facultyList.filter(
      (f) =>
        f.designation?.toLowerCase().includes("professor") &&
        !f.designation?.toLowerCase().includes("associate") &&
        !f.designation?.toLowerCase().includes("assistant")
    ).length;
    const assoc = facultyList.filter((f) =>
      f.designation?.toLowerCase().includes("associate")
    ).length;
    const assist = facultyList.filter((f) =>
      f.designation?.toLowerCase().includes("assistant") ||
      f.designation?.toLowerCase().includes("faculty") ||
      f.designation?.toLowerCase().includes("lecturer")
    ).length;
    return { total, profs, assoc, assist };
  }, [hasData, facultyList]);

  const getDesignationBadge = (designation: string) => {
    const d = designation.toLowerCase();
    if (d.includes("professor") && !d.includes("associate") && !d.includes("assistant")) {
      return "bg-[#33110e] text-white border-[#33110e]";
    }
    if (d.includes("associate")) {
      return "bg-[#85261e] text-white border-[#85261e]";
    }
    if (d.includes("assistant")) {
      return "bg-[#fff9f6] text-[#85261e] border-[#eedfd8]";
    }
    return "bg-neutral-100 text-neutral-800 border-neutral-300";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6 bg-white min-h-[85vh] font-sans">
      {/* Title Header */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-[#85261e]" />
              Faculty Directory
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2 py-0.5 rounded uppercase">
              {activeDepartment.code}
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Distinguished professors, associate professors, and assistant professors of Department of{" "}
            {activeDepartment.name}.
          </p>
        </div>

        {/* Filter Pills (only when data is present) */}
        {hasData && (
          <div className="flex flex-wrap items-center gap-1.5 bg-[#fff9f6] p-1 rounded-lg border border-[#eedfd8]">
            {[
              { id: "ALL", label: `All (${countByDesignation.total})` },
              { id: "Professor", label: `Professors (${countByDesignation.profs})` },
              { id: "Associate", label: `Associate Prof. (${countByDesignation.assoc})` },
              { id: "Assistant", label: `Assistant Prof. (${countByDesignation.assist})` },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setDesignationFilter(cat.id)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                  designationFilter === cat.id
                    ? "bg-[#33110e] text-white shadow-xs"
                    : "text-neutral-700 hover:bg-[#eedfd8]/40"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search Bar (only when data is present) */}
      {hasData && (
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder={`Search faculty in Department of ${activeDepartment.name} by name, research area, email...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-[#eedfd8] bg-[#fff9f6] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
          />
        </div>
      )}

      {/* When no data in current department */}
      {!hasData ? (
        <DepartmentEmptyState sectionTitle="Faculty Directory Records" />
      ) : filteredFaculty.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#eedfd8] rounded-2xl p-8 space-y-2">
          <p className="text-sm font-semibold text-neutral-600">No faculty members found matching your search.</p>
          <button
            onClick={() => {
              setSearch("");
              setDesignationFilter("ALL");
            }}
            className="text-xs text-[#85261e] font-bold hover:underline"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        /* Faculty Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFaculty.map((faculty) => (
            <div
              key={faculty.id}
              className="rounded-2xl border border-[#eedfd8] bg-white p-5 shadow-xs hover:shadow-xl hover:border-[#85261e]/50 transition duration-200 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3.5">
                {/* Photo & Details Row */}
                <div className="flex items-start gap-3.5">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#eedfd8] flex-shrink-0 bg-[#fff9f6]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={faculty.image_url || faculty.photo_url || "/nitHamirpurLogo.png"}
                      alt={faculty.full_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getDesignationBadge(
                        faculty.designation
                      )}`}
                    >
                      {faculty.designation}
                    </span>
                    <h3 className="font-bold text-sm text-[#1c110c] truncate group-hover:text-[#85261e] transition">
                      {faculty.full_name}
                    </h3>
                    <p className="text-[11px] text-neutral-500 font-mono truncate">
                      {faculty.employee_code}
                    </p>
                  </div>
                </div>

                {/* Research Interests Tags */}
                {(() => {
                  const rawInterests = faculty.research_interests || faculty.specialization;
                  const interests: string[] = Array.isArray(rawInterests)
                    ? rawInterests
                    : typeof rawInterests === "string"
                    ? rawInterests.split(",").map((r: string) => r.trim()).filter(Boolean)
                    : [];

                  if (interests.length === 0) return null;

                  return (
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        Research Interests
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {interests.slice(0, 3).map((r: string, i: number) => (
                          <span
                            key={i}
                            className="bg-[#fff9f6] text-[#33110e] border border-[#eedfd8] text-[10px] font-medium px-2 py-0.5 rounded"
                          >
                            {r}
                          </span>
                        ))}
                        {interests.length > 3 && (
                          <span className="text-[10px] text-neutral-400 font-semibold self-center">
                            +{interests.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Contact Meta */}
                <div className="pt-2 border-t border-[#eedfd8]/60 space-y-1 text-xs text-neutral-600">
                  <p className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-[#85261e] flex-shrink-0" />
                    <span className="truncate">{faculty.official_email || faculty.email}</span>
                  </p>
                  {faculty.phone && (
                    <p className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                      <Phone className="w-3 h-3 text-[#85261e] flex-shrink-0" />
                      <span>{faculty.phone}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* View Profile Action */}
              <div className="pt-2 border-t border-[#eedfd8]/60 flex items-center justify-between">
                <Link
                  href={`/people/faculty/${faculty.employee_code?.toLowerCase() || faculty.id}?dept=${activeDepartment.slug}`}
                  className="w-full text-center bg-[#fff9f6] hover:bg-[#33110e] text-[#33110e] hover:text-white border border-[#eedfd8] py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>View Official Academic Profile</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
