"use client";

import { useActionState } from "react";
import { PARTNER_TYPES, type Partner } from "@/lib/types";
import { savePartner, type ActionState } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { Field, FormMessage, Input, Select, Textarea } from "./Field";
import ImageField from "./ImageField";

export default function PartnerForm({ partner, title }: { partner?: Partner; title?: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(savePartner, {});
  return (
    <form action={action} className="glass grid gap-4 rounded-2xl p-5 sm:grid-cols-2">
      {title && <h2 className="text-sm font-semibold text-fg sm:col-span-2">{title}</h2>}
      {partner && <input type="hidden" name="id" value={partner.id} />}
      <Field label="Nom">
        <Input id="name" name="name" required defaultValue={partner?.name} />
      </Field>
      <Field label="Type">
        <Select id="type" name="type" defaultValue={partner?.type ?? "cabinet"}>
          {Object.entries(PARTNER_TYPES).map(([k, label]) => (
            <option key={k} value={k}>
              {label}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Site web">
        <Input id="url" name="url" type="url" defaultValue={partner?.url} placeholder="https://…" />
      </Field>
      <Field label="Représenté par" hint="Facultatif : la personne qui porte le lien (ex. : Maître X, associé)." className="sm:col-span-2">
        <Input id="via" name="via" defaultValue={partner?.via} />
      </Field>
      <Field label="Ordre d'affichage">
        <Input id="order" name="order" type="number" min={0} defaultValue={partner?.order ?? 50} />
      </Field>
      <div className="sm:col-span-2">
        <ImageField name="logo" label="Logo" initialUrl={partner?.logo} hint="Facultatif." />
      </div>
      <Field label="Description" className="sm:col-span-2">
        <Textarea id="description" name="description" rows={2} maxLength={400} defaultValue={partner?.description} />
      </Field>
      <div className="sm:col-span-2 flex items-center gap-4">
        <Button type="submit" disabled={pending} size="sm">
          {pending ? "Enregistrement…" : partner ? "Enregistrer" : "Ajouter"}
        </Button>
        <FormMessage message={state.error} />
      </div>
    </form>
  );
}
