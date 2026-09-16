"use client";

import type { ReactNode } from "react";
import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/layouts/admin-sidebar";
import Link from "next/link";
import { Bell, ExternalLink, Settings, ShieldCheck, ShieldAlert, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDepartment } from "@/context/department-context";
import { toast } from "sonner";
import { getStoredAuthToken, getStoredAuthUser, isAdminUser, clearAuthSession } from "@/lib/auth-guard";
import apiClient from "@/lib/api-client";

/**
 * Authenticated admin pages layout — enforces administrative authentication & authorization.
 */
export default function AdminPagesLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authState, setAuthState] = useState<"checking" | "authorized" | "unauthorized">("checking");
  const [adminUser, setAdminUser] = useState<any>(null);
  const { activeDepartment, departments, selectDepartmentBySlug, setActiveDepartmentBySlug } = useDepartment();

  const verifyAdminAccess = useCallback(() => {
    const token = getStoredAuthToken();
    const user = getStoredAuthUser();

    if (!token || !user) {
      setAuthState("unauthorized");
      const target = pathname && pathname !== "/admin/login" ? `/admin/login?redirect=${encodeURIComponent(pathname)}` : "/admin/login";
      router.replace(target);
      return;
    }

    if (!isAdminUser(user)) {
      setAuthState("unauthorized");
      toast.error("Administrative privileges required. Please sign in with an administrator account.");
      const target = pathname && pathname !== "/admin/login" ? `/admin/login?error=unauthorized&redirect=${encodeURIComponent(pathname)}` : "/admin/login";
      router.replace(target);
      return;
    }

    setAdminUser(user);
    setAuthState("authorized");

    // Background validation with backend to detect revoked/expired tokens
    apiClient
      .get("/auth/me")
      .then((res) => {
        if (res.data?.data) {
          const freshUser = res.data.data;
          setAdminUser(freshUser);
          try {
            localStorage.setItem("auth_user", JSON.stringify(freshUser));
          } catch {}
        }
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          setAuthState("unauthorized");
          clearAuthSession();
          toast.error("Your administrator session has expired. Please sign in again.");
          const target = pathname && pathname !== "/admin/login" ? `/admin/login?error=session_expired&redirect=${encodeURIComponent(pathname)}` : "/admin/login";
          router.replace(target);
        }
      });
  }, [pathname, router]);

  useEffect(() => {
    verifyAdminAccess();

    const handleStorageChange = () => {
      verifyAdminAccess();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("nith_faculty_storage_update", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("nith_faculty_storage_update", handleStorageChange);
    };
  }, [verifyAdminAccess]);

  const handleSelectDepartment = (slug: string) => {
    const fn = selectDepartmentBySlug || setActiveDepartmentBySlug;
    if (typeof fn === "function") {
      fn(slug);
    }
  };

  // 1. Session verification in progress
  if (authState === "checking") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#faf6f3] px-4 font-sans selection:bg-[#85261e] selection:text-white">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-[#eedfd8] bg-white p-8 sm:p-10 shadow-xl max-w-sm text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff9f6] border border-[#eedfd8] text-[#85261e] shadow-xs">
            <Loader2 className="h-7 w-7 animate-spin" />
          </div>
          <div>
            <h2 className="text-base font-black text-[#1c110c] tracking-tight uppercase">Admin Verification</h2>
            <p className="mt-1 text-xs text-neutral-500 font-medium">Validating administrative credentials...</p>
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
            <h2 className="text-base font-black text-[#1c110c] tracking-tight uppercase">Access Restricted</h2>
            <p className="mt-1 text-xs text-neutral-600 font-medium">
              Administrator sign-in is required to access the Department Administration Console.
            </p>
          </div>
          <Link
            href={`/admin/login?redirect=${encodeURIComponent(pathname || "/admin")}`}
            className="w-full rounded-xl bg-[#33110e] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#85261e] transition shadow-xs flex items-center justify-center gap-2"
          >
            Go to Admin Login
          </Link>
        </div>
      </div>
    );
  }

  const isHod = adminUser?.role === "HOD_ADMIN" || adminUser?.roles?.includes("HOD_ADMIN");

  return (
    <div className="flex min-h-screen bg-[#faf6f3] font-sans">
      <AdminSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#eedfd8] bg-white px-6 shadow-2xs">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "border text-xs font-bold px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1.5 shadow-2xs",
                isHod
                  ? "bg-[#fff9f6] text-[#85261e] border-[#eedfd8]"
                  : "bg-[#1c110c] text-amber-300 border-[#33110e]"
              )}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              {isHod ? `${activeDepartment?.code || "CSE"} HOD Console` : "Central IT Console"}
            </span>

            <span className="text-xs text-neutral-300 hidden sm:inline">•</span>

            <h2 className="text-xs sm:text-sm font-bold text-[#1c110c] hidden sm:block">
              {isHod
                ? `Department of ${activeDepartment?.name || "Computer Science & Engineering"}`
                : "NIT Hamirpur Central Campus IT & Systems"}
            </h2>

            {/* If System Admin, show quick active department switcher */}
            {!isHod && departments && departments.length > 0 && (
              <div className="hidden md:flex items-center gap-1.5 ml-2 pl-3 border-l border-[#eedfd8]">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Inspecting:</span>
                <select
                  value={activeDepartment?.slug || "cse"}
                  onChange={(e) => handleSelectDepartment(e.target.value)}
                  className="rounded-lg border border-[#eedfd8] bg-[#fff9f6] px-2 py-0.5 text-xs font-bold text-[#33110e] hover:border-[#85261e] focus:outline-hidden cursor-pointer"
                >
                  {departments.map((d) => (
                    <option key={d.code} value={d.slug}>
                      {d.code} — {d.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {/* Notification Bell */}
            <button
              onClick={() =>
                toast.info(
                  isHod
                    ? "HOD Notice: 2 pending faculty research supervision entries awaiting approval."
                    : "System Notice: Database backup healthy, 13 departmental nodes online."
                )
              }
              className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-[#eedfd8] bg-[#fff9f6] text-[#6b5c58] hover:bg-[#33110e] hover:text-white transition cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#85261e] text-[7px] font-bold text-white animate-pulse">
                {isHod ? "2" : "1"}
              </span>
            </button>

            {/* Settings */}
            <Link
              href={isHod ? "/admin/credentials/facultiescredentials" : "/admin/system-settings"}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#eedfd8] bg-[#fff9f6] text-[#6b5c58] hover:bg-[#33110e] hover:text-white transition cursor-pointer"
              title={isHod ? "Faculty Credentials" : "System Settings"}
            >
              <Settings className="w-3.5 h-3.5" />
            </Link>

            {/* Public Website Link */}
            <Link
              href={`/?dept=${activeDepartment?.slug || "cse"}`}
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#33110e] hover:bg-[#85261e] text-white text-xs font-bold transition shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Public Site
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
