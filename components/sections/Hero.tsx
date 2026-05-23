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
      <div className="inner !px-0">
      <div className="grid min-h-[430px] lg:grid-cols-[480px_1fr]">
        {/* LEFT */}
        <div className="relative z-[2] px-5 py-12 sm:px-8 lg:py-[54px] lg:pr-0 lg:pl-10">
          <h1 className="m-0 mb-[18px] text-[40px] font-extrabold uppercase leading-none tracking-[-0.01em] sm:text-[48px]">
            {t("hero.title1")}
            <span className="block text-orange">{t("hero.title2")}</span>
          </h1>
          <p className="mb-[22px] max-w-[380px] text-[15px] leading-[1.45] text-[#cfcfcf]">
            {t("hero.subtitle")}
          </p>

          <div className="mb-[26px] flex items-center gap-[22px]">
            <span className="inline-flex items-center bg-white px-3 py-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brands/engelberg.png"
                alt="Engelberg"
                loading="lazy"
                decoding="async"
                className="h-7 w-auto object-contain"
              />
            </span>
            {/* THERMO — wordmark only, no icon per the TZ */}
            <span className="text-[13px] font-bold tracking-[0.04em]">
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
              className="inline-flex items-center justify-center bg-orange px-[22px] py-3.5 text-[13px] font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-orange-d"
            >
              {t("hero.ctaCalc")}
            </Link>
            <Link
              href="/#contacts"
              onClick={onAnchorClick("contacts")}
              className="inline-flex items-center justify-center border border-white/35 px-[22px] py-3.5 text-[13px] font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-white/10"
            >
              {t("hero.ctaConsult")}
            </Link>
          </div>
        </div>

        {/* RIGHT — window view scene */}
        <div className="relative min-h-[260px]">
          <svg
            className="absolute inset-0 z-[1] h-full w-full"
            preserveAspectRatio="xMidYMid slice"
            viewBox="0 0 800 430"
          >
            <defs>
              <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#dfe8ef" />
                <stop offset=".55" stopColor="#bcc6cf" />
                <stop offset="1" stopColor="#8e9aa5" />
              </linearGradient>
              <linearGradient id="m1" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#6a7a86" />
                <stop offset="1" stopColor="#2b333b" />
              </linearGradient>
              <linearGradient id="m2" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#4d5b67" />
                <stop offset="1" stopColor="#1d242b" />
              </linearGradient>
              <linearGradient id="water" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#3b4956" />
                <stop offset="1" stopColor="#0e1217" />
              </linearGradient>
            </defs>
            <rect width="800" height="430" fill="url(#sky)" />
            <path
              d="M0 220 L80 170 L160 200 L240 150 L330 195 L420 160 L520 200 L620 165 L720 195 L800 175 L800 270 L0 270 Z"
              fill="url(#m1)"
              opacity=".9"
            />
            <path
              d="M0 250 L70 215 L160 250 L260 200 L360 245 L460 215 L570 250 L680 220 L800 240 L800 300 L0 300 Z"
              fill="url(#m2)"
            />
            <path
              d="M0 285 Q 60 270 120 285 T 240 285 T 360 285 T 480 285 T 600 285 T 720 285 T 840 285 L840 320 L0 320 Z"
              fill="#142019"
            />
            <g fill="#0e1813">
              <path d="M120 285 l8 -28 l8 28 z" />
              <path d="M160 287 l10 -34 l10 34 z" />
              <path d="M210 286 l9 -30 l9 30 z" />
              <path d="M280 286 l11 -38 l11 38 z" />
              <path d="M340 285 l8 -26 l8 26 z" />
              <path d="M410 286 l10 -32 l10 32 z" />
              <path d="M470 285 l9 -30 l9 30 z" />
              <path d="M540 286 l11 -36 l11 36 z" />
              <path d="M610 285 l8 -28 l8 28 z" />
              <path d="M680 286 l10 -34 l10 34 z" />
            </g>
            <rect x="0" y="310" width="800" height="40" fill="url(#water)" />
          </svg>

          {/* photo tone + left fade into the dark panel */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(80% 70% at 80% 100%, rgba(20,12,4,0) 0%, rgba(0,0,0,.55) 100%), linear-gradient(180deg,rgba(58,74,92,0) 0%, rgba(36,51,69,.2) 70%, rgba(15,22,32,.5) 100%)",
            }}
          />
          <div
            className="absolute inset-0 z-[2] hidden lg:block"
            style={{
              background:
                "linear-gradient(90deg, rgba(11,11,11,1) 0%, rgba(11,11,11,.55) 22%, rgba(11,11,11,0) 38%)",
            }}
          />

          {/* window mullions */}
          <div className="absolute inset-0 z-[3] grid grid-cols-8 pointer-events-none">
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className={i === 0 ? "" : "border-l border-black/50"}
                style={{ boxShadow: "inset 1px 0 0 rgba(255,255,255,.04)" }}
              />
            ))}
          </div>

          {/* interior */}
          <div className="absolute inset-x-0 bottom-0 z-[4] h-[48%] pointer-events-none">
            <div
              className="absolute inset-x-0 bottom-0 h-[38%]"
              style={{ background: "linear-gradient(180deg,#1c140c 0%,#0a0805 100%)" }}
            />
            <div
              className="absolute bottom-[24%] left-[38%] h-[30%] w-[3%]"
              style={{ background: "linear-gradient(180deg,#c6a574,#5e4a2c)" }}
            />
            <div
              className="absolute bottom-[14%] left-[46%] right-[8%] h-[50%] rounded-[6px_6px_4px_4px]"
              style={{
                background: "linear-gradient(180deg,#5c4836 0%,#3a2c1f 100%)",
                boxShadow: "0 -8px 18px rgba(0,0,0,.5)",
              }}
            />
            <div className="absolute bottom-[46%] left-[50%] h-[32%] w-[8%] rounded-[4px] bg-[#b89875]" />
            <div className="absolute bottom-[46%] left-[60%] h-[32%] w-[8%] rounded-[4px] bg-[#947458]" />
            <div
              className="absolute bottom-[18%] left-[84%] h-[46%] w-[7%]"
              style={{
                background:
                  "radial-gradient(circle at 50% 30%,#2d4a2a 0%,#16261a 70%,transparent 72%)",
              }}
            />
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}