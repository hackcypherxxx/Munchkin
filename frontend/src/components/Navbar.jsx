import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getNotifications } from '../features/notification/notificationSlice';
import { getSettings } from '../features/settings/settingsSlice';
import { getKittens } from '../features/kitten/kittenSlice';
import {
  Menu,
  X,
  ChevronDown,
  Bell,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  Heart,
  Plane,
  Calendar,
  BookOpen,
  DollarSign,
  Award,
  Stethoscope,
  MapPin,
  Phone,
} from 'lucide-react';
import { CATTERY_PHOTOS, formatKittenAge } from '../utils/kittenFormatters';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const dispatch = useDispatch();
  const navRef = useRef(null);

  const { notifications } = useSelector((state) => state.notification);
  const { settings } = useSelector((state) => state.settings);
  const { kittens } = useSelector((state) => state.kitten);

  const activeSettings = Array.isArray(settings) ? settings[0] : settings;
  const catteryLocation = activeSettings?.mainLocation || 'Owego, NY';
  const catteryPhone = activeSettings?.phoneNumber || '+1 (607) 223-4177';

  const availableCount = Array.isArray(kittens)
    ? kittens.filter((k) => k.status === 'Available').length
    : 0;
  const spotlightKitten = Array.isArray(kittens)
    ? kittens.find((k) => k.status === 'Available') || kittens[0]
    : null;
  const activeNotifications = Array.isArray(notifications) ? notifications : [];

  useEffect(() => {
    dispatch(getNotifications());
    dispatch(getSettings());
    if (!kittens || kittens.length === 0) {
      dispatch(getKittens());
    }
    const interval = setInterval(() => {
      dispatch(getNotifications());
    }, 60000);
    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
    setShowNotifications(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setShowNotifications(false);
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleToggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    setActiveDropdown(null);
  };

  return (
    <header ref={navRef} className="sticky top-0 z-50 w-full">
      {/* Top Editorial Utility Ribbon */}
      <div className="bg-[#181615] text-[#f3efea] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between text-[11px] tracking-wide">
          <div className="flex items-center gap-4 overflow-hidden">
            <span className="inline-flex items-center gap-1.5 font-medium text-[#e8b496]">
              <MapPin size={12} />
              Home Cattery in {catteryLocation}
            </span>
            <span className="hidden md:inline text-white/25">|</span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-white/80">
              <ShieldCheck size={12} className="text-[#8fc4a6]" />
              Vet-Examined · 72-Hr Health & 2-Year Genetic Guarantee
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {catteryPhone && (
              <>
                <a
                  href={`tel:${catteryPhone.replace(/[^\d+]/g, '')}`}
                  className="hidden md:inline-flex items-center gap-1.5 font-medium text-white/90 hover:text-[#e8b496] transition-colors"
                >
                  <Phone size={11} className="text-[#e8b496]" />
                  <span>{catteryPhone}</span>
                </a>
                <span className="hidden md:inline text-white/25">|</span>
              </>
            )}
            <Link
              to="/available-kittens"
              className="inline-flex items-center gap-1.5 font-semibold text-white hover:text-[#e8b496] transition-colors"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80] animate-pulse" />
              {availableCount > 0 ? `${availableCount} Kittens Available` : 'Browse Nursery'}
            </Link>
            <span className="hidden sm:inline text-white/25">|</span>
            <Link
              to="/shipping"
              className="hidden sm:inline-flex items-center gap-1 text-white/80 hover:text-white transition-colors"
            >
              <Plane size={11} /> In-Cabin Flight Nanny & Local Pickup
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? 'bg-[#faf8f5]/95 backdrop-blur-xl shadow-[0_10px_30px_-10px_rgba(24,22,21,0.08)] border-b border-[#181615]/10'
            : 'bg-[#faf8f5]/90 backdrop-blur-md border-b border-[#181615]/8'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo - Professional Clean Text Wordmark */}
          <Link
            to="/"
            className="group shrink-0 inline-flex items-baseline py-1 transition-opacity hover:opacity-95"
            aria-label="MunchkinKittie"
          >
            <span className="font-serif text-2xl sm:text-[27px] font-semibold tracking-[-0.02em] text-[#181615] group-hover:text-[#9e5a3c] transition-colors leading-none">
              Munchkin<span className="text-[#9e5a3c]">Kittie</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-full text-[13px] font-semibold transition-colors ${
                location.pathname === '/'
                  ? 'bg-[#181615] text-white'
                  : 'text-[#181615] hover:bg-[#f3efea]'
              }`}
            >
              Home
            </Link>

            <Link
              to="/available-kittens"
              className={`px-3.5 py-2 rounded-full text-[13px] font-semibold transition-colors inline-flex items-center gap-2 ${
                location.pathname === '/available-kittens' || location.pathname.startsWith('/kitten/')
                  ? 'bg-[#181615] text-white'
                  : 'text-[#181615] hover:bg-[#f3efea]'
              }`}
            >
              Available Kittens
              {availableCount > 0 && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-mono rounded-full ${
                    location.pathname === '/available-kittens'
                      ? 'bg-[#9e5a3c] text-white'
                      : 'bg-[#f5ebe6] text-[#84472c]'
                  }`}
                >
                  {availableCount}
                </span>
              )}
            </Link>

            {/* Nursery & Litters Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('nursery')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'nursery' ? null : 'nursery')}
                aria-expanded={activeDropdown === 'nursery'}
                className="px-3.5 py-2 rounded-full text-[13px] font-semibold text-[#181615] hover:bg-[#f3efea] inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                Nursery & Litters
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    activeDropdown === 'nursery' ? 'rotate-180 text-[#9e5a3c]' : 'text-[#8a8075]'
                  }`}
                />
              </button>

              {activeDropdown === 'nursery' && (
                <div className="absolute left-0 top-full pt-2.5 w-[540px] z-50">
                  <div className="bg-white rounded-3xl border border-[#181615]/10 editorial-shadow p-5 grid grid-cols-12 gap-5">
                    <div className="col-span-7 flex flex-col justify-between space-y-1.5">
                      <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a8075] mb-1">
                        Explore the Nursery
                      </p>
                      <Link
                        to="/available-kittens"
                        className="flex items-start gap-3 p-3 rounded-2xl hover:bg-[#faf8f5] transition-colors group"
                      >
                        <div className="h-9 w-9 rounded-xl bg-[#f5ebe6] text-[#9e5a3c] flex items-center justify-center shrink-0 mt-0.5">
                          <Sparkles size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#181615] group-hover:text-[#9e5a3c] flex items-center gap-1">
                            Available Kittens
                            <ArrowUpRight size={13} />
                          </p>
                          <p className="text-xs text-[#575049] mt-0.5">
                            Browse current kittens ready for reservation ($350 – $500).
                          </p>
                        </div>
                      </Link>

                      <Link
                        to="/upcoming-litters"
                        className="flex items-start gap-3 p-3 rounded-2xl hover:bg-[#faf8f5] transition-colors group"
                      >
                        <div className="h-9 w-9 rounded-xl bg-[#ebf1ee] text-[#263b30] flex items-center justify-center shrink-0 mt-0.5">
                          <Calendar size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#181615] group-hover:text-[#9e5a3c]">
                            Upcoming Litters
                          </p>
                          <p className="text-xs text-[#575049] mt-0.5">
                            See confirmed pairings, expected due dates, and join the priority list.
                          </p>
                        </div>
                      </Link>

                      <Link
                        to="/retired-adults"
                        className="flex items-start gap-3 p-3 rounded-2xl hover:bg-[#faf8f5] transition-colors group"
                      >
                        <div className="h-9 w-9 rounded-xl bg-[#f3efea] text-[#575049] flex items-center justify-center shrink-0 mt-0.5">
                          <Heart size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#181615] group-hover:text-[#9e5a3c]">
                            Retired Adults
                          </p>
                          <p className="text-xs text-[#575049] mt-0.5">
                            Gentle retired breeding queens & sires seeking quiet forever homes.
                          </p>
                        </div>
                      </Link>
                    </div>

                    {/* Live Kitten Feature Card in Mega-Menu */}
                    <div className="col-span-5">
                      <Link
                        to={spotlightKitten ? `/kitten/${spotlightKitten._id}` : '/available-kittens'}
                        className="group relative block h-full min-h-[210px] rounded-2xl overflow-hidden bg-[#f3efea] border border-[#181615]/10"
                      >
                        <img
                          src={
                            spotlightKitten?.images?.[0] ||
                            spotlightKitten?.img ||
                            CATTERY_PHOTOS.heroPrimary
                          }
                          alt={spotlightKitten?.name || 'Munchkin kitten'}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#181615]/85 via-[#181615]/20 to-transparent" />
                        <div className="absolute bottom-3.5 inset-x-3.5 text-white">
                          <span className="inline-block px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-semibold uppercase tracking-wider mb-1">
                            {spotlightKitten ? `Meet ${spotlightKitten.name}` : 'Nursery Spotlight'}
                          </span>
                          <p className="font-serif text-lg font-semibold leading-tight">
                            {spotlightKitten
                              ? `${spotlightKitten.gender} · ${formatKittenAge(spotlightKitten)} · $${spotlightKitten.price}`
                              : 'Hand-Raised Kittens'}
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Adoption & Care Mega-Menu */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('care')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'care' ? null : 'care')}
                aria-expanded={activeDropdown === 'care'}
                className="px-3.5 py-2 rounded-full text-[13px] font-semibold text-[#181615] hover:bg-[#f3efea] inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                Adoption & Health
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    activeDropdown === 'care' ? 'rotate-180 text-[#9e5a3c]' : 'text-[#8a8075]'
                  }`}
                />
              </button>

              {activeDropdown === 'care' && (
                <div className="absolute left-0 top-full pt-2.5 w-[560px] z-50">
                  <div className="bg-white rounded-3xl border border-[#181615]/10 editorial-shadow p-5 grid grid-cols-2 gap-2.5">
                    <Link
                      to="/about"
                      className="flex items-start gap-3 p-3 rounded-2xl hover:bg-[#faf8f5] transition-colors group"
                    >
                      <div className="h-9 w-9 rounded-xl bg-[#f5ebe6] text-[#9e5a3c] flex items-center justify-center shrink-0">
                        <Award size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#181615] group-hover:text-[#9e5a3c]">
                          About Our Cattery
                        </p>
                        <p className="text-xs text-[#575049] mt-0.5">
                          Our {catteryLocation} home upbringing & ethical breeding philosophy.
                        </p>
                      </div>
                    </Link>

                    <Link
                      to="/health"
                      className="flex items-start gap-3 p-3 rounded-2xl hover:bg-[#faf8f5] transition-colors group"
                    >
                      <div className="h-9 w-9 rounded-xl bg-[#ebf1ee] text-[#263b30] flex items-center justify-center shrink-0">
                        <ShieldCheck size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#181615] group-hover:text-[#9e5a3c]">
                          Health Guarantee
                        </p>
                        <p className="text-xs text-[#575049] mt-0.5">
                          72-hour general health & 2-year congenital warranty details.
                        </p>
                      </div>
                    </Link>

                    <Link
                      to="/vetting-process"
                      className="flex items-start gap-3 p-3 rounded-2xl hover:bg-[#faf8f5] transition-colors group"
                    >
                      <div className="h-9 w-9 rounded-xl bg-[#f3efea] text-[#181615] flex items-center justify-center shrink-0">
                        <Stethoscope size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#181615] group-hover:text-[#9e5a3c]">
                          Adoption & Vetting Process
                        </p>
                        <p className="text-xs text-[#575049] mt-0.5">
                          How we match kittens with loving, prepared indoor homes.
                        </p>
                      </div>
                    </Link>

                    <Link
                      to="/shipping"
                      className="flex items-start gap-3 p-3 rounded-2xl hover:bg-[#faf8f5] transition-colors group"
                    >
                      <div className="h-9 w-9 rounded-xl bg-[#f5ebe6] text-[#9e5a3c] flex items-center justify-center shrink-0">
                        <Plane size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#181615] group-hover:text-[#9e5a3c]">
                          Delivery & Flight Nanny
                        </p>
                        <p className="text-xs text-[#575049] mt-0.5">
                          In-cabin courier, VIP ground transport, or {catteryLocation} pickup.
                        </p>
                      </div>
                    </Link>

                    <Link
                      to="/pricing-deposit"
                      className="flex items-start gap-3 p-3 rounded-2xl hover:bg-[#faf8f5] transition-colors group"
                    >
                      <div className="h-9 w-9 rounded-xl bg-[#ebf1ee] text-[#263b30] flex items-center justify-center shrink-0">
                        <DollarSign size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#181615] group-hover:text-[#9e5a3c]">
                          Pricing & Reservations
                        </p>
                        <p className="text-xs text-[#575049] mt-0.5">
                          Transparent adoption fees ($350–$500) & what is included.
                        </p>
                      </div>
                    </Link>

                    <Link
                      to="/care-guide"
                      className="flex items-start gap-3 p-3 rounded-2xl hover:bg-[#faf8f5] transition-colors group"
                    >
                      <div className="h-9 w-9 rounded-xl bg-[#f3efea] text-[#181615] flex items-center justify-center shrink-0">
                        <BookOpen size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#181615] group-hover:text-[#9e5a3c]">
                          Kitten Care Guide
                        </p>
                        <p className="text-xs text-[#575049] mt-0.5">
                          Nutrition, litter setup, and first-week transition advice.
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/reviews"
              className={`px-3.5 py-2 rounded-full text-[13px] font-semibold transition-colors ${
                location.pathname === '/reviews'
                  ? 'bg-[#181615] text-white'
                  : 'text-[#181615] hover:bg-[#f3efea]'
              }`}
            >
              Family Stories
            </Link>

            <Link
              to="/contact"
              className={`px-3.5 py-2 rounded-full text-[13px] font-semibold transition-colors ${
                location.pathname === '/contact'
                  ? 'bg-[#181615] text-white'
                  : 'text-[#181615] hover:bg-[#f3efea]'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-2.5">
            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={handleToggleNotifications}
                aria-label="Cattery Announcements"
                className="relative h-10 w-10 rounded-full bg-[#f3efea] hover:bg-[#e8e1d5] text-[#181615] flex items-center justify-center transition-colors cursor-pointer"
              >
                <Bell size={17} />
                {activeNotifications.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-1 rounded-full bg-[#9e5a3c] text-white text-[10px] font-bold flex items-center justify-center">
                    {activeNotifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl bg-white border border-[#181615]/10 editorial-shadow overflow-hidden z-50">
                  <div className="px-5 py-3.5 bg-[#181615] text-white flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Nursery Bulletins
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowNotifications(false)}
                      className="text-white/60 hover:text-white"
                    >
                      <X size={15} />
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-[#181615]/8">
                    {activeNotifications.length > 0 ? (
                      activeNotifications.map((msg) => (
                        <div key={msg._id} className="p-4 hover:bg-[#faf8f5] transition-colors">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#f5ebe6] text-[#84472c]">
                              {msg.type || 'Update'}
                            </span>
                            <span className="text-[11px] text-[#8a8075] font-mono">
                              {msg.createdAt
                                ? new Date(msg.createdAt).toLocaleDateString()
                                : ''}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-[#181615] mt-1">{msg.title}</p>
                          <p className="text-xs text-[#575049] mt-1 leading-relaxed">
                            {msg.description || msg.message || msg.content}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <p className="text-xs font-medium text-[#8a8075]">
                          No new nursery announcements today.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Primary CTA */}
            <Link
              to="/apply"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#181615] hover:bg-[#9e5a3c] text-white text-xs font-semibold tracking-wide transition-colors shadow-xs"
            >
              Apply to Adopt
              <ArrowUpRight size={14} />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              className="lg:hidden h-10 w-10 rounded-full bg-[#181615] text-white flex items-center justify-center"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[116px] bottom-0 bg-[#faf8f5] z-50 overflow-y-auto border-t border-[#181615]/10">
          <div className="max-w-lg mx-auto px-5 py-6 space-y-6">
            <div className="space-y-1">
              <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a8075] mb-2">
                Nursery & Discovery
              </p>
              <Link
                to="/"
                className="flex items-center justify-between px-3.5 py-3 rounded-2xl text-base font-semibold text-[#181615] hover:bg-[#f3efea]"
              >
                Home
              </Link>
              <Link
                to="/available-kittens"
                className="flex items-center justify-between px-3.5 py-3 rounded-2xl text-base font-semibold text-[#181615] bg-[#f3efea]"
              >
                <span>Available Kittens</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#9e5a3c] text-white text-xs font-mono">
                  {availableCount} Available
                </span>
              </Link>
              <Link
                to="/upcoming-litters"
                className="flex items-center justify-between px-3.5 py-3 rounded-2xl text-base font-semibold text-[#181615] hover:bg-[#f3efea]"
              >
                Upcoming Litters
              </Link>
              <Link
                to="/retired-adults"
                className="flex items-center justify-between px-3.5 py-3 rounded-2xl text-base font-semibold text-[#181615] hover:bg-[#f3efea]"
              >
                Retired Adults
              </Link>
            </div>

            <div className="space-y-1 pt-4 border-t border-[#181615]/10">
              <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a8075] mb-2">
                Adoption, Health & Care
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/about"
                  className="p-3 rounded-2xl bg-white border border-[#181615]/8 text-xs font-semibold text-[#181615]"
                >
                  About Our Cattery
                </Link>
                <Link
                  to="/health"
                  className="p-3 rounded-2xl bg-white border border-[#181615]/8 text-xs font-semibold text-[#181615]"
                >
                  Health Guarantee
                </Link>
                <Link
                  to="/vetting-process"
                  className="p-3 rounded-2xl bg-white border border-[#181615]/8 text-xs font-semibold text-[#181615]"
                >
                  Vetting Process
                </Link>
                <Link
                  to="/shipping"
                  className="p-3 rounded-2xl bg-white border border-[#181615]/8 text-xs font-semibold text-[#181615]"
                >
                  Flight Nanny & Delivery
                </Link>
                <Link
                  to="/pricing-deposit"
                  className="p-3 rounded-2xl bg-white border border-[#181615]/8 text-xs font-semibold text-[#181615]"
                >
                  Pricing & Deposits
                </Link>
                <Link
                  to="/care-guide"
                  className="p-3 rounded-2xl bg-white border border-[#181615]/8 text-xs font-semibold text-[#181615]"
                >
                  Kitten Care Guide
                </Link>
                <Link
                  to="/reviews"
                  className="p-3 rounded-2xl bg-white border border-[#181615]/8 text-xs font-semibold text-[#181615]"
                >
                  Family Reviews
                </Link>
                <Link
                  to="/contact"
                  className="p-3 rounded-2xl bg-white border border-[#181615]/8 text-xs font-semibold text-[#181615]"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            <div className="pt-4 border-t border-[#181615]/10 flex flex-col gap-3">
              {catteryPhone && (
                <a
                  href={`tel:${catteryPhone.replace(/[^\d+]/g, '')}`}
                  className="w-full py-3 rounded-full bg-white border border-[#181615]/15 text-[#181615] text-center text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#f3efea] transition-colors"
                >
                  <Phone size={14} className="text-[#9e5a3c]" />
                  Call or Text: {catteryPhone}
                </a>
              )}
              <Link
                to="/apply"
                className="w-full py-3.5 rounded-full bg-[#181615] text-white text-center text-sm font-semibold"
              >
                Start Adoption Application
              </Link>
              <Link
                to="/available-kittens"
                className="w-full py-3.5 rounded-full bg-[#f5ebe6] text-[#84472c] text-center text-sm font-semibold"
              >
                Browse Available Kittens
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
