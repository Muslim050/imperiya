"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import { SERVICES, type ServiceKey } from "@/data/catalog";

/* Gradient placeholders echoing the design's .sbg1..6 tiles */
const BG: Record<ServiceKey, string> = {
  facade: "linear-gradient(180deg,#3a4654 0%,#1a2330 100%)",
  shutters: "linear-gradient(180deg,#5a4233 0%,#1d130a 100%)",
  adjustment: "linear-gradient(180deg,#272727 0%,#0a0a0a 100%)",
  shower: "linear-gradient(180deg,#4b3a32 0%,#16100c 100%)",
  sliding: "linear-gradient(180deg,#3d4a3d 0%,#0e1410 100%)",
  pergola: "linear-gradient(180deg,#2f3a45 0%,#0b1019 100%)",
  gates: "linear-gradient(180deg,#3a4654 0%,#11161d 100%)",
  wpc: "linear-gradient(180deg,#5a4233 0%,#17100a 100%)",
};

export function Services() {
  const { t } = useTranslation();
  return (
    <section id="services" className="scroll-mt-40 bg-bg pt-[18px] pb-8">
      <div className="inner">
      <h2 className="m-0 mb-4 text-lg font-extrabold uppercase tracking-[0.06em]">
        {t("services.title")}
      </h2>
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
        {SERVICES.map((s) => (
          <Link
            key={s}
            href="/#contacts"
            className="group relative block overflow-hidden text-white"
            style={{ aspectRatio: "1 / 0.95" }}
          >
            <div className="absolute inset-0" style={{ background: BG[s] }} />
            <div
              className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
              style={{
                background:
                  "repeating-linear-gradient(135deg, rgba(255,255,255,.03) 0 14px, rgba(0,0,0,.04) 14px 28px)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg,rgba(0,0,0,0) 35%, rgba(0,0,0,.7) 100%)",
              }}
            />
            <span className="absolute bottom-9 left-3.5 z-[2] grid size-[22px] place-items-center rounded-full bg-white/20">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 8l6-6M3 2h5v5" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </span>
            <span className="absolute bottom-3 left-3.5 z-[2] pr-3 text-[13px] font-bold">
              {t(`services.items.${s}`)}
            </span>
          </Link>
        ))}
      </div>
      <div className="mt-3.5 flex justify-center">
        <Link
          href="/#contacts"
          className="border border-[#DDD] bg-white px-[26px] py-3 text-[12px] font-bold uppercase tracking-[0.1em] transition-colors hover:border-orange hover:text-orange"
        >
          {t("services.all")}
        </Link>
      </div>
      </div>
    </section>
  );
}