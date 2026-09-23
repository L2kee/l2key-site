import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // The vendored Flutter index.html is regenerated on every rebuild,
        // so its canonical is declared here instead of inside the file.
        source: "/electricalai-pro/app",
        headers: [
          { key: "Link", value: '<https://evogencyglobal.com/electricalai-pro/app>; rel="canonical"' },
        ],
      },
    ];
  },
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
        // The Flutter web build lives in public/electricalai-pro/app/;
        // /electricalai-pro itself is the product page in src/app.
        source: "/electricalai-pro/app",
        destination: "/electricalai-pro/app/index.html",
      },
    ];
  },
};

export default nextConfig;
