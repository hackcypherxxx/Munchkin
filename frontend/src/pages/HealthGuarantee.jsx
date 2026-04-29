import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Stethoscope, 
  FileText, 
  Dna, 
  Heart, 
  ShieldAlert,
  ChevronRight,
  ClipboardCheck,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HealthGuarantee = () => {
  const guarantees = [
    {
      title: "72-Hour General Health",
      desc: "Covers immediate viral or bacterial illnesses. We guarantee your kitten is healthy upon arrival.",
      icon: <Stethoscope size={24} className="text-green-600" />
    },
    {
      title: "2-Year Genetic Warranty",
      desc: "Full coverage for any hereditary or congenital life-threatening conditions (including HCM and PKD).",
      icon: <Dna size={24} className="text-green-600" />
    },
    {
      title: "Lifetime Support",
      desc: "Direct access to our expertise for the entire life of your cat. We are your partner in their care.",
      icon: <Heart size={24} className="text-green-600" />
    }
  ];

  return (
    <div className="bg-white min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- SECTION 1: THE VOW (HEADER) --- */}
        <div className="max-w-4xl mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-zinc-50 border border-zinc-100 mb-8"
          >
            <ShieldCheck size={14} className="text-green-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Industry-Leading Warranty</span>
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-black text-zinc-950 tracking-tighter leading-[0.9] mb-10">
            Our Health <br /><span className="text-green-600 italic">Guarantee.</span>
          </h1>
          <p className="text-zinc-500 text-xl font-medium leading-relaxed max-w-2xl">
            We don't just sell kittens; we place family members. Our rigorous testing and socialization protocols allow us to provide one of the most comprehensive guarantees in the industry.
          </p>
        </div>

        {/* --- SECTION 2: CORE COVERAGE CARDS --- */}
        <div className="grid lg:grid-cols-3 gap-8 mb-32">
          {guarantees.map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -8 }}
              className="p-10 rounded-[48px] bg-zinc-50 border border-zinc-100 flex flex-col"
            >
              <div className="w-16 h-16 rounded-[24px] bg-white shadow-sm flex items-center justify-center mb-8 border border-zinc-50">
                {item.icon}
              </div>
              <h3 className="text-2xl font-black tracking-tight text-zinc-950 mb-4">{item.title}</h3>
              <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-8 flex-1">
                {item.desc}
              </p>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-green-600">
                Full Terms <ChevronRight size={14} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- SECTION 3: THE VETTING PROTOCOL (DARK BENTO) --- */}
        <div className="bg-zinc-950 rounded-[64px] p-10 md:p-20 text-white relative overflow-hidden mb-32">
          <div className="relative z-10 grid lg:grid-cols-2 gap-20">
            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-8">The Vetting <br /><span className="text-zinc-500">Protocol.</span></h2>
              <p className="text-zinc-400 text-lg mb-12">Every kitten undergoes a multi-stage medical clearance before departure.</p>
              
              <div className="space-y-10">
                {[
                  { label: "Genetic Testing", val: "Optimal Selection™ DNA Panel" },
                  { label: "Vaccinations", val: "FVRCP Core Series Complete" },
                  { label: "Screening", val: "Echocardiogram (Parents) & Vet Exam" },
                  { label: "Certification", val: "USDA/State Health Certificate" }
                ].map((stat, idx) => (
                  <div key={idx} className="border-l-2 border-green-600 pl-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2">{stat.label}</p>
                    <p className="text-xl font-bold tracking-tight">{stat.val}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[48px] p-10 flex flex-col justify-between">
              <div>
                <ClipboardCheck className="text-green-500 mb-6" size={40} />
                <h4 className="text-2xl font-black mb-4">Adopter Requirements</h4>
                <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                  To keep the guarantee valid, we require a follow-up exam with your licensed veterinarian within <span className="text-white font-bold">72 hours</span> of receiving your kitten.
                </p>
              </div>
              <ul className="space-y-4">
                {["No Outdoors Policy", "Mandatory Indoor Care", "Strict No-Declaw Policy"].map(item => (
                  <li key={item} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-300">
                    <CheckCircle2 size={14} className="text-green-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Subtle Branding */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-green-600/5 blur-[120px] pointer-events-none" />
        </div>

        {/* --- SECTION 4: THE "FINE PRINT" (LEGITIMACY SECTION) --- */}
        <div className="max-w-4xl mx-auto border border-zinc-100 rounded-[40px] p-8 md:p-16 flex flex-col md:flex-row gap-12 items-center">
          <div className="w-24 h-24 rounded-full bg-zinc-50 flex items-center justify-center flex-shrink-0">
            <ShieldAlert size={40} className="text-zinc-300" />
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tight mb-4 text-zinc-950">Non-Transferable Terms</h3>
            <p className="text-zinc-500 text-sm leading-relaxed mb-6 font-medium">
              This health guarantee is a contract between MunchkinKittie and the original purchaser. It ensures that should a genetic defect arise, we provide a replacement kitten of equal value or a credit toward a future litter. 
            </p>
            <div className="flex flex-wrap gap-4">
             <Link to="/contact">
              <button className="px-6 py-3 border-2 border-zinc-100 text-zinc-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-50 transition-all">
                Questions? Contact Us
              </button></Link>
            </div>
          </div>
        </div>

        {/* --- FOOTER BADGE --- */}
        <p className="mt-20 text-center text-[10px] font-black text-zinc-300 uppercase tracking-[0.4em]">
          Verified TICA Breeder Standards Compliance 2026
        </p>

      </div>
    </div>
  );
};

export default HealthGuarantee;