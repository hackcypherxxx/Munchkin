import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Stethoscope, 
  Home, 
  Plane, 
  Award, 
  MessageSquare, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  BadgeCheck
} from 'lucide-react';

const TrustPillars = () => {
  const pillars = [
    {
      icon: Stethoscope,
      title: "10-Point Veterinary Examination",
      desc: "Every companion undergoes an extensive physical assessment of cardiovascular, respiratory, ophthalmologic, and skeletal integrity prior to placement.",
      tag: "100% Medically Cleared",
      proof: "Signed DVM Health Certificate"
    },
    {
      icon: Home,
      title: "Ethical Family Socialization",
      desc: "Zero cages. Companions are raised underfoot with daily neurological stimulation, sensory play, household sounds, and gentle family handling.",
      tag: "Zero-Cage Policy",
      proof: "Home Socialized Underfoot"
    },
    {
      icon: ShieldCheck,
      title: "10-Year Health Warranty",
      desc: "Comprehensive protection covering hereditary and congenital conditions, backed by complete parentage testing and certified veterinary records.",
      tag: "Certified Protection",
      proof: "Genetic & Congenital Guarantee"
    },
    {
      icon: Plane,
      title: "In-Cabin Flight Nanny Delivery",
      desc: "Hand-carried inside the passenger cabin directly to your nearest commercial airport. Companions never travel in cargo holds.",
      tag: "Stress-Free Transit",
      proof: "Direct Airport Hand-Off"
    },
    {
      icon: MessageSquare,
      title: "Direct Nursery Concierge",
      desc: "Direct communication with the breeder via phone and WhatsApp, featuring weekly HD progress videos and milestone updates.",
      tag: "Adopter Advisory",
      proof: "Weekly Growth & Video Updates"
    },
    {
      icon: Award,
      title: "Official TICA Purebred Lineage",
      desc: "Registered pedigrees adhering strictly to international breed standards, verified through certified generation documentation.",
      tag: "TICA Cattery #104829",
      proof: "Official Pedigree Papers"
    }
  ];

  return (
    <section className="bg-white py-16 md:py-24 border-b border-[#e2e6df]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#eef3ee] border border-[#d2ded5] text-[#0f2d25] mb-3 text-[11px] font-semibold tracking-wide">
            <Sparkles size={12} className="text-[#c5a059]" />
            <span>The Royal Ethical Charter</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-[#0a1412] tracking-tight leading-[1.05] mb-4">
            Our ethical placement <br />
            <span className="text-[#0f2d25] italic font-serif">
              & health commitments.
            </span>
          </h2>
          <p className="text-[#5e6d67] text-sm sm:text-base font-normal max-w-2xl mx-auto leading-relaxed">
            We hold ourselves to the highest standards of genetic screening, structural health, and transparent communication so your companion arrives thriving.
          </p>
        </div>

        {/* PILLARS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#fafaf8] border border-[#e2e6df] hover:border-[#0f2d25]/50 p-6 sm:p-7 rounded-2xl transition-all duration-300 hover:shadow-sm flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-[#eef3ee] border border-[#d2ded5] flex items-center justify-center text-[#0f2d25] shadow-xs group-hover:bg-[#0f2d25] group-hover:text-white transition-colors">
                      <Icon size={20} />
                    </div>
                    <span className="text-[10px] font-semibold tracking-wide text-[#0f2d25] bg-[#eef3ee] px-2.5 py-1 rounded-full border border-[#d2ded5]">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0a1412] mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5e6d67] font-normal leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3.5 border-t border-[#e2e6df] flex items-center gap-1.5 text-[11px] font-semibold text-[#0f2d25]">
                  <CheckCircle2 size={13} className="text-[#c5a059]" />
                  <span>{item.proof}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CALL TO ACTION BANNER */}
        <div className="bg-[#071511] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden border border-[#163e32] shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl z-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#c5a059] block mb-2">
              Have Questions Before Applying?
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2.5">
              Speak directly with our nursery team.
            </h3>
            <p className="text-[#a5b5ae] text-xs sm:text-sm font-normal leading-relaxed">
              We are delighted to share live video walk-throughs, answer health questions, and coordinate your private flight nanny arrangements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3.5 z-10 shrink-0">
            <Link
              to="/contact"
              className="px-6 py-3 rounded-full bg-[#c5a059] hover:bg-[#d4af37] text-[#071511] font-semibold text-xs tracking-wide transition-all shadow-sm active:scale-95 inline-flex items-center gap-2"
            >
              <span>Contact Concierge</span>
              <ArrowRight size={14} />
            </Link>

            <Link
              to="/vetting-process"
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold text-xs tracking-wide border border-white/20 transition-all active:scale-95"
            >
              <span>Vetting Protocols</span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default TrustPillars;

