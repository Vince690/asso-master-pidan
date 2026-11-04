import { Suspense } from "react";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { deleteMember } from "@/app/admin/actions";
import MemberForm from "@/components/admin/MemberForm";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { AdminHeader, Skeleton } from "@/components/admin/Shell";

export const metadata = { title: "Modifier une fiche" };

export default function EditMemberPage({ params }: PageProps<"/admin/membres/[id]">) {
  return (
    <Suspense fallback={<Skeleton />}>
      <Edit params={params} />
    </Suspense>
  );
}

async function Edit({ params }: Pick<PageProps<"/admin/membres/[id]">, "params">) {
  await requireUser();
  const { id } = await params;
  const store = await db();
  const [member, settings] = await Promise.all([store.members.get(id), store.settings.get()]);
  if (!member) notFound();
  const remove = deleteMember.bind(null, member.id);
  return (
    <>
      <AdminHeader title={`${member.firstName} ${member.lastName}`} actions={<ConfirmButton action={remove}>Supprimer</ConfirmButton>} />
      <MemberForm member={member} defaultPromo={settings.currentPromo} />
    </>
  );
}
