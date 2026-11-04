import { ImageResponse } from "next/og";
import { MASTER } from "@/lib/master";
import { MARK_REGULAR, MARK_VIEWBOX } from "@/components/site/MarkPaths";

export const alt = "PID@N, association du Master 2 Propriété intellectuelle et droit des affaires numériques";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(900px 500px at 15% 0%, #4a0a36 0%, #09060f 60%), #09060f",
          color: "#f4eff7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 40, fontWeight: 700, letterSpacing: -2 }}>
          <svg viewBox={MARK_VIEWBOX} width="84" height="84">
            <path fill="#4f7bff" d={MARK_REGULAR.lines} />
            <path fill="#9bb6ff" d={MARK_REGULAR.nodes} />
            <path fill="#ffffff" d={MARK_REGULAR.face} />
          </svg>
          <div style={{ display: "flex" }}>
            <span>PID</span>
            <span style={{ color: "#6f94ff" }}>@</span>
            <span>N</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 64, fontWeight: 600, letterSpacing: -3, lineHeight: 1.05, maxWidth: 950 }}>
            Le master du droit du numérique et de la propriété intellectuelle.
          </div>
          <div style={{ fontSize: 26, color: "#b3a8bf" }}>{`${MASTER.short} · ${MASTER.university}`}</div>
        </div>
      </div>
    ),
    size,
  );
}
