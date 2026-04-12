import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, X, BedDouble, ChevronDown, Edit } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const getToken = () => { const i = localStorage.getItem('adminInfo'); return i ? JSON.parse(i).token : ''; };
const auth = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

const ROOM_TYPES = ['single', 'double', 'suite', 'shared'];

const RoomModal = ({ hotels, onClose, onSaved, initialData }) => {
  const [form, setForm] = useState({ 
    hotelId: initialData?.hotelId?._id || initialData?.hotelId || hotels[0]?._id || '', 
    type: initialData?.type || 'single', 
    price: initialData?.price || '', 
    capacity: initialData?.capacity || '',
    image: initialData?.image || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const base64Str = canvas.toDataURL('image/jpeg', 0.7);
          setForm({ ...form, image: base64Str });
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      if (initialData) {
        await axios.put(`${API}/rooms/${initialData._id}`, form, auth());
      } else {
        await axios.post(`${API}/rooms`, { ...form, hotelId: hotels[0]?._id }, auth());
      }
      onSaved();
    } catch (err) { setError(err.response?.data?.message || 'Failed to save room'); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">{initialData ? 'Edit Room' : 'Add New Room'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
        </div>
        {error && <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Room Type</label>
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white capitalize">
              {ROOM_TYPES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Price / Night ($)</label>
              <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required min="1"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="150" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Capacity</label>
              <input type="number" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} required min="1"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="2" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Room Image (Upload File)</label>
            <input type="file" accept="image/*" onChange={handleImageUpload}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white" />
            {form.image && <p className="text-xs text-green-600 mt-2 font-medium">Image optimized and attached successfully!</p>}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-60">
              {loading ? 'Saving...' : (initialData ? 'Save Changes' : 'Add Room')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const BedModal = ({ rooms, onClose, onSaved }) => {
  const [roomId, setRoomId] = useState('');
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const promises = Array.from({ length: Number(count) }, () =>
        axios.post(`${API}/beds`, { roomId, status: 'available' }, auth())
      );
      await Promise.all(promises);
      onSaved();
    } catch (err) { alert('Failed to add beds'); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Add Beds to Room</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Room</label>
            <select value={roomId} onChange={e => setRoomId(e.target.value)} required
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white capitalize">
              <option value="">Select room...</option>
              {rooms.map(r => <option key={r._id} value={r._id}>{r.hotelId?.name} — {r.type} (${r.price}/night)</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Number of Beds to Add</label>
            <input type="number" value={count} onChange={e => setCount(e.target.value)} min="1" max="20" required
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-60">
              {loading ? 'Adding...' : 'Add Beds'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const statusBadge = (status) => {
  const cls = status === 'available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${cls}`}>{status}</span>;
};

const Rooms = () => {
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showBedModal, setShowBedModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [expandedRoom, setExpandedRoom] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [hotelsRes, roomsRes, bedsRes] = await Promise.all([
        axios.get(`${API}/hotels`),
        axios.get(`${API}/rooms`),
        axios.get(`${API}/beds`),
      ]);
      setHotels(hotelsRes.data);
      setRooms(roomsRes.data);
      setBeds(bedsRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleDeleteRoom = async (id) => {
    if (!confirm('Delete this room and all its beds?')) return;
    try { await axios.delete(`${API}/rooms/${id}`, auth()); fetchAll(); }
    catch (err) { alert('Failed to delete room'); }
  };

  const handleDeleteBed = async (id) => {
    if (!confirm('Delete this bed?')) return;
    try { await axios.delete(`${API}/beds/${id}`, auth()); fetchAll(); }
    catch (err) { alert('Failed to delete bed'); }
  };

  const handleToggleBedStatus = async (bed) => {
    const newStatus = bed.status === 'available' ? 'booked' : 'available';
    try { await axios.put(`${API}/beds/${bed._id}`, { status: newStatus }, auth()); fetchAll(); }
    catch (err) { alert('Failed to update bed status'); }
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setShowRoomModal(true);
  };

  const getBedsForRoom = (roomId) => beds.filter(b => b.roomId?._id === roomId || b.roomId === roomId);

  return (
    <div className="max-w-7xl mx-auto">
      {showRoomModal && <RoomModal hotels={hotels} initialData={editingRoom} onClose={() => { setShowRoomModal(false); setEditingRoom(null); }} onSaved={() => { setShowRoomModal(false); setEditingRoom(null); fetchAll(); }} />}
      {showBedModal && <BedModal rooms={rooms} onClose={() => setShowBedModal(false)} onSaved={() => { setShowBedModal(false); fetchAll(); }} />}

      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">Rooms & Beds</h1>
          <p className="text-sm text-slate-500 mt-1">Manage rooms and individual beds across all properties</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button onClick={() => setShowBedModal(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2.5 border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-xl transition-colors text-xs md:text-sm">
            <Plus className="w-4 h-4" /> Add Beds
          </button>
          <button onClick={() => { setEditingRoom(null); setShowRoomModal(true); }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm text-xs md:text-sm">
            <Plus className="w-4 h-4" /> Add Room
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400 font-medium">Loading rooms...</div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <BedDouble className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">No rooms found. Add a room to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rooms.map(room => {
            const roomBeds = getBedsForRoom(room._id);
            const isExpanded = expandedRoom === room._id;
            return (
              <div key={room._id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-50 rounded-xl md:rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100 flex-shrink-0">
                      {room.image ? (
                        <img src={room.image} alt={room.type} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                      ) : null}
                      <BedDouble className={`w-5 h-5 md:w-6 md:h-6 text-blue-500 ${room.image ? 'hidden' : ''}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-900 capitalize truncate">{room.type} Room</h3>
                        <span className="text-[10px] md:text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">Cap: {room.capacity}</span>
                      </div>
                      <p className="text-xs md:text-sm text-slate-500 mt-0.5 truncate">{room.hotelId?.name || 'Unknown Hotel'}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-3 md:gap-4 md:ml-auto pt-4 md:pt-0 border-t border-slate-50 md:border-none">
                    <div className="text-left md:text-right mr-2 flex-grow md:flex-grow-0">
                      <p className="text-lg md:text-xl font-bold text-slate-900">${room.price}<span className="text-xs md:text-sm font-normal text-slate-400">/night</span></p>
                      <p className="text-[10px] md:text-xs text-slate-500">{roomBeds.length} beds · {roomBeds.filter(b => b.status === 'available').length} free</p>
                    </div>
                    
                    <div className="flex gap-1 md:gap-2">
                      <button onClick={() => setExpandedRoom(isExpanded ? null : room._id)}
                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors outline-none border border-slate-100 md:border-none" title="View Beds">
                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                      
                      <button onClick={() => handleEditRoom(room)}
                        className="p-2 hover:bg-slate-100 hover:text-blue-600 text-slate-400 rounded-xl transition-colors outline-none border border-slate-100 md:border-none" title="Edit Room">
                        <Edit className="w-4 h-4" />
                      </button>

                      <button onClick={() => handleDeleteRoom(room._id)}
                        className="p-2 hover:bg-red-50 hover:text-red-600 text-slate-400 rounded-xl transition-colors outline-none border border-slate-100 md:border-none" title="Delete Room">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>


                {isExpanded && (
                  <div className="border-t border-slate-100 p-6 bg-slate-50/50">
                    <h4 className="text-sm font-semibold text-slate-700 mb-4">Beds in this Room</h4>
                    {roomBeds.length === 0 ? (
                      <p className="text-sm text-slate-400 italic">No beds added yet. Use the "Add Beds" button above.</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {roomBeds.map((bed, idx) => (
                          <div key={bed._id} className="bg-white border border-slate-200 rounded-2xl p-3 text-center shadow-sm group relative">
                            <BedDouble className={`w-6 h-6 mx-auto mb-2 ${bed.status === 'available' ? 'text-green-500' : 'text-red-400'}`} />
                            <p className="text-xs font-bold text-slate-800">Bed {idx + 1}</p>
                            <button onClick={() => handleToggleBedStatus(bed)}
                              className="mt-2 w-full">{statusBadge(bed.status)}</button>
                            <button onClick={() => handleDeleteBed(bed._id)}
                              className="absolute top-2 right-2 text-red-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 rounded-full p-1">
                                <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Rooms;
