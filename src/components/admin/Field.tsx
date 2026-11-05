import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const inputClass =
  "w-full rounded-xl border border-line bg-white/[0.04] px-3.5 py-2.5 text-[0.95rem] text-fg placeholder:text-fg-dim outline-none transition-[border-color,box-shadow] focus:border-line-strong";

export function Field({ label, hint, children, className }: { label: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-sm font-medium text-fg">{label}</span>
      {children}
      {hint && <span className="text-xs text-fg-dim">{hint}</span>}
    </label>
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(inputClass, className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(inputClass, "min-h-24 resize-y", className)} {...props} />;
}

export { default as Select } from "@/components/ui/Select";

export function FormMessage({ message, tone = "error" }: { message?: string | null; tone?: "error" | "success" }) {
  if (!message) return null;
  return (
    <p
      role="status"
      className={cn("rounded-xl px-4 py-3 text-sm", tone === "error" ? "bg-red-500/10 text-red-200" : "bg-emerald-500/10 text-emerald-200")}
    >
      {message}
    </p>
  );
}
