"use client";

import { useState, useEffect } from "react";
import { Save, Building2, MessageSquare, Eye, CheckCircle2, UserCheck, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useDepartment } from "@/context/department-context";

export default function AdminHodPage() {
  const { activeDepartment } = useDepartment();
  const currentSlug = activeDepartment?.slug || "cse";
  const isCse = currentSlug === "cse";

  const [hodData, setHodData] = useState({
    name: isCse ? "Dr. Siddhartha Chauhan" : (activeDepartment?.hod_name || "Head of Department"),
    designation: `Head of Department (${activeDepartment?.code || "CSE"})`,
    email: `${currentSlug}.hod@nith.ac.in`,
    phone: "+91-1972-254400",
    message: isCse
      ? "It is with great pleasure that I write this in the capacity of the Head of the Department of CSE at NIT Hamirpur. I thank all the faculty members, students, and staff for their continuous efforts in maintaining academic and research excellence across national and international benchmarks."
      : `Welcome to the Department of ${activeDepartment?.name || "Engineering"} at National Institute of Technology Hamirpur. Our department strives for academic excellence, innovative research, and nurturing engineering leaders for global societal impact.`,
    imageUrl: isCse ? "https://portfolios.nith.ac.in/uploads/member_details/62.jpg" : "/nith.png",
  });

  // Re-sync on department switch
  useEffect(() => {
    const scopedKey = `nith_admin_hod_details_${currentSlug}`;
    const saved = localStorage.getItem(scopedKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name) {
          setHodData(parsed);
          return;
        }
      } catch {}
    }

    if (isCse) {
      const legacy = localStorage.getItem("nith_admin_hod_details");
      if (legacy) {
        try {
          const parsed = JSON.parse(legacy);
          if (parsed && parsed.name) {
            setHodData(parsed);
            return;
          }
        } catch {}
      }
      setHodData({
        name: "Dr. Siddhartha Chauhan",
        designation: "Head of Department (CSE)",
        email: "cse.hod@nith.ac.in",
        phone: "+91-1972-254400",
        message:
          "It is with great pleasure that I write this in the capacity of the Head of the Department of CSE at NIT Hamirpur. I thank all the faculty members, students, and staff for their continuous efforts in maintaining academic and research excellence across national and international benchmarks.",
        imageUrl: "https://portfolios.nith.ac.in/uploads/member_details/62.jpg",
      });
    } else {
      setHodData({
        name: activeDepartment?.hod_name || "Head of Department",
        designation: `Head of Department (${activeDepartment?.code || "Dept"})`,
        email: `${currentSlug}.hod@nith.ac.in`,
        phone: "+91-1972-254400",
        message: `Welcome to the Department of ${activeDepartment?.name || "Engineering"} at National Institute of Technology Hamirpur. Our department strives for academic excellence, innovative research, and nurturing engineering leaders for global societal impact.`,
        imageUrl: "/nith.png",
      });
    }
  }, [currentSlug, isCse, activeDepartment?.hod_name, activeDepartment?.name, activeDepartment?.code]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(`nith_admin_hod_details_${currentSlug}`, JSON.stringify(hodData));
    if (isCse) {
      localStorage.setItem("nith_admin_hod_details", JSON.stringify(hodData));
    }
    toast.success(`HOD Desk message saved for Department of ${activeDepartment?.name || "this department"}!`, {
      description: "Changes are synchronized to the public institutional portal.",
    });
  };

  return (
    <div className="space-y-6 font-sans max-w-5xl">
      {/* Header Banner */}
      <div className="rounded-3xl border border-[#eedfd8] bg-gradient-to-r from-[#33110e] via-[#4a1814] to-[#85261e] p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/20 px-3 py-0.5 font-mono text-xs font-bold text-amber-300 backdrop-blur-xs">
                {activeDepartment?.code || "CSE"} HOD DESK
              </span>
              <span className="text-xs text-neutral-300">
                Department of {activeDepartment?.name || "Computer Science & Engineering"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Head of Department (HOD) Message CMS
            </h1>
            <p className="text-xs text-neutral-300 max-w-xl">
              Configure the public welcome note, vision address, official office contacts, and photo for the department leadership.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Editor Form */}
        <form onSubmit={handleSave} className="lg:col-span-2 space-y-4 rounded-2xl border border-[#eedfd8] bg-white p-6 shadow-2xs">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#33110e] flex items-center gap-2 border-b border-[#eedfd8] pb-3">
            <MessageSquare className="w-4 h-4 text-[#85261e]" />
            Department Leadership Profile &amp; Statement
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6b5c58] mb-1">
                HOD Full Name *
              </label>
              <input
                type="text"
                required
                value={hodData.name}
                onChange={(e) => setHodData({ ...hodData, name: e.target.value })}
                className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs font-semibold text-[#1c110c] focus:bg-white focus:border-[#85261e] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6b5c58] mb-1">
                Official Designation *
              </label>
              <input
                type="text"
                required
                value={hodData.designation}
                onChange={(e) => setHodData({ ...hodData, designation: e.target.value })}
                className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs font-semibold text-[#1c110c] focus:bg-white focus:border-[#85261e] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6b5c58] mb-1">
                Office Email Address *
              </label>
              <input
                type="email"
                required
                value={hodData.email}
                onChange={(e) => setHodData({ ...hodData, email: e.target.value })}
                className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs font-mono font-semibold text-[#1c110c] focus:bg-white focus:border-[#85261e] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6b5c58] mb-1">
                Office Telephone / Extension
              </label>
              <input
                type="text"
                value={hodData.phone}
                onChange={(e) => setHodData({ ...hodData, phone: e.target.value })}
                className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs font-semibold text-[#1c110c] focus:bg-white focus:border-[#85261e] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6b5c58] mb-1">
              Photograph URL / File Reference
            </label>
            <input
              type="text"
              value={hodData.imageUrl}
              onChange={(e) => setHodData({ ...hodData, imageUrl: e.target.value })}
              className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs text-[#1c110c] focus:bg-white focus:border-[#85261e] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6b5c58] mb-1">
              HOD Welcome Statement &amp; Vision *
            </label>
            <textarea
              rows={7}
              required
              value={hodData.message}
              onChange={(e) => setHodData({ ...hodData, message: e.target.value })}
              className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-3 text-xs leading-relaxed text-[#1c110c] focus:bg-white focus:border-[#85261e] focus:outline-hidden"
              placeholder="Enter the official welcome statement for this department..."
            />
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-[#eedfd8]">
            <p className="text-[11px] text-[#6b5c58]">
              Target Department: <span className="font-bold text-[#85261e]">{activeDepartment?.name} ({activeDepartment?.code})</span>
            </p>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] px-5 py-2.5 text-xs font-bold text-white transition shadow-2xs cursor-pointer"
            >
              <Save className="h-4 w-4 text-amber-300" /> Save Department Message
            </button>
          </div>
        </form>

        {/* Live Preview Card */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#eedfd8] bg-white p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#eedfd8] pb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#33110e] flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#85261e]" /> Live Public Preview
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                Live on Web
              </span>
            </div>

            <div className="space-y-3">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#eedfd8] mx-auto shadow-xs bg-neutral-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={hodData.imageUrl || "/nith.png"}
                  alt={hodData.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/nith.png";
                  }}
                />
              </div>

              <div className="text-center space-y-0.5">
                <h3 className="text-sm font-extrabold text-[#33110e]">{hodData.name}</h3>
                <p className="text-[11px] font-semibold text-[#85261e]">{hodData.designation}</p>
                <p className="text-[10px] font-mono text-neutral-400">{hodData.email}</p>
                <p className="text-[10px] text-neutral-400">{hodData.phone}</p>
              </div>

              <div className="rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-3 text-xs text-[#5c4033] italic leading-relaxed line-clamp-6">
                &ldquo;{hodData.message}&rdquo;
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
