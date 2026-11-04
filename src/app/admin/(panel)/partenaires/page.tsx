import { Suspense } from "react";
import { requireUser } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { deletePartner } from "@/app/admin/actions";
import PartnerForm from "@/components/admin/PartnerForm";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { AdminHeader, Badge, Notice, Skeleton } from "@/components/admin/Shell";
import { PARTNER_TYPES } from "@/lib/types";

export const metadata = { title: "Partenaires" };

export default function PartnersAdminPage({ searchParams }: PageProps<"/admin/partenaires">) {
  return (
    <>
      <AdminHeader
        title="Partenaires"
        lead="Cabinets, entreprises, institutions, intervenants : tout ce qui est affiché sur la page Partenaires et en bas de l'accueil."
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
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
        <div className="flex min-w-0 flex-col gap-4">
          {partners.length === 0 && <p className="text-sm text-fg-dim">Aucun partenaire pour l'instant.</p>}
          {partners.map((p) => (
            // `name` partagé : ouvrir un partenaire referme le précédent (accordéon natif).
            <details key={p.id} name="partner" className="glass group rounded-2xl">
              <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4">
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-fg">{p.name}</span>
                  {p.description && <span className="block truncate text-xs text-fg-dim">{p.description}</span>}
                </span>
                <span className="shrink-0">
                  <Badge>{PARTNER_TYPES[p.type]}</Badge>
                </span>
                <span className="w-14 shrink-0 text-right text-xs text-fg-dim">
                  <span className="group-open:hidden">Modifier</span>
                  <span className="hidden group-open:inline">Fermer</span>
                </span>
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
        <div className="min-w-0">
          <PartnerForm title="Ajouter un partenaire" nextOrder={partners.length + 1} />
        </div>
      </div>
    </>
  );
}
