import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  serverExternalPackages: ["@prisma/client"],
  // Transpile workspace packages so Next.js handles their raw TypeScript source.
  // recharts v3 is ESM-only; transpiling it lets webpack bundle its d3 deps.
  transpilePackages: [
    "@trade-pulse/ui",
    "@trade-pulse/types",
    "@trade-pulse/config",
    "recharts",
  ],
  // Turbopack alias: explicitly map @/ to apps/web/src using absolute paths so
  // turbopack doesn't accidentally anchor resolution at the pnpm workspace root.
  turbopack: {
    resolveAlias: {
      // Absolute paths ensure resolution works regardless of CWD anchor point.
      "@trade-pulse/ui": path.join(__dirname, "../../packages/ui/src/index.ts"),
      "@trade-pulse/types": path.join(__dirname, "../../packages/types/src/index.ts"),
      "@trade-pulse/config": path.join(__dirname, "../../packages/config/src/index.ts"),
    },
  },
  webpack(config) {
    // In a pnpm monorepo, webpack resolves transitive deps from the pnpm virtual
    // store. Adding the monorepo root node_modules as a fallback lets it find
    // hoisted packages (d3-*, etc.) that live outside the pnpm .pnpm directory.
    const monoRoot = path.resolve(__dirname, "../../node_modules");
    if (!config.resolve.modules) config.resolve.modules = ["node_modules"];
    if (!config.resolve.modules.includes(monoRoot)) {
      config.resolve.modules.push(monoRoot);
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
    ],
  },
  async headers() {
    // Only apply CSP in production, allow everything in development for Google Auth
    if (process.env.NODE_ENV === "development") {
      return [];
    }

    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://www.gstatic.com https://securetoken.googleapis.com https://www.googleapis.com https://ajax.googleapis.com https://imasdk.googleapis.com",
              "script-src-elem 'self' 'unsafe-inline' https://apis.google.com https://www.gstatic.com https://securetoken.googleapis.com https://www.googleapis.com https://ajax.googleapis.com https://imasdk.googleapis.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https: http:",
              "connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.googleapis.com https://firebase.googleapis.com https://firestore.googleapis.com https://*.firebaseio.com https://accounts.google.com",
              "frame-src 'self' https://accounts.google.com https://content.googleapis.com",
              "object-src 'none'",
              "base-uri 'self'",
            ].join("; "),
          },
        ],
      },
    ];
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
