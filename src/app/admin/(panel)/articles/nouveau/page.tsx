import { Suspense } from "react";
import { requireUser } from "@/lib/auth/guard";
import ArticleForm from "@/components/admin/ArticleForm";
import { AdminHeader, Skeleton } from "@/components/admin/Shell";

export const metadata = { title: "Nouvel article" };

export default function NewArticlePage() {
  return (
    <>
      <AdminHeader
        title="Nouvel article"
        lead="Enregistrez en brouillon autant de fois que nécessaire, puis passez le statut à « Publié »."
      />
      <Suspense fallback={<Skeleton />}>
        <Gate />
      </Suspense>
    </>
  );
}

async function Gate() {
  await requireUser();
  return <ArticleForm />;
}
