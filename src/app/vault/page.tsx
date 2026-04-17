"use client";

import Sidebar    from "@/components/Sidebar";
import MobileNav  from "@/components/MobileNav";
import VaultCard  from "@/components/VaultCard";
import {
  ArrowDownToLine, Send, ArrowRightLeft,
  History, ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";

// ─── Types ─────────────────────────────────────────────────────────

type TxType = "Receive" | "Withdraw" | "Exchange";

interface Transaction {
  id: number;
  type: TxType;
  asset: string;
  amount: string;
  status: string;
  date: string;
  via: string;
}

// ─── Mock Vault Ledger ──────────────────────────────────────────────

const VAULT_TRANSACTIONS: Transaction[] = [
  { id: 1, type: "Receive",  asset: "USDC",        amount: "+$1,250.00", status: "Completed", date: "Oct 24, 2:30 PM",  via: "Busha Commerce" },
  { id: 2, type: "Withdraw", asset: "USDC → NGN",  amount: "-$500.00",   status: "Completed", date: "Oct 12, 11:15 AM", via: "GTBank"         },
  { id: 3, type: "Receive",  asset: "USDC",        amount: "+$3,400.00", status: "Completed", date: "Oct 05, 9:00 AM",  via: "Busha Commerce" },
  { id: 4, type: "Exchange", asset: "USDT → USDC", amount: "+$850.00",   status: "Completed", date: "Sep 28, 4:20 PM",  via: "Internal"       },
];

// Per-type icon and colour config
const TX_CONFIG: Record<TxType, { icon: React.ElementType; bg: string; text: string }> = {
  Receive:  { icon: ArrowDownToLine,  bg: "bg-emerald-500/10", text: "text-emerald-400" },
  Withdraw: { icon: Send,             bg: "bg-slate-500/10",   text: "text-slate-400"   },
  Exchange: { icon: ArrowRightLeft,   bg: "bg-purple-500/10",  text: "text-purple-400"  },
};

// Action button config
const VAULT_ACTIONS = [
  { label: "Deposit",    icon: ArrowDownToLine, bg: "bg-emerald-500/10", text: "text-emerald-400" },
  { label: "Send",       icon: Send,            bg: "bg-blue-500/10",    text: "text-blue-400"    },
  { label: "Swap",       icon: ArrowRightLeft,  bg: "bg-purple-500/10",  text: "text-purple-400"  },
  { label: "Statements", icon: History,         bg: "bg-slate-500/10",   text: "text-slate-400"   },
];

// ─── Component ──────────────────────────────────────────────────────

export default function VaultPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-[#0D1117] pb-20 md:pb-0">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-4 md:p-6 lg:p-8 w-full">
        <div className="max-w-3xl mx-auto pt-2 md:pt-4">

          {/* Mobile logo */}
          <img
            src="/PayStepLogo-removebg.png"
            alt="Paysted"
            className="h-7 w-auto md:hidden object-contain mb-5 brightness-0 invert"
          />

          {/* ── Page Header ─────────────────────────────── */}
          <header className="flex items-center gap-3 mb-6">
            <button
              onClick={() => router.back()}
              className="md:hidden p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-400 hover:text-white transition-all"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Safe Vault</h1>
              <p className="text-sm text-slate-500 mt-0.5 hidden sm:block">
                Your anti-inflation stablecoin reserves.
              </p>
            </div>
          </header>

          {/* ── Vault Balance Card ─────────────────────── */}
          <VaultCard />

          {/* ── Quick Action Buttons ──────────────────────── */}
          <div className="grid grid-cols-4 gap-3 mb-8">
            {VAULT_ACTIONS.map(({ label, icon: Icon, bg, text }) => (
              <button
                key={label}
                id={`vault-action-${label.toLowerCase()}`}
                className="flex flex-col items-center justify-center gap-2.5 py-4 rounded-2xl bg-[#1a2235] border border-white/[0.06] hover:bg-white/[0.06] transition-all group"
              >
                <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                  <Icon size={18} className={text} />
                </div>
                <span className="text-xs font-bold text-slate-300">{label}</span>
              </button>
            ))}
          </div>

          {/* ── Vault Ledger ─────────────────────────────── */}
          <h3 className="text-base font-bold text-white mb-4">Vault Ledger</h3>

          <div className="rounded-2xl bg-[#1a2235] border border-white/[0.06] overflow-hidden divide-y divide-white/[0.05]">
            {VAULT_TRANSACTIONS.map((tx) => {
              const { icon: Icon, bg, text } = TX_CONFIG[tx.type];
              const isPositive = tx.amount.startsWith("+");

              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 sm:p-5 hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  {/* Left: icon + details */}
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center border border-white/[0.06] ${bg}`}>
                      <Icon size={18} className={text} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">
                        {tx.type} {tx.asset}
                      </p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {tx.via} · {tx.date}
                      </p>
                    </div>
                  </div>

                  {/* Right: amount + status */}
                  <div className="text-right">
                    <p className={`text-sm font-bold ${isPositive ? "text-emerald-400" : "text-slate-300"}`}>
                      {tx.amount}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">
                      {tx.status}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </main>

      <MobileNav />
    </div>
  );
}
