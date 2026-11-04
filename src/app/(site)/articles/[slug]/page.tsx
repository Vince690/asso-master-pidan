import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Linkedin } from "@/components/ui/Icons";
import { getPublishedArticle, getPublishedArticles } from "@/lib/data";
import { ARTICLE_CATEGORIES } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import Cover from "@/components/ui/Cover";
import ArticleCard from "@/components/site/ArticleCard";

export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  // Au moins un paramètre est requis par Next : repli sur un slug neutre si la base est vide.
  return articles.length ? articles.map((a) => ({ slug: a.slug })) : [{ slug: "bienvenue" }];
}

export async function generateMetadata({ params }: PageProps<"/articles/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article) return { title: "Article introuvable" };
  const title = article.seoTitle || article.title;
  const description = article.seoDescription || article.excerpt;
  return {
    title,
    description,
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      publishedTime: article.publishedAt ?? undefined,
      modifiedTime: article.updatedAt,
      authors: [article.authorName],
      tags: article.tags,
      ...(article.coverImage ? { images: [article.coverImage] } : {}),
    },
  };
}

export default function ArticlePage({ params }: PageProps<"/articles/[slug]">) {
  return (
    <Suspense
      fallback={
        <div className="container-site pt-48">
          <div className="glass h-96 animate-pulse rounded-3xl" />
        </div>
      }
    >
      <Article params={params} />
    </Suspense>
  );
}

async function Article({ params }: Pick<PageProps<"/articles/[slug]">, "params">) {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article) notFound();

  const cat = ARTICLE_CATEGORIES[article.category];
  const related = (await getPublishedArticles({ category: article.category, limit: 4 })).filter((a) => a.id !== article.id).slice(0, 3);
  const url = `${SITE_URL}/articles/${article.slug}`;
  const shareLinkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.seoDescription || article.excerpt,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { "@type": "Organization", name: article.authorName },
    publisher: { "@type": "Organization", name: `Association ${SITE_NAME}`, url: SITE_URL },
    mainEntityOfPage: url,
    keywords: article.tags.join(", "),
    inLanguage: "fr",
    ...(article.coverImage ? { image: article.coverImage } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <article className="container-site pt-36 max-md:pt-28 md:pt-44">
        <div className="mx-auto max-w-3xl">
          <Link href="/articles" className="inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-fg">
            <ArrowLeft size={15} /> Tous les articles
          </Link>
          <p className="eyebrow mt-8">
            <Link href={`/articles?categorie=${article.category}`} className="hover:underline">
              {cat.label}
            </Link>
          </p>
          <h1 className="mt-4 font-serif text-[2.4rem] leading-[1.08] font-medium tracking-[-0.02em] text-fg text-balance max-sm:text-[2rem] md:text-[3.4rem]">
            {article.title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-fg-muted md:text-xl">{article.excerpt}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-line py-4 font-mono text-xs text-fg-dim">
            <span className="text-fg-muted">{article.authorName}</span>
            <time dateTime={article.publishedAt ?? undefined}>{formatDate(article.publishedAt)}</time>
            <span>{article.readingMinutes} min de lecture</span>
            <a
              href={shareLinkedIn}
              target="_blank"
              rel="noreferrer"
              className="ml-auto inline-flex items-center gap-1.5 text-fg-muted transition-colors hover:text-fg"
            >
              <Linkedin size={13} /> Partager
            </a>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-3xl border border-line max-md:mt-8 max-md:rounded-2xl">
          {article.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={article.coverImage} alt="" className="aspect-[21/9] w-full object-cover" />
          ) : (
            <Cover seed={article.slug} category={article.category} style={article.coverStyle} className="aspect-[21/9] w-full" />
          )}
        </div>

        <div className="mx-auto mt-14 max-w-3xl max-md:mt-10">
          <div className="prose-pidan" dangerouslySetInnerHTML={{ __html: article.content }} />
          {article.tags.length > 0 && (
            <ul className="mt-12 flex flex-wrap gap-2 border-t border-line pt-8">
              {article.tags.map((t) => (
                <li key={t} className="rounded-full border border-line px-3 py-1 font-mono text-[0.7rem] text-fg-muted">
                  {t}
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section className="container-site mt-28 max-md:mt-16">
          <h2 className="mb-8 text-2xl font-semibold tracking-tight text-fg">À lire ensuite</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {related.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
