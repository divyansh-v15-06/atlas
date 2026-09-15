"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Cpu,
  Search,
  Server,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  User,
  Zap,
  Layers,
  ArrowRight,
} from "lucide-react";
import { useDepartment } from "@/context/department-context";
import { DepartmentEmptyState } from "@/components/common/department-empty-state";
import { formatINR } from "@/lib/utils";

interface EquipmentAsset {
  id: string;
  name: string;
  lab: string;
  model: string;
  serial_number: string;
  invoice_number?: string;
  indenter: string;
  vendor: string;
  cost: number;
  purchase_date?: string;
  academic_session: string;
  status: "Operational" | "Under Maintenance" | "Decommissioned";
}

const FALLBACK_EQUIPMENT: EquipmentAsset[] = [
  {
    id: "eq-1",
    name: "Supermicro 4-Node GPU Server (NVIDIA A100 80GB)",
    lab: "High-Performance Cloud & Distributed Systems Lab",
    model: "SYS-420GP-TNBR",
    serial_number: "SM-A100-2023-091",
    indenter: "Prof. Lalit Kumar Awasthi",
    vendor: "Netweb Technologies India Ltd.",
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
    indenter: "Dr. Kamlesh Dutta",
    vendor: "Dell Global Logistics India",
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
    indenter: "Dr. T P Sharma",
    vendor: "CoreEL Technologies Pvt Ltd",
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
    indenter: "Dr. Narottam Chand",
    vendor: "Wipro Infotech Limited",
    cost: 620000,
    purchase_date: "2024-01-22",
    academic_session: "2023-2024",
    status: "Operational",
  },
];

export default function PublicEquipmentPage() {
  const { activeDepartment } = useDepartment();
  const isCse = activeDepartment.slug === "cse";
  const [equipments, setEquipments] = useState<EquipmentAsset[]>([]);
  const [search, setSearch] = useState("");
  const [labFilter, setLabFilter] = useState("ALL");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nith_admin_equipments");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setEquipments(isCse ? parsed : []);
            return;
          }
        } catch {}
      }
    }
    setEquipments(isCse ? FALLBACK_EQUIPMENT : []);
  }, [isCse]);

  // Unique lab options
  const labOptions = useMemo(() => {
    const set = new Set<string>();
    equipments.forEach((e) => {
      if (e.lab) set.add(e.lab);
    });
    return Array.from(set);
  }, [equipments]);

  // Filtered equipment list
  const filteredList = useMemo(() => {
    return equipments.filter((item) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        item.name.toLowerCase().includes(q) ||
        item.model.toLowerCase().includes(q) ||
        item.lab.toLowerCase().includes(q) ||
        item.indenter.toLowerCase().includes(q);

      const matchesLab = labFilter === "ALL" || item.lab === labFilter;

      return matchesSearch && matchesLab;
    });
  }, [equipments, search, labFilter]);

  // Total outlay
  const totalValuation = useMemo(() => {
    return equipments.reduce((sum, item) => sum + (item.cost || 0), 0);
  }, [equipments]);

  if (!isCse && equipments.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <DepartmentEmptyState
          sectionTitle={`Department of ${activeDepartment.name} Computing Infrastructure & Equipment`}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 bg-[#ffffff]">
      {/* 1. Header Banner */}
      <div className="bg-[#fff9f6] border-b border-[#eedfd8] py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center gap-2 text-xs font-bold text-[#85261e] uppercase tracking-wider mb-2">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            <Link href={`/aboutus?dept=${activeDepartment.slug}`} className="hover:underline">About Us</Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            <span>Computing Assets</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#33110e] tracking-tight">
                Computing Infrastructure &amp; Specialized Equipment
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-2xl">
                High-performance GPU servers, workstations, testbenches, and networking hardware in the Department of{" "}
                <strong>{activeDepartment.name}</strong>.
              </p>
            </div>

            {/* Metric Strip */}
            <div className="flex items-center gap-3 self-start md:self-auto">
              <div className="bg-white border border-[#eedfd8] rounded-xl px-4 py-2.5 shadow-2xs text-center">
                <span className="text-[10px] uppercase font-bold text-neutral-500 block">Total Outlay</span>
                <span className="text-base font-extrabold text-[#85261e]">{formatINR(totalValuation)}</span>
              </div>
              <div className="bg-white border border-[#eedfd8] rounded-xl px-4 py-2.5 shadow-2xs text-center">
                <span className="text-[10px] uppercase font-bold text-neutral-500 block">Live Assets</span>
                <span className="text-base font-extrabold text-[#33110e]">{equipments.length} Units</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Search & Lab Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search equipment by name, model, hardware rack, or lab..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#eedfd8] bg-white text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e] shadow-2xs"
            />
          </div>

          <select
            value={labFilter}
            onChange={(e) => setLabFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-[#eedfd8] bg-white text-xs font-semibold text-[#33110e] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e] shadow-2xs cursor-pointer"
          >
            <option value="ALL">All Specialized Laboratories ({equipments.length})</option>
            {labOptions.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Equipment Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {filteredList.length === 0 ? (
          <div className="p-12 text-center bg-[#fff9f6] rounded-2xl border border-[#eedfd8] space-y-2">
            <Cpu className="w-10 h-10 text-neutral-300 mx-auto" />
            <h3 className="text-sm font-bold text-[#33110e]">No equipment assets match your filter</h3>
            <p className="text-xs text-neutral-500">Try changing your search term or lab selection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredList.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#eedfd8] p-5 shadow-2xs hover:border-[#85261e] hover:shadow-xs transition space-y-3.5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  {/* Status & Lab Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-[10px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1.5">
                      <Building2 className="w-3 h-3 text-[#85261e]" />
                      <span>{item.lab}</span>
                    </span>

                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>{item.status}</span>
                    </span>
                  </div>

                  {/* Title & Model */}
                  <h3 className="text-base font-bold text-[#1c110c] leading-snug">
                    {item.name}
                  </h3>
                  <p className="font-mono text-xs text-neutral-500">
                    Model: <strong className="text-neutral-700">{item.model}</strong> • S/N: {item.serial_number}
                  </p>
                </div>

                {/* Specs & Procurement Breakdown */}
                <div className="pt-3 border-t border-[#eedfd8]/60 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase font-bold block">In-Charge / Indenter</span>
                    <span className="font-semibold text-[#1c110c] text-[11px] truncate block">
                      {item.indenter}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase font-bold block">Academic Session</span>
                    <span className="font-semibold text-[#1c110c] text-[11px] block">
                      {item.academic_session}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase font-bold block">Financial Value</span>
                    <span className="font-extrabold text-[#85261e] text-[11px] block">
                      {formatINR(item.cost)}
                    </span>
                  </div>
                </div>

                {/* Supplier Footer */}
                <div className="pt-2 border-t border-[#eedfd8]/40 flex items-center justify-between text-[11px] text-neutral-500">
                  <span>Vendor: {item.vendor}</span>
                  <Link
                    href={`/aboutus/labs?dept=${activeDepartment.slug}`}
                    className="text-[#85261e] font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <span>View Lab</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
