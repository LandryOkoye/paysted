"use client";

import { useState }   from "react";
import Sidebar         from "@/components/Sidebar";
import MobileNav       from "@/components/MobileNav";
import { Link2, Copy, Send, ArrowLeft, Check } from "lucide-react";
import { useRouter }   from "next/navigation";

// ─── Component ──────────────────────────────────────────────────────

export default function GenerateLinkPage() {
  const router = useRouter();

  // Form state
  const [clientName,   setClientName]   = useState("");
  const [amount,       setAmount]       = useState("");
  const [description,  setDescription]  = useState("");

  // UI state
  const [generated, setGenerated] = useState(false);
  const [copied,    setCopied]    = useState(false);

  const generatedLink = "https://pay.busha.io/charges/77255764";

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setGenerated(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleReset = () => {
    setGenerated(false);
    setCopied(false);
    setClientName("");
    setAmount("");
    setDescription("");
  };

  return (
    <div className="flex min-h-screen bg-[#0D1117] pb-20 md:pb-0">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <div className="max-w-lg w-full mx-auto">

          {/* ── Top Bar ────────────────────────────────── */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => router.back()}
              id="back-btn"
              className="p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-400 hover:text-white transition-all"
            >
              <ArrowLeft size={18} />
            </button>
            {/* Paysted logo — visible on mobile */}
            <img
              src="/PayStepLogo-removebg.png"
              alt="Paysted"
              className="h-7 w-auto md:hidden object-contain brightness-0 invert"
            />
            {/* Spacer so back button aligns left */}
            <div className="w-10 md:hidden" />
          </div>

          {/* ── Card ─────────────────────────────────── */}
          <div className="rounded-2xl bg-[#1a2235] border border-white/[0.06] p-6 sm:p-8 w-full">

            {/* Icon + titles */}
            <div className="flex flex-col items-center mb-7 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                <Link2 size={26} className="text-emerald-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">Create Payment Link</h1>
              <p className="text-sm text-slate-400 mt-1.5 max-w-sm">
                Generate a borderless invoice link to share with your global client.
              </p>
            </div>

            {/* ── Form (before generation) ─────────────── */}
            {!generated ? (
              <form onSubmit={handleGenerate} className="space-y-5">

                {/* Client Name */}
                <div>
                  <label
                    htmlFor="client-name"
                    className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2"
                  >
                    Client Name / Company
                  </label>
                  <input
                    id="client-name"
                    required
                    autoFocus
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className="
                      w-full px-4 py-3 rounded-xl text-sm text-white
                      bg-white/[0.04] border border-white/[0.08]
                      placeholder-slate-600
                      focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07]
                      transition-all
                    "
                  />
                </div>

                {/* Amount */}
                <div>
                  <label
                    htmlFor="invoice-amount"
                    className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2"
                  >
                    Amount (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">
                      $
                    </span>
                    <input
                      id="invoice-amount"
                      required
                      type="number"
                      min="1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="
                        w-full pl-8 pr-4 py-3 rounded-xl text-sm font-bold text-white
                        bg-white/[0.04] border border-white/[0.08]
                        placeholder-slate-600
                        focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07]
                        transition-all
                      "
                    />
                  </div>
                </div>

                {/* Description (optional) */}
                <div>
                  <label
                    htmlFor="invoice-desc"
                    className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2"
                  >
                    Description{" "}
                    <span className="text-slate-600 normal-case font-normal">(Optional)</span>
                  </label>
                  <input
                    id="invoice-desc"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. UI/UX Design — Q4 Sprint"
                    className="
                      w-full px-4 py-3 rounded-xl text-sm text-white
                      bg-white/[0.04] border border-white/[0.08]
                      placeholder-slate-600
                      focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07]
                      transition-all
                    "
                  />
                </div>

                {/* Submit */}
                <button
                  id="generate-link-btn"
                  type="submit"
                  className="
                    w-full py-4 mt-2 rounded-xl text-white font-bold text-base
                    bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600
                    shadow-xl shadow-emerald-500/20 transition-all active:scale-[0.99]
                  "
                >
                  Generate Secure Link
                </button>
              </form>

            ) : (
              // ── Success State ───────────────────────────
              <div>
                {/* Success badge */}
                <div className="flex items-center justify-center mb-5">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                    <Check size={22} className="text-emerald-400" />
                  </div>
                </div>
                <p className="text-center text-sm font-semibold text-emerald-400 mb-6">
                  Link generated successfully!
                </p>

                {/* Generated link row */}
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
                        p-2.5 rounded-xl transition-all border text-sm
                        ${copied
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          : "bg-white/[0.06] border-white/[0.10] text-slate-300 hover:bg-white/[0.10]"}
                      `}
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                {/* Action buttons */}
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
