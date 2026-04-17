import { Link as LinkIcon, ArrowDownToLine } from "lucide-react";
import Link from "next/link";

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3 mb-6">

      <Link
        href="/generate-link"
        id="quick-action-generate-link"
        className="
          flex items-center justify-center gap-2.5
          py-3.5 px-5 rounded-2xl
          bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600
          text-white text-sm font-bold
          shadow-lg shadow-emerald-500/20
          transition-all active:scale-[0.98]
        "
      >
        <LinkIcon size={16} />
        Generate Link
      </Link>

      <Link
        href="/payouts"
        id="quick-action-instant-payout"
        className="
          flex items-center justify-center gap-2.5
          py-3.5 px-5 rounded-2xl
          bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600
          text-white text-sm font-bold
          shadow-lg shadow-emerald-500/20
          transition-all active:scale-[0.98]
        "
      >
        <ArrowDownToLine size={16} />
        Instant Payout
      </Link>

    </div>
  );
}
