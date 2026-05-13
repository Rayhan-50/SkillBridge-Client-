import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      // These run BEFORE the filesystem is checked.
      // AI routes are handled by Next.js API routes, not proxied.
      beforeFiles: [],

      // These run AFTER the filesystem is checked but BEFORE dynamic routes.
      afterFiles: [
        {
          source: "/api/:path*",
          destination: `${process.env.BACKEND_URL || "http://localhost:4000"}/api/:path*`,
        },
      ],

      // Fallback rewrites
      fallback: [],
    };
  },
};

export default nextConfig;