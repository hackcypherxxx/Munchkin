import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

// --- API & REDUX ---
// Importing exactly as seen in your working AdminDashboard
import { createContact, clearContactState } from '../features/contact/contactSlice';
import { getSettings } from '../features/settings/settingsSlice';

// --- ICONS ---
import { FaInstagram, FaFacebookF } from 'react-icons/fa6'; 
import { 
  Mail, Phone, MapPin, Clock,
  CheckCircle2, AlertCircle, Loader2, ChevronDown,
  ShieldCheck, Sparkles,
  ArrowRight
} from 'lucide-react';

const ContactUs = () => {
  const dispatch = useDispatch();
  
  // 1. PULL SETTINGS FROM REDUX (Matching your AdminDashboard state structure)
  const { settings, loading: settingsLoading } = useSelector((state) => state.settings);
  const { loading: contactLoading, success, error: contactError } = useSelector((state) => state.contact);

  // Local Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: 'New Kitten Interest', 
    message: ''
  });

  useEffect(() => {
    // 2. FETCH SETTINGS ON MOUNT (Matches AdminDashboard useEffect)
    dispatch(getSettings());
    
    return () => {
      if (clearContactState) dispatch(clearContactState());
    };
  }, [dispatch]);

  // Logic to handle if backend returns an array or an object (Matches your slice logic)
  const activeSettings = Array.isArray(settings) ? settings[0] : settings;

  const isFormValid = 
    formData.name.trim().length > 0 && 
    formData.email.includes('@') && 
    formData.message.trim().length > 5;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      dispatch(createContact(formData));
    }
  };

  return (
    <div className="bg-white min-h-screen pt-32 pb-40 selection:bg-green-600 selection:text-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- SECTION HEADER --- */}
        <div className="max-w-5xl mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-10"
          >
            <span className="w-12 h-[1px] bg-zinc-200" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400 flex items-center gap-2">
              <Sparkles size={12} className="text-green-600" /> Professional Concierge
            </span>
          </motion.div>
          
          <h1 className="text-7xl md:text-[130px] font-black text-zinc-950 tracking-tighter leading-[0.8] mb-12">
            Secure your <br />
            <span className="text-green-600 italic">Companion.</span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-12 gap-20">
          
          {/* --- LEFT SIDE: LOGISTICS (DYNAMIC FROM BACKEND) --- */}
          <div className="lg:col-span-5 space-y-12">
            <div className="grid gap-4">
              
              {/* EMAIL (Add manually in frontend or via backend if available) */}
              <div className="flex items-center gap-6 p-8 rounded-[36px] bg-zinc-50/50 border border-zinc-100 group shadow-sm hover:border-zinc-950 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-zinc-400 group-hover:text-green-600 transition-all">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-0.5">Direct Email</p>
                  <p className="text-sm font-black text-zinc-950 tracking-tight">
                    {activeSettings?.email || "info@munchkinkittie.com"} 
                  </p>
                </div>
              </div>

              {/* PHONE (Add manually in frontend or via backend if available) */}
              <div className="flex items-center gap-6 p-8 rounded-[36px] bg-zinc-50/50 border border-zinc-100 group shadow-sm hover:border-zinc-950 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-zinc-400 group-hover:text-green-600 transition-all">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-0.5">Concierge Line</p>
                  <p className="text-sm font-black text-zinc-950 tracking-tight">
                    {activeSettings?.phone || "+1 (954) 910-0148"}
                  </p>
                </div>
              </div>

              {/* LOCATION (PULLING mainLocation AS IN ADMIN DASHBOARD) */}
              <div className="flex items-center gap-6 p-8 rounded-[36px] bg-zinc-50/50 border border-zinc-100 group shadow-sm hover:border-zinc-950 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-zinc-400 group-hover:text-green-600 transition-all">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-0.5">Headquarters</p>
                  <p className="text-sm font-black text-zinc-950 tracking-tight">
                    {settingsLoading ? "Updating..." : (activeSettings?.mainLocation || "Registry Location Pending")}
                  </p>
                </div>
              </div>
            </div>

            {/* Availability / Hours */}
            <div className="p-12 rounded-[60px] bg-zinc-950 text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10">
                <Clock className="text-green-500 mb-8" size={32} />
                <h4 className="text-2xl font-black mb-8 uppercase tracking-tighter italic">Response <span className="text-zinc-700 underline decoration-green-600/30">Protocol</span></h4>
                <div className="space-y-6 border-t border-zinc-800 pt-8">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                    <span className="text-zinc-500">Business Hours</span>
                    <span className="text-white">09:00 — 18:00 EST</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT SIDE: CONTACT FORM --- */}
          <div className="lg:col-span-7">
            <div className="bg-zinc-50 rounded-[80px] p-12 md:p-24 border border-zinc-100 shadow-sm">
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
                    <div className="w-24 h-24 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-xl"><CheckCircle2 size={44} /></div>
                    <h2 className="text-5xl font-black tracking-tighter mb-6 uppercase italic">Sent Successfully</h2>
                    <button onClick={() => dispatch(clearContactState())} className="px-10 py-5 bg-zinc-950 text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-green-600 transition-all">New Message</button>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h3 className="text-4xl font-black tracking-tighter text-zinc-950 uppercase italic leading-none mb-16">Inquiry <br/> Application</h3>
                    <form onSubmit={handleSubmit} className="space-y-10">
                      <div className="grid md:grid-cols-2 gap-8">
                        <input required name="name" value={formData.name} onChange={handleChange} type="text" placeholder="Full Identity" className="w-full px-8 py-5 bg-white rounded-[24px] border border-transparent focus:border-zinc-950 outline-none font-bold text-sm shadow-sm" />
                        <input required name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Email Address" className="w-full px-8 py-5 bg-white rounded-[24px] border border-transparent focus:border-zinc-950 outline-none font-bold text-sm shadow-sm" />
                      </div>
                      <select name="inquiryType" value={formData.inquiryType} onChange={handleChange} className="w-full px-8 py-5 bg-white rounded-[24px] outline-none font-bold text-sm shadow-sm appearance-none">
                        <option value="New Kitten Interest">New Kitten Interest</option>
                        <option value="Waiting List Status">Waiting List Status</option>
                      </select>
                      <textarea required name="message" value={formData.message} onChange={handleChange} rows="5" placeholder="Your Message" className="w-full px-8 py-8 bg-white rounded-[40px] outline-none font-bold text-sm shadow-sm resize-none" />
                      <button disabled={contactLoading || !isFormValid} className="w-full py-8 rounded-[40px] font-black text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-4 transition-all bg-zinc-950 text-white hover:bg-green-600 disabled:opacity-30">
                        {contactLoading ? <Loader2 size={20} className="animate-spin" /> : <>Send Application <ArrowRight size={18} /></>}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;