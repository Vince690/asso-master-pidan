"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Sur mobile, une rangée à faire glisser (défilement horizontal avec arrêt sur chaque carte) et des points
 * indiquant la carte en vue. Sur grand écran, le conteneur garde exactement les classes qu'on lui passe
 * (grille) et les points sont masqués : rien ne change.
 */
export default function SwipeRow({ className, count, children }: { className?: string; count: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const left = el.getBoundingClientRect().left + parseFloat(getComputedStyle(el).paddingLeft);
      let best = 0;
      let dist = Infinity;
      Array.from(el.children).forEach((child, i) => {
        const d = Math.abs(child.getBoundingClientRect().left - left);
        if (d < dist) {
          dist = d;
          best = i;
        }
      });
      setActive(Math.min(best, count - 1));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [count]);

  return (
    <>
      <div ref={ref} className={className}>
        {children}
      </div>
      <div className="mt-4 flex justify-center gap-1.5 md:hidden" aria-hidden>
        {Array.from({ length: count }).map((_, i) => (
          <span
            key={i}
            className={cn("h-1.5 rounded-full transition-[width,background-color] duration-300", i === active ? "w-5 bg-fg" : "w-1.5 bg-white/25")}
          />
        ))}
      </div>
    </>
  );
}
