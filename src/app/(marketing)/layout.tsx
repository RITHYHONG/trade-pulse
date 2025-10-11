import type { ReactNode } from "react";
import { Header } from "./components/Header";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-slate-950 text-slate-100">{children}</main>
    </div>
  );
}