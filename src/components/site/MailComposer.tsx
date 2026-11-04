"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { buttonClass } from "@/components/ui/Button";
import { Field, Select, Textarea } from "@/components/admin/Field";

const SUBJECTS = [
  "Question générale",
  "Proposer un partenariat ou une intervention",
  "Figurer dans l'annuaire alumni",
  "Question sur la candidature au master",
  "Presse et communication",
];

const ALIASES: Record<string, string> = {
  partenariat: SUBJECTS[1],
  alumni: SUBJECTS[2],
  candidature: SUBJECTS[3],
  presse: SUBJECTS[4],
};

export function resolveSubject(value?: string): string {
  if (!value) return SUBJECTS[0];
  return ALIASES[value] ?? (SUBJECTS.includes(value) ? value : SUBJECTS[0]);
}

/**
 * Prépare un email dans la messagerie du visiteur (sujet et message pré-remplis).
 * Rien n'est stocké sur le site : aucune donnée personnelle collectée.
 */
export default function MailComposer({ to, defaultSubject }: { to: string; defaultSubject?: string }) {
  const [subject, setSubject] = useState(resolveSubject(defaultSubject));
  const [message, setMessage] = useState("");
  const href = `mailto:${to}?subject=${encodeURIComponent(`[PID@N] ${subject}`)}${message ? `&body=${encodeURIComponent(message)}` : ""}`;

  return (
    <div className="glass glass-edge flex flex-col gap-5 rounded-3xl p-6 md:p-8">
      <Field label="Sujet">
        <Select id="mail-subject" value={subject} onChange={(e) => setSubject(e.target.value)}>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Message" hint="Facultatif : il sera pré-rempli dans votre messagerie.">
        <Textarea id="mail-body" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Dites-nous tout." />
      </Field>
      <div className="flex flex-wrap items-center gap-4">
        <a href={href} className={buttonClass("electric")}>
          <Mail size={16} /> Ouvrir ma messagerie
        </a>
        <span className="text-sm text-fg-dim">
          ou écrivez directement à <span className="text-fg-muted select-all">{to}</span>
        </span>
      </div>
    </div>
  );
}
