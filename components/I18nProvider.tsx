"use client";

import { createContext, useContext, useMemo } from "react";
import { I18nextProvider } from "react-i18next";
import { createI18n, DEFAULT_LANG, type LangCode } from "@/i18n";

const LangContext = createContext<LangCode>(DEFAULT_LANG);

/**
 * The active language, straight from the `[lang]` route segment. Prefer
 * this over `i18n.language` when building hrefs — it is the same value
 * the URL carries, with no locale normalisation in between.
 */
export const useLang = (): LangCode => useContext(LangContext);

export function I18nProvider({
  lang,
  children,
}: {
  lang: LangCode;
  children: React.ReactNode;
}) {
  // Rebuilt only when the language changes, so a client-side switch
  // between /ru and /uz swaps the whole tree's translations at once.
  const i18n = useMemo(() => createI18n(lang), [lang]);

  return (
    <LangContext.Provider value={lang}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </LangContext.Provider>
  );
}
