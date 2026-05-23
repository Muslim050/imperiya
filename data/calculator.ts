/**
 * Calculator model — replicates the visual UX of the imzo.uz configurator
 * referenced in the TZ. We keep our 5-step flow (type / sizes / params /
 * extras / contacts) but the picker on step 1 now operates on real
 * one/two/three-sash frames with opening-direction variants, each backed by
 * a photorealistic SVG preview under public/calculator/.
 *
 * Pricing here is an indicative estimate only; the TZ states the final
 * price is confirmed after an on-site measurement.
 */
import { PROFILE_SERIES } from "./catalog";

export const CONSTRUCTION_TYPES = [
  "window",
  "door",
  "stained",
  "balcony",
  "facade",
] as const;
export type ConstructionType = (typeof CONSTRUCTION_TYPES)[number];

/**
 * Frame keys are unique across construction types. Window frames count
 * sashes (single/double/triple); door frames are namespaced because their
 * artwork, sizes and pricing differ from window frames with the same sash
 * count.
 */
export const FRAMES = [
  "single",
  "double",
  "triple",
  "door-single",
  "door-double",
] as const;
export type Frame = (typeof FRAMES)[number];

/** Locale-aware name with all three site languages baked in. */
export interface TripleLang {
  ru: string;
  uz: string;
  en: string;
}

export interface FrameVariant {
  /** Stable variant id used in CalcState. Format: `<frame>-<n>`. */
  id: string;
  name: TripleLang;
  /** Small thumbnail (92×120) shown in the picker grid. */
  scheme: string;
  /** Big preview (260×260) shown in the right-hand panel. */
  image: string;
}

/** Allowed size ranges per frame, in millimetres. */
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

/**
 * Frames available per construction type. Types not listed here fall through
 * to an "individual quote" panel in the UI (no online configuration).
 */
export const FRAMES_BY_TYPE: Partial<Record<ConstructionType, Frame[]>> = {
  window: ["single", "double", "triple"],
  door: ["door-single", "door-double"],
};

export function getFramesFor(t: ConstructionType): Frame[] {
  return FRAMES_BY_TYPE[t] ?? [];
}

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
    {
      id: "double-blind-blind",
      name: { ru: "Глухое | Глухое", uz: "Karra | Karra", en: "Fixed | Fixed" },
      scheme: "/calculator/double/scheme_2_1.svg",
      image: "/calculator/double/image_2_1.svg",
    },
    {
      id: "double-turn-blind",
      name: {
        ru: "Поворотное | Глухое",
        uz: "Burama | Karra",
        en: "Turn | Fixed",
      },
      scheme: "/calculator/double/scheme_2_2.svg",
      image: "/calculator/double/image_2_2.svg",
    },
    {
      id: "double-tiltturn-blind",
      name: {
        ru: "Поворотно-откидное | Глухое",
        uz: "Burama-egmali | Karra",
        en: "Tilt-turn | Fixed",
      },
      scheme: "/calculator/double/scheme_2_2_1.svg",
      image: "/calculator/double/image_2_2.svg",
    },
    {
      id: "double-blind-turn",
      name: {
        ru: "Глухое | Поворотное",
        uz: "Karra | Burama",
        en: "Fixed | Turn",
      },
      scheme: "/calculator/double/scheme_2_3.svg",
      image: "/calculator/double/image_2_3.svg",
    },
    {
      id: "double-blind-tiltturn",
      name: {
        ru: "Глухое | Поворотно-откидное",
        uz: "Karra | Burama-egmali",
        en: "Fixed | Tilt-turn",
      },
      scheme: "/calculator/double/scheme_2_3_1.svg",
      image: "/calculator/double/image_2_3.svg",
    },
    {
      id: "double-turn-turn",
      name: {
        ru: "Поворотное | Поворотное",
        uz: "Burama | Burama",
        en: "Turn | Turn",
      },
      scheme: "/calculator/double/scheme_2_4.svg",
      image: "/calculator/double/image_2_4.svg",
    },
    {
      id: "double-turn-tiltturn",
      name: {
        ru: "Поворотное | Поворотно-откидное",
        uz: "Burama | Burama-egmali",
        en: "Turn | Tilt-turn",
      },
      scheme: "/calculator/double/scheme_2_4_2.svg",
      image: "/calculator/double/image_2_4.svg",
    },
    {
      id: "double-tiltturn-turn",
      name: {
        ru: "Поворотно-откидное | Поворотное",
        uz: "Burama-egmali | Burama",
        en: "Tilt-turn | Turn",
      },
      scheme: "/calculator/double/scheme_2_4_1.svg",
      image: "/calculator/double/image_2_4.svg",
    },
    {
      id: "double-tiltturn-tiltturn",
      name: {
        ru: "Поворотно-откидное | Поворотно-откидное",
        uz: "Burama-egmali | Burama-egmali",
        en: "Tilt-turn | Tilt-turn",
      },
      scheme: "/calculator/double/scheme_2_4_4.svg",
      image: "/calculator/double/image_2_4.svg",
    },
  ],
  triple: [
    {
      id: "triple-blind-blind-blind",
      name: {
        ru: "Глухое | Глухое | Глухое",
        uz: "Karra | Karra | Karra",
        en: "Fixed | Fixed | Fixed",
      },
      scheme: "/calculator/tricuspid/scheme_3_1.svg",
      image: "/calculator/tricuspid/image_3_1.svg",
    },
    {
      id: "triple-turn-blind-turn",
      name: {
        ru: "Поворотное | Глухое | Поворотное",
        uz: "Burama | Karra | Burama",
        en: "Turn | Fixed | Turn",
      },
      scheme: "/calculator/tricuspid/scheme_3_2.svg",
      image: "/calculator/tricuspid/image_3_2.svg",
    },
    {
      id: "triple-tiltturn-blind-tiltturn",
      name: {
        ru: "Поворотно-откидное | Глухое | Поворотно-откидное",
        uz: "Burama-egmali | Karra | Burama-egmali",
        en: "Tilt-turn | Fixed | Tilt-turn",
      },
      scheme: "/calculator/tricuspid/scheme_3_2_1.svg",
      image: "/calculator/tricuspid/image_3_2.svg",
    },
    {
      id: "triple-blindturn-blind",
      name: {
        ru: "Глухое, Поворотное | Глухое",
        uz: "Karra, Burama | Karra",
        en: "Fixed, Turn | Fixed",
      },
      scheme: "/calculator/tricuspid/scheme_3_3.svg",
      image: "/calculator/tricuspid/image_3_3.svg",
    },
    {
      id: "triple-blind-tiltturn-blind",
      name: {
        ru: "Глухое | Поворотно-откидное | Глухое",
        uz: "Karra | Burama-egmali | Karra",
        en: "Fixed | Tilt-turn | Fixed",
      },
      scheme: "/calculator/tricuspid/scheme_3_3_1.svg",
      image: "/calculator/tricuspid/image_3_3.svg",
    },
    {
      id: "triple-turn-turn-turn",
      name: {
        ru: "Поворотное | Поворотное | Поворотное",
        uz: "Burama | Burama | Burama",
        en: "Turn | Turn | Turn",
      },
      scheme: "/calculator/tricuspid/scheme_3_4.svg",
      image: "/calculator/tricuspid/image_3_4_1.svg",
    },
    {
      id: "triple-tiltturn-tiltturn-tiltturn",
      name: {
        ru: "Поворотно-откидное | Поворотно-откидное | Поворотно-откидное",
        uz: "Burama-egmali | Burama-egmali | Burama-egmali",
        en: "Tilt-turn | Tilt-turn | Tilt-turn",
      },
      scheme: "/calculator/tricuspid/scheme_3_4_4.svg",
      image: "/calculator/tricuspid/image_3_4.svg",
    },
  ],
  // Door artwork uses the same file for thumbnail and big preview — imzo's
  // configurator ships only ~300px-tall portraits, which work fine in both
  // slots.
  "door-single": [
    {
      id: "door-single-1",
      name: { ru: "Дверь, вариант 1", uz: "Eshik, 1-variant", en: "Door, option 1" },
      scheme: "/calculator/door/single-1.webp",
      image: "/calculator/door/single-1.webp",
    },
    {
      id: "door-single-2",
      name: { ru: "Дверь, вариант 2", uz: "Eshik, 2-variant", en: "Door, option 2" },
      scheme: "/calculator/door/single-2.webp",
      image: "/calculator/door/single-2.webp",
    },
    {
      id: "door-single-3",
      name: { ru: "Дверь, вариант 3", uz: "Eshik, 3-variant", en: "Door, option 3" },
      scheme: "/calculator/door/single-3.webp",
      image: "/calculator/door/single-3.webp",
    },
  ],
  "door-double": [
    {
      id: "door-double-1",
      name: {
        ru: "Двухстворчатая",
        uz: "Ikki tavaqali",
        en: "Double-leaf",
      },
      scheme: "/calculator/door/double-1.webp",
      image: "/calculator/door/double-1.webp",
    },
  ],
};

/** Default variant per frame (used when the user switches frame). */
export const DEFAULT_VARIANT: Record<Frame, string> = {
  single: VARIANTS.single[0].id,
  double: VARIANTS.double[5].id, // Поворотное | Поворотное — most photogenic
  triple: VARIANTS.triple[5].id, // 3-sash turn
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

export function frameOfVariant(id: string): Frame {
  for (const f of FRAMES) {
    if (VARIANTS[f].some((v) => v.id === id)) return f;
  }
  return "double";
}

/** Lamination colors shown as swatches in the mockup. */
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

export const GLASS_OPTIONS = [
  "single24",
  "double32",
  "energy",
  "argon",
  "multimix",
  "single",
] as const;
export type GlassOption = (typeof GLASS_OPTIONS)[number];

/** Base price per m² (indicative, in UZS) by glass type. */
const GLASS_PRICE_PER_M2: Record<GlassOption, number> = {
  single: 320_000,
  single24: 420_000,
  double32: 540_000,
  energy: 620_000,
  argon: 660_000,
  multimix: 780_000,
};

const TYPE_FACTOR: Record<ConstructionType, number> = {
  window: 1,
  door: 1.25,
  stained: 1.4,
  balcony: 1.15,
  facade: 1.6,
};

/** Larger frames carry slightly more profile, ironwork and labour cost. */
const FRAME_FACTOR: Record<Frame, number> = {
  single: 1,
  double: 1.12,
  triple: 1.22,
  // Door frames are baselined to window-double's labour cost and scale up
  // for the double-leaf variant. TYPE_FACTOR.door already adds the door
  // premium, so we keep the frame multiplier modest here.
  "door-single": 1,
  "door-double": 1.18,
};

const MOSQUITO_PRICE = 180_000;
const SILL_PRICE = 140_000;

export interface CalcState {
  type: ConstructionType;
  frame: Frame;
  variantId: string;
  color: ColorId;
  series: string;
  glass: GlassOption;
  width: number;
  height: number;
  quantity: number;
  mosquito: boolean;
  sill: boolean;
  name: string;
  phone: string;
  comment: string;
}

export const initialCalcState: CalcState = {
  type: "window",
  frame: "double",
  variantId: DEFAULT_VARIANT.double,
  color: "white",
  series: SERIES_OPTIONS[0],
  glass: "double32",
  width: 1400,
  height: 1400,
  quantity: 1,
  mosquito: false,
  sill: false,
  name: "",
  phone: "",
  comment: "",
};

export function estimatePrice(s: CalcState): number {
  const widthM = Math.max(0, Number(s.width) || 0) / 1000;
  const heightM = Math.max(0, Number(s.height) || 0) / 1000;
  const areaM2 = widthM * heightM;
  const base = GLASS_PRICE_PER_M2[s.glass] * areaM2;
  let unit = base * TYPE_FACTOR[s.type] * FRAME_FACTOR[s.frame];
  if (s.mosquito) unit += MOSQUITO_PRICE;
  if (s.sill) unit += SILL_PRICE;
  const qty = Math.max(1, Number(s.quantity) || 1);
  return Math.round((unit * qty) / 1000) * 1000;
}
