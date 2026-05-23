/**
 * Catalog data sourced from the client TZ.
 * Brand/series names are intentionally NOT translated.
 * Specs & photos per the TZ ("картинки и характеристики скину файлом")
 * are to be added later — each item carries a stable `slug` so detail
 * pages already route correctly.
 */

export type ProfileCategory = "pvc" | "facade";

export interface ProfileSeries {
  slug: string;
  name: string;
  category: ProfileCategory;
}

export const PROFILE_SERIES: ProfileSeries[] = [
  { slug: "thermo-70", name: "Thermo 70", category: "pvc" },
  { slug: "thermo-58", name: "Thermo 58", category: "pvc" },
  { slug: "engelberg-7000", name: "Engelberg 7000", category: "pvc" },
  { slug: "engelberg-8000-infinity", name: "Engelberg 8000 Infinity", category: "pvc" },
  { slug: "quatro-6000", name: "Quatro 6000", category: "pvc" },
  { slug: "trio-6000", name: "Trio 6000", category: "pvc" },
  { slug: "penta-6500", name: "Penta 6500", category: "pvc" },
  { slug: "akfa-7000", name: "Akfa 7000", category: "pvc" },
  { slug: "aldoks", name: "Aldoks", category: "pvc" },
  { slug: "bcf-48", name: "BCF 48", category: "facade" },
  { slug: "bcf-50", name: "BCF 50", category: "facade" },
  { slug: "bcf-max", name: "BCF Max", category: "facade" },
];

export function getProfileBySlug(slug: string): ProfileSeries | undefined {
  return PROFILE_SERIES.find((p) => p.slug === slug);
}

/** Keys map to i18n `glass.names.*` and `glass.items.*` */
export const GLASS_UNITS = [
  "single24",
  "double32",
  "energy",
  "argon",
  "multimix",
  "single",
] as const;
export type GlassUnitKey = (typeof GLASS_UNITS)[number];

/** Keys map to i18n `services.items.*` */
export const SERVICES = [
  "facade",
  "shutters",
  "adjustment",
  "shower",
  "sliding",
  "pergola",
  "gates",
  "wpc",
] as const;
export type ServiceKey = (typeof SERVICES)[number];

/**
 * Partner brands. `logo` is the path under public/partners/ — if the file
 * is missing the Partners section falls back to the wordmark `name`.
 * Drop new logos with the same `slug` to swap them in instantly.
 */
export interface Partner {
  slug: string;
  name: string;
  logo: string;
}

export const PARTNERS: Partner[] = [
  { slug: "akfa", name: "Akfa", logo: "/partners/akfa.png" },
  { slug: "rehau", name: "REHAU", logo: "/partners/rehau.png" },
  { slug: "benkam", name: "Benkam", logo: "/partners/benkam.jpg" },
  { slug: "continental", name: "Continental", logo: "/partners/continental.png" },
  { slug: "kinlong", name: "Kin Long", logo: "/partners/kinlong.png" },
  { slug: "roto", name: "Roto", logo: "/partners/roto.png" },
  { slug: "wink", name: "Wink", logo: "/partners/wink.png" },
];

/**
 * Certificates pulled from akfasteel.uz (AKFA Steel Group is the parent
 * brand we are an authorised partner of). The `title` key maps to
 * i18n `certificates.items.*`; image files live under public/certificates/.
 */
export interface Certificate {
  id: string;
  img: string;
  titleKey: string;
}

export const CERTIFICATES: Certificate[] = [
  { id: "iso", img: "/certificates/national-1.jpg", titleKey: "iso" },
  { id: "gost-32603", img: "/certificates/national-2.jpg", titleKey: "gost32603" },
  { id: "gost-30245", img: "/certificates/national-3.jpg", titleKey: "gost30245" },
  { id: "gost-23486", img: "/certificates/inter-1.jpg", titleKey: "gost23486" },
];

/** New "Imperiya in numbers" block per the TZ. */
export const STATS = [
  { key: "area", value: "1200" },
  { key: "clients", value: "30 000+" },
  { key: "lines", value: "15" },
  { key: "constructions", value: "2500+" },
  { key: "years", value: "14" },
] as const;

export const CONTACTS = {
  phone: "+998 99 400 40 40",
  phoneHref: "tel:+998994004040",
  mapQuery: "Янгиюльский район, улица Тахтакуприк, 18А",
};

export const SOCIALS = [
  { key: "telegram", href: "#" },
  { key: "instagram", href: "#" },
  { key: "youtube", href: "#" },
] as const;
