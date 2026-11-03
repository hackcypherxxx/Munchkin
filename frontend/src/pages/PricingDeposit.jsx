import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PageMeta from '../components/PageMeta';
import {
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
  CreditCard,
  Sparkles,
  Phone,
} from 'lucide-react';
import { CATTERY_PHOTOS } from '../utils/kittenFormatters';

export default function PricingDeposit() {
  const { kittens } = useSelector((state) => state.kitten);
  const { settings } = useSelector((state) => state.settings);
  const activeSettings = Array.isArray(settings) ? settings[0] : settings;
  const catteryLocation = activeSettings?.mainLocation || 'Owego, NY';
  const catteryPhone = activeSettings?.phoneNumber || '+1 (607) 223-4177';

  return (
    <main className="min-h-screen bg-[#faf8f5] pb-24">
      <PageMeta
        title="Pricing & Reservation Policy ($350–$500)"
        description="Transparent adoption fees ($350–$500) for home-raised Munchkin kittens in Owego, NY. Learn what is included with every adoption."
      />

      {/* Editorial Hero */}
      <section className="bg-[#f3efea] border-b border-[#181615]/10 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#181615]/10 text-xs font-semibold text-[#263b30]">
              <DollarSign size={13} /> Transparent Nursery Pricing
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-medium text-[#181615] tracking-tight leading-[1.05]">
              Adoption Fees & Reservation Policy
            </h1>
            <p className="text-base sm:text-lg text-[#575049] leading-relaxed max-w-2xl">
              We believe in clear, honest pricing without hidden fees. Every kitten on our website
              has their exact adoption fee ($350 – $500) listed directly on their card and profile.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="aspect-[16/11] rounded-[28px] overflow-hidden bg-white border border-[#181615]/10 editorial-shadow">
              <img
                src={CATTERY_PHOTOS.heroSecondary}
                alt="Apricot Golden Shaded Munchkin kitten"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Breakdown */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Primary Adoption Fee Card */}
          <div className="lg:col-span-7 rounded-[28px] bg-white border border-[#181615]/10 p-8 sm:p-10 flex flex-col justify-between editorial-shadow">
            <div className="space-y-5">
              <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[#181615]/8 pb-5">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9e5a3c]">
                    Current Nursery Litter
                  </span>
                  <h2 className="mt-1 font-serif text-3xl sm:text-4xl font-semibold text-[#181615]">
                    Munchkin Kitten Adoption
                  </h2>
                </div>
                <span className="font-mono text-3xl sm:text-4xl font-semibold text-[#181615]">
                  $350 – $500
                </span>
              </div>

              <p className="text-sm sm:text-base text-[#575049] leading-relaxed">
                Individual kitten adoption fees vary between $350 and $500 depending on coat length
                (Shorthair, Standard, Longhair), colour markings, and ear conformation. Every
                adoption includes:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  'Licensed Veterinarian Physical Examination',
                  'Signed Veterinary Health Certificate',
                  'Age-Appropriate Core FVRCP Vaccinations',
                  'Complete Preventative Deworming (2, 4, 6, 8 wks)',
                  'Registered Microchip Identification',
                  '72-Hour General Health Guarantee',
                  '2-Year Congenital & Hereditary Warranty',
                  `Free Local Pickup in ${catteryLocation}`,
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#181615]">
                    <CheckCircle2 size={16} className="text-[#263b30] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#181615]/8 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-[#575049]">
                Currently {kittens?.filter((k) => k.status === 'Available').length || 7} kittens
                available in this range
              </span>
              <Link
                to="/available-kittens"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#181615] hover:bg-[#9e5a3c] text-white text-xs sm:text-sm font-semibold transition-colors"
              >
                View Available Kittens <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>

          {/* Reservation & Payment Methods Card */}
          <div className="lg:col-span-5 rounded-[28px] bg-[#181615] text-white p-8 sm:p-10 flex flex-col justify-between">
            <div className="space-y-5">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#e8b496]">
                <CreditCard size={13} /> How Reservations Work
              </span>
              <h2 className="font-serif text-3xl font-medium">
                Simple, application-first reservation process.
              </h2>
              <p className="text-sm text-white/75 leading-relaxed">
                We never take blind automated checkout payments before reviewing your home
                application. Once your application is approved by our {catteryLocation} team, we
                coordinate your reservation directly.
              </p>

              <div className="pt-2 space-y-2.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#e8b496]">
                  Accepted Payment Methods (After Approval)
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Zelle',
                    'Apple Pay',
                    'Venmo',
                    'Cash App',
                    'Chime',
                    'PayPal',
                    'Bank Transfer',
                    `Cash on ${catteryLocation} Pickup`,
                  ].map((m) => (
                    <span
                      key={m}
                      className="px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-white"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 space-y-2.5">
              <Link
                to="/apply"
                className="w-full py-3.5 px-6 rounded-full bg-[#9e5a3c] hover:bg-[#b87354] text-white text-center text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                Submit Adoption Application <ArrowUpRight size={15} />
              </Link>
              {catteryPhone && (
                <a
                  href={`tel:${catteryPhone.replace(/[^\d+]/g, '')}`}
                  className="w-full py-2.5 px-6 rounded-full bg-white/10 hover:bg-white/15 text-white/90 text-center text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone size={13} className="text-[#e8b496]" />
                  Direct Questions: {catteryPhone}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
