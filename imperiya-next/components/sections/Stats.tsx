"use client";

import { useTranslation } from "react-i18next";
import { STATS } from "@/data/catalog";

/** "Imperiya в цифрах" — a block requested in the TZ (not in the mockup). */
export function Stats() {
  const { t } = useTranslation();
  return (
    <section id="about" className="scroll-mt-40 bg-ink py-11 text-white">
      <div className="inner">
        <h2 className="m-0 mb-9 text-center text-lg font-extrabold uppercase tracking-[0.06em]">
          {t("stats.title")}
        </h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-3 lg:grid-cols-5">
          {STATS.map((s) => (
            <div key={s.key} className="text-center">
              <p className="m-0 text-[34px] font-extrabold leading-none text-orange">
                {s.value}
              </p>
              <p className="mx-auto mt-2.5 max-w-[150px] text-[12px] leading-[1.35] text-[#9a9a9a]">
                {t(`stats.${s.key}`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}