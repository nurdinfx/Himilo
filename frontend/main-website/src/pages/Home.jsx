import { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, CalendarDays } from 'lucide-react';
import HotelCard from '../components/HotelCard';

const Home = () => {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/hotels');
        setHotels(data);
      } catch (error) {
        console.error('Failed to fetch hotels', error);
      }
    };
    fetchHotels();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-900">
        <img 
          src="/hero-bg.png" 
          alt="Luxury Hotel" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 drop-shadow-lg">
            Extraordinary <span className="text-accent italic">Stays</span>
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto font-light drop-shadow-md">
            Discover a collection of world-class properties redefined by luxury and comfort.
          </p>

          {/* Search Bar */}
          <div className="mt-12 max-w-4xl mx-auto bg-white rounded-full shadow-2xl p-2 flex flex-col md:flex-row items-center gap-2">
            <div className="flex-1 flex items-center px-6 py-3 w-full border-b md:border-b-0 md:border-r border-slate-200">
              <Search className="w-5 h-5 text-slate-400 mr-3" />
              <input 
                type="text" 
                placeholder="Where are you going?" 
                className="w-full focus:outline-none text-slate-900 placeholder:text-slate-500 bg-transparent font-medium"
              />
            </div>
            <div className="flex-1 flex items-center px-6 py-3 w-full">
              <CalendarDays className="w-5 h-5 text-slate-400 mr-3" />
              <input 
                type="text" 
                placeholder="Check-in / Check-out" 
                className="w-full focus:outline-none text-slate-900 placeholder:text-slate-500 bg-transparent font-medium"
              />
            </div>
            <button className="w-full md:w-auto bg-accent hover:bg-accent-light text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg active:scale-95">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Hotel Listings */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Our Property</h2>
            <p className="text-slate-500 mt-2">Welcome to Himilo Hotel.</p>
          </div>
        </div>
        
        {hotels.length === 0 ? (
          <div className="text-center py-20 bg-slate-100 rounded-3xl border border-slate-200">
            <p className="text-slate-500 font-medium">No hotels available right now. Please run the seed script!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.map(hotel => (
              <HotelCard key={hotel._id} hotel={hotel} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
