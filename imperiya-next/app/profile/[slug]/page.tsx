"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { getProfileBySlug } from "@/data/catalog";
import { WindowMark, ChevronLeft } from "@/components/ui/icons";

/**
 * Stub detail page. Each series is already routable; specs & photos
 * ("характеристики и картинки скину файлом" in the TZ) drop in here later
 * from the CMS.
 */
export default function ProfileDetailPage() {
  const { t } = useTranslation();
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";
  const profile = getProfileBySlug(slug);

  if (!profile) {
    return (
      <div className="bg-bg py-24 text-center">
        <div className="inner">
          <h1 className="text-lg font-extrabold uppercase tracking-[0.06em]">
            {t("notFound.title")}
          </h1>
          <Link
            href="/#profiles"
            className="mt-6 inline-flex bg-orange px-6 py-3 text-[13px] font-bold uppercase tracking-[0.06em] text-white hover:bg-orange-d"
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
          href="/#profiles"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-orange"
        >
          <ChevronLeft className="size-4" />
          {t("profiles.title")}
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div
            className="grid place-items-center border border-[#1f1f1f]"
            style={{
              aspectRatio: "4 / 3",
              background: "radial-gradient(80% 80% at 50% 60%,#3a3a3a,#0c0c0c)",
            }}
          >
            <WindowMark className="size-24 text-white/15" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-orange">
              {profile.category === "facade"
                ? t("profiles.categories.facade")
                : t("profiles.categories.pvc")}
            </span>
            <h1 className="mt-2 text-[40px] font-extrabold uppercase text-ink-2">
              {profile.name}
            </h1>
            <p className="mt-4 max-w-md text-[13px] leading-relaxed text-[#666]">
              {t("profiles.detailSoon")}
            </p>
            <Link
              href="/#calculator"
              className="mt-8 inline-flex w-fit bg-orange px-7 py-3.5 text-[13px] font-bold uppercase tracking-[0.06em] text-white hover:bg-orange-d"
            >
              {t("topbar.cta")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
