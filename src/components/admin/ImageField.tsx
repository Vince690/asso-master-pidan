"use client";

import { useRef, useState, type DragEvent } from "react";
import { ImageIcon, Upload } from "lucide-react";
import { uploadImage } from "@/app/admin/actions";
import { compressImage, IMAGE_ACCEPT, isImageFile, type ImageKind } from "@/lib/image-client";
import { cn } from "@/lib/utils";

/**
 * Champ image : un bouton qui ouvre les fichiers, ou une image déposée sur la zone.
 * Tous les formats courants sont acceptés (JPEG, PNG, WebP, HEIC des iPhone…) ; l'image est
 * convertie et compressée dans le navigateur, et seule cette version légère est enregistrée.
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
  const [over, setOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    } catch (e) {
      setError(e instanceof Error ? e.message : "Envoi impossible.");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setOver(false);
    const file = Array.from(e.dataTransfer.files).find(isImageFile);
    if (file) pick(file);
    else setError("Déposez une image.");
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-fg">{label}</span>
      <input type="hidden" name={name} value={url} />
      <input
        ref={input}
        type="file"
        accept={IMAGE_ACCEPT}
        className="hidden"
        onChange={(e) => e.target.files?.[0] && pick(e.target.files[0])}
      />
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
        className={cn(
          "flex items-center gap-4 rounded-xl border bg-white/[0.04] p-3 transition-colors",
          over ? "border-electric-400 bg-electric-500/10" : "border-line",
        )}
      >
        <Preview url={url} kind={kind} />
        <div className="flex min-w-0 flex-col gap-1.5">
          <button
            type="button"
            disabled={busy}
            onClick={() => input.current?.click()}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-white/10 disabled:opacity-50"
          >
            <Upload size={14} />
            {busy ? "Conversion et envoi…" : url ? "Changer l'image" : "Sélectionner une image"}
          </button>
          <p className="text-xs text-fg-dim">
            Ou glissez-la ici. Tous formats, compressée automatiquement.
            {url && (
              <>
                {" · "}
                <button type="button" className="text-fg-muted hover:text-fg" onClick={() => setUrl("")}>
                  Retirer
                </button>
              </>
            )}
          </p>
        </div>
      </div>
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
