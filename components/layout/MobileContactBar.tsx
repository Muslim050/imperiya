"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useLocalePath } from "@/lib/useLocalePath";
import { Phone } from "@/components/ui/icons";
import { CONTACTS } from "@/data/catalog";
import { isOnHome, scrollToAnchor } from "@/lib/scrollToAnchor";

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-5" fill="currentColor">
      <path d="M21.7 3.2 18.5 19c-.2 1.1-.9 1.4-1.8.9l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9-8.1c.4-.4-.1-.6-.6-.2L6.1 12.8 1.3 11.3c-1-.3-1.1-1 .2-1.5L20.1 2.6c.9-.3 1.8.2 1.6.6Z" />
    </svg>
  );
}

function CalculatorIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="5" y="3" width="14" height="18" rx="1" />
      <path d="M8 7h8M8 11h2m4 0h2m-8 4h2m4 0h2m-8 4h2m4 0h2" strokeLinecap="round" />
    </svg>
  );
}

export function MobileContactBar() {
  const { t } = useTranslation();
  const href = useLocalePath();

  return (
    <nav
      aria-label={t("mobileBar.label")}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-white/95 px-2 pt-2 pb-[max(8px,env(safe-area-inset-bottom))] shadow-[0_-10px_30px_-18px_rgba(0,0,0,.35)] backdrop-blur-xl lg:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-[1fr_1fr_1.35fr] gap-1.5">
        <a
          href={CONTACTS.phoneHref}
          className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-md text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2 active:bg-bg"
        >
          <Phone className="size-5 text-orange" />
          {t("mobileBar.call")}
        </a>
        <a
          href={CONTACTS.telegramHref}
          target="_blank"
          rel="noreferrer"
          className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-md text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2 active:bg-bg"
        >
          <span className="text-[#229ED9]"><TelegramIcon /></span>
          {t("mobileBar.telegram")}
        </a>
        <Link
          href={href("/#calculator")}
          onClick={(event) => {
            if (isOnHome()) {
              event.preventDefault();
              scrollToAnchor("calculator");
            }
          }}
          className="flex min-h-12 items-center justify-center gap-1.5 rounded-md bg-orange px-3 text-[10px] font-extrabold uppercase tracking-[0.05em] text-white active:bg-orange-d"
        >
          <CalculatorIcon />
          {t("mobileBar.calculate")}
        </Link>
      </div>
    </nav>
  );
}
