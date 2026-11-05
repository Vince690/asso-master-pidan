/**
 * Compression d'image dans le navigateur, avant envoi : décodée (HEIC des iPhone compris),
 * redimensionnée, recadrée si demandé, encodée en WebP. Seule cette version compressée part
 * vers le serveur : un portrait ou un logo pèse quelques dizaines de Ko, une illustration
 * d'article une centaine, et reste net sur un écran haute densité.
 */
export type ImageKind = "avatar" | "logo" | "illustration";

const PRESETS: Record<ImageKind, { side: number; square: boolean; quality: number }> = {
  avatar: { side: 512, square: true, quality: 0.84 },
  logo: { side: 512, square: false, quality: 0.9 },
  illustration: { side: 1600, square: false, quality: 0.82 },
};

/** Types et extensions acceptés par les champs de fichier. */
export const IMAGE_ACCEPT = "image/*,.heic,.heif";

export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/") || /\.(heic|heif)$/i.test(file.name);
}

async function decode(file: File): Promise<ImageBitmap> {
  try {
    return await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    // HEIC/HEIF : Safari les lit nativement, les autres navigateurs passent par un décodeur chargé à la demande
    if (/image\/hei[cf]/.test(file.type) || /\.(heic|heif)$/i.test(file.name)) {
      const { default: heic2any } = await import("heic2any");
      const out = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.95 });
      const blob = Array.isArray(out) ? out[0] : out;
      return createImageBitmap(blob);
    }
    throw new Error("Image illisible. Essayez en JPEG ou PNG.");
  }
}

export async function compressImage(file: File, kind: ImageKind): Promise<File> {
  if (!isImageFile(file)) throw new Error("Ce fichier n'est pas une image.");
  const preset = PRESETS[kind];
  const bitmap = await decode(file);
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
