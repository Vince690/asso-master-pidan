import type { Metadata } from "next";
import { ArrowUpRight, MapPin } from "lucide-react";
import { CURRICULUM, MASTER } from "@/lib/master";
import { getMembers } from "@/lib/data";
import DirectorCard from "@/components/site/DirectorCard";
import CurriculumTabs from "@/components/site/CurriculumTabs";
import { PageHero, Section, SectionHeading } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Le master",
  description: `${MASTER.name} (M2 PIDAN), ${MASTER.university} : objectifs, maquette des cours par blocs, direction et campus de Guyancourt.`,
  alternates: { canonical: "/le-master" },
};

export default async function MasterPage() {
  const direction = (await getMembers()).find((m) => m.pole === "direction");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: MASTER.name,
    alternateName: MASTER.short,
    description:
      "Master 2 formant aux enjeux juridiques des technologies numériques : propriété intellectuelle, données personnelles, IA, contrats et contentieux numériques.",
    provider: { "@type": "CollegeOrUniversity", name: MASTER.university, sameAs: MASTER.links.saclay },
    url: `${SITE_URL}/le-master`,
    educationalCredentialAwarded: "Master (RNCP 34435)",
    numberOfCredits: MASTER.ects,
    inLanguage: ["fr", "en"],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PageHero
        eyebrow={`${MASTER.mention} · RNCP ${MASTER.rncp}`}
        title={
          <>
            Propriété intellectuelle <span className="text-fg-muted">et droit des affaires numériques.</span>
          </>
        }
        lead="Un Master 2 de l'Université Paris-Saclay, enseigné à la faculté de droit de l'UVSQ, qui forme des juristes capables de lire les technologies avec les outils normatifs les plus récents."
      >
        <div className="animate-rise mt-2 flex flex-wrap gap-3 [animation-delay:180ms]">
          <LinkButton href="#programme">Voir le programme</LinkButton>
          <LinkButton href={MASTER.links.saclay} variant="glass" target="_blank" rel="noreferrer">
            Fiche officielle Paris-Saclay <ArrowUpRight size={15} />
          </LinkButton>
        </div>
      </PageHero>

      {/* Objectifs */}
      <Section className="pt-2 md:pt-4">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              t: "Théorie et pratique",
              d: "Droit des affaires fondamental, cours spécialisés en propriété intellectuelle et droit du numérique, compléments en informatique et en économie.",
            },
            {
              t: "Une spécialisation choisie",
              d: "Options, travaux personnels et mémoire permettent d'orienter l'année vers la propriété intellectuelle ou vers le droit du numérique.",
            },
            {
              t: "Insertion rapide",
              d: "Stage de six mois en moyenne, ateliers d'oralité, préparation au CN2PI, et une poursuite en doctorat possible au laboratoire DANTE.",
            },
          ].map((o) => (
            <div key={o.t} className="glass glass-edge rounded-3xl p-6">
              <h2 className="text-lg font-semibold tracking-tight text-fg">{o.t}</h2>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-fg-muted">{o.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Programme */}
      <Section id="programme">
        <SectionHeading
          eyebrow="Maquette 2024-2025"
          title="Six blocs, soixante crédits."
          lead={`${MASTER.hours} heures de cours sur deux semestres, du socle de propriété intellectuelle aux options en anglais.`}
        />
        <CurriculumTabs blocks={CURRICULUM} />
      </Section>

      {/* Direction */}
      {direction && (
        <Section id="direction">
          <DirectorCard member={direction} />
        </Section>
      )}

      {/* Lieu */}
      <Section className="pb-4">
        <div className="glass glass-edge flex flex-col gap-6 rounded-[2rem] p-8 md:flex-row md:items-center md:justify-between md:p-10">
          <div className="flex items-start gap-4">
            <span className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-electric-300">
              <MapPin size={18} />
            </span>
            <div>
              <p className="text-xl font-semibold tracking-tight text-fg">{MASTER.faculty}</p>
              <p className="mt-1 text-fg-muted">{MASTER.address}</p>
              <p className="mt-3 text-sm text-fg-dim">
                RER C Saint-Quentin-en-Yvelines, bibliothèque, résidence et restaurant universitaires sur place.
              </p>
            </div>
          </div>
          <LinkButton
            href="https://www.google.com/maps/search/?api=1&query=3+rue+de+la+Division+Leclerc+78280+Guyancourt"
            variant="glass"
            target="_blank"
            rel="noreferrer"
          >
            Itinéraire <ArrowUpRight size={15} />
          </LinkButton>
        </div>
      </Section>
    </>
  );
}
