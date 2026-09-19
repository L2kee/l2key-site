import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/work", destination: "/works", permanent: true }];
  },
  async rewrites() {
    return [
      {
        source: "/agency-os",
        destination: "https://agency-os-v2-sage.vercel.app/agency-os",
      },
      {
        source: "/agency-os/:path*",
        destination: "https://agency-os-v2-sage.vercel.app/agency-os/:path*",
      },
      {
        source: "/electricalai-pro",
        destination: "/electricalai-pro/index.html",
      },
    ];
  },
};

export default nextConfig;
