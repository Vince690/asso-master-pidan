import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { getPartners } from "@/lib/data";
import { PARTNER_TYPES, type PartnerType } from "@/lib/types";
import { PageHero, Section, SectionHeading } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Partenaires",
  description: "Cabinets, entreprises et institutions qui accueillent, forment et accompagnent les étudiants du M2 PIDAN.",
  alternates: { canonical: "/partenaires" },
};

const TYPES: Record<PartnerType, string> = {
  cabinet: "Cabinets d'avocats",
  entreprise: "Entreprises",
  institution: "Institutions",
  intervenant: "Intervenants",
  association: "Associations",
};
void PARTNER_TYPES;

export default async function PartnersPage() {
  const partners = await getPartners();
  const groups = (Object.keys(TYPES) as PartnerType[])
    .map((t) => ({ type: t, list: partners.filter((p) => p.type === t) }))
    .filter((g) => g.list.length);

  return (
    <>
      <PageHero
        eyebrow="Partenaires"
        title="Ils enseignent, nous reçoivent, nous recrutent."
        lead="Une partie des cours se tient directement chez les praticiens. Les partenaires du master sont aussi ses premiers recruteurs."
      />
      {groups.map((g) => (
        <Section key={g.type} className="py-8 md:py-10">
          <Reveal>
            <SectionHeading className="mb-6" title={TYPES[g.type]} />
            <ul className="grid gap-4 md:grid-cols-2">
              {g.list.map((p) => (
                <li key={p.id} className="glass glass-edge flex flex-col gap-3 rounded-3xl p-7 max-md:rounded-2xl max-md:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {p.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.logo} alt="" className="h-10 w-10 rounded-xl bg-white object-contain p-1" />
                      ) : (
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 font-semibold text-fg">
                          {p.name.charAt(0)}
                        </span>
                      )}
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold tracking-tight text-fg">{p.name}</h3>
                        {p.via && <p className="text-sm text-fg-muted">{p.via}</p>}
                      </div>
                    </div>
                    {p.url && (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Site de ${p.name}`}
                        className="text-fg-dim hover:text-fg"
                      >
                        <ArrowUpRight size={18} />
                      </a>
                    )}
                  </div>
                  {p.description && <p className="text-sm leading-relaxed text-fg-muted">{p.description}</p>}
                </li>
              ))}
            </ul>
          </Reveal>
        </Section>
      ))}
      <Section>
        <div className="glass-strong glass-edge rounded-[2rem] p-8 max-md:rounded-3xl max-md:p-6 md:p-12">
          <h2 className="display text-[1.8rem] md:text-[2.4rem]">Devenir partenaire</h2>
          <p className="mt-4 max-w-xl text-fg-muted">
            Accueillir un cours, intervenir dans le cycle de conférences, proposer des stages ou parrainer un événement : écrivez-nous, on
            vous répond vite.
          </p>
          <div className="mt-8">
            <LinkButton href="/contact?sujet=partenariat" variant="electric">
              Proposer un partenariat
            </LinkButton>
          </div>
        </div>
      </Section>
    </>
  );
}
