import "server-only";
import { redirect } from "next/navigation";
import type { SessionUser } from "@/lib/types";
import { getSession } from "./session";

/** Utilisateur connecté ou redirection vers la page de connexion. À appeler dans chaque page et action admin. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getSession();
  if (!user) redirect("/admin/login");
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/admin?erreur=admin");
  return user;
}
