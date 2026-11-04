import type { Metadata } from "next";
import Link from "next/link";
import { isFirebaseClientConfigured, isFirebaseConfigured } from "@/lib/firebase/config";
import { seedUsers } from "@/lib/seed";
import Backdrop from "@/components/site/Backdrop";
import Logo from "@/components/site/Logo";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Connexion", robots: { index: false, follow: false } };

export default function LoginPage() {
  const firebase = isFirebaseConfigured() && isFirebaseClientConfigured();
  return (
    <>
      <Backdrop />
      <main className="container-site relative z-10 flex min-h-screen items-center justify-center py-16">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-10 inline-block">
            <Logo markSize={30} />
          </Link>
          <h1 className="display text-[2rem]">Espace membres</h1>
          <p className="mt-3 text-fg-muted">Réservé aux membres de l'association invités par un administrateur.</p>
          <div className="mt-8">
            <LoginForm
              firebase={firebase}
              demoAccounts={firebase ? [] : seedUsers.map((u) => ({ email: u.email, label: u.displayName, role: u.role }))}
            />
          </div>
        </div>
      </main>
    </>
  );
}
