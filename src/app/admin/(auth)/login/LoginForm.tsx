"use client";

import { useActionState, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Field, FormMessage, Input } from "@/components/admin/Field";
import { loginDemo, loginWithToken, type ActionState } from "@/app/admin/actions";

type Demo = { email: string; label: string; role: string };

export default function LoginForm({ firebase, demoAccounts }: { firebase: boolean; demoAccounts: Demo[] }) {
  if (firebase) return <FirebaseLogin />;
  return <DemoLogin accounts={demoAccounts} />;
}

function DemoLogin({ accounts }: { accounts: Demo[] }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(loginDemo, {});
  return (
    <div className="glass glass-edge flex flex-col gap-5 rounded-3xl p-6">
      <p className="rounded-xl bg-electric-500/10 px-4 py-3 text-sm text-electric-200">
        Mode démonstration : aucun mot de passe. Choisissez un compte, ou saisissez une adresse invitée.
      </p>
      <div className="grid gap-2">
        {accounts.map((a) => (
          <form key={a.email} action={action}>
            <input type="hidden" name="email" value={a.email} />
            <button
              type="submit"
              disabled={pending}
              className="flex w-full items-center justify-between rounded-xl border border-line px-4 py-3 text-left transition-colors hover:bg-white/5 disabled:opacity-50"
            >
              <span>
                <span className="block font-medium text-fg">{a.label}</span>
                <span className="block text-xs text-fg-dim">{a.email}</span>
              </span>
              <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[0.65rem] text-fg-muted">{a.role}</span>
            </button>
          </form>
        ))}
      </div>
      <form action={action} className="flex flex-col gap-3 border-t border-line pt-5">
        <Field label="Autre adresse invitée">
          <Input id="email" name="email" type="email" placeholder="prenom.nom@exemple.fr" required />
        </Field>
        <FormMessage message={state.error} />
        <Button type="submit" disabled={pending} variant="glass">
          {pending ? "Connexion…" : "Se connecter"}
        </Button>
      </form>
    </div>
  );
}

function FirebaseLogin() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const finish = (token: Promise<string>) =>
    start(async () => {
      setError(null);
      try {
        const idToken = await token;
        const result = await loginWithToken(idToken);
        if (result.error) {
          setError(result.error);
          return;
        }
        router.replace("/admin");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Connexion impossible.");
      }
    });

  return (
    <div className="glass glass-edge flex flex-col gap-5 rounded-3xl p-6">
      <Button type="button" disabled={pending} onClick={() => finish(import("@/lib/firebase/client").then((m) => m.signInWithGoogle()))}>
        Continuer avec Google
      </Button>
      <div className="flex items-center gap-3 text-xs text-fg-dim">
        <span className="h-px flex-1 bg-line" />
        ou
        <span className="h-px flex-1 bg-line" />
      </div>
      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          finish(import("@/lib/firebase/client").then((m) => m.signInWithPassword(email, password)));
        }}
      >
        <Field label="Email">
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </Field>
        <Field label="Mot de passe">
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </Field>
        <FormMessage message={error} />
        <Button type="submit" disabled={pending} variant="glass">
          {pending ? "Connexion…" : "Se connecter"}
        </Button>
      </form>
    </div>
  );
}
