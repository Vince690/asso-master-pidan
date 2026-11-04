"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Handshake, Home, LayoutDashboard, ScrollText, Settings, Users, UserCog } from "lucide-react";
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

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-6">
      <Link href="/admin" className="px-2">
        <Logo />
      </Link>
      <ul className="flex flex-row flex-wrap gap-1 md:flex-col">
        {ITEMS.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
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
    </nav>
  );
}
