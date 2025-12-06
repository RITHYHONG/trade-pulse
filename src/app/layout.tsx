import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { defaultMetadata } from "@config/seo";
import { siteConfig } from "@config/site";
import "./globals.css";
import "@/lib/firebase";
import { Toaster } from "@/components/ui/sonner";
import { ClientLayout } from "@/components/client-layout";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
        className={`${poppins.variable} ${poppins.variable} bg-slate-950 text-slate-100 antialiased`}
      >
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-cyan-500 text-white px-4 py-2 rounded-md z-50">Skip to main content</a>
        <ClientLayout>
          <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_55%)]">
            <header className="sr-only">
              <p>{siteConfig.description}</p>
            </header>
            {children}
          </div>
          <Toaster position="top-right" />
        </ClientLayout>
      </body>
    </html>
  );
}
