"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useLocalePath } from "@/lib/useLocalePath";
import { useLang } from "@/components/I18nProvider";
import { formatSpecValue } from "@/lib/specs";
import { getProfileBySlug } from "@/data/catalog";
import { WindowMark, ChevronLeft } from "@/components/ui/icons";
import { scrollToAnchor, isOnHome } from "@/lib/scrollToAnchor";

/**
 * Per-series detail view. Pulls the photo + spec table from the catalog
 * (sourced from the client's `Серии профилей.docx`). The CTA scrolls to
 * the calculator on home or navigates there if we're on a detail route.
 * The `slug` is provided by the server page, which also owns metadata.
 */
export function ProfileDetailClient({ slug }: { slug: string }) {
  const { t } = useTranslation();
  const href = useLocalePath();
  const lang = useLang();
  const profile = getProfileBySlug(slug);

  if (!profile) {
    return (
      <div className="bg-bg py-24 text-center">
        <div className="inner">
          <h1 className="text-lg font-extrabold uppercase tracking-[0.06em]">
            {t("notFound.title")}
          </h1>
          <Link
            href={href("/#profiles")}
            className="mt-6 inline-flex rounded-md bg-orange px-6 py-3 text-[13px] font-bold uppercase tracking-[0.06em] text-white shadow-[0_8px_20px_-16px_rgba(15,15,15,.38)] hover:bg-orange-d"
          >
            {t("notFound.home")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg py-12">
      <div className="inner">
        <Link
          href={href("/#profiles")}
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-orange"
        >
          <ChevronLeft className="size-4" />
          {t("profiles.title")}
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div
            className="relative grid place-items-center overflow-hidden rounded-lg border border-[#1f1f1f] shadow-[0_16px_34px_-26px_rgba(15,15,15,.42)]"
            style={{
              background: "radial-gradient(80% 80% at 50% 60%,#3a3a3a,#0c0c0c)",
            }}
          >
            {profile.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.image}
                alt={profile.name}
                loading="eager"
                decoding="async"
                className="size-full object-contain p-8"
              />
            ) : (
              <WindowMark className="size-24 text-white/15" />
            )}
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-orange">
              {profile.category === "facade"
                ? t("profiles.categories.facade")
                : t("profiles.categories.pvc")}
            </span>
            <h1 className="mt-2 text-[40px] font-extrabold uppercase leading-none text-ink-2">
              {profile.name}
            </h1>

            {profile.specs && profile.specs.length > 0 ? (
              <dl className="mt-6 divide-y divide-[#E6E6E6] border-y border-[#E6E6E6]">
                {profile.specs.map((s) => (
                  <div
                    key={s.key}
                    className="flex items-baseline justify-between gap-4 py-2.5 text-[13px]"
                  >
                    <dt className="text-[#666]">{t(`specs.labels.${s.key}`)}</dt>
                    <dd className="m-0 text-right font-semibold text-ink-2">
                      {formatSpecValue(s.value, t, lang)}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-4 max-w-md text-[13px] leading-relaxed text-[#666]">
                {t("profiles.detailSoon")}
              </p>
            )}

            <Link
              href={href("/#calculator")}
              onClick={(e) => {
                if (isOnHome()) {
                  e.preventDefault();
                  scrollToAnchor("calculator");
                }
              }}
              className="mt-8 inline-flex w-fit rounded-md bg-orange px-7 py-3.5 text-[13px] font-bold uppercase tracking-[0.06em] text-white shadow-[0_8px_20px_-16px_rgba(15,15,15,.38)] hover:bg-orange-d"
            >
              {t("topbar.cta")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
