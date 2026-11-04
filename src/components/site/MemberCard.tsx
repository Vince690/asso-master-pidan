import Link from "next/link";
import { Linkedin } from "@/components/ui/Icons";
import type { Member } from "@/lib/types";
import { memberSlug } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";

/**
 * Carte membre. L'élément survolé reste immobile et seule la surface intérieure se soulève :
 * au bord de la carte, le survol ne clignote pas.
 */
export default function MemberCard({
  member,
  compact = false,
  subtitle = true,
}: {
  member: Member;
  compact?: boolean;
  subtitle?: boolean;
}) {
  const name = `${member.firstName} ${member.lastName}`;
  const sub =
    member.role ?? (member.currentPosition ? [member.currentPosition, member.currentCompany].filter(Boolean).join(", ") : undefined);
  return (
    <div className="group relative">
      <div className="glass glass-edge flex items-center gap-4 rounded-2xl p-4 transition-[transform,box-shadow] duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-0.5 group-hover:shadow-[var(--shadow-glow-plum)]">
        <Avatar firstName={member.firstName} lastName={member.lastName} photo={member.photo} size={compact ? 44 : 56} />
        <div className="min-w-0 flex-1">
          <Link
            href={`/membres/${memberSlug(member)}`}
            className="block truncate font-semibold tracking-tight text-fg after:absolute after:inset-0"
          >
            {name}
          </Link>
          {subtitle && sub && <p className="truncate text-sm text-fg-muted">{sub}</p>}
          {!compact && member.bio && <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-fg-dim">{member.bio}</p>}
        </div>
        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label={`LinkedIn de ${name}`}
            className="relative z-10 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-fg-dim transition-colors hover:bg-white/10 hover:text-fg"
          >
            <Linkedin size={15} />
          </a>
        )}
      </div>
    </div>
  );
}
