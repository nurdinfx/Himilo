import { useState, useEffect } from 'react';
import axios from 'axios';
import { CalendarCheck, Search, ChevronDown, User, Phone, Mail, BedDouble, Building2 } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const getToken = () => { const i = localStorage.getItem('adminInfo'); return i ? JSON.parse(i).token : ''; };
const auth = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

const STATUS_OPTIONS = ['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'];

const statusBadge = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    'checked-in': 'bg-blue-100 text-blue-700',
    'checked-out': 'bg-slate-100 text-slate-600',
    cancelled: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${colors[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  );
};

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/bookings`, auth());
      setBookings(data);
    } catch (err) {
      console.error('Failed to fetch bookings. Make sure you are logged in as admin/staff.', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    try {
      await axios.put(`${API}/bookings/${bookingId}/status`, { status: newStatus }, auth());
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: newStatus } : b));
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = bookings.filter(b => {
    const nameMatch = b.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.userId?.email?.toLowerCase().includes(search.toLowerCase()) ||
      b.hotelId?.name?.toLowerCase().includes(search.toLowerCase());
    const statusMatch = !filterStatus || b.status === filterStatus;
    return nameMatch && statusMatch;
  });

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Bookings Management</h1>
        <p className="text-slate-500 mt-1">View and manage all guest reservations</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by guest name, email or hotel..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 capitalize">
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
        <div className="text-sm text-slate-500 flex items-center px-2 font-medium">
          {filtered.length} bookings
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400 font-medium">Loading bookings...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <CalendarCheck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">No bookings found. Try different filters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Guest</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Hotel / Room</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Check-In</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Check-Out</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                  <th className="px-6 py-4 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => (
                  <>
                    <tr key={b._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 text-sm">{b.userId?.name || 'Guest'}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{b.userId?.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-slate-800">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" /> {b.hotelId?.name || '—'}
                        </div>
                        {b.roomId && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                            <BedDouble className="w-3 h-3" /> {b.roomId?.type} room
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{fmt(b.checkInDate)}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{fmt(b.checkOutDate)}</td>
                      <td className="px-6 py-4">{statusBadge(b.status)}</td>
                      <td className="px-6 py-4">
                        <select
                          value={b.status}
                          onChange={e => handleStatusChange(b._id, e.target.value)}
                          disabled={updatingId === b._id}
                          className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 capitalize disabled:opacity-50 cursor-pointer"
                        >
                          {STATUS_OPTIONS.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => setExpandedId(expandedId === b._id ? null : b._id)}
                          className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedId === b._id ? 'rotate-180' : ''}`} />
                        </button>
                      </td>
                    </tr>
                    {expandedId === b._id && (
                      <tr key={`${b._id}-expanded`} className="bg-blue-50/30 border-b border-slate-100">
                        <td colSpan={7} className="px-6 py-5">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-100">
                              <User className="w-4 h-4 text-blue-500 mt-0.5" />
                              <div>
                                <p className="text-xs font-medium text-slate-500">Full Name</p>
                                <p className="text-sm font-semibold text-slate-900 mt-0.5">{b.userId?.name || '—'}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-100">
                              <Mail className="w-4 h-4 text-blue-500 mt-0.5" />
                              <div>
                                <p className="text-xs font-medium text-slate-500">Email Address</p>
                                <p className="text-sm font-semibold text-slate-900 mt-0.5">{b.userId?.email || '—'}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-100">
                              <BedDouble className="w-4 h-4 text-blue-500 mt-0.5" />
                              <div>
                                <p className="text-xs font-medium text-slate-500">Booking ID</p>
                                <p className="text-xs font-mono text-slate-700 mt-0.5">{b._id}</p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
