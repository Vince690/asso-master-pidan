"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Bouton de suppression en deux temps, sans boîte de dialogue native. */
export default function ConfirmButton({
  action,
  children,
  confirmLabel = "Confirmer la suppression",
  className,
}: {
  action: () => Promise<void>;
  children: ReactNode;
  confirmLabel?: string;
  className?: string;
}) {
  const [armed, setArmed] = useState(false);
  if (!armed) {
    return (
      <button
        type="button"
        onClick={() => setArmed(true)}
        className={cn("rounded-lg px-3 py-1.5 text-sm text-fg-dim hover:bg-white/10 hover:text-red-200", className)}
      >
        {children}
      </button>
    );
  }
  return (
    <span className="inline-flex items-center gap-1">
      <form action={action}>
        <button type="submit" className="rounded-lg bg-red-500/20 px-3 py-1.5 text-sm text-red-200 hover:bg-red-500/30">
          {confirmLabel}
        </button>
      </form>
      <button type="button" onClick={() => setArmed(false)} className="rounded-lg px-2 py-1.5 text-sm text-fg-dim hover:text-fg">
        Annuler
      </button>
    </span>
  );
}
