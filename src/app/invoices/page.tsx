"use client";

import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import { Plus, Search, Filter, MoreVertical, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function InvoicesPage() {
  const router = useRouter();

  const invoices = [
    { id: 'INV-2023-001', client: 'Acme Corp', amount: '$1,250.00', status: 'Paid', date: 'Oct 24, 2023', avatar: 'https://i.pravatar.cc/150?img=11' },
    { id: 'INV-2023-002', client: 'Globex Inc', amount: '$3,400.00', status: 'Pending', date: 'Nov 02, 2023', avatar: 'https://i.pravatar.cc/150?img=12' },
    { id: 'INV-2023-003', client: 'Initech', amount: '$850.00', status: 'Overdue', date: 'Oct 15, 2023', avatar: 'https://i.pravatar.cc/150?img=15' },
    { id: 'INV-2023-004', client: 'Soylent', amount: '$2,100.00', status: 'Draft', date: 'Nov 05, 2023', avatar: 'https://i.pravatar.cc/150?img=5' },
    { id: 'INV-2023-005', client: 'Umbrella Corp', amount: '$4,500.00', status: 'Paid', date: 'Sep 30, 2023', avatar: 'https://i.pravatar.cc/150?img=9' },
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Paid': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Overdue': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Draft': return 'bg-slate-50 text-slate-700 border-slate-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] pb-20 md:pb-0">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8 lg:p-12 relative w-full">
        <div className="max-w-6xl mx-auto pt-4 md:pt-6">
          <img src="/PayStepLogo-removebg.png" alt="PaySted Logo" className="h-7 w-auto md:hidden object-contain mb-6" />
          <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.back()} 
                className="p-2.5 text-slate-500 hover:text-slate-800 bg-white rounded-xl shadow-sm border border-slate-100 transition-all active:scale-95 cursor-pointer md:hidden"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Invoices</h1>
                <p className="text-slate-500 mt-1 text-sm hidden sm:block">Manage, track, and create professional payment links.</p>
              </div>
            </div>
            <Link href="/generate-link" className="btn-3d-accent bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 active:shadow-inner text-white px-5 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all w-full sm:w-auto shadow-sm outline-none">
              <Plus size={18} />
              Create Invoice
            </Link>
          </header>

          <div className="card-3d bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm w-full mb-8">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
              <div className="relative w-full sm:max-w-xs">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Search client or ID..." className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white shadow-inner font-medium text-slate-800" />
              </div>
              <button className="btn-3d flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 active:bg-slate-100 active:shadow-inner border border-slate-200 transition-all w-full sm:w-auto justify-center bg-white shadow-sm cursor-pointer outline-none">
                <Filter size={16} /> Filters
              </button>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-white">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Client</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Invoice ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 bg-white">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer active:bg-slate-100">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={inv.avatar} alt={inv.client} className="w-8 h-8 rounded-full border border-slate-200 object-cover shadow-sm" />
                          <span className="font-bold text-slate-800 text-sm">{inv.client}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 font-semibold">{inv.id}</td>
                      <td className="px-6 py-4 text-sm text-slate-500 font-medium">{inv.date}</td>
                      <td className="px-6 py-4 text-sm font-extrabold text-slate-800">{inv.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg border ${getStatusColor(inv.status)}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:bg-slate-200 rounded-lg transition-colors cursor-pointer outline-none border border-transparent hover:border-slate-200 shadow-sm">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-white">
              <span className="font-medium">Showing 1 to 5 of 24 entries</span>
              <div className="flex items-center gap-2">
                <button className="px-4 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 active:bg-slate-100 transition-colors font-bold text-slate-600 bg-white cursor-pointer shadow-sm">Prev</button>
                <button className="px-4 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 active:bg-slate-100 transition-colors font-bold text-slate-600 bg-white cursor-pointer shadow-sm">Next</button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
