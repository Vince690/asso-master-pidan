import type { Metadata } from "next";
import { getSettings } from "@/lib/data";
import { PageHero, Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Statuts de l'association",
  description: "Statuts de l'association PID@N, association des étudiants du M2 PIDAN.",
  alternates: { canonical: "/statuts" },
};

export default async function StatutsPage() {
  const settings = await getSettings();
  const html = settings.statutsHtml?.trim();
  return (
    <>
      <PageHero eyebrow="Association PID@N" title="Statuts de l'association." />
      <Section className="pt-0 md:pt-0">
        {html ? (
          <div className="prose-pidan" dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <div className="glass rounded-3xl p-10 text-fg-muted">Les statuts sont en cours de rédaction et seront publiés ici.</div>
        )}
      </Section>
    </>
  );
}
