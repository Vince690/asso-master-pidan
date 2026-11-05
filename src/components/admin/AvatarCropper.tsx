"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { Minus, Plus } from "lucide-react";
import { decodeImage, type Focus } from "@/lib/image-client";
import { Button } from "@/components/ui/Button";

const FRAME = 224;
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const STEP = 1.25;

type Point = { x: number; y: number };

/**
 * Choix du cadrage d'un portrait : la photo s'affiche derrière un cercle, on la fait glisser
 * pour placer le visage et on zoome avec les boutons, le curseur, la molette ou en pinçant
 * l'écran. Le résultat est une position et un zoom de recadrage ; la compression reste la même.
 */
export default function AvatarCropper({ file, onConfirm, onCancel }: { file: File; onConfirm: (focus: Focus) => void; onCancel: () => void }) {
  const [preview, setPreview] = useState<{ url: string; w: number; h: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [focus, setFocus] = useState<Required<Focus>>({ x: 0.5, y: 0.5, zoom: 1 });
  const frame = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, Point>());
  const pinch = useRef<number | null>(null);

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
        setPreview({ url: canvas.toDataURL("image/jpeg", 0.9), w: canvas.width, h: canvas.height });
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Image illisible.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [file]);

  // Le petit côté de la photo remplit le cadre au zoom 1 ; au-delà, l'image est agrandie
  const base = preview ? FRAME / Math.min(preview.w, preview.h) : 1;
  const w = preview?.w ?? FRAME;
  const h = preview?.h ?? FRAME;
  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  const overflow = (zoom: number) => ({ x: w * base * zoom - FRAME, y: h * base * zoom - FRAME });

  /** Change le zoom en gardant immobile le point de la photo situé sous (px, py) dans le cadre. */
  function applyZoom(next: (zoom: number) => number, px = FRAME / 2, py = FRAME / 2) {
    setFocus((f) => {
      const zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next(f.zoom)));
      const o0 = overflow(f.zoom);
      const o1 = overflow(zoom);
      const s0 = base * f.zoom;
      const s1 = base * zoom;
      const ix = (o0.x * f.x + px) / s0;
      const iy = (o0.y * f.y + py) / s0;
      return { zoom, x: o1.x > 0 ? clamp((ix * s1 - px) / o1.x) : 0.5, y: o1.y > 0 ? clamp((iy * s1 - py) / o1.y) : 0.5 };
    });
  }

  function pan(dx: number, dy: number) {
    setFocus((f) => {
      const o = overflow(f.zoom);
      return { ...f, x: o.x > 0 ? clamp(f.x - dx / o.x) : 0.5, y: o.y > 0 ? clamp(f.y - dy / o.y) : 0.5 };
    });
  }

  // Molette : zoom autour du curseur (écouteur non passif pour empêcher le défilement de la page)
  const zoomRef = useRef(applyZoom);
  useEffect(() => {
    zoomRef.current = applyZoom;
  });
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      zoomRef.current((z) => z * (e.deltaY < 0 ? 1.08 : 1 / 1.08), e.clientX - r.left, e.clientY - r.top);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [preview]);

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const [a, b] = [...pointers.current.values()];
    pinch.current = b ? Math.hypot(b.x - a.x, b.y - a.y) : null;
  }
  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const cur = { x: e.clientX, y: e.clientY };
    if (pointers.current.size === 2 && pinch.current) {
      // Pincement : zoom autour du milieu des deux doigts, puis déplacement avec eux
      const other = [...pointers.current.entries()].find(([id]) => id !== e.pointerId)![1];
      const oldMid = { x: (prev.x + other.x) / 2, y: (prev.y + other.y) / 2 };
      const mid = { x: (cur.x + other.x) / 2, y: (cur.y + other.y) / 2 };
      const dist = Math.hypot(cur.x - other.x, cur.y - other.y);
      const r = e.currentTarget.getBoundingClientRect();
      const ratio = dist / pinch.current;
      pinch.current = dist;
      applyZoom((z) => z * ratio, mid.x - r.left, mid.y - r.top);
      pan(mid.x - oldMid.x, mid.y - oldMid.y);
    } else if (pointers.current.size === 1) {
      pan(cur.x - prev.x, cur.y - prev.y);
    }
    pointers.current.set(e.pointerId, cur);
  }
  function onPointerUp(e: ReactPointerEvent<HTMLDivElement>) {
    pointers.current.delete(e.pointerId);
    pinch.current = null;
  }

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

  const over = overflow(focus.zoom);
  const dispW = w * base * focus.zoom;
  const dispH = h * base * focus.zoom;

  return (
    <div className="flex flex-wrap items-center gap-5">
      <div
        ref={frame}
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
          style={{ width: dispW, height: dispH, left: -over.x * focus.x, top: -over.y * focus.y }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 rounded-full border border-white/60 shadow-[0_0_0_999px_rgba(11,7,18,0.6)]" />
      </div>
      <div className="flex min-w-48 flex-1 flex-col gap-3">
        <p className="text-sm text-fg-muted">Glissez la photo pour placer le visage dans le cercle. Zoomez avec les boutons, la molette ou en pinçant l'écran.</p>
        <div className="flex items-center gap-2">
          <ZoomButton label="Dézoomer" disabled={focus.zoom <= MIN_ZOOM} onClick={() => applyZoom((z) => z / STEP)}>
            <Minus size={14} />
          </ZoomButton>
          <input
            type="range"
            aria-label="Zoom"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={0.01}
            value={focus.zoom}
            onChange={(e) => {
              const z = Number(e.target.value);
              applyZoom(() => z);
            }}
            className="h-1 min-w-0 flex-1 cursor-pointer accent-electric-400"
          />
          <ZoomButton label="Zoomer" disabled={focus.zoom >= MAX_ZOOM} onClick={() => applyZoom((z) => z * STEP)}>
            <Plus size={14} />
          </ZoomButton>
        </div>
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

function ZoomButton({ label, disabled, onClick, children }: { label: string; disabled: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-fg-muted transition-colors hover:bg-white/10 hover:text-fg disabled:opacity-40 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}
