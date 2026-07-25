"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import { scrollToAnchor, isOnHome } from "@/lib/scrollToAnchor";

/* USP icons straight from the design markup */
const UspClock = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
    <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
const UspShield = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 2l9 4v6c0 5-3.5 9-9 10-5.5-1-9-5-9-10V6l9-4z" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);
const UspFactory = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="7" width="18" height="13" rx="1" stroke="currentColor" strokeWidth="1.6" />
    <path d="M8 7V4h8v3" stroke="currentColor" strokeWidth="1.6" />
    <path d="M3 12h18" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);
const UspWrench = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M14.7 6.3a4 4 0 00-5.4 5.4l-7 7 2.6 2.6 7-7a4 4 0 005.4-5.4l-2.5 2.5-2.1-2.1 2.5-2.5z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
);

const FEATURES = [
  { key: "years", Icon: UspClock },
  { key: "warranty", Icon: UspShield },
  { key: "production", Icon: UspFactory },
  { key: "turnkey", Icon: UspWrench },
] as const;

export function Hero() {
  const { t } = useTranslation();

  // Same-page anchor CTAs scroll explicitly so the sticky-header offset is
  // respected and we don't depend on Next's same-path hash navigation.
  const onAnchorClick =
    (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (isOnHome()) {
        e.preventDefault();
        scrollToAnchor(id);
      }
    };

  return (
    <section className="relative overflow-hidden bg-night text-white">
      {/* Engelberg banner on the right ~65%. On desktop it's shown in full
          (object-contain) so it's never cropped; the black letterbox blends into
          the night background. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero/engelberg.jpg"
        alt="Панорамные окна Engelberg от фабрики IMPERIYA"
        loading="eager"
        fetchPriority="high"
        decoding="async"
        onError={(e) => {
          // tolerate a .png source; if neither exists, fall back to the dark panel
          const img = e.currentTarget;
          if (!img.dataset.fallback) {
            img.dataset.fallback = "1";
            img.src = "/hero/engelberg.png";
          } else {
            img.style.display = "none";
          }
        }}
        className="absolute inset-y-0 right-0 z-0 h-full w-full object-cover object-center lg:w-[70%] lg:object-contain lg:object-right"
      />

      {/* Darkened background behind the text (left zone) so it reads on its own
          panel, then fades to fully clear before the window so the photo's right
          side stays untouched. */}
      <div
        className="absolute inset-0 z-[1] hidden lg:block"
        style={{
          background:
            "linear-gradient(90deg, rgba(11,11,11,.95) 0%, rgba(11,11,11,.93) 32%, rgba(11,11,11,.72) 42%, rgba(11,11,11,.32) 54%, rgba(11,11,11,.08) 62%, rgba(11,11,11,0) 70%)",
        }}
      />
      {/* below lg the photo is full-bleed behind the text, so darken the left
          block here too (horizontal), keeping the right side with the window lighter */}
      <div
        className="absolute inset-0 z-[1] lg:hidden"
        style={{
          background:
            "linear-gradient(90deg, rgba(11,11,11,.96) 0%, rgba(11,11,11,.9) 44%, rgba(11,11,11,.68) 64%, rgba(11,11,11,.32) 82%, rgba(11,11,11,.12) 100%)",
        }}
      />

      <div className="inner relative z-[2]">
        <div className="flex min-h-[460px] max-w-[520px] flex-col justify-center py-14 lg:min-h-[520px] lg:max-w-[420px] lg:py-[72px]">
          <h1 className="m-0 mb-[18px] text-[40px] font-extrabold uppercase leading-none tracking-[-0.01em] sm:text-[48px]">
            {t("hero.title1")}
            <span className="block text-orange">{t("hero.title2")}</span>
          </h1>
          <p className="mb-[22px] max-w-[380px] text-[15px] leading-[1.45] text-[#dcdcdc]">
            {t("hero.subtitle")}
          </p>

          <div className="mb-[26px] flex items-center gap-[22px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brands/engelberg.png"
              alt="Engelberg"
              loading="lazy"
              decoding="async"
              className="h-12 w-auto object-contain"
            />
            {/* THERMO — wordmark only, no icon per the TZ */}
            <span className="text-[25px] font-bold tracking-[0.04em]">
              THERMO
            </span>
          </div>

          <div className="mb-[26px] grid max-w-[440px] grid-cols-2 gap-[18px] sm:grid-cols-4">
            {FEATURES.map(({ key, Icon }) => (
              <div key={key} className="flex flex-col items-start gap-2">
                <span className="grid size-7 place-items-center text-orange">
                  <Icon />
                </span>
                <span className="whitespace-pre-line text-[11px] font-semibold leading-[1.25]">
                  {t(`hero.features.${key}`)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/#calculator"
              onClick={onAnchorClick("calculator")}
              className="inline-flex items-center justify-center rounded-md bg-orange px-[22px] py-3.5 text-[13px] font-bold uppercase tracking-[0.06em] text-white shadow-[0_8px_20px_-16px_rgba(0,0,0,.48)] transition-colors hover:bg-orange-d"
            >
              {t("hero.ctaCalc")}
            </Link>
            <Link
              href="/#contacts"
              onClick={onAnchorClick("contacts")}
              className="inline-flex items-center justify-center rounded-md border border-white/35 px-[22px] py-3.5 text-[13px] font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-white/10"
            >
              {t("hero.ctaConsult")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
