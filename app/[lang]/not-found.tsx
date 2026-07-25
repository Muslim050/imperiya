"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useLocalePath } from "@/lib/useLocalePath";

export default function NotFound() {
  const { t } = useTranslation();
  const href = useLocalePath();
  return (
    <div className="grid min-h-[60vh] place-items-center bg-bg px-5 py-24 text-center">
      <div>
        <p className="text-7xl font-extrabold text-orange">404</p>
        <h1 className="mt-4 text-lg font-extrabold uppercase tracking-[0.06em]">
          {t("notFound.title")}
        </h1>
        <Link
          href={href("/")}
          className="mt-8 inline-flex rounded-md bg-orange px-6 py-3 text-[13px] font-bold uppercase tracking-[0.06em] text-white shadow-[0_8px_20px_-16px_rgba(15,15,15,.38)] hover:bg-orange-d"
        >
          {t("notFound.home")}
        </Link>
      </div>
    </div>
  );
}
