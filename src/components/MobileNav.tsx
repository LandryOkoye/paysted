"use client";

import { Home, Receipt, Wallet, User, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', icon: Home, href: '/' },
    { name: 'Invoices', icon: Receipt, href: '/invoices' },
    { name: 'Vault', icon: Wallet, href: '/vault' },
    { name: 'More', icon: MoreHorizontal, href: '/more' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] z-50 px-6 py-2 pb-6">
      <div className="flex justify-between items-center max-w-sm mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (pathname !== '/' && item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              href={item.href}
              key={item.name}
              className={`flex flex-col items-center gap-1.5 p-2 transition-colors group relative ${
                active ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${active ? 'bg-emerald-50 text-emerald-600 shadow-inner' : 'group-hover:bg-slate-50 text-slate-400 group-hover:text-slate-600'}`}>
                 <Icon size={22} className={active ? 'fill-emerald-50' : ''} />
              </div>
              <span className={`text-[10px] tracking-wide ${active ? 'font-bold' : 'font-medium'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
      {/* iOS indicator bar spacing */}
      <div className="w-1/3 h-1 bg-slate-200 rounded-full mx-auto mt-2"></div>
    </div>
  );
}
