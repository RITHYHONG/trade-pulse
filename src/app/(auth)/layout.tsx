import Link from "next/link";
import type { ReactNode } from "react";
import Image from "next/image";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <aside className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-slate-950/90 p-12 text-slate-100 lg:flex">
        <Image
          src="/images/dashboard-preview.png"
          alt="Trade Pulse dashboard preview"
          width={1400}
          height={900}
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="relative z-10 max-w-md space-y-4">
          <h2 className="text-3xl font-semibold">Accelerate your trading workflow</h2>
          <p className="text-sm text-slate-200/80">
            Trade Pulse keeps your team aligned with live market intelligence, actionable AI insights, and programmable alerts.
          </p>
        </div>
      </aside>

      <main className="flex w-full flex-1 items-center justify-center bg-slate-950 px-6 py-16">
        <div className="w-full max-w-md space-y-10">
          <Link href="/" className="text-lg font-semibold text-slate-200 hover:text-white">
            ← Back to home
          </Link>
          {children}
        </div>
      </main>
    </div>
  );
}
