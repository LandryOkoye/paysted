"use client";

import Sidebar   from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import { Plus, Search, Filter, MoreVertical, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ─── Types ─────────────────────────────────────────────────────────

type InvoiceStatus = "Paid" | "Pending" | "Overdue" | "Draft";

interface Invoice {
  id: string;
  client: string;
  amount: string;
  status: InvoiceStatus;
  date: string;
  avatar: string;
}

// ─── Mock Data ──────────────────────────────────────────────────────

const INVOICES: Invoice[] = [
  { id: "INV-2023-001", client: "Acme Corp",     amount: "$1,250.00", status: "Paid",    date: "Oct 24, 2023", avatar: "https://i.pravatar.cc/150?img=11" },
  { id: "INV-2023-002", client: "Globex Inc",    amount: "$3,400.00", status: "Pending", date: "Nov 02, 2023", avatar: "https://i.pravatar.cc/150?img=12" },
  { id: "INV-2023-003", client: "Initech",       amount: "$850.00",   status: "Overdue", date: "Oct 15, 2023", avatar: "https://i.pravatar.cc/150?img=15" },
  { id: "INV-2023-004", client: "Soylent",       amount: "$2,100.00", status: "Draft",   date: "Nov 05, 2023", avatar: "https://i.pravatar.cc/150?img=5"  },
  { id: "INV-2023-005", client: "Umbrella Corp", amount: "$4,500.00", status: "Paid",    date: "Sep 30, 2023", avatar: "https://i.pravatar.cc/150?img=9"  },
];

// Status colour config
const STATUS_STYLES: Record<InvoiceStatus, string> = {
  Paid:    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Pending: "bg-amber-500/10  text-amber-400   border-amber-500/20",
  Overdue: "bg-rose-500/10   text-rose-400    border-rose-500/20",
  Draft:   "bg-white/[0.06]  text-slate-400   border-white/[0.10]",
};

// ─── Component ──────────────────────────────────────────────────────

export default function InvoicesPage() {
  const router = useRouter();

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
                <h1 className="text-2xl font-bold text-white">Invoices</h1>
                <p className="text-sm text-slate-500 mt-0.5 hidden sm:block">
                  Manage, track, and create professional payment links.
                </p>
              </div>
            </div>

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
              <Plus size={16} /> Create Invoice
            </Link>
          </header>

          {/* ── Table Card ──────────────────────────────── */}
          <div className="rounded-2xl bg-[#1a2235] border border-white/[0.06] overflow-hidden">

            {/* Search + Filter toolbar */}
            <div className="flex items-center gap-3 p-4 border-b border-white/[0.06] flex-col sm:flex-row">
              <div className="relative w-full sm:max-w-xs">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="invoice-search"
                  type="text"
                  placeholder="Search client or ID..."
                  className="
                    w-full pl-9 pr-4 py-2.5 rounded-xl text-sm
                    bg-white/[0.04] border border-white/[0.08]
                    text-white placeholder-slate-600
                    focus:outline-none focus:border-emerald-500/50
                    transition-all
                  "
                />
              </div>
              <button
                id="invoice-filter-btn"
                className="
                  flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                  bg-white/[0.04] border border-white/[0.08] text-slate-300
                  hover:bg-white/[0.08] transition-all w-full sm:w-auto justify-center
                "
              >
                <Filter size={15} /> Filters
              </button>
            </div>

            {/* Table — scrollable on small screens */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[680px]">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {["Client", "Invoice ID", "Amount", "Status", "Date", ""].map((col) => (
                      <th key={col} className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {INVOICES.map((inv) => (
                    <tr
                      key={inv.id}
                      className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                    >
                      {/* Client */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={inv.avatar}
                            alt={inv.client}
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10"
                          />
                          <span className="text-sm font-semibold text-white">{inv.client}</span>
                        </div>
                      </td>

                      {/* Invoice ID */}
                      <td className="px-5 py-4 text-sm text-slate-400 font-medium">{inv.id}</td>

                      {/* Amount */}
                      <td className="px-5 py-4 text-sm font-bold text-white">{inv.amount}</td>

                      {/* Status badge */}
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg border ${STATUS_STYLES[inv.status]}`}>
                          {inv.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-sm text-slate-400 font-medium">{inv.date}</td>

                      {/* Action menu */}
                      <td className="px-5 py-4 text-right">
                        <button className="p-2 rounded-lg text-slate-600 hover:text-white hover:bg-white/[0.06] transition-all">
                          <MoreVertical size={17} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-4 border-t border-white/[0.06]">
              <span className="text-sm text-slate-500 font-medium">Showing 1–5 of 24 entries</span>
              <div className="flex items-center gap-2">
                <button className="px-4 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm font-semibold text-slate-400 hover:bg-white/[0.08] transition-all">
                  Prev
                </button>
                <button className="px-4 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm font-semibold text-slate-400 hover:bg-white/[0.08] transition-all">
                  Next
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>

      <MobileNav />
    </div>
  );
}
