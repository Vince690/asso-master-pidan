"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { FileText, Handshake, Home, LayoutDashboard, Menu, ScrollText, Settings, Users, UserCog, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/site/Logo";

const ITEMS = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/admin/articles", label: "Articles", icon: FileText },
  { href: "/admin/membres", label: "Membres et alumni", icon: Users },
  { href: "/admin/partenaires", label: "Partenaires", icon: Handshake },
  { href: "/admin/statuts", label: "Statuts", icon: ScrollText },
  { href: "/admin/utilisateurs", label: "Accès", icon: UserCog },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
];

/**
 * Navigation de l'espace membres. Grand écran : colonne fixe avec le compte en bas.
 * Mobile : une barre (logo + bouton menu) et un panneau déroulant qui se referme dès qu'on choisit une page.
 */
export default function AdminNav({ account }: { account?: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const items = ITEMS.map((item) => {
    const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
    const Icon = item.icon;
    return (
      <li key={item.href}>
        <Link
          href={item.href}
          onClick={() => setOpen(false)}
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
  });

  return (
    <>
      {/* Grand écran */}
      <nav className="flex flex-1 flex-col gap-6 max-md:hidden">
        <Link href="/admin" className="px-2">
          <Logo />
        </Link>
        <ul className="flex flex-col gap-1">{items}</ul>
        <Link href="/" className="flex items-center gap-3 px-3 text-sm text-fg-dim hover:text-fg-muted">
          <Home size={15} /> Voir le site
        </Link>
        {account && <div className="mt-auto">{account}</div>}
      </nav>

      {/* Mobile */}
      <nav className="relative md:hidden">
        <div className="flex items-center justify-between px-4 py-2.5">
          <Link href="/admin">
            <Logo markSize={28} />
          </Link>
          <button
            type="button"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-white/10 hover:text-fg"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        {open && (
          <div className="glass-strong animate-pop absolute inset-x-3 top-full z-40 mt-1 flex flex-col gap-4 rounded-2xl p-3">
            <ul className="flex flex-col gap-0.5">{items}</ul>
            <Link href="/" className="flex items-center gap-3 px-3 text-sm text-fg-dim hover:text-fg-muted">
              <Home size={15} /> Voir le site
            </Link>
            {account}
          </div>
        )}
      </nav>
    </>
  );
}
