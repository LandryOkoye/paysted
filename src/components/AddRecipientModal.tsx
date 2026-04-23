"use client";

import { useState } from "react";
import { X, Landmark, Loader2 } from "lucide-react";

// ─── Type matching the Busha recipient shape returned by POST /api/recipients ─
// We keep a simplified local version for the UI list (not the full BushaRecipient)
export interface Recipient {
  id:            string;  // Busha recipient ID (e.g. "64ae8c26ea1033204c805a8a")
  name:          string;  // Account holder's name
  bank:          string;  // Bank name (e.g. "GTBank")
  accountNumber: string;  // 10-digit NUBAN number
  bankCode:      string;  // Nigerian bank code (e.g. "058")
  avatar:        string;  // Generated from initials via ui-avatars
}

interface AddRecipientModalProps {
  onClose: () => void;
  // Returns the newly created recipient so the parent can add it to the list
  onAdd:   (recipient: Recipient) => void;
}

// Nigerian banks with their NUBAN bank codes
// Bank codes are required by the Busha API in the `fields` array
const NIGERIAN_BANKS: { name: string; code: string }[] = [
  { name: "GTBank",      code: "058"    },
  { name: "First Bank",  code: "011"    },
  { name: "Zenith Bank", code: "057"    },
  { name: "Access Bank", code: "044"    },
  { name: "UBA",         code: "033"    },
  { name: "Fidelity Bank", code: "070"  },
  { name: "Sterling Bank", code: "232"  },
  { name: "Wema Bank",   code: "035"    },
  { name: "Polaris Bank",code: "076"    },
  { name: "Stanbic IBTC",code: "221"   },
  { name: "FCMB",        code: "214"    },
  { name: "Ecobank",     code: "050"    },
  { name: "Union Bank",  code: "032"    },
  { name: "Keystone Bank",code: "082"   },
];

export default function AddRecipientModal({ onClose, onAdd }: AddRecipientModalProps) {
  // Form fields
  const [accountName,   setAccountName]   = useState("");  // → Busha fields: account_name
  const [selectedBank,  setSelectedBank]  = useState("");  // → Busha fields: bank_name + bank_code
  const [accountNumber, setAccountNumber] = useState("");  // → Busha fields: account_number

  // UI state
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const isValid =
    accountName.trim().length > 1 &&
    selectedBank !== "" &&
    accountNumber.replace(/\D/g, "").length === 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isValid) {
      setError("Please fill in all fields. Account number must be 10 digits.");
      return;
    }

    const bank = NIGERIAN_BANKS.find((b) => b.name === selectedBank);
    if (!bank) {
      setError("Please select a valid bank.");
      return;
    }

    setLoading(true);

    try {
      // Call POST /api/recipients → Busha POST /v1/recipients
      // Busha registers the bank account and returns a recipient.id we can use for transfers
      const res = await fetch("/api/recipients", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountName:   accountName.trim(),
          bankName:      bank.name,
          bankCode:      bank.code,
          accountNumber: accountNumber.replace(/\D/g, ""),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "Failed to save recipient");
      }

      // Build a simplified recipient object for the UI list
      // `data.recipient.id` is the Busha-generated ID needed for future transfers
      const newRecipient: Recipient = {
        id:            data.recipient.id,
        name:          accountName.trim(),
        bank:          bank.name,
        bankCode:      bank.code,
        accountNumber: accountNumber.replace(/\D/g, ""),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(accountName.trim())}&background=10b981&color=fff`,
      };

      onAdd(newRecipient);
      onClose();

    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
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
              <p className="text-xs text-slate-500">Register a new payout recipient.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">

          {/* Account Holder Name → Busha: account_name */}
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
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
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

          {/* Bank Name → Busha: bank_name + bank_code (both sent from the selected entry) */}
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
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="
                w-full px-4 py-3 rounded-xl text-sm text-white
                bg-white/[0.05] border border-white/[0.10]
                focus:outline-none focus:border-emerald-500/50
                transition-all appearance-none cursor-pointer
              "
            >
              <option value="" disabled className="bg-[#111827]">Select a bank</option>
              {NIGERIAN_BANKS.map((b) => (
                <option key={b.code} value={b.name} className="bg-[#111827]">
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Account Number → Busha: account_number (10-digit NUBAN) */}
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
            disabled={!isValid || loading}
            className={`
              w-full py-3.5 rounded-xl text-sm font-bold transition-all
              flex items-center justify-center gap-2
              ${isValid && !loading
                ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20"
                : "bg-white/[0.06] text-slate-500 cursor-not-allowed"}
            `}
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Saving…</>
            ) : (
              "Save Recipient"
            )}
          </button>

        </form>
      </div>
    </div>
  );
}
