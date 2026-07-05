import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  BUSINESS,
} from "@/lib/site";
import { SOCIALS } from "@/data/catalog";

/**
 * Organization + LocalBusiness structured data (Schema.org / JSON-LD).
 * Improves local SEO and rich results (business name, phone, address,
 * opening hours) in Google Search and Maps. Rendered server-side so
 * crawlers see it in the initial HTML.
 */
export function JsonLd() {
  const sameAs = SOCIALS.map((s) => s.href).filter((h) => h && h !== "#");

  const data = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": `${SITE_URL}/#business`,
    name: SITE_NAME,
    legalName: BUSINESS.legalName,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    image: `${SITE_URL}/opengraph-image`,
    description: SITE_DESCRIPTION,
    telephone: BUSINESS.phone,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.address.street,
      addressLocality: BUSINESS.address.locality,
      addressRegion: BUSINESS.address.region,
      addressCountry: BUSINESS.address.country,
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
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe to inline; no user input involved.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
