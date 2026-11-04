import { ImageResponse } from "next/og";
import { AT_PATH, AT_TRANSFORM } from "@/components/site/FaviconPaths";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Icône d'application : l'arobase et ses deux orbites sur fond prune. */
export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex" }}>
        <svg viewBox="0 0 64 64" width="64" height="64">
          <rect width="64" height="64" rx="14" fill="#63003c" />
          <g transform={AT_TRANSFORM}>
            <path fill="#ffffff" d={AT_PATH} />
          </g>
          <circle cx="52" cy="13" r="4.8" fill="#6f94ff" />
          <circle cx="43.5" cy="19" r="2.7" fill="#9bb6ff" />
        </svg>
      </div>
    ),
    size,
  );
}
