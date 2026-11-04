import { LogOut } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { logout } from "@/app/admin/actions";
import { isFirebaseConfigured } from "@/lib/firebase/config";

export default async function UserBadge() {
  const user = await getSession();
  if (!user) return null;
  return (
    <div className="flex flex-col gap-3">
      {!isFirebaseConfigured() && (
        <p className="rounded-lg bg-plum-500/20 px-3 py-2 font-mono text-[0.65rem] text-plum-200">Mode démo · données locales</p>
      )}
      <div className="flex items-center justify-between gap-2 rounded-xl border border-line px-3 py-2.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-fg">{user.displayName}</p>
          <p className="truncate font-mono text-[0.65rem] text-fg-dim">{user.role === "admin" ? "administrateur" : "membre"}</p>
        </div>
        <form action={logout}>
          <button type="submit" aria-label="Se déconnecter" className="rounded-lg p-2 text-fg-dim hover:bg-white/10 hover:text-fg">
            <LogOut size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
