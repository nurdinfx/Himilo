import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2, X, ImagePlus, Building2 } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => {
  const info = localStorage.getItem('adminInfo');
  return info ? JSON.parse(info).token : '';
};

const authHeader = () => ({
  headers: { Authorization: `Bearer ${getToken()}` }
});

const HotelModal = ({ hotel, onClose, onSaved }) => {
  const [form, setForm] = useState({
    name: hotel?.name || '',
    location: hotel?.location || '',
    description: hotel?.description || '',
    images: hotel?.images?.join(', ') || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const currentImages = form.images ? form.images.split(',').map(s => s.trim()).filter(Boolean) : [];
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200; // Hotels need slightly better quality
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const base64Str = canvas.toDataURL('image/jpeg', 0.8);
          
          setForm(prev => ({
            ...prev,
            images: prev.images ? `${prev.images}, ${base64Str}` : base64Str
          }));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        name: form.name,
        location: form.location,
        description: form.description,
        images: form.images.split(',').map(s => s.trim()).filter(Boolean),
      };
      if (hotel) {
        await axios.put(`${API}/hotels/${hotel._id}`, payload, authHeader());
      } else {
        await axios.post(`${API}/hotels`, payload, authHeader());
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">{hotel ? 'Edit Hotel' : 'Add New Hotel'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        {error && <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Hotel Name</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="e.g. Himilo Grand Hotel" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
            <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} required
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="e.g. Mogadishu, Somalia" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} required rows={3}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
              placeholder="Describe the hotel..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Hotel Images (Upload Files)</label>
            <div className="relative">
              <input type="file" multiple accept="image/*" onChange={handleImageUpload}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white" />
            </div>
            {form.images && (
              <div className="mt-3 flex flex-wrap gap-2">
                {form.images.split(',').filter(Boolean).map((img, idx) => (
                  <div key={idx} className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200">
                    <img src={img.trim()} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => {
                        const imgs = form.images.split(',').map(s => s.trim()).filter(Boolean);
                        imgs.splice(idx, 1);
                        setForm({...form, images: imgs.join(', ')});
                      }}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-bl-lg p-0.5 hover:bg-red-600 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-60">
              {loading ? 'Saving...' : hotel ? 'Save Changes' : 'Add Hotel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editHotel, setEditHotel] = useState(null);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/hotels`);
      setHotels(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHotels(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this hotel? This will also remove all rooms and beds.')) return;
    try {
      await axios.delete(`${API}/hotels/${id}`, authHeader());
      fetchHotels();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete hotel');
    }
  };

  const handleEdit = (hotel) => {
    setEditHotel(hotel);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditHotel(null);
  };

  const handleSaved = () => {
    handleModalClose();
    fetchHotels();
  };

  return (
    <div className="max-w-7xl mx-auto">
      {(showModal) && (
        <HotelModal hotel={editHotel} onClose={handleModalClose} onSaved={handleSaved} />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">Hotels Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage all your hotel properties</p>
        </div>
        <button
          onClick={() => { setEditHotel(null); setShowModal(true); }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" /> Add Hotel
        </button>
      </div>


      {loading ? (
        <div className="text-center py-20 text-slate-400 font-medium">Loading hotels...</div>
      ) : hotels.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">No hotels found. Add your first property!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map(hotel => (
            <div key={hotel._id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
              <div className="h-48 overflow-hidden bg-slate-100 relative">
                {hotel.images?.[0] ? (
                  <img src={hotel.images[0]} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                ) : null}
                <div className={`flex items-center justify-center h-full ${hotel.images?.[0] ? 'hidden' : ''}`}>
                  <Building2 className="w-12 h-12 text-slate-300" />
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-slate-900 mb-1">{hotel.name}</h3>
                <p className="text-sm text-slate-500 mb-3">{hotel.location}</p>
                <p className="text-sm text-slate-600 line-clamp-2 mb-4">{hotel.description}</p>
                <div className="flex gap-2 pt-3 border-t border-slate-100">
                  <button onClick={() => handleEdit(hotel)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 rounded-xl text-sm font-medium transition-colors">
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                  <button onClick={() => handleDelete(hotel._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 hover:bg-red-50 hover:text-red-600 border border-slate-200 rounded-xl text-sm font-medium transition-colors">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Hotels;
