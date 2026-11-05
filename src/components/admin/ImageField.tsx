"use client";

import { useRef, useState, type DragEvent, type KeyboardEvent } from "react";
import { ImageIcon, Upload, X } from "lucide-react";
import { uploadImage } from "@/app/admin/actions";
import { compressImage, IMAGE_ACCEPT, isImageFile, type Focus, type ImageKind } from "@/lib/image-client";
import { cn } from "@/lib/utils";
import AvatarCropper from "./AvatarCropper";
import { inputClass } from "./Field";

/**
 * Champ image, de la taille et de la forme d'un champ de texte : un clic ouvre les fichiers,
 * une image déposée dessus est prise directement. Tous les formats courants sont acceptés
 * (JPEG, PNG, WebP, HEIC des iPhone…) ; l'image est convertie et compressée dans le navigateur,
 * et seule cette version légère est enregistrée. Pour un portrait, on choisit d'abord le cadrage.
 */
export default function ImageField({
  name,
  label,
  kind,
  initialUrl,
  hint,
  className,
}: {
  name: string;
  label: string;
  kind: ImageKind;
  initialUrl?: string;
  hint?: string;
  className?: string;
}) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<File | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const changed = url !== (initialUrl ?? "");

  function pick(file: File) {
    setError(null);
    if (kind === "avatar") setPending(file);
    else void send(file);
  }

  async function send(file: File, focus?: Focus) {
    setBusy(true);
    setError(null);
    try {
      const compressed = await compressImage(file, kind, focus);
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

  function confirmCrop(focus: Focus) {
    if (!pending) return;
    const file = pending;
    setPending(null);
    void send(file, focus);
  }

  function open() {
    if (!busy) input.current?.click();
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setOver(false);
    const file = Array.from(e.dataTransfer.files).find(isImageFile);
    if (file) pick(file);
    else setError("Déposez une image.");
  }

  const text = busy ? "Conversion et envoi…" : url ? "Changer l'image" : "Sélectionner une image";

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-sm font-medium text-fg">{label}</span>
      <input type="hidden" name={name} value={url} />
      <input
        ref={input}
        type="file"
        accept={IMAGE_ACCEPT}
        className="hidden"
        tabIndex={-1}
        onChange={(e) => e.target.files?.[0] && pick(e.target.files[0])}
      />
      <div
        role="button"
        tabIndex={0}
        aria-label={`${text} (${label.toLowerCase()})`}
        aria-busy={busy}
        onClick={open}
        onKeyDown={onKeyDown}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
        className={cn(
          inputClass,
          "flex cursor-pointer items-center gap-3 text-fg-muted hover:bg-white/[0.07] focus-visible:border-line-strong",
          over && "border-electric-400 bg-electric-500/10 text-fg",
          busy && "cursor-progress",
        )}
      >
        <Thumb url={url} kind={kind} />
        <span className="min-w-0 flex-1 truncate">{text}</span>
        {url && !busy ? (
          <button
            type="button"
            aria-label="Retirer l'image"
            onClick={(e) => {
              e.stopPropagation();
              setUrl("");
            }}
            className="-my-1 -mr-1.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-fg-dim transition-colors hover:bg-white/10 hover:text-fg"
          >
            <X size={14} />
          </button>
        ) : (
          <Upload size={15} className="shrink-0 text-fg-dim" />
        )}
      </div>
      {pending && (
        <div className="rounded-xl border border-line bg-white/[0.04] p-3">
          <AvatarCropper file={pending} onConfirm={confirmCrop} onCancel={() => setPending(null)} />
        </div>
      )}
      {changed && !busy && !pending && (
        <span className="text-xs text-electric-300">
          {url ? "Nouvelle image prête." : "Image retirée."} Enregistrez la fiche pour l'appliquer sur le site.
        </span>
      )}
      <span className="text-xs text-fg-dim">
        {hint ? `${hint} ` : ""}Clic ou glisser-déposer, tous formats, compressée automatiquement.
      </span>
      {error && <span className="text-xs text-red-300">{error}</span>}
    </div>
  );
}

/** Vignette de la hauteur d'une ligne de texte, pour que le champ garde la taille d'un champ classique. */
function Thumb({ url, kind }: { url: string; kind: ImageKind }) {
  const shape = cn(
    "shrink-0 overflow-hidden",
    kind === "avatar" && "h-[1.425rem] w-[1.425rem] rounded-full",
    kind === "logo" && "h-[1.425rem] w-[1.425rem] rounded-md",
    kind === "illustration" && "h-[1.425rem] w-9 rounded-md",
  );
  if (!url) {
    return (
      <span className={cn(shape, "inline-flex items-center justify-center border border-dashed border-line-strong text-fg-dim")}>
        <ImageIcon size={11} />
      </span>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt="" className={cn(shape, kind === "logo" ? "bg-white object-contain p-px" : "object-cover")} />;
}
