import type { Article, Member, Partner, SiteSettings, AppUser } from "./types";

const now = "2026-11-04T10:00:00.000Z";

export const seedSettings: SiteSettings = {
  currentPromo: 2026,
  contactEmail: "contact@m2pidan.fr",
  linkedin: "https://www.linkedin.com/in/m2pidan/",
  instagram: "https://www.instagram.com/m2pidan/",
  x: "https://x.com/m2pidan",
  tagline: "Le master qui pense le droit à l'ère numérique.",
  github: "https://github.com/Vince690/asso-master-pidan",
  statutsHtml: "",
};

export const seedUsers: AppUser[] = [
  { email: "admin@m2pidan.fr", displayName: "Administrateur démo", role: "admin", invitedAt: now },
  { email: "membre@m2pidan.fr", displayName: "Membre démo", role: "member", invitedAt: now },
];

export const seedArticles: Article[] = [
  {
    id: "a1",
    coverStyle: 0,
    title: "AI Act : ce qui s'applique vraiment depuis le 2 août 2026",
    slug: "ai-act-ce-qui-s-applique-depuis-le-2-aout-2026",
    excerpt:
      "Le gros des obligations du règlement européen sur l'intelligence artificielle est entré en application cet été. Tour d'horizon de ce qui change pour les fournisseurs, les déployeurs et leurs conseils.",
    category: "veille-juridique",
    tags: ["IA", "AI Act", "Compliance", "Union européenne"],
    status: "published",
    authorId: "membre@m2pidan.fr",
    authorName: "Pôle Veille juridique",
    readingMinutes: 6,
    publishedAt: "2026-10-28T08:00:00.000Z",
    createdAt: "2026-10-27T18:00:00.000Z",
    updatedAt: "2026-10-28T08:00:00.000Z",
    content: `
<p>Entré en vigueur le 1<sup>er</sup> août 2024, le règlement (UE) 2024/1689, dit <em>AI Act</em>, a été conçu pour s'appliquer par paliers. Après l'interdiction des pratiques prohibées en février 2025 et les premières obligations des modèles d'IA à usage général en août 2025, le 2 août 2026 marquait la bascule la plus attendue : l'application de la majorité du texte, dont le régime des systèmes à haut risque de l'annexe III.</p>
<h2>Trois catégories d'acteurs, trois niveaux d'exigence</h2>
<p>Le règlement distingue le <strong>fournisseur</strong>, qui développe ou fait développer un système et le met sur le marché sous son nom, le <strong>déployeur</strong>, qui l'utilise sous sa propre autorité dans un cadre professionnel, et les acteurs de la chaîne (importateurs, distributeurs). Pour un juriste d'entreprise, la première question est donc de qualifier le rôle de son organisation pour chaque cas d'usage, sachant qu'un déployeur qui modifie substantiellement un système peut devenir fournisseur.</p>
<h2>Les systèmes à haut risque</h2>
<p>Les systèmes listés à l'annexe III (recrutement, accès aux services essentiels, éducation, répression…) doivent désormais respecter un ensemble d'obligations : système de gestion des risques, gouvernance des données d'entraînement, documentation technique, journalisation, transparence vis-à-vis des déployeurs, contrôle humain, exactitude et cybersécurité. Le déployeur, de son côté, doit utiliser le système conformément à la notice, assurer une surveillance humaine et, pour certains usages, réaliser une analyse d'impact sur les droits fondamentaux.</p>
<h2>La transparence pour tout le monde</h2>
<p>Indépendamment du niveau de risque, l'article 50 impose d'informer les personnes qu'elles interagissent avec une IA, et de marquer les contenus générés ou manipulés (<em>deepfakes</em>) de manière détectable. Cette obligation, souvent sous-estimée, concerne directement les services grand public et les équipes marketing.</p>
<h2>Ce qu'il faut retenir</h2>
<ul>
<li>Cartographier les systèmes d'IA utilisés ou fournis, et qualifier son rôle pour chacun.</li>
<li>Vérifier si l'un d'eux relève de l'annexe III et lancer la mise en conformité.</li>
<li>Déployer dès maintenant les mesures de transparence de l'article 50.</li>
<li>Suivre les lignes directrices de la Commission et les positions de la CNIL, qui précisent au fil de l'eau l'articulation avec le RGPD.</li>
</ul>
<p>Le prochain jalon est fixé au 2 août 2027 pour les systèmes à haut risque intégrés dans des produits déjà soumis à une législation d'harmonisation (annexe I).</p>`,
    seoDescription:
      "Décryptage des obligations de l'AI Act applicables depuis le 2 août 2026 : haut risque, transparence, rôles de fournisseur et de déployeur.",
  },
  {
    id: "a2",
    coverStyle: 2,
    title: "Deux cours dans les locaux d'Ashurst Perkins Coie",
    slug: "deux-cours-chez-ashurst-perkins-coie",
    excerpt:
      "La promotion a été accueillie à deux reprises au cabinet pour des séances consacrées au droit du numérique, animées par un associé spécialiste de la matière.",
    category: "vie-du-master",
    tags: ["Cabinet", "Cours délocalisé", "Droit du numérique"],
    status: "published",
    authorId: "membre@m2pidan.fr",
    authorName: "Pôle Communication",
    readingMinutes: 3,
    publishedAt: "2026-10-20T17:00:00.000Z",
    createdAt: "2026-10-19T18:00:00.000Z",
    updatedAt: "2026-10-20T17:00:00.000Z",
    content: `
<p>Sortir des amphithéâtres fait partie de l'ADN du master. Cette année, deux séances du cours de droit du numérique se sont tenues directement dans les bureaux parisiens d'Ashurst Perkins Coie, l'un des plus grands cabinets d'affaires anglo-américains.</p>
<p>Au programme : la négociation des contrats de services numériques, la gestion des incidents de sécurité et la mise en conformité des projets d'intelligence artificielle, le tout à partir de cas réels anonymisés. L'associé qui nous a reçus a partagé sa pratique quotidienne et répondu sans détour aux questions sur le métier d'avocat en droit du numérique.</p>
<h2>Pourquoi c'est important</h2>
<p>Ces cours délocalisés donnent à la promotion un accès direct aux praticiens qui recrutent, et aux cabinets une vitrine sur les étudiants qu'ils forment. Un remerciement appuyé à toute l'équipe du cabinet pour son accueil.</p>`,
  },
  {
    id: "a3",
    coverStyle: 6,
    title: "Données d'entraînement et droit d'auteur : où en est la jurisprudence ?",
    slug: "donnees-d-entrainement-et-droit-d-auteur-jurisprudence",
    excerpt:
      "Des deux côtés de l'Atlantique, les décisions sur l'entraînement des modèles génératifs se multiplient. État des lieux et grille de lecture pour les praticiens.",
    category: "veille-juridique",
    tags: ["Droit d'auteur", "IA générative", "Fouille de textes et de données", "Jurisprudence"],
    status: "published",
    authorId: "membre@m2pidan.fr",
    authorName: "Pôle Veille juridique",
    readingMinutes: 7,
    publishedAt: "2026-10-14T08:00:00.000Z",
    createdAt: "2026-10-13T18:00:00.000Z",
    updatedAt: "2026-10-14T08:00:00.000Z",
    content: `
<p>La question est simple à formuler et redoutable à trancher : reproduire des œuvres protégées pour entraîner un modèle d'IA générative est-il une contrefaçon ? En Europe, le débat se structure autour des exceptions de fouille de textes et de données (articles 3 et 4 de la directive 2019/790) et du mécanisme d'<em>opt-out</em> ; aux États-Unis, autour du <em>fair use</em>.</p>
<h2>En Europe : l'opt-out au centre du jeu</h2>
<p>L'exception de fouille à des fins commerciales ne joue que si le titulaire n'a pas réservé ses droits de manière appropriée, notamment par des procédés lisibles par machine. L'AI Act renforce ce mécanisme en imposant aux fournisseurs de modèles à usage général une politique de respect du droit d'auteur et un résumé suffisamment détaillé des contenus d'entraînement. Reste la question, encore ouverte, de la licéité d'une réserve exprimée en langage naturel dans des conditions générales.</p>
<h2>Aux États-Unis : un fair use sous conditions</h2>
<p>Les premières décisions de fond distinguent l'entraînement lui-même, souvent jugé transformatif, de la constitution de bibliothèques à partir de copies illicites, qui ne l'est pas. La provenance des données devient donc un enjeu autant que l'usage qui en est fait.</p>
<h2>Grille de lecture</h2>
<ol>
<li>Qualifier l'acte : collecte, reproduction pour l'entraînement, génération de sorties.</li>
<li>Vérifier le territoire applicable et l'existence d'une réserve de droits.</li>
<li>Documenter la provenance des corpus, condition de toute défense.</li>
<li>Anticiper les demandes de transparence fondées sur l'AI Act.</li>
</ol>
<p>La matière évolue de mois en mois ; cette veille sera mise à jour à chaque décision marquante.</p>`,
  },
  {
    id: "a4",
    coverStyle: 4,
    title: "Concours national de plaidoirie en propriété intellectuelle : la promo s'y prépare",
    slug: "cn2pi-la-promo-s-y-prepare",
    excerpt:
      "Le CN2PI réunit chaque année les masters de propriété intellectuelle de toute la France. Les ateliers d'oralité ont commencé, avec en ligne de mire un passage au-delà des quarts de finale.",
    category: "evenements",
    tags: ["CN2PI", "Plaidoirie", "DANTE"],
    status: "published",
    authorId: "membre@m2pidan.fr",
    authorName: "Pôle Événementiel",
    readingMinutes: 2,
    publishedAt: "2026-10-06T09:00:00.000Z",
    createdAt: "2026-10-05T18:00:00.000Z",
    updatedAt: "2026-10-06T09:00:00.000Z",
    content: `
<p>Le Concours national de plaidoirie en propriété intellectuelle (CN2PI) est le rendez-vous des masters spécialisés. Le laboratoire DANTE, auquel les étudiants du master sont associés, en est partenaire et a accueilli sa quinzième édition à Guyancourt en 2024.</p>
<p>Cette année, les ateliers d'oralité du master servent de terrain d'entraînement. Les équipes travaillent un cas pratique mêlant droit des marques, droit d'auteur et contentieux numérique, avant les sélections internes. Les dates des phases finales seront annoncées ici et sur LinkedIn.</p>`,
  },
  {
    id: "a5",
    coverStyle: 9,
    title: "Brouillon : Data Act, un an après",
    slug: "data-act-un-an-apres",
    excerpt: "Premier bilan de l'application du règlement sur les données, applicable depuis septembre 2025.",
    category: "veille-juridique",
    tags: ["Data Act", "Données"],
    status: "draft",
    authorId: "membre@m2pidan.fr",
    authorName: "Pôle Veille juridique",
    readingMinutes: 4,
    publishedAt: null,
    createdAt: "2026-11-02T18:00:00.000Z",
    updatedAt: "2026-11-02T18:00:00.000Z",
    content: `<p>Article en cours de rédaction.</p>`,
  },
];

const m = (
  id: string,
  firstName: string,
  lastName: string,
  promo: number,
  pole: Member["pole"],
  role: string | undefined,
  order: number,
  extra: Partial<Member> = {},
): Member => ({
  id,
  firstName,
  lastName,
  promo,
  pole,
  role,
  order,
  linkedin: "https://www.linkedin.com/in/m2pidan/",
  createdAt: now,
  updatedAt: now,
  ...extra,
});

/** Promotion 2026-2027 (liste officielle). Les fonctions et les LinkedIn se renseignent depuis l'espace admin. */
export const seedMembers: Member[] = [
  m("dir", "Valérie-Laure", "Benabou", 2026, "direction", "Directrice du master", 0, {
    linkedin: "https://www.linkedin.com/in/val%C3%A9rie-laure-benabou-3702017/",
    bio: "Professeure agrégée de droit privé à l'Université Paris-Saclay (UVSQ), spécialiste du droit d'auteur et du droit du numérique. Elle a dirigé le laboratoire DANTE pendant huit ans et siège au Conseil supérieur de la propriété littéraire et artistique, dont elle est membre d'honneur et où elle a présidé plusieurs commissions. Avec Judith Rochfeld, elle a signé « À qui profite le clic ? », une enquête sur la valeur de nos données. Elle dirige le master et en assure la responsabilité pédagogique.",
  }),
  m("p1", "Nabil", "Aliane", 2026, null, undefined, 1, { linkedin: "https://www.linkedin.com/in/nabil-aliane-6a2385184/" }),
  m("p2", "Ritchy", "Alphonse", 2026, null, undefined, 2, { linkedin: "https://www.linkedin.com/in/ritchy-alphonse-268a57360/" }),
  m("p3", "Sara", "Carino", 2026, null, undefined, 3, { linkedin: "https://www.linkedin.com/in/saracarino/" }),
  m("p4", "Camille", "Charbonnier", 2026, null, undefined, 4, { linkedin: "https://www.linkedin.com/in/camille-charbonnier-945443326/" }),
  m("p5", "Yanis", "Chrid", 2026, null, undefined, 5, { linkedin: "https://www.linkedin.com/in/yanis-chrid-a49869248/" }),
  m("p6", "Joyce", "Djoujum", 2026, null, undefined, 6, { linkedin: "https://www.linkedin.com/in/joyce-djoujum-7497a6223/" }),
  m("p7", "Ibrahim", "El Baghdadi", 2026, null, undefined, 7, { linkedin: "https://www.linkedin.com/in/ibrahim-el-baghdadi-733216328/" }),
  m("p8", "Christiana", "Hadjicosta", 2026, null, undefined, 8, {
    linkedin: "https://www.linkedin.com/in/christiana-hadjicosta-26043b355/",
  }),
  m("p9", "Mysha", "Hamzaoui", 2026, null, undefined, 9, { linkedin: "https://www.linkedin.com/in/mysha-elissa-hamzaoui-4664b2374/" }),
  m("p10", "Yasmine", "Hannan", 2026, null, undefined, 10, { linkedin: "https://www.linkedin.com/in/yasmine-ghalia-hannan-193424268/" }),
  m("p11", "Maïlysse", "Hauss", 2026, null, undefined, 11, { linkedin: "https://www.linkedin.com/in/ma%C3%AFlysse-hauss-a69333385/" }),
  m("p12", "Margot", "Herridge", 2026, null, undefined, 12, { linkedin: "https://www.linkedin.com/in/margot-herridge-021a3b26a/" }),
  m("p13", "Meng", "Ke", 2026, null, undefined, 13, { linkedin: "https://www.linkedin.com/in/meng-k-230024212/" }),
  m("p14", "Vincent", "Legardien", 2026, "communication", "Responsable site & identité", 14, {
    email: "legardienvincent@gmail.com",
    linkedin: "https://www.linkedin.com/in/vincent-legardien/",
    bio: "A conçu et développé ce site. Pour toute évolution, correction ou question technique sur le site, c'est lui qu'il faut contacter.",
  }),
  m("p15", "Aurélia", "Leguedey", 2026, null, undefined, 15, { linkedin: "https://www.linkedin.com/in/aur%C3%A9lia-leguedey-376536324/" }),
  m("p16", "Sarah", "Lirzin", 2026, null, undefined, 16, { linkedin: undefined }),
  m("p17", "Angéliqua", "Makambila", 2026, null, undefined, 17, { linkedin: "https://www.linkedin.com/in/ang%C3%A9liqua-m-7099092b5/" }),
  m("p18", "Issam", "Matoub", 2026, null, undefined, 18, { linkedin: "https://www.linkedin.com/in/issam-matoub/" }),
  m("p19", "Emily", "Moalic", 2026, null, undefined, 19, { linkedin: "https://www.linkedin.com/in/emily-moalic/" }),
  m("p20", "Yusuke", "Morita", 2026, null, undefined, 20, { linkedin: "https://www.linkedin.com/in/yusuke-morita/" }),
  m("p21", "Marion", "Ricquier", 2026, null, undefined, 21, { linkedin: "https://www.linkedin.com/in/marion-ricquier-533177178/" }),
  m("p22", "Camessarde", "Rosier-Laforest", 2026, null, undefined, 22, { linkedin: undefined }),
  m("p23", "Joséphine", "Vialle", 2026, null, undefined, 23, { linkedin: "https://www.linkedin.com/in/jos%C3%A9phine-vialle-195019303/" }),
  // Alumni
  m("al1", "Clara", "Dubois", 2025, null, undefined, 1, {
    currentPosition: "Juriste droit du numérique",
    currentCompany: "Groupe de médias",
  }),
  m("al2", "Rayan", "Belkacem", 2025, null, undefined, 2, { currentPosition: "Élève-avocat", currentCompany: "EFB", field: "avocat" }),
  m("al3", "Alice", "Perrin", 2025, null, undefined, 3, {
    currentPosition: "DPO junior",
    currentCompany: "Scale-up SaaS",
    field: "donnees-conformite",
  }),
  m("al4", "Maxime", "Roy", 2024, null, undefined, 1, {
    currentPosition: "Avocat collaborateur",
    currentCompany: "Cabinet d'affaires",
    field: "avocat",
  }),
  m("al5", "Nour", "Chakir", 2024, null, undefined, 2, {
    currentPosition: "Doctorante",
    currentCompany: "Laboratoire DANTE",
    field: "recherche-enseignement",
  }),
  m("al6", "Julien", "Marchand", 2023, null, undefined, 1, {
    currentPosition: "Legal counsel IP/IT",
    currentCompany: "Éditeur de logiciels",
  }),
];

export const seedPartners: Partner[] = [
  {
    id: "p1",
    name: "Ashurst Perkins Coie",
    type: "cabinet",
    url: "https://www.ashurst.com",
    via: "Un associé spécialiste du numérique enseigne au master",
    description: "Cabinet d'affaires international. Deux cours de droit du numérique accueillis dans ses locaux parisiens.",
    order: 1,
  },
  {
    id: "p2",
    name: "Laboratoire DANTE",
    type: "institution",
    url: "https://www.dante.uvsq.fr",
    description: "Droit des affaires et nouvelles technologies, le laboratoire de rattachement du master à l'UVSQ.",
    order: 2,
  },
  {
    id: "p3",
    name: "Université Paris-Saclay",
    type: "institution",
    url: "https://www.universite-paris-saclay.fr",
    description: "Université d'accréditation et de diplomation du master.",
    order: 3,
  },
  {
    id: "p4",
    name: "UVSQ · Faculté de droit et science politique",
    type: "institution",
    url: "https://www.facdroit-sciencepo.uvsq.fr",
    description: "Lieu d'enseignement, campus de Guyancourt.",
    order: 4,
  },
];
