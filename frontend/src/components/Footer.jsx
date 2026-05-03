import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSettings } from '../features/settings/settingsSlice'; // Adjust path if needed

// Functional UI Icons
import { 
  Mail, 
  Phone, 
  MapPin, 
  ArrowUpRight, 
  ShieldCheck,
  Heart
} from 'lucide-react';

// Brand Specific Icons
import { FiInstagram, FiFacebook } from 'react-icons/fi';
import LogoImg from '../assets/LOGO1.png'; 

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const dispatch = useDispatch();

  // Pull settings from Redux state
  const { settings } = useSelector((state) => state.settings);

  // Fetch settings on mount
  useEffect(() => {
    dispatch(getSettings());
  }, [dispatch]);

  // Handle data structure (in case backend returns an array)
  const activeSettings = Array.isArray(settings) ? settings[0] : settings;

  // Updated with 'path' to work with your App Router
  const footerLinks = [
    {
      title: "The Nursery",
      links: [
        { name: "Available Kittens", path: "/available-kittens" },
        { name: "Upcoming Litters", path: "/upcoming-litters" },
        { name: "Retired Adults", path: "/retired-adults" },
        { name: "Pricing & Deposit", path: "/pricing-deposit" }
      ]
    },
    {
      title: "Adoption Process",
      links: [
        { name: "Shipping & Delivery", path: "/shipping" },
        { name: "Health Guarantee", path: "/health" },
        { name: "Care Guide", path: "/care-guide" },
        { name: "The Vetting Process", path: "/vetting-process" }
      ]
    },
    {
      title: "Our World",
      links: [
        { name: "About the Breeder", path: "/about" },
        { name: "Client Reviews", path: "/reviews" },
        { name: "Contact Us", path: "/contact" }
      ]
    }
  ];

  const socialLinks = [
    { Icon: FiFacebook, href: activeSettings?.facebook || "https://www.facebook.com/profile.php?id=61589228033999", isExternal: true },
    { Icon: Mail, href: `mailto:${activeSettings?.email || "info@munchkinkittie.com"}`, isExternal: true }
  ];

  // Smooth scroll to top when clicking internal links
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white pt-24 pb-12 border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* TOP SECTION: BRAND & NEWSLETTER */}
        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          <div>
            <Link to="/" onClick={scrollToTop} className="flex items-center gap-3 mb-8 group cursor-pointer w-fit">
              <div className="relative w-14 h-14 overflow-hidden">
                <img 
                  src={LogoImg} 
                  alt="MunchkinKittie Logo" 
                  className="w-full h-full object-contain scale-150 mix-blend-multiply" 
                />
              </div>
              <h2 className="text-3xl font-black tracking-tighter text-zinc-900">
                Munchkin<span className="text-green-600">Kittie</span>
              </h2>
            </Link>
            <p className="text-zinc-500 text-lg font-medium max-w-sm mb-8 leading-relaxed">
              Ethical breeding with a family-first philosophy. Raising healthy, short-legged companions since 2012.
            </p>
            
            {/* SOCIAL BAR */}
            <div className="flex gap-4">
              {socialLinks.map(({ Icon, href }, i) => (
                <motion.a 
                  key={i}
                  whileHover={{ y: -4, scale: 1.1 }}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-green-600 hover:bg-green-50 transition-all border border-zinc-100"
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* NEWSLETTER BOX */}
          <div className="bg-zinc-950 rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-3xl font-black tracking-tight mb-4">Join the Litter List</h3>
              <p className="text-zinc-400 font-medium mb-8 max-w-xs">Be the first to know when new Munchkin litters are born.</p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-1 bg-white/10 border border-white/15 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm font-bold text-white placeholder:text-zinc-500"
                />
                <button className="bg-white text-zinc-950 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all active:scale-95 shadow-xl shadow-black/20">
                  Subscribe
                </button>
              </div>
            </div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-green-600/20 rounded-full blur-[80px]" />
          </div>
        </div>

        {/* MIDDLE SECTION: LINKS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20 border-t border-zinc-100 pt-20">
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-8">{column.title}</h4>
              <ul className="space-y-4">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path} 
                      onClick={scrollToTop}
                      className="text-zinc-600 font-bold hover:text-green-600 flex items-center gap-1 group/link transition-colors"
                    >
                      {link.name}
                      <ArrowUpRight size={14} className="opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* DYNAMIC CONTACT INFO FROM BACKEND */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-8">Contact</h4>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="text-green-600 pt-1"><MapPin size={18} /></div>
                <p className="text-zinc-600 font-bold leading-tight">
                  {activeSettings?.mainLocation || "Nursery Location"}<br />
                  <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">Breeding Facility</span>
                </p>
              </li>
              <li className="flex gap-4">
                <div className="text-green-600 pt-1"><Phone size={18} /></div>
                <p className="text-zinc-600 font-bold leading-tight">
                  {activeSettings?.phone || "(854) 910 0148"}<br />
                  <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">
                    {activeSettings?.weekdayHours || "Mon - Fri: 9am - 5pm"}
                  </span>
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM SECTION: LEGAL & TRUST */}
        <div className="border-t border-zinc-100 pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="flex items-center gap-6">
            <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">
              © {currentYear} MunchkinKittie
            </p>
            <div className="hidden md:flex gap-4 text-zinc-300 text-[10px] font-black uppercase tracking-widest">
              <Link to="/terms-policy" onClick={scrollToTop} className="hover:text-zinc-950 transition-colors">Privacy</Link>
              <Link to="/terms-policy" onClick={scrollToTop} className="hover:text-zinc-950 transition-colors">Terms</Link>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-zinc-50 px-6 py-3 rounded-full border border-zinc-100 shadow-sm">
            <ShieldCheck size={16} className="text-green-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Licensed & TICA Certified Breeder
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-black uppercase tracking-widest">
            Made with <Heart size={12} className="text-red-400 fill-red-400" /> for the breed
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;