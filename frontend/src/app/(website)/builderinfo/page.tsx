"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Code2,
  GitBranch,
  Github,
  Linkedin,
  ExternalLink,
  Terminal,
  ShieldCheck,
  Award,
  Sparkles,
  Server,
  Database,
  Layers,
  ArrowRight,
  Check,
  Copy,
  Cpu,
  GraduationCap,
  Heart,
  Globe,
  Mail,
  RefreshCw,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { toast } from "sonner";

export default function BuilderInfoPage() {
  const [activeCliTab, setActiveCliTab] = useState<"status" | "architecture" | "tech">("status");
  const [copiedCli, setCopiedCli] = useState<boolean>(false);

  const handleCopyCli = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCli(true);
    toast.success("Command copied to clipboard!");
    setTimeout(() => setCopiedCli(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#faf6f3] text-[#1c110c] font-sans selection:bg-[#85261e] selection:text-white pb-20">
      {/* 1. HERO SECTION */}
      <section className="bg-gradient-to-b from-[#33110e] via-[#4a1914] to-[#85261e] text-white pt-20 pb-16 px-4 sm:px-6 relative overflow-hidden shadow-lg">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-white/15 border border-white/20 text-amber-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-xs">
              <Code2 className="w-3.5 h-3.5 text-amber-300" />
              NIT Hamirpur CSE Portal
            </span>
            <span className="bg-white/10 text-white/90 text-xs font-medium px-3 py-1 rounded-full border border-white/15">
              Engineering Team &amp; Credits
            </span>
            <span className="bg-emerald-500/20 text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-400/30">
              Verified Production v2.4
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-tight">
              The Minds Behind The Portal
            </h1>
            <p className="text-sm sm:text-base text-neutral-200 max-w-3xl leading-relaxed">
              Conceptualized and mentored under <strong>Dr. Arun Kumar Yadav</strong>, and architected by student engineers <strong>Divyansh Jamwal</strong> and <strong>Shlok Goyal</strong> to deliver a resilient, enterprise-grade academic platform for the Department of Computer Science &amp; Engineering.
            </p>
          </div>

          {/* KPI Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 shadow-2xs">
              <p className="text-xs uppercase font-bold text-neutral-300 tracking-wider">Total Commits</p>
              <p className="text-2xl sm:text-3xl font-black text-amber-200 mt-1">218+</p>
              <p className="text-[11px] text-neutral-300 mt-0.5">Continuous Delivery</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 shadow-2xs">
              <p className="text-xs uppercase font-bold text-neutral-300 tracking-wider">Code Volume</p>
              <p className="text-2xl sm:text-3xl font-black text-white mt-1">+290k</p>
              <p className="text-[11px] text-neutral-300 mt-0.5">Lines of Code Pushed</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 shadow-2xs">
              <p className="text-xs uppercase font-bold text-neutral-300 tracking-wider">Database Tables</p>
              <p className="text-2xl sm:text-3xl font-black text-amber-300 mt-1">34</p>
              <p className="text-[11px] text-neutral-300 mt-0.5">Strict 3NF PostgreSQL</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 shadow-2xs">
              <p className="text-xs uppercase font-bold text-neutral-300 tracking-wider">Architecture</p>
              <p className="text-2xl sm:text-3xl font-black text-emerald-300 mt-1">Dual-Sync</p>
              <p className="text-[11px] text-neutral-300 mt-0.5">Offline Cache + ACID</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN BODY */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 space-y-12">
        {/* ========================================================================= */}
        {/* FACULTY MENTOR SPOTLIGHT: DR. ARUN KUMAR YADAV */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl border border-[#eedfd8] p-6 sm:p-8 shadow-xs overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#85261e]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 relative z-10">
            {/* Faculty Portrait */}
            <div className="flex flex-col items-center shrink-0">
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-3 border-[#85261e] shadow-md bg-[#fff9f6]">
                <Image
                  src="/dr_arun_kumar_yadav.jpg"
                  alt="Dr. Arun Kumar Yadav"
                  fill
                  className="object-cover object-top"
                  unoptimized
                />
              </div>
              <span className="mt-3 bg-[#33110e] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                Code: CS012
              </span>
            </div>

            {/* Faculty Bio & Guidance Highlights */}
            <div className="space-y-4 text-center md:text-left flex-1">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#85261e] bg-[#fff9f6] px-3 py-1 rounded-full border border-[#eedfd8]">
                  Faculty Mentor &amp; Technical Advisor
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#33110e] tracking-tight uppercase mt-2">
                  Dr. Arun Kumar Yadav
                </h2>
                <p className="text-sm font-semibold text-[#85261e]">
                  Assistant Professor Grade-I • Department of Computer Science &amp; Engineering, NIT Hamirpur
                </p>
              </div>

              {/* Mentorship Vision Statement */}
              <blockquote className="text-xs sm:text-sm text-neutral-700 italic bg-[#fff9f6] border-l-4 border-[#85261e] p-4 rounded-r-xl leading-relaxed">
                &ldquo;Modernizing the academic portal of NIT Hamirpur required moving beyond legacy static sites toward an enterprise, audit-ready data ecosystem. Under our guidance, the team established strict NBA/NIRF criteria compliance, real-time multi-faculty co-authorship synchronization, and a seamless portfolio experience for departmental faculty.&rdquo;
              </blockquote>

              {/* Key Mentorship Contributions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="bg-[#faf6f3] border border-[#eedfd8] rounded-xl p-3 text-xs space-y-1">
                  <p className="font-bold text-[#33110e] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#85261e]" />
                    Audit &amp; Compliance
                  </p>
                  <p className="text-neutral-600 text-[11px] leading-snug">
                    Designed criteria parity matching national accreditation formats (NBA, NIRF, NAAC).
                  </p>
                </div>
                <div className="bg-[#faf6f3] border border-[#eedfd8] rounded-xl p-3 text-xs space-y-1">
                  <p className="font-bold text-[#33110e] flex items-center gap-1.5">
                    <RefreshCw className="w-4 h-4 text-[#85261e]" />
                    Multi-Faculty Sync
                  </p>
                  <p className="text-neutral-600 text-[11px] leading-snug">
                    Architected co-authorship propagation across internal colleagues in real-time.
                  </p>
                </div>
                <div className="bg-[#faf6f3] border border-[#eedfd8] rounded-xl p-3 text-xs space-y-1">
                  <p className="font-bold text-[#33110e] flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-[#85261e]" />
                    Academic Parity
                  </p>
                  <p className="text-neutral-600 text-[11px] leading-snug">
                    Standardized journals, conferences, books, and thesis supervision schemas.
                  </p>
                </div>
              </div>

              {/* Action Link to Portfolio */}
              <div className="pt-2">
                <Link
                  href="/people/faculty/cs12"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#85261e] hover:bg-[#33110e] text-white px-4 py-2.5 text-xs font-bold shadow-xs hover:shadow-md transition cursor-pointer"
                >
                  <span>Explore Dr. Arun Kumar Yadav&apos;s Faculty Portfolio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* LEAD DEVELOPERS: DIVYANSH JAMWAL & SHLOK GOYAL */}
        {/* ========================================================================= */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#85261e] bg-white px-3 py-1 rounded-full border border-[#eedfd8]">
              Core Contributors &amp; Developers
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#33110e] tracking-tight uppercase">
              The Full-Stack Engineering Team
            </h2>
            <p className="text-xs text-neutral-600">
              Engineered, debugged, and shipped by undergraduate students in the Department of Computer Science &amp; Engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. DIVYANSH JAMWAL CARD */}
            <div className="bg-white rounded-3xl border border-[#eedfd8] p-6 shadow-xs hover:border-[#85261e]/40 transition space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h3 className="text-xl font-black text-[#33110e] uppercase tracking-tight">
                        Divyansh Jamwal
                      </h3>
                      <p className="text-xs font-medium text-neutral-500 mt-0.5">
                        B.Tech CSE • NIT Hamirpur
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-[10px] font-mono font-bold px-2.5 py-1 rounded-full">
                        169+ Commits
                      </span>
                      <span className="bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full">
                        +210k+ LOC
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed">
                  Architected the Go REST API, PostgreSQL relational schema, offline-resilient dual-persistence state machine (<code className="text-[#85261e] font-mono text-[11px]">nith_faculty_*</code>), and Linux production server deployment.
                </p>

                {/* Contribution Bullets */}
                <div className="space-y-2 pt-1 border-t border-[#eedfd8]">
                  <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                    Core Technical Contributions:
                  </p>
                  <ul className="text-xs text-neutral-700 space-y-1.5 list-disc list-inside">
                    <li>Designed 34-table PostgreSQL 16 schema with UUIDv4 keys and M:N join tables.</li>
                    <li>Built real-time multi-faculty publication &amp; co-author synchronization engine.</li>
                    <li>Created reactive sidebar count badge system &amp; separated publication managers.</li>
                    <li>Orchestrated remote Ubuntu server setup, Nginx reverse proxy, and PM2 processes.</li>
                  </ul>
                </div>
              </div>

              {/* Social Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-[#eedfd8]">
                <a
                  href="https://github.com/divyansh-v15-06"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition shadow-xs"
                >
                  <FaGithub className="w-4 h-4" />
                  <span>GitHub Profile</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/divyansh-jamwal-95401b341/?isSelfProfile=true"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#0a66c2] hover:bg-[#084e96] text-white text-xs font-bold transition shadow-xs"
                >
                  <FaLinkedin className="w-4 h-4" />
                  <span>LinkedIn Profile</span>
                </a>
              </div>
            </div>

            {/* 2. SHLOK GOYAL CARD */}
            <div className="bg-white rounded-3xl border border-[#eedfd8] p-6 shadow-xs hover:border-[#85261e]/40 transition space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h3 className="text-xl font-black text-[#33110e] uppercase tracking-tight">
                        Shlok Goyal
                      </h3>
                      <p className="text-xs font-medium text-neutral-500 mt-0.5">
                        B.Tech CSE • NIT Hamirpur
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-[10px] font-mono font-bold px-2.5 py-1 rounded-full">
                        49+ Commits
                      </span>
                      <span className="bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full">
                        +80k+ LOC
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed">
                  Architected the Next.js 16 App Router component hierarchy, responsive departmental layouts, interactive academic search filters, and unified design token system.
                </p>

                {/* Contribution Bullets */}
                <div className="space-y-2 pt-1 border-t border-[#eedfd8]">
                  <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                    Core Technical Contributions:
                  </p>
                  <ul className="text-xs text-neutral-700 space-y-1.5 list-disc list-inside">
                    <li>Engineered Next.js 16 App Router layouts and responsive client components.</li>
                    <li>Designed public directory views for faculty, staff, PhD scholars, and students.</li>
                    <li>Implemented departmental news, achievements, announcements, and carousel systems.</li>
                    <li>Ensured mobile responsive navigation parity across all screen dimensions.</li>
                  </ul>
                </div>
              </div>

              {/* Social Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-[#eedfd8]">
                <a
                  href="https://github.com/Shlok1729"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition shadow-xs"
                >
                  <FaGithub className="w-4 h-4" />
                  <span>GitHub Profile</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/shlok-goyal/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#0a66c2] hover:bg-[#084e96] text-white text-xs font-bold transition shadow-xs"
                >
                  <FaLinkedin className="w-4 h-4" />
                  <span>LinkedIn Profile</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* DEVELOPER CLI TERMINAL WIDGET */}
        {/* ========================================================================= */}
        <section className="bg-neutral-950 text-neutral-100 rounded-3xl border border-neutral-800 shadow-2xl overflow-hidden font-mono text-xs">
          {/* Terminal Window Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="ml-2 text-neutral-400 text-xs">nith-portal@terminal: ~/atlas</span>
            </div>

            <div className="flex items-center gap-1 text-[11px]">
              {(["status", "architecture", "tech"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveCliTab(tab)}
                  className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                    activeCliTab === tab
                      ? "bg-neutral-800 text-amber-300 font-bold"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Terminal Content */}
          <div className="p-6 space-y-3 leading-relaxed">
            {activeCliTab === "status" && (
              <>
                <p className="text-emerald-400">$ nith-portal --inspect-cluster</p>
                <p className="text-neutral-300">
                  [SYSTEM STATUS] &nbsp; 🟢 ONLINE &bull; Production v2.4 (Ubuntu 24.04 LTS / Node v24.19.0)
                </p>
                <p className="text-neutral-400">
                  [PM2 STATUS] &nbsp;&nbsp;&nbsp;&nbsp; tempcse-frontend (online) | tempcse-backend (online)
                </p>
                <p className="text-neutral-400">
                  [VERIFIED UPTIME] 108/108 Routes Passing (HTTP 200 OK)
                </p>
                <p className="text-neutral-400">
                  [CORE DIRECTORS] &nbsp;Faculty Mentor: Dr. Arun Kumar Yadav (CS012)
                </p>
                <p className="text-neutral-400">
                  [ENGINEERING] &nbsp;&nbsp;&nbsp;Divyansh Jamwal &bull; Shlok Goyal
                </p>
              </>
            )}

            {activeCliTab === "architecture" && (
              <>
                <p className="text-emerald-400">$ nith-portal --view-architecture</p>
                <p className="text-amber-300">
                  [STATE ENGINE] &nbsp;Dual-Persistence (Optimistic Browser Cache + PostgreSQL 16 ACID)
                </p>
                <p className="text-neutral-300">
                  [SCHEDULER] &nbsp;&nbsp;&nbsp;&nbsp;M:N Multi-Author Co-authorship Fan-out across colleagues
                </p>
                <p className="text-neutral-300">
                  [SECURITY] &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Immutable audit trail (`audit_logs`) + Argon2/Bcrypt hash
                </p>
                <p className="text-neutral-400">
                  [INTERACTIVE ER] Available at: https://tempcse.nith.ac.in/dbinfo
                </p>
              </>
            )}

            {activeCliTab === "tech" && (
              <>
                <p className="text-emerald-400">$ nith-portal --list-tech-stack</p>
                <p className="text-neutral-300">
                  &bull; Framework: &nbsp;&nbsp;Next.js 16.3.1 (Turbopack Engine) + React 19
                </p>
                <p className="text-neutral-300">
                  &bull; Backend: &nbsp;&nbsp;&nbsp;&nbsp;Go (Golang 1.22) REST API Architecture
                </p>
                <p className="text-neutral-300">
                  &bull; Database: &nbsp;&nbsp;&nbsp;PostgreSQL 16 (UUIDv4 Primary Keys, 34 Tables)
                </p>
                <p className="text-neutral-300">
                  &bull; Styling: &nbsp;&nbsp;&nbsp;&nbsp;Tailwind CSS v3 + Lucide Vector Icons
                </p>
                <p className="text-neutral-300">
                  &bull; Diagrams: &nbsp;&nbsp;&nbsp;Mermaid.js Vector Engine (/dbinfo)
                </p>
              </>
            )}

            <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-neutral-500 text-[11px]">
              <span>Type: bash atlas-inspect.sh</span>
              <button
                type="button"
                onClick={() => handleCopyCli("nith-portal --inspect-cluster")}
                className="flex items-center gap-1 hover:text-white transition"
              >
                {copiedCli ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCli ? "Copied" : "Copy command"}</span>
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* STUDENT HANDOVER & COLLABORATION NOTE */}
        {/* ========================================================================= */}
        <section className="bg-gradient-to-r from-[#fff9f6] via-white to-[#fff9f6] rounded-3xl border border-[#eedfd8] p-6 sm:p-8 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#85261e]/10 border border-[#85261e]/20 flex items-center justify-center text-[#85261e] mx-auto">
            <Heart className="w-6 h-6 fill-current text-[#85261e]" />
          </div>

          <div className="max-w-2xl mx-auto space-y-2">
            <h3 className="text-xl font-black text-[#33110e] uppercase tracking-tight">
              Built with Pride for NIT Hamirpur
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              This platform was built to serve future generations of students, faculty members, and research scholars at the Department of Computer Science &amp; Engineering. If you are a junior student interested in contributing or extending portal modules, explore our open architecture.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/dbinfo"
              className="px-4 py-2 rounded-xl bg-white border border-[#eedfd8] text-xs font-bold text-[#85261e] hover:bg-[#fff9f6] transition flex items-center gap-1.5 shadow-2xs"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Explore Database &amp; ER Diagrams (/dbinfo)</span>
            </Link>

            <a
              href="https://github.com/divyansh-v15-06/atlas/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <span>Submit Feedback or Bug Report</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

