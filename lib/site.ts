import { CONTACTS } from "@/data/catalog";

/**
 * Central SEO / site-wide constants. `SITE_URL` drives metadataBase,
 * canonical links, the sitemap, robots and absolute Open Graph URLs.
 * Overridable per-environment via NEXT_PUBLIC_SITE_URL (set it on the
 * Vercel project) — falls back to the production domain.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.imperiya.uz"
).replace(/\/$/, "");

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
