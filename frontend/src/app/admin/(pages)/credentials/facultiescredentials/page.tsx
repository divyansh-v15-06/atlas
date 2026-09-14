"use client";

import { useState } from "react";
import { KeyRound, RefreshCw, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { MOCK_FACULTY } from "@/lib/mock-data";

export default function AdminCredentialsPage() {
  const [resettingId, setResettingId] = useState<string | null>(null);

  const handleReset = (id: string, name: string) => {
    setResettingId(id);
    setTimeout(() => {
      setResettingId(null);
      toast.success(`Temporary password generated for ${name}: "fac*123"`);
    }, 600);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Faculty Credentials &amp; Password Resets</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate temporary password resets for faculty members and configure account access.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm divide-y divide-border/60">
        {MOCK_FACULTY.map((f) => (
          <div key={f.id} className="flex items-center justify-between p-5 hover:bg-accent/20 transition">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">{f.full_name}</p>
                <p className="text-xs text-muted-foreground font-mono">{f.employee_code} • {f.email}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleReset(f.id, f.full_name)}
              disabled={resettingId === f.id}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-accent transition"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${resettingId === f.id ? "animate-spin text-primary" : ""}`} />
              Reset Password
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
