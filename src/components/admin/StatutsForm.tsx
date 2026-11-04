"use client";

import { useActionState, useRef, useState } from "react";
import { saveStatuts, type ActionState } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { FormMessage } from "./Field";
import Editor from "./Editor";

export default function StatutsForm({ initialHtml }: { initialHtml: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveStatuts, {});
  const [confirm, setConfirm] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-4">
      <Editor name="statuts" initialHtml={initialHtml} placeholder="Collez ou rédigez ici les statuts de l'association…" />
      <FormMessage message={state.error} />
      <FormMessage message={state.ok} tone="success" />
      <div>
        <Button type="button" disabled={pending} onClick={() => setConfirm(true)}>
          {pending ? "Enregistrement…" : "Confirmer les modifications"}
        </Button>
      </div>
      <ConfirmDialog
        open={confirm}
        description="Les statuts publiés sur le site seront remplacés par cette version."
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          setConfirm(false);
          formRef.current?.requestSubmit();
        }}
      />
    </form>
  );
}
