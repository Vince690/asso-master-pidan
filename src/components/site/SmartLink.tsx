"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";

/**
 * Lien qui prend le chemin le plus court :
 * - vers une section de la page courante (`/#id` ou `#id`) : défilement en douceur depuis la position actuelle ;
 * - vers une section d'une autre page : navigation, puis arrivée directement sur la section ;
 * - sinon : lien Next classique.
 */
export default function SmartLink({ href, onClick, ...props }: Omit<ComponentProps<typeof Link>, "href"> & { href: string }) {
  const pathname = usePathname();
  const hash = href.indexOf("#");
  if (hash === -1) return <Link href={href} onClick={onClick} {...props} />;

  const path = href.slice(0, hash) || pathname;
  const id = href.slice(hash + 1);
  const samePage = path === pathname;

  if (!samePage) return <Link href={href} onClick={onClick} scroll {...props} />;

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.pushState(null, "", `#${id}`);
  };
  return <a href={`#${id}`} onClick={handle} {...(props as ComponentProps<"a">)} />;
}
