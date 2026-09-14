"use client";

import { useState } from "react";
import { Users, Shield, KeyRound, UserCheck, Plus, CheckCircle2, AlertCircle, RefreshCw, Lock } from "lucide-react";
import { toast } from "sonner";
import { useDepartment } from "@/context/department-context";

interface AdminAccount {
  id: string;
  name: string;
  email: string;
  role: "SYSTEM_ADMIN" | "HOD_ADMIN" | "FACULTY";
  department?: string;
  status: "Active" | "Suspended";
  lastLogin: string;
  mfaEnabled: boolean;
}

const INITIAL_ACCOUNTS: AdminAccount[] = [
  {
    id: "usr-01",
    name: "System Administrator",
    email: "admin@nith.ac.in",
    role: "SYSTEM_ADMIN",
    status: "Active",
    lastLogin: "Just now",
    mfaEnabled: true,
  },
  {
    id: "usr-02",
    name: "Dr. Siddhartha Chauhan",
    email: "hod@nith.ac.in",
    role: "HOD_ADMIN",
    department: "Computer Science & Engineering (CSE)",
    status: "Active",
    lastLogin: "Today, 18:30",
    mfaEnabled: true,
  },
  {
    id: "usr-03",
    name: "Dr. Gargi Khanna",
    email: "hod.ece@nith.ac.in",
    role: "HOD_ADMIN",
    department: "Electronics & Communication Engg (ECE)",
    status: "Active",
    lastLogin: "Yesterday, 14:15",
    mfaEnabled: false,
  },
  {
    id: "usr-04",
    name: "Dr. R. K. Jarial",
    email: "hod.ee@nith.ac.in",
    role: "HOD_ADMIN",
    department: "Electrical Engineering (EE)",
    status: "Active",
    lastLogin: "3 days ago",
    mfaEnabled: false,
  },
  {
    id: "usr-05",
    name: "Dr. Sunand Kumar",
    email: "hod.me@nith.ac.in",
    role: "HOD_ADMIN",
    department: "Mechanical Engineering (ME)",
    status: "Active",
    lastLogin: "5 days ago",
    mfaEnabled: false,
  },
  {
    id: "usr-06",
    name: "IT Directorate Support",
    email: "sysadmin@nith.ac.in",
    role: "SYSTEM_ADMIN",
    status: "Active",
    lastLogin: "Today, 09:12",
    mfaEnabled: true,
  },
];

export default function AdminUsersPage() {
  const { activeDepartment } = useDepartment();
  const [accounts, setAccounts] = useState<AdminAccount[]>(INITIAL_ACCOUNTS);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: "",
    email: "",
    role: "HOD_ADMIN" as "SYSTEM_ADMIN" | "HOD_ADMIN",
    department: "Computer Science & Engineering",
  });

  const filteredAccounts = accounts.filter((acc) => {
    if (roleFilter === "all") return true;
    return acc.role === roleFilter;
  });

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccount.name || !newAccount.email) {
      toast.error("Please provide both name and valid NITH email.");
      return;
    }

    const created: AdminAccount = {
      id: `usr-${Date.now()}`,
      name: newAccount.name,
      email: newAccount.email,
      role: newAccount.role,
      department: newAccount.role === "HOD_ADMIN" ? newAccount.department : undefined,
      status: "Active",
      lastLogin: "Never",
      mfaEnabled: false,
    };

    setAccounts([created, ...accounts]);
    toast.success(`Account for ${created.name} (${created.role}) created successfully!`);
    setIsCreateModalOpen(false);
    setNewAccount({
      name: "",
      email: "",
      role: "HOD_ADMIN",
      department: "Computer Science & Engineering",
    });
  };

  const handleResetPassword = (name: string, email: string) => {
    toast.success(`Password reset link generated and dispatched to ${email}`, {
      description: `Default temporary password set to admin*123 for ${name}`,
    });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#eedfd8] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#1c110c] text-amber-300 border border-[#33110e] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Central IT Security
            </span>
            <span className="text-xs text-[#6b5c58]">Access &amp; Role Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#33110e] mt-1">
            User Accounts &amp; Role Governance
          </h1>
          <p className="text-xs text-[#6b5c58] mt-0.5">
            Manage administrative privileges, HOD department assignments, and security credentials.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] px-4 py-2.5 text-xs font-bold text-white transition shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          Provision Admin / HOD
        </button>
      </div>

      {/* Role Summary Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[#eedfd8] bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 uppercase">System Administrators</span>
            <Shield className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-[#33110e] mt-2">
            {accounts.filter((a) => a.role === "SYSTEM_ADMIN").length}
          </p>
          <p className="text-[10px] text-neutral-400 mt-0.5">Full institute root &amp; database privileges</p>
        </div>

        <div className="rounded-2xl border border-[#eedfd8] bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 uppercase">HOD Administrators</span>
            <UserCheck className="w-4 h-4 text-[#85261e]" />
          </div>
          <p className="text-2xl font-black text-[#85261e] mt-2">
            {accounts.filter((a) => a.role === "HOD_ADMIN").length}
          </p>
          <p className="text-[10px] text-neutral-400 mt-0.5">Departmental academic &amp; teaching governance</p>
        </div>

        <div className="rounded-2xl border border-[#eedfd8] bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 uppercase">Faculty Portals</span>
            <KeyRound className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-[#33110e] mt-2">340+</p>
          <p className="text-[10px] text-neutral-400 mt-0.5">Self-service profile &amp; research accounts</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#eedfd8] pb-2">
        <button
          type="button"
          onClick={() => setRoleFilter("all")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            roleFilter === "all" ? "bg-[#33110e] text-white" : "text-[#6b5c58] hover:bg-[#fff9f6]"
          }`}
        >
          All Accounts ({accounts.length})
        </button>
        <button
          type="button"
          onClick={() => setRoleFilter("SYSTEM_ADMIN")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            roleFilter === "SYSTEM_ADMIN" ? "bg-[#33110e] text-white" : "text-[#6b5c58] hover:bg-[#fff9f6]"
          }`}
        >
          System Admins ({accounts.filter((a) => a.role === "SYSTEM_ADMIN").length})
        </button>
        <button
          type="button"
          onClick={() => setRoleFilter("HOD_ADMIN")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            roleFilter === "HOD_ADMIN" ? "bg-[#33110e] text-white" : "text-[#6b5c58] hover:bg-[#fff9f6]"
          }`}
        >
          Department HODs ({accounts.filter((a) => a.role === "HOD_ADMIN").length})
        </button>
      </div>

      {/* Accounts Table */}
      <div className="rounded-2xl border border-[#eedfd8] bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#eedfd8] bg-[#fff9f6] text-[10px] font-bold uppercase tracking-wider text-[#33110e]">
              <tr>
                <th className="px-5 py-3">Administrator</th>
                <th className="px-5 py-3">Role &amp; Jurisdiction</th>
                <th className="px-5 py-3">Status &amp; MFA</th>
                <th className="px-5 py-3">Last Active</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eedfd8]/60">
              {filteredAccounts.map((acc) => (
                <tr key={acc.id} className="hover:bg-[#fff9f6]/60 transition">
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-[#1c110c]">{acc.name}</div>
                    <div className="font-mono text-[10px] text-[#6b5c58]">{acc.email}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          acc.role === "SYSTEM_ADMIN"
                            ? "bg-amber-100 text-amber-900 border border-amber-300"
                            : "bg-rose-100 text-rose-900 border border-rose-300"
                        }`}
                      >
                        {acc.role === "SYSTEM_ADMIN" ? "System Admin" : "HOD Admin"}
                      </span>
                    </div>
                    {acc.department && (
                      <div className="text-[10px] text-neutral-500 mt-1">{acc.department}</div>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active
                      </span>
                      {acc.mfaEnabled && (
                        <span className="text-[8px] font-mono font-bold bg-neutral-100 text-neutral-600 px-1 py-0.2 rounded">
                          MFA ON
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-neutral-500 font-mono text-[11px]">{acc.lastLogin}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => handleResetPassword(acc.name, acc.email)}
                      className="inline-flex items-center gap-1 rounded-lg border border-[#eedfd8] bg-white px-2.5 py-1 text-[10.5px] font-semibold text-[#85261e] hover:bg-[#85261e] hover:text-white transition cursor-pointer"
                    >
                      <Lock className="w-3 h-3" /> Reset Access
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision Account Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-[#eedfd8] bg-white p-6 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-[#33110e]">Provision Administrator Account</h2>
            <form onSubmit={handleCreateAccount} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Jane Doe"
                  value={newAccount.name}
                  onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                  className="w-full rounded-xl border border-[#eedfd8] px-3 py-2 text-xs focus:border-[#85261e] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Official NITH Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. hod.chem@nith.ac.in"
                  value={newAccount.email}
                  onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                  className="w-full rounded-xl border border-[#eedfd8] px-3 py-2 text-xs focus:border-[#85261e] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Administrative Role
                </label>
                <select
                  value={newAccount.role}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, role: e.target.value as "SYSTEM_ADMIN" | "HOD_ADMIN" })
                  }
                  className="w-full rounded-xl border border-[#eedfd8] px-3 py-2 text-xs focus:border-[#85261e] focus:outline-hidden bg-white cursor-pointer"
                >
                  <option value="HOD_ADMIN">HOD Admin (Department Head)</option>
                  <option value="SYSTEM_ADMIN">System Admin (Central IT Root)</option>
                </select>
              </div>

              {newAccount.role === "HOD_ADMIN" && (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                    Assigned Department
                  </label>
                  <input
                    type="text"
                    value={newAccount.department}
                    onChange={(e) => setNewAccount({ ...newAccount, department: e.target.value })}
                    className="w-full rounded-xl border border-[#eedfd8] px-3 py-2 text-xs focus:border-[#85261e] focus:outline-hidden"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-xl border border-[#eedfd8] px-4 py-2 text-xs font-semibold text-[#6b5c58] hover:bg-neutral-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#33110e] hover:bg-[#85261e] px-4 py-2 text-xs font-bold text-white cursor-pointer"
                >
                  Provision Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
