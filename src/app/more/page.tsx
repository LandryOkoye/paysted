"use client";

import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import { HelpCircle, FileText, Share2, HeadphonesIcon, Gift, Settings, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MorePage() {
  const router = useRouter();
  
  const options = [
    { title: 'Refer a Friend', icon: Gift, color: 'text-purple-500', bg: 'bg-purple-50 border-purple-100', href: '#' },
    { title: 'Help & Support', icon: HeadphonesIcon, color: 'text-blue-500', bg: 'bg-blue-50 border-blue-100', href: '#' },
    { title: 'Tax Documents', icon: FileText, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-100', href: '#' },
    { title: 'API Documentation', icon: Share2, color: 'text-slate-600', bg: 'bg-slate-100 border-slate-200', href: '#' },
    { title: 'FAQ', icon: HelpCircle, color: 'text-teal-500', bg: 'bg-teal-50 border-teal-100', href: '#' },
    { title: 'Full Settings', icon: Settings, color: 'text-slate-500', bg: 'bg-slate-50 border-slate-200', href: '/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] pb-20 md:pb-0">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8 lg:p-12 relative w-full h-screen sm:h-auto overflow-y-auto aspect-auto flex justify-center py-6 sm:py-16">
        <div className="max-w-xl w-full mx-auto">
          <img src="/PayStepLogo-removebg.png" alt="PaySted Logo" className="h-7 w-auto md:hidden object-contain mb-6" />
          <header className="mb-8 flex items-center gap-4 hidden sm:flex">
            <button 
              onClick={() => router.back()} 
              className="p-2.5 text-slate-500 hover:text-slate-800 bg-white rounded-xl shadow-sm border border-slate-100 transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">More</h1>
          </header>

          <div className="card-3d bg-white rounded-3xl overflow-hidden border border-slate-100 w-full p-4 sm:p-6 shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              {options.map((opt) => {
                const Icon = opt.icon;
                return (
                  <Link key={opt.title} href={opt.href} className="flex flex-col items-center justify-center p-6 gap-4 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group border border-transparent hover:border-slate-100 outline-none active:scale-95">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center border transition-transform group-hover:scale-110 shadow-sm ${opt.bg}`}>
                      <Icon size={24} className={opt.color} />
                    </div>
                    <span className="text-sm font-bold text-slate-700 text-center">{opt.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
