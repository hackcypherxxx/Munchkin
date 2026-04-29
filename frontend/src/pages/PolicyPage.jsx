import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Scale, FileText, Lock, Globe, Gavel } from 'lucide-react';
import { Link } from 'react-router-dom';

const PolicyPage = () => {
  const [activeTab, setActiveTab] = useState('privacy'); // 'privacy' or 'terms'

  const lastUpdated = "April 27, 2026";

  return (
    <div className="bg-white min-h-screen pt-32 pb-40">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* --- MINIMALIST HEADER --- */}
        <div className="mb-20 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-50 rounded-full border border-zinc-100 mb-6"
          >
            <ShieldCheck size={14} className="text-green-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Legal Transparency</span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-zinc-950 tracking-tighter mb-4 italic uppercase">
            {activeTab === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
          </h1>
          <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em]">Last Updated: {lastUpdated}</p>
        </div>

        {/* --- NAVIGATION SWITCH --- */}
        <div className="flex justify-center mb-24">
          <div className="bg-zinc-50 p-1.5 rounded-full border border-zinc-100 flex gap-2">
            <button 
              onClick={() => setActiveTab('privacy')}
              className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'privacy' ? 'bg-zinc-950 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-950'}`}
            >
              Privacy
            </button>
            <button 
              onClick={() => setActiveTab('terms')}
              className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'terms' ? 'bg-zinc-950 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-950'}`}
            >
              Terms
            </button>
          </div>
        </div>

        {/* --- CONTENT AREA --- */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="prose prose-zinc max-w-none"
          >
            {activeTab === 'privacy' ? (
              /* PRIVACY CONTENT */
              <div className="space-y-16">
                <section>
                  <h3 className="text-2xl font-black text-zinc-950 tracking-tight flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600"><Lock size={16}/></div>
                    Data Collection
                  </h3>
                  <p className="text-zinc-500 leading-relaxed font-medium">
                    We collect information you provide directly to us when you request kitten information, sign up for our waitlist, or contact our nursery. This may include your name, email address, physical location, and details regarding your home environment for kitten placement.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-black text-zinc-950 tracking-tight flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600"><Globe size={16}/></div>
                    Use of Information
                  </h3>
                  <p className="text-zinc-500 leading-relaxed font-medium">
                    Your information is used solely to facilitate the adoption process, verify applicant suitability, and provide updates on upcoming litters. We do not sell, rent, or trade your personal data with third-party marketers.
                  </p>
                </section>

                <section className="p-10 bg-zinc-50 rounded-[40px] border border-zinc-100">
                  <h3 className="text-lg font-black text-zinc-950 tracking-tight mb-4 uppercase">Cookie Policy</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Our website uses essential cookies to enhance your browsing experience. By continuing to use the site, you agree to our use of these technical cookies.
                  </p>
                </section>
              </div>
            ) : (
              /* TERMS CONTENT */
              <div className="space-y-16">
                <section>
                  <h3 className="text-2xl font-black text-zinc-950 tracking-tight flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center text-white"><Gavel size={16}/></div>
                    Adoption Agreement
                  </h3>
                  <p className="text-zinc-500 leading-relaxed font-medium">
                    All kitten adoptions are subject to a formal contract. A non-refundable deposit is required to join our waitlist. We reserve the right to refuse a sale if we determine a home environment is not suitable for the well-being of our kittens.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-black text-zinc-950 tracking-tight flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center text-white"><Scale size={16}/></div>
                    Health Guarantee
                  </h3>
                  <p className="text-zinc-500 leading-relaxed font-medium">
                    Our kittens come with a health guarantee against congenital defects. Specific terms of this guarantee, including mandatory veterinary exam windows, are detailed in the individual Sales Contract provided at the time of deposit.
                  </p>
                </section>

                <section className="p-10 bg-zinc-950 rounded-[40px] text-white">
                  <h3 className="text-lg font-black tracking-tight mb-4 uppercase text-green-500">Intellectual Property</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    All imagery, branding, and text content on this website are the exclusive property of our nursery. Unauthorized reproduction of kitten photos or brand assets is strictly prohibited.
                  </p>
                </section>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* --- FOOTER ASSISTANCE --- */}
        <div className="mt-32 pt-16 border-t border-zinc-100 text-center">
            <p className="text-zinc-400 text-sm font-medium mb-8 italic">Have questions regarding our legal protocols?</p>
            <Link to="/contact" >
              <button className="px-10 py-5 border-2 border-zinc-200 rounded-full text-[10px] font-black uppercase tracking-widest hover:border-zinc-950 transition-all">
                Contact Legal Concierge
            </button>
            </Link>
          
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;