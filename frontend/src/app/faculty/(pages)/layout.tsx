"use client";

import type { ReactNode } from "react";
import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FacultySidebar } from "@/components/layouts/faculty-sidebar";
import { MOCK_FACULTY } from "@/lib/mock-data";
import { resolveFacultyDepartment } from "@/lib/faculty-storage";
import Link from "next/link";
import { Download, ExternalLink, Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { getStoredAuthToken, getStoredAuthUser, isFacultyUser, clearAuthSession } from "@/lib/auth-guard";
import apiClient from "@/lib/api-client";

/**
 * Authenticated faculty pages layout — enforces faculty authentication & authorization.
 */
export default function FacultyPagesLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authState, setAuthState] = useState<"checking" | "authorized" | "unauthorized">("checking");
  const [user, setUser] = useState<any>(null);

  const verifyFacultyAccess = useCallback(() => {
    const token = getStoredAuthToken();
    const currentUser = getStoredAuthUser();

    if (!token || !currentUser) {
      setAuthState("unauthorized");
      const target = pathname && pathname !== "/faculty/login" ? `/faculty/login?redirect=${encodeURIComponent(pathname)}` : "/faculty/login";
      router.replace(target);
      return;
    }

    if (!isFacultyUser(currentUser)) {
      setAuthState("unauthorized");
      toast.error("Faculty access required. Please sign in with faculty credentials.");
      const target = pathname && pathname !== "/faculty/login" ? `/faculty/login?error=unauthorized&redirect=${encodeURIComponent(pathname)}` : "/faculty/login";
      router.replace(target);
      return;
    }

    setUser(currentUser);
    setAuthState("authorized");

    // Background validation with backend to detect revoked/expired tokens
    apiClient
      .get("/auth/me")
      .then((res) => {
        if (res.data?.data) {
          const freshUser = res.data.data;
          setUser(freshUser);
          try {
            localStorage.setItem("auth_user", JSON.stringify(freshUser));
          } catch {}
        }
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          setAuthState("unauthorized");
          clearAuthSession();
          toast.error("Your faculty session has expired. Please sign in again.");
          const target = pathname && pathname !== "/faculty/login" ? `/faculty/login?error=session_expired&redirect=${encodeURIComponent(pathname)}` : "/faculty/login";
          router.replace(target);
        }
      });
  }, [pathname, router]);

  useEffect(() => {
    verifyFacultyAccess();

    const handleStorageChange = () => {
      verifyFacultyAccess();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("nith_faculty_storage_update", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("nith_faculty_storage_update", handleStorageChange);
    };
  }, [verifyFacultyAccess]);

  // 1. Session verification in progress
  if (authState === "checking") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#faf6f3] px-4 font-sans selection:bg-[#85261e] selection:text-white">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-[#eedfd8] bg-white p-8 sm:p-10 shadow-xl max-w-sm text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff9f6] border border-[#eedfd8] text-[#85261e] shadow-xs">
            <Loader2 className="h-7 w-7 animate-spin" />
          </div>
          <div>
            <h2 className="text-base font-black text-[#1c110c] tracking-tight uppercase">Faculty Portal</h2>
            <p className="mt-1 text-xs text-neutral-500 font-medium">Verifying active session credentials...</p>
          </div>
        </div>
      </div>
    );
  }

  // 2. Unauthorized screen (displayed briefly before redirect or if redirect is interrupted)
  if (authState === "unauthorized") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#faf6f3] px-4 font-sans selection:bg-[#85261e] selection:text-white">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-[#eedfd8] bg-white p-8 sm:p-10 shadow-xl max-w-sm text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 border border-red-200 text-red-700 shadow-xs">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-base font-black text-[#1c110c] tracking-tight uppercase">Authentication Required</h2>
            <p className="mt-1 text-xs text-neutral-600 font-medium">
              You must sign in with your faculty code or institute email to access the faculty workspace.
            </p>
          </div>
          <Link
            href={`/faculty/login?redirect=${encodeURIComponent(pathname || "/faculty")}`}
            className="w-full rounded-xl bg-[#33110e] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#85261e] transition shadow-xs flex items-center justify-center gap-2"
          >
            Go to Faculty Login
          </Link>
        </div>
      </div>
    );
  }

  const activeFaculty =
    MOCK_FACULTY.find(
      (f) =>
        (user?.employee_code && f.employee_code?.toLowerCase() === user.employee_code?.toLowerCase()) ||
        (user?.email && f.email?.toLowerCase() === user.email?.toLowerCase()) ||
        (user?.faculty_id && (f.id === user.faculty_id || String(f.id) === String(user.faculty_id)))
    ) || {
      id: user?.id || user?.faculty_id || "faculty-user",
      full_name: user?.full_name || user?.name || "Faculty Member",
      designation: user?.designation || "Faculty",
      department: user?.department || "Computer Science & Engineering",
      employee_code: user?.employee_code || "",
      email: user?.email || "",
    };

  const facultyDept = resolveFacultyDepartment(activeFaculty, user);

  return (
    <div className="flex min-h-screen bg-[#faf6f3] font-sans">
      <FacultySidebar />
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#eedfd8] bg-white px-6 shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
              {facultyDept.code} Faculty Portal
            </span>
            <span className="text-xs text-neutral-400 hidden sm:inline">•</span>
            <h2 className="text-xs sm:text-sm font-bold text-[#1c110c] hidden sm:block">
              {activeFaculty.full_name} ({activeFaculty.designation})
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/faculty/export"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#eedfd8] bg-[#fff9f6] text-[#33110e] text-xs font-bold hover:bg-[#33110e] hover:text-white transition shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" /> Export CV
            </Link>

            <Link
              href={`/people/faculty/${activeFaculty.employee_code || activeFaculty.id}?dept=${facultyDept.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#33110e] hover:bg-[#85261e] text-white text-xs font-bold transition shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Public View
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
