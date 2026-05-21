"use client";

import { useTranslation } from "react-i18next";
import { PARTNERS } from "@/data/catalog";

/** Partners block per the TZ. Wordmarks now; vector logos to be swapped in. */
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
            <div
              key={p}
              className="grid h-[88px] place-items-center border border-[#ECECEC] bg-white px-4"
            >
              <span className="text-[17px] font-extrabold uppercase tracking-tight text-[#555]">
                {p}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}