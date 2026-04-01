"use client";

import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import { Link2, Copy, Send, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GenerateLinkPage() {
  const [copied, setCopied] = useState(false);
  const [generated, setGenerated] = useState(false);
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] pb-20 md:pb-0">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8 lg:p-12 relative w-full flex items-center justify-center">
        <div className="max-w-xl w-full mx-auto">

          <header className="mb-8 w-full flex justify-between items-center">
            <button
              onClick={() => router.back()}
              className="p-2.5 text-slate-500 hover:text-slate-800 bg-white rounded-xl shadow-sm border border-slate-100 transition-all active:scale-95 cursor-pointer mb-4"
            >
              <ArrowLeft size={20} />
            </button>
            <img src="/PayStepLogo-removebg.png" alt="PaySted Logo" className="h-7 w-auto md:hidden object-contain mb-4" />
          </header>

          <div className="card-3d bg-white p-6 sm:p-10 rounded-3xl w-full">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-6 shadow-inner mx-auto">
              <Link2 size={28} className="text-emerald-600" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 text-center mb-2">Create Payment Link</h1>
            <p className="text-slate-500 text-sm text-center mb-8">Generate a borderless invoice link to send to your global client.</p>

            {!generated ? (
              <form onSubmit={(e) => { e.preventDefault(); setGenerated(true); }} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Client Name / Company</label>
                  <input required autoFocus type="text" placeholder="e.g. Acme Corp" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-800" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Amount (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                    <input required type="number" min="1" placeholder="0.00" className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold text-slate-800" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Description <span className="text-slate-400 font-normal">(Optional)</span></label>
                  <input type="text" placeholder="e.g. UI/UX Design for Website" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-800" />
                </div>

                <button type="submit" className="w-full btn-3d-accent bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 active:shadow-inner text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all mt-4 text-base cursor-pointer">
                  Generate Secure Link
                </button>
              </form>
            ) : (
              <div className="animate-in fade-in zoom-in duration-300">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-6">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Your Link</p>
                  <div className="flex items-center gap-3">
                    <input readOnly value="https://pay.busha.io/charges/77255764" className="flex-1 bg-transparent border-none text-slate-800 font-medium text-sm focus:outline-none px-1" />
                    <button onClick={() => setCopied(true)} className={`p-2.5 rounded-xl transition-all cursor-pointer ${copied ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'} shadow-sm`}>
                      <Copy size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setGenerated(false)} className="flex-1 btn-3d bg-white font-bold text-slate-600 py-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 active:bg-slate-100 transition-all text-sm cursor-pointer shadow-sm">Create Another</button>
                  <button className="flex-1 btn-3d-accent bg-emerald-600 font-bold text-white py-3.5 rounded-xl border border-transparent shadow-sm hover:bg-emerald-500 active:bg-emerald-700 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"><Send size={16} /> Send via Email</button>
                </div>
              </div>
            )}

          </div>

        </div>
      </main>
      <MobileNav />
    </div>
  );
}
