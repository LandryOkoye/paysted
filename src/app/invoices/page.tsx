"use client";

import { useState, useEffect } from "react";
import Sidebar   from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import { Plus, Search, MoreVertical, ArrowLeft, Loader2, ExternalLink, Copy, Check } from "lucide-react";
import Link      from "next/link";
import { useRouter } from "next/navigation";
import type { BushaPaymentLink } from "@/lib/busha.types";

// ─── Status mapping ────────────────────────────────────────────────────────────
// Maps Busha's link status values to display labels and styles
const STATUS_STYLES: Record<string, string> = {
  active:  "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  pending: "bg-amber-500/10  text-amber-400   border-amber-500/20",
  expired: "bg-rose-500/10   text-rose-400    border-rose-500/20",
  draft:   "bg-white/[0.06]  text-slate-400   border-white/[0.10]",
  deleted: "bg-white/[0.06]  text-slate-500   border-white/[0.10]",
};

const STATUS_LABELS: Record<string, string> = {
  active:  "Active",
  pending: "Pending",
  expired: "Expired",
  draft:   "Draft",
  deleted: "Deleted",
};

// ─── Helper: format date ──────────────────────────────────────────────────────
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day:   "numeric",
    year:  "numeric",
  });
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function InvoicesPage() {
  const router = useRouter();

  // Payment links fetched from GET /api/invoices → Busha GET /v1/payments/links
  const [invoices,  setInvoices]  = useState<BushaPaymentLink[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [fetchErr,  setFetchErr]  = useState<string | null>(null);

  // Search/filter state (client-side filtering over the fetched list)
  const [search,    setSearch]    = useState("");

  // Copy-link state: stores the ID of the link currently being copied
  const [copiedId,  setCopiedId]  = useState<string | null>(null);

  // ── Fetch payment links on mount ────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/invoices")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          // `data.invoices` is an array of BushaPaymentLink objects
          setInvoices(data.invoices ?? []);
        } else {
          setFetchErr(data.error ?? "Failed to load payment links");
        }
      })
      .catch(() => setFetchErr("Network error — could not reach the server"))
      .finally(() => setLoading(false));
  }, []);

  // ── Copy a payment link URL to clipboard ────────────────────────────────────
  const handleCopy = (linkId: string, linkUrl: string) => {
    navigator.clipboard.writeText(linkUrl).catch(() => {});
    setCopiedId(linkId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // ── Client-side filter by name, title, or id ────────────────────────────────
  const filtered = invoices.filter((inv) => {
    const q = search.toLowerCase();
    return (
      inv.name.toLowerCase().includes(q)  ||
      inv.title.toLowerCase().includes(q) ||
      inv.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex min-h-screen bg-[#0D1117] pb-20 md:pb-0">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-4 md:p-6 lg:p-8 w-full">
        <div className="max-w-5xl mx-auto pt-2 md:pt-4">

          {/* Mobile logo */}
          <img
            src="/PayStepLogo-removebg.png"
            alt="Paysted"
            className="h-7 w-auto md:hidden object-contain mb-5 brightness-0 invert"
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
                <h1 className="text-2xl font-bold text-white">Payment Links</h1>
                <p className="text-sm text-slate-500 mt-0.5 hidden sm:block">
                  Manage and track all your Busha payment links.
                </p>
              </div>
            </div>

            {/* Create new link → navigates to /generate-link form */}
            <Link
              href="/generate-link"
              id="create-invoice-btn"
              className="
                flex items-center gap-2 px-4 py-2.5 rounded-xl
                bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600
                text-white text-sm font-bold
                shadow-lg shadow-emerald-500/20 transition-all
              "
            >
              <Plus size={16} /> Create Link
            </Link>
          </header>

          {/* ── Table Card ──────────────────────────────── */}
          <div className="rounded-2xl bg-[#1a2235] border border-white/[0.06] overflow-hidden">

            {/* Search toolbar */}
            <div className="flex items-center gap-3 p-4 border-b border-white/[0.06] flex-col sm:flex-row">
              <div className="relative w-full sm:max-w-xs">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="invoice-search"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, title, or ID..."
                  className="
                    w-full pl-9 pr-4 py-2.5 rounded-xl text-sm
                    bg-white/[0.04] border border-white/[0.08]
                    text-white placeholder-slate-600
                    focus:outline-none focus:border-emerald-500/50
                    transition-all
                  "
                />
              </div>

              {/* Live count label */}
              {!loading && !fetchErr && (
                <span className="text-xs text-slate-500 font-medium ml-auto whitespace-nowrap">
                  {filtered.length} link{filtered.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {/* ── Loading state ─────────────────────────── */}
            {loading && (
              <div className="flex items-center justify-center gap-3 py-16 text-slate-500">
                <Loader2 size={20} className="animate-spin" />
                <span className="text-sm">Loading payment links from Busha…</span>
              </div>
            )}

            {/* ── Error state ───────────────────────────── */}
            {!loading && fetchErr && (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 px-4 py-3 rounded-xl">
                  {fetchErr}
                </p>
                <button
                  onClick={() => { setLoading(true); setFetchErr(null); }}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  Retry
                </button>
              </div>
            )}

            {/* ── Empty state ───────────────────────────── */}
            {!loading && !fetchErr && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <p className="text-sm text-slate-500">
                  {search ? "No links match your search." : "No payment links yet."}
                </p>
                {!search && (
                  <Link
                    href="/generate-link"
                    className="
                      flex items-center gap-2 px-4 py-2.5 rounded-xl
                      bg-emerald-500 hover:bg-emerald-400
                      text-white text-sm font-bold transition-all
                    "
                  >
                    <Plus size={15} /> Create your first link
                  </Link>
                )}
              </div>
            )}

            {/* ── Table ────────────────────────────────── */}
            {!loading && !fetchErr && filtered.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      {["Name / Title", "Link ID", "Amount", "Currency", "Status", "Created", ""].map((col) => (
                        <th
                          key={col}
                          className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {filtered.map((inv) => (
                      <tr
                        key={inv.id}
                        className="hover:bg-white/[0.02] transition-colors"
                      >
                        {/* Name + Title */}
                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-white truncate max-w-[160px]">
                            {inv.title}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[160px]">
                            {inv.name}
                          </p>
                        </td>

                        {/* Busha link ID */}
                        <td className="px-5 py-4 text-xs text-slate-400 font-mono">
                          {inv.id.slice(0, 18)}…
                        </td>

                        {/* Amount */}
                        <td className="px-5 py-4 text-sm font-bold text-white">
                          ${parseFloat(inv.target_amount || "0").toFixed(2)}
                        </td>

                        {/* Currency */}
                        <td className="px-5 py-4 text-sm text-slate-400 font-medium">
                          {inv.target_currency}
                        </td>

                        {/* Status badge */}
                        <td className="px-5 py-4">
                          <span className={`
                            px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg border
                            ${STATUS_STYLES[inv.status] ?? STATUS_STYLES.draft}
                          `}>
                            {STATUS_LABELS[inv.status] ?? inv.status}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-5 py-4 text-sm text-slate-400 font-medium">
                          {formatDate(inv.created_at)}
                        </td>

                        {/* Actions: copy + open */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* Copy the hosted payment link URL */}
                            <button
                              title="Copy payment link"
                              onClick={() => handleCopy(inv.id, inv.link)}
                              className="p-2 rounded-lg text-slate-600 hover:text-white hover:bg-white/[0.06] transition-all"
                            >
                              {copiedId === inv.id
                                ? <Check size={15} className="text-emerald-400" />
                                : <Copy size={15} />}
                            </button>

                            {/* Open the hosted Busha payment page */}
                            <a
                              href={inv.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Open payment page"
                              className="p-2 rounded-lg text-slate-600 hover:text-white hover:bg-white/[0.06] transition-all"
                            >
                              <ExternalLink size={15} />
                            </a>

                            <button className="p-2 rounded-lg text-slate-600 hover:text-white hover:bg-white/[0.06] transition-all">
                              <MoreVertical size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Footer count */}
            {!loading && !fetchErr && filtered.length > 0 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-white/[0.06]">
                <span className="text-sm text-slate-500 font-medium">
                  Showing {filtered.length} of {invoices.length} links
                </span>
              </div>
            )}

          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
