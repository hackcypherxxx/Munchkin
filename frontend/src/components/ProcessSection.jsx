import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Search,
  FileText,
  MessageSquareHeart,
  ShieldCheck,
  Plane,
  ArrowUpRight,
} from 'lucide-react';
import { CATTERY_PHOTOS } from '../utils/kittenFormatters';

export default function ProcessSection() {
  const { settings } = useSelector((state) => state.settings);
  const activeSettings = Array.isArray(settings) ? settings[0] : settings;
  const catteryLocation = activeSettings?.mainLocation || 'Owego, NY';
  const catteryPhone = activeSettings?.phoneNumber || '+1 (607) 223-4177';

  const steps = [
    {
      num: '01',
      title: 'Explore the Nursery',
      description:
        'Browse our live available kittens. Each listing features 3–5 authentic photographs, exact coat & eye colour specs, vaccination status, and adoption fee ($350–$500).',
      icon: Search,
    },
    {
      num: '02',
      title: 'Submit an Adoption Enquiry',
      description:
        'Complete our straightforward online application telling us about your home environment, experience with pets, and the kitten that caught your eye.',
      icon: FileText,
    },
    {
      num: '03',
      title: 'Personal Breeder Consultation',
      description:
        `We review your application within 24 hours, answer your questions by email or direct phone${catteryPhone ? ` (${catteryPhone})` : ''}, and share additional photos or updates directly from our ${catteryLocation} nursery.`,
      icon: MessageSquareHeart,
    },
    {
      num: '04',
      title: 'Reservation & Final Vet Check',
      description:
        'Once approved, your kitten is reserved in your name and completes their pre-departure veterinary checkup, FVRCP vaccination check, and microchip registration.',
      icon: ShieldCheck,
    },
    {
      num: '05',
      title: `${catteryLocation} Pickup or Flight Nanny Delivery`,
      description:
        `Pick up your kitten in person at our ${catteryLocation} home nursery for free, or coordinate safe in-cabin Flight Nanny / VIP ground delivery right to your nearest airport or door.`,
      icon: Plane,
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#faf8f5] border-b border-[#181615]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Sticky Editorial Column (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9e5a3c]">
              Step-by-Step Adoption Journey
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-medium text-[#181615] tracking-tight leading-[1.08]">
              A thoughtful, transparent path to bringing your kitten home.
            </h2>
            <p className="text-base text-[#575049] leading-relaxed">
              Whether you are visiting us locally in {catteryLocation} or welcoming your kitten via
              our in-cabin Flight Nanny courier, we guide you personally through every step.
            </p>

            {/* Editorial Photography Card */}
            <div className="rounded-[24px] overflow-hidden bg-white border border-[#181615]/10 editorial-shadow">
              <div className="aspect-[16/10] w-full overflow-hidden bg-[#f3efea]">
                <img
                  src={CATTERY_PHOTOS.editorialTabby}
                  alt="Cheddar Orange Tabby Munchkin kitten"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-[#181615]">
                    Ready to start your application?
                  </p>
                  <p className="text-xs text-[#575049] mt-0.5">
                    Applications are reviewed within 24 hours.
                  </p>
                </div>
                <Link
                  to="/apply"
                  className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#181615] hover:bg-[#9e5a3c] text-white text-xs font-semibold transition-colors"
                >
                  Apply Now <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          {/* Right 5-Step Architectural List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="group rounded-[24px] bg-white border border-[#181615]/10 p-6 sm:p-7 hover:border-[#9e5a3c]/40 transition-all"
                >
                  <div className="flex items-start gap-5">
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <span className="font-mono text-xs font-semibold text-[#9e5a3c] bg-[#f5ebe6] px-2.5 py-1 rounded-full">
                        {step.num}
                      </span>
                      <div className="h-10 w-10 rounded-2xl bg-[#faf8f5] border border-[#181615]/8 text-[#181615] flex items-center justify-center">
                        <Icon size={18} />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="font-serif text-2xl font-semibold text-[#181615]">
                        {step.title}
                      </h3>
                      <p className="text-sm text-[#575049] leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
