"use client";

import { useRef, useState } from "react";
import { ImageIcon } from "lucide-react";
import { uploadImage } from "@/app/admin/actions";
import { compressImage, type ImageKind } from "@/lib/image-client";
import { cn } from "@/lib/utils";
import { Input } from "./Field";

/**
 * Champ image : on choisit un fichier sur l'ordinateur ou le téléphone, il est compressé
 * dans le navigateur (portrait recadré en carré, logo et illustration réduits) puis stocké
 * avec le reste des données. Coller une adresse https reste possible, replié.
 */
export default function ImageField({
  name,
  label,
  kind,
  initialUrl,
  hint,
}: {
  name: string;
  label: string;
  kind: ImageKind;
  initialUrl?: string;
  hint?: string;
}) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pasting, setPasting] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  async function pick(file: File) {
    setBusy(true);
    setError(null);
    try {
      const compressed = await compressImage(file, kind);
      const body = new FormData();
      body.append("file", compressed);
      const res = await uploadImage(body);
      if ("error" in res) throw new Error(res.error);
      setUrl(res.url);
      setPasting(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Envoi impossible.");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-fg">{label}</span>
      <input type="hidden" name={name} value={url} />
      <input
        ref={input}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && pick(e.target.files[0])}
      />
      <div className="flex items-center gap-4 rounded-xl border border-line bg-white/[0.04] p-3">
        <Preview url={url} kind={kind} />
        <div className="flex min-w-0 flex-col gap-1.5">
          <button
            type="button"
            disabled={busy}
            onClick={() => input.current?.click()}
            className="inline-flex w-fit items-center rounded-full border border-line px-3.5 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-white/10 disabled:opacity-50"
          >
            {busy ? "Compression et envoi…" : url ? "Changer l'image" : "Choisir une image"}
          </button>
          <p className="text-xs text-fg-dim">
            JPEG, PNG ou WebP, compressée automatiquement.
            {url && (
              <>
                {" · "}
                <button type="button" className="text-fg-muted hover:text-fg" onClick={() => setUrl("")}>
                  Retirer
                </button>
              </>
            )}
            {!pasting && (
              <>
                {" · "}
                <button type="button" className="text-fg-muted hover:text-fg" onClick={() => setPasting(true)}>
                  Coller une adresse
                </button>
              </>
            )}
          </p>
        </div>
      </div>
      {pasting && (
        <Input
          id={name}
          type="url"
          value={url.startsWith("/i/") ? "" : url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://…"
          autoFocus
        />
      )}
      {hint && <span className="text-xs text-fg-dim">{hint}</span>}
      {error && <span className="text-xs text-red-300">{error}</span>}
    </div>
  );
}

function Preview({ url, kind }: { url: string; kind: ImageKind }) {
  const shape = cn(
    "shrink-0 overflow-hidden border border-line",
    kind === "avatar" && "h-14 w-14 rounded-full",
    kind === "logo" && "h-14 w-14 rounded-xl bg-white p-1",
    kind === "illustration" && "aspect-video w-28 rounded-lg",
  );
  if (!url) {
    return (
      <span className={cn(shape, "inline-flex items-center justify-center border-dashed text-fg-dim", kind === "logo" && "bg-transparent")}>
        <ImageIcon size={18} />
      </span>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt="" className={cn(shape, kind === "logo" ? "object-contain" : "object-cover")} />;
}
