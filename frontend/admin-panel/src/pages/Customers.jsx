import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Users, Phone, Mail, CalendarCheck } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const getToken = () => { const i = localStorage.getItem('adminInfo'); return i ? JSON.parse(i).token : ''; };
const auth = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

const statusBadge = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    'checked-in': 'bg-blue-100 text-blue-700',
    'checked-out': 'bg-slate-100 text-slate-600',
    cancelled: 'bg-red-100 text-red-700',
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${colors[status] || 'bg-slate-100 text-slate-600'}`}>{status}</span>;
};

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCustomers = async (keyword = '') => {
    setLoading(true);
    try {
      const url = keyword ? `${API}/customers?keyword=${keyword}` : `${API}/customers`;
      const { data } = await axios.get(url, auth());
      setCustomers(data);
    } catch (err) {
      console.error('Failed to fetch customers. Make sure you are logged in as admin/staff.', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    const debounce = setTimeout(() => fetchCustomers(val), 400);
    return () => clearTimeout(debounce);
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Customers Directory</h1>
        <p className="text-slate-500 mt-1">Browse all guest contact info and booking history</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={handleSearch}
            placeholder="Search by phone number or email..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
        <div className="text-sm text-slate-500 flex items-center px-2 font-medium">{customers.length} records</div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400 font-medium">Loading customers...</div>
      ) : customers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">No customer records found.</p>
          <p className="text-slate-400 text-sm mt-1">Customer data is created when a booking is placed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {customers.map(c => (
            <div key={c._id} className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6 hover:shadow-md transition-all group">
              <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-100">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-md text-white font-bold text-lg">
                  {c.fullName?.charAt(0)?.toUpperCase() || 'G'}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-tight">{c.fullName}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Customer</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <span className="text-slate-600 font-medium">{c.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <span className="text-slate-600 truncate">{c.email}</span>
                </div>
              </div>

              {c.bookingId && (
                <div className="mt-5 pt-5 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <CalendarCheck className="w-3.5 h-3.5" /> Booking Info
                  </p>
                  <div className="bg-slate-50 rounded-2xl p-3 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Status</span>
                      {statusBadge(c.bookingId?.status)}
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Check-In</span>
                      <span className="font-medium text-slate-700">{fmt(c.bookingId?.checkInDate)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Check-Out</span>
                      <span className="font-medium text-slate-700">{fmt(c.bookingId?.checkOutDate)}</span>
                    </div>
                    <div className="pt-1">
                      <span className="text-xs text-slate-400 font-mono">ID: {c.bookingId?._id?.slice(-8) || '—'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Customers;
