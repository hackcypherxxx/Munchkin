import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import LogoImg from '../assets/LOGO1.png';

import { loginAdmin } from '../features/auth/authSlice';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { admin, token, loading, error } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ✅ REDIRECT AFTER LOGIN
  useEffect(() => {
    if (admin && token) {
      navigate('/admin-dashboard');
    }
  }, [admin, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await dispatch(
      loginAdmin({
        email,
        password,
      })
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-6 py-12 mt-4">
      
      {/* HEADER */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center mb-10"
      >
        <div className="relative w-20 h-20 mb-6">
          <img 
            src={LogoImg} 
            alt="Admin" 
            className="w-full h-full object-contain scale-150 mix-blend-multiply" 
          />
        </div>
        <h1 className="text-3xl font-black tracking-tighter text-zinc-900 mb-2">
          Admin <span className="text-green-600">Console</span>
        </h1>
        <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest">
          Authorized Personnel Only
        </p>
      </motion.div>

      {/* CARD */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[440px] bg-zinc-50 rounded-[40px] p-8 md:p-12 border border-zinc-100 shadow-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* EMAIL */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300" size={20} />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-4 pl-14 pr-6 rounded-2xl border"
                required
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">
              Security Key
            </label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300" size={20} />
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-4 pl-14 pr-14 rounded-2xl border"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <p className="text-red-500 text-sm font-bold text-center">
              {error}
            </p>
          )}

          {/* BUTTON */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-zinc-950 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-green-600"
          >
            {loading ? "Signing in..." : "Access Dashboard"}
            <ArrowRight size={18} />
          </button>
        </form>
      </motion.div>

      {/* FOOTER */}
      <motion.div className="mt-12 flex items-center gap-3 bg-zinc-50 px-6 py-3 rounded-full border">
        <ShieldCheck size={16} className="text-green-600" />
        <span className="text-[10px] font-black uppercase text-zinc-400">
          Encrypted Admin Session
        </span>
      </motion.div>
    </div>
  );
};

export default LoginPage;