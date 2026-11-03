import React from 'react';
import { Link } from 'react-router-dom';
import PageMeta from '../components/PageMeta';
import {
  ShieldCheck,
  Stethoscope,
  CheckCircle2,
  Clock,
  HeartHandshake,
  ArrowUpRight,
  FileCheck2,
} from 'lucide-react';
import { CATTERY_PHOTOS } from '../utils/kittenFormatters';

export default function HealthGuarantee() {
  return (
    <main className="min-h-screen bg-[#faf8f5] pb-24">
      <PageMeta
        title="72-Hour & 2-Year Health Guarantee"
        description="Read MunchkinKittie's written 72-hour general health guarantee, 2-year genetic warranty, and pre-departure veterinary protocol."
      />

      {/* Header */}
      <section className="bg-[#f3efea] border-b border-[#181615]/10 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#181615]/10 text-xs font-semibold text-[#263b30]">
              <ShieldCheck size={13} /> Written Veterinary Protection
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-medium text-[#181615] tracking-tight leading-[1.05]">
              Our Comprehensive Health Guarantee
            </h1>
            <p className="text-base sm:text-lg text-[#575049] leading-relaxed max-w-2xl">
              Every kitten leaving our Owego, NY nursery is examined by a licensed veterinarian,
              vaccinated, dewormed, microchipped, and backed by our written 3-part health commitment.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="aspect-[16/11] rounded-[28px] overflow-hidden bg-white border border-[#181615]/10 editorial-shadow">
              <img
                src={CATTERY_PHOTOS.editorialPortrait}
                alt="Healthy Munchkin kitten in Owego, NY"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3 Pillars of Coverage */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          <div className="rounded-[28px] bg-white border border-[#181615]/10 p-7 sm:p-8 space-y-4 editorial-shadow">
            <div className="h-11 w-11 rounded-2xl bg-[#ebf1ee] text-[#263b30] flex items-center justify-center">
              <Clock size={20} />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#263b30]">
              Part 01 · Arrival Assurance
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#181615]">
              72-Hour General Health Guarantee
            </h2>
            <p className="text-sm text-[#575049] leading-relaxed">
              We encourage every family to have their new kitten examined by their own licensed
              veterinarian within 72 hours of pickup or delivery. Your kitten is guaranteed to
              arrive free from infectious viral illnesses.
            </p>
          </div>

          <div className="rounded-[28px] bg-white border border-[#181615]/10 p-7 sm:p-8 space-y-4 editorial-shadow">
            <div className="h-11 w-11 rounded-2xl bg-[#f5ebe6] text-[#9e5a3c] flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9e5a3c]">
              Part 02 · Long-Term Coverage
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#181615]">
              2-Year Genetic & Congenital Warranty
            </h2>
            <p className="text-sm text-[#575049] leading-relaxed">
              Every kitten is covered for two full years from birth against life-threatening
              hereditary or congenital defects. If a covered congenital condition is diagnosed by two
              independent licensed veterinarians, we provide a replacement kitten of equal value.
            </p>
          </div>

          <div className="rounded-[28px] bg-white border border-[#181615]/10 p-7 sm:p-8 space-y-4 editorial-shadow">
            <div className="h-11 w-11 rounded-2xl bg-[#f3efea] text-[#181615] flex items-center justify-center">
              <HeartHandshake size={20} />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8a8075]">
              Part 03 · Ongoing Guidance
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#181615]">
              Lifetime Breeder Support
            </h2>
            <p className="text-sm text-[#575049] leading-relaxed">
              We remain available throughout your cat’s life for advice on nutrition, litter
              transition, grooming, and household acclimation. And if your life circumstances ever
              change, we will always assist with safe rehoming.
            </p>
          </div>
        </div>

        {/* Veterinary Checklist Table */}
        <div className="mt-14 rounded-[28px] bg-white border border-[#181615]/10 p-8 sm:p-12">
          <div className="max-w-2xl mb-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#263b30]">
              Included Medical Documentation
            </span>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#181615]">
              What your kitten receives before going home
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'Licensed Veterinarian Physical Examination',
                desc: 'Full cardiac, respiratory, ophthalmic, dental, and musculoskeletal check prior to departure.',
              },
              {
                title: 'Age-Appropriate Core Vaccinations (FVRCP)',
                desc: 'Immunized against Feline Rhinotracheitis, Calicivirus, and Panleukopenia with a signed shot record.',
              },
              {
                title: 'Routine Preventative Deworming',
                desc: 'Broad-spectrum deworming administered at 2, 4, 6, and 8 weeks of age.',
              },
              {
                title: 'Microchip Identification & Health Folder',
                desc: 'Each kitten leaves with microchip identification and a complete medical folder for your veterinarian.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-[#faf8f5] border border-[#181615]/8 p-5 flex items-start gap-3.5"
              >
                <CheckCircle2 size={18} className="text-[#263b30] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-[#181615]">{item.title}</h3>
                  <p className="mt-1 text-xs text-[#575049] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-[#181615]/10 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-[#575049]">
              Have a specific question about our veterinary protocol?
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/available-kittens"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#181615] text-white text-xs font-semibold"
              >
                Browse Available Kittens <ArrowUpRight size={14} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#f3efea] text-[#181615] text-xs font-semibold"
              >
                Contact Our Cattery
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
