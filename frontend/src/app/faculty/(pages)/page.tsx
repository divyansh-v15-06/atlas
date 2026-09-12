"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  FileText,
  Lightbulb,
  Award,
  Download,
  Plus,
  ArrowRight,
  Sparkles,
  Users,
  GraduationCap,
  Briefcase,
  Globe,
  Mic2,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import {
  MOCK_FACULTY,
  MOCK_PUBLICATIONS,
  MOCK_PATENTS,
  MOCK_PROJECTS,
  MOCK_PHD_SCHOLARS,
} from "@/lib/mock-data";

import { resolveFacultyDepartment, getStoredData } from "@/lib/faculty-storage";

export default function FacultyDashboardPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const raw = localStorage.getItem("auth_user");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {}
    }
  }, []);

  const activeFaculty = useMemo(() => {
    return (
      MOCK_FACULTY.find(
        (f) =>
          f.employee_code?.toLowerCase() === user?.employee_code?.toLowerCase() ||
          f.email?.toLowerCase() === user?.email?.toLowerCase() ||
          f.id === user?.faculty_id
      ) || MOCK_FACULTY[0]
    );
  }, [user]);

  const facultyDept = resolveFacultyDepartment(activeFaculty, user);

  // Personal Publications associated with this faculty
  const facultyPublications = useMemo(() => {
    const legacyId = activeFaculty.legacy_id;
    const nameLower = (activeFaculty.full_name || "").toLowerCase();
    const lastName = nameLower.split(" ").pop() || "";
    const facId = activeFaculty.id;

    const basePubs = Array.isArray(activeFaculty.publications) && activeFaculty.publications.length > 0
      ? activeFaculty.publications
      : [];

    const userPapers = MOCK_PUBLICATIONS.filter((p: any) => {
      if (legacyId && p.faculty_legacy_ids?.includes(legacyId)) return true;
      if (facId && p.faculty_ids?.includes(facId)) return true;
      if (p.author_text && typeof p.author_text === "string" && p.author_text.toLowerCase().includes(lastName)) return true;
      if (Array.isArray(p.authors) && p.authors.some((a: any) => typeof a === "string" ? a.toLowerCase().includes(lastName) : (a.author_name && a.author_name.toLowerCase().includes(lastName)))) return true;
      return false;
    });

    const fallback = basePubs.length > 0 ? basePubs : userPapers;
    return getStoredData(activeFaculty, "publications", fallback);
  }, [activeFaculty]);

  // Personal Patents associated with this faculty
  const facultyPatents = useMemo(() => {
    const nameLower = (activeFaculty.full_name || "").toLowerCase();
    const lastName = nameLower.split(" ").pop() || "";
    const facId = activeFaculty.id;

    const basePatents = Array.isArray(activeFaculty.patents) && activeFaculty.patents.length > 0
      ? activeFaculty.patents
      : [];

    const userPatents = MOCK_PATENTS.filter((p: any) => {
      if (facId && p.faculty_ids?.includes(facId)) return true;
      if (p.raw_inventors && p.raw_inventors.toLowerCase().includes(lastName)) return true;
      return false;
    });

    const fallback = basePatents.length > 0 ? basePatents : userPatents;
    return getStoredData(activeFaculty, "patents", fallback);
  }, [activeFaculty]);

  // Personal Projects associated with this faculty
  const facultyProjects = useMemo(() => {
    const nameLower = (activeFaculty.full_name || "").toLowerCase();
    const lastName = nameLower.split(" ").pop() || "";
    const facId = activeFaculty.id;

    const baseProjects = Array.isArray(activeFaculty.projects) && activeFaculty.projects.length > 0
      ? activeFaculty.projects
      : [];

    const userProjects = MOCK_PROJECTS.filter((p: any) => {
      if (facId && p.faculty_ids?.includes(facId)) return true;
      if (p.raw_investigators && p.raw_investigators.toLowerCase().includes(lastName)) return true;
      return false;
    });

    const fallback = baseProjects.length > 0 ? baseProjects : userProjects;
    return getStoredData(activeFaculty, "projects", fallback);
  }, [activeFaculty]);

  // Supervised PhD Scholars
  const supervisedScholars = useMemo(() => {
    const nameLower = (activeFaculty.full_name || "").toLowerCase();
    const lastName = nameLower.split(" ").pop() || "";
    const base = MOCK_PHD_SCHOLARS.filter((s) =>
      s.supervisor?.toLowerCase().includes(lastName) ||
      s.co_supervisor?.toLowerCase().includes(lastName)
    );
    return getStoredData(activeFaculty, "supervisions", base);
  }, [activeFaculty]);

  return (
    <div className="space-y-6 font-sans">
      {/* Welcome Banner */}
      <div className="rounded-3xl border border-[#eedfd8] bg-gradient-to-r from-[#33110e] via-[#4a1814] to-[#85261e] p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/20 px-3 py-0.5 font-mono text-xs font-bold text-amber-300 backdrop-blur-xs">
                {activeFaculty.employee_code || "FACULTY"}
              </span>
              <span className="text-xs text-neutral-300">
                Department of {facultyDept.name} ({facultyDept.code})
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {activeFaculty.full_name}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-200">
              {activeFaculty.designation} • NIT Hamirpur (HP)
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/faculty/publications"
              className="flex items-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#33110e] px-4 py-2 text-xs font-bold shadow-xs transition duration-150"
            >
              <Plus className="h-4 w-4" /> Add Publication
            </Link>
            <Link
              href="/faculty/export"
              className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-bold text-white backdrop-blur-xs transition duration-150"
            >
              <Download className="h-4 w-4" /> Export CV
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Research Publications",
            value: facultyPublications.length,
            note: "Indexed in Scopus / SCI(E)",
            icon: BookOpen,
            color: "text-[#85261e]",
            bg: "bg-[#fff9f6] border-[#eedfd8]",
          },
          {
            label: "Patents Filed / Granted",
            value: facultyPatents.length,
            note: "Indian & International IPR",
            icon: FileText,
            color: "text-blue-700",
            bg: "bg-blue-50/50 border-blue-200",
          },
          {
            label: "R&D Sponsored Projects",
            value: facultyProjects.length,
            note: "DST, MeitY & SERB Grants",
            icon: Lightbulb,
            color: "text-amber-700",
            bg: "bg-amber-50/50 border-amber-200",
          },
          {
            label: "Ph.D. Scholars Supervised",
            value: supervisedScholars.length > 0 ? supervisedScholars.length : "4",
            note: "Doctoral Candidates",
            icon: Users,
            color: "text-emerald-700",
            bg: "bg-emerald-50/50 border-emerald-200",
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className={`rounded-2xl border p-5 shadow-xs transition hover:shadow-md bg-white ${kpi.bg}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                {kpi.label}
              </span>
              <div className={`p-2 rounded-xl bg-white border border-[#eedfd8] ${kpi.color}`}>
                <kpi.icon className="h-4 w-4" />
              </div>
            </div>
            <p className={`mt-2 text-3xl font-extrabold font-mono ${kpi.color}`}>
              {kpi.value}
            </p>
            <p className="text-[10px] text-neutral-500 mt-1">{kpi.note}</p>
          </div>
        ))}
      </div>

      {/* Main Grid: Recent Research Publications & CV Module Shortcuts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column (2 spans): Recent Research Publications */}
        <div className="rounded-3xl border border-[#eedfd8] bg-white p-6 shadow-xs lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-[#eedfd8]/60 pb-3">
            <div>
              <h2 className="text-base font-bold text-[#1c110c] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#85261e]" />
                Recent Research Papers &amp; Articles
              </h2>
              <p className="text-xs text-neutral-500">
                Displaying indexed publications linked to {activeFaculty.full_name}
              </p>
            </div>

            <Link
              href="/faculty/publications"
              className="text-xs font-bold text-[#85261e] hover:underline flex items-center gap-1"
            >
              <span>View All ({facultyPublications.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {facultyPublications.slice(0, 4).map((pub) => (
              <div
                key={pub.id}
                className="rounded-2xl border border-[#eedfd8] bg-[#fff9f6] p-4 hover:border-[#85261e]/40 transition space-y-1.5"
              >
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="bg-[#33110e] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {pub.publication_type}
                  </span>
                  {pub.indexing && (
                    <span className="bg-[#85261e] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {pub.indexing}
                    </span>
                  )}
                  {pub.journal_quartile && pub.journal_quartile !== "N/A" && (
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">
                      {pub.journal_quartile}
                    </span>
                  )}
                  <span className="text-[11px] font-mono text-neutral-500 ml-auto">
                    {pub.year}
                  </span>
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-[#1c110c] leading-snug">
                  {pub.title}
                </h3>
                <p className="text-xs text-neutral-600 italic line-clamp-1">
                  {pub.journal_or_conference_name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: CV Checklist & Modules */}
        <div className="rounded-3xl border border-[#eedfd8] bg-white p-6 shadow-xs space-y-5">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#1c110c] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Portfolio Status
              </h2>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                95% Verified
              </span>
            </div>

            <div className="mt-2.5 h-2 w-full rounded-full bg-[#eedfd8]/40 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 w-[95%]" />
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">
              Your profile is eligible for NIRF &amp; NBA annual institutional reporting.
            </p>
          </div>

          {/* Quick Module Shortcuts */}
          <div className="space-y-1.5 border-t border-[#eedfd8]/60 pt-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#85261e] mb-2">
              Update CV Sections:
            </p>
            {[
              { label: "Educational Qualifications", href: "/faculty/qualifications", icon: GraduationCap },
              { label: "Teaching Experience", href: "/faculty/teaching-exp", icon: Briefcase },
              { label: "Administrative Roles", href: "/faculty/admin-exp", icon: ShieldCheck },
              { label: "Honors & National Awards", href: "/faculty/honors", icon: Award },
              { label: "International Visits & Exposure", href: "/faculty/exposures", icon: Globe },
              { label: "Invited Expert Talks & Keynotes", href: "/faculty/expert-talks", icon: Mic2 },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between rounded-xl p-2 text-xs font-medium text-neutral-700 hover:bg-[#fff9f6] hover:text-[#33110e] border border-transparent hover:border-[#eedfd8] transition"
              >
                <span className="flex items-center gap-2">
                  <link.icon className="w-3.5 h-3.5 text-[#85261e]" />
                  <span>{link.label}</span>
                </span>
                <ArrowRight className="h-3 w-3 text-neutral-400" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
