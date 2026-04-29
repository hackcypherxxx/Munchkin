import React from 'react';
import { motion } from 'framer-motion';
import { 
  Leaf, 
  Wind, 
  Droplets, 
  Scissors, 
  Home, 
  Utensils, 
  HeartPulse,
  Sun,
  Camera,
  BookOpen
} from 'lucide-react';

const CareGuide = () => {
  const categories = [
    {
      title: "Nutrition & Diet",
      icon: <Utensils className="text-green-600" />,
      items: ["Royal Canin Mother & Babycat", "Fresh Water (Fountain Preferred)", "Limit Treats to 10% Diet"],
      color: "bg-zinc-50"
    },
    {
      title: "Grooming Essentials",
      icon: <Scissors className="text-green-600" />,
      items: ["Soft Bristle Brushing (Weekly)", "Nail Trimming (Every 2 Weeks)", "Ear Cleaning (Monthly)"],
      color: "bg-zinc-50"
    },
    {
      title: "Environment",
      icon: <Home className="text-green-600" />,
      items: ["Vertical Climbing Spaces", "Low-entry Litter Boxes", "Safe 'Zen' Hiding Spots"],
      color: "bg-zinc-50"
    }
  ];

  return (
    <div className="bg-white min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- HEADER --- */}
        <div className="max-w-3xl mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <BookOpen size={14} className="text-zinc-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">The Owner's Handbook</span>
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-black text-zinc-950 tracking-tighter leading-[0.9] mb-8">
            Raising <br /><span className="text-green-600 italic">Excellence.</span>
          </h1>
          <p className="text-zinc-500 text-lg font-medium leading-relaxed">
            Your Munchkin kitten is a masterpiece of breeding. Maintaining their health and happiness requires specific attention to their unique physical structure and energetic personality.
          </p>
        </div>

        {/* --- CORE CARE BENTO GRID --- */}
        <div className="grid md:grid-cols-3 gap-8 mb-32">
          {categories.map((cat, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -8 }}
              className={`p-10 rounded-[48px] ${cat.color} border border-zinc-100 flex flex-col`}
            >
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-8 border border-zinc-50">
                {cat.icon}
              </div>
              <h3 className="text-2xl font-black tracking-tight text-zinc-950 mb-6">{cat.title}</h3>
              <ul className="space-y-4 flex-1">
                {cat.items.map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm font-bold text-zinc-600 leading-tight">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* --- THE "FIRST 48 HOURS" (TIMELINE) --- */}
        <div className="bg-zinc-950 rounded-[64px] p-10 md:p-20 text-white relative overflow-hidden mb-32">
          <div className="relative z-10 max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-12">The Arrival <span className="text-zinc-500 italic">Protocol.</span></h2>
            <div className="space-y-12">
              {[
                { time: "Hour 1", title: "The Sanctuary Room", desc: "Keep your kitten in one small, quiet room with their food, water, and litter. Let them explore this 'home base' first." },
                { time: "Hour 12", title: "Scent Exchange", desc: "Rub a soft cloth on the kitten and place it in the common area. This introduces their scent to the home safely." },
                { time: "Hour 24", title: "Quiet Play", desc: "Introduce interactive wand toys to build trust, but avoid loud noises or large groups of people." },
                { time: "Hour 48", title: "The First Vet Visit", desc: "Complete your health guarantee requirement by visiting your vet for a baseline wellness check." }
              ].map((step, idx) => (
                <div key={idx} className="flex gap-8 group">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-green-600 group-hover:scale-125 transition-transform" />
                    {idx !== 3 && <div className="w-0.5 h-20 bg-zinc-800" />}
                  </div>
                  <div>
                    <p className="text-green-600 font-black text-xs uppercase tracking-widest mb-1">{step.time}</p>
                    <h4 className="text-2xl font-black mb-2">{step.title}</h4>
                    <p className="text-zinc-400 text-sm font-medium leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-green-600/10 to-transparent hidden lg:block" />
        </div>

        {/* --- HEALTH & WELLNESS (TWO COLUMN) --- */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="relative aspect-square rounded-[64px] overflow-hidden bg-zinc-100">
             <img 
               src="https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&q=80&w=800" 
               className="w-full h-full object-cover" 
               alt="Healthy Kitten"
             />
             <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/90 backdrop-blur-md rounded-[32px] border border-white/50">
               <div className="flex items-center gap-3">
                 <HeartPulse className="text-red-500" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-900 leading-tight">
                   Munchkins live 12-15 years with proper spinal care.
                 </p>
               </div>
             </div>
          </div>

          <div className="px-4">
            <h2 className="text-4xl font-black tracking-tighter mb-8 text-zinc-950">Spinal Health <br /><span className="text-zinc-400">& Weight Control.</span></h2>
            <p className="text-zinc-500 text-lg mb-10 leading-relaxed">
              Because of their short legs, keeping your Munchkin at an ideal weight is critical. Excess weight puts unnecessary strain on their spine.
            </p>
            <div className="space-y-6">
              {[
                "Avoid high-impact jumps from tall furniture.",
                "Provide stairs or ramps for bed/sofa access.",
                "Schedule annual 'Senior' bloodwork starting at age 7.",
                "Never allow your Munchkin to become obese."
              ].map(item => (
                <div key={item} className="flex gap-4 p-5 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-green-600 transition-colors">
                  <Leaf size={20} className="text-green-600 flex-shrink-0" />
                  <p className="text-sm font-bold text-zinc-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- PRO-TIP SECTION --- */}
        <div className="p-8 md:p-12 rounded-[48px] border-4 border-zinc-50 flex flex-col md:flex-row gap-10 items-center">
           <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
             <Sun className="text-green-600" size={32} />
           </div>
           <div>
             <h4 className="text-xl font-black text-zinc-950 mb-2 uppercase tracking-tight">The "Short-Leg" Advantage</h4>
             <p className="text-zinc-500 text-sm font-medium leading-relaxed">
               Munchkins are surprisingly fast and agile. However, they lack the "spring" of long-legged cats. Ensure their play environment focuses on speed and floor-level tunnels rather than vertical heights above 4 feet.
             </p>
           </div>
           <button className="md:ml-auto px-8 py-5 bg-zinc-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-green-600 transition-all">
             Contact Consultant
           </button>
        </div>

        {/* --- FOOTNOTE --- */}
        <p className="mt-24 text-center text-[10px] font-black text-zinc-300 uppercase tracking-[0.5em]">
          Evolving Care for an Extraordinary Breed
        </p>

      </div>
    </div>
  );
};

export default CareGuide;