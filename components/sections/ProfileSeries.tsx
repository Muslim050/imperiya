"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useLocalePath } from "@/lib/useLocalePath";
import { PROFILE_SERIES, type ProfileSeries as Series } from "@/data/catalog";

function SeriesCard({ item }: { item: Series }) {
  const { t } = useTranslation();
  const href = useLocalePath();
  return (
    <Link
      href={href(`/profile/${item.slug}`)}
      className="group flex flex-col overflow-hidden rounded-lg border border-[#2a2a2a] bg-[#171717] shadow-[0_12px_28px_-24px_rgba(0,0,0,.75)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[#414141] hover:shadow-[0_16px_32px_-24px_rgba(0,0,0,.85)]"
    >
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: "1 / 1.05",
          background: "radial-gradient(80% 80% at 50% 60%,#3a3a3a,#0c0c0c)",
        }}
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            /* The column count rises with the viewport (2→3→4→6→7 inside a
               1280px container), so the card itself stays 150–185px wide at
               every breakpoint — a flat cap beats a vw guess here. */
            sizes="185px"
            className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          /* Series without an artwork file yet — show the wordmark on the
           * gradient instead of a broken icon. */
          <span className="absolute inset-0 grid place-items-center text-center text-[12px] font-bold uppercase tracking-[0.12em] text-white/40">
            {item.name}
          </span>
        )}
      </div>
      <div className="px-1.5 pt-3.5 pb-2 text-center text-[11px] font-extrabold uppercase tracking-[0.08em] text-white">
        {item.name}
      </div>
      <span className="mx-3.5 mb-3.5 rounded-md border border-[#333] bg-[#1f1f1f] py-2 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-[#ddd] transition-colors group-hover:bg-[#262626] group-hover:text-white">
        {t("profiles.more")}
      </span>
    </Link>
  );
}

export function ProfileSeries() {
  const { t } = useTranslation();
  return (
    <section
      id="profiles"
      className="scroll-mt-40 bg-ink py-9 pb-11 text-white"
    >
      <div className="inner">
        <h2 className="m-0 mb-[22px] text-lg font-extrabold uppercase tracking-[0.06em]">
          {t("profiles.title")}
        </h2>
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
          {PROFILE_SERIES.map((p) => (
            <SeriesCard key={p.slug} item={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
