import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PageMeta from '../components/PageMeta';
import {
  Plane,
  Car,
  Home,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
  MapPin,
  Phone,
} from 'lucide-react';
import { CATTERY_PHOTOS } from '../utils/kittenFormatters';

export default function ShippingDelivery() {
  const { settings } = useSelector((state) => state.settings);
  const activeSettings = Array.isArray(settings) ? settings[0] : settings;
  const catteryLocation = activeSettings?.mainLocation?.trim() || '';
  const catteryPhone = activeSettings?.phoneNumber || '+1 (607) 223-4177';

  return (
    <main className="min-h-screen bg-[#faf8f5] pb-24">
      <PageMeta
        title="Delivery & Flight Nanny Options"
        description={`Pick up your kitten${catteryLocation ? ` in ${catteryLocation}` : ''} for free, or choose safe in-cabin Flight Nanny or VIP ground transport anywhere in the United States.`}
      />

      {/* Editorial Hero */}
      <section className="bg-[#f3efea] border-b border-[#181615]/10 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#181615]/10 text-xs font-semibold text-[#9e5a3c]">
              <Plane size={13} /> Never Shipped in Cargo · Hand-Delivered Care
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-medium text-[#181615] tracking-tight leading-[1.05]">
              Safe Delivery & {catteryLocation ? `${catteryLocation} Pickup` : 'Local Pickup'}
            </h1>
            <p className="text-base sm:text-lg text-[#575049] leading-relaxed max-w-2xl">
              Whether you live nearby{catteryLocation ? ` in ${catteryLocation}` : ''} or across the country, we make bringing your
              kitten home calm, safe, and personal. Kittens never travel unattended in cargo.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="aspect-[16/11] rounded-[28px] overflow-hidden bg-white border border-[#181615]/10 editorial-shadow">
              <img
                src={CATTERY_PHOTOS.editorialLounge}
                alt="Munchkin kitten prepared for travel"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3 Delivery Tiers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {/* Option 1: Local Pickup */}
          <div className="rounded-[28px] bg-white border border-[#181615]/10 p-7 sm:p-8 flex flex-col justify-between editorial-shadow">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-11 w-11 rounded-2xl bg-[#ebf1ee] text-[#263b30] flex items-center justify-center">
                  <Home size={20} />
                </div>
                <span className="font-mono text-lg font-semibold text-[#263b30]">Free</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#181615]">
                In-Person Pickup{catteryLocation ? ` (${catteryLocation})` : ''}
              </h2>
              <p className="text-sm text-[#575049] leading-relaxed">
                Approved families are welcome to schedule an appointment at our{catteryLocation ? ` ${catteryLocation}` : ''}{' '}
                nursery to meet and pick up their kitten in person at no extra charge.
              </p>
              <ul className="space-y-2 text-xs text-[#181615] pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#263b30] shrink-0" />
                  <span>Direct handover at our{catteryLocation ? ` ${catteryLocation}` : ''} nursery</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#263b30] shrink-0" />
                  <span>Includes travel carrier & starter food pack</span>
                </li>
              </ul>
            </div>
            <Link
              to="/apply"
              className="mt-6 w-full py-3 rounded-full bg-[#f3efea] hover:bg-[#181615] hover:text-white text-center text-xs font-semibold text-[#181615] transition-colors"
            >
              Request Local Pickup
            </Link>
          </div>

          {/* Option 2: VIP Ground */}
          <div className="rounded-[28px] bg-white border border-[#181615]/10 p-7 sm:p-8 flex flex-col justify-between editorial-shadow">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-11 w-11 rounded-2xl bg-[#f5ebe6] text-[#9e5a3c] flex items-center justify-center">
                  <Car size={20} />
                </div>
                <span className="font-mono text-sm font-semibold text-[#9e5a3c]">
                  Regional Ground
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#181615]">
                Private Ground Courier
              </h2>
              <p className="text-sm text-[#575049] leading-relaxed">
                For families in New York, Pennsylvania, New Jersey, New England, and surrounding
                states, we offer climate-controlled door-to-door ground delivery.
              </p>
              <ul className="space-y-2 text-xs text-[#181615] pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#263b30] shrink-0" />
                  <span>Climate-controlled private vehicle transport</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#263b30] shrink-0" />
                  <span>Regular photo & GPS updates en route</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <Link
                to="/contact"
                className="w-full py-3 rounded-full bg-[#f3efea] hover:bg-[#181615] hover:text-white text-center text-xs font-semibold text-[#181615] transition-colors"
              >
                Request Ground Quote
              </Link>
              {catteryPhone && (
                <a
                  href={`tel:${catteryPhone.replace(/[^\d+]/g, '')}`}
                  className="w-full py-2.5 rounded-full border border-[#181615]/12 hover:border-[#9e5a3c] text-center text-xs font-semibold text-[#181615] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone size={12} className="text-[#9e5a3c]" />
                  Call or Text: {catteryPhone}
                </a>
              )}
            </div>
          </div>

          {/* Option 3: Flight Nanny */}
          <div className="rounded-[28px] bg-[#181615] text-white p-7 sm:p-8 flex flex-col justify-between editorial-shadow">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-11 w-11 rounded-2xl bg-white/10 text-[#e8b496] flex items-center justify-center">
                  <Plane size={20} />
                </div>
                <span className="font-mono text-xs uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#9e5a3c] text-white">
                  Most Popular Out-of-State
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium">
                In-Cabin Flight Nanny
              </h2>
              <p className="text-sm text-white/75 leading-relaxed">
                A dedicated pet nanny flies with your kitten right inside the pressurized passenger
                cabin and meets you in person at your nearest major US airport.
              </p>
              <ul className="space-y-2 text-xs text-white/85 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#8fc4a6] shrink-0" />
                  <span>100% in-cabin travel—never placed in cargo</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#8fc4a6] shrink-0" />
                  <span>Veterinary health certificate & carrier included</span>
                </li>
              </ul>
            </div>
            <Link
              to="/apply"
              className="mt-6 w-full py-3 rounded-full bg-[#9e5a3c] hover:bg-[#b87354] text-center text-xs font-semibold text-white transition-colors"
            >
              Select Flight Nanny in Application
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
