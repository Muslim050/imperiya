"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PARTNERS, type Partner } from "@/data/catalog";

/**
 * One partner card — renders the real logo from public/partners/. If the
 * file is missing (or fails to load) the card gracefully falls back to a
 * wordmark so the grid never shows a broken image.
 */
function PartnerCard({ partner }: { partner: Partner }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="grid h-[88px] place-items-center border border-[#ECECEC] bg-white px-4">
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

/** Partners block per the TZ. Real logos under public/partners/. */
export function Partners() {
  const { t } = useTranslation();
  return (
    <section className="scroll-mt-40 bg-bg py-9">
      <div className="inner">
        <h2 className="m-0 mb-[18px] text-lg font-extrabold uppercase tracking-[0.06em]">
          {t("partners.title")}
        </h2>
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4 lg:grid-cols-7">
          {PARTNERS.map((p) => (
            <PartnerCard key={p.slug} partner={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
