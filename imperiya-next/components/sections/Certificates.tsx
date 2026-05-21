"use client";

import { useRef } from "react";
import { useTranslation } from "react-i18next";

/* Certificate images (akfasteel.uz, per the TZ) to be supplied later. */
const CARDS = [
  { crest: "★", bg: "#fdfdfd" },
  { crest: "A", bg: "#f7eed9" },
  { crest: "★", bg: "#fff" },
  { crest: "AKFA", bg: "#fcfaf4" },
  { crest: "★", bg: "#fdf7e9" },
  { crest: "★", bg: "#f6e8d0" },
  { crest: "★", bg: "#fdfdfd" },
];

export function Certificates() {
  const { t } = useTranslation();
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: 1 | -1) =>
    trackRef.current?.scrollBy({ left: dir * 360, behavior: "smooth" });

  return (
    <section className="scroll-mt-40 bg-white pt-7 pb-6">
      <div className="inner relative">
      <h2 className="m-0 mb-[18px] text-lg font-extrabold uppercase tracking-[0.06em]">
        {t("certificates.title")}
      </h2>

      <button
        type="button"
        aria-label="prev"
        onClick={() => scrollBy(-1)}
        className="absolute left-2 top-1/2 z-[2] grid size-[34px] -translate-y-1/2 place-items-center rounded-full border border-[#E0E0E0] bg-white"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M6 1L2 5l4 4" stroke="#666" strokeWidth="1.6" />
        </svg>
      </button>

      <div
        ref={trackRef}
        className="no-scrollbar grid grid-flow-col gap-3.5 overflow-x-auto"
        style={{ gridAutoColumns: "minmax(150px, 1fr)" }}
      >
        {CARDS.map((c, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-2 border border-[#E6E6E6] p-3.5"
            style={{ aspectRatio: "0.78 / 1", background: c.bg }}
          >
            <div className="grid size-9 place-items-center rounded-full border-2 border-[#c9a25a] font-serif text-[11px] font-extrabold text-[#a87a30]">
              {c.crest}
            </div>
            <div className="mx-auto h-1.5 w-4/5 bg-[#ecdcb8]" />
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="mx-auto h-[3px] w-[78%] bg-[#e8e2d2]" />
            ))}
            <div className="mt-auto size-6 rounded-full bg-[#c33] opacity-70" />
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="next"
        onClick={() => scrollBy(1)}
        className="absolute right-2 top-1/2 z-[2] grid size-[34px] -translate-y-1/2 place-items-center rounded-full border border-[#E0E0E0] bg-white"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M4 1l4 4-4 4" stroke="#666" strokeWidth="1.6" />
        </svg>
      </button>
      </div>
    </section>
  );
}