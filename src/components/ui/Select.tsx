"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

/**
 * Menu déroulant maison, dans le style du site (pilule de verre, liste en verre),
 * à la place du <select> natif dont l'apparence dépend du système.
 * - Fonctionne dans un formulaire classique grâce à un champ caché `name`.
 * - Clavier : flèches, Entrée/Espace, Échap, Début/Fin.
 * - Contrôlé (`value` + `onChange`) ou non (`defaultValue`).
 */
export default function Select({
  id,
  name,
  options,
  value,
  defaultValue,
  onChange,
  className,
}: {
  id?: string;
  name?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}) {
  const [inner, setInner] = useState(defaultValue ?? options[0]?.value ?? "");
  const current = value ?? inner;
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const listId = useId();
  const selected = options.find((o) => o.value === current) ?? options[0];

  const choose = (v: string) => {
    if (value === undefined) setInner(v);
    onChange?.(v);
    setOpen(false);
  };

  const toggle = () => {
    if (!open) setCursor(Math.max(0, options.findIndex((o) => o.value === current)));
    setOpen((o) => !o);
  };

  // Fermeture au clic en dehors
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // L'option sous le curseur reste visible dans la liste
  useEffect(() => {
    if (!open) return;
    list.current?.children[cursor]?.scrollIntoView({ block: "nearest" });
  }, [open, cursor]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        toggle();
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setCursor((c) => Math.min(options.length - 1, c + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setCursor((c) => Math.max(0, c - 1));
        break;
      case "Home":
        e.preventDefault();
        setCursor(0);
        break;
      case "End":
        e.preventDefault();
        setCursor(options.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (options[cursor]) choose(options[cursor].value);
        break;
      case "Escape":
      case "Tab":
        setOpen(false);
        break;
    }
  };

  return (
    <div ref={root} className={cn("relative", className)}>
      {name && <input type="hidden" name={name} value={current} />}
      <button
        type="button"
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-haspopup="listbox"
        onClick={toggle}
        onKeyDown={onKeyDown}
        className={cn(
          "flex w-full items-center justify-between gap-3 rounded-xl border border-line bg-white/[0.04] px-3.5 py-2.5 text-left text-[0.95rem] text-fg transition-[border-color,background-color] hover:bg-white/[0.06] focus-visible:border-line-strong focus-visible:outline-none",
          open && "border-line-strong",
        )}
      >
        <span className="truncate">{selected?.label}</span>
        <ChevronDown size={15} className={cn("shrink-0 text-fg-dim transition-transform duration-200", open && "rotate-180")} />
      </button>
      {open && (
        <ul
          ref={list}
          id={listId}
          role="listbox"
          aria-activedescendant={`${listId}-${cursor}`}
          className="glass-strong animate-pop absolute inset-x-0 top-[calc(100%+0.4rem)] z-30 max-h-64 overflow-y-auto rounded-2xl p-1.5"
        >
          {options.map((o, i) => (
            <li key={o.value} id={`${listId}-${i}`} role="option" aria-selected={o.value === current}>
              <button
                type="button"
                onClick={() => choose(o.value)}
                onPointerEnter={() => setCursor(i)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-[0.92rem] text-fg-muted",
                  i === cursor && "bg-white/10 text-fg",
                  o.value === current && "text-fg",
                )}
              >
                <span className="truncate">{o.label}</span>
                {o.value === current && <Check size={14} className="shrink-0 text-electric-300" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
