"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  ShieldCheck,
  Lock,
  Mail,
  Loader2,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  ArrowLeft,
  KeyRound,
} from "lucide-react";
import Link from "next/link";
import apiClient from "@/lib/api-client";

const adminLoginSchema = z.object({
  email: z.string().min(3, "Enter your administrator username or email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AdminLoginInput = z.infer<typeof adminLoginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AdminLoginInput>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: AdminLoginInput) => {
    setLoading(true);
    try {
      // 1. Authenticate against live backend API
      try {
        const res = await apiClient.post("/auth/login", {
          email: data.email,
          password: data.password,
        });
        if (res.data?.data?.token) {
          localStorage.setItem("auth_token", res.data.data.token);
          localStorage.setItem(
            "auth_user",
            JSON.stringify(res.data.data.user || { role: "ADMIN", email: data.email })
          );
          toast.success("Signed in to Department Admin Console!");
          router.push("/admin");
          return;
        }
      } catch (err) {
        console.warn("Backend API unavailable, using administrator auth fallback:", err);
      }

      // 2. Client-side authentication fallback for admin console
      if (data.password !== "admin*123") {
        toast.error("Invalid credentials. Admin password is admin*123");
        return;
      }

      const isHod = data.email.toLowerCase().includes("hod");
      const isAdmin = data.email.toLowerCase().includes("admin") || data.email === "admin@nith.ac.in";

      if (isHod || isAdmin) {
        localStorage.setItem("auth_token", isHod ? "mock-hod-jwt-token-2026" : "mock-sysadmin-jwt-token-2026");
        localStorage.setItem(
          "auth_user",
          JSON.stringify({
            id: isHod ? "44444444-4444-4444-4444-444444444444" : "33333333-3333-3333-3333-333333333333",
            email: data.email,
            full_name: isHod ? "Dr. Siddhartha Chauhan (Head of Department)" : "System Administrator",
            role: isHod ? "HOD_ADMIN" : "SYSTEM_ADMIN",
            roles: isHod ? ["HOD_ADMIN", "DEPARTMENT_ADMIN"] : ["SYSTEM_ADMIN", "INSTITUTE_ADMIN"],
            department: isHod ? "CSE" : undefined,
          })
        );
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("storage"));
          window.dispatchEvent(new CustomEvent("nith_faculty_storage_update"));
        }
        if (isHod) {
          toast.success("Welcome back, Dr. Siddhartha Chauhan (Head of Department)!");
        } else {
          toast.success("Welcome back, System Administrator (Central IT Console)!");
        }
        router.push("/admin");
      } else {
        toast.error("Invalid admin email. Use admin@nith.ac.in (System Admin) or hod@nith.ac.in (HOD Admin)");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (email: string, pass: string, roleName: string) => {
    setValue("email", email);
    setValue("password", pass);
    toast.info(`Filled credentials for ${roleName} — Password: admin*123`);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#1c110c] via-[#33110e] to-[#4a1814] px-4 py-12 text-neutral-900 font-sans selection:bg-[#85261e] selection:text-white">
      {/* Decorative Ambient Background Blurs */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-[#85261e]/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-amber-500/15 blur-3xl" />

      <div className="relative z-10 w-full max-w-md space-y-4 rounded-3xl border border-white/20 bg-white/95 p-5 sm:p-7 shadow-2xl backdrop-blur-2xl">
        {/* Header Branding */}
        <div className="text-center space-y-1.5">
          <div className="mx-auto w-12 h-12 rounded-full bg-[#fff9f6] border border-[#eedfd8] p-2 shadow-2xs flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/nith.png"
              alt="NIT Hamirpur"
              className="w-full h-full object-contain filter drop-shadow-2xs"
            />
          </div>

          <div>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              NIT Hamirpur • Administrative Portal
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#33110e] mt-1">
              Admin Console Login
            </h1>
            <p className="text-[11px] text-[#6b5c58]">
              Select System Administrator or Department HOD to proceed
            </p>
          </div>
        </div>

        {/* Quick Demo Credentials Panel */}
        <div className="rounded-2xl border border-[#eedfd8] bg-[#fff9f6] p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#33110e]">
              <Sparkles className="w-3 h-3 text-[#85261e]" /> Select Login Persona
            </span>
            <span className="text-[9px] text-[#85261e] font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-[#eedfd8]">
              Password: admin*123
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <button
              type="button"
              onClick={() => handleQuickFill("admin@nith.ac.in", "admin*123", "System Administrator")}
              className="text-left rounded-xl border border-[#eedfd8] bg-white p-2.5 text-[#33110e] hover:bg-[#33110e] hover:text-white transition duration-150 shadow-2xs group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[10px] group-hover:text-amber-300">System Admin</span>
                <span className="text-[8px] font-extrabold uppercase px-1 py-0.2 rounded bg-amber-100 text-amber-900 group-hover:bg-amber-400/30 group-hover:text-amber-200">Central IT</span>
              </div>
              <div className="text-[9px] text-neutral-500 group-hover:text-neutral-200 truncate font-mono mt-0.5">
                admin@nith.ac.in
              </div>
              <div className="text-[8px] text-neutral-400 group-hover:text-neutral-300 mt-1">
                Multi-dept, users & audit logs
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill("hod@nith.ac.in", "admin*123", "HOD Admin (CSE)")}
              className="text-left rounded-xl border border-[#eedfd8] bg-white p-2.5 text-[#33110e] hover:bg-[#33110e] hover:text-white transition duration-150 shadow-2xs group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[10px] group-hover:text-amber-300">HOD Admin</span>
                <span className="text-[8px] font-extrabold uppercase px-1 py-0.2 rounded bg-rose-100 text-rose-900 group-hover:bg-rose-400/30 group-hover:text-rose-200">CSE Dept</span>
              </div>
              <div className="text-[9px] text-neutral-500 group-hover:text-neutral-200 truncate font-mono mt-0.5">
                hod@nith.ac.in
              </div>
              <div className="text-[8px] text-neutral-400 group-hover:text-neutral-300 mt-1">
                HOD desk, courses & faculty
              </div>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 pt-0.5">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#33110e] mb-1">
              Administrator Email or ID
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-400" />
              <input
                {...register("email")}
                type="text"
                placeholder="admin@nith.ac.in"
                className="w-full rounded-xl border border-[#eedfd8] bg-white py-2 pl-9 pr-3 text-xs text-[#1c110c] placeholder:text-neutral-400 transition focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#33110e] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-400" />
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-[#eedfd8] bg-white py-2 pl-9 pr-9 text-xs text-[#1c110c] placeholder:text-neutral-400 transition focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-neutral-400 hover:text-[#33110e] transition cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] py-2.5 text-xs font-bold text-white shadow-md hover:shadow-lg transition duration-150 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-300" />
                <span>Authenticating Admin...</span>
              </>
            ) : (
              <>
                <span>Sign In to Admin Console</span>
                <ArrowRight className="h-3.5 w-3.5 text-amber-300" />
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="pt-1.5 text-center border-t border-[#eedfd8]">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#85261e] hover:underline"
          >
            <ArrowLeft className="w-3 h-3" /> Return to Institute Website
          </Link>
        </div>
      </div>
    </div>
  );
}
