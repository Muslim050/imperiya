import { SITE_URL, SITE_NAME } from "@/lib/site";
import { localePath } from "@/lib/locale";
import { formatSpecValue, lookup } from "@/lib/specs";
import type { LangCode } from "@/i18n/config";
import type { ProfileSeries } from "@/data/catalog";
import ru from "@/i18n/locales/ru";
import uz from "@/i18n/locales/uz";
import en from "@/i18n/locales/en";

const LOCALES = { ru, uz, en } as const;

/**
 * Per-series structured data: a Product describing the profile, and the
 * BreadcrumbList that tells Google where the page sits.
 *
 * No `offers` node — pricing depends on size and configuration and is
 * only settled after an on-site measure, so quoting a number here would
 * be a claim the site can't honour. The spec table ships as
 * `additionalProperty` instead, which is what makes the page legible as
 * a product rather than prose.
 */
export function ProfileJsonLd({
  profile,
  lang,
}: {
  profile: ProfileSeries;
  lang: LangCode;
}) {
  const t = LOCALES[lang];
  const translate = lookup(t);
  const path = `/profile/${profile.slug}`;
  const url = `${SITE_URL}${localePath(lang, path)}`;

  const product = {
    "@type": "Product",
    "@id": `${url}#product`,
    name: profile.name,
    url,
    category:
      profile.category === "facade"
        ? t.profiles.categories.facade
        : t.profiles.categories.pvc,
    ...(profile.image ? { image: `${SITE_URL}${profile.image}` } : {}),
    brand: { "@type": "Brand", name: profile.name.split(" ")[0] },
    manufacturer: { "@id": `${SITE_URL}/#business` },
    ...(profile.specs?.length
      ? {
          additionalProperty: profile.specs.map((s) => ({
            "@type": "PropertyValue",
            name: translate(`specs.labels.${s.key}`),
            value: formatSpecValue(s.value, translate, lang),
          })),
        }
      : {}),
  };

  const breadcrumbs = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: SITE_NAME,
        item: `${SITE_URL}${localePath(lang, "/")}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t.profiles.title,
        item: `${SITE_URL}${localePath(lang, "/#profiles")}`,
      },
      { "@type": "ListItem", position: 3, name: profile.name, item: url },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [product, breadcrumbs],
        }),
      }}
    />
  );
}
