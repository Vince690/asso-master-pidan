import type { AppUser, Article, Member, Partner, SiteSettings } from "@/lib/types";

export interface ArticleQuery {
  status?: Article["status"];
  category?: Article["category"];
  limit?: number;
}

/**
 * Interface commune aux deux implémentations (fichier JSON local et Firestore).
 * Toute lecture/écriture du site passe par ici : changer de base revient à changer d'implémentation.
 */
export interface Store {
  articles: {
    list(query?: ArticleQuery): Promise<Article[]>;
    get(id: string): Promise<Article | null>;
    getBySlug(slug: string): Promise<Article | null>;
    upsert(article: Article): Promise<void>;
    delete(id: string): Promise<void>;
  };
  members: {
    list(): Promise<Member[]>;
    get(id: string): Promise<Member | null>;
    upsert(member: Member): Promise<void>;
    delete(id: string): Promise<void>;
  };
  partners: {
    list(): Promise<Partner[]>;
    get(id: string): Promise<Partner | null>;
    upsert(partner: Partner): Promise<void>;
    delete(id: string): Promise<void>;
  };
  users: {
    list(): Promise<AppUser[]>;
    get(email: string): Promise<AppUser | null>;
    upsert(user: AppUser): Promise<void>;
    delete(email: string): Promise<void>;
  };
  settings: {
    get(): Promise<SiteSettings>;
    set(settings: SiteSettings): Promise<void>;
  };
}

export function sortArticles(articles: Article[]): Article[] {
  return [...articles].sort((a, b) => {
    const da = a.publishedAt ?? a.updatedAt;
    const db = b.publishedAt ?? b.updatedAt;
    return db.localeCompare(da);
  });
}

export function filterArticles(articles: Article[], query: ArticleQuery = {}): Article[] {
  let out = articles;
  if (query.status) out = out.filter((a) => a.status === query.status);
  if (query.category) out = out.filter((a) => a.category === query.category);
  out = sortArticles(out);
  if (query.limit) out = out.slice(0, query.limit);
  return out;
}

export function sortMembers(members: Member[]): Member[] {
  return [...members].sort((a, b) => b.promo - a.promo || a.order - b.order || a.lastName.localeCompare(b.lastName));
}
