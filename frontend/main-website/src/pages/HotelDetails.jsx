import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, CheckCircle2, BedDouble, X, CalendarDays, User, Mail, Phone } from 'lucide-react';


const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const BookingModal = ({ room, hotel, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    checkInDate: '',
    checkOutDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto calculate total
  const checkIn = new Date(form.checkInDate);
  const checkOut = new Date(form.checkOutDate);
  let days = 0;
  if (checkIn && checkOut && checkOut > checkIn) {
    const diffTime = Math.abs(checkOut - checkIn);
    days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  const totalAmount = days > 0 ? (room.price * days) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (days <= 0) {
      setError('Please select a valid date range.');
      return;
    }
    setLoading(true); setError('');
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      await axios.post(`${API}/bookings`, {
        hotelId: hotel._id,
        roomId: room._id,
        checkInDate: form.checkInDate,
        checkOutDate: form.checkOutDate,
        customerInfo: {
          fullName: form.fullName,
          email: form.email,
          phoneNumber: form.phone,
        }
      }, config);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-20">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">Complete Your Booking</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">{room.type.charAt(0).toUpperCase() + room.type.slice(1)} Room at {hotel.name}</p>
          </div>
          <button onClick={onClose} className="p-2 sm:p-3 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-medium text-sm flex items-center gap-2"><X className="w-4 h-4 shrink-0"/> {error}</div>}
          
          <form id="booking-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Check-in Date</label>
                <div className="relative">
                  <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="date" required value={form.checkInDate} onChange={e => setForm({...form, checkInDate: e.target.value})}
                    className="w-full border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-slate-700 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 transition-all font-medium" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Check-out Date</label>
                <div className="relative">
                  <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="date" required value={form.checkOutDate} onChange={e => setForm({...form, checkOutDate: e.target.value})} min={form.checkInDate}
                    className="w-full border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-slate-700 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 transition-all font-medium" />
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="text" required placeholder="John Doe" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})}
                    className="w-full border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-slate-700 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 transition-all font-medium" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="email" required placeholder="john@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                      className="w-full border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-slate-700 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 transition-all font-medium" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="tel" required placeholder="+1 (555) 000-0000" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                      className="w-full border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-slate-700 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 transition-all font-medium" />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="p-5 sm:p-6 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-0 z-20">
          <div className="text-center sm:text-left">
            <p className="text-[10px] sm:text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Amount</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">${totalAmount} <span className="text-xs sm:text-sm font-medium text-slate-500 lowercase">for {days} nights</span></p>
          </div>
          <button type="submit" form="booking-form" disabled={loading}
            className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-colors shadow-xl disabled:opacity-50">
            {loading ? 'Confirming...' : 'Confirm Booking'}
          </button>
        </div>
      </div>
    </div>
  );
};

const SuccessModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-[2rem] shadow-2xl p-10 max-w-sm w-full text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10 text-green-500" />
      </div>
      <h2 className="text-3xl font-bold text-slate-900 mb-3">Booking Confirmed!</h2>
      <p className="text-slate-500 font-medium mb-8 leading-relaxed">Your reservation has been successfully placed. We look forward to hosting you soon.</p>
      <button onClick={onClose} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors shadow-lg">
        Return to Home
      </button>
    </div>
  </div>
);

const HotelDetails = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [bookingRoom, setBookingRoom] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleBookClick = (room) => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      navigate(`/login?redirect=/hotel/${id}`);
      return;
    }
    setBookingRoom(room);
  };

  useEffect(() => {
    const fetchHotelAndRooms = async () => {
      try {
        const { data: hotelData } = await axios.get(`${API}/hotels/${id}`);
        setHotel(hotelData);
        
        const { data: roomsData } = await axios.get(`${API}/rooms?hotelId=${id}`);
        setRooms(roomsData);
      } catch (error) {
        console.error('Error fetching details', error);
      }
    };
    fetchHotelAndRooms();
  }, [id]);

  if (!hotel) return <div className="min-h-screen pt-32 pb-20 flex justify-center items-center font-bold text-slate-500">Loading properties...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-24">
      {bookingRoom && <BookingModal room={bookingRoom} hotel={hotel} onClose={() => setBookingRoom(null)} onSuccess={() => { setBookingRoom(null); setShowSuccess(true); }} />}
      {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}

      {/* Hotel Hero */}
      <div className="relative pt-20 h-[60vh] bg-slate-900">
        <img 
          src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80'} 
          alt={hotel.name}
          className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200'; }}
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent pt-32 pb-8 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight leading-tight">{hotel.name}</h1>
            <div className="flex items-center text-slate-300 font-semibold text-sm sm:text-base bg-white/10 backdrop-blur-md w-fit px-4 py-2 rounded-full border border-white/20">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-accent" />
              {hotel.location}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-6 lg:px-8 mt-12 grid grid-cols-1 xl:grid-cols-3 gap-12 items-start">
        {/* Info Column */}
        <div className="xl:col-span-2 space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">About this property</h2>
            <p className="text-lg text-slate-600 leading-relaxed font-medium">{hotel.description}</p>
          </section>
          
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-8">Available Rooms</h3>
            <div className="space-y-6">
              {rooms.length === 0 ? (
                 <div className="p-10 border border-dashed border-slate-300 rounded-3xl text-center">
                   <BedDouble className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                   <p className="text-slate-500 font-medium text-lg">No rooms available for this property right now.</p>
                 </div>
              ) : (
                  rooms.map(room => (
                  <div key={room._id} className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row gap-8 group">
                      <div className="bg-slate-100 rounded-[1.5rem] h-48 md:h-auto w-full md:w-64 flex items-center justify-center overflow-hidden border border-slate-100 shrink-0">
                          {room.image ? (
                             <img src={room.image} alt={`${room.type} room`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                          ) : null}
                          <BedDouble className={`w-12 h-12 text-slate-300 ${room.image ? 'hidden' : ''}`} />
                      </div>
                      <div className="flex-1 flex flex-col pt-2">
                          <div className="flex justify-between items-start mb-6">
                              <div>
                                  <h4 className="text-2xl font-bold text-slate-900 capitalize mb-2 tracking-tight">{room.type} Room</h4>
                                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-semibold">
                                    <User className="w-4 h-4 mr-1.5 text-slate-400" /> Up to {room.capacity} Guests
                                  </span>
                              </div>
                              <div className="text-right">
                                  <p className="text-3xl font-extrabold text-slate-900">${room.price}</p>
                                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Per Night</p>
                              </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 flex-1 content-start mb-8">
                              <div className="flex items-center text-sm font-semibold text-slate-600 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100"><CheckCircle2 className="w-4 h-4 text-green-500 mr-2 shrink-0" /> Free Cancellation</div>
                              <div className="flex items-center text-sm font-semibold text-slate-600 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100"><CheckCircle2 className="w-4 h-4 text-green-500 mr-2 shrink-0" /> Breakfast Included</div>
                              <div className="flex items-center text-sm font-semibold text-slate-600 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100"><CheckCircle2 className="w-4 h-4 text-green-500 mr-2 shrink-0" /> Fast Wi-Fi</div>
                              <div className="flex items-center text-sm font-semibold text-slate-600 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100"><CheckCircle2 className="w-4 h-4 text-green-500 mr-2 shrink-0" /> Room Service</div>
                          </div>

                          <div className="mt-auto">
                              <button onClick={() => handleBookClick(room)} className="w-full md:w-auto px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl active:scale-95">
                                  Select & Book Room
                              </button>
                          </div>
                      </div>
                  </div>
                  ))
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-1">
          <div className="bg-white border text-center border-slate-200 rounded-[2rem] p-8 sticky top-32 shadow-xl shadow-slate-200/50">
             <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="w-8 h-8 text-blue-500" />
             </div>
             <h3 className="text-2xl font-bold text-slate-900 mb-4">Dedicated Support</h3>
             <p className="text-[15px] font-medium text-slate-500 mb-8 leading-relaxed">Our internationally awarded concierge team is standing by 24/7 to assist with your reservation requests.</p>
             <button className="w-full px-6 py-4 border-2 border-slate-900 text-slate-900 font-bold rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                 +1 (800) HIMILO
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;
