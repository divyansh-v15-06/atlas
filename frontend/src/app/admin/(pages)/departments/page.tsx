"use client";

import { useState } from "react";
import { Building2, ExternalLink, ArrowRight, ShieldCheck, Users, BookOpen, Layers } from "lucide-react";
import Link from "next/link";
import { useDepartment } from "@/context/department-context";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AdminDepartmentsPage() {
  const router = useRouter();
  const { departments, activeDepartment, setActiveDepartmentBySlug } = useDepartment();

  const handleInspectDepartment = (slug: string, name: string) => {
    setActiveDepartmentBySlug(slug);
    toast.success(`Active inspection scope set to ${name}!`);
    router.push("/admin");
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="border-b border-[#eedfd8] pb-5">
        <div className="flex items-center gap-2">
          <span className="bg-[#1c110c] text-amber-300 border border-[#33110e] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Multi-Department Master
          </span>
          <span className="text-xs text-[#6b5c58]">Institute Department Registry</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#33110e] mt-1">
          Academic Departments Registry
        </h1>
        <p className="text-xs text-[#6b5c58] mt-0.5">
          Central IT registry of all {departments?.length || 13} engineering, architecture, and sciences departments. Inspect and manage departmental consoles.
        </p>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments?.map((dept) => {
          const isCurrent = dept.slug === (activeDepartment?.slug || "cse");

          return (
            <div
              key={dept.id || dept.code}
              className={`rounded-2xl border p-5 transition shadow-2xs flex flex-col justify-between ${
                isCurrent
                  ? "border-[#85261e] bg-[#fff9f6] ring-2 ring-[#85261e]/20"
                  : "border-[#eedfd8] bg-white hover:border-[#33110e]/30"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-[#33110e] px-2 py-0.5 font-mono text-xs font-black text-amber-300">
                    {dept.code}
                  </span>
                  {isCurrent ? (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300">
                      Currently Selected
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold text-emerald-700 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-extrabold text-[#1c110c] text-sm leading-snug">
                    {dept.name}
                  </h3>
                  <p className="text-[11px] text-[#6b5c58] mt-1 line-clamp-2">
                    {dept.description || "Academic department delivering undergraduate, postgraduate, and doctoral curricula."}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-[10px] text-neutral-500 pt-2 border-t border-[#eedfd8]/50">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-[#85261e]" /> Faculty Roster
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-[#85261e]" /> Curricula
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 mt-3 border-t border-[#eedfd8]">
                <button
                  type="button"
                  onClick={() => handleInspectDepartment(dept.slug, dept.name)}
                  className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-1.5 text-xs font-bold transition cursor-pointer ${
                    isCurrent
                      ? "bg-[#33110e] text-white"
                      : "border border-[#eedfd8] bg-white text-[#33110e] hover:bg-[#33110e] hover:text-white"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {isCurrent ? "Managing Now" : "Inspect Dept"}
                </button>

                <Link
                  href={`/?dept=${dept.slug}`}
                  target="_blank"
                  className="rounded-xl border border-[#eedfd8] bg-white p-2 text-[#6b5c58] hover:text-[#33110e] hover:bg-[#fff9f6] transition cursor-pointer"
                  title="View Public Department Site"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
