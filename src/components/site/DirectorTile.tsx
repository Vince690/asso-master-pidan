import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Linkedin } from "@/components/ui/Icons";
import type { Member } from "@/lib/types";
import { memberSlug } from "@/lib/utils";
import { cn } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import { buttonClass } from "@/components/ui/Button";

/**
 * La direction du master, au même format que les éléments qui l'entourent (tuile de verre sur
 * l'accueil, colonne de texte sur la page du master). Les données viennent de la base.
 */
export default function DirectorTile({ member, variant = "tile" }: { member: Member; variant?: "tile" | "column" | "band" }) {
  const name = `${member.firstName} ${member.lastName}`;
  const tile = variant === "tile";
  if (variant === "band") {
    return (
      <div className="glass glass-edge flex flex-col gap-5 rounded-3xl p-5 md:flex-row md:items-center md:gap-6 md:pr-6">
        <div className="flex min-w-0 items-center gap-4 md:w-72 md:shrink-0">
          <Avatar firstName={member.firstName} lastName={member.lastName} photo={member.photo} size={56} tone="color" />
          <div className="min-w-0">
            <span className="eyebrow">Direction du master</span>
            <h3 className="mt-1 truncate text-lg font-semibold tracking-tight text-fg">{name}</h3>
          </div>
        </div>
        {member.bio && <p className="min-w-0 flex-1 text-sm leading-relaxed text-fg-muted md:line-clamp-2">{member.bio}</p>}
        <div className="flex shrink-0 flex-wrap gap-2">
          {member.linkedin && (
            <a href={member.linkedin} target="_blank" rel="noreferrer" className={buttonClass("glass", "sm")}>
              <Linkedin size={14} /> LinkedIn
            </a>
          )}
          <Link href={`/membres/${memberSlug(member)}`} className={buttonClass("ghost", "sm")}>
            Fiche complète <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className={cn("flex flex-col", tile && "glass glass-edge rounded-3xl p-6 md:p-7")}>
      <span className="eyebrow">Direction du master</span>
      <div className="mt-5 flex items-center gap-4">
        <Avatar firstName={member.firstName} lastName={member.lastName} photo={member.photo} size={60} tone="color" />
        <div className="min-w-0">
          <h3 className="truncate text-xl font-semibold tracking-tight text-fg">{name}</h3>
          <p className="text-sm text-fg-muted">{member.role ?? "Directrice du master"}</p>
        </div>
      </div>
      {member.bio && (
        <p className={cn("mt-4 text-[0.95rem] leading-relaxed text-fg-muted", tile ? "line-clamp-2" : "line-clamp-4")}>{member.bio}</p>
      )}
      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        {member.linkedin && (
          <a href={member.linkedin} target="_blank" rel="noreferrer" className={buttonClass("glass", "sm")}>
            <Linkedin size={14} /> LinkedIn
          </a>
        )}
        <Link href={`/membres/${memberSlug(member)}`} className={buttonClass("ghost", "sm")}>
          Fiche complète <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
}
