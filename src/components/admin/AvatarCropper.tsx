"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { decodeImage, type Focus } from "@/lib/image-client";
import { Button } from "@/components/ui/Button";

const FRAME = 224;

/**
 * Choix du cadrage d'un portrait : la photo s'affiche derrière un cercle, on la fait glisser
 * pour placer le visage. Le résultat est une position de recadrage, la compression reste la même.
 * Une photo déjà carrée n'a rien à cadrer : elle est validée directement.
 */
export default function AvatarCropper({ file, onConfirm, onCancel }: { file: File; onConfirm: (focus: Focus) => void; onCancel: () => void }) {
  const [preview, setPreview] = useState<{ url: string; w: number; h: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [focus, setFocus] = useState<Focus>({ x: 0.5, y: 0.5 });
  const last = useRef<{ x: number; y: number } | null>(null);
  // Le décodage ne dépend que du fichier : le rappel de validation est lu au moment voulu
  const confirmRef = useRef(onConfirm);
  useEffect(() => {
    confirmRef.current = onConfirm;
  }, [onConfirm]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const bitmap = await decodeImage(file);
        const scale = Math.min(1, 900 / Math.max(bitmap.width, bitmap.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(bitmap.width * scale);
        canvas.height = Math.round(bitmap.height * scale);
        canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        bitmap.close();
        if (cancelled) return;
        if (Math.abs(canvas.width - canvas.height) < 2) {
          confirmRef.current({ x: 0.5, y: 0.5 });
          return;
        }
        setPreview({ url: canvas.toDataURL("image/jpeg", 0.9), w: canvas.width, h: canvas.height });
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Image illisible.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [file]);

  if (error) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <span className="text-red-300">{error}</span>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Fermer
        </Button>
      </div>
    );
  }
  if (!preview) return <div className="h-56 w-56 animate-pulse rounded-2xl bg-white/5" />;

  const landscape = preview.w > preview.h;
  const dispW = landscape ? (FRAME * preview.w) / preview.h : FRAME;
  const dispH = landscape ? FRAME : (FRAME * preview.h) / preview.w;
  const overX = dispW - FRAME;
  const overY = dispH - FRAME;

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    last.current = { x: e.clientX, y: e.clientY };
  }
  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!last.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    setFocus((f) => ({
      x: overX > 0 ? Math.min(1, Math.max(0, f.x - dx / overX)) : 0.5,
      y: overY > 0 ? Math.min(1, Math.max(0, f.y - dy / overY)) : 0.5,
    }));
  }
  function onPointerUp() {
    last.current = null;
  }

  return (
    <div className="flex flex-wrap items-center gap-5">
      <div
        role="img"
        aria-label="Aperçu du cadrage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="relative shrink-0 cursor-grab touch-none overflow-hidden rounded-2xl bg-ink-0 select-none active:cursor-grabbing"
        style={{ width: FRAME, height: FRAME }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={preview.url}
          alt=""
          draggable={false}
          className="absolute max-w-none"
          style={{ width: dispW, height: dispH, left: -overX * focus.x, top: -overY * focus.y }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 rounded-full border border-white/60 shadow-[0_0_0_999px_rgba(11,7,18,0.6)]" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <p className="text-sm text-fg-muted">Glissez la photo pour placer le visage dans le cercle.</p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" onClick={() => onConfirm(focus)}>
            Utiliser ce cadrage
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Annuler
          </Button>
        </div>
      </div>
    </div>
  );
}
