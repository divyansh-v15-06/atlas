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
  ArrowLeft,
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
      const res = await apiClient.post("/auth/login", {
        email: data.email,
        password: data.password,
      });
      const token = res.data?.data?.token;
      if (token) {
        localStorage.setItem("auth_token", token);
        localStorage.setItem(
          "auth_user",
          JSON.stringify(res.data.data.user || { role: "ADMIN", email: data.email })
        );
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("storage"));
          window.dispatchEvent(new CustomEvent("nith_faculty_storage_update"));
        }
        toast.success("Signed in to Department Admin Console!");
        router.push("/admin");
        return;
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || "Invalid administrator email or password";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
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
