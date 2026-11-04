import { Suspense } from "react";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { deleteArticle } from "@/app/admin/actions";
import ArticleForm from "@/components/admin/ArticleForm";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { AdminHeader, Notice, Skeleton } from "@/components/admin/Shell";

export const metadata = { title: "Modifier l'article" };

export default function EditArticlePage({ params, searchParams }: PageProps<"/admin/articles/[id]">) {
  return (
    <Suspense fallback={<Skeleton />}>
      <Edit params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function Edit({ params, searchParams }: Pick<PageProps<"/admin/articles/[id]">, "params" | "searchParams">) {
  await requireUser();
  const [{ id }, { ok }] = await Promise.all([params, searchParams]);
  const store = await db();
  const article = await store.articles.get(id);
  if (!article) notFound();
  const remove = deleteArticle.bind(null, article.id);
  return (
    <>
      <AdminHeader
        title="Modifier l'article"
        lead={`Dernière modification le ${new Date(article.updatedAt).toLocaleDateString("fr-FR")}.`}
        actions={<ConfirmButton action={remove}>Supprimer</ConfirmButton>}
      />
      <Notice ok={ok ? "Article enregistré." : null} />
      <ArticleForm article={article} />
    </>
  );
}
