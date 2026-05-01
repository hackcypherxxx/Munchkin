import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useSearchParams } from 'react-router-dom';

// --- API & REDUX ---
import { createApplication, clearApplicationState } from '../features/application/applicationSlice';

// --- ICONS ---
import {
  User, Mail, Phone, MapPin, Home,
  PawPrint, Star, Send, CheckCircle2,
  AlertCircle, Loader2, Sparkles, ShieldCheck,
  ChevronRight, Info, CreditCard, Heart
} from 'lucide-react';

const AdoptionApplication = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { loading, success, error } = useSelector((state) => state.application);

  // Auto‑fill from kitten detail page
  const preSelectedId = searchParams.get('id');
  const preSelectedType = searchParams.get('type') || 'kitten';
  const preSelectedName = searchParams.get('name'); // new

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    applicationType: preSelectedType,
    itemId: preSelectedId || null,
    applicationTypeModel: preSelectedType === 'kitten' ? 'Kitten' : preSelectedType === 'retired' ? 'RetiredKitten' : 'Upcoming',
    homeDescription: '',
    hasPets: false,
    experience: '',
    paymentMethod: '',
    paymentMethodOther: ''
  });

  useEffect(() => {
    return () => dispatch(clearApplicationState());
  }, [dispatch]);

  const handleTypeChange = (val) => {
    if (preSelectedId) return; // locked
    let model = 'Kitten';
    if (val === 'retired') model = 'RetiredKitten';
    if (val === 'upcoming') model = 'Upcoming';
    setFormData({ ...formData, applicationType: val, applicationTypeModel: model });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handlePaymentMethodChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      paymentMethod: value,
      paymentMethodOther: value === 'other' ? formData.paymentMethodOther : ''
    });
  };

  const isFormValid =
    formData.fullName.length > 2 &&
    formData.email.includes('@') &&
    formData.homeDescription.length > 10 &&
    formData.paymentMethod !== '' &&
    (formData.paymentMethod !== 'other' || formData.paymentMethodOther.trim() !== '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      const submissionData = {
        ...formData,
        paymentMethodOther: formData.paymentMethod === 'other' ? formData.paymentMethodOther : undefined
      };
      dispatch(createApplication(submissionData));
    }
  };

  return (
    <div className="bg-white min-h-screen pt-32 pb-40 selection:bg-green-600 selection:text-white">
      <div className="max-w-5xl mx-auto px-6">

        {/* HEADER */}
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-zinc-50 border border-zinc-100 mb-8"
          >
            <ShieldCheck size={14} className="text-green-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Secure Pedigree Application</span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-black text-zinc-950 tracking-tighter leading-none mb-6 uppercase italic">
            Placement <span className="text-green-600">Form.</span>
          </h1>
          <p className="text-zinc-400 font-medium max-w-xl mx-auto">
            Our placement process ensures that every feline is matched with an environment that suits their unique temperament and heritage.
          </p>

          {/* ── Show which kitten if pre‑selected ── */}
          {preSelectedName && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 inline-flex items-center gap-3 px-6 py-3 rounded-full bg-green-50 border border-green-200"
            >
              <Heart size={16} className="text-green-600 fill-green-600" />
              <span className="text-sm font-black text-green-800 uppercase tracking-wider">
                You're applying for <span className="italic">“{preSelectedName}”</span>
              </span>
            </motion.div>
          )}
        </div>

        <div className="bg-zinc-50 border border-zinc-100 rounded-[64px] overflow-hidden shadow-sm relative">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-20 text-center py-40"
              >
                <div className="w-24 h-24 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-5xl font-black tracking-tighter uppercase italic mb-6">Application Filed</h2>
                <p className="text-zinc-500 max-w-sm mx-auto font-medium mb-12">
                  Your profile has been added to our concierge queue. We review all applications within 48 hours.
                </p>
                <button
                  onClick={() => window.location.href = '/'}
                  className="px-12 py-6 bg-zinc-950 text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-green-600 transition-all"
                >
                  Return to Gallery
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="p-8 md:p-20 space-y-16"
              >

                {/* SECTION 1: PERSONAL */}
                <section>
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm text-green-600 border border-zinc-100">
                      <User size={18} />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tighter italic">Identity <span className="text-zinc-300">&</span> Contact</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-4">Full Legal Name</label>
                      <input required name="fullName" value={formData.fullName} onChange={handleChange} type="text" placeholder="Johnathan Doe" className="w-full px-8 py-5 bg-white rounded-3xl border-none focus:ring-2 ring-green-600/20 outline-none font-bold text-sm shadow-sm transition-all" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-4">Email Address</label>
                      <input required name="email" value={formData.email} onChange={handleChange} type="email" placeholder="care@domain.com" className="w-full px-8 py-5 bg-white rounded-3xl border-none focus:ring-2 ring-green-600/20 outline-none font-bold text-sm shadow-sm transition-all" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-4">Phone Number</label>
                      <input name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="+1 (555) 000-0000" className="w-full px-8 py-5 bg-white rounded-3xl border-none focus:ring-2 ring-green-600/20 outline-none font-bold text-sm shadow-sm transition-all" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-4">Current Location</label>
                      <input name="location" value={formData.location} onChange={handleChange} type="text" placeholder="City, State / Province" className="w-full px-8 py-5 bg-white rounded-3xl border-none focus:ring-2 ring-green-600/20 outline-none font-bold text-sm shadow-sm transition-all" />
                    </div>
                  </div>
                </section>

                {/* SECTION 2: PREFERENCES + PAYMENT */}
                <section>
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm text-green-600 border border-zinc-100">
                      <PawPrint size={18} />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tighter italic">Preference <span className="text-zinc-300">&</span> Intent</h3>
                  </div>

                  {/* Application Type */}
                  <div className="space-y-3 mb-8">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-4">Application Type</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {['kitten', 'retired', 'upcoming'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handleTypeChange(type)}
                          disabled={!!preSelectedId}
                          className={`py-5 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all border-2
                            ${formData.applicationType === type
                              ? 'bg-zinc-950 text-white border-zinc-950 shadow-xl'
                              : 'bg-white text-zinc-400 border-transparent hover:border-zinc-200'}
                            ${preSelectedId ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-4 flex items-center gap-2">
                      <CreditCard size={14} className="text-green-600" />
                      Preferred Payment Method
                    </label>
                    <select
                      required
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handlePaymentMethodChange}
                      className="w-full px-8 py-5 bg-white rounded-3xl border-none focus:ring-2 ring-green-600/20 outline-none font-bold text-sm shadow-sm transition-all appearance-none"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.5rem center', backgroundSize: '1.5em' }}
                    >
                      <option value="" disabled>Choose a method</option>
                      <option value="apple pay">Apple Pay</option>
                      <option value="cash app">Cash App</option>
                      <option value="zelle">Zelle</option>
                      <option value="chime">Chime</option>
                      <option value="giftcard">Gift Card</option>
                      <option value="other">Other</option>
                    </select>

                    {/* Conditional “Other” input */}
                    {formData.paymentMethod === 'other' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3"
                      >
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-4">
                          Please describe your method
                        </label>
                        <input
                          type="text"
                          name="paymentMethodOther"
                          value={formData.paymentMethodOther}
                          onChange={handleChange}
                          placeholder="e.g. Venmo, PayPal, bank transfer..."
                          className="w-full px-8 py-5 bg-white rounded-3xl border-none focus:ring-2 ring-green-600/20 outline-none font-bold text-sm shadow-sm transition-all"
                        />
                      </motion.div>
                    )}
                  </div>
                </section>

                {/* SECTION 3: SCREENING */}
                <section>
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm text-green-600 border border-zinc-100">
                      <Home size={18} />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tighter italic">Environment <span className="text-zinc-300">&</span> History</h3>
                  </div>

                  <div className="space-y-10">
                    <div className="flex items-center justify-between p-8 bg-white rounded-3xl shadow-sm border border-zinc-100">
                      <div>
                        <p className="text-sm font-black text-zinc-950 uppercase tracking-tighter italic">Current Pet Presence</p>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Do you currently have other animals?</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, hasPets: !formData.hasPets})}
                        className={`w-16 h-8 rounded-full relative transition-colors duration-300 ${formData.hasPets ? 'bg-green-600' : 'bg-zinc-200'}`}
                      >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${formData.hasPets ? 'left-9' : 'left-1'}`} />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-4">Describe your Home Environment</label>
                      <textarea required name="homeDescription" value={formData.homeDescription} onChange={handleChange} rows="4" placeholder="Briefly explain the living situation for your new companion..." className="w-full px-8 py-8 bg-white rounded-[40px] border-none focus:ring-2 ring-green-600/20 outline-none font-bold text-sm shadow-sm transition-all resize-none" />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-4">Previous Feline Experience</label>
                      <textarea name="experience" value={formData.experience} onChange={handleChange} rows="3" placeholder="Tell us about your history with pets..." className="w-full px-8 py-8 bg-white rounded-[40px] border-none focus:ring-2 ring-green-600/20 outline-none font-bold text-sm shadow-sm transition-all resize-none" />
                    </div>
                  </div>
                </section>

                {/* FOOTER & SUBMIT */}
                <div className="pt-10 border-t border-zinc-100">
                  <div className="flex items-center gap-4 p-8 rounded-[40px] bg-green-50/50 border border-green-100 mb-10">
                    <Info className="text-green-600 flex-shrink-0" size={20} />
                    <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest leading-loose">
                      By submitting this form, you acknowledge that you are applying for a living companion and agree to our health and welfare guidelines.
                    </p>
                  </div>

                  {error && (
                    <div className="flex items-center gap-3 p-6 bg-red-50 text-red-600 rounded-[30px] text-[10px] font-black uppercase tracking-widest mb-10 border border-red-100">
                      <AlertCircle size={18} /> {error}
                    </div>
                  )}

                  <button
                    disabled={loading || !isFormValid}
                    className={`w-full py-8 rounded-[40px] font-black text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-4 transition-all shadow-2xl active:scale-[0.98]
                      ${isFormValid ? 'bg-zinc-950 text-white hover:bg-green-600' : 'bg-zinc-100 text-zinc-300 cursor-not-allowed'}`}
                  >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <>Submit Application <ChevronRight size={18} /></>}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* DYNAMIC HELP FOOTER */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { icon: <Sparkles />, title: "Waitlist", desc: "Approved apps join our priority list" },
             { icon: <ShieldCheck />, title: "Security", desc: "Encrypted data handling" },
             { icon: <Star />, title: "Support", desc: "Lifetime concierge support" }
           ].map((box, i) => (
             <div key={i} className="flex items-center gap-5 p-8 rounded-[32px] border border-zinc-50 bg-zinc-50/30">
               <div className="text-green-600">{box.icon}</div>
               <div>
                 <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-950 mb-1">{box.title}</h5>
                 <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{box.desc}</p>
               </div>
             </div>
           ))}
        </div>

      </div>
    </div>
  );
};

export default AdoptionApplication;