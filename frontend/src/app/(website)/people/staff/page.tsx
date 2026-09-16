"use client";

import { useState, useMemo, useEffect } from "react";
import { Mail, Phone, UserCog, Search, Building2, Wrench, ShieldCheck } from "lucide-react";
import { MOCK_STAFF } from "@/lib/mock-data";
import { useDepartment } from "@/context/department-context";
import { DepartmentEmptyState } from "@/components/common/department-empty-state";

const normalizeStaff = (s: any) => ({
  ...s,
  id: s.id || Math.random().toString(),
  name: s.name || s.full_name || "Staff Member",
  designation: s.designation || "Technical Assistant",
  email: s.email || "",
  phone: s.phone || "+91-1972-254000",
  photo_url: s.photo_url || s.photo || "",
  room_no: s.room_no || "CSE Block",
  qualification: s.qualification || "",
});

export default function StaffPage() {
  const { activeDepartment } = useDepartment();
  const [staffList, setStaffList] = useState<any[]>(() => MOCK_STAFF.map(normalizeStaff));
  const [search, setSearch] = useState("");
  const hasData = activeDepartment.slug === "cse";

  useEffect(() => {
    const loadStaff = async () => {
      // 1. First check localStorage
      let initialList = MOCK_STAFF.map(normalizeStaff);
      try {
        const saved = localStorage.getItem("nith_admin_staff");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            initialList = parsed.map(normalizeStaff);
            setStaffList(initialList);
          }
        }
      } catch {}

      // 2. Query live Go backend API
      try {
        const res = await fetch("/api/v1/staff");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            const liveList = json.data.map(normalizeStaff);
            const existingEmails = new Set(liveList.map((s: any) => s.email?.toLowerCase()).filter(Boolean));
            const extraLocal = initialList.filter(
              (s: any) => !existingEmails.has(s.email?.toLowerCase())
            );
            setStaffList([...liveList, ...extraLocal]);
          }
        }
      } catch (err) {
        console.warn("Could not fetch live staff from backend", err);
      }
    };

    loadStaff();
  }, [activeDepartment.slug]);

  const filteredStaff = useMemo(() => {
    if (!hasData) return [];
    return staffList.filter((staff) => {
      const q = search.toLowerCase();
      return (
        !search ||
        staff.name.toLowerCase().includes(q) ||
        staff.designation.toLowerCase().includes(q) ||
        staff.email.toLowerCase().includes(q)
      );
    });
  }, [search, hasData, staffList]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6 bg-white min-h-[85vh] font-sans">
      {/* Title Header */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <UserCog className="w-6 h-6 text-[#85261e]" />
              Technical &amp; Administrative Staff
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2 py-0.5 rounded uppercase">
              {activeDepartment.code}
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Laboratory technical officers, network system administrators, and executive staff of Department of{" "}
            {activeDepartment.name}.
          </p>
        </div>
      </div>

      {!hasData ? (
        <DepartmentEmptyState sectionTitle="Staff Directory Records" />
      ) : (
        <>
          {/* Search Bar */}
          <div className="bg-[#fff9f6] border border-[#eedfd8] rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search staff name or designation..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#eedfd8] bg-white text-[#33110e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
              />
            </div>

            <span className="text-xs text-neutral-600 font-semibold">
              Showing {filteredStaff.length} of {staffList.length} staff members
            </span>
          </div>

          {/* Staff Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStaff.map((staff) => (
              <div
                key={staff.id}
                className="rounded-2xl border border-[#eedfd8] bg-white p-5 shadow-xs hover:shadow-md transition space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-[#1c110c]">{staff.name}</h3>
                    <p className="text-xs font-semibold text-[#85261e]">{staff.designation}</p>
                  </div>
                  <span className="bg-[#fff9f6] text-[#33110e] border border-[#eedfd8] text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                    Staff
                  </span>
                </div>

                <div className="pt-2 border-t border-[#eedfd8]/60 space-y-1.5 text-xs text-neutral-600">
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#85261e]" />
                    <span>{staff.email}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#85261e]" />
                    <span>{staff.phone}</span>
                  </p>
                  <p className="flex items-center gap-2 text-[11px] text-neutral-500">
                    <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Department of {activeDepartment.name}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
