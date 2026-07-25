import type { Metadata, Viewport } from "next";
import ReactDOM from "react-dom";
import { Manrope } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/components/I18nProvider";
import { ScrollManager } from "@/components/ScrollManager";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileContactBar } from "@/components/layout/MobileContactBar";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  SITE_URL,
  SITE_NAME,
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
} from "@/lib/site";

/**
 * Self-hosted by next/font at build time: no request to fonts.googleapis.com,
 * so nothing blocks first render and there's no third-party connection to
 * negotiate. `cyrillic` is required — the whole site is Russian. `display:
 * swap` + the auto-generated size-adjusted fallback keep CLS at zero while
 * the face loads.
 */
const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-manrope",
  // The system-font tail lives in --font-sans (globals.css); next/font adds
  // its own metric-matched "Manrope Fallback" ahead of it automatically.
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "ru_RU",
    alternateLocale: ["uz_UZ", "en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
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
  formatDetection: {
    telephone: true,
    address: true,
  },
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

export const viewport: Viewport = {
  themeColor: "#0e0e0e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The hero banner is the LCP element. Kick off its fetch from the head,
  // at high priority, before the parser reaches the markup. Done via the
  // preload API rather than a literal <link> so React emits it exactly
  // once — a <link> placed inside <head> gets hoisted and duplicated.
  ReactDOM.preload("/hero/engelberg.jpg", {
    as: "image",
    fetchPriority: "high",
  });

  return (
    <html lang="ru" className={manrope.variable}>
      <head>
        <JsonLd />
      </head>
      <body>
        <I18nProvider>
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
