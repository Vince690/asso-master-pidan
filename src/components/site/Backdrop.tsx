/**
 * Halos lumineux prune et bleu derrière le verre, en dérive très lente.
 * Purement décoratif, sans JavaScript.
 */
export default function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute -top-[20%] left-[-10%] h-[70vh] w-[60vw] rounded-full opacity-70 blur-3xl [animation:drift_26s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(closest-side, rgb(133 20 90 / 0.55), transparent 70%)" }}
      />
      <div
        className="absolute top-[10%] right-[-15%] h-[60vh] w-[50vw] rounded-full opacity-60 blur-3xl [animation:drift-2_32s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(closest-side, rgb(79 123 255 / 0.35), transparent 70%)" }}
      />
      <div
        className="absolute bottom-[-30%] left-[20%] h-[60vh] w-[60vw] rounded-full opacity-50 blur-3xl [animation:drift_40s_ease-in-out_infinite_reverse]"
        style={{ background: "radial-gradient(closest-side, rgb(99 0 60 / 0.5), transparent 70%)" }}
      />
      {/* Grain très léger pour casser le banding des dégradés */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
    </div>
  );
}
