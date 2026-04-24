import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import VaultCard from "@/components/VaultCard";
import QuickActions from "@/components/QuickAction";
import VaultRulesSection from "@/components/VaultRulesSection";
import ActivityFeed from "@/components/ActivityFeed";
import { Bell } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-[#0D1117] pb-20 md:pb-0">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-4 md:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto pt-2 md:pt-4">

          {/* Mobile — Paysted logo */}
          <img
            src="/PayStepLogo-removebg.png"
            alt="Paysted"
            className="h-7 w-auto md:hidden object-contain mb-5 brightness-0 invert"
          />

          {/* ── Page Header ───────────────────────────────── */}
          <header className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <img
                src="https://i.pravatar.cc/150?img=68"
                alt="Tola Designer"
                className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500/20"
              />
              <div>
                <p className="text-[11px] text-slate-500 font-medium uppercase tracking-widest">
                  Good Morning
                </p>
                <h2 className="text-base font-bold text-white leading-tight">Tola Designer</h2>
              </div>
            </div>

            {/* Notification bell */}
            <button
              id="notifications-btn"
              aria-label="Notifications"
              className="relative w-10 h-10 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.10] transition-all"
            >
              <Bell size={18} />
              {/* Unread dot */}
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            </button>
          </header>

          {/* ── Vault Balance Card ────────────────────────── */}
          <VaultCard />

          {/* ── Quick Actions (Generate Link + Instant Payout) */}
          <QuickActions />

          {/* ── Vault Rules Preview ───────────────────────── */}
          <VaultRulesSection />

          {/* ── Recent Activity Feed ──────────────────────── */}
          <ActivityFeed />

        </div>
      </main>

      <MobileNav />
    </div>
  );
}
