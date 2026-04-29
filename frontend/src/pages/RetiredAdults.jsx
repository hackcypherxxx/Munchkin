import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Heart, 
  Award, 
  CheckCircle2, 
  Camera,
  ArrowUpRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

import { getRetired } from '../features/retired/retiredSlice';

const RetiredAdults = () => {
  const dispatch = useDispatch();
  const { retiredList, loading } = useSelector((state) => state.retired);

  useEffect(() => {
    dispatch(getRetired());
  }, [dispatch]);

  // Animation variants for staggered children
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="bg-white min-h-screen pt-32 pb-48 selection:bg-green-600 selection:text-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- LUXURY HERO SECTION --- */}
        <div className="relative mb-32 md:mb-48">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
            <div className="relative">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute -left-12 top-0 hidden xl:block"
              >
                <span className="text-[10px] font-black uppercase tracking-[1em] text-zinc-200 [writing-mode:vertical-lr] rotate-180">
                  ESTABLISHED LEGACY
                </span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-7xl md:text-[140px] font-black text-zinc-950 tracking-tighter leading-[0.8] mb-10"
              >
                The <br />
                <span className="text-green-600 italic">Masters.</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-zinc-500 text-xl md:text-2xl font-medium max-w-xl leading-relaxed italic"
              >
                Honoring our foundation cats as they transition from the show ring to your living room.
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-zinc-950 p-12 rounded-[50px] text-white max-w-sm relative overflow-hidden shadow-2xl group"
            >
              <ShieldCheck className="text-green-500 mb-6 group-hover:scale-110 transition-transform" size={32} />
              <h4 className="text-lg font-black uppercase tracking-tighter mb-4 italic">
                The Gold Standard <br /> Retirement
              </h4>
              <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest leading-loose">
                Every retired adult is spayed/neutered, health-certified, and matched based on personality temperament.
              </p>
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-600/10 blur-3xl" />
            </motion.div>
          </div>
        </div>

        {/* --- GALLERY GRID --- */}
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="space-y-40 md:space-y-64"
        >
          {loading ? (
            <div className="flex flex-col items-center py-40 gap-4">
              <div className="w-12 h-12 border-4 border-zinc-100 border-t-green-600 rounded-full animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Accessing Archives</p>
            </div>
          ) : (
            (retiredList || []).map((cat, index) => (
              <motion.div 
                key={cat._id}
                variants={item}
                className={`flex flex-col lg:flex-row gap-16 md:gap-24 items-center ${
                  index % 2 !== 0 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                
                {/* --- IMAGE PORTAL --- */}
                <div className="w-full lg:w-3/5 group relative">
                  <div className="relative aspect-[16/10] md:aspect-[4/5] rounded-[80px] overflow-hidden bg-zinc-100 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)]">
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-zinc-950/5 group-hover:bg-transparent transition-colors" />
                  </div>

                  {/* FLOATING DATA TAG */}
                  <div className={`absolute -bottom-10 ${index % 2 !== 0 ? '-left-10' : '-right-10'} bg-white/80 backdrop-blur-2xl p-10 rounded-[40px] shadow-2xl border border-white/50 hidden lg:block z-20`}>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-2">Registry ID</p>
                    <p className="text-2xl font-black text-zinc-950 tracking-tighter">
                      #{cat._id?.slice(-5).toUpperCase()}
                    </p>
                  </div>

                  <div className="absolute top-10 left-10 text-[120px] font-black text-white/20 tracking-tighter leading-none pointer-events-none">
                    0{index + 1}
                  </div>
                </div>

                {/* --- CONTENT BOX --- */}
                <div className="w-full lg:w-2/5">
                  <div className="flex items-center gap-6 mb-10">
                    <div className="flex items-center gap-2">
                       <Sparkles size={14} className="text-green-600" />
                       <span className="text-[10px] font-black text-zinc-950 uppercase tracking-[0.3em]">
                        {cat.status || "Legacy Available"}
                       </span>
                    </div>
                    <div className="w-1 h-1 bg-zinc-200 rounded-full" />
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">
                      {cat.age}
                    </span>
                  </div>

                  <h2 className="text-6xl md:text-8xl font-black text-zinc-950 tracking-tighter mb-10 leading-[0.9]">
                    {cat.name}
                  </h2>
                  
                  <p className="text-zinc-500 text-xl font-medium leading-relaxed mb-12 border-l-2 border-green-600/20 pl-8 py-2">
                    {cat.description}
                  </p>

                  {/* HIGHLIGHTS BENTO */}
                  <div className="grid grid-cols-2 gap-3 mb-14">
                    {(cat.highlights || []).map((stat, i) => (
                      <div key={i} className="flex items-center gap-3 p-5 rounded-3xl bg-zinc-50/50 border border-zinc-100 hover:border-zinc-950 transition-colors group">
                        <CheckCircle2 size={16} className="text-green-600" />
                        <span className="text-[9px] font-black text-zinc-500 group-hover:text-zinc-950 uppercase tracking-widest">
                          {stat}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="flex-[2] bg-zinc-950 text-white py-7 rounded-[30px] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-green-600 transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-[0.98]">
                      Initiate Adoption <ArrowUpRight size={16} />
                    </button>

                    <button className="flex-1 px-8 py-7 rounded-[30px] border border-zinc-200 text-zinc-950 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-zinc-50 transition-all flex items-center justify-center gap-2">
                      <Camera size={16} /> Gallery
                    </button>
                  </div>
                </div>

              </motion.div>
            ))
          )}
        </motion.div>

        {/* --- PREMIUM CTA --- */}
        <div className="mt-64 relative">
          <div className="bg-zinc-950 rounded-[80px] p-16 md:p-32 text-center relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)]">
            <div className="relative z-10 max-w-3xl mx-auto">
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }} 
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Heart className="text-green-500 mx-auto mb-10" size={56} weight="fill" />
              </motion.div>
              
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-tight">
                Seeking a <br /> <span className="text-zinc-500 italic">Mature Connection?</span>
              </h2>
              
              <p className="text-zinc-400 text-lg md:text-xl font-medium mb-12 max-w-lg mx-auto">
                Our retired adults provide a calm, established presence. Join the private waiting list for future legacies.
              </p>
              
              <button className="px-16 py-7 bg-white text-zinc-950 rounded-[30px] font-black text-[11px] uppercase tracking-[0.4em] hover:bg-green-500 hover:text-white transition-all shadow-2xl active:scale-95">
                Join The Mature Circle
              </button>
            </div>

            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20">
               <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-600 blur-[120px] rounded-full" />
               <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-600 blur-[120px] rounded-full" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RetiredAdults;