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
  // Turbopack config (Next.js 16 default)
  turbopack: {},
  // Webpack config for pdfjs-dist canvas fallback (used in production build)
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
