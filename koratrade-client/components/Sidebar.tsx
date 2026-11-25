"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CandlestickChart,
  Wallet,
  Bot,
  Layers,
  Settings,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { Logo, cx } from "./ui";

const NAV = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Trade", path: "/trade", icon: CandlestickChart },
  { name: "Wallet", path: "/wallet", icon: Wallet },
  { name: "AI Trading Bot", path: "/bot", icon: Bot },
  { name: "DAO Launchpad", path: "/launchpad", icon: Layers },
  { name: "Settings", path: "/settings", icon: Settings },
];

function NavLink({ item, active, onNavigate }: { item: (typeof NAV)[number]; active: boolean; onNavigate?: () => void; }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.path}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cx(
        "relative flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm transition-colors",
        active ? "bg-raised text-ink" : "text-dim hover:bg-raised/60 hover:text-ink",
      )}
    >
      {active && <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-accent" aria-hidden="true" />}
      <Icon size={17} strokeWidth={1.75} className={active ? "text-accent" : undefined} />
      {item.name}
    </Link>
  );
}

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuth(); 

  return (
    <div className="flex h-full w-full flex-col border-line bg-vault p-4 md:w-60 md:border-r">
      <div className="mb-8 hidden px-2 pt-2 md:block">
        <Link href="/dashboard" aria-label="VaultX home">
          <Logo />
        </Link>
      </div>

      <nav aria-label="Main" className="space-y-1">
        {NAV.map((item) => (
          <NavLink key={item.path} item={item} active={pathname === item.path} onNavigate={onNavigate} />
        ))}
      </nav>

      {/* Only render this section if the user is a master admin */}
      {user?.isAdmin && (
        <>
          <p className="mb-2 mt-8 px-3 text-xs text-faint">Master Control</p>
          <nav aria-label="Admin">
            <NavLink
              item={{ name: "Admin Console", path: "/admin", icon: ShieldCheck }}
              active={pathname === "/admin"}
              onNavigate={onNavigate}
            />
          </nav>
        </>
      )}

      <div className="mt-auto space-y-3 pt-6">
        <div className="flex items-center gap-3 rounded-[12px] border border-line p-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-raised text-xs font-medium text-accent">
            {user?.email ? user.email.substring(0, 2).toUpperCase() : "VX"}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">Investor Account</p>
            <p className="truncate text-xs text-faint">{user?.email || "Not signed in"}</p>
          </div>
          <Link href="/auth" onClick={logout} aria-label="Sign out" className="rounded-md p-1.5 text-dim hover:bg-raised hover:text-ink">
            <LogOut size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}