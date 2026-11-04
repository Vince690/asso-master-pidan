import Link from "next/link";
import { ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import { Instagram, Linkedin } from "@/components/ui/Icons";
import { getMembers, getPartners, getPublishedArticles, getSettings } from "@/lib/data";
import { CURRICULUM, MASTER } from "@/lib/master";
import { SITE_DESCRIPTION, SITE_URL } from "@/lib/site";
import { promoLabel } from "@/lib/utils";
import { ALUMNI_FIELDS, type AlumniField } from "@/lib/types";
import { buttonClass, LinkButton } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Section";
import ArticleCard from "@/components/site/ArticleCard";
import { MemberList } from "@/components/site/MemberCard";
import DirectorTile from "@/components/site/DirectorTile";
import MailComposer from "@/components/site/MailComposer";

/** Les cinq grands thèmes du master, avec trois cours représentatifs chacun (titres tirés de la maquette). */
const THEMES = [
  {
    title: "Propriété intellectuelle",
    text: "Droit d'auteur, marques, brevets et leur valorisation, de l'open source aux contrats spéciaux.",
    codes: ["MYPI300", "MYPI401", "MYPI400"],
    span: "md:col-span-3",
  },
  {
    title: "Données, IA et libertés",
    text: "RGPD, AI Act, cybercriminalité, sécurité des systèmes : la matière qui bouge le plus vite.",
    codes: ["MYPI310", "MYPI404", "MYPI306"],
    span: "md:col-span-3",
  },
  {
    title: "Contrats et contentieux numériques",
    text: "Négocier et plaider dans l'univers digital, en français et en anglais.",
    codes: ["MYPI303", "MYPI409", "MYPI305"],
    span: "md:col-span-2",
  },
  {
    title: "Marchés et régulation",
    text: "Concurrence et innovation, commerce électronique, télécoms et audiovisuel.",
    codes: ["MYPI402", "MYPI411", "MYPI403"],
    span: "md:col-span-2",
  },
  {
    title: "Culture technique",
    text: "Réseaux, cryptologie, informatique appliquée : comprendre ce que l'on régule.",
    codes: ["MYPI307", "MYPI405", "MYPI414"],
    span: "md:col-span-2",
  },
];

const allCourses = CURRICULUM.flatMap((b) => b.courses);
const courseTitle = (code: string) => allCourses.find((c) => c.code === code)?.title ?? code;

function MoreLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="link-pill inline-flex items-center gap-1.5 text-sm font-medium text-electric-300">
      {children} <ArrowUpRight size={15} />
    </Link>
  );
}

export default async function HomePage() {
  const [articles, partners, settings, members] = await Promise.all([
    getPublishedArticles({ limit: 3 }),
    getPartners(),
    getSettings(),
    getMembers(),
  ]);
  const [featured, ...rest] = articles;
  const direction = members.find((m) => m.pole === "direction");
  const promo = members
    .filter((m) => m.promo === settings.currentPromo && m.pole !== "direction")
    .sort((a, b) => a.lastName.localeCompare(b.lastName, "fr") || a.firstName.localeCompare(b.firstName, "fr"));
  const alumniAll = members.filter((m) => m.promo < settings.currentPromo);
  const alumni = alumniAll.slice(0, 8);
  const alumniPromos = new Set(alumniAll.map((m) => m.promo)).size;
  const fieldCounts = (Object.keys(ALUMNI_FIELDS) as AlumniField[])
    .map((f) => ({ field: f, count: alumniAll.filter((m) => m.field === f).length }))
    .filter((x) => x.count > 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: MASTER.name,
    alternateName: ["M2 PIDAN", "PID@N"],
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    sameAs: [settings.linkedin, settings.instagram, settings.x, MASTER.links.saclay].filter(Boolean),
    parentOrganization: { "@type": "CollegeOrUniversity", name: MASTER.university, url: MASTER.links.saclay },
    address: {
      "@type": "PostalAddress",
      streetAddress: "3 rue de la Division Leclerc",
      postalCode: "78280",
      addressLocality: "Guyancourt",
      addressCountry: "FR",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      {/* ---- Hero ---- */}
      <header id="hero" className="container-site relative flex min-h-svh flex-col pt-24 pb-6 md:pt-28">
        <div className="max-w-4xl pt-2 pb-10 max-md:mx-auto max-md:flex max-md:flex-col max-md:items-center max-md:text-center md:pt-4">
          <p className="eyebrow animate-rise mb-6">M2 PIDAN · {MASTER.university} · Guyancourt</p>
          <h1 className="display animate-rise text-[2.5rem] [animation-delay:80ms] sm:text-[3.4rem] md:text-[4.6rem]">
            Le master du droit du numérique
            <br />
            <span className="text-fg-muted">et de la propriété intellectuelle.</span>
          </h1>
          <p className="animate-rise mt-6 max-w-2xl text-[1.02rem] leading-relaxed text-fg-muted [animation-delay:160ms] md:mt-7 md:text-xl">
            Master 2 Propriété intellectuelle et droit des affaires numériques, {MASTER.university}. Données personnelles, intelligence
            artificielle, contrats et contentieux, droit d'auteur, marques : une année pour couvrir le droit de l'économie numérique.
          </p>
          <div className="animate-rise mt-8 flex flex-wrap gap-3 max-sm:w-full max-sm:flex-col [animation-delay:240ms] md:mt-9">
            <a href="#master" className={buttonClass("primary", "lg")}>
              Découvrir le master
              <ArrowRight size={17} />
            </a>
            <LinkButton href="/articles?categorie=veille-juridique" variant="glass" size="lg">
              Lire la veille juridique
            </LinkButton>
          </div>
        </div>

        <dl className="glass glass-edge animate-rise mt-auto grid grid-cols-2 gap-y-4 rounded-3xl px-5 py-4 font-mono text-[0.72rem] text-fg-dim [animation-delay:320ms] sm:grid-cols-5 sm:gap-y-5 sm:px-6 sm:py-5 sm:text-[0.75rem] md:px-8">
          {[
            ["Université", "Paris-Saclay"],
            ["Direction", "Pr V.-L. Benabou"],
            ["Volume horaire", `${MASTER.hours} h`],
            ["Crédits", `${MASTER.ects} ECTS`],
            ["Promotion", `${MASTER.capacity} places`],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col gap-1">
              <dt>{k}</dt>
              <dd className="font-sans text-base font-semibold tracking-tight text-fg sm:text-lg">{v}</dd>
            </div>
          ))}
        </dl>
      </header>

      {/* ---- Le master ---- */}
      <Section id="master">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            className="mb-0"
            eyebrow="Le master"
            title="Ce qu'on y apprend."
            lead="Six blocs, vingt-trois enseignements, un mémoire, six mois de stage."
          />
          <MoreLink href="/le-master">Maquette complète</MoreLink>
        </div>
        <div className="grid gap-4 max-md:gap-3 md:grid-cols-6">
          {THEMES.map((t) => (
            <div key={t.title} className={t.span}>
              <div className="glass glass-edge flex h-full flex-col gap-3 rounded-3xl p-6 max-md:gap-2 max-md:rounded-2xl max-md:p-5">
                <h3 className="text-xl font-semibold tracking-tight text-fg max-md:text-lg">{t.title}</h3>
                <p className="text-sm leading-relaxed text-fg-muted">{t.text}</p>
                <ul className="mt-auto flex flex-col gap-1.5 border-t border-line pt-4 max-md:hidden">
                  {t.codes.map((code) => (
                    <li key={code} className="grid grid-cols-[3.6rem_1fr] items-baseline gap-3 text-[0.82rem] text-fg-muted">
                      <span className="font-mono text-[0.68rem] text-fg-dim">{code}</span>
                      <span className="line-clamp-1">{courseTitle(code)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          {direction && (
            <div className="md:col-span-6">
              <DirectorTile member={direction} variant="band" />
            </div>
          )}
        </div>
      </Section>

      {/* ---- Articles ---- */}
      {articles.length > 0 && (
        <Section id="articles">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              className="mb-0"
              eyebrow="Articles"
              title="Veille juridique et vie du master."
              lead="Un décryptage par semaine, signé par la promotion."
            />
            <MoreLink href="/articles">Tous les articles</MoreLink>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {featured && <ArticleCard article={featured} featured />}
            {rest.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </Section>
      )}

      {/* ---- Membres ---- */}
      <Section id="membres">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            className="mb-0"
            eyebrow={`Promotion ${promoLabel(settings.currentPromo)}`}
            title={`${promo.length} étudiants cette année.`}
          />
          <MoreLink href="/association">Bureau et pôles de l'association</MoreLink>
        </div>
        <MemberList members={promo} gridClassName="gap-3 sm:grid-cols-2 lg:grid-cols-4" subtitle={false} />
      </Section>

      {/* ---- Alumni ---- */}
      {alumniAll.length > 0 && (
        <Section id="alumni">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              className="mb-0"
              eyebrow="Alumni"
              title={`${alumniAll.length} anciens, ${alumniPromos} promotion${alumniPromos > 1 ? "s" : ""}.`}
              lead="Cabinets, entreprises, autorités, recherche. L'annuaire se parcourt par métier et par promotion."
            />
            <MoreLink href="/alumni">Explorer l'annuaire</MoreLink>
          </div>
          {fieldCounts.length > 0 && (
            <ul className="mb-6 flex flex-wrap gap-2">
              {fieldCounts.map(({ field, count }) => (
                <li key={field}>
                  <Link
                    href={`/alumni?metier=${field}`}
                    className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-sm font-medium text-fg-muted hover:border-line-strong hover:text-fg"
                  >
                    {ALUMNI_FIELDS[field]}
                    <span className="font-mono text-xs text-fg-dim">{count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <MemberList members={alumni} gridClassName="gap-3 sm:grid-cols-2 lg:grid-cols-4" />
        </Section>
      )}

      {/* ---- Partenaires ---- */}
      {partners.length > 0 && (
        <Section id="partenaires">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-6">
            <SectionHeading className="mb-0" eyebrow="Partenaires" title="Ils nous accueillent, nous forment, nous accréditent." />
            <MoreLink href="/contact?sujet=partenariat">Devenir partenaire</MoreLink>
          </div>
          <ul className="flex flex-wrap gap-3">
            {partners.map((p) => (
              <li key={p.id}>
                <a
                  href={p.url ?? "/partenaires"}
                  target={p.url ? "_blank" : undefined}
                  rel={p.url ? "noreferrer" : undefined}
                  className="glass inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium text-fg-muted transition-colors hover:text-fg"
                >
                  {p.name}
                </a>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* ---- Contact ---- */}
      <Section id="contact" className="pb-4">
        <div className="grid gap-8 md:grid-cols-[1fr_1.4fr] md:gap-14">
          <div>
            <SectionHeading
              className="mb-6"
              eyebrow="Contact"
              title="Nous écrire."
              lead="Intervenir, recruter, candidater, rejoindre l'annuaire : un email suffit."
            />
            <div className="flex flex-col gap-1">
              <a href={`mailto:${settings.contactEmail}`} className="link-pill inline-flex items-center gap-2 text-fg-muted">
                <Mail size={16} /> {settings.contactEmail}
              </a>
              <a
                href={settings.linkedin}
                target="_blank"
                rel="noreferrer"
                className="link-pill inline-flex items-center gap-2 text-fg-muted"
              >
                <Linkedin size={15} /> LinkedIn
              </a>
              <a
                href={settings.instagram}
                target="_blank"
                rel="noreferrer"
                className="link-pill inline-flex items-center gap-2 text-fg-muted"
              >
                <Instagram size={15} /> Instagram
              </a>
            </div>
          </div>
          <MailComposer to={settings.contactEmail} />
        </div>
      </Section>
    </>
  );
}
