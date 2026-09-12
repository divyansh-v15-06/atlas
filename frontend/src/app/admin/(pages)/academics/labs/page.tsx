"use client";

import { useState, useMemo, useEffect } from "react";
import {
  FlaskConical,
  Plus,
  Trash2,
  Edit,
  Search,
  X,
  User,
  MapPin,
  Cpu,
  FileText,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { MOCK_LABS, MOCK_FACULTY, MOCK_STAFF } from "@/lib/mock-data";

interface LabItem {
  id: string;
  name: string;
  location: string;
  head: string;
  staff_incharge?: string;
  equipment_count: number;
  description: string;
  capacity?: number;
}

export default function AdminLabsPage() {
  const [labs, setLabs] = useState<LabItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nith_admin_labs");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return MOCK_LABS.map((l) => ({
      ...l,
      staff_incharge: "Sh. Ramesh Kumar",
      capacity: 35,
    }));
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("nith_admin_labs", JSON.stringify(labs));
    }
  }, [labs]);

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingLab, setEditingLab] = useState<LabItem | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    location: "Block C, Room 204",
    head: MOCK_FACULTY[0]?.full_name || "Prof. Lalit Kumar Awasthi",
    staff_incharge: "Sh. Ramesh Kumar",
    equipment_count: 30,
    capacity: 35,
    description: "",
  });

  const handleOpenAdd = () => {
    setModalMode("add");
    setEditingLab(null);
    setFormData({
      name: "",
      location: "Block C, Room 204",
      head: MOCK_FACULTY[0]?.full_name || "Prof. Lalit Kumar Awasthi",
      staff_incharge: "Sh. Ramesh Kumar",
      equipment_count: 30,
      capacity: 35,
      description: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (lab: LabItem) => {
    setModalMode("edit");
    setEditingLab(lab);
    setFormData({
      name: lab.name,
      location: lab.location,
      head: lab.head,
      staff_incharge: lab.staff_incharge || "Sh. Ramesh Kumar",
      equipment_count: lab.equipment_count || 0,
      capacity: lab.capacity || 35,
      description: lab.description || "",
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Laboratory Name is required");
      return;
    }

    if (modalMode === "add") {
      const newLab: LabItem = {
        id: `lab-${Date.now()}`,
        name: formData.name.trim(),
        location: formData.location.trim(),
        head: formData.head,
        staff_incharge: formData.staff_incharge,
        equipment_count: Number(formData.equipment_count) || 0,
        capacity: Number(formData.capacity) || 30,
        description: formData.description.trim(),
      };
      setLabs([newLab, ...labs]);
      toast.success("Laboratory facility added successfully");
    } else if (editingLab) {
      setLabs(
        labs.map((l) =>
          l.id === editingLab.id
            ? {
                ...l,
                name: formData.name.trim(),
                location: formData.location.trim(),
                head: formData.head,
                staff_incharge: formData.staff_incharge,
                equipment_count: Number(formData.equipment_count) || 0,
                capacity: Number(formData.capacity) || 30,
                description: formData.description.trim(),
              }
            : l
        )
      );
      toast.success("Laboratory facility updated");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove laboratory facility "${name}"?`)) {
      setLabs(labs.filter((x) => x.id !== id));
      toast.success("Laboratory record removed");
    }
  };

  const filtered = useMemo(() => {
    return labs.filter((l) => {
      const q = search.toLowerCase();
      return (
        !search ||
        l.name.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q) ||
        l.head.toLowerCase().includes(q)
      );
    });
  }, [labs, search]);

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold uppercase tracking-wider mb-2">
            <FlaskConical className="w-3.5 h-3.5" /> Department Facilities
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#1c110c] tracking-tight">
            Laboratories &amp; Research Facilities
          </h1>
          <p className="mt-1 text-sm text-[#5c4033]">
            Manage department computing labs, faculty in-charges, technical staff, and workstations.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#33110e] hover:bg-[#85261e] px-4 py-2.5 text-xs font-bold text-white transition shadow-2xs cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Laboratory
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#eedfd8] bg-white p-4 shadow-2xs">
          <span className="text-xs font-bold text-[#85261e] uppercase tracking-wider">Total Labs</span>
          <p className="text-2xl font-black text-[#1c110c] mt-1">{labs.length}</p>
        </div>
        <div className="rounded-xl border border-[#eedfd8] bg-white p-4 shadow-2xs">
          <span className="text-xs font-bold text-[#85261e] uppercase tracking-wider">Total Workstations</span>
          <p className="text-2xl font-black text-[#85261e] mt-1">
            {labs.reduce((sum, l) => sum + (l.capacity || 30), 0)}
          </p>
        </div>
        <div className="rounded-xl border border-[#eedfd8] bg-white p-4 shadow-2xs">
          <span className="text-xs font-bold text-[#85261e] uppercase tracking-wider">Equipments Deployed</span>
          <p className="text-2xl font-black text-[#1c110c] mt-1">
            {labs.reduce((sum, l) => sum + l.equipment_count, 0)}
          </p>
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
            placeholder="Search by lab name, room, or faculty in-charge..."
            className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] pl-10 pr-4 py-2 text-sm text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-none focus:ring-1 focus:ring-[#85261e]"
          />
        </div>
      </div>

      {/* Labs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((l) => (
          <div
            key={l.id}
            className="rounded-2xl border border-[#eedfd8] bg-white p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#85261e]/50 transition"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#85261e] bg-[#fff9f6] px-2.5 py-0.5 rounded-full border border-[#eedfd8]">
                    <MapPin className="w-3 h-3" /> {l.location}
                  </span>
                  <h3 className="font-extrabold text-base sm:text-lg text-[#1c110c] mt-2 leading-snug">
                    {l.name}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(l)}
                    className="p-1.5 rounded-lg border border-[#eedfd8] text-neutral-600 hover:bg-[#33110e] hover:text-white transition cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(l.id, l.name)}
                    className="p-1.5 rounded-lg border border-[#eedfd8] text-red-600 hover:bg-red-600 hover:text-white transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {l.description && (
                <p className="text-xs text-[#5c4033] leading-relaxed line-clamp-2">
                  {l.description}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-[#eedfd8]/60 grid grid-cols-2 gap-2 text-xs text-[#5c4033]">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Faculty In-Charge</span>
                <span className="font-bold text-[#1c110c] truncate block">{l.head}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Capacity / Units</span>
                <span className="font-mono font-bold text-[#85261e]">
                  {l.capacity || 30} Seats • {l.equipment_count} Assets
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD / EDIT LAB MODAL (Parity with adminModalLabs) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#eedfd8] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-[#fff9f6] border-b border-[#eedfd8] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-[#85261e] tracking-wider">
                  Facility Registry
                </span>
                <h3 className="text-lg font-black text-[#1c110c]">
                  {modalMode === "add" ? "Register New Laboratory" : "Edit Lab Details"}
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
                  Laboratory Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Artificial Intelligence & Vision Lab"
                  className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                    Room / Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Block C, Room 301"
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                    Student Capacity
                  </label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm font-mono focus:border-[#85261e] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                  Faculty In-Charge *
                </label>
                <select
                  value={formData.head}
                  onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                  className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                >
                  {MOCK_FACULTY.map((f) => (
                    <option key={f.id} value={f.full_name}>
                      {f.full_name} ({f.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                    Technical Staff In-Charge
                  </label>
                  <input
                    type="text"
                    value={formData.staff_incharge}
                    onChange={(e) => setFormData({ ...formData, staff_incharge: e.target.value })}
                    placeholder="e.g. Sh. Ramesh Kumar"
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                    Equipment Units Count
                  </label>
                  <input
                    type="number"
                    value={formData.equipment_count}
                    onChange={(e) => setFormData({ ...formData, equipment_count: Number(e.target.value) })}
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm font-mono focus:border-[#85261e] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                  Description &amp; Research Scope
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Computing clusters, software tools, and research activities..."
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
                  {modalMode === "add" ? "Register Lab" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
