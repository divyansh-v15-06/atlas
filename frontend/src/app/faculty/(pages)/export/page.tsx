"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  Download,
  FileText,
  Printer,
  Sparkles,
  Award,
  BookOpen,
  GraduationCap,
  Building2,
  Briefcase,
  ShieldCheck,
  Globe,
  Mic2,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Layers,
  Copy,
  Check,
  Eye,
  SlidersHorizontal,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { formatINR } from "@/lib/utils";
import {
  MOCK_FACULTY,
  MOCK_PUBLICATIONS,
  MOCK_PATENTS,
  MOCK_PROJECTS,
  MOCK_CONSULTANCIES,
} from "@/lib/mock-data";

export default function ExportResumePage() {
  const [user, setUser] = useState<any>(null);
  const [faculty, setFaculty] = useState<any>(MOCK_FACULTY[0]);
  const [publications, setPublications] = useState<any[]>([]);
  const [patents, setPatents] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [consultancies, setConsultancies] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [previewZoom, setPreviewZoom] = useState(100);
  const [activeTemplate, setActiveTemplate] = useState<"standard" | "compact" | "research">("standard");

  // Section Visibility Toggles
  const [sections, setSections] = useState({
    bio: true,
    qualifications: true,
    teaching: true,
    admin: true,
    grants: true,
    consultancies: true,
    supervisions: true,
    publications: true,
    patents: true,
    honors: true,
    exposures: true,
    talks: true,
  });

  const cvRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let currentFaculty = MOCK_FACULTY[0];
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
          currentFaculty = match;
        }
      } catch {}
    }
    setFaculty(currentFaculty);

    const legacyId = currentFaculty.legacy_id;
    const facId = currentFaculty.id;

    // Publications
    const userPapers = Array.isArray(currentFaculty.publications) && currentFaculty.publications.length > 0
      ? currentFaculty.publications
      : MOCK_PUBLICATIONS.filter((p: any) => {
          if (facId && p.faculty_ids?.includes(facId)) return true;
          if (legacyId && p.faculty_legacy_ids?.includes(legacyId)) return true;
          return false;
        });
    setPublications(userPapers);

    // Patents
    const userPatents = Array.isArray(currentFaculty.patents) && currentFaculty.patents.length > 0
      ? currentFaculty.patents
      : MOCK_PATENTS.filter((p: any) => {
          if (facId && p.faculty_ids && p.faculty_ids.includes(facId)) return true;
          if (legacyId && p.faculty_legacy_ids && p.faculty_legacy_ids.includes(legacyId)) return true;
          return false;
        });
    setPatents(userPatents);

    // Projects
    const userProjects = Array.isArray(currentFaculty.projects) && currentFaculty.projects.length > 0
      ? currentFaculty.projects
      : MOCK_PROJECTS.filter((p: any) => {
          if (facId && p.faculty_ids && p.faculty_ids.includes(facId)) return true;
          if (legacyId && p.faculty_legacy_ids && p.faculty_legacy_ids.includes(legacyId)) return true;
          return false;
        });
    setProjects(userProjects);

    // Consultancies
    const userCons = Array.isArray(currentFaculty.consultancies) && currentFaculty.consultancies.length > 0
      ? currentFaculty.consultancies
      : MOCK_CONSULTANCIES.filter((c: any) => {
          if (facId && c.faculty_ids && c.faculty_ids.includes(facId)) return true;
          if (legacyId && c.faculty_legacy_ids && c.faculty_legacy_ids.includes(legacyId)) return true;
          return false;
        });
    setConsultancies(userCons);
  }, []);

  const qualifications = (faculty as any).qualifications || [];
  const teachingExp = (faculty as any).teaching_experiences || [];
  const adminExp = (faculty as any).admin_experiences || (faculty as any).administrative_experiences || [];
  const honors = (faculty as any).honors || [];
  const exposures = (faculty as any).exposures || [];
  const expertTalks = (faculty as any).expert_talks || [];
  const supervisions = (faculty as any).supervisions || [];

  const handlePrint = () => {
    toast.info("Opening browser print dialog for Official PDF generation...");
    window.print();
  };

  const handleDownloadDoc = () => {
    toast.info("Generating official Institute Word (.doc) document...");
    const content = cvRef.current ? cvRef.current.innerHTML : "";
    const header = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Official CV - ${faculty.full_name}</title><style>
      body { font-family: 'Times New Roman', Times, serif; line-height: 1.4; color: #111; padding: 24px; font-size: 11pt; }
      h1 { font-size: 18pt; color: #33110e; border-bottom: 2px solid #85261e; padding-bottom: 4px; margin-bottom: 4px; }
      h2 { font-size: 13pt; color: #85261e; border-bottom: 1px solid #ccc; margin-top: 16px; margin-bottom: 6px; padding-bottom: 2px; }
      h3 { font-size: 11pt; font-weight: bold; margin-bottom: 2px; }
      p { margin: 3px 0; }
      .meta { font-size: 9.5pt; color: #555; }
      ul, ol { padding-left: 20px; }
      li { margin-bottom: 4px; }
    </style></head><body>`;
    const footer = `</body></html>`;
    const blob = new Blob([header + content + footer], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CV_${faculty.full_name.replace(/\s+/g, "_")}_NITH.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Official Academic CV (.doc) downloaded!");
  };

  const handleDownloadJSON = () => {
    const archive = {
      faculty,
      qualifications,
      teaching_experiences: teachingExp,
      administrative_experiences: adminExp,
      honors,
      foreign_exposures: exposures,
      expert_talks: expertTalks,
      research_supervisions: supervisions,
      publications,
      patents,
      sponsored_projects: projects,
      consultancies,
      generated_at: new Date().toISOString(),
      institution: "National Institute of Technology Hamirpur",
    };
    const blob = new Blob([JSON.stringify(archive, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Portfolio_${faculty.full_name.replace(/\s+/g, "_")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Complete JSON Portfolio Archive exported!");
  };

  const handleCopyMarkdown = () => {
    const md = `# ${faculty.full_name}
**${faculty.designation}**
Department of Computer Science & Engineering
National Institute of Technology Hamirpur (HP), India
Email: ${faculty.email || "faculty@nith.ac.in"} | Phone: ${faculty.phone || "+91-1972-254000"}

---

## Executive Profile
${faculty.bio || "Faculty profile at National Institute of Technology Hamirpur."}

## Educational Qualifications
${qualifications.map((q: any) => `- **${q.degree}** (${q.year}), ${q.institute}`).join("\n")}

## Academic & Teaching Experience
${teachingExp.map((t: any) => `- **${t.position}** (${t.start_date} - ${t.end_date}): ${t.organization || t.department}`).join("\n")}

## Administrative Appointments
${adminExp.map((a: any) => `- **${a.position}** (${a.start_date} - ${a.end_date}): ${a.organization}`).join("\n")}

## Research Supervisions
${supervisions.map((s: any) => `- [${s.level}] ${s.student_name} (${s.year || s.status}): "${s.thesis_title}"`).join("\n")}

## Scholarly Publications
${publications.map((p: any, i: number) => `${i + 1}. ${p.author_text || faculty.full_name} (${p.year}). "${p.title}". *${p.journal_or_conference_name || p.venue_name}*`).join("\n")}

---
*Generated via NITH Faculty Academic Suite on ${new Date().toLocaleDateString("en-IN")}*
`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    toast.success("Curriculum Vitae copied in Markdown format!");
    setTimeout(() => setCopied(false), 2500);
  };

  const toggleSection = (key: keyof typeof sections) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      {/* Header Banner */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#85261e]" />
              Official Curriculum Vitae &amp; Portfolio Generator
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2.5 py-0.5 rounded-full">
              Live Preview &amp; Export
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Generate and export official institute-standard resumes, research dossiers, and annual assessment CVs for{" "}
            <strong>{faculty.full_name}</strong> ({faculty.employee_code || "Faculty"}).
          </p>
        </div>

        {/* Primary Export Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] text-white px-4 py-2.5 text-xs font-bold shadow-xs hover:shadow-md transition cursor-pointer"
          >
            <Printer className="h-4 w-4 text-amber-300" />
            <span>Print / Save PDF</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadDoc}
            className="inline-flex items-center gap-2 rounded-xl border border-[#eedfd8] bg-white hover:bg-[#fff9f6] text-[#33110e] px-4 py-2.5 text-xs font-bold shadow-2xs hover:shadow-xs transition cursor-pointer"
          >
            <Download className="h-4 w-4 text-[#85261e]" />
            <span>Export Word (.doc)</span>
          </button>

          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#eedfd8] bg-white hover:bg-[#fff9f6] text-neutral-700 px-3 py-2.5 text-xs font-semibold shadow-2xs transition cursor-pointer"
            title="Copy Markdown Text CV"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#85261e]" />}
            <span>{copied ? "Copied!" : "Copy MD"}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadJSON}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#eedfd8] bg-white hover:bg-[#fff9f6] text-neutral-700 px-3 py-2.5 text-xs font-semibold shadow-2xs transition cursor-pointer"
            title="Download complete JSON data archive"
          >
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* Control Toolbar: Template Selector & Zoom & Section Filters */}
      <div className="bg-white border border-[#eedfd8] rounded-2xl p-4 shadow-xs space-y-3.5 print:hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[#eedfd8]/60 pb-3">
          {/* Template Style Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#33110e] flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#85261e]" />
              CV Format Style:
            </span>
            <div className="flex items-center bg-[#fff9f6] p-1 rounded-xl border border-[#eedfd8]">
              {[
                { id: "standard", label: "Standard Institute CV" },
                { id: "compact", label: "Executive Summary" },
                { id: "research", label: "Full Research Dossier" },
              ].map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setActiveTemplate(tmpl.id as any)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                    activeTemplate === tmpl.id
                      ? "bg-[#33110e] text-white shadow-xs"
                      : "text-[#33110e] hover:bg-[#eedfd8]/50"
                  }`}
                >
                  {tmpl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-500 font-medium">Zoom:</span>
            <button
              onClick={() => setPreviewZoom((prev) => Math.max(75, prev - 10))}
              className="p-1.5 rounded-lg border border-[#eedfd8] bg-[#fff9f6] text-[#33110e] hover:bg-[#33110e] hover:text-white transition cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono font-bold text-[#33110e] w-12 text-center">
              {previewZoom}%
            </span>
            <button
              onClick={() => setPreviewZoom((prev) => Math.min(125, prev + 10))}
              className="p-1.5 rounded-lg border border-[#eedfd8] bg-[#fff9f6] text-[#33110e] hover:bg-[#33110e] hover:text-white transition cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setPreviewZoom(100)}
              className="p-1.5 rounded-lg border border-[#eedfd8] bg-[#fff9f6] text-neutral-600 hover:text-[#33110e] transition cursor-pointer"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Section Visibility Toggles */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#33110e] flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#85261e]" />
              Included CV Sections (Toggle to customize):
            </span>
            <button
              type="button"
              onClick={() =>
                setSections({
                  bio: true,
                  qualifications: true,
                  teaching: true,
                  admin: true,
                  grants: true,
                  consultancies: true,
                  supervisions: true,
                  publications: true,
                  patents: true,
                  honors: true,
                  exposures: true,
                  talks: true,
                })
              }
              className="text-[10px] text-[#85261e] font-semibold hover:underline cursor-pointer"
            >
              Select All
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-0.5">
            {[
              { key: "bio", label: "Profile & Bio" },
              { key: "qualifications", label: `Qualifications (${qualifications.length})` },
              { key: "teaching", label: `Teaching (${teachingExp.length})` },
              { key: "admin", label: `Admin Roles (${adminExp.length})` },
              { key: "grants", label: `Grants (${projects.length})` },
              { key: "consultancies", label: `Consultancies (${consultancies.length})` },
              { key: "supervisions", label: `Supervisions (${supervisions.length})` },
              { key: "publications", label: `Publications (${publications.length})` },
              { key: "patents", label: `Patents (${patents.length})` },
              { key: "honors", label: `Honors (${honors.length})` },
              { key: "exposures", label: `Foreign Visits (${exposures.length})` },
              { key: "talks", label: `Keynotes (${expertTalks.length})` },
            ].map((sec) => (
              <label
                key={sec.key}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border cursor-pointer transition select-none ${
                  (sections as any)[sec.key]
                    ? "bg-[#fff9f6] text-[#33110e] border-[#85261e]/40 shadow-2xs"
                    : "bg-neutral-50 text-neutral-400 border-neutral-200 line-through"
                }`}
              >
                <input
                  type="checkbox"
                  checked={(sections as any)[sec.key]}
                  onChange={() => toggleSection(sec.key as any)}
                  className="rounded border-[#eedfd8] text-[#85261e] focus:ring-[#85261e] h-3.5 w-3.5"
                />
                <span>{sec.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Live Document Canvas Container */}
      <div className="bg-neutral-100/70 p-4 sm:p-8 rounded-3xl border border-[#eedfd8] overflow-x-auto flex justify-center print:bg-transparent print:p-0 print:border-0">
        <div
          style={{ transform: `scale(${previewZoom / 100})`, transformOrigin: "top center" }}
          className="transition-transform duration-150 w-full max-w-4xl"
        >
          {/* Official Printable Academic CV Document */}
          <div
            ref={cvRef}
            id="official-cv-printable"
            className="bg-white border border-[#eedfd8] rounded-2xl p-8 sm:p-14 shadow-xl space-y-7 print:border-0 print:p-0 print:shadow-none font-sans text-neutral-800"
          >
            {/* Document Institutional Header */}
            <div className="border-b-2 border-[#85261e] pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div className="space-y-1.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#33110e] tracking-tight uppercase">
                  {faculty.full_name}
                </h1>
                <p className="text-sm sm:text-base font-bold text-[#85261e]">
                  {faculty.designation} • Department of Computer Science &amp; Engineering
                </p>
                <p className="text-xs font-semibold text-neutral-700">
                  National Institute of Technology Hamirpur, Himachal Pradesh – 177005, India
                </p>
                {faculty.employee_code && (
                  <p className="text-xs font-mono text-neutral-500">
                    Employee Code: {faculty.employee_code}
                  </p>
                )}
              </div>

              <div className="text-xs space-y-1 text-neutral-600 sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-[#eedfd8]/60">
                <p className="flex items-center sm:justify-end gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#85261e]" />
                  <span>{faculty.email || "faculty@nith.ac.in"}</span>
                </p>
                <p className="flex items-center sm:justify-end gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#85261e]" />
                  <span>{faculty.phone || "+91-1972-254000"}</span>
                </p>
                <p className="flex items-center sm:justify-end gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#85261e]" />
                  <span>{faculty.office_room || "Department of CSE, NITH"}</span>
                </p>
                {faculty.orcid_id && (
                  <p className="font-mono text-[11px] text-[#85261e]">
                    ORCID: {faculty.orcid_id}
                  </p>
                )}
                {faculty.scopus_id && (
                  <p className="font-mono text-[11px] text-sky-800">
                    Scopus ID: {faculty.scopus_id}
                  </p>
                )}
              </div>
            </div>

            {/* Section 1: Executive Profile & Bio */}
            {sections.bio && faculty.bio && (
              <div className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#85261e] border-b border-[#eedfd8] pb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#85261e]" />
                  Executive Profile &amp; Research Interests
                </h2>
                <p className="text-xs leading-relaxed text-neutral-700 text-justify">
                  {faculty.bio}
                </p>
                {faculty.research_interests && faculty.research_interests.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {faculty.research_interests.map((area: string, idx: number) => (
                      <span
                        key={idx}
                        className="bg-[#fff9f6] text-[#33110e] border border-[#eedfd8] text-[10px] font-semibold px-2 py-0.5 rounded-md"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Section 2: Educational Qualifications */}
            {sections.qualifications && qualifications.length > 0 && (
              <div className="space-y-2.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#85261e] border-b border-[#eedfd8] pb-1 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-[#85261e]" />
                  Educational Qualifications
                </h2>
                <div className="space-y-1.5 text-xs">
                  {qualifications.map((q: any, i: number) => (
                    <div key={i} className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-[#1c110c]">{q.degree}</span>
                        {q.field && <span> in {q.field}</span>}
                        <p className="text-neutral-600">{q.institute}</p>
                      </div>
                      <span className="font-mono font-bold text-[#85261e]">{q.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 3: Academic & Teaching Experience */}
            {sections.teaching && teachingExp.length > 0 && (
              <div className="space-y-2.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#85261e] border-b border-[#eedfd8] pb-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#85261e]" />
                  Academic &amp; Teaching Appointments
                </h2>
                <div className="space-y-1.5 text-xs">
                  {teachingExp.map((t: any, i: number) => (
                    <div key={i} className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-[#1c110c]">{t.position}</span>
                        <p className="text-neutral-600">{t.organization || t.department}</p>
                      </div>
                      <span className="font-mono font-bold text-[#33110e]">
                        {t.start_date} – {t.end_date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 4: Administrative Appointments */}
            {sections.admin && adminExp.length > 0 && (
              <div className="space-y-2.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#85261e] border-b border-[#eedfd8] pb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#85261e]" />
                  Administrative Roles &amp; Institutional Responsibilities
                </h2>
                <div className="space-y-1.5 text-xs">
                  {adminExp.map((a: any, i: number) => (
                    <div key={i} className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-[#1c110c]">{a.position}</span>
                        <p className="text-neutral-600">{a.organization}</p>
                      </div>
                      <span className="font-mono text-neutral-600">
                        {a.start_date} – {a.end_date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 5: Sponsored Research Grants & Consultancies */}
            {((sections.grants && projects.length > 0) || (sections.consultancies && consultancies.length > 0)) && (
              <div className="space-y-2.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#85261e] border-b border-[#eedfd8] pb-1 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#85261e]" />
                  Sponsored Research Grants &amp; Industrial Consultancies
                </h2>
                <div className="space-y-2 text-xs">
                  {sections.grants &&
                    projects.map((p: any, i: number) => (
                      <div key={`prj-${i}`} className="flex justify-between items-start">
                        <div>
                          <span className="font-bold text-[#1c110c]">{p.title}</span>
                          <p className="text-neutral-600">
                            Agency: <strong>{p.funding_agency}</strong> • Status: {p.status} • Ref: {p.reference_number || "N/A"}
                          </p>
                        </div>
                        <span className="font-mono font-bold text-[#85261e]">
                          {formatINR(p.total_sanctioned_amount)}
                        </span>
                      </div>
                    ))}

                  {sections.consultancies &&
                    consultancies.map((c: any, i: number) => (
                      <div key={`cons-${i}`} className="flex justify-between items-start pt-0.5">
                        <div>
                          <span className="font-bold text-[#1c110c]">{c.title}</span>
                          <p className="text-neutral-600">
                            Client: <strong>{c.client_organisation}</strong> • Session: {c.academic_session}
                          </p>
                        </div>
                        <span className="font-mono font-bold text-emerald-800">
                          {formatINR(c.amount)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Section 6: Research Supervisions */}
            {sections.supervisions && supervisions.length > 0 && (
              <div className="space-y-2.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#85261e] border-b border-[#eedfd8] pb-1 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-[#85261e]" />
                  Research Guidance (Ph.D. &amp; M.Tech Theses)
                </h2>
                <div className="space-y-1.5 text-xs">
                  {supervisions.slice(0, activeTemplate === "compact" ? 6 : 20).map((s: any, i: number) => (
                    <div key={i} className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-[#1c110c]">
                          [{s.level}] {s.student_name}
                        </span>
                        {s.roll_number && <span className="text-neutral-500"> ({s.roll_number})</span>}
                        <p className="text-neutral-700 italic">&quot;{s.thesis_title}&quot;</p>
                      </div>
                      <span className="font-mono text-neutral-600">
                        {s.status} ({s.year})
                      </span>
                    </div>
                  ))}
                  {supervisions.length > (activeTemplate === "compact" ? 6 : 20) && (
                    <p className="text-[11px] text-neutral-500 italic pt-0.5">
                      + {supervisions.length - (activeTemplate === "compact" ? 6 : 20)} additional postgraduate and doctoral research scholars supervised.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Section 7: Peer-Reviewed Publications */}
            {sections.publications && publications.length > 0 && (
              <div className="space-y-2.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#85261e] border-b border-[#eedfd8] pb-1 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#85261e]" />
                  Selected Scholarly Publications
                </h2>
                <ol className="list-decimal pl-4 space-y-1.5 text-xs text-neutral-700 leading-relaxed">
                  {publications.slice(0, activeTemplate === "compact" ? 8 : 25).map((pub: any, i: number) => (
                    <li key={i}>
                      <span>
                        {pub.author_text || faculty.full_name} ({pub.year}). &quot;{pub.title}&quot;.{" "}
                        <em>{pub.journal_or_conference_name || pub.venue_name}</em>
                        {pub.volume && `, vol. ${pub.volume}`}
                        {pub.issue && `, no. ${pub.issue}`}
                        {(pub.page_range || pub.pages) && `, pp. ${pub.page_range || pub.pages}`}
                        .{pub.doi ? ` DOI: ${pub.doi}` : ""}
                      </span>
                    </li>
                  ))}
                  {publications.length > (activeTemplate === "compact" ? 8 : 25) && (
                    <p className="text-[11px] text-neutral-500 italic pt-0.5">
                      + {publications.length - (activeTemplate === "compact" ? 8 : 25)} additional peer-reviewed articles listed in complete institutional dossier.
                    </p>
                  )}
                </ol>
              </div>
            )}

            {/* Section 8: Patents */}
            {sections.patents && patents.length > 0 && (
              <div className="space-y-2.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#85261e] border-b border-[#eedfd8] pb-1 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#85261e]" />
                  Patents &amp; Intellectual Property
                </h2>
                <div className="space-y-1.5 text-xs">
                  {patents.map((p: any, i: number) => (
                    <div key={i} className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-[#1c110c]">{p.title}</span>
                        <p className="text-neutral-600">
                          App No: {p.application_number} • Status: <strong>{p.status}</strong>
                          {p.patent_number && ` • Patent No: ${p.patent_number}`}
                        </p>
                      </div>
                      <span className="font-mono text-neutral-500">{p.year || 2023}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 9: Honors & Awards */}
            {sections.honors && honors.length > 0 && (
              <div className="space-y-2.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#85261e] border-b border-[#eedfd8] pb-1 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#85261e]" />
                  Honors, Awards &amp; Recognitions
                </h2>
                <div className="space-y-1.5 text-xs">
                  {honors.map((h: any, i: number) => (
                    <div key={i} className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-[#1c110c]">{h.title}</span>
                        <p className="text-neutral-600">Awarded by: {h.organization}</p>
                      </div>
                      <span className="font-mono font-bold text-[#85261e]">{h.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 10: Foreign Visits & Keynote Talks */}
            {((sections.exposures && exposures.length > 0) || (sections.talks && expertTalks.length > 0)) && (
              <div className="space-y-2.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#85261e] border-b border-[#eedfd8] pb-1 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#85261e]" />
                  International Exposure &amp; Invited Keynotes
                </h2>
                <div className="space-y-2 text-xs">
                  {sections.exposures &&
                    exposures.map((e: any, i: number) => (
                      <div key={`exp-${i}`}>
                        <span className="font-bold text-[#1c110c]">{e.title}</span>
                        <p className="text-neutral-600 italic">&quot;{e.description}&quot;</p>
                      </div>
                    ))}
                  {sections.talks &&
                    expertTalks.slice(0, 5).map((t: any, i: number) => (
                      <div key={`talk-${i}`}>
                        <span className="font-bold text-[#1c110c]">{t.title}</span>
                        <p className="text-neutral-600">
                          Host: {t.venue} {t.date ? `(${t.date})` : ""}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Footer Attestation */}
            <div className="pt-8 border-t border-[#eedfd8] flex justify-between items-end text-xs text-neutral-500">
              <div>
                <p>Date: {new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}</p>
                <p>Place: NIT Hamirpur (HP), India</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-[#33110e]">({faculty.full_name})</p>
                <p>{faculty.designation}</p>
                <p className="text-[10px] text-neutral-400">Department of Computer Science &amp; Engineering</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
