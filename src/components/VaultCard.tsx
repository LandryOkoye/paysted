"use client";

import { Eye, EyeOff, TrendingUp, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import type { BushaBalance } from "@/lib/busha.types";

// Static sparkline points for the mini chart (visual only — not real data)
const SPARKLINE_POINTS = "0,42 20,36 40,39 60,24 80,28 100,16 120,20 140,8 160,13";

export default function VaultCard() {
  const { currency } = useCurrency();
  const [isHidden, setIsHidden] = useState(false);

  // Live balance data fetched from /api/balances → Busha GET /v1/balances
  const [vault,    setVault]    = useState<BushaBalance | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [fetchErr, setFetchErr] = useState(false);

  // Fetch the USDC vault balance on mount
  useEffect(() => {
    fetch("/api/balances")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.vault) {
          // Busha returns balance in vault.available.amount (not vault.amount)
          setVault(data.vault as BushaBalance);
        }
      })
      .catch(() => setFetchErr(true))
      .finally(() => setLoading(false));
  }, []);

  // Spendable USDC amount (e.g. "1250.00")
  const usdcAmount = vault?.available?.amount ?? "0.00";
  // Fiat equivalent in NGN (e.g. "1875000.00")
  const ngnAmount  = vault?.available?.fiat?.amount ?? "0.00";

  // Format numbers for display
  const displayUsdc = parseFloat(usdcAmount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const displayNgn = parseFloat(ngnAmount).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="relative w-full mb-4 p-6 md:p-7 rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a2235] to-[#111827] border border-white/[0.06]">

      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-56 h-56 bg-emerald-500/[0.06] rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />

      {/* ── Top Row: Label + Badge ──────────────── */}
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
          <span className="text-[11px] font-bold text-emerald-400">Live balance</span>
        </div>
      </div>

      {/* ── Balance Amount ─────────────────────── */}
      <div className="mb-1 min-h-[52px] flex items-center">
        {loading ? (
          // Show spinner while fetching from Busha
          <Loader2 size={28} className="text-slate-600 animate-spin" />
        ) : fetchErr ? (
          <span className="text-slate-500 text-sm">Could not load balance</span>
        ) : (
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-none">
            {isHidden ? "••••••" : `$${displayUsdc}`}
            <span className="text-xl md:text-2xl ml-2 text-slate-400 font-bold">{currency}</span>
          </h1>
        )}
      </div>

      {/* Fiat equivalent */}
      <p className="text-sm text-slate-400 font-medium mb-6">
        {loading
          ? ""
          : isHidden
            ? "•••••••••"
            : `≈ ₦${displayNgn} NGN`}
      </p>

      {/* ── Mini Sparkline Chart ──────────────── */}
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
        <polygon
          points={`0,50 ${SPARKLINE_POINTS} 160,50`}
          fill="url(#sparkGradient)"
        />
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
