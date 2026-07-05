import type { Metadata } from "next";
import { PROFILE_SERIES, getProfileBySlug } from "@/data/catalog";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { ProfileDetailClient } from "./ProfileDetailClient";

/** Pre-render every known series as a static page (better SEO + speed). */
export function generateStaticParams() {
  return PROFILE_SERIES.map((p) => ({ slug: p.slug }));
}

const categoryLabel = (category: string) =>
  category === "facade" ? "фасадные системы" : "ПВХ-профиль";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const profile = getProfileBySlug(slug);

  if (!profile) {
    return { title: "Профиль не найден", robots: { index: false } };
  }

  const title = `Профиль ${profile.name}`;
  const depth = profile.specs?.find((s) =>
    s.label.toLowerCase().includes("монтажная глубина"),
  )?.value;
  const description = `${profile.name} — ${categoryLabel(profile.category)}${
    depth ? `, монтажная глубина ${depth}` : ""
  }. Характеристики, остекление и монтаж под ключ. Расчёт стоимости онлайн в ${SITE_NAME}.`;

  return {
    title,
    description,
    alternates: { canonical: `/profile/${slug}` },
    openGraph: {
      type: "article",
      title: `${title} — ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/profile/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${SITE_NAME}`,
      description,
    },
  };
}

export default async function ProfileDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProfileDetailClient slug={slug} />;
}
