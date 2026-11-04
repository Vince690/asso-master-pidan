"use client";

import { useActionState } from "react";
import type { SiteSettings } from "@/lib/types";
import { saveSettings, type ActionState } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { Field, FormMessage, Input } from "./Field";

export default function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveSettings, {});
  return (
    <form action={action} className="glass grid gap-5 rounded-2xl p-6 sm:grid-cols-2">
      <Field label="Promotion courante" hint="Année de rentrée. Les promos antérieures passent automatiquement en alumni.">
        <Input id="currentPromo" name="currentPromo" type="number" min={2000} max={2100} required defaultValue={settings.currentPromo} />
      </Field>
      <Field label="Email de contact">
        <Input id="contactEmail" name="contactEmail" type="email" required defaultValue={settings.contactEmail} />
      </Field>
      <Field label="LinkedIn">
        <Input id="linkedin" name="linkedin" type="url" required defaultValue={settings.linkedin} />
      </Field>
      <Field label="Instagram">
        <Input id="instagram" name="instagram" type="url" required defaultValue={settings.instagram} />
      </Field>
      <Field label="X (facultatif)">
        <Input id="x" name="x" type="url" defaultValue={settings.x} />
      </Field>
      <Field label="Dépôt GitHub (facultatif)" hint="Affiché en bas de page quand il est renseigné.">
        <Input id="github" name="github" type="url" defaultValue={settings.github} placeholder="https://github.com/…" />
      </Field>
      <Field label="Accroche">
        <Input id="tagline" name="tagline" maxLength={160} defaultValue={settings.tagline} />
      </Field>
      <div className="sm:col-span-2 flex flex-col gap-3">
        <FormMessage message={state.error} />
        <FormMessage message={state.ok} tone="success" />
        <div>
          <Button type="submit" disabled={pending}>
            {pending ? "Enregistrement…" : "Enregistrer"}
          </Button>
        </div>
      </div>
    </form>
  );
}
