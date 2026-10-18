import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, "../.."),
  devIndicators: false,
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    // Placeholder stock photography; replace with the brand's own shoot later.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
