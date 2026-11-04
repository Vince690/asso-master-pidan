import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getPublishedArticles } from "@/lib/data";
import { ARTICLE_CATEGORIES, type ArticleCategory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PageHero, Section } from "@/components/ui/Section";
import ArticleCard from "@/components/site/ArticleCard";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Veille juridique en droit du numérique et propriété intellectuelle, vie du master et événements : les articles des étudiants du M2 PIDAN.",
  alternates: { canonical: "/articles" },
};

const CATS = Object.entries(ARTICLE_CATEGORIES) as [ArticleCategory, (typeof ARTICLE_CATEGORIES)[ArticleCategory]][];

function isCategory(v: unknown): v is ArticleCategory {
  return typeof v === "string" && v in ARTICLE_CATEGORIES;
}

export default function ArticlesPage({ searchParams }: PageProps<"/articles">) {
  return (
    <>
      <PageHero
        eyebrow="Articles"
        title="Veille juridique, vie du master, événements."
        lead="Ce que la promotion lit, écrit et organise. Les analyses sont signées par le pôle Veille juridique ; le reste, par celles et ceux qui l'ont vécu."
      />
      <Section className="pt-0">
        <Suspense fallback={<ListSkeleton />}>
          <List searchParams={searchParams} />
        </Suspense>
      </Section>
    </>
  );
}

async function List({ searchParams }: Pick<PageProps<"/articles">, "searchParams">) {
  const { categorie } = await searchParams;
  const category = isCategory(categorie) ? categorie : undefined;
  const articles = await getPublishedArticles({ category });

  return (
    <>
      <nav aria-label="Catégories" className="mb-10 flex flex-wrap gap-2">
        <FilterLink href="/articles" active={!category}>
          Tout
        </FilterLink>
        {CATS.map(([key, c]) => (
          <FilterLink key={key} href={`/articles?categorie=${key}`} active={category === key}>
            {c.label}
          </FilterLink>
        ))}
      </nav>
      {category && <p className="mb-8 max-w-xl text-fg-muted">{ARTICLE_CATEGORIES[category].description}</p>}
      {articles.length === 0 ? (
        <div className="glass rounded-3xl p-10 text-center text-fg-muted">
          Aucun article publié dans cette catégorie pour le moment. Les prochains arrivent chaque semaine.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </>
  );
}

function FilterLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        active ? "border-fg bg-fg text-ink-0" : "border-line text-fg-muted hover:border-line-strong hover:text-fg",
      )}
    >
      {children}
    </Link>
  );
}

function ListSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" aria-hidden>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="glass aspect-[4/5] animate-pulse rounded-3xl" />
      ))}
    </div>
  );
}
