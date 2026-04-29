import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaFacebookF } from 'react-icons/fa6';

import { 
  Calendar, 
  Heart, 
  ShieldCheck, 
  ArrowRight, 
  Info,
  Clock
} from 'lucide-react';

import { getUpcoming } from '../features/upcoming/upcomingSlice';

const UpcomingLitters = () => {
  const dispatch = useDispatch();
  const { upcomingList, loading } = useSelector((state) => state.upcoming);

  useEffect(() => {
    dispatch(getUpcoming());
  }, [dispatch]);

  return (
    <div className="bg-white min-h-screen pt-32 pb-40">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- HEADER --- */}
        <div className="max-w-4xl mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="w-12 h-[1px] bg-green-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-green-600">The Horizon</span>
          </motion.div>
          
          <h1 className="text-7xl md:text-[110px] font-black text-zinc-950 tracking-tighter leading-[0.85] mb-12">
            Upcoming <br /><span className="italic text-zinc-300">Litters.</span>
          </h1>

          <div className="flex flex-col md:flex-row gap-12 mt-16 border-l-2 border-zinc-100 pl-8">
            <p className="text-zinc-500 text-xl font-medium leading-relaxed max-w-md">
              We meticulously plan our pairings months in advance to ensure the highest genetic health and social stability.
            </p>
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-zinc-900">
                    <ShieldCheck size={18} className="text-green-600" />
                    <span className="text-[11px] font-black uppercase tracking-widest">Waitlist Deposit Required</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-900">
                    <Clock size={18} className="text-green-600" />
                    <span className="text-[11px] font-black uppercase tracking-widest">6-12 Month Average Wait</span>
                </div>
            </div>
          </div>
        </div>

        {/* --- LITTER CARDS --- */}
        <div className="space-y-32">
          {loading ? (
            <p className="text-center text-zinc-400 font-bold">
              Loading upcoming litters...
            </p>
          ) : (
            (Array.isArray(upcomingList) ? upcomingList : []).map((litter, i) => (
              <motion.div 
                key={litter._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`flex flex-col ${i % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 md:gap-24 items-center`}
              >
                {/* Image */}
                <div className="w-full md:w-1/2 relative">
                  <div className="aspect-[4/5] rounded-[60px] overflow-hidden">
                    <img 
                      src={litter.image} 
                      alt={litter.title} 
                      className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100"
                    />
                  </div>

                  {/* Status Badge (static since not in model) */}
                  <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 shadow-xl">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-950 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      Planned
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="w-full md:w-1/2 space-y-10">
                  <div>
                    <h2 className="text-5xl md:text-6xl font-black text-zinc-950 tracking-tighter mb-4 italic uppercase">
                      {litter.title}
                    </h2>

                    <div className="flex items-center gap-2 text-green-600 mb-8">
                      <Calendar size={16} />
                      <span className="text-xs font-black uppercase tracking-widest">
                        Expected Arrival: {litter.expectedArrival}
                      </span>
                    </div>

                    <p className="text-zinc-500 text-lg leading-relaxed font-medium">
                      {litter.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-6 py-8 border-y border-zinc-100">
                    {litter.features?.map((trait, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Heart size={14} className="text-zinc-300" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                          {trait}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-6">
                    <Link 
                      to="/contact"
                      className="px-10 py-5 bg-zinc-950 text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-green-600 transition-all shadow-xl shadow-zinc-200"
                    >
                      Join the Waitlist
                    </Link>

                    <button className="flex items-center gap-3 text-zinc-950 font-black text-[10px] uppercase tracking-widest group">
                      View Pedigree 
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* --- INFO --- */}
        <div className="mt-40 p-12 md:p-24 bg-zinc-50 rounded-[80px] border border-zinc-100 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                    <Info size={24} className="text-green-600" />
                </div>
                <h3 className="text-3xl font-black text-zinc-950 tracking-tighter mb-4 uppercase">
                  Selection Process
                </h3>
                <p className="text-zinc-500 font-medium leading-relaxed">
                    Our waitlist members get first selection in order of deposit.
                </p>
            </div>

            <div className="flex flex-col gap-6 w-full md:w-auto">
                <Link to="/contact" className="w-full text-center px-8 py-5 bg-white border border-zinc-200 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:border-zinc-950 transition-all">
                    View Adoption Policy
                </Link>

                <a href="https://facebook.com" target="_blank" rel="noreferrer"
                   className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-zinc-950 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-green-600 transition-all">
                    <FaFacebookF /> Follow for Live Birth Alerts
                </a>
            </div>
        </div>

      </div>
    </div>
  );
};

export default UpcomingLitters;