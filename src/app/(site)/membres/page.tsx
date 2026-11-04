import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getMembers, getSettings } from "@/lib/data";
import { promoLabel } from "@/lib/utils";
import { PageHero, Section } from "@/components/ui/Section";
import MemberCard from "@/components/site/MemberCard";

export const metadata: Metadata = {
  title: "Membres",
  description: "Les étudiants de la promotion en cours du M2 PIDAN, Université Paris-Saclay.",
  alternates: { canonical: "/membres" },
};

export default async function MembersPage() {
  const [members, settings] = await Promise.all([getMembers(), getSettings()]);
  const direction = members.find((m) => m.pole === "direction");
  const promo = members
    .filter((m) => m.promo === settings.currentPromo && m.pole !== "direction")
    .sort((a, b) => a.lastName.localeCompare(b.lastName, "fr") || a.firstName.localeCompare(b.firstName, "fr"));

  return (
    <>
      <PageHero eyebrow={`Promotion ${promoLabel(settings.currentPromo)}`} title={`La promotion, ${promo.length} étudiants.`}>
        <Link
          href="/association"
          className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-electric-300 hover:text-electric-200"
        >
          Bureau et pôles de l'association <ArrowUpRight size={15} />
        </Link>
      </PageHero>
      <Section className="pt-0 md:pt-0">
        {direction && (
          <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <MemberCard member={direction} />
          </div>
        )}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {promo.map((m) => (
            <MemberCard key={m.id} member={m} />
          ))}
        </div>
      </Section>
    </>
  );
}
