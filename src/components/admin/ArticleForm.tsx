"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { ARTICLE_CATEGORIES, type Article } from "@/lib/types";
import { seoDescriptionFrom, seoTitleFrom, slugify, stripHtml } from "@/lib/utils";
import { saveArticle, type ActionState } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { Field, FormMessage, Input, Select, Textarea } from "./Field";
import Editor from "./Editor";

const SITE_HOST = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/^https?:\/\//, "");

/**
 * Formulaire d'article. Le référencement est automatique : adresse dérivée du titre,
 * titre et description de recherche dérivés du titre et du chapô. Un aperçu montre le résultat ;
 * les champs restent modifiables dans « Options avancées » pour qui veut la main.
 */
export default function ArticleForm({ article }: { article?: Article }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveArticle, {});
  const [title, setTitle] = useState(article?.title ?? "");
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
  const [bodyText, setBodyText] = useState(() => stripHtml(article?.content ?? "", 400));
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(article));
  const [seoTitle, setSeoTitle] = useState(article?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(article?.seoDescription ?? "");

  const autoTitle = seoTitleFrom(title || "Titre de l'article");
  const autoDescription = seoDescriptionFrom(excerpt || bodyText || "Le chapô de l'article sert de description.");
  const previewTitle = seoTitle || autoTitle;
  const previewDescription = seoDescription || autoDescription;

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      {article && <input type="hidden" name="id" value={article.id} />}

      <div className="flex min-w-0 flex-col gap-5">
        <input
          id="title"
          name="title"
          required
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          placeholder="Titre de l'article"
          className="w-full bg-transparent text-[2rem] font-semibold tracking-tight text-fg outline-none placeholder:text-fg-dim"
        />
        <Field label="Chapô" hint="Deux ou trois phrases affichées dans les listes, les partages et les résultats de recherche.">
          <Textarea id="excerpt" name="excerpt" required rows={3} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
        </Field>
        <Editor name="content" initialHtml={article?.content ?? ""} onTextChange={(t) => setBodyText(t.slice(0, 400))} />
      </div>

      <aside className="flex flex-col gap-5 lg:sticky lg:top-6 lg:self-start">
        <div className="glass flex flex-col gap-4 rounded-2xl p-4">
          <Field label="Statut">
            <Select id="status" name="status" defaultValue={article?.status ?? "draft"}>
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
            </Select>
          </Field>
          <Field label="Catégorie">
            <Select id="category" name="category" defaultValue={article?.category ?? "veille-juridique"}>
              {Object.entries(ARTICLE_CATEGORIES).map(([k, c]) => (
                <option key={k} value={k}>
                  {c.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Mots-clés" hint="Séparés par des virgules.">
            <Input id="tags" name="tags" defaultValue={article?.tags.join(", ")} placeholder="IA, RGPD, Droit d'auteur" />
          </Field>
        </div>

        {/* Aperçu de référencement, généré automatiquement */}
        <div className="glass flex flex-col gap-3 rounded-2xl p-4">
          <div>
            <p className="text-sm font-semibold text-fg">Aperçu dans Google</p>
            <p className="mt-0.5 text-xs text-fg-dim">Se remplit tout seul à partir du titre et du chapô. Rien à faire.</p>
          </div>
          <div className="rounded-xl bg-white px-4 py-3 font-sans text-black">
            <p className="truncate text-[0.7rem] text-[#4d5156]">
              {SITE_HOST} › articles › {slug || "adresse-de-l-article"}
            </p>
            <p className="mt-0.5 truncate text-[1.05rem] text-[#1a0dab]">{previewTitle} · PID@N</p>
            <p className="mt-0.5 line-clamp-2 text-[0.8rem] leading-snug text-[#4d5156]">{previewDescription}</p>
          </div>

          <details className="group">
            <summary className="flex cursor-pointer list-none items-center gap-1 text-xs text-fg-muted hover:text-fg">
              <ChevronDown size={14} className="transition-transform group-open:rotate-180" /> Options avancées
            </summary>
            <div className="mt-3 flex flex-col gap-3">
              <Field label="Adresse (slug)" hint="Se remplit tout seul à partir du titre. À ne plus changer une fois l'article partagé.">
                <Input
                  id="slug"
                  name="slug"
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(e.target.value);
                  }}
                  className="font-mono text-xs"
                />
              </Field>
              <Field
                label="Titre de recherche"
                hint={`Laissez vide : le titre de l'article est utilisé, raccourci si besoin (« ${autoTitle} »).`}
              >
                <Input
                  id="seoTitle"
                  name="seoTitle"
                  maxLength={70}
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder={autoTitle}
                />
              </Field>
              <Field label="Description de recherche" hint="Laissez vide : le chapô est utilisé, raccourci à 155 caractères.">
                <Textarea
                  id="seoDescription"
                  name="seoDescription"
                  maxLength={170}
                  rows={3}
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder={autoDescription}
                />
              </Field>
              <Field
                label="Temps de lecture"
                hint="Laissez vide : calculé d'après le nombre de mots. Indiquez des minutes pour forcer une valeur."
              >
                <Input
                  id="readingMinutes"
                  name="readingMinutes"
                  type="number"
                  min={1}
                  max={180}
                  placeholder="auto"
                  defaultValue={article?.readingMinutes}
                />
              </Field>
            </div>
          </details>
        </div>

        <FormMessage message={state.error} />
        <div className="flex flex-col gap-2">
          <Button type="submit" disabled={pending}>
            {pending ? "Enregistrement…" : "Enregistrer"}
          </Button>
          {article?.status === "published" && (
            <Link href={`/articles/${article.slug}`} target="_blank" className="text-center text-xs text-fg-muted hover:text-fg">
              Voir sur le site
            </Link>
          )}
        </div>
      </aside>
    </form>
  );
}
