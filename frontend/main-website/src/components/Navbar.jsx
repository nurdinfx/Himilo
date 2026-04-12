import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, UserCircle2, Menu, X } from 'lucide-react';
import InstallPWA from './InstallPWA';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary text-white p-2 rounded-lg">
              <Building2 className="h-6 w-6" />
            </div>
            <span className="font-bold text-xl md:text-2xl tracking-tight text-slate-900">
              Himilo<span className="text-accent">Hotel</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <InstallPWA />
            <Link to="/" className="text-slate-600 hover:text-accent font-medium transition-colors">Find Hotels</Link>
            <Link to="/login" className="flex items-center space-x-2 bg-primary hover:bg-primary-light text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-md active:scale-95 text-sm lg:text-base">
              <UserCircle2 className="h-5 w-5" />
              <span>Sign In</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link 
              to="/" 
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
            >
              Find Hotels
            </Link>
            <div className="px-4 py-2">
               <InstallPWA />
            </div>
            <Link 
              to="/login" 
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center space-x-2 w-full bg-primary text-white px-4 py-3.5 rounded-xl font-bold shadow-sm"
            >
              <UserCircle2 className="h-5 w-5" />
              <span>Sign In</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
