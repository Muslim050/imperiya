"use client";

import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CERTIFICATES, type Certificate } from "@/data/catalog";

/**
 * Certificates strip — horizontal carousel of real cert scans pulled from
 * AKFA Steel (the parent brand Imperiya is an authorised partner of).
 * Tap any card to open the full-size image in a lightbox modal.
 */
export function Certificates() {
  const { t } = useTranslation();
  const trackRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<Certificate | null>(null);

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
          className="absolute left-2 top-1/2 z-[2] hidden size-[34px] -translate-y-1/2 place-items-center rounded-full border border-[#E0E0E0] bg-white shadow-sm hover:border-orange md:grid"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M6 1L2 5l4 4" stroke="#666" strokeWidth="1.6" />
          </svg>
        </button>

        <div
          ref={trackRef}
          className="grid grid-flow-col gap-3.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ gridAutoColumns: "minmax(180px, 220px)" }}
        >
          {CERTIFICATES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setLightbox(c)}
              className="group flex flex-col items-stretch gap-2 border border-[#E6E6E6] bg-white p-3 text-left transition-shadow hover:shadow-[0_12px_28px_-12px_rgba(0,0,0,.18)]"
            >
              <div className="overflow-hidden bg-[#f7f5ef]" style={{ aspectRatio: "0.78 / 1" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.img}
                  alt={t(`certificates.items.${c.titleKey}`)}
                  loading="lazy"
                  decoding="async"
                  className="block size-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
              <span className="line-clamp-2 text-[11px] font-semibold leading-tight text-[#444] group-hover:text-orange">
                {t(`certificates.items.${c.titleKey}`)}
              </span>
            </button>
          ))}
        </div>

        <button
          type="button"
          aria-label="next"
          onClick={() => scrollBy(1)}
          className="absolute right-2 top-1/2 z-[2] hidden size-[34px] -translate-y-1/2 place-items-center rounded-full border border-[#E0E0E0] bg-white shadow-sm hover:border-orange md:grid"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M4 1l4 4-4 4" stroke="#666" strokeWidth="1.6" />
          </svg>
        </button>
      </div>

      {/* Lightbox modal */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[80] grid place-items-center bg-black/80 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-full max-w-[min(900px,100%)]"
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label="close"
              className="absolute -right-2 -top-12 grid size-9 place-items-center bg-white text-ink-2 transition-colors hover:bg-orange hover:text-white sm:-right-12 sm:top-0"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox.img}
              alt={t(`certificates.items.${lightbox.titleKey}`)}
              className="block max-h-[85vh] w-auto bg-white object-contain"
            />
            <p className="mt-2 text-center text-[12px] font-semibold text-white">
              {t(`certificates.items.${lightbox.titleKey}`)}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
