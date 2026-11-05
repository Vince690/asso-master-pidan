"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FileText, Handshake, Home, LayoutDashboard, Menu, ScrollText, Settings, Users, UserCog, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo, { LogoMark } from "@/components/site/Logo";

const ITEMS = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/admin/articles", label: "Articles", icon: FileText },
  { href: "/admin/membres", label: "Membres et alumni", icon: Users },
  { href: "/admin/partenaires", label: "Partenaires", icon: Handshake },
  { href: "/admin/statuts", label: "Statuts", icon: ScrollText },
  { href: "/admin/utilisateurs", label: "Accès", icon: UserCog },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
];

const EASE = [0.22, 0.61, 0.36, 1] as const;

function useActive() {
  const pathname = usePathname();
  return (item: (typeof ITEMS)[number]) => (item.exact ? pathname === item.href : pathname.startsWith(item.href));
}

/** Grand écran : colonne fixe avec le logo, les rubriques, « Voir le site » et le compte en bas. */
export function AdminSidebar({ account }: { account?: ReactNode }) {
  const isActive = useActive();
  return (
    <nav className="flex flex-1 flex-col gap-6">
      <Link href="/admin" className="px-2">
        <Logo />
      </Link>
      <ul className="flex flex-col gap-1">
        {ITEMS.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                  active ? "bg-white/10 text-fg" : "text-fg-muted hover:bg-white/5 hover:text-fg",
                )}
              >
                <Icon size={16} className={active ? "text-electric-300" : undefined} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <Link href="/" className="flex items-center gap-3 px-3 text-sm text-fg-dim hover:text-fg-muted">
        <Home size={15} /> Voir le site
      </Link>
      {account && <div className="mt-auto">{account}</div>}
    </nav>
  );
}

/**
 * Mobile : la même pilule flottante que le site public, avec « Espace membres » à la place
 * des rubriques, et un menu plein écran qui liste les pages, « Voir le site » et le compte.
 */
export function AdminMobileBar({ account }: { account?: ReactNode }) {
  const isActive = useActive();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-[max(1rem,env(safe-area-inset-top,0px))]">
        <nav aria-label="Espace membres" className="header-glass glass-edge pointer-events-auto flex items-center gap-1 rounded-full px-1.5 py-1.5">
          <Link href="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2.5 pr-2 pl-2 outline-none">
            <LogoMark size={34} />
            <span className="text-[0.95rem] font-semibold tracking-[-0.02em] text-fg">Espace membres</span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full text-fg"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 overflow-y-auto bg-ink-0/70 backdrop-blur-xl"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              className="header-glass glass-edge mx-4 mt-[calc(var(--header-h)+max(1rem,env(safe-area-inset-top,0px)))] mb-6 rounded-3xl p-3"
            >
              <ul className="flex flex-col">
                {ITEMS.map((item) => {
                  const active = isActive(item);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-2xl px-4 py-3 text-lg font-medium",
                          active ? "bg-white/10 text-fg" : "text-fg-muted",
                        )}
                      >
                        <Icon size={18} className={active ? "text-electric-300" : undefined} />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
                <li>
                  <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-lg font-medium text-fg-dim">
                    <Home size={18} /> Voir le site
                  </Link>
                </li>
              </ul>
              {account && <div className="mt-2 border-t border-line pt-3">{account}</div>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
