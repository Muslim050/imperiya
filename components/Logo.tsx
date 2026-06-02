"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { WindowMark } from "@/components/ui/icons";

/**
 * Brand logo: open-window line icon + "Imperiya" wordmark + a small
 * "проверенный партнёр akfa" badge using the real Akfa partner mark
 * loaded from public/partners/akfa.png. Used in the header and the footer.
 */
export function Logo({
  className,
  tone = "dark",
  compact = false,
}: {
  className?: string;
  tone?: "dark" | "light";
  compact?: boolean;
}) {
  const { t } = useTranslation();
  const light = tone === "light";

  return (
    <Link
      href="/"
      aria-label="IMPERIYA"
      className={cn("flex items-center gap-3", className)}
    >
      <span
        className={cn(
          "grid size-[46px] shrink-0 place-items-center border",
          light
            ? "border-white/30 text-white"
            : "border-[#1a1a1a] text-ink-2",
        )}
      >
        <WindowMark className="size-7" />
      </span>
      <span className="leading-none">
        <span
          className={cn(
            "block text-[11px] tracking-[0.02em]",
            light ? "text-white/70" : "text-ink-2",
          )}
        >
          {t("brand.factory")}
        </span>
        <span
          className={cn(
            "mt-0.5 block text-[24px] font-extrabold tracking-[0.04em]",
            light ? "text-white" : "text-ink-2",
          )}
        >
          {t("brand.name")}
        </span>
        {!compact && (
          <span
            className={cn(
              "mt-1 flex items-center gap-1.5 text-[10px]",
              light ? "text-white/65" : "text-[#666]",
            )}
          >
            {t("brand.partner")}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/partners/akfa.png"
              alt="Akfa"
              loading="lazy"
              decoding="async"
              className="h-[25px] w-auto object-contain"
            />
          </span>
        )}
      </span>
    </Link>
  );
}
