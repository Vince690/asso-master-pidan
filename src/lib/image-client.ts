/**
 * Compression d'image dans le navigateur, avant envoi : redimensionnée, recadrée si demandé,
 * encodée en WebP. Un portrait ou un logo pèse quelques dizaines de Ko, une illustration
 * d'article une centaine, et reste net sur un écran haute densité.
 */
export type ImageKind = "avatar" | "logo" | "illustration";

const PRESETS: Record<ImageKind, { side: number; square: boolean; quality: number }> = {
  avatar: { side: 512, square: true, quality: 0.84 },
  logo: { side: 512, square: false, quality: 0.9 },
  illustration: { side: 1600, square: false, quality: 0.82 },
};

export async function compressImage(file: File, kind: ImageKind): Promise<File> {
  const preset = PRESETS[kind];
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error("Image illisible. Essayez en JPEG ou PNG.");
  }
  const { width: w, height: h } = bitmap;
  // Zone source (recadrage carré centré pour les portraits) et taille cible
  const crop = preset.square ? Math.min(w, h) : 0;
  const sx = preset.square ? (w - crop) / 2 : 0;
  const sy = preset.square ? (h - crop) / 2 : 0;
  const sw = preset.square ? crop : w;
  const sh = preset.square ? crop : h;
  const scale = Math.min(1, preset.side / Math.max(sw, sh));
  const tw = Math.max(1, Math.round(sw * scale));
  const th = Math.max(1, Math.round(sh * scale));

  const canvas = document.createElement("canvas");
  canvas.width = tw;
  canvas.height = th;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Compression impossible dans ce navigateur.");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, tw, th);
  bitmap.close();

  const blob =
    (await toBlob(canvas, "image/webp", preset.quality)) ?? (await toBlob(canvas, "image/jpeg", preset.quality));
  if (!blob) throw new Error("Compression impossible dans ce navigateur.");
  const ext = blob.type === "image/webp" ? "webp" : "jpg";
  return new File([blob], `${file.name.replace(/\.[^.]+$/, "") || "image"}.${ext}`, { type: blob.type });
}

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b && b.type === type ? b : null), type, quality));
}
