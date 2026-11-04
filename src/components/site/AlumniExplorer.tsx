"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ALUMNI_FIELDS, type AlumniField, type Member } from "@/lib/types";
import { cn, promoLabel } from "@/lib/utils";
import { MemberList } from "./MemberCard";

/**
 * Annuaire explorable : filtre par métier, recherche par nom, structure ou poste,
 * et regroupement par promotion. Les anciens sans métier renseigné restent dans « Tous ».
 */
export default function AlumniExplorer({ alumni, initialField }: { alumni: Member[]; initialField?: AlumniField }) {
  const [field, setField] = useState<AlumniField | "all">(initialField ?? "all");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const c = new Map<AlumniField, number>();
    for (const m of alumni) if (m.field) c.set(m.field, (c.get(m.field) ?? 0) + 1);
    return c;
  }, [alumni]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return alumni.filter((m) => {
      if (field !== "all" && m.field !== field) return false;
      if (!q) return true;
      const hay = `${m.firstName} ${m.lastName} ${m.currentPosition ?? ""} ${m.currentCompany ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [alumni, field, query]);

  const promos = [...new Set(filtered.map((m) => m.promo))].sort((a, b) => b - a);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          <Chip active={field === "all"} onClick={() => setField("all")}>
            Tous <span className="ml-1 text-fg-dim">{alumni.length}</span>
          </Chip>
          {(Object.keys(ALUMNI_FIELDS) as AlumniField[])
            .filter((f) => counts.get(f))
            .map((f) => (
              <Chip key={f} active={field === f} onClick={() => setField(f)}>
                {ALUMNI_FIELDS[f]} <span className="ml-1 text-fg-dim">{counts.get(f)}</span>
              </Chip>
            ))}
        </div>
        <label className="relative block md:w-72">
          <Search size={15} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-fg-dim" />
          <input
            id="alumni-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nom, cabinet, entreprise…"
            className="w-full rounded-full border border-line bg-white/[0.04] py-2.5 pr-4 pl-10 text-sm text-fg outline-none placeholder:text-fg-dim focus:border-electric-400"
          />
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-3xl p-10 text-center text-fg-muted">Personne ne correspond à cette recherche.</div>
      ) : (
        promos.map((promo) => (
          <section key={promo} className="grid min-w-0 gap-4 md:grid-cols-[11rem_minmax(0,1fr)]">
            <h2 className="font-mono text-sm text-electric-300">Promotion {promoLabel(promo)}</h2>
            <MemberList members={filtered.filter((m) => m.promo === promo)} gridClassName="gap-3 sm:grid-cols-2 lg:grid-cols-3" />
          </section>
        ))
      )}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        active ? "border-fg bg-fg text-ink-0" : "border-line text-fg-muted hover:border-line-strong hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}
