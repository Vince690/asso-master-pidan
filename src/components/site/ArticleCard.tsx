import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Article } from "@/lib/types";
import { ARTICLE_CATEGORIES } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import Cover from "@/components/ui/Cover";

/**
 * Un seul effet au survol : la carte se soulève et prend sa lueur prune, l'image ne bouge pas.
 * Le lien reste immobile et seule la surface intérieure se déplace : au bord de la carte, le survol
 * ne clignote donc pas.
 */
export default function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  const cat = ARTICLE_CATEGORIES[article.category];
  return (
    <Link href={`/articles/${article.slug}`} className={cn("group relative block", featured && "md:col-span-2")}>
      <div
        className={cn(
          "glass glass-edge flex h-full flex-col overflow-hidden rounded-3xl transition-[transform,box-shadow] duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:-translate-y-1.5 group-hover:shadow-[var(--shadow-glow-plum)]",
          featured ? "md:flex-row" : "max-md:flex-row max-md:items-stretch max-md:rounded-2xl",
        )}
      >
        <div
          className={cn(
            "relative aspect-[21/9] overflow-hidden",
            featured ? "md:aspect-auto md:w-1/2" : "max-md:aspect-auto max-md:w-28 max-md:shrink-0",
          )}
        >
          {article.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={article.coverImage} alt="" className="h-full w-full object-cover" />
          ) : (
            <Cover seed={article.slug} category={article.category} style={article.coverStyle} className="h-full w-full" />
          )}
          <span
            className={cn(
              "absolute top-3 left-3 rounded-full bg-ink-0/60 px-3 py-1 font-mono text-[0.7rem] text-fg backdrop-blur-md",
              !featured && "max-md:hidden",
            )}
          >
            {cat.label}
          </span>
        </div>
        <div className={cn("flex flex-1 flex-col gap-2.5 p-5", featured ? "md:justify-center md:p-10" : "max-md:min-w-0 max-md:gap-1.5 max-md:p-4")}>
          <div className="flex items-center gap-3 font-mono text-[0.72rem] text-fg-dim">
            {!featured && <span className="md:hidden">{cat.label}</span>}
            <time dateTime={article.publishedAt ?? undefined} className={cn(!featured && "max-md:hidden")}>
              {formatDate(article.publishedAt)}
            </time>
            <span aria-hidden className={cn(!featured && "max-md:hidden")}>
              ·
            </span>
            <span>{article.readingMinutes} min</span>
            <span className={cn("ml-auto inline-flex items-center gap-1 font-sans text-sm font-medium text-electric-300", !featured && "max-md:hidden")}>
              Lire
              <ArrowUpRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </div>
          <h3
            className={cn(
              "font-semibold tracking-[-0.02em] text-fg text-balance",
              featured ? "text-2xl leading-tight md:text-[2rem]" : "text-lg leading-snug max-md:line-clamp-2 max-md:text-[0.98rem]",
            )}
          >
            {article.title}
          </h3>
          <p className={cn("text-sm leading-relaxed text-fg-muted", featured ? "line-clamp-4" : "line-clamp-2 max-md:hidden")}>{article.excerpt}</p>
        </div>
      </div>
    </Link>
  );
}
