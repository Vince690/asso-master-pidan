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
export default function DirectorTile({ member, variant = "tile" }: { member: Member; variant?: "tile" | "column" }) {
  const name = `${member.firstName} ${member.lastName}`;
  const tile = variant === "tile";
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
