/**
 * Calculator data model — clones imzo.uz/calculator/ in structure
 * (product → material type → series with its own lamination + fittings,
 * variants by sash count, components with own sizes) but keeps our
 * client's explicit ask: **plain number inputs for dimensions instead of
 * the unclear sliders** imzo uses.
 *
 * Pricing is indicative; final quote comes after on-site measurement.
 * SVG window/door artwork and color swatches are pulled from imzo's
 * /uploads/configurator/ and /uploads/colors/ trees.
 */
import { PROFILE_SERIES } from "./catalog";

/* -------------------------------------------------------------- localized */
export interface TripleLang {
  ru: string;
  uz: string;
  en: string;
}

/* ---------------------------------------------- product / construction */
export const PRODUCTS = ["window", "door"] as const;
export type Product = (typeof PRODUCTS)[number];

export const MATERIAL_TYPES = ["pvc", "aluminum"] as const;
export type MaterialType = (typeof MATERIAL_TYPES)[number];

/** Kept for back-compat with the old TYPE_FACTOR pricing — door+window only
 * are real configurable products; the others fall through to "individual". */
export const CONSTRUCTION_TYPES = [
  "window",
  "door",
  "stained",
  "balcony",
  "facade",
] as const;
export type ConstructionType = (typeof CONSTRUCTION_TYPES)[number];

/* ------------------------------------------------------------ frames */
export const FRAMES = [
  "single",
  "double",
  "triple",
  "door-single",
  "door-double",
] as const;
export type Frame = (typeof FRAMES)[number];

export interface FrameVariant {
  id: string;
  name: TripleLang;
  scheme: string;
  image: string;
}

export const FRAME_SIZE_LIMITS: Record<
  Frame,
  { minW: number; maxW: number; minH: number; maxH: number }
> = {
  single: { minW: 500, maxW: 1000, minH: 500, maxH: 2200 },
  double: { minW: 500, maxW: 1600, minH: 500, maxH: 2200 },
  triple: { minW: 500, maxW: 2700, minH: 500, maxH: 2200 },
  "door-single": { minW: 700, maxW: 1200, minH: 1900, maxH: 2400 },
  "door-double": { minW: 1200, maxW: 2400, minH: 1900, maxH: 2400 },
};

export const FRAMES_BY_PRODUCT: Record<Product, Frame[]> = {
  window: ["single", "double", "triple"],
  door: ["door-single", "door-double"],
};

export const VARIANTS: Record<Frame, FrameVariant[]> = {
  single: [
    {
      id: "single-blind",
      name: { ru: "Глухое", uz: "Karra", en: "Fixed" },
      scheme: "/calculator/single/scheme_1_1.svg",
      image: "/calculator/single/image_1_1.svg",
    },
    {
      id: "single-turn-left",
      name: {
        ru: "Поворотное, левое",
        uz: "Burama, chap",
        en: "Turn, left",
      },
      scheme: "/calculator/single/scheme_1_3.svg",
      image: "/calculator/single/image_1_2.svg",
    },
    {
      id: "single-turn-right",
      name: {
        ru: "Поворотное, правое",
        uz: "Burama, o'ng",
        en: "Turn, right",
      },
      scheme: "/calculator/single/scheme_1_2.svg",
      image: "/calculator/single/image_1_3.svg",
    },
    {
      id: "single-tilt-turn-left",
      name: {
        ru: "Поворотно-откидное, левое",
        uz: "Burama-egmali, chap",
        en: "Tilt-turn, left",
      },
      scheme: "/calculator/single/scheme_1_5.svg",
      image: "/calculator/single/image_1_3.svg",
    },
    {
      id: "single-tilt-turn-right",
      name: {
        ru: "Поворотно-откидное, правое",
        uz: "Burama-egmali, o'ng",
        en: "Tilt-turn, right",
      },
      scheme: "/calculator/single/scheme_1_4.svg",
      image: "/calculator/single/image_1_2.svg",
    },
  ],
  double: [
    { id: "double-blind-blind", name: { ru: "Глухое | Глухое", uz: "Karra | Karra", en: "Fixed | Fixed" }, scheme: "/calculator/double/scheme_2_1.svg", image: "/calculator/double/image_2_1.svg" },
    { id: "double-turn-blind", name: { ru: "Поворотное | Глухое", uz: "Burama | Karra", en: "Turn | Fixed" }, scheme: "/calculator/double/scheme_2_2.svg", image: "/calculator/double/image_2_2.svg" },
    { id: "double-tiltturn-blind", name: { ru: "Поворотно-откидное | Глухое", uz: "Burama-egmali | Karra", en: "Tilt-turn | Fixed" }, scheme: "/calculator/double/scheme_2_2_1.svg", image: "/calculator/double/image_2_2.svg" },
    { id: "double-blind-turn", name: { ru: "Глухое | Поворотное", uz: "Karra | Burama", en: "Fixed | Turn" }, scheme: "/calculator/double/scheme_2_3.svg", image: "/calculator/double/image_2_3.svg" },
    { id: "double-blind-tiltturn", name: { ru: "Глухое | Поворотно-откидное", uz: "Karra | Burama-egmali", en: "Fixed | Tilt-turn" }, scheme: "/calculator/double/scheme_2_3_1.svg", image: "/calculator/double/image_2_3.svg" },
    { id: "double-turn-turn", name: { ru: "Поворотное | Поворотное", uz: "Burama | Burama", en: "Turn | Turn" }, scheme: "/calculator/double/scheme_2_4.svg", image: "/calculator/double/image_2_4.svg" },
    { id: "double-turn-tiltturn", name: { ru: "Поворотное | Поворотно-откидное", uz: "Burama | Burama-egmali", en: "Turn | Tilt-turn" }, scheme: "/calculator/double/scheme_2_4_2.svg", image: "/calculator/double/image_2_4.svg" },
    { id: "double-tiltturn-turn", name: { ru: "Поворотно-откидное | Поворотное", uz: "Burama-egmali | Burama", en: "Tilt-turn | Turn" }, scheme: "/calculator/double/scheme_2_4_1.svg", image: "/calculator/double/image_2_4.svg" },
    { id: "double-tiltturn-tiltturn", name: { ru: "Поворотно-откидное | Поворотно-откидное", uz: "Burama-egmali | Burama-egmali", en: "Tilt-turn | Tilt-turn" }, scheme: "/calculator/double/scheme_2_4_4.svg", image: "/calculator/double/image_2_4.svg" },
  ],
  triple: [
    { id: "triple-blind-blind-blind", name: { ru: "Глухое | Глухое | Глухое", uz: "Karra | Karra | Karra", en: "Fixed | Fixed | Fixed" }, scheme: "/calculator/tricuspid/scheme_3_1.svg", image: "/calculator/tricuspid/image_3_1.svg" },
    { id: "triple-turn-blind-turn", name: { ru: "Поворотное | Глухое | Поворотное", uz: "Burama | Karra | Burama", en: "Turn | Fixed | Turn" }, scheme: "/calculator/tricuspid/scheme_3_2.svg", image: "/calculator/tricuspid/image_3_2.svg" },
    { id: "triple-tiltturn-blind-tiltturn", name: { ru: "Поворотно-откидное | Глухое | Поворотно-откидное", uz: "Burama-egmali | Karra | Burama-egmali", en: "Tilt-turn | Fixed | Tilt-turn" }, scheme: "/calculator/tricuspid/scheme_3_2_1.svg", image: "/calculator/tricuspid/image_3_2.svg" },
    { id: "triple-blindturn-blind", name: { ru: "Глухое, Поворотное | Глухое", uz: "Karra, Burama | Karra", en: "Fixed, Turn | Fixed" }, scheme: "/calculator/tricuspid/scheme_3_3.svg", image: "/calculator/tricuspid/image_3_3.svg" },
    { id: "triple-blind-tiltturn-blind", name: { ru: "Глухое | Поворотно-откидное | Глухое", uz: "Karra | Burama-egmali | Karra", en: "Fixed | Tilt-turn | Fixed" }, scheme: "/calculator/tricuspid/scheme_3_3_1.svg", image: "/calculator/tricuspid/image_3_3.svg" },
    { id: "triple-turn-turn-turn", name: { ru: "Поворотное | Поворотное | Поворотное", uz: "Burama | Burama | Burama", en: "Turn | Turn | Turn" }, scheme: "/calculator/tricuspid/scheme_3_4.svg", image: "/calculator/tricuspid/image_3_4_1.svg" },
    { id: "triple-tiltturn-tiltturn-tiltturn", name: { ru: "Поворотно-откидное | Поворотно-откидное | Поворотно-откидное", uz: "Burama-egmali | Burama-egmali | Burama-egmali", en: "Tilt-turn | Tilt-turn | Tilt-turn" }, scheme: "/calculator/tricuspid/scheme_3_4_4.svg", image: "/calculator/tricuspid/image_3_4.svg" },
  ],
  "door-single": [
    { id: "door-single-1", name: { ru: "Дверь, вариант 1", uz: "Eshik, 1-variant", en: "Door, option 1" }, scheme: "/calculator/door/single-1.webp", image: "/calculator/door/single-1.webp" },
    { id: "door-single-2", name: { ru: "Дверь, вариант 2", uz: "Eshik, 2-variant", en: "Door, option 2" }, scheme: "/calculator/door/single-2.webp", image: "/calculator/door/single-2.webp" },
    { id: "door-single-3", name: { ru: "Дверь, вариант 3", uz: "Eshik, 3-variant", en: "Door, option 3" }, scheme: "/calculator/door/single-3.webp", image: "/calculator/door/single-3.webp" },
  ],
  "door-double": [
    { id: "door-double-1", name: { ru: "Двухстворчатая", uz: "Ikki tavaqali", en: "Double-leaf" }, scheme: "/calculator/door/double-1.webp", image: "/calculator/door/double-1.webp" },
  ],
};

export const DEFAULT_VARIANT: Record<Frame, string> = {
  single: VARIANTS.single[0].id,
  double: VARIANTS.double[5].id,
  triple: VARIANTS.triple[5].id,
  "door-single": VARIANTS["door-single"][0].id,
  "door-double": VARIANTS["door-double"][0].id,
};

export function findVariant(id: string): FrameVariant | undefined {
  for (const f of FRAMES) {
    const v = VARIANTS[f].find((x) => x.id === id);
    if (v) return v;
  }
  return undefined;
}

/* -------------------------------------------------- color swatches */
/* Auto-generated from imzo.uz/api/v1/app/category/. */
export const COLOR_SWATCHES: Record<string, { name: string; img: string }> = {
  "108fcbf1169e": { name: "Метбраш платиновый", img: "/calculator/colors/108fcbf1169e.jpg" },
  "225bb0d3eea0": { name: "Белый", img: "/calculator/colors/225bb0d3eea0.jpg" },
  "22823cdffea8": { name: "Шеффилдский серый дуб", img: "/calculator/colors/22823cdffea8.jpg" },
  "3f3e87bf2470": { name: "Алюкс антрацит", img: "/calculator/colors/3f3e87bf2470.jpg" },
  "3fdc56b04eb2": { name: "Солодовый дуб", img: "/calculator/colors/3fdc56b04eb2.jpg" },
  "63b0cabbddc1": { name: "Шеффилдский высокогорный дуб", img: "/calculator/colors/63b0cabbddc1.jpg" },
  "8fdcf9ef4b7c": { name: "Серый SW 306 G", img: "/calculator/colors/8fdcf9ef4b7c.jpg" },
  "a4989620fd77": { name: "Шеффилдский бетонный дуб", img: "/calculator/colors/a4989620fd77.jpg" },
  "b174136bf128": { name: "Метбраш серый кварц", img: "/calculator/colors/b174136bf128.jpg" },
  "d72194dd7663": { name: "Метбраш серый антрацит", img: "/calculator/colors/d72194dd7663.jpg" },
  "e6959603c6f6": { name: "Железно-серый", img: "/calculator/colors/e6959603c6f6.jpg" },
  "e76be692729f": { name: "Дуб мокко", img: "/calculator/colors/e76be692729f.jpg" },
  "eda263982875": { name: "Бело-алюминиевый", img: "/calculator/colors/eda263982875.png" },
  "efc70dd53af2": { name: "Золотой дуб", img: "/calculator/colors/efc70dd53af2.jpg" },
};

/* ------------------------------------------------- profile serials */
export interface ProfileSerial {
  id: string;
  name: string;
  lamination: string[];
  fittings: { id: string; name: string; colors: string[] }[];
}

export const SERIAL_CATALOG: Record<Product, Partial<Record<MaterialType, ProfileSerial[]>>> = {
  window: {
    pvc: [
      { id: "trio-60", name: "Trio 60", lamination: ["e76be692729f", "225bb0d3eea0", "8fdcf9ef4b7c", "efc70dd53af2", "3fdc56b04eb2"], fittings: [
        { id: "akfa", name: "Akfa", colors: ["225bb0d3eea0"] },
        { id: "roto-lux", name: "Roto lux", colors: ["225bb0d3eea0", "22823cdffea8", "efc70dd53af2", "e76be692729f", "3fdc56b04eb2"] },
      ] },
      { id: "quattro-60", name: "Quattro 60", lamination: ["e76be692729f", "225bb0d3eea0", "8fdcf9ef4b7c", "efc70dd53af2", "3fdc56b04eb2"], fittings: [
        { id: "akfa", name: "Akfa", colors: ["225bb0d3eea0"] },
        { id: "stick", name: "Stick", colors: ["225bb0d3eea0"] },
        { id: "roto-lux", name: "Roto lux", colors: ["225bb0d3eea0", "22823cdffea8", "efc70dd53af2", "e76be692729f", "3fdc56b04eb2"] },
        { id: "roto-swing", name: "Roto swing", colors: [] },
      ] },
      { id: "engelberg-70", name: "Engelberg 70", lamination: ["e76be692729f", "22823cdffea8", "3f3e87bf2470", "3fdc56b04eb2", "63b0cabbddc1", "b174136bf128", "efc70dd53af2", "d72194dd7663", "225bb0d3eea0", "a4989620fd77", "108fcbf1169e"], fittings: [
        { id: "akfa", name: "Akfa", colors: ["225bb0d3eea0"] },
        { id: "stick", name: "Stick", colors: ["225bb0d3eea0"] },
        { id: "roto-lux", name: "Roto lux", colors: ["225bb0d3eea0", "22823cdffea8", "efc70dd53af2", "e76be692729f", "3fdc56b04eb2"] },
        { id: "roto-swing", name: "Roto swing", colors: [] },
        { id: "hoppe-ny", name: "Hoppe ny", colors: [] },
        { id: "hoppe-hamburg", name: "Hoppe hamburg", colors: [] },
      ] },
      { id: "engelberg-80", name: "Engelberg 80", lamination: ["3f3e87bf2470", "3fdc56b04eb2", "a4989620fd77", "d72194dd7663", "e76be692729f", "108fcbf1169e", "225bb0d3eea0", "22823cdffea8", "63b0cabbddc1", "b174136bf128", "efc70dd53af2"], fittings: [
        { id: "akfa", name: "Akfa", colors: ["225bb0d3eea0"] },
        { id: "stick", name: "Stick", colors: ["225bb0d3eea0"] },
        { id: "roto-lux", name: "Roto lux", colors: ["225bb0d3eea0", "22823cdffea8", "efc70dd53af2", "e76be692729f", "3fdc56b04eb2"] },
        { id: "roto-swing", name: "Roto swing", colors: [] },
        { id: "hoppe-ny", name: "Hoppe ny", colors: [] },
        { id: "hoppe-hamburg", name: "Hoppe hamburg", colors: [] },
      ] },
    ],
    aluminum: [
      { id: "champion", name: "Champion", lamination: ["e6959603c6f6", "e76be692729f", "22823cdffea8", "8fdcf9ef4b7c", "eda263982875", "3f3e87bf2470", "efc70dd53af2", "225bb0d3eea0"], fittings: [
        { id: "master", name: "Master", colors: ["225bb0d3eea0", "3f3e87bf2470"] },
        { id: "stublina", name: "Stublina", colors: ["225bb0d3eea0", "3f3e87bf2470"] },
      ] },
      { id: "thermo-57-engelberg", name: "Thermo 57 Engelberg", lamination: ["e6959603c6f6", "efc70dd53af2", "22823cdffea8", "eda263982875", "d72194dd7663", "b174136bf128", "108fcbf1169e", "e76be692729f", "3fdc56b04eb2", "3f3e87bf2470", "8fdcf9ef4b7c", "225bb0d3eea0", "63b0cabbddc1", "a4989620fd77"], fittings: [
        { id: "master", name: "Master", colors: ["225bb0d3eea0", "3f3e87bf2470"] },
        { id: "stublina", name: "Stublina", colors: ["225bb0d3eea0", "3f3e87bf2470"] },
      ] },
      { id: "thermo-65-engelberg", name: "Thermo 65 Engelberg", lamination: ["e6959603c6f6", "a4989620fd77", "225bb0d3eea0", "d72194dd7663", "eda263982875", "8fdcf9ef4b7c", "3f3e87bf2470", "efc70dd53af2", "63b0cabbddc1", "108fcbf1169e", "22823cdffea8", "e76be692729f", "3fdc56b04eb2", "b174136bf128"], fittings: [
        { id: "master", name: "Master", colors: ["225bb0d3eea0", "3f3e87bf2470"] },
        { id: "stublina", name: "Stublina", colors: ["225bb0d3eea0", "3f3e87bf2470"] },
      ] },
      { id: "thermo-78-engelberg", name: "Thermo 78 Engelberg", lamination: ["e76be692729f", "3fdc56b04eb2", "3f3e87bf2470", "d72194dd7663", "225bb0d3eea0", "8fdcf9ef4b7c", "108fcbf1169e", "e6959603c6f6", "a4989620fd77", "eda263982875", "b174136bf128", "efc70dd53af2", "63b0cabbddc1", "22823cdffea8"], fittings: [
        { id: "master", name: "Master", colors: ["225bb0d3eea0", "3f3e87bf2470"] },
        { id: "stublina", name: "Stublina", colors: ["225bb0d3eea0", "3f3e87bf2470"] },
      ] },
      { id: "thermo-98-engelberg", name: "Thermo 98 Engelberg", lamination: ["e6959603c6f6", "a4989620fd77", "eda263982875", "b174136bf128", "108fcbf1169e", "22823cdffea8", "3f3e87bf2470", "efc70dd53af2", "63b0cabbddc1", "225bb0d3eea0", "8fdcf9ef4b7c", "d72194dd7663", "e76be692729f", "3fdc56b04eb2"], fittings: [
        { id: "master", name: "Master", colors: ["225bb0d3eea0", "3f3e87bf2470"] },
        { id: "stublina", name: "Stublina", colors: ["225bb0d3eea0", "3f3e87bf2470"] },
      ] },
      { id: "thermo-105-engelberg", name: "Thermo 105 Engelberg", lamination: ["22823cdffea8", "a4989620fd77", "b174136bf128"], fittings: [
        { id: "master", name: "Master", colors: ["225bb0d3eea0", "3f3e87bf2470"] },
        { id: "stublina", name: "Stublina", colors: ["225bb0d3eea0", "3f3e87bf2470"] },
      ] },
    ],
  },
  door: {
    aluminum: [
      { id: "champion", name: "Champion", lamination: ["225bb0d3eea0", "3f3e87bf2470"], fittings: [] },
    ],
  },
};

export function getSerials(p: Product, mt: MaterialType): ProfileSerial[] {
  return SERIAL_CATALOG[p][mt] ?? [];
}

export function findSerial(p: Product, mt: MaterialType, id: string): ProfileSerial | undefined {
  return getSerials(p, mt).find((s) => s.id === id);
}

export function getMaterialTypesFor(p: Product): MaterialType[] {
  return (Object.keys(SERIAL_CATALOG[p]) as MaterialType[]).filter(
    (mt) => (SERIAL_CATALOG[p][mt] ?? []).length > 0,
  );
}

/* -------------------------------------------------- components */
export const COMPONENTS = ["sill", "mosquito", "ebb"] as const;
export type ComponentKey = (typeof COMPONENTS)[number];

export interface ComponentState {
  enabled: boolean;
  width: number;
}

/* -------------------------------------------------- glass options */
export const GLASS_OPTIONS = [
  "single24",
  "double32",
  "energy",
  "argon",
  "multimix",
  "single",
] as const;
export type GlassOption = (typeof GLASS_OPTIONS)[number];

/* -------------------------------------------------- pricing */
const GLASS_PRICE_PER_M2: Record<GlassOption, number> = {
  single: 320_000,
  single24: 420_000,
  double32: 540_000,
  energy: 620_000,
  argon: 660_000,
  multimix: 780_000,
};

const PRODUCT_FACTOR: Record<Product, number> = {
  window: 1,
  door: 1.25,
};

const MATERIAL_FACTOR: Record<MaterialType, number> = {
  pvc: 1,
  aluminum: 1.18,
};

const FRAME_FACTOR: Record<Frame, number> = {
  single: 1,
  double: 1.12,
  triple: 1.22,
  "door-single": 1,
  "door-double": 1.18,
};

const COMPONENT_PRICE_PER_M: Record<ComponentKey, number> = {
  sill: 140_000,     // подоконник за метр погонный
  mosquito: 95_000,  // москитка за метр (берётся ширина)
  ebb: 70_000,       // отлив за метр
};

/* -------------------------------------------------- state */
/** A single item in the multi-config cart — one configured window/door. */
export interface ProductConfig {
  id: string;
  product: Product;
  materialType: MaterialType;
  serial: string;
  frame: Frame;
  variantId: string;
  lamination: string;
  fittingBrand: string;
  fittingColor: string;
  glass: GlassOption;
  width: number;
  height: number;
  quantity: number;
  components: Record<ComponentKey, ComponentState>;
}

export interface CalcState {
  /** All configured items in the cart. Always has at least one entry. */
  items: ProductConfig[];
  /** Index into `items` of the item currently shown in the editor. */
  activeIndex: number;
  /** Shared contact form — one set of contacts per request. */
  name: string;
  phone: string;
  email: string;
  address: string;
  comment: string;
}

/** Hard cap mirroring imzo (max 20 items per request). */
export const MAX_ITEMS = 20;

/** Generates a stable id for a fresh cart item. */
function newItemId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().slice(0, 8);
  }
  return Math.random().toString(36).slice(2, 10);
}

const initialSerial = SERIAL_CATALOG.window.pvc![2]; // Engelberg 70

/** Factory for a fresh configurator item. */
export function defaultProductConfig(
  overrides: Partial<ProductConfig> = {},
): ProductConfig {
  const product = overrides.product ?? "window";
  const ser = product === "door"
    ? SERIAL_CATALOG.door.aluminum![0]
    : initialSerial;
  const frame: Frame =
    overrides.frame ?? (product === "door" ? "door-single" : "double");
  return {
    id: newItemId(),
    product,
    materialType: product === "door" ? "aluminum" : "pvc",
    serial: ser.id,
    frame,
    variantId: DEFAULT_VARIANT[frame],
    lamination: ser.lamination[1] ?? ser.lamination[0] ?? "",
    fittingBrand: ser.fittings[0]?.id ?? "",
    fittingColor: ser.fittings[0]?.colors[0] ?? "",
    glass: "double32",
    width: 1400,
    height: 1400,
    quantity: 1,
    components: {
      sill: { enabled: false, width: 1400 },
      mosquito: { enabled: false, width: 1400 },
      ebb: { enabled: false, width: 1400 },
    },
    ...overrides,
  };
}

export const initialCalcState: CalcState = {
  items: [defaultProductConfig()],
  activeIndex: 0,
  name: "",
  phone: "",
  email: "",
  address: "",
  comment: "",
};

/** Price estimate for a single item (UZS). */
export function estimateItem(c: ProductConfig): number {
  const widthM = Math.max(0, Number(c.width) || 0) / 1000;
  const heightM = Math.max(0, Number(c.height) || 0) / 1000;
  const areaM2 = widthM * heightM;
  const base = GLASS_PRICE_PER_M2[c.glass] * areaM2;
  let unit =
    base *
    PRODUCT_FACTOR[c.product] *
    MATERIAL_FACTOR[c.materialType] *
    FRAME_FACTOR[c.frame];

  for (const k of COMPONENTS) {
    const co = c.components[k];
    if (!co.enabled) continue;
    const wM = Math.max(0, Number(co.width) || 0) / 1000;
    unit += COMPONENT_PRICE_PER_M[k] * wM;
  }

  const qty = Math.max(1, Number(c.quantity) || 1);
  return Math.round((unit * qty) / 1000) * 1000;
}

/** Total across all items in the cart. */
export function estimateTotal(s: CalcState): number {
  return s.items.reduce((sum, c) => sum + estimateItem(c), 0);
}

/** Back-compat: some old callers may still import estimatePrice. */
export const estimatePrice = estimateTotal;

/**
 * Human-readable label for an item tab — numbered per product so the user
 * sees "Окно №1, Окно №2, Дверь №1" rather than a flat index.
 */
export function itemLabel(
  items: ProductConfig[],
  index: number,
  productNames: Record<Product, string>,
): string {
  const item = items[index];
  if (!item) return "";
  const nthOfKind =
    items.slice(0, index + 1).filter((x) => x.product === item.product).length;
  return `${productNames[item.product]} №${nthOfKind}`;
}

/* Back-compat — kept while older imports still reference these. The new
 * configurator uses SERIAL_CATALOG and COLOR_SWATCHES instead. */
export const COLORS = [
  { id: "white", hex: "#ffffff" },
  { id: "darkOak", hex: "#5a3a1f" },
  { id: "graphite", hex: "#181818" },
  { id: "nut", hex: "#7c5a32" },
  { id: "golden", hex: "#c8a26a" },
] as const;
export type ColorId = (typeof COLORS)[number]["id"];

export const SERIES_OPTIONS = PROFILE_SERIES.filter(
  (p) => p.category === "pvc",
).map((p) => p.slug);
