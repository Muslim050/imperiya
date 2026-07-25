/**
 * Language constants with NO React or i18next dependency.
 *
 * Route handlers (sitemap.xml, robots.txt) and server metadata run outside
 * a React render, where importing `react-i18next` blows up on
 * `createContext`. They import from here; only `i18n/index.ts` — which
 * builds the actual translation instance — pulls in i18next.
 */
export const LANGUAGES = [
  { code: "ru", label: "RU" },
  { code: "uz", label: "UZ" },
  { code: "en", label: "EN" },
] as const;

export type LangCode = (typeof LANGUAGES)[number]["code"];

export const LANG_CODES = LANGUAGES.map((l) => l.code) as readonly LangCode[];

/** Russian is what `/` redirects to and what x-default points at. */
export const DEFAULT_LANG: LangCode = "ru";

/** Maps an Open Graph locale onto each language, for og:locale. */
export const OG_LOCALES: Record<LangCode, string> = {
  ru: "ru_RU",
  uz: "uz_UZ",
  en: "en_US",
};

export const isLangCode = (value: string): value is LangCode =>
  (LANG_CODES as readonly string[]).includes(value);
