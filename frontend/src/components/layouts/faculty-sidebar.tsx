"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  User,
  GraduationCap,
  Briefcase,
  Award,
  Globe,
  Mic2,
  BookOpen,
  FileText,
  Lightbulb,
  FlaskConical,
  Users,
  Calendar,
  Download,
  LogOut,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  BookOpenCheck,
  BarChart2,
  Bell,
} from "lucide-react";
import { MOCK_FACULTY } from "@/lib/mock-data";
import { clearAuthSession } from "@/lib/auth-guard";

type SidebarLink =
  | { label: string; href: string; icon: any }
  | { section: string; items: { label: string; href: string; icon: any }[] };

const sidebarLinks: SidebarLink[] = [
  { label: "Dashboard", href: "/faculty", icon: LayoutDashboard },
  { label: "Office Circulars", href: "/faculty/notices", icon: Bell },
  { label: "Research Analytics", href: "/faculty/analytics", icon: BarChart2 },
  { label: "Faculty Profile", href: "/faculty/profile", icon: User },
  {
    section: "Academic Profile & CV",
    items: [
      { label: "Qualifications", href: "/faculty/qualifications", icon: GraduationCap },
      { label: "Teaching Experience", href: "/faculty/teaching-exp", icon: Briefcase },
      { label: "Courses Taught", href: "/faculty/courses", icon: BookOpenCheck },
      { label: "Administrative Roles", href: "/faculty/admin-exp", icon: ShieldCheck },
      { label: "Honors & Awards", href: "/faculty/honors", icon: Award },
      { label: "Foreign Visits & Exposure", href: "/faculty/exposures", icon: Globe },
      { label: "Invited Talks & Lectures", href: "/faculty/expert-talks", icon: Mic2 },
    ],
  },
  {
    section: "Research & Scholarly Output",
    items: [
      { label: "Publications (SCI/Scopus)", href: "/faculty/publications", icon: BookOpen },
      { label: "Patents (Granted/Filed)", href: "/faculty/patents", icon: FileText },
      { label: "R&D Sponsored Projects", href: "/faculty/projects", icon: Lightbulb },
      { label: "Consultancies", href: "/faculty/consultancies", icon: FlaskConical },
      { label: "Ph.D. & PG Supervisions", href: "/faculty/supervisions", icon: Users },
      { label: "Conferences & Events", href: "/faculty/events", icon: Calendar },
    ],
  },
  { label: "Export Official CV", href: "/faculty/export", icon: Download },
];

import { resolveFacultyDepartment } from "@/lib/faculty-storage";

export function FacultySidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const raw = localStorage.getItem("auth_user");
    if (raw) {
      try {
        setCurrentUser(JSON.parse(raw));
      } catch {}
    }
  }, []);

  const activeFaculty =
    MOCK_FACULTY.find(
      (f) =>
        f.employee_code?.toLowerCase() === currentUser?.employee_code?.toLowerCase() ||
        f.email?.toLowerCase() === currentUser?.email?.toLowerCase() ||
        f.id === currentUser?.faculty_id
    ) || MOCK_FACULTY[0];

  const facultyDept = resolveFacultyDepartment(activeFaculty, currentUser);

  const handleLogout = () => {
    clearAuthSession();
    router.push("/faculty/login");
  };

  return (
    <aside className="sticky top-0 flex h-screen w-72 flex-shrink-0 flex-col border-r border-[#eedfd8] bg-white text-[#1c110c] font-sans shadow-xs">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b border-[#eedfd8] px-4 bg-[#fff9f6]">
        <div className="w-10 h-10 rounded-full bg-white border border-[#eedfd8] p-1 shadow-2xs flex items-center justify-center flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/nith.png"
            alt="NIT Hamirpur"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="min-w-0">
          <span className="text-sm font-black text-[#33110e] tracking-tight block truncate uppercase">
            Faculty Academic Portal
          </span>
          <span className="text-xs font-semibold text-[#85261e] block truncate">
            NIT Hamirpur • {facultyDept.code} Dept
          </span>
        </div>
      </div>

      {/* Faculty Profile Summary Strip */}
      <div className="p-3.5 bg-[#fff9f6] border-b border-[#eedfd8] flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#eedfd8] bg-white flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeFaculty.image_url || "/hod.jpg"}
            alt={activeFaculty.full_name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-[#1c110c] truncate leading-tight">
            {activeFaculty.full_name}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="bg-[#33110e] text-white text-[10px] font-mono font-bold px-1.5 py-0.2 rounded">
              {activeFaculty.employee_code || "FACULTY"}
            </span>
            <span className="text-xs text-neutral-500 truncate">
              {activeFaculty.designation.split(" ")[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {sidebarLinks.map((item, i) => {
          if ("section" in item) {
            return (
              <div key={i} className="space-y-1">
                <p className="px-2.5 text-xs font-bold uppercase tracking-wider text-[#85261e]">
                  {item.section}
                </p>
                <div className="space-y-0.5">
                  {item.items.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition duration-150",
                          isActive
                            ? "bg-[#33110e] text-white shadow-xs font-semibold"
                            : "text-neutral-700 hover:bg-[#eedfd8]/40 hover:text-[#33110e]"
                        )}
                      >
                        <link.icon className={cn("h-4 w-4 flex-shrink-0", isActive ? "text-amber-300" : "text-[#85261e]")} />
                        <span className="truncate">{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          }

          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition duration-150",
                isActive
                  ? "bg-[#33110e] text-white shadow-xs font-semibold"
                  : "text-neutral-700 hover:bg-[#eedfd8]/40 hover:text-[#33110e]"
              )}
            >
              <item.icon className={cn("h-4 w-4 flex-shrink-0", isActive ? "text-amber-300" : "text-[#85261e]")} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions: Public Site Link & Sign Out */}
      <div className="border-t border-[#eedfd8] p-3 space-y-1.5 bg-[#fff9f6]">
        <Link
          href={`/people/faculty/${activeFaculty.employee_code || activeFaculty.id}?dept=cse`}
          target="_blank"
          className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#33110e] hover:bg-white transition"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-[#85261e]" /> View Public Portfolio
          </span>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-neutral-600 hover:bg-white hover:text-[#33110e] transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Public Website
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-bold text-red-700 hover:bg-red-50 transition cursor-pointer"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>
    </aside>
  );
}
