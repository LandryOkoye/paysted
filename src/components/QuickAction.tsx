import { Link as LinkIcon, ArrowDownToLine, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

export default function QuickActions() {
  return (
    <div className="card-3d bg-white w-full mb-8 flex items-center p-2">
      
      <Link href="/generate-link" className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 px-2 rounded-2xl text-slate-700 font-bold hover:bg-slate-50 transition-all group active:scale-[0.98] outline-none">
        <div className="bg-[#F8F9FA] p-2.5 sm:p-2.5 rounded-full shadow-inner group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-slate-100 transition-all">
          <LinkIcon size={18} className="text-slate-600" />
        </div>
        <span className="text-[11px] sm:text-sm tracking-wide">Generate Link</span>
      </Link>

      <div className="w-px h-12 bg-slate-100 mx-1"></div>

      <Link href="/payouts" className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 px-2 rounded-2xl text-emerald-700 font-bold hover:bg-emerald-50 transition-all group active:scale-[0.98] outline-none">
        <div className="bg-emerald-100 p-2.5 sm:p-2.5 rounded-full shadow-inner group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-emerald-100 transition-all">
          <ArrowDownToLine size={18} className="text-emerald-600" />
        </div>
        <span className="text-[11px] sm:text-sm tracking-wide">Instant Payout</span>
      </Link>

      <div className="w-px h-12 bg-slate-100 mx-1"></div>

      <Link href="/more" className="flex-none px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 rounded-2xl text-slate-500 hover:bg-slate-50 transition-all group active:scale-[0.98] outline-none">
        <div className="bg-[#F8F9FA] p-2.5 sm:p-2.5 rounded-full shadow-inner group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-slate-100 transition-all">
          <MoreHorizontal size={18} className="text-slate-600" />
        </div>
        <span className="text-[11px] sm:text-sm tracking-wide font-bold hidden sm:block">More</span>
      </Link>
      
    </div>
  );
}
