import type { Metadata } from "next";
import { ArrowUpRight, BookOpen, Briefcase, GraduationCap } from "lucide-react";
import { CURRICULUM, MASTER } from "@/lib/master";
import { getMembers } from "@/lib/data";
import DirectorTile from "@/components/site/DirectorTile";
import CurriculumTabs from "@/components/site/CurriculumTabs";
import { PageHero, Section, SectionHeading } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Le master",
  description: `${MASTER.name} (M2 PIDAN), ${MASTER.university} : objectifs, maquette des cours par blocs, direction et campus de Guyancourt.`,
  alternates: { canonical: "/le-master" },
};

/** Points clés, en dehors des cours : ce que la maquette ne montre pas. */
const KEY_POINTS = [
  { icon: Briefcase, title: "Stage", text: "six mois en moyenne" },
  { icon: BookOpen, title: "Mémoire", text: "recherche encadrée toute l'année" },
  { icon: GraduationCap, title: "Doctorat", text: "possible au laboratoire DANTE" },
];

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

      {/* Points clés : une rangée de petites pilules */}
      <Section className="pt-2 pb-0 md:pt-4 md:pb-0">
        <ul className="animate-rise flex flex-wrap gap-2 [animation-delay:260ms]">
          {KEY_POINTS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="glass glass-edge flex items-center gap-3 rounded-full py-1.5 pr-4 pl-1.5">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-electric-500/15 text-electric-200">
                <Icon size={15} />
              </span>
              <span className="text-sm">
                <span className="font-semibold text-fg">{title}</span>
                <span className="text-fg-muted"> · {text}</span>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Programme */}
      <Section id="programme" className="pt-10 md:pt-12">
        <SectionHeading
          eyebrow="Maquette 2024-2025"
          title="Six blocs, soixante crédits."
          lead={`${MASTER.hours} heures de cours sur deux semestres, du socle de propriété intellectuelle aux options en anglais.`}
        />
        <CurriculumTabs blocks={CURRICULUM} />
      </Section>

      {/* Direction et campus : deux colonnes au même format, sans bloc rapporté */}
      <Section id="direction" className="pb-4">
        <div className="grid gap-10 border-t border-line pt-10 md:grid-cols-2 md:gap-16">
          {direction && <DirectorTile member={direction} variant="column" />}
          <div className="flex flex-col">
            <span className="eyebrow">Campus</span>
            <h3 className="mt-5 text-xl font-semibold tracking-tight text-fg">{MASTER.faculty}</h3>
            <p className="mt-1 text-sm text-fg-muted">{MASTER.address}</p>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-fg-muted">
              À deux pas du RER C Saint-Quentin-en-Yvelines. Bibliothèque, résidence et restaurant universitaires sur place.
            </p>
            <div className="mt-auto flex flex-wrap gap-2 pt-5">
              <LinkButton
                href="https://www.google.com/maps/search/?api=1&query=3+rue+de+la+Division+Leclerc+78280+Guyancourt"
                variant="glass"
                size="sm"
                target="_blank"
                rel="noreferrer"
              >
                Itinéraire <ArrowUpRight size={14} />
              </LinkButton>
              <LinkButton href={MASTER.links.uvsq} variant="ghost" size="sm" target="_blank" rel="noreferrer">
                Page UVSQ <ArrowUpRight size={14} />
              </LinkButton>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
