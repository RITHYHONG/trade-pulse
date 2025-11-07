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
