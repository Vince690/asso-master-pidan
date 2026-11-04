import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import slugifyLib from "slugify";
import { format, formatDistanceToNowStrict } from "date-fns";
import { fr } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string): string {
  return slugifyLib(input, { lower: true, strict: true, locale: "fr", trim: true });
}

export function formatDate(iso: string | null | undefined, pattern = "d MMMM yyyy"): string {
  if (!iso) return "";
  return format(new Date(iso), pattern, { locale: fr });
}

export function timeAgo(iso: string): string {
  return formatDistanceToNowStrict(new Date(iso), { locale: fr, addSuffix: true });
}

/** Initiale du prénom ; deux lettres pour un prénom composé (Jean-Pierre → JP). */
export function initials(first: string): string {
  const parts = first.split(/[-\s]+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map((p) => p.charAt(0))
    .join("")
    .toUpperCase();
}

export function promoLabel(promo: number): string {
  return `${promo}-${promo + 1}`;
}

/** Nombre de minutes de lecture estimé à partir du HTML. */
export function readingMinutes(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function stripHtml(html: string, max = 160): string {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

export function newId(prefix = ""): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}${Date.now().toString(36)}${rand}`;
}

/** Hachage déterministe (pour les visuels générés à partir d'un slug). */
export function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Adresse de la fiche d'un membre, dérivée de son nom (stable et lisible). */
export function memberSlug(m: { firstName: string; lastName: string }): string {
  return slugify(`${m.firstName} ${m.lastName}`);
}

/** Coupe proprement à `max` caractères sur un espace, avec une ellipse. */
export function clampText(text: string, max: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const at = cut.lastIndexOf(" ");
  return `${(at > max * 0.6 ? cut.slice(0, at) : cut).replace(/[\s,;:.]+$/, "")}…`;
}

/** Titre SEO (≤ 60 caractères) dérivé du titre de l'article. Le nom du site est ajouté par le gabarit. */
export function seoTitleFrom(title: string): string {
  return clampText(title.replace(/\s*:\s*/g, " : "), 60);
}

/** Description SEO (≤ 155 caractères) dérivée du chapô ou du début de l'article. */
export function seoDescriptionFrom(text: string): string {
  return clampText(text, 155);
}
