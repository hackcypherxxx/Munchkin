import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getKittens } from '../features/kitten/kittenSlice';
import { ArrowUpRight, Sparkles, RefreshCw } from 'lucide-react';
import KittenCard from './KittenCard';

export default function FeaturedDiscovery() {
  const dispatch = useDispatch();
  const { kittens, loading, error } = useSelector((state) => state.kitten);
  const { settings } = useSelector((state) => state.settings);
  const activeSettings = Array.isArray(settings) ? settings[0] : settings;
  const catteryLocation = activeSettings?.mainLocation || 'Owego, NY';
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredKittens = useMemo(() => {
    const list = Array.isArray(kittens) ? kittens : [];
    if (activeFilter === 'available') {
      return list.filter((k) => k.status === 'Available');
    }
    if (activeFilter === 'shorthair') {
      return list.filter(
        (k) => k.coat && k.coat.toLowerCase().includes('short')
      );
    }
    if (activeFilter === 'standard') {
      return list.filter(
        (k) =>
          k.coat &&
          (k.coat.toLowerCase().includes('standard') ||
            k.coat.toLowerCase().includes('long'))
      );
    }
    return list;
  }, [kittens, activeFilter]);

  const displayedKittens = filteredKittens.slice(0, 6);

  return (
    <section className="py-20 sm:py-28 bg-[#faf8f5] border-b border-[#181615]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9e5a3c]">
              <Sparkles size={13} /> Current Nursery Litter
            </span>
            <h2 className="mt-3 font-serif text-3xl sm:text-5xl font-medium text-[#181615] tracking-tight leading-[1.08]">
              Meet our available Munchkin kittens.
            </h2>
            <p className="mt-3 text-base text-[#575049] leading-relaxed">
              Click anywhere on a kitten’s card to explore their full multi-photo gallery,
              veterinary vaccination history, and individual adoption profile.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: `All Kittens (${kittens?.length || 0})` },
              {
                id: 'available',
                label: `Available (${Array.isArray(kittens)
                    ? kittens.filter((k) => k.status === 'Available').length
                    : 0
                  })`,
              },
              { id: 'shorthair', label: 'Shorthair' },
              { id: 'standard', label: 'Standard & Longhair' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${activeFilter === tab.id
                    ? 'bg-[#181615] text-white shadow-xs'
                    : 'bg-[#f3efea] text-[#575049] hover:bg-[#e8e1d5] hover:text-[#181615]'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (!kittens || kittens.length === 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="rounded-[24px] bg-white border border-[#181615]/8 overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/4.7] bg-[#f3efea]" />
                <div className="p-6 space-y-3">
                  <div className="h-7 w-1/2 bg-[#f3efea] rounded-lg" />
                  <div className="h-4 w-2/3 bg-[#f3efea] rounded-lg" />
                  <div className="h-10 w-full bg-[#f3efea] rounded-lg mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (!kittens || kittens.length === 0) && (
          <div className="rounded-3xl bg-white border border-[#181615]/10 p-12 text-center max-w-xl mx-auto">
            <p className="font-serif text-2xl font-medium text-[#181615]">
              Unable to load nursery listings right now
            </p>
            <p className="mt-2 text-sm text-[#575049]">
              {error || 'Please check your connection and try refreshing the nursery feed.'}
            </p>
            <button
              type="button"
              onClick={() => dispatch(getKittens())}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#181615] text-white text-xs font-semibold"
            >
              <RefreshCw size={14} /> Retry Loading Kittens
            </button>
          </div>
        )}

        {/* Kittens Grid */}
        {displayedKittens.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {displayedKittens.map((kitten, idx) => (
              <KittenCard key={kitten._id} kitten={kitten} priority={idx < 3} />
            ))}
          </div>
        )}

        {/* Bottom Bar CTA */}
        <div className="mt-12 pt-8 border-t border-[#181615]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#575049]">
            Showing <span className="font-semibold text-[#181615]">{displayedKittens.length}</span>{' '}
            of <span className="font-semibold text-[#181615]">{kittens?.length || 0}</span> kittens
            in our {catteryLocation} nursery.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/available-kittens"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#181615] hover:bg-[#9e5a3c] text-white text-xs sm:text-sm font-semibold transition-colors"
            >
              View All {kittens?.length || ''} Kittens & Filter
              <ArrowUpRight size={16} />
            </Link>
            <Link
              to="/upcoming-litters"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-[#f3efea] hover:bg-[#e8e1d5] text-[#181615] text-xs sm:text-sm font-semibold transition-colors"
            >
              See Upcoming Litters
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
