import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Star, CheckCircle2, ChevronRight, ArrowRight, MapPin, Loader2 } from 'lucide-react';

// --- REDUX ACTIONS ---
import { getReviews, getReviewStats } from '../features/review/reviewSlice';
import { Link } from 'react-router-dom';

const Reviews = () => {
  const dispatch = useDispatch();

  // Pulling live data from Redux State
  const { reviews, stats, loading } = useSelector((state) => state.review);

  useEffect(() => {
    // Fetch approved reviews and statistics on component mount
    dispatch(getReviews());
    dispatch(getReviewStats());
  }, [dispatch]);

  return (
    <section className="bg-white py-24 md:py-32 overflow-hidden selection:bg-green-600 selection:text-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER */}
        <div className="flex items-end justify-between mb-12">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-green-600 mb-4">
              <CheckCircle2 size={18} fill="currentColor" className="text-white" />
              <span className="font-black uppercase tracking-[0.2em] text-[10px]">Verified Feline Parents</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-zinc-950 tracking-tighter leading-[0.9]">
              Loved by <br />
              {/* Dynamically display total reviews if available, else default to 'thousands' */}
              <span className="text-green-600 italic">
                {stats?.totalReviews > 0 ? `${stats.totalReviews}+ families.` : 'thousands.'}
              </span>
            </h2>
          </div>
          <button className="hidden md:flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 px-6 py-3 rounded-full font-bold transition-all group">
            View All Reviews
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* LOADING STATE */}
        {loading && reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
            <Loader2 size={40} className="animate-spin mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Loading Testimonials...</p>
          </div>
        ) : (
          /* HORIZONTAL SCROLL CONTAINER */
          <div className="relative group">
            <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-12 -mx-6 px-6 cursor-grab active:cursor-grabbing">
              
              {/* DYNAMIC REVIEW MAPPING */}
              {reviews.map((review) => (
                <div
                  key={review._id || review.id}
                  className="flex-none w-[85vw] md:w-[450px] snap-center"
                >
                  <motion.div
                    className="bg-zinc-50 rounded-[42px] border border-zinc-100 flex flex-col h-full overflow-hidden transition-shadow hover:shadow-xl hover:shadow-zinc-200/50"
                  >
                    {/* Photo with Overlay Badge */}
                    <div className="h-[320px] relative overflow-hidden bg-zinc-200">
                      <img
                        src={review.image || "https://images.unsplash.com/photo-1511275539165-cc46b1ee8960?auto=format&fit=crop&q=80&w=800"} // Fallback image
                        alt={review.name || "Client"}
                        className="w-full h-full object-cover"
                      />
                      {review.location && (
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2 border border-white/50 shadow-sm">
                          <MapPin size={12} className="text-green-600" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                            {review.location}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-8 flex flex-col flex-1">
                      {/* Dynamic Star Rating */}
                      <div className="flex gap-0.5 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            className={i < (review.rating || 5) ? "fill-amber-400 text-amber-400" : "text-zinc-300"} 
                          />
                        ))}
                      </div>

                      <p className="text-zinc-800 font-bold text-lg leading-tight mb-4">
                        "{review.review || review.text}"
                      </p>

                      <div className="mt-auto pt-6 border-t border-zinc-200/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-black text-zinc-950">{review.name || review.author}</p>
                            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                              {review.breed || "Munchkin Companion"}
                            </p>
                          </div>
                          <button className="p-3 bg-white rounded-full border border-zinc-200 text-zinc-400 hover:text-green-600 hover:border-green-600 transition-all">
                            <ChevronRight size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}

              {/* "View All" Card at the end of the scroll */}
              {reviews.length > 0 && (
                <Link to="/reviews" >
                <div className="flex-none w-[60vw] md:w-[300px] snap-center">
                  <div className="h-full bg-zinc-950 rounded-[42px] flex flex-col items-center justify-center p-8 text-center text-white group cursor-pointer hover:bg-green-600 transition-colors shadow-2xl">
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6">
                      <ArrowRight size={32} />
                    </div>
                    <h3 className="text-2xl font-black tracking-tight mb-2">See More</h3>
                    <p className="text-zinc-400 text-sm font-medium group-hover:text-white transition-colors">
                      Join our happy Munchkin owners
                    </p>
                  </div>
                </div>
                </Link>
              )}

            </div>
          </div>
        )}

        {/* Mobile-only Indicator */}
        <div className="flex justify-center gap-2 md:hidden mt-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all ${i === 0 ? 'w-8 bg-zinc-900' : 'w-2 bg-zinc-200'}`} />
          ))}
        </div>
      </div>

      {/* Global CSS for hiding scrollbar while keeping functionality */}
      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </section>
  );
};

export default Reviews;