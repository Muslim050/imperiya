/**
 * Catalog data sourced from the client TZ.
 * Brand/series names are intentionally NOT translated.
 * Specs & photos per the TZ ("картинки и характеристики скину файлом")
 * are to be added later — each item carries a stable `slug` so detail
 * pages already route correctly.
 */

export type ProfileCategory = "pvc" | "facade";

/** Row label — resolved through `specs.labels.*` in the locale files. */
export type SpecKey =
  | "profileType"
  | "series"
  | "wallThickness"
  | "chambers"
  | "maxSashHeight"
  | "maxSashWidth"
  | "glassThickness"
  | "coating"
  | "mountingDepth"
  | "glazingOptions"
  | "maxFillWeight";

/** Enumerated cell value — resolved through `specs.values.*`. */
export type SpecTerm =
  | "aluminium"
  | "aluminiumAdj"
  | "pvc"
  | "warm"
  | "cold"
  | "lamination"
  | "anodisingRalLamination"
  | "decorCapsClampProfile";

/**
 * Cell contents. Measurements keep the number as data and name the unit
 * separately so "70 мм" can render as "70 mm" without string surgery;
 * `plain` is for bare counts that read the same in every language.
 */
export type SpecValue =
  | { measure: string; unit: "mm" | "kg" }
  | { term: SpecTerm }
  | { plain: string };

/** One row in the spec table on the detail page. */
export interface ProfileSpec {
  key: SpecKey;
  value: SpecValue;
}

export interface ProfileSeries {
  slug: string;
  name: string;
  category: ProfileCategory;
  /** Photo / cross-section under public/profiles/{slug}.png. */
  image?: string;
  /** Tech specs from the client's doc, keyed so they can be translated. */
  specs?: ProfileSpec[];
}

/* Specs sourced verbatim from `Серии профилей.docx`. Material designation
 * ("ПВХ" / "Алюминиевый") drives the catalog category. BCF MAX was
 * explicitly removed by the client ("нужно удалить он не нужен"). */
export const PROFILE_SERIES: ProfileSeries[] = [
  {
    slug: "thermo-70",
    name: "Thermo 70",
    category: "pvc",
    image: "/profiles/thermo-70.png",
    specs: [
      { key: "profileType", value: { term: "aluminium" } },
      { key: "series", value: { term: "warm" } },
      { key: "wallThickness", value: { measure: "1,4–1,9", unit: "mm" } },
      { key: "chambers", value: { plain: "3" } },
      { key: "maxSashHeight", value: { measure: "2600", unit: "mm" } },
      { key: "maxSashWidth", value: { measure: "1200", unit: "mm" } },
      { key: "glassThickness", value: { measure: "20–36", unit: "mm" } },
      { key: "coating", value: { term: "anodisingRalLamination" } },
      { key: "mountingDepth", value: { measure: "70", unit: "mm" } },
    ],
  },
  {
    slug: "thermo-58",
    name: "Thermo 58",
    category: "pvc",
    image: "/profiles/thermo-58.png",
    specs: [
      { key: "profileType", value: { term: "aluminium" } },
      { key: "series", value: { term: "warm" } },
      { key: "wallThickness", value: { measure: "1,4", unit: "mm" } },
      { key: "chambers", value: { plain: "3" } },
      { key: "maxSashHeight", value: { measure: "2400", unit: "mm" } },
      { key: "maxSashWidth", value: { measure: "1000", unit: "mm" } },
      { key: "glassThickness", value: { measure: "6–32", unit: "mm" } },
      { key: "coating", value: { term: "anodisingRalLamination" } },
      { key: "mountingDepth", value: { measure: "58", unit: "mm" } },
    ],
  },
  {
    slug: "engelberg-7000",
    name: "Engelberg 7000",
    category: "pvc",
    image: "/profiles/engelberg-7000.png",
    specs: [
      { key: "profileType", value: { term: "pvc" } },
      { key: "series", value: { term: "warm" } },
      { key: "wallThickness", value: { measure: "2,8", unit: "mm" } },
      { key: "chambers", value: { plain: "5" } },
      { key: "maxSashHeight", value: { measure: "2200", unit: "mm" } },
      { key: "maxSashWidth", value: { measure: "900", unit: "mm" } },
      { key: "glassThickness", value: { measure: "24–32", unit: "mm" } },
      { key: "coating", value: { term: "lamination" } },
      { key: "mountingDepth", value: { measure: "70", unit: "mm" } },
    ],
  },
  {
    slug: "engelberg-8000",
    name: "Engelberg 8000",
    category: "pvc",
    image: "/profiles/engelberg-8000.png",
    specs: [
      { key: "profileType", value: { term: "pvc" } },
      { key: "series", value: { term: "warm" } },
      { key: "wallThickness", value: { measure: "2,8", unit: "mm" } },
      { key: "chambers", value: { plain: "6" } },
      { key: "maxSashHeight", value: { measure: "2300", unit: "mm" } },
      { key: "maxSashWidth", value: { measure: "1000", unit: "mm" } },
      { key: "glassThickness", value: { measure: "24–32", unit: "mm" } },
      { key: "coating", value: { term: "lamination" } },
      { key: "mountingDepth", value: { measure: "80", unit: "mm" } },
    ],
  },
  {
    slug: "quatro-6000",
    name: "Quatro 6000",
    category: "pvc",
    image: "/profiles/quatro-6000.png",
    specs: [
      { key: "profileType", value: { term: "pvc" } },
      { key: "series", value: { term: "warm" } },
      { key: "chambers", value: { plain: "4" } },
      { key: "wallThickness", value: { measure: "2,2", unit: "mm" } },
      { key: "glassThickness", value: { measure: "4–24", unit: "mm" } },
      { key: "maxSashHeight", value: { measure: "1500", unit: "mm" } },
      { key: "maxSashWidth", value: { measure: "650", unit: "mm" } },
      { key: "coating", value: { term: "lamination" } },
      { key: "mountingDepth", value: { measure: "60", unit: "mm" } },
    ],
  },
  {
    slug: "trio-6000",
    name: "Trio 6000",
    category: "pvc",
    image: "/profiles/trio-6000.png",
    specs: [
      { key: "profileType", value: { term: "pvc" } },
      { key: "series", value: { term: "warm" } },
      { key: "chambers", value: { plain: "3" } },
      { key: "wallThickness", value: { measure: "2,8", unit: "mm" } },
      { key: "glassThickness", value: { measure: "4–24", unit: "mm" } },
      { key: "maxSashHeight", value: { measure: "1600", unit: "mm" } },
      { key: "maxSashWidth", value: { measure: "650", unit: "mm" } },
      { key: "coating", value: { term: "lamination" } },
      { key: "mountingDepth", value: { measure: "60", unit: "mm" } },
    ],
  },
  {
    slug: "penta-6500",
    name: "Penta 6500",
    category: "pvc",
    image: "/profiles/penta-6500.png",
    specs: [
      { key: "profileType", value: { term: "pvc" } },
      { key: "series", value: { term: "warm" } },
      { key: "chambers", value: { plain: "5" } },
      { key: "wallThickness", value: { measure: "2,4", unit: "mm" } },
      { key: "glassThickness", value: { measure: "24–32", unit: "mm" } },
      { key: "maxSashHeight", value: { measure: "1600", unit: "mm" } },
      { key: "maxSashWidth", value: { measure: "650", unit: "mm" } },
      { key: "coating", value: { term: "lamination" } },
      { key: "mountingDepth", value: { measure: "65", unit: "mm" } },
    ],
  },
  {
    slug: "akfa-7000",
    name: "Akfa 7000",
    category: "pvc",
    image: "/profiles/akfa-7000.png",
    specs: [
      { key: "profileType", value: { term: "pvc" } },
      { key: "series", value: { term: "warm" } },
      { key: "chambers", value: { plain: "5" } },
      { key: "wallThickness", value: { measure: "2,7", unit: "mm" } },
      { key: "glassThickness", value: { measure: "24–32", unit: "mm" } },
      { key: "maxSashHeight", value: { measure: "1700", unit: "mm" } },
      { key: "maxSashWidth", value: { measure: "700", unit: "mm" } },
      { key: "coating", value: { term: "lamination" } },
      { key: "mountingDepth", value: { measure: "70", unit: "mm" } },
    ],
  },
  {
    slug: "aldoks",
    name: "Aldoks",
    category: "pvc",
    image: "/profiles/aldoks.png",
    specs: [
      { key: "profileType", value: { term: "aluminiumAdj" } },
      { key: "series", value: { term: "cold" } },
      { key: "wallThickness", value: { measure: "1", unit: "mm" } },
      { key: "maxSashHeight", value: { measure: "2400", unit: "mm" } },
      { key: "maxSashWidth", value: { measure: "900", unit: "mm" } },
      { key: "glassThickness", value: { measure: "4–24", unit: "mm" } },
      { key: "coating", value: { term: "anodisingRalLamination" } },
      { key: "mountingDepth", value: { measure: "47", unit: "mm" } },
    ],
  },
  {
    /* Client decision: BCF 48 lives with the rest of the profile series
     * instead of the standalone "Фасадные системы" block — the artwork
     * is more profile-style than facade-system-overview. */
    slug: "bcf-48",
    name: "BCF 48",
    category: "pvc",
    image: "/profiles/bcf-48.png",
    specs: [
      { key: "profileType", value: { term: "aluminiumAdj" } },
      { key: "series", value: { term: "warm" } },
      { key: "wallThickness", value: { measure: "1,5 / 2 / 3", unit: "mm" } },
      { key: "coating", value: { term: "anodisingRalLamination" } },
      { key: "glazingOptions", value: { term: "decorCapsClampProfile" } },
      { key: "maxSashHeight", value: { measure: "2400", unit: "mm" } },
      { key: "maxSashWidth", value: { measure: "900", unit: "mm" } },
      { key: "glassThickness", value: { measure: "6–32", unit: "mm" } },
      { key: "maxFillWeight", value: { measure: "120", unit: "kg" } },
    ],
  },
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
  /** Intrinsic pixel size — next/image needs it for the lightbox, which
   *  sizes by height and so has no box to fill. */
  w: number;
  h: number;
  titleKey: string;
}

export const CERTIFICATES: Certificate[] = [
  { id: "iso", img: "/certificates/national-1.jpg", w: 777, h: 1100, titleKey: "iso" },
  { id: "gost-32603", img: "/certificates/national-2.jpg", w: 778, h: 1100, titleKey: "gost32603" },
  { id: "gost-30245", img: "/certificates/national-3.jpg", w: 778, h: 1100, titleKey: "gost30245" },
  { id: "gost-23486", img: "/certificates/inter-1.jpg", w: 777, h: 1100, titleKey: "gost23486" },
];

/** New "Imperiya in numbers" block per the TZ. */
export const STATS = [
  { key: "area", value: "1200" },
  { key: "clients", value: "30 000+" },
  { key: "lines", value: "15" },
  { key: "constructions", value: "2500+" },
  { key: "years", value: "16" },
] as const;

export const CONTACTS = {
  phone: "+998 99 400 40 40",
  phoneHref: "tel:+998994004040",
  telegramHref: "https://t.me/+998994004040",
  mapQuery: "Янгиюльский район, улица Тахтакуприк, 18А",
};

export const SOCIALS = [
  { key: "telegram", href: CONTACTS.telegramHref },
  { key: "instagram", href: "#" },
  { key: "youtube", href: "#" },
] as const;
