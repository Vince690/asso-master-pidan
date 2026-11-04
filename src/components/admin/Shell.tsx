import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AdminHeader({ title, lead, actions }: { title: string; lead?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[1.75rem] font-semibold tracking-tight text-fg">{title}</h1>
        {lead && <p className="mt-1 text-sm text-fg-muted">{lead}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("glass rounded-2xl", className)}>{children}</div>;
}

export function Notice({ ok, error }: { ok?: string | null; error?: string | null }) {
  if (!ok && !error) return null;
  return (
    <p className={cn("mb-6 rounded-xl px-4 py-3 text-sm", error ? "bg-red-500/10 text-red-200" : "bg-emerald-500/10 text-emerald-200")}>
      {error ?? ok}
    </p>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-dashed border-line p-10 text-center text-sm text-fg-muted">{children}</div>;
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "good" | "warn" | "info" }) {
  const tones = {
    neutral: "border-line text-fg-muted",
    good: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
    warn: "border-amber-500/40 bg-amber-500/10 text-amber-200",
    info: "border-electric-500/40 bg-electric-500/10 text-electric-200",
  };
  return <span className={cn("inline-flex rounded-full border px-2 py-0.5 font-mono text-[0.65rem]", tones[tone])}>{children}</span>;
}

export function Skeleton() {
  return (
    <div className="flex flex-col gap-3" aria-hidden>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-14 animate-pulse rounded-xl bg-white/5" />
      ))}
    </div>
  );
}
