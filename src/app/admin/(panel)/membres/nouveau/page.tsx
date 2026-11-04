import { Suspense } from "react";
import { requireUser } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import MemberForm from "@/components/admin/MemberForm";
import { AdminHeader, Skeleton } from "@/components/admin/Shell";

export const metadata = { title: "Nouvelle personne" };

export default function NewMemberPage() {
  return (
    <>
      <AdminHeader title="Ajouter une personne" />
      <Suspense fallback={<Skeleton />}>
        <Gate />
      </Suspense>
    </>
  );
}

async function Gate() {
  await requireUser();
  const store = await db();
  const settings = await store.settings.get();
  return <MemberForm defaultPromo={settings.currentPromo} />;
}
