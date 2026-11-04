import { Suspense } from "react";
import { requireUser } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import StatutsForm from "@/components/admin/StatutsForm";
import { AdminHeader, Skeleton } from "@/components/admin/Shell";

export const metadata = { title: "Statuts" };

export default function StatutsAdminPage() {
  return (
    <>
      <AdminHeader
        title="Statuts de l'association"
        lead="Le texte publié sur la page Statuts du site. Tant qu'il est vide, la page indique que les statuts arrivent."
      />
      <Suspense fallback={<Skeleton />}>
        <Form />
      </Suspense>
    </>
  );
}

async function Form() {
  await requireUser();
  const store = await db();
  const settings = await store.settings.get();
  return <StatutsForm initialHtml={settings.statutsHtml ?? ""} />;
}
