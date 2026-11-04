"use client";

import { useActionState } from "react";
import { inviteUser, type ActionState } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { Field, FormMessage, Input, Select } from "./Field";

export default function InviteForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(inviteUser, {});
  return (
    <form action={action} className="glass flex flex-col gap-4 rounded-2xl p-5">
      <Field label="Adresse email" hint="Celle utilisée pour se connecter (compte Google ou mot de passe Firebase).">
        <Input id="invite-email" name="email" type="email" required />
      </Field>
      <Field label="Nom affiché">
        <Input id="invite-name" name="displayName" required placeholder="Prénom Nom" />
      </Field>
      <Field label="Rôle">
        <Select id="invite-role" name="role" defaultValue="member">
          <option value="member">Membre</option>
          <option value="admin">Administrateur</option>
        </Select>
      </Field>
      <FormMessage message={state.error} />
      <FormMessage message={state.ok} tone="success" />
      <Button type="submit" disabled={pending} size="sm">
        {pending ? "Enregistrement…" : "Enregistrer l'accès"}
      </Button>
    </form>
  );
}
