"use client";

import { useState } from "react";
import type { Block } from "@/lib/master";
import { cn } from "@/lib/utils";

/** Maquette par semestre : deux onglets centrés, un seul semestre affiché à la fois. */
export default function CurriculumTabs({ blocks }: { blocks: Block[] }) {
  const [semester, setSemester] = useState<3 | 4>(3);
  const totals = { 3: { ects: 26, hours: 165 }, 4: { ects: 34, hours: 212 } } as const;
  const shown = blocks.filter((b) => b.semester === semester);

  return (
    <div>
      <div className="mb-8 flex justify-center">
        <div className="glass inline-flex rounded-full p-1" role="tablist" aria-label="Semestre">
          {([3, 4] as const).map((s) => (
            <button
              key={s}
              type="button"
              role="tab"
              aria-selected={semester === s}
              onClick={() => setSemester(s)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-colors",
                semester === s ? "bg-fg text-ink-0" : "text-fg-muted hover:text-fg",
              )}
            >
              Semestre {s}
              <span className={cn("ml-2 font-mono text-xs", semester === s ? "text-ink-0/60" : "text-fg-dim")}>
                {totals[s].ects} ECTS · {totals[s].hours} h
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {shown.map((b) => (
          <article key={b.id} className="glass glass-edge flex flex-col rounded-3xl p-6 md:p-7">
            <header className="flex items-start justify-between gap-4">
              <div>
                <h4 className="text-[1.15rem] leading-snug font-semibold tracking-tight text-fg text-balance">{b.title}</h4>
                <p className="mt-1.5 text-sm text-fg-muted">{b.intent}</p>
              </div>
              <span className="shrink-0 rounded-full bg-electric-500/15 px-3 py-1 font-mono text-[0.72rem] text-electric-200">
                {b.ects} ECTS
              </span>
            </header>
            <ul className="mt-5 flex flex-col gap-1.5">
              {b.courses.map((c) => (
                <li
                  key={c.code}
                  className={cn(
                    "grid items-baseline gap-x-3 rounded-xl bg-white/[0.04] px-3.5 py-2.5",
                    b.optional ? "grid-cols-[1.4rem_1fr_auto]" : "grid-cols-[1fr_auto]",
                  )}
                >
                  {b.optional && <span className="font-mono text-xs text-fg-dim">ou</span>}
                  <span className="text-[0.95rem] leading-snug text-fg">
                    {c.title}
                    {c.note && <span className="ml-2 text-xs text-fg-dim">({c.note})</span>}
                  </span>
                  <span className="font-mono text-xs text-fg-muted tabular-nums">{c.hours} h</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
