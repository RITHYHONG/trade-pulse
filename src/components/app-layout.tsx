"use client";

import { usePathname } from "next/navigation";
import { HeaderMain } from "@/components/HeaderMain";
import { Footer } from "../app/(marketing)/components/Footer";
import { SessionSync } from "./session-sync";
import { Suspense } from "react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();

  // Don't show header/footer on auth pages
  const isAuthPage = pathname?.startsWith('/login') ||
    pathname?.startsWith('/signup') ||
    pathname?.startsWith('/forgot-password') ||
    pathname?.startsWith('/reset-password');

  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={null}>
        <SessionSync />
      </Suspense>
      {!isAuthPage && <HeaderMain />}
      <main className="flex-1" id="main-content">
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}