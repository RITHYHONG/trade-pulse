import type { ReactNode } from "react";
import { HeaderMain } from "@/components/HeaderMain";
import { Footer } from "./components/Footer";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <HeaderMain />
        <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}