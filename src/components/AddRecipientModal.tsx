"use client";

import { useState } from "react";
import { X, Landmark } from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────

export interface Recipient {
  id: number;
  name: string;       // Account holder's name
  bank: string;       // Bank name (e.g. GTBank)
  accountNumber: string;
  accountType: "Savings" | "Current";
  avatar: string;     // Generated from initials
}

interface AddRecipientModalProps {
  onClose: () => void;
  onAdd: (recipient: Recipient) => void;
}

// Nigerian banks list for the select dropdown
const NIGERIAN_BANKS = [
  "GTBank", "First Bank", "Zenith Bank", "Access Bank",
  "UBA", "Fidelity Bank", "Sterling Bank", "Wema Bank",
  "Polaris Bank", "Stanbic IBTC", "FCMB", "Ecobank",
  "Union Bank", "Heritage Bank", "Keystone Bank",
];

// ─── Component ──────────────────────────────────────────────────────

export default function AddRecipientModal({ onClose, onAdd }: AddRecipientModalProps) {
  const [name,          setName]          = useState("");
  const [bank,          setBank]          = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountType,   setAccountType]   = useState<"Savings" | "Current">("Savings");
  const [error,         setError]         = useState("");

  const isValid =
    name.trim().length > 1 &&
    bank !== "" &&
    accountNumber.replace(/\D/g, "").length === 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isValid) {
      setError("Please fill in all fields. Account number must be 10 digits.");
      return;
    }

    // Build recipient and pass it up — let the parent manage the list
    const newRecipient: Recipient = {
      id: Date.now(),
      name: name.trim(),
      bank,
      accountNumber: accountNumber.replace(/\D/g, ""),
      accountType,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=10b981&color=fff`,
    };

    onAdd(newRecipient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-sm bg-[#111827] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Landmark size={18} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Add Bank Account</h2>
              <p className="text-xs text-slate-500">Save a new payout recipient.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">

          {/* Account Holder Name */}
          <div>
            <label
              htmlFor="recipient-name"
              className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2"
            >
              Account Holder Name
            </label>
            <input
              id="recipient-name"
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Tola Designer"
              className="
                w-full px-4 py-3 rounded-xl text-sm text-white
                bg-white/[0.05] border border-white/[0.10]
                placeholder-slate-600
                focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.08]
                transition-all
              "
            />
          </div>

          {/* Bank Name */}
          <div>
            <label
              htmlFor="recipient-bank"
              className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2"
            >
              Bank Name
            </label>
            <select
              id="recipient-bank"
              required
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              className="
                w-full px-4 py-3 rounded-xl text-sm text-white
                bg-white/[0.05] border border-white/[0.10]
                focus:outline-none focus:border-emerald-500/50
                transition-all appearance-none cursor-pointer
              "
            >
              <option value="" disabled className="bg-[#111827]">Select a bank</option>
              {NIGERIAN_BANKS.map((b) => (
                <option key={b} value={b} className="bg-[#111827]">{b}</option>
              ))}
            </select>
          </div>

          {/* Account Number */}
          <div>
            <label
              htmlFor="recipient-account-number"
              className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2"
            >
              Account Number
            </label>
            <input
              id="recipient-account-number"
              type="text"
              inputMode="numeric"
              maxLength={10}
              required
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
              placeholder="10-digit account number"
              className="
                w-full px-4 py-3 rounded-xl text-sm text-white font-mono tracking-widest
                bg-white/[0.05] border border-white/[0.10]
                placeholder-slate-600 placeholder:tracking-normal placeholder:font-sans
                focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.08]
                transition-all
              "
            />
            <p className="text-[11px] text-slate-500 mt-1.5">
              {accountNumber.length}/10 digits
            </p>
          </div>

          {/* Account Type toggle */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
              Account Type
            </label>
            <div className="flex bg-white/[0.04] p-1 rounded-xl border border-white/[0.06]">
              {(["Savings", "Current"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setAccountType(type)}
                  className={`
                    flex-1 py-2 rounded-lg text-sm font-semibold transition-all
                    ${accountType === type
                      ? "bg-white/[0.10] text-white border border-white/[0.12]"
                      : "text-slate-500 hover:text-slate-300"}
                  `}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            id="add-recipient-submit"
            type="submit"
            disabled={!isValid}
            className={`
              w-full py-3.5 rounded-xl text-sm font-bold transition-all
              ${isValid
                ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20"
                : "bg-white/[0.06] text-slate-500 cursor-not-allowed"}
            `}
          >
            Save Recipient
          </button>

        </form>
      </div>
    </div>
  );
}
