"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Mail,
  ArrowLeft,
  Loader2,
  ArrowRight,
  KeyRound,
  CheckCircle2,
  Info,
} from "lucide-react";
import Link from "next/link";

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email address (e.g. cs01@nith.ac.in)"),
});
type ForgotInput = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotInput>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotInput) => {
    setLoading(true);
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
      const res = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json?.message || json?.error || "Could not process request.");
        return;
      }

      setSubmittedEmail(data.email);
      setSubmitted(true);
    } catch {
      // If backend is down, show a graceful message
      toast.info(
        "Could not reach the server. If your email is registered, a reset link would have been sent.",
        { duration: 6000 }
      );
      setSubmittedEmail(data.email);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#1c110c] via-[#33110e] to-[#4a1814] px-4 py-12 font-sans selection:bg-[#85261e] selection:text-white">
      {/* Ambient blurs */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#85261e]/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-amber-500/15 blur-3xl" />

      <div className="relative z-10 w-full max-w-md space-y-5 rounded-3xl border border-white/20 bg-white/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-[#fff9f6] border border-[#eedfd8] p-2 shadow-xs flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/nith.png"
              alt="NIT Hamirpur"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              NIT Hamirpur • Account Recovery
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#33110e] mt-1.5">
              Forgot Password?
            </h1>
            <p className="text-[11px] text-[#6b5c58] max-w-xs mx-auto mt-0.5">
              {submitted
                ? "Check your inbox for the reset link"
                : "Enter your registered institute email and we'll send a reset link"}
            </p>
          </div>
        </div>

        {/* Submitted Success State */}
        {submitted ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-emerald-800">
                  Reset link dispatched
                </p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  If <span className="font-mono font-semibold">{submittedEmail}</span> is
                  registered, a password reset link has been sent. Check your
                  spam folder if you don't see it.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                }}
                className="w-full rounded-xl border border-[#eedfd8] bg-white hover:bg-[#fff9f6] py-2 text-xs font-bold text-[#33110e] transition cursor-pointer"
              >
                Try a different email
              </button>
              <Link
                href="/login"
                className="block w-full rounded-xl bg-[#33110e] hover:bg-[#85261e] py-2.5 text-center text-xs font-bold text-white transition"
              >
                Back to Login
              </Link>
            </div>
          </div>
        ) : (
          /* Request Form */
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                Institute Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-400" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="yourname@nith.ac.in"
                  autoComplete="email"
                  className="w-full rounded-xl border border-[#eedfd8] bg-white py-2 pl-9 pr-3 text-xs text-[#1c110c] placeholder:text-neutral-400 transition focus:border-[#85261e] focus:outline-none focus:ring-1 focus:ring-[#85261e]"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] py-2.5 text-xs font-bold text-white shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-300" />
                  <span>Sending reset link…</span>
                </>
              ) : (
                <>
                  <KeyRound className="h-3.5 w-3.5 text-amber-300" />
                  <span>Send Password Reset Link</span>
                  <ArrowRight className="h-3.5 w-3.5 text-amber-300" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer */}
        {!submitted && (
          <div className="pt-1.5 text-center border-t border-[#eedfd8] space-y-1">
            <Link
              href="/faculty/login"
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#85261e] hover:underline"
            >
              <ArrowLeft className="w-3 h-3" /> Back to Faculty Login
            </Link>
            <span className="text-[#eedfd8] text-xs mx-2">·</span>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#85261e] hover:underline"
            >
              Admin Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

