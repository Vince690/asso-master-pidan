import Link from "next/link";
import { Suspense } from "react";
import { ArrowUpRight, FileText, ScrollText, Users } from "lucide-react";
import { requireUser } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { LinkButton } from "@/components/ui/Button";
import { AdminHeader, Badge, Notice, Panel, Skeleton } from "@/components/admin/Shell";

export default function DashboardPage({ searchParams }: PageProps<"/admin">) {
  return (
    <Suspense fallback={<Skeleton />}>
      <Dashboard searchParams={searchParams} />
    </Suspense>
  );
}

async function Dashboard({ searchParams }: Pick<PageProps<"/admin">, "searchParams">) {
  const user = await requireUser();
  const { erreur } = await searchParams;
  const store = await db();
  const [articles, members, settings] = await Promise.all([store.articles.list(), store.members.list(), store.settings.get()]);
  const drafts = articles.filter((a) => a.status === "draft");

  return (
    <>
      <AdminHeader
        title={`Bonjour ${user.displayName.split(" ")[0]}`}
        lead="Tout ce qui est publié ici apparaît immédiatement sur le site."
        actions={<LinkButton href="/admin/articles/nouveau">Écrire un article</LinkButton>}
      />
      <Notice error={erreur === "admin" ? "Cette page est réservée aux administrateurs." : null} />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: FileText,
            label: "Articles publiés",
            value: articles.length - drafts.length,
            href: "/admin/articles",
            extra: drafts.length ? `${drafts.length} brouillon${drafts.length > 1 ? "s" : ""}` : null,
          },
          { icon: Users, label: "Membres et alumni", value: members.length, href: "/admin/membres", extra: null },
          {
            icon: ScrollText,
            label: "Statuts",
            value: settings.statutsHtml?.trim() ? "publiés" : "à rédiger",
            href: "/admin/statuts",
            extra: null,
          },
        ].map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="glass glass-edge group flex flex-col gap-3 rounded-2xl p-5 transition-colors hover:bg-white/[0.06]"
          >
            <div className="flex items-center justify-between text-fg-dim">
              <s.icon size={16} />
              <ArrowUpRight size={14} className="opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <p className="text-3xl font-semibold tracking-tight text-fg tabular-nums">{s.value}</p>
            <p className="text-sm text-fg-muted">
              {s.label}
              {s.extra && <span className="text-fg-dim"> · {s.extra}</span>}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Panel className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-fg">Derniers articles</h2>
            <Link href="/admin/articles" className="text-xs text-fg-muted hover:text-fg">
              Tout voir
            </Link>
          </div>
          <ul className="divide-y divide-line">
            {articles.slice(0, 6).map((a) => (
              <li key={a.id}>
                <Link href={`/admin/articles/${a.id}`} className="flex items-center justify-between gap-4 py-3 hover:text-electric-200">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-fg">{a.title}</span>
                    <span className="block font-mono text-[0.65rem] text-fg-dim">
                      {a.authorName} · {formatDate(a.publishedAt ?? a.updatedAt)}
                    </span>
                  </span>
                  <Badge tone={a.status === "published" ? "good" : "warn"}>{a.status === "published" ? "publié" : "brouillon"}</Badge>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel className="p-5">
          <h2 className="mb-4 font-semibold text-fg">Raccourcis</h2>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <Link href="/admin/membres/nouveau" className="link-pill text-fg-muted">
                Ajouter une personne à la promotion
              </Link>
            </li>
            <li>
              <Link href="/admin/partenaires" className="link-pill text-fg-muted">
                Ajouter un partenaire
              </Link>
            </li>
            <li>
              <Link href="/admin/statuts" className="link-pill text-fg-muted">
                Publier les statuts
              </Link>
            </li>
            <li>
              <Link href="/" className="link-pill text-fg-muted">
                Voir le site
              </Link>
            </li>
          </ul>
        </Panel>
      </div>
    </>
  );
}
