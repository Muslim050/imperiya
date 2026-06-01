"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { GLASS_UNITS, type GlassUnitKey } from "@/data/catalog";

/** Real cross-section photos sourced from the client's `сайт (1).docx`
 * supplementary asset pack. Files live under public/glass/<key>.png. */
const GLASS_IMG: Record<GlassUnitKey, string> = {
  single24: "/glass/single24.png",
  double32: "/glass/double32.png",
  energy: "/glass/energy.png",
  argon: "/glass/argon.png",
  multimix: "/glass/multimix.png",
  single: "/glass/single.png",
};

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
 * SVG diagram shown when no real photo is available yet. Drawn at a
 * generous size so it sits comfortably in the bigger thumbnail slot
 * the photo cards use.
 */
function GlassDiag({ k }: { k: GlassUnitKey }) {
  const { panes, energy, argon } = SPEC[k];
  const total = 36;
  const gap = 8;
  const w = 5;
  const span = (panes - 1) * gap;
  const startX = (total - span) / 2 - w / 2;
  return (
    <svg
      viewBox="0 0 38 110"
      className="block h-full w-auto max-w-full"
      aria-hidden
    >
      <rect x={startX - 2} y="0" width={span + w + 4} height="4" fill="#9b6d2c" />
      <rect
        x={startX - 2}
        y="104"
        width={span + w + 4}
        height="6"
        fill="#9b6d2c"
      />
      {Array.from({ length: panes }).map((_, i) => {
        const mid = energy && i === Math.floor(panes / 2);
        return (
          <rect
            key={i}
            x={startX + i * gap}
            y="4"
            width={w}
            height="100"
            fill={mid ? "#9bccd8" : "#cfe7f3"}
            stroke={mid ? "#558" : "#888"}
          />
        );
      })}
      {argon && (
        <g fill="#e64545" opacity=".7">
          <circle cx={startX + 4} cy="40" r="1.4" />
          <circle cx={startX + 2} cy="60" r="1.4" />
          <circle cx={startX + 5} cy="80" r="1.4" />
        </g>
      )}
    </svg>
  );
}

/**
 * Uniform 130×160 thumbnail slot — every card gets the same box regardless
 * of the source image's aspect ratio. `object-contain` scales the photo to
 * fit without cropping; cross-section portraits fill the height, wider
 * shots fit by width, both centred.
 */
function GlassThumb({ k, alt }: { k: GlassUnitKey; alt: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="grid h-[160px] w-[130px] shrink-0 place-items-center">
      {failed ? (
        <GlassDiag k={k} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={GLASS_IMG[k]}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="block max-h-full max-w-full object-contain"
        />
      )}
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
              <GlassThumb k={g} alt={t(`glass.names.${g}`)} />
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
