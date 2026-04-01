"use client";

import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import { User, Bell, Shield, Key, CreditCard, LogOut, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCurrency } from '@/context/CurrencyContext';

export default function SettingsPage() {
  const router = useRouter();
  const { currency, setCurrency } = useCurrency();

  const sections = [
    { title: 'Personal Information', icon: User, desc: 'Update your photo and personal details.' },
    { title: 'Bank Accounts & Cards', icon: CreditCard, desc: 'Manage local NGN recipient bank accounts.' },
    { title: 'Security & 2FA', icon: Shield, desc: 'Secure your account with authenticator.' },
    { title: 'Notifications', icon: Bell, desc: 'Choose what we email you about.' },
    { title: 'API Keys', icon: Key, desc: 'Manage your automated Busha Commerce keys.' },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] pb-20 md:pb-0">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8 lg:p-12 relative w-full">
        <div className="max-w-3xl mx-auto pt-4 md:pt-6">
          <img src="/PayStepLogo-removebg.png" alt="PaySted Logo" className="h-7 w-auto md:hidden object-contain mb-6" />
          <header className="mb-8 flex items-center gap-4">
            <button 
              onClick={() => router.back()} 
              className="p-2.5 text-slate-500 hover:text-slate-800 bg-white rounded-xl shadow-sm border border-slate-100 transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
              <p className="text-slate-500 mt-1 text-sm hidden sm:block">Manage your account preferences and security.</p>
            </div>
          </header>

          <div className="mb-6 flex items-center gap-6 p-6 card-3d bg-white rounded-2xl border border-slate-100">
            <img src="https://i.pravatar.cc/150?img=68" alt="Tola Designer" className="w-20 h-20 rounded-full border-2 border-slate-100 shadow-sm object-cover" />
            <div>
              <h2 className="text-xl font-bold text-slate-900">Tola Designer</h2>
              <p className="text-sm text-slate-500 mb-3">tola.design@example.com</p>
              <button className="btn-3d text-sm font-semibold text-slate-700 bg-white border border-slate-200 px-4 py-1.5 rounded-lg hover:bg-slate-50 active:bg-slate-100 cursor-pointer shadow-sm">
                Change Photo
              </button>
            </div>
          </div>

          <div className="card-3d bg-white rounded-2xl overflow-hidden border border-slate-100 mb-8 p-5 sm:p-6">
            <h3 className="font-bold text-slate-800 text-sm mb-4">Default Stablecoin Preference</h3>
            <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-200">
              <button 
                onClick={() => setCurrency('USDC')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${currency === 'USDC' ? 'bg-white shadow-sm border border-slate-200 text-slate-800' : 'text-slate-500 hover:text-slate-700 cursor-pointer'}`}
              >
                USDC (Circle)
              </button>
              <button 
                onClick={() => setCurrency('USDT')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${currency === 'USDT' ? 'bg-white shadow-sm border border-slate-200 text-slate-800' : 'text-slate-500 hover:text-slate-700 cursor-pointer'}`}
              >
                USDT (Tether)
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-3 font-medium">All your vault balances and invoices will default to this currency.</p>
          </div>

          <div className="card-3d bg-white rounded-2xl overflow-hidden border border-slate-100 mb-8">
            <div className="divide-y divide-slate-100">
              {sections.map((sec) => {
                const Icon = sec.icon;
                return (
                  <div key={sec.title} className="p-5 flex items-start gap-4 hover:bg-slate-50/50 cursor-pointer transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:shadow-sm transition-all flex-shrink-0">
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 pt-0.5">
                      <h3 className="font-bold text-slate-800 text-sm">{sec.title}</h3>
                      <p className="text-sm text-slate-500 mt-0.5">{sec.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button className="flex items-center gap-2 text-rose-600 font-bold text-sm hover:bg-rose-50 active:bg-rose-100 px-4 py-3 rounded-xl transition-colors cursor-pointer w-full sm:w-auto justify-center">
            <LogOut size={18} />
            Sign Out Securely
          </button>
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
