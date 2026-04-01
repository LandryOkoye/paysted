import { Plus } from 'lucide-react';

export default function LastRecipients() {
  const recipients = [
    { name: 'Edward', image: 'https://i.pravatar.cc/150?img=11' },
    { name: 'Murphy', image: 'https://i.pravatar.cc/150?img=12' },
    { name: 'Darwinz', image: 'https://i.pravatar.cc/150?img=15' },
    { name: 'Kathryn', image: 'https://i.pravatar.cc/150?img=5' },
    { name: 'Anne', image: 'https://i.pravatar.cc/150?img=9' },
  ];

  return (
    <div className="mb-8 w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-bold text-slate-800">Last Recipients</h3>
        <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">See More</button>
      </div>

      <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
        <div className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group">
          <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center group-hover:bg-emerald-100 transition-colors shadow-sm">
            <Plus className="text-emerald-600" size={24} />
          </div>
          <span className="text-xs font-semibold text-slate-800">New</span>
        </div>

        {recipients.map((user) => (
          <div key={user.name} className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-transparent group-hover:border-emerald-400 p-[2px] transition-all">
              <img src={user.image} alt={user.name} className="w-full h-full object-cover rounded-full shadow-sm" />
            </div>
            <span className="text-xs font-medium text-slate-500 group-hover:text-slate-800">{user.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
