"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Smooth-scrolls to #hash anchors with a dynamic offset so the section title
 * is never hidden under the sticky header. Falls back to top on route change.
 */
export function ScrollManager() {
  const pathname = usePathname();

  useEffect(() => {
    function scrollToHash() {
      const hash = window.location.hash;
      if (!hash) {
        window.scrollTo({ top: 0 });
        return;
      }
      const raf = requestAnimationFrame(() => {
        const el = document.getElementById(hash.slice(1));
        if (!el) return;
        const headerH =
          document.querySelector("header")?.getBoundingClientRect().height ?? 0;
        const top =
          el.getBoundingClientRect().top + window.scrollY - headerH - 16;
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      });
      return () => cancelAnimationFrame(raf);
    }

    // Run on route changes
    const cleanup = scrollToHash();
    // Also catch in-page hash changes (e.g., clicking the same anchor twice)
    window.addEventListener("hashchange", scrollToHash);
    return () => {
      if (cleanup) cleanup();
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, [pathname]);

  return null;
}
