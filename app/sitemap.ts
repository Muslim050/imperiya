import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { PROFILE_SERIES } from "@/data/catalog";
import { LANG_CODES, DEFAULT_LANG } from "@/i18n/config";
import { localePath } from "@/lib/locale";

export default function sitemap(): MetadataRoute.Sitemap {
  /**
   * Every route here is statically generated, so build time IS the moment
   * the content last changed — a redeploy is the only way it can differ.
   * Without <lastmod> crawlers have no freshness signal and fall back to
   * their own recrawl heuristics, which are far slower.
   */
  const lastModified = new Date();

  /**
   * Each URL carries the full hreflang set for its page, so a crawler that
   * finds any one language immediately learns about the other two. Google
   * requires the annotations to be reciprocal and to include a self
   * reference — `alternates.languages` here mirrors what the pages emit.
   */
  const entry = (
    path: string,
    rest: Omit<MetadataRoute.Sitemap[number], "url" | "alternates">,
  ): MetadataRoute.Sitemap =>
    LANG_CODES.map((lang) => ({
      url: `${SITE_URL}${localePath(lang, path)}`,
      lastModified,
      alternates: {
        languages: Object.fromEntries([
          ...LANG_CODES.map((code) => [
            code,
            `${SITE_URL}${localePath(code, path)}`,
          ]),
          ["x-default", `${SITE_URL}${localePath(DEFAULT_LANG, path)}`],
        ]),
      },
      ...rest,
    }));

  return [
    ...entry("/", { changeFrequency: "weekly", priority: 1 }),
    ...PROFILE_SERIES.flatMap((p) =>
      entry(`/profile/${p.slug}`, {
        changeFrequency: "monthly",
        priority: 0.8,
      }),
    ),
  ];
}
