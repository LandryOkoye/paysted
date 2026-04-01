"use client";

import { Eye, TrendingUp, Wallet } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';

export default function VaultCard() {
  const { currency } = useCurrency();
  const isUSDC = currency === 'USDC';
  const logoUrl = isUSDC
    ? 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdc.png'
    : 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdt.png';

  return (
    <div className="card-3d p-6 md:p-8 w-full mb-6 bg-white relative">

      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner">
            <Wallet size={18} className="text-slate-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              {currency} Vault
              <Eye size={14} className="text-slate-300 cursor-pointer hover:text-slate-500 transition-colors" />
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 border border-slate-100 bg-slate-50 px-2.5 py-1 rounded-full shadow-sm">
          <img src={logoUrl} alt={`${currency} Logo`} className="w-4 h-4 object-contain drop-shadow-sm" />
          <span className="text-xs font-bold text-slate-600 tracking-wide">{currency}</span>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-[2.75rem] md:text-6xl font-extrabold text-slate-900 tracking-tight leading-none">
          $250.00
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 border-t border-slate-100">
        <span className="text-sm text-slate-500 font-semibold tracking-wide flex items-center gap-2">
          ≈ ₦337,500.00 NGN
        </span>

        <span className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 shadow-sm w-max">
          <TrendingUp size={14} strokeWidth={2.5} className="text-emerald-600" />
          +$120.50 past week
        </span>
      </div>

    </div>
  );
}
