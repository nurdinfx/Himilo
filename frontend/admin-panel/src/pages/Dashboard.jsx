import { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Users, CalendarCheck, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const StatCard = ({ title, value, icon: Icon, trend }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group hover:shadow-md transition-all">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
      <div className="mt-4 flex items-center text-sm">
        <span className={`font-semibold ${trend > 0 ? 'text-green-500' : 'text-slate-400'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
        <span className="text-slate-400 ml-2">from last month</span>
      </div>
    </div>
    <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-admin-accent/10 transition-colors">
      <Icon className="w-6 h-6 text-admin-accent" />
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeBookings: 0,
    totalCustomers: 0,
    occupancyRate: 0,
    recentBookings: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('adminInfo'))?.token;
        const { data } = await axios.get(`${API}/analytics/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(data);
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-slate-500">Loading Dashboard...</div>;
  }

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-sm text-slate-500 mt-1 hidden sm:block">Welcome back. Here is what has happened with your properties today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <StatCard title="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon={DollarSign} trend={8.5} />
        <StatCard title="Active Bookings" value={stats.activeBookings} icon={CalendarCheck} trend={4.2} />
        <StatCard title="Total Customers" value={stats.totalCustomers} icon={Users} trend={2.1} />
        <StatCard title="Occupancy Rate" value={`${stats.occupancyRate}%`} icon={TrendingUp} trend={stats.occupancyRate > 50 ? 5 : 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 bg-white p-4 md:p-8 rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900">Recent Bookings</h3>
              <Link to="/bookings" className="text-admin-accent text-sm font-semibold hover:underline">View All</Link>
           </div>
           
           <div className="overflow-x-auto -mx-4 md:mx-0">
             <table className="w-full text-left border-collapse min-w-[600px] md:min-w-0">
               <thead>
                 <tr className="border-b border-slate-100 text-sm font-medium text-slate-500">
                   <th className="pb-3 px-4 font-medium">Guest Name</th>
                   <th className="pb-3 px-4 font-medium">Room</th>
                   <th className="pb-3 px-4 font-medium hidden md:table-cell">Dates</th>
                   <th className="pb-3 px-4 font-medium text-right">Status</th>
                 </tr>
               </thead>
               <tbody className="text-sm">
                 {stats.recentBookings.length === 0 && (
                   <tr>
                     <td colSpan="4" className="py-8 text-center text-slate-500">No recent bookings found.</td>
                   </tr>
                 )}
                 {stats.recentBookings.map((booking) => (
                   <tr key={booking._id} className="border-b border-slate-50/50 hover:bg-slate-50/50 transition-colors">
                     <td className="py-4 px-4 font-medium text-slate-900">
                       <div className="flex flex-col">
                         <span className="truncate max-w-[120px] sm:max-w-none">{booking.customerInfo ? booking.customerInfo.fullName : booking.userId?.name || 'Guest'}</span>
                         <span className="text-[10px] text-slate-400 md:hidden">{formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}</span>
                       </div>
                     </td>
                     <td className="py-4 px-4 text-slate-500 capitalize">
                       {booking.roomId?.type || 'Standard'}
                     </td>
                     <td className="py-4 px-4 text-slate-500 hidden md:table-cell">
                       {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                     </td>
                     <td className="py-4 px-4 text-right">
                       <span className={`inline-flex items-center px-2 py-0.5 md:px-2.5 md:py-1 rounded-full text-[10px] md:text-xs font-medium ${  
                         booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                         booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                         booking.status === 'checked-in' ? 'bg-blue-100 text-blue-800' :
                         booking.status === 'checked-out' ? 'bg-purple-100 text-purple-800' :
                         'bg-red-100 text-red-800'
                       }`}>
                         {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                       </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
        
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm h-fit">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h3>
          <div className="flex flex-col gap-3">
             <Link to="/rooms" className="flex items-center justify-center sm:justify-start w-full px-4 py-3 bg-slate-50 hover:bg-admin-accent/10 hover:text-admin-accent rounded-xl font-medium transition-colors border border-slate-100 text-sm md:text-base">
                 + Register New Room
             </Link>
             <button className="flex items-center justify-center sm:justify-start w-full px-4 py-3 bg-slate-50 hover:bg-admin-accent/5 hover:text-admin-accent rounded-xl font-medium transition-colors border border-slate-100 text-slate-500 text-sm md:text-base">
                 Generate Reports (Soon)
             </button>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Dashboard;
