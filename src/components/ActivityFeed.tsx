import { ArrowDownLeft, ArrowUpRight, RefreshCcw } from "lucide-react";

// Activity types: inflow | outflow | rule
type ActivityType = "inflow" | "outflow" | "rule";

interface Activity {
  id: number;
  title: string;
  amount: string;
  status: string;
  time: string;
  type: ActivityType;
}

const ACTIVITIES: Activity[] = [
  {
    id: 1,
    title: "Receive USDC from Acme Corp",
    amount: "+$1,250.00",
    status: "Completed",
    time: "13 hours ago",
    type: "inflow",
  },
  {
    id: 2,
    title: "Instant Payout to GTBank",
    amount: "-₦50,000.00",
    status: "Completed",
    time: "5 minutes ago",
    type: "outflow",
  },
  {
    id: 3,
    title: "Vault Rule Executed",
    amount: "+$850.00",
    status: "Completed",
    time: "10 hours ago",
    type: "rule",
  },
];

// Colour config per activity type
const TYPE_CONFIG: Record<ActivityType, { bg: string; text: string; Icon: typeof ArrowDownLeft }> = {
  inflow:  { bg: "bg-emerald-500/10", text: "text-emerald-400", Icon: ArrowDownLeft  },
  outflow: { bg: "bg-slate-500/10",   text: "text-slate-400",   Icon: ArrowUpRight   },
  rule:    { bg: "bg-blue-500/10",    text: "text-blue-400",    Icon: RefreshCcw     },
};

export default function ActivityFeed() {
  return (
    <div className="w-full mb-6">
      <h3 className="text-base font-bold text-white mb-4">Recent Activity</h3>

      <div className="rounded-2xl border border-white/[0.06] bg-[#1a2235] divide-y divide-white/[0.05] overflow-hidden">
        {ACTIVITIES.map((activity) => {
          const { bg, text, Icon } = TYPE_CONFIG[activity.type];
          const isPositive = activity.amount.startsWith("+");

          return (
            <div
              key={activity.id}
              className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors cursor-pointer"
            >
              {/* Icon bubble */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${bg} ${text}`}>
                <Icon size={18} />
              </div>

              {/* Title + time */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{activity.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{activity.time}</p>
              </div>

              {/* Amount + status */}
              <div className="text-right flex-shrink-0">
                <p className={`text-sm font-bold ${isPositive ? "text-emerald-400" : "text-slate-300"}`}>
                  {activity.amount}
                </p>
                <p className="text-[10px] font-bold text-emerald-400 mt-0.5 uppercase tracking-widest">
                  {activity.status}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
