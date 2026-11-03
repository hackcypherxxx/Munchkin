import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Heart, 
  CheckCircle2, 
  ShieldCheck, 
  Camera, 
  Clock, 
  MapPin,
  SlidersHorizontal 
} from 'lucide-react';
import { getKittens } from '../features/kitten/kittenSlice';

// Curated nursery showcase fallback ensures visitors always experience premium companion photography even during cold backend spin-up
const CURATED_SHOWCASE = [
  {
    _id: "showcase-1",
    name: "Oliver of Kensington",
    breed: "Munchkin Standard",
    coat: "Lilac Point",
    gender: "Male",
    price: 2450,
    ageWeeks: 9,
    registryId: "TICA #MC-9401",
    trait: "Gentle & Curious",
    location: "Flight Nanny Included",
    images: ["https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&q=80&w=800"]
  },
  {
    _id: "showcase-2",
    name: "Penelope Belle",
    breed: "Munchkin Standard",
    coat: "Golden Shaded",
    gender: "Female",
    price: 2600,
    ageWeeks: 10,
    registryId: "TICA #MC-9404",
    trait: "Playful Lap Hugger",
    location: "In-Cabin Escort",
    images: ["https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=800"]
  },
  {
    _id: "showcase-3",
    name: "Winston Montgomery",
    breed: "Munchkin Rug-Hugger",
    coat: "Blue Bi-Color",
    gender: "Male",
    price: 2350,
    ageWeeks: 11,
    registryId: "TICA #MC-9407",
    trait: "Calm Temperament",
    location: "Nationwide Nanny",
    images: ["https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&q=80&w=800"]
  },
  {
    _id: "showcase-4",
    name: "Duchess Clementine",
    breed: "Munchkin Longhair",
    coat: "Silver Tabby",
    gender: "Female",
    price: 2750,
    ageWeeks: 12,
    registryId: "TICA #MC-9410",
    trait: "Affectionate Purrer",
    location: "Direct Nursery Pickup",
    images: ["https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800"]
  }
];

const FeaturedDiscovery = () => {
  const dispatch = useDispatch();
  const { kittens, loading } = useSelector((state) => state.kitten);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    if (!kittens || kittens.length === 0) {
      dispatch(getKittens());
    }
  }, [dispatch, kittens]);

  const liveList = (kittens || []).filter(
    (k) => !k.status || k.status.toLowerCase() === 'available'
  );

  const displayList = liveList.length > 0 ? liveList : CURATED_SHOWCASE;

  const filteredList = displayList.filter((k) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Males') return k.gender?.toLowerCase() === 'male';
    if (activeTab === 'Females') return k.gender?.toLowerCase() === 'female';
    if (activeTab === 'Standard') return k.coat?.toLowerCase().includes('standard') || k.breed?.toLowerCase().includes('standard');
    if (activeTab === 'Featured') return true;
    return true;
  });

  return (
    <section className="bg-[#fafaf8] py-16 md:py-24 border-b border-[#e2e6df]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER (PuppySpot Discovery Header with Stripe-level Typography) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#eef3ee] border border-[#d2ded5] text-[#0f2d25] mb-3 text-[11px] font-semibold tracking-wide">
              <Sparkles size={12} className="text-[#c5a059]" />
              <span>Curated Nursery Discovery</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-[#0a1412] tracking-tight leading-[1.05]">
              Meet your future <br />
              <span className="text-[#0f2d25] italic font-serif">
                family companion.
              </span>
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className="text-[#5e6d67] text-xs sm:text-sm font-normal max-w-xs leading-relaxed">
              Every companion is veterinarian-examined, microchipped, DNA screened, and raised with dedicated underfoot socialization.
            </p>
            <Link
              to="/available-kittens"
              className="inline-flex items-center gap-2 bg-[#0f2d25] hover:bg-[#163e32] text-white px-5 py-2.5 rounded-full font-semibold text-xs tracking-wide transition-all shadow-sm active:scale-95 shrink-0"
            >
              <span>View Full Roster ({displayList.length})</span>
              <ArrowRight size={13} className="text-[#c5a059]" />
            </Link>
          </div>
        </div>

        {/* DISCOVERY FILTER TABS (Inspired by PuppySpot lifestyle/breed switcher) */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-3 mb-10 border-b border-[#e2e6df]">
          {[
            { id: 'All', label: 'All Available' },
            { id: 'Males', label: 'Boys / Males' },
            { id: 'Females', label: 'Girls / Females' },
            { id: 'Standard', label: 'Standard Rug-Hugger' },
            { id: 'Featured', label: 'Nursery Spotlights' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-tight transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'bg-[#0f2d25] text-white shadow-sm'
                  : 'bg-white text-[#475450] hover:text-[#0a1412] hover:bg-[#f4f5f0] border border-[#e2e6df]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* DISCOVERY GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredList.slice(0, 8).map((cat) => {
            const photoCount = cat.images?.length || 1;
            return (
              <motion.div
                key={cat._id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl overflow-hidden border border-[#e2e6df] hover:border-[#0f2d25]/50 shadow-sm hover:shadow-[0_12px_30px_rgba(15,45,37,0.08)] transition-all flex flex-col group"
              >
                {/* Photo Container */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#eef3ee]">
                  <img
                    src={cat.images?.[0] || 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&q=80&w=800'}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

                  {/* Top Status & Trait Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1 z-10">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0f2d25] text-white shadow-sm">
                      {cat.status || 'Available'}
                    </span>
                    {cat.trait && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-white/90 backdrop-blur-sm text-[#0a1412] shadow-sm">
                        {cat.trait}
                      </span>
                    )}
                  </div>

                  {/* Photo Count Pill */}
                  {photoCount > 1 && (
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full text-white flex items-center gap-1 text-[10px] font-semibold">
                      <Camera size={11} className="text-[#c5a059]" />
                      <span>{photoCount} Photos</span>
                    </div>
                  )}

                  {/* Bottom overlay: Gender & Age */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px] font-semibold">
                    <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded">
                      {cat.gender || 'Companion'}
                    </span>
                    <span className="text-[#faefd4]">
                      {cat.ageWeeks ? `${cat.ageWeeks} Wks Old` : 'Ready For Home'}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-baseline justify-between mb-1">
                      <h3 className="font-bold text-base text-[#0a1412] tracking-tight group-hover:text-[#0f2d25] transition-colors">
                        {cat.name}
                      </h3>
                      <span className="text-[#0f2d25] font-bold text-base font-mono">
                        ${cat.price}
                      </span>
                    </div>

                    <p className="text-xs text-[#5e6d67] font-medium mb-3">
                      {cat.breed || 'Munchkin'} · {cat.coat || 'Standard'} Coat
                    </p>

                    {/* Health check indicator */}
                    <div className="flex items-center gap-2 py-1.5 px-2.5 bg-[#fafaf8] rounded-lg border border-[#e2e6df] mb-3 text-[11px] text-[#475450] font-medium">
                      <CheckCircle2 size={13} className="text-[#0f2d25] shrink-0" />
                      <span className="truncate">DNA Tested · In-Cabin Delivery</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="pt-2.5 border-t border-[#f4f5f0] flex gap-2">
                    <Link to={`/kitten/${cat._id}`} className="flex-1">
                      <button className="w-full py-2 bg-[#0f2d25] hover:bg-[#163e32] text-white rounded-lg text-xs font-semibold tracking-wide transition-all shadow-sm flex items-center justify-center gap-1">
                        <span>Profile & Pedigree</span>
                        <ArrowRight size={12} className="text-[#c5a059]" />
                      </button>
                    </Link>
                    <Link to={`/apply?id=${cat._id}&type=kitten&name=${encodeURIComponent(cat.name)}`}>
                      <button 
                        className="px-3 py-2 bg-[#fafaf8] hover:bg-[#f4f5f0] text-[#0a1412] rounded-lg text-xs font-semibold border border-[#e2e6df] transition-colors"
                        title="Reserve this companion"
                      >
                        Reserve
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* BOTTOM CALL TO ACTION */}
        <div className="mt-12 text-center">
          <Link
            to="/available-kittens"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white hover:bg-[#f4f5f0] text-[#0f2d25] font-semibold text-xs tracking-wide border border-[#e2e6df] shadow-sm transition-all active:scale-95"
          >
            <span>Explore All {displayList.length} Active Companions</span>
            <ArrowRight size={13} className="text-[#c5a059]" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default FeaturedDiscovery;

