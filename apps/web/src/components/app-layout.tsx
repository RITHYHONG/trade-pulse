"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { HeaderMain } from "@/components/HeaderMain";
import { Footer } from "../app/(marketing)/components/Footer";

const SessionSync = dynamic(() => import("./session-sync").then((mod) => mod.SessionSync), { ssr: false });

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();

  // Don't show header/footer on auth pages
  const isAuthPage = pathname?.startsWith('/login') ||
    pathname?.startsWith('/signup') ||
    pathname?.startsWith('/forgot-password') ||
    pathname?.startsWith('/reset-password') ||
    pathname?.startsWith('/admin');

  const isProtectedRoute = pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/app') ||
    pathname?.startsWith('/settings') ||
    pathname?.startsWith('/create-post');

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