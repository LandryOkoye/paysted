"use client";

import { Eye, EyeOff, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useCurrency } from "@/context/CurrencyContext";

// Static sparkline points for the mini chart (demo data)
const SPARKLINE_POINTS = "0,42 20,36 40,39 60,24 80,28 100,16 120,20 140,8 160,13";

export default function VaultCard() {
  const { currency } = useCurrency();
  const [isHidden, setIsHidden] = useState(false);

  return (
    <div className="relative w-full mb-4 p-6 md:p-7 rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a2235] to-[#111827] border border-white/[0.06]">

      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-56 h-56 bg-emerald-500/[0.06] rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />

      {/* ── Top Row: Label + Weekly Badge ──────────────── */}
      <div className="flex items-center justify-between mb-5">
        <p className="flex items-center gap-2 text-sm font-medium text-slate-400">
          Vault Balance
          <button
            onClick={() => setIsHidden(!isHidden)}
            aria-label="Toggle balance visibility"
            className="text-slate-600 hover:text-slate-300 transition-colors"
          >
            {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </p>

        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
          <TrendingUp size={11} className="text-emerald-400" />
          <span className="text-[11px] font-bold text-emerald-400">+$120.50 past week</span>
        </div>
      </div>

      {/* ── Balance Amount ─────────────────────────────── */}
      <div className="mb-1">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-none">
          {isHidden ? "••••••" : "$250.00"}
          <span className="text-xl md:text-2xl ml-2 text-slate-400 font-bold">{currency}</span>
        </h1>
      </div>

      {/* Fiat equivalent */}
      <p className="text-sm text-slate-400 font-medium mb-6">
        {isHidden ? "•••••••••" : "≈ ₦337,500.00 NGN"}
      </p>

      {/* ── Mini Sparkline Chart ──────────────────────── */}
      <svg
        viewBox="0 0 160 50"
        className="w-full h-10"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0"   />
          </linearGradient>
        </defs>
        {/* Fill area under the line */}
        <polygon
          points={`0,50 ${SPARKLINE_POINTS} 160,50`}
          fill="url(#sparkGradient)"
        />
        {/* The line itself */}
        <polyline
          points={SPARKLINE_POINTS}
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

    </div>
  );
}
