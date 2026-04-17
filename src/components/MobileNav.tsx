"use client";

import { Home, Wallet, Zap, Receipt, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { name: "Home",     icon: Home,     href: "/" },
  { name: "Vault",    icon: Wallet,   href: "/vault" },
  { name: "Rules",    icon: Zap,      href: "/rules" },
  { name: "Invoices", icon: Receipt,  href: "/invoices" },
  { name: "Settings", icon: Settings, href: "/settings" },
];

export default function MobileNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#111827] border-t border-white/[0.06] z-50 px-2 pt-2 pb-6">
      <div className="flex justify-around items-center max-w-sm mx-auto">

        {NAV_ITEMS.map(({ name, icon: Icon, href }) => {
          const active = isActive(href);
          return (
            <Link
              key={name}
              href={href}
              className={`
                flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors
                ${active ? "text-emerald-400" : "text-slate-500"}
              `}
            >
              <div className={`p-1.5 rounded-xl transition-colors ${active ? "bg-emerald-500/10" : ""}`}>
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] tracking-wide ${active ? "font-bold" : "font-medium"}`}>
                {name}
              </span>
            </Link>
          );
        })}

      </div>
    </div>
  );
}
