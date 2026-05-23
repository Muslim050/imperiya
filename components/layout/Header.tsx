"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Logo } from "@/components/Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { OpenIndicator } from "@/components/ui/OpenIndicator";
import { Phone, ChevronRight } from "@/components/ui/icons";
import { CONTACTS } from "@/data/catalog";
import { cn } from "@/lib/utils";
import { scrollToAnchor, isOnHome } from "@/lib/scrollToAnchor";

const NAV = [
  { key: "home", to: "/", section: null },
  { key: "profiles", to: "/#profiles", section: "profiles" },
  { key: "facade", to: "/#facade", section: "facade" },
    { key: "glass", to: "/#glass", section: "glass" },
  { key: "services", to: "/#services", section: "services" },
  { key: "about", to: "/#about", section: "about" },
  { key: "contacts", to: "/#contacts", section: "contacts" },
] as const;

export function Header() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Header gets a stronger shadow once the user scrolls past the hero band.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: highlight the nav item whose section is currently in view.
  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection(null);
      return;
    }
    const sectionIds = NAV.flatMap((n) => (n.section ? [n.section] : []));
    const els = sectionIds
      .map((id) => document.getElementById(id))
      .filter((e): e is HTMLElement => !!e);
    if (!els.length) return;

    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.set(e.target.id, e.intersectionRatio);
          else visible.delete(e.target.id);
        }
        if (visible.size === 0) {
          setActiveSection(null);
          return;
        }
        const top = [...visible.entries()].sort((a, b) => b[1] - a[1])[0][0];
        setActiveSection(top);
      },
      { rootMargin: "-200px 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  const isActive = (item: (typeof NAV)[number]) => {
    if (pathname !== "/") return item.to === pathname;
    if (item.section === null) return activeSection === null;
    return activeSection === item.section;
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 backdrop-blur-xl backdrop-saturate-150 transition-[background-color,box-shadow] duration-200",
        // Frosted glass: lighter when overlaying hero/dark content, solid-ish on light
        scrolled
          ? "bg-white/85 shadow-[0_1px_0_rgba(0,0,0,.04),0_10px_24px_-18px_rgba(0,0,0,.18)]"
          : "bg-white/75 shadow-none",
      )}
    >
      {/* Thin orange brand accent at the very top */}
      <div className="h-[3px] w-full bg-orange" />

      <div className="inner flex items-center justify-between gap-6 pt-4">
        <Logo tone="dark" className="transition-transform duration-200 hover:scale-[1.02]" />

        <div className="flex items-center gap-5 sm:gap-7">
          <a
            href={CONTACTS.phoneHref}
            className="hidden flex-col items-end leading-[1.1] md:flex"
          >
            <span className="flex items-center gap-2 text-base font-bold text-[#111]">
              <span className="grid size-7 place-items-center rounded-full bg-orange/10 text-orange transition-colors group-hover:bg-orange group-hover:text-white">
                <Phone className="size-3.5" />
              </span>
              {CONTACTS.phone}
            </span>
            <span className="mt-1 flex items-center gap-2 text-[11px] text-[#888]">
              {t("topbar.schedule")}
              <span className="text-[#ccc]">•</span>
              <OpenIndicator tone="dark" size="xs" />
            </span>
          </a>

          <Link
            href="/#calculator"
            onClick={(e) => {
              if (isOnHome()) {
                e.preventDefault();
                scrollToAnchor("calculator");
              }
            }}
            className="group hidden items-center gap-2 bg-orange px-[22px] py-3.5 text-[13px] font-bold uppercase tracking-[0.06em] text-white transition-all duration-200 hover:bg-orange-d hover:shadow-[0_8px_20px_-8px_rgba(243,147,34,.55)] sm:inline-flex"
          >
            {t("topbar.cta")}
            <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>

          {/* Language switcher anchored to the far right per request. */}
          <div className="hidden sm:block">
            <LanguageSwitcher tone="dark" />
          </div>

          <button
            type="button"
            aria-label="Menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="grid size-10 place-items-center border border-line transition-colors hover:border-orange lg:hidden"
          >
            <span className="space-y-[5px]">
              <span className="block h-0.5 w-5 bg-ink" />
              <span className="block h-0.5 w-5 bg-ink" />
              <span className="block h-0.5 w-5 bg-ink" />
            </span>
          </button>
        </div>
      </div>

      {/* Bordered centered nav with animated underline accent */}
      <div className="inner mt-3">
        <nav className="hidden justify-center gap-[38px] border-t border-line-2 pt-3.5 pb-3.5 text-[13px] font-semibold uppercase tracking-[0.02em] lg:flex">
          {NAV.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.key}
                href={item.to}
                onClick={(e) => {
                  if (item.section && isOnHome()) {
                    e.preventDefault();
                    scrollToAnchor(item.section);
                  }
                }}
                className={cn(
                  "group relative py-2 transition-colors",
                  active ? "text-orange" : "text-ink-2 hover:text-orange",
                )}
              >
                {t(`nav.${item.key}`)}
                <span
                  className={cn(
                    "pointer-events-none absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 bg-orange transition-all duration-300",
                    active ? "w-full" : "w-0 group-hover:w-full",
                  )}
                />
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-t border-line-2 bg-white/90 backdrop-blur-xl transition-[max-height] duration-300 lg:hidden",
          mobileOpen ? "max-h-[480px]" : "max-h-0",
        )}
      >
        <div className="inner flex flex-col gap-1 py-4">
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={item.to}
              onClick={(e) => {
                setMobileOpen(false);
                if (item.section && isOnHome()) {
                  e.preventDefault();
                  setTimeout(() => scrollToAnchor(item.section!), 50);
                }
              }}
              className="px-2 py-2.5 text-sm font-semibold uppercase tracking-wide text-ink-2 hover:text-orange"
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
          <div className="mt-3 flex items-center justify-between border-t border-line-2 pt-4">
            <LanguageSwitcher tone="dark" />
            <Link
              href="/#calculator"
              onClick={(e) => {
                setMobileOpen(false);
                if (isOnHome()) {
                  e.preventDefault();
                  // Wait for the mobile drawer's close animation to free space.
                  setTimeout(() => scrollToAnchor("calculator"), 50);
                }
              }}
              className="inline-flex items-center gap-2 bg-orange px-5 py-3 text-[13px] font-bold uppercase tracking-[0.06em] text-white"
            >
              {t("topbar.cta")}
              <ChevronRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}