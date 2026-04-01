"use client";

import { LayoutDashboard, Receipt, Wallet, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { name: 'Invoices', icon: Receipt, href: '/invoices' },
    { name: 'Vault', icon: Wallet, href: '/vault' },
    { name: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 pt-10 px-6 hidden md:flex flex-col border-r border-slate-100 bg-[#F8F9FA] z-50">
      <Link href="/" className="mb-10 px-4 flex items-center justify-start cursor-pointer hover:opacity-80 transition-opacity">
        <img src="/PayStepLogo-removebg.png" alt="PaySted Logo" className="h-8 w-auto object-contain" />
      </Link>

      <nav className="flex-1 space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (pathname !== '/' && item.href !== '/' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                active
                  ? 'bg-emerald-50/70 text-emerald-700 font-bold border border-emerald-100/50'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 font-medium border border-transparent'
              }`}
            >
              <div className={`transition-colors flex items-center justify-center ${active ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                 <Icon size={20} strokeWidth={active ? 2.5 : 2.2} />
              </div>
              <span className="tracking-wide text-[15px]">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="mb-8 px-4 flex items-center gap-3 bg-white p-3 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors">
        <div className="w-10 h-10 rounded-full bg-[#F8F9FA] shadow-inner flex items-center justify-center font-bold text-slate-800 border border-slate-200 overflow-hidden">
          <img src="https://i.pravatar.cc/150?img=68" alt="Profile" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-800 tracking-tight">Tola D.</span>
          <span className="text-xs text-slate-400 font-medium">Pro Plan</span>
        </div>
      </div>
    </aside>
  );
}
