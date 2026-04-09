import { useState } from 'react';
import axios from 'axios';
import { UserCircle2, KeyRound, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API}/auth/register`, { name, email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register account');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-20">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
          <p className="text-slate-500">Join Himilo Hotel to book your stay</p>
        </div>

        {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center">
                {error}
            </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
            <div className="relative">
              <UserCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                placeholder="John Doe"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                placeholder="••••••••"
                required
                minLength="6"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary-light text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-95"
          >
            Create Account
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          Already have an account? <span onClick={() => navigate('/login')} className="text-accent font-semibold hover:underline cursor-pointer">Sign in</span>
        </div>
      </div>
    </div>
  );
};

export default Register;
