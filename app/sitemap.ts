import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { PROFILE_SERIES } from "@/data/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  /**
   * Every route here is statically generated, so build time IS the moment
   * the content last changed — a redeploy is the only way it can differ.
   * Without <lastmod> crawlers have no freshness signal and fall back to
   * their own recrawl heuristics, which are far slower.
   */
  const lastModified = new Date();

  const home: MetadataRoute.Sitemap[number] = {
    url: `${SITE_URL}/`,
    lastModified,
    changeFrequency: "weekly",
    priority: 1,
  };

  const profiles: MetadataRoute.Sitemap = PROFILE_SERIES.map((p) => ({
    url: `${SITE_URL}/profile/${p.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [home, ...profiles];
}
