"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Save,
  User,
  Mail,
  Phone,
  Globe,
  BookOpen,
  FileText,
  GraduationCap,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Building2,
} from "lucide-react";
import { MOCK_FACULTY } from "@/lib/mock-data";
import { getStoredObject, setStoredObject } from "@/lib/faculty-storage";

export default function FacultyProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [faculty, setFaculty] = useState<any>(MOCK_FACULTY[0]);

  useEffect(() => {
    let activeFaculty = MOCK_FACULTY[0];
    const raw = localStorage.getItem("auth_user");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setUser(parsed);
        const match = MOCK_FACULTY.find(
          (f) =>
            f.employee_code?.toLowerCase() === parsed.employee_code?.toLowerCase() ||
            f.email?.toLowerCase() === parsed.email?.toLowerCase() ||
            f.id === parsed.faculty_id
        );
        if (match) {
          activeFaculty = match;
        }
      } catch {}
    }

    const defaultProfile = {
      ...activeFaculty,
      bio:
        activeFaculty.profile?.bio ||
        `${activeFaculty.full_name} is currently serving as ${activeFaculty.designation} in the Department of Computer Science & Engineering at the National Institute of Technology Hamirpur (HP).`,
      specializations:
        activeFaculty.research_interests?.join(", ") ||
        activeFaculty.profile?.specializations ||
        "Computer Science & Engineering",
      orcid: activeFaculty.profile?.orcid || "0000-0002-1845-9231",
      scopus_id: activeFaculty.profile?.scopus_id || "57193829100",
      google_scholar_id: activeFaculty.profile?.google_scholar_id || "",
      scholar_url: (activeFaculty.profile as any)?.scholar_url || (activeFaculty as any).portfolio_url || "",
    };

    const stored = getStoredObject(activeFaculty, "profile", defaultProfile);
    setFaculty(stored);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStoredObject(faculty, "profile", faculty);
    // Update local storage user if name or email changed
    if (user) {
      const updatedUser = {
        ...user,
        full_name: faculty.full_name,
        email: faculty.email,
      };
      localStorage.setItem("auth_user", JSON.stringify(updatedUser));
    }
    toast.success("Faculty profile updated and saved permanently!");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      {/* Top Banner Card */}
      <div className="rounded-3xl border border-[#eedfd8] bg-white p-6 shadow-xs flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[#eedfd8] shadow-sm bg-[#fff9f6] flex items-center justify-center flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={faculty.image_url || "/hod.jpg"}
            alt={faculty.full_name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/hod.jpg";
            }}
          />
        </div>

        <div className="flex-1 text-center md:text-left space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="bg-[#33110e] text-white text-xs font-mono font-bold px-2.5 py-0.5 rounded-full uppercase">
              {faculty.employee_code || "FACULTY"}
            </span>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2.5 py-0.5 rounded-full">
              {faculty.designation}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#33110e] tracking-tight">
            {faculty.full_name}
          </h1>

          <p className="text-xs text-neutral-600">
            Department of Computer Science &amp; Engineering • National Institute of Technology Hamirpur
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-neutral-600">
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-[#85261e]" />
              <span className="font-medium text-[#33110e]">{faculty.email}</span>
            </span>
            {faculty.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#85261e]" />
                <span className="font-mono text-neutral-700">{faculty.phone}</span>
              </span>
            )}
          </div>
        </div>

        {faculty.portfolio_url && (
          <a
            href={faculty.portfolio_url}
            target="_blank"
            rel="noreferrer"
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#eedfd8] bg-[#fff9f6] text-[#33110e] hover:bg-[#33110e] hover:text-white transition text-xs font-bold shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Institute Portfolio
          </a>
        )}
      </div>

      {/* Profile Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl border border-[#eedfd8] bg-white p-6 sm:p-8 shadow-xs"
      >
        <div>
          <h2 className="text-base font-bold text-[#1c110c] flex items-center gap-2 border-b border-[#eedfd8]/60 pb-3">
            <User className="w-4 h-4 text-[#85261e]" />
            Personal &amp; Contact Information
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#33110e]">
              Full Name (with Title)
            </label>
            <input
              type="text"
              value={faculty.full_name}
              onChange={(e) => setFaculty({ ...faculty, full_name: e.target.value })}
              className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] font-medium transition focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-neutral-500">
              Employee Code (Read-Only)
            </label>
            <input
              type="text"
              disabled
              value={faculty.employee_code}
              className="w-full rounded-xl border border-[#eedfd8] bg-neutral-100 px-3.5 py-2.5 text-xs text-neutral-600 font-mono cursor-not-allowed"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#33110e]">
              Institute Email Address
            </label>
            <input
              type="email"
              value={faculty.email}
              onChange={(e) => setFaculty({ ...faculty, email: e.target.value })}
              className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] font-medium transition focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#33110e]">
              Official Phone / Extn.
            </label>
            <input
              type="text"
              value={faculty.phone || ""}
              onChange={(e) => setFaculty({ ...faculty, phone: e.target.value })}
              className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] font-medium transition focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
            />
          </div>
        </div>

        {/* Bio & Research Interests */}
        <div className="space-y-4 pt-2 border-t border-[#eedfd8]/60">
          <div>
            <h2 className="text-base font-bold text-[#1c110c] flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-[#85261e]" />
              Academic Biography &amp; Research Focus
            </h2>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#33110e]">
              Research Bio &amp; Summary
            </label>
            <textarea
              rows={4}
              value={faculty.bio || ""}
              onChange={(e) => setFaculty({ ...faculty, bio: e.target.value })}
              className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-3 text-xs text-[#1c110c] leading-relaxed transition focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#33110e]">
              Research Areas / Specializations (Comma-Separated)
            </label>
            <input
              type="text"
              value={faculty.specializations || ""}
              onChange={(e) => setFaculty({ ...faculty, specializations: e.target.value })}
              className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] font-medium transition focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
              placeholder="e.g. Artificial Intelligence, Cloud Computing, Wireless Networks"
            />
          </div>
        </div>

        {/* Academic & Research Identifiers */}
        <div className="border-t border-[#eedfd8]/60 pt-4 space-y-4">
          <h2 className="text-base font-bold text-[#1c110c] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#85261e]" />
            Academic &amp; Research Identifiers (NIRF / NBA)
          </h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#33110e]">ORCID Identifier</label>
              <input
                type="text"
                placeholder="0000-0002-XXXX-XXXX"
                value={faculty.orcid || ""}
                onChange={(e) => setFaculty({ ...faculty, orcid: e.target.value })}
                className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs font-mono text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#33110e]">Scopus Author ID</label>
              <input
                type="text"
                placeholder="571938XXXXX"
                value={faculty.scopus_id || ""}
                onChange={(e) => setFaculty({ ...faculty, scopus_id: e.target.value })}
                className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs font-mono text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#33110e]">Google Scholar Profile URL</label>
              <input
                type="text"
                placeholder="https://scholar.google.com/citations?user=..."
                value={faculty.scholar_url || faculty.google_scholar_id || faculty.google_scholar_url || ""}
                onChange={(e) =>
                  setFaculty({
                    ...faculty,
                    scholar_url: e.target.value,
                    google_scholar_id: e.target.value,
                    google_scholar_url: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs font-mono text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#33110e]">INFLIBNET Vidwan URL / ID</label>
              <input
                type="text"
                placeholder="https://vidwan.inflibnet.ac.in/profile/..."
                value={faculty.vidwan_url || (faculty.profile as any)?.vidwan_url || ""}
                onChange={(e) => setFaculty({ ...faculty, vidwan_url: e.target.value })}
                className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs font-mono text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#33110e]">ResearchGate Profile URL</label>
              <input
                type="text"
                placeholder="https://www.researchgate.net/profile/..."
                value={faculty.rg_url || (faculty.profile as any)?.rg_url || ""}
                onChange={(e) => setFaculty({ ...faculty, rg_url: e.target.value })}
                className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs font-mono text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#33110e]">LinkedIn Profile URL</label>
              <input
                type="text"
                placeholder="https://www.linkedin.com/in/..."
                value={faculty.linkedin_url || (faculty.profile as any)?.linkedin_url || ""}
                onChange={(e) => setFaculty({ ...faculty, linkedin_url: e.target.value })}
                className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs font-mono text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
              />
            </div>
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-[#eedfd8]/60">
          <span className="text-xs text-neutral-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> All changes will update your public portfolio
          </span>

          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:shadow-lg transition duration-150 cursor-pointer"
          >
            <Save className="h-4 w-4 text-amber-300" /> Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
}
