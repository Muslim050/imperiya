"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

/** Returns true when the shop is currently open (9:00 — 20:00, local time). */
function getIsOpenNow(): boolean {
  const h = new Date().getHours();
  return h >= 9 && h < 20;
}

/** Live "Open / Closed now" pill with a pulsing status dot. */
export function OpenIndicator({
  className,
  tone = "dark",
  size = "sm",
}: {
  className?: string;
  tone?: "dark" | "light";
  size?: "xs" | "sm";
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(getIsOpenNow);

  // Refresh once a minute so the indicator flips at 9:00 / 20:00 without a reload.
  useEffect(() => {
    const id = window.setInterval(() => setOpen(getIsOpenNow()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const dotColor = open ? "bg-[#19c37d]" : "bg-[#9a9a9a]";
  const textTone = tone === "light"
    ? open
      ? "text-white/85"
      : "text-white/45"
    : open
      ? "text-ink-2"
      : "text-muted";
  const textSize = size === "xs" ? "text-[10px]" : "text-[11px]";

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="relative grid place-items-center">
        <span
          className={cn(
            "absolute inline-flex h-2.5 w-2.5 rounded-full opacity-60",
            open ? "animate-ping bg-[#19c37d]" : "bg-transparent",
          )}
        />
        <span className={cn("relative size-1.5 rounded-full", dotColor)} />
      </span>
      <span className={cn(textSize, "font-medium", textTone)}>
        {open ? t("footer.openNow") : t("footer.closedNow")}
      </span>
    </span>
  );
}