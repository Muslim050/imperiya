import { SITE_URL, SITE_NAME, BUSINESS, siteDescription } from "@/lib/site";
import { localePath } from "@/lib/locale";
import type { LangCode } from "@/i18n/config";
import { SERVICES } from "@/data/catalog";
import ru from "@/i18n/locales/ru";
import uz from "@/i18n/locales/uz";
import en from "@/i18n/locales/en";

const LOCALES = { ru, uz, en } as const;

/**
 * Site-wide structured data (Schema.org / JSON-LD): the business itself
 * plus a WebSite node. Rendered server-side so crawlers see it in the
 * initial HTML.
 *
 * Emitted as one @graph rather than several <script> blocks so the nodes
 * can reference each other by @id — Google then reads them as one entity
 * described from several angles instead of unrelated fragments.
 */
export function JsonLd({ lang }: { lang: LangCode }) {
  const home = `${SITE_URL}${localePath(lang, "/")}`;
  const t = LOCALES[lang];

  const business = {
    /* HomeAndConstructionBusiness is the closest concrete type Google
     * recognises; a bare LocalBusiness says nothing about the trade. */
    "@type": ["Organization", "HomeAndConstructionBusiness"],
    // One @id across all three languages — the graph describes one company,
    // not three.
    "@id": `${SITE_URL}/#business`,
    name: SITE_NAME,
    legalName: BUSINESS.legalName,
    url: home,
    logo: `${SITE_URL}/icon.svg`,
    image: `${SITE_URL}/opengraph-image`,
    description: siteDescription(lang),
    telephone: BUSINESS.phone,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.address.street,
      addressLocality: BUSINESS.address.locality,
      addressRegion: BUSINESS.address.region,
      addressCountry: BUSINESS.address.country,
    },
    areaServed: BUSINESS.areaServed.map((name) => ({
      "@type": "AdministrativeArea",
      name,
    })),
    /* The services block, so the business entity carries what it sells
     * rather than leaving Google to infer it from page copy. */
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: t.services.title,
      itemListElement: SERVICES.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: t.services.items[s] },
      })),
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: BUSINESS.hours.opens,
      closes: BUSINESS.hours.closes,
    },
    /* No `sameAs`: the client dropped social profiles from the site, and
     * the property is only meaningful with real, reachable URLs. */
  };

  const website = {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: home,
    name: SITE_NAME,
    description: siteDescription(lang),
    inLanguage: lang,
    publisher: { "@id": `${SITE_URL}/#business` },
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe to inline; no user input involved.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [business, website],
        }),
      }}
    />
  );
}
