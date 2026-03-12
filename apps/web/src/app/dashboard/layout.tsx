import Link from "next/link";
import type { ReactNode } from "react";
import { siteConfig } from "@config/site";
import {
  LayoutDashboard,
  LineChart,
  CalendarDays,
  Bell,
  Settings,
  LogOut,
  CreditCard,
  Search,
  Menu
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Watchlist", href: "/dashboard/watchlist", icon: LineChart },
  { name: "Calendar", href: "/dashboard/calendar", icon: CalendarDays },
  { name: "Alerts", href: "/dashboard/alerts", icon: Bell },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b bg-card">
        <Link href="/" className="font-bold text-xl text-primary">
          {siteConfig.name}
        </Link>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-72 flex-col gap-6 border-r bg-card/50 px-6 py-8 backdrop-blur-xl">
          <div className="flex items-center gap-2 px-2">
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <div className="h-4 w-4 rounded-sm bg-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">{siteConfig.name}</span>
          </div>

          <div className="flex-1 space-y-1">
            <div className="text-xs font-semibold text-muted-foreground mb-4 px-2 uppercase tracking-wider">
              Menu
            </div>
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
              >
                <item.icon className="h-5 w-5 transition-colors group-hover:text-primary" />
                {item.name}
              </Link>
            ))}
          </div>

          <div className="mt-auto">
            <div className="mb-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5 border border-primary/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-full bg-primary/20 text-primary">
                  <CreditCard className="h-4 w-4" />
                </div>
                <h4 className="font-semibold text-sm">Pro Plan</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                Unlock Pulse AI predictions and unlimited backtesting data.
              </p>
              <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-xs font-medium h-8">
                Upgrade Now
              </Button>
            </div>

            <div className="flex items-center gap-3 px-2 py-3">
              <Avatar className="h-9 w-9 border border-border">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>TR</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">Trader One</p>
                <p className="truncate text-xs text-muted-foreground">Pro Account</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-background/50">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-8 backdrop-blur-md">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search markets, news, or symbols..."
                className="h-10 w-full rounded-full border border-border bg-card/50 pl-10 pr-4 text-sm focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                <div className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                System Online
              </div>
              <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
              </Button>
            </div>
          </header>

          <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}