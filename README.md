# PID@N · site de l'association du M2 PIDAN

Site vitrine et blog de l'association des étudiants du **Master 2 Propriété intellectuelle et droit des affaires numériques** (Université Paris-Saclay, enseigné à la faculté de droit de l'UVSQ, Guyancourt).

- Présentation du master et maquette complète des cours
- Articles : veille juridique, vie du master, événements
- Membres par pôle, annuaire alumni par promotion, partenaires, contact
- Espace membres pour écrire et publier sans toucher au code
- SEO soigné : métadonnées, OpenGraph généré, sitemap, robots, JSON-LD

## Démarrer en local (mode démo, zéro configuration)

```bash
pnpm install
pnpm dev
```

Ouvrez <http://localhost:3000>. Sans variable d'environnement, le site tourne en **mode démo** :

- les données vivent dans `.local-data/db.json` (créé au premier lancement à partir des données d'exemple, ignoré par git) ;
- l'espace membres (<http://localhost:3000/admin>) se connecte sans mot de passe avec `admin@m2pidan.fr` (administrateur) ou `membre@m2pidan.fr` (membre).

Les noms des membres de démonstration sont fictifs : remplacez-les depuis l'admin.

## Passer en production (Firebase + Vercel, gratuit)

1. **Firebase** : créez un projet, activez **Firestore** (mode production) et **Authentication** (Google et/ou email + mot de passe). Déployez `firestore.rules` (tout accès client est refusé : seul le serveur écrit).
2. **Compte de service** : Paramètres du projet → Comptes de service → Générer une clé privée. Copiez le JSON dans `FIREBASE_SERVICE_ACCOUNT` (en une ligne ou en base64).
3. **Config client** : Paramètres du projet → Vos applications → ajoutez une app web et reportez les valeurs `NEXT_PUBLIC_FIREBASE_*`.
4. **Premier administrateur** : dans Firestore, créez un document `users/{votre email en minuscules}` avec `{ email, displayName, role: "admin", invitedAt: "<date ISO>" }`. Ensuite, tout se gère depuis l'admin (page Accès).
5. **Images** (facultatif) : un compte Cloudinary gratuit avec un *upload preset* non signé permet d'envoyer des images depuis l'admin. Sans cela, on colle une adresse d'image.
6. **Vercel** : importez le dépôt, renseignez les variables de `.env.example` (dont `AUTH_SECRET` et `NEXT_PUBLIC_SITE_URL`), déployez. Le plan Hobby suffit.

## Organisation du code

```
src/
  app/(site)/        pages publiques (accueil, le-master, articles, membres, alumni, partenaires, contact)
  app/admin/         espace membres : connexion, tableau de bord, articles, membres, partenaires, messages, accès, paramètres
  app/admin/actions.ts  toutes les écritures (Server Actions), avec vérification de session
  components/site/   header en pilule, grille de caractères, cartes, footer
  components/admin/  éditeur Tiptap, formulaires
  lib/db/            Store commun + implémentations fichier local et Firestore
  lib/data.ts        lectures publiques mises en cache (invalidées après chaque écriture)
  lib/master.ts      données factuelles du master (maquette, direction, admission)
  lib/seed.ts        contenu de démonstration
```

## Rôles

- **Administrateur** : tout, plus la gestion des accès et des paramètres du site.
- **Membre** : écrit, modifie et publie les articles, gère membres et partenaires, lit les messages.

Un accès se crée en ajoutant simplement l'adresse email de la personne (page Accès). Elle se connecte ensuite avec Google ou un compte Firebase portant cette adresse.

## Scripts

```bash
pnpm dev      # développement
pnpm build    # build de production
pnpm start    # serveur de production
pnpm lint     # ESLint
```

Licence MIT.
