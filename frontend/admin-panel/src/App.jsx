import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Dashboard from './pages/Dashboard'
import Hotels from './pages/Hotels'
import Rooms from './pages/Rooms'
import Bookings from './pages/Bookings'
import Customers from './pages/Customers'
import AdminLogin from './pages/AdminLogin'

function App() {
  const [adminInfo, setAdminInfo] = useState(() => {
    const saved = localStorage.getItem('adminInfo');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (info) => setAdminInfo(info);

  const handleLogout = () => {
    localStorage.removeItem('adminInfo');
    setAdminInfo(null);
  };

  if (!adminInfo) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800 selection:bg-blue-500 selection:text-white">
      <Sidebar onLogout={handleLogout} adminInfo={adminInfo} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar adminInfo={adminInfo} />
        <main className="flex-1 p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
