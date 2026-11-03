import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  ShieldCheck,
  Heart,
  Stethoscope,
  Home,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';
import { CATTERY_PHOTOS } from '../utils/kittenFormatters';

const getBreedTabs = (location) => [
  {
    id: 'temperament',
    label: 'Affectionate Temperament',
    eyebrow: 'People-Oriented Companions',
    title: 'Playful, curious, and deeply devoted to indoor family life.',
    description:
      `Munchkin kittens are cherished for their outgoing, gentle nature. Raised directly in our living spaces in ${location}, our kittens are accustomed to normal household sounds, gentle handling, and interactive play from their earliest weeks.`,
    highlights: [
      'Raised underfoot in a calm indoor family environment',
      'Confident, socialized disposition with adults and children',
      'Fully litter-box trained and accustomed to scratching posts',
    ],
    image: CATTERY_PHOTOS.editorialCuddle,
    caption: `Clover — 8-week-old Shorthair Munchkin in our nursery`,
  },
  {
    id: 'coat',
    label: 'Coat & Colour Varieties',
    eyebrow: 'Plush Shorthair & Silky Longhair',
    title: 'From golden shaded & bi-colour to classic tabby and pure white.',
    description:
      'Our nursery produces both plush shorthair and silky standard/longhair coats. Every kitten’s profile lists their exact coat length, colour pattern, and eye colour alongside multiple natural-light photographs.',
    highlights: [
      'Shorthair, Standard, and Longhair coat textures',
      'Golden Shaded, Brown Tabby & White, Golden Bi-Color, and Pure White',
      'Expressive Sapphire Blue, Midnight Blue, and Blue-Green eyes',
    ],
    image: CATTERY_PHOTOS.editorialGolden,
    caption: 'Apricot — Golden Shaded Shorthair Munchkin',
  },
  {
    id: 'conformation',
    label: 'Conformation & Ear Styles',
    eyebrow: 'Sound Structure & Mobility',
    title: 'Balanced proportions bred with veterinary oversight.',
    description:
      'We pair our breeding cats carefully to support healthy spine alignment, energetic mobility, and sound structure. Individual kitten listings clearly note whether a kitten has standard or folded ears and standard or rug-hugger leg proportions.',
    highlights: [
      'Careful pairing protocols prioritizing structural soundness',
      'Transparent individual specs for Ear Type and Leg Style',
      'Examined by our licensed veterinarian prior to placement',
    ],
    image: CATTERY_PHOTOS.heroTertiary,
    caption: 'Lunin — White Longhair Male with Folded Ears',
  },
  {
    id: 'veterinary',
    label: 'Veterinary Protocol',
    eyebrow: 'Documented Medical Care',
    title: 'Complete vaccination, deworming, and microchip records included.',
    description:
      `Before leaving our ${location} nursery, every kitten completes a thorough physical examination with a licensed veterinarian. Families receive the signed health certificate, vaccination log, and our written 72-hour general & 2-year genetic guarantee.`,
    highlights: [
      'Age-appropriate core FVRCP vaccination series',
      'Routine preventative deworming & fecal screening',
      'Registered microchip identification & starter transition pack',
    ],
    image: CATTERY_PHOTOS.editorialPortrait,
    caption: 'Muffin — Golden Bi-Color Female, Vet-Examined & Vaccinated',
  },
];

export default function TrustPillars() {
  const { settings } = useSelector((state) => state.settings);
  const activeSettings = Array.isArray(settings) ? settings[0] : settings;
  const catteryLocation = activeSettings?.mainLocation || 'Owego, NY';

  const tabs = getBreedTabs(catteryLocation);
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <div className="bg-[#f3efea] border-b border-[#181615]/10">
      {/* PART 1: Raycast-Style Editorial Brand Statement + Photo Bento */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9e5a3c]">
            <Home size={13} /> Our {catteryLocation} Home Nursery
          </span>
          <h2 className="mt-4 font-serif text-3xl sm:text-5xl font-medium text-[#181615] tracking-tight leading-[1.12]">
            It’s not about high-volume breeding.{' '}
            <span className="text-[#8a8075] font-normal">
              It’s about raising healthy, well-adjusted kittens inside a loving home where every
              detail of their early life is cared for.
            </span>
          </h2>
        </div>

        {/* Asymmetric Photography Bento Grid */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Large Feature Tile (7 cols) */}
          <div className="lg:col-span-7 group relative rounded-[28px] overflow-hidden bg-[#181615] text-white min-h-[420px] flex flex-col justify-end p-7 sm:p-10">
            <img
              src={CATTERY_PHOTOS.editorialNursery}
              alt={`Munchkin kitten raised indoors in ${catteryLocation}`}
              className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#181615] via-[#181615]/45 to-transparent" />
            <div className="relative z-10 max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-semibold uppercase tracking-wider text-[#f5ebe6]">
                <Heart size={12} className="text-[#e8b496]" /> Underfoot Socialization
              </span>
              <h3 className="mt-3 font-serif text-3xl sm:text-4xl font-medium leading-tight">
                Never kept in cages—nurtured daily in our living space.
              </h3>
              <p className="mt-2.5 text-sm text-white/80 leading-relaxed">
                From birth through placement at 7–10+ weeks, our kittens experience gentle human
                touch, household routines, and structured enrichment so they transition effortlessly
                into your home.
              </p>
            </div>
          </div>

          {/* Right Stacked Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex-1 rounded-[28px] bg-white border border-[#181615]/10 p-7 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="h-11 w-11 rounded-2xl bg-[#ebf1ee] text-[#263b30] flex items-center justify-center">
                  <Stethoscope size={20} />
                </div>
                <h3 className="mt-5 font-serif text-2xl sm:text-3xl font-semibold text-[#181615]">
                  Licensed Veterinary Health Protocol
                </h3>
                <p className="mt-2 text-sm text-[#575049] leading-relaxed">
                  Every kitten receives a comprehensive nose-to-tail veterinary exam, age-appropriate
                  FVRCP vaccinations, routine deworming, and microchip identification before going
                  home.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#181615]/8 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#263b30]">
                  Signed Vet Certificate Included
                </span>
                <Link
                  to="/health"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#181615] hover:text-[#9e5a3c]"
                >
                  Read Health Guarantee <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>

            <div className="flex-1 rounded-[28px] bg-[#181615] text-white p-7 sm:p-8 flex flex-col justify-between">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#e8b496]">
                    Transparent Pricing
                  </span>
                  <h3 className="mt-2 font-serif text-2xl sm:text-3xl font-medium">
                    $350 – $500 Adoption Fee
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-white/75 leading-relaxed">
                    Honest, accessible pricing for home-raised Munchkin kittens—complete with
                    medical records, microchip, and a 2-year genetic warranty.
                  </p>
                </div>
                <img
                  src={CATTERY_PHOTOS.editorialWhite}
                  alt="Jollie white Munchkin kitten"
                  className="h-20 w-20 rounded-2xl object-cover border border-white/15 shrink-0"
                />
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-white/70">Local {catteryLocation} Pickup or Flight Nanny</span>
                <Link
                  to="/pricing-deposit"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#e8b496] hover:text-white"
                >
                  Pricing Details <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PART 2: Interactive Munchkin Breed & Care Showcase */}
      <section className="py-20 sm:py-24 bg-white border-t border-[#181615]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9e5a3c]">
                <Sparkles size={13} /> Breed Characteristics & Care
              </span>
              <h2 className="mt-3 font-serif text-3xl sm:text-5xl font-medium text-[#181615] tracking-tight">
                Understanding the Munchkin breed.
              </h2>
            </div>

            {/* Interactive Tab Switcher */}
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${activeTab === tab.id
                    ? 'bg-[#181615] text-white shadow-xs'
                    : 'bg-[#f3efea] text-[#575049] hover:bg-[#e8e1d5] hover:text-[#181615]'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Tab Showcase Card */}
          <div className="rounded-[28px] bg-[#faf8f5] border border-[#181615]/10 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-6 p-7 sm:p-12 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9e5a3c]">
                  {currentTab.eyebrow}
                </span>
                <h3 className="mt-3 font-serif text-3xl sm:text-4xl font-medium text-[#181615] leading-tight">
                  {currentTab.title}
                </h3>
                <p className="mt-4 text-sm sm:text-base text-[#575049] leading-relaxed">
                  {currentTab.description}
                </p>

                <ul className="mt-6 space-y-3">
                  {currentTab.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-[#181615]">
                      <CheckCircle2 size={17} className="text-[#263b30] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-[#181615]/10 flex flex-wrap items-center gap-4">
                <Link
                  to="/available-kittens"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#181615] hover:bg-[#9e5a3c] text-white text-xs font-semibold transition-colors"
                >
                  Browse Available Kittens <ArrowUpRight size={14} />
                </Link>
                <Link
                  to="/care-guide"
                  className="text-xs font-semibold text-[#575049] hover:text-[#181615] transition-colors"
                >
                  Read Our Full Kitten Care Guide →
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 relative min-h-[340px] sm:min-h-[440px] bg-[#f3efea]">
              <img
                src={currentTab.image}
                alt={currentTab.caption}
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-4 inset-x-4 px-4 py-2.5 rounded-2xl bg-[#181615]/75 backdrop-blur-md text-white text-xs font-medium flex items-center justify-between">
                <span>{currentTab.caption}</span>
                <span className="font-mono text-[10px] text-[#e8b496] uppercase">
                  Authentic Nursery Photo
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
