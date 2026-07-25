"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useLocalePath } from "@/lib/useLocalePath";
import { STATS } from "@/data/catalog";
import { STAT_ICON } from "./about/statIcons";
import { Logo } from "@/components/Logo";
import { scrollToAnchor, isOnHome } from "@/lib/scrollToAnchor";

/**
 * "О компании" + "Imperiya в цифрах" block. Echoes the imzo.uz "about+stats"
 * pattern (floating brand card overlapping a big factory photo, stat
 * cards underneath) but with our own visual language: sharp edges, orange
 * accent stripe on the card and the photo, ink/white palette instead of
 * imzo's warm pastels.
 *
 * The photo lives under public/about/factory.jpg — if it's missing the
 * panel falls back to a textured gradient placeholder so layout never
 * collapses. Drop the real shot in and it appears.
 */
export function Stats() {
  const { t } = useTranslation();
  const href = useLocalePath();
  const [photoFailed, setPhotoFailed] = useState(false);

  return (
    <section id="about" className="scroll-mt-40 bg-bg py-12 sm:py-16">
      <div className="inner">
        {/* HERO: floating about-card overlapping the factory photo. On
            mobile they stack; from lg up they overlap as in the mockup. */}
        <div className="relative grid gap-5 lg:grid-cols-[1fr_1.45fr] lg:items-center lg:gap-0">
          {/* About card */}
          <div className="relative z-10 rounded-lg border-l-[3px] border-orange bg-white p-6 shadow-[0_16px_36px_-26px_rgba(15,15,15,.26)] sm:p-8 lg:-mr-12 lg:max-w-[420px] lg:p-9">
            <div className="mb-4 flex items-center gap-3">
              <Logo tone="dark" className="scale-90 origin-left" />
            </div>
            <p className="m-0 text-[13px] leading-[1.55] text-[#4a4a4a] sm:text-[14px]">
              {t("about.text")}
            </p>
            <Link
              href={href("/#contacts")}
              onClick={(e) => {
                if (isOnHome()) {
                  e.preventDefault();
                  scrollToAnchor("contacts");
                }
              }}
              className="group mt-5 inline-flex items-center gap-2 rounded-md bg-ink px-5 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-orange"
            >
              {t("about.more")}
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              >
                <path d="M2 10L10 2M4 2h6v6" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </Link>
          </div>

          {/* Hero photo */}
          <div className="relative">
            <div className="absolute -top-[3px] left-0 z-10 h-[3px] w-24 bg-orange sm:w-32" />
            <div className="aspect-[16/10] w-full overflow-hidden rounded-lg bg-[linear-gradient(135deg,#c8d8e3_0%,#8fa4b3_60%,#5d7283_100%)] shadow-[0_16px_36px_-28px_rgba(15,15,15,.32)]">
              {!photoFailed && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="/about/factory.jpg"
                  alt={t("about.title")}
                  loading="lazy"
                  decoding="async"
                  onError={() => setPhotoFailed(true)}
                  className="size-full object-cover"
                />
              )}
              {photoFailed && (
                <div className="grid size-full place-items-center text-center text-white/80">
                  <div className="px-6">
                    <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-white/15 backdrop-blur-sm">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M3 21V8l9-5 9 5v13M9 21v-8h6v8"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p className="text-[13px] font-semibold">
                      {t("about.photoFallback")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <h3 className="m-0 mt-10 mb-5 text-[13px] font-extrabold uppercase tracking-[0.14em] text-[#7a7a7a] sm:mt-14 sm:mb-6">
          {t("stats.title")}
        </h3>
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
          {STATS.map((s) => (
            <div
              key={s.key}
              className="group relative flex items-start justify-between gap-3 rounded-lg border border-[#ECECEC] bg-white p-5 shadow-[0_10px_28px_-26px_rgba(15,15,15,.3)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[#D8D8D8] hover:shadow-[0_14px_30px_-24px_rgba(15,15,15,.34)]"
            >
              <div className="min-w-0">
                <p className="m-0 text-[26px] font-extrabold leading-none tracking-tight text-ink sm:text-[30px]">
                  {s.value}
                </p>
                <p className="m-0 mt-2 text-[11px] leading-[1.35] text-[#6e6e6e] sm:text-[12px]">
                  {t(`stats.${s.key}`)}
                </p>
              </div>
              <span className="shrink-0 text-orange/35 transition-colors group-hover:text-orange [&>svg]:size-10 sm:[&>svg]:size-12">
                {STAT_ICON[s.key]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
