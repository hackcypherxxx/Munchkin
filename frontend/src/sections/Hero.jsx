import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Star, ChevronRight } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

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

      {/* Decorative background shapes */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-green-50/40 rounded-full blur-[140px] opacity-70" />
        
        {/* Background image with refined gradient overlay */}
        <div className="absolute bottom-0 w-full h-[55dvh] md:h-[65dvh]">
          <img
            src="https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&q=100&w=2400"
            alt=""
            role="presentation"
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-6xl px-6 md:px-10 flex flex-col items-center text-center">
        
        {/* Badge – refined with softer shadow and color */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-green-50 border border-green-200 mb-10 shadow-sm shadow-green-900/5"
        >
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={13} className="fill-green-600 text-green-600" />
            ))}
          </div>
          <span className="text-[10px] md:text-[11px] font-black text-green-800 uppercase tracking-widest">
            America's Leading Munchkin Placement
          </span>
        </motion.div>

        {/* Headline – slightly tighter line height, elegant curve */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: 'easeOut' }}
          className="text-[12vw] md:text-8xl lg:text-9xl font-black text-zinc-900 tracking-tighter leading-[0.85] mb-8"
        >
          Where feline{' '}
          <span className="relative inline-block text-green-600 italic">
            love begins.
            <motion.span
              className="absolute -bottom-2 left-0 w-full h-[6px] bg-green-200/30 rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
            />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="text-zinc-500 text-lg md:text-xl font-medium max-w-xl mb-14 leading-relaxed"
        >
          Find your perfect short‑legged companion through our certified network of ethical Munchkin breeders.
        </motion.p>

        {/* Search bar – elevated with better focus state and micro‑interaction */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="w-full max-w-2xl group"
        >
          <div className="relative flex items-center bg-white border border-zinc-200 rounded-[32px] p-2 md:p-3 shadow-sm hover:shadow-md focus-within:shadow-lg transition-shadow duration-300">
            <div className="flex-1 flex items-center gap-3 px-5 md:px-7">
              <Search className="text-zinc-400" size={22} strokeWidth={2} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by color, gender, or litter..."
                className="w-full bg-transparent border-none outline-none text-zinc-900 font-semibold text-base md:text-xl placeholder:text-zinc-300 placeholder:font-medium transition-none"
                aria-label="Search kittens"
              />
            </div>
            <button
              type="submit"
              className="bg-zinc-900 text-white h-12 w-12 md:h-14 md:w-auto md:px-8 rounded-full flex items-center justify-center gap-2 hover:bg-green-600 transition-colors duration-300 active:scale-95 shadow-md shadow-zinc-200"
              aria-label="Search"
            >
              <span className="hidden md:block font-black uppercase tracking-widest text-xs">Search</span>
              <ArrowRight size={20} strokeWidth={2.5} />
            </button>
          </div>
        </motion.form>

        {/* CTA link – improved alignment and hover animation */}
        <Link
          to="/available-kittens"
          className="mt-10 inline-flex items-center gap-2 bg-white border border-zinc-200 text-zinc-900 px-8 py-3 rounded-full font-bold text-sm hover:bg-zinc-50 hover:border-zinc-300 transition-all group shadow-sm"
        >
          Browse all munchkins
          <ChevronRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Footer strip – subtle with refined typography */}
      <div className="mt-auto w-full border-t border-zinc-100 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] mb-10 opacity-80">
            Recognized Excellence
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-25 grayscale brightness-0">
            <span className="text-sm md:text-lg font-black tracking-tighter">MUNCHKIN‑ASSOCIATION</span>
            <span className="text-sm md:text-lg font-black tracking-tighter">KITTEN‑CHRONICLE</span>
            <span className="text-sm md:text-lg font-black tracking-tighter">BREEDER‑TECH</span>
            <span className="text-sm md:text-lg font-black tracking-tighter">CERTIFIED‑LITTER</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;