import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Star, CheckCircle2, ArrowRight, MapPin, Loader2, Quote, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- REDUX ACTIONS ---
import { getReviews, getReviewStats } from '../features/review/reviewSlice';

const DEFAULT_REVIEWS = [
  {
    _id: "rev-1",
    name: "Dr. Evelyn & Marcus Vance",
    location: "Austin, Texas",
    breed: "Munchkin Standard Companion",
    review: "Bringing Archie into our home was the most reassuring adoption experience. The DNA reports and vet records were meticulous, and our flight nanny provided photo updates every step of the trip.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800"
  },
  {
    _id: "rev-2",
    name: "Jonathan & Claire Davies",
    location: "Seattle, Washington",
    breed: "Munchkin Rug-Hugger",
    review: "Our veterinarian here in Seattle was astounded by Winston's structural health, bone density, and clear genetic screen. He was completely comfortable with our children from day one.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"
  },
  {
    _id: "rev-3",
    name: "Sophia Martinez",
    location: "Miami, Florida",
    breed: "Munchkin Longhair Princess",
    review: "The weekly HD video check-ins during Penelope's growth gave us so much joy while waiting for homecoming. Truly a world-class preservation cattery that cares deeply about each companion.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"
  }
];

const Reviews = () => {
  const dispatch = useDispatch();

  // Pulling live data from Redux State
  const { reviews, stats, loading } = useSelector((state) => state.review);

  useEffect(() => {
    dispatch(getReviews());
    dispatch(getReviewStats());
  }, [dispatch]);

  const liveReviews = (reviews || []).filter(r => r.isApproved !== false);
  const displayReviews = liveReviews.length > 0 ? liveReviews : DEFAULT_REVIEWS;

  return (
    <section className="bg-white text-[#0a1412] py-16 md:py-24 overflow-hidden border-b border-[#e2e6df]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#eef3ee] border border-[#d2ded5] text-[#0f2d25] mb-3 text-[11px] font-semibold tracking-wide">
              <CheckCircle2 size={13} className="text-[#0f2d25]" />
              <span>Verified Adopter Spotlights</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.05] text-[#0a1412]">
              Cherished by <br />
              <span className="text-[#0f2d25] italic font-serif">
                {stats?.totalReviews > 0 ? `${stats.totalReviews}+ devoted families.` : 'devoted families.'}
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-3 bg-[#fafaf8] border border-[#e2e6df] px-4 py-2 rounded-full shadow-xs">
              <div className="flex gap-0.5 text-[#c5a059]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="currentColor" />
                ))}
              </div>
              <span className="text-xs font-bold text-[#0a1412]">4.9 / 5.0</span>
              <span className="text-[11px] text-[#5e6d67] font-medium">Adopter Rating</span>
            </div>

            <Link
              to="/reviews"
              className="inline-flex items-center gap-2 bg-[#0f2d25] hover:bg-[#163e32] text-white px-5 py-2.5 rounded-full font-semibold text-xs tracking-wide transition-all shadow-sm active:scale-95 group"
            >
              <span>All Testimonials</span>
              <ArrowRight size={13} className="text-[#c5a059] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* REVIEWS GRID / CAROUSEL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayReviews.slice(0, 3).map((review) => (
            <div
              key={review._id || review.id}
              className="bg-[#fafaf8] border border-[#e2e6df] hover:border-[#0f2d25]/50 rounded-2xl flex flex-col h-full overflow-hidden transition-all duration-300 group shadow-xs hover:shadow-sm"
            >
              {/* Photo with Overlay Badge */}
              <div className="h-[220px] sm:h-[240px] relative overflow-hidden bg-[#eef3ee]">
                <img
                  src={review.image || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800"}
                  alt={review.name || "Adopter"}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {review.location && (
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-[#e2e6df] shadow-xs">
                    <MapPin size={11} className="text-[#0f2d25]" />
                    <span className="text-[10px] font-semibold text-[#0a1412]">
                      {review.location}
                    </span>
                  </div>
                )}

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[#0f2d25] text-[10px] font-semibold border border-[#e2e6df]">
                    <CheckCircle2 size={10} className="text-[#0f2d25]" /> Verified Family
                  </span>

                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < (review.rating || 5) ? "fill-[#c5a059] text-[#c5a059]" : "text-white/40"}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1 justify-between">
                <p className="text-[#384843] font-normal text-xs sm:text-sm leading-relaxed mb-5 italic font-serif">
                  "{review.review || review.text}"
                </p>

                <div className="pt-3 border-t border-[#e2e6df] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#0a1412]">
                      {review.name || review.author}
                    </p>
                    <p className="text-[11px] text-[#5e6d67] font-medium mt-0.5">
                      {review.breed || "Munchkin Adopter"}
                    </p>
                  </div>
                  <Quote size={18} className="text-[#c5a059]/40" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Reviews;
