import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: false,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default withPayload(nextConfig);
