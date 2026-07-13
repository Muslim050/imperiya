"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import { SERVICES, type ServiceKey } from "@/data/catalog";
import { scrollToAnchor, isOnHome } from "@/lib/scrollToAnchor";

/**
 * Maps each service to a photo under `public/services/{key}.jpg`.
 * Drop real client photos there with those exact filenames and they show up.
 * If the file is missing the <img> falls back to a deterministic Picsum
 * placeholder so the tile never looks broken.
 */
const SERVICE_IMG: Record<ServiceKey, string> = {
  facade: "/services/facade.jpg",
  shutters: "/services/shutters.jpg",
  adjustment: "/services/adjustment.png",
  shower: "/services/shower.jpg",
  sliding: "/services/sliding.jpeg",
  pergola: "/services/pergola.jpg",
  gates: "/services/gates.jpg",
  wpc: "/services/wpc.jpg",
};

/* Base tint shown while the photo loads (and if everything fails). */
const BG: Record<ServiceKey, string> = {
  facade: "linear-gradient(180deg,#3a4654 0%,#1a2330 100%)",
  shutters: "linear-gradient(180deg,#5a4233 0%,#1d130a 100%)",
  adjustment: "linear-gradient(180deg,#272727 0%,#0a0a0a 100%)",
  shower: "linear-gradient(180deg,#4b3a32 0%,#16100c 100%)",
  sliding: "linear-gradient(180deg,#3d4a3d 0%,#0e1410 100%)",
  pergola: "linear-gradient(180deg,#4a5b48 0%,#101b14 100%)",
  gates: "linear-gradient(180deg,#3b3b3b 0%,#0d0d0d 100%)",
  wpc: "linear-gradient(180deg,#5a4233 0%,#17100a 100%)",
};

export function Services() {
  const { t } = useTranslation();

  // Clicking a service tile or the "Все услуги" CTA expresses interest →
  // smooth-scroll to the contacts/footer section so the user can call or open
  // the map. On the home page we do it locally; from any other route we let
  // Next navigate and ScrollManager handles the rest.
  const onContactsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isOnHome()) {
      e.preventDefault();
      scrollToAnchor("contacts");
    }
  };

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
              onClick={onContactsClick}
              className="group relative block overflow-hidden rounded-lg text-white shadow-[0_12px_28px_-24px_rgba(15,15,15,.38)] transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-24px_rgba(15,15,15,.45)]"
              style={{ aspectRatio: "1 / 0.95" }}
            >
              {/* tint shown while the image is fetching */}
              <div className="absolute inset-0" style={{ background: BG[s] }} />

              {/* real photo (or placeholder until client photos arrive) */}
              <img
                src={SERVICE_IMG[s]}
                alt={t(`services.items.${s}`)}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  const img = e.currentTarget;
                  if (!img.dataset.fallback) {
                    img.dataset.fallback = "1";
                    img.src = `https://picsum.photos/seed/imperiya-${s}/800/760`;
                  }
                }}
                className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* readability gradient — keeps the label legible on any photo */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg,rgba(0,0,0,0) 35%, rgba(0,0,0,.78) 100%)",
                }}
              />

              <span className="absolute bottom-9 left-3.5 z-[2] grid size-[22px] place-items-center rounded-full bg-white/20 backdrop-blur-sm">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M2 8l6-6M3 2h5v5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                </svg>
              </span>
              <span className="absolute bottom-3 left-3.5 z-[2] pr-3 text-[13px] font-bold drop-shadow">
                {t(`services.items.${s}`)}
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-3.5 flex justify-center">
          <Link
            href="/#contacts"
            onClick={onContactsClick}
            className="rounded-md border border-[#DDD] bg-white px-[26px] py-3 text-[12px] font-bold uppercase tracking-[0.1em] shadow-[0_8px_22px_-20px_rgba(15,15,15,.3)] transition-colors hover:border-orange hover:text-orange"
          >
            {t("services.all")}
          </Link>
        </div>
      </div>
    </section>
  );
}
