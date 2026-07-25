import { CONTACTS } from "@/data/catalog";
import { DEFAULT_LANG, LANG_CODES, type LangCode } from "@/i18n/config";
import { localePath } from "@/lib/locale";
import ru from "@/i18n/locales/ru";
import uz from "@/i18n/locales/uz";
import en from "@/i18n/locales/en";

const LOCALES = { ru, uz, en } as const;

/** The one canonical origin. Never derive this from a request header. */
const PRODUCTION_URL = "https://www.imperiya.uz";

const isLocalhost = (url: string) =>
  /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(:\d+)?$/i.test(
    url.replace(/\/$/, ""),
  );

/**
 * Central SEO / site-wide constants. `SITE_URL` drives metadataBase,
 * canonical links, the sitemap, robots and absolute Open Graph URLs.
 * Overridable per-environment via NEXT_PUBLIC_SITE_URL (set it on the
 * Vercel project) — falls back to the production domain.
 *
 * A production build NEVER accepts a localhost origin: those URLs get
 * baked into every canonical/og:url/sitemap entry of the static export,
 * and shipping them would de-index the whole site. If a stray local
 * `.env` leaks into a prod build we ignore it and use the real domain.
 */
function resolveSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

  if (!fromEnv) return PRODUCTION_URL;

  if (process.env.NODE_ENV === "production" && isLocalhost(fromEnv)) {
    console.warn(
      `[site] Ignoring NEXT_PUBLIC_SITE_URL="${fromEnv}" in a production build — ` +
        `falling back to ${PRODUCTION_URL}. Set the real origin on the deploy target.`,
    );
    return PRODUCTION_URL;
  }

  return fromEnv;
}

export const SITE_URL = resolveSiteUrl();

export const SITE_NAME = "IMPERIYA";

/** Localised <title> / <meta description>, sourced from the locale files. */
export const siteTitle = (lang: LangCode) => LOCALES[lang].seo.title;
export const siteDescription = (lang: LangCode) =>
  LOCALES[lang].seo.description;

/** Russian copy is still the default for anything language-agnostic. */
export const SITE_TITLE = siteTitle(DEFAULT_LANG);
export const SITE_DESCRIPTION = siteDescription(DEFAULT_LANG);

export const SITE_KEYWORDS: Record<LangCode, string[]> = {
  ru: [
    "окна",
    "пластиковые окна",
    "фабрика окон",
    "витражи",
    "двери",
    "стеклопакеты",
    "Akfa",
    "алюминиевые профили",
    "остекление",
    "Ташкент",
    "Узбекистан",
  ],
  uz: [
    "oyna",
    "plastik oynalar",
    "oyna fabrikasi",
    "vitrajlar",
    "eshiklar",
    "shisha paketlar",
    "Akfa",
    "alyumin profillar",
    "oynalash",
    "Toshkent",
    "O'zbekiston",
  ],
  en: [
    "windows",
    "pvc windows",
    "window factory",
    "facade glazing",
    "doors",
    "glass units",
    "Akfa",
    "aluminium profiles",
    "glazing",
    "Tashkent",
    "Uzbekistan",
  ],
};

/**
 * hreflang set for a path that exists in every language. `path` is the
 * language-independent tail ("/" or "/profile/thermo-70"). x-default
 * points at Russian, which is also where a bare "/" redirects.
 */
export function languageAlternates(path: string) {
  const languages = Object.fromEntries(
    LANG_CODES.map((code) => [code, localePath(code, path)]),
  ) as Record<LangCode, string>;

  return { ...languages, "x-default": localePath(DEFAULT_LANG, path) };
}

/** Business identity for LocalBusiness structured data. */
export const BUSINESS = {
  name: SITE_NAME,
  legalName: "IMPERIYA — Фабрика окон",
  phone: CONTACTS.phone,
  phoneHref: CONTACTS.phoneHref,
  address: {
    street: "улица Тахтакуприк, 18А",
    locality: "Янгиюльский район",
    region: "Ташкентская область",
    country: "UZ",
  },
  /* Where the factory actually sells and installs. Feeds `areaServed`,
   * which is what ties the business to local-intent queries. */
  areaServed: ["Ташкент", "Ташкентская область", "Узбекистан"],
  /* Client-supplied, read off the map. Wrong coordinates would pin the
   * company to the wrong place in Maps, so these are never guessed. */
  geo: { latitude: 41.200192, longitude: 69.110198 },
  hours: { opens: "09:00", closes: "20:00" },
} as const;
