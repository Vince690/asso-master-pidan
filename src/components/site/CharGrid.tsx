"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Grille de caractères révélée par le curseur.
 * Une fine grille de glyphes (droit × code) presque invisible s'éclaire autour du pointeur,
 * avec une traînée qui s'estompe. Sur écran tactile, un point autonome parcourt la grille.
 *
 * Lisibilité : chaque ligne de texte de la page (relevée dynamiquement, au pixel près, avec une
 * marge de quelques pixels) est une zone où la grille ne s'allume pas. Sous les cartes de verre,
 * l'effet est seulement atténué, puisque leur fond opaque protège déjà le contenu.
 * Respecte prefers-reduced-motion (grille statique).
 */

const GLYPHS = "§@©®™¶0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ{}[]<>/=+*#%&".split("");
const CELL = 22; // px, à DPR 1
const RADIUS = 150;
const TEXT_PAD = 4; // marge autour de chaque ligne de texte
const CARD_FACTOR = 0.35; // intensité résiduelle sous une carte
const BAND = 256; // index spatial : bandes horizontales en coordonnées de page

type Rect = { x: number; y: number; w: number; h: number; f: number }; // f = facteur d'intensité (0 = éteint)

export default function CharGrid() {
  const ref = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();
  const bandsRef = useRef<Map<number, Rect[]>>(new Map());

  // Relevé des zones à protéger : lignes de texte (hors cartes) et cartes
  useEffect(() => {
    let timer = 0;
    const collect = () => {
      const bands = new Map<number, Rect[]>();
      const add = (r: Rect) => {
        const b0 = Math.floor(r.y / BAND);
        const b1 = Math.floor((r.y + r.h) / BAND);
        for (let b = b0; b <= b1; b++) {
          const list = bands.get(b);
          if (list) list.push(r);
          else bands.set(b, [r]);
        }
      };
      const sx = window.scrollX;
      const sy = window.scrollY;
      const roots = Array.from(document.querySelectorAll<HTMLElement>("main, footer"));
      const range = document.createRange();
      for (const root of roots) {
        // cartes : atténuation seulement
        for (const card of Array.from(root.querySelectorAll<HTMLElement>(".glass, .glass-strong"))) {
          const r = card.getBoundingClientRect();
          if (r.width && r.height) add({ x: r.left + sx, y: r.top + sy, w: r.width, h: r.height, f: CARD_FACTOR });
        }
        // champs de formulaire hors cartes : éteints
        for (const field of Array.from(root.querySelectorAll<HTMLElement>("input, select, textarea"))) {
          if (field.closest(".glass, .glass-strong")) continue;
          const r = field.getBoundingClientRect();
          if (r.width && r.height)
            add({ x: r.left + sx - TEXT_PAD, y: r.top + sy - TEXT_PAD, w: r.width + TEXT_PAD * 2, h: r.height + TEXT_PAD * 2, f: 0 });
        }
        // lignes de texte hors cartes : éteint
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
          acceptNode: (node) => {
            if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
            const el = node.parentElement;
            if (!el || el.closest(".glass, .glass-strong, script, style, canvas")) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
          },
        });
        let node: Node | null;
        while ((node = walker.nextNode())) {
          range.selectNodeContents(node);
          const rects = range.getClientRects();
          for (let i = 0; i < rects.length; i++) {
            const r = rects[i];
            if (!r.width || !r.height) continue;
            add({ x: r.left + sx - TEXT_PAD, y: r.top + sy - TEXT_PAD, w: r.width + TEXT_PAD * 2, h: r.height + TEXT_PAD * 2, f: 0 });
          }
        }
      }
      bandsRef.current = bands;
    };
    const schedule = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(collect, 120);
    };
    schedule();
    const interval = window.setInterval(collect, 2500);
    window.addEventListener("resize", schedule);
    const ro = new ResizeObserver(schedule);
    ro.observe(document.body);
    return () => {
      window.clearTimeout(timer);
      window.clearInterval(interval);
      window.removeEventListener("resize", schedule);
      ro.disconnect();
    };
  }, [pathname]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let dpr = 1;
    let chars: string[] = [];
    let energy: Float32Array = new Float32Array(0);
    let base: HTMLCanvasElement | null = null;
    let raf = 0;
    let pointer = { x: -9999, y: -9999, active: false };
    let last = performance.now();
    let t = 0;
    const active = new Set<number>();

    const mono = getComputedStyle(document.documentElement).getPropertyValue("--font-geist-mono").trim() || "ui-monospace";
    const font = `500 11px ${mono}, ui-monospace, SFMono-Regular, Menlo, monospace`;

    function buildBase() {
      base = document.createElement("canvas");
      base.width = width * dpr;
      base.height = height * dpr;
      const b = base.getContext("2d")!;
      b.scale(dpr, dpr);
      b.font = font;
      b.textAlign = "center";
      b.textBaseline = "middle";
      b.fillStyle = "rgba(190, 170, 210, 0.085)";
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          b.fillText(chars[r * cols + c], c * CELL + CELL / 2, r * CELL + CELL / 2);
        }
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      cols = Math.ceil(width / CELL) + 1;
      rows = Math.ceil(height / CELL) + 1;
      chars = Array.from({ length: cols * rows }, () => GLYPHS[(Math.random() * GLYPHS.length) | 0]);
      energy = new Float32Array(cols * rows);
      active.clear();
      buildBase();
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.font = font;
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";
      drawStatic();
    }

    function drawStatic() {
      ctx!.clearRect(0, 0, width, height);
      if (base) ctx!.drawImage(base, 0, 0, width, height);
    }

    /** Facteur d'intensité au point (coordonnées viewport) : 1 libre, 0 sous un texte, atténué sous une carte. */
    function factorAt(vx: number, vy: number): number {
      const px = vx + window.scrollX;
      const py = vy + window.scrollY;
      const list = bandsRef.current.get(Math.floor(py / BAND));
      if (!list) return 1;
      let f = 1;
      for (let i = 0; i < list.length; i++) {
        const m = list[i];
        if (px >= m.x && px <= m.x + m.w && py >= m.y && py <= m.y + m.h) {
          if (m.f === 0) return 0;
          if (m.f < f) f = m.f;
        }
      }
      return f;
    }

    function excite(px: number, py: number, strength: number) {
      const c0 = Math.max(0, Math.floor((px - RADIUS) / CELL));
      const c1 = Math.min(cols - 1, Math.ceil((px + RADIUS) / CELL));
      const r0 = Math.max(0, Math.floor((py - RADIUS) / CELL));
      const r1 = Math.min(rows - 1, Math.ceil((py + RADIUS) / CELL));
      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          const cx = c * CELL + CELL / 2;
          const cy = r * CELL + CELL / 2;
          const dx = cx - px;
          const dy = cy - py;
          const d2 = dx * dx + dy * dy;
          if (d2 > RADIUS * RADIUS) continue;
          const f = factorAt(cx, cy);
          if (f === 0) continue;
          const d = Math.sqrt(d2) / RADIUS;
          const e = (1 - d) * (1 - d) * strength * f;
          const i = r * cols + c;
          if (e > energy[i]) {
            energy[i] = e;
            active.add(i);
          }
          if (e > 0.55 && Math.random() < 0.06) chars[i] = GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
      }
    }

    function frame(now: number) {
      const dt = Math.min(50, now - last);
      last = now;
      t += dt / 1000;

      if (pointer.active) {
        excite(pointer.x, pointer.y, 1);
      } else if (!finePointer) {
        const px = width * (0.5 + 0.42 * Math.sin(t * 0.21));
        const py = height * (0.42 + 0.3 * Math.sin(t * 0.33 + 1.3));
        excite(px, py, 0.7);
      }

      drawStatic();
      const decay = Math.pow(0.93, dt / 16.67);
      for (const i of active) {
        const e = energy[i] * decay;
        energy[i] = e;
        if (e < 0.015) {
          active.delete(i);
          continue;
        }
        const c = i % cols;
        const r = (i - c) / cols;
        const a = Math.min(1, e * 1.4);
        const hue = 230 + (1 - e) * 60; // prune -> bleu
        const light = 62 + e * 30;
        ctx!.fillStyle = `hsla(${hue}, 95%, ${light}%, ${a})`;
        ctx!.fillText(chars[i], c * CELL + CELL / 2, r * CELL + CELL / 2);
      }
      raf = requestAnimationFrame(frame);
    }

    function onMove(e: PointerEvent) {
      pointer = { x: e.clientX, y: e.clientY, active: true };
    }
    function onLeave() {
      pointer = { ...pointer, active: false };
    }

    resize();
    window.addEventListener("resize", resize);
    if (!reduced) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave);
      document.addEventListener("mouseleave", onLeave);
      raf = requestAnimationFrame(frame);
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 [mask-image:linear-gradient(to_bottom,black_0%,black_55%,rgba(0,0,0,0.35)_100%)]"
    />
  );
}
