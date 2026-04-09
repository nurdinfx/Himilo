import { MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const HotelCard = ({ hotel }) => {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800'} 
          alt={hotel.name} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200'; }}
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1 shadow-sm">
          <Star className="w-4 h-4 text-accent fill-accent" />
          <span className="text-sm font-semibold">4.9</span>
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center text-slate-500 text-sm mb-2 font-medium">
          <MapPin className="w-4 h-4 mr-1" />
          {hotel.location}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{hotel.name}</h3>
        <p className="text-slate-600 line-clamp-2 text-sm flex-1">{hotel.description}</p>
        
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Starting from</span>
            <div className="text-lg font-bold text-slate-900">$150<span className="text-sm font-normal text-slate-500">/night</span></div>
          </div>
          <Link 
            to={`/hotel/${hotel._id}`} 
            className="px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-full hover:bg-accent transition-colors shadow-sm cursor-pointer"
          >
            View Rooms
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
