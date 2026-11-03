import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Heart, 
  Stethoscope, 
  Sparkles, 
  Home, 
  ShieldCheck, 
  Award, 
  Microscope, 
  Leaf, 
  Camera,
  ArrowRight,
  CheckCircle2,
  Plane
} from 'lucide-react';

const ProcessSection = () => {
  const steps = [
    { 
      id: "01", 
      title: "Roster Match & Inquiry", 
      desc: "Select your desired companion or reserve priority selection on an upcoming planned litter.",
      icon: MessageCircle 
    },
    { 
      id: "02", 
      title: "Applicant Screening", 
      desc: "Structured qualification to ensure lifelong health, safety, and household compatibility.",
      icon: ShieldCheck 
    },
    { 
      id: "03", 
      title: "Growth & Video Updates", 
      desc: "Weekly high-definition photo and video progress check-ins as your companion develops.",
      icon: Camera 
    },
    { 
      id: "04", 
      title: "Veterinary Clearance", 
      desc: "Final 10-point examination, core vaccinations, deworming, microchip, and DVM health certificate.",
      icon: Stethoscope 
    },
    { 
      id: "05", 
      title: "White-Glove Homecoming", 
      desc: "Personalized in-cabin flight nanny delivery or direct boutique nursery hand-off to your arms.",
      icon: Plane 
    },
  ];

  const standards = [
    { title: "DNA Tested", icon: Microscope, desc: "Parent lines 100% negative for HCM, PKD & PRA." },
    { title: "TICA Registered", icon: Award, desc: "Certified purebred Munchkin pedigrees and lineage papers." },
    { title: "Home Socialized", icon: Home, desc: "Raised underfoot with children, sensory play, and household sounds." },
    { title: "10-Year Warranty", icon: ShieldCheck, desc: "Comprehensive congenital and genetic health protection plan." },
    { title: "Holistic Nutrition", icon: Leaf, desc: "Species-appropriate diet, supplements, and probiotic care." },
  ];

  return (
    <section className="bg-[#fafaf8] py-16 md:py-24 overflow-hidden border-b border-[#e2e6df]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- SECTION HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#eef3ee] border border-[#d2ded5] text-[#0f2d25] mb-3 text-[11px] font-semibold tracking-wide">
              <Sparkles size={12} className="text-[#c5a059]" />
              <span>Structured Adoption Protocol</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-[#0a1412] tracking-tight leading-[1.05]">
              The 5-step <br />
              <span className="text-[#0f2d25] italic font-serif">
                homecoming journey.
              </span>
            </h2>
          </div>
          <p className="text-[#5e6d67] text-xs sm:text-sm font-normal max-w-md leading-relaxed">
            Our transparent, milestone-driven placement protocol ensures your companion arrives healthy, emotionally secure, and perfectly prepared for your family.
          </p>
        </div>

        {/* --- STEP-BY-STEP CARDS (Stripe Layout) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-16">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.id} 
                className="bg-white rounded-2xl p-5 flex flex-col justify-between border border-[#e2e6df] hover:border-[#0f2d25]/50 hover:shadow-sm transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-[#0f2d25] font-mono">
                      {step.id}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-[#eef3ee] flex items-center justify-center text-[#0f2d25] group-hover:bg-[#0f2d25] group-hover:text-white transition-colors">
                      <Icon size={16} />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-[#0a1412] mb-1.5 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#5e6d67] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-[#f4f5f0] flex items-center justify-between text-[11px] font-semibold text-[#7a8883] group-hover:text-[#0f2d25] transition-colors">
                  <span>Phase {step.id}</span>
                  <CheckCircle2 size={13} className="text-[#c5a059]" />
                </div>
              </div>
            );
          })}
        </div>

        {/* --- BREEDER'S PLEDGE ASYMMETRIC EDITORIAL PANEL --- */}
        <div className="grid lg:grid-cols-12 gap-8 items-center bg-[#071511] rounded-3xl p-6 sm:p-10 lg:p-12 text-white relative overflow-hidden border border-[#163e32] shadow-xl mb-12">
          {/* Subtle light glow */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#0f2d25] rounded-full blur-[120px] pointer-events-none opacity-40" />

          <div className="lg:col-span-7 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#c5a059] mb-4 text-[10px] font-bold uppercase tracking-wider border border-white/10">
              <Award size={12} />
              <span>Championship Ethical Breeding Standards</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight leading-tight mb-4">
              Raised with family devotion, <br />
              <span className="text-[#c5a059] font-serif italic">
                never in cages or kennels.
              </span>
            </h2>

            <p className="text-[#a5b5ae] text-xs sm:text-sm font-normal leading-relaxed mb-6 max-w-xl">
              Every Munchkin in our nursery is socialized underfoot with our family from day one. We adhere to the strictest TICA genetic protocols, prioritizing structural soundness, emotional confidence, and affectionate temperament above all else.
            </p>

            <div className="flex flex-wrap gap-3.5">
              <Link
                to="/vetting-process"
                className="px-6 py-3 rounded-full bg-[#c5a059] hover:bg-[#d4af37] text-[#071511] font-semibold text-xs tracking-wide transition-all shadow-sm active:scale-95 inline-flex items-center gap-2"
              >
                <span>Full Vetting Protocols</span>
                <ArrowRight size={13} />
              </Link>

              <Link
                to="/health"
                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold text-xs tracking-wide border border-white/20 transition-all active:scale-95 inline-flex items-center gap-2"
              >
                <span>10-Year Health Warranty</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 z-10 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#163e32] shadow-lg group">
              <img 
                src="https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&q=80&w=1200" 
                alt="Affectionate pedigree companion"
                className="w-full h-[320px] sm:h-[360px] object-cover group-hover:scale-103 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071511]/90 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#c5a059] block mb-1">
                  Breeder's Credo
                </span>
                <p className="text-base font-bold italic">
                  "Health, structural soundness & affectionate temperament first, always."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- FIVE STANDARDS STRIP --- */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e2e6df] shadow-xs">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {standards.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="flex flex-col">
                  <div className="w-9 h-9 rounded-lg bg-[#eef3ee] flex items-center justify-center text-[#0f2d25] mb-2.5">
                    <Icon size={18} />
                  </div>
                  <h4 className="text-xs font-bold text-[#0a1412] mb-1">
                    {s.title}
                  </h4>
                  <p className="text-[11px] text-[#5e6d67] leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ProcessSection;
