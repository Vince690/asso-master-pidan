/**
 * Détection du mode de fonctionnement.
 * - Mode démo (par défaut) : aucune variable Firebase, données dans `.local-data/db.json`, connexion admin simulée.
 * - Mode Firebase : `FIREBASE_SERVICE_ACCOUNT` (côté serveur) et `NEXT_PUBLIC_FIREBASE_*` (côté client) renseignés.
 */
export function isFirebaseConfigured(): boolean {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT);
}

export function isFirebaseClientConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
}

export const firebaseClientConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
