"use client";

import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import LastRecipients from '@/components/LastRecipients';
import { ArrowDownToLine, Landmark, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrency } from '@/context/CurrencyContext';

export default function PayoutsPage() {
  const [amount, setAmount] = useState('');
  const router = useRouter();
  const { currency } = useCurrency();

  const exchangeRate = 1380;
  const numAmount = parseFloat(amount) || 0;
  const fiatEquivalent = (numAmount * exchangeRate).toLocaleString();

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] pb-20 md:pb-0">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8 lg:p-12 relative w-full flex flex-col items-center">
        <div className="max-w-2xl w-full mx-auto pt-4 md:pt-6">
          <img src="/PayStepLogo-removebg.png" alt="PaySted Logo" className="h-7 w-auto md:hidden object-contain mb-6" />
          <header className="mb-10 flex flex-col items-center text-center relative">
            <button
              onClick={() => router.back()}
              className="absolute left-0 top-1 p-2.5 text-slate-500 hover:text-slate-800 bg-white rounded-xl shadow-sm border border-slate-100 transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-2 sm:mt-0">Instant Payout</h1>
            <p className="text-slate-500 mt-2 text-sm">Withdraw from your {currency} vault to local bank accounts.</p>
          </header>

          <div className="card-3d bg-white p-6 sm:p-10 rounded-3xl w-full mb-8">
            <h3 className="font-bold text-slate-800 mb-6">Select Recipient</h3>
            <LastRecipients />

            <div className="mt-8 border-t border-slate-100 pt-8">
              <h3 className="font-bold text-slate-800 mb-6">Withdrawal Details</h3>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center justify-between mb-8 cursor-pointer hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center">
                    <Landmark size={20} className="text-slate-500" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">GTBank Savings</p>
                    <p className="text-xs text-slate-500 mt-0.5">**** 1234 • Tola Designer</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer">Change</button>
              </div>

              <div className="text-center mb-8 relative">
                <p className="text-sm font-bold text-slate-500 mb-4 px-4 bg-white inline-block">Amount ({currency})</p>
                <div className="flex items-center justify-center w-full">
                  <span className="text-4xl sm:text-6xl font-extrabold text-slate-300 mr-2 sm:mr-4">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="w-32 sm:w-48 text-5xl sm:text-7xl font-extrabold text-slate-900 bg-transparent border-none focus:outline-none text-center"
                  />
                </div>

                {/* Fiat Equivalent Dynamic Display */}
                <div className="mt-4 flex flex-col items-center justify-center animate-in fade-in duration-300">
                  <div className="bg-slate-50 border border-slate-100 rounded-full px-4 py-1.5 shadow-inner inline-flex items-center justify-center">
                    <span className="text-sm font-bold tracking-wide text-slate-600">≈ ₦{fiatEquivalent} NGN</span>
                  </div>
                </div>

                <p className="text-xs font-medium text-slate-400 mt-6 tracking-wide uppercase">
                  Available Balance: <span className="font-bold text-slate-600">$250.00</span>
                </p>
              </div>

              <button className="w-full btn-3d-accent bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 active:shadow-inner text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all text-base shadow-sm cursor-pointer">
                <ArrowDownToLine size={20} /> Withdraw {amount ? `$${amount}` : ''}
              </button>
            </div>
          </div>
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
