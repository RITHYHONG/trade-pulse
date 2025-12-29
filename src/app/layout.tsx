import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { defaultMetadata } from "@config/seo";
import "./globals.css";
import "@/lib/firebase";
import { Toaster } from "@/components/ui/sonner";
import { ClientLayout } from "@/components/client-layout";
import { AppLayout } from "@/components/app-layout";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
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
        className={`${poppins.variable} font-sans antialiased bg-background text-foreground`}
      >

        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded-lg z-50">Skip to main content</a>
        <ClientLayout>
          <AppLayout>
            {children}
          </AppLayout>
          <Toaster position="top-right" richColors />
        </ClientLayout>

      </body>
    </html>
  );
}