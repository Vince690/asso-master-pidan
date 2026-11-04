import type { Metadata } from "next";
import { MASTER } from "@/lib/master";
import { PageHero, Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: false, follow: true },
};

export default function LegalPage() {
  return (
    <>
      <PageHero eyebrow="Informations" title="Mentions légales." />
      <Section className="pt-0 md:pt-0">
        <div className="prose-pidan">
          <h2>Éditeur</h2>
          <p>
            Association PID@N, association étudiante du {MASTER.name} ({MASTER.university}). Siège : {MASTER.faculty}, {MASTER.address}. Ce
            site est édité par les étudiants et n'engage pas l'université.
          </p>
          <h2>Hébergement</h2>
          <p>Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.</p>
          <h2>Données personnelles</h2>
          <p>
            Le formulaire de contact collecte un nom, une adresse email et un message, utilisés uniquement pour répondre à la demande. Ces
            données sont conservées un an au maximum. Vous pouvez demander leur accès, leur rectification ou leur suppression à l'adresse de
            contact de l'association. Aucun traceur publicitaire n'est déposé.
          </p>
          <h2>Propriété intellectuelle</h2>
          <p>
            Les articles sont rédigés par les étudiants de l'association et publiés sous leur responsabilité. Toute reproduction est soumise
            à autorisation, sauf courte citation avec mention de la source. Le code source du site est publié sous licence libre.
          </p>
        </div>
      </Section>
    </>
  );
}
