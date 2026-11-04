import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { removeUser } from "@/app/admin/actions";
import { formatDate } from "@/lib/utils";
import ConfirmButton from "@/components/admin/ConfirmButton";
import InviteForm from "@/components/admin/InviteForm";
import { AdminHeader, Badge, Panel, Skeleton } from "@/components/admin/Shell";

export const metadata = { title: "Accès" };

export default function UsersAdminPage() {
  return (
    <>
      <AdminHeader
        title="Accès à l'espace membres"
        lead="Seules les adresses listées ici peuvent se connecter. Un administrateur gère les accès et les paramètres ; un membre écrit et modifie le contenu."
      />
      <Suspense fallback={<Skeleton />}>
        <List />
      </Suspense>
    </>
  );
}

async function List() {
  const me = await requireAdmin();
  const store = await db();
  const users = (await store.users.list()).sort((a, b) => a.email.localeCompare(b.email));
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_24rem]">
      <Panel>
        <ul className="divide-y divide-line">
          {users.map((u) => (
            <li key={u.email} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-fg">{u.displayName}</p>
                <p className="truncate font-mono text-[0.68rem] text-fg-dim">
                  {u.email} · {u.lastLoginAt ? `vu le ${formatDate(u.lastLoginAt, "d MMM yyyy")}` : "jamais connecté"}
                </p>
              </div>
              <Badge tone={u.role === "admin" ? "info" : "neutral"}>{u.role === "admin" ? "administrateur" : "membre"}</Badge>
              {u.email !== me.email && (
                <ConfirmButton action={removeUser.bind(null, u.email)} confirmLabel="Retirer l'accès">
                  Retirer
                </ConfirmButton>
              )}
            </li>
          ))}
        </ul>
      </Panel>
      <div>
        <h2 className="mb-3 text-sm font-semibold text-fg">Inviter ou modifier un accès</h2>
        <InviteForm />
      </div>
    </div>
  );
}
