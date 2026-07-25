"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LANGUAGES } from "@/i18n/config";
import { useLang } from "@/components/I18nProvider";
import { localePath, stripLocale } from "@/lib/locale";
import { ChevronDown } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ tone = "dark" }: { tone?: "light" | "dark" }) {
  const lang = useLang();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  /**
   * Switching language is a navigation, not a client-side state change:
   * each language has its own URL, so the same page in another language
   * must be a real <a href>. That also lets crawlers follow the links and
   * keeps the address bar honest about what is being displayed.
   */
  const basePath = stripLocale(pathname);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const light = tone === "light";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "flex items-center gap-1.5 text-[13px] font-semibold transition-colors",
          light ? "text-white/90 hover:text-white" : "text-ink-2 hover:text-orange",
        )}
      >
        {current.label}
        <ChevronDown
          className={cn(
            "size-2.5 opacity-50 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-2 w-24 overflow-hidden rounded-lg border border-line bg-white py-1 shadow-[0_14px_32px_-20px_rgba(15,15,15,.34)]"
        >
          {LANGUAGES.map((l) => (
            <li key={l.code}>
              <Link
                href={localePath(l.code, basePath)}
                hrefLang={l.code}
                role="option"
                aria-selected={l.code === current.code}
                onClick={() => setOpen(false)}
                className={cn(
                  "block w-full px-3 py-2 text-left text-[13px] font-semibold transition-colors",
                  l.code === current.code
                    ? "bg-bg text-orange"
                    : "text-ink-2 hover:bg-bg",
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
