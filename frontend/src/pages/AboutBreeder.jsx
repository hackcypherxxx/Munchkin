import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PageMeta from '../components/PageMeta';
import {
  Heart,
  ShieldCheck,
  Stethoscope,
  Home,
  MapPin,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Phone,
} from 'lucide-react';
import { CATTERY_PHOTOS } from '../utils/kittenFormatters';

export default function AboutBreeder() {
  const { settings } = useSelector((state) => state.settings);
  const activeSettings = Array.isArray(settings) ? settings[0] : settings;
  const catteryLocation = activeSettings?.mainLocation?.trim() || '';
  const catteryPhone = activeSettings?.phoneNumber || '+1 (607) 223-4177';

  return (
    <main className="min-h-screen bg-[#faf8f5] pb-24">
      <PageMeta
        title={catteryLocation ? `About Our ${catteryLocation} Home Cattery` : 'About Our Home Cattery'}
        description={`Learn how MunchkinKittie raises affectionate, well-socialized Munchkin kittens indoors${catteryLocation ? ` in our ${catteryLocation} family home` : ' in our family home'}.`}
      />

      {/* Editorial Hero */}
      <section className="bg-[#f3efea] border-b border-[#181615]/10 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#181615]/10 text-xs font-semibold text-[#9e5a3c]">
              <MapPin size={13} /> {catteryLocation ? `Home-Based Cattery in ${catteryLocation}` : 'Home-Based Cattery'}
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-medium text-[#181615] tracking-tight leading-[1.05]">
              Raised underfoot in our family home—never in cages.
            </h1>
            <p className="text-base sm:text-lg text-[#575049] leading-relaxed max-w-2xl">
              At MunchkinKittie{catteryLocation ? ` in ${catteryLocation}` : ''}, our philosophy is simple: healthy, confident
              kittens come from calm indoor homes where mothers and babies receive unhurried daily
              affection, attentive nutrition, and thorough veterinary care.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <Link
                to="/available-kittens"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#181615] hover:bg-[#9e5a3c] text-white text-xs sm:text-sm font-semibold transition-colors"
              >
                Meet Our Available Kittens <ArrowUpRight size={15} />
              </Link>
              <Link
                to="/health"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-[#e8e1d5] text-[#181615] border border-[#181615]/12 text-xs sm:text-sm font-semibold transition-colors"
              >
                Our Health Guarantee
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="aspect-[4/4.3] rounded-[28px] overflow-hidden bg-white border border-[#181615]/10 editorial-shadow">
              <img
                src={CATTERY_PHOTOS.editorialCuddle}
                alt={`Munchkin kitten raised indoors${catteryLocation ? ` in ${catteryLocation}` : ''}`}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Commitments */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          <div className="rounded-[28px] bg-white border border-[#181615]/10 p-7 sm:p-8 space-y-4">
            <div className="h-11 w-11 rounded-2xl bg-[#f5ebe6] text-[#9e5a3c] flex items-center justify-center">
              <Home size={20} />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#181615]">
              Indoor Family Upbringing
            </h2>
            <p className="text-sm text-[#575049] leading-relaxed">
              Our kittens grow up inside our{catteryLocation ? ` ${catteryLocation}` : ''} home alongside everyday household
              sights and sounds. By the time they join your family, they are confident, affectionate,
              litter-box trained, and accustomed to gentle handling.
            </p>
          </div>

          <div className="rounded-[28px] bg-white border border-[#181615]/10 p-7 sm:p-8 space-y-4">
            <div className="h-11 w-11 rounded-2xl bg-[#ebf1ee] text-[#263b30] flex items-center justify-center">
              <Stethoscope size={20} />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#181615]">
              Responsible Pairing & Vet Care
            </h2>
            <p className="text-sm text-[#575049] leading-relaxed">
              We plan every pairing carefully to support structural soundness and vitality. Every
              kitten is examined by a licensed veterinarian, vaccinated with core FVRCP shots,
              dewormed on schedule, and microchipped.
            </p>
          </div>

          <div className="rounded-[28px] bg-white border border-[#181615]/10 p-7 sm:p-8 space-y-4">
            <div className="h-11 w-11 rounded-2xl bg-[#f3efea] text-[#181615] flex items-center justify-center">
              <Heart size={20} />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#181615]">
              Lifetime Breeder Support
            </h2>
            <p className="text-sm text-[#575049] leading-relaxed">
              Our relationship with adopting families continues long after pickup or delivery day.
              Whether you have questions about nutrition, introductions, or routine care, we are
              always a message away.
            </p>
          </div>
        </div>

        {/* Visual Nursery Gallery Strip */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 aspect-[4/4.2] rounded-[28px] overflow-hidden bg-[#f3efea] border border-[#181615]/10">
            <img
              src={CATTERY_PHOTOS.editorialGolden}
              alt="Apricot Golden Shaded Munchkin kitten"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="md:col-span-7 rounded-[28px] bg-[#181615] text-white p-8 sm:p-12 space-y-6">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#e8b496]">
              <Sparkles size={14} /> Why Families Choose MunchkinKittie
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium leading-tight">
              Honest pricing ($350–$500), real multi-photo profiles, and personal communication.
            </h2>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-[#8fc4a6] shrink-0" />
                <span>Every kitten listing features 3–5 authentic photographs of that exact kitten</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-[#8fc4a6] shrink-0" />
                <span>Written 72-hour general health & 2-year congenital warranty</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-[#8fc4a6] shrink-0" />
                <span>{catteryLocation ? `Free in-person pickup in ${catteryLocation}` : 'Free in-person pickup'} or safe in-cabin Flight Nanny delivery</span>
              </li>
            </ul>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/apply"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#9e5a3c] hover:bg-[#b87354] text-white text-xs sm:text-sm font-semibold transition-colors"
              >
                Start Your Adoption Application <ArrowUpRight size={15} />
              </Link>
              {catteryPhone && (
                <a
                  href={`tel:${catteryPhone.replace(/[^\d+]/g, '')}`}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/15 text-xs sm:text-sm font-semibold transition-colors"
                >
                  <Phone size={14} className="text-[#e8b496]" />
                  Call or Text: {catteryPhone}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
