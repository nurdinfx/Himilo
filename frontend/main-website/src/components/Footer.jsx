const Footer = () => {
  return (
    <footer className="bg-primary text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold tracking-tight text-white mb-4">
              Himilo<span className="text-accent">Hotel</span>
            </h3>
            <p className="max-w-xs text-sm leading-relaxed">
              Experience the pinnacle of luxury, comfort, and seamless bookings with Himilo Group. Your journey begins here.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Explorations</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Our Properties</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Offers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Dining</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Booking Policies</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-12 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Himilo Hotel Management System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
