import { LANG_CODES, type LangCode } from "@/i18n/config";

/**
 * Prefixes an app-relative path with the language segment.
 *
 * Every language is prefixed — there is no bare-root variant — so the
 * home page is `/ru`, not `/`. Hash-only targets collapse (`/#calc` →
 * `/ru#calc`) instead of picking up a stray slash.
 *
 *   localePath("uz", "/")            → "/uz"
 *   localePath("uz", "/#calculator") → "/uz#calculator"
 *   localePath("uz", "/profile/x")   → "/uz/profile/x"
 */
export function localePath(lang: LangCode, path: string): string {
  if (!path.startsWith("/")) return path;

  const rest = path.slice(1);
  if (rest === "" ) return `/${lang}`;
  if (rest.startsWith("#")) return `/${lang}${rest}`;
  return `/${lang}/${rest}`;
}

/** Strips a leading language segment: "/uz/profile/x" → "/profile/x". */
export function stripLocale(pathname: string): string {
  const match = pathname.match(/^\/([^/]+)(\/.*)?$/);
  if (!match) return pathname;

  const [, first, rest] = match;
  if (!(LANG_CODES as readonly string[]).includes(first)) return pathname;

  return rest ?? "/";
}

const HOME_RE = new RegExp(`^/(${LANG_CODES.join("|")})/?$`);

/**
 * True when `pathname` is a language home page. In-page anchor CTAs use
 * this to decide between scrolling locally and navigating.
 */
export const isHomePath = (pathname: string): boolean =>
  HOME_RE.test(pathname);
