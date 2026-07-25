import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_TITLE, SITE_DESCRIPTION } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_TITLE,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0e0e0e",
    lang: "ru",
    /**
     * Android's installer ignores SVG — without a 192 and a 512 PNG the
     * "Add to home screen" prompt never becomes available and Lighthouse
     * fails the installability audit. The maskable variant keeps the mark
     * inside the safe zone when the launcher crops it to a circle.
     */
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
