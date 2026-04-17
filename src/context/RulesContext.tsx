"use client";

import { createContext, useContext, useState } from "react";

// ─── Types ─────────────────────────────────────────────────────────

export interface VaultRule {
  id: number;
  name: string;
  trigger: string;
  action: string;
  isActive: boolean;
  executions: number;
  lastRun: string;
}

interface RulesContextValue {
  rules: VaultRule[];
  addRule: (rule: Pick<VaultRule, "name" | "trigger" | "action">) => void;
  toggleRule: (id: number) => void;
  deleteRule: (id: number) => void;
}

// ─── Context ────────────────────────────────────────────────────────

const RulesContext = createContext<RulesContextValue | null>(null);

// ─── Default seed data ──────────────────────────────────────────────

const SEED_RULES: VaultRule[] = [
  {
    id: 1,
    name: "Auto-Convert USDT to USDC",
    trigger: "Every Friday at 5 PM",
    action: "Convert to NGN",
    isActive: true,
    executions: 8,
    lastRun: "Apr 11, 2026",
  },
  {
    id: 2,
    name: "Salary Allocation Rule",
    trigger: "Balance Reached $500",
    action: "Split 50% to Savings",
    isActive: true,
    executions: 3,
    lastRun: "Apr 14, 2026",
  },
  {
    id: 3,
    name: "NGN Rate Alert Convert",
    trigger: "Rate hits ₦1,600",
    action: "Convert $200 to NGN → GTBank",
    isActive: false,
    executions: 1,
    lastRun: "Mar 28, 2026",
  },
];

// ─── Provider ───────────────────────────────────────────────────────

export function RulesProvider({ children }: { children: React.ReactNode }) {
  const [rules, setRules] = useState<VaultRule[]>(SEED_RULES);

  // Prepend newly created rule to the list
  const addRule = (rule: Pick<VaultRule, "name" | "trigger" | "action">) => {
    const newRule: VaultRule = {
      ...rule,
      id: Date.now(),
      isActive: true,
      executions: 0,
      lastRun: "Never",
    };
    setRules((prev) => [newRule, ...prev]);
  };

  // Flip a rule between active / paused
  const toggleRule = (id: number) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
  };

  // Remove a rule permanently
  const deleteRule = (id: number) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <RulesContext.Provider value={{ rules, addRule, toggleRule, deleteRule }}>
      {children}
    </RulesContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────

export function useRules() {
  const ctx = useContext(RulesContext);
  if (!ctx) throw new Error("useRules must be used inside <RulesProvider>");
  return ctx;
}
