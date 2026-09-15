"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import CountUp from "react-countup";
import {
  MOCK_FACULTY,
  MOCK_PUBLICATIONS,
  MOCK_PATENTS,
  MOCK_PROJECTS,
  MOCK_STUDENTS,
  MOCK_ANNOUNCEMENTS,
} from "@/lib/mock-data";
import {
  Award,
  BookOpen,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Sparkles,
  Users,
  Lightbulb,
  Layers,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Trophy,
  Landmark,
  Briefcase,
  Flame,
  CheckCircle2,
  Cpu,
  UserCheck,
} from "lucide-react";
import { useDepartment } from "@/context/department-context";
import { DepartmentEmptyState } from "@/components/common/department-empty-state";
import { useHodMessage } from "@/hooks/use-hod-message";

// Canonical carousel images from old tempcsebase
const TEMPCSE_HERO_SLIDES = [
  {
    src: "https://res.cloudinary.com/eqvhqx5q/image/upload/v1789427452/vhzurtmaxoray1q0oe6q.png",
    alt: "Department of Computer Science & Engineering - NIT Hamirpur",
  },
  {
    src: "https://res.cloudinary.com/eqvhqx5q/image/upload/v1789427450/t1lfnxduqhnkj48oohoz.png",
    alt: "Computing Infrastructure & Academic Excellence",
  },
  {
    src: "https://res.cloudinary.com/eqvhqx5q/image/upload/v1789427455/duizaz9gglgx3qkvmymb.png",
    alt: "Departmental Website Inauguration Ceremony",
  },
  {
    src: "https://res.cloudinary.com/eqvhqx5q/image/upload/v1789427495/p5qtua1zvw6iozwpby9l.png",
    alt: "Academic and Research Milestones",
  },
  {
    src: "https://res.cloudinary.com/eqvhqx5q/image/upload/v1789427498/alqnfjbp6qsdoaefudcm.png",
    alt: "Faculty & Student Scientific Achievements",
  },
  {
    src: "https://res.cloudinary.com/eqvhqx5q/image/upload/v1789427501/flnke4ag8rep0klteys8.png",
    alt: "Innovations in Artificial Intelligence & Computing Systems",
  },
  {
    src: "https://res.cloudinary.com/eqvhqx5q/image/upload/v1789427503/ozq8xoxrgyubfhqrnqgv.png",
    alt: "Technical Workshops & Hands-on Laboratories",
  },
  {
    src: "https://res.cloudinary.com/eqvhqx5q/image/upload/v1789427505/ylj8ljw3wpdcnjceuakn.png",
    alt: "Industry Collaborations & Student Hackathons",
  },
  {
    src: "https://res.cloudinary.com/eqvhqx5q/image/upload/v1789427513/pe1xbnbukasxueyxsfkp.png",
    alt: "Conferences, Seminars and Expert Lectures",
  },
  {
    src: "https://res.cloudinary.com/eqvhqx5q/image/upload/v1789427516/rkpiaicfz9jc94oozcpx.png",
    alt: "Departmental Campus Life & Student Activities",
  },
  {
    src: "https://res.cloudinary.com/eqvhqx5q/image/upload/v1789427518/ebekk51czvq3uk4lrhuq.png",
    alt: "National Institute of Technology Hamirpur Academic Community",
  },
];

const DEFAULT_DEPARTMENT_SLIDES = (deptName: string, deptCode: string) => [
  {
    src: "/nithbg12.jpg",
    alt: `Department of ${deptName} - National Institute of Technology Hamirpur`,
    title: `Department of ${deptName}`,
    subtitle: `National Institute of Technology Hamirpur (HP) • ${deptCode}`,
  },
  {
    src: "/cseDepartmentPhoto.png",
    alt: "Specialized Research Centers & Laboratories",
    title: "Advanced Laboratories & Specialized Research Centers",
    subtitle: "High-Performance Computing, Multidisciplinary Labs & Cyber-Physical Systems",
  },
  {
    src: "/17059155995973.jpg",
    alt: "Technical Education Excellence",
    title: "Excellence in Technical Education & Industry Collaboration",
    subtitle: "Top NIRF Ranking, Accredited Programmes, and Outstanding Global Placements",
  },
];

export default function HomePage() {
  const { activeDepartment } = useDepartment();
  const hod = useHodMessage();
  const hasData = activeDepartment.slug === "cse";
  const isCse = activeDepartment.slug === "cse";
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [slides, setSlides] = useState<{ src: string; alt?: string; title?: string; subtitle?: string }[]>(() =>
    isCse ? TEMPCSE_HERO_SLIDES : DEFAULT_DEPARTMENT_SLIDES(activeDepartment.name, activeDepartment.code)
  );
  const [metrics, setMetrics] = useState({
    faculty: isCse ? 27 : 0,
    publications: isCse ? 113 : 0,
    students: isCse ? 621 : 0,
    highestPackage: isCse ? 1.51 : 0,
    patents: isCse ? 17 : 0,
    projects: isCse ? 8 : 0,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch dynamic department stats from backend
  useEffect(() => {
    let isCancelled = false;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

    async function loadDepartmentMetrics() {
      try {
        const res = await fetch(`${apiUrl}/aggregates/count?department_id=${encodeURIComponent(activeDepartment.id)}`);
        if (res.ok) {
          const json = await res.json();
          if (json && json.data && !isCancelled) {
            const d = json.data;
            const totalStudents =
              (d.bachelorStudent || 0) +
              (d.dualdegreeStudent || 0) +
              (d.masterStudent || 0) +
              (d.pursuingPhdScholar || 0);

            const pubCount = typeof d.publication === "number" ? d.publication : 0;
            const facCount = typeof d.faculty === "number" ? d.faculty : 0;
            const stuCount = totalStudents;
            const patentCount = typeof d.Patent === "number" ? d.Patent : 0;
            const projectCount = typeof d.Project === "number" ? d.Project : 0;

            let highestPkg = isCse ? 1.51 : 0;
            try {
              const pRes = await fetch(`${apiUrl}/placement-stats?department_id=${encodeURIComponent(activeDepartment.id)}`);
              if (pRes.ok) {
                const pJson = await pRes.json();
                if (pJson && Array.isArray(pJson.data) && pJson.data.length > 0) {
                  const maxPkg = Math.max(...pJson.data.map((p: any) => p.highest_package_lpa || 0));
                  if (maxPkg > 0) {
                    highestPkg = Number((maxPkg / 100).toFixed(2));
                  }
                }
              }
            } catch {
              // fallback
            }

            if (!isCancelled) {
              setMetrics({
                faculty: facCount,
                publications: pubCount,
                students: stuCount,
                highestPackage: highestPkg,
                patents: patentCount,
                projects: projectCount,
              });
            }
            return;
          }
        }
      } catch (err) {
        console.warn("Could not fetch KPI metrics from backend", err);
      }

      if (!isCancelled) {
        setMetrics({
          faculty: isCse ? 27 : 0,
          publications: isCse ? 113 : 0,
          students: isCse ? 621 : 0,
          highestPackage: isCse ? 1.51 : 0,
          patents: isCse ? 17 : 0,
          projects: isCse ? 8 : 0,
        });
      }
    }

    loadDepartmentMetrics();

    return () => {
      isCancelled = true;
    };
  }, [activeDepartment.id, isCse]);

  useEffect(() => {
    let isCancelled = false;
    if (isCse) {
      setSlides(TEMPCSE_HERO_SLIDES);
    } else {
      setSlides(DEFAULT_DEPARTMENT_SLIDES(activeDepartment.name, activeDepartment.code));
    }
    setActiveSlide(0);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
    const deptParam = activeDepartment.id || activeDepartment.slug || activeDepartment.code;

    fetch(`${apiUrl}/cms/home-slides?department_id=${encodeURIComponent(deptParam)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (isCancelled || !json) return;
        const data = Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : [];
        if (data.length > 0) {
          setSlides(
            data.map((item: any, idx: number) => ({
              src: item.image_url || item.photo || item.src,
              alt: item.title || `Department Slide ${idx + 1}`,
              title: item.title,
              subtitle: item.subtitle,
            }))
          );
        }
      })
      .catch(() => {});

    return () => {
      isCancelled = true;
    };
  }, [activeDepartment.id, activeDepartment.slug, activeDepartment.name, activeDepartment.code, isCse]);

  useEffect(() => {
    if (isHovered || slides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length, isHovered]);

  // Department-specific announcements
  const departmentAnnouncements = [
    {
      id: "ann-1",
      category: "Admissions",
      title: `Ph.D. Admissions Open for Autumn Session 2026-2027 in Department of ${activeDepartment.name}`,
      body: "Applications invited for full-time doctoral research fellowships across Machine Learning, Cybersecurity, Cloud Systems, and IoT.",
      publish_date: "2026-05-15",
      is_new: true,
      badgeColor: "bg-red-600",
    },
    {
      id: "ann-2",
      category: "Academics",
      title: "Schedule for Final Year Major Project Demonstrations & Capstone Reviews",
      body: "All final year B.Tech and Dual Degree student batches must submit their capstone code repositories and project reports by May 22.",
      publish_date: "2026-05-10",
      is_new: true,
      badgeColor: "bg-[#85261e]",
    },
    {
      id: "ann-3",
      category: "Conference",
      title: "ICAMS-2025: 2nd International Conference on AI & Intelligent Systems",
      body: "Organized by Department of CSE. Call for papers open for upcoming international technical tracks and IEEE proceedings.",
      publish_date: "2026-04-28",
      is_new: false,
      badgeColor: "bg-purple-600",
    },
    {
      id: "ann-4",
      category: "Workshop",
      title: "National Hands-on Workshop on Deep Learning & Edge AI Acceleration",
      body: "Five-day specialized training on PyTorch, TensorRT, and edge hardware deployment in the Department HPC laboratory.",
      publish_date: "2026-04-20",
      is_new: false,
      badgeColor: "bg-amber-600",
    },
    {
      id: "ann-5",
      category: "Seminar",
      title: "Distinguished Industry Expert Lecture on Distributed Microservice Architecture",
      body: "Keynote address by Principal Engineering Architect from Google Cloud for undergraduate and graduate scholars.",
      publish_date: "2026-04-12",
      is_new: false,
      badgeColor: "bg-sky-600",
    },
  ];

  // Department achievements
  const departmentAchievements = [
    {
      id: "ach-1",
      category: "Conference & Research",
      title: "International Conference on AI & Intelligent Systems (ICAMS 2025)",
      description: "Organized by DoCSE with 300+ international researchers and technical proceedings published in Scopus/Springer series.",
      photo_url: "https://res.cloudinary.com/eqvhqx5q/image/upload/v1789427510/fqjszlj2lscybnisrf1m.jpg",
      publish_date: "2025-06-13",
      badgeColor: "bg-[#85261e]",
    },
    {
      id: "ach-2",
      category: "Hackathon Victory",
      title: "CSE Student Team Wins 1st Prize at National Smart India Hackathon",
      description: "Undergraduate development team engineered an AI-powered automated medical triage system with offline edge sync.",
      photo_url: "https://res.cloudinary.com/eqvhqx5q/image/upload/v1789427508/taogigqizkcgpffyumzm.jpg",
      publish_date: "2025-05-20",
      badgeColor: "bg-emerald-700",
    },
    {
      id: "ach-3",
      category: "Sponsored Grant",
      title: "Faculty Investigators Secure ₹1.85 Cr MeitY Sponsored Cyber-Physical Security Grant",
      description: "Project funded to develop lightweight cryptographic primitives for resource-constrained critical infrastructure.",
      photo_url: "https://res.cloudinary.com/eqvhqx5q/image/upload/v1789427391/ltuib6npvs5heukjpzo9.png",
      publish_date: "2025-05-15",
      badgeColor: "bg-blue-700",
    },
  ];

  return (
    <div className="space-y-6 pb-16 bg-[#ffffff]">
      {/* 1. Symmetrical Department Announcement Tape */}
      <div className="bg-[#fff9f6] border-y border-[#eedfd8] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center h-10 gap-3">
          {/* Department Code & Title Badge */}
          <div className="flex items-center gap-1.5 bg-[#33110e] text-white px-3 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase flex-shrink-0 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping mr-0.5 inline-block"></span>
            <span>Announcements</span>
            <span className="bg-[#85261e] text-amber-300 text-[10px] px-1.5 py-0.2 rounded font-mono ml-1">
              {activeDepartment.code}
            </span>
          </div>

          {/* Smooth Marquee Scroller with Left/Right Fade Masks */}
          <div className="relative flex-1 overflow-hidden h-full flex items-center">
            <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#fff9f6] to-transparent z-10 pointer-events-none"></div>

            <div className="animate-marquee text-xs text-[#33110e] font-medium flex items-center gap-8 cursor-pointer">
              <Link
                href={`/news/announcements?dept=${activeDepartment.slug}`}
                className="flex items-center gap-2 hover:text-[#85261e] transition"
              >
                <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.2 rounded font-bold uppercase">
                  Admissions
                </span>
                <span>Ph.D. Admissions Open for Autumn Session 2026-2027 in Department of {activeDepartment.name}.</span>
              </Link>

              <span className="text-neutral-300">•</span>

              <Link
                href={`/news/announcements?dept=${activeDepartment.slug}`}
                className="flex items-center gap-2 hover:text-[#85261e] transition"
              >
                <span className="bg-[#85261e] text-white text-[10px] px-1.5 py-0.2 rounded font-bold uppercase">
                  Notice
                </span>
                <span>Schedule for Final Year Major Project Demonstrations &amp; Capstone Reviews.</span>
              </Link>

              <span className="text-neutral-300">•</span>

              <Link
                href={`/news/announcements?dept=${activeDepartment.slug}`}
                className="flex items-center gap-2 hover:text-[#85261e] transition"
              >
                <span className="bg-purple-600 text-white text-[10px] px-1.5 py-0.2 rounded font-bold uppercase">
                  Conference
                </span>
                <span>ICAMS-2025: 2nd International Conference on AI &amp; Intelligent Systems (Call for Papers).</span>
              </Link>

              <span className="text-neutral-300">•</span>

              <Link
                href={`/news/achievements?dept=${activeDepartment.slug}`}
                className="flex items-center gap-2 hover:text-[#85261e] transition"
              >
                <span className="bg-amber-600 text-white text-[10px] px-1.5 py-0.2 rounded font-bold uppercase">
                  Accolade
                </span>
                <span>{activeDepartment.code} Student Team Wins 1st Prize at National Innovation Hackathon!</span>
              </Link>
            </div>

            <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#fff9f6] to-transparent z-10 pointer-events-none"></div>
          </div>

          {/* Right Action Button for Symmetry */}
          <div className="flex-shrink-0 border-l border-[#eedfd8] pl-3 hidden sm:flex items-center">
            <Link
              href={`/news/announcements?dept=${activeDepartment.slug}`}
              className="text-[11px] font-bold text-[#85261e] hover:text-[#33110e] transition flex items-center gap-1"
            >
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {!hasData ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
          <DepartmentEmptyState sectionTitle={`Department of ${activeDepartment.name} Portal`} />
        </div>
      ) : (
        <>
          {/* 2. Signature 3-Column Hero Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              
              {/* Left Column: Department News & Updates Box */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-[#eedfd8] shadow-xs flex flex-col overflow-hidden h-[430px]">
                <div className="bg-[#33110e] text-white p-3 text-center font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>{activeDepartment.code} News &amp; Updates</span>
                </div>
                
                <div className="p-3 divide-y divide-[#eedfd8]/60 overflow-y-auto no-scrollbar flex-1 space-y-2.5">
                  {departmentAnnouncements.map((ann) => (
                    <div key={ann.id} className="pt-2 first:pt-0">
                      <div className="flex items-center justify-between text-[10px] text-[#85261e] font-semibold mb-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#85261e]" />
                          <span>{ann.publish_date}</span>
                        </span>
                        <span className={`${ann.badgeColor} text-white text-[9px] px-1.5 py-0.2 rounded font-bold uppercase`}>
                          {ann.category}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-[#1c110c] line-clamp-2 hover:text-[#85261e] cursor-pointer leading-snug">
                        {ann.title}
                      </h4>
                      <p className="text-[11px] text-neutral-600 line-clamp-2 mt-1 leading-relaxed">
                        {ann.body}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 bg-[#fff9f6] border-t border-[#eedfd8] text-center">
                  <Link
                    href={`/news/announcements?dept=${activeDepartment.slug}`}
                    className="text-[11px] text-[#33110e] font-bold hover:underline flex items-center justify-center gap-1"
                  >
                    View All Notices &amp; Circulars <ChevronRight className="w-3 h-3 text-[#85261e]" />
                  </Link>
                </div>
              </div>

              {/* Center Column: Department Hero Carousel */}
              <div
                className="lg:col-span-6 rounded-xl overflow-hidden border border-[#eedfd8] relative shadow-xs h-[430px] bg-[#f6f0ea] group select-none"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {slides.map((slide, idx) => (
                  <div
                    key={slide.src + idx}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      idx === activeSlide ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={slide.src}
                      alt={slide.alt || `Carousel Banner ${idx + 1}`}
                      className="w-full h-full object-cover object-center"
                      loading={idx === 0 ? "eager" : "lazy"}
                    />
                    {slide.title && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
                        <span className="bg-[#85261e] text-white text-[10px] uppercase font-bold px-2.5 py-0.5 rounded w-fit mb-2 tracking-wider shadow-xs">
                          Department of {activeDepartment.name}
                        </span>
                        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-tight mb-1.5 text-white drop-shadow-xs">
                          {slide.title}
                        </h2>
                        {slide.subtitle && (
                          <p className="text-xs sm:text-sm text-neutral-200 line-clamp-2 leading-relaxed max-w-xl">
                            {slide.subtitle}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* Previous Slide Arrow Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/45 hover:bg-[#85261e] text-white flex items-center justify-center backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-md"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Next Slide Arrow Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSlide((prev) => (prev + 1) % slides.length);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/45 hover:bg-[#85261e] text-white flex items-center justify-center backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-md"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Slide Counter Badge */}
                <div className="absolute top-3.5 right-3.5 z-20 bg-black/60 backdrop-blur-xs text-white text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full shadow-sm border border-white/20">
                  {activeSlide + 1} / {slides.length}
                </div>

                {/* Carousel Indicators */}
                <div className="absolute bottom-3 inset-x-0 z-20 flex justify-center items-center gap-1.5 px-4">
                  <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-3 py-1 rounded-full border border-white/10 shadow-xs">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveSlide(i)}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          i === activeSlide ? "bg-amber-400 w-5" : "bg-white/50 w-1.5 hover:bg-white"
                        }`}
                        aria-label={`Slide ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Research Highlights Box */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-[#eedfd8] shadow-xs flex flex-col overflow-hidden h-[430px]">
                <div className="bg-[#33110e] text-white p-3 text-center font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Research Highlights</span>
                </div>

                <div className="p-4 space-y-3.5 overflow-y-auto no-scrollbar flex-1 bg-[#fff9f6]/40">
                  <div className="bg-white p-3 rounded-lg border border-[#eedfd8] shadow-2xs hover:border-[#85261e]/40 transition">
                    <div className="flex items-center gap-2 text-[#85261e] font-extrabold text-xs mb-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{metrics.publications > 0 ? `${metrics.publications}+` : "0"} Publications</span>
                    </div>
                    <p className="text-[11px] text-neutral-600 leading-relaxed">
                      Peer-reviewed journal articles in IEEE Transactions, ACM, Elsevier, and top CORE A/A* international conferences.
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-[#eedfd8] shadow-2xs hover:border-[#85261e]/40 transition">
                    <div className="flex items-center gap-2 text-[#85261e] font-extrabold text-xs mb-1">
                      <Lightbulb className="w-4 h-4" />
                      <span>{metrics.patents > 0 ? `${metrics.patents}+` : "17+"} Patents Filed &amp; Granted</span>
                    </div>
                    <p className="text-[11px] text-neutral-600 leading-relaxed">
                      Intellectual property spanning edge computing, cyber-physical security, neural systems, and intelligent sensing.
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-[#eedfd8] shadow-2xs hover:border-[#85261e]/40 transition">
                    <div className="flex items-center gap-2 text-[#85261e] font-extrabold text-xs mb-1">
                      <Award className="w-4 h-4" />
                      <span>₹3.85+ Cr R&amp;D Grants</span>
                    </div>
                    <p className="text-[11px] text-neutral-600 leading-relaxed">
                      Active research grants sanctioned by MeitY, DST-SERB, DRDO, and state environmental infrastructure agencies.
                    </p>
                  </div>
                </div>

                <div className="p-2.5 bg-[#fff9f6] border-t border-[#eedfd8] text-center">
                  <Link
                    href={`/research/publications?dept=${activeDepartment.slug}`}
                    className="text-[11px] text-[#33110e] font-bold hover:underline flex items-center justify-center gap-1"
                  >
                    Explore Research Catalogue <ChevronRight className="w-3 h-3 text-[#85261e]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Department Analytics & Metric Numbers Strip */}
          <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-2">
            <div className="bg-[#1c110c] text-white rounded-xl p-6 shadow-md border border-[#33110e]">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-neutral-800">
                <div className="pt-3 md:pt-0">
                  <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono tracking-tight">
                    {isClient ? (
                      <CountUp
                        key={`fac-${activeDepartment.id}-${metrics.faculty}`}
                        start={0}
                        end={metrics.faculty}
                        duration={2}
                        enableScrollSpy={true}
                        scrollSpyOnce={false}
                      />
                    ) : (
                      metrics.faculty
                    )}
                  </div>
                  <p className="text-xs text-neutral-300 uppercase tracking-wider font-bold mt-1">
                    Faculty Members
                  </p>
                  <span className="text-[11px] text-neutral-400 font-medium">Distinguished Professors &amp; Scholars</span>
                </div>

                <div className="pt-3 md:pt-0">
                  <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono tracking-tight">
                    {isClient ? (
                      <>
                        <CountUp
                          key={`pub-${activeDepartment.id}-${metrics.publications}`}
                          start={0}
                          end={metrics.publications}
                          duration={2.2}
                          enableScrollSpy={true}
                          scrollSpyOnce={false}
                        />
                        {metrics.publications > 0 && "+"}
                      </>
                    ) : (
                      `${metrics.publications}${metrics.publications > 0 ? "+" : ""}`
                    )}
                  </div>
                  <p className="text-xs text-neutral-300 uppercase tracking-wider font-bold mt-1">
                    Publications
                  </p>
                  <span className="text-[11px] text-neutral-400 font-medium">Scopus / SCI Indexed Papers</span>
                </div>

                <div className="pt-3 md:pt-0">
                  <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono tracking-tight">
                    {isClient ? (
                      <>
                        <CountUp
                          key={`stu-${activeDepartment.id}-${metrics.students}`}
                          start={0}
                          end={metrics.students}
                          duration={2.4}
                          enableScrollSpy={true}
                          scrollSpyOnce={false}
                        />
                        {metrics.students > 0 && "+"}
                      </>
                    ) : (
                      `${metrics.students}${metrics.students > 0 ? "+" : ""}`
                    )}
                  </div>
                  <p className="text-xs text-neutral-300 uppercase tracking-wider font-bold mt-1">
                    Enrolled Students
                  </p>
                  <span className="text-[11px] text-neutral-400 font-medium">B.Tech, Dual Degree &amp; Ph.D.</span>
                </div>

                <div className="pt-3 md:pt-0">
                  <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono tracking-tight">
                    {isClient ? (
                      metrics.highestPackage > 0 ? (
                        <>
                          ₹
                          <CountUp
                            key={`pkg-${activeDepartment.id}-${metrics.highestPackage}`}
                            start={0}
                            end={metrics.highestPackage}
                            decimals={2}
                            duration={2.5}
                            enableScrollSpy={true}
                            scrollSpyOnce={false}
                          />
                          {" "}Cr
                        </>
                      ) : (
                        "—"
                      )
                    ) : (
                      metrics.highestPackage > 0 ? `₹${metrics.highestPackage} Cr` : "—"
                    )}
                  </div>
                  <p className="text-xs text-neutral-300 uppercase tracking-wider font-bold mt-1">
                    Highest Package
                  </p>
                  <span className="text-[11px] text-neutral-400 font-medium">100% Core Placement Record</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. About Department & HOD Welcome Message Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-2">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Department Overview (8 Columns) */}
              <div className="lg:col-span-8 bg-white rounded-xl border border-[#eedfd8] p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#eedfd8] pb-3.5 gap-2">
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-5 h-5 text-[#85261e]" />
                    <h3 className="text-lg font-bold text-[#33110e] tracking-tight uppercase">
                      Welcome to Department of {activeDepartment.name}
                    </h3>
                  </div>
                  <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2.5 py-0.5 rounded uppercase self-start sm:self-auto">
                    {activeDepartment.code}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                  {activeDepartment.about}
                </p>

                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                  The Department offers rigorous, industry-aligned curricula spanning undergraduate (B.Tech), postgraduate (M.Tech), Dual Degree, and Doctoral (Ph.D.) programmes. Our laboratories and computing centers provide students with extensive hands-on experience in cloud architectures, algorithms, robotics, cybersecurity, and deep learning.
                </p>

                {/* Key Pillars Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  <div className="p-3.5 bg-[#fff9f6] rounded-lg border border-[#eedfd8] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#33110e] text-amber-300 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#33110e]">Academic Programmes</h4>
                      <p className="text-[11px] text-neutral-600">B.Tech, Dual Degree, M.Tech &amp; Ph.D.</p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#fff9f6] rounded-lg border border-[#eedfd8] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#33110e] text-amber-300 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#33110e]">Faculty Mentorship</h4>
                      <p className="text-[11px] text-neutral-600">Renowned Professors &amp; Active Researchers</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    href={`/aboutus?dept=${activeDepartment.slug}`}
                    className="inline-flex items-center gap-1.5 bg-[#33110e] hover:bg-[#85261e] text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    <span>Read Department Profile</span>
                    <ChevronRight className="w-3.5 h-3.5 text-amber-300" />
                  </Link>

                  <Link
                    href={`/aboutus/labs?dept=${activeDepartment.slug}`}
                    className="inline-flex items-center gap-1.5 border border-[#eedfd8] bg-white hover:bg-[#fff9f6] text-[#33110e] px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    <span>Explore Laboratories</span>
                  </Link>
                </div>
              </div>

              {/* Head of Department (HOD) Message Card (4 Columns) */}
              <div className="lg:col-span-4 bg-[#fff9f6] rounded-xl border border-[#eedfd8] p-6 shadow-xs space-y-4 text-center">
                <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden border-3 border-[#85261e] shadow-sm bg-neutral-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={hod.imageUrl}
                    alt={`${hod.name}, Head of Department`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/hod.jpg";
                    }}
                  />
                </div>

                <div>
                  <h4 className="font-extrabold text-base text-[#33110e]">
                    {hod.name}
                  </h4>
                  <p className="text-xs text-[#85261e] font-bold mt-0.5">
                    {hod.designation}
                  </p>
                  <p className="text-[11px] text-neutral-500 font-medium mt-0.5">
                    {hod.department}
                  </p>
                </div>

                <div className="border-t border-[#eedfd8] pt-3 text-xs text-neutral-700 italic leading-relaxed text-justify px-1 line-clamp-4">
                  &ldquo;{hod.message}&rdquo;
                </div>

                <div className="pt-1">
                  <Link
                    href={`/aboutus/hod?dept=${activeDepartment.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#85261e] hover:text-[#33110e] hover:underline"
                  >
                    <span>Read Full HOD Message</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Department Academic Programmes Grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-2">
            <div className="border-b border-[#eedfd8] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-[#33110e] uppercase tracking-tight flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#85261e]" />
                  Academic Programmes Offered
                </h3>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Degree programmes conducted by the Department of {activeDepartment.name}
                </p>
              </div>

              <Link
                href={`/academics/programsoffered?dept=${activeDepartment.slug}`}
                className="text-xs font-bold text-[#85261e] hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                <span>View Full Curriculum &amp; Syllabi</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              <div className="bg-white border border-[#eedfd8] rounded-xl p-4 shadow-2xs hover:border-[#85261e] hover:shadow-xs transition space-y-2">
                <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Undergraduate • 4 Years
                </span>
                <h4 className="text-sm font-extrabold text-[#1c110c]">B.Tech in {activeDepartment.code}</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Comprehensive grounding in algorithms, system architecture, cloud networks, and software engineering.
                </p>
                <div className="pt-2 text-[11px] font-semibold text-[#85261e]">
                  Intake: 120 Seats • JEE (Main)
                </div>
              </div>

              <div className="bg-white border border-[#eedfd8] rounded-xl p-4 shadow-2xs hover:border-[#85261e] hover:shadow-xs transition space-y-2">
                <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Integrated • 5 Years
                </span>
                <h4 className="text-sm font-extrabold text-[#1c110c]">Dual Degree (B.Tech + M.Tech)</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Integrated advanced curriculum focusing on accelerated research, specialization thesis, and industry internships.
                </p>
                <div className="pt-2 text-[11px] font-semibold text-[#85261e]">
                  Intake: 60 Seats • JEE (Main)
                </div>
              </div>

              <div className="bg-white border border-[#eedfd8] rounded-xl p-4 shadow-2xs hover:border-[#85261e] hover:shadow-xs transition space-y-2">
                <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Postgraduate • 2 Years
                </span>
                <h4 className="text-sm font-extrabold text-[#1c110c]">M.Tech in AI &amp; Computing</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Advanced specialized study in Deep Learning, Computer Vision, High Performance Computing, and Autonomous Systems.
                </p>
                <div className="pt-2 text-[11px] font-semibold text-[#85261e]">
                  Intake: 30 Seats • GATE / CCMT
                </div>
              </div>

              <div className="bg-white border border-[#eedfd8] rounded-xl p-4 shadow-2xs hover:border-[#85261e] hover:shadow-xs transition space-y-2">
                <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Doctoral • 3-5 Years
                </span>
                <h4 className="text-sm font-extrabold text-[#1c110c]">Doctor of Philosophy (Ph.D.)</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Cutting-edge doctoral research with full-time institutional fellowships across frontier theoretical and applied domains.
                </p>
                <div className="pt-2 text-[11px] font-semibold text-[#85261e]">
                  Full-Time Fellowships Available
                </div>
              </div>
            </div>
          </div>

          {/* 6. Recent Departmental Achievements & Innovations */}
          <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-2">
            <div className="border-b border-[#eedfd8] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-[#33110e] uppercase tracking-tight flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[#85261e]" />
                  Departmental Achievements &amp; Accolades
                </h3>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Recent milestones, sponsored grants, and student accolades from Department of {activeDepartment.name}
                </p>
              </div>

              <Link
                href={`/news/achievements?dept=${activeDepartment.slug}`}
                className="text-xs font-bold text-[#85261e] hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                <span>View All Achievements</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
              {departmentAchievements.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-[#eedfd8] overflow-hidden shadow-2xs hover:border-[#85261e]/40 hover:shadow-xs transition flex flex-col"
                >
                  <div className="relative h-44 w-full bg-neutral-100 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.photo_url}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                    <span className={`absolute top-2.5 left-2.5 ${item.badgeColor} text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase shadow-xs`}>
                      {item.category}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center gap-1 text-[11px] text-neutral-500 mb-1">
                        <Calendar className="w-3 h-3 text-[#85261e]" />
                        <span>{item.publish_date}</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#1c110c] line-clamp-2 leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-neutral-600 line-clamp-2 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#eedfd8]/60">
                      <Link
                        href={`/news/achievements?dept=${activeDepartment.slug}`}
                        className="text-xs font-bold text-[#85261e] hover:underline inline-flex items-center gap-1"
                      >
                        Read Full Story <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
