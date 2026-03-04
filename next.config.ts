import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  serverExternalPackages: ["@prisma/client"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      // News / financial media image CDNs
      {
        protocol: 'https',
        hostname: 'image.cnbcfm.com',
      },
      {
        protocol: 'https',
        hostname: 'images.wsj.net',
      },
      {
        protocol: 'https',
        hostname: 's.yimg.com',
      },
      {
        protocol: 'https',
        hostname: 'media.reuters.com',
      },
      {
        protocol: 'https',
        hostname: 'dims.apnews.com',
      },
      {
        protocol: 'https',
        hostname: '**.bloomberg.com',
      },
      {
        protocol: 'https',
        hostname: '**.marketwatch.com',
      },
      {
        protocol: 'https',
        hostname: '**.seekingalpha.com',
      },
      {
        protocol: 'https',
        hostname: '**.benzinga.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.financialmodelingprep.com',
      },
      // Allow any HTTPS image source (catch-all for dynamic news feeds)
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    // Only apply CSP in production, allow everything in development for Google Auth
    if (process.env.NODE_ENV === 'development') {
      return [];
    }
    
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
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
            ].join('; '),
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
