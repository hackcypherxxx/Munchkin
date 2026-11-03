import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  MapPin,
  Stethoscope,
  Star,
} from 'lucide-react';
import { CATTERY_PHOTOS, getKittenPresentation } from '../utils/kittenFormatters';

export default function Hero() {
  const { kittens } = useSelector((state) => state.kitten);
  const { settings } = useSelector((state) => state.settings);
  const { stats } = useSelector((state) => state.review);

  const activeSettings = Array.isArray(settings) ? settings[0] : settings;
  const catteryLocation = activeSettings?.mainLocation || 'Owego, NY';

  const availableKittens = Array.isArray(kittens)
    ? kittens.filter((k) => k.status === 'Available')
    : [];

  // Build showcase slides from live database kittens, falling back only to real cattery photos while loading
  const showcaseSlides =
    availableKittens.length >= 3
      ? availableKittens.slice(0, 4).map((k) => {
          const pres = getKittenPresentation(k);
          return {
            id: k._id,
            name: k.name,
            subtitle: `${k.gender} · ${pres.ageLabel} · ${pres.specs.color || k.coat}`,
            price: `$${k.price}`,
            status: k.status,
            location: k.location || catteryLocation,
            image: pres.primaryImage,
            link: `/kitten/${k._id}`,
          };
        })
      : [
          {
            id: 'clover',
            name: 'Clover',
            subtitle: 'Female · 8 Weeks · Brown Tabby & White',
            price: '$500',
            status: 'Available',
            location: catteryLocation,
            image: CATTERY_PHOTOS.heroPrimary,
            link: '/available-kittens',
          },
          {
            id: 'apricot',
            name: 'Apricot',
            subtitle: 'Female · 8 Weeks · Golden Shaded',
            price: '$500',
            status: 'Available',
            location: catteryLocation,
            image: CATTERY_PHOTOS.heroSecondary,
            link: '/available-kittens',
          },
          {
            id: 'lunin',
            name: 'Lunin',
            subtitle: 'Male · 10 Weeks · White Longhair',
            price: '$500',
            status: 'Available',
            location: catteryLocation,
            image: CATTERY_PHOTOS.heroTertiary,
            link: '/available-kittens',
          },
          {
            id: 'muffin',
            name: 'Muffin',
            subtitle: 'Female · 7 Weeks · Golden Bi-Color',
            price: '$400',
            status: 'Available',
            location: catteryLocation,
            image: CATTERY_PHOTOS.heroQuaternary,
            link: '/available-kittens',
          },
        ];

  const [activeIndex, setActiveIndex] = useState(0);
  const currentSlide = showcaseSlides[activeIndex] || showcaseSlides[0];

  return (
    <section className="relative overflow-hidden bg-[#faf8f5] pt-6 pb-16 sm:pt-10 sm:pb-24 lg:pt-12 lg:pb-28 border-b border-[#181615]/10">
      {/* Subtle warm radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-0 h-[520px] w-[520px] rounded-full bg-[#e8b496]/20 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-10 h-[420px] w-[420px] rounded-full bg-[#dfd8cc]/40 blur-[110px]"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Editorial Column (7 cols) */}
          <div className="lg:col-span-7 space-y-7 min-w-0">
            {/* Live Nursery Pill */}
            <div className="inline-flex flex-wrap items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#f3efea] border border-[#181615]/10">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#263b30]">
                <span className="h-2 w-2 rounded-full bg-[#2e7d52] animate-pulse" />
                {availableKittens.length > 0
                  ? `${availableKittens.length} Kittens Ready for Reservation`
                  : 'Current Litter Open for Reservation'}
              </span>
              <span className="text-[#181615]/20">·</span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-[#575049]">
                <MapPin size={12} className="text-[#9e5a3c]" />
                {catteryLocation}
              </span>
            </div>

            {/* Editorial Headline */}
            <div className="space-y-4">
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-[66px] font-medium text-[#181615] tracking-tight leading-[1.03]">
                Hand-raised Munchkin companions,{' '}
                <span className="italic font-normal text-[#9e5a3c]">
                  nurtured in our home
                </span>{' '}
                for yours.
              </h1>
              <p className="text-base sm:text-lg text-[#575049] leading-relaxed max-w-2xl">
                Every MunchkinKittie kitten grows up underfoot in our {catteryLocation} family
                nursery with daily gentle handling, licensed veterinary examinations, age-appropriate
                vaccinations, and a written health guarantee.
              </p>
            </div>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <Link
                to="/available-kittens"
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-[#181615] hover:bg-[#9e5a3c] text-white text-sm font-semibold tracking-wide transition-all shadow-sm"
              >
                Meet Available Kittens
                <ArrowUpRight size={17} />
              </Link>
              <Link
                to="/apply"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white hover:bg-[#f3efea] text-[#181615] border border-[#181615]/15 text-sm font-semibold transition-colors"
              >
                Adoption Application
              </Link>
            </div>

            {/* Architectural Trust Metrics Bar */}
            <div className="pt-6 border-t border-[#181615]/10 grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#8a8075]">
                  <Stethoscope size={14} className="text-[#263b30]" />
                  Veterinary Care
                </div>
                <p className="mt-1 font-serif text-2xl sm:text-3xl font-semibold text-[#181615]">
                  100% Vet-Cleared
                </p>
                <p className="text-xs text-[#575049] mt-0.5">
                  Vaccinated, dewormed & microchipped
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#8a8075]">
                  <ShieldCheck size={14} className="text-[#9e5a3c]" />
                  Written Protection
                </div>
                <p className="mt-1 font-serif text-2xl sm:text-3xl font-semibold text-[#181615]">
                  2-Year Warranty
                </p>
                <p className="text-xs text-[#575049] mt-0.5">
                  Plus 72-hour general health guarantee
                </p>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#8a8075]">
                  <Star size={14} className="text-[#c58b38] fill-[#c58b38]" />
                  Adopter Rating
                </div>
                <p className="mt-1 font-serif text-2xl sm:text-3xl font-semibold text-[#181615]">
                  {stats?.avgRating ? `${Number(stats.avgRating).toFixed(1)} / 5.0` : '5.0 / 5.0'}
                </p>
                <p className="text-xs text-[#575049] mt-0.5">
                  Verified families across the US
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Portrait Gallery Stage (5 cols) */}
          <div className="lg:col-span-5 min-w-0">
            <div className="relative">
              {/* Main Featured Kitten Link Card */}
              <Link
                to={currentSlide.link}
                className="group relative block aspect-[4/4.8] w-full rounded-[28px] overflow-hidden bg-[#f3efea] border border-[#181615]/12 editorial-shadow"
              >
                <img
                  src={currentSlide.image}
                  alt={`${currentSlide.name} — Munchkin kitten in ${currentSlide.location}`}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181615]/80 via-[#181615]/15 to-transparent" />

                {/* Top Floating Badge */}
                <div className="absolute top-4 inset-x-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-[#263b30] text-[11px] font-semibold uppercase tracking-wider shadow-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2e7d52]" />
                    {currentSlide.status}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#181615]/70 backdrop-blur-md text-white text-[11px] font-medium">
                    <Sparkles size={11} className="text-[#e8b496]" />
                    Nursery Portrait
                  </span>
                </div>

                {/* Bottom Kitten Info Glass Card */}
                <div className="absolute bottom-4 inset-x-4 p-4 sm:p-5 rounded-2xl bg-[#181615]/75 backdrop-blur-md border border-white/15 text-white flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-medium text-[#e8b496] uppercase tracking-wider">
                      {currentSlide.location}
                    </p>
                    <h2 className="font-serif text-2xl sm:text-3xl font-semibold leading-tight mt-0.5">
                      {currentSlide.name}
                    </h2>
                    <p className="text-xs text-white/80 mt-1">{currentSlide.subtitle}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono text-xl font-semibold text-white">
                      {currentSlide.price}
                    </p>
                    <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[#e8b496] group-hover:translate-x-0.5 transition-transform">
                      View Profile <ArrowUpRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>

              {/* Thumbnail Portrait Switcher Strip */}
              <div className="mt-3.5 grid grid-cols-4 gap-2.5">
                {showcaseSlides.map((slide, idx) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`Preview ${slide.name}`}
                    className={`group relative rounded-2xl overflow-hidden border text-left transition-all cursor-pointer ${
                      idx === activeIndex
                        ? 'border-[#9e5a3c] ring-2 ring-[#9e5a3c]/25 bg-white'
                        : 'border-[#181615]/10 opacity-75 hover:opacity-100 bg-white'
                    }`}
                  >
                    <div className="aspect-[4/3.4] w-full overflow-hidden bg-[#f3efea]">
                      <img
                        src={slide.image}
                        alt={slide.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="px-2 py-1.5 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#181615] truncate">
                        {slide.name}
                      </span>
                      <span className="text-[10px] font-mono text-[#575049]">{slide.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
