import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaInstagram, FaQuoteRight } from 'react-icons/fa6';
import { 
  Star, 
  MapPin, 
  Plus,
  ShieldCheck,
  CheckCircle2,
  ArrowDown
} from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";

import ReviewForm from '../forms/ReviewForm';
import { getReviews, getReviewStats } from "../features/review/reviewSlice";

const ReviewsPage = () => {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const { reviews, stats, loading } = useSelector((state) => state.review);

  useEffect(() => {
    dispatch(getReviews());
    dispatch(getReviewStats());
  }, [dispatch]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'auto';
  }, [open]);

  return (
    <div className="bg-white min-h-screen">
      
      {/* HERO */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-zinc-950">
        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover"
            alt="Hero"
          />
        </motion.div>
        
        <div className="relative z-10 text-center px-6">
          <div className="flex items-center justify-center gap-3 mb-8">
            <ShieldCheck className="text-green-500" size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/60">
              Verified Excellence
            </span>
          </div>
          
          <h1 className="text-7xl md:text-[140px] font-black text-white tracking-tighter leading-[0.85] mb-12">
            THE <span className="text-green-500 italic">GUESTBOOK.</span>
          </h1>
          
          <p className="text-white/40 text-lg max-w-2xl mx-auto mb-16">
            Real families. Real experiences.
          </p>

          <button 
            onClick={() => setOpen(true)}
            className="bg-white text-zinc-950 px-12 py-6 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-green-600 hover:text-white transition-all"
          >
            Share Your Experience
          </button>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/20 animate-bounce">
          <ArrowDown size={32} />
        </div>
      </section>

      {/* STATS */}
      <div className="bg-zinc-50 border-y">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-wrap justify-between items-center gap-12">
          
          <div className="flex items-center gap-4">
            <CheckCircle2 className="text-green-600" />
            <span className="text-sm font-black uppercase">
              {stats.totalReviews}+ Reviews
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-zinc-950" />
              ))}
            </div>
            <span className="text-sm font-black uppercase">
              {stats.avgRating} Avg Rating
            </span>
          </div>

          <div className="flex items-center gap-4">
            <ShieldCheck className="text-zinc-400" />
            <span className="text-sm font-black uppercase">
              Health Guaranteed
            </span>
          </div>

        </div>
      </div>

      {/* REVIEWS */}
      <section className="max-w-[1600px] mx-auto px-6 py-32">
        {loading ? (
          <p className="text-center text-zinc-400 font-bold">
            Loading reviews...
          </p>
        ) : (
          <div className="columns-1 md:columns-2 gap-16 space-y-16">
            {reviews.map((review) => (
              <motion.div 
                key={review._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="break-inside-avoid"
              >
                {review.image ? (
                  // IMAGE REVIEW
                  <div className="group relative overflow-hidden rounded-[80px]">
                    <img 
                      src={review.image} 
                      className="w-full object-cover"
                      alt="review"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 to-transparent" />

                    <div className="absolute bottom-0 p-10">
                      <div className="flex items-center gap-2 text-white/60 mb-4">
                        <MapPin size={14} />
                        <span className="text-xs uppercase">{review.location}</span>
                      </div>

                      <p className="text-white text-xl mb-6">
                        {review.review || review.text}
                      </p>

                      <h4 className="text-white font-black">
                        {review.name}
                      </h4>
                    </div>
                  </div>
                ) : (
                  // TEXT REVIEW
                  <div className="bg-white p-16 rounded-[60px] border">
                    <FaQuoteRight className="text-zinc-100 mb-6" size={60} />

                    <p className="text-2xl font-bold mb-8 italic">
                      "{review.text}"
                    </p>

                    <h4 className="font-black">
                      {review.name}
                    </h4>
                    <p className="text-xs text-zinc-400 uppercase">
                      {review.location}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="py-40 bg-zinc-50 text-center">
        <h2 className="text-5xl font-black mb-6">
          Become part of our family
        </h2>

        <button 
          onClick={() => setOpen(true)}
          className="px-12 py-6 border rounded-full font-black uppercase"
        >
          Add Your Story
        </button>
      </section>

      <ReviewForm isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default ReviewsPage;