"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Lock,
  UserCheck,
  ExternalLink,
  Building2,
  Check,
  Search,
  Layers,
  Sparkles,
} from "lucide-react";
import { useDepartment } from "@/context/department-context";
import { NavigationProgressBar } from "@/components/common/navigation-progress";

export function PublicHeader() {
  const pathname = usePathname();
  const isHomePage = pathname === "/" || pathname === "";
  const { departments, activeDepartment, setActiveDepartment } = useDepartment();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [deptModalOpen, setDeptModalOpen] = useState(false);
  const [deptSearch, setDeptSearch] = useState("");
  const deptDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (deptDropdownRef.current && !deptDropdownRef.current.contains(event.target as Node)) {
        setDeptModalOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredDepts = departments.filter(
    (d) =>
      d.name.toLowerCase().includes(deptSearch.toLowerCase()) ||
      d.code.toLowerCase().includes(deptSearch.toLowerCase())
  );

  const navItems = [
    {
      label: "Home",
      href: `/?dept=${activeDepartment.slug}`,
    },
    {
      label: "About Us",
      href: `/aboutus?dept=${activeDepartment.slug}`,
      children: [
        { label: "Department Overview", href: `/aboutus?dept=${activeDepartment.slug}` },
        { label: "HOD Message", href: `/aboutus/hod?dept=${activeDepartment.slug}` },
        { label: "Labs & Facilities", href: `/aboutus/labs?dept=${activeDepartment.slug}` },
        { label: "FAQ", href: `/aboutus/faq?dept=${activeDepartment.slug}` },
      ],
    },
    {
      label: "Academics",
      href: `/academics?dept=${activeDepartment.slug}`,
      children: [
        { label: "Programmes Offered", href: `/academics/programsoffered?dept=${activeDepartment.slug}` },
        { label: "Courses", href: `/academics/courses?dept=${activeDepartment.slug}` },
        { label: "Syllabus", href: `/academics/syllabus?dept=${activeDepartment.slug}` },
        { label: "Academic Calendar", href: `/academics/calendar?dept=${activeDepartment.slug}` },
      ],
    },
    {
      label: "People",
      href: `/people/faculty?dept=${activeDepartment.slug}`,
      children: [
        { label: "Faculty Members", href: `/people/faculty?dept=${activeDepartment.slug}` },
        { label: "Staff Members", href: `/people/staff?dept=${activeDepartment.slug}` },
        { label: "Students Roster", href: `/people/students?dept=${activeDepartment.slug}` },
        { label: "PhD Scholars", href: `/people/phdscholars?dept=${activeDepartment.slug}` },
      ],
    },
    {
      label: "Research",
      href: `/research/publications?dept=${activeDepartment.slug}`,
      children: [
        { label: "Publications", href: `/research/publications?dept=${activeDepartment.slug}` },
        { label: "Patents", href: `/research/patents?dept=${activeDepartment.slug}` },
        { label: "R&D Projects", href: `/research/projects?dept=${activeDepartment.slug}` },
        { label: "Consultancy", href: `/research/consultancy?dept=${activeDepartment.slug}` },
        { label: "Events & Workshops", href: `/research/events?dept=${activeDepartment.slug}` },
      ],
    },
    {
      label: "News & Events",
      href: `/news/announcements?dept=${activeDepartment.slug}`,
      children: [
        { label: "Announcements", href: `/news/announcements?dept=${activeDepartment.slug}` },
        { label: "Achievements", href: `/news/achievements?dept=${activeDepartment.slug}` },
      ],
    },
    {
      label: "Placements",
      href: `/placementpage?dept=${activeDepartment.slug}`,
    },
  ];

  return (
    <>
      {/* 1. Top Utility Notification Bar (#33110e) */}
      <div className="bg-[#33110e] text-white text-xs py-1.5 px-4 sm:px-8 font-sans border-b border-[#4a1814]">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2 text-[11px]">
          <div className="flex items-center space-x-3 text-neutral-300">
            <span className="text-amber-400 font-semibold hidden sm:inline">
              National Institute of Technology Hamirpur
            </span>
            <span className="text-neutral-500 hidden sm:inline">|</span>
            <a
              href="https://portfolios.nith.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition flex items-center gap-1"
            >
              Faculty Portfolio <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>
            <span className="text-neutral-500 hidden md:inline">|</span>
            <a
              href="https://nith.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition hidden md:inline"
            >
              NITH Main Portal
            </a>
          </div>

          <div className="flex items-center space-x-3 text-neutral-300">
            <Link
              href="/faculty/login"
              className="hover:text-white transition flex items-center gap-1 font-medium bg-[#4a1814] px-2.5 py-0.5 rounded text-[11px]"
            >
              <UserCheck className="w-3 h-3 text-amber-400" />
              Faculty Portal
            </Link>
            <span className="text-neutral-500">|</span>
            <Link
              href="/admin/login"
              className="hover:text-white transition flex items-center gap-1 font-medium bg-[#4a1814] px-2.5 py-0.5 rounded text-[11px]"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* 2 & 3. Sticky Header & Navbar Container */}
      <header className="sticky top-0 z-50 w-full bg-white shadow-md font-sans border-b border-[#eedfd8]">
        {/* Dynamic Line Progress Loader Between Topbar and Header */}
        <NavigationProgressBar />

        {/* Main Institutional Brand Header */}
        <div className="bg-white py-3 px-4 sm:px-8 border-b border-[#f4ece8]">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href={`/?dept=${activeDepartment.slug}`} className="flex items-center gap-3.5 sm:gap-5 group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-22 md:h-22 flex-shrink-0 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/nith.png"
                  alt="NIT Hamirpur Official Emblem"
                  className="w-full h-full object-contain filter drop-shadow-xs"
                />
              </div>
              <div>
                <p className="text-[11px] sm:text-[13px] font-semibold text-[#6b5c58] leading-tight">
                  राष्ट्रीय प्रौद्योगिकी संस्थान हमीरपुर • {activeDepartment.hindi_name}
                </p>
                <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-[#33110e] tracking-tight leading-tight group-hover:text-[#85261e] transition">
                  National Institute of Technology Hamirpur
                </h1>
                <p className="text-xs sm:text-base font-bold text-[#85261e] tracking-wide flex items-center gap-2 mt-0.5">
                  <span>Department of {activeDepartment.name}</span>
                  <span className="bg-[#fff9f6] text-[#33110e] border border-[#eedfd8] text-[11px] font-extrabold px-2 py-0.5 rounded uppercase">
                    {activeDepartment.code}
                  </span>
                </p>
              </div>
            </Link>

            {/* Right Action: Department Selector Dropdown on all pages */}
            <div className="hidden lg:flex items-center gap-3 relative" ref={deptDropdownRef}>
              <button
                onClick={() => setDeptModalOpen(!deptModalOpen)}
                className="flex items-center gap-2.5 bg-[#fff9f6] hover:bg-[#eedfd8]/60 text-[#33110e] border-2 border-[#eedfd8] hover:border-[#85261e] px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-[#85261e]" />
                <div className="text-left">
                  <p className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold leading-none">
                    Select Department
                  </p>
                  <p className="text-xs font-extrabold text-[#33110e] leading-tight truncate max-w-[200px]">
                    {activeDepartment.name}
                  </p>
                </div>
                <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${deptModalOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Department Selector Dropdown Modal */}
              {deptModalOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-[#eedfd8] p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-[#eedfd8] mb-2">
                    <span className="text-xs font-bold text-[#33110e] uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#85261e]" /> Select Department
                    </span>
                    <span className="text-[10px] text-neutral-500 font-semibold">
                      {departments.length} Departments
                    </span>
                  </div>

                  {/* Search Input */}
                  <div className="relative mb-2">
                    <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2" />
                    <input
                      type="text"
                      placeholder="Search by department name or code..."
                      value={deptSearch}
                      onChange={(e) => setDeptSearch(e.target.value)}
                      className="w-full pl-8 pr-2 py-1 text-xs rounded border border-[#eedfd8] bg-[#fff9f6] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                    />
                  </div>

                  {/* Departments List */}
                  <div className="max-h-64 overflow-y-auto space-y-1 no-scrollbar divide-y divide-neutral-50">
                    {filteredDepts.map((d) => {
                      const isSelected = d.id === activeDepartment.id;
                      return (
                        <button
                          key={d.id}
                          onClick={() => {
                            setActiveDepartment(d);
                            setDeptModalOpen(false);
                          }}
                          className={`w-full text-left p-2 rounded-lg text-xs transition flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? "bg-[#33110e] text-white font-bold"
                              : "hover:bg-[#fff9f6] text-neutral-800"
                          }`}
                        >
                          <div className="truncate pr-2">
                            <p className={`font-semibold truncate ${isSelected ? "text-white" : "text-[#33110e]"}`}>
                              {d.name}
                            </p>
                            <p className={`text-[10px] ${isSelected ? "text-neutral-300" : "text-neutral-500"}`}>
                              {d.code} • {d.hindi_name}
                            </p>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#33110e] hover:bg-[#fff9f6] border border-[#eedfd8]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Primary Navigation Bar (#1c110c) */}
        <nav className="bg-[#1c110c] text-white shadow-md hidden lg:block">
          <div className="max-w-7xl mx-auto flex items-center px-4">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative group"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className="px-3.5 py-3 text-[13px] font-semibold text-neutral-200 hover:text-white hover:bg-[#33110e] flex items-center gap-1 transition tracking-wide uppercase"
                  >
                    {item.label}
                    {item.children && (
                      <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:rotate-180 transition duration-200" />
                    )}
                  </Link>

                  {item.children && openDropdown === item.label && (
                    <div className="absolute left-0 top-full w-56 bg-white text-[#1c110c] rounded-b-md shadow-xl border border-[#eedfd8] py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-[#fff9f6] hover:text-[#33110e] hover:pl-5 transition-all border-b border-neutral-100 last:border-0"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-[#eedfd8] px-4 py-4 space-y-3">
            {/* Mobile Department Selector or Visit CTA */}
            {isHomePage ? (
              <div className="pb-3 border-b border-[#eedfd8]">
                <Link
                  href="/aboutus?dept=cse"
                  onClick={() => {
                    const cse = departments.find((d) => d.slug === "cse");
                    if (cse) setActiveDepartment(cse);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-between bg-[#85261e] text-white p-3 rounded-xl text-xs font-bold"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-300" />
                    <span>Visit Departments (CSE Default)</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-300" />
                </Link>
              </div>
            ) : (
              <div className="pb-3 border-b border-[#eedfd8]">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                  Active Department
                </label>
                <select
                  value={activeDepartment.slug}
                  onChange={(e) => {
                    const found = departments.find((d) => d.slug === e.target.value);
                    if (found) setActiveDepartment(found);
                  }}
                  className="w-full text-xs font-bold text-[#33110e] bg-[#fff9f6] border border-[#eedfd8] rounded-lg p-2"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.slug}>
                      {d.name} ({d.code})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Mobile Nav Links */}
            <div className="space-y-1">
              {navItems.map((item) => (
                <div key={item.label} className="border-b border-neutral-100 last:border-0 pb-1">
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-xs font-bold text-[#33110e] uppercase"
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="pl-3 space-y-1 pb-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-1 text-xs text-neutral-600 hover:text-[#33110e]"
                        >
                          • {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
