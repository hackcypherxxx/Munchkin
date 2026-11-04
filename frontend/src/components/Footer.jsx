import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  ShieldCheck,
  MapPin,
  Mail,
  Phone,
  Heart,
  ArrowUpRight,
  Plane,
  Stethoscope,
} from 'lucide-react';

export default function Footer() {
  const { settings } = useSelector((state) => state.settings);
  const activeSettings = Array.isArray(settings) ? settings[0] : settings;
  const catteryLocation = activeSettings?.mainLocation?.trim() || '';
  const catteryPhone = activeSettings?.phoneNumber || '+1 (607) 223-4177';
  const catteryEmail = activeSettings?.contactEmail || 'info@munchkinkittie.com';

  return (
    <footer className="bg-[#181615] text-[#f3efea] border-t border-white/10">
      {/* Upper Editorial Callout Bar */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#e8b496]">
              <Heart size={12} /> {catteryLocation ? `Hand-Raised in ${catteryLocation}` : 'Hand-Raised With Care'}
            </span>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-white tracking-tight leading-[1.1]">
              Ready to welcome a gentle Munchkin companion into your home?
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3.5 shrink-0">
            <Link
              to="/available-kittens"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#9e5a3c] hover:bg-[#b87354] text-white text-xs sm:text-sm font-semibold transition-colors"
            >
              Browse Available Kittens
              <ArrowUpRight size={16} />
            </Link>
            <Link
              to="/apply"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/15 text-xs sm:text-sm font-semibold transition-colors"
            >
              Adoption Application
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Column 1: Brand Identity */}
          <div className="lg:col-span-4 space-y-5">
            <Link
              to="/"
              className="group inline-flex items-baseline py-1 transition-opacity hover:opacity-95"
              aria-label="MunchkinKittie"
            >
              <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-white group-hover:text-[#e8b496] transition-colors leading-none">
                Munchkin<span className="text-[#e8b496]">Kittie</span>
              </span>
            </Link>

            <p className="text-sm text-white/70 leading-relaxed max-w-sm">
              A dedicated home-based Munchkin cattery{catteryLocation ? ` in ${catteryLocation}` : ''} focused on sound
              conformation, veterinary-verified health, and affectionate indoor socialization.
            </p>

            <div className="space-y-2.5 pt-1 text-xs text-white/75">
              {catteryLocation && (
                <div className="flex items-center gap-2.5">
                  <MapPin size={14} className="text-[#e8b496] shrink-0" />
                  <span>Cattery Location: {catteryLocation} (Local Pickup & Nationwide Delivery)</span>
                </div>
              )}
              {catteryPhone && (
                <div className="flex items-center gap-2.5">
                  <Phone size={14} className="text-[#e8b496] shrink-0" />
                  <a
                    href={`tel:${catteryPhone.replace(/[^\d+]/g, '')}`}
                    className="hover:text-white transition-colors"
                  >
                    Direct Line: {catteryPhone}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="text-[#e8b496] shrink-0" />
                <a
                  href={`mailto:${catteryEmail}`}
                  className="hover:text-white transition-colors"
                >
                  {catteryEmail}
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Nursery */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#e8b496]">
              The Nursery
            </h3>
            <ul className="space-y-2.5 text-sm text-white/75">
              <li>
                <Link to="/available-kittens" className="hover:text-white transition-colors">
                  Available Kittens
                </Link>
              </li>
              <li>
                <Link to="/upcoming-litters" className="hover:text-white transition-colors">
                  Upcoming Litters
                </Link>
              </li>
              <li>
                <Link to="/retired-adults" className="hover:text-white transition-colors">
                  Retired Adults
                </Link>
              </li>
              <li>
                <Link to="/apply" className="hover:text-white transition-colors">
                  Adoption Application
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-white transition-colors">
                  Verified Family Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Health & Standards */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#e8b496]">
              Health & Transparency
            </h3>
            <ul className="space-y-2.5 text-sm text-white/75">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Our Cattery
                </Link>
              </li>
              <li>
                <Link to="/health" className="hover:text-white transition-colors">
                  72-Hr & 2-Year Health Guarantee
                </Link>
              </li>
              <li>
                <Link to="/vetting-process" className="hover:text-white transition-colors">
                  Adoption & Vetting Process
                </Link>
              </li>
              <li>
                <Link to="/pricing-deposit" className="hover:text-white transition-colors">
                  Pricing & Reservation Policy
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-white transition-colors">
                  In-Cabin Flight Nanny & Delivery
                </Link>
              </li>
              <li>
                <Link to="/care-guide" className="hover:text-white transition-colors">
                  New Kitten Care Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Veterinary Commitment Card */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-5 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-[#9e5a3c]/20 text-[#e8b496] flex items-center justify-center">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Every Kitten Includes</p>
                  <p className="text-[11px] text-white/60">Standard Veterinary Protocol</p>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-white/75">
                <li className="flex items-center gap-2">
                  <Stethoscope size={13} className="text-[#8fc4a6] shrink-0" />
                  Licensed Veterinarian Health Certificate
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck size={13} className="text-[#8fc4a6] shrink-0" />
                  Age-Appropriate FVRCP Vaccinations
                </li>
                <li className="flex items-center gap-2">
                  <Plane size={13} className="text-[#8fc4a6] shrink-0" />
                  Microchip ID & Transition Starter Kit
                </li>
              </ul>
              <Link
                to="/contact"
                className="block w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-center text-xs font-semibold text-white transition-colors"
              >
                Ask Our Breeder a Question
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Admin Row */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© {new Date().getFullYear()} MunchkinKittie{catteryLocation ? ` (${catteryLocation})` : ''}. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-5">
            <Link to="/terms-policy" className="hover:text-white/80 transition-colors">
              Privacy & Adoption Terms
            </Link>
            <Link to="/reviews" className="hover:text-white/80 transition-colors">
              Share Your Story
            </Link>
            <Link to="/admin-only-login" className="hover:text-white/80 transition-colors">
              Cattery Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
