import { hash } from "@/lib/utils";
import type { ArticleCategory } from "@/lib/types";

/**
 * Couvertures générées : douze compositions de formes (disques, anneaux, carrés, triangles,
 * pastilles, arches, lunes…) combinées à trois palettes et à des positions dérivées du slug.
 * Le choix est déterministe pour un article donné et varie d'un article à l'autre.
 */
const PALETTES: Record<ArticleCategory, [string, string, string]> = {
  "veille-juridique": ["#4f7bff", "#85145a", "#9bb6ff"],
  "vie-du-master": ["#a8307f", "#4f7bff", "#ecb6d8"],
  evenements: ["#85145a", "#2f5bff", "#cf6fb0"],
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
  // `>>>` garde des entiers non signés : les positions restent dans le cadre
  const a = (h % 360) / 360;
  const b = ((h >>> 8) % 100) / 100;
  const c = ((h >>> 16) % 100) / 100;
  const [p0, p1, p2] = PALETTES[category];
  const id = `cv-${h.toString(36)}`;
  const style = forced ?? coverStyle(seed);
  const cx = 230 + b * 340;
  const cy = 140 + c * 170;
  const rot = -20 + a * 40;

  return (
    <svg viewBox="0 0 800 450" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <radialGradient id={`${id}-1`} cx={`${20 + a * 50}%`} cy={`${30 + b * 40}%`} r="60%">
          <stop offset="0" stopColor={p0} stopOpacity="0.9" />
          <stop offset="1" stopColor={p0} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-2`} cx={`${60 + c * 35}%`} cy={`${50 + a * 40}%`} r="55%">
          <stop offset="0" stopColor={p1} stopOpacity="0.85" />
          <stop offset="1" stopColor={p1} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-l`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={p2} stopOpacity="0.95" />
          <stop offset="1" stopColor={p0} stopOpacity="0.55" />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor={p2} stopOpacity="0.55" />
          <stop offset="1" stopColor={p2} stopOpacity="0" />
        </radialGradient>
        <pattern id={`${id}-g`} width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="white" fillOpacity="0.14" />
        </pattern>
      </defs>
      <rect width="800" height="450" fill="#0f0a18" />
      <rect width="800" height="450" fill={`url(#${id}-1)`} />
      <rect width="800" height="450" fill={`url(#${id}-2)`} />
      {style % 3 === 0 && <rect width="800" height="450" fill={`url(#${id}-g)`} />}

      {/* 0 — disque plein et son halo */}
      {style === 0 && (
        <>
          <circle cx={cx} cy={cy} r="170" fill={`url(#${id}-glow)`} />
          <circle cx={cx} cy={cy} r={80 + a * 40} fill={`url(#${id}-l)`} />
        </>
      )}
      {/* 1 — anneau fin et point */}
      {style === 1 && (
        <>
          <circle cx={cx} cy={cy} r={110 + a * 50} fill="none" stroke={p2} strokeOpacity="0.85" strokeWidth="6" />
          <circle cx={cx} cy={cy} r="14" fill={p2} />
        </>
      )}
      {/* 2 — carré arrondi incliné */}
      {style === 2 && (
        <rect x={cx - 110} y={cy - 110} width="220" height="220" rx="44" fill={`url(#${id}-l)`} transform={`rotate(${rot} ${cx} ${cy})`} />
      )}
      {/* 3 — triangle */}
      {style === 3 && (
        <polygon
          points={`${cx},${cy - 130} ${cx + 125},${cy + 90} ${cx - 125},${cy + 90}`}
          fill={`url(#${id}-l)`}
          transform={`rotate(${rot} ${cx} ${cy})`}
        />
      )}
      {/* 4 — trois pastilles */}
      {style === 4 && (
        <>
          <circle cx={cx - 120} cy={cy} r="46" fill={p2} fillOpacity="0.85" />
          <circle cx={cx + 10} cy={cy - 40} r="70" fill={`url(#${id}-l)`} />
          <circle cx={cx + 150} cy={cy + 50} r="30" fill={p2} fillOpacity="0.6" />
        </>
      )}
      {/* 5 — arche */}
      {style === 5 && <path d={`M ${cx - 150} 450 V ${cy} A 150 150 0 0 1 ${cx + 150} ${cy} V 450 Z`} fill={`url(#${id}-l)`} />}
      {/* 6 — lune */}
      {style === 6 && (
        <>
          <circle cx={cx} cy={cy} r="120" fill={p2} fillOpacity="0.9" />
          <circle cx={cx + 50} cy={cy - 30} r="112" fill="#0f0a18" />
          <circle cx={cx + 50} cy={cy - 30} r="112" fill={`url(#${id}-2)`} />
        </>
      )}
      {/* 7 — anneaux concentriques */}
      {style === 7 && (
        <g fill="none" stroke={p2}>
          <circle cx={cx} cy={cy} r="40" strokeWidth="22" strokeOpacity="0.95" />
          <circle cx={cx} cy={cy} r="95" strokeWidth="4" strokeOpacity="0.7" />
          <circle cx={cx} cy={cy} r="150" strokeWidth="2" strokeOpacity="0.45" />
        </g>
      )}
      {/* 8 — demi-disque */}
      {style === 8 && (
        <path
          d={`M ${cx - 160} ${cy} A 160 160 0 0 1 ${cx + 160} ${cy} Z`}
          fill={`url(#${id}-l)`}
          transform={`rotate(${rot} ${cx} ${cy})`}
        />
      )}
      {/* 9 — losange et point */}
      {style === 9 && (
        <>
          <rect x={cx - 95} y={cy - 95} width="190" height="190" rx="18" fill={`url(#${id}-l)`} transform={`rotate(45 ${cx} ${cy})`} />
          <circle cx={cx + 150} cy={cy - 90} r="14" fill={p2} />
        </>
      )}
      {/* 10 — pilule */}
      {style === 10 && (
        <rect x={cx - 170} y={cy - 60} width="340" height="120" rx="60" fill={`url(#${id}-l)`} transform={`rotate(${rot} ${cx} ${cy})`} />
      )}
      {/* 11 — grand cercle évidé par un carré */}
      {style === 11 && (
        <>
          <circle cx={cx} cy={cy} r="140" fill={`url(#${id}-l)`} />
          <rect x={cx - 40} y={cy - 40} width="80" height="80" rx="12" fill="#0f0a18" />
        </>
      )}
      <text
        x="40"
        y="410"
        fill="white"
        fillOpacity="0.28"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        fontSize="18"
        letterSpacing="2"
      >
        {seed.slice(0, 28).toUpperCase()}
      </text>
    </svg>
  );
}
