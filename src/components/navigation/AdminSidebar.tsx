"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { 
  Users, 
  FileText, 
  Activity, 
  Settings, 
  Shield, 
  Zap, 
  LayoutDashboard,
  LogOut,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, Suspense } from "react";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    description: "Overview & KPI"
  },
  {
    title: "Blog Analysis",
    href: "/admin?tab=blog",
    icon: FileText,
    description: "Manage Articles"
  },
  {
    title: "System Automations",
    href: "/admin?tab=automation",
    icon: Zap,
    description: "AI & Cron Jobs"
  },
  {
    title: "User Management",
    href: "/admin?tab=users",
    icon: Users,
    description: "Global Directory"
  },
  {
    title: "Infrastructure",
    href: "/admin/infrastructure",
    icon: Shield,
    description: "System Health"
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
    description: "App Config"
  }
];

function AdminSidebarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <Button 
        variant="ghost" 
        className="lg:hidden fixed top-4 left-4 z-50 bg-slate-900 border border-slate-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar Container */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 bg-slate-950 border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo / Brand */}
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white uppercase tracking-tighter">Trade Pulse</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Admin Portal</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            {sidebarItems.map((item) => {
              const currentTab = searchParams.get("tab") || "overview";
              const itemIsDashboard = item.href === "/admin";
              
              let isActive = false;
              if (itemIsDashboard) {
                // If the link is exactly "/admin", it's active if pathname is "/admin" AND (no tab or tab=overview)
                isActive = pathname === "/admin" && currentTab === "overview";
              } else if (item.href.includes("?tab=")) {
                const itemTab = item.href.split("tab=")[1];
                isActive = pathname === "/admin" && currentTab === itemTab;
              } else {
                isActive = pathname.startsWith(item.href);
              }
              
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                    isActive 
                      ? "bg-primary/10 text-primary border border-primary/20" 
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-100 border border-transparent"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5",
                    isActive ? "text-primary" : "text-slate-500 group-hover:text-slate-300"
                  )} />
                  <div className="flex-1">
                    <p className="text-sm font-bold">{item.title}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{item.description}</p>
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4" />}
                </Link>
              );
            })}
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-800 space-y-2">
            <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-400/10 gap-3 px-4 py-3 h-auto rounded-xl">
              <LogOut className="h-5 w-5" />
              <div className="text-left">
                <p className="text-sm font-bold">Sign Out</p>
                <p className="text-[10px] opacity-50">End Session</p>
              </div>
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export function AdminSidebar() {
  return (
    <Suspense fallback={<div className="w-72 bg-slate-950 border-r border-slate-800 h-screen" />}>
      <AdminSidebarContent />
    </Suspense>
  );
}
