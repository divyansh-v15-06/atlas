"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  MOCK_FACULTY,
  MOCK_PUBLICATIONS,
  MOCK_PATENTS,
  MOCK_PROJECTS,
  MOCK_STUDENTS,
} from "@/lib/mock-data";
import {
  Award,
  BookOpen,
  Calendar,
  ChevronRight,
  Lightbulb,
  Trophy,
} from "lucide-react";
import { useDepartment } from "@/context/department-context";

// Collective news & announcements across all departments
const ALL_DEPT_ANNOUNCEMENTS = [
  {
    id: "ann-all-1",
    deptCode: "CSE",
    deptSlug: "cse",
    category: "Conference",
    title: "ICAMS-2025: 2nd International Conference on Artificial Intelligence, Machine Learning & Intelligent Systems",
    body: "Call for papers and registrations open for upcoming international technical tracks and keynotes.",
    publish_date: "2026-05-12",
    is_new: true,
  },
  {
    id: "ann-all-2",
    deptCode: "ECE",
    deptSlug: "ece",
    category: "Symposium",
    title: "IEEE International Symposium on Next-Generation VLSI & 6G Wireless Communications",
    body: "Join distinguished IEEE fellows and industry leaders for frontier discussions in RF & semiconductor engineering.",
    publish_date: "2026-05-08",
    is_new: true,
  },
  {
    id: "ann-all-3",
    deptCode: "ME",
    deptSlug: "me",
    category: "Workshop",
    title: "National Hands-on Workshop on Advanced Additive Manufacturing & Industrial Robotics",
    body: "Five-day intensive training on CNC 5-axis machining, polymer 3D sintering, and robotic automation.",
    publish_date: "2026-04-28",
    is_new: false,
  },
  {
    id: "ann-all-4",
    deptCode: "EE",
    deptSlug: "ee",
    category: "STC",
    title: "Short Term Course on Smart Grid Integration & High Voltage Power Electronics",
    body: "Sponsored by Ministry of Power, focusing on renewable microgrids, EV charging, and converter stability.",
    publish_date: "2026-04-20",
    is_new: false,
  },
  {
    id: "ann-all-5",
    deptCode: "CE",
    deptSlug: "ce",
    category: "Symposium",
    title: "National Conclave on Climate-Resilient Hill Infrastructure & Geotechnical Hazards",
    body: "Experts from IITs, NITs, and NDMA gather to devise landslides and seismic hazard mitigation frameworks.",
    publish_date: "2026-04-14",
    is_new: false,
  },
  {
    id: "ann-all-6",
    deptCode: "INSTITUTE",
    deptSlug: "cse",
    category: "Admissions",
    title: "Ph.D. Admissions Open for Autumn Session 2026-2027 Across All Engineering & Science Departments",
    body: "Applications invited for full-time institutional fellowships across all 11+ academic departments.",
    publish_date: "2026-04-10",
    is_new: true,
  },
];

// Collective departmental achievements across the institute
const ALL_DEPT_ACHIEVEMENTS = [
  {
    id: "ach-1",
    deptCode: "CSE",
    deptSlug: "cse",
    category: "Conference & R&D",
    title: "International Conference on AI & Intelligent Systems (ICAMS 2025)",
    description: "Organized by DoCSE with 300+ international researchers and technical proceedings published in Scopus/Springer series.",
    photo_url: "https://res.cloudinary.com/dvnrlqqpq/image/upload/v1749015564/clbtxoenukldqigdws1e.jpg",
    publish_date: "2025-06-13",
    badgeColor: "bg-red-600",
  },
  {
    id: "ach-2",
    deptCode: "ECE",
    deptSlug: "ece",
    category: "Student Accolade",
    title: "Autonomous Aerial Drone Team Wins 1st Prize at National Innovation Conclave",
    description: "Multi-disciplinary robotics team engineered an edge-AI disaster rescue drone with terrain LiDAR mapping.",
    photo_url: "https://res.cloudinary.com/dvnrlqqpq/image/upload/v1749014936/rgsiauf7yh1sy8aer5yo.jpg",
    publish_date: "2025-05-20",
    badgeColor: "bg-blue-600",
  },
  {
    id: "ach-3",
    deptCode: "ME",
    deptSlug: "me",
    category: "Research Grant",
    title: "Mechanical Engineering Department Secures ₹1.45 Cr DST-SERB Sponsored Grant",
    description: "Funded for research on high-entropy alloy thermal barrier coatings and cryogenic propellant simulations.",
    photo_url: "https://res.cloudinary.com/dha8atrgz/image/upload/v1725899222/Screenshot_from_2024-09-09_21-56-30_cy3pch.png",
    publish_date: "2025-05-15",
    badgeColor: "bg-amber-600",
  },
  {
    id: "ach-4",
    deptCode: "EE",
    deptSlug: "ee",
    category: "Patent Granted",
    title: "Faculty Granted International Patent on Smart Microgrid Power Controllers",
    description: "Inventors developed a high-efficiency bidirectional DC-AC power converter system for distributed solar grids.",
    photo_url: "https://res.cloudinary.com/dha8atrgz/image/upload/v1725899321/Screenshot_from_2024-09-09_21-58-05_qsx0pt.png",
    publish_date: "2025-04-30",
    badgeColor: "bg-emerald-600",
  },
];

export default function HomePage() {
  const { activeDepartment, setActiveDepartment } = useDepartment();
  const [activeSlide, setActiveSlide] = useState(0);

  const heroSlides = [
    {
      src: "/nithbg12.jpg",
      title: "National Institute of Technology Hamirpur",
      subtitle: "Premier Institute of National Importance • Fostering Engineering & Scientific Innovation Across 11+ Departments",
    },
    {
      src: "/cseDepartmentPhoto.png",
      title: "Advanced Research Laboratories & Multidisciplinary Centers",
      subtitle: "State-of-the-Art Computing, Robotics, VLSI, Smart Grid & Advanced Materials Research Facilities",
    },
    {
      src: "/17059155995973.jpg",
      title: "Excellence in Technical Education, Industry R&D & Global Placements",
      subtitle: "Top NIRF Ranking, NBA Accreditations, ₹1.73 Cr Highest CTC, and Prestigious Research Grants",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <div className="space-y-6 pb-16 bg-[#ffffff]">
      {/* 1. Symmetrical Top Announcement Marquee Bar (All Departments) */}
      <div className="bg-[#fff9f6] border-y border-[#eedfd8] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center h-10 gap-3">
          {/* Symmetrical Left Badge */}
          <div className="flex items-center gap-1.5 bg-[#33110e] text-white px-3 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase flex-shrink-0 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping mr-0.5 inline-block"></span>
            <span>Institute Updates</span>
            <span className="bg-[#85261e] text-amber-300 text-[10px] px-1.5 py-0.2 rounded font-mono ml-1">
              ALL DEPTS
            </span>
          </div>

          {/* Smooth Marquee Scroller with Left/Right Fade Masks */}
          <div className="relative flex-1 overflow-hidden h-full flex items-center">
            {/* Left fade gradient mask */}
            <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#fff9f6] to-transparent z-10 pointer-events-none"></div>

            {/* Marquee Content */}
            <div className="animate-marquee text-xs text-[#33110e] font-medium flex items-center gap-10 cursor-pointer">
              {[...ALL_DEPT_ANNOUNCEMENTS, ...ALL_DEPT_ANNOUNCEMENTS].map((item, idx) => (
                <Link
                  key={`${item.id}-${idx}`}
                  href={`/news/announcements?dept=${item.deptSlug}`}
                  className="inline-flex items-center gap-2 hover:text-[#85261e] transition whitespace-nowrap shrink-0"
                >
                  <span className="bg-[#85261e] text-white text-[10px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0">
                    [{item.deptCode}]
                  </span>
                  <span className="whitespace-nowrap">{item.title}</span>
                  <span className="text-neutral-400 ml-4 shrink-0">•</span>
                </Link>
              ))}
            </div>

            {/* Right fade gradient mask */}
            <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#fff9f6] to-transparent z-10 pointer-events-none"></div>
          </div>

          {/* Right Action Button for Symmetry */}
          <div className="flex-shrink-0 border-l border-[#eedfd8] pl-3 hidden sm:flex items-center">
            <Link
              href="/news/announcements"
              className="text-[11px] font-bold text-[#85261e] hover:text-[#33110e] transition flex items-center gap-1"
            >
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Hero 3-Column Section (Signature tempcse Layout - Collective View) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left Column: News & Updates Box (All Departments) */}
          <div className="lg:col-span-3 bg-white rounded-lg border border-[#eedfd8] shadow-sm flex flex-col overflow-hidden h-[430px]">
            <div className="bg-[#33110e] text-white p-3 text-center font-bold text-xs uppercase tracking-wider flex items-center justify-between px-4">
              <span>News &amp; Updates</span>
              <span className="text-[10px] bg-[#85261e] px-1.5 py-0.5 rounded text-amber-300 font-mono">
                All Departments
              </span>
            </div>
            <div className="p-3 divide-y divide-neutral-100 overflow-y-auto no-scrollbar flex-1 space-y-2.5">
              {ALL_DEPT_ANNOUNCEMENTS.map((ann) => (
                <div key={ann.id} className="pt-2 first:pt-0">
                  <div className="flex items-center gap-1.5 text-[10px] text-[#85261e] font-semibold mb-1">
                    <span className="bg-[#fff9f6] border border-[#eedfd8] text-[#85261e] text-[9px] font-bold px-1.5 py-0.2 rounded font-mono">
                      {ann.deptCode}
                    </span>
                    <Calendar className="w-3 h-3 ml-0.5 text-neutral-400" />
                    <span className="text-neutral-500">{ann.publish_date}</span>
                    {ann.is_new && (
                      <span className="bg-red-600 text-white text-[9px] px-1 rounded font-bold ml-auto">
                        NEW
                      </span>
                    )}
                  </div>
                  <Link href={`/news/announcements?dept=${ann.deptSlug}`}>
                    <h4 className="text-xs font-semibold text-neutral-800 line-clamp-2 hover:text-[#85261e] cursor-pointer transition">
                      {ann.title}
                    </h4>
                  </Link>
                  <p className="text-[11px] text-neutral-500 line-clamp-2 mt-1">
                    {ann.body}
                  </p>
                </div>
              ))}
            </div>
            <div className="p-2.5 bg-[#fff9f6] border-t border-[#eedfd8] text-center">
              <Link
                href="/news/announcements"
                className="text-[11px] text-[#33110e] font-bold hover:text-[#85261e] transition flex items-center justify-center gap-1"
              >
                View All Announcements <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Center Column: Hero Carousel */}
          <div className="lg:col-span-6 rounded-lg overflow-hidden border border-[#eedfd8] relative shadow-sm h-[430px] bg-neutral-900 group">
            {heroSlides.map((slide, idx) => (
              <div
                key={slide.src}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  idx === activeSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <Image
                  src={slide.src}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={idx === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="bg-[#85261e] text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded w-fit mb-2">
                    NIT Hamirpur • Academic &amp; Research Excellence
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight mb-1.5">
                    {slide.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-200 line-clamp-2">
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            ))}

            {/* Carousel Indicators */}
            <div className="absolute bottom-3 right-4 z-20 flex gap-1.5">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === activeSlide ? "bg-white w-6" : "bg-white/50"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Research Highlights Box (All Departments) */}
          <div className="lg:col-span-3 bg-white rounded-lg border border-[#eedfd8] shadow-sm flex flex-col overflow-hidden h-[430px]">
            <div className="bg-[#33110e] text-white p-3 text-center font-bold text-xs uppercase tracking-wider flex items-center justify-between px-4">
              <span>Research Highlights</span>
              <span className="text-[10px] bg-[#85261e] px-1.5 py-0.5 rounded text-amber-300 font-mono">
                Institute Total
              </span>
            </div>
            <div className="p-3.5 space-y-3.5 overflow-y-auto no-scrollbar flex-1 bg-[#fff9f6]/40">
              <div className="bg-white p-3 rounded border border-[#eedfd8] shadow-xs hover:border-[#85261e]/40 transition">
                <div className="flex items-center gap-2 text-[#85261e] font-bold text-xs mb-1">
                  <BookOpen className="w-4 h-4 text-[#85261e]" />
                  <span>2,400+ Total Publications</span>
                </div>
                <p className="text-[11px] text-neutral-600 leading-snug">
                  High-impact research across IEEE, Elsevier, Springer &amp; Nature indexed venues by faculty across all 11+ departments.
                </p>
              </div>

              <div className="bg-white p-3 rounded border border-[#eedfd8] shadow-xs hover:border-[#85261e]/40 transition">
                <div className="flex items-center gap-2 text-[#85261e] font-bold text-xs mb-1">
                  <Lightbulb className="w-4 h-4 text-[#85261e]" />
                  <span>85+ Patents Filed &amp; Granted</span>
                </div>
                <p className="text-[11px] text-neutral-600 leading-snug">
                  Intellectual property spanning AI systems, smart microgrids, materials, sensors, robotics, and clean energy.
                </p>
              </div>

              <div className="bg-white p-3 rounded border border-[#eedfd8] shadow-xs hover:border-[#85261e]/40 transition">
                <div className="flex items-center gap-2 text-[#85261e] font-bold text-xs mb-1">
                  <Award className="w-4 h-4 text-[#85261e]" />
                  <span>₹28.5+ Cr Sponsored R&amp;D Grants</span>
                </div>
                <p className="text-[11px] text-neutral-600 leading-snug">
                  Active research grants and corporate projects funded by DST-SERB, MeitY, ISRO, DRDO, and Ministry of Power.
                </p>
              </div>
            </div>
            <div className="p-2.5 bg-[#fff9f6] border-t border-[#eedfd8] text-center">
              <Link
                href="/research/publications"
                className="text-[11px] text-[#33110e] font-bold hover:text-[#85261e] transition flex items-center justify-center gap-1"
              >
                Browse Research Output <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Stats Counters (Analytics Row - Showing Total Aggregate Institute Data) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-2">
        <div className="bg-[#1c110c] text-white rounded-lg p-6 shadow-md border border-[#33110e]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-neutral-800">
            <div className="pt-3 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">
                250+
              </div>
              <p className="text-xs text-neutral-300 uppercase tracking-wider font-semibold mt-1">
                Faculty Members (11+ Depts)
              </p>
            </div>
            <div className="pt-3 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">
                2,400+
              </div>
              <p className="text-xs text-neutral-300 uppercase tracking-wider font-semibold mt-1">
                Total Publications
              </p>
            </div>
            <div className="pt-3 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">
                4,500+
              </div>
              <p className="text-xs text-neutral-300 uppercase tracking-wider font-semibold mt-1">
                Enrolled UG, PG &amp; Ph.D. Students
              </p>
            </div>
            <div className="pt-3 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">
                100%
              </div>
              <p className="text-xs text-neutral-300 uppercase tracking-wider font-semibold mt-1">
                Placement Support &amp; Network
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. NEW ROW OF ACHIEVEMENTS (Recent Achievements across all departments) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-4">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#eedfd8] pb-3 gap-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#85261e]" />
              <h3 className="text-lg font-bold text-[#33110e] tracking-tight uppercase">
                Recent Departmental &amp; Institute Achievements
              </h3>
            </div>
            <Link
              href="/news/achievements"
              className="text-xs font-bold text-[#85261e] hover:text-[#33110e] transition flex items-center gap-1"
            >
              <span>View All Achievements</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ALL_DEPT_ACHIEVEMENTS.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#eedfd8] rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-[#85261e]/40 transition flex flex-col justify-between group"
              >
                <div>
                  {item.photo_url && (
                    <div className="relative w-full h-36 bg-neutral-100 overflow-hidden border-b border-[#eedfd8]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.photo_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                      <span className="absolute top-2 left-2 bg-[#33110e] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase font-mono">
                        {item.deptCode}
                      </span>
                    </div>
                  )}

                  <div className="p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-neutral-500">
                      <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                        {item.category}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-mono">
                        <Calendar className="w-3 h-3 text-[#85261e]" />
                        {item.publish_date}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-[#1c110c] group-hover:text-[#85261e] transition line-clamp-2 leading-snug">
                      {item.title}
                    </h4>

                    <p className="text-[11px] text-neutral-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-[#fff9f6] border-t border-[#eedfd8] text-right">
                  <Link
                    href={`/news/achievements?dept=${item.deptSlug}`}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#85261e] hover:text-[#33110e] transition"
                  >
                    <span>Read Details</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
