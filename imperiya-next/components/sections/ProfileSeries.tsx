"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { PROFILE_SERIES, type ProfileSeries as Series } from "@/data/catalog";

/** Stylised profile cross-section, lightly rotated per card (design look). */
function ProfileArt({ seed, facade }: { seed: number; facade: boolean }) {
  const rot = ((seed % 5) - 2) * 4; // -8..8 deg
  if (facade) {
    return (
      <svg viewBox="0 0 100 105" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
        <g transform={`translate(50 55) rotate(${rot}) translate(-50 -52)`}>
          <rect x="20" y="6" width="60" height="92" fill="#1d1d1d" stroke="#444" />
          <rect x="28" y="14" width="44" height="20" fill="#3a4a5c" />
          <rect x="28" y="40" width="44" height="20" fill="#2a3441" />
          <rect x="28" y="66" width="44" height="24" fill="#1a2230" />
          <path d="M50 6v92" stroke="#444" strokeWidth=".6" />
        </g>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 100 105" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
      <defs>
        <linearGradient id={`pr${seed}`} x1="0" x2="1">
          <stop offset="0" stopColor="#fafafa" />
          <stop offset="1" stopColor="#9e9e9e" />
        </linearGradient>
      </defs>
      <g transform={`translate(50 55) rotate(${rot}) translate(-50 -52)`}>
        <rect x="10" y="14" width="80" height="78" fill={`url(#pr${seed})`} stroke="#222" />
        <rect x="18" y="22" width="64" height="10" fill="#e9e9e9" stroke="#333" strokeWidth=".6" />
        <rect x="18" y="36" width="64" height="10" fill="#dcdcdc" stroke="#333" strokeWidth=".6" />
        <rect x="18" y="50" width="64" height="34" fill="#cfcfcf" stroke="#333" strokeWidth=".6" />
        <rect x="40" y="56" width="20" height="22" fill="#333" />
      </g>
    </svg>
  );
}

function SeriesCard({ item, idx }: { item: Series; idx: number }) {
  const { t } = useTranslation();
  const facade = item.category === "facade";
  return (
    <Link
      href={`/profile/${item.slug}`}
      className="flex flex-col border border-[#1f1f1f] bg-[#171717] transition-colors hover:border-[#3a3a3a]"
    >
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: "1 / 1.05",
          background: "radial-gradient(80% 80% at 50% 60%,#3a3a3a,#0c0c0c)",
        }}
      >
        <ProfileArt seed={idx + 1} facade={facade} />
      </div>
      <div className="px-1.5 pt-3.5 pb-2 text-center text-[11px] font-extrabold uppercase tracking-[0.08em] text-white">
        {item.name}
      </div>
      <span className="mx-3.5 mb-3.5 border border-[#2c2c2c] bg-[#1f1f1f] py-2 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-[#ddd] transition-colors hover:bg-[#262626] hover:text-white">
        {t("profiles.more")}
      </span>
    </Link>
  );
}

export function ProfileSeries() {
  const { t } = useTranslation();
  const pvc = PROFILE_SERIES.filter((p) => p.category === "pvc");
  const facade = PROFILE_SERIES.filter((p) => p.category === "facade");

  return (
    <>
      <section id="profiles" className="scroll-mt-40 bg-ink py-9 text-white">
        <div className="inner">
          <h2 className="m-0 mb-[22px] text-lg font-extrabold uppercase tracking-[0.06em]">
            {t("profiles.title")}
          </h2>
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
            {pvc.map((p, i) => (
              <SeriesCard key={p.slug} item={p} idx={i} />
            ))}
          </div>
        </div>
      </section>

      <section id="facade" className="scroll-mt-40 bg-ink pb-11 text-white">
        <div className="inner">
        <h2 className="m-0 mb-[22px] text-lg font-extrabold uppercase tracking-[0.06em]">
          {t("profiles.categories.facade")}
        </h2>
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
          {facade.map((p, i) => (
            <SeriesCard key={p.slug} item={p} idx={i + 20} />
          ))}
        </div>
        </div>
      </section>
    </>
  );
}