import React from 'react';
import { Link } from 'react-router-dom'; // ✅ added
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
  Camera 
} from 'lucide-react';

const ProcessSection = () => {
  const steps = [
    { title: "Personal Inquiry", icon: <MessageCircle size={20} />, id: 1 },
    { title: "Matching & Reservation", icon: <Heart size={20} />, id: 2 },
    { title: "Growth & Health Updates", icon: <Camera size={20} />, id: 3 },
    { title: "Final Health Clearance", icon: <Stethoscope size={20} />, id: 4 },
    { title: "Welcome Home", icon: <Home size={20} />, id: 5 },
  ];

  const standards = [
    { title: "DNA Tested", icon: <Microscope />, desc: "All parents screened for genetic health." },
    { title: "TICA Registered", icon: <Award />, desc: "Adhering to strict pedigree standards." },
    { title: "Home Raised", icon: <Home />, desc: "Socialized in a loving family environment." },
    { title: "Health Guarantee", icon: <ShieldCheck />, desc: "Comprehensive 2-year protection plan." },
    { title: "Natural Diet", icon: <Leaf />, desc: "Premium nutrition for optimal development." },
  ];

  return (
    <section className="bg-white py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- PART 1: THE ADOPTION JOURNEY --- */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-zinc-950 tracking-tighter mb-4">The Adoption Journey</h2>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] md:text-xs">Five steps to bringing your Munchkin soulmate home</p>
        </div>

        <div className="relative mb-32 px-4 md:px-0">
          <div className="hidden lg:block absolute top-[28px] left-0 w-full h-[1px] bg-zinc-200 z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-y-12 gap-x-8 relative z-10">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center text-center group">
                <div className="w-14 h-14 rounded-full bg-white border-2 border-zinc-100 flex items-center justify-center mb-6 group-hover:border-green-600 group-hover:text-green-600 transition-all shadow-sm relative">
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-600 text-white rounded-full text-[10px] font-black flex items-center justify-center border-2 border-white">
                    {step.id}
                  </div>
                  {step.icon}
                </div>
                <h3 className="text-sm font-black text-zinc-900 leading-tight mb-2">{step.title}</h3>
                <div className="h-1 w-0 group-hover:w-8 bg-green-600 transition-all duration-300 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* --- PART 2: THE BREEDER'S PROMISE --- */}
        <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center border-t border-zinc-100 pt-24 md:pt-32">
          
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-500 mb-8 border border-zinc-200">
              <Sparkles size={14} className="text-green-600" />
              <span className="text-[10px] font-black uppercase tracking-widest">Ethical Breeding Excellence</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-zinc-950 tracking-tighter leading-[0.85] mb-8">
              Raised with love, <br />
              <span className="text-zinc-300">not in a kennel.</span>
            </h2>

            <p className="text-zinc-500 text-lg font-medium mb-10 leading-relaxed">
              Every kitten in my home is treated as a family member from day one. I focus on quality over quantity, ensuring each Munchkin is healthy, confident, and perfectly socialized for their forever home.
            </p>

            <div className="flex flex-wrap gap-4">

              {/* ✅ VIEW PROCESS */}
              <Link
                to="/vetting-process"
                className="px-8 py-4 rounded-full bg-zinc-950 text-white font-black text-xs hover:bg-green-600 transition-all uppercase tracking-widest shadow-xl shadow-zinc-200 active:scale-95"
              >
                View My Process
              </Link>

              {/* ✅ CONTACT */}
              <Link
                to="/contact"
                className="px-8 py-4 rounded-full border-2 border-zinc-200 text-zinc-900 font-black text-xs hover:bg-zinc-50 transition-all uppercase tracking-widest active:scale-95"
              >
                Contact Me
              </Link>

            </div>
          </div>

          <div className="relative rounded-[48px] overflow-hidden group shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=1200" 
                alt="Breeder holding Munchkin"
                className="w-full h-[500px] object-cover transition-transform duration-[2s] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10 text-white">
                <p className="text-xs font-black uppercase tracking-[0.2em] opacity-70 mb-2">My Philosophy</p>
                <p className="text-2xl font-black italic">"Health first, always."</p>
              </div>
          </div>
        </div>

        {/* --- PART 3: THE FIVE PILLARS STRIP --- */}
        <div className="mt-24 md:mt-32 bg-zinc-50 rounded-[48px] p-8 md:p-16 border border-zinc-100">
          <p className="text-center text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-12">What sets my standards apart</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
            {standards.map((item) => (
              <div key={item.title} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-zinc-900 mb-6 shadow-sm border border-zinc-100 group-hover:scale-110 transition-transform">
                  {React.cloneElement(item.icon, { size: 20, strokeWidth: 2.5 })}
                </div>
                <p className="text-[11px] font-black text-zinc-900 uppercase tracking-widest mb-2">{item.title}</p>
                <p className="text-[10px] font-bold text-zinc-400 leading-tight max-w-[140px] uppercase tracking-tighter">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ProcessSection;