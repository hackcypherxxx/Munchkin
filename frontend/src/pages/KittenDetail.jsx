import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getKittenById } from '../features/kitten/kittenSlice';

import {
  Heart,
  ChevronLeft,
  Dna,
  Sparkles,
  Stethoscope,
  ShieldCheck,
  ArrowUpRight,
  Info,
  CheckCircle2
} from 'lucide-react';

const KittenDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { kitten, loading, error } = useSelector((state) => state.kitten);

  const [activeImg, setActiveImg] = useState(0);
  const scrollRef = useRef(null);

  // ✅ FETCH KITTEN
  useEffect(() => {
    if (id) {
      dispatch(getKittenById(id));
    }
  }, [id, dispatch]);

  // ✅ HANDLE SCROLL (MOBILE CAROUSEL)
  const handleScroll = () => {
    if (scrollRef.current) {
      const width = scrollRef.current.offsetWidth;
      const index = Math.round(scrollRef.current.scrollLeft / width);
      if (index !== activeImg) setActiveImg(index);
    }
  };

  // ✅ LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-zinc-950 text-white rounded-[20px] flex items-center justify-center mx-auto mb-6 font-black italic text-2xl">B</div>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">Accessing Registry...</p>
        </motion.div>
      </div>
    );
  }

  // ❌ ERROR STATE
  if (error) {
    return (
      <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center p-6">
        <div className="bg-red-50 p-10 rounded-[40px] text-center max-w-md w-full">
          <p className="text-red-500 font-black text-xl italic uppercase tracking-tighter mb-2">Error 404</p>
          <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">{error}</p>
          <Link to="/available-kittens" className="mt-8 inline-block px-8 py-4 bg-red-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest">Return to Nursery</Link>
        </div>
      </div>
    );
  }

  // ⚠️ NO DATA
  if (!kitten) return null;

  // 🚫 STATUS GUARD – block page for reserved/adopted kittens
  const isAvailable = kitten.status?.toLowerCase() === 'available';

  if (!isAvailable) {
    return (
      <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center p-6">
        <div className="bg-amber-50 p-12 rounded-[48px] text-center max-w-md w-full shadow-sm">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <Info size={32} className="text-amber-600" />
          </div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4">No Longer Available</h2>
          <p className="text-zinc-500 font-medium mb-8">
            <span className="font-bold">{kitten.name}</span> has already found a loving home.
            Please explore our other Munchkin companions.
          </p>
          <Link
            to="/available-kittens"
            className="inline-block px-8 py-4 bg-zinc-950 text-white rounded-[30px] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-green-600 transition-all"
          >
            Back to Nursery
          </Link>
        </div>
      </div>
    );
  }

  // ✅ AVAILABLE – render full detail page
  return (
    <div className="bg-[#fcfcfc] min-h-screen text-zinc-950 font-sans selection:bg-zinc-950 selection:text-white pb-32 md:pb-40">
      {/* --- MOBILE TOP NAV --- */}
      <nav className="md:hidden fixed top-0 inset-x-0 z-50 px-6 py-5 flex items-center justify-between bg-white/80 backdrop-blur-2xl border-b border-zinc-100">
        <Link to="/available-kittens" className="w-10 h-10 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-950 active:scale-90 transition-transform">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-[11px] font-black uppercase tracking-[0.3em]">{kitten.name}</h1>
        <button className="w-10 h-10 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-colors">
          <Heart size={18} />
        </button>
      </nav>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-28 md:pt-40">

        {/* --- DESKTOP HEADER --- */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="hidden md:flex justify-between items-end mb-16 pb-12 border-b border-zinc-100">
          <div>
            <Link to="/available-kittens" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-zinc-950 transition-colors mb-8">
              <ChevronLeft size={14} /> Back to Nursery
            </Link>
            <div className="flex items-center gap-4 mb-4">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${kitten.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-400'}`}>
                {kitten.status}
              </span>
              {kitten.isFeatured && <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-amber-500 bg-amber-50 px-3 py-1.5 rounded-full"><Sparkles size={12}/> Featured</span>}
            </div>
            <h1 className="text-8xl lg:text-[9rem] font-black italic tracking-tighter uppercase leading-[0.8]">{kitten.name}</h1>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-2">Registry ID</p>
            <p className="text-2xl font-black italic uppercase">{kitten.registryId || 'N/A'}</p>
          </div>
        </motion.div>

        {/* --- MOBILE HEADER --- */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden mb-8 mt-4 text-center">
           <div className="flex justify-center gap-2 mb-4">
              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${kitten.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-400'}`}>
                {kitten.status}
              </span>
            </div>
           <h1 className="text-6xl sm:text-7xl font-black italic tracking-tighter uppercase leading-[0.8]">{kitten.name}</h1>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 mt-6">{kitten.registryId} • {kitten.breed}</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

          {/* --- LEFT: MEDIA GALLERY --- */}
          <div className="w-full lg:w-1/2">
            <div className="lg:sticky lg:top-40 space-y-6">
              
              {/* Main Image / Mobile Carousel */}
              <div className="relative rounded-[40px] md:rounded-[60px] overflow-hidden bg-zinc-50 shadow-2xl">
                <div 
                  ref={scrollRef}
                  onScroll={handleScroll}
                  className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar aspect-square md:aspect-[4/5]"
                >
                  {kitten.images?.map((img, i) => (
                    <div key={i} className="min-w-full h-full snap-center relative">
                      <img src={img} className="w-full h-full object-cover" alt={`${kitten.name} - ${i + 1}`} />
                    </div>
                  ))}
                </div>
                
                {/* Mobile Carousel Indicators */}
                <div className="absolute bottom-6 inset-x-0 flex justify-center gap-2 lg:hidden">
                   {kitten.images?.map((_, i) => (
                     <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${activeImg === i ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`} />
                   ))}
                </div>
              </div>

              {/* Desktop Thumbnails */}
              <div className="hidden lg:grid grid-cols-5 gap-4">
                {kitten.images?.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveImg(i)}
                    className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-zinc-950 opacity-100' : 'border-transparent opacity-40 hover:opacity-100'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt="Thumbnail" />
                  </button>
                ))}
              </div>

            </div>
          </div>

          {/* --- RIGHT: DATA & DETAILS --- */}
          <div className="w-full lg:w-1/2 space-y-16">

            {/* Price & CTA (Desktop) */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="hidden md:block p-12 bg-zinc-950 text-white rounded-[50px] shadow-2xl relative overflow-hidden">
              <Sparkles size={120} className="absolute -right-10 -top-10 opacity-5" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-50 mb-3">Adoption Investment</p>
              <p className="text-7xl font-black italic tracking-tighter leading-none mb-8">${kitten.price}</p>
              <div className="flex gap-4">
                 <Link 
                   to={`/apply?id=${kitten._id}&type=kitten`}
                   className="flex-1 py-6 bg-white text-zinc-950 text-center rounded-[30px] font-black text-[11px] uppercase tracking-[0.4em] hover:scale-105 active:scale-95 transition-all"
                 >
                   Submit Application
                 </Link>
                 <Link to="/contact" className="w-20 h-20 bg-zinc-800 rounded-[30px] flex items-center justify-center text-white hover:bg-zinc-700 transition-colors">
                   <Info size={24} />
                 </Link>
              </div>
            </motion.div>

            {/* Description */}
            {kitten.description && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <SectionLabel icon={Info} text="Executive Summary" />
                <p className="text-xl md:text-2xl font-bold leading-relaxed italic text-zinc-600">"{kitten.description}"</p>
              </motion.div>
            )}

            {/* Specs Grid */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <SectionLabel icon={Dna} text="Biological Specs" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <SpecCard label="Gender" value={kitten.gender} />
                <SpecCard label="Age" value={`${kitten.ageWeeks} Weeks`} />
                <SpecCard label="Coat" value={kitten.coat} />
                {kitten.specs?.map((spec, i) => (
                  <SpecCard key={i} label={spec.label} value={spec.value} />
                ))}
              </div>
            </motion.div>

            {/* Medical History */}
            {kitten.medical?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <SectionLabel icon={Stethoscope} text="Medical Protocol" />
                <div className="bg-white border border-zinc-100 rounded-[40px] overflow-hidden shadow-sm">
                  {kitten.medical.map((m, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 sm:p-8 border-b border-zinc-50 last:border-0 hover:bg-zinc-50 transition-colors">
                      <div className="flex items-center gap-4 mb-2 sm:mb-0">
                        <CheckCircle2 size={20} className={m.status.toLowerCase() === 'completed' || m.status.toLowerCase() === 'yes' ? 'text-green-500' : 'text-zinc-300'} />
                        <span className="font-black uppercase text-sm">{m.event}</span>
                      </div>
                      <div className="flex items-center gap-4 pl-9 sm:pl-0">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-100 px-3 py-1 rounded-full">Week {m.week}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest w-20 sm:text-right">{m.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Lineage */}
            {kitten.lineage?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <SectionLabel icon={ShieldCheck} text="Ancestry / Lineage" />
                <div className="space-y-4">
                  {kitten.lineage.map((p, i) => (
                    <div key={i} className="p-8 bg-zinc-950 text-white rounded-[40px] flex items-center justify-between group">
                      <div>
                        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-2">{p.relation}</p>
                        <p className="text-2xl font-black italic uppercase tracking-tighter">{p.name}</p>
                        {p.title && <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mt-2">{p.title}</p>}
                      </div>
                      <div className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center group-hover:bg-white group-hover:text-zinc-950 transition-colors">
                        <ArrowUpRight size={20} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </div>

      {/* --- MOBILE STICKY BOTTOM CTA --- */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-xl border-t border-zinc-100 p-6 z-50 pb-safe">
         <div className="flex items-center justify-between gap-6">
            <div>
               <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Total Fee</p>
               <p className="text-3xl font-black italic tracking-tighter">${kitten.price}</p>
            </div>
            <Link 
              to={`/apply?id=${kitten._id}&type=kitten`}
              className="flex-1 py-5 bg-zinc-950 text-white text-center rounded-[25px] font-black text-[10px] uppercase tracking-[0.3em] active:scale-95 transition-transform shadow-xl"
            >
               Apply Now
            </Link>
         </div>
      </div>
      
      <div className="h-32 md:hidden"></div>
    </div>
  );
};

// --- SUB COMPONENTS (unchanged) ---

const SectionLabel = ({ text, icon: Icon }) => (
  <div className="flex items-center gap-3 mb-8">
    <div className="w-8 h-8 rounded-xl bg-zinc-200 flex items-center justify-center text-zinc-900"><Icon size={16}/></div>
    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">{text}</h3>
  </div>
);

const SpecCard = ({ label, value }) => (
  <div className="p-6 bg-zinc-50 rounded-[30px] border border-transparent hover:border-zinc-200 transition-colors">
    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2 line-clamp-1">{label}</p>
    <p className="text-sm font-black uppercase italic tracking-tight line-clamp-1">{value || 'N/A'}</p>
  </div>
);

export default KittenDetail;