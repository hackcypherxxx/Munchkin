import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PageMeta from '../components/PageMeta';
import {
  FileText,
  MessageSquareHeart,
  ShieldCheck,
  Home,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';
import { CATTERY_PHOTOS } from '../utils/kittenFormatters';

const getVettingSteps = (location) => [
  {
    step: '01',
    title: 'Online Adoption Application',
    desc: 'Complete our short application form sharing your contact details, living environment, and whether you have other pets.',
    icon: FileText,
  },
  {
    step: '02',
    title: '24-Hour Breeder Review & Conversation',
    desc: `Our${location ? ` ${location}` : ''} cattery team reviews your application within 24 hours and connects with you directly to answer questions and confirm compatibility.`,
    icon: MessageSquareHeart,
  },
  {
    step: '03',
    title: 'Indoor Safety & Care Readiness',
    desc: 'We verify that every kitten will be kept strictly indoors in a safe, loving environment with access to routine veterinary care.',
    icon: Home,
  },
  {
    step: '04',
    title: 'Reservation & Final Veterinary Clearance',
    desc: `Once approved, your kitten is reserved in your name, completes their final pre-departure vet check, and is prepared for${location ? ` ${location}` : ' local'} pickup or Flight Nanny delivery.`,
    icon: ShieldCheck,
  },
];

export default function VettingProcess() {
  const { settings } = useSelector((state) => state.settings);
  const activeSettings = Array.isArray(settings) ? settings[0] : settings;
  const catteryLocation = activeSettings?.mainLocation?.trim() || '';
  const vettingSteps = getVettingSteps(catteryLocation);

  return (
    <main className="min-h-screen bg-[#faf8f5] pb-24">
      <PageMeta
        title="Adoption & Vetting Process"
        description="Learn how MunchkinKittie reviews adoption applications and matches home-raised kittens with loving indoor families."
      />

      <section className="bg-[#f3efea] border-b border-[#181615]/10 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#181615]/10 text-xs font-semibold text-[#9e5a3c]">
              Thoughtful Placement Standards
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-medium text-[#181615] tracking-tight leading-[1.05]">
              Our Adoption & Vetting Process
            </h1>
            <p className="text-base sm:text-lg text-[#575049] leading-relaxed max-w-2xl">
              Because we raise every kitten in our{catteryLocation ? ` ${catteryLocation}` : ''} home, we take care to ensure each
              companion joins a prepared, affectionate indoor household.
            </p>
            <div className="pt-2">
              <Link
                to="/apply"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#181615] hover:bg-[#9e5a3c] text-white text-xs sm:text-sm font-semibold transition-colors"
              >
                Start Adoption Application <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="aspect-[16/11] rounded-[28px] overflow-hidden bg-white border border-[#181615]/10 editorial-shadow">
              <img
                src={CATTERY_PHOTOS.editorialNursery}
                alt={`Munchkin kitten in nursery${catteryLocation ? ` (${catteryLocation})` : ''}`}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vettingSteps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="rounded-[28px] bg-white border border-[#181615]/10 p-7 sm:p-8 space-y-4 editorial-shadow"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-[#9e5a3c] bg-[#f5ebe6] px-3 py-1 rounded-full">
                    Step {item.step}
                  </span>
                  <div className="h-10 w-10 rounded-2xl bg-[#faf8f5] border border-[#181615]/8 flex items-center justify-center text-[#181615]">
                    <Icon size={18} />
                  </div>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#181615]">
                  {item.title}
                </h2>
                <p className="text-sm text-[#575049] leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* What We Look For Card */}
        <div className="mt-12 rounded-[28px] bg-[#181615] text-white p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#e8b496]">
              Adopter Commitments
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium">
              What we ask of every adopting family
            </h2>
            <ul className="space-y-3 text-sm text-white/80 pt-2">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-[#8fc4a6] shrink-0" />
                <span>Strictly indoor-only living environment for safety and longevity</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-[#8fc4a6] shrink-0" />
                <span>Strict non-declawing agreement (scratching posts & nail trims only)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-[#8fc4a6] shrink-0" />
                <span>Initial veterinary wellness check within 72 hours of arrival</span>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3">
            <Link
              to="/apply"
              className="w-full py-4 px-6 rounded-full bg-[#9e5a3c] hover:bg-[#b87354] text-white text-center text-xs sm:text-sm font-semibold transition-colors"
            >
              Submit Your Application Now
            </Link>
            <Link
              to="/available-kittens"
              className="w-full py-4 px-6 rounded-full bg-white/10 hover:bg-white/15 text-white text-center text-xs sm:text-sm font-semibold transition-colors"
            >
              Browse Available Kittens
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
