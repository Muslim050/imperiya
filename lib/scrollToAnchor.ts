/**
 * Smooth-scrolls to the element with the given id, accounting for the sticky
 * header so the section title isn't hidden underneath. Updates window.location.hash
 * so the URL reflects the current section.
 *
 * Use this from in-page anchor CTAs (calculator, contacts, services). Next.js
 * <Link> can mis-handle same-path hash navigation (no hashchange fired,
 * native scroll ignores sticky header offset), so this bypasses Next entirely.
 */
export function scrollToAnchor(id: string) {
  if (typeof window === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;
  const headerH =
    document.querySelector("header")?.getBoundingClientRect().height ?? 0;
  const top =
    el.getBoundingClientRect().top + window.scrollY - headerH - 16;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  // Keep the URL in sync without triggering a navigation event.
  window.history.replaceState(null, "", `#${id}`);
}

/**
 * Returns true when we're already on the home page — in which case clicking
 * an "/#foo" link should scroll locally rather than re-navigate via Next.
 */
export function isOnHome(): boolean {
  return (
    typeof window !== "undefined" && window.location.pathname === "/"
  );
}
