import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getKittens } from '../features/kitten/kittenSlice';
import { getUpcoming } from '../features/upcoming/upcomingSlice';
import { getReviews, getReviewStats } from '../features/review/reviewSlice';
import Hero from '../components/Hero';
import FeaturedDiscovery from '../components/FeaturedDiscovery';
import TrustPillars from '../components/TrustPillars';
import ProcessSection from '../components/ProcessSection';
import Reviews from '../components/Reviews';
import PageMeta from '../components/PageMeta';
import {
  ChevronDown,
  ArrowUpRight,
  Calendar,
  HelpCircle,
  Heart,
  Phone,
} from 'lucide-react';
import { CATTERY_PHOTOS } from '../utils/kittenFormatters';

const getHomeFaqs = (location) => [
  {
    q: 'What is the adoption fee for a MunchkinKittie kitten and what does it include?',
    a: 'Our available Munchkin kittens are priced between $350 and $500 depending on coat variety, markings, and conformation. Every adoption includes a complete veterinary examination, age-appropriate FVRCP vaccinations, routine deworming, microchip identification, health certificate, and our written 72-hour general health & 2-year genetic guarantee.',
  },
  {
    q: 'Where is your cattery located, and can we pick up our kitten in person?',
    a: `We are a home-based cattery located in ${location}. Approved families are warmly welcome to pick up their kitten in person in ${location} at no delivery charge, or choose our in-cabin Flight Nanny or VIP ground transport options.`,
  },
  {
    q: 'How does in-cabin Flight Nanny delivery work for out-of-state families?',
    a: 'Your kitten never travels in cargo. A dedicated professional Flight Nanny accompanies your kitten inside the pressurized passenger cabin and hands them directly to you along with their veterinary paperwork at your nearest major airport.',
  },
  {
    q: 'What is covered by your Health Guarantee?',
    a: 'Every kitten is backed by a 72-hour general health guarantee (allowing your own veterinarian to examine your kitten upon arrival) plus a 2-year congenital and hereditary warranty and lifetime breeder guidance.',
  },
  {
    q: 'How do I reserve a specific kitten?',
    a: 'Click on any kitten card to view their individual profile, then click "Reserve" or "Apply to Adopt" to submit your adoption application. We review applications within 24 hours and reach out directly to finalize your reservation.',
  },
];

export default function HomePage() {
  const dispatch = useDispatch();
  const { upcomingList } = useSelector((state) => state.upcoming);
  const { settings } = useSelector((state) => state.settings);
  const activeSettings = Array.isArray(settings) ? settings[0] : settings;
  const catteryLocation = activeSettings?.mainLocation || 'Owego, NY';
  const catteryPhone = activeSettings?.phoneNumber || '+1 (607) 223-4177';

  const homeFaqs = getHomeFaqs(catteryLocation);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    dispatch(getKittens());
    dispatch(getUpcoming());
    dispatch(getReviews());
    dispatch(getReviewStats());
  }, [dispatch]);

  const upcomingLitter =
    Array.isArray(upcomingList) && upcomingList.length > 0 ? upcomingList[0] : null;

  return (
    <main className="min-h-screen bg-[#faf8f5]">
      <PageMeta
        title="Home-Raised Munchkin Kittens"
        description={`Explore affectionate, veterinary-checked Munchkin kittens raised indoors in ${catteryLocation}. View multi-photo profiles, transparent pricing ($350–$500), and nationwide Flight Nanny delivery.`}
      />

      {/* 1. Editorial Hero Showcase */}
      <Hero />

      {/* 2. Featured Available Kittens Grid (Full-Card Clickable <Link>) */}
      <FeaturedDiscovery />

      {/* 3 & 4. Brand Philosophy Photo Bento + Interactive Breed Characteristics */}
      <TrustPillars />

      {/* 5. Step-by-Step Adoption Journey */}
      <ProcessSection />

      {/* 6. Upcoming Litter Spotlight (Live from DB if present) */}
      {upcomingLitter && (
        <section className="py-16 sm:py-20 bg-white border-b border-[#181615]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-[28px] bg-[#181615] text-white overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 p-8 sm:p-12 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#e8b496] text-xs font-semibold uppercase tracking-wider">
                  <Calendar size={13} />
                  Upcoming Nursery Pairing · {upcomingLitter.status || 'Confirmed'}
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-medium leading-tight">
                  Planned Litter: {upcomingLitter.title || upcomingLitter.pairing}
                </h2>
                <p className="text-sm sm:text-base text-white/75 leading-relaxed max-w-xl">
                  Expected arrival around{' '}
                  <strong className="text-white">
                    {upcomingLitter.expectedArrival || upcomingLitter.dueDate || 'Coming Soon'}
                  </strong>
                  {upcomingLitter.expectedCount ? (
                    <>
                      {' '}
                      with an estimated{' '}
                      <strong className="text-white">{upcomingLitter.expectedCount}</strong>
                    </>
                  ) : null}
                  . {upcomingLitter.description ? upcomingLitter.description : 'Families may join our priority notification list to receive early nursery updates.'}
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3.5">
                  <Link
                    to={`/apply?id=${upcomingLitter._id}&type=upcoming&name=${encodeURIComponent(
                      upcomingLitter.title || upcomingLitter.pairing || 'Upcoming Litter'
                    )}`}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#9e5a3c] hover:bg-[#b87354] text-white text-xs sm:text-sm font-semibold transition-colors"
                  >
                    Join Priority Waitlist <ArrowUpRight size={15} />
                  </Link>
                  <Link
                    to="/upcoming-litters"
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold transition-colors"
                  >
                    View Upcoming Schedule
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 h-full min-h-[280px] bg-[#231f1d]">
                <img
                  src={upcomingLitter.image || upcomingLitter.img || CATTERY_PHOTOS.editorialLounge}
                  alt={upcomingLitter.title || upcomingLitter.pairing}
                  className="h-full w-full object-cover max-h-[380px]"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 7. Verified Customer Stories */}
      <Reviews />

      {/* 8. Interactive FAQ Accordion */}
      <section className="py-20 sm:py-28 bg-[#faf8f5] border-b border-[#181615]/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9e5a3c]">
              <HelpCircle size={13} /> Common Questions
            </span>
            <h2 className="mt-3 font-serif text-3xl sm:text-5xl font-medium text-[#181615] tracking-tight">
              Everything you need to know before adopting.
            </h2>
          </div>

          <div className="space-y-3.5">
            {homeFaqs.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-[#181615]/10 overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    aria-expanded={isOpen}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-serif text-xl sm:text-2xl font-semibold text-[#181615]">
                      {item.q}
                    </span>
                    <span
                      className={`h-8 w-8 rounded-full bg-[#f3efea] text-[#181615] flex items-center justify-center shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-[#181615] text-white' : ''
                        }`}
                    >
                      <ChevronDown size={16} />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-[#575049] leading-relaxed border-t border-[#181615]/6">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. Final Emotional Photography CTA Banner */}
      <section className="py-16 sm:py-24 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[32px] overflow-hidden bg-[#181615] text-white min-h-[420px] grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 p-8 sm:p-14 lg:p-16 space-y-6 z-10">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#e8b496] text-xs font-semibold uppercase tracking-wider">
                <Heart size={13} /> {catteryLocation} Family Nursery
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-medium leading-[1.08] tracking-tight">
                Find the Munchkin kitten who already feels like part of your family.
              </h2>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-xl">
                Browse our current available kittens, review their individual veterinary records, or
                reach out directly with any questions about life with a Munchkin companion.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/available-kittens"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-[#9e5a3c] hover:bg-[#b87354] text-white text-sm font-semibold transition-colors"
                >
                  Browse Available Kittens <ArrowUpRight size={16} />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/15 text-sm font-semibold transition-colors"
                >
                  Contact Our Cattery
                </Link>
                {catteryPhone && (
                  <a
                    href={`tel:${catteryPhone.replace(/[^\d+]/g, '')}`}
                    className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/15 text-sm font-semibold transition-colors"
                  >
                    <Phone size={15} className="text-[#e8b496]" />
                    Call / Text: {catteryPhone}
                  </a>
                )}
              </div>
            </div>

            <div className="lg:col-span-5 relative h-full min-h-[300px] lg:min-h-[420px]">
              <img
                src={CATTERY_PHOTOS.heroPrimary}
                alt={`Clover Munchkin kitten in ${catteryLocation}`}
                className="h-full w-full object-cover"
              />
              <div className="hidden lg:block absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-[#181615] to-transparent" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
