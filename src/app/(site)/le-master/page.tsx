import type { Metadata } from "next";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Linkedin } from "@/components/ui/Icons";
import { CURRICULUM, MASTER } from "@/lib/master";
import { getMembers } from "@/lib/data";
import { PageHero, Section, SectionHeading } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { SITE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Le master",
  description: `${MASTER.name} (M2 PIDAN), ${MASTER.university} : objectifs, maquette des cours par blocs, direction et campus de Guyancourt.`,
  alternates: { canonical: "/le-master" },
};

export default async function MasterPage() {
  const direction = (await getMembers()).find((m) => m.pole === "direction");
  const director = direction
    ? {
        name: `${direction.firstName} ${direction.lastName}`,
        title: direction.role ?? MASTER.director.title,
        detail: direction.bio ?? MASTER.director.detail,
        linkedin: direction.linkedin ?? MASTER.director.linkedin,
      }
    : MASTER.director;
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

  const semesters = [
    { label: "Semestre 3", blocks: CURRICULUM.filter((b) => b.semester === 3), ects: 26, hours: 165 },
    { label: "Semestre 4", blocks: CURRICULUM.filter((b) => b.semester === 4), ects: 34, hours: 212 },
  ];

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
      <Section className="pt-4">
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
        <div className="flex flex-col gap-10">
          {semesters.map((sem) => (
            <div key={sem.label}>
              <div className="mb-4 flex items-baseline justify-between border-b border-line pb-3">
                <h3 className="text-xl font-semibold tracking-tight text-fg">{sem.label}</h3>
                <span className="font-mono text-xs text-fg-muted">
                  {sem.ects} ECTS · {sem.hours} h
                </span>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {sem.blocks.map((b) => (
                  <article key={b.id} className="glass glass-edge flex flex-col rounded-3xl p-6 md:p-7">
                    <header className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-[1.15rem] leading-snug font-semibold tracking-tight text-fg text-balance">{b.title}</h4>
                        <p className="mt-1.5 text-sm text-fg-muted">{b.intent}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-electric-500/15 px-3 py-1 font-mono text-[0.72rem] text-electric-200">
                        {b.ects} ECTS
                      </span>
                    </header>
                    <ul className="mt-5 flex flex-col gap-1.5">
                      {b.courses.map((c) => (
                        <li
                          key={c.code}
                          className={cn(
                            "grid items-baseline gap-x-3 rounded-xl bg-white/[0.04] px-3.5 py-2.5",
                            b.optional ? "grid-cols-[1.4rem_1fr_auto]" : "grid-cols-[1fr_auto]",
                          )}
                        >
                          {b.optional && <span className="font-mono text-xs text-fg-dim">ou</span>}
                          <span className="text-[0.95rem] leading-snug text-fg">
                            {c.title}
                            {c.note && <span className="ml-2 text-xs text-fg-dim">({c.note})</span>}
                          </span>
                          <span className="font-mono text-xs text-fg-muted tabular-nums">{c.hours} h</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Direction */}
      <Section id="direction">
        <SectionHeading eyebrow="Direction" title="Une directrice, un laboratoire." />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="glass glass-edge rounded-3xl p-7">
            <p className="text-xl font-semibold tracking-tight text-fg">{director.name}</p>
            <p className="mt-1 font-mono text-xs text-electric-300">Professeure de droit privé, {director.title.toLowerCase()}</p>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-fg-muted">{director.detail}</p>
            <a
              href={director.linkedin}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-electric-300 hover:text-electric-200"
            >
              <Linkedin size={14} /> Profil LinkedIn
            </a>
          </div>
          <div className="glass glass-edge rounded-3xl p-7">
            <p className="text-xl font-semibold tracking-tight text-fg">{MASTER.lab.name}</p>
            <p className="mt-1 font-mono text-xs text-electric-300">{MASTER.lab.full}</p>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-fg-muted">
              Les étudiants du master sont associés à l'axe « {MASTER.lab.axis} », participent aux déjeuners du laboratoire et au Concours
              national de plaidoirie en propriété intellectuelle, dont le DANTE est partenaire.
            </p>
            <a
              href={MASTER.links.dante}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-electric-300 hover:text-electric-200"
            >
              Site du laboratoire <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </Section>

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
