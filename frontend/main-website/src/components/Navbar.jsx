import { Link } from 'react-router-dom';
import { Building2, UserCircle2 } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary text-white p-2 rounded-lg">
              <Building2 className="h-6 w-6" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-slate-900">
              Himilo<span className="text-accent">Hotel</span>
            </span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-slate-600 hover:text-accent font-medium transition-colors">Find Hotels</Link>
            <Link to="/login" className="flex items-center space-x-2 bg-primary hover:bg-primary-light text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-sm">
              <UserCircle2 className="h-5 w-5" />
              <span>Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
