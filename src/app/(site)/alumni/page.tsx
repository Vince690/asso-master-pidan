import type { Metadata } from "next";
import { Suspense } from "react";
import { getMembers, getSettings } from "@/lib/data";
import { ALUMNI_FIELDS, type AlumniField } from "@/lib/types";
import { PageHero, Section } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import AlumniExplorer from "@/components/site/AlumniExplorer";

export const metadata: Metadata = {
  title: "Alumni",
  description: "L'annuaire des anciens du M2 PIDAN, par promotion et par métier : avocats, juristes, DPO, chercheurs, entrepreneurs.",
  alternates: { canonical: "/alumni" },
};

export default async function AlumniPage({ searchParams }: PageProps<"/alumni">) {
  const [members, settings] = await Promise.all([getMembers(), getSettings()]);
  const alumni = members.filter((m) => m.promo < settings.currentPromo);
  const promos = new Set(alumni.map((m) => m.promo)).size;

  return (
    <>
      <PageHero
        eyebrow="Annuaire"
        title={`${alumni.length} anciens, ${promos} promotions.`}
        lead="Filtrez par métier, cherchez un nom ou une structure. Vous êtes passé par PIDAN ? Faites-vous ajouter."
      >
        <div className="animate-rise mt-2 [animation-delay:180ms]">
          <LinkButton href="/contact?sujet=Figurer dans l'annuaire alumni" variant="glass">
            Figurer dans l'annuaire
          </LinkButton>
        </div>
      </PageHero>
      <Section className="pt-0">
        <Suspense fallback={<AlumniExplorer alumni={alumni} />}>
          <WithFilter alumni={alumni} searchParams={searchParams} />
        </Suspense>
      </Section>
    </>
  );
}

async function WithFilter({
  alumni,
  searchParams,
}: { alumni: Awaited<ReturnType<typeof getMembers>> } & Pick<PageProps<"/alumni">, "searchParams">) {
  const { metier } = await searchParams;
  const initial = typeof metier === "string" && metier in ALUMNI_FIELDS ? (metier as AlumniField) : undefined;
  return <AlumniExplorer alumni={alumni} initialField={initial} />;
}
