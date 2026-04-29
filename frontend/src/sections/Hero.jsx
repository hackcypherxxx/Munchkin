import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Star, ChevronRight } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  // 🔍 Search handler
  const handleSearch = (e) => {
    e.preventDefault();

    if (!query.trim()) {
      navigate('/available-kittens');
      return;
    }

    const params = new URLSearchParams();
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('male')) params.append('gender', 'Male');
    else if (lowerQuery.includes('female')) params.append('gender', 'Female');

    params.append('search', query.trim());

    navigate(`/available-kittens?${params.toString()}`);
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center bg-white pt-24 md:pt-32 overflow-hidden">
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-green-50/50 rounded-full blur-[120px] opacity-60" />
        
        <div className="absolute bottom-0 w-full h-[50dvh] md:h-[60dvh]">
          <img 
            src="https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&q=100&w=2400" 
            alt="Munchkin Breed" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-white" />
        </div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center text-center">
        
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-50 border border-zinc-200 mb-8 shadow-sm"
        >
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} className="fill-green-600 text-green-600" />
            ))}
          </div>
          <span className="text-[10px] md:text-[11px] font-black text-zinc-500 uppercase tracking-widest">
            America's Leading Munchkin Placement
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[13vw] md:text-8xl lg:text-9xl font-black text-zinc-950 tracking-tighter leading-[0.85] mb-8"
        >
          Where feline <br />
          <span className="text-green-600 italic">love begins.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-zinc-500 text-lg md:text-xl font-medium max-w-xl mb-12 leading-relaxed"
        >
          Find your perfect short-legged companion through our certified network of ethical Munchkin breeders.
        </motion.p>

        {/* SEARCH */}
        <motion.form 
          onSubmit={handleSearch}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-2xl group relative"
        >
          <div className="absolute -inset-1 bg-zinc-900/5 rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />
          
          <div className="relative flex items-center bg-zinc-50 border border-zinc-200 rounded-[28px] p-2 md:p-3 shadow-sm focus-within:bg-white focus-within:border-green-600/30 focus-within:shadow-2xl focus-within:shadow-green-900/5 transition-all">
            <div className="flex-1 flex items-center gap-3 px-4 md:px-6">
              <Search className="text-zinc-400" size={22} />
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by color, gender, or litter..."
                className="w-full bg-transparent border-none outline-none text-zinc-900 font-bold text-base md:text-xl placeholder:text-zinc-300"
              />
            </div>

            <button 
              type="submit"
              className="bg-zinc-950 text-white h-12 w-12 md:h-16 md:px-10 rounded-full flex items-center justify-center gap-2 hover:bg-green-600 transition-all active:scale-95 shadow-lg shadow-zinc-200"
            >
              <span className="hidden md:block font-black uppercase tracking-widest text-xs">
                Search
              </span>
              <ArrowRight size={20} />
            </button>
          </div>
        </motion.form>

        {/* ✅ FIXED BUTTON (moved OUTSIDE form) */}
        <Link
          to="/available-kittens"
          className="mt-8 mx-auto bg-white border border-zinc-200 text-zinc-900 px-8 py-3 rounded-full font-bold text-sm hover:bg-zinc-50 transition-all flex items-center gap-2 shadow-sm cursor-pointer active:scale-95"
        >
          Browse all munchkins <ChevronRight size={16} />
        </Link>
      </div>

      {/* FOOTER STRIP */}
      <div className="mt-auto w-full border-t border-zinc-100 py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-8">
            Recognized Excellence
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-20 opacity-30 grayscale brightness-0">
            <span className="text-sm md:text-lg font-black tracking-tighter">MUNCHKIN-ASSOCIATION</span>
            <span className="text-sm md:text-lg font-black tracking-tighter">KITTEN-CHRONICLE</span>
            <span className="text-sm md:text-lg font-black tracking-tighter">BREEDER-TECH</span>
            <span className="text-sm md:text-lg font-black tracking-tighter">CERTIFIED-LITTER</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;