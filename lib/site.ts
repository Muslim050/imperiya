import { CONTACTS } from "@/data/catalog";

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
export const SITE_TITLE = "IMPERIYA — Фабрика окон, дверей и витражей";
export const SITE_DESCRIPTION =
  "IMPERIYA — фабрика окон, дверей и витражей премиум-класса. Официальный партнёр Akfa. Профили Thermo и Engelberg, энергосберегающие стеклопакеты, монтаж под ключ. Расчёт стоимости онлайн.";

export const SITE_KEYWORDS = [
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
];

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
  hours: { opens: "09:00", closes: "20:00" },
} as const;
