"use client";

import Sidebar    from "@/components/Sidebar";
import MobileNav  from "@/components/MobileNav";
import {
  User, Bell, Shield, Key, CreditCard,
  LogOut, ArrowLeft, ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCurrency } from "@/context/CurrencyContext";

// ─── Settings Sections ──────────────────────────────────────────────

const SECTIONS = [
  { title: "Personal Information", icon: User,       desc: "Update your photo and personal details."       },
  { title: "Bank Accounts & Cards", icon: CreditCard, desc: "Manage local NGN recipient bank accounts."     },
  { title: "Security & 2FA",        icon: Shield,     desc: "Secure your account with authenticator."       },
  { title: "Notifications",         icon: Bell,       desc: "Choose what we email you about."               },
  { title: "API Keys",              icon: Key,        desc: "Manage your automated Busha Commerce keys."    },
];

// ─── Component ──────────────────────────────────────────────────────

export default function SettingsPage() {
  const router = useRouter();
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex min-h-screen bg-[#0D1117] pb-20 md:pb-0">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-4 md:p-6 lg:p-8 w-full">
        <div className="max-w-2xl mx-auto pt-2 md:pt-4">

          {/* Mobile logo */}
          <img
            src="/PayStepLogo-removebg.png"
            alt="Paysted"
            className="h-7 w-auto md:hidden object-contain mb-5 brightness-0 invert"
          />

          {/* ── Page Header ─────────────────────────────── */}
          <header className="flex items-center gap-3 mb-8">
            <button
              onClick={() => router.back()}
              className="md:hidden p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-400 hover:text-white transition-all"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-2xl font-bold text-white">Account & Security Settings</h1>
          </header>

          {/* ── Profile Card ─────────────────────────────── */}
          <div className="flex items-center gap-5 p-5 rounded-2xl bg-[#1a2235] border border-white/[0.06] mb-5">
            <div className="relative">
              <img
                src="https://i.pravatar.cc/150?img=68"
                alt="Tola Designer"
                className="w-20 h-20 rounded-full object-cover ring-2 ring-emerald-500/25"
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Tola Designer</h2>
              <p className="text-sm text-slate-400 mb-3">tola.design@example.com</p>
              <button
                id="change-photo-btn"
                className="
                  px-4 py-1.5 rounded-lg text-xs font-semibold
                  bg-white/[0.06] border border-white/[0.10] text-slate-300
                  hover:bg-white/[0.10] transition-all
                "
              >
                Change Photo
              </button>
            </div>
          </div>

          {/* ── Stablecoin Preference Toggle ─────────────── */}
          <div className="p-5 rounded-2xl bg-[#1a2235] border border-white/[0.06] mb-5">
            <h3 className="text-sm font-bold text-white mb-3">Default Stablecoin Preference</h3>

            <div className="flex bg-white/[0.04] p-1 rounded-xl border border-white/[0.06] mb-3">
              <button
                id="currency-usdc-btn"
                onClick={() => setCurrency("USDC")}
                className={`
                  flex-1 py-2.5 rounded-lg text-sm font-bold transition-all
                  ${currency === "USDC"
                    ? "bg-white/[0.10] text-white border border-white/[0.12] shadow-sm"
                    : "text-slate-500 hover:text-slate-300"}
                `}
              >
                USDC (Circle)
              </button>
              <button
                id="currency-usdt-btn"
                onClick={() => setCurrency("USDT")}
                className={`
                  flex-1 py-2.5 rounded-lg text-sm font-bold transition-all
                  ${currency === "USDT"
                    ? "bg-white/[0.10] text-white border border-white/[0.12] shadow-sm"
                    : "text-slate-500 hover:text-slate-300"}
                `}
              >
                USDT (Tether)
              </button>
            </div>

            <p className="text-xs text-slate-500">
              All your vault balances and invoices will default to this currency.
            </p>
          </div>

          {/* ── Settings Sections ────────────────────────── */}
          <div className="rounded-2xl bg-[#1a2235] border border-white/[0.06] overflow-hidden mb-5">
            <div className="divide-y divide-white/[0.05]">
              {SECTIONS.map(({ title, icon: Icon, desc }) => (
                <button
                  key={title}
                  id={`settings-${title.toLowerCase().replace(/\s+/g, "-")}`}
                  className="w-full flex items-center gap-4 p-5 hover:bg-white/[0.03] transition-colors text-left group"
                >
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-slate-400 flex-shrink-0 group-hover:text-slate-200 transition-colors">
                    <Icon size={17} />
                  </div>

                  {/* Text */}
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight size={16} className="text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* ── Sign Out ──────────────────────────────────── */}
          <button
            id="sign-out-btn"
            className="
              flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold
              bg-rose-500/10 border border-rose-500/20 text-rose-400
              hover:bg-rose-500/20 transition-all
            "
          >
            <LogOut size={16} /> Sign Out Securely
          </button>

        </div>
      </main>

      <MobileNav />
    </div>
  );
}
