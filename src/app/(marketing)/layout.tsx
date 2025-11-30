import type { ReactNode } from "react";
import { HeaderMain } from "@/components/HeaderMain";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <HeaderMain />
      <main className="flex-1 bg-slate-950 text-slate-100">{children}</main>
    </div>
  );
}