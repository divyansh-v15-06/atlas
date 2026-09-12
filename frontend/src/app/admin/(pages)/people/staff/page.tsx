"use client";

import { useState, useMemo, useEffect } from "react";
import {
  UserCog,
  Plus,
  Trash2,
  Edit,
  Search,
  Download,
  X,
  Mail,
  Phone,
  Building2,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";
import Papa from "papaparse";
import { MOCK_STAFF } from "@/lib/mock-data";
import { Staff } from "@/lib/types";

export default function AdminStaffPage() {
  const [staffList, setStaffList] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nith_admin_staff");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return MOCK_STAFF.map((s, idx) => ({
      ...s,
      qualification: idx === 0 ? "B.Tech in CSE" : "Diploma in Computer Hardware & Networking",
      room_no: `CSE Block Room ${101 + idx}`,
    }));
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("nith_admin_staff", JSON.stringify(staffList));
    }
  }, [staffList]);

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingStaff, setEditingStaff] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    designation: "Senior Technical Assistant",
    email: "",
    phone: "+91-1972-254000",
    room_no: "CSE Block, Room 102",
    qualification: "B.Tech in Computer Science",
  });

  const handleOpenAdd = () => {
    setModalMode("add");
    setEditingStaff(null);
    setFormData({
      name: "",
      designation: "Senior Technical Assistant",
      email: "",
      phone: "+91-1972-254000",
      room_no: "CSE Block, Room 102",
      qualification: "B.Tech in Computer Science",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (st: any) => {
    setModalMode("edit");
    setEditingStaff(st);
    setFormData({
      name: st.name || "",
      designation: st.designation || "Technical Assistant",
      email: st.email || "",
      phone: st.phone || "+91-1972-254000",
      room_no: st.room_no || "CSE Block, Room 102",
      qualification: st.qualification || "Diploma in Computer Engineering",
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Staff Name is required");
      return;
    }

    if (modalMode === "add") {
      const newStaff = {
        id: `st-${Date.now()}`,
        name: formData.name.trim(),
        designation: formData.designation.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        room_no: formData.room_no.trim(),
        qualification: formData.qualification.trim(),
      };
      setStaffList([newStaff, ...staffList]);
      toast.success("Staff member record registered successfully");
    } else if (editingStaff) {
      setStaffList(
        staffList.map((st) =>
          st.id === editingStaff.id
            ? {
                ...st,
                name: formData.name.trim(),
                designation: formData.designation.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                room_no: formData.room_no.trim(),
                qualification: formData.qualification.trim(),
              }
            : st
        )
      );
      toast.success("Staff record updated");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove staff record "${name}"?`)) {
      setStaffList(staffList.filter((x) => x.id !== id));
      toast.success("Staff record removed");
    }
  };

  const handleExportCsv = () => {
    const csv = Papa.unparse(
      staffList.map((st) => ({
        Name: st.name,
        Designation: st.designation,
        Email: st.email,
        Phone: st.phone,
        "Room / Office": st.room_no || "",
        Qualification: st.qualification || "",
      }))
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `nith_staff_roster_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Staff roster exported to CSV");
  };

  const filtered = useMemo(() => {
    return staffList.filter((st) => {
      const q = search.toLowerCase();
      return (
        !search ||
        st.name?.toLowerCase().includes(q) ||
        st.designation?.toLowerCase().includes(q) ||
        st.email?.toLowerCase().includes(q)
      );
    });
  }, [staffList, search]);

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold uppercase tracking-wider mb-2">
            <UserCog className="w-3.5 h-3.5" /> Department Personnel
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#1c110c] tracking-tight">
            Staff Management
          </h1>
          <p className="mt-1 text-sm text-[#5c4033]">
            Maintain laboratory technical officers, assistants, and department administrative staff records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#eedfd8] bg-white px-3.5 py-2 text-xs font-bold text-[#33110e] hover:bg-[#fff9f6] transition shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#85261e]" /> Export CSV
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#33110e] hover:bg-[#85261e] px-4 py-2 text-xs font-bold text-white transition shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Staff Member
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="rounded-2xl border border-[#eedfd8] bg-white p-4 shadow-2xs">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#85261e]/60" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by staff name, designation, email..."
            className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] pl-10 pr-4 py-2 text-sm text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-none focus:ring-1 focus:ring-[#85261e]"
          />
        </div>
      </div>

      {/* Staff Table */}
      <div className="overflow-hidden rounded-2xl border border-[#eedfd8] bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#fff9f6] text-xs font-black uppercase text-[#33110e] border-b border-[#eedfd8]">
              <tr>
                <th className="px-6 py-4">Name &amp; Designation</th>
                <th className="px-6 py-4">Contact Channels</th>
                <th className="px-6 py-4">Assigned Room / Lab</th>
                <th className="px-6 py-4">Highest Qualification</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eedfd8]/60 text-[#1c110c]">
              {filtered.length > 0 ? (
                filtered.map((st) => (
                  <tr key={st.id} className="hover:bg-[#fff9f6]/60 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-sm text-[#1c110c]">{st.name}</p>
                      <p className="text-xs font-semibold text-[#85261e] mt-0.5">{st.designation}</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-[#5c4033]">
                      <div className="space-y-0.5">
                        {st.email && (
                          <p className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-[#85261e]" /> {st.email}
                          </p>
                        )}
                        {st.phone && (
                          <p className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-neutral-400" /> {st.phone}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-[#1c110c]">
                      {st.room_no || "CSE Department Office"}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-neutral-700">
                      {st.qualification || "Technical Diploma"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(st)}
                          className="p-1.5 rounded-lg border border-[#eedfd8] text-neutral-600 hover:bg-[#33110e] hover:text-white transition cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(st.id, st.name)}
                          className="p-1.5 rounded-lg border border-[#eedfd8] text-red-600 hover:bg-red-600 hover:text-white transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#5c4033]">
                    <UserCog className="w-8 h-8 mx-auto text-[#85261e]/40 mb-2" />
                    <p className="font-bold text-base">No staff records found</p>
                    <p className="text-xs text-neutral-400 mt-1">Try adjusting your search terms.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT STAFF MODAL (Parity with adminModalStaff) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#eedfd8] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-[#fff9f6] border-b border-[#eedfd8] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-[#85261e] tracking-wider">
                  Personnel Directory
                </span>
                <h3 className="text-lg font-black text-[#1c110c]">
                  {modalMode === "add" ? "Add Staff Member" : "Edit Staff Information"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:bg-[#eedfd8] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sh. Ramesh Kumar"
                  className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                    Designation *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g. Technical Assistant"
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                    Office / Room Assigned
                  </label>
                  <input
                    type="text"
                    value={formData.room_no}
                    onChange={(e) => setFormData({ ...formData, room_no: e.target.value })}
                    placeholder="e.g. CSE Block Room 204"
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="staff@nith.ac.in"
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91-1972-254..."
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                  Highest Qualification
                </label>
                <input
                  type="text"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  placeholder="e.g. B.Tech / Diploma in Computer Engineering"
                  className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#eedfd8]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#eedfd8] text-xs font-bold text-[#5c4033] hover:bg-[#fff9f6] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  {modalMode === "add" ? "Save Staff Record" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
