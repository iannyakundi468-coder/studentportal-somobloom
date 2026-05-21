import { useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import SomoBloomLogo from '../components/SomoBloomLogo';

export default function LoginPage() {
  const { login } = useStudent();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;
    setError('');
    setIsLoggingIn(true);
    setTimeout(() => {
      login({ email: formData.email });
      navigate('/student');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden text-slate-900">
      
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 w-full max-w-md">
        
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="inline-flex items-center justify-center p-3 bg-white border border-slate-200 rounded-3xl shadow-xl mb-6 shadow-indigo-500/10 rotate-3">
            <SomoBloomLogo size={64} showText={false} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-2 tracking-tight">
            SomoBloom <span className="text-blue-600">Portal</span>
          </h1>
          <p className="text-slate-500 text-sm">Student Learning Platform</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
              <p className="text-slate-500 text-sm">Sign in to your student account</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Mail size={14} /> Email or Phone Number
                </label>
                <input
                  required
                  type="text"
                  value={formData.email}
                  onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                  placeholder="Email or Phone Number"
                  className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Lock size={14} /> Password
                </label>
                <input
                  required
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-slate-600 font-medium">Remember me</span>
              </label>
              <button type="button" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                Forgot password?
              </button>
            </div>

            <button disabled={isLoggingIn} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all disabled:opacity-60">
              {isLoggingIn ? 'Signing in...' : <>Sign In <ArrowRight size={20} /></>}
            </button>
            
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              <div className="flex items-center gap-1"><ShieldCheck size={12} /> Secure Access</div>
              <div className="flex items-center gap-1"><Clock size={12} /> System v4.0.2</div>
            </div>
          </form>
        </div>
        
        <p className="text-center text-slate-400 text-xs mt-8">
          SomoBloom School Management System • {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
