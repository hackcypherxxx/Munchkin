import React from 'react';
import { motion } from 'framer-motion';
import { 
  Dna, 
  Stethoscope, 
  Microscope, 
  ShieldCheck, 
  Activity, 
  Syringe,
  HeartPulse,
  ClipboardCheck,
  Search,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';

const VettingProcess = () => {
  const medicalStages = [
    {
      week: "Week 0-2",
      title: "Neonatal Monitoring",
      desc: "Daily weight tracking and thermal regulation. We ensure early neurological stimulation (ENS) begins during this critical window.",
      icon: <Activity className="text-green-600" />
    },
    {
      week: "Week 4-6",
      title: "First Clinical Screening",
      desc: "Initial physical exam by our licensed veterinarian. We monitor for structural soundess and heart murmurs.",
      icon: <Stethoscope className="text-green-600" />
    },
    {
      week: "Week 8-10",
      title: "Core Immunity Phase",
      desc: "Administration of FVRCP vaccinations and full deworming protocol. Socialization with adult cats begins.",
      icon: <Syringe className="text-green-600" />
    },
    {
      week: "Week 12",
      title: "Final Clearance",
      desc: "Final USDA-standard health certificate issued. Kitten is cleared for travel or local pickup.",
      icon: <ShieldCheck className="text-green-600" />
    }
  ];

  return (
    <div className="bg-white min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- HEADER: THE GOLD STANDARD --- */}
        <div className="max-w-4xl mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-zinc-50 border border-zinc-100 mb-8"
          >
            <Microscope size={14} className="text-green-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Evidence-Based Breeding</span>
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-black text-zinc-950 tracking-tighter leading-[0.9] mb-10">
            Precision <br /><span className="text-green-600 italic">Vetting.</span>
          </h1>
          <p className="text-zinc-500 text-xl font-medium leading-relaxed max-w-2xl">
            Our vetting process is rigorous, transparent, and built on the latest feline pediatric research. We leave nothing to chance.
          </p>
        </div>

        {/* --- DNA & GENETICS SECTION (THE "WHY") --- */}
        <div className="grid lg:grid-cols-2 gap-12 mb-32">
          <div className="p-12 rounded-[64px] bg-zinc-950 text-white flex flex-col justify-center relative overflow-hidden">
            <Dna size={48} className="text-green-500 mb-8" />
            <h2 className="text-4xl font-black tracking-tighter mb-6">Genetic <br />Integrity.</h2>
            <p className="text-zinc-400 text-lg leading-relaxed mb-8">
              Every breeding parent is screened for over 40+ genetic markers, including HCM (Heart) and PKD (Kidneys). If a cat doesn't have a perfect scorecard, they don't enter our program.
            </p>
            <div className="flex gap-4">
              <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest">FeLV/FIV Negative</div>
              <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest">Optimal Selection™ Verified</div>
            </div>
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-600/10 blur-[100px]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { title: "Echocardiograms", desc: "Annual heart scans for all breeding kings and queens." },
              { title: "Pedigree Audit", desc: "Verifying 5 generations of health history via TICA." },
              { title: "Blood Panels", desc: "Bi-annual comprehensive labs for metabolic health." },
              { title: "X-Ray Analysis", desc: "Ensuring spinal health in our Munchkin lineage." }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-[40px] border border-zinc-100 bg-zinc-50/50">
                <Check className="text-green-600 mb-4" size={20} />
                <h4 className="font-black text-zinc-950 mb-2 uppercase tracking-tight">{item.title}</h4>
                <p className="text-xs text-zinc-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* --- THE VETTING TIMELINE --- */}
        <div className="mb-32">
          <h2 className="text-4xl font-black tracking-tighter mb-16 text-center">Developmental <span className="text-zinc-400">Milestones.</span></h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {medicalStages.map((stage, i) => (
              <div key={i} className="group relative">
                <div className="p-8 rounded-[48px] bg-white border border-zinc-100 hover:border-green-600 transition-all duration-500 h-full shadow-sm hover:shadow-xl hover:shadow-zinc-200">
                  <p className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em] mb-6">{stage.week}</p>
                  <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center mb-6 group-hover:bg-green-50 transition-colors">
                    {stage.icon}
                  </div>
                  <h4 className="text-xl font-black text-zinc-950 mb-4">{stage.title}</h4>
                  <p className="text-zinc-500 text-sm font-medium leading-relaxed">{stage.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- THE "VET-READY" CHECKLIST --- */}
        <div className="bg-zinc-50 rounded-[64px] p-10 md:p-20 border border-zinc-100">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="lg:w-1/3">
              <div className="w-16 h-16 rounded-[24px] bg-zinc-950 flex items-center justify-center mb-8">
                <ClipboardCheck className="text-white" size={28} />
              </div>
              <h2 className="text-4xl font-black tracking-tighter mb-6">The Departure <br />Dossier.</h2>
              <p className="text-zinc-500 font-medium leading-relaxed">
                Every kitten leaves with a physical health folder containing their entire medical history from birth to departure.
              </p>
            </div>

            <div className="lg:w-2/3 grid sm:grid-cols-2 gap-8 w-full">
              {[
                "State Certified Health Certificate",
                "Full Vaccination Record (Signed by Vet)",
                "Microchip Registration Papers",
                "Deworming Schedule History",
                "FIV/FeLV Testing Results",
                "TICA Registration Ownership Transfer"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 py-4 border-b border-zinc-200">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Check size={14} className="text-green-700" />
                  </div>
                  <span className="text-sm font-bold text-zinc-700 uppercase tracking-tight">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- CTA / FOOTER --- */}
        <div className="mt-32 flex flex-col items-center text-center">
          <HeartPulse size={48} className="text-zinc-200 mb-8" />
          <h3 className="text-3xl font-black tracking-tighter mb-6 italic">Health is our primary heritage.</h3>
          <p className="text-zinc-400 text-sm max-w-xl mb-10">
            We partner with the <span className="text-zinc-950 font-bold">Portland Feline Specialty Clinic</span> to ensure all echocardiograms and specialized screenings meet board-certified standards.
          </p>
          <Link to="/contact">
          <button className="px-12 py-5 bg-zinc-950 text-white rounded-[24px] font-black text-[10px] uppercase tracking-widest hover:bg-green-600 transition-all shadow-2xl">
            Inquire About Our Protocols
          </button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default VettingProcess;