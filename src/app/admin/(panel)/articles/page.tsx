import Link from "next/link";
import { Suspense } from "react";
import { requireUser } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { ARTICLE_CATEGORIES } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { LinkButton } from "@/components/ui/Button";
import { AdminHeader, Badge, Empty, Panel, Skeleton } from "@/components/admin/Shell";

export const metadata = { title: "Articles" };

export default function ArticlesAdminPage() {
  return (
    <>
      <AdminHeader
        title="Articles"
        lead="Veille juridique, vie du master et événements. Un brouillon n'est visible que depuis cet espace."
        actions={<LinkButton href="/admin/articles/nouveau">Nouvel article</LinkButton>}
      />
      <Suspense fallback={<Skeleton />}>
        <List />
      </Suspense>
    </>
  );
}

async function List() {
  await requireUser();
  const store = await db();
  const articles = await store.articles.list();
  if (articles.length === 0) return <Empty>Aucun article. Commencez par en écrire un.</Empty>;
  return (
    <Panel>
      <ul className="divide-y divide-line">
        {articles.map((a) => (
          <li key={a.id}>
            <Link
              href={`/admin/articles/${a.id}`}
              className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-4 transition-colors hover:bg-white/[0.04]"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-fg">{a.title}</p>
                <p className="font-mono text-[0.68rem] text-fg-dim">
                  {ARTICLE_CATEGORIES[a.category].label} · {a.authorName} · {formatDate(a.publishedAt ?? a.updatedAt)}
                </p>
              </div>
              <Badge tone={a.status === "published" ? "good" : "warn"}>{a.status === "published" ? "publié" : "brouillon"}</Badge>
            </Link>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
