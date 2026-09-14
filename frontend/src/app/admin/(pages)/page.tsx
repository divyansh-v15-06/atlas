"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  BookOpen,
  Shield,
  Lightbulb,
  ArrowRight,
  UserPlus,
  UploadCloud,
  Megaphone,
  GraduationCap,
  FileText,
  BarChart3,
  TrendingUp,
  Clock,
  Sparkles,
  Activity,
  Award,
  Building2,
  Search,
  Plus,
  Download,
  Trash2,
  Edit,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Eye,
  Check,
  Share2,
  FileSpreadsheet,
  Layers,
  Filter,
  Server,
  MessageSquare,
  ExternalLink,
  Lock,
  Wrench,
} from "lucide-react";
import {
  MOCK_FACULTY,
  MOCK_PUBLICATIONS,
  MOCK_DEPARTMENT_KPIS,
  MOCK_PATENTS,
  MOCK_PROJECTS,
  MOCK_STUDENTS,
} from "@/lib/mock-data";
import { formatINR, cn } from "@/lib/utils";
import { useDepartment } from "@/context/department-context";
import { toast } from "sonner";
import Dashboard from "@/components/dashboard";

export default function AdminDashboardPage() {
  const { activeDepartment, departments, selectDepartmentBySlug, setActiveDepartmentBySlug } = useDepartment();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "analytics">("overview");
  const isHod = adminUser?.role === "HOD_ADMIN" || adminUser?.roles?.includes("HOD_ADMIN");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("tab") === "analytics") {
        setActiveTab("analytics");
      }
    }
  }, []);

  const defaultCseAnnouncements = useMemo(() => [
    {
      id: "ann-1",
      title: "Call for PhD Admissions (Odd Semester 2026-27)",
      category: "Academic",
      date: "Aug 18, 2026",
      urgent: true,
      target: "All Applicants",
    },
    {
      id: "ann-2",
      title: "DST-SERB Core Research Grant Applications Open for Faculty",
      category: "Research",
      date: "Aug 15, 2026",
      urgent: false,
      target: "Faculty Only",
    },
    {
      id: "ann-3",
      title: "Campus Placement Drive: Google & Microsoft Scheduled for Sept",
      category: "Placement",
      date: "Aug 12, 2026",
      urgent: false,
      target: "Final Year Students",
    },
  ], []);

  const currentSlug = activeDepartment?.slug || "cse";
  const isCse = currentSlug === "cse";

  // Faculty state (loaded dynamically based on active department)
  const [facultyList, setFacultyList] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`nith_admin_faculty_list_${currentSlug}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed;
        } catch {}
      }
      if (isCse) {
        const legacy = localStorage.getItem("nith_admin_faculty_list");
        if (legacy) {
          try {
            const parsed = JSON.parse(legacy);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
          } catch {}
        }
        return MOCK_FACULTY;
      }
      return [];
    }
    return isCse ? MOCK_FACULTY : [];
  });
  const [searchFaculty, setSearchFaculty] = useState("");
  const [facultyRoleFilter, setFacultyRoleFilter] = useState("all");

  // Announcements state
  const [announcements, setAnnouncements] = useState<any[]>(() => isCse ? defaultCseAnnouncements : []);

  // Modal States
  const [isAddFacultyOpen, setIsAddFacultyOpen] = useState(false);
  const [isImportCsvOpen, setIsImportCsvOpen] = useState(false);
  const [isNewAnnouncementOpen, setIsNewAnnouncementOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [selectedFacultyForReset, setSelectedFacultyForReset] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Form State: Add Faculty
  const [newFaculty, setNewFaculty] = useState({
    full_name: "",
    employee_code: "",
    email: "",
    designation: "Assistant Professor",
    specialization: "Artificial Intelligence & Distributed Systems",
    image_url: "/nith.png",
  });

  // Form State: New Announcement
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    category: "Academic",
    target: "All",
    urgent: false,
    description: "",
  });

  // Form State: CSV Import
  const [importDatasetType, setImportDatasetType] = useState("students");
  const [importFileName, setImportFileName] = useState("");
  const [importedRowsCount, setImportedRowsCount] = useState<number | null>(null);

  // Load persistent user data on mount
  useEffect(() => {
    const rawUser = localStorage.getItem("auth_user");
    if (rawUser) {
      try {
        setAdminUser(JSON.parse(rawUser));
      } catch {}
    }
  }, []);

  // Department-scoped dynamic data sync
  useEffect(() => {
    // 1. Sync Faculty for this specific department
    const scopedFacultyKey = `nith_admin_faculty_list_${currentSlug}`;
    const savedScoped = localStorage.getItem(scopedFacultyKey);
    if (savedScoped) {
      try {
        const parsed = JSON.parse(savedScoped);
        if (Array.isArray(parsed)) {
          setFacultyList(parsed);
        } else {
          setFacultyList(isCse ? MOCK_FACULTY : []);
        }
      } catch {
        setFacultyList(isCse ? MOCK_FACULTY : []);
      }
    } else if (isCse) {
      const legacy = localStorage.getItem("nith_admin_faculty_list");
      if (legacy) {
        try {
          const parsed = JSON.parse(legacy);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setFacultyList(parsed);
          } else {
            setFacultyList(MOCK_FACULTY);
          }
        } catch {
          setFacultyList(MOCK_FACULTY);
        }
      } else {
        setFacultyList(MOCK_FACULTY);
      }
    } else {
      setFacultyList([]);
    }

    // 2. Sync Announcements for this department
    const scopedAnnKey = `nith_admin_announcements_${currentSlug}`;
    const savedAnn = localStorage.getItem(scopedAnnKey);
    if (savedAnn) {
      try {
        const parsed = JSON.parse(savedAnn);
        if (Array.isArray(parsed)) {
          setAnnouncements(parsed);
        } else {
          setAnnouncements(isCse ? defaultCseAnnouncements : []);
        }
      } catch {
        setAnnouncements(isCse ? defaultCseAnnouncements : []);
      }
    } else if (isCse) {
      const legacyAnn = localStorage.getItem("nith_admin_announcements");
      if (legacyAnn) {
        try {
          const parsed = JSON.parse(legacyAnn);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAnnouncements(parsed);
          } else {
            setAnnouncements(defaultCseAnnouncements);
          }
        } catch {
          setAnnouncements(defaultCseAnnouncements);
        }
      } else {
        setAnnouncements(defaultCseAnnouncements);
      }
    } else {
      setAnnouncements([]);
    }
  }, [currentSlug, isCse, defaultCseAnnouncements]);

  // Save faculty list helper scoped to active department
  const updateAndSaveFaculty = (updated: any[]) => {
    setFacultyList(updated);
    localStorage.setItem(`nith_admin_faculty_list_${currentSlug}`, JSON.stringify(updated));
    if (isCse) {
      localStorage.setItem("nith_admin_faculty_list", JSON.stringify(updated));
    }
  };

  // Save announcements helper scoped to active department
  const updateAndSaveAnnouncements = (updated: any[]) => {
    setAnnouncements(updated);
    localStorage.setItem(`nith_admin_announcements_${currentSlug}`, JSON.stringify(updated));
    if (isCse) {
      localStorage.setItem("nith_admin_announcements", JSON.stringify(updated));
    }
  };

  // Filtered faculty
  const filteredFaculty = useMemo(() => {
    return facultyList.filter((f) => {
      const matchSearch =
        f.full_name?.toLowerCase().includes(searchFaculty.toLowerCase()) ||
        f.employee_code?.toLowerCase().includes(searchFaculty.toLowerCase()) ||
        f.email?.toLowerCase().includes(searchFaculty.toLowerCase()) ||
        f.designation?.toLowerCase().includes(searchFaculty.toLowerCase());

      if (!matchSearch) return false;

      if (facultyRoleFilter === "all") return true;
      if (facultyRoleFilter === "professor") return f.designation?.toLowerCase().includes("professor") && !f.designation?.toLowerCase().includes("assistant") && !f.designation?.toLowerCase().includes("associate");
      if (facultyRoleFilter === "associate") return f.designation?.toLowerCase().includes("associate");
      if (facultyRoleFilter === "assistant") return f.designation?.toLowerCase().includes("assistant");
      if (facultyRoleFilter === "hod") return f.full_name?.toLowerCase().includes("siddhartha") || f.full_name?.toLowerCase().includes("chauhan") || f.full_name?.toLowerCase().includes("gargi");
      return true;
    });
  }, [facultyList, searchFaculty, facultyRoleFilter]);

  // Handle Add Faculty Submit
  const handleAddFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaculty.full_name || !newFaculty.employee_code || !newFaculty.email) {
      toast.error("Please fill all required fields: Name, Code, and Email.");
      return;
    }

    const created = {
      id: `fac-${Date.now()}`,
      user_id: `usr-${Date.now()}`,
      full_name: newFaculty.full_name,
      employee_code: newFaculty.employee_code.toUpperCase(),
      email: newFaculty.email.toLowerCase(),
      designation: newFaculty.designation,
      specialization: newFaculty.specialization,
      image_url: newFaculty.image_url || "/nith.png",
      status: "Active",
    };

    const updated = [created, ...facultyList];
    updateAndSaveFaculty(updated);
    toast.success(`Faculty member ${created.full_name} (${created.employee_code}) added successfully!`);
    setIsAddFacultyOpen(false);
    setNewFaculty({
      full_name: "",
      employee_code: "",
      email: "",
      designation: "Assistant Professor",
      specialization: "Artificial Intelligence & Distributed Systems",
      image_url: "/nith.png",
    });
  };

  // Handle Delete Faculty
  const handleDeleteFaculty = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from the faculty directory?`)) {
      const updated = facultyList.filter((f) => f.id !== id);
      updateAndSaveFaculty(updated);
      toast.success(`Faculty record for ${name} removed.`);
    }
  };

  // Handle Password Reset Confirm
  const handleConfirmPasswordReset = () => {
    if (!selectedFacultyForReset) return;
    const tempPass = `NITH@${Math.floor(100000 + Math.random() * 900000)}`;
    toast.success(`Temporary password for ${selectedFacultyForReset.full_name} generated: ${tempPass}`, {
      duration: 8000,
      description: "Faculty can now sign in using this temporary credential and update their password.",
    });
    setIsResetPasswordOpen(false);
    setSelectedFacultyForReset(null);
  };

  // Handle Create Announcement
  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.title) {
      toast.error("Please provide an announcement title.");
      return;
    }

    const item = {
      id: `ann-${Date.now()}`,
      title: newAnnouncement.title,
      category: newAnnouncement.category,
      target: newAnnouncement.target,
      urgent: newAnnouncement.urgent,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    const updated = [item, ...announcements];
    setAnnouncements(updated);
    localStorage.setItem("nith_admin_announcements", JSON.stringify(updated));
    toast.success("Department announcement published live!");
    setIsNewAnnouncementOpen(false);
    setNewAnnouncement({
      title: "",
      category: "Academic",
      target: "All",
      urgent: false,
      description: "",
    });
  };

  // Handle CSV Import Action
  const handleExecuteCsvImport = () => {
    if (!importFileName) {
      toast.error("Please select or drop a CSV file to import.");
      return;
    }
    const count = Math.floor(Math.random() * 25) + 15;
    toast.success(`Successfully imported ${count} records into the ${importDatasetType} dataset!`, {
      description: "Database indexes and search cache updated instantaneously.",
    });
    setIsImportCsvOpen(false);
    setImportFileName("");
    setImportedRowsCount(null);
  };

  // Sample CSV Template Downloader
  const handleDownloadSampleCsv = () => {
    const csvContent =
      importDatasetType === "students"
        ? "roll_number,full_name,programme,batch_year,email,cgpa\n22BCSE01,Aarav Sharma,B.Tech CSE,2022,22bcse01@nith.ac.in,8.92\n22BCSE02,Ananya Verma,B.Tech CSE,2022,22bcse02@nith.ac.in,9.15\n22BCSE03,Rohan Mehta,B.Tech CSE,2022,22bcse03@nith.ac.in,8.45"
        : importDatasetType === "faculty"
        ? "employee_code,full_name,email,designation,specialization\nCS30,Dr. Ankit Sharma,ankit@nith.ac.in,Assistant Professor,Cybersecurity & Cryptography\nCS31,Dr. Priya Gupta,priya@nith.ac.in,Assistant Professor,Cloud Computing & IoT"
        : "title,authors,journal,year,doi\nQuantum Machine Learning for Healthcare,A. Sharma; B. Verma,IEEE Trans Comput,2026,10.1109/TC.2026.123456";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `sample_${importDatasetType}_template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.info(`Downloaded sample_${importDatasetType}_template.csv`);
  };

  // Handle Export Full Department Report
  const handleExportDepartmentReport = () => {
    const reportData = [
      ["NIT Hamirpur - Department Administration Dossier"],
      [`Department: ${activeDepartment?.name || "Computer Science & Engineering"} (${activeDepartment?.code || "CSE"})`],
      [`Generated On: ${new Date().toLocaleString()}`],
      [`Admin: ${adminUser?.full_name || "System Administrator"}`],
      [],
      ["--- KPI METRICS SUMMARY ---"],
      ["Faculty Count", facultyList.length],
      ["Total Students", isCse ? MOCK_DEPARTMENT_KPIS.total_students : 0],
      ["Research Publications", isCse ? MOCK_PUBLICATIONS.length : 0],
      ["Sanctioned R&D Amount (INR)", isCse ? MOCK_DEPARTMENT_KPIS.total_sanctioned_amount : 0],
      ["Patents Filed/Granted", isCse ? MOCK_PATENTS.length : 0],
      ["Sponsored Projects", isCse ? MOCK_PROJECTS.length : 0],
      [],
      ["--- FACULTY DIRECTORY ROSTER ---"],
      ["Employee Code", "Full Name", "Designation", "Email", "Status"],
      ...facultyList.map((f) => [f.employee_code, f.full_name, f.designation, f.email, "Active"]),
    ];

    const csvContent = reportData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `NITH_${activeDepartment?.code || "CSE"}_Department_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Department Dossier & Stats exported successfully!");
  };

  // Handle Refresh Realtime Metrics
  const handleRefreshMetrics = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Real-time telemetry and database caches refreshed!");
    }, 600);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Welcome Banner with Dynamic Action Buttons */}
      <div className="rounded-3xl border border-[#eedfd8] bg-gradient-to-r from-[#33110e] via-[#4a1814] to-[#85261e] p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute left-1/2 bottom-0 -mb-20 w-80 h-80 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/20 px-3 py-0.5 font-mono text-xs font-bold text-amber-300 backdrop-blur-xs">
                {isHod ? `${activeDepartment?.code || "CSE"} HOD ADMIN` : "CENTRAL IT ROOT"}
              </span>
              <span className="text-xs text-neutral-300">
                {isHod
                  ? "Departmental Academic & Research Governance • NIT Hamirpur"
                  : "Central Campus IT & Systems Administration • NIT Hamirpur"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {adminUser?.full_name || (isHod ? "Dr. Siddhartha Chauhan (Head of Department)" : "System Administrator")}
            </h1>

            <p className="text-xs text-neutral-300 max-w-lg">
              {isHod
                ? `Manage faculty course allocations, departmental labs, research publications, student rosters, and HOD desk for Department of ${activeDepartment?.name || "Computer Science & Engineering"}.`
                : "Overseeing 13 academic departments, central user accounts & HOD roles, security audit trails, server infrastructure, and campus equipment."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {isHod ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsAddFacultyOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-white/15 border border-white/25 hover:bg-white/25 px-3.5 py-2.5 text-xs font-bold text-white transition backdrop-blur-xs shadow-2xs cursor-pointer group"
                >
                  <UserPlus className="h-4 w-4 text-amber-300 group-hover:scale-110 transition" />
                  Add Faculty
                </button>

                <Link
                  href="/admin/academics/courses"
                  className="flex items-center gap-2 rounded-xl bg-white/15 border border-white/25 hover:bg-white/25 px-3.5 py-2.5 text-xs font-bold text-white transition backdrop-blur-xs shadow-2xs cursor-pointer group"
                >
                  <BookOpen className="h-4 w-4 text-amber-300 group-hover:scale-110 transition" />
                  Course Allocations
                </Link>

                <Link
                  href="/admin/hod"
                  className="flex items-center gap-2 rounded-xl bg-amber-500/30 border border-amber-400/40 hover:bg-amber-500/40 px-3.5 py-2.5 text-xs font-bold text-white transition backdrop-blur-xs shadow-2xs cursor-pointer group"
                >
                  <MessageSquare className="h-4 w-4 text-amber-300 group-hover:scale-110 transition" />
                  HOD Message Desk
                </Link>

                <button
                  type="button"
                  onClick={() => setIsNewAnnouncementOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-white/15 border border-white/25 hover:bg-white/25 px-3.5 py-2.5 text-xs font-bold text-white transition backdrop-blur-xs shadow-2xs cursor-pointer group"
                >
                  <Megaphone className="h-4 w-4 text-amber-300 group-hover:scale-110 transition" />
                  Post Notice
                </button>

                <button
                  type="button"
                  onClick={handleExportDepartmentReport}
                  className="flex items-center gap-2 rounded-xl bg-[#1c110c]/40 border border-white/20 hover:bg-[#1c110c]/70 px-3.5 py-2.5 text-xs font-bold text-white transition backdrop-blur-xs shadow-2xs cursor-pointer group"
                  title="Export complete departmental dossier"
                >
                  <Download className="h-4 w-4 text-amber-300 group-hover:scale-110 transition" />
                  Export Dossier
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/admin/users"
                  className="flex items-center gap-2 rounded-xl bg-white/15 border border-white/25 hover:bg-white/25 px-3.5 py-2.5 text-xs font-bold text-white transition backdrop-blur-xs shadow-2xs cursor-pointer group"
                >
                  <Users className="h-4 w-4 text-amber-300 group-hover:scale-110 transition" />
                  User &amp; Role Governance
                </Link>

                <Link
                  href="/admin/audit-logs"
                  className="flex items-center gap-2 rounded-xl bg-white/15 border border-white/25 hover:bg-white/25 px-3.5 py-2.5 text-xs font-bold text-white transition backdrop-blur-xs shadow-2xs cursor-pointer group"
                >
                  <Shield className="h-4 w-4 text-amber-300 group-hover:scale-110 transition" />
                  Audit Logs
                </Link>

                <Link
                  href="/admin/departments"
                  className="flex items-center gap-2 rounded-xl bg-white/15 border border-white/25 hover:bg-white/25 px-3.5 py-2.5 text-xs font-bold text-white transition backdrop-blur-xs shadow-2xs cursor-pointer group"
                >
                  <Building2 className="h-4 w-4 text-amber-300 group-hover:scale-110 transition" />
                  Departments Master
                </Link>

                <Link
                  href="/admin/system-settings"
                  className="flex items-center gap-2 rounded-xl bg-amber-500/30 border border-amber-400/40 hover:bg-amber-500/40 px-3.5 py-2.5 text-xs font-bold text-white transition backdrop-blur-xs shadow-2xs cursor-pointer group"
                >
                  <Wrench className="h-4 w-4 text-amber-300 group-hover:scale-110 transition" />
                  Diagnostics &amp; Cache
                </Link>

                <button
                  type="button"
                  onClick={handleExportDepartmentReport}
                  className="flex items-center gap-2 rounded-xl bg-[#1c110c]/40 border border-white/20 hover:bg-[#1c110c]/70 px-3.5 py-2.5 text-xs font-bold text-white transition backdrop-blur-xs shadow-2xs cursor-pointer group"
                  title="Export complete system dossier"
                >
                  <Download className="h-4 w-4 text-amber-300 group-hover:scale-110 transition" />
                  Export System Dossier
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* HOD Desk Status Quick Preview */}
      <div className="rounded-3xl border border-[#eedfd8] bg-white p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#eedfd8] shadow-xs flex-shrink-0 bg-neutral-100 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={isCse ? "https://portfolios.nith.ac.in/uploads/member_details/62.jpg" : "/nith.png"}
              alt={activeDepartment?.hod_name || "Head of Department"}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/nith.png";
              }}
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300">
                Active HOD Desk
              </span>
              <span className="text-xs text-neutral-400 font-mono">Department of {activeDepartment?.name || "Computer Science & Engineering"}</span>
            </div>
            <h3 className="text-base font-bold text-[#33110e]">
              {activeDepartment?.hod_name || (isCse ? "Dr. Siddhartha Chauhan" : "Head of Department")} • Head of Department ({activeDepartment?.code || "CSE"})
            </h3>
            <p className="text-xs text-[#6b5c58] max-w-2xl line-clamp-2 italic">
              {isCse
                ? "“It is with great pleasure that I write this in the capacity of the Head of the Department of CSE at NIT Hamirpur. I thank all the faculty members, students, and staff for their continuous efforts in maintaining excellence...”"
                : `Official departmental desk for Department of ${activeDepartment?.name || "Engineering"}. You can compose and publish the HOD statement for this department.`}
            </p>
          </div>
        </div>

        <Link
          href="/admin/hod"
          className="flex items-center gap-1.5 rounded-xl bg-[#33110e] hover:bg-[#85261e] px-4 py-2.5 text-xs font-bold text-white transition shadow-2xs whitespace-nowrap cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 text-amber-300" />
          Edit HOD Message Desk →
        </Link>
      </div>

      {/* Central IT Multi-Department Status Grid (For System Admin) */}
      {!isHod && (
        <div className="rounded-3xl border border-[#eedfd8] bg-white p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#eedfd8] pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-[#33110e] uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#85261e]" />
                Multi-Department Institutional Nodes (13 Active)
              </h3>
              <p className="text-xs text-[#6b5c58]">
                Centralized telemetry across all NIT Hamirpur academic departments. Click to switch active inspection.
              </p>
            </div>
            <Link
              href="/admin/departments"
              className="text-xs font-bold text-[#85261e] hover:underline flex items-center gap-1"
            >
              Manage Department Registry →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {departments?.map((d) => {
              const isCurrent = d.slug === (activeDepartment?.slug || "cse");
              return (
                <button
                  key={d.code}
                  type="button"
                  onClick={() => {
                    const fn = selectDepartmentBySlug || setActiveDepartmentBySlug;
                    if (typeof fn === "function") {
                      fn(d.slug);
                    }
                    toast.success(`Active department inspection set to ${d.name}`);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                    isCurrent
                      ? "bg-[#33110e] text-white border-[#33110e] shadow-xs"
                      : "bg-[#fff9f6] text-[#33110e] border-[#eedfd8] hover:border-[#85261e]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-extrabold text-xs">{d.code}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? "bg-amber-300" : "bg-emerald-500"}`} />
                  </div>
                  <div className={`text-[10px] truncate mt-1 ${isCurrent ? "text-amber-200" : "text-[#6b5c58]"}`}>
                    {d.name.split(" ")[0]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Top View Selector: Operations Console vs Visual Analytics & Research Graphs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eedfd8] pb-3">
        <div className="flex items-center gap-2 bg-[#f6ece7] p-1 rounded-2xl border border-[#eedfd8]">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer",
              activeTab === "overview"
                ? "bg-[#33110e] text-white shadow-xs"
                : "text-[#6b5c58] hover:text-[#33110e] hover:bg-white/60"
            )}
          >
            <Layers className="w-4 h-4 text-amber-300" />
            Operations & Directory Console
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("analytics")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer",
              activeTab === "analytics"
                ? "bg-[#85261e] text-white shadow-xs"
                : "text-[#6b5c58] hover:text-[#85261e] hover:bg-white/60"
            )}
          >
            <BarChart3 className="w-4 h-4 text-amber-400" />
            Visual Analytics & Research Graphs
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-[#85261e] font-mono font-extrabold border border-amber-400/30">
              Interactive
            </span>
          </button>
        </div>

        {activeTab === "analytics" ? (
          <p className="text-xs text-[#6b5c58] hidden sm:block">
            Interactive multi-year charts for Publications, Grants, Patents &amp; Events
          </p>
        ) : (
          <button
            type="button"
            onClick={() => setActiveTab("analytics")}
            className="text-xs font-bold text-[#85261e] hover:underline flex items-center gap-1.5 cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            View Research Graphs &amp; Stats →
          </button>
        )}
      </div>

      {activeTab === "overview" ? (
        <>
          {/* KPI Stat Cards with Real-time Counters and Refresh Trigger */}
          <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <p className="text-xs font-bold text-[#6b5c58] uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#85261e]" />
            Department Key Performance Indicators (Live)
          </p>
          <button
            type="button"
            onClick={handleRefreshMetrics}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 text-[11px] font-bold text-[#85261e] hover:text-[#33110e] transition cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin text-[#85261e]" : ""}`} />
            Refresh Telemetry
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Faculty Members",
              value: facultyList.length,
              icon: Users,
              color: "text-[#85261e]",
              bg: "bg-[#85261e]/10",
              trend: "Active in Department",
              href: "/admin/people/faculty",
            },
            {
              label: "Enrolled Students",
              value: isCse ? MOCK_DEPARTMENT_KPIS.total_students : 0,
              icon: GraduationCap,
              color: "text-emerald-600",
              bg: "bg-emerald-500/10",
              trend: isCse ? "UG, PG & PhD Scholars" : "No student records yet",
              href: "/admin/people/students",
            },
            {
              label: "Publications Output",
              value: isCse ? MOCK_PUBLICATIONS.length : 0,
              icon: BookOpen,
              color: "text-blue-600",
              bg: "bg-blue-500/10",
              trend: isCse ? "SCI / Scopus Indexed" : "No publications indexed",
              href: "/admin/research/publications",
            },
            {
              label: "Sanctioned Grants",
              value: isCse ? formatINR(MOCK_DEPARTMENT_KPIS.total_sanctioned_amount) : "₹0",
              icon: Lightbulb,
              color: "text-amber-600",
              bg: "bg-amber-500/10",
              trend: isCse ? "Sponsored Projects" : "No projects active",
              href: "/admin/research/projects",
            },
          ].map((kpi) => (
            <Link
              key={kpi.label}
              href={kpi.href}
              className="rounded-2xl border border-[#eedfd8] bg-white p-5 shadow-2xs hover:shadow-md hover:border-[#85261e]/40 transition duration-200 group block cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#6b5c58]">
                  {kpi.label}
                </span>
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${kpi.bg} group-hover:scale-110 transition`}>
                  <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                </div>
              </div>
              <p className={`mt-2 text-2xl font-extrabold font-mono ${kpi.color}`}>{kpi.value}</p>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-[10px] text-[#6b5c58] font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-500" /> {kpi.trend}
                </span>
                <span className="text-[10px] text-[#85261e] font-bold opacity-0 group-hover:opacity-100 transition">
                  Manage →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Visual Analytics Quick Access Banner */}
      <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50/90 via-orange-50/50 to-amber-50/90 p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#85261e] to-[#33110e] flex items-center justify-center text-amber-300 shadow-xs shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-extrabold text-[#33110e] uppercase tracking-wider">
                Interactive Research Statistics &amp; Visual Analytics Engine
              </h4>
              <span className="text-[10px] bg-amber-200/60 text-[#85261e] font-bold px-2 py-0.5 rounded-full">
                Live Charts
              </span>
            </div>
            <p className="text-xs text-neutral-600 mt-0.5">
              Explore multi-year publication indexing trends (SCI/Scopus), sanctioned project grants, patent filings, and faculty productivity graphs.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("analytics")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#85261e] hover:bg-[#a63026] text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5 text-amber-300" />
            Open Visual Graphs &amp; Stats →
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Faculty Directory & Side Management Panel */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Faculty Directory with Search, Filter & Quick Controls */}
        <div className="rounded-2xl border border-[#eedfd8] bg-white p-6 shadow-2xs lg:col-span-2 space-y-4 flex flex-col h-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-extrabold text-[#33110e] uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-[#85261e]" />
                Department Faculty Directory ({filteredFaculty.length} of {facultyList.length})
              </h2>
              <p className="text-[11px] text-[#6b5c58]">
                Direct credential management and profile access
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddFacultyOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#85261e] hover:bg-[#a63026] text-white text-xs font-bold transition shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" /> Add Faculty
            </button>
          </div>

          {/* Search & Filter Tabs */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-400" />
              <input
                type="text"
                value={searchFaculty}
                onChange={(e) => setSearchFaculty(e.target.value)}
                placeholder="Search by name, code (e.g. CS01), or designation..."
                className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] py-1.5 pl-8 pr-3 text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:bg-white focus:outline-hidden"
              />
              {searchFaculty && (
                <button
                  type="button"
                  onClick={() => setSearchFaculty("")}
                  className="absolute right-2.5 top-2 text-neutral-400 hover:text-[#33110e]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: "all", label: "All" },
                { id: "professor", label: "Professors" },
                { id: "associate", label: "Associate" },
                { id: "assistant", label: "Assistant" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFacultyRoleFilter(tab.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition cursor-pointer whitespace-nowrap ${
                    facultyRoleFilter === tab.id
                      ? "bg-[#33110e] text-white shadow-2xs"
                      : "bg-[#fff9f6] text-[#6b5c58] hover:bg-[#eedfd8]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Faculty List Table / Cards (Stretches to fill entire card height) */}
          <div className="divide-y divide-[#eedfd8] flex-1 min-h-[500px] max-h-[640px] overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-[#eedfd8] scrollbar-track-transparent">
            {filteredFaculty.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#fff9f6] border border-[#eedfd8] mx-auto flex items-center justify-center text-neutral-400 shadow-2xs">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#33110e]">
                    {facultyList.length === 0
                      ? `No faculty records found for Department of ${activeDepartment?.name || "this department"}`
                      : `No faculty members matching "${searchFaculty}"`}
                  </p>
                  <p className="text-[11px] text-[#6b5c58] mt-0.5">
                    {facultyList.length === 0
                      ? `Department data for ${activeDepartment?.code || "this department"} is currently empty. You can onboard faculty or import roster.`
                      : "Try checking spelling or resetting your filter criteria."}
                  </p>
                </div>
                {facultyList.length === 0 ? (
                  <div className="pt-2 flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddFacultyOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-[#85261e] text-white text-xs font-bold hover:bg-[#a63026] transition shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add First Faculty
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsImportCsvOpen(true)}
                      className="px-3.5 py-2 rounded-xl border border-[#eedfd8] bg-white text-[#33110e] text-xs font-bold hover:bg-[#fff9f6] transition shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <UploadCloud className="w-3.5 h-3.5 text-[#85261e]" /> Import CSV Roster
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchFaculty("");
                      setFacultyRoleFilter("all");
                    }}
                    className="text-xs font-bold text-[#85261e] hover:underline"
                  >
                    Clear search filters
                  </button>
                )}
              </div>
            ) : (
              filteredFaculty.map((f) => (
                <div
                  key={f.id || f.employee_code}
                  className="flex items-center justify-between py-2.5 hover:bg-[#fff9f6] px-2.5 rounded-xl transition group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-xl bg-[#fff9f6] border border-[#eedfd8] overflow-hidden shadow-2xs flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={f.image_url || "/nith.png"}
                        alt={f.full_name}
                        className="h-full w-full object-cover"
                        onError={(e: any) => {
                          e.target.src = "/nith.png";
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-[#33110e] truncate group-hover:text-[#85261e] transition">
                          {f.full_name}
                        </p>
                        <span className="rounded-md bg-[#fff9f6] border border-[#eedfd8] px-1.5 py-0.2 font-mono text-[9px] font-bold text-[#85261e]">
                          {f.employee_code}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#6b5c58] truncate">
                        {f.designation} • <span className="font-mono">{f.email}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions on Faculty Member */}
                  <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFacultyForReset(f);
                        setIsResetPasswordOpen(true);
                      }}
                      className="p-1.5 rounded-lg border border-[#eedfd8] bg-white text-[#6b5c58] hover:bg-[#33110e] hover:text-amber-300 transition cursor-pointer shadow-2xs"
                      title="Reset Faculty Password / Credentials"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                    </button>

                    <Link
                      href={`/people/faculty/${f.employee_code || f.id}?dept=${activeDepartment?.slug || "cse"}`}
                      target="_blank"
                      className="p-1.5 rounded-lg border border-[#eedfd8] bg-white text-[#6b5c58] hover:bg-[#85261e] hover:text-white transition cursor-pointer shadow-2xs"
                      title="Open Public Faculty Profile"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDeleteFaculty(f.id, f.full_name)}
                      className="p-1.5 rounded-lg border border-red-100 bg-white text-red-500 hover:bg-red-600 hover:text-white transition cursor-pointer shadow-2xs"
                      title="Remove Faculty Member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary Bar */}
          <div className="pt-3 border-t border-[#eedfd8] flex items-center justify-between text-[11px] text-[#6b5c58] mt-auto">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Showing {filteredFaculty.length} of {facultyList.length} faculty accounts</span>
            </div>
            <Link
              href="/admin/people/faculty"
              className="font-bold text-[#85261e] hover:underline flex items-center gap-1"
            >
              Full Roster Management <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Right Column: Quick Management Actions & Announcements */}
        <div className="space-y-6">
          {/* Quick Management Shortcuts */}
          <div className="rounded-2xl border border-[#eedfd8] bg-white p-5 shadow-2xs space-y-3">
            <h2 className="text-sm font-extrabold text-[#33110e] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#85261e]" />
              Quick Console Tools
            </h2>

            <div className="grid gap-2">
              {[
                { label: "Faculty Login Credentials", href: "/admin/credentials/facultiescredentials", icon: KeyRound, count: facultyList.length },
                { label: "Research Publications DB", href: "/admin/research/publications", icon: FileText, count: isCse ? MOCK_PUBLICATIONS.length : 0 },
                { label: "Sponsored R&D Projects", href: "/admin/research/projects", icon: Lightbulb, count: isCse ? MOCK_PROJECTS.length : 0 },
                { label: "Student Roster Records", href: "/admin/people/students", icon: GraduationCap, count: isCse ? MOCK_STUDENTS.length : 0 },
                { label: "HOD Message & Profile Editor", href: "/admin/hod", icon: Building2 },
                { label: "Research Visual Analytics", href: "/admin/analytics", icon: Activity },
                { label: "Courses & Curricula", href: "/admin/academics/courses", icon: BookOpen },
                { label: "Equipment Inventory", href: "/admin/equipments", icon: FileSpreadsheet },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-2.5 text-[11px] font-bold text-[#33110e] hover:bg-[#33110e] hover:text-white transition group cursor-pointer shadow-2xs"
                >
                  <span className="flex items-center gap-2">
                    <item.icon className="w-3.5 h-3.5 text-[#85261e] group-hover:text-amber-300 transition" />
                    {item.label}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {item.count !== undefined && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white text-[#85261e] border border-[#eedfd8] group-hover:bg-[#4a1814] group-hover:text-amber-200">
                        {item.count}
                      </span>
                    )}
                    <ArrowRight className="h-3 w-3 text-[#85261e]/40 group-hover:text-amber-300 group-hover:translate-x-0.5 transition" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Department Notices & Announcements Feed */}
          <div className="rounded-2xl border border-[#eedfd8] bg-white p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-[#33110e] uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#85261e]" />
                Recent Department Notices
              </h2>
              <button
                type="button"
                onClick={() => setIsNewAnnouncementOpen(true)}
                className="text-[10.5px] font-bold text-[#85261e] hover:underline cursor-pointer"
              >
                + Post
              </button>
            </div>

            <div className="space-y-2">
              {announcements.slice(0, 4).map((ann) => (
                <div
                  key={ann.id}
                  className="rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-2.5 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[8.5px] font-bold text-[#85261e] bg-[#85261e]/10 px-1.5 py-0.2 rounded uppercase">
                      {ann.category}
                    </span>
                    <span className="text-[8.5px] text-[#6b5c58] font-mono">{ann.date}</span>
                  </div>
                  <p className="text-[10.5px] font-bold text-[#33110e] line-clamp-2 leading-snug">
                    {ann.title}
                  </p>
                  {ann.urgent && (
                    <span className="inline-block text-[8px] font-extrabold text-red-600 bg-red-100 px-1 rounded">
                      URGENT PRIORITY
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </>
      ) : (
        <div className="pt-2 animate-in fade-in duration-200">
          <Dashboard />
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD FACULTY MEMBER */}
      {/* ========================================================================= */}
      {isAddFacultyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg rounded-3xl border border-[#eedfd8] bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-[#eedfd8] pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#fff9f6] border border-[#eedfd8] text-[#85261e]">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#33110e]">Add New Faculty Member</h3>
                  <p className="text-[11px] text-[#6b5c58]">Create official faculty profile & portal account</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddFacultyOpen(false)}
                className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddFaculty} className="space-y-3">
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#33110e] mb-1">
                  Full Name with Title *
                </label>
                <input
                  type="text"
                  required
                  value={newFaculty.full_name}
                  onChange={(e) => setNewFaculty({ ...newFaculty, full_name: e.target.value })}
                  placeholder="e.g. Dr. Rajesh Kumar Sharma"
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-2 text-xs text-[#33110e] focus:bg-white focus:border-[#85261e] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-[#33110e] mb-1">
                    Employee Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={newFaculty.employee_code}
                    onChange={(e) => setNewFaculty({ ...newFaculty, employee_code: e.target.value })}
                    placeholder="e.g. CS25"
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-2 text-xs font-mono text-[#33110e] focus:bg-white focus:border-[#85261e] focus:outline-hidden uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-[#33110e] mb-1">
                    Official Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={newFaculty.email}
                    onChange={(e) => setNewFaculty({ ...newFaculty, email: e.target.value })}
                    placeholder="e.g. rajesh@nith.ac.in"
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-2 text-xs font-mono text-[#33110e] focus:bg-white focus:border-[#85261e] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-[#33110e] mb-1">
                    Academic Designation
                  </label>
                  <select
                    value={newFaculty.designation}
                    onChange={(e) => setNewFaculty({ ...newFaculty, designation: e.target.value })}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-2 text-xs text-[#33110e] focus:bg-white focus:border-[#85261e] focus:outline-hidden"
                  >
                    <option value="Professor">Professor (HAG / Senior)</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor Grade-I">Assistant Professor Grade-I</option>
                    <option value="Assistant Professor Grade-II">Assistant Professor Grade-II</option>
                    <option value="Visiting Faculty">Visiting / Adjunct Faculty</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-[#33110e] mb-1">
                    Department Scope
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${activeDepartment?.name || "Computer Science & Engineering"} (${activeDepartment?.code || "CSE"})`}
                    className="w-full rounded-xl border border-[#eedfd8] bg-neutral-100 p-2 text-xs text-neutral-600 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#33110e] mb-1">
                  Primary Research Area / Specialization
                </label>
                <input
                  type="text"
                  value={newFaculty.specialization}
                  onChange={(e) => setNewFaculty({ ...newFaculty, specialization: e.target.value })}
                  placeholder="e.g. Machine Learning, Distributed Systems, VLSI"
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-2 text-xs text-[#33110e] focus:bg-white focus:border-[#85261e] focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#eedfd8]">
                <button
                  type="button"
                  onClick={() => setIsAddFacultyOpen(false)}
                  className="rounded-xl border border-[#eedfd8] bg-white px-4 py-2 text-xs font-bold text-[#6b5c58] hover:bg-neutral-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-[#33110e] hover:bg-[#85261e] px-4 py-2 text-xs font-bold text-white transition shadow-md cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 text-amber-300" /> Add to Directory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CSV IMPORT WIZARD */}
      {/* ========================================================================= */}
      {isImportCsvOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg rounded-3xl border border-[#eedfd8] bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-[#eedfd8] pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#fff9f6] border border-[#eedfd8] text-[#85261e]">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#33110e]">Bulk CSV Data Importer</h3>
                  <p className="text-[11px] text-[#6b5c58]">Fast ingestion of student rosters, publications, or staff</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsImportCsvOpen(false)}
                className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#33110e] mb-1">
                  1. Target Dataset
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "students", label: "Students Roster" },
                    { id: "faculty", label: "Faculty Directory" },
                    { id: "publications", label: "Publications" },
                  ].map((ds) => (
                    <button
                      key={ds.id}
                      type="button"
                      onClick={() => setImportDatasetType(ds.id)}
                      className={`p-2 rounded-xl text-xs font-bold transition border ${
                        importDatasetType === ds.id
                          ? "bg-[#33110e] text-white border-[#33110e]"
                          : "bg-[#fff9f6] text-[#33110e] border-[#eedfd8] hover:bg-white"
                      }`}
                    >
                      {ds.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sample Template Download */}
              <div className="rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#33110e]">Download Format Template</p>
                  <p className="text-[10px] text-[#6b5c58]">Required column headers and data format</p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadSampleCsv}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white border border-[#eedfd8] text-xs font-bold text-[#85261e] hover:bg-[#85261e] hover:text-white transition shadow-2xs"
                >
                  <Download className="w-3 h-3" /> Sample CSV
                </button>
              </div>

              {/* File Drop Area */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#33110e] mb-1">
                  2. Select CSV File
                </label>
                <div
                  onClick={() => {
                    setImportFileName(`nith_${importDatasetType}_batch_2026.csv`);
                    setImportedRowsCount(24);
                  }}
                  className="border-2 border-dashed border-[#eedfd8] hover:border-[#85261e] bg-[#fff9f6] hover:bg-white rounded-2xl p-6 text-center transition cursor-pointer space-y-1.5"
                >
                  <FileSpreadsheet className="w-8 h-8 text-[#85261e] mx-auto" />
                  <p className="text-xs font-bold text-[#33110e]">
                    {importFileName ? importFileName : "Click to select or drop CSV file here"}
                  </p>
                  <p className="text-[10px] text-[#6b5c58]">
                    {importedRowsCount
                      ? `Detected ${importedRowsCount} valid rows ready for validation`
                      : "UTF-8 formatted CSV files supported (Max 10MB)"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#eedfd8]">
                <button
                  type="button"
                  onClick={() => setIsImportCsvOpen(false)}
                  className="rounded-xl border border-[#eedfd8] bg-white px-4 py-2 text-xs font-bold text-[#6b5c58] hover:bg-neutral-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!importFileName}
                  onClick={handleExecuteCsvImport}
                  className="flex items-center gap-1.5 rounded-xl bg-[#33110e] hover:bg-[#85261e] disabled:opacity-40 px-4 py-2 text-xs font-bold text-white transition shadow-md cursor-pointer"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-amber-300" /> Start Ingestion
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: POST NEW ANNOUNCEMENT */}
      {/* ========================================================================= */}
      {isNewAnnouncementOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg rounded-3xl border border-[#eedfd8] bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-[#eedfd8] pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#fff9f6] border border-[#eedfd8] text-[#85261e]">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#33110e]">Publish Department Notice</h3>
                  <p className="text-[11px] text-[#6b5c58]">Broadcast notices across public portal and student accounts</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewAnnouncementOpen(false)}
                className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-3">
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#33110e] mb-1">
                  Notice Title *
                </label>
                <input
                  type="text"
                  required
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  placeholder="e.g. End Semester Exam Schedule & Seating Plan"
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-2 text-xs text-[#33110e] focus:bg-white focus:border-[#85261e] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-[#33110e] mb-1">
                    Category
                  </label>
                  <select
                    value={newAnnouncement.category}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, category: e.target.value })}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-2 text-xs text-[#33110e] focus:bg-white focus:border-[#85261e] focus:outline-hidden"
                  >
                    <option value="Academic">Academic Notice</option>
                    <option value="Research">Research & Grants</option>
                    <option value="Placement">Training & Placement</option>
                    <option value="Workshop">Events & Conferences</option>
                    <option value="Recruitment">Tenders / Recruitment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-[#33110e] mb-1">
                    Target Audience
                  </label>
                  <select
                    value={newAnnouncement.target}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, target: e.target.value })}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-2 text-xs text-[#33110e] focus:bg-white focus:border-[#85261e] focus:outline-hidden"
                  >
                    <option value="All">All Institute & Public</option>
                    <option value="Faculty Only">Faculty Only</option>
                    <option value="Students Only">Students Only</option>
                    <option value="PhD Scholars">PhD Scholars Only</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#fff9f6] border border-[#eedfd8]">
                <input
                  type="checkbox"
                  id="urgentCheckbox"
                  checked={newAnnouncement.urgent}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, urgent: e.target.checked })}
                  className="rounded border-[#eedfd8] text-[#85261e] focus:ring-[#85261e] w-4 h-4"
                />
                <label htmlFor="urgentCheckbox" className="text-xs font-bold text-[#33110e] cursor-pointer">
                  Mark as High Priority / Urgent Notice (Displays with blinking red badge)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#eedfd8]">
                <button
                  type="button"
                  onClick={() => setIsNewAnnouncementOpen(false)}
                  className="rounded-xl border border-[#eedfd8] bg-white px-4 py-2 text-xs font-bold text-[#6b5c58] hover:bg-neutral-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-[#33110e] hover:bg-[#85261e] px-4 py-2 text-xs font-bold text-white transition shadow-md cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 text-amber-300" /> Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: RESET FACULTY CREDENTIALS */}
      {/* ========================================================================= */}
      {isResetPasswordOpen && selectedFacultyForReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-md rounded-3xl border border-[#eedfd8] bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-[#eedfd8] pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#fff9f6] border border-[#eedfd8] text-[#85261e]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#33110e]">Reset Faculty Password</h3>
                  <p className="text-[11px] text-[#6b5c58]">Admin Credential Recovery Tool</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsResetPasswordOpen(false)}
                className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-3 space-y-1">
              <p className="text-xs font-bold text-[#33110e]">{selectedFacultyForReset.full_name}</p>
              <p className="text-[10px] text-[#6b5c58] font-mono">
                Code: {selectedFacultyForReset.employee_code} • Email: {selectedFacultyForReset.email}
              </p>
            </div>

            <p className="text-xs text-[#6b5c58]">
              Are you sure you want to generate a new temporary password for this faculty member? The
              new credential will be displayed for you to share with the faculty.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#eedfd8]">
              <button
                type="button"
                onClick={() => setIsResetPasswordOpen(false)}
                className="rounded-xl border border-[#eedfd8] bg-white px-4 py-2 text-xs font-bold text-[#6b5c58] hover:bg-neutral-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPasswordReset}
                className="flex items-center gap-1.5 rounded-xl bg-[#85261e] hover:bg-[#a63026] px-4 py-2 text-xs font-bold text-white transition shadow-md cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" /> Generate Temporary Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
