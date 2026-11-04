import { getMembers, getPartners, getPublishedArticles, getSettings } from "@/lib/data";
import { CURRICULUM, MASTER } from "@/lib/master";
import { ARTICLE_CATEGORIES } from "@/lib/types";
import { SITE_URL } from "@/lib/site";
import { promoLabel } from "@/lib/utils";

/**
 * /llms.txt : description du site lisible par les assistants et moteurs à base de modèles de langage
 * (convention llmstxt.org). Généré à partir des mêmes données que les pages.
 */
export async function GET() {
  const [articles, partners, settings, members] = await Promise.all([getPublishedArticles(), getPartners(), getSettings(), getMembers()]);
  const promo = members.filter((m) => m.promo === settings.currentPromo);

  const lines: string[] = [
    `# PID@N — ${MASTER.name}`,
    "",
    `> Site du M2 PIDAN (${MASTER.university}, enseigné à la ${MASTER.faculty}, ${MASTER.campus}), tenu par l'association étudiante PID@N. Veille juridique en droit du numérique et propriété intellectuelle, présentation du master, membres, alumni, partenaires.`,
    "",
    "## Le master",
    "",
    `- Intitulé : ${MASTER.name} (${MASTER.short}), mention « ${MASTER.mention} », RNCP ${MASTER.rncp}.`,
    `- Université : ${MASTER.university}. Lieu : ${MASTER.address}.`,
    `- Direction : ${MASTER.director.name}, ${MASTER.director.title}.`,
    `- ${MASTER.capacity} places, ${MASTER.ects} ECTS, ${MASTER.hours} heures de cours, stage obligatoire (six mois en moyenne) et mémoire.`,
    `- Laboratoire de rattachement : ${MASTER.lab.name} (${MASTER.lab.full}).`,
    "",
    "### Programme (maquette 2024-2025)",
    "",
    ...CURRICULUM.map(
      (b) => `- Semestre ${b.semester}, ${b.title} (${b.ects} ECTS) : ${b.courses.map((c) => `${c.title} (${c.hours} h)`).join(" ; ")}.`,
    ),
    "",
    "## Pages",
    "",
    `- [Accueil](${SITE_URL}/)`,
    `- [Le master](${SITE_URL}/le-master) : objectifs, maquette complète, direction, campus.`,
    `- [Articles](${SITE_URL}/articles) : ${Object.values(ARTICLE_CATEGORIES)
      .map((c) => c.label.toLowerCase())
      .join(", ")}.`,
    `- [Membres](${SITE_URL}/membres) : promotion ${promoLabel(settings.currentPromo)} (${promo.length} étudiants).`,
    `- [Association](${SITE_URL}/association) : bureau et pôles.`,
    `- [Alumni](${SITE_URL}/alumni) : anciens par promotion.`,
    `- [Partenaires](${SITE_URL}/partenaires) : ${partners.map((p) => p.name).join(", ")}.`,
    `- [Contact](${SITE_URL}/contact) : ${settings.contactEmail}.`,
    "",
    "## Articles",
    "",
    ...articles.map((a) => `- [${a.title}](${SITE_URL}/articles/${a.slug}) : ${a.excerpt}`),
    "",
    "## Réseaux",
    "",
    `- LinkedIn : ${settings.linkedin}`,
    `- Instagram : ${settings.instagram}`,
    `- Plan du site : ${SITE_URL}/sitemap.xml`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" },
  });
}
