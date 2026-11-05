import type { Metadata } from "next";
import { Suspense } from "react";
import { Mail } from "lucide-react";
import { Instagram, Linkedin } from "@/components/ui/Icons";
import { getSettings } from "@/lib/data";
import { MASTER } from "@/lib/master";
import { PageHero, Section } from "@/components/ui/Section";
import MailComposer from "@/components/site/MailComposer";

export const metadata: Metadata = {
  title: "Contact",
  description: "Écrire à l'association des étudiants du M2 PIDAN : partenariats, interventions, annuaire alumni, questions sur le master.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const settings = await getSettings();
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Écrivez-nous."
        lead="Partenariat, intervention, annuaire alumni ou simple question : un email suffit."
      />
      <Section className="pt-0 md:pt-0">
        <div className="grid gap-10 max-md:gap-6 md:grid-cols-[1fr_1.4fr] md:gap-16">
          {/* Mobile : le formulaire passe en premier, les coordonnées suivent dans un panneau compact */}
          <aside className="flex flex-col gap-8 max-md:order-2 max-md:gap-6 max-md:rounded-3xl max-md:border max-md:border-line max-md:p-5">
            <div>
              <p className="eyebrow mb-3">Par email</p>
              <a
                href={`mailto:${settings.contactEmail}`}
                className="inline-flex items-center gap-2 text-lg font-medium break-all text-fg hover:text-electric-300 max-sm:text-base"
              >
                <Mail size={18} className="shrink-0" /> {settings.contactEmail}
              </a>
            </div>
            <div>
              <p className="eyebrow mb-3">Sur les réseaux</p>
              <div className="flex flex-col gap-2">
                <a
                  href={settings.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-fg-muted hover:text-fg"
                >
                  <Linkedin size={16} /> LinkedIn
                </a>
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-fg-muted hover:text-fg"
                >
                  <Instagram size={16} /> Instagram
                </a>
              </div>
            </div>
            <div>
              <p className="eyebrow mb-3">Pour le master lui-même</p>
              <p className="text-sm leading-relaxed text-fg-muted">
                Candidatures, scolarité et questions administratives : {MASTER.contacts.secretariat},{" "}
                <a href={`mailto:${MASTER.contacts.secretariatEmail}`} className="text-fg hover:text-electric-300">
                  {MASTER.contacts.secretariatEmail}
                </a>
                .
              </p>
            </div>
          </aside>
          <Suspense fallback={<div className="glass h-[32rem] animate-pulse rounded-3xl max-md:order-1" />}>
            <div className="min-w-0 max-md:order-1">
              <FormWithSubject searchParams={searchParams} to={settings.contactEmail} />
            </div>
          </Suspense>
        </div>
      </Section>
    </>
  );
}

async function FormWithSubject({ searchParams, to }: Pick<PageProps<"/contact">, "searchParams"> & { to: string }) {
  const { sujet } = await searchParams;
  const subject = typeof sujet === "string" ? sujet : undefined;
  return <MailComposer key={subject ?? ""} to={to} defaultSubject={subject} />;
}
