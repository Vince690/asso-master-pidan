"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoMark, Wordmark } from "./Logo";
import SmartLink from "./SmartLink";

/**
 * Les entrées pointent vers les sections de l'accueil.
 * `pages` liste les chemins pour lesquels l'entrée reste active hors de l'accueil.
 */
export const NAV = [
  { id: "master", href: "/#master", label: "Le master", pages: ["/le-master"] },
  { id: "articles", href: "/#articles", label: "Articles", pages: ["/articles"] },
  { id: "membres", href: "/#membres", label: "Membres", pages: ["/membres", "/association"] },
  { id: "alumni", href: "/#alumni", label: "Alumni", pages: ["/alumni"] },
  { id: "partenaires", href: "/#partenaires", label: "Partenaires", pages: ["/partenaires"] },
] as const;

const SECTION_IDS = ["hero", ...NAV.map((n) => n.id), "contact"];

/**
 * Navigation en pilule flottante.
 * Au repos elle est contractée ; au survol elle s'ouvre franchement et un surligneur glisse
 * d'un item à l'autre, uniquement sous l'item survolé. Sur l'accueil, l'item actif suit la section visible.
 * Sur mobile, elle s'ouvre en feuille de verre.
 */
export default function Header() {
  const pathname = usePathname();
  const [hovered, setHovered] = useState<string | null>(null); // id d'item, "cta", ou null
  const [expanded, setExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [section, setSection] = useState<string>("hero");
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const onHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!onHome) return;
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el));
    if (els.length === 0) return;
    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
        let best = "hero";
        let bestRatio = 0;
        for (const el of els) {
          const r = visible.get(el.id) ?? 0;
          if (r > bestRatio) {
            bestRatio = r;
            best = el.id;
          }
        }
        if (bestRatio > 0) setSection(best);
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [onHome]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const isActive = (item: (typeof NAV)[number]) =>
    onHome ? section === item.id : item.pages.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  // Surligneur : l'item survolé seul ; rien si le curseur est sur le bouton de contact ; sinon l'item actif.
  const highlight = hovered === "cta" ? null : (hovered ?? NAV.find(isActive)?.id ?? null);
  const sectionHref = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-[max(1rem,env(safe-area-inset-top,0px))]">
        <motion.nav
          aria-label="Navigation principale"
          onMouseEnter={() => setExpanded(true)}
          onMouseLeave={() => {
            setExpanded(false);
            setHovered(null);
          }}
          animate={{ scale: expanded ? 1.06 : 0.94, opacity: expanded || scrolled ? 1 : 0.94 }}
          transition={{ type: "spring", stiffness: 240, damping: 24 }}
          style={{ transformOrigin: "50% 0%", willChange: "transform" }}
          className="header-glass glass-edge pointer-events-auto flex items-center gap-1 rounded-full p-1.5 pl-3.5"
        >
          <Link href="/" className="mr-2 flex items-center gap-2.5 pr-1" aria-label="PID@N, accueil">
            <LogoMark size={34} />
            <Wordmark className="text-[1.02rem]" />
          </Link>

          <ul className="hidden items-center md:flex">
            {NAV.map((item) => {
              const active = isActive(item);
              return (
                <li key={item.id} className="relative">
                  {highlight === item.id && (
                    <motion.span
                      layoutId="nav-highlight"
                      className="absolute inset-0 rounded-full bg-white/12"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <SmartLink
                    href={sectionHref(item.id)}
                    onMouseEnter={() => setHovered(item.id)}
                    onMouseLeave={() => setHovered((h) => (h === item.id ? null : h))}
                    aria-current={active ? "location" : undefined}
                    className={cn(
                      "relative z-10 block rounded-full px-4 py-2 text-[0.9rem] font-medium transition-colors duration-200 outline-none",
                      active ? "text-fg" : "text-fg-muted hover:text-fg",
                    )}
                  >
                    {item.label}
                  </SmartLink>
                </li>
              );
            })}
          </ul>

          <SmartLink
            href={sectionHref("contact")}
            onMouseEnter={() => setHovered("cta")}
            onMouseLeave={() => setHovered((h) => (h === "cta" ? null : h))}
            className="cta-shine group relative ml-1 hidden items-center gap-2 overflow-hidden rounded-full bg-fg px-4.5 py-2 text-[0.9rem] font-semibold text-ink-0 outline-none md:inline-flex"
          >
            <span className="relative">Nous contacter</span>
          </SmartLink>

          <button
            type="button"
            onClick={() => setOpenPath(open ? null : pathname)}
            aria-expanded={open}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full text-fg md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </motion.nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-ink-0/70 backdrop-blur-xl md:hidden"
            onClick={() => setOpenPath(null)}
          >
            <motion.div
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="header-glass glass-edge mx-4 mt-[calc(var(--header-h)+max(1rem,env(safe-area-inset-top,0px)))] rounded-3xl p-3"
            >
              <ul className="flex flex-col">
                <li>
                  <Link
                    href="/"
                    onClick={() => setOpenPath(null)}
                    className="block rounded-2xl px-4 py-3 text-lg font-medium text-fg-muted"
                  >
                    Accueil
                  </Link>
                </li>
                {NAV.map((item) => (
                  <li key={item.id}>
                    <SmartLink
                      href={sectionHref(item.id)}
                      onClick={() => setOpenPath(null)}
                      className={cn(
                        "block rounded-2xl px-4 py-3 text-lg font-medium",
                        isActive(item) ? "bg-white/10 text-fg" : "text-fg-muted",
                      )}
                    >
                      {item.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
              <SmartLink
                href={sectionHref("contact")}
                onClick={() => setOpenPath(null)}
                className="mt-2 flex items-center justify-center rounded-2xl bg-fg px-4 py-3 text-base font-semibold text-ink-0"
              >
                Nous contacter
              </SmartLink>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
