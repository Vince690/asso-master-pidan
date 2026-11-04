import Link from "next/link";
import { Suspense } from "react";
import { requireUser } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { POLES, type Member } from "@/lib/types";
import { promoLabel } from "@/lib/utils";
import { LinkButton } from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { AdminHeader, Badge, Empty, Notice, Panel, Skeleton } from "@/components/admin/Shell";

export const metadata = { title: "Membres et alumni" };

export default function MembersAdminPage({ searchParams }: PageProps<"/admin/membres">) {
  return (
    <>
      <AdminHeader
        title="Membres et alumni"
        lead="La promotion courante s'affiche sur la page Membres, les promotions antérieures sur la page Alumni."
        actions={<LinkButton href="/admin/membres/nouveau">Ajouter une personne</LinkButton>}
      />
      <Suspense fallback={<Skeleton />}>
        <List searchParams={searchParams} />
      </Suspense>
    </>
  );
}

function Row({ member: m, subtitle }: { member: Member; subtitle: string }) {
  return (
    <Link href={`/admin/membres/${m.id}`} className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-white/[0.04]">
      <Avatar firstName={m.firstName} lastName={m.lastName} photo={m.photo} size={36} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-fg">
          {m.firstName} {m.lastName}
        </p>
        <p className="truncate font-mono text-[0.65rem] text-fg-dim">{subtitle}</p>
      </div>
    </Link>
  );
}

async function List({ searchParams }: Pick<PageProps<"/admin/membres">, "searchParams">) {
  await requireUser();
  const { ok } = await searchParams;
  const store = await db();
  const [members, settings] = await Promise.all([store.members.list(), store.settings.get()]);
  const direction = members.filter((m) => m.pole === "direction");
  const students = members.filter((m) => m.pole !== "direction");
  const promos = [...new Set(students.map((m) => m.promo))].sort((a, b) => b - a);
  if (members.length === 0) return <Empty>Aucune personne enregistrée.</Empty>;
  return (
    <>
      <Notice ok={ok ? "Fiche enregistrée." : null} />
      <div className="flex flex-col gap-8">
        {direction.length > 0 && (
          <section>
            <h2 className="mb-3 font-mono text-xs text-fg-muted">Direction du master</h2>
            <Panel>
              <ul className="divide-y divide-line">
                {direction.map((m) => (
                  <li key={m.id}>
                    <Row member={m} subtitle={m.role ?? "Direction du master"} />
                  </li>
                ))}
              </ul>
            </Panel>
          </section>
        )}
        {promos.map((promo) => (
          <section key={promo}>
            <h2 className="mb-3 flex items-center gap-3 font-mono text-xs text-fg-muted">
              Promotion {promoLabel(promo)}
              {promo === settings.currentPromo ? <Badge tone="info">promo courante</Badge> : <Badge>alumni</Badge>}
            </h2>
            <Panel>
              <ul className="divide-y divide-line">
                {students
                  .filter((m) => m.promo === promo)
                  .map((m) => (
                    <li key={m.id}>
                      <Row
                        member={m}
                        subtitle={[m.pole ? POLES[m.pole].label : null, m.role, m.currentPosition].filter(Boolean).join(" · ") || "—"}
                      />
                    </li>
                  ))}
              </ul>
            </Panel>
          </section>
        ))}
      </div>
    </>
  );
}
