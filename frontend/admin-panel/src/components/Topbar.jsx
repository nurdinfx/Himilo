import { Bell, Search } from 'lucide-react';

const Topbar = () => {
  return (
    <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search bookings, customers, rooms..." 
            className="w-full bg-slate-100/50 border border-slate-200 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent transition-all"
          />
        </div>
      </div>

      <div className="flex items-center space-x-6 ml-4">
        <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>
        
        <div className="flex items-center space-x-3 border-l border-slate-200 pl-6">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-slate-900 leading-none">Admin User</p>
            <p className="text-xs text-slate-500 mt-1">Super Admin</p>
          </div>
          <div className="w-10 h-10 bg-admin-accent text-white rounded-full flex items-center justify-center font-bold shadow-md">
            A
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
