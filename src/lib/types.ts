export type ArticleCategory = "veille-juridique" | "vie-du-master" | "evenements";

export const ARTICLE_CATEGORIES: Record<ArticleCategory, { label: string; short: string; description: string }> = {
  "veille-juridique": {
    label: "Veille juridique",
    short: "Veille",
    description: "Analyses et décryptages de l'actualité du droit du numérique et de la propriété intellectuelle.",
  },
  "vie-du-master": {
    label: "Vie du master",
    short: "Master",
    description: "Cours délocalisés, rencontres, projets et coulisses de la promotion.",
  },
  evenements: {
    label: "Événements",
    short: "Événement",
    description: "Conférences, concours de plaidoirie, afterworks et rendez-vous à venir.",
  },
};

export type ArticleStatus = "draft" | "published";

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  /** HTML produit par l'éditeur */
  content: string;
  category: ArticleCategory;
  tags: string[];
  coverImage?: string;
  /** Composition de couverture générée (0..COVER_STYLES-1), choisie à la création pour varier d'un article à l'autre */
  coverStyle?: number;
  status: ArticleStatus;
  authorId: string;
  authorName: string;
  readingMinutes: number;
  publishedAt: string | null; // ISO
  createdAt: string;
  updatedAt: string;
  seoTitle?: string;
  seoDescription?: string;
}

export type Pole = "direction" | "bureau" | "communication" | "veille-juridique" | "evenementiel" | null;

export const POLES: Record<Exclude<Pole, null>, { label: string; description: string }> = {
  direction: { label: "Direction du master", description: "La responsable pédagogique du master." },
  bureau: { label: "Bureau", description: "Présidence, trésorerie et secrétariat de l'association." },
  communication: { label: "Pôle Communication", description: "LinkedIn, Instagram, site et identité visuelle." },
  "veille-juridique": { label: "Pôle Veille juridique", description: "Articles hebdomadaires et décryptages de l'actualité." },
  evenementiel: { label: "Pôle Événementiel", description: "Conférences, afterworks, sorties et partenariats." },
};

export type AlumniField =
  | "avocat"
  | "juriste-entreprise"
  | "donnees-conformite"
  | "recherche-enseignement"
  | "secteur-public"
  | "entrepreneuriat-tech"
  | "conseil-pi";

export const ALUMNI_FIELDS: Record<AlumniField, string> = {
  avocat: "Avocat",
  "juriste-entreprise": "Juriste d'entreprise",
  "donnees-conformite": "Données & conformité",
  "recherche-enseignement": "Recherche & enseignement",
  "secteur-public": "Secteur public & institutions",
  "entrepreneuriat-tech": "Entrepreneuriat & tech",
  "conseil-pi": "Conseil en propriété industrielle",
};

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  /** Année de début de la promo, ex. 2026 pour 2026-2027 */
  promo: number;
  pole: Pole;
  /** Fonction précise : "Présidente", "Trésorier", "Responsable LinkedIn"… */
  role?: string;
  photo?: string;
  linkedin?: string;
  /** Contact public, affiché sur la fiche */
  email?: string;
  bio?: string;
  /** Pour les alumni : poste actuel */
  currentPosition?: string;
  currentCompany?: string;
  /** Pour les alumni : famille de métier, pour filtrer l'annuaire */
  field?: AlumniField;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type PartnerType = "cabinet" | "entreprise" | "institution";

export interface Partner {
  id: string;
  name: string;
  type: PartnerType;
  url?: string;
  logo?: string;
  description?: string;
  order: number;
}

export type UserRole = "admin" | "member";

export interface AppUser {
  /** email en minuscules, sert de clé */
  email: string;
  displayName: string;
  role: UserRole;
  invitedAt: string;
  lastLoginAt?: string;
}

export interface SiteSettings {
  currentPromo: number;
  contactEmail: string;
  linkedin: string;
  instagram: string;
  x?: string;
  tagline: string;
  /** Dépôt du code source, affiché dans le pied de page quand il est renseigné */
  github?: string;
  /** Statuts de l'association (HTML de l'éditeur), vide tant qu'ils ne sont pas publiés */
  statutsHtml?: string;
}

export interface SessionUser {
  email: string;
  displayName: string;
  role: UserRole;
}
