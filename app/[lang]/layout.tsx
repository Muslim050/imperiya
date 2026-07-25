import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import ReactDOM from "react-dom";
import { Manrope } from "next/font/google";
import "../globals.css";
import { I18nProvider } from "@/components/I18nProvider";
import { ScrollManager } from "@/components/ScrollManager";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileContactBar } from "@/components/layout/MobileContactBar";
import { JsonLd } from "@/components/seo/JsonLd";
import { LANG_CODES, OG_LOCALES, isLangCode, type LangCode } from "@/i18n/config";
import { localePath } from "@/lib/locale";
import {
  SITE_URL,
  SITE_NAME,
  SITE_KEYWORDS,
  siteTitle,
  siteDescription,
  languageAlternates,
} from "@/lib/site";

/**
 * Self-hosted by next/font at build time: no request to fonts.googleapis.com,
 * so nothing blocks first render and there's no third-party connection to
 * negotiate. `cyrillic` is required — Russian is the primary language.
 * `display: swap` + the auto-generated size-adjusted fallback keep CLS at
 * zero while the face loads.
 */
const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-manrope",
  // The system-font tail lives in --font-sans (globals.css); next/font adds
  // its own metric-matched "Manrope Fallback" ahead of it automatically.
});

/** Only these three segments are real routes — see `dynamicParams`. */
export function generateStaticParams() {
  return LANG_CODES.map((lang) => ({ lang }));
}

/**
 * Without this, `/anything` would render the layout with lang="anything"
 * instead of 404ing, creating unlimited crawlable duplicate URLs. Unknown
 * paths are rejected at routing — no render, no function invocation.
 */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLangCode(lang)) return {};

  const title = siteTitle(lang);
  const description = siteDescription(lang);

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s — ${SITE_NAME}` },
    description,
    keywords: SITE_KEYWORDS[lang],
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    alternates: {
      canonical: localePath(lang, "/"),
      languages: languageAlternates("/"),
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url: `${SITE_URL}${localePath(lang, "/")}`,
      locale: OG_LOCALES[lang],
      alternateLocale: LANG_CODES.filter((c) => c !== lang).map(
        (c) => OG_LOCALES[c],
      ),
    },
    twitter: { card: "summary_large_image", title, description },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    formatDetection: { telephone: true, address: true },
    /**
     * Ownership proof for the webmaster consoles. Yandex matters as much as
     * Google here — it holds a large share of search in Uzbekistan. Both are
     * env-driven so the codebase carries no account-specific tokens; the tag
     * is simply omitted until the value is set on the deploy target.
     */
    verification: {
      ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
        ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
        : {}),
      ...(process.env.NEXT_PUBLIC_YANDEX_VERIFICATION
        ? { yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION }
        : {}),
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#0e0e0e",
  width: "device-width",
  initialScale: 1,
};

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLangCode(lang)) notFound();

  // The hero banner is the LCP element. Kick off its fetch from the head,
  // at high priority, before the parser reaches the markup. Done via the
  // preload API rather than a literal <link> so React emits it exactly
  // once — a <link> placed inside <head> gets hoisted and duplicated.
  ReactDOM.preload("/hero/engelberg.jpg", {
    as: "image",
    fetchPriority: "high",
  });

  return (
    <html lang={lang} className={manrope.variable}>
      <head>
        <JsonLd lang={lang as LangCode} />
      </head>
      <body>
        <I18nProvider lang={lang}>
          <div className="page pb-[calc(64px+env(safe-area-inset-bottom))] lg:pb-0">
            <ScrollManager />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <MobileContactBar />
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}
