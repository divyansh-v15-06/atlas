"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

const resetSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetInput = z.infer<typeof resetSchema>;

type TokenState = "validating" | "valid" | "invalid" | "expired";

export default function ResetPasswordPage() {
  const { id: token } = useParams<{ id: string }>();
  const router = useRouter();

  const [tokenState, setTokenState] = useState<TokenState>("validating");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetInput>({ resolver: zodResolver(resetSchema) });

  const newPasswordValue = watch("newPassword", "");

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setTokenState("invalid");
      return;
    }
    const validate = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
        const res = await fetch(`${apiUrl}/auth/validate-token`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const json = await res.json();
          if (json?.data?.success || json?.success) {
            setTokenState("valid");
          } else {
            setTokenState("invalid");
          }
        } else if (res.status === 401 || res.status === 410) {
          setTokenState("expired");
        } else {
          // If endpoint doesn't exist in our new backend, treat token as valid
          // (the reset endpoint itself will reject invalid tokens)
          setTokenState("valid");
        }
      } catch {
        // Backend unreachable — let user try; reset endpoint will validate
        setTokenState("valid");
      }
    };
    validate();
  }, [token]);

  const onSubmit = async (data: ResetInput) => {
    setSubmitting(true);
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
      const res = await fetch(`${apiUrl}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token,
          new_password: data.newPassword,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        const msg = json?.error || json?.message || "Failed to reset password.";
        if (msg.toLowerCase().includes("expired") || msg.toLowerCase().includes("invalid")) {
          setTokenState("expired");
        } else {
          toast.error(msg);
        }
        return;
      }

      setDone(true);
      toast.success("Password reset successfully!");
      setTimeout(() => router.push("/login"), 3000);
    } catch {
      toast.error("Could not connect to server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Password strength indicator
  const strength = (() => {
    const p = newPasswordValue;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-red-500", "bg-amber-500", "bg-yellow-400", "bg-emerald-500"][strength];

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#1c110c] via-[#33110e] to-[#4a1814] px-4 py-12 font-sans selection:bg-[#85261e] selection:text-white">
      <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#85261e]/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-amber-500/15 blur-3xl" />

      <div className="relative z-10 w-full max-w-md space-y-5 rounded-3xl border border-white/20 bg-white/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-[#fff9f6] border border-[#eedfd8] p-2 shadow-xs flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/nith.png" alt="NIT Hamirpur" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              NIT Hamirpur • Account Recovery
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#33110e] mt-1.5">
              {done ? "Password Updated!" : "Set New Password"}
            </h1>
          </div>
        </div>

        {/* Validating token */}
        {tokenState === "validating" && (
          <div className="flex flex-col items-center gap-3 py-8">
            <Loader2 className="w-8 h-8 text-[#85261e] animate-spin" />
            <p className="text-sm text-[#6b5c58]">Verifying your reset link…</p>
          </div>
        )}

        {/* Invalid / expired token */}
        {(tokenState === "invalid" || tokenState === "expired") && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-red-800">
                  {tokenState === "expired" ? "Link has expired" : "Invalid reset link"}
                </p>
                <p className="text-xs text-red-700 mt-0.5">
                  {tokenState === "expired"
                    ? "Password reset links are valid for 1 hour. Please request a new one."
                    : "This link is invalid or has already been used."}
                </p>
              </div>
            </div>
            <Link
              href="/forgot-password"
              className="block w-full rounded-xl bg-[#33110e] hover:bg-[#85261e] py-2.5 text-center text-xs font-bold text-white transition"
            >
              Request New Reset Link
            </Link>
            <div className="text-center">
              <Link href="/login" className="text-[11px] font-semibold text-[#85261e] hover:underline">
                Back to Login
              </Link>
            </div>
          </div>
        )}

        {/* Success done */}
        {done && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-emerald-800">Password updated successfully!</p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Redirecting you to the login page in 3 seconds…
                </p>
              </div>
            </div>
            <Link
              href="/login"
              className="block w-full rounded-xl bg-[#33110e] hover:bg-[#85261e] py-2.5 text-center text-xs font-bold text-white transition"
            >
              Go to Login →
            </Link>
          </div>
        )}

        {/* Reset Form */}
        {tokenState === "valid" && !done && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* New password */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-400" />
                <input
                  {...register("newPassword")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 chars, 1 uppercase, 1 number"
                  className="w-full rounded-xl border border-[#eedfd8] bg-white py-2 pl-9 pr-9 text-xs text-[#1c110c] placeholder:text-neutral-400 transition focus:border-[#85261e] focus:outline-none focus:ring-1 focus:ring-[#85261e]"
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
              {errors.newPassword && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.newPassword.message}</p>
              )}

              {/* Password strength bar */}
              {newPasswordValue && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength ? strengthColor : "bg-[#eedfd8]"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-[10px] font-semibold ${
                    strength <= 1 ? "text-red-600" : strength === 2 ? "text-amber-600" : "text-emerald-600"
                  }`}>
                    {strengthLabel}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-400" />
                <input
                  {...register("confirmPassword")}
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter your new password"
                  className="w-full rounded-xl border border-[#eedfd8] bg-white py-2 pl-9 pr-9 text-xs text-[#1c110c] placeholder:text-neutral-400 transition focus:border-[#85261e] focus:outline-none focus:ring-1 focus:ring-[#85261e]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-2.5 text-neutral-400 hover:text-[#33110e] transition cursor-pointer"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] py-2.5 text-xs font-bold text-white shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-300" />
                  <span>Updating password…</span>
                </>
              ) : (
                <>
                  <span>Reset My Password</span>
                  <ArrowRight className="h-3.5 w-3.5 text-amber-300" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer */}
        {!done && tokenState !== "validating" && (
          <div className="pt-1.5 text-center border-t border-[#eedfd8]">
            <Link
              href="/login"
              className="text-[11px] font-semibold text-[#85261e] hover:underline"
            >
              ← Return to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
