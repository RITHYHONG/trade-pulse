import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client"],
  images: {
    domains: [
      "images.unsplash.com", 
      "example.com",
      "firebasestorage.googleapis.com"
    ],
  },
  async rewrites() {
    return [
      {
        source: "/rss",
        destination: "/blog/rss.xml",
      },
    ];
  },
};

export default nextConfig;
