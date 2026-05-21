"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { WindowMark } from "@/components/ui/icons";

/**
 * Logo per the TZ: open-window line icon, name "Imperiya",
 * subtitle "проверенный партнёр" + Akfa. Visual layout matches the
 * precise design's 3-line brand-text block.
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
        className="grid size-[46px] shrink-0 place-items-center border text-white"
        style={{
          borderColor: "#D7B98A",
          background:
            "linear-gradient(180deg,#E9D2A6 0%,#C49A55 60%,#8D6A2E 100%)",
        }}
      >
        <WindowMark className="size-7 text-white/95" />
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
              "mt-[5px] flex items-center gap-1.5 text-[10px]",
              light ? "text-white/55" : "text-[#666]",
            )}
          >
            {t("brand.partner")}
            <b className="text-[12px] font-extrabold tracking-[0.05em] text-orange-d">
              akfa
            </b>
          </span>
        )}
      </span>
    </Link>
  );
}