import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
import type { ArticleCategory } from "@/lib/types";

/**
 * Lectures publiques, mises en cache et étiquetées.
 * Les actions de l'espace admin invalident les étiquettes correspondantes après chaque écriture,
 * ce qui garde le site statique (et rapide) tout en reflétant immédiatement les modifications.
 */

export const TAGS = {
  articles: "articles",
  members: "members",
  partners: "partners",
  settings: "settings",
} as const;

export async function getPublishedArticles(opts: { limit?: number; category?: ArticleCategory } = {}) {
  "use cache";
  cacheLife("days");
  cacheTag(TAGS.articles);
  const store = await db();
  return store.articles.list({ status: "published", ...opts });
}

export async function getPublishedArticle(slug: string) {
  "use cache";
  cacheLife("days");
  cacheTag(TAGS.articles, `article:${slug}`);
  const store = await db();
  const article = await store.articles.getBySlug(slug);
  return article && article.status === "published" ? article : null;
}

/**
 * Membres tels qu'affichés sur le site. Une personne d'une promotion antérieure à la promotion
 * courante devient automatiquement alumni : son pôle et sa fonction dans l'association ne sont plus
 * affichés, sans rien avoir à modifier. La direction du master n'est jamais concernée.
 */
export async function getMembers() {
  "use cache";
  cacheLife("days");
  cacheTag(TAGS.members, TAGS.settings);
  const store = await db();
  const [members, settings] = await Promise.all([store.members.list(), store.settings.get()]);
  return members.map((m) => {
    if (m.poles.includes("direction") || m.promo >= settings.currentPromo) return m;
    return { ...m, poles: [], role: undefined };
  });
}

export async function getPartners() {
  "use cache";
  cacheLife("days");
  cacheTag(TAGS.partners);
  const store = await db();
  return store.partners.list();
}

export async function getSettings() {
  "use cache";
  cacheLife("days");
  cacheTag(TAGS.settings);
  const store = await db();
  return store.settings.get();
}
