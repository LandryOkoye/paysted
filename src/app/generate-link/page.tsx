"use client";

import { useState }  from "react";
import Sidebar        from "@/components/Sidebar";
import MobileNav      from "@/components/MobileNav";
import { Link2, Copy, Send, ArrowLeft, Check, ChevronDown, Loader2 } from "lucide-react";
import { useRouter }  from "next/navigation";

// ─── Only stablecoins — USDC and USDT ────────────────────────────────────────
const CURRENCIES = ["USDC", "USDT"];

// ─── Shared styles ────────────────────────────────────────────────────────────
const INPUT_CLS = `
  w-full px-4 py-3 rounded-xl text-sm text-white
  bg-white/[0.04] border border-white/[0.08]
  placeholder-slate-600
  focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07]
  transition-all
`;
const LABEL_CLS = "block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2";

// ─── Reusable toggle button ───────────────────────────────────────────────────
function ToggleButton({
  id, active, onLabel, offLabel, onClick,
}: {
  id: string;
  active: boolean;
  onLabel: string;
  offLabel: string;
  onClick: () => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
      <button
        type="button"
        id={`${id}-on`}
        onClick={() => { if (!active) onClick(); }}
        className={`
          py-2.5 rounded-lg text-xs font-bold transition-all
          ${active
            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
            : "text-slate-400 hover:text-white"}
        `}
      >
        {onLabel}
      </button>
      <button
        type="button"
        id={`${id}-off`}
        onClick={() => { if (active) onClick(); }}
        className={`
          py-2.5 rounded-lg text-xs font-bold transition-all
          ${!active
            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
            : "text-slate-400 hover:text-white"}
        `}
      >
        {offLabel}
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function GenerateLinkPage() {
  const router = useRouter();

  // ── Form state — maps 1-to-1 to Busha required fields ────────────────────
  // `name`           — REQUIRED: internal label in Busha dashboard
  const [name,        setName]        = useState("");
  // `title`          — REQUIRED: title shown to the payer on the payment page
  const [title,       setTitle]       = useState("");
  // `description`    — REQUIRED: description shown to the payer
  const [description, setDescription] = useState("");
  // `target_currency`— REQUIRED: stablecoin to receive (USDC or USDT)
  const [currency,    setCurrency]    = useState("USDC");
  // `target_amount`  — Required because fixed is always true
  const [amount,      setAmount]      = useState("");
  // `fixed`          — REQUIRED: locks the amount so payer can't change it
  const [fixed,       setFixed]       = useState(true);
  // `one_time`       — REQUIRED: if true the link expires after one payment
  const [oneTime,     setOneTime]     = useState(false);

  // ── UI state ─────────────────────────────────────────────────────────────
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState<string | null>(null);
  const [generated,     setGenerated]     = useState(false);
  const [copied,        setCopied]        = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");

  // ── Submit — calls /api/invoices which calls Busha POST /v1/payments/links
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/invoices", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          title,
          description,
          currency,        // → target_currency
          amount,          // → target_amount
          fixed,           // → fixed
          oneTime,         // → one_time
          type: "payment_link",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? "Failed to generate link");

      setGeneratedLink(data.url);
      setGenerated(true);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleReset = () => {
    setGenerated(false);
    setCopied(false);
    setName("");
    setTitle("");
    setDescription("");
    setCurrency("USDC");
    setAmount("");
    setFixed(true);
    setOneTime(false);
    setError(null);
  };

  return (
    <div className="flex min-h-screen bg-[#0D1117] pb-20 md:pb-0">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-4 md:p-6 lg:p-8 flex items-start justify-center">
        <div className="max-w-lg w-full mx-auto py-4">

          {/* ── Top Bar ──────────────────────────────────── */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => router.back()}
              id="back-btn"
              className="p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-400 hover:text-white transition-all"
            >
              <ArrowLeft size={18} />
            </button>
            <img
              src="/PayStepLogo-removebg.png"
              alt="Paysted"
              className="h-7 w-auto md:hidden object-contain brightness-0 invert"
            />
            <div className="w-10 md:hidden" />
          </div>

          {/* ── Card ─────────────────────────────────────── */}
          <div className="rounded-2xl bg-[#1a2235] border border-white/[0.06] p-6 sm:p-8 w-full">

            {/* Icon + title */}
            <div className="flex flex-col items-center mb-7 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                <Link2 size={26} className="text-emerald-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">Create Payment Link</h1>
              <p className="text-sm text-slate-400 mt-1.5 max-w-sm">
                Generate a borderless payment link to share with your global client.
              </p>
            </div>

            {/* ── Form ─────────────────────────────────────── */}
            {!generated ? (
              <form onSubmit={handleGenerate} className="space-y-5">

                {/* Link Name — maps to Busha `name` (internal dashboard label) */}
                <div>
                  <label htmlFor="link-name" className={LABEL_CLS}>
                    Link Name <span className="text-emerald-500">*</span>
                  </label>
                  <input
                    id="link-name"
                    required
                    autoFocus
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Q4 Design Sprint"
                    className={INPUT_CLS}
                  />
                  <p className="text-[11px] text-slate-600 mt-1">
                    Internal label — visible only in your Busha dashboard.
                  </p>
                </div>

                {/* Title — maps to Busha `title` (shown to payer on the payment page) */}
                <div>
                  <label htmlFor="link-title" className={LABEL_CLS}>
                    Title <span className="text-emerald-500">*</span>
                  </label>
                  <input
                    id="link-title"
                    required
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. UI/UX Consulting — March 2026"
                    className={INPUT_CLS}
                  />
                  <p className="text-[11px] text-slate-600 mt-1">
                    Shown to your client on the Busha payment page.
                  </p>
                </div>

                {/* Description — maps to Busha `description` (shown to payer) */}
                <div>
                  <label htmlFor="link-description" className={LABEL_CLS}>
                    Description <span className="text-emerald-500">*</span>
                  </label>
                  <textarea
                    id="link-description"
                    required
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Payment for design services rendered in Q4"
                    className={`${INPUT_CLS} resize-none`}
                  />
                </div>

                {/* Amount + Currency — maps to `target_amount` and `target_currency` */}
                <div>
                  <label htmlFor="invoice-amount" className={LABEL_CLS}>
                    Amount &amp; Currency <span className="text-emerald-500">*</span>
                  </label>
                  <div className="flex gap-2">

                    {/* Amount */}
                    <div className="relative flex-1">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">
                        $
                      </span>
                      <input
                        id="invoice-amount"
                        required
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className={`${INPUT_CLS} pl-8`}
                      />
                    </div>

                    {/* Currency — USDC or USDT only */}
                    <div className="relative">
                      <select
                        id="currency-select"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className={`${INPUT_CLS} pr-8 appearance-none cursor-pointer min-w-[90px]`}
                      >
                        {CURRENCIES.map((c) => (
                          <option key={c} value={c} className="bg-[#1a2235]">
                            {c}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Fixed amount toggle — maps to Busha `fixed` (required boolean) */}
                <div>
                  <p className={LABEL_CLS}>
                    Fixed Amount <span className="text-emerald-500">*</span>
                  </p>
                  <ToggleButton
                    id="fixed"
                    active={fixed}
                    onLabel="Yes — Lock amount"
                    offLabel="No — Payer sets it"
                    onClick={() => setFixed((v) => !v)}
                  />
                  <p className="text-[11px] text-slate-600 mt-1.5">
                    {fixed
                      ? "The payer must pay exactly the amount you entered."
                      : "The payer can enter any amount on the payment page."}
                  </p>
                </div>

                {/* One-time toggle — maps to Busha `one_time` (required boolean) */}
                <div>
                  <p className={LABEL_CLS}>
                    Single Use <span className="text-emerald-500">*</span>
                  </p>
                  <ToggleButton
                    id="one-time"
                    active={oneTime}
                    onLabel="Yes — Expires after 1 payment"
                    offLabel="No — Reusable link"
                    onClick={() => setOneTime((v) => !v)}
                  />
                  <p className="text-[11px] text-slate-600 mt-1.5">
                    {oneTime
                      ? "The link will deactivate once it has been paid once."
                      : "The link stays active and can be paid multiple times."}
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
                    {error}
                  </p>
                )}

                {/* Submit */}
                <button
                  id="generate-link-btn"
                  type="submit"
                  disabled={loading}
                  className="
                    w-full py-4 mt-2 rounded-xl text-white font-bold text-base
                    bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600
                    shadow-xl shadow-emerald-500/20 transition-all active:scale-[0.99]
                    disabled:opacity-60 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2
                  "
                >
                  {loading ? (
                    <><Loader2 size={18} className="animate-spin" /> Generating…</>
                  ) : (
                    "Generate Secure Link"
                  )}
                </button>
              </form>

            ) : (
              /* ── Success State ──────────────────────────── */
              <div>
                <div className="flex items-center justify-center mb-5">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                    <Check size={22} className="text-emerald-400" />
                  </div>
                </div>
                <p className="text-center text-sm font-semibold text-emerald-400 mb-6">
                  Link generated successfully!
                </p>

                {/* Generated link */}
                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08] mb-5">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Your Payment Link
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      readOnly
                      value={generatedLink}
                      id="generated-link-input"
                      className="flex-1 bg-transparent text-sm text-slate-300 font-medium focus:outline-none truncate"
                    />
                    <button
                      id="copy-link-btn"
                      onClick={handleCopy}
                      className={`
                        p-2.5 rounded-xl transition-all border
                        ${copied
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          : "bg-white/[0.06] border-white/[0.10] text-slate-300 hover:bg-white/[0.10]"}
                      `}
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    id="create-another-btn"
                    onClick={handleReset}
                    className="
                      flex-1 py-3.5 rounded-xl text-sm font-bold
                      bg-white/[0.05] border border-white/[0.08] text-slate-300
                      hover:bg-white/[0.09] transition-all
                    "
                  >
                    Create Another
                  </button>
                  <button
                    id="send-email-btn"
                    className="
                      flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl
                      text-sm font-bold text-white
                      bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600
                      shadow-lg shadow-emerald-500/20 transition-all
                    "
                  >
                    <Send size={15} /> Send via Email
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
