import { cn, hash, initials } from "@/lib/utils";

/**
 * Photo ou, à défaut, initiale(s) du prénom sur un dégradé déterministe.
 * Les photos sont affichées en noir et blanc teinté (`tone="mono"`) dans les listes pour rester
 * cohérentes entre elles et avec le site, et en couleur au survol ou sur la fiche (`tone="color"`).
 */
export default function Avatar({
  firstName,
  lastName,
  photo,
  size = 56,
  tone = "mono",
  className,
}: {
  firstName: string;
  lastName: string;
  photo?: string;
  size?: number;
  tone?: "mono" | "color";
  className?: string;
}) {
  const name = `${firstName} ${lastName}`;
  if (photo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photo}
        alt={name}
        width={size}
        height={size}
        loading="lazy"
        className={cn(
          "shrink-0 rounded-full object-cover ring-1 ring-white/10",
          tone === "mono" && "grayscale transition-[filter] duration-300 group-hover:grayscale-0",
          className,
        )}
        style={{ width: size, height: size }}
      />
    );
  }
  const h = hash(name);
  const hue1 = 300 + (h % 40) - 20;
  const hue2 = 225 + ((h >> 6) % 30);
  return (
    <span
      role="img"
      aria-label={name}
      className={cn("inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white", className)}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: `linear-gradient(135deg, hsl(${hue1} 70% 30%), hsl(${hue2} 90% 55%))`,
        boxShadow: "inset 0 1px 0 rgb(255 255 255 / .25)",
      }}
    >
      {initials(firstName)}
    </span>
  );
}
