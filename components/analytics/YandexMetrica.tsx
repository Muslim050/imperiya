"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Yandex Metrica. Yandex holds a large share of search in Uzbekistan, so
 * this is the counter that matters here — Metrica also feeds Вебмастер
 * with behavioural data.
 *
 * The counter id is env-driven: nothing renders until it is set, so local
 * dev and preview deploys don't pollute the production stats.
 *
 * `ssr: true` with an explicit referrer/url is Yandex's own recommendation
 * for server-rendered apps: the counter boots after hydration, by which
 * point those values can no longer be inferred reliably.
 *
 * Note there is deliberately no `defer` — it suppresses the pageview that
 * `init` sends, and the effect below only fires on navigation, so the
 * landing view would go uncounted.
 */
const COUNTER_ID = process.env.NEXT_PUBLIC_YANDEX_METRICA_ID;

/**
 * Webvisor records real sessions, including what visitors type. The
 * calculator collects phone numbers, so it stays off unless explicitly
 * enabled — and before enabling it, mark those inputs so Metrica masks
 * them (`class="ym-hide-content"` or `data-ym-disable-keys`).
 */
const WEBVISOR = process.env.NEXT_PUBLIC_YANDEX_METRICA_WEBVISOR === "true";

declare global {
  interface Window {
    ym?: (id: number, action: string, ...args: unknown[]) => void;
  }
}

export function YandexMetrica() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!COUNTER_ID) return;

    // The counter reports the initial view itself during init. Only
    // client-side navigations — switching language, opening a profile —
    // need a manual hit, otherwise they'd never appear in the reports.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    window.ym?.(Number(COUNTER_ID), "hit", window.location.href);
  }, [pathname]);

  if (!COUNTER_ID) return null;

  return (
    <>
      <Script id="yandex-metrica" strategy="afterInteractive">
        {`
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
          (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

          ym(${Number(COUNTER_ID)}, "init", {
            ssr: true,
            referrer: document.referrer,
            url: location.href,
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: ${WEBVISOR}
          });
        `}
      </Script>
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://mc.yandex.ru/watch/${Number(COUNTER_ID)}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
