"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "@/i18n";
import { ChevronDown } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ tone = "dark" }: { tone?: "light" | "dark" }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current =
    LANGUAGES.find((l) => l.code === i18n.resolvedLanguage) ?? LANGUAGES[0];

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
          className="absolute right-0 z-50 mt-2 w-24 overflow-hidden border border-line bg-white py-1 shadow-lg"
        >
          {LANGUAGES.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                role="option"
                aria-selected={l.code === current.code}
                onClick={() => {
                  void i18n.changeLanguage(l.code);
                  setOpen(false);
                }}
                className={cn(
                  "block w-full px-3 py-2 text-left text-[13px] font-semibold transition-colors",
                  l.code === current.code
                    ? "bg-bg text-orange"
                    : "text-ink-2 hover:bg-bg",
                )}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}