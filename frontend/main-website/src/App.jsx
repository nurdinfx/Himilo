import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import HotelDetails from './pages/HotelDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import ReloadPrompt from './components/ReloadPrompt'

function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-accent selection:text-white">
      <Navbar />
      
      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hotel/:id" element={<HotelDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>

      <Footer />
      <ReloadPrompt />
    </div>
  )
}

export default App
