import type { Metadata } from "next";
import { getMembers, getSettings } from "@/lib/data";
import { POLES, type Pole } from "@/lib/types";
import { promoLabel } from "@/lib/utils";
import { PageHero, Section, SectionHeading } from "@/components/ui/Section";
import { MemberList } from "@/components/site/MemberCard";

export const metadata: Metadata = {
  title: "L'association",
  description:
    "L'association PID@N, tenue par la promotion du M2 PIDAN : bureau, pôle Communication, pôle Veille juridique, pôle Événementiel.",
  alternates: { canonical: "/association" },
};

export default async function AssociationPage() {
  const [members, settings] = await Promise.all([getMembers(), getSettings()]);
  const promo = members.filter((m) => m.promo === settings.currentPromo);
  const byPole = (pole: Pole) => promo.filter((m) => m.poles.includes(pole));

  return (
    <>
      <PageHero
        eyebrow={`Association PID@N · promotion ${promoLabel(settings.currentPromo)}`}
        title="L'association du master."
        lead="Tenue chaque année par la promotion en cours. Un bureau et trois pôles : communication, veille juridique, événementiel."
      />
      {(Object.keys(POLES) as Pole[])
        .filter((key) => key !== "direction")
        .map((key) => {
          const list = byPole(key);
          return (
            <Section key={key} id={key} className="py-8 md:py-10">
              <SectionHeading className="mb-6" title={POLES[key].label} lead={POLES[key].description} />
              {list.length === 0 ? (
                <p className="text-sm text-fg-dim">Responsables à venir.</p>
              ) : (
                <MemberList members={list} gridClassName="gap-3 sm:grid-cols-2 lg:grid-cols-3" compact={false} />
              )}
            </Section>
          );
        })}
    </>
  );
}
