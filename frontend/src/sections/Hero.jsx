import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  Award, 
  Heart, 
  Plane, 
  Sparkles,
  CheckCircle2,
  Cat,
  BadgeCheck
} from 'lucide-react';

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

  const quickFilter = (type, val) => {
    if (!val) {
      navigate('/available-kittens');
    } else {
      navigate(`/available-kittens?${type}=${encodeURIComponent(val)}`);
    }
  };

  const stats = [
    { label: 'Preservation Lineage', value: 'TICA Purebred', desc: 'Championship pedigrees & registry slip', icon: Award },
    { label: 'Genetic Health', value: '100% Cleared', desc: 'DNA & cardio health certification', icon: ShieldCheck },
    { label: 'Health Warranty', value: '10-Year Guarantee', desc: 'Comprehensive congenital coverage', icon: Heart },
    { label: 'Nationwide Delivery', value: '50 States', desc: 'In-cabin white-glove flight nanny', icon: Plane },
  ];

  return (
    <section className="relative w-full bg-[#fafaf8] text-[#0a1412] overflow-hidden pt-10 md:pt-16 pb-16 md:pb-24 border-b border-[#e2e6df]">
      {/* Subtle architectural grid lines inspired by Stripe */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.4]"
        style={{
          backgroundImage: `linear-gradient(to right, #e2e6df 1px, transparent 1px), linear-gradient(to bottom, #e2e6df 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />

      {/* Soft warm radial glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-[#eef3ee] rounded-full blur-[120px] pointer-events-none opacity-70" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#faefd4]/40 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Editorial Layout: 2 Columns */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-16">
          
          {/* Left Column: Headline, Value Proposition & Search */}
          <div className="lg:col-span-7 flex flex-col items-start">
            
            {/* Prestige badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#e2e6df] shadow-sm mb-6"
            >
              <div className="flex gap-0.5 text-[#c5a059]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={11} fill="currentColor" />
                ))}
              </div>
              <span className="text-[11px] font-semibold tracking-wide text-[#0f2d25]">
                TICA Registered Cattery #104829
              </span>
              <span className="text-[#c5a059]">•</span>
              <span className="text-[11px] font-medium text-[#5e6d67]">
                100% DNA Screened
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-[72px] font-bold tracking-tight text-[#0a1412] leading-[1.02] mb-6">
              The standard in <br />
              <span className="text-[#0f2d25] italic font-serif">
                Munchkin companions.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#475450] leading-relaxed max-w-xl mb-8 font-normal">
              Ethically raised pedigree short-legged companions from distinguished champion bloodlines. Each companion undergoes a 10-point veterinary examination and arrives with certified genetic clearance.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 mb-10 w-full sm:w-auto">
              <Link
                to="/available-kittens"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#0f2d25] hover:bg-[#163e32] text-white font-semibold text-xs tracking-wide shadow-sm hover:shadow-md transition-all active:scale-95"
              >
                <span>Browse Nursery Roster</span>
                <ArrowRight size={14} className="text-[#c5a059]" />
              </Link>

              <Link
                to="/apply"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white hover:bg-[#f4f5f0] text-[#0a1412] font-semibold text-xs tracking-wide border border-[#e2e6df] shadow-sm transition-all active:scale-95"
              >
                <span>Adoption Application</span>
              </Link>
            </div>

            {/* Search Bar (Stripe-Level Craft) */}
            <div className="w-full max-w-xl bg-white border border-[#e2e6df] rounded-2xl p-2 shadow-sm">
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2.5 px-3 py-1.5">
                  <Search className="text-[#7a8883] shrink-0" size={17} />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by color, coat, gender, or pedigree ID..."
                    className="w-full bg-transparent border-none outline-none text-[#0a1412] text-xs sm:text-sm font-medium placeholder:text-[#9aa7a2]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0f2d25] hover:bg-[#163e32] text-white font-semibold text-xs tracking-wide transition-all shrink-0"
                >
                  Search
                </button>
              </form>

              {/* Quick Filter Tags */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pt-2 px-2 border-t border-[#f4f5f0] mt-1.5 text-[11px]">
                <span className="text-[#7a8883] font-medium mr-1 shrink-0">Filter:</span>
                <button
                  type="button"
                  onClick={() => quickFilter('', '')}
                  className="px-2.5 py-0.5 rounded-md text-[#0f2d25] bg-[#eef3ee] hover:bg-[#d6e2d6] font-semibold shrink-0 transition-colors"
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => quickFilter('gender', 'Male')}
                  className="px-2.5 py-0.5 rounded-md text-[#475450] hover:text-[#0a1412] hover:bg-[#f4f5f0] font-medium shrink-0 transition-colors"
                >
                  Boys
                </button>
                <button
                  type="button"
                  onClick={() => quickFilter('gender', 'Female')}
                  className="px-2.5 py-0.5 rounded-md text-[#475450] hover:text-[#0a1412] hover:bg-[#f4f5f0] font-medium shrink-0 transition-colors"
                >
                  Girls
                </button>
                <button
                  type="button"
                  onClick={() => quickFilter('coat', 'Shorthair')}
                  className="px-2.5 py-0.5 rounded-md text-[#475450] hover:text-[#0a1412] hover:bg-[#f4f5f0] font-medium shrink-0 transition-colors"
                >
                  Shorthair
                </button>
                <button
                  type="button"
                  onClick={() => quickFilter('coat', 'Longhair')}
                  className="px-2.5 py-0.5 rounded-md text-[#475450] hover:text-[#0a1412] hover:bg-[#f4f5f0] font-medium shrink-0 transition-colors"
                >
                  Longhair
                </button>
                <Link
                  to="/upcoming-litters"
                  className="px-2.5 py-0.5 rounded-md text-[#c5a059] hover:underline font-semibold ml-auto shrink-0"
                >
                  Future Litters &rarr;
                </Link>
              </div>
            </div>

          </div>

          {/* Right Column: Asymmetric Showcase Companion Card (PuppySpot + Stripe Quality) */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative bg-white border border-[#e2e6df] rounded-3xl p-4 shadow-[0_20px_50px_rgba(15,45,37,0.06)]"
            >
              {/* Image Frame */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#eef3ee] mb-4">
                <img
                  src="https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&q=80&w=1200"
                  alt="Featured Champion Munchkin"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-[#0f2d25] text-white shadow-sm">
                    Featured Companion
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/90 backdrop-blur-sm text-[#0a1412] border border-[#e2e6df]">
                    TICA Registered
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[10px] font-semibold">
                  Rug-Hugger Standard
                </div>
              </div>

              {/* Card Meta & Spec Badges */}
              <div className="px-2 pb-2">
                <div className="flex items-baseline justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-[#0a1412] tracking-tight">
                      Archie of Kensington
                    </h3>
                    <p className="text-xs text-[#5e6d67] font-medium">
                      Lilac Point · Male · 10 Weeks Old
                    </p>
                  </div>
                  <span className="text-lg font-bold text-[#0f2d25] font-mono">
                    $2,450
                  </span>
                </div>

                {/* 3 Proof chips */}
                <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-[#f4f5f0] my-3 text-center">
                  <div className="bg-[#fafaf8] p-2 rounded-xl">
                    <p className="text-[10px] font-semibold uppercase text-[#7a8883]">DNA Test</p>
                    <p className="text-xs font-bold text-[#0f2d25]">100% Negative</p>
                  </div>
                  <div className="bg-[#fafaf8] p-2 rounded-xl">
                    <p className="text-[10px] font-semibold uppercase text-[#7a8883]">Vet Exam</p>
                    <p className="text-xs font-bold text-[#0f2d25]">Passed 10/10</p>
                  </div>
                  <div className="bg-[#fafaf8] p-2 rounded-xl">
                    <p className="text-[10px] font-semibold uppercase text-[#7a8883]">Delivery</p>
                    <p className="text-xs font-bold text-[#0f2d25]">Flight Nanny</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Link
                    to="/available-kittens"
                    className="flex-1 py-2.5 bg-[#0f2d25] hover:bg-[#163e32] text-white text-center rounded-xl text-xs font-semibold tracking-wide transition-all shadow-sm"
                  >
                    View Pedigree & Profile
                  </Link>
                  <Link
                    to="/apply"
                    className="px-4 py-2.5 bg-[#fafaf8] hover:bg-[#f4f5f0] text-[#0a1412] border border-[#e2e6df] rounded-xl text-xs font-semibold transition-all"
                  >
                    Reserve
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

        </div>

        {/* 👑 REFINED STRIPE-GRADE HUD STATS ROW */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-[#e2e6df] rounded-2xl p-4 sm:p-5 transition-all hover:border-[#0f2d25]/40 hover:shadow-sm group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7a8883]">
                    {s.label}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#eef3ee] flex items-center justify-center text-[#0f2d25] group-hover:bg-[#0f2d25] group-hover:text-white transition-all">
                    <Icon size={16} />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-[#0a1412] tracking-tight mb-1">
                  {s.value}
                </div>
                <div className="text-xs text-[#5e6d67] font-normal leading-normal">
                  {s.desc}
                </div>
              </div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;