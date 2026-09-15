"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  UserCog,
  GraduationCap,
  BookOpen,
  FileText,
  Lightbulb,
  Megaphone,
  Newspaper,
  Image,
  Info,
  MessageSquare,
  HelpCircle,
  FolderOpen,
  FlaskConical,
  MonitorSmartphone,
  Wrench,
  BarChart3,
  ClipboardList,
  Shield,
  LogOut,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Building2,
} from "lucide-react";
import { useDepartment } from "@/context/department-context";

interface SidebarSection {
  section: string;
  id: string;
  items: { label: string; href: string; icon: any; badge?: string }[];
}

type SidebarItem =
  | { label: string; href: string; icon: any; badge?: string }
  | SidebarSection;

// Menu for HOD Admin (focused on departmental academic governance & HOD desk)
const hodSidebarLinks: SidebarItem[] = [
  { label: "HOD Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Visual Analytics & Graphs", href: "/admin/analytics", icon: BarChart3, badge: "Charts" },
  {
    section: "HOD Desk & Leadership",
    id: "hod-desk",
    items: [
      { label: "HOD Message & Vision", href: "/admin/hod", icon: MessageSquare, badge: "Desk" },
      { label: "About Us Content", href: "/admin/home/aboutus", icon: Info },
      { label: "Hero Carousel", href: "/admin/home/carousel", icon: Image },
    ],
  },
  {
    section: "Department People",
    id: "people",
    items: [
      { label: "Faculty Roster", href: "/admin/people/faculty", icon: Users },
      { label: "PhD Scholars", href: "/admin/people/phdscholars", icon: BookOpen },
      { label: "Staff Members", href: "/admin/people/staff", icon: UserCog },
      { label: "Students Roster", href: "/admin/people/students", icon: GraduationCap },
    ],
  },
  {
    section: "Academics & Curricula",
    id: "academics",
    items: [
      { label: "Courses & Curricula", href: "/admin/academics/courses", icon: BookOpen },
      { label: "Labs & Facilities", href: "/admin/academics/labs", icon: FlaskConical },
      { label: "Placement Statistics", href: "/admin/placement", icon: BarChart3 },
    ],
  },
  {
    section: "Department Research",
    id: "research",
    items: [
      { label: "Publications", href: "/admin/research/publications", icon: FileText },
      { label: "Patents", href: "/admin/research/patents", icon: Shield },
      { label: "R&D Projects", href: "/admin/research/projects", icon: Lightbulb },
    ],
  },
  {
    section: "Communications & CMS",
    id: "cms",
    items: [
      { label: "Announcements & Notices", href: "/admin/news/announcements", icon: Megaphone },
      { label: "Achievements", href: "/admin/news/achievements", icon: Newspaper },
      { label: "Department Documents", href: "/admin/documents", icon: FolderOpen },
      { label: "FAQ / Q&A", href: "/admin/qna", icon: HelpCircle },
    ],
  },
  {
    section: "Credentials & Reports",
    id: "system",
    items: [
      { label: "Faculty Credentials", href: "/admin/credentials/facultiescredentials", icon: Wrench },
      { label: "Generate Reports", href: "/admin/report", icon: ClipboardList },
    ],
  },
];

// Menu for System Administrator (focused on central IT, multi-department, user accounts & audit)
const sysAdminSidebarLinks: SidebarItem[] = [
  { label: "Central IT Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Visual Analytics & Graphs", href: "/admin/analytics", icon: BarChart3, badge: "Charts" },
  {
    section: "System & Access Governance",
    id: "sys-governance",
    items: [
      { label: "User Accounts & Roles", href: "/admin/users", icon: Users, badge: "Admins/HODs" },
      { label: "Security & Audit Logs", href: "/admin/audit-logs", icon: Shield, badge: "Logs" },
      { label: "System Diagnostics & Cache", href: "/admin/system-settings", icon: Wrench },
    ],
  },
  {
    section: "Multi-Department Operations",
    id: "departments",
    items: [
      { label: "Departments Registry", href: "/admin/departments", icon: Building2, badge: "13 Depts" },
      { label: "Faculty Credentials", href: "/admin/credentials/facultiescredentials", icon: Wrench },
      { label: "Institute Dossier & Reports", href: "/admin/report", icon: ClipboardList },
    ],
  },
  {
    section: "Campus Infrastructure",
    id: "operations",
    items: [
      { label: "Equipment & Server Registry", href: "/admin/equipments", icon: MonitorSmartphone },
      { label: "Labs & Compute Facilities", href: "/admin/academics/labs", icon: FlaskConical },
      { label: "Placement Statistics", href: "/admin/placement", icon: BarChart3 },
    ],
  },
  {
    section: "Global Communications",
    id: "cms",
    items: [
      { label: "Broadcast Announcements", href: "/admin/news/announcements", icon: Megaphone },
      { label: "Central Documents", href: "/admin/documents", icon: FolderOpen },
      { label: "Institute FAQ", href: "/admin/qna", icon: HelpCircle },
    ],
  },
  {
    section: "Department Portals & People",
    id: "dept-inspect",
    items: [
      { label: "Faculty Directory", href: "/admin/people/faculty", icon: Users },
      { label: "PhD Scholars", href: "/admin/people/phdscholars", icon: BookOpen },
      { label: "Students Roster", href: "/admin/people/students", icon: GraduationCap },
      { label: "Staff Members", href: "/admin/people/staff", icon: UserCog },
      { label: "Course Catalogue", href: "/admin/academics/courses", icon: BookOpen },
      { label: "HOD Message CMS", href: "/admin/hod", icon: MessageSquare },
      { label: "Hero Carousel", href: "/admin/home/carousel", icon: Image },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { activeDepartment } = useDepartment();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const raw = localStorage.getItem("auth_user");
    if (raw) {
      try {
        setAdminUser(JSON.parse(raw));
      } catch {}
    }
  }, []);

  const isHod = adminUser?.role === "HOD_ADMIN" || adminUser?.roles?.includes("HOD_ADMIN");
  const sidebarLinks = isHod ? hodSidebarLinks : sysAdminSidebarLinks;

  const toggleSection = (id: string) => {
    setCollapsedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    router.push("/admin/login");
  };

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-shrink-0 flex-col border-r border-[#eedfd8] bg-white text-[#1c110c] font-sans shadow-xs select-none">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b border-[#eedfd8] px-4 bg-[#fff9f6] flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-white border border-[#eedfd8] p-1 shadow-2xs flex items-center justify-center flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/nith.png"
            alt="NIT Hamirpur"
            className="w-full h-full object-contain filter drop-shadow-2xs"
          />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-extrabold text-[#33110e] tracking-tight block truncate uppercase">
              {isHod ? "HOD Admin Panel" : "System IT Console"}
            </span>
            <span
              className={cn(
                "text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded font-mono",
                isHod ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-900"
              )}
            >
              {isHod ? "HOD" : "ROOT"}
            </span>
          </div>
          <span className="text-[10px] font-semibold text-[#85261e] block truncate">
            {isHod
              ? `NIT Hamirpur • ${activeDepartment?.code || "CSE"} Dept`
              : "NIT Hamirpur • Central IT Console"}
          </span>
        </div>
      </div>

      {/* Navigation Links with Collapsible Categories & Smooth Scroll */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-2.5 space-y-1 scrollbar-thin scrollbar-thumb-[#eedfd8] scrollbar-track-transparent">
        {sidebarLinks.map((item, i) => {
          if ("section" in item) {
            const isCollapsed = !!collapsedSections[item.id];
            const hasActiveChild = item.items.some(
              (sub) => pathname === sub.href || pathname.startsWith(sub.href + "/")
            );

            return (
              <div key={item.id || i} className="pt-1.5">
                <button
                  type="button"
                  onClick={() => toggleSection(item.id)}
                  className="flex w-full items-center justify-between px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#85261e]/70 hover:text-[#85261e] rounded-lg transition group cursor-pointer"
                >
                  <span className="truncate">{item.section}</span>
                  {isCollapsed ? (
                    <ChevronRight className="w-3 h-3 text-neutral-400 group-hover:text-[#85261e] transition" />
                  ) : (
                    <ChevronDown className="w-3 h-3 text-neutral-400 group-hover:text-[#85261e] transition" />
                  )}
                </button>

                {!isCollapsed && (
                  <div className="mt-0.5 space-y-0.5 pl-1">
                    {item.items.map((link) => {
                      const isActive =
                        pathname === link.href || pathname.startsWith(link.href + "/");
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={cn(
                            "flex items-center justify-between rounded-xl px-2.5 py-1.5 text-[11.5px] font-semibold transition-all duration-150 group",
                            isActive
                              ? "bg-[#33110e] text-white shadow-xs"
                              : "text-[#6b5c58] hover:bg-[#fff9f6] hover:text-[#33110e]"
                          )}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <link.icon
                              className={cn(
                                "h-3.5 w-3.5 flex-shrink-0 transition",
                                isActive
                                  ? "text-amber-300"
                                  : "text-[#85261e]/60 group-hover:text-[#85261e]"
                              )}
                            />
                            <span className="truncate">{link.label}</span>
                          </div>
                          {link.badge && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300">
                              {link.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2 text-[12px] font-semibold transition-all duration-150",
                isActive
                  ? "bg-[#33110e] text-white shadow-xs"
                  : "text-[#6b5c58] hover:bg-[#fff9f6] hover:text-[#33110e]"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 flex-shrink-0",
                  isActive ? "text-amber-300" : "text-[#85261e]/60"
                )}
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Admin Profile & Logout Sticky Footer */}
      <div className="border-t border-[#eedfd8] p-3 bg-[#fff9f6] space-y-2 flex-shrink-0">
        {/* Public Website Link */}
        <Link
          href={`/?dept=${activeDepartment?.slug || "cse"}`}
          target="_blank"
          className="flex items-center justify-between rounded-lg px-2.5 py-1 text-[10px] font-bold text-[#85261e] hover:bg-white hover:shadow-2xs transition"
        >
          <span className="flex items-center gap-1.5">
            <ExternalLink className="w-3 h-3 text-[#85261e]" />
            Public Department Site
          </span>
          <span className="text-[9px] text-neutral-400 font-mono">↗</span>
        </Link>

        {/* Admin Info Card */}
        <div className="flex items-center gap-2 rounded-xl bg-white border border-[#eedfd8] p-2 shadow-2xs">
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-extrabold flex-shrink-0",
              isHod ? "bg-[#85261e] text-white" : "bg-[#33110e] text-amber-300"
            )}
          >
            {isHod ? "H" : "A"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <p className="text-[11px] font-bold text-[#33110e] truncate leading-tight">
                {adminUser?.full_name || (isHod ? "Head of Department" : "System Administrator")}
              </p>
            </div>
            <p className="text-[9px] text-[#6b5c58] truncate font-mono leading-tight">
              {adminUser?.email || (isHod ? "hod@nith.ac.in" : "admin@nith.ac.in")}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#eedfd8] bg-white py-1.5 text-[10.5px] font-bold text-[#85261e] hover:bg-[#85261e] hover:text-white transition cursor-pointer shadow-2xs"
        >
          <LogOut className="h-3 w-3" />
          Sign Out of Console
        </button>
      </div>
    </aside>
  );
}
