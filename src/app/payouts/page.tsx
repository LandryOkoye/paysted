"use client";

import { useState, useEffect } from "react";
import Sidebar      from "@/components/Sidebar";
import MobileNav    from "@/components/MobileNav";
import { ArrowDownToLine, ArrowLeft, Plus, Landmark, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCurrency } from "@/context/CurrencyContext";

// ─── Constants ──────────────────────────────────────────────────────

const RATE_PER_USD    = 1580;       // NGN per $1
const RATE_LOCK_SECS  = 240;        // 4 minutes lock window (seconds)
const AVAILABLE_USDC  = 250;        // Mock vault balance

// ─── Recent Recipients (Mock) ────────────────────────────────────────

interface Recipient {
  id: number;
  name: string;
  avatar: string;
}

const RECIPIENTS: Recipient[] = [
  { id: 1, name: "Edward",  avatar: "https://i.pravatar.cc/150?img=3"  },
  { id: 2, name: "Murphy",  avatar: "https://i.pravatar.cc/150?img=4"  },
  { id: 3, name: "Darwinz", avatar: "https://i.pravatar.cc/150?img=6"  },
  { id: 4, name: "Kathryn", avatar: "https://i.pravatar.cc/150?img=47" },
  { id: 5, name: "Anne",    avatar: "https://i.pravatar.cc/150?img=45" },
];

// ─── Helper: format MM:SS ────────────────────────────────────────────

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// ─── Component ──────────────────────────────────────────────────────

export default function PayoutsPage() {
  const router = useRouter();
  const { currency } = useCurrency();

  const [amount, setAmount]             = useState("");
  const [selectedRecipient, setRecipient] = useState<number | null>(null);
  const [timeLeft, setTimeLeft]         = useState(RATE_LOCK_SECS);

  // Count down the rate-lock timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : RATE_LOCK_SECS));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const numAmount   = parseFloat(amount) || 0;
  const ngnEquiv    = (numAmount * RATE_PER_USD).toLocaleString();
  const lockPercent = (timeLeft / RATE_LOCK_SECS) * 100;

  return (
    <div className="flex min-h-screen bg-[#0D1117] pb-20 md:pb-0">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-4 md:p-6 lg:p-8 flex flex-col items-center">
        <div className="max-w-md w-full mx-auto pt-2 md:pt-4">

          {/* Mobile logo */}
          <img
            src="/PayStepLogo-removebg.png"
            alt="Paysted"
            className="h-7 w-auto md:hidden object-contain mb-5 brightness-0 invert"
          />

          {/* ── Page Header ─────────────────────────────── */}
          <header className="flex items-center gap-3 mb-8 relative">
            <button
              onClick={() => router.back()}
              className="p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-400 hover:text-white transition-all"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">Instant Stablecoin Payout</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Withdraw from your {currency} vault to local bank accounts.
              </p>
            </div>
          </header>

          {/* ── Main Card ───────────────────────────────── */}
          <div className="rounded-2xl bg-[#1a2235] border border-white/[0.06] p-5 w-full">

            {/* Amount Input */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest block mb-3">
                Amount ({currency})
              </label>
              <div className="flex items-center bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-4 focus-within:border-emerald-500/50 transition-all">
                <span className="text-4xl font-extrabold text-slate-600 mr-2">$</span>
                <input
                  id="payout-amount-input"
                  type="number"
                  min="0"
                  max={AVAILABLE_USDC}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="flex-1 bg-transparent border-none text-4xl font-extrabold text-white placeholder-slate-700 focus:outline-none"
                />
              </div>
            </div>

            {/* Live Rate + Rate Lock Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-white">
                  ≈ <span className="text-emerald-400">₦{RATE_PER_USD.toLocaleString()}</span> per $1
                </p>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  Rate locked for{" "}
                  <span className="font-bold text-white">{formatTime(timeLeft)}</span>
                  <Info size={12} className="text-slate-600 cursor-help" />
                </div>
              </div>

              {/* Progress bar for rate-lock countdown */}
              <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-1000"
                  style={{ width: `${lockPercent}%` }}
                />
              </div>

              {/* NGN equivalent */}
              {numAmount > 0 && (
                <p className="text-xs text-slate-400 font-medium mt-2">
                  You'll receive ≈ <span className="text-white font-bold">₦{ngnEquiv}</span>
                </p>
              )}
            </div>

            {/* ── Recent Recipients ───────────────────────── */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
                Recent Recipients
              </p>
              <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
                {/* Add New button */}
                <button
                  id="add-recipient-btn"
                  className="flex flex-col items-center gap-1.5 flex-shrink-0"
                >
                  <div className="w-11 h-11 rounded-full bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/25">
                    <Plus size={20} className="text-white" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">New</span>
                </button>

                {/* Recipient avatars */}
                {RECIPIENTS.map((r) => (
                  <button
                    key={r.id}
                    id={`recipient-${r.id}`}
                    onClick={() => setRecipient(r.id)}
                    className="flex flex-col items-center gap-1.5 flex-shrink-0"
                  >
                    <img
                      src={r.avatar}
                      alt={r.name}
                      className={`
                        w-11 h-11 rounded-full object-cover transition-all
                        ${selectedRecipient === r.id
                          ? "ring-2 ring-emerald-500 ring-offset-2 ring-offset-[#1a2235]"
                          : "ring-1 ring-white/10"}
                      `}
                    />
                    <span className="text-[10px] text-slate-400 font-medium">{r.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Selected Bank Account ───────────────────── */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.04] border border-white/[0.08] mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center">
                  <Landmark size={18} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">GTBank</p>
                  <p className="text-xs text-slate-400 mt-0.5">Savings · **** 1234 · Tola Designer</p>
                </div>
              </div>
              <button className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
                Change
              </button>
            </div>

            {/* Available balance note */}
            <p className="text-xs text-center text-slate-500 font-medium mb-4">
              Available: <span className="text-white font-bold">${AVAILABLE_USDC.toFixed(2)}</span> {currency}
            </p>

            {/* ── Withdraw CTA ─────────────────────────────── */}
            <button
              id="withdraw-btn"
              className="
                w-full flex items-center justify-center gap-2.5
                py-4 rounded-xl
                bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600
                text-white font-bold text-base
                shadow-xl shadow-emerald-500/20 transition-all
                active:scale-[0.99]
              "
            >
              <ArrowDownToLine size={20} />
              Withdraw {amount ? `$${amount}` : ""}
            </button>

          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
