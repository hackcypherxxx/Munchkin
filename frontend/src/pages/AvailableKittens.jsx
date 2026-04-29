import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { 
  X, 
  ChevronDown, 
  Filter, 
  Check, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

import { getKittens } from '../features/kitten/kittenSlice';

const AvailableKittens = () => { 
  const dispatch = useDispatch();
  const { kittens, loading } = useSelector((state) => state.kitten);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeGender, setActiveGender] = useState('All');
  const [priceSort, setPriceSort] = useState(null);

  useEffect(() => {
    dispatch(getKittens());
  }, [dispatch]);

  const filterCategories = [
    { name: 'Gender', options: ['All', 'Male', 'Female'] },
    { name: 'Age', options: ['Under 12 weeks', 'Over 12 weeks'] },
    { name: 'Coat', options: ['Shorthair', 'Standard'] },
    { name: 'Price', options: ['Low to High', 'High to Low'] }
  ];

  // 🔥 FULL PROCESSING (FILTER + SORT)
  const processedKittens = useMemo(() => {
    let data = [...kittens];

    // ✅ Only show AVAILABLE kittens (important for UI)
    data = data.filter(k => k.status === "Available");

    // ✅ Gender filter (from specs if exists)
    if (activeGender !== "All") {
      data = data.filter((k) => {
        const genderSpec = k.specs?.find(
          (s) => s.label.toLowerCase() === "gender"
        );
        return genderSpec?.value === activeGender;
      });
    }

    // ✅ Price sorting
    if (priceSort === "Low to High") {
      data.sort((a, b) => a.price - b.price);
    } else if (priceSort === "High to Low") {
      data.sort((a, b) => b.price - a.price);
    }

    return data;
  }, [kittens, priceSort, activeGender]);

  return (
    <div className="bg-white min-h-screen pt-24 md:pt-32">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* HEADER */}
        <div className="text-center mb-12 md:mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-50 border border-zinc-100 mb-6"
          >
            <Sparkles size={12} className="text-green-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              New Arrivals Weekly
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-black text-zinc-950 tracking-tighter leading-none">
            The <span className="text-green-600">Nursery.</span>
          </h1>
        </div>

        {/* SORT BAR */}
        <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-xl border-y border-zinc-100 mb-12 -mx-4 px-4 md:-mx-6 md:px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">

            <div className="hidden md:flex items-center gap-8">
              {filterCategories.map((cat) => (
                <div key={cat.name} className="relative group cursor-pointer">
                  <div className="flex items-center gap-2 py-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-zinc-950 transition-colors">
                      {cat.name}
                    </span>
                    <ChevronDown size={12} className="text-zinc-300 group-hover:text-zinc-950 transition-transform group-hover:rotate-180" />
                  </div>

                  <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-zinc-100 shadow-2xl rounded-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">

                    {cat.options.map(opt => (
                      <button
                        key={opt}
                        onClick={() => {
                          if (cat.name === "Price") {
                            setPriceSort(opt);
                          }
                          if (cat.name === "Gender") {
                            setActiveGender(opt);
                          }
                        }}
                        className="w-full text-left px-4 py-2 text-[11px] font-bold text-zinc-600 hover:bg-zinc-50 hover:text-green-600 rounded-xl flex items-center justify-between"
                      >
                        {opt}
                        {(priceSort === opt || activeGender === opt) && <Check size={12} />}
                      </button>
                    ))}

                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between w-full md:w-auto md:gap-8">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                Showing {processedKittens.length} Little Ones
              </p>
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-950 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-all"
              >
                <Filter size={12} /> Filter
              </button>
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 pb-32">

          {loading ? (
            <p className="col-span-full text-center text-zinc-400 font-bold">
              Loading kittens...
            </p>
          ) : processedKittens.length === 0 ? (
            <p className="col-span-full text-center text-zinc-400 font-bold">
              No kittens available right now
            </p>
          ) : (
            processedKittens.map((cat) => (
              <motion.div key={cat._id} className="flex flex-col group cursor-pointer">

                <div className="relative aspect-square rounded-[32px] overflow-hidden bg-zinc-50 mb-4">
                  <img 
                    src={cat.images?.[0] || "/placeholder.jpg"} 
                    alt={cat.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1s]"
                  />

                  <div className="absolute top-3 left-3">
                    <div className="px-2 py-1 rounded-xl text-[8px] font-black uppercase bg-white text-black">
                      {cat.status}
                    </div>
                  </div>
                </div>

                <div className="px-2">
                  <div className="flex justify-between">
                    <h3 className="font-black">{cat.name}</h3>
                    <span className="text-green-600 font-black">
                      ${cat.price}
                    </span>
                  </div>

                  <Link to={`/kitten/${cat._id}`}>
                    <button className="w-full mt-3 py-2 bg-zinc-100 hover:bg-zinc-900 hover:text-white rounded-xl text-xs font-black uppercase">
                      View Profile
                    </button>
                  </Link>
                </div>

              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* MOBILE FILTER */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div 
              onClick={() => setIsFilterOpen(false)} 
              className="fixed inset-0 bg-black/30" 
            />
            <motion.div className="fixed bottom-0 left-0 right-0 bg-white p-6 rounded-t-3xl">
              <button onClick={() => setIsFilterOpen(false)}>
                <X />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AvailableKittens;