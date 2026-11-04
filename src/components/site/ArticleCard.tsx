import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Article } from "@/lib/types";
import { ARTICLE_CATEGORIES } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import Cover from "@/components/ui/Cover";

export default function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  const cat = ARTICLE_CATEGORIES[article.category];
  return (
    <Link
      href={`/articles/${article.slug}`}
      className={cn(
        "group glass glass-edge relative flex flex-col overflow-hidden rounded-3xl transition-[transform,box-shadow] duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] hover:-translate-y-1.5 hover:shadow-[var(--shadow-glow-plum)]",
        featured && "md:col-span-2 md:flex-row",
      )}
    >
      <div className={cn("relative aspect-[2/1] overflow-hidden", featured && "md:aspect-auto md:w-1/2")}>
        {article.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.coverImage}
            alt=""
            className="h-full w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.04]"
          />
        ) : (
          <Cover
            seed={article.slug}
            category={article.category}
            style={article.coverStyle}
            className="h-full w-full transition-transform duration-1000 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.04]"
          />
        )}
        <span className="absolute top-3 left-3 rounded-full bg-ink-0/60 px-3 py-1 font-mono text-[0.7rem] text-fg backdrop-blur-md">
          {cat.label}
        </span>
      </div>
      <div className={cn("flex flex-1 flex-col gap-3 p-6", featured && "md:justify-center md:p-10")}>
        <div className="flex items-center gap-3 font-mono text-[0.72rem] text-fg-dim">
          <time dateTime={article.publishedAt ?? undefined}>{formatDate(article.publishedAt)}</time>
          <span aria-hidden>·</span>
          <span>{article.readingMinutes} min</span>
        </div>
        <h3
          className={cn(
            "font-semibold tracking-[-0.02em] text-fg text-balance",
            featured ? "text-2xl leading-tight md:text-[2rem]" : "text-lg leading-snug",
          )}
        >
          {article.title}
        </h3>
        <p className={cn("text-sm leading-relaxed text-fg-muted", featured ? "line-clamp-4" : "line-clamp-2")}>{article.excerpt}</p>
        <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-medium text-electric-300">
          Lire
          <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
