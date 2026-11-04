import { hash } from "@/lib/utils";
import type { ArticleCategory } from "@/lib/types";

/**
 * Couvertures générées, dans l'esprit des rubans de dégradés de Stripe : grandes formes douces
 * (rubans, orbes, arcs, voiles) en dégradés prune, bleu et rose, légèrement floutées, sur fond encre.
 * Douze compositions, choisies à la création de l'article et mémorisées.
 */
const PALETTES: Record<ArticleCategory, [string, string, string, string]> = {
  "veille-juridique": ["#4f7bff", "#85145a", "#9bb6ff", "#e0409a"],
  "vie-du-master": ["#a8307f", "#4f7bff", "#ecb6d8", "#ff7bc2"],
  evenements: ["#6b2bd9", "#2f5bff", "#cf6fb0", "#ff9bd6"],
};

export const COVER_STYLES = 12;

export function coverStyle(seed: string): number {
  return (hash(seed) >>> 4) % COVER_STYLES;
}

export default function Cover({
  seed,
  category,
  className,
  style: forced,
}: {
  seed: string;
  category: ArticleCategory;
  className?: string;
  style?: number;
}) {
  const h = hash(seed);
  const a = (h % 360) / 360;
  const b = ((h >>> 8) % 100) / 100;
  const [p0, p1, p2, p3] = PALETTES[category];
  const id = `cv-${h.toString(36)}`;
  const style = forced ?? coverStyle(seed);
  const rot = -28 + a * 20;
  const shift = -60 + b * 120;

  const G = {
    warm: `url(#${id}-warm)`,
    cool: `url(#${id}-cool)`,
    pink: `url(#${id}-pink)`,
    orb: `url(#${id}-orb)`,
  };

  return (
    <svg viewBox="0 0 800 450" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id={`${id}-warm`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={p3} />
          <stop offset="0.55" stopColor={p1} />
          <stop offset="1" stopColor={p0} />
        </linearGradient>
        <linearGradient id={`${id}-cool`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor={p0} />
          <stop offset="0.5" stopColor={p2} />
          <stop offset="1" stopColor={p3} />
        </linearGradient>
        <linearGradient id={`${id}-pink`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={p1} stopOpacity="0" />
          <stop offset="0.5" stopColor={p3} />
          <stop offset="1" stopColor={p0} stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-orb`} cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor={p2} />
          <stop offset="0.45" stopColor={p0} />
          <stop offset="1" stopColor={p1} />
        </radialGradient>
        <filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <filter id={`${id}-haze`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="40" />
        </filter>
      </defs>
      <rect width="800" height="450" fill="#0f0a18" />
      {/* lueur d'ambiance */}
      <ellipse cx={400 + shift} cy="260" rx="420" ry="220" fill={p0} fillOpacity="0.16" filter={`url(#${id}-haze)`} />

      {/* 0 — ruban diagonal */}
      {style === 0 && (
        <g transform={`rotate(${rot} 400 225)`} filter={`url(#${id}-soft)`}>
          <rect x="-200" y="150" width="1200" height="170" rx="85" fill={G.warm} />
          <rect x="-200" y="195" width="1200" height="60" rx="30" fill={G.cool} fillOpacity="0.7" />
        </g>
      )}
      {/* 1 — orbe */}
      {style === 1 && (
        <>
          <circle cx={430 + shift} cy="225" r="150" fill={G.orb} />
          <circle cx={430 + shift} cy="225" r="150" fill="none" stroke="#fff" strokeOpacity="0.18" strokeWidth="1.5" />
          <ellipse cx={400 + shift} cy="420" rx="260" ry="40" fill={p3} fillOpacity="0.25" filter={`url(#${id}-haze)`} />
        </>
      )}
      {/* 2 — deux rubans croisés */}
      {style === 2 && (
        <g filter={`url(#${id}-soft)`}>
          <rect x="-200" y="160" width="1200" height="120" rx="60" fill={G.warm} transform={`rotate(${rot - 6} 400 225)`} />
          <rect
            x="-200"
            y="230"
            width="1200"
            height="90"
            rx="45"
            fill={G.cool}
            fillOpacity="0.85"
            transform={`rotate(${rot + 14} 400 225)`}
          />
        </g>
      )}
      {/* 3 — grand arc */}
      {style === 3 && (
        <g filter={`url(#${id}-soft)`}>
          <path d={`M -40 ${440 + shift / 2} A 440 440 0 0 1 840 ${440 + shift / 2}`} fill="none" stroke={G.warm} strokeWidth="110" />
          <path
            d={`M 40 ${440 + shift / 2} A 360 360 0 0 1 760 ${440 + shift / 2}`}
            fill="none"
            stroke={G.cool}
            strokeWidth="26"
            strokeOpacity="0.8"
          />
        </g>
      )}
      {/* 4 — voile en coin */}
      {style === 4 && (
        <g filter={`url(#${id}-soft)`}>
          <path d="M 800 0 L 800 450 L 320 450 C 520 330 600 160 800 0 Z" fill={G.warm} />
          <path d="M 800 60 L 800 450 L 460 450 C 600 360 680 220 800 60 Z" fill={G.cool} fillOpacity="0.55" />
        </g>
      )}
      {/* 5 — pilules en escalier */}
      {style === 5 && (
        <g transform={`rotate(${rot + 10} 400 225)`} filter={`url(#${id}-soft)`}>
          <rect x="40" y="110" width="420" height="80" rx="40" fill={G.warm} />
          <rect x="240" y="200" width="420" height="80" rx="40" fill={G.cool} />
          <rect x="120" y="290" width="420" height="80" rx="40" fill={G.pink} />
        </g>
      )}
      {/* 6 — anneau large */}
      {style === 6 && (
        <g filter={`url(#${id}-soft)`}>
          <circle cx={420 + shift} cy="225" r="150" fill="none" stroke={G.warm} strokeWidth="56" />
          <circle
            cx={420 + shift}
            cy="225"
            r="150"
            fill="none"
            stroke={G.cool}
            strokeWidth="14"
            strokeOpacity="0.9"
            strokeDasharray="420 600"
            transform={`rotate(${a * 360} ${420 + shift} 225)`}
          />
        </g>
      )}
      {/* 7 — vagues superposées */}
      {style === 7 && (
        <g filter={`url(#${id}-soft)`}>
          <path d="M -20 300 C 160 180, 320 420, 500 280 S 760 160, 820 260 L 820 470 L -20 470 Z" fill={G.warm} />
          <path d="M -20 360 C 180 260, 340 460, 520 340 S 740 240, 820 330 L 820 470 L -20 470 Z" fill={G.cool} fillOpacity="0.75" />
        </g>
      )}
      {/* 8 — lune de dégradé */}
      {style === 8 && (
        <>
          <circle cx={400 + shift} cy="225" r="160" fill={G.warm} />
          <circle cx={470 + shift} cy="190" r="150" fill="#0f0a18" />
          <circle cx={470 + shift} cy="190" r="150" fill={p0} fillOpacity="0.12" />
        </>
      )}
      {/* 9 — faisceau vertical */}
      {style === 9 && (
        <g transform={`rotate(${rot + 20} 400 225)`} filter={`url(#${id}-soft)`}>
          <rect x="320" y="-200" width="160" height="850" rx="80" fill={G.cool} />
          <rect x="420" y="-200" width="50" height="850" rx="25" fill={G.pink} fillOpacity="0.9" />
        </g>
      )}
      {/* 10 — deux orbes qui se touchent */}
      {style === 10 && (
        <>
          <circle cx={300 + shift} cy="240" r="120" fill={G.orb} />
          <circle cx={500 + shift} cy="200" r="90" fill={G.warm} fillOpacity="0.95" />
          <circle cx={430 + shift} cy="330" r="40" fill={p2} fillOpacity="0.9" />
        </>
      )}
      {/* 11 — nappe en biais */}
      {style === 11 && (
        <g filter={`url(#${id}-soft)`}>
          <path d="M -40 120 L 840 -20 L 840 230 L -40 420 Z" fill={G.warm} />
          <path d="M -40 300 L 840 150 L 840 300 L -40 470 Z" fill={G.cool} fillOpacity="0.7" />
        </g>
      )}
      {/* grain très léger */}
      <rect width="800" height="450" fill="#000" fillOpacity="0.04" />
    </svg>
  );
}
