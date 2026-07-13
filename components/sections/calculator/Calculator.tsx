"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  "m-0 mb-3 text-[12px] font-extrabold uppercase tracking-[0.12em] text-ink-2";

const LAST_STEP = 7;
const DRAFT_STORAGE_KEY = "imperiya-calculator-draft-v1";
const DRAFT_VERSION = 1;

type CalculatorDraft = {
  version: number;
  state: CalcState;
  step: number;
};

function createRequestNumber() {
  const now = new Date();
  const date = [now.getFullYear(), now.getMonth() + 1, now.getDate()]
    .map((part, index) => index === 0 ? String(part) : String(part).padStart(2, "0"))
    .join("");
  const suffix = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID().slice(0, 4).toUpperCase()
    : Math.random().toString(36).slice(2, 6).toUpperCase();
  return `IMP-${date}-${suffix}`;
}

function SelectedCheck({ on }: { on: boolean }) {
  if (!on) return null;
  return (
    <span
      aria-hidden
      className="absolute right-2 top-2 grid size-5 place-items-center rounded-full bg-orange text-white shadow-sm"
    >
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
        <path
          d="M2.2 6.2 4.8 8.6 9.9 3.4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

type ValidationErrors = Partial<Record<"width" | "height" | "quantity" | "name" | "phone" | "email", string>>;

function formatUzPhone(value: string) {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("998")) digits = digits.slice(3);
  digits = digits.slice(0, 9);
  const parts = [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 7), digits.slice(7, 9)].filter(Boolean);
  return `+998${parts.length ? ` ${parts.join(" ")}` : ""}`;
}

function focusFirstError(field: keyof ValidationErrors) {
  requestAnimationFrame(() => {
    const input = document.getElementById(`calc-${field}`) as HTMLInputElement | null;
    input?.scrollIntoView({ behavior: "smooth", block: "center" });
    input?.focus({ preventScroll: true });
  });
}

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
      aria-pressed={on}
      className={cn(
        "relative size-11 overflow-hidden rounded-md border bg-cover bg-center transition-all",
        on
          ? "border-[#ddd] outline outline-[1.5px] outline-orange outline-offset-2"
          : "border-[#ddd] hover:outline hover:outline-[1px] hover:outline-[#bbb] hover:outline-offset-1",
      )}
      style={{ backgroundImage: `url(${sw.img})` }}
    >
      <SelectedCheck on={on} />
    </button>
  );
}

export function Calculator() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language?.slice(0, 2) ?? "ru") as "ru" | "uz" | "en";
  const [state, setState] = useState<CalcState>(initialCalcState);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [requestNumber, setRequestNumber] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [draftReady, setDraftReady] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [step, setStep] = useState(1);
  const feedbackTimerRef = useRef<number | null>(null);
  const submitTimerRef = useRef<number | null>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(DRAFT_STORAGE_KEY);
      if (raw) {
        const draft = JSON.parse(raw) as CalculatorDraft;
        if (
          draft.version === DRAFT_VERSION &&
          Array.isArray(draft.state?.items) &&
          draft.state.items.length > 0
        ) {
          setState(draft.state);
          setStep(Math.max(1, Math.min(LAST_STEP, draft.step || 1)));
        }
      }
    } catch {
      window.sessionStorage.removeItem(DRAFT_STORAGE_KEY);
    } finally {
      setDraftReady(true);
    }
  }, []);

  useEffect(() => {
    if (!draftReady || submitted) return;
    const draft: CalculatorDraft = {
      version: DRAFT_VERSION,
      state,
      step,
    };
    try {
      window.sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // Storage can be unavailable in strict privacy modes; the in-memory
      // wizard state still keeps every field when moving between steps.
    }
  }, [draftReady, state, step, submitted]);

  useEffect(() => () => {
    if (feedbackTimerRef.current !== null) {
      window.clearTimeout(feedbackTimerRef.current);
    }
    if (submitTimerRef.current !== null) {
      window.clearTimeout(submitTimerRef.current);
    }
  }, []);

  const wizardSteps = [
    t("calc.wizard.product"),
    t("calc.wizard.frame"),
    t("calc.wizard.opening"),
    t("calc.wizard.sizes"),
    t("calc.wizard.configuration"),
    t("calc.wizard.estimate"),
    t("calc.wizard.contacts"),
  ];

  function goToStep(nextStep: number) {
    setStep(Math.max(1, Math.min(LAST_STEP, nextStep)));
    setValidationErrors({});
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
    if (k === "name" || k === "phone" || k === "email") {
      setValidationErrors((current) => ({ ...current, [k]: undefined }));
    }
  }

  /* Cart ops */
  function addItem(productHint: Product = "window") {
    if (!canAdd) return;
    const fresh = defaultProductConfig({ product: productHint });
    setState({
      ...state,
      items: [...state.items, fresh],
      activeIndex: state.items.length,
    });
    setFeedback(t("calc.itemAdded"));
    if (feedbackTimerRef.current !== null) {
      window.clearTimeout(feedbackTimerRef.current);
    }
    feedbackTimerRef.current = window.setTimeout(() => {
      setFeedback(null);
      feedbackTimerRef.current = null;
    }, 2400);
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

  function validateConstruction() {
    const errors: ValidationErrors = {};
    if (!Number.isFinite(item.width) || item.width < limits.minW || item.width > limits.maxW) {
      errors.width = t("calc.validation.range", { min: limits.minW, max: limits.maxW });
    }
    if (!Number.isFinite(item.height) || item.height < limits.minH || item.height > limits.maxH) {
      errors.height = t("calc.validation.range", { min: limits.minH, max: limits.maxH });
    }
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 100) {
      errors.quantity = t("calc.validation.quantity");
    }
    setValidationErrors(errors);
    const first = (["width", "height", "quantity"] as const).find((field) => errors[field]);
    if (first) focusFirstError(first);
    return !first;
  }

  function continueWizard() {
    if (step === 4 && !validateConstruction()) return;
    goToStep(step + 1);
  }

  function submit() {
    if (submitting) return;
    const errors: ValidationErrors = {};
    if (state.name.trim().length < 2) errors.name = t("calc.validation.name");
    const phoneDigits = state.phone.replace(/\D/g, "");
    if (!/^998\d{9}$/.test(phoneDigits)) errors.phone = t("calc.validation.phone");
    if (state.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email.trim())) {
      errors.email = t("calc.validation.email");
    }
    setValidationErrors(errors);
    const first = (["name", "phone", "email"] as const).find((field) => errors[field]);
    if (first) {
      focusFirstError(first);
      return;
    }
    setSubmitting(true);
    submitTimerRef.current = window.setTimeout(() => {
      setRequestNumber(createRequestNumber());
      setSubmitted(true);
      setSubmitting(false);
      submitTimerRef.current = null;
      window.sessionStorage.removeItem(DRAFT_STORAGE_KEY);
      requestAnimationFrame(() => {
        scrollToAnchor("calculator");
        successRef.current?.focus({ preventScroll: true });
      });
    }, 900);
  }

  function resetCalculator() {
    setState({
      ...initialCalcState,
      items: [defaultProductConfig()],
      activeIndex: 0,
    });
    setStep(1);
    setSubmitted(false);
    setSubmitting(false);
    setRequestNumber("");
    setValidationErrors({});
    window.sessionStorage.removeItem(DRAFT_STORAGE_KEY);
    requestAnimationFrame(() => scrollToAnchor("calculator"));
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
          <div className="mb-5 overflow-hidden rounded-lg border border-[#E7E7E7] bg-white px-4 py-4 shadow-[0_12px_32px_-28px_rgba(0,0,0,.35)] sm:px-6">
            <div className="mb-3 flex items-center justify-between gap-4">
              <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#777]">
                {t("calc.wizard.progress", { current: step, total: wizardSteps.length })}
              </span>
              <span className="text-right text-[13px] font-extrabold text-orange">
                {wizardSteps[step - 1]}
              </span>
            </div>
            <div className="grid grid-cols-7 gap-1.5" aria-hidden>
              {wizardSteps.map((label, index) => (
                <span
                  key={label}
                  className={cn(
                    "h-1.5 rounded-full transition-colors duration-300",
                    index < step ? "bg-orange" : "bg-[#ECECEC]",
                  )}
                />
              ))}
            </div>
            {draftReady && (
              <div className="mt-2 flex items-center justify-end gap-1.5 text-[10px] font-semibold text-[#6f7f68]">
                <span aria-hidden>✓</span>
                {t("calc.draftSaved")}
              </div>
            )}
          </div>
        )}

        <div className={cn("grid items-start gap-6", !submitted && "lg:grid-cols-[1fr_360px]")}>
          {/* ============================== LEFT: configurator ===== */}
          <div className="order-2 mx-auto w-full max-w-[760px] rounded-lg border border-[#ECECEC] bg-white p-4 shadow-[0_18px_42px_-34px_rgba(0,0,0,.35)] sm:p-6 lg:order-1 lg:mx-0 lg:max-w-none">
            {submitted ? (
              <div
                ref={successRef}
                tabIndex={-1}
                className="flex min-h-[440px] flex-col items-center justify-center px-3 text-center outline-none"
                aria-live="polite"
              >
                <span className="grid size-16 animate-[success-pop_420ms_ease-out] place-items-center rounded-full bg-[#FFF6EB] text-orange motion-reduce:animate-none">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <h3 className="mt-5 max-w-md text-[20px] font-extrabold text-ink-2">
                  {t("calc.success")}
                </h3>
                <div className="mt-5 w-full max-w-sm rounded-lg border border-orange/20 bg-[#FFF8EF] px-5 py-4">
                  <span className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[#888]">
                    {t("calc.requestNumber")}
                  </span>
                  <strong className="mt-1 block text-[22px] tracking-[0.04em] text-ink-2">
                    {requestNumber}
                  </strong>
                </div>
                <p className="mt-4 max-w-sm text-[14px] font-semibold leading-relaxed text-[#555]">
                  {t("calc.successTime")}
                </p>
                <p className="mt-1 text-[12px] text-[#888]">
                  {t("calc.successItems", { count: state.items.length })}
                </p>
                <button
                  type="button"
                  onClick={resetCalculator}
                  className="mt-6 min-h-12 rounded-md border border-[#DADADA] px-6 py-3 text-[12px] font-bold uppercase tracking-[0.06em] text-ink-2 transition-colors hover:border-orange hover:text-orange"
                >
                  {t("calc.newCalculation")}
                </button>
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
                            "group/tab flex items-stretch overflow-hidden rounded-md border transition-colors",
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
                        className="flex items-center gap-1.5 rounded-md border border-dashed border-[#cfcfcf] px-3 py-2 text-[12px] font-bold uppercase tracking-[0.04em] text-[#666] transition-colors hover:border-orange hover:text-orange"
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
                  {step === 1 && <div className="grid grid-cols-2 gap-3">
                    {PRODUCTS.map((p) => {
                      const on = item.product === p;
                      return (
                        <button
                          key={p}
                          type="button"
                          aria-pressed={on}
                          onClick={() => changeProduct(p)}
                          className={cn(
                            "relative min-h-16 rounded-md border px-4 py-3 text-[14px] font-bold uppercase tracking-[0.05em] transition-all",
                            on
                              ? "border-orange bg-orange text-white"
                              : "border-[#E4E4E4] bg-white text-[#4a4a4a] hover:border-[#bdbdbd]",
                          )}
                        >
                          {t(`calc.products.${p}`)}
                          <SelectedCheck on={on} />
                        </button>
                      );
                    })}
                  </div>}

                  {step === 5 && materialTypes.length > 1 && (
                    <Section title={t("calc.material")}>
                      <div className="flex gap-2">
                        {materialTypes.map((mt) => {
                          const on = item.materialType === mt;
                          return (
                            <button
                              key={mt}
                              type="button"
                              aria-pressed={on}
                              onClick={() => changeMaterial(mt)}
                              className={cn(
                                "relative min-h-11 rounded-md border px-4 py-2.5 pr-10 text-[13px] font-semibold transition-colors",
                                on
                                  ? "border-ink-2 bg-ink-2 text-white"
                                  : "border-[#E4E4E4] bg-white text-[#4a4a4a] hover:border-[#bdbdbd]",
                              )}
                            >
                              {t(`calc.materials.${mt}`)}
                              <SelectedCheck on={on} />
                            </button>
                          );
                        })}
                      </div>
                    </Section>
                  )}

                  {step === 5 && serials.length > 0 && (
                    <Section title={t("calc.profileSerial")}>
                      <div className="flex flex-wrap gap-2">
                        {serials.map((s) => {
                          const on = item.serial === s.id;
                          return (
                            <button
                              key={s.id}
                              type="button"
                              aria-pressed={on}
                              onClick={() => changeSerial(s.id)}
                              className={cn(
                                "relative min-h-11 rounded-md border px-3.5 py-2 pr-10 text-[12px] font-semibold transition-colors",
                                on
                                  ? "border-orange bg-[#FFF6EB] text-[#111]"
                                  : "border-[#E4E4E4] bg-white text-[#4a4a4a] hover:border-[#bdbdbd]",
                              )}
                            >
                              {s.name}
                              <SelectedCheck on={on} />
                            </button>
                          );
                        })}
                      </div>
                    </Section>
                  )}

                  {step === 2 && <Section title={t("calc.frame")}>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {availableFrames.map((f) => {
                        const on = item.frame === f;
                        return (
                          <button
                            key={f}
                            type="button"
                            aria-pressed={on}
                            onClick={() => changeFrame(f)}
                            className={cn(
                              "relative flex min-h-16 items-center justify-center gap-2.5 rounded-md border px-3.5 py-3 pr-10 text-[13px] font-semibold transition-all",
                              on
                                ? "border-orange bg-[#FFF6EB] text-[#111]"
                                : "border-[#EFEFEF] text-[#3a3a3a] hover:border-[#cfcfcf]",
                            )}
                          >
                            <span className={on ? "text-orange" : "text-[#666]"}>
                              {FRAME_PICTO[f]}
                            </span>
                            {t(`calc.frames.${f}`)}
                            <SelectedCheck on={on} />
                          </button>
                        );
                      })}
                    </div>
                  </Section>}

                  {step === 3 && <Section title={t("calc.opening")}>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                      {VARIANTS[item.frame].map((v) => {
                        const on = item.variantId === v.id;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            aria-pressed={on}
                            onClick={() => patchActive({ variantId: v.id })}
                            title={v.name[lang] ?? v.name.ru}
                            className={cn(
                              "relative flex min-h-[132px] flex-col items-center justify-center gap-2 rounded-md border bg-white p-3 text-center transition-all",
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
                            <span className="line-clamp-2 text-[12px] font-semibold leading-tight text-[#444]">
                              {v.name[lang] ?? v.name.ru}
                            </span>
                            <SelectedCheck on={on} />
                          </button>
                        );
                      })}
                    </div>
                  </Section>}

                  {step === 4 && <Section title={t("calc.sizesTitle")}>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {(
                        [
                          ["width", t("calc.width"), limits.minW, limits.maxW],
                          ["height", t("calc.height"), limits.minH, limits.maxH],
                          ["quantity", t("calc.quantity"), 1, 100],
                        ] as const
                      ).map(([k, label, min, max]) => (
                        <label key={k} className="block">
                          <span className="mb-1.5 block text-[12px] font-semibold text-[#666]">
                            {label}{" "}
                            {k !== "quantity" && (
                              <span className="text-[#aaa]">
                                ({min}–{max} мм)
                              </span>
                            )}
                          </span>
                          <input
                            id={`calc-${k}`}
                            type="number"
                            inputMode="numeric"
                            min={min}
                            max={max}
                            value={item[k]}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              patchActive({ [k]: value } as Partial<ProductConfig>);
                              const invalid = !Number.isFinite(value) || value < min || value > max || (k === "quantity" && !Number.isInteger(value));
                              setValidationErrors((current) => ({
                                ...current,
                                [k]: invalid
                                  ? k === "quantity"
                                    ? t("calc.validation.quantity")
                                    : t("calc.validation.range", { min, max })
                                  : undefined,
                              }));
                            }}
                            aria-invalid={Boolean(validationErrors[k])}
                            aria-describedby={validationErrors[k] ? `calc-${k}-error` : undefined}
                            className={cn(
                              "h-[44px] w-full rounded-md border bg-white px-3.5 text-[15px] font-semibold text-[#222] outline-none transition-colors focus:border-orange",
                              validationErrors[k] ? "border-orange" : "border-[#DDD]",
                            )}
                          />
                          {validationErrors[k] && (
                            <span id={`calc-${k}-error`} className="mt-1.5 block text-[11px] font-medium text-orange">
                              {validationErrors[k]}
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                  </Section>}

                  {step === 5 && <Section title={t("calc.glass")}>
                    <select
                      aria-label={t("calc.glass")}
                      value={item.glass}
                      onChange={(e) =>
                        patchActive({ glass: e.target.value as ProductConfig["glass"] })
                      }
                      className="h-[44px] w-full appearance-none rounded-md border border-[#DDD] bg-white px-3.5 text-[13px] font-medium text-[#222] outline-none transition-colors focus:border-orange"
                    >
                      {GLASS_OPTIONS.map((g) => (
                        <option key={g} value={g}>
                          {t(`glass.names.${g}`)}
                        </option>
                      ))}
                    </select>
                  </Section>}

                  {step === 5 && serial && serial.lamination.length > 0 && (
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

                  {step === 5 && serial && serial.fittings.length > 0 && (
                    <Section title={t("calc.fittings")}>
                      <div className="mb-2 flex flex-wrap gap-2">
                        {serial.fittings.map((b) => {
                          const on = item.fittingBrand === b.id;
                          return (
                            <button
                              key={b.id}
                              type="button"
                              aria-pressed={on}
                              onClick={() => changeFitting(b.id)}
                              className={cn(
                                "relative min-h-11 rounded-md border px-3.5 py-2 pr-10 text-[12px] font-semibold transition-colors",
                                on
                                  ? "border-orange bg-[#FFF6EB] text-[#111]"
                                  : "border-[#E4E4E4] bg-white text-[#4a4a4a] hover:border-[#bdbdbd]",
                              )}
                            >
                              {b.name}
                              <SelectedCheck on={on} />
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

                  {step === 5 && <Section title={t("calc.components")}>
                    <div className="space-y-2">
                      {COMPONENTS.map((k) => {
                        const c = item.components[k];
                        return (
                          <div
                            key={k}
                            className={cn(
                              "flex items-center gap-3 rounded-md border px-3 py-2.5 transition-colors",
                              c.enabled
                                ? "border-orange bg-[#FFF6EB]"
                                : "border-[#EFEFEF] hover:border-[#cfcfcf]",
                            )}
                          >
                            <label className="flex flex-1 cursor-pointer items-center gap-2.5 text-[13px] font-medium text-[#222]">
                              <span
                                className={cn(
                                  "grid size-4 place-items-center rounded-sm border-[1.5px]",
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
                                  className="h-8 w-[90px] rounded-md border border-[#DDD] bg-white px-2 text-[13px] font-semibold text-[#222] outline-none transition-colors focus:border-orange"
                                />
                              </label>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </Section>}

                  {step === 6 && (
                    <div>
                      <div className="mb-5 rounded-lg border border-orange/25 bg-[#FFF8EF] px-4 py-5 sm:px-6">
                        <p className="m-0 text-[11px] font-extrabold uppercase tracking-[0.14em] text-orange">
                          {t("calc.estimate")}
                        </p>
                        <p key={total} className="mt-2 animate-[price-pop_280ms_ease-out] text-[28px] font-extrabold leading-none text-ink-2 motion-reduce:animate-none sm:text-[34px]">
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
                            className="flex w-full items-center justify-between gap-4 rounded-md border border-[#E8E8E8] px-4 py-3 text-left transition-colors hover:border-orange"
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

                  {step === 7 && <Section title={t("calc.steps.contacts")}>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-1.5 block text-[11px] font-semibold text-[#666]">
                          {t("calc.name")} *
                        </span>
                        <input
                          id="calc-name"
                          value={state.name}
                          autoComplete="name"
                          onChange={(e) => setContact("name", e.target.value)}
                          onBlur={() => setValidationErrors((current) => ({
                            ...current,
                            name: state.name.trim().length < 2 ? t("calc.validation.name") : undefined,
                          }))}
                          className={cn(
                            "h-[44px] w-full rounded-md border bg-white px-3.5 text-[14px] outline-none transition-colors focus:border-orange",
                            validationErrors.name ? "border-orange" : "border-[#DDD]",
                          )}
                          aria-invalid={Boolean(validationErrors.name)}
                          aria-describedby={validationErrors.name ? "calc-name-error" : undefined}
                        />
                        {validationErrors.name && <span id="calc-name-error" className="mt-1.5 block text-[11px] font-medium text-orange">{validationErrors.name}</span>}
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-[11px] font-semibold text-[#666]">
                          {t("calc.phone")} *
                        </span>
                        <input
                          id="calc-phone"
                          value={state.phone}
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder="+998 90 123 45 67"
                          onFocus={() => {
                            if (!state.phone) setContact("phone", "+998 ");
                          }}
                          onChange={(e) => setContact("phone", formatUzPhone(e.target.value))}
                          onBlur={() => setValidationErrors((current) => ({
                            ...current,
                            phone: /^998\d{9}$/.test(state.phone.replace(/\D/g, ""))
                              ? undefined
                              : t("calc.validation.phone"),
                          }))}
                          className={cn(
                            "h-[44px] w-full rounded-md border bg-white px-3.5 text-[14px] outline-none transition-colors focus:border-orange",
                            validationErrors.phone ? "border-orange" : "border-[#DDD]",
                          )}
                          aria-invalid={Boolean(validationErrors.phone)}
                          aria-describedby={validationErrors.phone ? "calc-phone-error" : undefined}
                        />
                        {validationErrors.phone && <span id="calc-phone-error" className="mt-1.5 block text-[11px] font-medium text-orange">{validationErrors.phone}</span>}
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-[11px] font-semibold text-[#666]">
                          Email
                        </span>
                        <input
                          id="calc-email"
                          type="email"
                          value={state.email}
                          autoComplete="email"
                          onChange={(e) => setContact("email", e.target.value)}
                          onBlur={() => setValidationErrors((current) => ({
                            ...current,
                            email: state.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email.trim())
                              ? t("calc.validation.email")
                              : undefined,
                          }))}
                          className={cn(
                            "h-[44px] w-full rounded-md border bg-white px-3.5 text-[14px] outline-none transition-colors focus:border-orange",
                            validationErrors.email ? "border-orange" : "border-[#DDD]",
                          )}
                          aria-invalid={Boolean(validationErrors.email)}
                          aria-describedby={validationErrors.email ? "calc-email-error" : undefined}
                        />
                        {validationErrors.email && <span id="calc-email-error" className="mt-1.5 block text-[11px] font-medium text-orange">{validationErrors.email}</span>}
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-[11px] font-semibold text-[#666]">
                          {t("calc.address")}
                        </span>
                        <input
                          value={state.address}
                          onChange={(e) => setContact("address", e.target.value)}
                          className="h-[44px] w-full rounded-md border border-[#DDD] bg-white px-3.5 text-[14px] outline-none transition-colors focus:border-orange"
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
                        className="w-full rounded-md border border-[#DDD] bg-white px-3.5 py-3 text-[14px] outline-none transition-colors focus:border-orange"
                      />
                    </label>
                    <div className="mt-5 border-t border-[#ECECEC] pt-5">
                      <button
                        type="button"
                        onClick={submit}
                        disabled={submitting}
                        aria-busy={submitting}
                        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-orange px-6 py-3.5 text-[13px] font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-orange-d disabled:cursor-wait disabled:opacity-75"
                      >
                        {submitting && (
                          <span
                            aria-hidden
                            className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none"
                          />
                        )}
                        {submitting ? t("calc.sending") : t("calc.submit")}
                      </button>
                      <p className="mt-2 text-center text-[11px] text-[#999]">
                        {t("calc.sendMessenger")}
                      </p>
                    </div>
                  </Section>}

                  <div className="flex items-center justify-between gap-3 border-t border-[#ECECEC] pt-5">
                    {step > 1 ? (
                      <button type="button" disabled={submitting} onClick={() => goToStep(step - 1)} className="min-h-12 rounded-md border border-[#DADADA] px-5 py-3 text-[12px] font-bold uppercase tracking-[0.06em] text-ink-2 transition-colors hover:border-orange hover:text-orange disabled:cursor-not-allowed disabled:opacity-50">
                        {t("calc.back")}
                      </button>
                    ) : <span />}
                    {step < LAST_STEP && (
                      <button type="button" onClick={continueWizard} className="min-h-12 rounded-md bg-orange px-6 py-3 text-[12px] font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-orange-d">
                        {t("calc.next")}
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ========================= RIGHT: preview + cart + CTA */}
          {!submitted && <div className="order-1 mx-auto w-full max-w-[420px] rounded-lg border border-[#ECECEC] bg-white px-4 py-4 shadow-[0_18px_42px_-34px_rgba(0,0,0,.35)] sm:px-[22px] sm:py-6 lg:order-2 lg:sticky lg:top-[120px] lg:mx-0 lg:max-w-none">
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

                {/* Live price stays visible next to the preview on every step. */}
                <div className="mt-4 flex items-end justify-between rounded-md bg-[#FFF8EF] px-4 py-3">
                  <span className="pb-0.5 text-[12px] font-semibold text-[#777]">
                    {t("calc.totalPrice")}
                  </span>
                  <b key={total} className="animate-[price-pop_280ms_ease-out] text-[21px] leading-none text-ink-2 motion-reduce:animate-none">
                    {formatPrice(total, i18n.language)} UZS
                  </b>
                </div>
                {state.items.length > 1 && (
                  <div className="mt-1 text-right text-[11px] text-[#888]">
                    {t("calc.currentItem")}: {formatPrice(itemPrice, i18n.language)} UZS
                  </div>
                )}

                {/* Cart list — each line is clickable to switch the active item */}
                <div className="mt-4 hidden border-t border-[#EEE] pt-3 lg:block">
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
                              "flex w-full items-baseline justify-between gap-2 rounded-md border px-2.5 py-2 text-left text-[12px] transition-colors",
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
                </div>

                <p className="mt-2 hidden text-center text-[11px] text-[#999] lg:block">
                  {t("calc.estimateNote")}
                </p>
              </>
          </div>}
        </div>
      </div>
      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-[84px] left-1/2 z-[70] flex -translate-x-1/2 animate-[feedback-in_240ms_ease-out] items-center gap-2 whitespace-nowrap rounded-full bg-ink px-5 py-3 text-[13px] font-semibold text-white shadow-[0_14px_35px_-12px_rgba(0,0,0,.45)] motion-reduce:animate-none lg:bottom-8"
        >
          <span aria-hidden className="grid size-5 place-items-center rounded-full bg-orange text-white">✓</span>
          {feedback}
        </div>
      )}
    </section>
  );
}
