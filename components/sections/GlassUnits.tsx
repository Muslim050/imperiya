"use client";

import { useTranslation } from "react-i18next";
import { GLASS_UNITS, type GlassUnitKey } from "@/data/catalog";

/** Structural spec per unit — drives the SVG diagram rendering. */
const SPEC: Record<
  GlassUnitKey,
  { panes: number; energy?: boolean; argon?: boolean }
> = {
  single: { panes: 1 },
  single24: { panes: 2 },
  double32: { panes: 3 },
  energy: { panes: 3, energy: true },
  argon: { panes: 2, argon: true },
  multimix: { panes: 3, energy: true, argon: true },
};

/**
 * Polished SVG cross-section drawn entirely inline — every card uses the
 * same artwork primitives (wood-tone frame top/bottom, gradient glass
 * panes, silver spacer bars, shine highlight on each pane), the units
 * differ only in how many panes are stacked plus argon-fill dots and a
 * low-E tinted middle pane where the spec calls for it.
 *
 * Generated locally so all six tiles look perfectly uniform regardless
 * of source artwork — no external assets, no copyright concerns, crisp
 * at any zoom level.
 */
function GlassDiag({ k }: { k: GlassUnitKey }) {
  const { panes, energy, argon } = SPEC[k];

  /* Canvas geometry — 100×160 viewBox, portrait. */
  const W = 100;
  const H = 160;
  const frameTopY = 6;
  const frameTopH = 16;
  const frameBotY = 138;
  const frameBotH = 16;
  const glassY = frameTopY + frameTopH;
  const glassH = frameBotY - glassY;

  /* Pane geometry: 1 thick pane for "single", thinner panes with wider
   * gaps for laminated units. Centred horizontally. */
  const paneW = panes === 1 ? 18 : 8;
  const gapW = panes === 2 ? 14 : 12;
  const totalW = paneW * panes + gapW * (panes - 1);
  const startX = (W - totalW) / 2;

  /* Stable per-instance gradient ids so multiple diagrams on the page
   * don't share <defs> by accident. */
  const id = `g-${k}`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="block h-full w-auto max-w-full"
      aria-hidden
    >
      <defs>
        <linearGradient id={`${id}-frame`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#b07a3f" />
          <stop offset="0.5" stopColor="#8a5e30" />
          <stop offset="1" stopColor="#6e4825" />
        </linearGradient>
        <linearGradient id={`${id}-pane`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#e1edf5" />
          <stop offset="0.55" stopColor="#b6d3e4" />
          <stop offset="1" stopColor="#8eb6cd" />
        </linearGradient>
        <linearGradient id={`${id}-energy`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#8cc7cd" />
          <stop offset="0.55" stopColor="#5fa3aa" />
          <stop offset="1" stopColor="#3a7e85" />
        </linearGradient>
        <linearGradient id={`${id}-shine`} x1="0" x2="1">
          <stop offset="0" stopColor="white" stopOpacity="0.55" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-spacer`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#dadada" />
          <stop offset="0.5" stopColor="#b9b9b9" />
          <stop offset="1" stopColor="#959595" />
        </linearGradient>
      </defs>

      {/* Subtle drop shadow under the unit */}
      <ellipse cx={W / 2} cy={H - 3} rx={W * 0.34} ry="2.4" fill="rgba(0,0,0,0.12)" />

      {/* Top frame */}
      <rect
        x="6"
        y={frameTopY}
        width={W - 12}
        height={frameTopH}
        fill={`url(#${id}-frame)`}
        stroke="#5a3e21"
        strokeWidth="0.5"
        rx="1.2"
      />
      <line
        x1="8"
        y1={frameTopY + frameTopH - 2}
        x2={W - 8}
        y2={frameTopY + frameTopH - 2}
        stroke="rgba(0,0,0,0.18)"
        strokeWidth="0.6"
      />

      {/* Bottom frame */}
      <rect
        x="6"
        y={frameBotY}
        width={W - 12}
        height={frameBotH}
        fill={`url(#${id}-frame)`}
        stroke="#5a3e21"
        strokeWidth="0.5"
        rx="1.2"
      />
      <line
        x1="8"
        y1={frameBotY + 2}
        x2={W - 8}
        y2={frameBotY + 2}
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="0.6"
      />

      {/* Spacer bars in each cavity (only for multi-pane units) */}
      {Array.from({ length: panes - 1 }).map((_, i) => {
        const x = startX + (i + 1) * paneW + i * gapW;
        return (
          <g key={`spacer-${i}`}>
            <rect
              x={x - 0.5}
              y={glassY + 1}
              width={gapW + 1}
              height="5"
              fill={`url(#${id}-spacer)`}
              stroke="#7a7a7a"
              strokeWidth="0.4"
            />
            <rect
              x={x - 0.5}
              y={glassY + glassH - 6}
              width={gapW + 1}
              height="5"
              fill={`url(#${id}-spacer)`}
              stroke="#7a7a7a"
              strokeWidth="0.4"
            />
          </g>
        );
      })}

      {/* Argon-fill dots in cavities */}
      {argon &&
        Array.from({ length: panes - 1 }).map((_, i) => {
          const cx = startX + (i + 1) * paneW + i * gapW + gapW / 2;
          return (
            <g key={`argon-${i}`} fill="#e94343" opacity="0.78">
              <circle cx={cx - 1.5} cy={glassY + glassH * 0.28} r="0.9" />
              <circle cx={cx + 1.6} cy={glassY + glassH * 0.42} r="0.9" />
              <circle cx={cx - 1.2} cy={glassY + glassH * 0.55} r="0.9" />
              <circle cx={cx + 1.4} cy={glassY + glassH * 0.68} r="0.9" />
              <circle cx={cx - 0.8} cy={glassY + glassH * 0.82} r="0.9" />
            </g>
          );
        })}

      {/* Glass panes (drawn last so they overlap the spacers cleanly) */}
      {Array.from({ length: panes }).map((_, i) => {
        const x = startX + i * (paneW + gapW);
        const isMid = !!energy && i === Math.floor(panes / 2);
        return (
          <g key={`pane-${i}`}>
            <rect
              x={x}
              y={glassY}
              width={paneW}
              height={glassH}
              fill={`url(#${isMid ? `${id}-energy` : `${id}-pane`})`}
              stroke={isMid ? "#2f6065" : "#5d7f95"}
              strokeWidth="0.6"
            />
            {/* Vertical shine highlight on the left of every pane */}
            <rect
              x={x + 0.6}
              y={glassY + 2}
              width={paneW * 0.4}
              height={glassH - 4}
              fill={`url(#${id}-shine)`}
            />
            {isMid && (
              <text
                x={x + paneW / 2}
                y={glassY + glassH / 2 + 1.5}
                textAnchor="middle"
                fontSize="5"
                fontWeight="700"
                fill="white"
                opacity="0.85"
                style={{ fontFamily: "ui-sans-serif, system-ui" }}
              >
                E
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/**
 * Uniform 130×160 thumbnail slot — every card gets exactly the same SVG
 * cross-section at the same scale, so the section reads as one
 * consistent visual instead of six different-aspect photos.
 */
function GlassThumb({ k }: { k: GlassUnitKey }) {
  return (
    <div className="grid h-[160px] w-[130px] shrink-0 place-items-center">
      <GlassDiag k={k} />
    </div>
  );
}

export function GlassUnits() {
  const { t } = useTranslation();
  return (
    <section id="glass" className="scroll-mt-40 bg-bg pt-8 pb-7">
      <div className="inner">
        <h2 className="m-0 mb-[18px] text-lg font-extrabold uppercase tracking-[0.06em]">
          {t("glass.title")}
        </h2>
        {/* Wider, uniform cards — 1col on mobile, 2col from sm, 3col from
            lg. The previous 6-column setup crushed each card down to
            ~210px on desktop and clipped the descriptions. */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GLASS_UNITS.map((g) => (
            <div
              key={g}
              className="flex min-h-[200px] items-center gap-4 border border-[#ECECEC] bg-white p-5"
            >
              <GlassThumb k={g} />
              <div className="min-w-0 flex-1">
                <h3 className="m-0 mb-2 text-[14px] font-extrabold leading-[1.25] text-[#111]">
                  {t(`glass.names.${g}`)}
                </h3>
                <p className="m-0 text-[12px] leading-[1.5] text-[#666]">
                  {t(`glass.items.${g}`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
