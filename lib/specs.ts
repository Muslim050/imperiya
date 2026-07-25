import type { SpecValue } from "@/data/catalog";
import type { LangCode } from "@/i18n/config";

/** Minimal shape of a translator — satisfied by react-i18next's `t` and
 *  by `lookup()` below, so one formatter serves client and server. */
export type Translate = (key: string) => string;

/**
 * Renders one spec cell in the active language.
 *
 * Measurements keep their number and swap only the unit, so "70 мм"
 * becomes "70 mm". English also takes a decimal point instead of the
 * comma used in Russian and Uzbek ("1,4 мм" → "1.4 mm").
 */
export function formatSpecValue(
  value: SpecValue,
  t: Translate,
  lang: LangCode,
): string {
  if ("term" in value) return t(`specs.values.${value.term}`);
  if ("plain" in value) return value.plain;

  const measure =
    lang === "en" ? value.measure.replace(/,/g, ".") : value.measure;

  return `${measure} ${t(`specs.units.${value.unit}`)}`;
}

/**
 * Turns a plain locale object into a `Translate`. Server metadata has no
 * react-i18next instance, but it does import the locale modules directly.
 */
export const lookup =
  (dict: unknown): Translate =>
  (key) =>
    key
      .split(".")
      .reduce<unknown>(
        (node, part) =>
          node && typeof node === "object"
            ? (node as Record<string, unknown>)[part]
            : undefined,
        dict,
      ) as string;
