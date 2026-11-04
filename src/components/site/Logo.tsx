import { cn } from "@/lib/utils";
import { MARK_BOLD, MARK_REGULAR, MARK_VIEWBOX } from "./MarkPaths";

/**
 * Marque PID@N : le dessin historique du master (profil et réseau), vectorisé depuis l'image
 * d'origine et épaissi. Le visage prend la couleur courante ; le réseau reste bleu.
 * En dessous de 64 px, la graisse épaisse est utilisée pour rester lisible.
 */
export function LogoMark({ className, size = 32, bold }: { className?: string; size?: number; bold?: boolean }) {
  const paths = (bold ?? size < 64) ? MARK_BOLD : MARK_REGULAR;
  return (
    <svg viewBox={MARK_VIEWBOX} width={size} height={size} aria-hidden className={cn("shrink-0", className)}>
      <path fill="#4f7bff" d={paths.lines} />
      <path fill="#9bb6ff" d={paths.nodes} />
      <path fill="currentColor" d={paths.face} />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-baseline font-bold tracking-[-0.045em]", className)}>
      PID<span className="text-electric-400">@</span>N
    </span>
  );
}

export default function Logo({ className, markSize = 36 }: { className?: string; markSize?: number }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark size={markSize} />
      <Wordmark className="text-[1.05rem] leading-none" />
    </span>
  );
}
