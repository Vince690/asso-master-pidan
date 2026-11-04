import type { ReactNode } from "react";

/**
 * Conteneur neutre conservé pour la structure des pages.
 * Le site n'anime pas chaque section au défilement : une seule entrée orchestrée (le hero) suffit,
 * et le contenu est entièrement visible au repos, y compris sans JavaScript.
 */
export default function Reveal({ children, className }: { children: ReactNode; delay?: number; className?: string }) {
  return <div className={className}>{children}</div>;
}
