import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { getNotifications } from '../features/notification/notificationSlice';
import LogoImg from '../assets/LOGO1.png';

import {
  ChevronRight,
  Menu,
  X,
  Bell,
  Cat,
  Sparkles,
  Heart,
  BookOpenCheck,
  Package,
  CalendarDays,
  Medal,
  ArrowRight,
  ShieldCheck,
  Info,
  Mail,
  Zap,
  Clock,
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const springTransition = { type: 'spring', damping: 25, stiffness: 200, mass: 0.5 };

const menuSlide = {
  initial: { x: '100%' },
  animate: { x: 0, transition: { type: 'spring', damping: 30, stiffness: 300 } },
  exit: { x: '100%', transition: { type: 'spring', damping: 30, stiffness: 300 } },
};

const Navbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const { notifications } = useSelector((state) => state.notification);

  useEffect(() => {
    dispatch(getNotifications());
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dispatch]);

  // Prevent background scroll when mobile menu open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navData = [
    {
      name: 'Nursery',
      path: '/available-kittens',
      icon: <Cat size={18} />,
      dropdown: [
        { name: 'Available Kittens', path: '/available-kittens', desc: 'Ready for forever homes', icon: <Medal /> },
        { name: 'Retired Adults', path: '/retired-adults', desc: 'Legacy cats for adoption', icon: <Heart /> },
        { name: 'Upcoming Litters', path: '/upcoming', desc: 'Reserve your spot', icon: <CalendarDays /> },
      ],
    },
    {
      name: 'Process',
      path: '/vetting-process',
      icon: <BookOpenCheck size={18} />,
      dropdown: [
        { name: 'The Vetting Process', path: '/vetting-process', desc: 'How we ensure health', icon: <ShieldCheck /> },
        { name: 'Health Guarantee', path: '/health', desc: 'Our 2-year warranty', icon: <ShieldCheck /> },
        { name: 'Pricing & Deposit', path: '/pricing-deposit', desc: 'Investment & Terms', icon: <Info /> },
      ],
    },
    {
      name: 'Resources',
      path: '/care-guide',
      icon: <Sparkles size={18} />,
      dropdown: [
        {name:'Client Testimonials', path:'/reviews', desc:'Hear from happy adopters', icon:<Info />},
        { name: 'Care Guide', path: '/care-guide', desc: 'Munchkin health 101', icon: <Cat /> },
        { name: 'Shipping & Delivery', path: '/shipping', desc: 'Safe travel info', icon: <Package /> },
      ],
    },
    { name: 'Contact', path: '/contact', icon: <Mail size={18} /> },
  ];

  return (
    <LayoutGroup>
      {/* --- DESKTOP & MOBILE TOP BAR --- */}
      <nav
        className={cn(
          'fixed top-0 w-full z-[100] transition-all duration-500',
          isScrolled
            ? 'py-3 bg-white/90 backdrop-blur-2xl border-b border-zinc-200/50 shadow-sm'
            : 'py-5 bg-white'
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* BRAND */}
          <Link to="/" className="flex items-center gap-2 group cursor-pointer z-50">
            <motion.div
              whileHover={{ scale: 1.1, rotate: -5 }}
              transition={springTransition}
              className="relative flex items-center justify-center w-12 h-12 overflow-hidden"
            >
              <img
                src={LogoImg}
                alt="MunchkinKittie"
                className="w-full h-full scale-150 object-contain mix-blend-multiply"
              />
            </motion.div>
            <h1 className="text-2xl font-black tracking-tighter text-zinc-900 flex items-center">
              Munchkin<span className="text-green-600">Kittie</span>
            </h1>
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center gap-1 px-2 py-1 bg-zinc-50/50 rounded-full border border-zinc-200/20">
            {navData.map((link) => (
              <div
                key={link.name}
                className="relative"
                onMouseEnter={() => setActiveDropdown(link.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    cn(
                      'px-5 py-2 text-[13px] font-black uppercase tracking-widest transition-all rounded-full flex items-center gap-1',
                      isActive
                        ? 'bg-white text-green-600 shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-900',
                      activeDropdown === link.name && 'text-green-600'
                    )
                  }
                >
                  {link.name}
                  {link.dropdown && (
                    <ChevronRight
                      size={12}
                      className={cn(
                        'transition-transform duration-300 opacity-50',
                        activeDropdown === link.name && 'rotate-90 opacity-100'
                      )}
                    />
                  )}
                </NavLink>

                <AnimatePresence>
                  {link.dropdown && activeDropdown === link.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 pt-4"
                    >
                      <div className="bg-white border border-zinc-100 shadow-2xl rounded-[32px] p-2 min-w-[300px]">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-center gap-4 p-3 hover:bg-zinc-50 rounded-2xl transition-colors group/item"
                          >
                            <div className="bg-zinc-50 text-zinc-400 p-2.5 rounded-xl group-hover/item:bg-zinc-900 group-hover/item:text-white transition-all">
                              {React.cloneElement(item.icon, { size: 16 })}
                            </div>
                            <div>
                              <p className="text-[11px] font-black uppercase tracking-tight text-zinc-900">
                                {item.name}
                              </p>
                              <p className="text-[10px] text-zinc-400 font-bold leading-tight">
                                {item.desc}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* UTILITY ACTIONS */}
          <div className="flex items-center gap-3 relative" ref={notificationRef}>
            {/* NOTIFICATION BELL */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className={cn(
                'relative p-3 transition-all rounded-full',
                showNotifications
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-50 md:bg-transparent text-zinc-500 hover:text-zinc-900'
              )}
            >
              <Bell size={20} />
              {notifications?.length > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white animate-pulse" />
              )}
            </motion.button>

            {/* NOTIFICATION PANEL – NOW WITH FULL TEXT */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  className="absolute top-[120%] right-0 w-[calc(100vw-32px)] sm:w-[420px] bg-white border border-zinc-100 shadow-[0_30px_60px_rgba(0,0,0,0.12)] rounded-[35px] overflow-hidden z-[110]"
                >
                  <div className="p-6 border-b border-zinc-50 flex justify-between items-center bg-zinc-50/50">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                        Broadcasts
                      </p>
                      <h4 className="text-lg font-black italic uppercase tracking-tighter">
                        Activity Feed
                      </h4>
                    </div>
                    <span className="bg-zinc-900 text-white text-[9px] font-black px-3 py-1 rounded-full">
                      {notifications?.length || 0} NEW
                    </span>
                  </div>

                  <div className="max-h-[400px] overflow-y-auto p-4 space-y-2">
                    {notifications?.length > 0 ? (
                      notifications.map((n) => (
                        <div
                          key={n._id}
                          className="flex gap-4 p-4 hover:bg-zinc-50 rounded-[24px] transition-all"
                        >
                          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-zinc-100 flex-shrink-0">
                            <img
                              src={n.image}
                              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                              alt=""
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-[11px] font-black uppercase tracking-tight text-zinc-900 leading-tight mb-1 break-words">
                              {n.title}
                            </h5>
                            {/* Description now shows full text without ellipsis */}
                            <p className="text-[10px] font-bold text-zinc-400 leading-relaxed whitespace-pre-wrap break-words">
                              {n.description}
                            </p>
                            <div className="flex items-center gap-2 text-zinc-300 mt-2">
                              <Clock size={10} />
                              <span className="text-[8px] font-black uppercase tracking-widest">
                                System Alert
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-200">
                          <Zap size={24} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                          All caught up
                        </p>
                      </div>
                    )}
                  </div>

                  {notifications?.length > 0 && (
                    <div className="p-4 bg-zinc-50/50 border-t border-zinc-50">
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="w-full py-3 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 transition-colors"
                      >
                        Close Broadcasts
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* DESKTOP CTA */}
            <Link
              to="/available-kittens"
              className="hidden lg:flex bg-zinc-950 text-white px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-all active:scale-95"
            >
              Find My Kitten
            </Link>

            {/* MOBILE HAMBURGER */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-3 bg-zinc-50 rounded-full text-zinc-900 hover:bg-zinc-100 transition-colors"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU (outside nav for isolation) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[9999] isolate">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-zinc-950/60 backdrop-blur-md"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              variants={menuSlide}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute top-0 right-0 h-[100dvh] w-[88%] max-w-[400px] bg-white shadow-2xl flex flex-col"
            >
              <div className="p-6 md:p-8 flex justify-between items-center border-b border-zinc-100">
                <div className="flex items-center gap-3">
                  <img
                    src={LogoImg}
                    alt="Logo"
                    className="w-8 h-8 object-contain mix-blend-multiply"
                  />
                  <span className="font-black text-xl tracking-tighter uppercase">Menu</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 bg-zinc-50 rounded-full text-zinc-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
                <Link
                  to="/available-kittens"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block bg-green-600 p-8 rounded-[32px] text-white shadow-xl shadow-green-100/50"
                >
                  <Cat size={32} className="mb-4 text-white/50" />
                  <p className="text-2xl font-black tracking-tighter leading-none mb-2">
                    Browse Nursery
                  </p>
                  <p className="text-green-100 text-[10px] font-black uppercase tracking-widest opacity-90">
                    Find Your Soulmate
                  </p>
                </Link>

                <div className="space-y-2">
                  {navData.map((link) => (
                    <div key={link.name} className="space-y-1">
                      <NavLink
                        to={link.path}
                        onClick={() => !link.dropdown && setMobileMenuOpen(false)}
                        className="flex items-center justify-between p-5 hover:bg-zinc-50 rounded-2xl group transition-all"
                      >
                        <span className="font-black uppercase tracking-widest text-xs text-zinc-900 flex items-center gap-3">
                          <span className="text-zinc-300">{link.icon}</span>
                          {link.name}
                        </span>
                        <ChevronRight size={16} className="text-zinc-300" />
                      </NavLink>
                      {link.dropdown && (
                        <div className="pl-[52px] space-y-1 border-l-2 border-zinc-50 ml-7 mb-4">
                          {link.dropdown.map((sub) => (
                            <Link
                              key={sub.name}
                              to={sub.path}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block p-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:text-green-600 transition-colors"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-0 inset-x-0 p-6 bg-white border-t border-zinc-100 z-10 pb-[max(env(safe-area-inset-bottom),24px)]">
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full bg-zinc-950 text-white py-6 rounded-[24px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-transform"
                >
                  Contact Concierge <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
};

export default Navbar;