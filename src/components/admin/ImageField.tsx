"use client";

import { useState } from "react";
import { Field, Input } from "./Field";

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

/**
 * Champ image : une adresse, et, si Cloudinary est configuré, un envoi direct depuis l'ordinateur
 * (upload non signé vers le preset public, aucune clé secrète côté client).
 */
export default function ImageField({ name, label, initialUrl, hint }: { name: string; label: string; initialUrl?: string; hint?: string }) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canUpload = Boolean(CLOUD && PRESET);

  async function upload(file: File) {
    setBusy(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("upload_preset", PRESET!);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, { method: "POST", body });
      if (!res.ok) throw new Error("Envoi refusé par Cloudinary.");
      const json = (await res.json()) as { secure_url: string };
      setUrl(json.secure_url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Envoi impossible.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Field label={label} hint={hint}>
      <Input id={name} name={name} type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
      {canUpload && (
        <label className="mt-1 inline-flex cursor-pointer items-center gap-2 text-xs text-electric-300 hover:text-electric-200">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={busy}
            onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
          />
          {busy ? "Envoi en cours…" : "Envoyer une image depuis l'ordinateur"}
        </label>
      )}
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="mt-2 aspect-video w-full rounded-lg border border-line object-cover" />
      )}
      {error && <span className="text-xs text-red-300">{error}</span>}
    </Field>
  );
}
