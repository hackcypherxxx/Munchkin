import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getKittens } from '../features/kitten/kittenSlice';
import KittenCard from '../components/KittenCard';
import PageMeta from '../components/PageMeta';
import {
  Search,
  SlidersHorizontal,
  X,
  ShieldCheck,
  RefreshCw,
  ArrowUpRight,
  Phone,
} from 'lucide-react';
import { getKittenPresentation } from '../utils/kittenFormatters';

export default function AvailableKittens() {
  const dispatch = useDispatch();
  const { kittens, loading, error } = useSelector((state) => state.kitten);
  const { settings } = useSelector((state) => state.settings);
  const activeSettings = Array.isArray(settings) ? settings[0] : settings;
  const catteryLocation = activeSettings?.mainLocation?.trim() || '';
  const catteryPhone = activeSettings?.phoneNumber || '+1 (607) 223-4177';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [coatFilter, setCoatFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    dispatch(getKittens());
  }, [dispatch]);

  const rawList = Array.isArray(kittens) ? kittens : [];
  const availableCount = rawList.filter((k) => k.status === 'Available').length;

  const filteredKittens = useMemo(() => {
    return rawList
      .filter((k) => {
        if (statusFilter !== 'all' && k.status?.toLowerCase() !== statusFilter) {
          return false;
        }
        if (genderFilter !== 'all' && k.gender?.toLowerCase() !== genderFilter) {
          return false;
        }
        if (coatFilter !== 'all') {
          const coatVal = (k.coat || '').toLowerCase();
          if (!coatVal.includes(coatFilter)) return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const pres = getKittenPresentation(k);
          const haystack = [
            k.name,
            k.registryId,
            k.gender,
            k.coat,
            pres.specs.color,
            pres.specs.eyeColor,
            pres.specs.earType,
            pres.badgeLabel,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return (Number(a.price) || 0) - (Number(b.price) || 0);
        if (sortBy === 'price-desc') return (Number(b.price) || 0) - (Number(a.price) || 0);
        if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
        const aAvail = a.status === 'Available' ? 1 : 0;
        const bAvail = b.status === 'Available' ? 1 : 0;
        if (aAvail !== bAvail) return bAvail - aAvail;
        return ((b.isFeatured || b.featured) ? 1 : 0) - ((a.isFeatured || a.featured) ? 1 : 0);
      });
  }, [rawList, statusFilter, genderFilter, coatFilter, searchQuery, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'all' ||
    genderFilter !== 'all' ||
    coatFilter !== 'all' ||
    sortBy !== 'featured';

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setGenderFilter('all');
    setCoatFilter('all');
    setSortBy('featured');
  };

  return (
    <main className="min-h-screen bg-[#faf8f5] pb-24">
      <PageMeta
        title="Available Munchkin Kittens"
        description={`Browse available home-raised Munchkin kittens${catteryLocation ? ` in ${catteryLocation}` : ''}. Filter by gender, coat length, and availability. Click any card for multi-photo profiles.`}
      />

      {/* Page Header */}
      <section className="bg-[#f3efea] border-b border-[#181615]/10 pt-10 pb-12 sm:pt-14 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#181615]/10 text-xs font-semibold text-[#263b30]">
                <span className="h-2 w-2 rounded-full bg-[#2e7d52] animate-pulse" />
                {availableCount} Available for Reservation{catteryLocation ? ` · ${catteryLocation}` : ''}
              </div>
              <h1 className="mt-4 font-serif text-4xl sm:text-6xl font-medium text-[#181615] tracking-tight leading-[1.05]">
                Available Munchkin Kittens
              </h1>
              <p className="mt-3 text-base sm:text-lg text-[#575049] leading-relaxed">
                Each kitten below is raised indoors with our family{catteryLocation ? ` in ${catteryLocation}` : ''}, examined
                by a licensed veterinarian, vaccinated, and microchipped. Click anywhere on a card
                to view all photos and details.
              </p>
            </div>

            {/* Quick Assurance Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
              <div className="rounded-2xl bg-white border border-[#181615]/8 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8a8075]">
                  Adoption Fee
                </p>
                <p className="mt-0.5 font-mono text-base font-semibold text-[#181615]">
                  $350 – $500
                </p>
              </div>
              <div className="rounded-2xl bg-white border border-[#181615]/8 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8a8075]">
                  Health Warranty
                </p>
                <p className="mt-0.5 text-sm font-semibold text-[#181615]">72-Hr + 2-Year</p>
              </div>
              <div className="col-span-2 sm:col-span-1 rounded-2xl bg-white border border-[#181615]/8 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8a8075]">
                  Transport
                </p>
                <p className="mt-0.5 text-sm font-semibold text-[#181615]">
                  {catteryLocation ? `${catteryLocation} Pickup / Courier` : 'Local Pickup / Courier'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Search Toolbar */}
      <section className="sticky top-20 z-30 bg-[#faf8f5]/95 backdrop-blur-xl border-b border-[#181615]/10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a8075]"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, colour, eye colour, or ID..."
                aria-label="Search kittens"
                className="w-full pl-10 pr-9 py-2.5 rounded-full bg-white border border-[#181615]/15 text-xs sm:text-sm text-[#181615] placeholder:text-[#8a8075] focus:outline-none focus:border-[#9e5a3c]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8075] hover:text-[#181615]"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter Selects & Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-full bg-[#f3efea] p-1 border border-[#181615]/8">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'available', label: 'Available' },
                  { id: 'reserved', label: 'Reserved' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setStatusFilter(opt.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                      statusFilter === opt.id
                        ? 'bg-[#181615] text-white'
                        : 'text-[#575049] hover:text-[#181615]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                aria-label="Filter by gender"
                className="px-3.5 py-2 rounded-full bg-white border border-[#181615]/15 text-xs font-semibold text-[#181615] cursor-pointer"
              >
                <option value="all">All Genders</option>
                <option value="female">Females</option>
                <option value="male">Males</option>
              </select>

              <select
                value={coatFilter}
                onChange={(e) => setCoatFilter(e.target.value)}
                aria-label="Filter by coat length"
                className="px-3.5 py-2 rounded-full bg-white border border-[#181615]/15 text-xs font-semibold text-[#181615] cursor-pointer"
              >
                <option value="all">All Coat Styles</option>
                <option value="short">Shorthair</option>
                <option value="standard">Standard</option>
                <option value="long">Longhair</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort kittens"
                className="px-3.5 py-2 rounded-full bg-white border border-[#181615]/15 text-xs font-semibold text-[#181615] cursor-pointer"
              >
                <option value="featured">Sort: Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-[#f5ebe6] text-[#84472c] text-xs font-semibold hover:bg-[#e8d5cb] transition-colors cursor-pointer"
                >
                  <X size={13} /> Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Listing Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex items-center justify-between mb-6 text-xs sm:text-sm text-[#575049]">
          <p>
            Showing <strong className="text-[#181615]">{filteredKittens.length}</strong> of{' '}
            <strong className="text-[#181615]">{rawList.length}</strong> kittens
          </p>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-[#263b30]">
            <ShieldCheck size={14} /> Click any card to view full gallery & medical records
          </span>
        </div>

        {/* Loading Skeleton */}
        {loading && rawList.length === 0 && (
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
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && rawList.length === 0 && (
          <div className="rounded-3xl bg-white border border-[#181615]/10 p-12 text-center max-w-lg mx-auto my-8">
            <h2 className="font-serif text-2xl font-semibold text-[#181615]">
              Could not load nursery listings
            </h2>
            <p className="mt-2 text-sm text-[#575049]">
              {error || 'Please try refreshing the page.'}
            </p>
            <button
              type="button"
              onClick={() => dispatch(getKittens())}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#181615] text-white text-xs font-semibold"
            >
              <RefreshCw size={14} /> Try Again
            </button>
          </div>
        )}

        {/* Empty Filter Match State */}
        {!loading && rawList.length > 0 && filteredKittens.length === 0 && (
          <div className="rounded-3xl bg-white border border-[#181615]/10 p-12 text-center max-w-lg mx-auto my-8">
            <SlidersHorizontal size={28} className="mx-auto text-[#9e5a3c]" />
            <h2 className="mt-4 font-serif text-2xl font-semibold text-[#181615]">
              No kittens match those exact filters
            </h2>
            <p className="mt-2 text-sm text-[#575049]">
              Try clearing one of your filters or browse all {rawList.length} kittens in our nursery.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#181615] text-white text-xs font-semibold cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Kittens Grid */}
        {filteredKittens.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredKittens.map((kitten, idx) => (
              <KittenCard key={kitten._id} kitten={kitten} priority={idx < 3} />
            ))}
          </div>
        )}

        {/* Bottom Help Banner */}
        <div className="mt-16 rounded-[28px] bg-[#181615] text-white p-8 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#e8b496]">
              Personal Matching Assistance
            </span>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-medium">
              Not sure which kitten best fits your household?
            </h2>
            <p className="mt-2 text-sm text-white/75 leading-relaxed">
              Reach out to us directly or submit a general adoption application—we know each
              kitten’s daily personality and are happy to guide you.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {catteryPhone && (
              <a
                href={`tel:${catteryPhone.replace(/[^\d+]/g, '')}`}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold transition-colors"
              >
                <Phone size={14} className="text-[#e8b496]" />
                Call/Text: {catteryPhone}
              </a>
            )}
            <Link
              to="/apply"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#9e5a3c] hover:bg-[#b87354] text-white text-xs sm:text-sm font-semibold transition-colors"
            >
              Start Adoption Application <ArrowUpRight size={15} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold transition-colors"
            >
              Ask a Question
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
