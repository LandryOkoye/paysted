"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import CreateRuleModal from "./CreateRuleModal";

// ─── Types ─────────────────────────────────────────────────────────

interface VaultRule {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

// ─── Default Rules (Mock Data) ──────────────────────────────────────

const INITIAL_RULES: VaultRule[] = [
  {
    id: 1,
    name: "Auto-Convert USDT to USDC",
    description: "Every Friday at 5 PM",
    isActive: true,
  },
  {
    id: 2,
    name: "Salary Allocation Rule",
    description: "50% of incoming USDT to Savings",
    isActive: true,
  },
];

// ─── Component ──────────────────────────────────────────────────────

export default function VaultRulesSection() {
  const [rules, setRules]       = useState<VaultRule[]>(INITIAL_RULES);
  const [isModalOpen, setModal] = useState(false);

  // Toggle a rule on or off
  const toggleRule = (id: number) => {
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
      )
    );
  };

  return (
    <>
      <div className="mb-6">

        {/* ── Section Header ───────────────────────────── */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white">Vault Rules</h3>
          <button
            id="add-rule-btn"
            onClick={() => setModal(true)}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <Plus size={13} /> Add Rule
          </button>
        </div>

        {/* ── Rule Cards ───────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="flex flex-col gap-3 p-4 rounded-2xl bg-[#1a2235] border border-white/[0.06]"
            >
              {/* Top row: Active badge + toggle switch */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  {rule.isActive ? "Active" : "Paused"}
                </span>

                {/* Toggle switch */}
                <button
                  id={`rule-toggle-${rule.id}`}
                  onClick={() => toggleRule(rule.id)}
                  aria-label={`Toggle "${rule.name}"`}
                  className={`
                    relative inline-flex h-5 w-9 items-center rounded-full transition-colors
                    ${rule.isActive ? "bg-emerald-500" : "bg-slate-600"}
                  `}
                >
                  <span
                    className={`
                      inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow
                      transition-transform duration-200
                      ${rule.isActive ? "translate-x-4" : "translate-x-1"}
                    `}
                  />
                </button>
              </div>

              {/* Rule name + description */}
              <div>
                <p className="text-sm font-bold text-white">{rule.name}</p>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">{rule.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── View All link ─────────────────────────────── */}
        <Link
          href="/rules"
          className="
            mt-3 w-full flex items-center justify-center
            py-2.5 text-xs font-semibold text-slate-500
            border border-white/[0.06] rounded-xl
            hover:text-slate-300 hover:border-white/10 hover:bg-white/[0.02]
            transition-all
          "
        >
          View all rules →
        </Link>

      </div>

      {/* ── Create Rule Modal ─────────────────────────── */}
      {isModalOpen && <CreateRuleModal onClose={() => setModal(false)} />}
    </>
  );
}
