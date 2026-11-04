"use client";

import { useActionState } from "react";
import { ALUMNI_FIELDS, POLES, type Member } from "@/lib/types";
import { saveMember, type ActionState } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { Field, FormMessage, Input, Select, Textarea } from "./Field";
import ImageField from "./ImageField";

export default function MemberForm({ member, defaultPromo }: { member?: Member; defaultPromo: number }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveMember, {});
  return (
    <form action={action} className="glass grid max-w-3xl gap-5 rounded-2xl p-6 sm:grid-cols-2">
      {member && <input type="hidden" name="id" value={member.id} />}
      <Field label="Prénom">
        <Input id="firstName" name="firstName" required defaultValue={member?.firstName} />
      </Field>
      <Field label="Nom">
        <Input id="lastName" name="lastName" required defaultValue={member?.lastName} />
      </Field>
      <Field
        label="Promotion"
        hint="Année de rentrée : 2026 pour 2026-2027. Une promo antérieure à la promo courante apparaît dans les alumni."
      >
        <Input id="promo" name="promo" type="number" min={2000} max={2100} required defaultValue={member?.promo ?? defaultPromo} />
      </Field>
      <Field label="Pôle">
        <Select id="pole" name="pole" defaultValue={member?.pole ?? ""}>
          <option value="">Aucun</option>
          {Object.entries(POLES).map(([k, p]) => (
            <option key={k} value={k}>
              {p.label}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Fonction" hint="Présidente, Trésorier, Responsable LinkedIn…">
        <Input id="role" name="role" defaultValue={member?.role} />
      </Field>
      <Field label="Email de contact" hint="Facultatif, affiché publiquement sur la fiche.">
        <Input id="email" name="email" type="email" defaultValue={member?.email} />
      </Field>
      <Field label="LinkedIn">
        <Input id="linkedin" name="linkedin" type="url" placeholder="https://www.linkedin.com/in/…" defaultValue={member?.linkedin} />
      </Field>
      <div className="sm:col-span-2">
        <ImageField
          name="photo"
          label="Photo"
          initialUrl={member?.photo}
          hint="Facultatif : sans photo, des initiales colorées s'affichent."
        />
      </div>
      <Field label="Bio courte" className="sm:col-span-2">
        <Textarea id="bio" name="bio" rows={2} maxLength={400} defaultValue={member?.bio} />
      </Field>
      <Field label="Poste actuel (alumni)">
        <Input id="currentPosition" name="currentPosition" defaultValue={member?.currentPosition} placeholder="Juriste IP/IT" />
      </Field>
      <Field label="Structure (alumni)">
        <Input id="currentCompany" name="currentCompany" defaultValue={member?.currentCompany} placeholder="Cabinet, entreprise…" />
      </Field>
      <Field
        label="Métier (alumni)"
        hint="Sert à filtrer l'annuaire. Laissez vide si aucune famille ne convient : la fiche reste dans « Tous »."
      >
        <Select id="field" name="field" defaultValue={member?.field ?? ""}>
          <option value="">Non précisé</option>
          {Object.entries(ALUMNI_FIELDS).map(([k, label]) => (
            <option key={k} value={k}>
              {label}
            </option>
          ))}
        </Select>
      </Field>
      <div className="sm:col-span-2">
        <FormMessage message={state.error} />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Enregistrement…" : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
