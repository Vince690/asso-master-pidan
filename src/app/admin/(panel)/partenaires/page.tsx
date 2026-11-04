import { Suspense } from "react";
import { requireUser } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { deletePartner } from "@/app/admin/actions";
import PartnerForm from "@/components/admin/PartnerForm";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { AdminHeader, Badge, Notice, Skeleton } from "@/components/admin/Shell";

export const metadata = { title: "Partenaires" };

export default function PartnersAdminPage({ searchParams }: PageProps<"/admin/partenaires">) {
  return (
    <>
      <AdminHeader
        title="Partenaires"
        lead="Cabinets, entreprises et institutions affichés sur la page Partenaires et en bas de l'accueil."
      />
      <Suspense fallback={<Skeleton />}>
        <List searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function List({ searchParams }: Pick<PageProps<"/admin/partenaires">, "searchParams">) {
  await requireUser();
  const { ok } = await searchParams;
  const store = await db();
  const partners = await store.partners.list();
  return (
    <>
      <Notice ok={ok ? "Partenaire enregistré." : null} />
      <div className="grid gap-8 lg:grid-cols-[1fr_24rem]">
        <div className="flex flex-col gap-4">
          {partners.length === 0 && <p className="text-sm text-fg-dim">Aucun partenaire pour l'instant.</p>}
          {partners.map((p) => (
            <details key={p.id} className="glass group rounded-2xl">
              <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4">
                <span className="flex-1">
                  <span className="block font-medium text-fg">{p.name}</span>
                  {p.description && <span className="block truncate text-xs text-fg-dim">{p.description}</span>}
                </span>
                <Badge>{p.type}</Badge>
                <span className="text-xs text-fg-dim group-open:hidden">Modifier</span>
              </summary>
              <div className="flex flex-col gap-3 border-t border-line p-4">
                <PartnerForm partner={p} />
                <div>
                  <ConfirmButton action={deletePartner.bind(null, p.id)}>Supprimer ce partenaire</ConfirmButton>
                </div>
              </div>
            </details>
          ))}
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold text-fg">Ajouter un partenaire</h2>
          <PartnerForm />
        </div>
      </div>
    </>
  );
}
