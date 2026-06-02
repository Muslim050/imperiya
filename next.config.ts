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
};

export default nextConfig;
