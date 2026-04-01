"use client";

import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import VaultCard from '@/components/VaultCard';
import { ArrowDownToLine, Send, History, ArrowRightLeft, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VaultPage() {
  const router = useRouter();

  const vaultTransactions = [
    { id: 1, type: 'Receive', asset: 'USDC', amount: '+$1,250.00', status: 'Completed', date: 'Oct 24, 2:30 PM', via: 'Busha Commerce' },
    { id: 2, type: 'Withdraw', asset: 'USDC -> NGN', amount: '-$500.00', status: 'Completed', date: 'Oct 12, 11:15 AM', via: 'GTBank' },
    { id: 3, type: 'Receive', asset: 'USDC', amount: '+$3,400.00', status: 'Completed', date: 'Oct 05, 9:00 AM', via: 'Busha Commerce' },
    { id: 4, type: 'Exchange', asset: 'USDT -> USDC', amount: '+$850.00', status: 'Completed', date: 'Sep 28, 4:20 PM', via: 'Internal' },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] pb-20 md:pb-0">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8 lg:p-12 relative w-full">
        <div className="max-w-4xl mx-auto pt-4 md:pt-6">
          <img src="/PayStepLogo-removebg.png" alt="PaySted Logo" className="h-7 w-auto md:hidden object-contain mb-6" />
          <header className="mb-8 flex items-center gap-4">
            <button 
              onClick={() => router.back()} 
              className="p-2.5 text-slate-500 hover:text-slate-800 bg-white rounded-xl shadow-sm border border-slate-100 transition-all active:scale-95 cursor-pointer md:hidden"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Safe Vault</h1>
              <p className="text-slate-500 mt-1 text-sm hidden sm:block">Your anti-inflation stablecoin reserves.</p>
            </div>
          </header>

          <VaultCard />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 w-full">
             <button className="btn-3d bg-white hover:bg-slate-50 active:bg-slate-100 active:shadow-inner flex flex-col items-center justify-center p-4 gap-3 rounded-2xl border border-slate-100 transition-all group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform shadow-inner"><ArrowDownToLine size={20} /></div>
                <span className="text-sm font-bold text-slate-700">Deposit</span>
             </button>
             <button className="btn-3d bg-white hover:bg-slate-50 active:bg-slate-100 active:shadow-inner flex flex-col items-center justify-center p-4 gap-3 rounded-2xl border border-slate-100 transition-all group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform shadow-inner"><Send size={20} /></div>
                <span className="text-sm font-bold text-slate-700">Send</span>
             </button>
             <button className="btn-3d bg-white hover:bg-slate-50 active:bg-slate-100 active:shadow-inner flex flex-col items-center justify-center p-4 gap-3 rounded-2xl border border-slate-100 transition-all group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-105 transition-transform shadow-inner"><ArrowRightLeft size={20} /></div>
                <span className="text-sm font-bold text-slate-700">Swap</span>
             </button>
             <button className="btn-3d bg-white hover:bg-slate-50 active:bg-slate-100 active:shadow-inner flex flex-col items-center justify-center p-4 gap-3 rounded-2xl border border-slate-100 transition-all group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:scale-105 transition-transform shadow-inner"><History size={20} /></div>
                <span className="text-sm font-bold text-slate-700">Statements</span>
             </button>
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-4 px-1">Vault Ledger</h3>
          
          <div className="card-3d bg-white rounded-2xl overflow-hidden border border-slate-100 w-full mb-8">
            <div className="divide-y divide-slate-100">
              {vaultTransactions.map((trx) => (
                <div key={trx.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors cursor-pointer active:bg-slate-100">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border shadow-sm ${trx.type === 'Receive' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : trx.type === 'Withdraw' ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-purple-50 border-purple-100 text-purple-600'}`}>
                      {trx.type === 'Receive' ? <ArrowDownToLine size={20} /> : trx.type === 'Withdraw' ? <Send size={20} /> : <ArrowRightLeft size={20} />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{trx.type} {trx.asset}</p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{trx.via} • {trx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-sm ${trx.amount.startsWith('+') ? 'text-emerald-600' : 'text-slate-800'}`}>{trx.amount}</p>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">{trx.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
