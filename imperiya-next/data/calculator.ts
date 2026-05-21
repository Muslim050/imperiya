/**
 * Calculator model — mirrors the imzo.uz calculator referenced in the TZ,
 * but the size step uses plain numeric inputs ("Надо просто сделать чтобы
 * вставлять цифры") instead of the confusing sliders.
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

export const SHAPES = [
  "single",
  "double",
  "triple",
  "panoramic",
  "balcony",
] as const;
export type Shape = (typeof SHAPES)[number];

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

const SHAPE_FACTOR: Record<Shape, number> = {
  single: 1,
  double: 1.1,
  triple: 1.2,
  panoramic: 1.35,
  balcony: 1.25,
};

const MOSQUITO_PRICE = 180_000;
const SILL_PRICE = 140_000;

export interface CalcState {
  type: ConstructionType;
  shape: Shape;
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
  shape: "double",
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
  let unit = base * TYPE_FACTOR[s.type] * SHAPE_FACTOR[s.shape];
  if (s.mosquito) unit += MOSQUITO_PRICE;
  if (s.sill) unit += SILL_PRICE;
  const qty = Math.max(1, Number(s.quantity) || 1);
  return Math.round((unit * qty) / 1000) * 1000;
}
