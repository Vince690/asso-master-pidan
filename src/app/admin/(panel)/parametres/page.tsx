import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import SettingsForm from "@/components/admin/SettingsForm";
import { AdminHeader, Panel, Skeleton } from "@/components/admin/Shell";

export const metadata = { title: "Paramètres" };

export default function SettingsAdminPage() {
  return (
    <>
      <AdminHeader title="Paramètres du site" lead="Promotion courante, adresse de contact et réseaux sociaux." />
      <Suspense fallback={<Skeleton />}>
        <Form />
      </Suspense>
    </>
  );
}

async function Form() {
  await requireAdmin();
  const store = await db();
  const settings = await store.settings.get();
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <SettingsForm settings={settings} />
      <Panel className="p-5 text-sm leading-relaxed text-fg-muted">
        <p className="font-semibold text-fg">Stockage des données</p>
        <p className="mt-2">
          {isFirebaseConfigured()
            ? "Firebase est configuré : les données sont dans Firestore."
            : "Mode démonstration : les données vivent dans le fichier .local-data/db.json du projet. Configurez Firebase (voir README) pour passer en production."}
        </p>
      </Panel>
    </div>
  );
}
