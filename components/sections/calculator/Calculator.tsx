"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn, formatPrice } from "@/lib/utils";
import { scrollToAnchor } from "@/lib/scrollToAnchor";
import { WindowPreview } from "./WindowPreview";
import { FRAME_PICTO } from "./shapes";
import {
  PRODUCTS,
  COMPONENTS,
  VARIANTS,
  DEFAULT_VARIANT,
  FRAMES_BY_PRODUCT,
  FRAME_SIZE_LIMITS,
  GLASS_OPTIONS,
  SERIAL_CATALOG,
  COLOR_SWATCHES,
  MAX_ITEMS,
  defaultProductConfig,
  estimateItem,
  estimateTotal,
  findSerial,
  findVariant,
  getMaterialTypesFor,
  getSerials,
  initialCalcState,
  itemLabel,
  type CalcState,
  type ComponentKey,
  type Frame,
  type MaterialType,
  type Product,
  type ProductConfig,
} from "@/data/calculator";

const SECTION_TITLE =
  "m-0 mb-3 text-[11px] font-extrabold uppercase tracking-[0.14em] text-ink-2";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-[#ECECEC] pt-5 first:border-t-0 first:pt-0">
      <h4 className={SECTION_TITLE}>{title}</h4>
      {children}
    </div>
  );
}

function ColorSwatchButton({
  id,
  on,
  onClick,
}: {
  id: string;
  on: boolean;
  onClick: () => void;
}) {
  const sw = COLOR_SWATCHES[id];
  if (!sw) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      title={sw.name}
      aria-label={sw.name}
      className={cn(
        "relative size-[34px] overflow-hidden border bg-cover bg-center transition-all",
        on
          ? "border-[#ddd] outline outline-[1.5px] outline-orange outline-offset-2"
          : "border-[#ddd] hover:outline hover:outline-[1px] hover:outline-[#bbb] hover:outline-offset-1",
      )}
      style={{ backgroundImage: `url(${sw.img})` }}
    />
  );
}

export function Calculator() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language?.slice(0, 2) ?? "ru") as "ru" | "uz" | "en";
  const [state, setState] = useState<CalcState>(initialCalcState);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [step, setStep] = useState(1);

  const wizardSteps = [
    t("calc.wizard.construction"),
    t("calc.wizard.configuration"),
    t("calc.wizard.estimate"),
    t("calc.wizard.contacts"),
  ];

  function goToStep(nextStep: number) {
    setStep(Math.max(1, Math.min(4, nextStep)));
    setError(false);
    requestAnimationFrame(() => scrollToAnchor("calculator"));
  }

  /* ------------------------- active item shortcuts ------------------ */
  const item = state.items[state.activeIndex] ?? state.items[0];
  const total = useMemo(() => estimateTotal(state), [state]);
  const itemPrice = useMemo(() => estimateItem(item), [item]);

  const productNames: Record<Product, string> = {
    window: t("calc.products.window"),
    door: t("calc.products.door"),
  };

  /* Generic mutators */
  function patchActive(patch: Partial<ProductConfig>) {
    setState((s) => ({
      ...s,
      items: s.items.map((c, i) =>
        i === s.activeIndex ? { ...c, ...patch } : c,
      ),
    }));
  }
  function setActive(idx: number) {
    setState((s) => ({ ...s, activeIndex: idx }));
  }
  function setContact<K extends "name" | "phone" | "email" | "address" | "comment">(
    k: K,
    v: string,
  ) {
    setState((s) => ({ ...s, [k]: v }));
  }

  /* Cart ops */
  function addItem(productHint: Product = "window") {
    setState((s) => {
      if (s.items.length >= MAX_ITEMS) return s;
      const fresh = defaultProductConfig({ product: productHint });
      return { ...s, items: [...s.items, fresh], activeIndex: s.items.length };
    });
  }
  function removeItem(idx: number) {
    setState((s) => {
      if (s.items.length <= 1) return s; // never empty the cart
      const items = s.items.filter((_, i) => i !== idx);
      const activeIndex = Math.min(s.activeIndex, items.length - 1);
      return { ...s, items, activeIndex };
    });
  }

  /* Coherence helpers (rebuild dependent fields on parent changes) */
  function changeProduct(p: Product) {
    patchActiveWithCoherence((c) => {
      const mts = getMaterialTypesFor(p);
      const mt = mts.includes(c.materialType) ? c.materialType : mts[0];
      const ser = SERIAL_CATALOG[p][mt]?.[0];
      const frames = FRAMES_BY_PRODUCT[p];
      const f = frames.includes(c.frame) ? c.frame : frames[0];
      return {
        product: p,
        materialType: mt,
        serial: ser?.id ?? "",
        lamination: ser?.lamination[1] ?? ser?.lamination[0] ?? "",
        fittingBrand: ser?.fittings[0]?.id ?? "",
        fittingColor: ser?.fittings[0]?.colors[0] ?? "",
        frame: f,
        variantId: DEFAULT_VARIANT[f],
      };
    });
  }
  function changeMaterial(mt: MaterialType) {
    patchActiveWithCoherence((c) => {
      const ser = SERIAL_CATALOG[c.product][mt]?.[0];
      return {
        materialType: mt,
        serial: ser?.id ?? "",
        lamination: ser?.lamination[1] ?? ser?.lamination[0] ?? "",
        fittingBrand: ser?.fittings[0]?.id ?? "",
        fittingColor: ser?.fittings[0]?.colors[0] ?? "",
      };
    });
  }
  function changeSerial(id: string) {
    patchActiveWithCoherence((c) => {
      const ser = findSerial(c.product, c.materialType, id);
      return {
        serial: id,
        lamination: ser?.lamination[1] ?? ser?.lamination[0] ?? "",
        fittingBrand: ser?.fittings[0]?.id ?? "",
        fittingColor: ser?.fittings[0]?.colors[0] ?? "",
      };
    });
  }
  function changeFrame(f: Frame) {
    patchActive({ frame: f, variantId: DEFAULT_VARIANT[f] });
  }
  function changeFitting(brandId: string) {
    const serial = findSerial(item.product, item.materialType, item.serial);
    const b = serial?.fittings.find((x) => x.id === brandId);
    patchActive({ fittingBrand: brandId, fittingColor: b?.colors[0] ?? "" });
  }
  function changeComponent(k: ComponentKey, patch: Partial<{ enabled: boolean; width: number }>) {
    patchActive({
      components: { ...item.components, [k]: { ...item.components[k], ...patch } },
    });
  }

  function patchActiveWithCoherence(
    fn: (c: ProductConfig) => Partial<ProductConfig>,
  ) {
    setState((s) => ({
      ...s,
      items: s.items.map((c, i) =>
        i === s.activeIndex ? { ...c, ...fn(c) } : c,
      ),
    }));
  }

  /* Sync component widths with master width while disabled */
  useEffect(() => {
    setState((s) => ({
      ...s,
      items: s.items.map((c, i) => {
        if (i !== s.activeIndex) return c;
        const next: ProductConfig["components"] = { ...c.components };
        for (const k of COMPONENTS) {
          if (!next[k].enabled) next[k] = { ...next[k], width: c.width };
        }
        return { ...c, components: next };
      }),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.width, state.activeIndex]);

  function submit() {
    if (!state.name.trim() || !state.phone.trim()) {
      setError(true);
      return;
    }
    setSubmitted(true);
  }

  /* Derivations off the active item */
  const materialTypes = getMaterialTypesFor(item.product);
  const serials = getSerials(item.product, item.materialType);
  const serial =
    findSerial(item.product, item.materialType, item.serial) ?? serials[0];
  const variant = findVariant(item.variantId) ?? VARIANTS.double[0];
  const variantName = variant.name[lang] ?? variant.name.ru;
  const availableFrames = FRAMES_BY_PRODUCT[item.product];
  const limits = FRAME_SIZE_LIMITS[item.frame];
  const currentFitting = serial?.fittings.find((f) => f.id === item.fittingBrand);
  const canAdd = state.items.length < MAX_ITEMS;
  const canRemove = state.items.length > 1;

  return (
    <section id="calculator" className="scroll-mt-40 bg-bg py-10 sm:py-[38px]">
      <div className="inner">
        <h2 className="m-0 mb-1 text-[22px] font-extrabold uppercase tracking-[0.02em]">
          {t("calc.title")}
        </h2>
        <div className="mb-[22px] text-[13px] text-[#777]">
          {t("calc.subtitle")}
        </div>

        {!submitted && (
          <div className="mb-5 overflow-hidden border border-[#E7E7E7] bg-white px-4 py-4 sm:px-6">
            <div className="mb-3 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.1em] text-[#777] sm:hidden">
              <span>{t("calc.wizard.progress", { current: step, total: wizardSteps.length })}</span>
              <span className="text-orange">{wizardSteps[step - 1]}</span>
            </div>
            <div className="relative hidden sm:grid sm:grid-cols-4">
              <span className="absolute top-4 right-[12.5%] left-[12.5%] h-px bg-[#E5E5E5]" />
              <span
                className="absolute top-4 left-[12.5%] h-px bg-orange transition-[width] duration-300"
                style={{ width: `${((step - 1) / 3) * 75}%` }}
              />
              {wizardSteps.map((label, index) => {
                const number = index + 1;
                const active = number === step;
                const complete = number < step;
                return (
                  <button
                    key={label}
                    type="button"
                    disabled={number > step}
                    onClick={() => goToStep(number)}
                    className="relative z-[1] flex flex-col items-center gap-2 px-2 text-center disabled:cursor-default"
                  >
                    <span
                      className={cn(
                        "grid size-8 place-items-center rounded-full border text-[12px] font-extrabold transition-colors",
                        active || complete
                          ? "border-orange bg-orange text-white"
                          : "border-[#D8D8D8] bg-white text-[#999]",
                      )}
                    >
                      {complete ? "✓" : number}
                    </span>
                    <span className={cn("text-[11px] font-semibold", active ? "text-ink-2" : "text-[#888]")}>{label}</span>
                  </button>
                );
              })}
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[#ECECEC] sm:hidden">
              <div className="h-full bg-orange transition-[width] duration-300" style={{ width: `${(step / 4) * 100}%` }} />
            </div>
          </div>
        )}

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">
          {/* ============================== LEFT: configurator ===== */}
          <div className="mx-auto w-full max-w-[760px] border border-[#ECECEC] bg-white p-4 sm:p-6 lg:mx-0 lg:max-w-none">
            {submitted ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                <span className="grid size-14 place-items-center rounded-full bg-[#FFF6EB] text-orange">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <p className="mt-4 max-w-sm text-base font-semibold text-ink-2">
                  {t("calc.success")}
                </p>
                <p className="mt-2 text-[12px] text-[#888]">
                  {t("calc.successItems", { count: state.items.length })}
                </p>
              </div>
            ) : (
              <>
                {/* ---- ITEM TABS (multi-config strip) ---- */}
                <div className="-mx-4 mb-5 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <div className="flex w-max items-center gap-2">
                    {state.items.map((it, i) => {
                      const on = i === state.activeIndex;
                      const label = itemLabel(state.items, i, productNames);
                      return (
                        <div
                          key={it.id}
                          className={cn(
                            "group/tab flex items-stretch border transition-colors",
                            on
                              ? "border-orange bg-[#FFF6EB]"
                              : "border-[#E4E4E4] bg-white hover:border-[#bdbdbd]",
                          )}
                        >
                          <button
                            type="button"
                            onClick={() => setActive(i)}
                            className={cn(
                              "px-3 py-2 text-[12px] font-bold uppercase tracking-[0.04em]",
                              on ? "text-[#111]" : "text-[#666]",
                            )}
                          >
                            {label}
                          </button>
                          {canRemove && (
                            <button
                              type="button"
                              onClick={() => removeItem(i)}
                              aria-label={t("calc.removeItem")}
                              title={t("calc.removeItem")}
                              className="px-2 text-[#bbb] transition-colors hover:text-orange"
                            >
                              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                                <path d="M2 2l7 7M9 2l-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                              </svg>
                            </button>
                          )}
                        </div>
                      );
                    })}
                    {canAdd && (
                      <button
                        type="button"
                        onClick={() => addItem(item.product)}
                        className="flex items-center gap-1.5 border border-dashed border-[#cfcfcf] px-3 py-2 text-[12px] font-bold uppercase tracking-[0.04em] text-[#666] transition-colors hover:border-orange hover:text-orange"
                      >
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                          <path d="M5.5 1v9M1 5.5h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                        {t("calc.addAnother")}
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-5">
                  {/* ---- product tabs ---- */}
                  {step === 1 && <div className="flex gap-2">
                    {PRODUCTS.map((p) => {
                      const on = item.product === p;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => changeProduct(p)}
                          className={cn(
                            "flex-1 border px-4 py-3 text-[13px] font-bold uppercase tracking-[0.06em] transition-colors",
                            on
                              ? "border-orange bg-orange text-white"
                              : "border-[#E4E4E4] bg-white text-[#4a4a4a] hover:border-[#bdbdbd]",
                          )}
                        >
                          {t(`calc.products.${p}`)}
                        </button>
                      );
                    })}
                  </div>}

                  {step === 2 && materialTypes.length > 1 && (
                    <Section title={t("calc.material")}>
                      <div className="flex gap-2">
                        {materialTypes.map((mt) => {
                          const on = item.materialType === mt;
                          return (
                            <button
                              key={mt}
                              type="button"
                              onClick={() => changeMaterial(mt)}
                              className={cn(
                                "border px-4 py-2.5 text-[13px] font-semibold transition-colors",
                                on
                                  ? "border-ink-2 bg-ink-2 text-white"
                                  : "border-[#E4E4E4] bg-white text-[#4a4a4a] hover:border-[#bdbdbd]",
                              )}
                            >
                              {t(`calc.materials.${mt}`)}
                            </button>
                          );
                        })}
                      </div>
                    </Section>
                  )}

                  {step === 2 && serials.length > 0 && (
                    <Section title={t("calc.profileSerial")}>
                      <div className="flex flex-wrap gap-2">
                        {serials.map((s) => {
                          const on = item.serial === s.id;
                          return (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => changeSerial(s.id)}
                              className={cn(
                                "border px-3.5 py-2 text-[12px] font-semibold transition-colors",
                                on
                                  ? "border-orange bg-[#FFF6EB] text-[#111]"
                                  : "border-[#E4E4E4] bg-white text-[#4a4a4a] hover:border-[#bdbdbd]",
                              )}
                            >
                              {s.name}
                            </button>
                          );
                        })}
                      </div>
                    </Section>
                  )}

                  {step === 1 && <Section title={t("calc.frame")}>
                    <div className="flex flex-wrap gap-2">
                      {availableFrames.map((f) => {
                        const on = item.frame === f;
                        return (
                          <button
                            key={f}
                            type="button"
                            onClick={() => changeFrame(f)}
                            className={cn(
                              "flex items-center gap-2.5 border px-3.5 py-2.5 text-[13px] font-semibold transition-colors",
                              on
                                ? "border-orange bg-[#FFF6EB] text-[#111]"
                                : "border-[#EFEFEF] text-[#3a3a3a] hover:border-[#cfcfcf]",
                            )}
                          >
                            <span className={on ? "text-orange" : "text-[#666]"}>
                              {FRAME_PICTO[f]}
                            </span>
                            {t(`calc.frames.${f}`)}
                          </button>
                        );
                      })}
                    </div>
                  </Section>}

                  {step === 1 && <Section title={t("calc.opening")}>
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                      {VARIANTS[item.frame].map((v) => {
                        const on = item.variantId === v.id;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => patchActive({ variantId: v.id })}
                            title={v.name[lang] ?? v.name.ru}
                            className={cn(
                              "flex flex-col items-center gap-1.5 border bg-white p-2 text-center transition-colors",
                              on
                                ? "border-orange ring-1 ring-orange/40"
                                : "border-[#EFEFEF] hover:border-[#cfcfcf]",
                            )}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={v.scheme}
                              alt=""
                              width={46}
                              height={60}
                              loading="lazy"
                              decoding="async"
                              className="block h-[60px] w-auto object-contain"
                            />
                            <span className="line-clamp-2 text-[10px] font-semibold leading-tight text-[#444]">
                              {v.name[lang] ?? v.name.ru}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </Section>}

                  {step === 1 && <Section title={t("calc.sizesTitle")}>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {(
                        [
                          ["width", t("calc.width"), limits.minW, limits.maxW],
                          ["height", t("calc.height"), limits.minH, limits.maxH],
                          ["quantity", t("calc.quantity"), 1, 100],
                        ] as const
                      ).map(([k, label, min, max]) => (
                        <label key={k} className="block">
                          <span className="mb-1.5 block text-[11px] font-semibold text-[#666]">
                            {label}{" "}
                            {k !== "quantity" && (
                              <span className="text-[#aaa]">
                                ({min}–{max} мм)
                              </span>
                            )}
                          </span>
                          <input
                            type="number"
                            inputMode="numeric"
                            min={min}
                            max={max}
                            value={item[k]}
                            onChange={(e) =>
                              patchActive({ [k]: Number(e.target.value) } as Partial<ProductConfig>)
                            }
                            className="h-[44px] w-full border border-[#DDD] bg-white px-3.5 text-[15px] font-semibold text-[#222] outline-none focus:border-orange"
                          />
                        </label>
                      ))}
                    </div>
                  </Section>}

                  {step === 2 && <Section title={t("calc.glass")}>
                    <select
                      aria-label={t("calc.glass")}
                      value={item.glass}
                      onChange={(e) =>
                        patchActive({ glass: e.target.value as ProductConfig["glass"] })
                      }
                      className="h-[44px] w-full appearance-none border border-[#DDD] bg-white px-3.5 text-[13px] font-medium text-[#222] outline-none focus:border-orange"
                    >
                      {GLASS_OPTIONS.map((g) => (
                        <option key={g} value={g}>
                          {t(`glass.names.${g}`)}
                        </option>
                      ))}
                    </select>
                  </Section>}

                  {step === 2 && serial && serial.lamination.length > 0 && (
                    <Section title={t("calc.lamination")}>
                      <div className="flex flex-wrap gap-2">
                        {serial.lamination.map((c) => (
                          <ColorSwatchButton
                            key={c}
                            id={c}
                            on={item.lamination === c}
                            onClick={() => patchActive({ lamination: c })}
                          />
                        ))}
                      </div>
                      {COLOR_SWATCHES[item.lamination] && (
                        <p className="mt-2 text-[11px] text-[#888]">
                          {COLOR_SWATCHES[item.lamination].name}
                        </p>
                      )}
                    </Section>
                  )}

                  {step === 2 && serial && serial.fittings.length > 0 && (
                    <Section title={t("calc.fittings")}>
                      <div className="mb-2 flex flex-wrap gap-2">
                        {serial.fittings.map((b) => {
                          const on = item.fittingBrand === b.id;
                          return (
                            <button
                              key={b.id}
                              type="button"
                              onClick={() => changeFitting(b.id)}
                              className={cn(
                                "border px-3.5 py-2 text-[12px] font-semibold transition-colors",
                                on
                                  ? "border-orange bg-[#FFF6EB] text-[#111]"
                                  : "border-[#E4E4E4] bg-white text-[#4a4a4a] hover:border-[#bdbdbd]",
                              )}
                            >
                              {b.name}
                            </button>
                          );
                        })}
                      </div>
                      {currentFitting && currentFitting.colors.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {currentFitting.colors.map((c) => (
                            <ColorSwatchButton
                              key={c}
                              id={c}
                              on={item.fittingColor === c}
                              onClick={() => patchActive({ fittingColor: c })}
                            />
                          ))}
                        </div>
                      )}
                    </Section>
                  )}

                  {step === 2 && <Section title={t("calc.components")}>
                    <div className="space-y-2">
                      {COMPONENTS.map((k) => {
                        const c = item.components[k];
                        return (
                          <div
                            key={k}
                            className={cn(
                              "flex items-center gap-3 border px-3 py-2.5 transition-colors",
                              c.enabled
                                ? "border-orange bg-[#FFF6EB]"
                                : "border-[#EFEFEF] hover:border-[#cfcfcf]",
                            )}
                          >
                            <label className="flex flex-1 cursor-pointer items-center gap-2.5 text-[13px] font-medium text-[#222]">
                              <span
                                className={cn(
                                  "grid size-4 place-items-center border-[1.5px]",
                                  c.enabled
                                    ? "border-ink-2 bg-ink-2 text-white"
                                    : "border-[#1a1a1a] bg-white",
                                )}
                              >
                                {c.enabled && (
                                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                    <path d="M1 5l3 3 5-7" stroke="currentColor" strokeWidth="1.6" />
                                  </svg>
                                )}
                              </span>
                              <input
                                type="checkbox"
                                checked={c.enabled}
                                onChange={(e) => changeComponent(k, { enabled: e.target.checked })}
                                className="sr-only"
                              />
                              {t(`calc.componentNames.${k}`)}
                            </label>
                            {c.enabled && (
                              <label className="flex items-center gap-2 text-[11px] text-[#666]">
                                {t("calc.widthMm")}
                                <input
                                  type="number"
                                  inputMode="numeric"
                                  min={300}
                                  max={4000}
                                  value={c.width}
                                  onChange={(e) =>
                                    changeComponent(k, { width: Number(e.target.value) })
                                  }
                                  className="h-8 w-[90px] border border-[#DDD] bg-white px-2 text-[13px] font-semibold text-[#222] outline-none focus:border-orange"
                                />
                              </label>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </Section>}

                  {step === 3 && (
                    <div>
                      <div className="mb-5 border border-orange/25 bg-[#FFF8EF] px-4 py-5 sm:px-6">
                        <p className="m-0 text-[11px] font-extrabold uppercase tracking-[0.14em] text-orange">
                          {t("calc.estimate")}
                        </p>
                        <p className="mt-2 text-[28px] font-extrabold leading-none text-ink-2 sm:text-[34px]">
                          {formatPrice(total, i18n.language)} UZS
                        </p>
                        <p className="mt-2 text-[12px] text-[#777]">{t("calc.estimateNote")}</p>
                      </div>
                      <div className="space-y-2">
                        {state.items.map((configuredItem, index) => (
                          <button
                            key={configuredItem.id}
                            type="button"
                            onClick={() => {
                              setActive(index);
                              goToStep(1);
                            }}
                            className="flex w-full items-center justify-between gap-4 border border-[#E8E8E8] px-4 py-3 text-left transition-colors hover:border-orange"
                          >
                            <span>
                              <span className="block text-[13px] font-bold text-ink-2">{itemLabel(state.items, index, productNames)}</span>
                              <span className="mt-0.5 block text-[11px] text-[#888]">
                                {configuredItem.width}×{configuredItem.height} мм · {configuredItem.quantity} {t("calc.wizard.pieces")}
                              </span>
                            </span>
                            <span className="shrink-0 text-[13px] font-extrabold text-ink-2">
                              {formatPrice(estimateItem(configuredItem), i18n.language)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 4 && <Section title={t("calc.steps.contacts")}>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-1.5 block text-[11px] font-semibold text-[#666]">
                          {t("calc.name")} *
                        </span>
                        <input
                          value={state.name}
                          onChange={(e) => setContact("name", e.target.value)}
                          className={cn(
                            "h-[44px] w-full border bg-white px-3.5 text-[14px] outline-none focus:border-orange",
                            error && !state.name.trim() ? "border-orange" : "border-[#DDD]",
                          )}
                        />
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-[11px] font-semibold text-[#666]">
                          {t("calc.phone")} *
                        </span>
                        <input
                          value={state.phone}
                          inputMode="tel"
                          placeholder="+998"
                          onChange={(e) => setContact("phone", e.target.value)}
                          className={cn(
                            "h-[44px] w-full border bg-white px-3.5 text-[14px] outline-none focus:border-orange",
                            error && !state.phone.trim() ? "border-orange" : "border-[#DDD]",
                          )}
                        />
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-[11px] font-semibold text-[#666]">
                          Email
                        </span>
                        <input
                          type="email"
                          value={state.email}
                          onChange={(e) => setContact("email", e.target.value)}
                          className="h-[44px] w-full border border-[#DDD] bg-white px-3.5 text-[14px] outline-none focus:border-orange"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-[11px] font-semibold text-[#666]">
                          {t("calc.address")}
                        </span>
                        <input
                          value={state.address}
                          onChange={(e) => setContact("address", e.target.value)}
                          className="h-[44px] w-full border border-[#DDD] bg-white px-3.5 text-[14px] outline-none focus:border-orange"
                        />
                      </label>
                    </div>
                    <label className="mt-3 block">
                      <span className="mb-1.5 block text-[11px] font-semibold text-[#666]">
                        {t("calc.comment")}
                      </span>
                      <textarea
                        value={state.comment}
                        onChange={(e) => setContact("comment", e.target.value)}
                        rows={3}
                        className="w-full border border-[#DDD] bg-white px-3.5 py-3 text-[14px] outline-none focus:border-orange"
                      />
                    </label>
                    {error && (
                      <p className="mt-2 text-[13px] font-medium text-orange">
                        {t("calc.required")}
                      </p>
                    )}
                    <div className="mt-5 border-t border-[#ECECEC] pt-5">
                      <button
                        type="button"
                        onClick={submit}
                        className="w-full bg-orange px-6 py-3.5 text-[13px] font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-orange-d"
                      >
                        {t("calc.submit")}
                      </button>
                      <p className="mt-2 text-center text-[11px] text-[#999]">
                        {t("calc.sendMessenger")}
                      </p>
                    </div>
                  </Section>}

                  <div className="flex items-center justify-between gap-3 border-t border-[#ECECEC] pt-5">
                    {step > 1 ? (
                      <button type="button" onClick={() => goToStep(step - 1)} className="border border-[#DADADA] px-5 py-3 text-[12px] font-bold uppercase tracking-[0.06em] text-ink-2 transition-colors hover:border-orange hover:text-orange">
                        {t("calc.back")}
                      </button>
                    ) : <span />}
                    {step < 4 && (
                      <button type="button" onClick={() => goToStep(step + 1)} className="bg-orange px-6 py-3 text-[12px] font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-orange-d">
                        {t("calc.next")}
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ========================= RIGHT: preview + cart + CTA */}
          <div className="mx-auto w-full max-w-[420px] border border-[#ECECEC] bg-white px-4 py-5 sm:px-[22px] sm:py-7 lg:sticky lg:top-[120px] lg:mx-0 lg:max-w-none">
            {!submitted && (
              <>
                <WindowPreview
                  imageSrc={variant.image}
                  width={item.width}
                  height={item.height}
                  alt={variantName}
                  narrow={item.frame.startsWith("door-")}
                />
                <div className="mt-2 text-center text-[12px] font-semibold text-[#555]">
                  {variantName}
                </div>

                {/* Cart list — each line is clickable to switch the active item */}
                <div className="mt-4 border-t border-[#EEE] pt-3">
                  <div className="mb-2 flex items-center justify-between text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink-2">
                    <span>{t("calc.cart")}</span>
                    <span className="text-[10px] font-medium text-[#999]">
                      {state.items.length} / {MAX_ITEMS}
                    </span>
                  </div>
                  <ul className="m-0 space-y-1.5">
                    {state.items.map((it, i) => {
                      const on = i === state.activeIndex;
                      return (
                        <li key={it.id}>
                          <button
                            type="button"
                            onClick={() => setActive(i)}
                            className={cn(
                              "flex w-full items-baseline justify-between gap-2 border px-2.5 py-2 text-left text-[12px] transition-colors",
                              on
                                ? "border-orange bg-[#FFF6EB]"
                                : "border-[#ECECEC] bg-white hover:border-[#cfcfcf]",
                            )}
                          >
                            <span className="min-w-0 truncate font-semibold text-ink-2">
                              {itemLabel(state.items, i, productNames)}
                              <span className="ml-1.5 text-[10px] font-normal text-[#888]">
                                {it.width}×{it.height} · {it.quantity}шт
                              </span>
                            </span>
                            <span className="shrink-0 font-bold text-ink-2">
                              {formatPrice(estimateItem(it), i18n.language)}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  {canAdd && (
                    <button
                      type="button"
                      onClick={() => addItem(item.product)}
                      className="mt-2 flex w-full items-center justify-center gap-1.5 border border-dashed border-[#cfcfcf] py-2 text-[11px] font-bold uppercase tracking-[0.06em] text-[#666] transition-colors hover:border-orange hover:text-orange"
                    >
                      <svg width="10" height="10" viewBox="0 0 11 11" fill="none">
                        <path d="M5.5 1v9M1 5.5h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                      {t("calc.addAnother")}
                    </button>
                  )}
                </div>

                {/* Total */}
                <div className="mt-3 flex items-baseline justify-between border-t border-[#EEE] pt-3">
                  <span className="text-[12px] text-[#888]">
                    {t("calc.totalPrice")}
                  </span>
                  <b className="text-[18px] text-ink-2">
                    {formatPrice(total, i18n.language)} UZS
                  </b>
                </div>
                {state.items.length > 1 && (
                  <div className="mt-1 text-right text-[11px] text-[#888]">
                    {t("calc.currentItem")}: {formatPrice(itemPrice, i18n.language)} UZS
                  </div>
                )}

                {step < 4 && (
                  <button
                    type="button"
                    onClick={() => goToStep(step + 1)}
                    className="mt-4 hidden w-full bg-orange px-[22px] py-3.5 text-[13px] font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-orange-d lg:block"
                  >
                    {t("calc.next")}
                  </button>
                )}
                <p className="mt-2 text-center text-[11px] text-[#999]">
                  {t("calc.estimateNote")}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
