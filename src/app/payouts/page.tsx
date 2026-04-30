"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Sidebar        from "@/components/Sidebar";
import MobileNav      from "@/components/MobileNav";
import AddRecipientModal, { Recipient } from "@/components/AddRecipientModal";
import { ArrowDownToLine, ArrowLeft, Plus, Landmark, Info, Loader2, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { useRouter }  from "next/navigation";
import { useCurrency } from "@/context/CurrencyContext";
import type { BushaBalance } from "@/lib/busha.types";

// ─── Constants ────────────────────────────────────────────────────────────────
const RATE_LOCK_SECS = 240;  // 4-minute visual rate-lock window

// ─── Helper ──────────────────────────────────────────────────────────────────
function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// ─── Page Component ───────────────────────────────────────────────────────────
export default function PayoutsPage() {
  const router       = useRouter();
  const { currency } = useCurrency();

  // ── Live vault balance (from GET /api/balances → Busha GET /v1/balances) ────
  const [vault,          setVault]         = useState<BushaBalance | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(true);

  // ── Recipients (from GET /api/recipients → Busha GET /v1/recipients) ────────
  const [recipients,     setRecipients]    = useState<Recipient[]>([]);
  const [recipLoading,   setRecipLoading]  = useState(true);
  const [selectedId,     setSelectedId]    = useState<string | null>(null);

  // ── Live rate from Busha Quotes API ──────────────────────────────────────
  const [rate,           setRate]          = useState<number | null>(null);
  const [rateLoading,    setRateLoading]   = useState(true);
  const [rateError,      setRateError]     = useState(false);

  // ── Modal + form state ────────────────────────────────────────────────────
  const [isAddModalOpen, setAddModal]      = useState(false);
  const [amount,         setAmount]        = useState("");
  const [timeLeft,       setTimeLeft]      = useState(RATE_LOCK_SECS);

  // ── Payout submission state ───────────────────────────────────────────────
  const [payoutStatus,   setPayoutStatus]  = useState<"idle" | "loading" | "success" | "error">("idle");
  const [payoutMessage,  setPayoutMessage] = useState("");

  // ── Ref to avoid stale closure in the countdown effect ───────────────────
  const fetchRateRef = useRef<() => void>(() => {});

  // ── Fetch live USDC balance on mount ─────────────────────────────────────
  useEffect(() => {
    fetch("/api/balances")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.vault) setVault(data.vault as BushaBalance);
      })
      .catch(console.error)
      .finally(() => setBalanceLoading(false));
  }, []);

  // ── Fetch live USDC→NGN rate from Busha Quotes API ───────────────────────
  const fetchRate = useCallback(async () => {
    setRateLoading(true);
    setRateError(false);
    try {
      const res  = await fetch("/api/rate");
      const data = await res.json();
      if (data.success && typeof data.rate === "number") {
        setRate(data.rate);
        setTimeLeft(RATE_LOCK_SECS);  // reset countdown on fresh rate
      } else {
        setRateError(true);
      }
    } catch {
      setRateError(true);
    } finally {
      setRateLoading(false);
    }
  }, []);

  // Store latest fetchRate in ref so countdown effect can call it
  useEffect(() => { fetchRateRef.current = fetchRate; }, [fetchRate]);

  // Fetch rate on mount
  useEffect(() => { fetchRate(); }, [fetchRate]);

  // ── Fetch saved recipients on mount ──────────────────────────────────────
  const fetchRecipients = useCallback(async () => {
    setRecipLoading(true);
    try {
      const res  = await fetch("/api/recipients");
      const data = await res.json();

      if (data.success && data.recipients.length > 0) {
        const mapped: Recipient[] = data.recipients.map((r: {
          id: string;
          fields: Array<{ name: string; value: string }>;
        }) => {
          const get = (name: string) =>
            r.fields.find((f) => f.name === name)?.value ?? "";

          return {
            id:            r.id,
            name:          get("account_name"),
            bank:          get("bank_name"),
            bankCode:      get("bank_code"),
            accountNumber: get("account_number"),
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(get("account_name"))}&background=10b981&color=fff`,
          };
        });

        setRecipients(mapped);
        if (!selectedId) setSelectedId(mapped[0]?.id ?? null);
      }
    } catch (err) {
      console.error("Failed to fetch recipients:", err);
    } finally {
      setRecipLoading(false);
    }
  }, [selectedId]);

  useEffect(() => { fetchRecipients(); }, []);

  // ── Rate-lock countdown — auto-refresh rate when it hits 0 ───────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          fetchRateRef.current();  // refresh rate when countdown expires
          return RATE_LOCK_SECS;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // ── Derived values ────────────────────────────────────────────────────────
  const numAmount         = parseFloat(amount) || 0;
  const ngnEquiv          = rate ? (numAmount * rate).toLocaleString("en-NG", { maximumFractionDigits: 0 }) : "—";
  const lockPercent       = (timeLeft / RATE_LOCK_SECS) * 100;
  const availableUsdc     = parseFloat(vault?.available?.amount ?? "0");
  const selectedRecipient = recipients.find((r) => r.id === selectedId) ?? null;

  // ── Handle newly added recipient ──────────────────────────────────────────
  const handleAddRecipient = (newRecipient: Recipient) => {
    setRecipients((prev) => [...prev, newRecipient]);
    setSelectedId(newRecipient.id);
  };

  // ── Handle payout submission ──────────────────────────────────────────────
  // Full flow: POST /api/rate (create quote for real amount) → get quoteId
  //            POST /api/payouts { quoteId } → execute transfer on Busha
  const handleWithdraw = async () => {
    if (!amount || numAmount <= 0) {
      setPayoutStatus("error");
      setPayoutMessage("Please enter a valid amount.");
      return;
    }
    if (!selectedRecipient) {
      setPayoutStatus("error");
      setPayoutMessage("Please select a recipient.");
      return;
    }
    if (numAmount > availableUsdc) {
      setPayoutStatus("error");
      setPayoutMessage(`Amount exceeds your available balance of $${availableUsdc.toFixed(2)}.`);
      return;
    }

    setPayoutStatus("loading");
    setPayoutMessage("");

    try {
      // Step 1: Create a real quote for the exact USDC amount → locked rate + quoteId
      const quoteRes  = await fetch("/api/rate", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ amount }),
      });
      const quoteData = await quoteRes.json();

      if (!quoteRes.ok || !quoteData.success) {
        throw new Error(quoteData.error ?? "Failed to lock exchange rate.");
      }

      // Step 2: Execute the transfer using the locked quoteId
      const payoutRes  = await fetch("/api/payouts", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ quoteId: quoteData.quoteId }),
      });
      const payoutData = await payoutRes.json();

      if (!payoutRes.ok || !payoutData.success) {
        throw new Error(payoutData.error ?? "Payout failed.");
      }

      setPayoutStatus("success");
      setPayoutMessage(
        `Payout of $${amount} initiated! Transaction ID: ${payoutData.transactionId}. ` +
        `₦${quoteData.targetAmount ? Number(quoteData.targetAmount).toLocaleString("en-NG") : ngnEquiv} will arrive shortly.`
      );
      setAmount("");
      fetchRate();  // refresh rate after payout

    } catch (err) {
      setPayoutStatus("error");
      setPayoutMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  };


  return (
    <div className="flex min-h-screen bg-[#0D1117] pb-20 md:pb-0">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-4 md:p-6 lg:p-8 flex flex-col items-center">
        <div className="max-w-md w-full mx-auto pt-2 md:pt-4">

          {/* Mobile logo */}
          <img
            src="/PayStepLogo-removebg.png"
            alt="Paysted"
            className="h-7 w-auto md:hidden object-contain mb-5"
          />

          {/* ── Page Header ────────────────────────── */}
          <header className="flex items-center gap-3 mb-6">
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

          {/* ── Main Card ──────────────────────────── */}
          <div className="rounded-2xl bg-[#1a2235] border border-white/[0.06] p-5 w-full">

            {/* Amount Input */}
            <div className="mb-5">
              <label
                htmlFor="payout-amount-input"
                className="text-xs font-semibold text-slate-500 uppercase tracking-widest block mb-3"
              >
                Amount ({currency})
              </label>
              <div className="
                flex items-center bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-4
                focus-within:border-emerald-500/50 transition-all
              ">
                <span className="text-4xl font-extrabold text-slate-600 mr-2">$</span>
                <input
                  id="payout-amount-input"
                  type="number"
                  min="0"
                  max={availableUsdc}
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setPayoutStatus("idle");
                  }}
                  placeholder="0"
                  className="
                    flex-1 bg-transparent text-4xl font-extrabold text-white
                    placeholder-slate-700 focus:outline-none border-none
                  "
                />
              </div>
            </div>

            {/* Live Rate + Countdown */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-white flex items-center gap-2">
                  {rateLoading ? (
                    <><Loader2 size={14} className="animate-spin text-emerald-400" /> Fetching rate…</>
                  ) : rateError ? (
                    <span className="text-rose-400 text-xs">Rate unavailable</span>
                  ) : (
                    <>≈ <span className="text-emerald-400">₦{rate?.toLocaleString("en-NG")}</span> per $1</>
                  )}
                </p>
                <div className="flex items-center gap-2">
                  {rateError && (
                    <button
                      onClick={fetchRate}
                      className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                    >
                      <RefreshCw size={11} /> Retry
                    </button>
                  )}
                  {!rateError && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      Rate locked for{" "}
                      <span className="font-bold text-white">{formatTime(timeLeft)}</span>
                      <Info size={12} className="text-slate-600 cursor-help" />
                    </div>
                  )}
                </div>
              </div>

              <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-1000"
                  style={{ width: `${lockPercent}%` }}
                />
              </div>

              {numAmount > 0 && rate && (
                <p className="text-xs text-slate-400 font-medium mt-2">
                  You will receive ≈{" "}
                  <span className="text-white font-bold">₦{ngnEquiv}</span>
                </p>
              )}
            </div>


            {/* ── Recipients Row ─────────────────────── */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
                Recipients
              </p>

              {recipLoading ? (
                // Loading skeleton while fetching from Busha
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Loader2 size={16} className="animate-spin" /> Loading recipients…
                </div>
              ) : (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {/* Add New button — opens AddRecipientModal → POST /api/recipients */}
                  <button
                    id="add-recipient-btn"
                    onClick={() => setAddModal(true)}
                    className="flex flex-col items-center gap-1.5 flex-shrink-0"
                  >
                    <div className="w-11 h-11 rounded-full bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/25 hover:bg-emerald-400 transition-colors">
                      <Plus size={20} className="text-white" />
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">New</span>
                  </button>

                  {/* Recipient avatars loaded from Busha */}
                  {recipients.map((r) => (
                    <button
                      key={r.id}
                      id={`recipient-${r.id}`}
                      onClick={() => setSelectedId(r.id)}
                      className="flex flex-col items-center gap-1.5 flex-shrink-0"
                    >
                      <img
                        src={r.avatar}
                        alt={r.name}
                        className={`
                          w-11 h-11 rounded-full object-cover transition-all
                          ${selectedId === r.id
                            ? "ring-2 ring-emerald-500 ring-offset-2 ring-offset-[#1a2235]"
                            : "ring-1 ring-white/10 hover:ring-white/20"}
                        `}
                      />
                      <span className="text-[10px] text-slate-400 font-medium max-w-[44px] truncate">
                        {r.name}
                      </span>
                    </button>
                  ))}

                  {/* Empty state if no recipients yet */}
                  {recipients.length === 0 && (
                    <p className="text-xs text-slate-500">
                      No recipients yet. Add one above.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* ── Selected Bank Account ─────────────── */}
            {selectedRecipient && (
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.04] border border-white/[0.08] mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                    <Landmark size={18} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{selectedRecipient.bank}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      **** {selectedRecipient.accountNumber.slice(-4)} · {selectedRecipient.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setAddModal(true)}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Change
                </button>
              </div>
            )}

            {/* Available balance (live from Busha) */}
            <p className="text-xs text-center text-slate-500 font-medium mb-4">
              Available:{" "}
              {balanceLoading ? (
                <span className="text-slate-600">Loading…</span>
              ) : (
                <span className="text-white font-bold">
                  ${availableUsdc.toFixed(2)}
                </span>
              )}{" "}
              {currency}
            </p>

            {/* Payout status message */}
            {payoutStatus !== "idle" && (
              <div className={`
                flex items-start gap-2 p-3 rounded-xl mb-4 text-xs font-medium
                ${payoutStatus === "success"
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                  : "bg-rose-500/10 border border-rose-500/20 text-rose-400"}
              `}>
                {payoutStatus === "success"
                  ? <CheckCircle2 size={15} className="flex-shrink-0 mt-0.5" />
                  : <AlertCircle  size={15} className="flex-shrink-0 mt-0.5" />}
                {payoutMessage}
              </div>
            )}

            {/* ── Withdraw CTA ──────────────────────── */}
            <button
              id="withdraw-btn"
              onClick={handleWithdraw}
              disabled={payoutStatus === "loading"}
              className="
                w-full flex items-center justify-center gap-2.5
                py-4 rounded-xl
                bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600
                text-white font-bold text-base
                shadow-xl shadow-emerald-500/20 transition-all active:scale-[0.99]
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {payoutStatus === "loading" ? (
                <><Loader2 size={20} className="animate-spin" /> Processing…</>
              ) : (
                <><ArrowDownToLine size={20} /> Withdraw {amount ? `$${amount}` : ""}</>
              )}
            </button>

          </div>
        </div>
      </main>

      <MobileNav />

      {/* Add Recipient Modal — calls POST /api/recipients on submit */}
      {isAddModalOpen && (
        <AddRecipientModal
          onClose={() => setAddModal(false)}
          onAdd={handleAddRecipient}
        />
      )}
    </div>
  );
}
