import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";
import { Linkedin } from "@/components/ui/Icons";
import { getMembers, getSettings } from "@/lib/data";
import { POLES } from "@/lib/types";
import { memberSlug, promoLabel } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import { buttonClass } from "@/components/ui/Button";

export async function generateStaticParams() {
  const members = await getMembers();
  return members.length ? members.map((m) => ({ slug: memberSlug(m) })) : [{ slug: "membre" }];
}

export async function generateMetadata({ params }: PageProps<"/membres/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const member = (await getMembers()).find((m) => memberSlug(m) === slug);
  if (!member) return { title: "Fiche introuvable" };
  const name = `${member.firstName} ${member.lastName}`;
  return {
    title: name,
    description: `${name}, ${member.role ?? "membre"} de l'association PID@N, promotion ${promoLabel(member.promo)}.`,
    alternates: { canonical: `/membres/${slug}` },
  };
}

export default function MemberPage({ params }: PageProps<"/membres/[slug]">) {
  return (
    <Suspense
      fallback={
        <div className="container-site pt-40">
          <div className="glass h-80 animate-pulse rounded-3xl" />
        </div>
      }
    >
      <Sheet params={params} />
    </Suspense>
  );
}

async function Sheet({ params }: Pick<PageProps<"/membres/[slug]">, "params">) {
  const { slug } = await params;
  const [members, settings] = await Promise.all([getMembers(), getSettings()]);
  const member = members.find((m) => memberSlug(m) === slug);
  if (!member) notFound();
  const name = `${member.firstName} ${member.lastName}`;
  const alumni = member.promo < settings.currentPromo;
  const back = alumni ? { href: "/alumni", label: "Tous les alumni" } : { href: "/#membres", label: "Toute la promotion" };

  return (
    <div className="container-site pt-32 md:pt-40">
      <Link href={back.href} className="inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-fg">
        <ArrowLeft size={15} /> {back.label}
      </Link>
      <article className="glass glass-edge mt-8 grid gap-8 rounded-[2rem] p-8 md:grid-cols-[auto_1fr] md:p-12">
        <Avatar firstName={member.firstName} lastName={member.lastName} photo={member.photo} size={120} tone="color" />
        <div className="min-w-0">
          <p className="eyebrow">
            {alumni ? `Alumni · promotion ${promoLabel(member.promo)}` : `Promotion ${promoLabel(member.promo)}`}
            {member.pole ? ` · ${POLES[member.pole].label}` : ""}
          </p>
          <h1 className="display mt-3 text-[2.2rem] md:text-[3rem]">{name}</h1>
          {(member.role || member.currentPosition) && (
            <p className="mt-2 text-lg text-fg-muted">
              {member.role ?? [member.currentPosition, member.currentCompany].filter(Boolean).join(", ")}
            </p>
          )}
          {member.bio && <p className="mt-6 max-w-xl text-[1.02rem] leading-relaxed text-fg-muted">{member.bio}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            {member.email && (
              <a href={`mailto:${member.email}`} className={buttonClass("primary")}>
                <Mail size={16} /> {member.email}
              </a>
            )}
            {member.linkedin && (
              <a href={member.linkedin} target="_blank" rel="noreferrer" className={buttonClass("glass")}>
                <Linkedin size={15} /> LinkedIn
              </a>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
