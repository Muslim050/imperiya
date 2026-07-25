import type { NextConfig } from "next";
/* Payload CMS temporarily disabled for the first Vercel deploy — the
 * sqlite-backed config can't run on Vercel's read-only filesystem and
 * we don't have a hosted Postgres yet. To re-enable later:
 *   1. Provision Postgres (Vercel Marketplace → Neon free tier works)
 *   2. Set DATABASE_URL + PAYLOAD_SECRET env vars on the project
 *   3. Switch payload.config.ts adapter from sqlite to postgres
 *   4. Uncomment the withPayload wrap below
 *   5. Rename app/_payload-disabled/ back to app/(payload)/
 */
// import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  /**
   * Every language lives under its own prefix, so the un-prefixed URLs the
   * site used to serve must move permanently. 308 (Next's `permanent: true`)
   * passes ranking signals on exactly like a 301 and, unlike 302, tells
   * crawlers to replace the old URL in the index rather than keep it.
   */
  async redirects() {
    return [
      { source: "/", destination: "/ru", permanent: true },
      {
        source: "/profile/:slug",
        destination: "/ru/profile/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
