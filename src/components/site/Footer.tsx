import Link from "next/link";
import { cacheLife } from "next/cache";
import { ArrowUpRight } from "lucide-react";
import { Instagram, Linkedin } from "@/components/ui/Icons";
import { MASTER } from "@/lib/master";
import type { SiteSettings } from "@/lib/types";
import Logo from "./Logo";
import SmartLink from "./SmartLink";

const COLUMNS = [
  {
    title: "Découvrir",
    links: [
      { href: "/le-master", label: "Le master" },
      { href: "/le-master#programme", label: "Programme" },
      { href: "/partenaires", label: "Partenaires" },
    ],
  },
  {
    title: "L'association",
    links: [
      { href: "/membres", label: "La promotion" },
      { href: "/association", label: "L'association" },
      { href: "/alumni", label: "Alumni" },
      { href: "/articles", label: "Articles" },
      { href: "/#contact", label: "Contact" },
    ],
  },
];

/** Auteur du site : fiche membre accessible depuis le crédit en bas de page. */
export const SITE_AUTHOR = { name: "Vincent Legardien", slug: "vincent-legardien" };

async function getYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export default async function Footer({ settings }: { settings: SiteSettings }) {
  const year = await getYear();
  return (
    <footer className="container-site relative z-10 mt-16 pb-8">
      <div className="glass glass-edge rounded-[2rem] px-6 py-10 md:px-10 md:py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="flex flex-col gap-5">
            <Logo markSize={34} />
            <p className="max-w-xs text-sm leading-relaxed text-fg-muted">
              Association des étudiants du {MASTER.name}, {MASTER.university}.
            </p>
            <div className="flex gap-2">
              <a
                href={settings.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-fg-muted transition-colors hover:bg-white/10 hover:text-fg"
              >
                <Linkedin size={16} />
              </a>
              <a
                href={settings.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-fg-muted transition-colors hover:bg-white/10 hover:text-fg"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 text-sm font-semibold text-fg">{col.title}</h3>
              <ul className="flex flex-col gap-0.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <SmartLink href={l.href} className="link-pill text-sm text-fg-muted">
                      {l.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <div className="mb-3 flex items-center gap-3">
              <h3 className="text-sm font-semibold text-fg">Où nous trouver</h3>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Facult%C3%A9+de+droit+et+science+politique+UVSQ%2C+3+rue+de+la+Division+Leclerc%2C+78280+Guyancourt"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-xs font-medium text-fg-muted hover:bg-white/10 hover:text-fg"
              >
                Itinéraire <ArrowUpRight size={12} />
              </a>
            </div>
            <address className="text-sm leading-relaxed text-fg-muted not-italic">
              {MASTER.faculty}
              <br />
              {MASTER.address}
            </address>
            <a href={`mailto:${settings.contactEmail}`} className="link-pill mt-2 text-sm text-electric-300">
              {settings.contactEmail}
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6 text-xs text-fg-dim sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Association PID@N. Site indépendant de l'{MASTER.university}. Conçu et développé par{" "}
            <Link
              href={`/membres/${SITE_AUTHOR.slug}`}
              className="text-fg-muted underline decoration-line underline-offset-4 hover:text-fg"
            >
              {SITE_AUTHOR.name}
            </Link>
            .
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/statuts" className="link-pill">
              Statuts
            </Link>
            <Link href="/mentions-legales" className="link-pill">
              Mentions légales
            </Link>
            <Link href="/admin" className="link-pill">
              Espace membres
            </Link>
            {settings.github && (
              <a href={settings.github} target="_blank" rel="noreferrer" className="link-pill inline-flex items-center gap-1">
                GitHub <ArrowUpRight size={11} />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
