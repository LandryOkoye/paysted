"use client";

import { LayoutDashboard, Receipt, Wallet, Settings, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/" },
  { name: "Vault",     icon: Wallet,          href: "/vault" },
  { name: "Rules",     icon: Zap,             href: "/rules" },
  { name: "Invoices",  icon: Receipt,         href: "/invoices" },
  { name: "Settings",  icon: Settings,        href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 hidden md:flex flex-col bg-[#111827] border-r border-white/[0.06] z-50 px-5 pt-8">

      {/* ── Brand / Logo ─────────────────────────────── */}
      <Link href="/" className="flex items-center gap-3 px-3 mb-10 group">
        <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:bg-emerald-400 transition-colors">
          <img
            src="/PayStepLogo-removebg.png"
            alt="Paysted"
            className="h-5 w-5 object-contain brightness-0 invert"
          />
        </div>
        <div>
          <p className="text-[10px] text-slate-500 font-semibold tracking-widest uppercase">Borderless</p>
          <p className="text-sm font-bold text-white leading-tight">Vault</p>
        </div>
      </Link>

      {/* ── Navigation ───────────────────────────────── */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map(({ name, icon: Icon, href }) => {
          const active = isActive(href);
          return (
            <Link
              key={name}
              href={href}
              className={`
                flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium
                transition-all duration-150 group
                ${active
                  ? "bg-emerald-500/10 text-emerald-400 font-semibold"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
                }
              `}
            >
              <Icon
                size={18}
                strokeWidth={active ? 2.5 : 2}
                className={active ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300"}
              />
              <span className="tracking-wide">{name}</span>
            </Link>
          );
        })}
      </nav>

      {/* ── User Profile Card ─────────────────────────── */}
      <div className="mb-6 flex items-center gap-3 px-3 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.05] cursor-pointer hover:bg-white/[0.07] transition-colors">
        <img
          src="https://i.pravatar.cc/150?img=68"
          alt="Tola Designer"
          className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/25"
        />
        <div>
          <p className="text-sm font-bold text-white">Tola D.</p>
          <p className="text-xs font-semibold text-emerald-400">Pro Plan</p>
        </div>
      </div>

    </aside>
  );
}
