import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Linkedin } from "@/components/ui/Icons";
import type { Member } from "@/lib/types";
import { memberSlug } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import { buttonClass } from "@/components/ui/Button";

/**
 * Carte de la direction du master : large, à part de la promotion, avec portrait, titre,
 * biographie et liens. Les données viennent de la base (membre du pôle « direction »).
 */
export default function DirectorCard({ member, compact = false }: { member: Member; compact?: boolean }) {
  const name = `${member.firstName} ${member.lastName}`;
  return (
    <article className="glass glass-edge grid gap-6 rounded-[2rem] p-6 md:grid-cols-[auto_1fr] md:gap-8 md:p-8">
      <Avatar firstName={member.firstName} lastName={member.lastName} photo={member.photo} size={compact ? 88 : 112} tone="color" />
      <div className="min-w-0">
        <p className="eyebrow">Direction du master</p>
        <h3 className="mt-2 text-[1.6rem] font-semibold tracking-tight text-fg md:text-[1.9rem]">{name}</h3>
        {member.role && <p className="mt-0.5 text-fg-muted">Professeure de droit privé, {member.role.toLowerCase()}</p>}
        {member.bio && (
          <p
            className={
              compact
                ? "mt-4 line-clamp-3 max-w-3xl text-[0.95rem] leading-relaxed text-fg-muted"
                : "mt-4 max-w-3xl text-[0.95rem] leading-relaxed text-fg-muted"
            }
          >
            {member.bio}
          </p>
        )}
        <div className="mt-5 flex flex-wrap gap-2">
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
    </article>
  );
}
