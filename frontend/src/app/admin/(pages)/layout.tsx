"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/layouts/admin-sidebar";
import Link from "next/link";
import { Bell, ExternalLink, Settings, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Authenticated admin pages layout — sidebar + content area.
 */
import { useDepartment } from "@/context/department-context";
import { toast } from "sonner";

export default function AdminPagesLayout({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<any>(null);
  const { activeDepartment } = useDepartment();

  useEffect(() => {
    const raw = localStorage.getItem("auth_user");
    if (raw) {
      try {
        setAdminUser(JSON.parse(raw));
      } catch {}
    }
  }, []);

  const isHod = adminUser?.role === "HOD_ADMIN" || adminUser?.roles?.includes("HOD_ADMIN");
  const { departments, setActiveDepartmentBySlug } = useDepartment();

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
                  onChange={(e) => setActiveDepartmentBySlug(e.target.value)}
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
