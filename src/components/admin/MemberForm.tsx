"use client";

import { useActionState } from "react";
import { ALUMNI_FIELDS, POLES, type Member, type Pole } from "@/lib/types";
import { saveMember, type ActionState } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { Field, FormMessage, Input, Select, Textarea } from "./Field";
import ImageField from "./ImageField";

export default function MemberForm({ member, defaultPromo }: { member?: Member; defaultPromo: number }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveMember, {});
  return (
    <form action={action} className="glass grid max-w-3xl gap-5 rounded-2xl p-6 max-md:p-5 sm:grid-cols-2">
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
      <Field label="Fonction" hint="Présidente, Trésorier, Responsable LinkedIn…">
        <Input id="role" name="role" defaultValue={member?.role} />
      </Field>
      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <span className="text-sm font-medium text-fg">Pôles</span>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(POLES) as Pole[]).map((value) => (
            <label key={value} className="cursor-pointer">
              <input type="checkbox" name="poles" value={value} defaultChecked={member?.poles.includes(value)} className="peer sr-only" />
              <span className="inline-flex items-center rounded-full border border-line bg-white/[0.04] px-3.5 py-1.5 text-sm text-fg-muted transition-colors select-none peer-checked:border-electric-400/60 peer-checked:bg-electric-500/15 peer-checked:text-fg peer-focus-visible:ring-2 peer-focus-visible:ring-electric-400/60 hover:bg-white/[0.08]">
                {POLES[value].label}
              </span>
            </label>
          ))}
        </div>
        <span className="text-xs text-fg-dim">Une même personne peut être dans plusieurs pôles. La fiche apparaît dans chacun sur la page L'association.</span>
      </div>
      <Field label="Email de contact" hint="Facultatif, affiché publiquement sur la fiche.">
        <Input id="email" name="email" type="email" defaultValue={member?.email} />
      </Field>
      <Field label="LinkedIn">
        <Input id="linkedin" name="linkedin" type="url" placeholder="https://www.linkedin.com/in/…" defaultValue={member?.linkedin} />
      </Field>
      <ImageField
        name="photo"
        label="Photo"
        kind="avatar"
        initialUrl={member?.photo}
        className="sm:col-span-2"
        hint="Facultatif : sans photo, des initiales colorées s'affichent. Le portrait est recadré en carré, avec le cadrage et le zoom de votre choix."
      />
      <Field label="Bio courte" className="sm:col-span-2">
        <Textarea id="bio" name="bio" rows={3} maxLength={1200} defaultValue={member?.bio} />
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
        <Select
          id="field"
          name="field"
          defaultValue={member?.field ?? ""}
          options={[{ value: "", label: "Non précisé" }, ...Object.entries(ALUMNI_FIELDS).map(([value, label]) => ({ value, label }))]}
        />
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
