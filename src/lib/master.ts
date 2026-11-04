/**
 * Données factuelles du M2 PIDAN (maquette 2024-2025, pages Paris-Saclay et UVSQ).
 * Mises à jour à la main : elles changent rarement et doivent rester versionnées.
 */

export const MASTER = {
  name: "Master 2 Propriété intellectuelle et droit des affaires numériques",
  short: "M2 PIDAN",
  brand: "PID@N",
  university: "Université Paris-Saclay",
  faculty: "Faculté de droit et science politique de l'UVSQ",
  campus: "Campus de Guyancourt, Saint-Quentin-en-Yvelines",
  address: "3 rue de la Division Leclerc, 78280 Guyancourt",
  mention: "Droit de la propriété intellectuelle, du numérique et de l'espace",
  rncp: "34435",
  capacity: 25,
  ects: 60,
  hours: 377,
  director: {
    name: "Valérie-Laure Benabou",
    title: "Professeure de droit privé, directrice du master",
    linkedin: "https://www.linkedin.com/in/val%C3%A9rie-laure-benabou-3702017/",
    detail:
      "Professeure agrégée de droit privé à l'Université Paris-Saclay (UVSQ), Valérie-Laure Benabou est spécialiste du droit d'auteur et du droit du numérique. Elle a dirigé le laboratoire DANTE pendant huit ans et siège au Conseil supérieur de la propriété littéraire et artistique, dont elle est membre d'honneur et où elle a présidé plusieurs commissions. Avec Judith Rochfeld, elle a signé « À qui profite le clic ? », une enquête sur la valeur de nos données. Elle dirige le master et en assure la responsabilité pédagogique.",
  },
  lab: {
    name: "Laboratoire DANTE",
    full: "Droit des affaires et nouvelles technologies",
    axis: "Propriété intellectuelle, techniques et numérique",
  },
  admission: {
    platform: "Inception (Université Paris-Saclay)",
    window: "du 15 avril au 15 juin",
    level: "Bac+4 (M1 de droit, ou profils ingénieurs, école de commerce et science politique par validation des acquis)",
    process: "Sélection sur dossier avec questionnaire de motivation, puis entretien devant un jury.",
    languages: "Français et anglais",
    internship: "Stage obligatoire (six mois en moyenne) et mémoire de recherche encadré toute l'année.",
  },
  contacts: {
    secretariat: "Charlotte Thomas, secrétariat pédagogique",
    secretariatEmail: "charlotte.thomas@uvsq.fr",
  },
  links: {
    saclay:
      "https://www.universite-paris-saclay.fr/formation/master/droit-de-la-propriete-intellectuelle-du-numerique-et-de-lespace-0/m2-propriete-intellectuelle-et-droit-des-affaires-numeriques",
    uvsq: "https://www.uvsq.fr/master-2-propriete-intellectuelle-droit-des-affaires-numeriques",
    dante: "https://www.dante.uvsq.fr",
  },
} as const;

export interface Course {
  code: string;
  title: string;
  ects: number;
  hours: number;
  note?: string;
}

export interface Block {
  id: string;
  semester: 3 | 4;
  title: string;
  intent: string;
  ects: number;
  hours: number;
  optional?: boolean;
  courses: Course[];
}

export const CURRICULUM: Block[] = [
  {
    id: "bloc-1",
    semester: 3,
    title: "Maîtriser les fondamentaux",
    intent: "Le socle : propriété intellectuelle en mouvement et protection des données.",
    ects: 10,
    hours: 80,
    courses: [
      { code: "MYPI300", title: "Actualité et perspective en droit de la propriété intellectuelle", ects: 5, hours: 35 },
      { code: "MYPI310", title: "Protection des données à caractère personnel", ects: 3, hours: 25 },
      { code: "MYPI301", title: "Droit des biens à l'ère du numérique", ects: 2, hours: 20 },
    ],
  },
  {
    id: "bloc-2",
    semester: 3,
    title: "Appréhender l'environnement de l'économie numérique",
    intent: "Les règles qui structurent les marchés en ligne et protègent leurs acteurs.",
    ects: 10,
    hours: 50,
    courses: [
      { code: "MYPI302", title: "Noms de domaine", ects: 2, hours: 10 },
      { code: "MYPI308", title: "Droit du travail et nouvelles technologies", ects: 2, hours: 10 },
      { code: "MYPI304", title: "Droit de la consommation", ects: 3, hours: 15 },
      { code: "MYPI404", title: "Cybercriminalité", ects: 3, hours: 15 },
    ],
  },
  {
    id: "bloc-3",
    semester: 3,
    title: "Appréhender l'environnement technique",
    intent: "Comprendre ce que l'on régule : systèmes, réseaux, cryptographie.",
    ects: 6,
    hours: 35,
    courses: [
      { code: "MYPI306", title: "Sécurité des systèmes d'information", ects: 2, hours: 15, note: "en anglais et en français" },
      { code: "MYPI405", title: "Cryptologie et signature électronique", ects: 2, hours: 10 },
      { code: "MYPI307", title: "Connaissance des systèmes informatiques et des réseaux", ects: 2, hours: 10 },
    ],
  },
  {
    id: "bloc-4",
    semester: 4,
    title: "Intégrer la dimension internationale, valoriser et défendre le patrimoine incorporel",
    intent: "Le cœur contractuel et contentieux du master.",
    ects: 20,
    hours: 152,
    courses: [
      { code: "MYPI400", title: "Valorisation PI : open source, open data, open science", ects: 2, hours: 12 },
      { code: "MYPI305", title: "Responsabilité des intermédiaires techniques et droit de la presse", ects: 3, hours: 20 },
      { code: "MYPI402", title: "Droit de la concurrence et innovation", ects: 3, hours: 20, note: "en anglais et en français" },
      { code: "MYPI403", title: "Convergence : télécommunications, audiovisuel et communication", ects: 3, hours: 20 },
      { code: "MYPI401", title: "Contrats spéciaux de la propriété intellectuelle", ects: 5, hours: 40 },
      { code: "MYPI303", title: "Contrats d'affaires dans l'univers digital (B2B)", ects: 4, hours: 40 },
    ],
  },
  {
    id: "bloc-5",
    semester: 4,
    title: "Mener à bien un projet d'insertion professionnelle ou de recherche",
    intent: "Six mois de stage, un mémoire, un cycle de conférences.",
    ects: 8,
    hours: 20,
    courses: [
      { code: "MYPI406", title: "Stage et mémoire", ects: 6, hours: 5 },
      { code: "MYPI309", title: "Cycle de conférences", ects: 2, hours: 15 },
    ],
  },
  {
    id: "bloc-6",
    semester: 4,
    title: "Travailler en groupe : deux options parmi cinq",
    intent: "Se spécialiser selon son projet, en français ou en anglais.",
    ects: 6,
    hours: 40,
    optional: true,
    courses: [
      { code: "MYPI408", title: "International and European IP Law", ects: 3, hours: 20, note: "en anglais" },
      { code: "MYPI414", title: "Informatique appliquée aux professions juridiques et judiciaires", ects: 3, hours: 20 },
      { code: "MYPI407", title: "Flux financiers dématérialisés", ects: 3, hours: 10 },
      { code: "MYPI411", title: "Droit du commerce électronique", ects: 3, hours: 20 },
      { code: "MYPI409", title: "Digital litigation", ects: 3, hours: 10, note: "en anglais" },
    ],
  },
];
