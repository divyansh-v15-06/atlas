"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Target,
  Eye,
  Award,
  Users,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  ArrowRight,
  HelpCircle,
  Clock,
  Flame,
  Globe2,
  Trophy,
  Briefcase,
  Layers,
  ChevronRight,
  Quote,
  TrendingUp,
  Landmark,
  Binary,
} from "lucide-react";
import { useDepartment } from "@/context/department-context";
import { DepartmentEmptyState } from "@/components/common/department-empty-state";

export default function AboutUsPage() {
  const { activeDepartment } = useDepartment();
  const hasData = activeDepartment.slug === "cse";
  const [activeTab, setActiveTab] = useState<"overview" | "vision" | "timeline" | "pillars" | "labs">("overview");
  const [selectedMilestone, setSelectedMilestone] = useState(2);

  const metrics = [
    { label: "Faculty Mentors", value: "26+", icon: Users },
    { label: "Enrolled Scholars", value: "650+", icon: GraduationCap },
    { label: "Doctoral Fellows", value: "105+", icon: Sparkles },
    { label: "Advanced Labs", value: "12", icon: Cpu },
    { label: "Annual Grants", value: "₹4.8 Cr+", icon: Trophy },
    { label: "Placement Rate", value: "96.4%", icon: TrendingUp },
  ];

  const quickNav = [
    {
      title: "HOD Message & Leadership",
      href: "/aboutus/hod",
      desc: "Read the official address from Head of Department Dr. Siddhartha Chauhan on vision & strategic roadmap.",
      icon: Users,
      badge: "Department Head",
      gradient: "from-[#85261e] to-[#4a1814]",
    },
    {
      title: "Specialized Research Labs",
      href: "/aboutus/labs",
      desc: "12 high-performance computing facilities, NVIDIA DGX Stations, IoT sensor rigs, and cyber testbeds.",
      icon: Cpu,
      badge: "GPU Infrastructure",
      gradient: "from-[#33110e] to-[#85261e]",
    },
    {
      title: "Academic Programmes",
      href: "/academics/programsoffered",
      desc: "Rigorous NEP-2020 curriculum for B.Tech, M.Tech (AI/CSE), 5-Yr Dual Degree & Doctoral Ph.D.",
      icon: GraduationCap,
      badge: "NEP-2020 Aligned",
      gradient: "from-amber-900 to-[#85261e]",
    },
    {
      title: "Frequently Asked Questions",
      href: "/aboutus/faq",
      desc: "Detailed answers on admissions (JoSAA/CSAB/GATE), fellowships, labs, and career opportunities.",
      icon: HelpCircle,
      badge: "Help & Queries",
      gradient: "from-neutral-800 to-[#33110e]",
    },
  ];

  const milestones = [
    {
      year: "1986",
      title: "Foundation of REC Hamirpur",
      desc: "Regional Engineering College established as a joint venture of Govt. of India and Govt. of Himachal Pradesh.",
      tag: "Establishment",
      icon: Landmark,
    },
    {
      year: "1989",
      title: "Inception of CSE Department",
      desc: "Commenced undergraduate education with an initial intake of visionary computer engineering students.",
      tag: "Milestone",
      icon: Binary,
    },
    {
      year: "2002",
      title: "Deemed National Institute of Technology",
      desc: "Upgraded to National Institute of Technology with Deemed University status under Ministry of Education, GoI.",
      tag: "National Status",
      icon: Award,
    },
    {
      year: "2007",
      title: "Institute of National Importance (INI)",
      desc: "Conferred the prestigious status of Institute of National Importance by an Act of Parliament (NIT Act).",
      tag: "INI Act",
      icon: ShieldCheck,
    },
    {
      year: "2019",
      title: "GPU Supercomputing & AI Lab",
      desc: "Deployed high-density NVIDIA DGX workstation and distributed compute clusters for deep learning research.",
      tag: "Supercomputing",
      icon: Cpu,
    },
    {
      year: "2026",
      title: "Next-Gen AI & Quantum Hub",
      desc: "Expanded into Quantum Computing, Edge AI, Autonomous Cyber Defense, and Multidisciplinary Mountain Tech.",
      tag: "Present Era",
      icon: Sparkles,
    },
  ];

  const pillars = [
    {
      title: "Cutting-Edge AI & Supercomputing",
      desc: "High-density GPU accelerators, transformer modeling, neural networks, and scalable distributed parallel architectures.",
      icon: Cpu,
      color: "bg-amber-50 text-amber-800 border-amber-200",
    },
    {
      title: "Zero-Trust Cyber Defense & Cryptography",
      desc: "State-of-the-art malware forensics, blockchain decentralized ledgers, cryptographic primitives, and network security sandboxes.",
      icon: ShieldCheck,
      color: "bg-rose-50 text-rose-800 border-rose-200",
    },
    {
      title: "Edge IoT & Himalayan Telemetry Systems",
      desc: "Real-world sensor telemetry, LoRaWAN gateways, disaster resilience telemetry, and mountain environmental monitoring.",
      icon: Globe2,
      color: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
    {
      title: "Industry Synergy & Global Impact",
      desc: "Active joint research with Google, Microsoft, Amazon, SERB, DRDO, ISRO, and elite international universities.",
      icon: Briefcase,
      color: "bg-sky-50 text-sky-800 border-sky-200",
    },
  ];

  const featuredLabs = [
    {
      name: "High Performance Computing & GPU Lab",
      equipment: "NVIDIA DGX Station, Tesla V100 GPU Clusters, 128GB RAM Nodes",
      head: "Prof. Lalit Kumar Awasthi",
      category: "Supercomputing",
    },
    {
      name: "Artificial Intelligence & Robotics Lab",
      equipment: "NVIDIA RTX 4090 Rigs, TurtleBot3, LiDAR, RealSense 3D Depth Cams",
      head: "Dr. Mohammad Khalid Pandit",
      category: "Robotics & Vision",
    },
    {
      name: "Cyber Security & Cryptography Lab",
      equipment: "Hardware Security Modules (HSM), Wireshark Sandboxes, Isolated LAN",
      head: "Dr. Kamlesh Dutta",
      category: "Cyber Defense",
    },
    {
      name: "IoT & Himalayan Telemetry Lab",
      equipment: "Raspberry Pi 5 Clusters, LoRaWAN Gateways, Edge ESP32 Sensor Grid",
      head: "Dr. Naveen Chauhan",
      category: "Edge & Telemetry",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 bg-white min-h-[85vh] font-sans">
      {/* Title Header with Breadcrumbs */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#33110e] text-white shadow-sm">
              <Building2 className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#33110e] tracking-tight uppercase">
                About Department
              </h1>
              <p className="text-xs text-neutral-600 font-medium">
                Department of {activeDepartment.name} • National Institute of Technology Hamirpur
              </p>
            </div>
          </div>
        </div>

        {/* Quick Badge Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-3 py-1 rounded-full shadow-2xs flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#85261e]" />
            INI Institute of National Importance
          </span>
          <span className="bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            NBA Accredited &amp; NIRF Top Tier
          </span>
        </div>
      </div>

      {!hasData ? (
        <DepartmentEmptyState sectionTitle="Department Overview" />
      ) : (
        <>
          {/* ========================================================================= */}
          {/* 1. HERO SECTION: Compact 3D Layered Banner (Clean & Focused) */}
          {/* ========================================================================= */}
          <section className="relative rounded-3xl overflow-hidden border border-[#eedfd8] shadow-md bg-gradient-to-br from-[#2a0e0c] via-[#4a1814] to-[#1c110c] text-white">
            {/* Background Texture & Panorama Image with Overlay */}
            <div className="absolute inset-0 opacity-20 mix-blend-luminosity pointer-events-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/aboutusimg.jpg"
                alt="NIT Hamirpur Campus"
                className="w-full h-full object-cover object-center scale-105 filter blur-[1px]"
                onError={(e: any) => {
                  e.target.src = "/cseDepartmentPhoto.png";
                }}
              />
            </div>

            {/* Glowing Accent Orbs */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#85261e]/40 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 p-6 sm:p-8 lg:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Left Col: Main Text & Callout */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1 rounded-full text-xs font-bold text-amber-300 tracking-wide uppercase shadow-sm">
                    <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    Pioneering Computing Since 1989
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-[1.2] text-white">
                    Innovating at the Frontiers of{" "}
                    <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-amber-100 bg-clip-text text-transparent">
                      Computing &amp; Intelligence
                    </span>
                  </h2>

                  <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed max-w-2xl font-normal">
                    The Department of {activeDepartment.name} at NIT Hamirpur stands as a flagship center for computational excellence in the lap of the Himalayas. We blend foundational engineering rigour with pioneering research in Artificial Intelligence, High-Performance Systems, Quantum Computing, and Cybersecurity.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <Link
                      href="/aboutus/hod"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-[#1c110c] text-xs font-bold px-4 py-2 rounded-xl shadow-md transition"
                    >
                      <Users className="w-3.5 h-3.5" />
                      Read HOD Address
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href="/aboutus/labs"
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
                    >
                      <Cpu className="w-3.5 h-3.5 text-amber-300" />
                      Explore 12 Research Labs
                    </Link>
                  </div>
                </div>

                {/* Right Col: 3D Floating Spotlight Card */}
                <div className="lg:col-span-5">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-xl text-white relative overflow-hidden group hover:border-amber-300/40 transition">
                    <div className="flex items-center gap-3 border-b border-white/15 pb-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 p-0.5 shadow-md flex items-center justify-center">
                        <div className="w-full h-full bg-[#33110e] rounded-[10px] flex items-center justify-center">
                          <Landmark className="w-5 h-5 text-amber-300" />
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300">
                          Premier Academic Hub
                        </span>
                        <h3 className="text-sm font-bold text-white leading-tight">
                          NIT Hamirpur CSE Legacy
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-200 leading-relaxed mb-3">
                      Equipped with high-performance multi-GPU compute nodes, dedicated IoT sensor networks, and faculty recognized globally in Stanford’s Top 2% Scientists list.
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-center">
                      <div className="bg-black/30 backdrop-blur-sm rounded-xl p-2 border border-white/10">
                        <span className="text-base sm:text-lg font-extrabold text-amber-300">100%</span>
                        <p className="text-[9px] text-neutral-300 uppercase tracking-wider font-semibold">Ph.D. Mentors</p>
                      </div>
                      <div className="bg-black/30 backdrop-blur-sm rounded-xl p-2 border border-white/10">
                        <span className="text-base sm:text-lg font-extrabold text-amber-300">12+</span>
                        <p className="text-[9px] text-neutral-300 uppercase tracking-wider font-semibold">Specialized Labs</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* 2. SLEEK THIN TAPE / RIBBON STRIP (Compact Horizontal Numbers Bar) */}
          {/* ========================================================================= */}
          <div className="bg-[#fff9f6] border border-[#eedfd8] rounded-2xl px-4 py-3 shadow-2xs">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-[#eedfd8] gap-y-2">
              {metrics.map((m, idx) => (
                <div key={idx} className="flex items-center justify-center gap-2.5 px-2 py-1 text-left">
                  <div className="w-7 h-7 rounded-lg bg-white border border-[#eedfd8] text-[#85261e] flex items-center justify-center shadow-2xs flex-shrink-0">
                    <m.icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-sm sm:text-base font-black text-[#33110e] leading-none block">
                      {m.value}
                    </span>
                    <span className="text-[10px] font-semibold text-neutral-600 block mt-0.5 whitespace-nowrap">
                      {m.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 3. INTERACTIVE EXPLORATION BAR (Overview / Vision / Milestones / Pillars / Labs) */}
          {/* ========================================================================= */}
          <div className="bg-[#fff9f6] border border-[#eedfd8] rounded-2xl p-2 flex flex-wrap items-center justify-center sm:justify-start gap-1.5 shadow-xs">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "overview"
                  ? "bg-[#33110e] text-white shadow-sm"
                  : "text-neutral-700 hover:bg-white hover:text-[#85261e]"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Department Overview
            </button>
            <button
              onClick={() => setActiveTab("vision")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "vision"
                  ? "bg-[#33110e] text-white shadow-sm"
                  : "text-neutral-700 hover:bg-white hover:text-[#85261e]"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Vision &amp; Mission
            </button>
            <button
              onClick={() => setActiveTab("timeline")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "timeline"
                  ? "bg-[#33110e] text-white shadow-sm"
                  : "text-neutral-700 hover:bg-white hover:text-[#85261e]"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Historical Milestones
            </button>
            <button
              onClick={() => setActiveTab("pillars")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "pillars"
                  ? "bg-[#33110e] text-white shadow-sm"
                  : "text-neutral-700 hover:bg-white hover:text-[#85261e]"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Strategic Research Pillars
            </button>
            <button
              onClick={() => setActiveTab("labs")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "labs"
                  ? "bg-[#33110e] text-white shadow-sm"
                  : "text-neutral-700 hover:bg-white hover:text-[#85261e]"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              Laboratory Highlights
            </button>
          </div>

          {/* ========================================================================= */}
          {/* 4. DYNAMIC TAB CONTENT AREA */}
          {/* ========================================================================= */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Dual Visual Card: Academic Heritage & Department Story */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Left: Department Story */}
                <div className="lg:col-span-7 bg-white border border-[#eedfd8] rounded-3xl p-6 sm:p-8 shadow-xs hover:border-[#85261e]/40 transition flex flex-col justify-between space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#33110e] text-white text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                        Academic Legacy
                      </span>
                      <span className="text-xs font-semibold text-[#85261e]">
                        Established in 1989
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#1c110c] tracking-tight">
                      Shaping Tomorrow’s Computing Leaders in the Foothills of Dhauladhar
                    </h2>

                    <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                      The Department of {activeDepartment.name} has evolved from its modest beginnings in 1989 into one of northern India’s most reputable hubs for computing education and technological innovation.
                    </p>

                    <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                      With rigorous curricula revised under the National Education Policy (NEP-2020), students are trained in multidisciplinary skills encompassing deep mathematical theory, high-concurrency systems, artificial intelligence, cryptographic security, and human-computer interactions.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="flex items-start gap-2.5 bg-[#fff9f6] border border-[#eedfd8] p-3 rounded-xl">
                        <CheckCircle2 className="w-4 h-4 text-[#85261e] flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="text-xs font-bold text-[#1c110c]">NEP-2020 Framework</h3>
                          <p className="text-[11px] text-neutral-600">Flexible credit systems, minor degrees, and industrial apprenticeships.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 bg-[#fff9f6] border border-[#eedfd8] p-3 rounded-xl">
                        <CheckCircle2 className="w-4 h-4 text-[#85261e] flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="text-xs font-bold text-[#1c110c]">Doctoral Excellence</h3>
                          <p className="text-[11px] text-neutral-600">105+ full-time Ph.D. scholars publishing in IEEE, ACM &amp; Elsevier.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#eedfd8] flex items-center justify-between">
                    <span className="text-xs text-neutral-500 font-medium">
                      Location: CSE Block, NIT Hamirpur (HP) - 177005
                    </span>
                    <Link
                      href="/academics/programsoffered"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#85261e] hover:underline"
                    >
                      View Programmes Offered <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Right: Department Photo Frame with Floating Badges */}
                <div className="lg:col-span-5 relative rounded-3xl overflow-hidden border border-[#eedfd8] shadow-md group min-h-[320px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/cseDepartmentPhoto.png"
                    alt="CSE Department Building NIT Hamirpur"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out"
                    onError={(e: any) => {
                      e.target.src = "/aboutusimg.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Floating Glassmorphic Badge Bottom */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md border border-white/40 p-4 rounded-2xl shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-[#33110e] text-white flex items-center justify-center font-extrabold text-sm">
                          NIT
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-[#1c110c]">Department of {activeDepartment.code}</h3>
                          <p className="text-[10px] text-neutral-600">Academic &amp; Research Complex</p>
                        </div>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                        Active Facility
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "vision" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Vision & Mission Visual Deck */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Vision Card */}
                <div className="relative bg-gradient-to-br from-[#fff9f6] to-white border-2 border-[#eedfd8] hover:border-[#85261e] rounded-3xl p-6 sm:p-8 shadow-sm transition space-y-4 group">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#33110e] text-amber-300 flex items-center justify-center shadow-md group-hover:scale-110 transition">
                      <Eye className="w-6 h-6" />
                    </div>
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Strategic Vision
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-[#1c110c]">Department Vision</h3>
                    <p className="text-xs text-[#85261e] font-semibold mt-0.5">Inspiring Global Scientific &amp; Ethical Impact</p>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed pt-2">
                    To become a premier center of international excellence in computer science education and multidisciplinary research, producing globally competent, innovative, and ethically grounded engineering professionals who contribute meaningfully to technological advancement and societal well-being.
                  </p>

                  <div className="pt-4 border-t border-[#eedfd8] flex flex-wrap items-center gap-2 text-[11px] font-semibold text-neutral-600">
                    <span className="bg-white border border-[#eedfd8] px-2.5 py-1 rounded-lg">#GlobalCompetence</span>
                    <span className="bg-white border border-[#eedfd8] px-2.5 py-1 rounded-lg">#EthicalInnovation</span>
                    <span className="bg-white border border-[#eedfd8] px-2.5 py-1 rounded-lg">#SocietalImpact</span>
                  </div>
                </div>

                {/* Mission Card */}
                <div className="relative bg-gradient-to-br from-[#fff9f6] to-white border-2 border-[#eedfd8] hover:border-[#85261e] rounded-3xl p-6 sm:p-8 shadow-sm transition space-y-4 group">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#85261e] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition">
                      <Target className="w-6 h-6" />
                    </div>
                    <span className="bg-rose-100 text-rose-900 border border-rose-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Core Mission
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-[#1c110c]">Department Mission</h3>
                    <p className="text-xs text-[#85261e] font-semibold mt-0.5">Four Pillars of Execution</p>
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm text-neutral-700 pt-2">
                    <div className="flex items-start gap-2.5 bg-white border border-[#eedfd8] p-3 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-[#85261e] flex-shrink-0 mt-0.5" />
                      <span>Deliver rigorous undergraduate, postgraduate, and doctoral curricula aligned with global benchmarks and NEP-2020.</span>
                    </div>
                    <div className="flex items-start gap-2.5 bg-white border border-[#eedfd8] p-3 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-[#85261e] flex-shrink-0 mt-0.5" />
                      <span>Foster an ecosystem of creative research, patent generation, and collaborative sponsored grants with premier agencies.</span>
                    </div>
                    <div className="flex items-start gap-2.5 bg-white border border-[#eedfd8] p-3 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-[#85261e] flex-shrink-0 mt-0.5" />
                      <span>Cultivate ethical leadership, professional integrity, and continuous lifelong technical inquiry among all graduates.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="bg-[#33110e] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Evolutionary Journey
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1c110c]">
                  Chronicle of Excellence &amp; Milestones
                </h2>
                <p className="text-xs text-neutral-600">
                  Trace the illustrious history of NIT Hamirpur’s computing discipline from 1986 through modern supercomputing.
                </p>
              </div>

              {/* Interactive Milestone Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {milestones.map((m, idx) => {
                  const isSelected = selectedMilestone === idx;
                  const Icon = m.icon;
                  return (
                    <div
                      key={m.year}
                      onClick={() => setSelectedMilestone(idx)}
                      className={`cursor-pointer rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? "bg-gradient-to-br from-[#33110e] to-[#4a1814] text-white border-[#33110e] shadow-lg transform -translate-y-1"
                          : "bg-white text-neutral-800 border-[#eedfd8] hover:border-[#85261e]/40 hover:bg-[#fff9f6]"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className={`text-xs font-black px-2.5 py-1 rounded-lg ${
                              isSelected
                                ? "bg-amber-400 text-[#1c110c]"
                                : "bg-[#fff9f6] text-[#85261e] border border-[#eedfd8]"
                            }`}
                          >
                            {m.year}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              isSelected
                                ? "bg-white/20 text-white"
                                : "bg-neutral-100 text-neutral-600"
                            }`}
                          >
                            {m.tag}
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5 mb-2">
                          <div
                            className={`p-2 rounded-xl ${
                              isSelected
                                ? "bg-white/10 text-amber-300"
                                : "bg-[#fff9f6] text-[#85261e] border border-[#eedfd8]"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <h3
                            className={`text-sm font-bold leading-tight ${
                              isSelected ? "text-white" : "text-[#1c110c]"
                            }`}
                          >
                            {m.title}
                          </h3>
                        </div>

                        <p
                          className={`text-xs leading-relaxed mt-2 ${
                            isSelected ? "text-neutral-200" : "text-neutral-600"
                          }`}
                        >
                          {m.desc}
                        </p>
                      </div>

                      <div
                        className={`pt-3 mt-3 border-t text-[11px] font-semibold flex items-center justify-between ${
                          isSelected
                            ? "border-white/20 text-amber-300"
                            : "border-[#eedfd8] text-[#85261e]"
                        }`}
                      >
                        <span>{isSelected ? "Selected Milestone" : "Click to Explore"}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "pillars" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="bg-[#85261e] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Core Competencies
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1c110c]">
                  Strategic Research Pillars &amp; Focus Areas
                </h2>
                <p className="text-xs text-neutral-600">
                  Addressing high-impact national thrust areas through sponsored grants, patents, and multidisciplinary laboratories.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pillars.map((p, idx) => {
                  const Icon = p.icon;
                  return (
                    <div
                      key={idx}
                      className="bg-white border border-[#eedfd8] rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-[#85261e] transition space-y-3 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-2xl border ${p.color} group-hover:scale-110 transition`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-base font-bold text-[#1c110c] group-hover:text-[#85261e] transition">
                          {p.title}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                        {p.desc}
                      </p>
                      <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-[#85261e]">
                        <span>Explore Research Projects</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "labs" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <span className="bg-[#33110e] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Infrastructure Showcase
                  </span>
                  <h2 className="text-xl font-extrabold text-[#1c110c] mt-1">
                    Specialized Laboratories &amp; Compute Rigs
                  </h2>
                </div>
                <Link
                  href="/aboutus/labs"
                  className="inline-flex items-center gap-1.5 bg-[#85261e] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs hover:bg-[#4a1814] transition"
                >
                  View All 12 Labs <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredLabs.map((lab, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-[#eedfd8] rounded-2xl p-5 shadow-xs hover:border-[#85261e]/40 transition space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#85261e] bg-[#fff9f6] border border-[#eedfd8] px-2 py-0.5 rounded">
                          {lab.category}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-neutral-500 font-mono">
                          <Cpu className="w-3.5 h-3.5 text-neutral-400" /> High-End Rig
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-[#1c110c] leading-snug">
                        {lab.name}
                      </h3>

                      <div className="mt-2 bg-[#fff9f6] border border-[#eedfd8] rounded-xl p-2.5 text-xs text-neutral-700">
                        <strong className="text-[#33110e]">Hardware: </strong>
                        {lab.equipment}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#eedfd8] flex items-center justify-between text-xs text-neutral-600">
                      <span>Faculty Lead: <strong className="text-[#1c110c]">{lab.head}</strong></span>
                      <Link href="/aboutus/labs" className="text-[#85261e] font-bold hover:underline flex items-center gap-1">
                        Details <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 5. HOD SPOTLIGHT SHOWCASE CARD (Lively 3D Preview) */}
          {/* ========================================================================= */}
          <section className="bg-gradient-to-br from-[#fff9f6] via-white to-[#faf6f3] border-2 border-[#eedfd8] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#85261e]/5 rounded-full blur-2xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* HOD Photo & Designation Frame */}
              <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-neutral-100 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/hod_siddhartha.jpg"
                    alt="Dr. Siddhartha Chauhan, HOD"
                    className="w-full h-full object-cover"
                    onError={(e: any) => {
                      e.target.src = "/hod.jpg";
                    }}
                  />
                  <div className="absolute bottom-2 right-2 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    In Office
                  </div>
                </div>

                <div className="mt-3">
                  <span className="bg-[#33110e] text-white text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                    Head of Department
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#1c110c] mt-1">
                    Dr. Siddhartha Chauhan
                  </h3>
                  <p className="text-xs text-[#85261e] font-semibold">
                    Associate Professor &amp; Head
                  </p>
                  <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                    Ph.D. (NIT Hamirpur) • M.Tech (CSE)
                  </p>
                </div>
              </div>

              {/* HOD Message Quote & Callout */}
              <div className="lg:col-span-8 space-y-4 border-t lg:border-t-0 lg:border-l border-[#eedfd8] pt-6 lg:pt-0 lg:pl-8">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#85261e] tracking-wider">
                  <Quote className="w-4 h-4 text-[#85261e]" />
                  Leadership Message snippet
                </div>

                <p className="text-sm sm:text-base text-neutral-800 leading-relaxed italic font-serif">
                  “It is with great pleasure and pride that I welcome you to the Department of {activeDepartment.name} at NIT Hamirpur. In an era characterized by rapid digital transformation, generative AI, and quantum breakthroughs, our mission is to cultivate an environment of intellectual curiosity, rigorous engineering disciplines, and innovative technological contributions.”
                </p>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#eedfd8]">
                  <div className="text-xs text-neutral-600">
                    <span className="font-semibold text-[#1c110c]">Office:</span> Room 204, CSE Building • Phone: +91-1972-254424
                  </div>

                  <Link
                    href="/aboutus/hod"
                    className="inline-flex items-center gap-1.5 bg-[#33110e] hover:bg-[#85261e] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition"
                  >
                    Read Full Official Address <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* 6. QUICK EXPLORATION TILES (Interactive Navigation Deck) */}
          {/* ========================================================================= */}
          <div className="space-y-4 pt-2">
            <div>
              <span className="text-xs font-bold uppercase text-[#85261e] tracking-wider">Explore Department</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#1c110c]">
                Quick Portals &amp; Specialized Resources
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {quickNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="bg-white border border-[#eedfd8] rounded-2xl p-5 shadow-xs hover:shadow-lg hover:border-[#85261e] transition duration-200 group flex flex-col justify-between transform hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.gradient} text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-[10px] font-bold px-2 py-0.5 rounded">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#1c110c] group-hover:text-[#85261e] transition">
                      {item.title}
                    </h3>
                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-4 flex items-center gap-1 text-xs font-bold text-[#85261e] group-hover:translate-x-1.5 transition duration-150">
                    <span>View Section</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
