import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
// Using React Icons for Socials
import { FaFacebookF, FaEnvelope } from 'react-icons/fa6';
import { 
  ShieldCheck, 
  Award, 
  Microscope, 
  Fingerprint, 
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';

const AboutBreeder = () => {
  const values = [
    {
      icon: <ShieldCheck size={24} />,
      title: "Health Supremacy",
      desc: "Every lineage is DNA-tested for HCM, PKD, and genetic diversity before breeding is even considered."
    },
    {
      icon: <Fingerprint size={24} />,
      title: "Ethical Standards",
      desc: "Our cats are family first. We strictly limit litters per year to ensure the queen's health and kitten socialization."
    },
    {
      icon: <Microscope size={24} />,
      title: "Nursery Tech",
      desc: "We utilize medical-grade air filtration and 24/7 climate monitoring in our dedicated nursery wing."
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      
      {/* --- HERO: THE PHILOSOPHY --- */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-40 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-12 h-[1px] bg-zinc-300" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">Professional Breeder</span>
          </motion.div>
          
          <h1 className="text-6xl md:text-[110px] font-black text-zinc-950 tracking-tighter leading-[0.85] mb-12">
            Raising <span className="italic text-zinc-300">Excellence.</span><br />
            Defining <span className="text-green-600">Trust.</span>
          </h1>

          <div className="grid md:grid-cols-2 gap-16 mt-24 border-t border-zinc-100 pt-16">
            <p className="text-2xl font-black text-zinc-900 tracking-tight leading-tight italic">
              "We don't just breed Munchkins; we curate lifelong companions through rigorous health protocols."
            </p>
            <div className="space-y-6">
              <p className="text-zinc-500 font-medium leading-relaxed">
                Our journey began with a simple observation: the world needed a breeder who combined the precision of medical science with the warmth of a loving home. Today, our nursery is recognized for producing standard Munchkin and Minuet kittens that are as healthy as they are beautiful.
              </p>
              <Link to="/contact" className="inline-flex items-center gap-2 text-zinc-950 hover:text-green-600 transition-colors group">
                <span className="text-[11px] font-black uppercase tracking-widest">Connect with our Concierge</span>
                <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- REPUTATION BAR --- */}
      <div className="bg-zinc-50 border-y border-zinc-100 py-10 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-8">
            {['Registered TICA Nursery', 'USDA Licensed Transport', '2-Year Health Warranty'].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                    <ShieldAlert className="text-green-600" size={18} />
                    <span className="text-[11px] font-black uppercase tracking-widest text-zinc-900">{text}</span>
                </div>
            ))}
        </div>
      </div>

      {/* --- SANCTUARY IMAGE --- */}
      <section className="px-6 py-32">
        <div className="max-w-7xl mx-auto h-[60vh] md:h-[80vh] rounded-[80px] overflow-hidden relative group">
          <img 
            src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
            alt="Nursery Headquarters"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent" />
          <div className="absolute bottom-12 left-12">
            <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.4em] mb-2">Our Sanctuary</p>
            <h3 className="text-white text-3xl font-black tracking-tighter">Private Feline Nursery</h3>
          </div>
        </div>
      </section>

      {/* --- PILLARS OF EXCELLENCE --- */}
      <section className="bg-zinc-950 py-40 px-6 overflow-hidden relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-3 gap-12 md:gap-24">
            {values.map((val, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="w-16 h-16 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-center text-green-500">
                  {val.icon}
                </div>
                <h4 className="text-2xl font-black text-white tracking-tight italic">{val.title}</h4>
                <p className="text-zinc-500 font-medium leading-relaxed">
                  {val.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-green-600/5 blur-[150px]" />
      </section>

      {/* --- THE VERIFICATION SECTION --- */}
      <section className="py-40 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-5xl font-black text-zinc-950 tracking-tighter mb-8 leading-none">
              A Legacy of <br /><span className="text-green-600 italic">Vetted Heritage.</span>
            </h2>
            <p className="text-zinc-500 text-lg font-medium mb-12">
              We maintain active memberships in major feline associations, ensuring our breeding program adheres to the highest international standards.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-8">
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Registered</p>
                <p className="text-xl font-black text-zinc-950 tracking-tighter">TICA / CFA</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Status</p>
                <p className="text-xl font-black text-zinc-950 tracking-tighter italic text-green-600">Active Member</p>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-[450px] aspect-square bg-zinc-50 rounded-[80px] p-12 flex flex-col justify-between border border-zinc-100">
            <Award className="text-green-600" size={48} />
            <div className="space-y-4">
              <p className="text-3xl font-black text-zinc-950 italic tracking-tight leading-tight">"The gold standard for Munchkin breeding excellence."</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">— Breeder's Association 2025</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- THE CONTACT INVITATION --- */}
      <section className="bg-zinc-50 py-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-zinc-200 mb-10 shadow-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">Nursery Inquiries Open</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-zinc-950 tracking-tighter mb-12">
            Let's start your <br /><span className="text-green-600 italic">Munchkin journey.</span>
          </h2>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link 
              to="/contact" 
              className="px-12 py-6 bg-zinc-950 text-white rounded-[24px] font-black text-[11px] uppercase tracking-widest hover:bg-green-600 transition-all shadow-xl shadow-zinc-200"
            >
              Contact Us Today
            </Link>
            
            <div className="flex items-center gap-4">
                <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-14 h-14 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-950 transition-all"
                >
                    <FaFacebookF size={18} />
                </a>
                <Link 
                    to="/contact"
                    className="w-14 h-14 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-green-600 transition-all"
                >
                    <FaEnvelope size={18} />
                </Link>
            </div>
          </div>
          
          <p className="mt-12 text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">
            Join 5,000+ Munchkin Lovers on Facebook
          </p>
        </div>
      </section>

    </div>
  );
};

export default AboutBreeder;