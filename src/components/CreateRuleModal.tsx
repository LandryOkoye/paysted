"use client";

import { useState } from "react";
import { X, ArrowLeft, Check, TrendingUp, Calendar, Wallet, PieChart, RefreshCcw } from "lucide-react";
import { useRules } from "@/context/RulesContext";

// ─── Types ─────────────────────────────────────────────────────────

type Step = 1 | 2 | 3;

interface Trigger {
  id: string;
  icon: React.ElementType;
  label: string;
  description: string;
}

interface Action {
  id: string;
  label: string;
  description: string;
  iconContent: React.ReactNode;
}

interface CreateRuleModalProps {
  onClose: () => void;
}

// ─── Step data ──────────────────────────────────────────────────────

const TRIGGERS: Trigger[] = [
  {
    id: "rate",
    icon: TrendingUp,
    label: "Rate Hits Target",
    description: "Convert when the NGN/USD rate reaches your set target.",
  },
  {
    id: "schedule",
    icon: Calendar,
    label: "On Schedule",
    description: "Run this rule every week, month, or on a specific day.",
  },
  {
    id: "balance",
    icon: Wallet,
    label: "Balance Reached",
    description: "Trigger when your vault reaches a specified amount.",
  },
];

const ACTIONS: Action[] = [
  {
    id: "convert_ngn",
    label: "Convert to NGN",
    description: "Automatically convert the incoming stablecoin amount to Nigerian Naira at the best current rate.",
    iconContent: <span className="text-lg font-black text-emerald-400">₦</span>,
  },
  {
    id: "mpesa",
    label: "Send to M-Pesa",
    description: "Instantly send the funds to a linked M-Pesa mobile money wallet.",
    iconContent: <span className="text-[10px] font-black text-red-400 leading-tight">M·PESA</span>,
  },
  {
    id: "split",
    label: "Split %",
    description: "Allocate a percentage of the funds to different actions or wallets.",
    iconContent: <PieChart size={18} className="text-blue-300" />,
  },
];

const STEP_LABELS = ["Choose Trigger", "Choose Action", "Confirm & Activate"];

// ─── Component ──────────────────────────────────────────────────────

export default function CreateRuleModal({ onClose }: CreateRuleModalProps) {
  const { addRule } = useRules();

  const [step,             setStep]            = useState<Step>(1);
  const [selectedTrigger,  setSelectedTrigger] = useState<string | null>(null);
  const [selectedAction,   setSelectedAction]  = useState<string | null>(null);
  const [ruleName,         setRuleName]        = useState("");

  const canContinue =
    (step === 1 && selectedTrigger !== null) ||
    (step === 2 && selectedAction  !== null) ||
    step === 3;

  const chosenTrigger = TRIGGERS.find((t) => t.id === selectedTrigger);
  const chosenAction  = ACTIONS.find((a)  => a.id === selectedAction);

  const handleNext = () => {
    if (step < 3) {
      setStep((step + 1) as Step);
      return;
    }

    // ── Step 3: Activate the rule ────────────────────
    const name    = ruleName.trim() || `${chosenTrigger?.label} → ${chosenAction?.label}`;
    const trigger = chosenTrigger?.label ?? "";
    const action  = chosenAction?.label  ?? "";

    addRule({ name, trigger, action }); // updates the shared context
    onClose();
  };

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as Step);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal panel */}
      <div className="relative z-10 w-full max-w-md bg-[#111827] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden">

        {/* ── Header ───────────────────────────────────── */}
        <div className="p-5 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-slate-500 font-medium">
              Step {step} of 3: {STEP_LABELS[step - 1]}
            </p>
            <button
              id="close-rule-modal"
              onClick={onClose}
              className="text-slate-500 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <h2 className="text-xl font-bold text-white mb-4">Create Automation Rule</h2>

          {/* Step progress indicator */}
          <div className="flex items-center gap-1">
            {([1, 2, 3] as Step[]).map((s) => (
              <div key={s} className="flex items-center gap-1">
                <div
                  className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all
                    ${s < step  ? "bg-emerald-500 text-white"
                    : s === step ? "bg-transparent border-2 border-emerald-500 text-emerald-400"
                    :              "bg-white/10 border border-white/10 text-slate-500"}
                  `}
                >
                  {s < step ? <Check size={11} /> : s}
                </div>
                {s < 3 && (
                  <div className={`h-0.5 w-14 rounded-full ${s < step ? "bg-emerald-500" : "bg-white/10"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Body ─────────────────────────────────────── */}
        <div className="p-5">

          {/* Step 1 — Choose Trigger */}
          {step === 1 && (
            <div>
              <p className="text-sm font-bold text-white mb-4">Step 1 of 3: {STEP_LABELS[0]}</p>
              <div className="flex flex-col gap-3">
                {TRIGGERS.map(({ id, icon: Icon, label, description }) => {
                  const active = selectedTrigger === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setSelectedTrigger(id)}
                      className={`
                        flex items-start gap-4 p-4 rounded-xl border text-left transition-all
                        ${active
                          ? "border-emerald-500 bg-emerald-500/10"
                          : "border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20"}
                      `}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${active ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-slate-400"}`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-bold ${active ? "text-emerald-400" : "text-white"}`}>{label}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{description}</p>
                      </div>
                      {active && (
                        <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check size={11} className="text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2 — Choose Action */}
          {step === 2 && (
            <div>
              <p className="text-sm font-bold text-white mb-4">Step 2 of 3: {STEP_LABELS[1]}</p>
              <div className="grid grid-cols-3 gap-3">
                {ACTIONS.map(({ id, label, description, iconContent }) => {
                  const active = selectedAction === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setSelectedAction(id)}
                      className={`
                        relative flex flex-col items-center gap-2.5 p-4 rounded-xl border text-center transition-all
                        ${active
                          ? "border-emerald-500 bg-emerald-500/10"
                          : "border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20"}
                      `}
                    >
                      {active && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                          <Check size={9} className="text-white" />
                        </div>
                      )}
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                        {iconContent}
                      </div>
                      <p className={`text-xs font-bold leading-tight ${active ? "text-emerald-400" : "text-white"}`}>
                        {label}
                      </p>
                      <p className="text-[10px] text-slate-400 leading-tight">{description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3 — Confirm & Activate */}
          {step === 3 && (
            <div>
              <p className="text-sm font-bold text-white mb-4">Step 3 of 3: {STEP_LABELS[2]}</p>

              {/* Rule summary */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <RefreshCcw size={16} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white mb-1">Rule Summary</p>
                  <p className="text-xs text-slate-400">
                    When: <span className="text-emerald-400 font-semibold">{chosenTrigger?.label}</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Then: <span className="text-emerald-400 font-semibold">{chosenAction?.label}</span>
                  </p>
                </div>
              </div>

              {/* Rule name input */}
              <div className="mb-4">
                <label
                  htmlFor="rule-name-input"
                  className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2"
                >
                  Rule Name <span className="text-slate-600 normal-case font-normal">(optional)</span>
                </label>
                <input
                  id="rule-name-input"
                  type="text"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  placeholder={`${chosenTrigger?.label} → ${chosenAction?.label}`}
                  className="
                    w-full px-4 py-3 rounded-xl text-sm text-white
                    bg-white/[0.05] border border-white/[0.10]
                    placeholder-slate-600
                    focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.08]
                    transition-all
                  "
                />
              </div>

              {/* Info notice */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-500/[0.05] border border-emerald-500/20">
                <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                <p className="text-xs text-slate-300">
                  This rule activates immediately after saving. You can pause or delete it any time.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ───────────────────────────────────── */}
        <div className="flex items-center gap-3 p-5 pt-0">
          <button
            id="modal-back-btn"
            onClick={handleBack}
            disabled={step === 1}
            className="
              flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold
              border border-white/[0.10] text-slate-300
              hover:bg-white/[0.05] transition-all
              disabled:opacity-30 disabled:cursor-not-allowed
            "
          >
            <ArrowLeft size={15} /> Back
          </button>

          <button
            id="modal-continue-btn"
            onClick={handleNext}
            disabled={!canContinue}
            className={`
              flex-1 py-3 rounded-xl text-sm font-bold transition-all
              ${canContinue
                ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20"
                : "bg-white/[0.08] text-slate-500 cursor-not-allowed"}
            `}
          >
            {step === 3 ? "Activate Rule" : "Continue"}
          </button>
        </div>

      </div>
    </div>
  );
}
