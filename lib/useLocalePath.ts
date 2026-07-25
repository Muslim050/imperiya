"use client";

import { useCallback } from "react";
import { useLang } from "@/components/I18nProvider";
import { localePath } from "@/lib/locale";

/**
 * Returns a `path -> localised href` mapper bound to the active language.
 *
 *   const href = useLocalePath();
 *   <Link href={href("/#calculator")} />   // "/uz#calculator" on /uz
 *
 * Every internal link must go through this: a bare "/#calculator" would
 * throw a visitor from /uz back onto the Russian home page.
 */
export function useLocalePath() {
  const lang = useLang();
  return useCallback((path: string) => localePath(lang, path), [lang]);
}
