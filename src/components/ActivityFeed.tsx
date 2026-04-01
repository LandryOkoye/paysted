import { FileText, ArrowDownRight, ArrowUpRight } from 'lucide-react';

export default function ActivityFeed() {
  const activities = [
    {
      id: 1,
      title: 'Invoice Paid',
      client: 'Acme Corp',
      amount: '+$1,250.00',
      type: 'inflow',
      date: 'Today, 2:30 PM',
      icon: FileText
    },
    {
      id: 2,
      title: 'Naira Withdrawal Successful',
      client: 'GTBank (**** 1234)',
      amount: '-₦50,000.00',
      type: 'outflow',
      date: 'Yesterday, 10:15 AM',
      icon: ArrowUpRight
    },
    {
      id: 3,
      title: 'Invoice Paid',
      client: 'Globex Inc',
      amount: '+$800.00',
      type: 'inflow',
      date: 'Mar 15, 4:00 PM',
      icon: ArrowDownRight
    }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 mb-8">
      <h3 className="text-lg font-bold text-slate-800 mb-6 px-2">Recent Activity</h3>
      
      <div className="card-3d overflow-hidden">
        <div className="divide-y divide-slate-50">
          {activities.map((activity) => {
            const Icon = activity.icon;
            const isInflow = activity.type === 'inflow';
            
            return (
              <div key={activity.id} className="p-6 flex items-center gap-5 hover:bg-[#F8F9FA]/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-white shadow-3d-soft flex items-center justify-center border border-slate-100 flex-shrink-0">
                  <Icon size={20} className={isInflow ? 'text-emerald-500' : 'text-slate-500'} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{activity.title}</p>
                  <p className="text-xs text-slate-400 mt-1 truncate">{activity.client}</p>
                </div>
                
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-bold ${isInflow ? 'text-emerald-600' : 'text-slate-800'}`}>
                    {activity.amount}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{activity.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
