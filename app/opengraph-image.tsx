import { ImageResponse } from "next/og";

export const alt = "IMPERIYA — Фабрика окон, дверей и витражей";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Branded Open Graph / Twitter card, generated at request time with
 * next/og. Self-contained (no external assets/fonts) — uses Latin brand
 * text so it renders crisply without bundling a Cyrillic font. This root
 * image is inherited by every route that doesn't define its own.
 */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(120% 120% at 80% 0%, #262626 0%, #0e0e0e 55%)",
          padding: 80,
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top orange accent + window mark */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <svg width="72" height="72" viewBox="0 0 32 32" fill="none">
            <rect x="6" y="4" width="16" height="24" rx="1" stroke="#f39322" strokeWidth="1.6" />
            <line x1="14" y1="4" x2="14" y2="28" stroke="#f39322" strokeWidth="1.6" />
            <line x1="6" y1="16" x2="22" y2="16" stroke="#f39322" strokeWidth="1.6" />
            <path d="M22 6l6 2v16l-6 2Z" stroke="#f39322" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
          <div
            style={{
              fontSize: 26,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#f39322",
              fontWeight: 700,
            }}
          >
            Official Akfa Partner
          </div>
        </div>

        {/* Wordmark + tagline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 128, fontWeight: 800, letterSpacing: 6 }}>
            IMPERIYA
          </div>
          <div style={{ fontSize: 40, color: "#cfcfcf", fontWeight: 500 }}>
            Windows · Doors · Facades
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 30,
            color: "#9a9a9a",
          }}
        >
          <div>imperiya.uz</div>
          <div style={{ color: "#f39322", fontWeight: 700 }}>+998 99 400 40 40</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
