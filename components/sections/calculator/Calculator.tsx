"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn, formatPrice } from "@/lib/utils";
import { WindowPreview } from "./WindowPreview";
import { SHAPE_SVG, TYPE_SVG } from "./shapes";
import { PROFILE_SERIES } from "@/data/catalog";
import {
  CONSTRUCTION_TYPES,
  SHAPES,
  COLORS,
  SERIES_OPTIONS,
  GLASS_OPTIONS,
  initialCalcState,
  estimatePrice,
  type CalcState,
} from "@/data/calculator";

const STEPS = ["type", "sizes", "params", "extra", "contacts"] as const;
const seriesName = (slug: string) =>
  PROFILE_SERIES.find((p) => p.slug === slug)?.name ?? slug;

const PTITLE = "m-0 mb-3.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink-2";
const SELECT =
  "flex items-center justify-between border border-[#DDD] bg-white px-3.5 py-[11px] text-[13px] font-medium text-[#444]";

export function Calculator() {
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState(0);
  const [state, setState] = useState<CalcState>(initialCalcState);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const price = useMemo(() => estimatePrice(state), [state]);
  const set = <K extends keyof CalcState>(k: K, v: CalcState[K]) =>
    setState((s) => ({ ...s, [k]: v }));
  const isLast = step === STEPS.length - 1;

  function advance() {
    if (isLast) {
      if (!state.name.trim() || !state.phone.trim()) {
        setError(true);
        return;
      }
      setSubmitted(true);
      return;
    }
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  }

  return (
    <section id="calculator" className="scroll-mt-40 bg-bg py-10 sm:py-[38px]">
      <div className="inner">
      <h2 className="m-0 mb-1 text-[22px] font-extrabold uppercase tracking-[0.02em]">
        {t("calc.title")}
      </h2>
      <div className="mb-[22px] text-[13px] text-[#777]">{t("calc.subtitle")}</div>

      {/* Stepper */}
      <div className="mb-6 flex flex-wrap gap-x-[42px] gap-y-3 border-b border-[#E4E4E4] pb-[18px]">
        {STEPS.map((s, i) => {
          const active = i === step;
          return (
            <button
              key={s}
              type="button"
              onClick={() => !submitted && setStep(i)}
              className={cn(
                "flex items-center gap-2.5 text-[13px] font-semibold",
                active ? "text-[#111]" : "text-[#9a9a9a]",
              )}
            >
              <span
                className={cn(
                  "grid size-[22px] place-items-center rounded-full text-[12px] font-bold text-white",
                  active ? "bg-orange" : "bg-[#DCDCDC]",
                )}
              >
                {i + 1}
              </span>
              {t(`calc.steps.${s}`)}
            </button>
          );
        })}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">
        {/* LEFT PANEL */}
        <div className="border border-[#ECECEC] bg-white p-[22px]">
          {submitted ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
              <span className="grid size-14 place-items-center rounded-full bg-[#FFF6EB] text-orange">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <p className="mt-4 max-w-sm text-base font-semibold text-ink-2">
                {t("calc.success")}
              </p>
            </div>
          ) : step === 0 ? (
            <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
              <div>
                <div className={PTITLE}>{t("calc.constructionType")}</div>
                <div className="flex flex-col gap-1.5">
                  {CONSTRUCTION_TYPES.map((tp) => {
                    const on = state.type === tp;
                    return (
                      <button
                        key={tp}
                        type="button"
                        onClick={() => set("type", tp)}
                        className={cn(
                          "flex items-center gap-2.5 border px-3 py-2.5 text-left text-[13px] font-semibold transition-colors",
                          on
                            ? "border-[#F3B66A] bg-[#FFF6EB] text-[#111]"
                            : "border-[#EFEFEF] text-[#3a3a3a] hover:border-[#cfcfcf]",
                        )}
                      >
                        <span className={on ? "text-orange" : "text-[#555]"}>
                          {TYPE_SVG[tp]}
                        </span>
                        {t(`calc.types.${tp}`)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className={PTITLE}>{t("calc.shape")}</div>
                <div className="mb-[18px] grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
                  {SHAPES.map((sh) => {
                    const on = state.shape === sh;
                    return (
                      <button
                        key={sh}
                        type="button"
                        onClick={() => set("shape", sh)}
                        className={cn(
                          "border bg-white px-1.5 pt-3.5 pb-2.5 text-center transition-colors",
                          on ? "border-orange" : "border-[#EFEFEF] hover:border-[#cfcfcf]",
                        )}
                      >
                        <span className="mx-auto mb-2 flex h-12 items-center justify-center">
                          {SHAPE_SVG[sh]}
                        </span>
                        <span className="text-[11px] font-semibold text-[#444]">
                          {t(`calc.shapes.${sh}`)}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="grid gap-[18px] sm:grid-cols-[1.1fr_1fr_1fr]">
                  <div>
                    <h4 className={PTITLE}>{t("calc.color")}</h4>
                    <div className="flex items-center gap-2">
                      {COLORS.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          title={t(`calc.colors.${c.id}`)}
                          aria-label={t(`calc.colors.${c.id}`)}
                          onClick={() => set("color", c.id)}
                          className={cn(
                            "relative size-[30px] border",
                            state.color === c.id
                              ? "border-[#ddd] outline outline-[1.5px] outline-orange outline-offset-2"
                              : "border-[#ddd]",
                          )}
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                      <span className="grid size-[30px] place-items-center border border-[#ddd] font-bold text-[#888]">
                        +
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className={PTITLE}>{t("calc.series")}</h4>
                    <select
                      value={state.series}
                      onChange={(e) => set("series", e.target.value)}
                      className={cn(SELECT, "w-full appearance-none")}
                    >
                      {SERIES_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {seriesName(s)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <h4 className={PTITLE}>{t("calc.glass")}</h4>
                    <select
                      value={state.glass}
                      onChange={(e) => set("glass", e.target.value as CalcState["glass"])}
                      className={cn(SELECT, "w-full appearance-none")}
                    >
                      {GLASS_OPTIONS.map((g) => (
                        <option key={g} value={g}>
                          {t(`glass.names.${g}`)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ) : step === 1 ? (
            <>
              <div className={PTITLE}>{t("calc.steps.sizes")}</div>
              <div className="grid gap-[18px] sm:grid-cols-3">
                {(
                  [
                    ["width", t("calc.width"), 300, 6000],
                    ["height", t("calc.height"), 300, 3500],
                    ["quantity", t("calc.quantity"), 1, 100],
                  ] as const
                ).map(([k, label, min, max]) => (
                  <label key={k} className="block">
                    <span className="mb-2 block text-[11px] font-semibold text-[#666]">
                      {label}
                    </span>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={min}
                      max={max}
                      value={state[k]}
                      onChange={(e) => set(k, Number(e.target.value))}
                      className="h-[46px] w-full border border-[#DDD] bg-white px-3.5 text-[15px] font-semibold text-[#222] outline-none focus:border-orange"
                    />
                  </label>
                ))}
              </div>
            </>
          ) : step === 2 ? (
            <>
              <div className={PTITLE}>{t("calc.steps.params")}</div>
              <div className="grid gap-[18px] sm:grid-cols-2">
                <div>
                  <h4 className="mb-2 text-[11px] font-semibold text-[#666]">
                    {t("calc.series")}
                  </h4>
                  <select
                    value={state.series}
                    onChange={(e) => set("series", e.target.value)}
                    className={cn(SELECT, "w-full appearance-none")}
                  >
                    {SERIES_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {seriesName(s)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <h4 className="mb-2 text-[11px] font-semibold text-[#666]">
                    {t("calc.glass")}
                  </h4>
                  <select
                    value={state.glass}
                    onChange={(e) => set("glass", e.target.value as CalcState["glass"])}
                    className={cn(SELECT, "w-full appearance-none")}
                  >
                    {GLASS_OPTIONS.map((g) => (
                      <option key={g} value={g}>
                        {t(`glass.names.${g}`)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          ) : step === 3 ? (
            <>
              <div className={PTITLE}>{t("calc.additional")}</div>
              <div className="grid gap-3 sm:grid-cols-2">
                {(["mosquito", "sill"] as const).map((k) => {
                  const on = state[k];
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => set(k, !on)}
                      className={cn(
                        "flex items-center gap-2.5 border p-4 text-left text-[13px] font-medium transition-colors",
                        on ? "border-orange bg-[#FFF6EB]" : "border-[#EFEFEF] hover:border-[#cfcfcf]",
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-4 place-items-center border-[1.5px]",
                          on ? "border-ink-2 bg-ink-2 text-white" : "border-[#1a1a1a] bg-white",
                        )}
                      >
                        {on && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M1 5l3 3 5-7" stroke="currentColor" strokeWidth="1.6" />
                          </svg>
                        )}
                      </span>
                      {t(`calc.${k}`)}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <div className={PTITLE}>{t("calc.steps.contacts")}</div>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-[11px] font-semibold text-[#666]">
                      {t("calc.name")} *
                    </span>
                    <input
                      value={state.name}
                      onChange={(e) => set("name", e.target.value)}
                      className={cn(
                        "h-[46px] w-full border bg-white px-3.5 text-[14px] outline-none focus:border-orange",
                        error && !state.name.trim() ? "border-orange" : "border-[#DDD]",
                      )}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-[11px] font-semibold text-[#666]">
                      {t("calc.phone")} *
                    </span>
                    <input
                      value={state.phone}
                      inputMode="tel"
                      placeholder="+998"
                      onChange={(e) => set("phone", e.target.value)}
                      className={cn(
                        "h-[46px] w-full border bg-white px-3.5 text-[14px] outline-none focus:border-orange",
                        error && !state.phone.trim() ? "border-orange" : "border-[#DDD]",
                      )}
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="mb-2 block text-[11px] font-semibold text-[#666]">
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
                  <p className="text-[13px] font-medium text-orange">
                    {t("calc.required")}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* RIGHT PREVIEW */}
        <div className="border border-[#ECECEC] bg-white px-[22px] py-7">
          <WindowPreview
            shape={state.shape}
            width={state.width}
            height={state.height}
            color={COLORS.find((c) => c.id === state.color)?.hex ?? "#ffffff"}
          />

          <div className={cn(PTITLE, "mt-[18px]")}>{t("calc.additional")}</div>
          <div className="flex flex-col gap-2.5">
            {(["mosquito", "sill"] as const).map((k) => {
              const on = state[k];
              return (
                <label
                  key={k}
                  className="flex cursor-pointer items-center gap-2.5 text-[13px] font-medium text-[#222]"
                  onClick={() => set(k, !on)}
                >
                  <span
                    className={cn(
                      "grid size-4 place-items-center border-[1.5px] border-ink-2 text-white",
                      on ? "bg-ink-2" : "bg-white",
                    )}
                  >
                    {on && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1 5l3 3 5-7" stroke="currentColor" strokeWidth="1.6" />
                      </svg>
                    )}
                  </span>
                  {t(`calc.${k}`)}
                </label>
              );
            })}
          </div>

          <div className="mt-3 border-t border-[#EEE] pt-3 text-[13px]">
            <span className="text-[#888]">{t("calc.estimate")}: </span>
            <b className="text-ink-2">
              {formatPrice(price, i18n.language)} UZS
            </b>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            {step > 0 && !submitted ? (
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="text-[12px] font-semibold text-[#888] hover:text-ink-2"
              >
                ← {t("calc.back")}
              </button>
            ) : (
              <span className="text-[12px] text-[#888]">
                {t("calc.sendMessenger")}
              </span>
            )}
            {!submitted && (
              <button
                type="button"
                onClick={advance}
                className="bg-orange px-[22px] py-3.5 text-[13px] font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-orange-d"
              >
                {isLast ? t("calc.getResult") : t("calc.next")}
              </button>
            )}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}