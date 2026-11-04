import Link from "next/link";
import { Suspense } from "react";
import { ArrowUpRight, FileText, Handshake, Users } from "lucide-react";
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
  const [articles, members, settings, partners] = await Promise.all([
    store.articles.list(),
    store.members.list(),
    store.settings.get(),
    store.partners.list(),
  ]);
  const drafts = articles.filter((a) => a.status === "draft");
  const promo = members.filter((m) => m.promo === settings.currentPromo && m.pole !== "direction");
  const alumni = members.filter((m) => m.promo < settings.currentPromo && m.pole !== "direction");
  const todo = [
    { label: "Étudiants sans LinkedIn", count: promo.filter((m) => !m.linkedin).length, href: "/admin/membres" },
    { label: "Étudiants sans photo", count: promo.filter((m) => !m.photo).length, href: "/admin/membres" },
    {
      label: "Pôles sans responsable",
      count: ["bureau", "communication", "veille-juridique", "evenementiel"].filter((p) => !promo.some((m) => m.pole === p)).length,
      href: "/admin/membres",
    },
    { label: "Alumni sans poste renseigné", count: alumni.filter((m) => !m.currentPosition).length, href: "/admin/membres" },
    { label: "Alumni sans métier (filtre annuaire)", count: alumni.filter((m) => !m.field).length, href: "/admin/membres" },
    { label: "Brouillons en attente", count: drafts.length, href: "/admin/articles" },
  ].filter((t) => t.count > 0);

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
          { icon: Handshake, label: "Partenaires", value: partners.length, href: "/admin/partenaires", extra: null },
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
          <h2 className="mb-1 font-semibold text-fg">À compléter</h2>
          <p className="mb-4 text-xs text-fg-dim">Ce qui manque pour que le site soit à jour. La liste se vide toute seule.</p>
          {todo.length === 0 ? (
            <p className="py-6 text-center text-sm text-fg-dim">Tout est à jour.</p>
          ) : (
            <ul className="divide-y divide-line">
              {todo.map((t) => (
                <li key={t.label}>
                  <Link href={t.href} className="flex items-center justify-between gap-4 py-3 text-sm text-fg-muted hover:text-fg">
                    <span>{t.label}</span>
                    <span className="rounded-full border border-line px-2 py-0.5 font-mono text-xs text-fg">{t.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
