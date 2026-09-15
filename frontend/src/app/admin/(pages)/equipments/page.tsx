"use client";

import { useState, useMemo, useEffect } from "react";
import {
  MonitorSmartphone,
  Trash2,
  Edit,
  Plus,
  Search,
  Download,
  X,
  Building2,
  Calendar,
  Receipt,
  User,
  Wrench,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import Papa from "papaparse";
import { formatINR, formatCompactINR } from "@/lib/utils";
import { MOCK_LABS } from "@/lib/mock-data";

interface EquipmentAsset {
  id: string;
  name: string;
  lab: string;
  model: string;
  serial_number: string;
  invoice_number: string;
  indenter: string;
  vendor: string;
  vendor_address?: string;
  cost: number;
  purchase_date: string;
  academic_session: string;
  status: "Operational" | "Under Maintenance" | "Decommissioned";
}

interface Department {
  id: string;
  name: string;
  code: string;
  slug: string;
}

const DEFAULT_DEPARTMENTS: Department[] = [
  { id: "22222222-2222-2222-2222-222222222222", name: "Computer Science & Engineering", code: "CSE", slug: "cse" },
  { id: "22222222-2222-2222-2222-222222222223", name: "Electronics & Communication Engineering", code: "ECE", slug: "ece" },
  { id: "22222222-2222-2222-2222-222222222224", name: "Electrical Engineering", code: "EE", slug: "ee" },
  { id: "22222222-2222-2222-2222-222222222225", name: "Mechanical Engineering", code: "ME", slug: "me" },
  { id: "22222222-2222-2222-2222-222222222226", name: "Civil Engineering", code: "CE", slug: "ce" },
  { id: "22222222-2222-2222-2222-222222222227", name: "Chemical Engineering", code: "CHE", slug: "che" },
  { id: "22222222-2222-2222-2222-222222222228", name: "Material Science & Engineering", code: "MSE", slug: "mse" },
  { id: "22222222-2222-2222-2222-222222222229", name: "Department of Architecture", code: "ARCH", slug: "arch" },
];

const INITIAL_EQUIPMENT: EquipmentAsset[] = [
  {
    id: "eq-1",
    name: "Supermicro 4-Node GPU Server (NVIDIA A100 80GB)",
    lab: "High-Performance Cloud & Distributed Systems Lab",
    model: "SYS-420GP-TNBR",
    serial_number: "SM-A100-2023-091",
    invoice_number: "INV-NITH-CSE-2023-412",
    indenter: "Prof. Lalit Kumar Awasthi",
    vendor: "Netweb Technologies India Ltd.",
    vendor_address: "Plot 1, Electronic City, Gurugram, Haryana",
    cost: 3450000,
    purchase_date: "2023-11-15",
    academic_session: "2023-2024",
    status: "Operational",
  },
  {
    id: "eq-2",
    name: "Tesla V100 Deep Learning High-Speed Workstation",
    lab: "Artificial Intelligence & Medical Vision Lab",
    model: "Precision 7920 Tower",
    serial_number: "DEL-V100-8819",
    invoice_number: "INV-NITH-CSE-2022-108",
    indenter: "Dr. Kamlesh Dutta",
    vendor: "Dell Global Logistics India",
    vendor_address: "Cyber City, Bengaluru, Karnataka",
    cost: 1200000,
    purchase_date: "2022-08-20",
    academic_session: "2022-2023",
    status: "Operational",
  },
  {
    id: "eq-3",
    name: "FPGA Hardware Security & Cryptanalysis Rack",
    lab: "Cybersecurity & Blockchain Research Lab",
    model: "Xilinx UltraScale+ VCU118",
    serial_number: "XLX-VCU-40291",
    invoice_number: "INV-NITH-CSE-2024-055",
    indenter: "Dr. T P Sharma",
    vendor: "CoreEL Technologies Pvt Ltd",
    vendor_address: "Indiranagar, Bengaluru",
    cost: 850000,
    purchase_date: "2024-03-10",
    academic_session: "2023-2024",
    status: "Operational",
  },
  {
    id: "eq-4",
    name: "Cisco Catalyst 9300 Core Layer-3 Network Switches",
    lab: "High-Performance Cloud & Distributed Systems Lab",
    model: "C9300-48UXM",
    serial_number: "CSC-9300-8812",
    invoice_number: "INV-NITH-CSE-2024-019",
    indenter: "Dr. Narottam Chand",
    vendor: "Wipro Infotech Limited",
    vendor_address: "Phase II, Mohali, Punjab",
    cost: 620000,
    purchase_date: "2024-01-22",
    academic_session: "2023-2024",
    status: "Operational",
  },
];

export default function AdminEquipmentsPage() {
  const [departments, setDepartments] = useState<Department[]>(DEFAULT_DEPARTMENTS);
  const [selectedDeptId, setSelectedDeptId] = useState<string>("22222222-2222-2222-2222-222222222222");
  const [equipments, setEquipments] = useState<EquipmentAsset[]>(INITIAL_EQUIPMENT);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch departments list from API if available
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
    fetch(`${apiUrl}/departments`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json && Array.isArray(json.data) && json.data.length > 0) {
          setDepartments(
            json.data.map((d: any) => ({
              id: d.id,
              name: d.name,
              code: d.code,
              slug: d.slug,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  // Fetch equipment for selected department
  useEffect(() => {
    let isMounted = true;
    async function loadEquipmentForDept() {
      setIsLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
      try {
        const res = await fetch(`${apiUrl}/equipment?department_id=${selectedDeptId}`);
        if (res.ok) {
          const json = await res.json();
          const items = Array.isArray(json) ? json : json.data;
          if (Array.isArray(items) && items.length > 0) {
            const mapped: EquipmentAsset[] = items.map((d: any) => ({
              id: d.id,
              name: (d.name || "").replace(/^"|"$/g, ""),
              lab: d.lab_name || "Department Computing & Hardware Facility",
              model: d.asset_tag || "Institutional Asset",
              serial_number: d.invoice_number || `AST-${d.id.slice(0, 8)}`,
              invoice_number: d.invoice_number || "",
              indenter: d.indenter_name || "Department In-Charge",
              vendor: d.vendor_name || "Authorized Supplier",
              cost: Number(d.purchase_value) || 0,
              purchase_date: d.purchase_date || "",
              academic_session: "2023-2024",
              status: "Operational",
            }));
            if (isMounted) {
              setEquipments(mapped);
              setIsLoading(false);
              return;
            }
          }
        }
      } catch (err) {
        console.warn("Could not fetch equipment from API, using fallback store", err);
      }

      // Check localStorage scoped by department
      if (typeof window !== "undefined") {
        const savedDept = localStorage.getItem(`nith_admin_equipments_${selectedDeptId}`);
        if (savedDept) {
          try {
            const parsed = JSON.parse(savedDept);
            if (Array.isArray(parsed) && parsed.length > 0) {
              if (isMounted) {
                setEquipments(parsed);
                setIsLoading(false);
                return;
              }
            }
          } catch {}
        }
      }

      // Fallback: Initial equipment if CSE, else empty array
      if (isMounted) {
        const isCse = selectedDeptId === "22222222-2222-2222-2222-222222222222";
        setEquipments(isCse ? INITIAL_EQUIPMENT : []);
        setIsLoading(false);
      }
    }

    loadEquipmentForDept();
    return () => {
      isMounted = false;
    };
  }, [selectedDeptId]);

  // Persist local changes per department
  const saveEquipments = (updated: EquipmentAsset[]) => {
    setEquipments(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(`nith_admin_equipments_${selectedDeptId}`, JSON.stringify(updated));
    }
  };

  // Filters & Search
  const [search, setSearch] = useState("");
  const [labFilter, setLabFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingItem, setEditingItem] = useState<EquipmentAsset | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    lab: MOCK_LABS[0]?.name || "High-Performance Cloud & Distributed Systems Lab",
    model: "",
    serial_number: "",
    invoice_number: "",
    indenter: "Prof. Lalit Kumar Awasthi",
    vendor: "",
    vendor_address: "",
    cost: 500000,
    purchase_date: new Date().toISOString().split("T")[0],
    academic_session: "2024-2025",
    status: "Operational" as "Operational" | "Under Maintenance" | "Decommissioned",
  });

  const handleOpenAdd = () => {
    setModalMode("add");
    setEditingItem(null);
    setFormData({
      name: "",
      lab: MOCK_LABS[0]?.name || "High-Performance Cloud & Distributed Systems Lab",
      model: "",
      serial_number: "",
      invoice_number: "",
      indenter: "Prof. Lalit Kumar Awasthi",
      vendor: "",
      vendor_address: "",
      cost: 500000,
      purchase_date: new Date().toISOString().split("T")[0],
      academic_session: "2024-2025",
      status: "Operational",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (eq: EquipmentAsset) => {
    setModalMode("edit");
    setEditingItem(eq);
    setFormData({
      name: eq.name,
      lab: eq.lab,
      model: eq.model,
      serial_number: eq.serial_number,
      invoice_number: eq.invoice_number,
      indenter: eq.indenter,
      vendor: eq.vendor,
      vendor_address: eq.vendor_address || "",
      cost: eq.cost,
      purchase_date: eq.purchase_date,
      academic_session: eq.academic_session,
      status: eq.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Equipment Name is required");
      return;
    }

    if (modalMode === "add") {
      const newAsset: EquipmentAsset = {
        id: `eq-${Date.now()}`,
        name: formData.name.trim(),
        lab: formData.lab,
        model: formData.model.trim(),
        serial_number: formData.serial_number.trim(),
        invoice_number: formData.invoice_number.trim(),
        indenter: formData.indenter.trim(),
        vendor: formData.vendor.trim(),
        vendor_address: formData.vendor_address.trim(),
        cost: Number(formData.cost) || 0,
        purchase_date: formData.purchase_date,
        academic_session: formData.academic_session,
        status: formData.status,
      };
      saveEquipments([newAsset, ...equipments]);
      toast.success("Equipment logged in asset registry successfully");

      // Save to PostgreSQL via Go API
      const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
      fetch(`${apiUrl}/equipment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          department_id: selectedDeptId,
          name: formData.name.trim(),
          asset_tag: formData.model.trim() || undefined,
          quantity: 1,
          stock_in_use: 1,
          purchase_value: Number(formData.cost) || 0,
          purchase_date: formData.purchase_date,
          vendor_name: formData.vendor.trim() || undefined,
          invoice_number: formData.invoice_number.trim() || undefined,
          indenter_name: formData.indenter.trim() || undefined,
          contact_details: formData.vendor_address.trim() || undefined,
        }),
      }).catch((err) => console.warn("Backend API save skipped", err));
    } else if (editingItem) {
      saveEquipments(
        equipments.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                name: formData.name.trim(),
                lab: formData.lab,
                model: formData.model.trim(),
                serial_number: formData.serial_number.trim(),
                invoice_number: formData.invoice_number.trim(),
                indenter: formData.indenter.trim(),
                vendor: formData.vendor.trim(),
                vendor_address: formData.vendor_address.trim(),
                cost: Number(formData.cost) || 0,
                purchase_date: formData.purchase_date,
                academic_session: formData.academic_session,
                status: formData.status,
              }
            : item
        )
      );
      toast.success("Equipment record updated");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from the asset inventory?`)) {
      saveEquipments(equipments.filter((x) => x.id !== id));
      toast.success("Asset record removed");

      const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
      fetch(`${apiUrl}/equipment/${id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }).catch((err) => console.warn("Backend delete skipped", err));
    }
  };

  const handleExportCsv = () => {
    const csv = Papa.unparse(
      equipments.map((eq) => ({
        "Equipment Name": eq.name,
        Laboratory: eq.lab,
        "Make / Model": eq.model,
        "Serial / Stock No.": eq.serial_number,
        "Invoice No.": eq.invoice_number,
        Indenter: eq.indenter,
        Vendor: eq.vendor,
        "Cost (INR)": eq.cost,
        "Purchase Date": eq.purchase_date,
        "Academic Session": eq.academic_session,
        Status: eq.status,
      }))
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `nith_equipment_inventory_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Equipment asset inventory exported to CSV");
  };

  const filtered = useMemo(() => {
    return equipments.filter((eq) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        eq.name.toLowerCase().includes(q) ||
        eq.model.toLowerCase().includes(q) ||
        eq.serial_number.toLowerCase().includes(q) ||
        eq.indenter.toLowerCase().includes(q) ||
        eq.vendor.toLowerCase().includes(q);

      const matchesLab = labFilter === "ALL" || eq.lab === labFilter;
      const matchesStatus = statusFilter === "ALL" || eq.status === statusFilter;

      return matchesSearch && matchesLab && matchesStatus;
    });
  }, [equipments, search, labFilter, statusFilter]);

  const totalAssetValue = useMemo(() => {
    return equipments.reduce((sum, eq) => sum + eq.cost, 0);
  }, [equipments]);

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold uppercase tracking-wider mb-2">
            <MonitorSmartphone className="w-3.5 h-3.5" /> Department Assets
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#1c110c] tracking-tight">
            Lab Equipment &amp; Inventory
          </h1>
          <p className="mt-1 text-sm text-[#5c4033]">
            Track procurement records, invoices, indenters, and laboratory hardware assets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 bg-white border border-[#eedfd8] rounded-xl px-3 py-1.5 shadow-2xs">
            <Building2 className="w-4 h-4 text-[#85261e]" />
            <span className="text-xs font-bold text-neutral-500 hidden sm:inline">Dept:</span>
            <select
              value={selectedDeptId}
              onChange={(e) => setSelectedDeptId(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#33110e] focus:outline-none cursor-pointer"
            >
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.code} — {d.name}
                </option>
              ))}
            </select>
          </div>

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
            <Plus className="w-4 h-4" /> Add Equipment
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#eedfd8] bg-white p-4 shadow-2xs min-w-0 overflow-hidden" title={formatINR(totalAssetValue)}>
          <span className="text-xs font-bold text-[#85261e] uppercase tracking-wider truncate block">Total Value</span>
          <p className="text-xl sm:text-2xl font-black text-[#85261e] mt-1 font-mono tracking-tight truncate">
            {formatCompactINR(totalAssetValue)}
          </p>
        </div>
        <div className="rounded-xl border border-[#eedfd8] bg-white p-4 shadow-2xs min-w-0 overflow-hidden">
          <span className="text-xs font-bold text-[#85261e] uppercase tracking-wider truncate block">Total Assets</span>
          <p className="text-xl sm:text-2xl font-black text-[#1c110c] mt-1 font-mono tracking-tight truncate">{equipments.length}</p>
        </div>
        <div className="rounded-xl border border-[#eedfd8] bg-white p-4 shadow-2xs min-w-0 overflow-hidden">
          <span className="text-xs font-bold text-[#85261e] uppercase tracking-wider truncate block">Operational</span>
          <p className="text-xl sm:text-2xl font-black text-[#1c110c] mt-1 font-mono tracking-tight truncate">
            {equipments.filter((e) => e.status === "Operational").length}
          </p>
        </div>
        <div className="rounded-xl border border-[#eedfd8] bg-white p-4 shadow-2xs min-w-0 overflow-hidden">
          <span className="text-xs font-bold text-[#85261e] uppercase tracking-wider truncate block">Labs Covered</span>
          <p className="text-xl sm:text-2xl font-black text-[#1c110c] mt-1 font-mono tracking-tight truncate">
            {new Set(equipments.map((e) => e.lab)).size}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="rounded-2xl border border-[#eedfd8] bg-white p-4 shadow-2xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#85261e]/60" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, model, serial, vendor..."
            className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] pl-10 pr-4 py-2 text-sm text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-none focus:ring-1 focus:ring-[#85261e]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Lab Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#5c4033]">Lab:</span>
            <select
              value={labFilter}
              onChange={(e) => setLabFilter(e.target.value)}
              className="rounded-lg border border-[#eedfd8] bg-white px-3 py-1.5 text-xs font-bold text-[#1c110c] focus:outline-none focus:border-[#85261e] max-w-[200px] truncate"
            >
              <option value="ALL">All Laboratories</option>
              {Array.from(new Set(equipments.map((e) => e.lab))).map((lab) => (
                <option key={lab} value={lab}>
                  {lab}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#5c4033]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-[#eedfd8] bg-white px-3 py-1.5 text-xs font-bold text-[#1c110c] focus:outline-none focus:border-[#85261e]"
            >
              <option value="ALL">All Status</option>
              <option value="Operational">Operational</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Decommissioned">Decommissioned</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Asset Table */}
      <div className="overflow-hidden rounded-2xl border border-[#eedfd8] bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#fff9f6] text-xs font-black uppercase text-[#33110e] border-b border-[#eedfd8]">
              <tr>
                <th className="px-6 py-4">Equipment Name &amp; Model</th>
                <th className="px-6 py-4">Lab Assigned</th>
                <th className="px-6 py-4 font-mono">Invoice / Stock No.</th>
                <th className="px-6 py-4">Indenter &amp; Vendor</th>
                <th className="px-6 py-4 text-right">Cost (INR)</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eedfd8]/60 text-[#1c110c]">
              {filtered.length > 0 ? (
                filtered.map((eq) => (
                  <tr key={eq.id} className="hover:bg-[#fff9f6]/60 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-sm text-[#1c110c]">{eq.name}</p>
                        {eq.model && (
                          <p className="text-xs font-mono text-neutral-500 mt-0.5">Model: {eq.model}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-xs text-[#5c4033] max-w-[180px] truncate">
                      {eq.lab}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                      <div>
                        <span className="font-bold text-[#85261e]">{eq.invoice_number}</span>
                        {eq.serial_number && (
                          <p className="text-[11px] text-neutral-400">S/N: {eq.serial_number}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <p className="font-bold text-[#1c110c]">{eq.indenter}</p>
                      <p className="text-neutral-400 mt-0.5 truncate max-w-[160px]">{eq.vendor}</p>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-sm text-[#85261e]">
                      {formatINR(eq.cost)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                          eq.status === "Operational"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : eq.status === "Under Maintenance"
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        {eq.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(eq)}
                          className="p-1.5 rounded-lg border border-[#eedfd8] text-neutral-600 hover:bg-[#33110e] hover:text-white transition cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(eq.id, eq.name)}
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
                  <td colSpan={7} className="px-6 py-12 text-center text-[#5c4033]">
                    <MonitorSmartphone className="w-8 h-8 mx-auto text-[#85261e]/40 mb-2" />
                    <p className="font-bold text-base">No equipment assets found</p>
                    <p className="text-xs text-neutral-400 mt-1">Try adjusting your search or lab filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT EQUIPMENT MODAL (Parity with adminmodalEquipment) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#eedfd8] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-[#fff9f6] border-b border-[#eedfd8] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-[#85261e] tracking-wider">
                  Asset Management
                </span>
                <h3 className="text-lg font-black text-[#1c110c]">
                  {modalMode === "add" ? "Register Lab Equipment" : "Edit Equipment Details"}
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

            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                  Equipment / Instrument Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Supermicro 4-Node GPU Server"
                  className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                    Laboratory Assigned *
                  </label>
                  <select
                    value={formData.lab}
                    onChange={(e) => setFormData({ ...formData, lab: e.target.value })}
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                  >
                    {MOCK_LABS.map((lab) => (
                      <option key={lab.id} value={lab.name}>
                        {lab.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                    Make / Model
                  </label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="e.g. SYS-420GP-TNBR"
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                    Serial / Stock Number
                  </label>
                  <input
                    type="text"
                    value={formData.serial_number}
                    onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                    placeholder="e.g. SM-A100-2023-091"
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm font-mono focus:border-[#85261e] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                    Invoice Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.invoice_number}
                    onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                    placeholder="e.g. INV-NITH-CSE-2023-412"
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm font-mono focus:border-[#85261e] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                    Indenter (Faculty / Staff)
                  </label>
                  <input
                    type="text"
                    value={formData.indenter}
                    onChange={(e) => setFormData({ ...formData, indenter: e.target.value })}
                    placeholder="e.g. Prof. Lalit Kumar Awasthi"
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                    Purchase Cost (INR ₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm font-mono focus:border-[#85261e] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                    Vendor / Supplier
                  </label>
                  <input
                    type="text"
                    value={formData.vendor}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                    placeholder="e.g. Netweb Technologies Ltd"
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                    Operational Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as "Operational" | "Under Maintenance" | "Decommissioned",
                      })
                    }
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                  >
                    <option value="Operational">Operational</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                    <option value="Decommissioned">Decommissioned</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    value={formData.purchase_date}
                    onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                    Academic Session
                  </label>
                  <select
                    value={formData.academic_session}
                    onChange={(e) => setFormData({ ...formData, academic_session: e.target.value })}
                    className="w-full rounded-lg border border-[#eedfd8] px-3 py-2 text-sm focus:border-[#85261e] focus:outline-none"
                  >
                    <option value="2025-2026">2025-2026</option>
                    <option value="2024-2025">2024-2025</option>
                    <option value="2023-2024">2023-2024</option>
                    <option value="2022-2023">2022-2023</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#33110e] uppercase mb-1">
                  Vendor Address &amp; Contact Info
                </label>
                <textarea
                  rows={2}
                  value={formData.vendor_address}
                  onChange={(e) => setFormData({ ...formData, vendor_address: e.target.value })}
                  placeholder="Street, City, GSTIN, and support contact details..."
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
                  {modalMode === "add" ? "Register Asset" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
