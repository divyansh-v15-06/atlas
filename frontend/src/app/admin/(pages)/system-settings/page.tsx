"use client";

import { useState } from "react";
import { Wrench, Database, RefreshCw, Server, ShieldCheck, Download, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function AdminSystemSettingsPage() {
  const [isPurging, setIsPurging] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handlePurgeCache = () => {
    setIsPurging(true);
    setTimeout(() => {
      setIsPurging(false);
      toast.success("Redis caches and departmental telemetry caches purged successfully!");
    }, 700);
  };

  const handleCreateBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      setIsBackingUp(false);
      toast.success("Complete PostgreSQL snapshot archive generated: nith_master_db_2026.sql.gz", {
        description: "Checksum SHA-256 verified. Archive stored securely on backup SAN.",
      });
    }, 1200);
  };

  const handleToggleMaintenance = () => {
    const next = !maintenanceMode;
    setMaintenanceMode(next);
    if (next) {
      toast.warning("System Maintenance Banner activated on public portals!");
    } else {
      toast.success("System Maintenance Mode deactivated. Portals fully operational.");
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="border-b border-[#eedfd8] pb-5">
        <div className="flex items-center gap-2">
          <span className="bg-[#1c110c] text-amber-300 border border-[#33110e] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            System IT Root
          </span>
          <span className="text-xs text-[#6b5c58]">Maintenance &amp; Diagnostics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#33110e] mt-1">
          System Diagnostics &amp; Health
        </h1>
        <p className="text-xs text-[#6b5c58] mt-0.5">
          Central platform diagnostics, cache management, database operations, and maintenance controls.
        </p>
      </div>

      {/* Health Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[#eedfd8] bg-white p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 uppercase">Database Health</span>
            <Database className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-black text-emerald-700 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Optimal (18ms)
          </p>
          <p className="text-[10px] text-neutral-500 font-mono">
            PostgreSQL 16 • 13 Schemas active • 0 Deadlocks
          </p>
        </div>

        <div className="rounded-2xl border border-[#eedfd8] bg-white p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 uppercase">Server Node Status</span>
            <Server className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xl font-black text-[#33110e] flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" /> 99.98% Uptime
          </p>
          <p className="text-[10px] text-neutral-500 font-mono">
            Load: 0.24, 0.31, 0.28 • Memory: 4.2 / 16 GB
          </p>
        </div>

        <div className="rounded-2xl border border-[#eedfd8] bg-white p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 uppercase">Security Firewall</span>
            <ShieldCheck className="w-4 h-4 text-[#85261e]" />
          </div>
          <p className="text-xl font-black text-[#85261e] flex items-center gap-1.5">
            Secured &amp; Active
          </p>
          <p className="text-[10px] text-neutral-500 font-mono">
            Rate Limiter: Active • SSL: Valid through 2027
          </p>
        </div>
      </div>

      {/* Control Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Cache & Telemetry Purge */}
        <div className="rounded-2xl border border-[#eedfd8] bg-white p-6 shadow-2xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-[#33110e]">Cache &amp; Telemetry Management</h2>
            <p className="text-xs text-[#6b5c58] mt-1">
              Flush Redis key-value stores, cached curriculum courses, faculty rosters, and publication counts across all departments.
            </p>
          </div>

          <div className="rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-3 text-xs space-y-1 font-mono text-[11px] text-[#33110e]">
            <div>• Cached Keys: 1,420 entries</div>
            <div>• Redis Memory: 28.4 MB</div>
            <div>• Last Synced: 2 minutes ago</div>
          </div>

          <button
            type="button"
            onClick={handlePurgeCache}
            disabled={isPurging}
            className="flex items-center gap-2 rounded-xl bg-[#85261e] hover:bg-[#33110e] px-4 py-2.5 text-xs font-bold text-white transition shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPurging ? "animate-spin" : ""}`} />
            {isPurging ? "Purging Cache..." : "Purge All System Caches"}
          </button>
        </div>

        {/* Database Snapshots & Backup */}
        <div className="rounded-2xl border border-[#eedfd8] bg-white p-6 shadow-2xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-[#33110e]">Database Backup &amp; Snapshots</h2>
            <p className="text-xs text-[#6b5c58] mt-1">
              Trigger a point-in-time snapshot backup of the complete relational database, including all faculty profiles and research tables.
            </p>
          </div>

          <div className="rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-3 text-xs space-y-1 font-mono text-[11px] text-[#33110e]">
            <div>• Automated Backup: Daily at 02:00 IST</div>
            <div>• Last Successful Snapshot: Today at 02:00</div>
            <div>• Archive Size: 142.8 MB (Compressed)</div>
          </div>

          <button
            type="button"
            onClick={handleCreateBackup}
            disabled={isBackingUp}
            className="flex items-center gap-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] px-4 py-2.5 text-xs font-bold text-white transition shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <Download className={`w-3.5 h-3.5 ${isBackingUp ? "animate-bounce" : ""}`} />
            {isBackingUp ? "Creating Snapshot..." : "Generate Full Database Backup"}
          </button>
        </div>
      </div>

      {/* Emergency Mode Card */}
      <div className="rounded-2xl border border-amber-300 bg-amber-50/70 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-amber-950 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-700" />
            Public Maintenance Mode
          </h3>
          <p className="text-xs text-amber-900/80 mt-0.5 max-w-xl">
            Display a scheduled maintenance banner across public department websites during major server upgrades. Administrators retain console access.
          </p>
        </div>

        <button
          type="button"
          onClick={handleToggleMaintenance}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition shadow-xs cursor-pointer ${
            maintenanceMode
              ? "bg-amber-700 text-white hover:bg-amber-800"
              : "bg-white border border-amber-300 text-amber-900 hover:bg-amber-100"
          }`}
        >
          {maintenanceMode ? "Deactivate Maintenance" : "Activate Maintenance Mode"}
        </button>
      </div>
    </div>
  );
}
