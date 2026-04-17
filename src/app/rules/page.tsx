"use client";

import { useState }       from "react";
import Sidebar             from "@/components/Sidebar";
import MobileNav           from "@/components/MobileNav";
import CreateRuleModal     from "@/components/CreateRuleModal";
import ConfirmDialog       from "@/components/ConfirmDialog";
import { useRules }        from "@/context/RulesContext";
import { useRouter }       from "next/navigation";
import { Plus, Zap, ArrowLeft, TrendingUp, Calendar, Wallet, Trash2 } from "lucide-react";

// ─── Helper — pick an icon based on the trigger description ─────────

function getTriggerIcon(trigger: string) {
  const t = trigger.toLowerCase();
  if (t.includes("rate") || t.includes("₦"))        return TrendingUp;
  if (t.includes("friday") || t.includes("schedule")) return Calendar;
  return Wallet;
}

// ─── Component ──────────────────────────────────────────────────────

export default function RulesPage() {
  const router = useRouter();
  const { rules, toggleRule, deleteRule } = useRules();

  const [isModalOpen, setModal]     = useState(false);

  // Tracks which rule is pending deletion (shows the in-app confirm dialog)
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const pendingDeleteRule = rules.find((r) => r.id === pendingDeleteId);
  const activeCount       = rules.filter((r) => r.isActive).length;

  const handleConfirmDelete = () => {
    if (pendingDeleteId !== null) deleteRule(pendingDeleteId);
    setPendingDeleteId(null);
  };

  return (
    <div className="flex min-h-screen bg-[#0D1117] pb-20 md:pb-0">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-4 md:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto pt-2 md:pt-4">

          {/* Mobile logo */}
          <img
            src="/PayStepLogo-removebg.png"
            alt="Paysted"
            className="h-7 w-auto md:hidden object-contain mb-5"
          />

          {/* ── Page Header ─────────────────────────────── */}
          <header className="flex items-center justify-between mb-8 gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="md:hidden p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-400 hover:text-white transition-all"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Vault Rules</h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  {activeCount} active rule{activeCount !== 1 ? "s" : ""} running
                </p>
              </div>
            </div>

            <button
              id="create-rule-page-btn"
              onClick={() => setModal(true)}
              className="
                flex items-center gap-2 px-4 py-2.5 rounded-xl
                bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600
                text-white text-sm font-bold
                shadow-lg shadow-emerald-500/20 transition-all
              "
            >
              <Plus size={16} /> New Rule
            </button>
          </header>

          {/* ── Info Banner ─────────────────────────────── */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/20 mb-6">
            <Zap size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 leading-relaxed">
              <span className="font-bold text-emerald-400">Vault Rules</span> are programmable automations
              that monitor live exchange rates and execute conversions or payouts when your conditions are met —
              without you needing to check rates every morning.
            </p>
          </div>

          {/* ── Rules List ──────────────────────────────── */}
          {rules.length === 0 ? (

            /* Empty state */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-4">
                <Zap size={28} className="text-slate-600" />
              </div>
              <p className="text-white font-bold mb-1">No rules yet</p>
              <p className="text-sm text-slate-500 mb-6">
                Create your first automation to put your money on autopilot.
              </p>
              <button
                onClick={() => setModal(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold transition-all"
              >
                <Plus size={15} /> Create First Rule
              </button>
            </div>

          ) : (

            <div className="flex flex-col gap-3">
              {rules.map((rule) => {
                const TriggerIcon = getTriggerIcon(rule.trigger);
                return (
                  <div
                    key={rule.id}
                    className="p-5 rounded-2xl bg-[#1a2235] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center gap-4"
                  >
                    {/* Left: icon + details */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <TriggerIcon size={18} className="text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white">{rule.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">When: {rule.trigger}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Then: {rule.action}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[10px] text-slate-500 font-medium">
                            {rule.executions} execution{rule.executions !== 1 ? "s" : ""}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-slate-700" />
                          <span className="text-[10px] text-slate-500 font-medium">
                            Last run: {rule.lastRun}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: badge + toggle + delete */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`
                        text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full
                        ${rule.isActive
                          ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                          : "text-slate-500 bg-white/[0.04] border border-white/[0.08]"}
                      `}>
                        {rule.isActive ? "Active" : "Paused"}
                      </span>

                      {/* Toggle switch */}
                      <button
                        id={`rules-page-toggle-${rule.id}`}
                        onClick={() => toggleRule(rule.id)}
                        aria-label={`Toggle "${rule.name}"`}
                        className={`
                          relative inline-flex h-5 w-9 items-center rounded-full transition-colors
                          ${rule.isActive ? "bg-emerald-500" : "bg-slate-700"}
                        `}
                      >
                        <span
                          className={`
                            inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform
                            ${rule.isActive ? "translate-x-4" : "translate-x-1"}
                          `}
                        />
                      </button>

                      {/* Delete — opens in-app confirm dialog */}
                      <button
                        id={`delete-rule-${rule.id}`}
                        onClick={() => setPendingDeleteId(rule.id)}
                        aria-label={`Delete "${rule.name}"`}
                        className="p-2 rounded-xl text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Upgrade notice ──────────────────────────── */}
          <div className="mt-6 flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div>
              <p className="text-xs font-bold text-white">Free Plan: 2 active rules</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Upgrade to Pro for unlimited rules + priority execution.
              </p>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-colors">
              Upgrade
            </button>
          </div>

        </div>
      </main>

      <MobileNav />

      {/* Create Rule Modal */}
      {isModalOpen && <CreateRuleModal onClose={() => setModal(false)} />}

      {/* In-app Delete Confirmation Dialog */}
      {pendingDeleteId !== null && (
        <ConfirmDialog
          title="Delete Rule"
          message={`Are you sure you want to delete "${pendingDeleteRule?.name}"? This cannot be undone.`}
          confirmLabel="Delete Rule"
          onConfirm={handleConfirmDelete}
          onCancel={() => setPendingDeleteId(null)}
        />
      )}
    </div>
  );
}
