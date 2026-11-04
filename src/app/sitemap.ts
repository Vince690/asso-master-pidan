import type { MetadataRoute } from "next";
import { getPublishedArticles } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getPublishedArticles();
  const lastArticle = articles[0]?.updatedAt;
  const pages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1, lastModified: lastArticle },
    { url: `${SITE_URL}/le-master`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/articles`, changeFrequency: "weekly", priority: 0.9, lastModified: lastArticle },
    { url: `${SITE_URL}/membres`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/alumni`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/partenaires`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.4 },
  ];
  return [
    ...pages,
    ...articles.map((a) => ({
      url: `${SITE_URL}/articles/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
