import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building2, Bed, CalendarCheck, Users, LogOut } from 'lucide-react';

const Sidebar = ({ onLogout, adminInfo }) => {
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Rooms & Beds', path: '/rooms', icon: Bed },
    { name: 'Bookings', path: '/bookings', icon: CalendarCheck },
    { name: 'Customers', path: '/customers', icon: Users },
  ];

  return (
    <aside className="w-64 bg-admin-dark text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-700 shadow-xl">
      <div className="h-20 flex items-center px-6 border-b border-slate-700/50 bg-slate-900/50">
        <div className="flex items-center space-x-2 text-white">
          <Building2 className="w-8 h-8 text-admin-accent" />
          <span className="text-xl font-bold tracking-wide">Himilo Admin</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Main Menu</p>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-admin-accent/10 text-admin-accent font-medium shadow-inner' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-admin-accent' : 'text-slate-400'}`} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-700/50">
        <button onClick={onLogout} className="flex items-center space-x-3 w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
