import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { defaultMetadata } from "@config/seo";
import { siteConfig } from "@config/site";
import "./globals.css";
import "@/lib/firebase";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-slate-950 text-slate-100 antialiased`}
      >
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_55%)]">
          <header className="sr-only">
            <p>{siteConfig.description}</p>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
