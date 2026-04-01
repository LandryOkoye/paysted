import Sidebar from '@/components/Sidebar';
import VaultCard from '@/components/VaultCard';
import QuickActions from '@/components/QuickAction';
import InvoiceSummary from '@/components/InvoiceSummary';
import ActivityFeed from '@/components/ActivityFeed';
import MobileNav from '@/components/MobileNav';
import { Bell, Gift } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-[#F8F9FA] pb-20 md:pb-0">
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 lg:p-12 relative">
        <div className="max-w-[1400px] mx-auto pt-4 md:pt-6">
          
          {/* Mobile Logo */}
          <img src="/PayStepLogo-removebg.png" alt="PaySted Logo" className="h-8 w-auto md:hidden object-contain mb-6 px-1" />

          {/* Header */}
          <header className="mb-10 flex justify-between items-center bg-white card-3d px-6 py-4 rounded-3xl">
            <div className="flex items-center gap-4">
              <img 
                src="https://i.pravatar.cc/150?img=68" 
                alt="Profile" 
                className="w-12 h-12 rounded-full border border-slate-200 shadow-sm"
              />
              <div>
                <p className="text-xs text-slate-500 font-medium tracking-wide pb-0.5">GOOD MORNING</p>
                <h2 className="text-xl font-bold tracking-tight text-slate-800">Tola Designer</h2>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white shadow-3d-soft border border-slate-100 flex items-center justify-center cursor-pointer text-slate-600 hover:bg-slate-50 transition relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-emerald-500 border border-white"></span>
              </div>
            </div>
          </header>

          {/* Desktop Grid Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            
            {/* Left Column (Primary Actions) */}
            <div className="xl:col-span-7 flex flex-col gap-2">
              <VaultCard />
              <QuickActions />
              <InvoiceSummary />
            </div>

            {/* Right Column (Activity Feed) */}
            <div className="xl:col-span-5 flex flex-col">
              <ActivityFeed />
            </div>

          </div>

        </div>
      </main>

      <MobileNav />
    </div>
  );
}
