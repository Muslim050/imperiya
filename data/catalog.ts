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
  "service",
] as const;
export type ServiceKey = (typeof SERVICES)[number];

export const PARTNERS = [
  "Benkam",
  "Roto",
  "Akfa",
  "Fornax",
  "Kale",
  "Vorne", 
  "Master",
] as const;

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
