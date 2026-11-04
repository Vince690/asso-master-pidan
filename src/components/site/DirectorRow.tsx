import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Linkedin } from "@/components/ui/Icons";
import type { Member } from "@/lib/types";
import { memberSlug } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";

/** La direction du master en une ligne discrète : portrait, nom, fonction, LinkedIn, fiche. */
export default function DirectorRow({ member }: { member: Member }) {
  const name = `${member.firstName} ${member.lastName}`;
  return (
    <div className="glass glass-edge flex items-center gap-4 rounded-2xl p-3 pr-4">
      <Avatar firstName={member.firstName} lastName={member.lastName} photo={member.photo} size={48} tone="color" />
      <div className="min-w-0 flex-1">
        <Link
          href={`/membres/${memberSlug(member)}`}
          className="block truncate font-semibold tracking-tight text-fg hover:text-electric-200"
        >
          {name}
        </Link>
        <p className="truncate text-sm text-fg-muted">{member.role ?? "Directrice du master"}</p>
      </div>
      {member.linkedin && (
        <a
          href={member.linkedin}
          target="_blank"
          rel="noreferrer"
          aria-label={`LinkedIn de ${name}`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-fg-dim hover:bg-white/10 hover:text-fg"
        >
          <Linkedin size={15} />
        </a>
      )}
      <Link
        href={`/membres/${memberSlug(member)}`}
        aria-label="Fiche complète"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-fg-dim hover:bg-white/10 hover:text-fg"
      >
        <ArrowUpRight size={16} />
      </Link>
    </div>
  );
}
