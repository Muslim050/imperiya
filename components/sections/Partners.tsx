"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PARTNERS, type Partner } from "@/data/catalog";

/**
 * One partner card — real logo with a wordmark fallback if the file is
 * missing. Card width is fixed so the marquee track length is predictable.
 */
function PartnerCard({ partner }: { partner: Partner }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="grid h-[88px] w-[180px] shrink-0 place-items-center rounded-lg border border-[#ECECEC] bg-white px-4 shadow-[0_10px_26px_-24px_rgba(15,15,15,.28)]">
      {failed ? (
        <span className="text-[17px] font-extrabold uppercase tracking-tight text-[#555]">
          {partner.name}
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={partner.logo}
          alt={partner.name}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="max-h-[56px] max-w-[150px] object-contain"
        />
      )}
    </div>
  );
}

/**
 * Partners block per the TZ — endless marquee carousel. The track holds
 * two copies of the list so the -50% translation loops without a visible
 * jump. Hovering pauses the animation; edge mask softens the entry/exit.
 */
export function Partners() {
  const { t } = useTranslation();
  // Duplicate the list to make the loop seamless under translateX(-50%).
  const loop = [...PARTNERS, ...PARTNERS];

  return (
    <section className="scroll-mt-40 bg-bg py-9">
      <div className="inner">
        <h2 className="m-0 mb-[18px] text-lg font-extrabold uppercase tracking-[0.06em]">
          {t("partners.title")}
        </h2>

        <div
          className="group relative overflow-hidden"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0, black 48px, black calc(100% - 48px), transparent 100%)",
            maskImage:
              "linear-gradient(to right, transparent 0, black 48px, black calc(100% - 48px), transparent 100%)",
          }}
        >
          <div
            className="flex w-max gap-3.5 animate-[marquee_32s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none"
            aria-hidden={false}
          >
            {loop.map((p, i) => (
              <PartnerCard key={`${p.slug}-${i}`} partner={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
