import { Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function InvoiceSummary() {
  const invoices = [
    { id: '#INV-001', client: 'Acme Corp', amount: '$1,250.00', status: 'paid', date: 'Oct 24' },
    { id: '#INV-002', client: 'Globex Inc', amount: '$3,400.00', status: 'pending', date: 'Nov 02' },
    { id: '#INV-003', client: 'Initech', amount: '$850.00', status: 'overdue', date: 'Oct 15' },
    { id: '#INV-004', client: 'Soylent', amount: '$2,100.00', status: 'pending', date: 'Nov 05' },
  ];

  return (
    <div className="mb-8 w-full">
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="text-lg font-bold text-slate-800">Recent Invoices</h3>
        <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">View All</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {invoices.map((inv) => (
          <div key={inv.id} className="card-3d p-5 flex flex-col justify-between hover:border-slate-200 transition-colors cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-slate-400">{inv.id}</span>
              {inv.status === 'paid' && <CheckCircle2 size={16} className="text-emerald-500" />}
              {inv.status === 'pending' && <Clock size={16} className="text-amber-500" />}
              {inv.status === 'overdue' && <XCircle size={16} className="text-rose-500" />}
            </div>
            
            <div>
              <p className="text-sm font-semibold text-slate-800">{inv.client}</p>
              <div className="flex justify-between items-end mt-1">
                <p className="text-lg font-bold text-slate-700">{inv.amount}</p>
                <p className="text-xs text-slate-400 font-medium">{inv.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
