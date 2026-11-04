import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { SessionUser } from "@/lib/types";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { db } from "@/lib/db";

export const SESSION_COOKIE = "pidan_session";
const SESSION_DAYS = 14;

function secret(): string {
  return process.env.AUTH_SECRET ?? "pidan-dev-secret-change-me";
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

/** Cookie du mode démo : `base64(email).signature`. */
function encodeDemo(email: string): string {
  const payload = Buffer.from(email.toLowerCase()).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function decodeDemo(value: string): string | null {
  const [payload, sig] = value.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return Buffer.from(payload, "base64url").toString("utf8");
}

async function resolveEmail(cookieValue: string): Promise<{ email: string; name?: string } | null> {
  if (isFirebaseConfigured()) {
    const { getAdminAuth } = await import("@/lib/firebase/admin");
    try {
      const decoded = await getAdminAuth().verifySessionCookie(cookieValue, true);
      if (!decoded.email) return null;
      return { email: decoded.email, name: decoded.name as string | undefined };
    } catch {
      return null;
    }
  }
  const email = decodeDemo(cookieValue);
  return email ? { email } : null;
}

/** Utilisateur connecté, ou null. À appeler dans un contexte dynamique (cookies). */
export async function getSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  const value = jar.get(SESSION_COOKIE)?.value;
  if (!value) return null;
  const resolved = await resolveEmail(value);
  if (!resolved) return null;
  const store = await db();
  const user = await store.users.get(resolved.email);
  if (!user) return null;
  return { email: user.email, displayName: user.displayName || resolved.name || user.email, role: user.role };
}

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  };
}

/**
 * Crée la session à partir d'un jeton Firebase (mode Firebase) ou d'un email (mode démo).
 * Refuse toute adresse absente de la liste des utilisateurs invités.
 */
export async function createSession(input: { idToken?: string; email?: string }): Promise<SessionUser> {
  const store = await db();
  let cookieValue: string;
  let email: string;
  let name: string | undefined;

  if (isFirebaseConfigured()) {
    if (!input.idToken) throw new Error("Jeton manquant");
    const { getAdminAuth } = await import("@/lib/firebase/admin");
    const auth = getAdminAuth();
    const decoded = await auth.verifyIdToken(input.idToken);
    if (!decoded.email) throw new Error("Compte sans adresse email");
    email = decoded.email.toLowerCase();
    name = decoded.name as string | undefined;
    const user = await store.users.get(email);
    if (!user) throw new Error("Cette adresse n'a pas été invitée. Demandez un accès à un administrateur.");
    cookieValue = await auth.createSessionCookie(input.idToken, { expiresIn: SESSION_DAYS * 24 * 60 * 60 * 1000 });
  } else {
    if (!input.email) throw new Error("Email manquant");
    email = input.email.toLowerCase();
    const user = await store.users.get(email);
    if (!user) throw new Error("Cette adresse n'a pas été invitée. Demandez un accès à un administrateur.");
    cookieValue = encodeDemo(email);
  }

  const user = (await store.users.get(email))!;
  await store.users.upsert({ ...user, lastLoginAt: new Date().toISOString(), displayName: user.displayName || name || email });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, cookieValue, cookieOptions());
  return { email: user.email, displayName: user.displayName || name || email, role: user.role };
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}
