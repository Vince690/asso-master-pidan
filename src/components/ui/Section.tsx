import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({ id, className, children }: { id?: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={cn("container-site relative z-10 scroll-mt-10 py-12 md:py-16", className)}>
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("mb-8 flex max-w-2xl flex-col gap-3", align === "center" && "mx-auto items-center text-center", className)}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="display text-[1.9rem] md:text-[2.5rem]">{title}</h2>
      {lead && <p className="max-w-xl text-[1.02rem] leading-relaxed text-fg-muted">{lead}</p>}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="container-site relative z-10 pt-28 pb-6 md:pt-32 md:pb-8">
      <div className="flex max-w-3xl flex-col gap-4">
        {eyebrow && <span className="eyebrow animate-rise">{eyebrow}</span>}
        <h1 className="display animate-rise text-[2.4rem] [animation-delay:60ms] md:text-[3.6rem]">{title}</h1>
        {lead && <p className="animate-rise max-w-2xl text-lg leading-relaxed text-fg-muted [animation-delay:120ms] md:text-xl">{lead}</p>}
        {children}
      </div>
    </header>
  );
}
