import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { PROFILE_SERIES } from "@/data/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const home: MetadataRoute.Sitemap[number] = {
    url: `${SITE_URL}/`,
    changeFrequency: "weekly",
    priority: 1,
  };

  const profiles: MetadataRoute.Sitemap = PROFILE_SERIES.map((p) => ({
    url: `${SITE_URL}/profile/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [home, ...profiles];
}
