"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/components/ui";
import { WalletProvider } from "@/lib/WalletContext";
import { LiveSupport } from "@/components/LiveSupport";
import { 
  PieChart, Wallet, Send, User, TrendingUp, 
  LayoutDashboard, Users, ArrowDownRight, ShieldCheck, 
  LogOut, ShieldAlert, ChevronRight, Zap,
  Activity, Cpu, Rocket, Menu, X
} from "lucide-react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsAdminMode(isAdminRoute);
    setIsMobileMenuOpen(false); // Close mobile menu on route change
  }, [pathname, isAdminRoute]);

  const userLinks = [
    { name: "Overview", href: "/dashboard", icon: PieChart },
    { name: "Trade", href: "/trade", icon: Activity },
    { name: "Invest", href: "/invest", icon: TrendingUp },
    { name: "Strategy Bot", href: "/bot", icon: Cpu },
    { name: "Staking / DAO", href: "/launchpad", icon: Rocket },
    { name: "Wallet", href: "/wallet", icon: Wallet },
    { name: "Send money", href: "/send", icon: Send },
    { name: "Profile & Settings", href: "/profile", icon: User },
  ];

  const adminLinks = [
    { name: "Admin Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Manage Users", href: "/admin/manage", icon: Users },
    { name: "Deposits Queue", href: "/admin/deposits", icon: ArrowDownRight },
    { name: "KYC Reviews", href: "/admin/kyc", icon: ShieldCheck },
    { name: "Platform Settings", href: "/admin/settings", icon: Activity },
  ];

  const activeLinks = isAdminMode ? adminLinks : userLinks;

  return (
    <WalletProvider>
      <div className="min-h-screen bg-[#0f0c1a] flex flex-col md:flex-row relative">
        
        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-line bg-void sticky top-0 z-40">
          <div className="flex items-center gap-2 text-ink font-serif text-lg tracking-wide font-bold">
            <div className="w-7 h-7 rounded bg-accent flex items-center justify-center text-white"><Zap className="w-4 h-4 fill-current" /></div>
            VaultX
            {isAdminMode && <span className="text-[9px] uppercase tracking-wider text-accent ml-2 bg-accent/10 px-2 py-0.5 rounded">Admin</span>}
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-ink p-1"><Menu className="w-6 h-6" /></button>
        </div>

        {/* Mobile Backdrop Overlay */}
        {isMobileMenuOpen && (
          <div onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm" />
        )}

        {/* Sidebar Navigation */}
        <aside className={cx(
          "w-64 bg-void border-r border-line flex flex-col fixed md:sticky top-0 h-screen overflow-y-auto z-50 transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}>
          <div className="h-20 flex items-center justify-between px-6 border-b border-line shrink-0">
            <div className="flex items-center gap-2 text-ink font-serif text-xl tracking-wide font-bold">
              <div className="w-8 h-8 rounded bg-accent flex items-center justify-center text-white"><Zap className="w-5 h-5 fill-current" /></div>
              VaultX
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-dim hover:text-ink"><X className="w-6 h-6" /></button>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            {activeLinks.map((link) => {
              const isActive = pathname?.startsWith(link.href);
              return (
                <Link 
                  key={link.name} href={link.href} 
                  className={cx("flex items-center gap-3 px-4 py-3 rounded-[12px] text-sm font-medium transition-all duration-200", isActive ? "bg-accent/10 text-accent" : "text-dim hover:text-ink hover:bg-panel")}
                >
                  <link.icon className={cx("w-5 h-5", isActive ? "text-accent" : "text-dim")} />
                  {link.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="p-4 border-t border-line shrink-0 space-y-4">
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-full bg-[#1a2b4c] text-white flex items-center justify-center font-bold shrink-0">B</div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-ink truncate">Ben Carson</p>
                <p className="text-xs text-dim truncate">FV-9988-7766</p>
              </div>
              <button className="text-dim hover:text-ink shrink-0"><LogOut className="w-4 h-4" /></button>
            </div>
            <Link href={isAdminMode ? "/dashboard" : "/admin/dashboard"} className="flex items-center justify-between w-full p-3 rounded-[10px] bg-panel border border-line text-xs font-medium text-ink hover:border-accent transition-colors">
              <span className="flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-accent" /> Switch to {isAdminMode ? "User" : "Admin"}</span>
              <ChevronRight className="w-4 h-4 text-dim" />
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto w-full">
          <div className="p-4 md:p-8 lg:p-12 pb-24 md:pb-12">
            {children}
          </div>
        </main>

        <LiveSupport />
      </div>
    </WalletProvider>
  );
}