import Link from "next/link";
import type { ReactNode } from "react";
import { siteConfig } from "@config/site";

const navigation: Array<{ href: string; label: string }> = [
  { href: "/app", label: "Dashboard" },
  { href: "/app/watchlist", label: "Watchlist" },
  { href: "/app/alerts", label: "Alerts" },
  { href: "/app/settings", label: "Settings" },
];

interface AppLayoutProps {
  children: ReactNode;
  modal: ReactNode;
}

export default function AppLayout({ children, modal }: AppLayoutProps) {
  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-7xl gap-8 px-6 py-10 lg:px-10">
      <aside className="hidden w-64 shrink-0 flex-col justify-between rounded-3xl border border-slate-800/70 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/40 lg:flex">
        <div>
          <Link href="/app" className="text-lg font-semibold text-white">
            {siteConfig.name}
          </Link>
          <nav className="mt-8 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800/80 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="rounded-2xl border border-slate-800/70 bg-gradient-to-br from-sky-500/10 to-transparent p-4 text-xs text-slate-300">
          <p className="font-semibold text-white">Upgrade to Pulse Pro</p>
          <p className="mt-2 text-slate-300/80">
            Unlock AI trade ideas, priority alerts, and unlimited saved layouts.
          </p>
          <Link
            href="/app/upgrade"
            className="mt-4 inline-flex h-9 items-center justify-center rounded-full bg-sky-500 px-4 font-medium text-slate-950 transition hover:bg-sky-400"
          >
            View plans
          </Link>
        </div>
      </aside>

      <main className="flex-1">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Pulse Dashboard</h1>
            <p className="text-sm text-slate-300/80">
              Personalized insights, AI summaries, and actionable market data.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-800/70 bg-slate-900/70 px-4 py-2 text-xs text-slate-300">
            Session secured • Encrypted
          </div>
        </div>

        <section className="space-y-8">{children}</section>
      </main>

      {modal ?? null}
    </div>
  );
}