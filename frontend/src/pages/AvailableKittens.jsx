import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  X, ChevronDown, Filter, Check, Sparkles, Search, SlidersHorizontal 
} from 'lucide-react';
import { getKittens } from '../features/kitten/kittenSlice';

const AvailableKittens = () => { 
  const dispatch = useDispatch();
  const { kittens, loading } = useSelector((state) => state.kitten);

  // Filter states
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeGender, setActiveGender] = useState('All');
  const [priceSort, setPriceSort] = useState(null);
  const [activeStatus, setActiveStatus] = useState('All');
  const [activeCoat, setActiveCoat] = useState('All');
  const [ageRange, setAgeRange] = useState({ min: '', max: '' });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(getKittens());
  }, [dispatch]);

  // Static coat options (adjust to match your data)
  const coatTypes = ['All', 'Standard', 'Shorthair', 'Longhair'];
  const statusTypes = ['All', 'Available', 'Reserved', 'Adopted'];

  // Main processing pipeline
  const processedKittens = useMemo(() => {
    let data = [...(kittens || [])];

    // Quick search (name or registryId)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(k => 
        k.name?.toLowerCase().includes(q) || 
        k.registryId?.toLowerCase().includes(q)
      );
    }

    // Gender filter
    if (activeGender !== "All") {
      data = data.filter((k) => {
        const directGender = k.gender?.toLowerCase() === activeGender.toLowerCase();
        const specGender = k.specs?.find(s => s.label.toLowerCase() === "gender")
                           ?.value?.toLowerCase() === activeGender.toLowerCase();
        return directGender || specGender;
      });
    }

    // Status filter
    if (activeStatus !== "All") {
      data = data.filter(k => k.status?.toLowerCase() === activeStatus.toLowerCase());
    }

    // Coat filter (direct field or inside specs)
    if (activeCoat !== "All") {
      data = data.filter((k) => {
        const directCoat = k.coat?.toLowerCase() === activeCoat.toLowerCase();
        const specCoat = k.specs?.find(s => s.label.toLowerCase() === "coat")
                         ?.value?.toLowerCase() === activeCoat.toLowerCase();
        return directCoat || specCoat;
      });
    }

    // Age range filter (uses ageWeeks; adjust if age is stored differently)
    if (ageRange.min !== '') {
      data = data.filter(k => (k.ageWeeks || 0) >= Number(ageRange.min));
    }
    if (ageRange.max !== '') {
      data = data.filter(k => (k.ageWeeks || 0) <= Number(ageRange.max));
    }

    // Price sorting
    if (priceSort === "Low to High") {
      data.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (priceSort === "High to Low") {
      data.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    }

    return data;
  }, [kittens, priceSort, activeGender, activeStatus, activeCoat, ageRange, searchQuery]);

  // Status badge style
  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || '';
    if (s === 'reserved') return 'bg-amber-400 text-zinc-950';
    if (s === 'adopted') return 'bg-zinc-950 text-white';
    return 'bg-white text-zinc-950'; // Available
  };

  // Reset all filters
  const clearAllFilters = () => {
    setPriceSort(null);
    setActiveGender('All');
    setActiveStatus('All');
    setActiveCoat('All');
    setAgeRange({ min: '', max: '' });
    setSearchQuery('');
  };

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

        {/* DESKTOP FILTER BAR */}
        <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-xl border-y border-zinc-100 mb-12 -mx-4 px-4 md:-mx-6 md:px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">

            {/* Search field (desktop) */}
            <div className="hidden md:flex items-center gap-3 min-w-[200px]">
              <Search size={16} className="text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search name or ID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-b border-zinc-200 text-xs font-bold uppercase tracking-wider outline-none py-1 w-full"
              />
            </div>

            <div className="hidden md:flex items-center gap-8 ml-8">
              {/* Status filter */}
              <DropdownFilter 
                label="Status" 
                options={statusTypes} 
                active={activeStatus} 
                setActive={setActiveStatus} 
              />

              {/* Gender filter */}
              <DropdownFilter 
                label="Gender" 
                options={['All', 'Male', 'Female']} 
                active={activeGender} 
                setActive={setActiveGender} 
              />

              {/* Coat filter */}
              <DropdownFilter 
                label="Coat" 
                options={coatTypes} 
                active={activeCoat} 
                setActive={setActiveCoat} 
              />

              {/* Price filter */}
              <DropdownFilter 
                label="Price" 
                options={['Low to High', 'High to Low']} 
                active={priceSort} 
                setActive={setPriceSort} 
              />

              {/* Age range (compact inline) */}
              <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                <span>Age</span>
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={ageRange.min} 
                  onChange={(e) => setAgeRange(prev => ({ ...prev, min: e.target.value }))}
                  className="w-12 bg-zinc-50 rounded-md px-1 py-0.5 text-zinc-950 text-center outline-none"
                />
                <span>-</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={ageRange.max} 
                  onChange={(e) => setAgeRange(prev => ({ ...prev, max: e.target.value }))}
                  className="w-12 bg-zinc-50 rounded-md px-1 py-0.5 text-zinc-950 text-center outline-none"
                />
                <span>wks</span>
              </div>
            </div>

            <div className="flex items-center justify-between w-full md:w-auto md:gap-8">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                {processedKittens.length} kittens
              </p>
              
              {/* Mobile Filter Toggle */}
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="md:hidden flex items-center gap-2 px-4 py-2 bg-zinc-950 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-all"
              >
                <Filter size={12} /> Filter
              </button>
            </div>
          </div>
        </div>

        {/* KITTEN GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 pb-32">
          {loading ? (
            <p className="col-span-full text-center text-zinc-400 font-bold">Loading kittens…</p>
          ) : processedKittens.length === 0 ? (
            <p className="col-span-full text-center text-zinc-400 font-bold">
              No kittens match your criteria right now.
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
                    <div className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase shadow-sm tracking-widest ${getStatusBadge(cat.status)}`}>
                      {cat.status || 'Available'}
                    </div>
                  </div>
                </div>
                <div className="px-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-black text-lg">{cat.name}</h3>
                    <span className="text-green-600 font-black">${cat.price}</span>
                  </div>
                  {/* Additional quick info */}
                  <p className="text-[9px] font-bold text-zinc-400 uppercase mt-1">
                    {cat.gender} · {cat.coat || 'Standard'} · {cat.ageWeeks}wks
                  </p>
                  <Link to={`/kitten/${cat._id}`}>
                    <button className="w-full mt-3 py-2.5 bg-zinc-100 hover:bg-zinc-950 hover:text-white rounded-xl text-[10px] font-black tracking-widest uppercase transition-colors">
                      View Profile
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* MOBILE FILTER DRAWER (expanded) */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)} 
              className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 md:hidden" 
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed bottom-0 left-0 right-0 bg-white p-6 rounded-t-[40px] z-[60] md:hidden shadow-[0_-20px_40px_rgba(0,0,0,0.1)]"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black tracking-tighter uppercase">Filter & Sort</h3>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-zinc-100 rounded-full text-zinc-500">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-8 mb-8 max-h-[60vh] overflow-y-auto">
                {/* Search */}
                <div>
                  <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-3">Search</h4>
                  <input 
                    type="text" 
                    placeholder="Name or ID" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-3 bg-zinc-50 rounded-2xl text-xs font-bold uppercase"
                  />
                </div>

                {/* Status */}
                <div>
                  <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-3">Status</h4>
                  <div className="flex gap-2">
                    {statusTypes.map(s => (
                      <button key={s} onClick={() => setActiveStatus(s)}
                        className={`flex-1 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeStatus === s ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-500'}`}
                      >{s}</button>
                    ))}
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-3">Gender</h4>
                  <div className="flex gap-2">
                    {['All', 'Male', 'Female'].map(g => (
                      <button key={g} onClick={() => setActiveGender(g)}
                        className={`flex-1 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeGender === g ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-500'}`}
                      >{g}</button>
                    ))}
                  </div>
                </div>

                {/* Coat */}
                <div>
                  <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-3">Coat Type</h4>
                  <div className="flex flex-wrap gap-2">
                    {coatTypes.map(c => (
                      <button key={c} onClick={() => setActiveCoat(c)}
                        className={`px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeCoat === c ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-500'}`}
                      >{c}</button>
                    ))}
                  </div>
                </div>

                {/* Age Range */}
                <div>
                  <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-3">Age (weeks)</h4>
                  <div className="flex items-center gap-2">
                    <input type="number" placeholder="Min" value={ageRange.min}
                      onChange={(e) => setAgeRange(prev => ({ ...prev, min: e.target.value }))}
                      className="flex-1 p-3 bg-zinc-50 rounded-2xl text-xs font-bold text-center" />
                    <span className="text-zinc-400">to</span>
                    <input type="number" placeholder="Max" value={ageRange.max}
                      onChange={(e) => setAgeRange(prev => ({ ...prev, max: e.target.value }))}
                      className="flex-1 p-3 bg-zinc-50 rounded-2xl text-xs font-bold text-center" />
                  </div>
                </div>

                {/* Price Sort */}
                <div>
                  <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-3">Price</h4>
                  <div className="flex flex-col gap-2">
                    {['Low to High', 'High to Low'].map(p => (
                      <button key={p} onClick={() => setPriceSort(p === priceSort ? null : p)}
                        className={`w-full py-4 px-6 rounded-2xl text-[11px] font-black uppercase tracking-widest flex justify-between items-center transition-all ${priceSort === p ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-500'}`}
                      >{p}{priceSort === p && <Check size={16} />}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button onClick={clearAllFilters}
                  className="py-4 bg-zinc-100 rounded-[20px] text-[10px] font-black uppercase tracking-widest text-zinc-600">
                  Clear All
                </button>
                <button onClick={() => setIsFilterOpen(false)}
                  className="py-4 bg-green-600 rounded-[20px] text-[10px] font-black uppercase tracking-widest text-white">
                  View Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Reusable dropdown filter for desktop
const DropdownFilter = ({ label, options, active, setActive }) => (
  <div className="relative group cursor-pointer">
    <div className="flex items-center gap-2 py-2">
      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-zinc-950 transition-colors">
        {label}
      </span>
      <ChevronDown size={12} className="text-zinc-300 group-hover:text-zinc-950 transition-transform group-hover:rotate-180" />
    </div>
    <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-zinc-100 shadow-2xl rounded-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => setActive(opt === active ? null : opt)}
          className="w-full text-left px-4 py-2 text-[11px] font-bold text-zinc-600 hover:bg-zinc-50 hover:text-green-600 rounded-xl flex items-center justify-between"
        >
          {opt}
          {active === opt && <Check size={12} />}
        </button>
      ))}
    </div>
  </div>
);

export default AvailableKittens;