"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { TAGS } from "@/lib/data";
import { createSession, destroySession, getSession } from "@/lib/auth/session";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { ALUMNI_FIELDS, ARTICLE_CATEGORIES, POLES, type Article, type Member, type Partner } from "@/lib/types";
import { newId, readingMinutes, seoDescriptionFrom, seoTitleFrom, slugify, stripHtml } from "@/lib/utils";
import { COVER_STYLES } from "@/components/ui/Cover";

export interface ActionState {
  error?: string;
  ok?: string;
}

async function requireSession() {
  const user = await getSession();
  if (!user) redirect("/admin/login");
  return user;
}

async function requireAdminSession() {
  const user = await requireSession();
  if (user.role !== "admin") return null;
  return user;
}

function fail(e: unknown): ActionState {
  return { error: e instanceof Error ? e.message : "Une erreur est survenue." };
}

/* ---------------- Authentification ---------------- */

export async function loginDemo(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (isFirebaseConfigured()) return { error: "Le mode démo est désactivé quand Firebase est configuré." };
  const email = String(formData.get("email") ?? "");
  try {
    await createSession({ email });
  } catch (e) {
    return fail(e);
  }
  redirect("/admin");
}

export async function loginWithToken(idToken: string): Promise<ActionState> {
  try {
    await createSession({ idToken });
    return { ok: "Connecté." };
  } catch (e) {
    return fail(e);
  }
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

/* ---------------- Articles ---------------- */

const articleSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(3, "Le titre est trop court.").max(200),
  slug: z.string().trim().max(200).optional(),
  excerpt: z.string().trim().min(10, "Le chapô doit faire au moins dix caractères.").max(600),
  content: z.string().min(1, "L'article est vide."),
  category: z.enum(Object.keys(ARTICLE_CATEGORIES) as [keyof typeof ARTICLE_CATEGORIES]),
  tags: z.string().optional(),
  coverImage: z.string().trim().url("L'adresse de l'image est invalide.").optional().or(z.literal("")),
  status: z.enum(["draft", "published"]),
  seoTitle: z.string().trim().max(70).optional(),
  seoDescription: z.string().trim().max(170).optional(),
  readingMinutes: z.preprocess((v) => (v === "" || v == null ? undefined : Number(v)), z.number().int().min(1).max(180).optional()),
});

export async function saveArticle(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireSession();
  const parsed = articleSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  const d = parsed.data;
  const store = await db();
  const now = new Date().toISOString();
  const existing = d.id ? await store.articles.get(d.id) : null;

  let slug = slugify(d.slug || d.title);
  if (!slug) slug = newId("article-");
  const clash = await store.articles.getBySlug(slug);
  if (clash && clash.id !== existing?.id) slug = `${slug}-${newId().slice(-4)}`;

  let coverStyle = existing?.coverStyle;
  if (coverStyle === undefined) {
    // Couverture : un style au hasard, différent des deux derniers articles pour éviter les répétitions
    const recent = (await store.articles.list({ limit: 2 })).map((a) => a.coverStyle).filter((x): x is number => x !== undefined);
    const choices = Array.from({ length: COVER_STYLES }, (_, i) => i).filter((i) => !recent.includes(i));
    coverStyle = choices[Math.floor(Math.random() * choices.length)];
  }
  const article: Article = {
    id: existing?.id ?? newId("a_"),
    coverStyle,
    title: d.title,
    slug,
    excerpt: d.excerpt,
    content: d.content,
    category: d.category,
    tags: (d.tags ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    coverImage: d.coverImage || undefined,
    status: d.status,
    authorId: existing?.authorId ?? user.email,
    authorName: existing?.authorName ?? user.displayName,
    readingMinutes: d.readingMinutes ?? readingMinutes(d.content),
    publishedAt: d.status === "published" ? (existing?.publishedAt ?? now) : (existing?.publishedAt ?? null),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    // SEO : si laissé vide, généré depuis le titre et le chapô (ou le début de l'article)
    seoTitle: d.seoTitle || seoTitleFrom(d.title),
    seoDescription: d.seoDescription || seoDescriptionFrom(d.excerpt || stripHtml(d.content, 400)),
  };
  await store.articles.upsert(article);
  updateTag(TAGS.articles);
  if (existing && existing.slug !== slug) updateTag(`article:${existing.slug}`);
  updateTag(`article:${slug}`);
  redirect(`/admin/articles/${article.id}?ok=1`);
}

export async function deleteArticle(id: string) {
  await requireSession();
  const store = await db();
  const a = await store.articles.get(id);
  if (a) {
    await store.articles.delete(id);
    updateTag(TAGS.articles);
    updateTag(`article:${a.slug}`);
  }
  redirect("/admin/articles");
}

/* ---------------- Membres ---------------- */

const memberSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().trim().min(1, "Prénom manquant.").max(80),
  lastName: z.string().trim().min(1, "Nom manquant.").max(80),
  promo: z.coerce.number().int().min(2000).max(2100),
  pole: z.enum(["", ...Object.keys(POLES)] as ["", ...string[]]),
  role: z.string().trim().max(120).optional(),
  photo: z.string().trim().url().optional().or(z.literal("")),
  linkedin: z.string().trim().url().optional().or(z.literal("")),
  email: z.string().trim().email("Email invalide.").optional().or(z.literal("")),
  bio: z.string().trim().max(400).optional(),
  currentPosition: z.string().trim().max(120).optional(),
  currentCompany: z.string().trim().max(120).optional(),
  field: z.enum(["", ...Object.keys(ALUMNI_FIELDS)] as ["", ...string[]]).optional(),
});

export async function saveMember(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireSession();
  const parsed = memberSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  const d = parsed.data;
  const store = await db();
  const now = new Date().toISOString();
  const existing = d.id ? await store.members.get(d.id) : null;
  const member: Member = {
    id: existing?.id ?? newId("m_"),
    firstName: d.firstName,
    lastName: d.lastName,
    promo: d.promo,
    pole: (d.pole || null) as Member["pole"],
    role: d.role || undefined,
    photo: d.photo || undefined,
    linkedin: d.linkedin || undefined,
    email: d.email || undefined,
    bio: d.bio || undefined,
    currentPosition: d.currentPosition || undefined,
    currentCompany: d.currentCompany || undefined,
    field: (d.field || undefined) as Member["field"],
    order: existing?.order ?? 50,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  await store.members.upsert(member);
  updateTag(TAGS.members);
  redirect("/admin/membres?ok=1");
}

export async function deleteMember(id: string) {
  await requireSession();
  const store = await db();
  await store.members.delete(id);
  updateTag(TAGS.members);
  redirect("/admin/membres");
}

/* ---------------- Partenaires ---------------- */

const partnerSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, "Nom manquant.").max(120),
  type: z.enum(["cabinet", "entreprise", "institution", "intervenant", "association"]),
  via: z.string().trim().max(160).optional(),
  url: z.string().trim().url("Adresse invalide.").optional().or(z.literal("")),
  logo: z.string().trim().url().optional().or(z.literal("")),
  description: z.string().trim().max(400).optional(),
  order: z.coerce.number().int().min(0).max(999).default(50),
});

export async function savePartner(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireSession();
  const parsed = partnerSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  const d = parsed.data;
  const store = await db();
  const partner: Partner = {
    id: d.id || newId("p_"),
    name: d.name,
    type: d.type,
    url: d.url || undefined,
    logo: d.logo || undefined,
    description: d.description || undefined,
    via: d.via || undefined,
    order: d.order,
  };
  await store.partners.upsert(partner);
  updateTag(TAGS.partners);
  redirect("/admin/partenaires?ok=1");
}

export async function deletePartner(id: string) {
  await requireSession();
  const store = await db();
  await store.partners.delete(id);
  updateTag(TAGS.partners);
  redirect("/admin/partenaires");
}

/* ---------------- Utilisateurs (admin) ---------------- */

const userSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Adresse email invalide.")
    .transform((e) => e.toLowerCase()),
  displayName: z.string().trim().min(1, "Nom manquant.").max(120),
  role: z.enum(["admin", "member"]),
});

export async function inviteUser(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireAdminSession();
  if (!admin) return { error: "Réservé aux administrateurs." };
  const parsed = userSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  const store = await db();
  const existing = await store.users.get(parsed.data.email);
  await store.users.upsert({
    email: parsed.data.email,
    displayName: parsed.data.displayName,
    role: parsed.data.role,
    invitedAt: existing?.invitedAt ?? new Date().toISOString(),
    lastLoginAt: existing?.lastLoginAt,
  });
  return { ok: existing ? "Accès mis à jour." : "Invitation enregistrée : la personne peut se connecter avec cette adresse." };
}

export async function removeUser(email: string) {
  const admin = await requireAdminSession();
  if (!admin) return;
  if (admin.email === email.toLowerCase()) return; // on ne se retire pas soi-même
  const store = await db();
  await store.users.delete(email);
  redirect("/admin/utilisateurs");
}

/* ---------------- Paramètres (admin) ---------------- */

const settingsSchema = z.object({
  currentPromo: z.coerce.number().int().min(2000).max(2100),
  contactEmail: z.string().trim().email("Email invalide."),
  linkedin: z.string().trim().url("Lien LinkedIn invalide."),
  instagram: z.string().trim().url("Lien Instagram invalide."),
  x: z.string().trim().url().optional().or(z.literal("")),
  tagline: z.string().trim().max(160),
  github: z.string().trim().url("Lien GitHub invalide.").optional().or(z.literal("")),
});

export async function saveSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireAdminSession();
  if (!admin) return { error: "Réservé aux administrateurs." };
  const parsed = settingsSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  const store = await db();
  const current = await store.settings.get();
  await store.settings.set({ ...current, ...parsed.data, x: parsed.data.x || undefined, github: parsed.data.github || undefined });
  updateTag(TAGS.settings);
  updateTag(TAGS.members);
  return { ok: "Paramètres enregistrés." };
}

export async function saveStatuts(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireSession();
  const html = String(formData.get("statuts") ?? "").slice(0, 200_000);
  const store = await db();
  const current = await store.settings.get();
  await store.settings.set({ ...current, statutsHtml: html });
  updateTag(TAGS.settings);
  return { ok: "Statuts enregistrés et publiés." };
}
