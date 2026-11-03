import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PageMeta from '../components/PageMeta';
import {
  BookOpen,
  Heart,
  Utensils,
  Home,
  Scissors,
  Stethoscope,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';
import { CATTERY_PHOTOS } from '../utils/kittenFormatters';

const CARE_SECTIONS = [
  {
    icon: Home,
    title: 'First 72 Hours: Creating a Calm Sanctuary Room',
    desc: 'Prepare a quiet, enclosed bedroom or study with your kitten’s litter box, fresh water, food bowls, and a soft bed before they arrive. Giving your kitten a smaller space for the first 2–3 days helps them build confidence before exploring the rest of your home.',
    tips: [
      'Use a low-entry litter box with unscented clumping or pine litter',
      'Keep cords, small strings, and toxic houseplants out of reach',
      'Let your kitten set the pace for exploration and cuddles',
    ],
  },
  {
    icon: Utensils,
    title: 'Nutrition & Hydration Protocol',
    desc: 'Growing Munchkin kittens thrive on a moisture-rich diet combining high-protein kitten wet food (pâté or shreds) with quality grain-free kitten kibble. Avoid sudden diet changes during the first week home.',
    tips: [
      'Feed wet kitten food 2–3 times daily alongside fresh water',
      'Transition to any new food brand gradually over 7–10 days',
      'Ceramic or stainless-steel shallow bowls prevent whisker fatigue',
    ],
  },
  {
    icon: Scissors,
    title: 'Grooming, Nail Trims & Scratching Habits',
    desc: 'Shorthair Munchkins require gentle weekly brushing, while Longhair kittens benefit from 2–3 combings per week to keep their plush coat tangle-free. Trim just the clear tips of their front claws every two weeks.',
    tips: [
      'Provide sturdy sisal scratching posts and horizontal scratch pads',
      'Clean around eyes gently with a warm damp cloth if needed',
      'Never declaw—regular nail trims and scratchers protect furniture',
    ],
  },
  {
    icon: Stethoscope,
    title: 'Ongoing Veterinary Wellness',
    desc: 'Schedule your new-kitten wellness check with your family veterinarian within 72 hours of arrival. Bring the medical folder we provide so your vet can log their next booster date.',
    tips: [
      'Complete remaining kitten booster shots on your vet’s schedule',
      'Keep your Munchkin strictly indoors for safety and health',
      'Reach out to us anytime for lifetime breeder guidance',
    ],
  },
];

export default function CareGuide() {
  const { settings } = useSelector((state) => state.settings);
  const activeSettings = Array.isArray(settings) ? settings[0] : settings;
  const catteryLocation = activeSettings?.mainLocation || 'Owego, NY';

  return (
    <main className="min-h-screen bg-[#faf8f5] pb-24">
      <PageMeta
        title="New Kitten Care & Preparation Guide"
        description="Essential advice on preparing your home, nutrition, litter box setup, grooming, and first-week acclimation for your Munchkin kitten."
      />

      {/* Editorial Hero */}
      <section className="bg-[#f3efea] border-b border-[#181615]/10 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#181615]/10 text-xs font-semibold text-[#9e5a3c]">
              <BookOpen size={13} /> MunchkinKittie Owner’s Handbook
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-medium text-[#181615] tracking-tight leading-[1.05]">
              New Kitten Care & Preparation Guide
            </h1>
            <p className="text-base sm:text-lg text-[#575049] leading-relaxed max-w-2xl">
              Everything you need to prepare a warm, safe indoor environment for your new Munchkin
              kitten’s arrival and first weeks at home.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="aspect-[16/11] rounded-[28px] overflow-hidden bg-white border border-[#181615]/10 editorial-shadow">
              <img
                src={CATTERY_PHOTOS.editorialPlayful}
                alt="Playful Munchkin kitten"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Care Modules */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {CARE_SECTIONS.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <div
                key={idx}
                className="rounded-[28px] bg-white border border-[#181615]/10 p-7 sm:p-9 space-y-5 editorial-shadow"
              >
                <div className="h-11 w-11 rounded-2xl bg-[#f5ebe6] text-[#9e5a3c] flex items-center justify-center">
                  <Icon size={20} />
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#181615]">
                  {sec.title}
                </h2>
                <p className="text-sm text-[#575049] leading-relaxed">{sec.desc}</p>
                <ul className="space-y-2.5 pt-2 border-t border-[#181615]/8">
                  {sec.tips.map((tip, tIdx) => (
                    <li key={tIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#181615]">
                      <CheckCircle2 size={15} className="text-[#263b30] shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-12 rounded-[28px] bg-[#181615] text-white p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium">
              Ready to meet our current kittens?
            </h2>
            <p className="mt-1 text-sm text-white/75">
              All kittens leave our {catteryLocation} nursery litter-trained, socialized, and vet-certified.
            </p>
          </div>
          <Link
            to="/available-kittens"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#9e5a3c] hover:bg-[#b87354] text-white text-xs sm:text-sm font-semibold transition-colors"
          >
            Browse Available Kittens <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
}
