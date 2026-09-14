"use client";

import { useState } from "react";
import { Shield, Clock, Search, Filter, Download, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { toast } from "sonner";

interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: "SYSTEM_ADMIN" | "HOD_ADMIN" | "FACULTY";
  department?: string;
  action: string;
  targetEntity: string;
  ipAddress: string;
  status: "Success" | "Warning" | "Failed";
}

const INITIAL_LOGS: AuditLogEntry[] = [
  {
    id: "log-101",
    timestamp: "2026-09-14 18:42:15",
    actor: "Dr. Siddhartha Chauhan",
    role: "HOD_ADMIN",
    department: "CSE",
    action: "UPDATE_HOD_MESSAGE",
    targetEntity: "HOD Message & Vision CMS",
    ipAddress: "14.139.224.12",
    status: "Success",
  },
  {
    id: "log-102",
    timestamp: "2026-09-14 18:15:30",
    actor: "Dr. Siddhartha Chauhan",
    role: "HOD_ADMIN",
    department: "CSE",
    action: "ALLOCATE_COURSE_TEACHING",
    targetEntity: "CS-111 Section A & G to CS04",
    ipAddress: "14.139.224.12",
    status: "Success",
  },
  {
    id: "log-103",
    timestamp: "2026-09-14 17:05:10",
    actor: "System Administrator",
    role: "SYSTEM_ADMIN",
    action: "PURGE_REDIS_CACHE",
    targetEntity: "Telemetry & Multi-dept Cache",
    ipAddress: "14.139.224.2",
    status: "Success",
  },
  {
    id: "log-104",
    timestamp: "2026-09-14 15:20:00",
    actor: "Dr. Gargi Khanna",
    role: "HOD_ADMIN",
    department: "ECE",
    action: "GENERATE_FACULTY_CREDENTIAL",
    targetEntity: "Dr. Ashwani Rana (EC02)",
    ipAddress: "14.139.224.45",
    status: "Success",
  },
  {
    id: "log-105",
    timestamp: "2026-09-14 14:10:22",
    actor: "Guest Login Probe",
    role: "FACULTY",
    action: "FAILED_LOGIN_ATTEMPT",
    targetEntity: "Portal Authentication",
    ipAddress: "103.21.14.89",
    status: "Failed",
  },
  {
    id: "log-106",
    timestamp: "2026-09-14 11:30:45",
    actor: "System Administrator",
    role: "SYSTEM_ADMIN",
    action: "DATABASE_SNAPSHOT_BACKUP",
    targetEntity: "PostgreSQL 16 Cluster",
    ipAddress: "14.139.224.2",
    status: "Success",
  },
  {
    id: "log-107",
    timestamp: "2026-09-13 19:45:12",
    actor: "Dr. Siddhartha Chauhan",
    role: "HOD_ADMIN",
    department: "CSE",
    action: "PUBLISH_CIRCULAR",
    targetEntity: "Call for PhD Admissions 2026",
    ipAddress: "14.139.224.12",
    status: "Success",
  },
];

export default function AdminAuditLogsPage() {
  const [logs] = useState<AuditLogEntry[]>(INITIAL_LOGS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredLogs = logs.filter((l) => {
    const matchesSearch =
      l.actor.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.targetEntity.toLowerCase().includes(search.toLowerCase()) ||
      l.ipAddress.includes(search);

    if (!matchesSearch) return false;
    if (statusFilter === "all") return true;
    return l.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const handleExportLogs = () => {
    const csvRows = [
      ["ID", "Timestamp", "Actor", "Role", "Department", "Action", "Target", "IP Address", "Status"],
      ...filteredLogs.map((l) => [
        l.id,
        l.timestamp,
        l.actor,
        l.role,
        l.department || "CENTRAL",
        l.action,
        `"${l.targetEntity}"`,
        l.ipAddress,
        l.status,
      ]),
    ];
    const csv = csvRows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `NITH_Audit_Logs_${Date.now()}.csv`;
    a.click();
    toast.success("Security & Audit Logs exported to CSV successfully!");
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#eedfd8] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#1c110c] text-amber-300 border border-[#33110e] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              System Telemetry
            </span>
            <span className="text-xs text-[#6b5c58]">Campus Security &amp; Activity Trails</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#33110e] mt-1">
            System &amp; Security Audit Logs
          </h1>
          <p className="text-xs text-[#6b5c58] mt-0.5">
            Immutable log trail of administrative actions, HOD approvals, credentials, and system events.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportLogs}
          className="flex items-center gap-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] px-4 py-2.5 text-xs font-bold text-white transition shadow-sm cursor-pointer"
        >
          <Download className="w-4 h-4 text-amber-300" />
          Export Audit Trail (.csv)
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-[#eedfd8] bg-white px-3 py-1.5 w-full sm:w-72 shadow-2xs">
          <Search className="w-3.5 h-3.5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by actor, action, IP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs text-[#1c110c] placeholder:text-neutral-400 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-neutral-500 uppercase">Status:</span>
          {["all", "success", "failed"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold capitalize transition cursor-pointer ${
                statusFilter === s
                  ? "bg-[#33110e] text-white"
                  : "bg-white border border-[#eedfd8] text-neutral-600 hover:bg-[#fff9f6]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl border border-[#eedfd8] bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#eedfd8] bg-[#fff9f6] text-[10px] font-bold uppercase tracking-wider text-[#33110e]">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Actor &amp; Role</th>
                <th className="px-4 py-3">Action Type</th>
                <th className="px-4 py-3">Target / Entity</th>
                <th className="px-4 py-3">Source IP</th>
                <th className="px-4 py-3 text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eedfd8]/60 font-mono text-[11px]">
              {filteredLogs.map((l) => (
                <tr key={l.id} className="hover:bg-[#fff9f6]/60 transition">
                  <td className="px-4 py-3 text-neutral-500 font-normal">{l.timestamp}</td>
                  <td className="px-4 py-3 font-sans font-medium">
                    <div className="font-bold text-[#1c110c]">{l.actor}</div>
                    <span
                      className={`text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded font-mono ${
                        l.role === "SYSTEM_ADMIN"
                          ? "bg-amber-100 text-amber-900"
                          : l.role === "HOD_ADMIN"
                          ? "bg-rose-100 text-rose-900"
                          : "bg-neutral-100 text-neutral-700"
                      }`}
                    >
                      {l.role} {l.department ? `(${l.department})` : ""}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#85261e] font-bold">{l.action}</td>
                  <td className="px-4 py-3 font-sans text-neutral-700 max-w-xs truncate">{l.targetEntity}</td>
                  <td className="px-4 py-3 text-neutral-500">{l.ipAddress}</td>
                  <td className="px-4 py-3 text-right font-sans">
                    {l.status === "Success" && (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[10px]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Success
                      </span>
                    )}
                    {l.status === "Failed" && (
                      <span className="inline-flex items-center gap-1 text-red-700 font-bold text-[10px]">
                        <AlertTriangle className="w-3 h-3 text-red-600" /> Blocked
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
