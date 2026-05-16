import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow external image URLs
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Netlify compatibility
  output: "standalone",
};

export default nextConfig;
