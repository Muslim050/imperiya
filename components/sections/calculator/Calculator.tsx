"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn, formatPrice } from "@/lib/utils";
import { WindowPreview } from "./WindowPreview";
import { FRAME_PICTO } from "./shapes";
import {
  PRODUCTS,
  MATERIAL_TYPES,
  COMPONENTS,
  VARIANTS,
  DEFAULT_VARIANT,
  FRAMES_BY_PRODUCT,
  FRAME_SIZE_LIMITS,
  GLASS_OPTIONS,
  SERIAL_CATALOG,
  COLOR_SWATCHES,
  getSerials,
  findSerial,
  findVariant,
  getMaterialTypesFor,
  initialCalcState,
  estimatePrice,
  type CalcState,
  type Product,
  type MaterialType,
  type Frame,
  type ComponentKey,
} from "@/data/calculator";

/* Tiny visual primitives shared across sections */
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

  const price = useMemo(() => estimatePrice(state), [state]);
  const set = <K extends keyof CalcState>(k: K, v: CalcState[K]) =>
    setState((s) => ({ ...s, [k]: v }));

  /* ---------------- product / type / serial coherence ---------------- */
  const materialTypes = getMaterialTypesFor(state.product);
  const serials = getSerials(state.product, state.materialType);
  const serial =
    findSerial(state.product, state.materialType, state.serial) ?? serials[0];
  const variant = findVariant(state.variantId) ?? VARIANTS.double[0];
  const variantName = variant.name[lang] ?? variant.name.ru;
  const availableFrames = FRAMES_BY_PRODUCT[state.product];
  const limits = FRAME_SIZE_LIMITS[state.frame];

  /** When the user switches product, lock the rest of the state to a
   * coherent default: pick the first available material → first serial →
   * its first lamination / fitting, and reset frame/variant to that
   * product's first viable pair. */
  function setProduct(p: Product) {
    setState((s) => {
      const mts = getMaterialTypesFor(p);
      const mt = mts.includes(s.materialType) ? s.materialType : mts[0];
      const ser = SERIAL_CATALOG[p][mt]?.[0];
      const frames = FRAMES_BY_PRODUCT[p];
      const f = frames.includes(s.frame) ? s.frame : frames[0];
      return {
        ...s,
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

  function setMaterialType(mt: MaterialType) {
    setState((s) => {
      const ser = SERIAL_CATALOG[s.product][mt]?.[0];
      return {
        ...s,
        materialType: mt,
        serial: ser?.id ?? "",
        lamination: ser?.lamination[1] ?? ser?.lamination[0] ?? "",
        fittingBrand: ser?.fittings[0]?.id ?? "",
        fittingColor: ser?.fittings[0]?.colors[0] ?? "",
      };
    });
  }

  function setSerial(id: string) {
    setState((s) => {
      const ser = findSerial(s.product, s.materialType, id);
      return {
        ...s,
        serial: id,
        lamination: ser?.lamination[1] ?? ser?.lamination[0] ?? "",
        fittingBrand: ser?.fittings[0]?.id ?? "",
        fittingColor: ser?.fittings[0]?.colors[0] ?? "",
      };
    });
  }

  function setFrame(f: Frame) {
    setState((s) => ({ ...s, frame: f, variantId: DEFAULT_VARIANT[f] }));
  }

  function setFitting(brandId: string) {
    setState((s) => {
      const b = serial?.fittings.find((x) => x.id === brandId);
      return {
        ...s,
        fittingBrand: brandId,
        fittingColor: b?.colors[0] ?? "",
      };
    });
  }

  function setComponent(k: ComponentKey, patch: Partial<{ enabled: boolean; width: number }>) {
    setState((s) => ({
      ...s,
      components: { ...s.components, [k]: { ...s.components[k], ...patch } },
    }));
  }

  /* Keep components.width in sync with the main window width by default
   * until the user types something different. */
  useEffect(() => {
    setState((s) => ({
      ...s,
      components: Object.fromEntries(
        COMPONENTS.map((k) => [
          k,
          s.components[k].enabled
            ? s.components[k]
            : { ...s.components[k], width: s.width },
        ]),
      ) as CalcState["components"],
    }));
    // only when the master width changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.width]);

  function submit() {
    if (!state.name.trim() || !state.phone.trim()) {
      setError(true);
      return;
    }
    setSubmitted(true);
  }

  const currentFitting = serial?.fittings.find((f) => f.id === state.fittingBrand);

  return (
    <section id="calculator" className="scroll-mt-40 bg-bg py-10 sm:py-[38px]">
      <div className="inner">
        <h2 className="m-0 mb-1 text-[22px] font-extrabold uppercase tracking-[0.02em]">
          {t("calc.title")}
        </h2>
        <div className="mb-[22px] text-[13px] text-[#777]">
          {t("calc.subtitle")}
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">
          {/* ============================== LEFT: configurator ===== */}
          <div className="mx-auto w-full max-w-[760px] space-y-5 border border-[#ECECEC] bg-white p-4 sm:p-6 lg:mx-0 lg:max-w-none">
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
              </div>
            ) : (
              <>
                {/* ---- product tabs (Окно / Дверь) ---- */}
                <div className="flex gap-2">
                  {PRODUCTS.map((p) => {
                    const on = state.product === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setProduct(p)}
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
                </div>

                {/* ---- material type (ПВХ / Алюминий) ---- */}
                {materialTypes.length > 1 && (
                  <Section title={t("calc.material")}>
                    <div className="flex gap-2">
                      {materialTypes.map((mt) => {
                        const on = state.materialType === mt;
                        return (
                          <button
                            key={mt}
                            type="button"
                            onClick={() => setMaterialType(mt)}
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

                {/* ---- serial ---- */}
                {serials.length > 0 && (
                  <Section title={t("calc.profileSerial")}>
                    <div className="flex flex-wrap gap-2">
                      {serials.map((s) => {
                        const on = state.serial === s.id;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setSerial(s.id)}
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

                {/* ---- frame (sash count) ---- */}
                <Section title={t("calc.frame")}>
                  <div className="flex flex-wrap gap-2">
                    {availableFrames.map((f) => {
                      const on = state.frame === f;
                      return (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setFrame(f)}
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
                </Section>

                {/* ---- opening variant ---- */}
                <Section title={t("calc.opening")}>
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {VARIANTS[state.frame].map((v) => {
                      const on = state.variantId === v.id;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => set("variantId", v.id)}
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
                </Section>

                {/* ---- sizes (plain number inputs — client's explicit ask) ---- */}
                <Section title={t("calc.sizesTitle")}>
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
                          value={state[k]}
                          onChange={(e) => set(k, Number(e.target.value))}
                          className="h-[44px] w-full border border-[#DDD] bg-white px-3.5 text-[15px] font-semibold text-[#222] outline-none focus:border-orange"
                        />
                      </label>
                    ))}
                  </div>
                </Section>

                {/* ---- glass ---- */}
                <Section title={t("calc.glass")}>
                  <select
                    value={state.glass}
                    onChange={(e) => set("glass", e.target.value as CalcState["glass"])}
                    className="h-[44px] w-full appearance-none border border-[#DDD] bg-white px-3.5 text-[13px] font-medium text-[#222] outline-none focus:border-orange"
                  >
                    {GLASS_OPTIONS.map((g) => (
                      <option key={g} value={g}>
                        {t(`glass.names.${g}`)}
                      </option>
                    ))}
                  </select>
                </Section>

                {/* ---- lamination ---- */}
                {serial && serial.lamination.length > 0 && (
                  <Section title={t("calc.lamination")}>
                    <div className="flex flex-wrap gap-2">
                      {serial.lamination.map((c) => (
                        <ColorSwatchButton
                          key={c}
                          id={c}
                          on={state.lamination === c}
                          onClick={() => set("lamination", c)}
                        />
                      ))}
                    </div>
                    {COLOR_SWATCHES[state.lamination] && (
                      <p className="mt-2 text-[11px] text-[#888]">
                        {COLOR_SWATCHES[state.lamination].name}
                      </p>
                    )}
                  </Section>
                )}

                {/* ---- fittings (brand + brand colors) ---- */}
                {serial && serial.fittings.length > 0 && (
                  <Section title={t("calc.fittings")}>
                    <div className="mb-2 flex flex-wrap gap-2">
                      {serial.fittings.map((b) => {
                        const on = state.fittingBrand === b.id;
                        return (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setFitting(b.id)}
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
                            on={state.fittingColor === c}
                            onClick={() => set("fittingColor", c)}
                          />
                        ))}
                      </div>
                    )}
                  </Section>
                )}

                {/* ---- components (sill / mosquito / ebb) with own width ---- */}
                <Section title={t("calc.components")}>
                  <div className="space-y-2">
                    {COMPONENTS.map((k) => {
                      const c = state.components[k];
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
                              onChange={(e) => setComponent(k, { enabled: e.target.checked })}
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
                                onChange={(e) => setComponent(k, { width: Number(e.target.value) })}
                                className="h-8 w-[90px] border border-[#DDD] bg-white px-2 text-[13px] font-semibold text-[#222] outline-none focus:border-orange"
                              />
                            </label>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Section>

                {/* ---- contacts ---- */}
                <Section title={t("calc.steps.contacts")}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-[11px] font-semibold text-[#666]">
                        {t("calc.name")} *
                      </span>
                      <input
                        value={state.name}
                        onChange={(e) => set("name", e.target.value)}
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
                        onChange={(e) => set("phone", e.target.value)}
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
                        onChange={(e) => set("email", e.target.value)}
                        className="h-[44px] w-full border border-[#DDD] bg-white px-3.5 text-[14px] outline-none focus:border-orange"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-[11px] font-semibold text-[#666]">
                        {t("calc.address")}
                      </span>
                      <input
                        value={state.address}
                        onChange={(e) => set("address", e.target.value)}
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
                      onChange={(e) => set("comment", e.target.value)}
                      rows={3}
                      className="w-full border border-[#DDD] bg-white px-3.5 py-3 text-[14px] outline-none focus:border-orange"
                    />
                  </label>
                  {error && (
                    <p className="mt-2 text-[13px] font-medium text-orange">
                      {t("calc.required")}
                    </p>
                  )}
                </Section>
              </>
            )}
          </div>

          {/* ========================= RIGHT: preview + price + CTA */}
          <div className="mx-auto w-full max-w-[420px] border border-[#ECECEC] bg-white px-4 py-5 sm:px-[22px] sm:py-7 lg:sticky lg:top-[120px] lg:mx-0 lg:max-w-none">
            <WindowPreview
              imageSrc={variant.image}
              width={state.width}
              height={state.height}
              alt={variantName}
              narrow={state.frame.startsWith("door-")}
            />
            <div className="mt-2 text-center text-[12px] font-semibold text-[#555]">
              {variantName}
            </div>

            {/* Compact summary of the current configuration */}
            <dl className="mt-4 space-y-1.5 border-t border-[#EEE] pt-3 text-[12px]">
              <SummaryRow
                k={t("calc.profileSerial")}
                v={serial?.name ?? "—"}
              />
              <SummaryRow
                k={t("calc.lamination")}
                v={COLOR_SWATCHES[state.lamination]?.name ?? "—"}
              />
              {currentFitting && (
                <SummaryRow k={t("calc.fittings")} v={currentFitting.name} />
              )}
              <SummaryRow
                k={t("calc.glass")}
                v={t(`glass.names.${state.glass}`)}
              />
              <SummaryRow
                k={t("calc.sizesTitle")}
                v={`${state.width} × ${state.height} мм • ${state.quantity} шт`}
              />
            </dl>

            <div className="mt-3 flex items-baseline justify-between border-t border-[#EEE] pt-3">
              <span className="text-[12px] text-[#888]">
                {t("calc.estimate")}
              </span>
              <b className="text-[17px] text-ink-2">
                {formatPrice(price, i18n.language)} UZS
              </b>
            </div>

            {!submitted && (
              <button
                type="button"
                onClick={submit}
                className="mt-4 w-full bg-orange px-[22px] py-3.5 text-[13px] font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-orange-d"
              >
                {t("calc.submit")}
              </button>
            )}
            <p className="mt-2 text-center text-[11px] text-[#999]">
              {t("calc.estimateNote")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SummaryRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="shrink-0 text-[#888]">{k}</dt>
      <dd className="m-0 truncate text-right font-semibold text-ink-2">{v}</dd>
    </div>
  );
}
