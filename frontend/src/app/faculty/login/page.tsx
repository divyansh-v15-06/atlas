"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  GraduationCap,
  Lock,
  User,
  Loader2,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Building2,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import apiClient from "@/lib/api-client";
import { MOCK_FACULTY } from "@/lib/mock-data";
import { resolveFacultyDepartment } from "@/lib/faculty-storage";
import departmentsRegistry from "@/lib/departments-registry.json";

const facultyLoginSchema = z.object({
  identifier: z.string().min(2, "Enter your faculty code (e.g. CS01) or institute email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FacultyLoginInput = z.infer<typeof facultyLoginSchema>;

export default function FacultyLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FacultyLoginInput>({
    resolver: zodResolver(facultyLoginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: FacultyLoginInput) => {
    setLoading(true);
    try {
      // 1. Try real backend API
      try {
        const res = await apiClient.post("/auth/login", {
          identifier: data.identifier,
          password: data.password,
        });
        const token = res.data?.data?.token || res.data?.data?.access_token;
        if (token) {
          const userObj = res.data.data.user || { role: "FACULTY", email: data.identifier };
          localStorage.setItem("auth_token", token);
          localStorage.setItem(
            "auth_user",
            JSON.stringify({
              ...userObj,
              role: userObj.role || "FACULTY",
              roles: userObj.roles || ["FACULTY"],
            })
          );
          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("storage"));
            window.dispatchEvent(new CustomEvent("nith_faculty_storage_update"));
          }
          toast.success("Welcome to the Faculty Portal!");
          router.push("/faculty");
          return;
        }
      } catch (err) {
        console.warn("Backend API unavailable or invalid credentials, using client-side auth fallback:", err);
      }

      // 2. Client-side authentication fallback against seeded faculty or department code
      if (data.password !== "fac*123") {
        toast.error("Invalid password. Faculty password is fac*123");
        return;
      }

      const idLower = data.identifier.trim().toLowerCase();
      const match = MOCK_FACULTY.find(
        (f) =>
          f.employee_code?.toLowerCase() === idLower ||
          f.email?.toLowerCase() === idLower ||
          f.id?.toLowerCase() === idLower ||
          f.full_name?.toLowerCase().includes(idLower)
      );

      const resolvedDept = resolveFacultyDepartment(match, { employee_code: data.identifier, email: data.identifier });

      const facultyUser = match || {
        id: `fac-${data.identifier.toLowerCase()}`,
        user_id: `usr-${data.identifier.toLowerCase()}`,
        email: data.identifier.includes("@") ? data.identifier : `${data.identifier.toLowerCase()}@nith.ac.in`,
        full_name: data.identifier.toUpperCase().startsWith("EC")
          ? "Dr. Gargi Khanna (HOD, ECE)"
          : data.identifier.toUpperCase().startsWith("EE")
          ? "Dr. R. K. Jarial (HOD, EE)"
          : data.identifier.toUpperCase().startsWith("ME")
          ? "Dr. Sunand Kumar (HOD, ME)"
          : data.identifier.toUpperCase().startsWith("CE")
          ? "Dr. R. K. Sharma (HOD, CE)"
          : `Faculty Member (${data.identifier.toUpperCase()})`,
        employee_code: data.identifier.toUpperCase(),
        designation: "Professor",
        department_name: resolvedDept.name,
        department_code: resolvedDept.code,
        department_slug: resolvedDept.slug,
        roles: ["FACULTY"],
      };

      const sessionUser = {
        id: facultyUser.user_id || facultyUser.id,
        faculty_id: facultyUser.id,
        email: facultyUser.email,
        full_name: facultyUser.full_name,
        employee_code: facultyUser.employee_code,
        department_name: resolvedDept.name,
        department_code: resolvedDept.code,
        department_slug: resolvedDept.slug,
        role: "FACULTY",
        roles: ["FACULTY"],
      };

      localStorage.setItem("auth_token", `mock-faculty-jwt-${facultyUser.id}`);
      localStorage.setItem("active_department_slug", resolvedDept.slug);
      localStorage.setItem("auth_user", JSON.stringify(sessionUser));

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new CustomEvent("nith_faculty_storage_update"));
      }

      toast.success(`Welcome to the Department of ${resolvedDept.name} Portal!`);
      router.push("/faculty");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (code: string, email: string, name: string) => {
    setValue("identifier", code);
    setValue("password", "fac*123");
    toast.info(`Filled credentials for ${name} (${code}) — Password: fac*123`);
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
              Faculty Academic Suite
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#33110e] tracking-tight mt-0.5">
              Faculty Portal Login
            </h1>
            <p className="text-[11px] text-neutral-600 max-w-xs mx-auto">
              National Institute of Technology Hamirpur
            </p>
          </div>
        </div>

        {/* Quick Demo Faculty Profiles */}
        <div className="rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-3 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#33110e] flex items-center gap-1 text-[10px] uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#85261e]" /> Quick Demo Logins:
            </span>
            <span className="text-[9px] text-[#85261e] font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-[#eedfd8]">
              Password: fac*123
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-0.5">
            {[
              { code: "CS04", name: "Dr. Siddhartha", dept: "CSE" },
              { code: "EC01", name: "Dr. Gargi Khanna", dept: "ECE" },
              { code: "ME01", name: "Dr. Sunand Kumar", dept: "ME" },
              { code: "EE01", name: "Dr. R. K. Jarial", dept: "EE" },
              { code: "CE01", name: "Dr. R. K. Sharma", dept: "Civil" },
              { code: "CS01", name: "Prof. Lalit Awasthi", dept: "CSE" },
            ].map((fac) => (
              <button
                key={fac.code}
                type="button"
                onClick={() => handleQuickFill(fac.code, `${fac.code.toLowerCase()}@nith.ac.in`, `${fac.name} (${fac.dept})`)}
                className="text-left rounded-lg border border-[#eedfd8] bg-white p-1.5 text-[#33110e] hover:bg-[#33110e] hover:text-white transition duration-150 shadow-2xs group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[10px] truncate group-hover:text-amber-300">
                    {fac.code}
                  </span>
                  <span className="text-[8px] font-bold px-1 rounded bg-[#fff9f6] text-[#85261e] group-hover:bg-[#4a1814] group-hover:text-amber-200">
                    {fac.dept}
                  </span>
                </div>
                <div className="text-[9px] text-neutral-600 group-hover:text-neutral-200 truncate">
                  {fac.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 pt-0.5">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#33110e] mb-1">
              Faculty Code or Institute Email
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-400" />
              <input
                {...register("identifier")}
                type="text"
                placeholder="e.g. CS01, CS04 or name@nith.ac.in"
                className="w-full rounded-xl border border-[#eedfd8] bg-white py-2 pl-9 pr-3 text-xs text-[#1c110c] placeholder:text-neutral-400 transition focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
              />
            </div>
            {errors.identifier && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.identifier.message}</p>
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
                className="absolute right-3 top-2.5 text-neutral-400 hover:text-[#33110e] transition"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.password.message}</p>
            )}
            <div className="text-right mt-1">
              <Link
                href="/forgot-password"
                className="text-[10px] font-semibold text-[#85261e] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] py-2.5 text-xs font-bold text-white shadow-md hover:shadow-lg transition duration-150 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-300" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Faculty Portal</span>
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
