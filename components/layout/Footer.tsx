"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { OpenIndicator } from "@/components/ui/OpenIndicator";
import { ChevronRight } from "@/components/ui/icons";
import { CONTACTS, SOCIALS } from "@/data/catalog";
import { scrollToAnchor, isOnHome } from "@/lib/scrollToAnchor";

const mapUrl = `https://yandex.uz/maps/?text=${encodeURIComponent(CONTACTS.mapQuery)}`;

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="size-4 shrink-0">
    <path
      d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);
const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="size-4 shrink-0">
    <path
      d="M12 22s-8-7.58-8-13a8 8 0 1116 0c0 5.42-8 13-8 13z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2" />
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="size-4 shrink-0">
    <rect x="2" y="4" width="20" height="16" stroke="currentColor" strokeWidth="2" />
    <path d="M2 6l10 7 10-7" stroke="currentColor" strokeWidth="2" />
  </svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="size-4 shrink-0">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const SOC_ICON: Record<string, React.ReactNode> = {
  telegram: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.9 4.3l-2.9 14c-.2 1-.8 1.2-1.6.7l-4.4-3.3-2.1 2c-.2.2-.4.4-.9.4l.3-4.5L18.6 6c.4-.3-.1-.5-.6-.2L8.4 11.6 4.1 10.2c-.9-.3-1-1 .2-1.5l16.7-6.5c.8-.3 1.5.2 1.2 1.6z" />
    </svg>
  ),
  instagram: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  ),
  youtube: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23 12s0-4-.5-5.6c-.3-.9-1-1.6-1.9-1.9C19 4 12 4 12 4s-7 0-8.6.5c-.9.3-1.6 1-1.9 1.9C1 8 1 12 1 12s0 4 .5 5.6c.3.9 1 1.6 1.9 1.9C5 20 12 20 12 20s7 0 8.6-.5c.9-.3 1.6-1 1.9-1.9.5-1.6.5-5.6.5-5.6zM10 15V9l5 3-5 3z" />
    </svg>
  ),
};

/** Icon-on-a-disc row used in the contacts column. */
function ContactRow({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-white/[0.06] text-orange transition-colors">
        {icon}
      </span>
      <div className="text-[13px] leading-[1.45] text-[#cfcfcf]">{children}</div>
    </div>
  );
}

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer id="contacts" className="scroll-mt-40">
      {/* Pre-footer CTA band */}
      <div
        className="relative overflow-hidden border-t border-white/5 bg-ink"
        style={{
          backgroundImage:
            "radial-gradient(110% 80% at 100% 0%, rgba(243,147,34,0.12) 0%, rgba(243,147,34,0) 55%)",
        }}
      >
        <div className="inner flex flex-col items-start justify-between gap-6 py-10 md:flex-row md:items-center">
          <div>
            <h3 className="m-0 max-w-[640px] text-[22px] font-extrabold uppercase leading-[1.15] tracking-[0.01em] text-white sm:text-[26px]">
              {t("footer.ctaTitle")}
            </h3>
            <p className="mt-2 max-w-[520px] text-[13px] text-white/55">
              {t("footer.ctaSub")}
            </p>
          </div>
          <Link
            href="/#calculator"
            onClick={(e) => {
              if (isOnHome()) {
                e.preventDefault();
                scrollToAnchor("calculator");
              }
            }}
            className="group inline-flex items-center gap-2 bg-orange px-7 py-4 text-[13px] font-bold uppercase tracking-[0.06em] text-white transition-all duration-200 hover:bg-orange-d hover:shadow-[0_12px_28px_-10px_rgba(243,147,34,.55)]"
          >
            {t("topbar.cta")}
            <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* Main footer body. The subtle vertical lines echo the hero's window
          mullions, tying the top and bottom of the page together. */}
      <div
        className="relative bg-ink text-[#bdbdbd]"
        style={{
          backgroundImage: [
            "radial-gradient(80% 50% at 0% 100%, rgba(255,255,255,0.03) 0%, transparent 60%)",
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 96px)",
          ].join(","),
        }}
      >
        <div className="inner">
          {/* "Меню" column intentionally removed per the TZ */}
          <div className="grid gap-10 border-t border-white/10 py-14 md:grid-cols-[1.2fr_1fr_0.8fr]">
            {/* Brand + tagline */}
            <div>
              <Logo tone="light" />
              <p className="mt-5 max-w-[320px] text-[13px] leading-[1.6] text-white/55">
                {t("footer.aboutTagline")}
              </p>
              <div className="mt-5 inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-white/55">
                <span className="inline-flex items-center gap-2">
                  <ClockIcon />
                  {t("footer.schedule")}
                </span>
                <OpenIndicator tone="light" />
              </div>
            </div>

            {/* Contacts */}
            <div>
              <h4 className="relative m-0 mb-6 text-[11px] font-extrabold uppercase tracking-[0.16em] text-white">
                {t("footer.contacts")}
                <span className="absolute -bottom-2 left-0 h-[2px] w-8 bg-orange" />
              </h4>
              <div className="space-y-4">
                <ContactRow icon={<PhoneIcon />}>
                  <a
                    href={CONTACTS.phoneHref}
                    className="block text-[15px] font-semibold text-white transition-colors hover:text-orange"
                  >
                    {CONTACTS.phone}
                  </a>
                </ContactRow>
                <ContactRow icon={<MailIcon />}>
                  <span className="text-white/45">{t("footer.emailSoon")}</span>
                </ContactRow>
                <ContactRow icon={<PinIcon />}>
                  <span className="block">{t("footer.address")}</span>
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-[12px] text-orange hover:underline"
                  >
                    {t("footer.showMap")}
                    <ChevronRight className="size-3" />
                  </a>
                </ContactRow>
              </div>
            </div>

            {/* Socials */}
            <div>
              <h4 className="relative m-0 mb-6 text-[11px] font-extrabold uppercase tracking-[0.16em] text-white">
                {t("footer.social")}
                <span className="absolute -bottom-2 left-0 h-[2px] w-8 bg-orange" />
              </h4>
              <div className="flex gap-3">
                {SOCIALS.map((s) => (
                  <a
                    key={s.key}
                    href={s.href}
                    aria-label={s.key}
                    className="grid size-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/75 transition-all duration-200 hover:-translate-y-0.5 hover:border-orange hover:bg-orange hover:text-white hover:shadow-[0_8px_18px_-8px_rgba(243,147,34,.5)]"
                  >
                    {SOC_ICON[s.key]}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse items-start justify-between gap-3 border-t border-white/10 py-5 text-[12px] text-white/45 md:flex-row md:items-center">
            <span>
              © {year} {t("brand.factory")} {t("brand.name")}. {t("footer.rights")}
            </span>
            <span className="flex items-center gap-1.5 text-white/35">
              <span className="inline-block size-1.5 rounded-full bg-orange" />
              {CONTACTS.phone}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}