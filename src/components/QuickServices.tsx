import { Smartphone, Wifi, Zap, Tv, Droplets, Car, Users, Plane } from 'lucide-react';

export default function QuickServices() {
  const services = [
    { name: 'Top up', icon: Smartphone, color: 'text-indigo-500' },
    { name: 'Internet', icon: Wifi, color: 'text-blue-500' },
    { name: 'Electricity', icon: Zap, color: 'text-yellow-500' },
    { name: 'Cable', icon: Tv, color: 'text-purple-500' },
    { name: 'Water', icon: Droplets, color: 'text-cyan-500' },
    { name: 'Transport', icon: Car, color: 'text-rose-500' },
    { name: 'Events', icon: Users, color: 'text-emerald-500' },
    { name: 'Flight', icon: Plane, color: 'text-sky-500' },
  ];

  return (
    <div className="mb-8">
      <h3 className="text-base font-bold text-slate-800 mb-4">Quick Services</h3>
      <div className="card-3d p-4 w-full">
        <div className="grid grid-cols-4 gap-y-6 gap-x-2">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div key={service.name} className="flex flex-col items-center justify-center gap-2 cursor-pointer group">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:shadow-3d-soft group-hover:bg-white transition-all">
                  <Icon size={20} className={service.color} />
                </div>
                <span className="text-xs font-medium text-slate-500 group-hover:text-slate-800 transition-colors">
                  {service.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
