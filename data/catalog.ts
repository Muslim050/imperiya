/**
 * Catalog data sourced from the client TZ.
 * Brand/series names are intentionally NOT translated.
 * Specs & photos per the TZ ("картинки и характеристики скину файлом")
 * are to be added later — each item carries a stable `slug` so detail
 * pages already route correctly.
 */

export type ProfileCategory = "pvc" | "facade";

/** One row in the spec table on the detail page. */
export interface ProfileSpec {
  label: string;
  value: string;
}

export interface ProfileSeries {
  slug: string;
  name: string;
  category: ProfileCategory;
  /** Photo / cross-section under public/profiles/{slug}.png. */
  image?: string;
  /** Russian-language tech specs straight from the client's doc. */
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
      { label: "Тип профиля", value: "Алюминий" },
      { label: "Серия", value: "тёплая" },
      { label: "Толщина стенки", value: "1,4–1,9 мм" },
      { label: "Количество камер", value: "3" },
      { label: "Макс. высота створки", value: "2600 мм" },
      { label: "Макс. ширина створки", value: "1200 мм" },
      { label: "Толщина стеклопакета", value: "20–36 мм" },
      { label: "Покрытие", value: "Анодирование, цвета RAL, ламинация" },
      { label: "Монтажная глубина", value: "70 мм" },
    ],
  },
  {
    slug: "thermo-58",
    name: "Thermo 58",
    category: "pvc",
    image: "/profiles/thermo-58.png",
    specs: [
      { label: "Тип профиля", value: "Алюминий" },
      { label: "Серия", value: "тёплая" },
      { label: "Толщина стенки", value: "1,4 мм" },
      { label: "Количество камер", value: "3" },
      { label: "Макс. высота створки", value: "2400 мм" },
      { label: "Макс. ширина створки", value: "1000 мм" },
      { label: "Толщина стеклопакета", value: "6–32 мм" },
      { label: "Покрытие", value: "Анодирование, цвета RAL, ламинация" },
      { label: "Монтажная глубина", value: "58 мм" },
    ],
  },
  {
    slug: "engelberg-7000",
    name: "Engelberg 7000",
    category: "pvc",
    image: "/profiles/engelberg-7000.png",
    specs: [
      { label: "Тип профиля", value: "ПВХ" },
      { label: "Серия", value: "тёплая" },
      { label: "Толщина стенки", value: "2,8 мм" },
      { label: "Количество камер", value: "5" },
      { label: "Макс. высота створки", value: "2200 мм" },
      { label: "Макс. ширина створки", value: "900 мм" },
      { label: "Толщина стеклопакета", value: "24–32 мм" },
      { label: "Покрытие", value: "Ламинация" },
      { label: "Монтажная глубина", value: "70 мм" },
    ],
  },
  {
    slug: "engelberg-8000",
    name: "Engelberg 8000",
    category: "pvc",
    image: "/profiles/engelberg-8000.png",
    specs: [
      { label: "Тип профиля", value: "ПВХ" },
      { label: "Серия", value: "тёплая" },
      { label: "Толщина стенки", value: "2,8 мм" },
      { label: "Количество камер", value: "6" },
      { label: "Макс. высота створки", value: "2300 мм" },
      { label: "Макс. ширина створки", value: "1000 мм" },
      { label: "Толщина стеклопакета", value: "24–32 мм" },
      { label: "Покрытие", value: "Ламинация" },
      { label: "Монтажная глубина", value: "80 мм" },
    ],
  },
  {
    slug: "quatro-6000",
    name: "Quatro 6000",
    category: "pvc",
    image: "/profiles/quatro-6000.png",
    specs: [
      { label: "Тип профиля", value: "ПВХ" },
      { label: "Серия", value: "тёплая" },
      { label: "Количество камер", value: "4" },
      { label: "Толщина стенки", value: "2,2 мм" },
      { label: "Толщина стеклопакета", value: "4–24 мм" },
      { label: "Макс. высота створки", value: "1500 мм" },
      { label: "Макс. ширина створки", value: "650 мм" },
      { label: "Покрытие", value: "Ламинация" },
      { label: "Монтажная глубина", value: "60 мм" },
    ],
  },
  {
    slug: "trio-6000",
    name: "Trio 6000",
    category: "pvc",
    image: "/profiles/trio-6000.png",
    specs: [
      { label: "Тип профиля", value: "ПВХ" },
      { label: "Серия", value: "тёплая" },
      { label: "Количество камер", value: "3" },
      { label: "Толщина стенки", value: "2,8 мм" },
      { label: "Толщина стеклопакета", value: "4–24 мм" },
      { label: "Макс. высота створки", value: "1600 мм" },
      { label: "Макс. ширина створки", value: "650 мм" },
      { label: "Покрытие", value: "Ламинация" },
      { label: "Монтажная глубина", value: "60 мм" },
    ],
  },
  {
    slug: "penta-6500",
    name: "Penta 6500",
    category: "pvc",
    image: "/profiles/penta-6500.png",
    specs: [
      { label: "Тип профиля", value: "ПВХ" },
      { label: "Серия", value: "тёплая" },
      { label: "Количество камер", value: "5" },
      { label: "Толщина стенки", value: "2,4 мм" },
      { label: "Толщина стеклопакета", value: "24–32 мм" },
      { label: "Макс. высота створки", value: "1600 мм" },
      { label: "Макс. ширина створки", value: "650 мм" },
      { label: "Покрытие", value: "Ламинация" },
      { label: "Монтажная глубина", value: "65 мм" },
    ],
  },
  {
    slug: "akfa-7000",
    name: "Akfa 7000",
    category: "pvc",
    image: "/profiles/akfa-7000.png",
    specs: [
      { label: "Тип профиля", value: "ПВХ" },
      { label: "Серия", value: "тёплая" },
      { label: "Количество камер", value: "5" },
      { label: "Толщина стенки", value: "2,7 мм" },
      { label: "Толщина стеклопакета", value: "24–32 мм" },
      { label: "Макс. высота створки", value: "1700 мм" },
      { label: "Макс. ширина створки", value: "700 мм" },
      { label: "Покрытие", value: "Ламинация" },
      { label: "Монтажная глубина", value: "70 мм" },
    ],
  },
  {
    slug: "aldoks",
    name: "Aldoks",
    category: "pvc",
    image: "/profiles/aldoks.png",
    specs: [
      { label: "Тип профиля", value: "Алюминиевый" },
      { label: "Серия", value: "холодная" },
      { label: "Толщина стенки", value: "1 мм" },
      { label: "Макс. высота створки", value: "2400 мм" },
      { label: "Макс. ширина створки", value: "900 мм" },
      { label: "Толщина стеклопакета", value: "4–24 мм" },
      { label: "Покрытие", value: "Анодирование, цвета RAL, ламинация" },
      { label: "Монтажная глубина", value: "47 мм" },
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
      { label: "Тип профиля", value: "Алюминиевый" },
      { label: "Серия", value: "тёплая" },
      { label: "Толщина стенки", value: "1,5 / 2 / 3 мм" },
      { label: "Покрытие", value: "Анодирование, цвета RAL, ламинация" },
      { label: "Варианты остекления", value: "декоративные крышки / прижимной профиль" },
      { label: "Макс. высота створки", value: "2400 мм" },
      { label: "Макс. ширина створки", value: "900 мм" },
      { label: "Толщина стеклопакета", value: "6–32 мм" },
      { label: "Макс. вес заполнения", value: "120 кг" },
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
